import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Download, MessageCircle, Filter, Printer, ChevronLeft, Plus, Edit } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFirestore } from "@/hooks/useFirestore";
import { useToast } from "@/hooks/use-toast";
import { formatDateBR } from "@/lib/dateUtils";

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
  const [isEventoDialogOpen, setIsEventoDialogOpen] = useState(false);
  const [isAvisoDialogOpen, setIsAvisoDialogOpen] = useState(false);
  const [avisos, setAvisos] = useState(""); // Avisos da lista
  const { toast } = useToast();
  
  const { data: eventosData, loading: loadingEventos, add: addEvento } = useFirestore<Evento>({ 
    collectionName: 'eventos-listas' 
  });
  const { data: batismosData, loading: loadingBatismos } = useFirestore<Batismo>({ 
    collectionName: 'batismos' 
  });

  const [formEvento, setFormEvento] = useState({
    tipo: "",
    data: "",
    local: "",
    participantes: 0,
    status: "pendente" as "confirmado" | "pendente" | "realizado",
  });

  const handleAddEvento = async () => {
    try {
      await addEvento(formEvento);
      toast({
        title: "Sucesso!",
        description: "Evento adicionado à lista.",
      });
      setIsEventoDialogOpen(false);
      setFormEvento({
        tipo: "",
        data: "",
        local: "",
        participantes: 0,
        status: "pendente",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o evento.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAvisos = () => {
    toast({
      title: "Sucesso!",
      description: "Avisos salvos com sucesso.",
    });
    setIsAvisoDialogOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Implementar download PDF se necessário
    toast({
      title: "Em desenvolvimento",
      description: "Funcionalidade de download PDF em breve.",
    });
  };

  const filteredEventos = eventosData.filter((e) => {
    const matchesSearch = e.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.local.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loadingEventos || loadingBatismos) {
    return (
      <MainLayout>
        <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando listas...</p>
        </div>
      </MainLayout>
    );
  }

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
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="gerenciar">Gerenciar Eventos</TabsTrigger>
            <TabsTrigger value="preview">Preview da Lista</TabsTrigger>
          </TabsList>

          {/* Gerenciar Eventos Tab */}
          <TabsContent value="gerenciar">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Eventos da Lista</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setIsAvisoDialogOpen(true)} variant="outline" className="gap-2">
                    <MessageCircle size={16} />
                    Editar Avisos
                  </Button>
                  <Button onClick={() => setIsEventoDialogOpen(true)} className="gap-2">
                    <Plus size={16} />
                    Adicionar Evento
                  </Button>
                </div>
              </div>

              {/* Filtros */}
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Buscar eventos..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="realizado">Realizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de Eventos */}
              <div className="grid gap-4">
                {filteredEventos.map((evento) => (
                  <Card key={evento.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{evento.tipo}</h3>
                            <Badge className={statusColors[evento.status]}>
                              {statusLabels[evento.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            <Calendar className="inline mr-1" size={14} />
                            {formatDateBR(new Date(evento.data))}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            📍 {evento.local}
                          </p>
                          {evento.participantes > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                              👥 {evento.participantes} participantes
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredEventos.length === 0 && (
                  <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Nenhum evento na lista ainda.</p>
                    <Button onClick={() => setIsEventoDialogOpen(true)} className="gap-2">
                      <Plus size={16} />
                      Adicionar Primeiro Evento
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <div className="bg-white p-8 rounded-lg shadow-lg print:shadow-none" id="preview-content">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">LISTA DE EVENTOS</h1>
                <p className="text-lg text-gray-600 capitalize">{currentMonth}</p>
              </div>

              {/* Avisos */}
              {avisos && (
                <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <h2 className="font-bold text-lg mb-2">📢 AVISOS IMPORTANTES</h2>
                  <div className="whitespace-pre-line text-sm">{avisos}</div>
                </div>
              )}

              {/* Eventos */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2">EVENTOS DO MÊS</h2>
                {eventosData.map((evento, index) => (
                  <div key={evento.id} className="border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{index + 1}. {evento.tipo}</h3>
                        <p className="text-gray-700 mt-1">
                          <strong>Data:</strong> {formatDateBR(new Date(evento.data))}
                        </p>
                        <p className="text-gray-700">
                          <strong>Local:</strong> {evento.local}
                        </p>
                        {evento.participantes > 0 && (
                          <p className="text-gray-700">
                            <strong>Participantes esperados:</strong> {evento.participantes}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-sm">
                        {statusLabels[evento.status]}
                      </Badge>
                    </div>
                  </div>
                ))}

                {eventosData.length === 0 && (
                  <p className="text-center text-gray-500 py-8">Nenhum evento cadastrado para este mês.</p>
                )}
              </div>

              {/* Batismos (se habilitado) */}
              {showBatismos && batismosData.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h2 className="text-2xl font-bold border-b-2 border-gray-300 pb-2">BATISMOS</h2>
                  <div className="grid gap-3">
                    {batismosData.map((batismo) => (
                      <div key={batismo.id} className="flex justify-between items-center border-b border-gray-200 pb-2">
                        <div>
                          <p className="font-semibold">{batismo.data}</p>
                          <p className="text-sm text-gray-600">{batismo.localidade}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{batismo.hora}</p>
                          <p className="text-xs text-gray-500">Ancião: {batismo.anciao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rodapé */}
              <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-600">
                <p>CCB Organiza - Sistema de Gestão Regional</p>
                <p className="mt-1">Gerado em {formatDateBR(new Date())}</p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-between items-center mt-6 print:hidden">
              <div className="flex items-center gap-2">
                <Switch
                  checked={showBatismos}
                  onCheckedChange={setShowBatismos}
                  id="show-batismos"
                />
                <Label htmlFor="show-batismos">Mostrar Batismos</Label>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleDownloadPDF} className="gap-2">
                  <Download size={16} />
                  Baixar PDF
                </Button>
                <Button onClick={handlePrint} className="gap-2">
                  <Printer size={16} />
                  Imprimir
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Dialog Adicionar Evento */}
        <Dialog open={isEventoDialogOpen} onOpenChange={setIsEventoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Evento à Lista</DialogTitle>
              <DialogDescription>
                Preencha os dados do evento
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo de Evento *</Label>
                <Input
                  id="tipo"
                  value={formEvento.tipo}
                  onChange={(e) => setFormEvento({ ...formEvento, tipo: e.target.value })}
                  placeholder="Ex: Batismo, Ensaio Regional..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formEvento.data}
                  onChange={(e) => setFormEvento({ ...formEvento, data: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="local">Local *</Label>
                <Input
                  id="local"
                  value={formEvento.local}
                  onChange={(e) => setFormEvento({ ...formEvento, local: e.target.value })}
                  placeholder="Ex: Sede Regional"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="participantes">Participantes Esperados</Label>
                <Input
                  id="participantes"
                  type="number"
                  value={formEvento.participantes}
                  onChange={(e) => setFormEvento({ ...formEvento, participantes: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formEvento.status}
                  onValueChange={(value: "confirmado" | "pendente" | "realizado") =>
                    setFormEvento({ ...formEvento, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="realizado">Realizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEventoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddEvento}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Editar Avisos */}
        <Dialog open={isAvisoDialogOpen} onOpenChange={setIsAvisoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Avisos da Lista</DialogTitle>
              <DialogDescription>
                Os avisos aparecerão no topo da lista impressa
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="avisos">Avisos</Label>
                <Textarea
                  id="avisos"
                  value={avisos}
                  onChange={(e) => setAvisos(e.target.value)}
                  placeholder="Digite os avisos importantes que devem aparecer na lista..."
                  rows={8}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAvisoDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveAvisos}>
                Salvar Avisos
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
