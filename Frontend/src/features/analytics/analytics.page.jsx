import AnalyticsHeader from "./components/AnalyticsHeader";
import AnalyticsStatCards from "./components/AnalyticsStatCards";
import RequestVolumeChart from "./components/RequestVolumeChart";
import SuccessErrorChart from "./components/SuccessErrorChart";
import StatusCodeAnalytics from "./components/StatusCodeAnalytics";
import ServicePerformance from "./components/ServicePerformance";
import ResponseTimeAnalytics from "./components/ResponseTimeAnalytics";
import ApiKeyUsage from "./components/ApiKeyUsage";
import RequestAnalyticsTable from "./components/RequestAnalyticsTable";

function AnalyticsPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <AnalyticsHeader />

      {/* KPI Summary Cards */}
      <AnalyticsStatCards />

      {/* Row 1: Request Volume (8 cols) + Success/Error Analytics (4 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <RequestVolumeChart />
        </div>
        <div className="xl:col-span-4">
          <SuccessErrorChart />
        </div>
      </div>

      {/* Row 2: Status Code Distribution (6 cols) + Service Performance (6 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <StatusCodeAnalytics />
        </div>
        <div className="xl:col-span-6">
          <ServicePerformance />
        </div>
      </div>

      {/* Row 3: Response Time Latency (6 cols) + API Key Usage (6 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <ResponseTimeAnalytics />
        </div>
        <div className="xl:col-span-6">
          <ApiKeyUsage />
        </div>
      </div>

      {/* Row 4: Recent Request Logs */}
      <RequestAnalyticsTable />
    </div>
  );
}

export default AnalyticsPage;
