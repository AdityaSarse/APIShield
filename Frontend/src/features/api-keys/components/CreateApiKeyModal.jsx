import { useState } from "react";
import { X, Key, Copy, Check, ShieldAlert } from "lucide-react";
import { useCreateApiKey } from "../hooks/useApiKeys";

function CreateApiKeyModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [createdKey, setCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const createMutation = useCreateApiKey();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedExpiresAt = expiresAt
      ? new Date(expiresAt).toISOString()
      : undefined;

    createMutation.mutate(
      { name, expiresAt: formattedExpiresAt },
      {
        onSuccess: (data) => {
          setCreatedKey(data.data?.apiKey ?? data.apiKey ?? null);
        },
      }
    );
  };

  const handleCopy = () => {
    if (createdKey) {
      navigator.clipboard.writeText(createdKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName("");
    setExpiresAt("");
    setCreatedKey(null);
    setCopied(false);
    onClose();
  };

  return (
    <div 
      onClick={(e) => {
        if (!createdKey && e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-[24px] border border-[#EBECEF] bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F3F5]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5]">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#18181B]">
                Create New API Key
              </h3>
              <p className="text-xs text-[#71717A]">
                Generate an authentication key for API access
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="h-8 w-8 rounded-full border border-[#EBECEF] bg-[#F8F9FA] flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {!createdKey ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#18181B] mb-1">
                Key Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Production Mobile App"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#EBECEF] bg-[#F8F9FA] px-3.5 py-2.5 text-xs font-semibold text-[#18181B] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#18181B] mb-1">
                Expiration Date <span className="text-[10px] text-[#71717A] font-normal">(Optional)</span>
              </label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-xl border border-[#EBECEF] bg-[#F8F9FA] px-3.5 py-2.5 text-xs font-semibold text-[#18181B] focus:border-[#4F46E5] focus:bg-white focus:outline-none"
              />
            </div>

            {createMutation.isError && (
              <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600">
                {createMutation.error?.response?.data?.message || "Failed to create API key."}
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
                type="submit"
                disabled={createMutation.isPending}
                className="px-5 py-2 rounded-full bg-[#18181B] text-white text-xs font-extrabold shadow-md hover:bg-[#27272A] disabled:opacity-60 cursor-pointer"
              >
                {createMutation.isPending ? "Generating..." : "Generate Key"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Save your API Key now</span>
              </div>
              <p className="mt-1 text-[11px] text-amber-700 font-medium">
                This is the only time this secret key will be shown. Store it securely in your environment files.
              </p>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#18181B] mb-1">
                Your Secret API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdKey}
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

export default CreateApiKeyModal;
