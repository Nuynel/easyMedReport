import { navigate } from 'vike/client/router'
import {useEffect, useState} from "react";
import TemplateSettings from "./TemplateSettings";
import {checkAndRefreshAccessToken} from "../../shared/methods/tokenMethods";
import JsonFileUploader from "./ProfileSettings/JsonInput";

const SettingsPageWrapper = ({children}: SettingsPageWrapperProps) => (
  <div className='w-full flex justify-center py-4'>
    <div className='w-[calc(100vw-2rem)] md:w-[50vw] flex flex-col gap-4'>
      {children}
    </div>
  </div>
)

type ProfileSettingsProps = {
  back: () => void
}

const ProfileSettings = ({back}: ProfileSettingsProps) => {
  // todo выкачать и закачать базу данных
  return (
    <>
      <JsonFileUploader/>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-12'
        onClick={back}
      >Назад</button>
    </>
  )
}

type ThemeSettingsProps = {
  back: () => void
}

const ThemeSettings = ({back}: ThemeSettingsProps) => {
  return (
    <>
      Пока не готово
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-12'
        onClick={back}
      >Назад</button>
    </>
  )
}

type SettingsPageWrapperProps = {children: React.ReactNode}

const SettingsPage = () => {
  const [showTemplateSettings, toggleShowTemplateSettings] = useState(false)
  const [showProfileSettings, toggleShowProfileSettings] = useState(false)
  const [showThemeSettings, toggleShowThemeSettings] = useState(false)

  useEffect(() => {
    checkAndRefreshAccessToken()
  }, [])

  if (showTemplateSettings) return (
    <SettingsPageWrapper>
      <TemplateSettings back={() => toggleShowTemplateSettings(!showTemplateSettings)}/>
    </SettingsPageWrapper>
  )
  if (showProfileSettings) return (
    <SettingsPageWrapper>
      <ProfileSettings back={() => toggleShowProfileSettings(!showProfileSettings)}/>
    </SettingsPageWrapper>
  )
  if (showThemeSettings) return (
    <SettingsPageWrapper>
      <ThemeSettings back={() => toggleShowThemeSettings(!showThemeSettings)}/>
    </SettingsPageWrapper>
  )

  return (
    <SettingsPageWrapper>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-[calc(((100vh-1rem)/4)-1rem)] md:h-12'
        onClick={() => toggleShowTemplateSettings(!showTemplateSettings)}
      >Редактор шаблонов</button>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-[calc(((100vh-1rem)/4)-1rem)] md:h-12'
        onClick={() => toggleShowProfileSettings(!showProfileSettings)}
      >Настройка учетной записи</button>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-[calc(((100vh-1rem)/4)-1rem)] md:h-12'
        onClick={() => toggleShowThemeSettings(!showThemeSettings)}
      >Редактор темы</button>
      <button
        className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-[calc(((100vh-1rem)/4)-1rem)] md:h-12'
        onClick={() => navigate('/reports')}
      >Назад</button>
    </SettingsPageWrapper>
  )
}

export default SettingsPage
