import {saveReport} from "./methods/api";
import OrganDescriptionBlock from "./componets/OrganDescriptionBlock";
import AdditionReportDataEditor from "./componets/ui/AdditionReportDataEditor";
import Select from "../../shared/ui/Select";
import ReportButtonsGroup from "./componets/ui/ReportButtonsGroup";
import ReportEditorHeader from "./componets/ui/ReportEditorHeader";
import { moveToReports } from "./methods/services";
import {useReportData} from "#root/src/pages/ReportEditorPage/useReportData";

// REPORT - состоит из шаблонов описания к разным органам. У одного органа может быть несколько шаблонов
// OBSERVATION_TEMPLATE - шаблон описания
// OBSERVATION_DESCRIPTION - описание с внесенными в него изменениями

// todo фильтровать из дескрипшенов норму для другого вида

// UseCases:
// 1) кнопка назад - а) нет никаких изменений - просто выходим назад
//                   б) есть изменения - bottomSheet => созранить изменения? сохранить / выйти без сохранения
// 2) обзорное узи / отдельные органы - а) нет изменений от дефолта - просто меняем
//                                      б) есть изменения => данные отчета будут перезаписаны. Подтвердить? да
// 3) кошка / осбака - а) нет изменений от дефолта - просто меняем
//                     б) есть изменения => данные отчета будут перезаписаны. Подтвердить? да
// 4) кличка питомца - без клички питомца отчет не сохраняется
// 4) добавить орган - орган должен исчезать из списка доступных к выбору
// 5) изначально область по органом свернута, при клике по органу - окрывается редактирование органа
// 6) контекстное меню - удалить орган
// 7) выбрать описание - описание должно исчезать из списка доступных к выбору
// 8) изменение описания - изменения вносятся в текущей изменяемый отчет, но пока не сохраняются
// 9) скопироать все - копируется отчет целиком
// 10) скопировать сокращенное - копируется только то, что было изменено (опция доступна только для обзорного узи)
// 11) при открытии редактора подгружаем все шаблоны
// 12) при открытии редактора грузим отчет, сохраняем его в savedReport, копируем в editableReport
// 13) после загрузки отчета проверяем, является ли данный отчет дефолтным -
//                              - если он дефолтный, то (ставим переменную isDefault в значение true?)
//                              - если он НЕ дефолтный, то (ставим переменную isDefault в значение false?)
// 14) при сохранении отправляем на бэк editableReport

const ReportEditorPage = () =>  {
  const {
    selectedOrgans,
    allObservationTemplates,
    savedReport,
    editableReport,

    handleChangeAdditionalData,
    handleChangeReportTitle,
    handleReportSwitchSubmit,
    setDescriptionToOrgan,
    handleSetSelectedOrgans,
    removeOrgan,
  } = useReportData()

  const handleSaveReport = async () => {
    if (!allObservationTemplates || !editableReport) return null
    saveReport(editableReport)
      .then(res => res.ok ? moveToReports() : res.json().then(e => window.alert(e.message)))
      .catch(e => console.error(e))
  }

  const copyConciseVersion = () => {
    // const filteredEntries = Object.entries(editableReport.descriptions)
    //   .filter(([organ, descriptions]) =>
    //     !isUnchangedNormal(
    //       descriptions,
    //       ultrasoundData?.[organ] || {},
    //       'норма'
    //     ))
    // const changedOrgans = filteredEntries.map(([key]) => key)
    // const unchangedNormalOrgans = Object.keys(editableReport.descriptions)
    //   .filter((key) => !changedOrgans.includes(key))
    // const finalText = filteredEntries
    //   .map(getOrganDescription)
    //   .join('\n\n')
    //   .concat(`\n\nВ остальных исследованных органах (${
    //     unchangedNormalOrgans.map(organ => organ.toLowerCase()).join(', ')
    //   }) видимых ультрасонографических изменений не выявлено.`)
    // navigator.clipboard.writeText(finalText).then(() => console.log('COPIED!'), (err) => {console.error(err)})
  }

  const copyContent = () => {
    // const finalText = Object.entries(editableReport.descriptions)
    //   .map(getOrganDescription)
    //   .join('\n\n')
    // navigator.clipboard.writeText(finalText).then(() => console.log('COPIED!'), (err) => {console.error(err)})
  }

  if (!allObservationTemplates) return null

  const availableOrgans = Object.keys(allObservationTemplates).filter(organ => !selectedOrgans.includes(organ));

  return (
    <div className='w-full flex justify-center py-4'>
      <div className='w-[calc(100vw-2rem)] md:w-[50vw]'>

        <ReportEditorHeader
          report={editableReport}
          switchReportType={(newReportType) => handleChangeAdditionalData('reportType', newReportType)}
          switchAnimalSpecies={(newAnimalSpecies) => handleChangeAdditionalData('animalSpecies', newAnimalSpecies)}
          moveToReports={moveToReports}
        />

        <AdditionReportDataEditor
          report={editableReport}
          handleSetReportData={(newReportTitle) => handleChangeReportTitle(newReportTitle)}
        />
        <Select availableValues={availableOrgans} setSelectedValues={handleSetSelectedOrgans}/>

        {selectedOrgans.map((key, index) => (
          <OrganDescriptionBlock
            key={key+index}
            organName={key}
            organData={allObservationTemplates[key as keyof typeof allObservationTemplates]}
            allSavedData={editableReport?.descriptions || {}}
            setData={setDescriptionToOrgan}
            removeData={() => removeOrgan(key)}
          />
        ))}

        <ReportButtonsGroup
          showAdditionalButton={editableReport.reportType === 'PREDEFINED'}
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
