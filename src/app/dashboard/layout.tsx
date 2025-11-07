import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/layout/Navbar";
import SidebarWrapper from "@/components/layout/Sidebar/SidebarWrapper";
import { auth } from "@/auth";
import { $Enums } from "@/generated/prisma";

export default async function RootLayout( {children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();  
  return (

    <SidebarProvider >
      <SidebarWrapper userRole={session?.user?.role as $Enums.UserRole} />
      <main className="w-full">
        <Navbar />
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </main>
    </SidebarProvider>

  );
}
