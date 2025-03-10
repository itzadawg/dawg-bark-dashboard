
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "../components/dashboard/Header";

const NotFound = () => {
  const location = useLocation();
  const validRoutes = ["/", "/shameboard", "/presale", "/presale-application", "/minigame"];
  const isKnownRoute = validRoutes.includes(location.pathname);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      {isKnownRoute && <Header />}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-8 neo-brutal-border bg-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-6">
            {isKnownRoute 
              ? "If you're seeing this after a page refresh, please use the navigation menu to return to this page."
              : "Oops! Looks like you've followed a broken link or entered a URL that doesn't exist on this site."
            }
          </p>
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full neo-brutal-border bg-dawg hover:bg-dawg-secondary">
                Return to Home
              </Button>
            </Link>
            {isKnownRoute && (
              <p className="text-sm text-gray-500 mt-4">
                Direct page refreshes don't work with this application's routing.
                Please use the navigation menu to navigate between pages.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
