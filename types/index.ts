export type ReportType = 'PREDEFINED' | 'CUSTOM'
export type AnimalSpecies = 'собаки' | 'кошки'
export type Organ = string
export type DescriptionKey = string
export type DescriptionValue = string

export type OrganDescriptions = Record<DescriptionKey, DescriptionValue>

export type Templates = Record<Organ, OrganDescriptions>

export type ReportData = {
  reportId: string,
  reportTitle: string,
  reportType: ReportType,
  animalSpecies: AnimalSpecies,
  descriptions: Record<Organ, OrganDescriptions>
}
