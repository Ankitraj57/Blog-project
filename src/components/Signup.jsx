import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Logo } from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

function Signup() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState("")
  const { register, handleSubmit, formState: { errors } } = useForm()

  const create = async (data) => {
    setError("")
    try {
      if (!data.email || !data.email.includes('@')) throw new Error('Please enter a valid email address')
      if (!data.password || data.password.length < 8) throw new Error('Password must be at least 8 characters long')

      const userData = await authService.createAccount({
        email: data.email,
        password: data.password,
        name: data.name || ''
      })

      if (userData) {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          dispatch(login(currentUser))
          navigate("/")
        }
      }
    } catch (error) {
      setError(error.message || 'Failed to create account. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl rounded-3xl shadow-2xl p-10 border border-gray-100">
        
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo width="100px" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-6">
          Create your account
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join us to access exclusive content
        </p>

        {/* Error message */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleSubmit(create)} className="space-y-6">

          {/* Full Name */}
          <div className="relative">
            <input
              type="text"
              {...register("name", { required: "Full name is required" })}
              placeholder=" "
              className={`peer w-full px-4 py-3 border rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            <label className="absolute left-4 top-3 text-gray-400 text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-blue-500 peer-focus:text-sm transition-all">
              Full Name
            </label>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

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
            Create Account
          </Button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
