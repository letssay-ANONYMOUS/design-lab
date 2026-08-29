import { createContext, useContext } from 'react'

/** Lets every atom know which section it lives in without prop drilling. */
export const SectionContext = createContext<string>('')

export function useSectionId(): string {
  return useContext(SectionContext)
}

/** True while rendering into an export/thumbnail pass — disables editing chrome. */
export const StaticContext = createContext<boolean>(false)

export function useIsStatic(): boolean {
  return useContext(StaticContext)
}
