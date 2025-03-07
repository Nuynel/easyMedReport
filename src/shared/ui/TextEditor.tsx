import React, {useRef, memo} from 'react';

type Props = {
  text: string
  setData: (text: string) => void,
}

const TextEditor = memo(
  ({text, setData}: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // // Сохранить текущее содержимое редактора
  // const saveContent = () => {
  //   if (editorRef.current) {
  //     const editorContent = editorRef.current.innerHTML;
  //
  //     // Преобразование тегов в inline-стили для совместимости
  //     const formattedContent = editorContent
  //       .replace(/<b>(.*?)<\/b>/g, '**$1**')
  //       .replace(/<i>(.*?)<\/i>/g, '*$1*')
  //
  //     setEditableText(formattedContent);
  //     setData(formattedContent);
  //   }
  // };

  // // Применить форматирование к выделенному тексту
  // const applyStyle = (command: string) => {
  //   if (editorRef.current) {
  //     document.execCommand(command, false, undefined);
  //   }
  //   saveContent()
  // };

  // Обработчик изменений текста
  const handleInput = () => {
    if (editorRef.current) setData(editorRef.current.innerHTML); // Синхронизируем изменения
  };

  return (
    <div
      ref={editorRef}
      className="border border-[#e8e8e8] bg-white rounded-md p-2 mb-8"
      contentEditable
      dangerouslySetInnerHTML={{ __html: text.includes('<p>') ? text : `<p>${text}</p>` }}
      onInput={handleInput}
    ></div>
  );
},
  () => true
)

export default TextEditor;
