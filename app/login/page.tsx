import { AzureSignInButton } from "@/components/azure-sign-in-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-[75vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand font-display text-base font-bold text-white">
            S
          </span>
        </div>
        <div className="card">
          <h1 className="font-display text-lg font-semibold text-stone-900">Sotara CRM</h1>
          <p className="mb-6 mt-1 text-sm text-stone-500">Sign in with your Sotara Microsoft account.</p>

          {error && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <AzureSignInButton />
        </div>
      </div>
    </div>
  );
}
