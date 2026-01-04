import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Congregacoes from "./pages/Congregacoes";
import Ministerio from "./pages/Ministerio";
import Agenda from "./pages/Agenda";
import Listas from "./pages/Listas";
import Contatos from "./pages/Contatos";
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
          <Route path="/reforcos" element={<ComingSoon title="Reforços" description="Agendamento de Cultos de Reforços de Coletas por mês, onde os irmãos escolhem a congregação e agenda o atendimento." />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/resultados" element={<ComingSoon title="Resultados" description="Buscar os Eventos: Batismo, Santa Ceia e Ensaios Regionais, com relatório completo por instrumentos e categorias." />} />
          <Route path="/listas" element={<Listas />} />
          <Route path="/relatorios" element={<ComingSoon title="Relatórios" description="Filtros de resultados e geração de gráficos e documentos em PDF." />} />
          <Route path="/ebi" element={<ComingSoon title="EBI" description="Repositório de atividades para os Espaço Bíblicos Infantis cadastrados." />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
