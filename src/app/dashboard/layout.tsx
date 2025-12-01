import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/layout/Navbar";
import SidebarWrapper from "@/components/layout/Sidebar/SidebarWrapper";
import ProfileCompletionBanner from "@/components/dashboard/profile-completion-banner";
import { auth } from "@/auth";
import { $Enums } from "@/generated/prisma/browser";
import prisma from "@/lib/prisma";
import { isProfileComplete } from "@/types/profile";

export default async function RootLayout( {children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  // Check if profile is complete
  let showBanner = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { settings: true, role: true },
    });
    
    if (user) {
      showBanner = !isProfileComplete(user.settings, user.role);
    }
  }
  
  return (

    <SidebarProvider >
      <SidebarWrapper userRole={session?.user?.role as $Enums.UserRole} />
      <main className="w-full">
        <Navbar />
        <div className="flex-1 p-4 md:p-6">
          {showBanner && session?.user?.role && (
            <ProfileCompletionBanner userRole={session.user.role as $Enums.UserRole} />
          )}
          {children}
        </div>
      </main>
    </SidebarProvider>

  );
}
