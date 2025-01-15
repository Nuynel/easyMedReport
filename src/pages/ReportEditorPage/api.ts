import {OrganUltrasoundData, ReportData} from "./types";

export const saveReport = async (data: ReportData) => {
  try {
    return await fetch('/api/report', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data)
    }).then(res => res.json())
  } catch (e) {
    console.error(e)
  }
}


export const getUltrasoundData = async (): Promise<Record<string, OrganUltrasoundData> | undefined> => {
  try {
    return await fetch('/api/descriptions').then(res => res.json())
  } catch (e) {
    console.log('error => ', e)
  }
}
