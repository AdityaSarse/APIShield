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
    <div className="space-y-4 sm:space-y-6 pb-12">
      {/* Page Header */}
      <AnalyticsHeader />

      {/* KPI Summary Cards */}
      <AnalyticsStatCards />

      {/* Row 1: Request Volume + Success/Error — stack on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <RequestVolumeChart />
        </div>
        <div className="lg:col-span-4">
          <SuccessErrorChart />
        </div>
      </div>

      {/* Row 2: Status Codes + Service Performance — side-by-side on md */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <StatusCodeAnalytics />
        <ServicePerformance />
      </div>

      {/* Row 3: Response Time + API Key Usage — side-by-side on md */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <ResponseTimeAnalytics />
        <ApiKeyUsage />
      </div>

      {/* Row 4: Recent Request Logs */}
      <RequestAnalyticsTable />
    </div>
  );
}

export default AnalyticsPage;
