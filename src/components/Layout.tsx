
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, Play, Music, Heart, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isMobile: boolean;
}

const NavItem = ({ to, icon, label, isMobile }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <NavLink 
            to={to} 
            className={cn("nav-link", isActive && "active")}
          >
            <span className={cn("text-xl", isActive ? "text-foreground" : "text-muted-foreground")}>
              {icon}
            </span>
            {!isMobile && <span className={isActive ? "font-medium" : ""}>{label}</span>}
          </NavLink>
        </TooltipTrigger>
        {isMobile && (
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Navigation sidebar */}
      <div className={cn(
        "fixed z-10 flex flex-col border-r border-border bg-background transition-all duration-300",
        isMobile ? "w-[72px] px-2 py-4" : "w-[240px] px-4 py-6"
      )}>
        {/* Logo */}
        <div className="px-3 mb-8">
          {isMobile ? (
            <div className="text-2xl font-semibold">Ig</div>
          ) : (
            <div className="text-2xl font-semibold">Instagram</div>
          )}
        </div>
        
        {/* Navigation items */}
        <div className="flex flex-col gap-1">
          <NavItem to="/" icon={<Home />} label="Home" isMobile={isMobile} />
          <NavItem to="/search" icon={<Search />} label="Search" isMobile={isMobile} />
          <NavItem to="/reels" icon={<Play />} label="Reels" isMobile={isMobile} />
          <NavItem to="/music" icon={<Music />} label="Music" isMobile={isMobile} />
          <NavItem to="/notifications" icon={<Heart />} label="Notifications" isMobile={isMobile} />
          <NavItem to="/create" icon={<Plus />} label="Create" isMobile={isMobile} />
          <NavItem to="/profile" icon={<User />} label="Profile" isMobile={isMobile} />
        </div>
      </div>
      
      {/* Main content */}
      <main className={cn(
        "flex-1 transition-all duration-300 animate-fade-in",
        isMobile ? "ml-[72px]" : "ml-[240px]"
      )}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
