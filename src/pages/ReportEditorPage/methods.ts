import {OrganUltrasoundData, ReportData, Templates} from "../../../types";
import { navigate } from 'vike/client/router'

export const moveToReports = async () => await navigate('/reports')

export const getTemplatesForNormal = (ultrasoundData: Templates, maskOfHealthyStateKey: string): Record<string, OrganUltrasoundData> => {
  return Object.entries(ultrasoundData).reduce((acc, [key, descriptions]) => {
    const healthyStateKey = Object.keys(descriptions).filter(key => key.toLowerCase().includes(maskOfHealthyStateKey))[0]
    return healthyStateKey
      ? {...acc, [key]: { [healthyStateKey]: descriptions[healthyStateKey]}}
      : { ...acc, [key]: {}}}, {})
}

export const getSavedReportData = () => {
  const currentReport = sessionStorage.getItem('currentReport')
  const parsedReport: Record<string, ReportData> = currentReport && JSON.parse(currentReport)
  if (!parsedReport) moveToReports()
  return Object.values<ReportData>(parsedReport)[0]
}

export const getOrganDescription = ([organ, descriptions]: [string, OrganUltrasoundData]) => (
  organ.toUpperCase() + ': ' +  Object.values(descriptions).join('\n')
)

export const isUnchangedNormal = (
  organ: string,
  pathologies: OrganUltrasoundData,
  defaultOrganDescriptions: OrganUltrasoundData,
  maskOfHealthyStateKey: string
) => {
  if (Object.entries(pathologies).length !== 1) return false;
  const [key, description] = Object.entries(pathologies)[0];
  return key.toLowerCase().includes(maskOfHealthyStateKey) && description === defaultOrganDescriptions[key]
};
