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
    <div className='w-full mb-4'>
      <select
        className='w-full border rounded-md p-2'
        onChange={(e) => pushValue(e.target.value)}
        value={selectedValue}
      >
        <option value="" disabled>Выберите орган</option>
        {availableValues.map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>
    </div>
  )
}

export default Select
