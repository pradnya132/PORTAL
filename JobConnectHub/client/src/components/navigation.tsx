import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { UserCircle, Briefcase, Home, LogOut } from "lucide-react";

export default function Navigation() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold cursor-pointer">JobPortal</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <Button variant="ghost" className="inline-flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link href="/jobs">
                <Button variant="ghost" className="inline-flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Jobs
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" className="inline-flex items-center">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button
              variant="ghost"
              onClick={() => logoutMutation.mutate()}
              className="inline-flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
