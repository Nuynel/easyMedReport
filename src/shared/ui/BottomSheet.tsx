import React from "react";

type Props = {
  text?: string,
  options: Record<string, () => void>
}

const BottomSheet = ({text = '', options}: Props) => (
  <div className='fixed bottom-0 left-0 right-0 bg-white p-4 pb-8 z-20 rounded-2xl border-t border-t-[#e8e8e8]'>
    {text && (
      <div>{text}</div>
    )}
    {Object.entries(options).map(([key, onClick]) => (
      <button onClick={onClick} key={key} className='whitespace-nowrap'>{key}</button>
    ))}
  </div>
)

export default BottomSheet
