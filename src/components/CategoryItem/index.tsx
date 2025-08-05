import { cn } from '@/lib/utils'
import React from 'react'

interface CategoryItemProps{
  label?: string
  selected?: boolean
  onClick?: VoidFunction
}

const CategoryItem = ({ label, selected, onClick }: CategoryItemProps) => {
  return(
    <div 
      className={cn(
        'py-2 px-3 text-[14px] text-[#191B1E] border border-[#E1E3E7] cursor-pointer rounded-full',
        selected && 'bg-[#F4F4F4]  border-[#696B77] '
      )}
      onClick={onClick}
    >{label}</div>
  )
}

export default CategoryItem