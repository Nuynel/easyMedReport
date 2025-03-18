import ContentCopy from "../../../../shared/ui/icons/content_copy.svg";

type ReportButtonsGroupProps = {
  showAdditionalButton: boolean
  handleSaveReport: () => void,
  copyContent: () => void,
  copyConciseVersion: () => void,
  moveToReports: () => void,
  disabled: boolean
}

const ReportButtonsGroup = ({showAdditionalButton, copyContent, copyConciseVersion, disabled}: ReportButtonsGroupProps) => (
  <>
    {showAdditionalButton ? (
      <>
        <button
          className='flex items-center transition-all disabled:opacity-50 duration-300 gap-4 w-full h-12 border-b border-[#BABABA]'
          onClick={copyContent}
          disabled={disabled}
        ><ContentCopy/>Скопировать всё</button>

        <button
          className='flex items-center transition-all disabled:opacity-50 duration-300 gap-4 w-full h-12 border-b border-[#BABABA]'
          onClick={copyConciseVersion}
          disabled={disabled}
        ><ContentCopy/>Сокращенное копирование</button>
      </>
    ) : (
      <button
        className='flex items-center transition-all disabled:opacity-50 duration-300 gap-4 w-full h-12 border-b border-[#BABABA]'
        onClick={copyContent}
        disabled={disabled}
      ><ContentCopy/>Скопировать</button>
    )}
  </>
)

export default ReportButtonsGroup
