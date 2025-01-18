import {useEffect, useState} from "react";
import TextEditor from "../../shared/ui/TextEditor";
import HoldButton from "../../shared/ui/HoldButton";
import clsx from "clsx";

export type OrganDataProps = {
  maskOfNorma: string,
  organName: string,
  organData: Record<string, string>,
  savedData: Record<string, string>,
  setData: (organName: string, pathologies: Record<string, string>) => void,
  removeData: () => void
}

const OrganDescriptionBlock = ({organName, organData, maskOfNorma, savedData, setData, removeData}: OrganDataProps) => {
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [selectedPathologies, setSelectedPathologies] = useState<string[]>([])
  const [newPathology, setNewPathology] = useState('')
  const [isOpen, toggleIsOpen] = useState(false)
  const [isNormaSelected, setIsNormaSelected] = useState(false)

  const handleSetNewPathology = (event: React.ChangeEvent<HTMLSelectElement>) => setNewPathology(event.target.value)

  const addNewPathology = () => {
    setSelectedPathologies(prevState => [...prevState, newPathology])
    setDescriptions(prevState => ({...prevState, [newPathology]: organData[newPathology]}))
    setNewPathology('')
  }

  const handleRemoveData = (pathology: string) => {
    setSelectedPathologies(prevState => prevState.filter(value => value !== pathology))
    setDescriptions(prevState => prevState &&
      Object.entries(prevState).filter(([key, value]) => key !== pathology)
        .reduce((acc, [key, value]) => ( { ...acc, [key]: value }), {}))
  }

  const availablePathologies = Object.keys(organData).filter(key => !selectedPathologies.includes(key))

  useEffect(() => {
    if (Object.keys(savedData).length) {
      setDescriptions(savedData)
      setSelectedPathologies(Object.keys(savedData))
    }
  }, [savedData])

  useEffect(() => {
    setData(organName, descriptions)
  }, [descriptions])

  useEffect(() => {
    const isPathologiesListContainJustNormal = selectedPathologies.length === 1 && selectedPathologies[0].toLowerCase().includes(maskOfNorma)
    setIsNormaSelected(isPathologiesListContainJustNormal)
  }, [selectedPathologies])

  return (
    <div className={clsx('flex flex-col gap-4 border border-gray-500 rounded-md mb-4 p-4 w-full', isNormaSelected ? 'bg-green-50' : 'bg-violet-50')}>
      <div className='flex items-center justify-between'>
        <div className='mr-4 font-bold'>{organName}</div>
        <div className='flex gap-4'>
          <HoldButton text='Удалить' className='w-24' handleOnClick={removeData}/>
          <button
            className='bg-blue-400 hover:bg-blue-300 active:bg-blue-600 transition-all duration-300 text-white rounded-xl px-4 size-12 select-none'
            onClick={() => toggleIsOpen(!isOpen)}
          ><div className={clsx(!isOpen && 'rotate-180')}>^</div></button>
        </div>
      </div>
      {isOpen && (
        <div className='flex max-w-full items-center justify-between'>
          <select
            className='border rounded-md p-2 max-w-[calc(100%-8rem)]'
            value={newPathology}
            onChange={handleSetNewPathology}
          >
            <option value="" disabled>Выберите описание</option>
            {availablePathologies.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <button
            className='bg-green-400 disabled:bg-gray-300 hover:bg-green-300 active:bg-green-600 transition-all duration-300 text-white rounded-xl px-4 ml-4 h-12 w-28 select-none'
            onClick={addNewPathology}
            disabled={!newPathology}
          >Добавить</button>
        </div>
      )}
      {isOpen && descriptions && selectedPathologies.map(pathology => (
        <div className='border border-gray-300 rounded-xl p-4 bg-white' key={'organDescription'+pathology}>
          <div className='flex w-full justify-between items-center'>
            <div className='mr-4'>{pathology}</div>
            <HoldButton text='Удалить описание' className='' handleOnClick={() => handleRemoveData(pathology)}/>
          </div>
          <TextEditor
            text={descriptions[pathology]}
            setData={(text: string) => setData(organName, {...descriptions, [pathology]: text})}
          />
        </div>
      ))}
    </div>
  )
}

export default OrganDescriptionBlock
