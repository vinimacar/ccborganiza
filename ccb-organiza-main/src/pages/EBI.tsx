import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, BookOpen, FileText, Image as ImageIcon, Edit, Trash2, ExternalLink } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { formatDateBR } from "@/lib/dateUtils";

interface Atividade {
  id: string;
  titulo: string;
  descricao: string;
  categoria: "historias" | "atividades" | "musicas" | "versiculos" | "jogos";
  faixaEtaria: string;
  materiais?: string;
  arquivoUrl?: string;
  dataCriacao: string;
}

const categorias = [
  { value: "historias", label: "Histórias Bíblicas", icon: BookOpen },
  { value: "atividades", label: "Atividades", icon: FileText },
  { value: "musicas", label: "Músicas", icon: "🎵" },
  { value: "versiculos", label: "Versículos", icon: "📖" },
  { value: "jogos", label: "Jogos e Dinâmicas", icon: "🎮" },
];

const faixasEtarias = [
  "0-3 anos",
  "4-6 anos",
  "7-9 anos",
  "10-12 anos",
  "Todas as idades",
];

const categoriaCores: Record<string, string> = {
  "historias": "bg-blue-500",
  "atividades": "bg-green-500",
  "musicas": "bg-purple-500",
  "versiculos": "bg-orange-500",
  "jogos": "bg-pink-500",
};

export default function EBI() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState<string>("todas");
  const [filterFaixa, setFilterFaixa] = useState<string>("todas");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingAtividade, setEditingAtividade] = useState<Atividade | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: atividades, loading, add, update, remove } = useFirestore<Atividade>({
    collectionName: 'ebi-atividades'
  });

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    categoria: "historias" as Atividade['categoria'],
    faixaEtaria: "",
    materiais: "",
    arquivoUrl: "",
  });

  const handleOpenDialog = (atividade?: Atividade) => {
    if (atividade) {
      setEditingAtividade(atividade);
      setFormData({
        titulo: atividade.titulo,
        descricao: atividade.descricao,
        categoria: atividade.categoria,
        faixaEtaria: atividade.faixaEtaria,
        materiais: atividade.materiais || "",
        arquivoUrl: atividade.arquivoUrl || "",
      });
    } else {
      setEditingAtividade(null);
      setFormData({
        titulo: "",
        descricao: "",
        categoria: "historias",
        faixaEtaria: "",
        materiais: "",
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
    try {
      const dataToSave = {
        ...formData,
        dataCriacao: editingAtividade?.dataCriacao || new Date().toISOString(),
        materiais: formData.materiais || undefined,
        arquivoUrl: formData.arquivoUrl || undefined,
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
    const matchesFaixa = filterFaixa === "todas" || a.faixaEtaria === filterFaixa;
    return matchesSearch && matchesCategoria && matchesFaixa;
  });

  const atividadesPorCategoria = categorias.map(cat => ({
    ...cat,
    total: atividades.filter(a => a.categoria === cat.value).length,
  }));

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
              Repositório de atividades e recursos para as irmãs
            </p>
          </div>
          <Button className="gap-2" onClick={() => handleOpenDialog()}>
            <Plus size={20} />
            Nova Atividade
          </Button>
        </div>

        {/* Estatísticas por Categoria */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {atividadesPorCategoria.map((cat) => (
            <Card key={cat.value} className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilterCategoria(cat.value)}>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`p-3 rounded-full ${categoriaCores[cat.value]} text-white`}>
                    {typeof cat.icon === 'string' ? (
                      <span className="text-2xl">{cat.icon}</span>
                    ) : (
                      <cat.icon size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{cat.total}</p>
                    <p className="text-xs text-muted-foreground">{cat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as categorias</SelectItem>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterFaixa} onValueChange={setFilterFaixa}>
                <SelectTrigger>
                  <SelectValue placeholder="Faixa etária" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as idades</SelectItem>
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
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{atividade.titulo}</CardTitle>
                    <CardDescription className="mt-1">
                      {formatDateBR(new Date(atividade.dataCriacao))}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(atividade)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => {
                        setDeletingId(atividade.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Badge className={categoriaCores[atividade.categoria]}>
                    {categorias.find(c => c.value === atividade.categoria)?.label}
                  </Badge>
                  <Badge variant="outline">{atividade.faixaEtaria}</Badge>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {atividade.descricao}
                </p>

                {atividade.materiais && (
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Materiais:</p>
                    <p className="text-muted-foreground">{atividade.materiais}</p>
                  </div>
                )}
              </CardContent>

              {atividade.arquivoUrl && (
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.open(atividade.arquivoUrl, '_blank')}
                  >
                    <ExternalLink size={16} />
                    Ver Arquivo
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>

        {filteredAtividades.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma atividade encontrada.</p>
            <Button className="mt-4 gap-2" onClick={() => handleOpenDialog()}>
              <Plus size={16} />
              Adicionar Primeira Atividade
            </Button>
          </div>
        )}

        {/* Dialog de Adicionar/Editar */}
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAtividade ? "Editar Atividade" : "Nova Atividade"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados da atividade para o EBI
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
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
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva a atividade..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="categoria">Categoria *</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value: Atividade['categoria']) =>
                      setFormData({ ...formData, categoria: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
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

              <div className="grid gap-2">
                <Label htmlFor="materiais">Materiais Necessários</Label>
                <Textarea
                  id="materiais"
                  value={formData.materiais}
                  onChange={(e) => setFormData({ ...formData, materiais: e.target.value })}
                  placeholder="Ex: Papel, lápis de cor, tesoura..."
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="arquivoUrl">Link do Arquivo (opcional)</Label>
                <Input
                  id="arquivoUrl"
                  value={formData.arquivoUrl}
                  onChange={(e) => setFormData({ ...formData, arquivoUrl: e.target.value })}
                  placeholder="https://..."
                  type="url"
                />
                <p className="text-xs text-muted-foreground">
                  Adicione um link para Google Drive, Dropbox ou outro serviço de armazenamento
                </p>
              </div>
            </div>

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
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}
