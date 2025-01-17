import {OrganUltrasoundData, ReportData} from "../../../types";

export const saveReport = async (data: ReportData) => {
  return await fetch('/api/report', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data)
  })
}


export const getUltrasoundData = async (): Promise<Record<string, OrganUltrasoundData> | undefined> => {
  return await fetch('/api/descriptions', {credentials: 'include'}).then(res => res.json())
}
