import { motion } from 'framer-motion';

/**
 * Full-cover animated loading overlay for the 3D map.
 * Orbiting rings + pulsing globe + animated label, on a deep-space gradient.
 */
export default function ThreeDMapLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 50% 38%, #102a4c 0%, #0a1426 55%, #050a14 100%)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* faint starfield shimmer */}
      <motion.div
        animate={{ opacity: [0.25, 0.5, 0.25] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(1px 1px at 20% 30%, #fff 50%, transparent), radial-gradient(1px 1px at 70% 60%, #cbd5e1 50%, transparent), radial-gradient(1px 1px at 40% 80%, #93c5fd 50%, transparent), radial-gradient(1px 1px at 85% 25%, #fff 50%, transparent)',
          backgroundSize: '100% 100%',
          opacity: 0.35,
        }}
      />

      {/* orbiting rings + globe */}
      <div style={{ position: 'relative', width: 132, height: 132, marginBottom: 30 }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(96,165,250,0.22)',
            borderTopColor: '#60A5FA',
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 3.6, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 16,
            borderRadius: '50%',
            border: '2px solid rgba(47,123,255,0.16)',
            borderBottomColor: '#2f7bff',
          }}
        />
        {/* orbiting dot */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <span
            style={{
              position: 'absolute',
              top: -4,
              left: '50%',
              width: 10,
              height: 10,
              marginLeft: -5,
              borderRadius: '50%',
              background: '#93c5fd',
              boxShadow: '0 0 12px #60A5FA',
            }}
          />
        </motion.div>
        {/* pulsing globe core */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], boxShadow: [
            '0 0 22px rgba(47,123,255,0.45)',
            '0 0 34px rgba(47,123,255,0.75)',
            '0 0 22px rgba(47,123,255,0.45)',
          ] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 40,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #5b9bff 0%, #2f7bff 45%, #1e3a8a 100%)',
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: 0.4 }}>3D Map is loading</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: 'easeInOut' }}
            style={{ fontSize: 19, fontWeight: 800 }}
          >
            .
          </motion.span>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12.5, color: '#94A3B8' }}>
        Building terrain, city buildings & flight paths…
      </div>

      {/* progress shimmer bar */}
      <div
        style={{
          marginTop: 22,
          width: 220,
          height: 4,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          animate={{ x: ['-60%', '160%'] }}
          transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
          style={{
            width: '40%',
            height: '100%',
            borderRadius: 999,
            background: 'linear-gradient(90deg, transparent, #60A5FA, transparent)',
          }}
        />
      </div>
    </motion.div>
  );
}
