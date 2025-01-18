import {useState, useEffect} from "react";
import {saveTemplate, deleteTemplate} from "./api";
import {Templates} from "../../../../types";
import HoldButton from "../../../shared/ui/HoldButton";

type TemplateEditorProps = { templates: Templates, back: () => void }

const TemplateEditor = ({templates, back}: TemplateEditorProps) => {
  const [organ, setOrgan] = useState('')
  const [pathologies, setPathologies] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const organs = Object.keys(templates)
  useEffect(() => { if(organ) setPathologies(Object.keys(templates[organ])) }, [organ])
  useEffect(() => { if(title) setDescription(templates[organ][title]) }, [title])

  // const handleSetTemplateNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTitle(event.target.value)
  // }

  const handleSaveTemplate = () => {
    saveTemplate({organ, title, description})
      .then(res => {
        console.log(res)
        back()
      })
      .catch(e => console.error(e))
  }

  const handleDeleteTemplate = () => {
    deleteTemplate({organ, type: title}).then(res => {
      console.log(res)
      back()
    })
      .catch(e => console.error(e))
  }

  return (
    <div>
      <select
        className='w-full border rounded-md p-2 mb-4'
        onChange={(e) => setOrgan(e.target.value)}
        value={organ}
      >
        <option value="" disabled>Выберите орган</option>
        {organs.map((organ) => (
          <option key={organ} value={organ}>{organ}</option>
        ))}
      </select>
      <select
        className='w-full border rounded-md p-2 mb-4'
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      >
        <option value="" disabled>Выберите описание</option>
        {pathologies.map((pathology) => (
          <option key={pathology} value={pathology}>{pathology}</option>
        ))}
      </select>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Описание"
        className="border border-gray-500 rounded-md p-2 w-full mb-4"
      />
      <HoldButton
        text='Удалить шаблон'
        handleOnClick={handleDeleteTemplate}
      />
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
        onClick={handleSaveTemplate}
      >Сохранить шаблон</button>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-12'
        onClick={back}
      >Назад</button>
    </div>
  )
}

export default TemplateEditor
