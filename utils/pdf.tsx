import { Carta } from "@/types";
import { formatBRL, formatPercent } from "@/utils/finance";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Svg,
  Path,
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <Svg viewBox="0 0 1606 1126" width={28} height={20}>
              <Path
                d="M1407.16 985.975C1378.74 1032.88 1329.4 1065.4 1272.17 1070.05H1022.27C975.625 1070.05 976.675 1029.48 976.675 1029.48V754.798C977.201 712.394 1016.89 712.289 1016.89 712.289L1424.45 712.394C1475.45 712.394 1508.74 704.559 1530.44 694.479L1407.18 985.993L1407.16 985.975ZM648.47 124.844C648.47 124.844 604.296 69.8195 542.831 67.8562C542.831 67.8562 572.549 56.4621 600.779 55.9187H945.4C945.4 55.9187 1001.91 55.1299 1035.57 93.0284L1509.86 572.51C1577.27 652.724 1453.98 655.213 1453.98 655.213H1102.95L648.47 124.844ZM469.43 655.196H132.754C132.754 655.196 19.1165 658.912 84.4146 572.51L456.076 137.097C456.076 137.097 520.499 67.6108 607.569 159.307L754.232 329.71L469.43 655.178V655.196ZM583.12 712.289C583.12 712.289 622.813 712.394 623.338 754.798V1029.48C623.338 1029.48 624.388 1070.05 577.712 1070.05H332.988C273.483 1067.07 221.959 1033.99 192.679 985.625L69.5558 694.462C91.2752 704.559 124.563 712.394 175.597 712.394L583.137 712.289H583.12ZM1573.46 559.608C1572.39 558.574 1571.53 557.382 1570.48 556.33L1077.34 55.0423C1028.74 1.54258 956.129 0.105176 945.208 0H599.711C562.433 0.718705 526.275 14.4092 522.179 15.7414C470.077 32.6572 429.491 81.5292 426.359 84.9299C425.764 85.596 425.169 86.2621 424.591 86.9457L26.5897 559.538C25.9421 560.309 25.3471 561.081 24.7345 561.869C-22.922 621.978 12.0634 704.19 17.0164 715.935L140.139 1007.12C141.189 1009.59 142.397 1011.97 143.797 1014.25C183.806 1080.34 253.461 1122.09 330.083 1125.93C331.028 1125.98 331.991 1126 332.971 1126H577.712C615.917 1126 639.544 1110.26 652.618 1097.06C678.293 1071.15 680.218 1038.74 680.218 1029.48V754.114C679.413 690.763 629.674 656.475 583.102 656.335H548.327L789.13 375.672L1029.76 656.335H1016.72C970.305 656.475 920.548 690.78 919.778 754.114C919.761 754.36 919.761 754.587 919.761 754.78V1029.47C919.761 1038.72 921.703 1071.13 947.343 1097.04C960.434 1110.24 984.061 1125.98 1022.25 1125.98H1272.17C1273.69 1125.98 1275.27 1125.91 1276.83 1125.79C1350.44 1119.85 1417.43 1078.27 1456.01 1014.6C1457.39 1012.3 1458.61 1009.92 1459.66 1007.45L1582.93 715.935C1588.06 703.84 1637.58 622.03 1573.44 559.591"
                fill="#B21319"
              />
            </Svg>
            <Text style={styles.title}>Orçamento de Consórcio — Ademicon</Text>
          </View>
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
