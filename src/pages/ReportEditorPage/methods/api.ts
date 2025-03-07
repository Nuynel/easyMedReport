import {OrganDescriptions, ReportData} from "#root/types";

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


export const getAllObservationTemplates = async (): Promise<Record<string, OrganDescriptions> | undefined> => {
  return await fetch('/api/observation-templates', {credentials: 'include'}).then(res => res.json())
}
