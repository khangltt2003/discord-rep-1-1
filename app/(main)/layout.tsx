import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full overflow-hidden">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0 bg-[#909090] dark:bg-[#a43434]">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
