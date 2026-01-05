import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Download, 
  Upload, 
  FileText, 
  Image as ImageIcon,
  Trash2,
  Eye
} from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { formatDateBR } from "@/lib/dateUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Atividade {
  id: string;
  titulo: string;
  descricao: string;
  faixaEtaria: string;
  categoria: string;
  materiais: string;
  instrucoes: string;
  arquivoUrl?: string;
  dataCriacao: string;
}

const faixasEtarias = [
  "3-5 anos",
  "6-8 anos",
  "9-11 anos",
  "12-14 anos",
  "Todas as idades"
];

const categorias = [
  "Histórias Bíblicas",
  "Atividades Manuais",
  "Jogos Educativos",
  "Música e Louvor",
  "Desenhos para Colorir",
  "Versículos",
  "Teatros",
  "Dinâmicas"
];

export default function EBI() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("todas");
  const [filterFaixaEtaria, setFilterFaixaEtaria] = useState<string>("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState<Atividade | null>(null);
  const [viewingAtividade, setViewingAtividade] = useState<Atividade | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: atividades, loading, add, update, remove } = useFirestore<Atividade>({ 
    collectionName: 'ebi-atividades' 
  });

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    faixaEtaria: "",
    categoria: "",
    materiais: "",
    instrucoes: "",
    arquivoUrl: "",
  });

  const handleOpenDialog = (atividade?: Atividade) => {
    if (atividade) {
      setEditingAtividade(atividade);
      setFormData({
        titulo: atividade.titulo,
        descricao: atividade.descricao,
        faixaEtaria: atividade.faixaEtaria,
        categoria: atividade.categoria,
        materiais: atividade.materiais,
        instrucoes: atividade.instrucoes,
        arquivoUrl: atividade.arquivoUrl || "",
      });
    } else {
      setEditingAtividade(null);
      setFormData({
        titulo: "",
        descricao: "",
        faixaEtaria: "",
        categoria: "",
        materiais: "",
        instrucoes: "",
        arquivoUrl: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAtividade(null);
  };

  const handleSave = async () => {
    if (!formData.titulo || !formData.categoria || !formData.faixaEtaria) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSave = {
        ...formData,
        dataCriacao: editingAtividade?.dataCriacao || new Date().toISOString(),
      };

      if (editingAtividade) {
        await update(editingAtividade.id, dataToSave);
        toast({
          title: "Sucesso!",
          description: "Atividade atualizada com sucesso.",
        });
      } else {
        await add(dataToSave);
        toast({
          title: "Sucesso!",
          description: "Atividade adicionada com sucesso.",
        });
      }
      handleCloseDialog();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a atividade.",
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
        description: "Atividade excluída com sucesso.",
      });
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a atividade.",
        variant: "destructive",
      });
    }
  };

  const filteredAtividades = atividades.filter((a) => {
    const matchesSearch = a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === "todas" || a.categoria === filterCategoria;
    const matchesFaixaEtaria = filterFaixaEtaria === "todas" || a.faixaEtaria === filterFaixaEtaria;
    return matchesSearch && matchesCategoria && matchesFaixaEtaria;
  });

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando atividades...</p>
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
            <h1 className="page-title">EBI - Escola Bíblica Infantil</h1>
            <p className="page-subtitle">
              Repositório de atividades para trabalhar com as crianças
            </p>
          </div>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Nova Atividade
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Buscar atividades..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={filterCategoria} onValueChange={setFilterCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterFaixaEtaria} onValueChange={setFilterFaixaEtaria}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as faixas etárias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as faixas etárias</SelectItem>
                  {faixasEtarias.map((faixa) => (
                    <SelectItem key={faixa} value={faixa}>
                      {faixa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Atividades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAtividades.map((atividade, index) => (
            <Card
              key={atividade.id}
              className="animate-slide-up hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{atividade.titulo}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">
                      {atividade.descricao}
                    </CardDescription>
                  </div>
                  <BookOpen className="text-primary flex-shrink-0" size={20} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{atividade.categoria}</Badge>
                  <Badge variant="outline">{atividade.faixaEtaria}</Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  Criada em: {formatDateBR(atividade.dataCriacao)}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                    onClick={() => {
                      setViewingAtividade(atividade);
                      setIsViewDialogOpen(true);
                    }}
                  >
                    <Eye size={14} />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenDialog(atividade)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeletingId(atividade.id);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAtividades.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">Nenhuma atividade encontrada.</p>
            <Button className="mt-4 gap-2" onClick={() => handleOpenDialog()}>
              <Plus size={16} />
              Criar primeira atividade
            </Button>
          </div>
        )}

        {/* Dialog de Adicionar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAtividade ? "Editar Atividade" : "Nova Atividade"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da atividade EBI
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="basico" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basico">Dados Básicos</TabsTrigger>
                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              </TabsList>

              <TabsContent value="basico" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: História de Davi e Golias"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="descricao">Descrição Breve *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descreva brevemente a atividade..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select 
                      value={formData.categoria} 
                      onValueChange={(value) => setFormData({ ...formData, categoria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="faixaEtaria">Faixa Etária *</Label>
                    <Select 
                      value={formData.faixaEtaria} 
                      onValueChange={(value) => setFormData({ ...formData, faixaEtaria: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {faixasEtarias.map((faixa) => (
                          <SelectItem key={faixa} value={faixa}>
                            {faixa}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="detalhes" className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="materiais">Materiais Necessários</Label>
                  <Textarea
                    id="materiais"
                    value={formData.materiais}
                    onChange={(e) => setFormData({ ...formData, materiais: e.target.value })}
                    placeholder="Liste os materiais necessários..."
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="instrucoes">Instruções</Label>
                  <Textarea
                    id="instrucoes"
                    value={formData.instrucoes}
                    onChange={(e) => setFormData({ ...formData, instrucoes: e.target.value })}
                    placeholder="Passo a passo da atividade..."
                    rows={5}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="arquivoUrl">URL do Arquivo (opcional)</Label>
                  <Input
                    id="arquivoUrl"
                    value={formData.arquivoUrl}
                    onChange={(e) => setFormData({ ...formData, arquivoUrl: e.target.value })}
                    placeholder="https://..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Link para PDF, imagem ou outro material de apoio
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                {editingAtividade ? "Atualizar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Visualização */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingAtividade?.titulo}</DialogTitle>
              <DialogDescription>
                Detalhes da atividade
              </DialogDescription>
            </DialogHeader>

            {viewingAtividade && (
              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Descrição</Label>
                  <p className="mt-1">{viewingAtividade.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Categoria</Label>
                    <p className="mt-1">
                      <Badge variant="secondary">{viewingAtividade.categoria}</Badge>
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Faixa Etária</Label>
                    <p className="mt-1">
                      <Badge variant="outline">{viewingAtividade.faixaEtaria}</Badge>
                    </p>
                  </div>
                </div>

                {viewingAtividade.materiais && (
                  <div>
                    <Label className="text-muted-foreground">Materiais Necessários</Label>
                    <p className="mt-1 whitespace-pre-line">{viewingAtividade.materiais}</p>
                  </div>
                )}

                {viewingAtividade.instrucoes && (
                  <div>
                    <Label className="text-muted-foreground">Instruções</Label>
                    <p className="mt-1 whitespace-pre-line">{viewingAtividade.instrucoes}</p>
                  </div>
                )}

                {viewingAtividade.arquivoUrl && (
                  <div>
                    <Label className="text-muted-foreground">Arquivo Anexo</Label>
                    <div className="mt-1">
                      <Button variant="outline" size="sm" asChild>
                        <a href={viewingAtividade.arquivoUrl} target="_blank" rel="noopener noreferrer">
                          <Download size={14} className="mr-2" />
                          Baixar Material
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir esta atividade? Esta ação não pode ser desfeita.
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
