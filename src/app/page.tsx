export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-surface-container-low">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-6xl font-headline font-bold text-on-surface tracking-tight">
          Welcome to <span className="text-secondary italic">Konfide</span>
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl text-center">
          The production-grade structure has been initialized. Ready for development.
        </p>
      </div>
    </main>
  );
}
