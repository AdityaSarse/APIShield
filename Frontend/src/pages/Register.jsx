function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-[var(--color-border)]">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Create APIShield Account</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">Register a new user to manage API services and rate limits.</p>
      </div>
    </div>
  );
}

export default Register;
