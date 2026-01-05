import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Congregacoes from "./pages/Congregacoes";
import Ministerio from "./pages/Ministerio";
import Agenda from "./pages/Agenda";
import Reforcos from "./pages/Reforcos";
import Listas from "./pages/Listas";
import Contatos from "./pages/Contatos";
import Relatorios from "./pages/Relatorios";
import EBI from "./pages/EBI";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/congregacoes" element={<Congregacoes />} />
          <Route path="/ministerio" element={<Ministerio />} />
          <Route path="/reforcos" element={<Reforcos />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/resultados" element={<ComingSoon title="Resultados" description="Buscar os Eventos: Batismo, Santa Ceia e Ensaios Regionais, com relatório completo por instrumentos e categorias." />} />
          <Route path="/listas" element={<Listas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/ebi" element={<EBI />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
