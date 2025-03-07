import {navigate} from "vike/client/router";
import {ReportData} from "#root/types";

export const moveToReports = async () => await navigate('/reports')

export const getSavedReportData = () => {
  const currentReport = sessionStorage.getItem('currentReport')
  const parsedReport: Record<string, ReportData> = currentReport && JSON.parse(currentReport)
  if (!parsedReport) moveToReports()
  return Object.values<ReportData>(parsedReport)[0]
}
