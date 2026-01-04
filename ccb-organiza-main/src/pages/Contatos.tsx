import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Phone, Mail, Church, MoreVertical } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contato {
  id: string;
  nome: string;
  ministerio: string;
  congregacao: string;
  telefone: string;
  email?: string;
}

const contatosData: Contato[] = [
  { id: "1", nome: "João Silva", ministerio: "Ancião", congregacao: "Central", telefone: "(11) 99999-0001", email: "joao@email.com" },
  { id: "2", nome: "Pedro Santos", ministerio: "Cooperador", congregacao: "Norte", telefone: "(11) 99999-0002" },
  { id: "3", nome: "Maria Oliveira", ministerio: "Cooperador de Jovens", congregacao: "Sul", telefone: "(11) 99999-0003", email: "maria@email.com" },
  { id: "4", nome: "Carlos Lima", ministerio: "Diácono", congregacao: "Central", telefone: "(11) 99999-0004" },
  { id: "5", nome: "Ana Costa", ministerio: "Organista", congregacao: "Norte", telefone: "(11) 99999-0005", email: "ana@email.com" },
  { id: "6", nome: "José Ferreira", ministerio: "Oficial", congregacao: "Central", telefone: "(11) 99999-0006" },
  { id: "7", nome: "Lucia Martins", ministerio: "Organista", congregacao: "Sul", telefone: "(11) 99999-0007" },
  { id: "8", nome: "Roberto Alves", ministerio: "Porteiro", congregacao: "Norte", telefone: "(11) 99999-0008" },
];

export default function Contatos() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContatos = contatosData.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ministerio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.congregacao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Contatos</h1>
            <p className="page-subtitle">
              Lista de contatos cadastrados
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={20} />
            Novo Contato
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            placeholder="Buscar por nome, ministério ou congregação..."
            className="pl-10 max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Grid de Contatos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredContatos.map((contato, index) => (
            <Card
              key={contato.id}
              className="animate-scale-in hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 bg-primary">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(contato.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{contato.nome}</h3>
                      <Badge variant="secondary" className="mt-1">{contato.ministerio}</Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Church size={14} />
                    <span>{contato.congregacao}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={14} />
                    <a href={`tel:${contato.telefone}`} className="hover:text-primary transition-colors">
                      {contato.telefone}
                    </a>
                  </div>
                  {contato.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={14} />
                      <a href={`mailto:${contato.email}`} className="hover:text-primary transition-colors truncate">
                        {contato.email}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContatos.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">Nenhum contato encontrado.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
