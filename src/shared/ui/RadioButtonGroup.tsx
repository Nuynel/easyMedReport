type RadioButtonGroupProps = {
  value: string,
  values: Record<string, string>[],
  title: string,
  type: string,
  onChange: (newValue: string) => void,
}

const RadioButtonGroup = ({title, type, value, values, onChange}: RadioButtonGroupProps) => (
  <fieldset className='flex flex-col p-4 border border-gray-300 rounded-xl w-full md:w-auto'>
    <legend className='px-2'>{title}</legend>
    {values.map((current, index) => {
      const [fieldValue, fieldTitle] = Object.entries(current)[0]
      return (
        (
          <div className='flex gap-2 items-center'>
            <input
              className='size-4 appearance-none border-2 checked:border-4 rounded-full border-gray-300 checked:border-blue-500 transition duration-300'
              type='radio'
              id={type+index}
              name={type}
              value={value}
              defaultChecked={value === fieldValue}
              // todo disabled если в заключение внесены изменения => или делать предупреждение
              onChange={() => onChange(fieldValue)}
            />
            <label htmlFor={type+index}>{fieldTitle}</label>
          </div>
        )
      )
    })}
  </fieldset>
)

export default RadioButtonGroup
