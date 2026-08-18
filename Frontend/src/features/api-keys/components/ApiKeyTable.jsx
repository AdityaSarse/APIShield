import { useState } from "react";
import { Key, Copy, Check, RefreshCw, Ban, Search, Clock, Calendar } from "lucide-react";
import { useApiKeysList } from "../hooks/useApiKeys";

function formatDateTime(isoString) {
  if (!isoString) return "Never";
  const d = new Date(isoString);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ApiKeyTable({ onRotate, onRevoke }) {
  const { data, isLoading, isError } = useApiKeysList();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [copiedId, setCopiedId] = useState(null);

  const keys = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

  const counts = {
    ALL: keys.length,
    ACTIVE: keys.filter(
      (k) => !k.revoked && (!k.expiresAt || new Date(k.expiresAt) > new Date())
    ).length,
    REVOKED: keys.filter((k) => k.revoked).length,
    EXPIRED: keys.filter(
      (k) => !k.revoked && k.expiresAt && new Date(k.expiresAt) <= new Date()
    ).length,
  };

  const filteredKeys = keys.filter((k) => {
    const matchesSearch =
      k.name?.toLowerCase().includes(search.toLowerCase()) ||
      k.prefix?.toLowerCase().includes(search.toLowerCase());

    const isRevoked = k.revoked;
    const isExpired = !k.revoked && k.expiresAt && new Date(k.expiresAt) <= new Date();
    const isActive = !k.revoked && (!k.expiresAt || new Date(k.expiresAt) > new Date());

    if (!matchesSearch) return false;

    if (statusFilter === "ACTIVE") return isActive;
    if (statusFilter === "REVOKED") return isRevoked;
    if (statusFilter === "EXPIRED") return isExpired;
    return true;
  });

  const handleCopyPrefix = (prefix, id) => {
    navigator.clipboard.writeText(prefix);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-[22px] border border-[#EBECEF] bg-white p-6 shadow-2xs">
      {/* Header with Search & Status Filters */}
      <div className="flex flex-col gap-4 pb-4 border-b border-[#F1F3F5]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-[#18181B]" />
            <div>
              <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
                API Keys Management
              </h3>
              <p className="text-xs text-[#71717A] font-medium">
                Manage client secrets, view access status, rotate and revoke keys
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search keys by name or prefix..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-[#EBECEF] bg-[#F8F9FA] pl-9 pr-4 py-2 text-xs font-semibold text-[#18181B] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          {[
            { id: "ALL", label: "All Keys", count: counts.ALL },
            { id: "ACTIVE", label: "Active", count: counts.ACTIVE },
            { id: "REVOKED", label: "Revoked", count: counts.REVOKED },
            { id: "EXPIRED", label: "Expired", count: counts.EXPIRED },
          ].map((tab) => {
            const isActiveTab = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                  isActiveTab
                    ? "bg-[#18181B] text-white shadow-xs"
                    : "bg-[#F4F4F5] text-[#71717A] hover:bg-[#E4E4E7] hover:text-[#18181B]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActiveTab
                      ? "bg-white/20 text-white"
                      : "bg-white text-[#71717A] border border-[#EBECEF]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-[#F4F4F5]" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs font-semibold text-red-600">
          Unable to load API keys list.
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredKeys.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center text-center">
          <Key className="h-7 w-7 text-[#A1A1AA] mb-2" />
          <p className="text-sm font-semibold text-[#18181B]">No API Keys Found</p>
          <p className="mt-0.5 text-xs text-[#71717A]">
            {search || statusFilter !== "ALL"
              ? "No keys match your filter criteria."
              : "Create your first API key to get started."}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && filteredKeys.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#F1F3F5]">
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Key Name &amp; Prefix
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Status
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Created
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Last Used
                </th>
                <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Expires
                </th>
                <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F3F5]">
              {filteredKeys.map((keyItem) => {
                const isRevoked = keyItem.revoked;
                const isExpired = !keyItem.revoked && keyItem.expiresAt && new Date(keyItem.expiresAt) <= new Date();

                return (
                  <tr
                    key={keyItem.id}
                    className="transition-colors hover:bg-[#FAFAFA]"
                  >
                    {/* Name & Prefix */}
                    <td className="px-3 py-4">
                      <div>
                        <p className="text-xs font-bold text-[#18181B] truncate max-w-[200px]">
                          {keyItem.name}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-extrabold text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded-md">
                            {keyItem.prefix}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyPrefix(keyItem.prefix, keyItem.id)}
                            title="Copy Key Prefix"
                            className="text-[#A1A1AA] hover:text-[#18181B] transition-colors cursor-pointer"
                          >
                            {copiedId === keyItem.id ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-3 py-4">
                      {isRevoked ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEE2E2] px-2.5 py-0.5 text-[10px] font-extrabold text-[#B91C1C]">
                          <Ban className="h-3 w-3" />
                          Revoked
                        </span>
                      ) : isExpired ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-2.5 py-0.5 text-[10px] font-extrabold text-[#D97706]">
                          <Clock className="h-3 w-3" />
                          Expired
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[10px] font-extrabold text-[#15803D]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] animate-pulse" />
                          Active
                        </span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="px-3 py-4 font-mono text-[11px] text-[#71717A]">
                      {formatDateTime(keyItem.createdAt)}
                    </td>

                    {/* Last Used */}
                    <td className="px-3 py-4 font-mono text-[11px] text-[#71717A]">
                      {formatDateTime(keyItem.lastUsedAt)}
                    </td>

                    {/* Expires At */}
                    <td className="px-3 py-4 font-mono text-[11px] text-[#71717A]">
                      {keyItem.expiresAt ? formatDateTime(keyItem.expiresAt) : "Never"}
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          disabled={isRevoked}
                          onClick={() => onRotate(keyItem)}
                          title="Rotate Secret Key"
                          className="flex h-8 px-2.5 items-center gap-1 rounded-lg border border-[#EBECEF] bg-white text-[10px] font-bold text-[#18181B] shadow-2xs hover:bg-[#F8F9FA] disabled:opacity-40 cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3 text-[#71717A]" />
                          <span>Rotate</span>
                        </button>

                        <button
                          type="button"
                          disabled={isRevoked}
                          onClick={() => onRevoke(keyItem)}
                          title="Revoke Key"
                          className="flex h-8 px-2.5 items-center gap-1 rounded-lg border border-red-200 bg-red-50 text-[10px] font-bold text-[#B91C1C] hover:bg-red-100 disabled:opacity-40 cursor-pointer"
                        >
                          <Ban className="h-3 w-3" />
                          <span>Revoke</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ApiKeyTable;
