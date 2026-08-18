import { requireAuth } from "@/lib/auth/require-auth";


export default async function CheckoutLayout({
  children
}:{
  children: React.ReactNode
}) {


  await requireAuth();


  return children;

}