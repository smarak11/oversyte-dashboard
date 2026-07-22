import { createContext, useContext } from 'react'

/** True when the app is rendering its reflowed phone layout. */
export const MobileContext = createContext(false)
export const useMobile = () => useContext(MobileContext)
