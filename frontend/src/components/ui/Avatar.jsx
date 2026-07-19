import React from 'react'
import { cn } from '../../utils/cn'
import { getInitials } from '../../utils/formatters'

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
}

const statusStyles = {
  online: 'bg-emerald-500',
  offline: 'bg-slate-400',
  away: 'bg-amber-500',
}

export const Avatar = ({
  src,
  name,
  size = 'md',
  status,
  className,
  ...props
}) => {
  return (
    <div className={cn('relative inline-block', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className={cn('rounded-full object-cover bg-slate-100 dark:bg-slate-800', sizeStyles[size])}
        />
      ) : (
        <div className={cn(
          'flex items-center justify-center rounded-full bg-brand-primary text-white font-medium',
          sizeStyles[size]
        )}>
          {getInitials(name)}
        </div>
      )}
      
      {status && (
        <span className={cn(
          'absolute bottom-0 right-0 block rounded-full ring-2 ring-white dark:ring-slate-900',
          statusStyles[status],
          size === 'xs' ? 'w-1.5 h-1.5' :
          size === 'sm' ? 'w-2 h-2' :
          size === 'md' ? 'w-2.5 h-2.5' :
          size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
        )} />
      )}
    </div>
  )
}
