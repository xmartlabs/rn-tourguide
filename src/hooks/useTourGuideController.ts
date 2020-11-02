import * as React from 'react'
import { TourGuideContext } from '../components/TourGuideContext'

export const useTourGuideController = () => {
  const {
    start,
    canStart,
    stop,
    eventEmitter,
    getCurrentStep,
  } = React.useContext(TourGuideContext)
  console.log("change controller")

  const startFunc = React.useCallback((fromStep, scrollView) => {
    console.log("Change callback inside controller", start)
    if(start) {
      start(fromStep, scrollView)
    }
  },[start])

  return {
    start: startFunc,
    stop,
    eventEmitter,
    getCurrentStep,
    canStart,
  }
}
