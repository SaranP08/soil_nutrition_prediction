import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const NDVIChart = ({ ndviData }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full h-64">
      <h3 className="text-lg font-semibold mb-2">
        {t("ndviTrends") || "NDVI Over Time"}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ndviData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="ndvi"
            stroke="#34D399"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NDVIChart;
