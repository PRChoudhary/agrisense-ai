import React from 'react'
import { cn } from '../../utils/cn'

const variantStyles = {
  default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800',
  glass: 'glass dark:glass-dark',
  bordered: 'bg-transparent border-2 border-slate-200 dark:border-slate-800',
  elevated: 'bg-white dark:bg-slate-900 shadow-md border border-slate-100 dark:border-slate-800',
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card = React.forwardRef(({
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl transition-all duration-200',
        variantStyles[variant],
        paddingStyles[padding],
        hoverable && 'hover:shadow-lg hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'
