import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFirestore } from "@/hooks/useFirestore";
import { useToast } from "@/hooks/use-toast";

interface Membro {
  id: string;
  nome: string;
  ministerio: string;
  congregacao: string;
  telefone: string;
  email?: string;
  status: "ativo" | "inativo";
}

const ministerioColors: Record<string, string> = {
  "Ancião": "bg-primary text-primary-foreground",
  "Cooperador": "bg-secondary text-secondary-foreground",
  "Cooperador de Jovens": "bg-info text-info-foreground",
  "Cooperadora de Menores": "bg-success text-success-foreground",
  "Diácono": "bg-warning text-warning-foreground",
  "Oficial": "bg-muted text-muted-foreground",
};

const ministerioOptions = [
  "Ancião",
  "Cooperador",
  "Cooperador de Jovens",
  "Cooperadora de Menores",
  "Diácono",
  "Oficial",
  "Organista",
  "Porteiro",
  "Secretário",
];

export default function Ministerio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMinisterio, setFilterMinisterio] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingMembro, setEditingMembro] = useState<Membro | null>(null);
  const [viewingMembro, setViewingMembro] = useState<Membro | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { data: ministerioData, loading, add, update, remove } = useFirestore<Membro>({ 
    collectionName: 'ministerio' 
  });

  const [formData, setFormData] = useState({
    nome: "",
    ministerio: "",
    congregacao: "",
    telefone: "",
    email: "",
    status: "ativo" as "ativo" | "inativo",
  });

  const handleOpenDialog = (membro?: Membro) => {
    if (membro) {
      setEditingMembro(membro);
      setFormData({
        nome: membro.nome,
        ministerio: membro.ministerio,
        congregacao: membro.congregacao,
        telefone: membro.telefone,
        email: membro.email || "",
        status: membro.status,
      });
    } else {
      setEditingMembro(null);
      setFormData({
        nome: "",
        ministerio: "",
        congregacao: "",
        telefone: "",
        email: "",
        status: "ativo",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMembro(null);
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        email: formData.email || undefined,
      };
      
      if (editingMembro) {
        await update(editingMembro.id, dataToSave);
        toast({
          title: "Sucesso!",
          description: "Membro atualizado com sucesso.",
        });
      } else {
        await add(dataToSave);
        toast({
          title: "Sucesso!",
          description: "Membro adicionado com sucesso.",
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o membro.",
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
        description: "Membro excluído com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o membro.",
        variant: "destructive",
      });
    }
  };

  const filteredMembros = ministerioData.filter((m) => {
    const matchesSearch = m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.congregacao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterMinisterio || m.ministerio === filterMinisterio;
    return matchesSearch && matchesFilter;
  });

  const ministerios = [...new Set(ministerioData.map((m) => m.ministerio))];

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando membros do ministério...</p>
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
            <h1 className="page-title">Ministério</h1>
            <p className="page-subtitle">
              Gerencie os membros do ministério da região
            </p>
          </div>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Novo Membro
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Buscar por nome ou congregação..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                {filterMinisterio || "Todos os ministérios"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterMinisterio(null)}>
                Todos os ministérios
              </DropdownMenuItem>
              {ministerios.map((m) => (
                <DropdownMenuItem key={m} onClick={() => setFilterMinisterio(m)}>
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {ministerios.slice(0, 4).map((min) => {
            const count = ministerioData.filter((m) => m.ministerio === min && m.status === "ativo").length;
            return (
              <div key={min} className="bg-card rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">{min}</p>
                <p className="text-2xl font-bold font-display mt-1">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nome</TableHead>
                <TableHead>Ministério</TableHead>
                <TableHead>Congregação</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembros.map((membro, index) => (
                <TableRow
                  key={membro.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TableCell className="font-medium">{membro.nome}</TableCell>
                  <TableCell>
                    <Badge className={ministerioColors[membro.ministerio] || ""}>
                      {membro.ministerio}
                    </Badge>
                  </TableCell>
                  <TableCell>{membro.congregacao}</TableCell>
                  <TableCell className="text-muted-foreground">{membro.telefone}</TableCell>
                  <TableCell>
                    <Badge variant={membro.status === "ativo" ? "default" : "secondary"}>
                      {membro.status === "ativo" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleOpenDialog(membro)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setViewingMembro(membro);
                          setIsDetailsDialogOpen(true);
                        }}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            setDeletingId(membro.id);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredMembros.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum membro encontrado.</p>
          </div>
        )}

        {/* Dialog de Adicionar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMembro ? "Editar Membro" : "Novo Membro"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do membro do ministério
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ministerio">Ministério *</Label>
                  <Select 
                    value={formData.ministerio} 
                    onValueChange={(value) => setFormData({ ...formData, ministerio: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ministério" />
                    </SelectTrigger>
                    <SelectContent>
                      {ministerioOptions.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="congregacao">Congregação *</Label>
                  <Input
                    id="congregacao"
                    value={formData.congregacao}
                    onChange={(e) => setFormData({ ...formData, congregacao: e.target.value })}
                    placeholder="Ex: Central"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="exemplo@email.com"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status *</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "ativo" | "inativo") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingMembro ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Detalhes */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes do Membro</DialogTitle>
            </DialogHeader>
            
            {viewingMembro && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Nome</Label>
                  <p className="font-medium">{viewingMembro.nome}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-muted-foreground">Ministério</Label>
                    <Badge className={ministerioColors[viewingMembro.ministerio] || "w-fit"}>
                      {viewingMembro.ministerio}
                    </Badge>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-muted-foreground">Congregação</Label>
                    <p className="font-medium">{viewingMembro.congregacao}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-muted-foreground">Telefone</Label>
                    <p className="font-medium">{viewingMembro.telefone}</p>
                  </div>

                  {viewingMembro.email && (
                    <div className="grid gap-2">
                      <Label className="text-muted-foreground">E-mail</Label>
                      <p className="font-medium">{viewingMembro.email}</p>
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={viewingMembro.status === "ativo" ? "default" : "secondary"} className="w-fit">
                    {viewingMembro.status === "ativo" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setIsDetailsDialogOpen(false)}>
                Fechar
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
                Tem certeza que deseja excluir este membro do ministério? Esta ação não pode ser desfeita.
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
