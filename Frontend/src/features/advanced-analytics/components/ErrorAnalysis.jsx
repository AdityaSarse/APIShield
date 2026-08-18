import { ShieldAlert, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useErrorRateAnalytics, useEndpointAnalytics } from "../hooks/useAdvancedAnalytics";

function ErrorAnalysis() {
  const { data: errorData, isLoading: isErrorLoading } = useErrorRateAnalytics();
  const { data: endpointData, isLoading: isEndpointLoading } = useEndpointAnalytics();

  const errorRate = errorData?.data?.errorRate ?? 0;
  const totalRequests = errorData?.data?.totalRequests ?? 0;
  const failedRequests = errorData?.data?.failedRequests ?? 0;

  const endpoints = Array.isArray(endpointData?.data) ? endpointData.data : [];
  const errorEndpoints = endpoints
    .filter((ep) => ep.errorCount > 0)
    .sort((a, b) => b.errorCount - a.errorCount);

  const isLoading = isErrorLoading || isEndpointLoading;

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
        <div>
          <h3 className="text-base font-extrabold text-[#18181B] tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#18181B]" />
            <span>Failure Concentration Analysis</span>
          </h3>
          <p className="text-xs text-[#71717A] mt-0.5 font-medium">
            Identifying endpoints and services generating errors
          </p>
        </div>

        {!isLoading && (
          <span
            className={`inline-flex items-center font-mono text-xs font-bold px-2.5 py-1 rounded-full ${
              errorRate === 0
                ? "bg-[#DCFCE7] text-[#15803D]"
                : errorRate < 5
                ? "bg-[#FEF3C7] text-[#D97706]"
                : "bg-[#FEE2E2] text-[#B91C1C]"
            }`}
          >
            {errorRate.toFixed(2)}% Overall Error Rate
          </span>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F4F4F5]" />
          ))}
        </div>
      )}

      {/* Content */}
      {!isLoading && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#F8F9FA] p-3.5 border border-[#EBECEF]">
              <span className="text-[10px] font-semibold text-[#71717A]">Failed Requests</span>
              <p className="mt-1 font-mono text-lg font-extrabold text-[#B91C1C]">
                {failedRequests.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl bg-[#F8F9FA] p-3.5 border border-[#EBECEF]">
              <span className="text-[10px] font-semibold text-[#71717A]">Problem Endpoints</span>
              <p className="mt-1 font-mono text-lg font-extrabold text-[#18181B]">
                {errorEndpoints.length}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#18181B] mb-2 uppercase tracking-wider">
              Top Failing Endpoints
            </h4>

            {errorEndpoints.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-[#EBECEF] bg-[#F8F9FA] text-xs font-semibold text-[#15803D] gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                <span>Zero failed endpoints recorded. System is healthy.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {errorEndpoints.slice(0, 4).map((ep) => (
                  <div
                    key={ep.endpoint}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#FEE2E2] bg-[#FEF2F2]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <AlertTriangle className="h-3.5 w-3.5 text-[#B91C1C] shrink-0" />
                      <span className="font-mono text-xs font-bold text-[#18181B] truncate">
                        {ep.endpoint}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-[#B91C1C]">
                        {ep.errorCount.toLocaleString()} errors ({ep.errorRate}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ErrorAnalysis;
