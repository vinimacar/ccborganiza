import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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

interface Membro {
  id: string;
  nome: string;
  ministerio: string;
  congregacao: string;
  telefone: string;
  status: "ativo" | "inativo";
}

const ministerioData: Membro[] = [
  { id: "1", nome: "João Silva", ministerio: "Ancião", congregacao: "Central", telefone: "(11) 99999-0001", status: "ativo" },
  { id: "2", nome: "Pedro Santos", ministerio: "Cooperador", congregacao: "Norte", telefone: "(11) 99999-0002", status: "ativo" },
  { id: "3", nome: "Maria Oliveira", ministerio: "Cooperador de Jovens", congregacao: "Sul", telefone: "(11) 99999-0003", status: "ativo" },
  { id: "4", nome: "Carlos Lima", ministerio: "Diácono", congregacao: "Central", telefone: "(11) 99999-0004", status: "ativo" },
  { id: "5", nome: "Ana Costa", ministerio: "Cooperadora de Menores", congregacao: "Norte", telefone: "(11) 99999-0005", status: "inativo" },
  { id: "6", nome: "José Ferreira", ministerio: "Oficial", congregacao: "Central", telefone: "(11) 99999-0006", status: "ativo" },
];

const ministerioColors: Record<string, string> = {
  "Ancião": "bg-primary text-primary-foreground",
  "Cooperador": "bg-secondary text-secondary-foreground",
  "Cooperador de Jovens": "bg-info text-info-foreground",
  "Cooperadora de Menores": "bg-success text-success-foreground",
  "Diácono": "bg-warning text-warning-foreground",
  "Oficial": "bg-muted text-muted-foreground",
};

export default function Ministerio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMinisterio, setFilterMinisterio] = useState<string | null>(null);

  const filteredMembros = ministerioData.filter((m) => {
    const matchesSearch = m.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.congregacao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterMinisterio || m.ministerio === filterMinisterio;
    return matchesSearch && matchesFilter;
  });

  const ministerios = [...new Set(ministerioData.map((m) => m.ministerio))];

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
          <Button className="gap-2">
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
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
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
      </div>
    </MainLayout>
  );
}
