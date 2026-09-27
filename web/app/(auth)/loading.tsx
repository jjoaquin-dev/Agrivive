export default function AuthLoading() {
  return (
    <main
      className="min-h-screen bg-agrivive-background px-4 py-6 text-agrivive-text sm:px-8 sm:py-10"
      aria-busy="true"
      aria-label="Loading authentication page"
    >
      <div className="mx-auto grid min-h-[720px] max-w-[1180px] overflow-hidden rounded-[24px] bg-white p-3 shadow-auth lg:grid-cols-[0.86fr_1.14fr] lg:p-4">
        <section className="flex items-center px-5 py-8 sm:px-12 lg:px-16 lg:py-12">
          <div className="mx-auto w-full max-w-[420px] animate-pulse">
            <div className="mb-10 h-10 w-32 rounded-xl bg-agrivive-border" />
            <div className="mb-8 space-y-3">
              <div className="h-10 w-3/4 rounded-lg bg-agrivive-border" />
              <div className="h-5 w-full max-w-sm rounded bg-agrivive-border" />
            </div>
            <div className="space-y-5">
              <div className="h-[80px] rounded-lg bg-agrivive-border" />
              <div className="h-[80px] rounded-lg bg-agrivive-border" />
              <div className="h-12 rounded-[10px] bg-agrivive-border" />
            </div>
          </div>
        </section>
        <aside className="hidden rounded-[18px] bg-agrivive-primary lg:block" />
      </div>
    </main>
  );
}
