import { createContext } from "react";

export const ReportsContext = createContext({
  reports: [],
  setReports: () => {},
});
