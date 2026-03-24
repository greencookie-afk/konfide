export default function AuthPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-headline font-bold text-on-surface mb-2 text-center">Welcome to Konfide</h1>
        <p className="text-on-surface-variant text-center mb-10">Sign in or create an account to continue.</p>

        {/* TODO: Replace with Stitch "Konfide Auth - Unified Sign In & Sign Up" screen */}
        <div className="p-8 border-2 border-dashed border-primary/20 rounded-2xl bg-surface-container-low text-center">
          <p className="text-primary font-medium">Auth UI goes here</p>
        </div>
      </div>
    </div>
  );
}
