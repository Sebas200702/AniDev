import { useDirectoryStore } from '@store/directory-store'
import { useEffect, useState } from 'react'

const SkeletonLoader = () => {
  return (
    <div className="h-full w-full bg-gray-300 animate-pulse rounded-md"></div>
  )
}
