import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, MapPin, Clock, Users, BookOpen, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Congregacao {
  id: string;
  nome: string;
  endereco: string;
  cidade: string;
  uf: string;
  diasCulto: string[];
  horario: string;
  temEBI: boolean;
  capacidade: number;
  ocupacao: number;
}

export default function Congregacoes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCongregacao, setEditingCongregacao] = useState<Congregacao | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { data: congregacoes, loading, add, update, remove } = useFirestore<Congregacao>({ 
    collectionName: 'congregacoes' 
  });

  const [formData, setFormData] = useState({
    nome: "",
    endereco: "",
    cidade: "",
    uf: "",
    diasCulto: [] as string[],
    horario: "",
    temEBI: false,
    capacidade: 0,
    ocupacao: 0,
  });

  const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const handleOpenDialog = (congregacao?: Congregacao) => {
    if (congregacao) {
      setEditingCongregacao(congregacao);
      setFormData({
        nome: congregacao.nome,
        endereco: congregacao.endereco,
        cidade: congregacao.cidade,
        uf: congregacao.uf,
        diasCulto: congregacao.diasCulto,
        horario: congregacao.horario,
        temEBI: congregacao.temEBI,
        capacidade: congregacao.capacidade,
        ocupacao: congregacao.ocupacao,
      });
    } else {
      setEditingCongregacao(null);
      setFormData({
        nome: "",
        endereco: "",
        cidade: "",
        uf: "",
        diasCulto: [],
        horario: "",
        temEBI: false,
        capacidade: 0,
        ocupacao: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCongregacao(null);
  };

  const handleSave = async () => {
    try {
      if (editingCongregacao) {
        await update(editingCongregacao.id, formData);
        toast({
          title: "Sucesso!",
          description: "Congregação atualizada com sucesso.",
        });
      } else {
        await add(formData);
        toast({
          title: "Sucesso!",
          description: "Congregação adicionada com sucesso.",
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a congregação.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    
    try {
      await remove(deletingId);
      toast({
        title: "Sucesso!",
        description: "Congregação excluída com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a congregação.",
        variant: "destructive",
      });
    }
  };

  const handleToggleDia = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      diasCulto: prev.diasCulto.includes(dia)
        ? prev.diasCulto.filter(d => d !== dia)
        : [...prev.diasCulto, dia]
    }));
  };

  const filteredCongregacoes = congregacoes.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando congregações...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Congregações</h1>
            <p className="page-subtitle">
              Gerencie as congregações da região
            </p>
          </div>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Nova Congregação
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar por nome ou cidade..."
            className="pl-10 max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid de Congregações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCongregacoes.map((congregacao, index) => (
            <Card
              key={congregacao.id}
              className="animate-slide-up hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{congregacao.nome}</CardTitle>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(congregacao)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        setDeletingId(congregacao.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Endereço */}
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-foreground">{congregacao.endereco}</p>
                    <p className="text-muted-foreground">{congregacao.cidade} - {congregacao.uf}</p>
                  </div>
                </div>

                {/* Horário */}
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-primary" />
                  <span>{congregacao.diasCulto.join(", ")} às {congregacao.horario}</span>
                </div>

                {/* Capacidade */}
                <div className="flex items-center gap-2 text-sm">
                  <Users size={16} className="text-primary" />
                  <span>Capacidade: {congregacao.capacidade} pessoas</span>
                </div>

                {/* Ocupação */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ocupação</span>
                    <span className="font-medium">{congregacao.ocupacao}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${congregacao.ocupacao}%` }}
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="flex gap-2 flex-wrap">
                  {congregacao.temEBI && (
                    <Badge variant="secondary" className="gap-1">
                      <BookOpen size={12} />
                      EBI Ativo
                    </Badge>
                  )}
                  {congregacao.ocupacao >= 80 && (
                    <Badge variant="destructive">Alta Ocupação</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCongregacoes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma congregação encontrada.</p>
          </div>
        )}

        {/* Dialog de Adicionar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCongregacao ? "Editar Congregação" : "Nova Congregação"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da congregação
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Congregação Central"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Ex: Rua Principal, 123"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    placeholder="Ex: São Paulo"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="uf">UF *</Label>
                  <Input
                    id="uf"
                    value={formData.uf}
                    onChange={(e) => setFormData({ ...formData, uf: e.target.value.toUpperCase() })}
                    placeholder="Ex: SP"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Dias de Culto *</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {diasSemana.map((dia) => (
                    <div key={dia} className="flex items-center space-x-2">
                      <Checkbox
                        id={dia}
                        checked={formData.diasCulto.includes(dia)}
                        onCheckedChange={() => handleToggleDia(dia)}
                      />
                      <label
                        htmlFor={dia}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {dia}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="horario">Horário dos Cultos *</Label>
                <Input
                  id="horario"
                  type="time"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="capacidade">Capacidade *</Label>
                  <Input
                    id="capacidade"
                    type="number"
                    value={formData.capacidade}
                    onChange={(e) => setFormData({ ...formData, capacidade: Number(e.target.value) })}
                    placeholder="Ex: 200"
                    min="0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ocupacao">Ocupação (%) *</Label>
                  <Input
                    id="ocupacao"
                    type="number"
                    value={formData.ocupacao}
                    onChange={(e) => setFormData({ ...formData, ocupacao: Number(e.target.value) })}
                    placeholder="Ex: 75"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="temEBI"
                  checked={formData.temEBI}
                  onCheckedChange={(checked) => setFormData({ ...formData, temEBI: checked as boolean })}
                />
                <label
                  htmlFor="temEBI"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Possui EBI (Escola Bíblica Infantil) ativo
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingCongregacao ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta congregação? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDeletingId(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
