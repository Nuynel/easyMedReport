export type ReportData = {
  reportId: string,
  reportTitle: string,
  descriptions: Record<Organ, OrganUltrasoundData>
}

type Organ = string
type DescriptionKey = string
type DescriptionValue = string

export type OrganUltrasoundData = Record<DescriptionKey, DescriptionValue>
