import { X, Ban } from "lucide-react";
import { useRevokeApiKey } from "../hooks/useApiKeys";

function RevokeApiKeyDialog({ apiKey, onClose }) {
  const revokeMutation = useRevokeApiKey();

  if (!apiKey) return null;

  const handleRevoke = () => {
    revokeMutation.mutate(apiKey.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-[24px] border border-[#EBECEF] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] flex items-center justify-center text-[#B91C1C]">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#18181B]">
                Revoke API Key
              </h3>
              <p className="text-xs text-[#71717A]">
                Key: <span className="font-mono font-bold text-[#18181B]">{apiKey.name}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-[#EBECEF] bg-[#F8F9FA] flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-red-200 bg-red-50/60 p-3.5">
            <p className="text-xs font-semibold text-red-800">
              Target Key: <span className="font-extrabold">{apiKey.name}</span>
            </p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-red-700">Prefix:</span>
              <span className="font-mono text-[10px] font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded-md">
                {apiKey.prefix}
              </span>
            </div>
          </div>

          <p className="text-xs text-[#71717A] leading-relaxed">
            Are you sure you want to revoke <span className="font-bold text-[#18181B]">{apiKey.name}</span>? Any application using this key will immediately receive <span className="font-mono font-bold text-red-600">401 Unauthorized</span> error codes. This action is irreversible.
          </p>

          {revokeMutation.isError && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
              {revokeMutation.error?.response?.data?.message || "Failed to revoke API key."}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F3F5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#71717A] hover:bg-[#F4F4F5] rounded-full cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRevoke}
              disabled={revokeMutation.isPending}
              className="px-5 py-2 rounded-full bg-[#B91C1C] text-white text-xs font-extrabold shadow-md hover:bg-[#991B1B] disabled:opacity-60 cursor-pointer"
            >
              {revokeMutation.isPending ? "Revoking..." : "Revoke Key"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RevokeApiKeyDialog;
