import {useEffect, useState} from "react";
import {OrganUltrasoundData, ReportData} from "./types";
import {getUltrasoundData, saveReport} from "./api";
import OrganDescriptionBlock from "./OrganDescriptionBlock";
import { navigate } from 'vike/client/router'

const moveToReports = async () => await navigate('/reports')

const ReportEditorPage = () =>  {
  const [finalTexts, setFinalText] = useState<Record<string, Record<string, string>>>({})
  const [ultrasoundData, setUltrasoundData] = useState<Record<string, OrganUltrasoundData> | null>(null)
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [organSelectValue, setOrganSelectValue] = useState("");
  const [savedReport, setSavedReport] = useState<ReportData | null>(null)
  const [reportTitle, setReportTitle] = useState('')

  const setData = (organName: string, pathologies: Record<string, string>) => {
    setFinalText((prevState) => ({...prevState, [organName]: pathologies}))
  }

  const handleSetReportData = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setReportTitle(event.target.value);
  };

  const addOrgan = (organName: string) => {
    if (!selectedOrgans.includes(organName)) {
      setSelectedOrgans([...selectedOrgans, organName]);
      setOrganSelectValue("");
    }
  };

  const removeOrgan = (organName: string) => {
    setSelectedOrgans(prevState => prevState.filter(value => organName !== value))
    setFinalText(prevState => {
      const filteredKeys = Object.keys(prevState).filter(value => value !== organName)
      return filteredKeys.reduce((acc, current) => ({...acc, [current]: prevState[current]}), {})
    })
    setOrganSelectValue("");
  }

  const handleSaveReport = async () => {
    if (!ultrasoundData || !savedReport) return null
    saveReport({descriptions: finalTexts, reportId: savedReport.reportId, reportTitle})
      .then(res => console.log(res))
  }

  const copyContent = () => {
    const finalText = Object
      .entries(finalTexts)
      .map(([key, pathologies]) => {
        const organDescription = Object.values(pathologies).join('\n')
        return key.toUpperCase() + ': ' + organDescription
      })
      .join('\n\n')
    navigator.clipboard.writeText(finalText).then(() => console.log('COPIED!'), (err) => {console.error(err)})
  }

  useEffect( () => {
    const savedReport = sessionStorage.getItem('currentReport')
    const parsedReport = savedReport && JSON.parse(savedReport)
    if (parsedReport) {
      const reportData = Object.values<ReportData>(parsedReport)[0]
      setSavedReport(reportData)
      setReportTitle(reportData.reportTitle || '')
      if (reportData?.descriptions) setSelectedOrgans(Object.keys(reportData.descriptions))
    } else moveToReports()
    getUltrasoundData().then(res => (res && setUltrasoundData(res)))
  }, [])

  if (!ultrasoundData) return null

  const availableOrgans = Object.keys(ultrasoundData).filter(organ => !selectedOrgans.includes(organ));

  return (
    <div className='w-full flex justify-center py-4'>
      <div className='w-[calc(100vw-2rem)] md:w-[50vw]'>
        <input
          value={reportTitle}
          onInput={handleSetReportData}
          placeholder="Кличка питомца"
          className="border border-gray-500 rounded-md p-2 w-full mb-4"
        />
        {selectedOrgans.map((key) => {
          const savedData = savedReport?.descriptions && savedReport.descriptions[key]
          return (
            <OrganDescriptionBlock
              key={key}
              organName={key}
              organData={ultrasoundData[key as keyof typeof ultrasoundData]}
              savedData={savedData || {}}
              setData={setData}
              removeData={() => removeOrgan(key)}
            />
          )
        })}

        {availableOrgans.length > 0 && (
          <div className='w-full mb-4'>
            <select
              className='w-full border rounded-md p-2'
              onChange={(e) => addOrgan(e.target.value)}
              value={organSelectValue}
            >
              <option value="" disabled>Выберите орган</option>
              {availableOrgans.map((organ) => (
                <option key={organ} value={organ}>{organ}</option>
              ))}
            </select>
          </div>
        )}

        <button
          className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
          onClick={handleSaveReport}
        >Сохранить заключение</button>

        <button
          className='bg-green-600 hover:bg-green-500 active:bg-green-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
          onClick={copyContent}
        >Копировать итоговое заключение</button>

        <button
          className='bg-purple-600 hover:bg-purple-500 active:bg-purple-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
          onClick={moveToReports}
        >Все отчеты</button>
      </div>
    </div>
  )
}

export default ReportEditorPage
