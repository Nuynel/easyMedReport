import React, { ChangeEvent } from 'react';

const getDatabase = async () => {
  try {
    const response = await fetch('/api/db', {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch database');
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // Создаём ссылку и симулируем клик
    const link = document.createElement('a');
    link.href = url;
    link.download = 'database.json';
    link.click();

    // Освобождаем память
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading database:', error);
  }
};

const JsonFileUploader: React.FC = () => {
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsedJson = JSON.parse(text);

      const response = await fetch('/api/db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedJson),
      });

      if (!response.ok) {
        throw new Error('Failed to upload JSON file');
      }

      console.log('JSON file uploaded successfully');
    } catch (error) {
      console.error('Error uploading JSON file:', error);
    }
  };

  return (
    <>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-12'
        onClick={getDatabase}
      >Выгрузить базу на устройство</button>
      <input
        type="file"
        accept="application/json"
        name='jsonInput'
        id='jsonInput'
        onChange={handleFileChange}
      />
      <label htmlFor='jsonInput'>Загрузите json базу данных</label>
    </>
  );
};

export default JsonFileUploader;
