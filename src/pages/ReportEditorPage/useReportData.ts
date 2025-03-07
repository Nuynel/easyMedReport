import {useEffect, useState} from "react";
import {AnimalSpecies, OrganDescriptions, ReportData, ReportType, Templates} from "#root/types";
import {checkAndRefreshAccessToken} from "#root/src/shared/methods/tokenMethods";
import {getAllObservationTemplates} from "#root/src/pages/ReportEditorPage/methods/api";
import {getSavedReportData} from "#root/src/pages/ReportEditorPage/methods/services";
import {getFilterTemplatesByAnimalSpecies, getTemplatesForNormal} from "#root/src/pages/ReportEditorPage/methods/utils";

type ReportDataValues = string | ReportType | AnimalSpecies | Record<string, OrganDescriptions>

const DEFAULT_REPORT_DATA: ReportData = {
  reportType: 'CUSTOM',
  reportTitle: '',
  reportId: '',
  animalSpecies: 'собаки',
  descriptions: {}
}

export const useReportData = () => {
  const [allObservationTemplates, setAllObservationTemplates] = useState<Templates | null>(null) //                       шаблоны описаний
  const [savedReport, setSavedReport] = useState<ReportData | null>(null) //                                              сохраненный отчет
  const [editableReport, setEditableReport] = useState<ReportData>(DEFAULT_REPORT_DATA) //                                редактируемый отчет
  const [selectedOrgans, setSelectedOrgans] = useState<string[]>([]); //                                                  выбранные органы (возможно, лишнее)

  const [isReportEdited, setIsReportEdited] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [pendingData, setPendingData] = useState<{
    key: keyof ReportData,
    value: ReportDataValues,
    text: string
  } | null>(null)

  useEffect(() => {
    checkAndRefreshAccessToken()
    getAllObservationTemplates().then(res => (res && setAllObservationTemplates(res)))
  }, [])

  useEffect(() => {
    if (allObservationTemplates) {
      const savedReportData = getSavedReportData()
      const isSavedReportModified = !!savedReportData.descriptions
      if (isSavedReportModified) {
        setSavedReport(savedReportData)
      } else {
        const isPredefinedMode = editableReport.reportType === 'PREDEFINED'
        const normalDescriptions = getTemplatesForNormal(allObservationTemplates, 'норма') // todo for dogs and cats
        setSavedReport((): ReportData => ({...savedReportData, descriptions: isPredefinedMode ? normalDescriptions : {}}))
      }
    }
  }, [allObservationTemplates])

  useEffect(() => {
    if (savedReport) {
      setSelectedOrgans(Object.keys(savedReport.descriptions))
      setEditableReport(prevState => ({
        reportId: savedReport.reportId,
        reportTitle: savedReport?.reportTitle || prevState.reportTitle,
        descriptions: savedReport?.descriptions || prevState.descriptions,
        animalSpecies: savedReport?.animalSpecies || prevState.animalSpecies,
        reportType: savedReport?.reportType || prevState.reportType
      }))
    }
  }, [savedReport])

  useEffect(() => {
    if (allObservationTemplates) {
      setIsReportEdited(false)
      const isPredefinedMode = editableReport.reportType === 'PREDEFINED'
      const filterTemplatesByAnimalSpecies = getFilterTemplatesByAnimalSpecies(allObservationTemplates, editableReport.animalSpecies, 'норма')
      const normalDescriptions = getTemplatesForNormal(filterTemplatesByAnimalSpecies, 'норма')
      setEditableReport((prevState) => ({...prevState, descriptions: isPredefinedMode ? normalDescriptions : {}}))
    }
  }, [editableReport.reportType, editableReport.animalSpecies]);

  useEffect(() => {
    setSelectedOrgans(Object.keys(editableReport.descriptions))
  }, [editableReport.descriptions]);

  const handleChangeAdditionalData = (key: 'reportType' | 'animalSpecies', value: ReportType | AnimalSpecies) => {
    if (isReportEdited) {
      setPendingData({ key, value, text: 'Изменение типа отчета обнулит внесенные изменения, подтвердить?' })
      return setShowAlert(true)
    }
    return setEditableReport((prevState) => ({...prevState, [key]: value}))
  }

  const handleChangeReportTitle = (value: string) => {
    setEditableReport((prevState) => ({...prevState, reportTitle: value}))
  }

  const handleReportSwitchSubmit = () => {
    if (pendingData) {
      setEditableReport(prevState => ({...prevState, [pendingData.key]: pendingData.value}))
      setPendingData(null)
    }
  }

  const setDescriptionToOrgan = (organName: string, newDescriptions: OrganDescriptions) => {
    setEditableReport(prevState => ({...prevState, descriptions: {...prevState.descriptions, [organName]: newDescriptions}}))
  }

  const handleSetSelectedOrgans = (newValue: string) => {
    setSelectedOrgans((prevState) => [...prevState, newValue])
  }

  const removeOrgan = (organName: string) => {
    setSelectedOrgans(prevState => prevState.filter(value => value !== organName))
    setEditableReport(prevState => {
      const { [organName]: _, ...rest } = prevState.descriptions
      return { ...prevState, descriptions: rest }
    })
  }

  return {
    selectedOrgans,
    allObservationTemplates,
    savedReport,
    editableReport,
    showAlert,

    handleChangeAdditionalData,
    handleChangeReportTitle,
    handleReportSwitchSubmit,
    setDescriptionToOrgan,
    handleSetSelectedOrgans,
    removeOrgan,
  }
}
