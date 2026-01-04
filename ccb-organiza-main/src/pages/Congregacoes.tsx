import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Clock, Users, BookOpen, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

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

const congregacoesData: Congregacao[] = [
  {
    id: "1",
    nome: "Congregação Central",
    endereco: "Rua Principal, 123",
    cidade: "São Paulo",
    uf: "SP",
    diasCulto: ["Domingo", "Quarta", "Sexta"],
    horario: "19:00",
    temEBI: true,
    capacidade: 200,
    ocupacao: 85,
  },
  {
    id: "2",
    nome: "Congregação Norte",
    endereco: "Av. Norte, 456",
    cidade: "São Paulo",
    uf: "SP",
    diasCulto: ["Domingo", "Terça"],
    horario: "19:30",
    temEBI: true,
    capacidade: 150,
    ocupacao: 70,
  },
  {
    id: "3",
    nome: "Congregação Sul",
    endereco: "Rua Sul, 789",
    cidade: "São Paulo",
    uf: "SP",
    diasCulto: ["Domingo", "Quinta"],
    horario: "19:00",
    temEBI: false,
    capacidade: 100,
    ocupacao: 90,
  },
];

export default function Congregacoes() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCongregacoes = congregacoesData.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cidade.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button className="gap-2">
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
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
      </div>
    </MainLayout>
  );
}
