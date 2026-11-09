import { redirect } from "next/navigation";

/** Legacy path — shopper signup lives under /account/signup */
export default async function LegacyCustomerSignupRedirect({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  const ref = params.ref ? `?ref=${encodeURIComponent(params.ref)}` : "";
  redirect(`/account/signup${ref}`);
}
