import { Carta } from "@/types";
import { formatBRL, formatPercent } from "@/utils/finance";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    padding: 30,
    backgroundColor: "#0a0a0a",
    color: "#e4e4e7",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#991b1b",
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: "#71717a",
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    backgroundColor: "#7f1d1d",
    color: "#ffffff",
    padding: "4 8",
    marginBottom: 4,
    borderRadius: 2,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#1c1917",
    borderWidth: 1,
    borderColor: "#3f3f46",
    borderRadius: 4,
    padding: 8,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 7,
    color: "#71717a",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#f87171",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#7f1d1d",
    padding: "4 4",
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    padding: "3 4",
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  tableRowAlt: {
    backgroundColor: "#18181b",
  },
  colGrupo: { width: "8%" },
  colCredito: { width: "16%" },
  colEntrada: { width: "16%" },
  colPct: { width: "9%" },
  colParcela: { width: "16%" },
  colPrazo: { width: "9%" },
  colCF: { width: "10%" },
  colDN: { width: "16%" },
  headerText: {
    color: "#ffffff",
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
  },
  cellText: {
    color: "#d4d4d8",
    fontSize: 7,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    right: 30,
    borderLeftWidth: 3,
    borderLeftColor: "#991b1b",
    paddingLeft: 10,
    alignItems: "flex-end",
  },
  footerName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  footerLine: {
    fontSize: 10,
    color: "#a1a1aa",
    marginTop: 2,
  },
});

interface Totais {
  credito: number;
  entrada: number;
  parcela: number;
}

function OrcamentoPDF({
  cartas,
  totais,
}: {
  cartas: Carta[];
  totais: Totais;
}) {
  const now = new Date().toLocaleDateString("pt-BR");

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Orçamento de Consórcio — Ademicon</Text>
          <Text style={styles.subtitle}>Gerado em {now}</Text>
        </View>

        {/* Resumo */}
        <Text style={styles.sectionTitle}>RESUMO DO ORÇAMENTO</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Crédito Total</Text>
            <Text style={styles.summaryValue}>{formatBRL(totais.credito)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Entrada Total</Text>
            <Text style={styles.summaryValue}>{formatBRL(totais.entrada)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Parcela Total</Text>
            <Text style={styles.summaryValue}>{formatBRL(totais.parcela)}</Text>
          </View>
        </View>

        {/* Tabela */}
        <Text style={styles.sectionTitle}>COTAS SELECIONADAS</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerText, styles.colGrupo]}>Grupo</Text>
          <Text style={[styles.headerText, styles.colCredito]}>Crédito</Text>
          <Text style={[styles.headerText, styles.colEntrada]}>Entrada</Text>
          <Text style={[styles.headerText, styles.colPct]}>%</Text>
          <Text style={[styles.headerText, styles.colParcela]}>Parcela</Text>
          <Text style={[styles.headerText, styles.colPrazo]}>Prazo</Text>
          <Text style={[styles.headerText, styles.colCF]}>C.F a.m</Text>
          <Text style={[styles.headerText, styles.colDN]}>DN</Text>
        </View>
        {cartas.map((carta, i) => (
          <View
            key={carta.id}
            style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
          >
            <Text style={[styles.cellText, styles.colGrupo]}>{carta.grupo}</Text>
            <Text style={[styles.cellText, styles.colCredito]}>
              {formatBRL(carta.credito)}
            </Text>
            <Text style={[styles.cellText, styles.colEntrada]}>
              {formatBRL(carta.entrada)}
            </Text>
            <Text style={[styles.cellText, styles.colPct]}>
              {formatPercent(carta.porcentagem_entrada)}
            </Text>
            <Text style={[styles.cellText, styles.colParcela]}>
              {formatBRL(carta.parcela)}
            </Text>
            <Text style={[styles.cellText, styles.colPrazo]}>
              {carta.prazo}x
            </Text>
            <Text style={[styles.cellText, styles.colCF]}>
              {formatPercent(carta.custo_financeiro)}
            </Text>
            <Text style={[styles.cellText, styles.colDN]}>
              {formatBRL(carta.dn)}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerName}>Anderson L. Marini</Text>
          <Text style={styles.footerLine}>Sócio gerente</Text>
          <Text style={styles.footerLine}>
            Unidade Joinville - América | Unidade SP - Jardins
          </Text>
          <Text style={styles.footerLine}>(41) 98802-8545</Text>
          <Text style={styles.footerLine}>
            anderson.marini@licenciadoademicon.com.br
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function gerarPDF(cartas: Carta[], totais: Totais) {
  const blob = await pdf(
    <OrcamentoPDF cartas={cartas} totais={totais} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orcamento-ademicon-${new Date().toISOString().slice(0, 10)}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
