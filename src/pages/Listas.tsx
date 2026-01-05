import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Search, Download, Plus, Printer, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore } from "@/hooks/useFirestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateBR } from "@/lib/dateUtils";

interface Evento {
  id: string;
  tipo: string;
  data: string;
  local: string;
  participantes: number;
  status: "confirmado" | "pendente" | "realizado";
}

interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  dataCriacao: string;
}

const statusColors: Record<string, string> = {
  "confirmado": "bg-success/10 text-success border-success/20",
  "pendente": "bg-warning/10 text-warning border-warning/20",
  "realizado": "bg-muted text-muted-foreground border-muted",
};

export default function Listas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [activeTab, setActiveTab] = useState("eventos");
  const [isEventoDialogOpen, setIsEventoDialogOpen] = useState(false);
  const [isAvisoDialogOpen, setIsAvisoDialogOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [editingAviso, setEditingAviso] = useState<Aviso | null>(null);
  const { toast } = useToast();
  
  const { data: eventosData, loading: loadingEventos, add: addEvento, update: updateEvento, remove: removeEvento } = useFirestore<Evento>({ 
    collectionName: 'eventos-listas' 
  });
  const { data: avisosData, loading: loadingAvisos, add: addAviso, update: updateAviso, remove: removeAviso } = useFirestore<Aviso>({ 
    collectionName: 'avisos' 
  });

  const [formEvento, setFormEvento] = useState({
    tipo: "",
    data: "",
    local: "",
    participantes: 0,
    status: "pendente" as "confirmado" | "pendente" | "realizado",
  });

  const [formAviso, setFormAviso] = useState({
    titulo: "",
    conteudo: "",
  });

  const handleSaveEvento = async () => {
    try {
      if (editingEvento) {
        await updateEvento(editingEvento.id, formEvento);
        toast({ title: "Sucesso!", description: "Evento atualizado." });
      } else {
        await addEvento(formEvento);
        toast({ title: "Sucesso!", description: "Evento adicionado." });
      }
      setIsEventoDialogOpen(false);
      setEditingEvento(null);
      setFormEvento({
        tipo: "",
        data: "",
        local: "",
        participantes: 0,
        status: "pendente",
      });
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao salvar evento.", variant: "destructive" });
    }
  };

  const handleSaveAviso = async () => {
    try {
      const dataToSave = {
        ...formAviso,
        dataCriacao: editingAviso?.dataCriacao || new Date().toISOString(),
      };

      if (editingAviso) {
        await updateAviso(editingAviso.id, dataToSave);
        toast({ title: "Sucesso!", description: "Aviso atualizado." });
      } else {
        await addAviso(dataToSave);
        toast({ title: "Sucesso!", description: "Aviso adicionado." });
      }
      setIsAvisoDialogOpen(false);
      setEditingAviso(null);
      setFormAviso({ titulo: "", conteudo: "" });
    } catch (error) {
      toast({ title: "Erro", description: "Erro ao salvar aviso.", variant: "destructive" });
    }
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    const dataAtual = formatDateBR(new Date());

    // Cabeçalho
    doc.setFontSize(18);
    doc.text("Lista de Eventos e Avisos", 14, 20);
    doc.setFontSize(11);
    doc.text(`Data: ${dataAtual}`, 14, 28);

    // Eventos
    if (eventosData.length > 0) {
      doc.setFontSize(14);
      doc.text("Eventos", 14, 40);

      const tableData = eventosData.map(e => [
        e.tipo,
        formatDateBR(e.data),
        e.local,
        e.participantes.toString(),
        e.status
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['Tipo', 'Data', 'Local', 'Participantes', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
      });
    }

    // Avisos
    if (avisosData.length > 0) {
      const yPos = eventosData.length > 0 ? (doc as any).lastAutoTable.finalY + 15 : 45;
      doc.setFontSize(14);
      doc.text("Avisos", 14, yPos);

      let currentY = yPos + 7;
      avisosData.forEach((aviso, index) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFontSize(12);
        doc.text(`${index + 1}. ${aviso.titulo}`, 14, currentY);
        currentY += 6;
        doc.setFontSize(10);
        const lines = doc.splitTextToSize(aviso.conteudo, 180);
        doc.text(lines, 20, currentY);
        currentY += lines.length * 5 + 5;
      });
    }

    doc.save(`lista-eventos-${Date.now()}.pdf`);
  };

  const filteredEventos = eventosData.filter((e) => {
    const matchesSearch = e.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.local.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todos" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loadingEventos || loadingAvisos) {
    return (
      <MainLayout>
        <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando listas...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="page-title">Listas de Eventos</h1>
            <p className="page-subtitle">Gerencie eventos e avisos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={gerarPDF} className="gap-2">
              <Download size={16} />
              Gerar PDF
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="avisos">Avisos</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Eventos Tab */}
          <TabsContent value="eventos" className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <div className="flex gap-4 flex-1">
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
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="realizado">Realizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={() => {
                setEditingEvento(null);
                setFormEvento({ tipo: "", data: "", local: "", participantes: 0, status: "pendente" });
                setIsEventoDialogOpen(true);
              }} className="gap-2">
                <Plus size={16} />
                Adicionar Evento
              </Button>
            </div>

            <div className="space-y-3">
              {filteredEventos.map((evento) => (
                <Card key={evento.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{evento.tipo}</h3>
                          <Badge className={statusColors[evento.status]}>
                            {evento.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p><Calendar size={14} className="inline mr-2" />{formatDateBR(evento.data)}</p>
                          <p>{evento.local}</p>
                          <p>Participantes: {evento.participantes}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingEvento(evento);
                            setFormEvento({
                              tipo: evento.tipo,
                              data: evento.data,
                              local: evento.local,
                              participantes: evento.participantes,
                              status: evento.status,
                            });
                            setIsEventoDialogOpen(true);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeEvento(evento.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredEventos.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum evento encontrado
                </div>
              )}
            </div>
          </TabsContent>

          {/* Avisos Tab */}
          <TabsContent value="avisos" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => {
                setEditingAviso(null);
                setFormAviso({ titulo: "", conteudo: "" });
                setIsAvisoDialogOpen(true);
              }} className="gap-2">
                <Plus size={16} />
                Adicionar Aviso
              </Button>
            </div>

            <div className="space-y-3">
              {avisosData.map((aviso) => (
                <Card key={aviso.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{aviso.titulo}</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">{aviso.conteudo}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Criado em: {formatDateBR(aviso.dataCriacao)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingAviso(aviso);
                            setFormAviso({
                              titulo: aviso.titulo,
                              conteudo: aviso.conteudo,
                            });
                            setIsAvisoDialogOpen(true);
                          }}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeAviso(aviso.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {avisosData.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum aviso cadastrado
                </div>
              )}
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="text-center border-b pb-4">
                    <h2 className="text-2xl font-bold">Lista de Eventos</h2>
                    <p className="text-muted-foreground">{formatDateBR(new Date())}</p>
                  </div>

                  {eventosData.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Eventos</h3>
                      <div className="space-y-3">
                        {eventosData.map((evento) => (
                          <div key={evento.id} className="border-l-4 border-primary pl-4">
                            <p className="font-semibold">{evento.tipo}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDateBR(evento.data)} - {evento.local}
                            </p>
                            <p className="text-sm">Participantes: {evento.participantes}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {avisosData.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-semibold mb-4">Avisos</h3>
                      <div className="space-y-4">
                        {avisosData.map((aviso, index) => (
                          <div key={aviso.id}>
                            <p className="font-semibold">{index + 1}. {aviso.titulo}</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-line pl-4">
                              {aviso.conteudo}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {eventosData.length === 0 && avisosData.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      Nenhum evento ou aviso para exibir
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog Evento */}
        <Dialog open={isEventoDialogOpen} onOpenChange={setIsEventoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvento ? "Editar Evento" : "Novo Evento"}</DialogTitle>
              <DialogDescription>Preencha os dados do evento</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Tipo *</Label>
                <Input value={formEvento.tipo} onChange={(e) => setFormEvento({...formEvento, tipo: e.target.value})} placeholder="Ex: Batismo" />
              </div>
              <div className="grid gap-2">
                <Label>Data *</Label>
                <Input type="date" value={formEvento.data} onChange={(e) => setFormEvento({...formEvento, data: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Local *</Label>
                <Input value={formEvento.local} onChange={(e) => setFormEvento({...formEvento, local: e.target.value})} placeholder="Ex: Sede Regional" />
              </div>
              <div className="grid gap-2">
                <Label>Participantes *</Label>
                <Input type="number" value={formEvento.participantes} onChange={(e) => setFormEvento({...formEvento, participantes: Number(e.target.value)})} />
              </div>
              <div className="grid gap-2">
                <Label>Status *</Label>
                <Select value={formEvento.status} onValueChange={(value: any) => setFormEvento({...formEvento, status: value})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="realizado">Realizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEventoDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveEvento}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Aviso */}
        <Dialog open={isAvisoDialogOpen} onOpenChange={setIsAvisoDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAviso ? "Editar Aviso" : "Novo Aviso"}</DialogTitle>
              <DialogDescription>Preencha os dados do aviso</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Título *</Label>
                <Input value={formAviso.titulo} onChange={(e) => setFormAviso({...formAviso, titulo: e.target.value})} placeholder="Ex: Importante" />
              </div>
              <div className="grid gap-2">
                <Label>Conteúdo *</Label>
                <Textarea value={formAviso.conteudo} onChange={(e) => setFormAviso({...formAviso, conteudo: e.target.value})} placeholder="Digite o aviso..." rows={5} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAvisoDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSaveAviso}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
