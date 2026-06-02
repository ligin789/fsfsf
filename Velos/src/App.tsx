import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import HomePage from './pages/HomePage';
import AppLayout from './components/dashboard/layout/AppLayout';
import './App.css';

// Lazy load dashboard pages
const Dashboard = lazy(() => import('./pages/dashboard'));
const RuleEngine = lazy(() => import('./pages/dashboard/RuleEngine'));
const PlaceholderPage = lazy(() => import('./pages/dashboard/PlaceholderPage'));
const GanttPage = lazy(() => import('./pages/gantt/GanttPage'));
const OperatorListPage = lazy(() => import('./modules/operator/pages/OperatorListPage'));
const OperatorPortalPage = lazy(() => import('./modules/operator/pages/OperatorPortalPage'));
const OperatorLayout = lazy(() => import('./modules/operator/layout/OperatorLayout'));
const VertiportListPage = lazy(() => import('./modules/vertiport/pages/VertiportListPage'));
const VertiportPortalPage = lazy(() => import('./modules/vertiport/pages/VertiportPortalPage'));
const VertiportLayout = lazy(() => import('./modules/vertiport/layout/VertiportLayout'));
const GeoClusterPage = lazy(() => import('./modules/geographical-management/pages/ClusterPage'));
const GeoRegionPage = lazy(() => import('./modules/geographical-management/pages/RegionPage'));
const GeoZonePage = lazy(() => import('./modules/geographical-management/pages/ZonePage'));
const LiveMonitorLayout = lazy(() => import('./pages/live-monitor/LiveMonitorLayout'));
const LiveMonitorTaskCard = lazy(() => import('./pages/live-monitor/TaskCardView'));
const LiveMonitorMap = lazy(() => import('./pages/live-monitor/MapView'));
const LiveMonitorGantt = lazy(() => import('./pages/live-monitor/GanttView'));
const LiveMonitorGrid = lazy(() => import('./pages/live-monitor/GridView'));
const LiveMonitor3DMap = lazy(() => import('./modules/3dmap/pages/ThreeDMapPage'));
const RegulatorListPage = lazy(() => import('./modules/regulators/pages/RegulatorListPage'));
const OemListPage = lazy(() => import('./modules/oem/pages/OemListPage'));
const RuleLibraryPage = lazy(() => import('./modules/goRule/pages/RuleLibraryPage'));
const SchemaLibraryPage = lazy(() => import('./modules/schema-editor/pages/SchemaLibraryPage'));
const RouteExplorerPage = lazy(() => import('./modules/route/pages/RouteExplorerPage'));
const RouteReservationsPage = lazy(() => import('./modules/route/pages/ReservationsPage'));
const RouteConstraintsPage = lazy(() => import('./modules/route/pages/ConstraintsPage'));
const RouteVersionsPage = lazy(() => import('./modules/route/pages/VersionsPage'));

// Wrapper to pass props to placeholder pages
const makePage = (title: string, subtitle: string, icon: string) => {
  const Page = () => <PlaceholderPage title={title} subtitle={subtitle} icon={icon} />;
  return Page;
};

const DataSources = makePage('Data Sources', 'Connect and manage your data integrations.', '🗄️');
const Analytics = makePage('Analytics', 'Insights and performance metrics.', '📊');
const AuditLogs = makePage('Audit Logs', 'Track all system activities and changes.', '🕐');
const Users = makePage('Users', 'Manage user accounts and permissions.', '👥');
const AddUser = makePage('Add User', 'Create a new user account.', '➕');
const Products = makePage('Products', 'View and manage product catalog.', '🛍️');
const AddProduct = makePage('Add Product', 'Add a new product to the catalog.', '➕');
const Orders = makePage('Orders', 'Track and manage customer orders.', '📦');
const Reports = makePage('Reports', 'Generate and view business reports.', '📈');
const Settings = makePage('Settings', 'Configure system preferences.', '⚙️');

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />

        {/* Dashboard routes */}
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={
            <Suspense fallback={null}><Dashboard /></Suspense>
          } />
          <Route path="rule-engine" element={
            <Suspense fallback={null}><RuleEngine /></Suspense>
          } />
          <Route path="data-sources" element={
            <Suspense fallback={null}><DataSources /></Suspense>
          } />
          <Route path="analytics" element={
            <Suspense fallback={null}><Analytics /></Suspense>
          } />
          <Route path="audit-logs" element={
            <Suspense fallback={null}><AuditLogs /></Suspense>
          } />
          <Route path="users" element={
            <Suspense fallback={null}><Users /></Suspense>
          } />
          <Route path="users/add" element={
            <Suspense fallback={null}><AddUser /></Suspense>
          } />
          <Route path="products" element={
            <Suspense fallback={null}><Products /></Suspense>
          } />
          <Route path="products/add" element={
            <Suspense fallback={null}><AddProduct /></Suspense>
          } />
          <Route path="orders" element={
            <Suspense fallback={null}><Orders /></Suspense>
          } />
          <Route path="reports" element={
            <Suspense fallback={null}><Reports /></Suspense>
          } />
          <Route path="settings" element={
            <Suspense fallback={null}><Settings /></Suspense>
          } />
          <Route path="gantt" element={
            <Suspense fallback={null}><GanttPage mode="aircraft" /></Suspense>
          } />
          <Route path="gantt/aircraft" element={
            <Suspense fallback={null}><GanttPage mode="aircraft" /></Suspense>
          } />
          <Route path="gantt/vertiport" element={
            <Suspense fallback={null}><GanttPage mode="vertiport" /></Suspense>
          } />
          <Route path="operators" element={
            <Suspense fallback={null}><OperatorListPage /></Suspense>
          } />
          <Route path="vertiports" element={
            <Suspense fallback={null}><VertiportListPage /></Suspense>
          } />
          <Route path="regulators" element={
            <Suspense fallback={null}><RegulatorListPage /></Suspense>
          } />
          <Route path="oem" element={
            <Suspense fallback={null}><OemListPage /></Suspense>
          } />
          <Route path="designer/rule-library" element={
            <Suspense fallback={null}><RuleLibraryPage /></Suspense>
          } />
          <Route path="designer/schema-library" element={
            <Suspense fallback={null}><SchemaLibraryPage /></Suspense>
          } />

          {/* Live Monitor */}
          <Route path="live-monitor" element={
            <Suspense fallback={null}><LiveMonitorLayout /></Suspense>
          }>
            <Route index element={<Navigate to="taskcard" replace />} />
            <Route path="taskcard" element={
              <Suspense fallback={null}><LiveMonitorTaskCard /></Suspense>
            } />
            <Route path="map" element={
              <Suspense fallback={null}><LiveMonitorMap /></Suspense>
            } />
            <Route path="gantt" element={
              <Suspense fallback={null}><LiveMonitorGantt /></Suspense>
            } />
            <Route path="grid" element={
              <Suspense fallback={null}><LiveMonitorGrid /></Suspense>
            } />
            <Route path="3d-map" element={
              <Suspense fallback={null}><LiveMonitor3DMap /></Suspense>
            } />
          </Route>

          {/* Route Module */}
          <Route path="routes/explorer" element={
            <Suspense fallback={null}><RouteExplorerPage /></Suspense>
          } />
          <Route path="routes/reservations" element={
            <Suspense fallback={null}><RouteReservationsPage /></Suspense>
          } />
          <Route path="routes/constraints" element={
            <Suspense fallback={null}><RouteConstraintsPage /></Suspense>
          } />
          <Route path="routes/versions" element={
            <Suspense fallback={null}><RouteVersionsPage /></Suspense>
          } />

          {/* Geographical Management */}
          <Route path="geographical/clusters" element={
            <Suspense fallback={null}><GeoClusterPage /></Suspense>
          } />
          <Route path="geographical/regions" element={
            <Suspense fallback={null}><GeoRegionPage /></Suspense>
          } />
          <Route path="geographical/zones" element={
            <Suspense fallback={null}><GeoZonePage /></Suspense>
          } />
        </Route>

        {/* Operator Portal — opens in new tab with its own layout */}
        <Route path="/operator/:operatorId" element={
          <Suspense fallback={null}><OperatorLayout /></Suspense>
        }>
          <Route index element={
            <Suspense fallback={null}><OperatorPortalPage /></Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={null}><OperatorPortalPage /></Suspense>
          } />
        </Route>

        {/* Vertiport Portal — opens in new tab with its own layout */}
        <Route path="/vertiport/:vertiportId" element={
          <Suspense fallback={null}><VertiportLayout /></Suspense>
        }>
          <Route index element={
            <Suspense fallback={null}><VertiportPortalPage /></Suspense>
          } />
          <Route path="*" element={
            <Suspense fallback={null}><VertiportPortalPage /></Suspense>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
