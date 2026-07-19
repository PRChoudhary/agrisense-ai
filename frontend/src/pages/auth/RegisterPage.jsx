import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react'
import { Button, Input, Select, Divider } from '../../components/ui'
import { useAuth } from '../../contexts/AuthContext'
import { INDIAN_STATES } from '../../utils/constants'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  state: z.string().min(1, 'Please select your state'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    try {
      await registerUser(data)
      navigate('/dashboard')
    } catch (error) {
      // Error is handled by context
    }
  }

  return (
    <div className="animate-fade-in w-full max-w-sm mx-auto">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create an account</h2>
        <p className="mt-2 text-sm text-slate-500">Join AgriSense AI today.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          leftIcon={<User size={18} />}
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email address"
          placeholder="you@example.com"
          type="email"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Phone (Optional)"
            placeholder="9876543210"
            leftIcon={<Phone size={18} />}
            error={errors.phone?.message}
            {...register('phone')}
          />
          
          <Select
            label="State"
            leftIcon={<MapPin size={18} />}
            error={errors.state?.message}
            {...register('state')}
            options={[
              { value: '', label: 'Select State' },
              ...INDIAN_STATES.map(state => ({ value: state, label: state }))
            ]}
          />
        </div>
        
        <Input
          label="Password"
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="flex items-start mt-2">
          <div className="flex h-5 items-center">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
              required
            />
          </div>
          <div className="ml-2 text-sm">
            <label htmlFor="terms" className="text-slate-500">
              I agree to the <a href="#" className="font-medium text-brand-primary">Terms of Service</a> and <a href="#" className="font-medium text-brand-primary">Privacy Policy</a>
            </label>
          </div>
        </div>

        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          className="mt-4"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
