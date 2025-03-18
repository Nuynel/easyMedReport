import {useEffect, useState} from "react";
import {AnimalSpecies, OrganDescriptions, ReportData, ReportType, Templates} from "#root/types";
import {checkAndRefreshAccessToken} from "#root/src/shared/methods/tokenMethods";
import {getAllObservationTemplates} from "#root/src/pages/ReportEditorPage/methods/api";
import {getSavedReportData, moveToReports} from "#root/src/pages/ReportEditorPage/methods/services";
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
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [popupData, setPopupData] = useState<{text: string, onSubmit: () => void} | null>(null)

  useEffect(() => {
    checkAndRefreshAccessToken()
    getAllObservationTemplates().then(res => res && setAllObservationTemplates(res))
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

  const handleChangeAdditionalData = (
    key: 'reportType' | 'animalSpecies',
    value: ReportType | AnimalSpecies
  ) => {
    if (isReportEdited || (savedReport?.descriptions && Object.keys(savedReport?.descriptions).length)) {
      setPopupData({
        text: 'Изменение типа отчета обнулит внесенные изменения, подтвердить?',
        onSubmit: () => submitChangeReportType(key, value as ReportType | AnimalSpecies)
      })
      return setShowBottomSheet(true)
    }
    return setEditableReport((prevState) => ({...prevState, [key]: value}))
  }

  const handlePopupEvent = () => {
    if (popupData) popupData.onSubmit()
    setPopupData(null)
  }

  const submitChangeReportType = (key: 'reportType' | 'animalSpecies', value: ReportType | AnimalSpecies) => {
    setEditableReport(prevState => ({...prevState, [key]: value}))
  }

  const handleChangeReportTitle = (value: string) => {
    setEditableReport((prevState) => ({...prevState, reportTitle: value}))
  }

  const setDescriptionToOrgan = (organName: string, newDescriptions: OrganDescriptions) => {
    setEditableReport(prevState => ({...prevState, descriptions: {...prevState.descriptions, [organName]: newDescriptions}}))
    setIsReportEdited(!!savedReport && Object.values(editableReport.descriptions) !== Object.values(savedReport.descriptions))
  }

  const handleSetSelectedOrgans = (newValue: string) => {
    setSelectedOrgans((prevState) => [...prevState, newValue])
    console.log(1)
  }

  const removeOrgan = (organName: string) => {
    setSelectedOrgans(prevState => prevState.filter(value => value !== organName))
    setIsReportEdited(!!savedReport && Object.values(editableReport.descriptions) !== Object.values(savedReport.descriptions))
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
    showBottomSheet,
    isReportEdited,
    popupData,

    handleChangeAdditionalData,
    handleChangeReportTitle,
    handlePopupEvent,
    setDescriptionToOrgan,
    handleSetSelectedOrgans,
    removeOrgan,
    setShowBottomSheet
  }
}
