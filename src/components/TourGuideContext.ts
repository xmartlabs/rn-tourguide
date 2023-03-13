import * as React from 'react'
import { ScrollView } from 'react-native'
import { IStep } from '../types'

export type Handler = (event?: any) => void
export interface Emitter {
  on(type: string, handler: Handler): void
  off(type: string, handler: Handler): void
  emit(type: string, event?: any): void
}

export interface ITourGuideContext {
  eventEmitter?: Emitter
  canStart: boolean
  setScrollView?: React.Dispatch<
    React.SetStateAction<React.RefObject<ScrollView> | undefined>
  >
  registerStep?(step: IStep): void
  unregisterStep?(stepName: string): void
  getCurrentStep?(): IStep | undefined
  start?(flowTag?: string, scrollView?: React.RefObject<ScrollView>): void
  stop?(): void
}

export const TourGuideContext = React.createContext<ITourGuideContext>({
  canStart: false,
})
