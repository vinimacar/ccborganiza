import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Download, FileText, BarChart3, PieChart, Calendar } from "lucide-react";
import { useState } from "react";
import { useFirestore } from "@/hooks/useFirestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateBR } from "@/lib/dateUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Extend jsPDF type for autoTable
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface Congregacao {
  id: string;
  nome: string;
  cidade: string;
  capacidade: number;
  ocupacao: number;
  temEBI: boolean;
}

interface Membro {
  id: string;
  nome: string;
  ministerio: string;
  congregacao: string;
  status: "ativo" | "inativo";
}

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState<string>("");
  const [periodo, setPeriodo] = useState<string>("mes");
  
  const { data: congregacoes } = useFirestore<Congregacao>({ 
    collectionName: 'congregacoes' 
  });
  const { data: ministerio } = useFirestore<Membro>({ 
    collectionName: 'ministerio' 
  });

  const gerarRelatorioPDF = (tipo: string) => {
    const doc = new jsPDF();
    const dataAtual = formatDateBR(new Date());

    // Cabeçalho
    doc.setFontSize(18);
    doc.text("CCB Organiza - Relatório", 14, 20);
    doc.setFontSize(11);
    doc.text(`Data: ${dataAtual}`, 14, 28);
    doc.text(`Tipo: ${getNomeRelatorio(tipo)}`, 14, 34);

    if (tipo === "congregacoes") {
      gerarRelatorioCongregacoes(doc);
    } else if (tipo === "ministerio") {
      gerarRelatorioMinisterio(doc);
    } else if (tipo === "estatisticas") {
      gerarRelatorioEstatisticas(doc);
    }

    doc.save(`relatorio-${tipo}-${Date.now()}.pdf`);
  };

  const gerarRelatorioCongregacoes = (doc: jsPDF) => {
    const tableData = congregacoes.map(c => [
      c.nome,
      c.cidade,
      c.capacidade.toString(),
      `${c.ocupacao}%`,
      c.temEBI ? 'Sim' : 'Não'
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Congregação', 'Cidade', 'Capacidade', 'Ocupação', 'EBI']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Estatísticas
    const totalCongregacoes = congregacoes.length;
    const comEBI = congregacoes.filter(c => c.temEBI).length;
    const ocupacaoMedia = congregacoes.length > 0
      ? Math.round(congregacoes.reduce((acc, c) => acc + c.ocupacao, 0) / congregacoes.length)
      : 0;

    const finalY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text("Resumo:", 14, finalY);
    doc.setFontSize(10);
    doc.text(`Total de Congregações: ${totalCongregacoes}`, 14, finalY + 7);
    doc.text(`Com EBI: ${comEBI}`, 14, finalY + 14);
    doc.text(`Ocupação Média: ${ocupacaoMedia}%`, 14, finalY + 21);
  };

  const gerarRelatorioMinisterio = (doc: jsPDF) => {
    const tableData = ministerio.map(m => [
      m.nome,
      m.ministerio,
      m.congregacao,
      m.status === 'ativo' ? 'Ativo' : 'Inativo'
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['Nome', 'Ministério', 'Congregação', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
    });

    // Estatísticas por ministério
    const ministerios = [...new Set(ministerio.map(m => m.ministerio))];
    const finalY = (doc as jsPDFWithAutoTable).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.text("Por Ministério:", 14, finalY);
    doc.setFontSize(10);
    
    let yPos = finalY + 7;
    ministerios.forEach(min => {
      const count = ministerio.filter(m => m.ministerio === min && m.status === 'ativo').length;
      doc.text(`${min}: ${count}`, 14, yPos);
      yPos += 7;
    });
  };

  const gerarRelatorioEstatisticas = (doc: jsPDF) => {
    const stats = {
      totalCongregacoes: congregacoes.length,
      comEBI: congregacoes.filter(c => c.temEBI).length,
      ministerioAtivo: ministerio.filter(m => m.status === 'ativo').length,
      ministerioInativo: ministerio.filter(m => m.status === 'inativo').length,
      ocupacaoMedia: congregacoes.length > 0
        ? Math.round(congregacoes.reduce((acc, c) => acc + c.ocupacao, 0) / congregacoes.length)
        : 0,
    };

    let yPos = 45;
    doc.setFontSize(14);
    doc.text("Estatísticas Gerais", 14, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.text(`Total de Congregações: ${stats.totalCongregacoes}`, 20, yPos);
    yPos += 7;
    doc.text(`Congregações com EBI: ${stats.comEBI}`, 20, yPos);
    yPos += 7;
    doc.text(`Ocupação Média: ${stats.ocupacaoMedia}%`, 20, yPos);
    yPos += 14;

    doc.setFontSize(14);
    doc.text("Ministério", 14, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.text(`Membros Ativos: ${stats.ministerioAtivo}`, 20, yPos);
    yPos += 7;
    doc.text(`Membros Inativos: ${stats.ministerioInativo}`, 20, yPos);
    yPos += 7;
    doc.text(`Total: ${stats.ministerioAtivo + stats.ministerioInativo}`, 20, yPos);
  };

  const getNomeRelatorio = (tipo: string): string => {
    const nomes: Record<string, string> = {
      congregacoes: "Congregações",
      ministerio: "Ministério",
      estatisticas: "Estatísticas Gerais",
    };
    return nomes[tipo] || tipo;
  };

  // Dados para gráficos
  const dadosOcupacao = congregacoes.map(c => ({
    nome: c.nome,
    ocupacao: c.ocupacao
  }));

  const dadosMinisterio = [...new Set(ministerio.map(m => m.ministerio))].map(min => ({
    ministerio: min,
    total: ministerio.filter(m => m.ministerio === min && m.status === 'ativo').length
  }));

  return (
    <MainLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Relatórios</h1>
          <p className="page-subtitle">
            Gere relatórios e visualize estatísticas da região
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText size={20} />
              Configurar Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Tipo de Relatório</Label>
                <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="congregacoes">Congregações</SelectItem>
                    <SelectItem value="ministerio">Ministério</SelectItem>
                    <SelectItem value="estatisticas">Estatísticas Gerais</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Período</Label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mes">Mês Atual</SelectItem>
                    <SelectItem value="trimestre">Último Trimestre</SelectItem>
                    <SelectItem value="semestre">Último Semestre</SelectItem>
                    <SelectItem value="ano">Ano Atual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Button 
                onClick={() => tipoRelatorio && gerarRelatorioPDF(tipoRelatorio)}
                disabled={!tipoRelatorio}
                className="gap-2"
              >
                <Download size={16} />
                Gerar PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Visuais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Card de Ocupação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 size={20} />
                Ocupação das Congregações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dadosOcupacao.slice(0, 5).map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.nome}</span>
                      <span className="text-muted-foreground">{item.ocupacao}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.ocupacao}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card de Ministério */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart size={20} />
                Distribuição do Ministério
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dadosMinisterio.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.ministerio}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.total}</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full"
                          style={{ 
                            width: `${(item.total / ministerio.filter(m => m.status === 'ativo').length) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Calendar className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{congregacoes.length}</p>
                  <p className="text-sm text-muted-foreground">Congregações</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <BarChart3 className="text-success" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">
                    {ministerio.filter(m => m.status === 'ativo').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Ministério Ativo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-info/10">
                  <PieChart className="text-info" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">
                    {congregacoes.filter(c => c.temEBI).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Com EBI Ativo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/10">
                  <FileText className="text-warning" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">
                    {congregacoes.length > 0
                      ? Math.round(congregacoes.reduce((acc, c) => acc + c.ocupacao, 0) / congregacoes.length)
                      : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Ocupação Média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
