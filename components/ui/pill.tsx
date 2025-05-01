import React from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Props {
  color: string
  text: string
  backgroundColor?: string
  iconChip: React.ReactElement
  justifyContent?: string
  onClick?: () => void
}

export const Pill = ({
  color = '#FFFFFF',
  text,
  backgroundColor = '#000000',
  iconChip,
  justifyContent,
  onClick,
}: Props) => {
  return (
    <div
      className={cn(
        'flex items-center space-x-2',
        justifyContent ? `justify-${justifyContent}` : ''
      )}
    >
      <Badge
        variant="outline"
        style={{
          color: color,
          backgroundColor: backgroundColor,
        }}
        onClick={onClick}
        className="flex items-center space-x-2 rounded-full"
      >
        {iconChip}
        <span>{text}</span>
      </Badge>
    </div>
  )
}