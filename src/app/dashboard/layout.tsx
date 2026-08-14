import { requireRole } from "@/lib/auth/require-role";
import { ROLES } from "@/lib/auth/roles";


export default async function DashboardLayout({
  children
}:{
  children: React.ReactNode
}) {


  await requireRole([
    ROLES.ADMIN,
    ROLES.SUPER_ADMIN,
    ROLES.SELLER
  ]);


  return (

    <div className="admin-panel">

      {children}

    </div>

  );

}