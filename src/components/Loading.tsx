export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-24 w-24 animate-bounce text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{
              animationDelay: `${-(new Date().getTime() % 1000)}ms`,
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-primary transition-colors duration-300">
          messenger.reilley.dev
        </h1>
        <p className="text-muted-foreground transition-colors duration-300">
          Loading your conversations...
        </p>
        <div className="mt-4">
          <div
            className="mx-auto h-1 w-12 animate-pulse rounded-full bg-primary transition-colors duration-1000"
            style={{
              animationDelay: `${-(new Date().getTime() % 1000)}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}