import {AnimalSpecies, ReportData, ReportType} from "#root/types";

type ReportEditorHeaderProps = {
  report: ReportData,
  moveToReports: () => void,
  switchReportType: (newValue: ReportType) => void,
  switchAnimalSpecies: (newValue: AnimalSpecies) => void,
}

const ReportEditorHeader = ({report, moveToReports, switchReportType, switchAnimalSpecies}: ReportEditorHeaderProps) => {
  const handleReportTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    switchReportType(report.reportType === 'PREDEFINED' ? 'CUSTOM' : 'PREDEFINED')
  }

  const handleAnimalSpeciesClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    switchAnimalSpecies(report.animalSpecies === 'собаки' ? 'кошки' : 'собаки')
  }

  return (
    <div className='flex justify-between'>
      <div className='w-1/4 flex justify-start'>
        <button
          data-testid="back-button"
          className='transition-all duration-300 my-2 text-orange-600'
          onClick={moveToReports}
        >Назад
        </button>
      </div>
      <div className='w-1/2 flex justify-center'>
        <button
          data-testid="report-type-switcher"
          className='transition-all duration-300 my-2'
          onClick={handleReportTypeClick}
        >{report.reportType === 'PREDEFINED' ? 'Обзорное УЗИ' : 'Отдельные органы'}</button>
      </div>
      <div className='w-1/4 flex justify-end'>
        <button
          data-testid="animal-species-switcher"
          className='transition-all duration-300 my-2'
          onClick={handleAnimalSpeciesClick}
        >{report.animalSpecies === 'собаки' ? 'Гав!' : 'Мяу!'}</button>
      </div>
    </div>
  )
}

export default ReportEditorHeader
