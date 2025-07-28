import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useTranslation } from "react-i18next";
import { DownloadIcon } from "./Icons.jsx";

const PdfDownloadButton = ({ location, predictions }) => {
  const { t } = useTranslation();

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(t("reportTitle") || "Soil Nutrient Report", 14, 20);
    doc.setFontSize(12);
    doc.text(
      `${t("date") || "Date"}: ${new Date().toLocaleDateString()}`,
      14,
      30
    );
    doc.text(
      `${t("location") || "Location"}: ${location.name || "Unknown"}`,
      14,
      38
    );

    const tableData = predictions.map((p) => [
      p.nutrient,
      p.value.toFixed(2),
      p.status,
      p.recommendation,
    ]);

    doc.autoTable({
      startY: 50,
      head: [[t("nutrient"), t("value"), t("status"), t("recommendation")]],
      body: tableData,
    });

    doc.save("soil_nutrient_report.pdf");
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
    >
      <DownloadIcon className="inline-block mr-2" />{" "}
      {t("downloadReport") || "Download Report"}
    </button>
  );
};

export default PdfDownloadButton;
