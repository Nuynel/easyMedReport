import {useEffect, useState} from "react";
import {OrganUltrasoundData, ReportData} from "./types";
import {getUltrasoundData, saveReport} from "./api";
import OrganDescriptionBlock from "./OrganDescriptionBlock";
import { navigate } from 'vike/client/router'

const moveToReports = async () => await navigate('/reports')

// todo фильтровать из дескрипшенов норму для другого вида

const ReportEditorPage = () =>  {
  const [finalTexts, setFinalText] = useState<Record<string, Record<string, string>>>({})
  const [ultrasoundData, setUltrasoundData] = useState<Record<string, OrganUltrasoundData> | null>(null)
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]);
  const [organSelectValue, setOrganSelectValue] = useState("");
  const [savedReport, setSavedReport] = useState<ReportData | null>(null)
  const [reportTitle, setReportTitle] = useState('')
  const [reportType, switchReportType] = useState< 'TEMPLATE' | 'SELECT' >('TEMPLATE')
  const [animalSpecies, switchAnimalSpecies] = useState<'DOG'|'CAT'>('CAT')

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
      .then(res => {
        if (res.ok) {
          moveToReports()
        } else { res.json().then(e => window.alert(e.message)) }
      })
      .catch(e => {
        console.error(e)
      })
  }

  const copyConciseVersion = () => {
    const unchangedNormalOrgans: string[] = []
    const mask = `норма ${animalSpecies === 'DOG' ? 'собаки' : 'кошки'}`
    const finalText = Object
      .entries(finalTexts)
      .filter(([organ, pathologies]) => {
        const [firstOrganPathologyKey, firstOrganPathologyDescription] = Object.entries(pathologies)[0]
        const isPathologiesListContainJustUnchangedNormal = ultrasoundData && Object.values(pathologies).length === 1 && firstOrganPathologyKey.toLowerCase().includes(mask) && firstOrganPathologyDescription === ultrasoundData[organ][firstOrganPathologyKey]
        if (isPathologiesListContainJustUnchangedNormal) unchangedNormalOrgans.push(organ)
        return !isPathologiesListContainJustUnchangedNormal
      })
      .map(([key, pathologies]) => {
        const organDescription = Object.values(pathologies).join('\n')
        return key.toUpperCase() + ': ' + organDescription
      })
      .join('\n\n')
      .concat(`\n\nВ остальных исследованных органах (${unchangedNormalOrgans.map(organ => organ.toLowerCase()).join(', ')}) видимых ультрасонографических изменений не выявлено.`)
    navigator.clipboard.writeText(finalText).then(() => console.log('COPIED!'), (err) => {console.error(err)})
  }

  const copyContent = () => {
    console.log(finalTexts)
    const finalText = Object
      .entries(finalTexts)
      .map(([key, pathologies]) => {
        const organDescription = Object.values(pathologies).join('\n')
        return key.toUpperCase() + ': ' + organDescription
      })
      .join('\n\n')
    navigator.clipboard.writeText(finalText).then(() => console.log('COPIED!'), (err) => {console.error(err)})
  }

  const getTemplatesForNormal = (): Record<string, Record<string, string>> => {
    return ultrasoundData ? Object.entries(ultrasoundData).reduce((acc, [key, descriptions]) => {
      const mask = `норма ${animalSpecies === 'DOG' ? 'собаки' : 'кошки'}`
      const firstMatchingKeys = Object.keys(descriptions).filter(key => key.toLowerCase().includes(mask))[0]
      return firstMatchingKeys ? {
        ...acc,
        [key]: { [firstMatchingKeys]: descriptions[firstMatchingKeys]}
      } : {
        ...acc,
        [key]: {}
      }
    }, {}) : {}
  }

  useEffect( () => {
    getUltrasoundData().then(res => (res && setUltrasoundData(res)))
  }, [])

  useEffect(() => {
    if (ultrasoundData) {
      const savedReport = sessionStorage.getItem('currentReport')
      const parsedReport = savedReport && JSON.parse(savedReport)
      if (!parsedReport) moveToReports()
      const reportData = Object.values<ReportData>(parsedReport)[0]
      if (!reportData?.descriptions) {
        const normalDescriptions = getTemplatesForNormal()
        setSavedReport((prevState) => ({...reportData, descriptions: normalDescriptions}))
        setSelectedOrgans(Object.keys(normalDescriptions))
      } else {
        setSavedReport(reportData)
        setSelectedOrgans(Object.keys(reportData.descriptions))
        setReportTitle(reportData.reportTitle || '')
      }
    }
  }, [ultrasoundData])

  useEffect(() => {
    const savedReport = sessionStorage.getItem('currentReport')
    const parsedReport = savedReport && JSON.parse(savedReport)
    if (parsedReport) {
      const reportData = Object.values<ReportData>(parsedReport)[0]
      if (Object.keys(reportData).length) {
        const normalDescriptions = getTemplatesForNormal()
        setSavedReport((prevState) => (prevState && {...prevState, descriptions: reportType === 'TEMPLATE' ? normalDescriptions : {}}))
        setSelectedOrgans(reportType === 'TEMPLATE' ? Object.keys(normalDescriptions) : [])
      }
    }
  }, [reportType, animalSpecies])

  if (!ultrasoundData) return null

  const availableOrgans = Object.keys(ultrasoundData).filter(organ => !selectedOrgans.includes(organ));

  return (
    <div className='w-full flex justify-center py-4'>
      <div className='w-[calc(100vw-2rem)] md:w-[50vw]'>
        <div className='flex flex-col md:flex-row mb-4 gap-4 w-full items-center justify-center'>
          <fieldset className='flex flex-col p-4 border border-gray-300 rounded-xl'>
            <legend className='px-2'>Тип заключения</legend>
            <div className='flex gap-2 items-center'>
              <input
                className='size-4 appearance-none border-2 checked:border-4 rounded-full border-gray-300 checked:border-blue-500 transition duration-300'
                type='radio'
                id='reportType1'
                name='reportType'
                value={reportType}
                defaultChecked={reportType === 'TEMPLATE'}
                // todo disabled если в заключение внесены изменения => или делать предупреждение
                onChange={() => switchReportType('TEMPLATE')}
              />
              <label htmlFor='reportType1'>Обзорное УЗИ БП</label>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                className='size-4 appearance-none border-2 checked:border-4 rounded-full border-gray-300 checked:border-blue-500 transition duration-300'
                type='radio'
                id='reportType2'
                name='reportType'
                value={reportType}
                defaultChecked={reportType === 'SELECT'}
                onChange={() => switchReportType('SELECT')}
              />
              <label htmlFor='reportType2'>Выбор отдельных органов</label>
            </div>
          </fieldset>
          <fieldset className='flex flex-col p-4 border border-gray-300 rounded-xl'>
            <legend className='px-2'>Вид животного</legend>
            <div className='flex gap-2 items-center'>
              <input
                className='size-4 appearance-none border-2 checked:border-4 rounded-full border-gray-300 checked:border-blue-500 transition duration-300'
                type='radio'
                id='animalSpecies1'
                name='animalSpecies'
                value={animalSpecies}
                defaultChecked={animalSpecies === 'CAT'}
                // todo disabled если в заключение внесены изменения => или делать предупреждение
                onChange={() => switchAnimalSpecies('CAT')}
              />
              <label htmlFor='animalSpecies1'>Кошка</label>
            </div>
            <div className='flex gap-2 items-center'>
              <input
                className='size-4 appearance-none border-2 checked:border-4 rounded-full border-gray-300 checked:border-blue-500 transition duration-300'
                type='radio'
                id='animalSpecies2'
                name='animalSpecies'
                value={animalSpecies}
                defaultChecked={animalSpecies === 'DOG'}
                onChange={() => switchAnimalSpecies('DOG')}
              />
              <label htmlFor='animalSpecies2'>Собака</label>
            </div>
          </fieldset>
        </div>
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
              maskOfNorma={`норма ${animalSpecies === 'DOG' ? 'собаки' : 'кошки'}`}
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

        {reportType === 'TEMPLATE' ? (
            <>
              <button
                className='bg-green-600 hover:bg-green-500 active:bg-green-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
                onClick={copyContent}
              >Копировать полное заключение</button>

              <button
                className='bg-green-600 hover:bg-green-500 active:bg-green-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
                onClick={copyConciseVersion}
              >Копировать сокращенное заключение</button>
            </>
        ) : (
          <button
            className='bg-green-600 hover:bg-green-500 active:bg-green-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
            onClick={copyContent}
          >Копировать заключение</button>
        )}

        {/*Todo копировать либо развернутое, либо сжатое заключение*/}

        <button
          className='bg-purple-600 hover:bg-purple-500 active:bg-purple-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
          onClick={moveToReports}
        >Все отчеты</button>
      </div>
    </div>
  )
}

export default ReportEditorPage
