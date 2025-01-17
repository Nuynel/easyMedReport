type ReportButtonsGroupProps = {
  showAdditionalButton: boolean
  handleSaveReport: () => void,
  copyContent: () => void,
  copyConciseVersion: () => void,
  moveToReports: () => void,
}

const ReportButtonsGroup = ({showAdditionalButton, handleSaveReport, copyContent, copyConciseVersion, moveToReports}: ReportButtonsGroupProps) => (
  <>
    <button
      className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
      onClick={handleSaveReport}
    >Сохранить заключение</button>

    {showAdditionalButton ? (
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
  </>
)

export default ReportButtonsGroup
