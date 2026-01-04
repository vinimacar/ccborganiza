import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, MapPin, Clock, Users } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Evento {
  id: string;
  tipo: string;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  participantes?: number;
  categoria: "batismo" | "ensaio" | "reuniao" | "santa-ceia" | "outros";
}

const eventosData: Evento[] = [
  { id: "1", tipo: "Batismo", titulo: "Batismo Regional", data: "2024-01-15", horario: "14:00", local: "Sede Regional", participantes: 23, categoria: "batismo" },
  { id: "2", tipo: "Santa Ceia", titulo: "Santa Ceia Mensal", data: "2024-01-21", horario: "19:00", local: "Todas as congregações", categoria: "santa-ceia" },
  { id: "3", tipo: "Ensaio Regional", titulo: "Ensaio para Mocidade", data: "2024-01-28", horario: "09:00", local: "Congregação Central", participantes: 45, categoria: "ensaio" },
  { id: "4", tipo: "Reunião", titulo: "Reunião Ministerial", data: "2024-02-03", horario: "14:00", local: "Sede Administrativa", participantes: 30, categoria: "reuniao" },
  { id: "5", tipo: "Ensaio Regional", titulo: "Ensaio DARPE", data: "2024-02-10", horario: "09:00", local: "Congregação Norte", participantes: 60, categoria: "ensaio" },
  { id: "6", tipo: "Culto", titulo: "Culto GEM", data: "2024-02-14", horario: "19:30", local: "Congregação Sul", categoria: "outros" },
];

const categoriaColors: Record<string, string> = {
  "batismo": "bg-info text-info-foreground",
  "ensaio": "bg-success text-success-foreground",
  "reuniao": "bg-warning text-warning-foreground",
  "santa-ceia": "bg-primary text-primary-foreground",
  "outros": "bg-muted text-muted-foreground",
};

const categoriaBadge: Record<string, string> = {
  "batismo": "Batismo",
  "ensaio": "Ensaio",
  "reuniao": "Reunião",
  "santa-ceia": "Santa Ceia",
  "outros": "Outros",
};

export default function Agenda() {
  const [selectedTab, setSelectedTab] = useState("todos");

  const filteredEventos = eventosData.filter((e) => {
    if (selectedTab === "todos") return true;
    return e.categoria === selectedTab;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Agenda</h1>
            <p className="page-subtitle">
              Eventos da região: Batismos, Ensaios, Reuniões e mais
            </p>
          </div>
          <Button className="gap-2">
            <Plus size={20} />
            Novo Evento
          </Button>
        </div>

        {/* Tabs de Categorias */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="batismo">Batismos</TabsTrigger>
            <TabsTrigger value="ensaio">Ensaios</TabsTrigger>
            <TabsTrigger value="reuniao">Reuniões</TabsTrigger>
            <TabsTrigger value="santa-ceia">Santa Ceia</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Lista de Eventos */}
        <div className="space-y-4">
          {filteredEventos.map((evento, index) => (
            <Card
              key={evento.id}
              className="animate-slide-up hover:shadow-lg transition-all duration-300 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex">
                {/* Data Sidebar */}
                <div className={`w-24 flex-shrink-0 flex flex-col items-center justify-center p-4 ${categoriaColors[evento.categoria]}`}>
                  <Calendar size={20} className="mb-1" />
                  <span className="text-xs font-medium text-center">
                    {formatDate(evento.data)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{evento.titulo}</h3>
                      <Badge variant="outline">{categoriaBadge[evento.categoria]}</Badge>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{evento.horario}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span>{evento.local}</span>
                    </div>
                    {evento.participantes && (
                      <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{evento.participantes} participantes</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center pr-4">
                  <Button variant="ghost" size="sm">
                    Ver detalhes
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredEventos.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <Calendar className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">Nenhum evento encontrado nesta categoria.</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
