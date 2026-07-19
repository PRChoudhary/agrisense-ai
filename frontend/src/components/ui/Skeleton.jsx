import React from 'react'
import { cn } from '../../utils/cn'

export const Skeleton = ({
  width,
  height,
  className,
  count = 1,
  variant = 'text',
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded',
    rectangular: 'w-full rounded-md',
    circular: 'rounded-full',
  }

  const elements = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={cn(
        'skeleton',
        variantStyles[variant],
        className
      )}
      style={{
        width: width,
        height: height,
        ...(count > 1 && i < count - 1 ? { marginBottom: '0.5rem' } : {})
      }}
      {...props}
    />
  ))

  return <>{elements}</>
}
