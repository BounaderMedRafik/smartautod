import UserMenu from "./UserMenu";

export function DashboardTopBar() {
  return (
    <div>
      <div className="flex items-center justify-end p-4 bg-secondary/25 text-foreground border-b">
        <div className="flex items-center space-x-4">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
