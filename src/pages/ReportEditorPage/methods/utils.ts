import {AnimalSpecies, OrganDescriptions, Templates} from "#root/types";

export const getTemplatesForNormal = (ultrasoundDataByOrgan: Templates, healthyKeyPattern: string): Record<string, OrganDescriptions> => {
  return Object.entries(ultrasoundDataByOrgan).reduce((acc, [key, descriptions]) => {
    const healthyStateKey = Object.keys(descriptions).find(key => key.toLowerCase().includes(healthyKeyPattern))
    return healthyStateKey
      ? {...acc, [key]: { [healthyStateKey]: descriptions[healthyStateKey]}}
      : { ...acc, [key]: {}}}, {})
}

export const getOrganDescription = ([organ, descriptions]: [string, OrganDescriptions]) => (
  organ.toUpperCase() + ': ' +  Object.values(descriptions).join('\n')
)

export const isUnchangedNormal = (
  pathologies: OrganDescriptions,
  defaultOrganDescriptions: OrganDescriptions,
  healthyKeyPattern: string
) => {
  if (Object.entries(pathologies).length !== 1) return false;
  const [key, description] = Object.entries(pathologies)[0];
  return key.toLowerCase().includes(healthyKeyPattern) && description === defaultOrganDescriptions[key]
};

export const getFilterTemplatesByAnimalSpecies = (templates: Templates, animalSpecies: AnimalSpecies, healthyKeyPattern: string)=> {
  return Object.entries(templates).reduce<Templates>((acc, [organ, observationTemplates]) => {
    const filteredObservationTemplateKeys = Object.keys(observationTemplates).filter(
      (key: keyof OrganDescriptions) => key.toLowerCase().includes(animalSpecies) || !key.toLowerCase().includes(healthyKeyPattern)
    );
    const filteredObservationTemplates = filteredObservationTemplateKeys.reduce((acc, key) => ({...acc, [key]: observationTemplates[key as keyof OrganDescriptions]}), {})
    return {
      ...acc,
      [organ]: filteredObservationTemplates
    }
  }, {})
} // todo tests
