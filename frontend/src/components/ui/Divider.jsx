import React from 'react'
import { cn } from '../../utils/cn'

export const Divider = ({
  orientation = 'horizontal',
  label,
  className,
  ...props
}) => {
  if (orientation === 'vertical') {
    return (
      <div 
        className={cn('w-px h-full bg-slate-200 dark:bg-slate-800 mx-4 inline-block', className)} 
        role="separator" 
        aria-orientation="vertical"
        {...props} 
      />
    )
  }

  if (label) {
    return (
      <div className={cn('flex items-center w-full my-6', className)} {...props}>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        <span className="flex-shrink-0 mx-4 text-sm text-slate-400 font-medium">{label}</span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      </div>
    )
  }

  return (
    <hr 
      className={cn('border-slate-200 dark:border-slate-800 my-6', className)} 
      role="separator"
      {...props} 
    />
  )
}
