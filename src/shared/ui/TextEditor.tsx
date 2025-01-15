import React, {useEffect, useRef, useState} from 'react';

type Props = {
  text: string
  setData: (text: string) => void,
}

const TextEditor = ({text, setData}: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editableText, setEditableText] = useState<string>(`<p>${text}</p>`);

  useEffect(() => {
    setEditableText(text)
    setData(text)
  }, [text])

  // Сохранить текущее содержимое редактора
  const saveContent = () => {
    if (editorRef.current) {
      const editorContent = editorRef.current.innerHTML;

      // Преобразование тегов в inline-стили для совместимости
      const formattedContent = editorContent
        .replace(/<b>(.*?)<\/b>/g, '**$1**')
        .replace(/<i>(.*?)<\/i>/g, '*$1*')

      setEditableText(formattedContent);
      setData(formattedContent);
    }
  };

  // Применить форматирование к выделенному тексту
  const applyStyle = (command: string) => {
    if (editorRef.current) {
      document.execCommand(command, false, undefined);
    }
    saveContent()
  };

  // Обработчик изменений текста
  const handleInput = () => {
    if (editorRef.current) setData(editorRef.current.innerHTML); // Синхронизируем изменения
  };

  return (
    <div className="">
      <div
        ref={editorRef}
        className="border border-gray-300 rounded-md p-2 mt-4"
        contentEditable
        dangerouslySetInnerHTML={{ __html: editableText }}
        onInput={handleInput}
      ></div>
    </div>
  );
};

export default TextEditor;
