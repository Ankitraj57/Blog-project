import { useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import authService from './appwrite/auth'
import {login, logout} from './store/authSlice'
import {Header, Footer} from './components'
import {Outlet} from 'react-router-dom'
import './App.css'

function App() {
  const [loading, setLoading] = useState("true");

  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData) {
        dispatch(login({userData}))
      }
      else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-col bg-gray-400'>
      <Header/>
      <main className='flex-grow pt-20 pb-10'>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  ) : null
}

export default App
