import { useState } from "react";
import AdvancedAnalyticsHeader from "./components/AdvancedAnalyticsHeader";
import EndpointPerformance from "./components/EndpointPerformance";
import ExpandedServicePerformance from "./components/ExpandedServicePerformance";
import ApiKeyPerformance from "./components/ApiKeyPerformance";
import TrafficTrends from "./components/TrafficTrends";
import ErrorAnalysis from "./components/ErrorAnalysis";

function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <AdvancedAnalyticsHeader timeRange={timeRange} setTimeRange={setTimeRange} />

      {/* 1. Endpoint Performance Analytics */}
      <EndpointPerformance />

      {/* 2. Traffic Trends (7 cols) + Failure Analysis (5 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <TrafficTrends timeRange={timeRange} />
        </div>
        <div className="xl:col-span-5">
          <ErrorAnalysis />
        </div>
      </div>

      {/* 3. Service Performance (6 cols) + API Key Consumer Performance (6 cols) */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-6">
          <ExpandedServicePerformance />
        </div>
        <div className="xl:col-span-6">
          <ApiKeyPerformance />
        </div>
      </div>
    </div>
  );
}

export default AdvancedAnalyticsPage;
