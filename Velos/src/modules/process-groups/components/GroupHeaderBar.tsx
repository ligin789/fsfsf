/**
 * Group-level header bar. Surfaces every group-level field from the JSON:
 * name, key, execution_model, version, purpose, domain, operator and metadata.
 */
import type { ProcessGroup } from '../store/types';

interface GroupHeaderBarProps {
  group: ProcessGroup;
  height: number;
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="pg-meta-chip">{children}</span>;
}

export default function GroupHeaderBar({ group, height }: GroupHeaderBarProps) {
  const { purpose, domain, operator, metadata } = group;

  return (
    <header className="pg-header" style={{ height, maxHeight: height }}>
      <div className="pg-header__top">
        <div className="pg-header__titles">
          <h1 className="pg-header__name">{group.name}</h1>
          <code className="pg-header__key">{group.process_group_key}</code>
        </div>
        <div className="pg-header__badges">
          <span className="pg-badge pg-badge--model">{group.execution_model}</span>
          <span className="pg-badge pg-badge--version">v{group.version}</span>
        </div>
      </div>

      <div className="pg-header__grid">
        {/* Purpose */}
        <section className="pg-header__section">
          <h2 className="pg-header__section-title">Purpose</h2>
          <dl className="pg-kv">
            <dt>Business objective</dt>
            <dd>{purpose.business_objective}</dd>
            <dt>Primary KPIs</dt>
            <dd className="pg-kv__chips">
              {purpose.primary_kpis.map((kpi) => (
                <Chip key={kpi}>{kpi}</Chip>
              ))}
            </dd>
          </dl>
        </section>

        {/* Domain */}
        <section className="pg-header__section">
          <h2 className="pg-header__section-title">Domain</h2>
          <dl className="pg-kv">
            <dt>Industry</dt>
            <dd>{domain.industry}</dd>
            <dt>Function</dt>
            <dd>{domain.function}</dd>
            <dt>Subfunction</dt>
            <dd>{domain.subfunction}</dd>
            <dt>Operating clusters</dt>
            <dd className="pg-kv__chips">
              {domain.applicability.operatingcluster.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </dd>
          </dl>
        </section>

        {/* Operator */}
        <section className="pg-header__section">
          <h2 className="pg-header__section-title">Operator</h2>
          <dl className="pg-kv">
            <dt>Code</dt>
            <dd>{operator.operatorCode}</dd>
            <dt>Name</dt>
            <dd>{operator.operatorName}</dd>
            <dt>Type</dt>
            <dd>{operator.operatorType}</dd>
            <dt>Region</dt>
            <dd>{operator.region}</dd>
            <dt>Policy namespace</dt>
            <dd>
              <code className="pg-inline-code">{operator.policyNamespace}</code>
            </dd>
          </dl>
        </section>

        {/* Metadata */}
        <section className="pg-header__section">
          <h2 className="pg-header__section-title">Metadata</h2>
          <dl className="pg-kv">
            <dt>Updated for process</dt>
            <dd>
              <code className="pg-inline-code">{metadata.updatedForProcess}</code>
            </dd>
            <dt>Change reason</dt>
            <dd>{metadata.changeReason}</dd>
            <dt>Process group ID</dt>
            <dd>
              <code className="pg-inline-code">{group.process_group_id}</code>
            </dd>
          </dl>
        </section>
      </div>
    </header>
  );
}
