import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import EmbedPage from "./pages/Embed.tsx";
import ClientDashboard from "./components/ClientDashboard";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // هاد اللعيبة كاتصاوب ID فريد للكليان بلا Login
    // وكايبقى مخبي فالمتصفح ديالو ديما
    if (!localStorage.getItem("lorpulse_user_id")) {
      const uniqueId = "user_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("lorpulse_user_id", uniqueId);
      console.log("Welcome to LorPulse! Your anonymous ID:", uniqueId);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/embed/chat" element={<EmbedPage />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;