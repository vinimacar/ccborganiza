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
import { useFirestore } from "@/hooks/useFirestore";

interface Congregacao {
  id: string;
  nome: string;
  temEBI: boolean;
  capacidade: number;
  ocupacao: number;
}

interface Evento {
  id: string;
  tipo: string;
  data: string;
  local: string;
}

interface Culto {
  id: string;
  congregacao: string;
  data: string;
  horario: string;
}

interface Estatisticas {
  id: string;
  batismosAno: number;
  ministerioAtivo: number;
  criancasEBI: number;
}

export default function Dashboard() {
  const { data: congregacoes, loading: loadingCongregacoes, error: errorCongregacoes } = useFirestore<Congregacao>({ 
    collectionName: 'congregacoes' 
  });
  const { data: eventos, loading: loadingEventos, error: errorEventos } = useFirestore<Evento>({ 
    collectionName: 'eventos' 
  });
  const { data: cultos, loading: loadingCultos, error: errorCultos } = useFirestore<Culto>({ 
    collectionName: 'cultos' 
  });
  const { data: estatisticas, error: errorEstatisticas } = useFirestore<Estatisticas>({ 
    collectionName: 'estatisticas' 
  });

  // Calcula dados das congregações
  const congregacaoData = {
    total: congregacoes.length,
    comEBI: congregacoes.filter(c => c.temEBI).length,
    ocupacao: congregacoes.length > 0 
      ? Math.round(congregacoes.reduce((acc, c) => acc + c.ocupacao, 0) / congregacoes.length)
      : 0,
    vagasOciosas: congregacoes.length > 0
      ? Math.round(100 - (congregacoes.reduce((acc, c) => acc + c.ocupacao, 0) / congregacoes.length))
      : 0,
  };

  const stats = estatisticas[0] || { batismosAno: 0, ministerioAtivo: 0, criancasEBI: 0 };
  const isLoading = loadingCongregacoes || loadingEventos || loadingCultos;
  const hasError = errorCongregacoes || errorEventos || errorCultos || errorEstatisticas;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </MainLayout>
    );
  }

  if (hasError) {
    return (
      <MainLayout>
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-destructive">Erro ao Carregar Dados</h2>
            <p className="text-muted-foreground max-w-md">
              Não foi possível acessar o banco de dados. Isso geralmente ocorre porque as regras de segurança do Firestore não estão configuradas.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg text-left">
              <p className="font-semibold mb-2">Como resolver:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Acesse o <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Console</a></li>
                <li>Vá em <strong>Firestore Database → Regras</strong></li>
                <li>Configure as regras de segurança (veja CONFIGURAR_FIRESTORE_RULES.md)</li>
              </ol>
            </div>
            {hasError && (
              <details className="mt-4 text-left max-w-md">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Detalhes técnicos do erro
                </summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {hasError.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

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
            value={eventos.length}
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
              {eventos.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum evento cadastrado</p>
              ) : (
                <div className="space-y-4">
                  {eventos.map((evento) => (
                    <div
                      key={evento.id}
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
              )}
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
              {cultos.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum culto cadastrado</p>
              ) : (
                <div className="space-y-4">
                  {cultos.map((culto) => (
                    <div
                      key={culto.id}
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
              )}
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
                  <p className="text-2xl font-bold font-display">{stats.batismosAno}</p>
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
                  <p className="text-2xl font-bold font-display">{stats.ministerioAtivo}</p>
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
                  <p className="text-2xl font-bold font-display">{stats.criancasEBI}</p>
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
