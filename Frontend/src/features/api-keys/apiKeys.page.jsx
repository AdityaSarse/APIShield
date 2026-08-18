import { useState } from "react";
import { Key, Plus, ShieldCheck } from "lucide-react";
import ApiKeyTable from "./components/ApiKeyTable";
import CreateApiKeyModal from "./components/CreateApiKeyModal";
import RotateApiKeyModal from "./components/RotateApiKeyModal";
import RevokeApiKeyDialog from "./components/RevokeApiKeyDialog";

function ApiKeysPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rotateTarget, setRotateTarget] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EBECEF] pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#EEF2FF] border border-[#C7D2FE] flex items-center justify-center text-[#4F46E5] shadow-2xs">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#18181B] tracking-tight">
              API Keys &amp; Authentication
            </h1>
            <p className="text-xs text-[#71717A] mt-0.5 font-medium">
              Create, rotate, revoke, and manage gateway access keys
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="flex h-9 items-center gap-2 rounded-full bg-[#18181B] px-4 text-xs font-extrabold text-white shadow-md hover:bg-[#27272A] active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create API Key</span>
        </button>
      </div>

      {/* Main Table */}
      <ApiKeyTable
        onRotate={(keyItem) => setRotateTarget(keyItem)}
        onRevoke={(keyItem) => setRevokeTarget(keyItem)}
      />

      {/* Modals */}
      <CreateApiKeyModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {rotateTarget && (
        <RotateApiKeyModal
          apiKey={rotateTarget}
          onClose={() => setRotateTarget(null)}
        />
      )}

      {revokeTarget && (
        <RevokeApiKeyDialog
          apiKey={revokeTarget}
          onClose={() => setRevokeTarget(null)}
        />
      )}
    </div>
  );
}

export default ApiKeysPage;
