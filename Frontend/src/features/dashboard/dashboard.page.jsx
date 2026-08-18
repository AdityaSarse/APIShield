import DashboardPageHeader from "./components/DashboardPageHeader";
import StatCards from "./components/StatCards";
import TrafficOverview from "./components/TrafficOverview";
import ErrorRate from "./components/ErrorRate";
import GatewayMonitoring from "./components/GatewayMonitoring";
import ActiveServicesTable from "./components/ActiveServicesTable";
import StatusCodeChart from "./components/StatusCodeChart";
import AlgorithmGrid from "./components/AlgorithmGrid";
import ServiceAnalytics from "./components/ServiceAnalytics";
import ResponseTimeAnalytics from "./components/ResponseTimeAnalytics";
import RecentRequests from "./components/RecentRequests";
import TopApiKeys from "./components/TopApiKeys";

function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Dashboard Header */}
      <DashboardPageHeader />

      {/* 1. KPI stat cards */}
      <StatCards />

      {/* 2. Traffic Overview (8 cols) + Error Rate (4 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <TrafficOverview />
        </div>
        <div className="xl:col-span-4">
          <ErrorRate />
        </div>
      </div>

      {/* 3. Gateway Monitoring */}
      <GatewayMonitoring />

      {/* 4. Active API Services (7 cols) + Status Codes (5 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ActiveServicesTable />
        </div>
        <div className="xl:col-span-5">
          <StatusCodeChart />
        </div>
      </div>

      {/* 5. Rate Limiting Engines */}
      <AlgorithmGrid />

      {/* 6. Service Analytics (7 cols) + Response Time (5 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <ServiceAnalytics />
        </div>
        <div className="xl:col-span-5">
          <ResponseTimeAnalytics />
        </div>
      </div>

      {/* 7. Recent Requests */}
      <RecentRequests />

      {/* 8. Top API Keys */}
      <TopApiKeys />
    </div>
  );
}

export default DashboardPage;
