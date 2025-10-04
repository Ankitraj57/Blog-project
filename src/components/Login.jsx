import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import { Logo, Button } from './index'
import { useDispatch } from 'react-redux'
import authService from "../appwrite/auth"
import { useForm } from "react-hook-form"

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState("")

  const login = async (data) => {
    setError("")
    try {
      const session = await authService.login(data)
      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin(userData))
        navigate("/")
      }
    }
    catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-2xl  rounded-3xl shadow-2xl p-10 border border-gray-100">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo width="100px" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Sign in to access your dashboard
        </p>

        {/* Error message */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit(login)} className="space-y-6">

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: "Enter a valid email"
                }
              })}
              placeholder=" "
              className={`peer w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:text-sm transition-all">
              Email
            </label>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder=" "
              className={`peer w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:text-sm transition-all">
              Password
            </label>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all">
            Sign In
          </Button>
        </form>

        {/* Signup */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
