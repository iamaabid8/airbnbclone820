import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
interface NavigationProps {
  user: any;
  onLogout: () => void;
}
export const Navigation = ({
  user,
  onLogout
}: NavigationProps) => {
  return <nav className="fixed top-0 w-full glass-effect z-50 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-Airbnb-primary font-heading text-2xl font-bold">
          airbnb
        </div>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/host" className="nav-link">Become a Host</Link>
          {user ? <div className="flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="ghost" className="nav-link">
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" className="nav-link" onClick={onLogout}>
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div> : <Link to="/auth">
              <Button variant="ghost" className="nav-link">
                <User className="w-5 h-5 mr-2" />
                Sign In
              </Button>
            </Link>}
        </div>
      </div>
    </nav>;
};