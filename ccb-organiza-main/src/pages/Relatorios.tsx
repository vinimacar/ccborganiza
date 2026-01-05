import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText, Download, BarChart3, TrendingUp, Users, Calendar } from "lucide-react";
import { useState } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateBR } from "@/lib/dateUtils";

interface Congregacao {
  id: string;
  nome: string;
  cidade: string;
  ocupacao: number;
  capacidade: number;
  temEBI: boolean;
}

interface Membro {
  id: string;
  nome: string;
  ministerio: string;
  congregacao: string;
  status: string;
}

interface Evento {
  id: string;
  tipo: string;
  data: string;
  participantes?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Relatorios() {
  const [periodo, setPeriodo] = useState("mes");
  const [tipoCongregacao, setTipoCongregacao] = useState("todas");
  
  const { data: congregacoes } = useFirestore<Congregacao>({ collectionName: 'congregacoes' });
  const { data: ministerio } = useFirestore<Membro>({ collectionName: 'ministerio' });
  const { data: eventos } = useFirestore<Evento>({ collectionName: 'eventos' });

  // Dados para gráficos
  const congregacoesPorCidade = congregacoes.reduce((acc, cong) => {
    acc[cong.cidade] = (acc[cong.cidade] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dadosCidades = Object.entries(congregacoesPorCidade).map(([cidade, total]) => ({
    cidade,
    total,
  }));

  const ministerioPorTipo = ministerio
    .filter(m => m.status === "ativo")
    .reduce((acc, m) => {
      acc[m.ministerio] = (acc[m.ministerio] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const dadosMinisterio = Object.entries(ministerioPorTipo).map(([tipo, total]) => ({
    name: tipo,
    value: total,
  }));

  const ocupacaoCongregacoes = congregacoes.map(c => ({
    nome: c.nome.split(' ').slice(-1)[0], // Última palavra do nome
    ocupacao: c.ocupacao,
    capacidade: c.capacidade,
  }));

  const estatisticas = {
    totalCongregacoes: congregacoes.length,
    congregacoesComEBI: congregacoes.filter(c => c.temEBI).length,
    totalMinisterio: ministerio.filter(m => m.status === "ativo").length,
    totalEventos: eventos.length,
    ocupacaoMedia: Math.round(
      congregacoes.reduce((acc, c) => acc + c.ocupacao, 0) / congregacoes.length || 0
    ),
  };

  const gerarPDFGeral = () => {
    const doc = new jsPDF();
    
    // Cabeçalho
    doc.setFontSize(18);
    doc.text("Relatório Geral - CCB Organiza", 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Data: ${formatDateBR(new Date())}`, 14, 30);
    doc.text(`Período: ${periodo === 'mes' ? 'Último mês' : periodo === 'trimestre' ? 'Último trimestre' : 'Último ano'}`, 14, 36);
    
    // Estatísticas Gerais
    doc.setFontSize(14);
    doc.text("Estatísticas Gerais", 14, 46);
    
    const statsData = [
      ["Métrica", "Valor"],
      ["Total de Congregações", estatisticas.totalCongregacoes.toString()],
      ["Congregações com EBI", estatisticas.congregacoesComEBI.toString()],
      ["Membros do Ministério Ativos", estatisticas.totalMinisterio.toString()],
      ["Total de Eventos", estatisticas.totalEventos.toString()],
      ["Ocupação Média (%)", estatisticas.ocupacaoMedia.toString()],
    ];

    autoTable(doc, {
      startY: 50,
      head: [statsData[0]],
      body: statsData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    });

    // Congregações
    // @ts-ignore - jspdf-autotable adiciona lastAutoTable dinamicamente
    const lastY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Congregações", 14, lastY);

    const congData = congregacoes.map(c => [
      c.nome,
      c.cidade,
      `${c.ocupacao}%`,
      c.capacidade.toString(),
      c.temEBI ? 'Sim' : 'Não',
    ]);

    autoTable(doc, {
      startY: lastY + 4,
      head: [["Nome", "Cidade", "Ocupação", "Capacidade", "EBI"]],
      body: congData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    });

    // Salvar PDF
    doc.save(`relatorio-geral-${formatDateBR(new Date()).replace(/\//g, '-')}.pdf`);
  };

  const gerarPDFMinisterio = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Relatório do Ministério", 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Data: ${formatDateBR(new Date())}`, 14, 30);
    
    const ministerioAtivo = ministerio.filter(m => m.status === "ativo");
    const ministerioData = ministerioAtivo.map(m => [
      m.nome,
      m.ministerio,
      m.congregacao,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [["Nome", "Ministério", "Congregação"]],
      body: ministerioData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    });

    // Resumo por ministério
    // @ts-ignore - jspdf-autotable adiciona lastAutoTable dinamicamente
    const lastY2 = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text("Resumo por Ministério", 14, lastY2);

    const resumoData = Object.entries(ministerioPorTipo).map(([tipo, total]) => [
      tipo,
      total.toString(),
    ]);

    autoTable(doc, {
      startY: lastY + 4,
      head: [["Ministério", "Total"]],
      body: resumoData,
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    });

    doc.save(`relatorio-ministerio-${formatDateBR(new Date()).replace(/\//g, '-')}.pdf`);
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Relatórios</h1>
            <p className="page-subtitle">
              Análises, gráficos e exportação de dados
            </p>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Configure os parâmetros para gerar relatórios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label>Período</Label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes">Último mês</SelectItem>
                    <SelectItem value="trimestre">Último trimestre</SelectItem>
                    <SelectItem value="ano">Último ano</SelectItem>
                    <SelectItem value="tudo">Todo o período</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Tipo de Congregação</Label>
                <Select value={tipoCongregacao} onValueChange={setTipoCongregacao}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="com-ebi">Com EBI</SelectItem>
                    <SelectItem value="sem-ebi">Sem EBI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={gerarPDFGeral} className="flex-1 gap-2">
                  <Download size={16} />
                  Exportar Geral
                </Button>
                <Button onClick={gerarPDFMinisterio} variant="outline" className="flex-1 gap-2">
                  <Download size={16} />
                  Exportar Ministério
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart3 className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estatisticas.totalCongregacoes}</p>
                  <p className="text-xs text-muted-foreground">Congregações</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Calendar className="text-success" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estatisticas.congregacoesComEBI}</p>
                  <p className="text-xs text-muted-foreground">Com EBI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Users className="text-info" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estatisticas.totalMinisterio}</p>
                  <p className="text-xs text-muted-foreground">Ministério</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <FileText className="text-warning" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estatisticas.totalEventos}</p>
                  <p className="text-xs text-muted-foreground">Eventos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <TrendingUp className="text-secondary" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{estatisticas.ocupacaoMedia}%</p>
                  <p className="text-xs text-muted-foreground">Ocupação Média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <Tabs defaultValue="congregacoes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="congregacoes">Congregações</TabsTrigger>
            <TabsTrigger value="ministerio">Ministério</TabsTrigger>
            <TabsTrigger value="ocupacao">Ocupação</TabsTrigger>
          </TabsList>

          <TabsContent value="congregacoes">
            <Card>
              <CardHeader>
                <CardTitle>Congregações por Cidade</CardTitle>
                <CardDescription>Distribuição de congregações por localidade</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dadosCidades}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="cidade" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#0088FE" name="Congregações" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ministerio">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição do Ministério</CardTitle>
                <CardDescription>Membros ativos por tipo de ministério</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={dadosMinisterio}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosMinisterio.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ocupacao">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Ocupação</CardTitle>
                <CardDescription>Ocupação atual de cada congregação</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={ocupacaoCongregacoes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ocupacao" stroke="#00C49F" name="Ocupação (%)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
