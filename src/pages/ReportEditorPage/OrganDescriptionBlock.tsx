import {useEffect, useState} from "react";
import TextEditor from "../../shared/ui/TextEditor";
import HoldButton from "../../shared/ui/HoldButton";

export type OrganDataProps = {
  organName: string,
  organData: Record<string, string>,
  savedData: Record<string, string>,
  setData: (organName: string, pathologies: Record<string, string>) => void,
  removeData: () => void
}

const OrganDescriptionBlock = ({organName, organData, savedData, setData, removeData}: OrganDataProps) => {
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [selectedPathologies, setSelectedPathologies] = useState<string[]>([])
  const [newPathology, setNewPathology] = useState('')

  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setDescriptions(prevValue => ({...prevValue, []}))
  //   // setDescription({type: event.target.value, text: descriptions[event.target.value].description});
  // };
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

  // const handleEditDescription = (pathology: string, text: string) => {
  //   setDescriptions(prevState => ({...prevState, [pathology]: text}))
  // }

  const availablePathologies = Object.keys(organData).filter(key => !selectedPathologies.includes(key))

  useEffect(() => {
    if (savedData) {
      setDescriptions(savedData)
      setSelectedPathologies(Object.keys(savedData))
    }
  }, [])

  useEffect(() => {
    setData(organName, descriptions)
  }, [descriptions])

  return (
    <div className='border border-gray-500 rounded-md mb-4 p-4 w-full'>
      <div className='flex items-center justify-between mb-4'>
        <div className='mr-4 text-lg font-bold'>{organName}</div>
        <HoldButton text='Удалить сущность' className='' handleOnClick={removeData}/>
      </div>
      <div className='flex mb-4 max-w-full items-center justify-between'>
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
          className='bg-green-400 disabled:bg-gray-300 hover:bg-green-300 active:bg-green-600 transition-all duration-300 text-white rounded-xl px-4 ml-4 h-12 w-28'
          onClick={addNewPathology}
          disabled={!newPathology}
        >Добавить</button>
      </div>
      {descriptions && selectedPathologies.map(pathology => (
        <div className='border border-gray-300 rounded-xl p-4 mb-4' key={'organDescription'+pathology}>
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
