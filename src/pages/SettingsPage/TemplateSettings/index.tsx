import {useEffect, useState} from "react";
import {Templates} from "../../../../types";
import {getAllTemplates} from "./api";
import TemplateCreator from "./TemplateCreator";
import TemplateEditor from "./TemplateEditor";

type TemplateSettingsProps = {
  back: () => void
}

const TemplateSettings = ({back}: TemplateSettingsProps) => {
  const [showTemplateCreator, toggleShowTemplateCreator] = useState(false)
  const [showTemplateEditor, toggleShowTemplateEditor] = useState(false)

  const [templates, setTemplates] = useState<Templates>({})

  useEffect(() => {
    if (!showTemplateCreator && !showTemplateEditor) getAllTemplates().then(res => setTemplates(res)).catch(e => console.error(e))
  }, [showTemplateCreator, showTemplateEditor])

  if (showTemplateCreator) return <TemplateCreator templates={templates} back={() => toggleShowTemplateCreator(!showTemplateCreator)}/>
  if (showTemplateEditor) return <TemplateEditor templates={templates} back={() => toggleShowTemplateEditor(!showTemplateEditor)}/>

  return (
    <>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-12'
        onClick={() => toggleShowTemplateCreator(!showTemplateCreator)}
      >Добавить шаблон</button>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-12'
        onClick={() => toggleShowTemplateEditor(!showTemplateEditor)}
      >Изменить шаблон</button>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-12'
        onClick={back}
      >Назад</button>
    </>
  )
}

export default TemplateSettings
