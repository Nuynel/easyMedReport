import {AnimalSpecies, ReportData, ReportType} from "#root/types";

type ReportEditorHeaderProps = {
  report: ReportData,
  moveToReports: () => void,
  switchReportType: (newValue: ReportType) => void,
  switchAnimalSpecies: (newValue: AnimalSpecies) => void,
}

const ReportEditorHeader = ({report, moveToReports, switchReportType, switchAnimalSpecies}: ReportEditorHeaderProps) => (
  <div className='flex justify-between'>
    <div className='w-1/4 flex justify-start'>
      <button
        className='transition-all duration-300 my-2 text-orange-600'
        onClick={moveToReports}
      >Назад</button>
    </div>
    <div className='w-1/2 flex justify-center'>
      <button
        className='transition-all duration-300 my-2'
        onClick={() => switchReportType(report.reportType === 'PREDEFINED' ? 'CUSTOM' : 'PREDEFINED')}
      >{report.reportType === 'PREDEFINED' ? 'Обзорное УЗИ' : 'Отдельные органы'}</button>
    </div>
    <div className='w-1/4 flex justify-end'>
      <button
        className='transition-all duration-300 my-2'
        onClick={() => switchAnimalSpecies(report.animalSpecies === 'собаки' ? 'кошки' : 'собаки')}
      >{report.animalSpecies === 'собаки' ? 'Гав!' : 'Мяу!'}</button>
    </div>
  </div>
)

export default ReportEditorHeader
