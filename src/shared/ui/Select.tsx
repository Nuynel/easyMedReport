import {useState} from "react";

type SelectProps = {
  availableValues: string[],
  setSelectedValues: (newValue: string) => void,
}

const Select = ({availableValues, setSelectedValues}: SelectProps) => {
  const [selectedValue, setSelectedValue] = useState("");

  const pushValue = (value: string) => {
    setSelectedValues(value);
    setSelectedValue("");
  };

  if (!availableValues.length) return null

  return (
    <div className='w-full flex items-center mb-4 border-b border-black'>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.25 12.75H5.5V11.25H11.25V5.5H12.75V11.25H18.5V12.75H12.75V18.5H11.25V12.75Z" fill="black"/>
      </svg>
      <select
        className='w-full p-2 appearance-none focus:outline-none bg-[#f0f0f0]'
        onChange={(e) => pushValue(e.target.value)}
        value={selectedValue}
      >
        <option value="" disabled>
          Добавить орган
        </option>
        {availableValues.map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
    </div>
  )
}

export default Select
