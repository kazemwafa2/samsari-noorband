import { redirect } from "next/navigation";

// مشابه /site/login — این مسیر تکراریِ /register بود.

export default function SiteRegisterRedirect() {
  redirect("/register");
}
