import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  Church,
  Users,
  Calendar,
  TrendingUp,
  UserCheck,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dados simulados para demonstração
const congregacaoData = {
  total: 12,
  comEBI: 8,
  ocupacao: 78,
  vagasOciosas: 22,
};

const eventosDoMes = [
  { tipo: "Batismo", data: "15/01/2024", local: "Sede Regional" },
  { tipo: "Santa Ceia", data: "21/01/2024", local: "Todas as congregações" },
  { tipo: "Ensaio Regional", data: "28/01/2024", local: "Congregação Central" },
];

const proximosCultos = [
  { congregacao: "Congregação Central", data: "Dom, 14/01", horario: "19:00" },
  { congregacao: "Congregação Norte", data: "Qua, 17/01", horario: "19:30" },
  { congregacao: "Congregação Sul", data: "Sex, 19/01", horario: "19:00" },
];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Visão geral das informações mais importantes do mês
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Congregações"
            value={congregacaoData.total}
            subtitle={`${congregacaoData.comEBI} com EBI ativo`}
            icon={Church}
            variant="primary"
          />
          <StatCard
            title="Taxa de Ocupação"
            value={`${congregacaoData.ocupacao}%`}
            subtitle="Média das congregações"
            icon={TrendingUp}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Vagas Ociosas"
            value={`${congregacaoData.vagasOciosas}%`}
            subtitle="Disponível para novos membros"
            icon={Users}
          />
          <StatCard
            title="Eventos do Mês"
            value={eventosDoMes.length}
            subtitle="Batismos, ensaios e reuniões"
            icon={Calendar}
            variant="secondary"
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximos Eventos */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="text-primary" size={20} />
                Próximos Eventos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventosDoMes.map((evento, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{evento.tipo}</p>
                      <p className="text-sm text-muted-foreground">{evento.local}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {evento.data}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximos Cultos */}
          <Card className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Church className="text-primary" size={20} />
                Próximos Cultos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proximosCultos.map((culto, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{culto.congregacao}</p>
                      <p className="text-sm text-muted-foreground">{culto.data}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {culto.horario}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <UserCheck className="text-success" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">47</p>
                  <p className="text-sm text-muted-foreground">Batismos este ano</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-info/10">
                  <Users className="text-info" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">156</p>
                  <p className="text-sm text-muted-foreground">Ministério ativo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <BookOpen className="text-warning" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">234</p>
                  <p className="text-sm text-muted-foreground">Crianças no EBI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
