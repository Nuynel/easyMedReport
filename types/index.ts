export type ReportType = 'TEMPLATE' | 'SELECT'
export type AnimalSpecies = 'собаки' | 'кошки'
export type Organ = string
export type DescriptionKey = string
export type DescriptionValue = string

export type OrganUltrasoundData = Record<DescriptionKey, DescriptionValue>

export type Templates = Record<Organ, OrganUltrasoundData>

export type ReportData = {
  reportId: string,
  reportTitle: string,
  reportType: ReportType,
  animalSpecies: AnimalSpecies,
  descriptions: Record<Organ, OrganUltrasoundData>
}

