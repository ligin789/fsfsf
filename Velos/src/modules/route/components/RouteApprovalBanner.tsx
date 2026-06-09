import { HiOutlineShieldCheck, HiOutlineClock, HiOutlineExclamation } from 'react-icons/hi';
import { approvalBanner, statusBadge } from './uiStyles';
import type { RouteResponse } from '../types';

interface Props {
  route: RouteResponse | null;
}

export default function RouteApprovalBanner({ route }: Props) {
  if (!route) return null;
  const status = route.regulatoryApprovalStatus || route.status || 'DRAFT';
  const Icon =
    status === 'APPROVED'
      ? HiOutlineShieldCheck
      : status === 'EXPIRED'
      ? HiOutlineExclamation
      : HiOutlineClock;

  return (
    <div style={approvalBanner(status)}>
      <Icon style={{ fontSize: 22 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 800, fontSize: 13 }}>
          {route.routeDesignator}{' '}
          <span style={{ ...statusBadge(status), marginLeft: 6 }}>{status}</span>
        </div>
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>
          {route.approvedByAuthority ? `Approved by ${route.approvedByAuthority}` : 'Approval pending'}
          {route.approvalDate && ` · since ${route.approvalDate}`}
          {route.approvalExpiryDate && ` · expires ${route.approvalExpiryDate}`}
          {route.currentVersion != null && ` · v${route.currentVersion}`}
        </div>
      </div>
    </div>
  );
}
