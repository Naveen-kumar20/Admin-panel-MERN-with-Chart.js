import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Orders from './pages/Orders'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './app/store'
import ProtectedRoute from './components/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { axiosInstance } from './api/axiosInstance'
import { setCredentials } from './features/authSlice'
import DashboardLayout from './components/DashboardLayout'
import { Loader2 } from 'lucide-react'

function App() {
  const dispatch = useDispatch()
  const {isAuthenticated} = useSelector((state:RootState) => state.auth)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    async function refreshFetch(){
      try {
        const res = await axiosInstance.post('/auth/refresh');
        const {user, accessToken} = res.data
        dispatch(setCredentials({user, accessToken}))
      } catch (error) {
        //didn't write anything here, so even on first visit doesn't give error.
        }finally{
          setIsLoading(false)
        }
      }
    refreshFetch()
  }, [])

  if(isLoading){
    return(
      <div className='w-screen h-screen flex justify-center items-center animate-spin'>
        <Loader2/>
      </div>
    )
  }


  return (
    <>
    <Toaster/>
      <Routes>
        <Route path='/' element={<ProtectedRoute isAuthenticated={isAuthenticated}><Dashboard/></ProtectedRoute> }>
          <Route index element={<DashboardLayout/>}/>
          <Route path='orders' element={<Orders/>}/>
        </Route>
        <Route path='/login' element={isAuthenticated ? <Navigate to='/' replace/> : <Login/>}/>
        <Route path='/signup' element={isAuthenticated ? <Navigate to='/' replace/> : <Signup/>}/>
      </Routes>
    </>
  )
}

export default App
