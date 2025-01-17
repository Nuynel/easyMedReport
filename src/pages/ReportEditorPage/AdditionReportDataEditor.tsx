import RadioButtonGroup from "../../shared/ui/RadioButtonGroup";
import {ReportData, ReportType, AnimalSpecies} from "../../../types";

type AdditionReportDataEditorProps = {
  report: ReportData,
  switchReportType: (newValue: ReportType) => void,
  switchAnimalSpecies: (newValue: AnimalSpecies) => void,
  handleSetReportData: (event: string) => void
}

const AdditionReportDataEditor = ({report, switchReportType, switchAnimalSpecies, handleSetReportData}: AdditionReportDataEditorProps) => (
  <>
    <div className='flex flex-col md:flex-row mb-4 gap-4 w-full items-center justify-center'>
      <RadioButtonGroup
        title='Тип заключения'
        type='reportType'
        value={report.reportType}
        values={[{'TEMPLATE': 'Обзорное УЗИ БП'}, {'SELECT': 'Выбор отдельных органов'}]}
        onChange={(newValue) => switchReportType(newValue as ReportType)}
      />
      <RadioButtonGroup
        title='Вид животного'
        type='animalSpecies'
        value={report.animalSpecies}
        values={[{'кошки': 'Кошка'}, {'собаки': 'Собака'}]}
        onChange={(newValue) => switchAnimalSpecies(newValue as AnimalSpecies)}
      />
    </div>
    <input
      value={report.reportTitle}
      onInput={(event: React.ChangeEvent<HTMLInputElement>) => handleSetReportData(event.target.value)}
      placeholder="Кличка питомца"
      className="border border-gray-500 rounded-md p-2 w-full mb-4"
    />
  </>
)

export default AdditionReportDataEditor
