import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Plus, MapPin, Clock, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Congregacao {
  id: string;
  nome: string;
  temRJM: boolean;
  cidade: string;
}

interface AgendamentoReforco {
  id: string;
  congregacaoId: string;
  congregacaoNome: string;
  data: Date;
  tipo: "culto" | "rjm" | "coleta";
  mes: string;
  ano: number;
}

// Dados de exemplo
const congregacoesData: Congregacao[] = [
  { id: "1", nome: "Congregação Central", temRJM: true, cidade: "São Paulo" },
  { id: "2", nome: "Congregação Norte", temRJM: true, cidade: "Guarulhos" },
  { id: "3", nome: "Congregação Sul", temRJM: false, cidade: "São Bernardo" },
  { id: "4", nome: "Congregação Leste", temRJM: true, cidade: "Santo André" },
  { id: "5", nome: "Congregação Oeste", temRJM: false, cidade: "Osasco" },
];

const agendamentosData: AgendamentoReforco[] = [
  {
    id: "1",
    congregacaoId: "1",
    congregacaoNome: "Congregação Central",
    data: new Date(2024, 0, 15),
    tipo: "culto",
    mes: "Janeiro",
    ano: 2024,
  },
  {
    id: "2",
    congregacaoId: "2",
    congregacaoNome: "Congregação Norte",
    data: new Date(2024, 0, 20),
    tipo: "rjm",
    mes: "Janeiro",
    ano: 2024,
  },
  {
    id: "3",
    congregacaoId: "4",
    congregacaoNome: "Congregação Leste",
    data: new Date(2024, 0, 25),
    tipo: "coleta",
    mes: "Janeiro",
    ano: 2024,
  },
];

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Reforcos() {
  const [selectedTab, setSelectedTab] = useState<"todos" | "culto" | "rjm" | "coleta">("todos");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedCongregacao, setSelectedCongregacao] = useState<string>("");
  const [selectedTipo, setSelectedTipo] = useState<string>("");
  const [agendamentos, setAgendamentos] = useState<AgendamentoReforco[]>(agendamentosData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredAgendamentos = agendamentos.filter((a) => {
    if (selectedTab === "todos") return true;
    return a.tipo === selectedTab;
  });

  const congregacaoSelecionada = congregacoesData.find(c => c.id === selectedCongregacao);

  // Verifica se a congregação já tem agendamento no mês
  const verificarAgendamentoExistente = (congregacaoId: string, data: Date, tipo: string): boolean => {
    const mesAno = `${data.getMonth()}-${data.getFullYear()}`;
    const agendamentosNoMes = agendamentos.filter(a => {
      const mesAnoAgendamento = `${a.data.getMonth()}-${a.data.getFullYear()}`;
      return a.congregacaoId === congregacaoId && mesAnoAgendamento === mesAno;
    });

    // Permite múltiplos agendamentos apenas na semana de coleta
    if (tipo === "coleta") {
      return false;
    }

    return agendamentosNoMes.length > 0;
  };

  const handleAgendar = () => {
    if (!selectedCongregacao || !selectedDate || !selectedTipo) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
      });
      return;
    }

    // Verifica se é RJM e se a congregação tem RJM
    if (selectedTipo === "rjm" && !congregacaoSelecionada?.temRJM) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Esta congregação não possui Reunião de Jovens e Menores.",
      });
      return;
    }

    // Verifica agendamento existente
    if (verificarAgendamentoExistente(selectedCongregacao, selectedDate, selectedTipo)) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Esta congregação já possui um agendamento neste mês. Só é permitido marcar mais de um culto na semana de coleta.",
      });
      return;
    }

    const congregacao = congregacoesData.find(c => c.id === selectedCongregacao);
    const novoAgendamento: AgendamentoReforco = {
      id: Date.now().toString(),
      congregacaoId: selectedCongregacao,
      congregacaoNome: congregacao?.nome || "",
      data: selectedDate,
      tipo: selectedTipo as "culto" | "rjm" | "coleta",
      mes: meses[selectedDate.getMonth()],
      ano: selectedDate.getFullYear(),
    };

    setAgendamentos([...agendamentos, novoAgendamento]);
    
    toast({
      title: "Sucesso!",
      description: "Culto de reforço agendado com sucesso.",
    });

    // Limpar formulário
    setSelectedCongregacao("");
    setSelectedDate(undefined);
    setSelectedTipo("");
    setIsDialogOpen(false);
  };

  const tipoLabels: Record<string, string> = {
    "culto": "Culto",
    "rjm": "Reunião de Jovens e Menores",
    "coleta": "Coleta",
  };

  const tipoColors: Record<string, string> = {
    "culto": "bg-primary text-primary-foreground",
    "rjm": "bg-success text-success-foreground",
    "coleta": "bg-warning text-warning-foreground",
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Reforços</h1>
            <p className="page-subtitle">
              Agendamento de Cultos de Reforços e Coletas por mês
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={20} />
                Novo Agendamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Agendar Culto de Reforço</DialogTitle>
                <DialogDescription>
                  Escolha a congregação, data e tipo de culto. Lembre-se: só é permitido um agendamento por mês, exceto na semana de coleta.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Seleção de Congregação */}
                <div className="space-y-2">
                  <Label htmlFor="congregacao">Congregação</Label>
                  <Select value={selectedCongregacao} onValueChange={setSelectedCongregacao}>
                    <SelectTrigger id="congregacao">
                      <SelectValue placeholder="Selecione a congregação" />
                    </SelectTrigger>
                    <SelectContent>
                      {congregacoesData.map((cong) => (
                        <SelectItem key={cong.id} value={cong.id}>
                          {cong.nome} - {cong.cidade}
                          {cong.temRJM && <Badge className="ml-2" variant="outline">RJM</Badge>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seleção de Tipo */}
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Culto</Label>
                  <Select 
                    value={selectedTipo} 
                    onValueChange={setSelectedTipo}
                    disabled={!selectedCongregacao}
                  >
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="culto">Culto</SelectItem>
                      {congregacaoSelecionada?.temRJM && (
                        <SelectItem value="rjm">Reunião de Jovens e Menores</SelectItem>
                      )}
                      <SelectItem value="coleta">Coleta</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedCongregacao && !congregacaoSelecionada?.temRJM && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Esta congregação não possui Reunião de Jovens e Menores.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Calendário */}
                <div className="space-y-2">
                  <Label>Data do Culto</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* Alertas */}
                {selectedDate && selectedCongregacao && selectedTipo !== "coleta" && 
                  verificarAgendamentoExistente(selectedCongregacao, selectedDate, selectedTipo) && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Esta congregação já possui um agendamento em {meses[selectedDate.getMonth()]} de {selectedDate.getFullYear()}. 
                      Só é permitido marcar mais de um culto na semana de coleta.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAgendar}>
                  Agendar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Card */}
        <Card className="mb-6 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Regras de Agendamento</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Não é permitido marcar mais de um culto por mês, exceto se for semana de coleta</li>
                  <li>• Reunião de Jovens e Menores só pode ser agendada em congregações que possuam RJM</li>
                  <li>• Escolha a congregação e a data para agendar o atendimento</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs de Filtro */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as any)} className="mb-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="culto">Cultos</TabsTrigger>
            <TabsTrigger value="rjm">RJM</TabsTrigger>
            <TabsTrigger value="coleta">Coletas</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Lista de Agendamentos */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgendamentos.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredAgendamentos.map((agendamento, index) => (
              <Card
                key={agendamento.id}
                className="animate-slide-up hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{agendamento.congregacaoNome}</CardTitle>
                      <CardDescription className="mt-1">
                        {agendamento.mes} de {agendamento.ano}
                      </CardDescription>
                    </div>
                    <Badge className={tipoColors[agendamento.tipo]}>
                      {tipoLabels[agendamento.tipo]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon size={16} />
                      <span>{formatDate(agendamento.data)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={16} />
                      <span>19:30</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
