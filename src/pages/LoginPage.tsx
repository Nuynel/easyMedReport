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
  const [trustDevice, toggleTrustDevice] = useState(false)
  const handleSetPass = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPass(event.target.value);
  };

  useEffect(() => {
    checkAndRefreshAccessToken()
  }, [])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    signIn({pass, trustDevice}).then(({accessToken}) => {
      if (accessToken) {
        sessionStorage.setItem('accessToken', accessToken)
        sessionStorage.setItem('accessTokenExpiry', `${Date.now() + TOKEN_TTL}`);
        navigate('/reports')
      }
    }).catch(e => window.alert(e))
  }

  return (
    <div className='w-screen h-screen	 items-center flex justify-center py-4'>
      <div className='w-[calc(100vw-2rem)] md:w-[50vw]'>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={pass}
            onInput={handleSetPass}
            placeholder="Введите пароль"
            className="border rounded-md p-2 w-full"
          />
          <input
            type='checkbox'
            id='trustCheckbox'
            name='trustCheckbox'
            onChange={() => toggleTrustDevice(!trustDevice)}
            checked={trustDevice}
          />
          <label htmlFor='trustCheckbox'>Доверять устройству</label>


          <button
            className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
            type='submit'
          >Войти</button>
        </form>
      </div>
    </div>
  )
}
export default LoginPage
