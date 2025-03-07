import {ReportData} from "#root/types";

type ReportTitleDataEditorProps = {
  report: ReportData,
  handleSetReportData: (event: string) => void
}

const ReportTitleDataEditor = ({report, handleSetReportData}: ReportTitleDataEditorProps) => (
  <div className='flex border-b border-black text-4xl items-center'>
    <input
      value={report.reportTitle}
      onInput={(event: React.ChangeEvent<HTMLInputElement>) => handleSetReportData(event.target.value)}
      placeholder="Кличка питомца"
      className=" py-3 w-full text-black placeholder:text-black placeholder:opacity-20 bg-transparent focus:outline-none focus:border-b-orange-600"
    />
    {report.animalSpecies === 'собаки' ? '🐕' : '🐈'}
  </div>
)

export default ReportTitleDataEditor
