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
    <div className='w-screen h-screen items-center bg-gray-100 flex justify-center'>
      <div className='h-screen md:h-60 w-screen md:w-80 flex flex-col justify-between p-3'>
        <div className='flex justify-between'>
          <button
            className='transition-all duration-300'
            onClick={() => navigate('/settings')}
          >Настройки</button>
          <div className='text-5xl'>
            🌺
          </div>
        </div>
        <div className='mb-8'>
          {
            Object.entries(reports).map(([key, value]) => (
              <div key={key} className='flex items-center w-full border-b border-black h-20'>
                <button
                  className={clsx(
                    'grow transition-all duration-300 text-4xl flex justify-start',
                    value.reportTitle ? ' mr-4' : 'opacity-50'
                  )}
                  onClick={() => handleOpenReport(key, value)}
                >{value.reportTitle || 'Пусто'}</button>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='mr-6'>
                  <path d="M9.05775 17.5C8.55258 17.5 8.125 17.325 7.775 16.975C7.425 16.625 7.25 16.1974 7.25 15.6923V4.30775C7.25 3.80258 7.425 3.375 7.775 3.025C8.125 2.675 8.55258 2.5 9.05775 2.5H17.4423C17.9474 2.5 18.375 2.675 18.725 3.025C19.075 3.375 19.25 3.80258 19.25 4.30775V15.6923C19.25 16.1974 19.075 16.625 18.725 16.975C18.375 17.325 17.9474 17.5 17.4423 17.5H9.05775ZM9.05775 16H17.4423C17.5192 16 17.5898 15.9679 17.6538 15.9038C17.7179 15.8398 17.75 15.7692 17.75 15.6923V4.30775C17.75 4.23075 17.7179 4.16025 17.6538 4.09625C17.5898 4.03208 17.5192 4 17.4423 4H9.05775C8.98075 4 8.91025 4.03208 8.84625 4.09625C8.78208 4.16025 8.75 4.23075 8.75 4.30775V15.6923C8.75 15.7692 8.78208 15.8398 8.84625 15.9038C8.91025 15.9679 8.98075 16 9.05775 16ZM5.55775 21C5.05258 21 4.625 20.825 4.275 20.475C3.925 20.125 3.75 19.6974 3.75 19.1923V6.30775H5.25V19.1923C5.25 19.2693 5.28208 19.3398 5.34625 19.4038C5.41025 19.4679 5.48075 19.5 5.55775 19.5H15.4423V21H5.55775Z" fill="black"/>
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 19.2693C11.5875 19.2693 11.2344 19.1224 10.9408 18.8285C10.6469 18.5349 10.5 18.1818 10.5 17.7693C10.5 17.3568 10.6469 17.0036 10.9408 16.7098C11.2344 16.4161 11.5875 16.2693 12 16.2693C12.4125 16.2693 12.7656 16.4161 13.0592 16.7098C13.3531 17.0036 13.5 17.3568 13.5 17.7693C13.5 18.1818 13.3531 18.5349 13.0592 18.8285C12.7656 19.1224 12.4125 19.2693 12 19.2693ZM12 13.5C11.5875 13.5 11.2344 13.3531 10.9408 13.0593C10.6469 12.7656 10.5 12.4125 10.5 12C10.5 11.5875 10.6469 11.2344 10.9408 10.9408C11.2344 10.6469 11.5875 10.5 12 10.5C12.4125 10.5 12.7656 10.6469 13.0592 10.9408C13.3531 11.2344 13.5 11.5875 13.5 12C13.5 12.4125 13.3531 12.7656 13.0592 13.0593C12.7656 13.3531 12.4125 13.5 12 13.5ZM12 7.73077C11.5875 7.73077 11.2344 7.58394 10.9408 7.29027C10.6469 6.99644 10.5 6.64327 10.5 6.23077C10.5 5.81827 10.6469 5.46519 10.9408 5.17152C11.2344 4.87769 11.5875 4.73077 12 4.73077C12.4125 4.73077 12.7656 4.87769 13.0592 5.17152C13.3531 5.46519 13.5 5.81827 13.5 6.23077C13.5 6.64327 13.3531 6.99644 13.0592 7.29027C12.7656 7.58394 12.4125 7.73077 12 7.73077Z" fill="black"/>
                </svg>
                {/*{value.reportTitle && (*/}
                {/*  <HoldButton*/}
                {/*    text='Удалить'*/}
                {/*    handleOnClick={() => handleDeleteReport(key)}*/}
                {/*  />*/}
                {/*)}*/}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default ReportChooserPage
