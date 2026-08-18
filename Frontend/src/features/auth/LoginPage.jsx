import LoginForm from "./components/LoginForm";

function LoginPage() {
  return (
    <main className="min-h-screen bg-[#F7F8F9] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-md items-center justify-center">
        <div className="w-full">
          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F46E5] text-lg font-black text-white shadow-sm">
              A
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#18181B]">
              APIShield
            </h1>

            <p className="mt-2 text-sm text-[#71717A]">
              Secure API gateway control center
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-[24px] bg-white p-7 shadow-sm ring-1 ring-black/[0.04] sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold tracking-tight text-[#18181B]">
                Sign in
              </h2>

              <p className="mt-1.5 text-sm text-[#71717A]">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            <LoginForm />

            <div className="mt-7 border-t border-[#F0F0F2] pt-5 text-center">
              <p className="text-xs text-[#A1A1AA]">
                APIShield Gateway · Secure infrastructure
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
