type ReportButtonsGroupProps = {
  showAdditionalButton: boolean
  handleSaveReport: () => void,
  copyContent: () => void,
  copyConciseVersion: () => void,
  moveToReports: () => void,
}

const ReportButtonsGroup = ({showAdditionalButton, handleSaveReport, copyContent, copyConciseVersion, moveToReports}: ReportButtonsGroupProps) => (
  <>
    {showAdditionalButton ? (
      <>
        <button
          className='bg-green-600 hover:bg-green-500 active:bg-green-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
          onClick={copyContent}
        >Скопировать всё</button>

        <button
          className='bg-green-600 hover:bg-green-500 active:bg-green-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
          onClick={copyConciseVersion}
        >Сокращенное копирование</button>
      </>
    ) : (
      <button
        className='bg-green-600 hover:bg-green-500 active:bg-green-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
        onClick={copyContent}
      >Скопировать</button>
    )}
  </>
)

export default ReportButtonsGroup
