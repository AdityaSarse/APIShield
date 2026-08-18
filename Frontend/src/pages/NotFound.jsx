function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] p-4">
      <h1 className="text-4xl font-bold text-[var(--color-text-primary)]">404</h1>
      <p className="mt-2 text-base text-[var(--color-text-secondary)]">Page Not Found</p>
    </div>
  );
}

export default NotFound;
