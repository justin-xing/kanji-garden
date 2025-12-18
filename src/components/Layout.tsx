import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  headerTitle?: string;
  action?: ReactNode;
  isScreenFit?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, headerTitle, action, isScreenFit = false }) => {
  return (
    <div className={`bg-paper ${isScreenFit ? 'h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
      <div className={`max-w-md mx-auto bg-paper shadow-2xl relative ${isScreenFit ? 'h-full flex flex-col' : 'min-h-screen overflow-hidden'}`}>
        {headerTitle && (
          <header className="shrink-0 sticky top-0 z-40 bg-paper/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-stone-100">
            <h1 className="text-xl font-bold text-ink tracking-tight">{headerTitle}</h1>
            {action && <div>{action}</div>}
          </header>
        )}
        <main className={`px-6 animate-fade-in ${isScreenFit ? 'flex-1 flex flex-col pt-6 pb-24 overflow-hidden' : 'pt-6 pb-28'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;