import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Car, Home, Newspaper } from "lucide-react";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Garage",
    url: "/dashboard/garage",
    icon: Car,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: Newspaper,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-none">
      <SidebarContent className=" bg-background text-foreground border-r">
        <SidebarHeader>
          <div className=" text-4xl font-bold mt-8 flex items-center gap-2">
            <div>SmartAuto</div>
            <div>
              <Car size={24} />
            </div>
          </div>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
