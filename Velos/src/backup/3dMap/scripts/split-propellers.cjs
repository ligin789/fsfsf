#!/usr/bin/env node
// Split the merged "Propellers" mesh in public/Cesium_Air.glb into 8 separate
// sub-meshes/nodes (Propeller_0..Propeller_7) so each rotor can rotate
// individually around its own axis. Writes public/Cesium_Air_split.glb.

const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "../public/Cesium_Air.glb");
const DST = path.resolve(__dirname, "../public/Cesium_Air_split.glb");

const GLB_MAGIC = 0x46546c67;
const JSON_CHUNK = 0x4e4f534a;
const BIN_CHUNK = 0x004e4942;

const src = fs.readFileSync(SRC);
if (src.readUInt32LE(0) !== GLB_MAGIC) throw new Error("not a glb");
const jsonLen = src.readUInt32LE(12);
const jsonType = src.readUInt32LE(16);
if (jsonType !== JSON_CHUNK) throw new Error("expected JSON chunk");
const json = JSON.parse(src.slice(20, 20 + jsonLen).toString("utf-8"));
const binHeaderStart = 20 + jsonLen;
const binLen = src.readUInt32LE(binHeaderStart);
const binType = src.readUInt32LE(binHeaderStart + 4);
if (binType !== BIN_CHUNK) throw new Error("expected BIN chunk");
const bin = src.slice(binHeaderStart + 8, binHeaderStart + 8 + binLen);

const propNodeIdx = json.nodes.findIndex((n) => n.name === "Propellers");
if (propNodeIdx < 0) throw new Error("no Propellers node");
const propNode = json.nodes[propNodeIdx];
const propMesh = json.meshes[propNode.mesh];
const propPrim = propMesh.primitives[0];

const posAcc = json.accessors[propPrim.attributes.POSITION];
const normAcc = json.accessors[propPrim.attributes.NORMAL];
const texAcc = json.accessors[propPrim.attributes.TEXCOORD_0];
const idxAcc = json.accessors[propPrim.indices];

const posBV = json.bufferViews[posAcc.bufferView];
const idxBV = json.bufferViews[idxAcc.bufferView];

const VERTS_PER_PROP = 2206;
const INDICES_PER_PROP = 7008;
const TOTAL_VERTS = posAcc.count;
const TOTAL_INDICES = idxAcc.count;
if (TOTAL_VERTS !== VERTS_PER_PROP * 8) throw new Error("unexpected vertex count");
if (TOTAL_INDICES !== INDICES_PER_PROP * 8) throw new Error("unexpected index count");

// --- Compute 8 cluster centers in Propellers mesh-local space ---
const verts = [];
{
  const o = (posBV.byteOffset || 0) + (posAcc.byteOffset || 0);
  for (let i = 0; i < TOTAL_VERTS; i++) {
    const off = o + i * 12;
    verts.push([bin.readFloatLE(off), bin.readFloatLE(off + 4), bin.readFloatLE(off + 8)]);
  }
}
const centers = [];
for (let c = 0; c < 8; c++) {
  let sx = 0, sy = 0, sz = 0;
  for (let i = 0; i < VERTS_PER_PROP; i++) {
    const v = verts[c * VERTS_PER_PROP + i];
    sx += v[0]; sy += v[1]; sz += v[2];
  }
  centers.push([sx / VERTS_PER_PROP, sy / VERTS_PER_PROP, sz / VERTS_PER_PROP]);
}

// --- Build new binary chunks: 8 re-centered POSITION buffers + 8 re-based index buffers ---
const newPosBufs = [];
for (let c = 0; c < 8; c++) {
  const out = Buffer.alloc(VERTS_PER_PROP * 12);
  const [cx, cy, cz] = centers[c];
  for (let i = 0; i < VERTS_PER_PROP; i++) {
    const v = verts[c * VERTS_PER_PROP + i];
    out.writeFloatLE(v[0] - cx, i * 12);
    out.writeFloatLE(v[1] - cy, i * 12 + 4);
    out.writeFloatLE(v[2] - cz, i * 12 + 8);
  }
  newPosBufs.push(out);
}

const newIdxBufs = [];
{
  const srcStart = idxBV.byteOffset || 0;
  for (let c = 0; c < 8; c++) {
    const out = Buffer.alloc(INDICES_PER_PROP * 2);
    const base = c * VERTS_PER_PROP;
    const srcOff = srcStart + c * INDICES_PER_PROP * 2;
    for (let i = 0; i < INDICES_PER_PROP; i++) {
      const v = bin.readUInt16LE(srcOff + i * 2);
      out.writeUInt16LE(v - base, i * 2);
    }
    newIdxBufs.push(out);
  }
}

// --- Compute per-prop POSITION min/max ---
const perPropMinMax = [];
for (let c = 0; c < 8; c++) {
  let mn = [Infinity, Infinity, Infinity];
  let mx = [-Infinity, -Infinity, -Infinity];
  const buf = newPosBufs[c];
  for (let i = 0; i < VERTS_PER_PROP; i++) {
    const x = buf.readFloatLE(i * 12);
    const y = buf.readFloatLE(i * 12 + 4);
    const z = buf.readFloatLE(i * 12 + 8);
    if (x < mn[0]) mn[0] = x; if (y < mn[1]) mn[1] = y; if (z < mn[2]) mn[2] = z;
    if (x > mx[0]) mx[0] = x; if (y > mx[1]) mx[1] = y; if (z > mx[2]) mx[2] = z;
  }
  perPropMinMax.push({ min: mn, max: mx });
}

// --- Append new data to bin ---
const appended = Buffer.concat([...newPosBufs, ...newIdxBufs]);
let newBin = Buffer.concat([bin, appended]);
// Pad bin to 4 bytes
while (newBin.length % 4 !== 0) newBin = Buffer.concat([newBin, Buffer.from([0])]);

// --- Create new bufferViews (indices into json.bufferViews) ---
let cursor = bin.length;
const newPosBVIndices = [];
for (let c = 0; c < 8; c++) {
  json.bufferViews.push({
    buffer: 0,
    byteOffset: cursor,
    byteLength: newPosBufs[c].length,
    target: 34962,
  });
  newPosBVIndices.push(json.bufferViews.length - 1);
  cursor += newPosBufs[c].length;
}
const newIdxBVIndices = [];
for (let c = 0; c < 8; c++) {
  json.bufferViews.push({
    buffer: 0,
    byteOffset: cursor,
    byteLength: newIdxBufs[c].length,
    target: 34963,
  });
  newIdxBVIndices.push(json.bufferViews.length - 1);
  cursor += newIdxBufs[c].length;
}

// Update the single buffer length in json
json.buffers[0].byteLength = newBin.length;

// --- Create accessors for new POSITION, indices, and sub-range NORMAL / TEXCOORD ---
const newPosAccIndices = [];
const newNormAccIndices = [];
const newTexAccIndices = [];
const newIdxAccIndices = [];
for (let c = 0; c < 8; c++) {
  const posIdx = json.accessors.length;
  json.accessors.push({
    bufferView: newPosBVIndices[c],
    componentType: 5126,
    count: VERTS_PER_PROP,
    type: "VEC3",
    min: perPropMinMax[c].min,
    max: perPropMinMax[c].max,
  });
  newPosAccIndices.push(posIdx);

  const normIdx = json.accessors.length;
  json.accessors.push({
    bufferView: normAcc.bufferView,
    byteOffset: (normAcc.byteOffset || 0) + c * VERTS_PER_PROP * 12,
    componentType: 5126,
    count: VERTS_PER_PROP,
    type: "VEC3",
  });
  newNormAccIndices.push(normIdx);

  const texIdx = json.accessors.length;
  json.accessors.push({
    bufferView: texAcc.bufferView,
    byteOffset: (texAcc.byteOffset || 0) + c * VERTS_PER_PROP * 8,
    componentType: 5126,
    count: VERTS_PER_PROP,
    type: "VEC2",
  });
  newTexAccIndices.push(texIdx);

  const idxIdx = json.accessors.length;
  json.accessors.push({
    bufferView: newIdxBVIndices[c],
    componentType: 5123,
    count: INDICES_PER_PROP,
    type: "SCALAR",
  });
  newIdxAccIndices.push(idxIdx);
}

// --- Create 8 new meshes ---
const newMeshIndices = [];
for (let c = 0; c < 8; c++) {
  json.meshes.push({
    name: `Propeller_${c}_mesh`,
    primitives: [
      {
        attributes: {
          POSITION: newPosAccIndices[c],
          NORMAL: newNormAccIndices[c],
          TEXCOORD_0: newTexAccIndices[c],
        },
        indices: newIdxAccIndices[c],
        material: propPrim.material,
        mode: propPrim.mode ?? 4,
      },
    ],
  });
  newMeshIndices.push(json.meshes.length - 1);
}

// --- Create 8 new nodes, each translated to its cluster center ---
const newNodeIndices = [];
for (let c = 0; c < 8; c++) {
  json.nodes.push({
    name: `Propeller_${c}`,
    mesh: newMeshIndices[c],
    translation: centers[c],
  });
  newNodeIndices.push(json.nodes.length - 1);
}

// --- Reparent: clear Propellers mesh, attach 8 new nodes as children ---
delete propNode.mesh;
propNode.children = newNodeIndices;

// --- Rebuild GLB ---
let newJson = JSON.stringify(json);
while (newJson.length % 4 !== 0) newJson += " ";
const jsonBuf = Buffer.from(newJson, "utf-8");

const header = Buffer.alloc(12);
const jsonHeader = Buffer.alloc(8);
const binHeader = Buffer.alloc(8);
jsonHeader.writeUInt32LE(jsonBuf.length, 0);
jsonHeader.writeUInt32LE(JSON_CHUNK, 4);
binHeader.writeUInt32LE(newBin.length, 0);
binHeader.writeUInt32LE(BIN_CHUNK, 4);
const total = 12 + 8 + jsonBuf.length + 8 + newBin.length;
header.writeUInt32LE(GLB_MAGIC, 0);
header.writeUInt32LE(2, 4); // version
header.writeUInt32LE(total, 8);

fs.writeFileSync(DST, Buffer.concat([header, jsonHeader, jsonBuf, binHeader, newBin]));
console.log(`wrote ${DST}`);
console.log(`centers:`);
centers.forEach((c, i) =>
  console.log(`  Propeller_${i}: [${c.map((n) => n.toFixed(3)).join(", ")}]`)
);
