import { useState } from "react";
import { navigate } from 'vike/client/router'

const signIn = async (data: {pass: string}) => {
  try {
    return await fetch('/api/sign-in', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data)
    })
  } catch (e) {
    window.alert(e)
  }
}

const LoginPage = () => {
  const [pass, setPass] = useState<string>('')
  const handleSetPass = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPass(event.target.value);
  };

  const handleLogin = () => {
    signIn({pass}).then(res => {
      if (res && res.status === 200) {
        sessionStorage.setItem('authorized', 'true')
        navigate('/reports')
      } else if (res && res.status === 401) {
        window.alert('Пароль неверный')
      } else {
        window.alert('Упс, скажи Алисе, что не можешь войти')
      }
    })
  }

  return (
    <div className='w-screen h-screen	 items-center flex justify-center py-4'>
      <div className='w-[calc(100vw-2rem)] md:w-[50vw]'>

        <input
          type="password"
          value={pass}
          onInput={handleSetPass}
          placeholder="Введите пароль"
          className="border rounded-md p-2 w-full"
        />

        <button
          className='bg-blue-600 hover:bg-blue-500 active:bg-blue-600 transition-all duration-300 text-white rounded-xl my-2 w-full h-12'
          onClick={handleLogin}
        >Войти</button>
      </div>
    </div>
  )
}
export default LoginPage
