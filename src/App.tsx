
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StarrySplashScreen from "@/components/StarrySplashScreen";
import Index from "./pages/Index";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AffirmationPage from "./pages/AffirmationPage";
import DocumentPreviewPage from "./pages/DocumentPreviewPage";
import TestDocumentPage from "./pages/TestDocumentPage";
import Analytics404 from "./pages/Analytics404";
import PaymentTest from "./pages/PaymentTest";
import PlatWidgetTest from "./pages/PlatWidgetTest";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(false);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <StarrySplashScreen onComplete={handleSplashComplete} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/affirmation" element={<AffirmationPage />} />
            <Route path="/document" element={<DocumentPreviewPage />} />
            <Route path="/test-document" element={<TestDocumentPage />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/admin/404-analytics" element={<Analytics404 />} />
            <Route path="/test/payment" element={<PaymentTest />} />
            <Route path="/test/1plat-widget" element={<PlatWidgetTest />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;