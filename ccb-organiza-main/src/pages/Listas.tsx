import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Download, MessageCircle, Filter, Printer, ChevronLeft, Plus } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface Evento {
  id: string;
  tipo: string;
  data: string;
  local: string;
  participantes: number;
  status: "confirmado" | "pendente" | "realizado";
}

interface Batismo {
  id: string;
  data: string;
  hora: string;
  localidade: string;
  anciao: string;
}

const eventosData: Evento[] = [
  { id: "1", tipo: "Batismo", data: "2024-01-15", local: "Sede Regional", participantes: 23, status: "realizado" },
  { id: "2", tipo: "Ensaio Regional", data: "2024-01-28", local: "Congregação Central", participantes: 45, status: "confirmado" },
  { id: "3", tipo: "Reunião Ministerial", data: "2024-02-03", local: "Sede Administrativa", participantes: 30, status: "pendente" },
  { id: "4", tipo: "Santa Ceia", data: "2024-01-21", local: "Todas as congregações", participantes: 150, status: "realizado" },
  { id: "5", tipo: "Culto de Mocidade", data: "2024-02-10", local: "Congregação Norte", participantes: 60, status: "confirmado" },
];

const batismosData: Batismo[] = [
  { id: "1", data: "12/12 SEX", hora: "19:30", localidade: "POV. CAPÃO DA CRUZ (ABADIA DOS DOURADOS)", anciao: "JOÃO DE DEUS" },
  { id: "2", data: "12/12 SEX", hora: "19:30", localidade: "MATEIRO (COROMANDEL)", anciao: "JOAQUIM AMARAL" },
  { id: "3", data: "13/12 SÁB", hora: "19:00", localidade: "ITUIUTABA - CENTRAL", anciao: "VINÍCIUS CARVALHO" },
  { id: "4", data: "14/12 DOM", hora: "10:00", localidade: "MONTE CARMELO - ARRAIAL DOS GONÇALVES", anciao: "JEOVÁ DE OLIVEIRA" },
  { id: "5", data: "14/12 DOM", hora: "18:30", localidade: "ARAPORÃ - CENTRAL", anciao: "ROBSON LUIZ" },
  { id: "6", data: "14/12 DOM", hora: "18:30", localidade: "CAMPO FLORIDO - CENTRAL", anciao: "AGNELO DONIZETTI" },
  { id: "7", data: "14/12 DOM", hora: "18:30", localidade: "CENTRALINA - CENTRAL", anciao: "JOÃO GONZAGA" },
  { id: "8", data: "14/12 DOM", hora: "18:30", localidade: "DELTA - CENTRAL", anciao: "HEBERT LUIS" },
  { id: "9", data: "14/12 DOM", hora: "18:30", localidade: "UBERLÂNDIA - DISTRITO TAPUIRAMA", anciao: "JOSÉ GERALDO" },
  { id: "10", data: "20/12 SÁB", hora: "19:00", localidade: "MONTE CARMELO - CENTRAL", anciao: "RODRIGO SILVA" },
];

const statusColors: Record<string, string> = {
  "confirmado": "bg-success/10 text-success border-success/20",
  "pendente": "bg-warning/10 text-warning border-warning/20",
  "realizado": "bg-muted text-muted-foreground border-muted",
};

const statusLabels: Record<string, string> = {
  "confirmado": "Confirmado",
  "pendente": "Pendente",
  "realizado": "Realizado",
};

export default function Listas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [activeTab, setActiveTab] = useState("preview");
  const [showBatismos, setShowBatismos] = useState(true);

  const filteredEventos = eventosData.filter((e) => {
    const matchesSearch = e.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.local.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  const currentMonth = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft size={16} />
              Voltar
            </Button>
          </div>
          <p className="text-muted-foreground capitalize">{currentMonth}</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0">
            <TabsTrigger 
              value="reunioes" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Reuniões
            </TabsTrigger>
            <TabsTrigger 
              value="avisos" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Avisos
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
            >
              Preview
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab */}
          <TabsContent value="preview" className="mt-0">
            {/* Preview Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Select defaultValue="todos">
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Todos setores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos setores</SelectItem>
                  <SelectItem value="norte">Setor Norte</SelectItem>
                  <SelectItem value="sul">Setor Sul</SelectItem>
                  <SelectItem value="leste">Setor Leste</SelectItem>
                  <SelectItem value="oeste">Setor Oeste</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="todas">
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Todas categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas categorias</SelectItem>
                  <SelectItem value="batismos">Batismos</SelectItem>
                  <SelectItem value="ensaios">Ensaios</SelectItem>
                  <SelectItem value="reunioes">Reuniões</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="1">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="1 página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 página</SelectItem>
                  <SelectItem value="2">2 páginas</SelectItem>
                  <SelectItem value="todas">Todas</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="100">
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="100%" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50">50%</SelectItem>
                  <SelectItem value="75">75%</SelectItem>
                  <SelectItem value="100">100%</SelectItem>
                  <SelectItem value="150">150%</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Plus size={18} />
              </Button>

              <Button className="gap-2">
                <Printer size={16} />
              </Button>
            </div>

            {/* Document Preview */}
            <Card className="bg-white dark:bg-card shadow-lg">
              <CardContent className="p-8">
                {/* Document Header */}
                <div className="text-center mb-8">
                  <h1 className="text-xl font-bold text-foreground tracking-wide">
                    CONGREGAÇÃO CRISTÃ NO BRASIL
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    REGIONAL UBERLÂNDIA - DEZEMBRO DE 2025
                  </p>
                  <p className="text-sm text-muted-foreground">
                    LISTA DE BATISMOS E DIVERSOS
                  </p>
                </div>

                {/* Batismos Section */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="bg-primary/10 px-4 py-3 flex items-center justify-between">
                    <h2 className="font-bold text-primary text-center flex-1">BATISMOS</h2>
                    <Switch 
                      checked={showBatismos} 
                      onCheckedChange={setShowBatismos}
                    />
                  </div>

                  {showBatismos && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs w-28">
                              Data
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs w-20">
                              Hora
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs">
                              Localidade
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-muted-foreground uppercase text-xs w-48">
                              Ancião
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {batismosData.map((batismo, index) => (
                            <tr 
                              key={batismo.id} 
                              className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                            >
                              <td className="px-4 py-2.5 font-medium">{batismo.data}</td>
                              <td className="px-4 py-2.5 text-primary font-medium">{batismo.hora}</td>
                              <td className="px-4 py-2.5 text-primary">{batismo.localidade}</td>
                              <td className="px-4 py-2.5 text-primary">{batismo.anciao}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reuniões Tab */}
          <TabsContent value="reunioes" className="mt-0">
            {/* Original Listas Content */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                      placeholder="Buscar por tipo ou local..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter size={16} className="mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os status</SelectItem>
                      <SelectItem value="confirmado">Confirmados</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                      <SelectItem value="realizado">Realizados</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="date" className="w-full sm:w-48" />
                </div>
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold font-display text-primary">{eventosData.filter(e => e.status === "confirmado").length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Confirmados</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold font-display text-warning">{eventosData.filter(e => e.status === "pendente").length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Pendentes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold font-display text-muted-foreground">{eventosData.filter(e => e.status === "realizado").length}</p>
                  <p className="text-sm text-muted-foreground mt-1">Realizados</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Eventos */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Data</th>
                      <th>Local</th>
                      <th>Participantes</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEventos.map((evento, index) => (
                      <tr
                        key={evento.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="font-medium">{evento.tipo}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-muted-foreground" />
                            {formatDate(evento.data)}
                          </div>
                        </td>
                        <td>{evento.local}</td>
                        <td>{evento.participantes}</td>
                        <td>
                          <Badge variant="outline" className={statusColors[evento.status]}>
                            {statusLabels[evento.status]}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Download size={14} />
                              PDF
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageCircle size={14} />
                              WhatsApp
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredEventos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum evento encontrado com os filtros aplicados.</p>
              </div>
            )}
          </TabsContent>

          {/* Avisos Tab */}
          <TabsContent value="avisos" className="mt-0">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhum aviso cadastrado.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
