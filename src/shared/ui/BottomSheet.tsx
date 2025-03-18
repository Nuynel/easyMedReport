import React, {useEffect} from "react";

type Props = {
  text?: string,
  options: Record<string, () => void>,
  onClose: () => void,
  title: string
}

const BottomSheet = ({title, text = '', options, onClose}: Props) => {
  useEffect(() => {
    console.log('BottomSheet mounted from the ', title)
    document.addEventListener('click', onClose)
    return () => {
      console.log('BottomSheet UNmounted from the ', title)
      document.removeEventListener('click', onClose)
    }
  }, []);

  return (
    <div
      className='fixed bottom-0 left-0 right-0 bg-white p-4 pb-8 z-20 rounded-2xl border-t border-t-[#e8e8e8] shadow-[0_-0.5rem_1rem_rgba(0,0,0,0.4)]'>
      {text && (
        <div>{text}</div>
      )}
      <div className='flex flex-col gap-4 mt-4'>
        {Object.entries(options).map(([key, onClick]) => (
          <button onClick={onClick} key={key} className='whitespace-nowrap border-t pt-4 border-black'>{key}</button>
        ))}
        <button onClick={onClose} className='whitespace-nowrap border-t pt-4 border-black'>Отмена</button>
      </div>
    </div>
  )
}

export default BottomSheet
