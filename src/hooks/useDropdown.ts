import React, { useCallback, useEffect, useRef, useState } from 'react'

type useDropdownType = () => [
  React.RefObject<HTMLDivElement>,
  boolean,
  () => void
]

const useDropdown: useDropdownType = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [isDropdownOpened, setIsDropdownOpened] = useState(false)

  useEffect(() => {
    if (!isDropdownOpened) return

    const handleClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      if (
        e.target instanceof Node &&
        !menuRef.current.contains(e.target)
      ) {
        setIsDropdownOpened(false)
      }
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [isDropdownOpened])

  const onOpenBtn = useCallback(() => {
    setIsDropdownOpened(true)
  }, [])

  return [menuRef, isDropdownOpened, onOpenBtn]
}

export default useDropdown
