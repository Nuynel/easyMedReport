import {useEffect, useState, useRef, memo} from "react";
import TextEditor from "../../../shared/ui/TextEditor";
import clsx from "clsx";
import Plus from '../../../shared/ui/icons/plus.svg'
import ContextMenu from "../../../shared/ui/ContextMenu";

export type OrganDataProps = {
  organName: string,
  organData: Record<string, string>, // все дефолтные описания состояний органа
  allSavedData: Record<string, Record<string, string>>, // все текущие описания, в тч редактированные
  setData: (organName: string, pathologies: Record<string, string>) => void,
  removeOrgan: () => void
}

const maskOfNorma = 'норма'

const OrganDescriptionBlock = ({organName, organData, allSavedData, setData, removeOrgan}: OrganDataProps) => {
  const [descriptions, setDescriptions] = useState<Record<string, string>>({}) // измененные описания
  // const [selectedPathologies, setSelectedPathologies] = useState<string[]>([]) // лучше сделать геттер от descriptions
  const [newPathology, setNewPathology] = useState('')
  const [isOpen, toggleIsOpen] = useState(false)
  const [isNormaSelected, setIsNormaSelected] = useState(false)

  const handleSetNewPathology = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDescriptions(prevState => ({...prevState, [event.target.value]: organData[event.target.value]}))
    setData(organName, {...descriptions, [event.target.value]: organData[event.target.value]})
    setNewPathology('')
    // setNewPathology(event.target.value)
  }

  // const handleSetData =(text: string) => {
  //
  //   // editableTextsRef.current = {...editableTextsRef.current, [pathology]: text }
  // }

  // // const addNewPathology = () => {
  // //
  // // }

  const handleRemovePathology = (pathology: string) => {
    setDescriptions(prevState => {
      const { [pathology]: _, ...rest } = prevState
      return rest
    })
  }

  console.log(organData)

  const availablePathologies = Object.keys(organData).filter(key => {
    console.log(333, descriptions, key)
    return !Object.keys(descriptions).includes(key)
  })

  useEffect(() => {
    if (Object.keys(allSavedData).length) setDescriptions(allSavedData[organName])
  }, [allSavedData])

  // useEffect(() => {
  //   setData(organName, descriptions)
  // }, [descriptions])

  useEffect(() => {
    const isPathologiesListContainJustNormal = Object.keys(organData).length === 1 && Object.keys(organData)[0].toLowerCase().includes(maskOfNorma)
    setIsNormaSelected(isPathologiesListContainJustNormal)
  }, [Object.keys(organData)])

  return (
    <div className={clsx('flex flex-col w-full')}>
      <div className='flex items-center justify-between w-full border-b border-[#BABABA]'>
        <button
          className='flex items-center gap-2.5 transition-all duration-300 select-none w-full h-14'
          onClick={() => toggleIsOpen(!isOpen)}
        >
          {organName}
          <div className={clsx('transition-all duration-300', isOpen ? '-rotate-90' : 'rotate-90')}>
            {'>'}
          </div>
        </button>
        <ContextMenu options={{'Удалить орган': removeOrgan}}/>
      </div>
      {isOpen && (
        <div className='flex max-w-full gap-2.5 items-center justify-start mt-3 h-12 border-b border-b-[#bababa]'>
          <Plus/>
          <select
            className='max-w-[calc(100%-8rem)] appearance-none bg-[#f0f0f0] focus-visible:outline-none'
            value={newPathology}
            onChange={handleSetNewPathology}
          >
            <option value="" disabled>Выберите описание</option>
            {availablePathologies.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      )}
      {isOpen && descriptions && Object.keys(descriptions).map(pathology => (
        <div className=' bg-[#f0f0f0]' key={'organDescription'+pathology}>
          <div className='flex w-full justify-between items-center h-12 mt-3'>
            <div className='mr-4'>{pathology}</div>
            <ContextMenu options={{'Удалить описание': () => handleRemovePathology(pathology)}}/>
          </div>
          <TextEditor
            text={descriptions[pathology]}
            // descriptionKey={pathology}
            setData={(text) => setData(organName, {...descriptions, [pathology]: text})}
          />
        </div>
      ))}
    </div>
  )
}

export default OrganDescriptionBlock
