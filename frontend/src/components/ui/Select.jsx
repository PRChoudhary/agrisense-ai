import React from 'react'
import { cn } from '../../utils/cn'

const sizeStyles = {
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

export const Select = React.forwardRef(({
  label,
  error,
  hint,
  leftIcon,
  size = 'md',
  fullWidth = false,
  className,
  id,
  options = [],
  children,
  ...props
}, ref) => {
  const selectId = id || Math.random().toString(36).substring(7)
  
  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full', className)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 appearance-none',
            'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
            'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500',
            'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            error && 'border-red-500 focus:ring-red-500 dark:border-red-500',
            leftIcon && 'pl-10',
            sizeStyles[size]
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {children || options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3 text-slate-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      {error && (
        <span id={`${selectId}-error`} className="text-xs text-red-500">
          {error}
        </span>
      )}
      {hint && !error && (
        <span id={`${selectId}-hint`} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </span>
      )}
    </div>
  )
})

Select.displayName = 'Select'
