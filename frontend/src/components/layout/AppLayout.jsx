import { AppSidebar } from './nav/AppSidebar';
import { BottomNav } from './nav/BottomNav';

export const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-warn-bg">
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 min-h-screen pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
};
