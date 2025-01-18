import {useState, useEffect} from "react"
import { navigate } from 'vike/client/router'
import clsx from "clsx";
import HoldButton from "../shared/ui/HoldButton";
import {ReportData} from "../../types";
import {checkAndRefreshAccessToken} from "../shared/methods/tokenMethods";

type REPORT_IDS = 'report_1' | 'report_2'

const getReports = async (): Promise<Record<REPORT_IDS, ReportData>> => {
  return fetch('/api/reports')
    .then(res => res.json())
    .catch(e => {
      window.alert('У нас проблема( Скажи Алисе, что не можешь получить отчеты с бэка')
      console.error(e)
    })
}

const deleteReport = async (reportId: string) => {
  const queryParams = new URLSearchParams({reportId}).toString();
  return fetch(`/api/report?${queryParams}`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json",},
    credentials: "include",
  })
}

const ReportChooserPage = () => {
  const [reports, setReports] = useState<Record<REPORT_IDS, ReportData> | null>(null)

  useEffect(() => {
    checkAndRefreshAccessToken()
    getReports().then(reportsData => setReports(reportsData))
    sessionStorage.setItem('currentReport', 'null')
  }, [])

  const handleOpenReport = async (reportId: string, value: ReportData) => {
    sessionStorage.setItem('currentReport', JSON.stringify({[reportId]: {...value}}))
    await navigate('/report_editor')
  }

  const handleDeleteReport = (reportId: string) => {
    deleteReport(reportId).then(res => {
      if (res.status === 200) return getReports().then(reportsData => setReports(reportsData))
    }).catch(e => {
      window.alert('У нас проблема( Скажи Алисе, что не можешь удалить отчет')
      console.error(e)
    })
  }

  if (!reports) return null;

  return (
    <div className='w-full min-h-screen flex justify-center py-4'>
      <div className='w-[calc(100vw-2rem)] md:w-[50vw] flex flex-col gap-4'>
        {
          Object.entries(reports).map(([key, value]) => (
            <div key={key} className='flex w-full'>
              <button
                className={clsx(
                  'grow transition-all duration-300 text-white rounded-xl px-4 h-12',
                  value.reportTitle ? 'bg-blue-500 hover:bg-blue-400 active:bg-blue-600 mr-4' : 'bg-gray-400 hover:bg-gray-300 active:bg-gray-500'
                )}
                onClick={() => handleOpenReport(key, value)}
              >{value.reportTitle || 'Пусто'}</button>
              {value.reportTitle && (
                <HoldButton
                  text='Удалить'
                  handleOnClick={() => handleDeleteReport(key)}
                />
              )}
            </div>
          ))
        }
        <button
          className='bg-purple-600 hover:bg-purple-500 active:bg-purple-600 w-full transition-all duration-300 text-white rounded-xl mr-4 px-4 h-12'
          onClick={() => navigate('/settings')}
        >Настройки</button>
      </div>
    </div>
  )
}

export default ReportChooserPage
