import { redirect } from "next/navigation";

/** Legacy path — shopper auth lives under /account/login */
export default function LegacyCustomerLoginRedirect() {
  redirect("/account/login");
}
