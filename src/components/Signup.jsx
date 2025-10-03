import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Button, Input, Logo } from './index'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'


function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()

    const create = async (data) => {
        setError("")
        try {
            // Ensure email is properly formatted
            if (!data.email || !data.email.includes('@')) {
                throw new Error('Please enter a valid email address')
            }
            
            // Ensure password meets requirements
            if (!data.password || data.password.length < 8) {
                throw new Error('Password must be at least 8 characters long')
            }

            const userData = await authService.createAccount({
                email: data.email,
                password: data.password,
                name: data.name || ''
            })
            
            if (userData) {
                const userData = await authService.getCurrentUser()
                if (userData) {
                    dispatch(login(userData))
                    navigate("/")
                }
            }
        }
        catch (error) {
            setError(error.message || 'Failed to create account. Please try again.')
        }
    }

    return (
        <div className='flex items-center justify-center'>
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className='mb-2 flex justify-center'>
                    <span className='inline-block w-full max-w-[100px]'>
                        <Logo width='100%' />
                    </span>
                </div>
                <h2 className='text-center text-2xl font-bold leading-tight mb-2'>Sign up to create account</h2>
                
                <form onSubmit={handleSubmit(create)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name:"
                            placeholder="Enter your full name"
                            {...register("name", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required:true,
                        })}
                        />
                        <Button
                        type="submit"
                        className='w-full'
                        >Create Account</Button>
                    </div>
                    <p className='mt-2 text-center text-base text-black/60'>
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className='font-medium  text-blue-950 transition-all duration-200 underline'
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
                </form>
            </div>
        </div>
    )
}

export default Signup