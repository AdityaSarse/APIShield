import { useState } from "react";
import { X, RefreshCw, Copy, Check, ShieldAlert } from "lucide-react";
import { useRotateApiKey } from "../hooks/useApiKeys";

function RotateApiKeyModal({ apiKey, onClose }) {
  const [rotatedKey, setRotatedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const rotateMutation = useRotateApiKey();

  if (!apiKey) return null;

  const handleRotate = () => {
    rotateMutation.mutate(apiKey.id, {
      onSuccess: (data) => {
        setRotatedKey(data.data?.apiKey ?? data.apiKey ?? null);
      },
    });
  };

  const handleCopy = () => {
    if (rotatedKey) {
      navigator.clipboard.writeText(rotatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setRotatedKey(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-[24px] border border-[#EBECEF] bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#FEF3C7] border border-[#FCD34D] flex items-center justify-center text-[#D97706]">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#18181B]">
                Rotate API Key
              </h3>
              <p className="text-xs text-[#71717A]">
                Key: <span className="font-mono font-bold text-[#18181B]">{apiKey.name}</span> ({apiKey.prefix})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="h-8 w-8 rounded-full border border-[#EBECEF] bg-[#F8F9FA] flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {!rotatedKey ? (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-[#71717A] leading-relaxed">
              Rotating this API key will immediately invalidate the current secret key and issue a brand-new secret key. Applications using the old key will get <span className="font-mono font-bold text-red-600">401 Unauthorized</span> until updated.
            </p>

            {rotateMutation.isError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                {rotateMutation.error?.response?.data?.message || "Failed to rotate API key."}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs font-bold text-[#71717A] hover:bg-[#F4F4F5] rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRotate}
                disabled={rotateMutation.isPending}
                className="px-5 py-2 rounded-full bg-[#D97706] text-white text-xs font-extrabold shadow-md hover:bg-[#B45309] disabled:opacity-60 cursor-pointer"
              >
                {rotateMutation.isPending ? "Rotating..." : "Confirm & Rotate Key"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Save your new Secret API Key</span>
              </div>
              <p className="mt-1 text-[11px] text-amber-700 font-medium">
                This new secret key will only be shown once. Copy it now to update your application.
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#18181B] mb-1">
                New Secret API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={rotatedKey}
                  className="w-full font-mono rounded-xl border border-[#EBECEF] bg-[#F8F9FA] px-3.5 py-2.5 text-xs font-extrabold text-[#18181B]"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex h-10 px-3.5 items-center gap-1.5 rounded-xl border border-[#EBECEF] bg-white text-xs font-bold text-[#18181B] hover:bg-[#F8F9FA] shadow-xs cursor-pointer shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-[#71717A]" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 rounded-full bg-[#18181B] text-white text-xs font-extrabold shadow-md hover:bg-[#27272A] cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RotateApiKeyModal;
