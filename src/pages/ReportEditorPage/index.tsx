import {useEffect, useState} from "react";
import {Templates, OrganUltrasoundData, ReportData, ReportType, AnimalSpecies} from "../../../types";
import {getUltrasoundData, saveReport} from "./api";
import OrganDescriptionBlock from "./OrganDescriptionBlock";
import AdditionReportDataEditor from "./AdditionReportDataEditor";
import Select from "../../shared/ui/Select";
import ReportButtonsGroup from "./ReportButtonsGroup";
import {moveToReports, getOrganDescription, getSavedReportData, isUnchangedNormal, getTemplatesForNormal} from "./methods";

// todo фильтровать из дескрипшенов норму для другого вида

const DEFAULT_REPORT_DATA: ReportData = {
  reportType: 'TEMPLATE',
  reportTitle: '',
  reportId: '',
  animalSpecies: 'кошки',
  descriptions: {}
}

const ReportEditorPage = () =>  {
  const [ultrasoundData, setUltrasoundData] = useState<Templates | null>(null)
  const [savedReport, setSavedReport] = useState<ReportData | null>(null)
  const [editableReport, changeEditableReport] = useState<ReportData>(DEFAULT_REPORT_DATA)
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);

  const setDescriptionToOrgan = (organName: string, pathologies: OrganUltrasoundData) => {
    changeEditableReport(prevState => ({...prevState, descriptions: {...prevState.descriptions, [organName]: pathologies}}))
  }
  const handleChangeEditableReport = (key: keyof ReportData, value: string | ReportType | AnimalSpecies | Record<string, OrganUltrasoundData>) => {
    changeEditableReport((prevState => ({...prevState, [key]: value})))
  }
  const handleSetSelectedOrgans = (newValue: string) => {
    setSelectedOrgans((prevState) => [...prevState, newValue])
  }

  const removeOrgan = (organName: string) => {
    setSelectedOrgans(prevState => prevState.filter(value => organName !== value))
    changeEditableReport(prevState => {
      const filteredKeys = Object.keys(prevState.descriptions).filter(value => value !== organName)
      return {...prevState, descriptions: filteredKeys.reduce((acc, current) => ({...acc, [current]: prevState.descriptions[current]}), {})}
    })
  }

  const handleSaveReport = async () => {
    if (!ultrasoundData || !savedReport) return null
    saveReport(editableReport)
      .then(res => res.ok ? moveToReports() : res.json().then(e => window.alert(e.message)))
      .catch(e => console.error(e))
  }

  useEffect( () => {
    getUltrasoundData().then(res => (res && setUltrasoundData(res)))
  }, [])

  useEffect(() => {
    if (ultrasoundData) {
      const savedReportData = getSavedReportData()
      const isSavedReportModified = !!savedReportData.descriptions
      if (isSavedReportModified) {
        setSavedReport(savedReportData)
      } else {
        const isTemplateMode = editableReport.reportType === 'TEMPLATE'
        const normalDescriptions = getTemplatesForNormal(ultrasoundData, `норма ${editableReport.animalSpecies}`)
        setSavedReport((): ReportData => ({...savedReportData, descriptions: isTemplateMode ? normalDescriptions : {}}))
      }
    }
  }, [ultrasoundData, editableReport.reportType, editableReport.animalSpecies])

  useEffect(() => {
    if (savedReport) {
      setSelectedOrgans( Object.keys(savedReport.descriptions))
      changeEditableReport(prevState => ({...prevState, reportId: savedReport.reportId, reportTitle: savedReport?.reportTitle || prevState.reportTitle}))
    }
  }, [savedReport])

  const copyConciseVersion = () => {
    const filteredEntries = Object.entries(editableReport.descriptions)
      .filter(([organ, descriptions]) =>
        isUnchangedNormal(
          organ,
          descriptions,
          ultrasoundData?.[organ] || {},
          `норма ${editableReport.animalSpecies}`
        ))
    const changedOrgans = filteredEntries.map(([key]) => key)
    const unchangedNormalOrgans = Object.keys(editableReport.descriptions)
      .filter((key) => !changedOrgans.includes(key))
    const finalText = filteredEntries
      .map(getOrganDescription)
      .join('\n\n')
      .concat(`\n\nВ остальных исследованных органах (${
        unchangedNormalOrgans.map(organ => organ.toLowerCase()).join(', ')
      }) видимых ультрасонографических изменений не выявлено.`)
    navigator.clipboard.writeText(finalText).then(() => console.log('COPIED!'), (err) => {console.error(err)})
  }

  const copyContent = () => {
    const finalText = Object.entries(editableReport.descriptions)
      .map(getOrganDescription)
      .join('\n\n')
    navigator.clipboard.writeText(finalText).then(() => console.log('COPIED!'), (err) => {console.error(err)})
  }

  if (!ultrasoundData) return null

  const availableOrgans = Object.keys(ultrasoundData).filter(organ => !selectedOrgans.includes(organ));

  return (
    <div className='w-full flex justify-center py-4'>
      <div className='w-[calc(100vw-2rem)] md:w-[50vw]'>

        <AdditionReportDataEditor
          report={editableReport}
          switchReportType={(newReportType) => handleChangeEditableReport('reportType', newReportType)}
          switchAnimalSpecies={(newAnimalSpecies) => handleChangeEditableReport('animalSpecies', newAnimalSpecies)}
          handleSetReportData={(newReportTitle) => handleChangeEditableReport('reportTitle', newReportTitle)}
        />

        {selectedOrgans.map((key) => {
          const savedData = savedReport?.descriptions && savedReport.descriptions[key]
          return (
            <OrganDescriptionBlock
              maskOfNorma={`норма ${editableReport.animalSpecies}`}
              key={key}
              organName={key}
              organData={ultrasoundData[key as keyof typeof ultrasoundData]}
              savedData={savedData || {}}
              setData={setDescriptionToOrgan}
              removeData={() => removeOrgan(key)}
            />
          )
        })}

        <Select availableValues={availableOrgans} setSelectedValues={handleSetSelectedOrgans}/>

        <ReportButtonsGroup
          showAdditionalButton={editableReport.reportType === 'TEMPLATE'}
          handleSaveReport={handleSaveReport}
          copyContent={copyContent}
          copyConciseVersion={copyConciseVersion}
          moveToReports={moveToReports}
        />
      </div>
    </div>
  )
}

export default ReportEditorPage
