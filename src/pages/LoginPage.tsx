import { useState, useEffect } from "react";
import { navigate } from 'vike/client/router'
import {checkAndRefreshAccessToken, TOKEN_TTL} from "../shared/methods/tokenMethods";

const signIn = async (data: {pass: string, trustDevice: boolean}): Promise<{accessToken: string}> => {
  return await fetch('/api/sign-in', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data)
  }).then(res => {
    if (res.status === 401) {
      window.alert('Пароль неверный')
      return {accessToken: ''}
    }
    return res.json()
  })
}

const LoginPage = () => {
  const [pass, setPass] = useState('')
  const handleSetPass = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPass(event.target.value);
  };

  useEffect(() => {
    checkAndRefreshAccessToken()
  }, [])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signIn({pass, trustDevice: false}).then(({accessToken}) => {
      if (accessToken) {
        sessionStorage.setItem('accessToken', accessToken)
        sessionStorage.setItem('accessTokenExpiry', `${Date.now() + TOKEN_TTL}`);
        navigate('/reports')
      }
    }).catch(e => window.alert(e))
  }

  return (
    <div className='w-screen h-screen items-center bg-gray-100 flex justify-center'>
      <div className='flex flex-col justify-between h-screen md:h-60 w-screen md:w-80 p-3'>
        <div className='text-5xl'>
          📑🐕
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={pass}
            onInput={handleSetPass}
            placeholder="Пиши пароль"
            className="border-b border-black py-3 w-full text-4xl text-black placeholder:text-black placeholder:opacity-20 bg-transparent focus:outline-none focus:border-b-orange-600"
          />
          <button
            className='flex gap-2.5 justify-center items-center bg-orange-600 hover:bg-orange-500 active:bg-orange-600 transition-all duration-300 text-white text-2xl h-18 my-2 w-full h-12'
            type='submit'
          >Войти
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.58807 16.3153L8.05398 14.7983L13.3807 9.47159H0V7.25568H13.3807L8.05398 1.9375L9.58807 0.411931L17.5398 8.36364L9.58807 16.3153Z" fill="white"/>
            </svg>
          </button>
        </form>
        <div></div>
      </div>
    </div>
  )
}
export default LoginPage
