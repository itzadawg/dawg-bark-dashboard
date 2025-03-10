
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Minigame from "./pages/Minigame";
import Presale from "./pages/Presale";
import PresaleApplication from "./pages/PresaleApplication";
import AdminDashboard from "./pages/AdminDashboard";
import DawgBoard from "./pages/DawgBoard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shameboard" element={<Index />} />
          <Route path="/presale" element={<Presale />} />
          <Route path="/presale-application" element={<PresaleApplication />} />
          <Route path="/minigame" element={<Minigame />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dawgboard" element={<DawgBoard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
