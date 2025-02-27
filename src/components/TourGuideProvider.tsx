import mitt from 'mitt'
import * as React from 'react'
import {
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  ScrollView,
  findNodeHandle,
} from 'react-native'
import { TourGuideContext } from '../components/TourGuideContext'
import { useIsMounted } from '../hooks/useIsMounted'
import { IStep, Labels, StepObject, Steps } from '../types'
import * as utils from '../utilities'
import { Modal } from './Modal'
import { OFFSET_WIDTH } from './style'
import { TooltipProps } from './Tooltip'

const { useMemo, useEffect, useState, useRef, useCallback } = React

/*
This is the maximum wait time for the steps to be registered before starting the tutorial
At 60fps means 2 seconds
*/
const MAX_START_TRIES = 120

export interface TourGuideProviderProps {
  tooltipComponent?: React.ComponentType<TooltipProps>
  tooltipStyle?: StyleProp<ViewStyle>
  labels?: Labels
  androidStatusBarVisible?: boolean
  startAtMount?: boolean
  backdropColor?: string
  verticalOffset?: number
  wrapperStyle?: StyleProp<ViewStyle>
  maskOffset?: number
  borderRadius?: number
  animationDuration?: number
  children: React.ReactNode
}

export const TourGuideProvider = ({
  children,
  wrapperStyle,
  labels,
  tooltipComponent,
  tooltipStyle,
  androidStatusBarVisible,
  backdropColor,
  animationDuration,
  maskOffset,
  borderRadius,
  verticalOffset,
  startAtMount = false,
}: TourGuideProviderProps) => {
  const [visible, setVisible] = useState<boolean | undefined>(undefined)
  const [currentStep, updateCurrentStep] = useState<IStep | undefined>()
  const [steps, setSteps] = useState<Steps>({})
  const [canStart, setCanStart] = useState<boolean>(false)
  const [scrollView, setScrollView] = useState<
    React.RefObject<ScrollView> | undefined
  >(undefined)

  const startTries = useRef<number>(0)
  const mounted = useIsMounted()

  const eventEmitter = useMemo(() => new mitt(), [])

  const modal = useRef<any>()

  useEffect(() => {
    if (mounted && visible === false) {
      eventEmitter.emit('stop')
    }
  }, [visible])

  useEffect(() => {
    if (visible || currentStep) {
      moveToCurrentStep()
    }
  }, [visible, currentStep])

  useEffect(() => {
    if (mounted) {
      if (Object.entries(steps).length > 0) {
        setCanStart(true)
        if (startAtMount) {
          start()
        }
      } else {
        setCanStart(false)
      }
    }
  }, [mounted, steps])

  const moveToCurrentStep = async () => {
    const size = await currentStep!.target.measure()

    await modal.current?.animateMove({
      width: size.width + OFFSET_WIDTH,
      height: size.height + OFFSET_WIDTH,
      left: size.x - OFFSET_WIDTH / 2,
      top: size.y - OFFSET_WIDTH / 2 + (verticalOffset || 0),
    })
  }

  const setCurrentStep = async (step?: IStep) => {
    updateCurrentStep(() => {
      eventEmitter.emit('stepChange', step)
      return step
    })

    if (scrollView) {
      const adjustment = step?.scrollAdjustment ?? 0
      if (step?.insideScroll) {
        await step.wrapper.measureLayout(
          findNodeHandle(scrollView?.current as any),
          (_x: number, y: number, _w: number, h: number) => {
            const yOffset = y > 0 ? y + adjustment - h / 2 : adjustment
            scrollView?.current?.scrollTo({ y: yOffset, animated: false })
          },
        )
      } else {
        scrollView.current?.scrollTo({ y: adjustment, animated: false })
      }
    }
  }

  const getNextStep = (step: IStep | undefined = currentStep) =>
    utils.getNextStep(steps!, step)

  const getPrevStep = (step: IStep | undefined = currentStep) =>
    utils.getPrevStep(steps!, step)

  const getFirstStep = (currentStep?: IStep) =>
    utils.getFirstStep(steps!, currentStep?.tag)

  const getLastStep = (currentStep?: IStep) =>
    utils.getLastStep(steps!, currentStep?.tag)

  const isFirstStep = useMemo(
    () => currentStep === getFirstStep(currentStep),
    [currentStep],
  )

  const isLastStep = useMemo(
    () => currentStep === getLastStep(currentStep),
    [currentStep],
  )

  const next = () => setCurrentStep(getNextStep()!)

  const prev = () => setCurrentStep(getPrevStep()!)

  const stop = () => {
    setVisible(false)
    setCurrentStep(undefined)
    if (scrollView) {
      scrollView.current?.scrollTo({ y: -300, animated: false })
      setScrollView(undefined)
    }
  }

  const registerStep = (step: IStep) => {
    setSteps((previousSteps) => {
      return {
        ...previousSteps,
        [step.name]: step,
      }
    })
  }

  const unregisterStep = (stepName: string) => {
    if (!mounted) {
      return
    }
    setSteps((previousSteps) => {
      return Object.entries(previousSteps as StepObject)
        .filter(([key]) => key !== stepName)
        .reduce((obj, [key, val]) => Object.assign(obj, { [key]: val }), {})
    })
  }

  const getCurrentStep = () => currentStep

  const start = useCallback(
    async (
      flowTag?: string,
      scrollView?: React.RefObject<ScrollView>,
    ): Promise<void> => {
      const currentStep = flowTag
        ? Object.values(steps as StepObject)
            .filter((step) => flowTag === step.tag)
            .sort((a, b) => a.order - b.order)[0]
        : getFirstStep()

      if (startTries.current > MAX_START_TRIES) {
        startTries.current = 0
        return
      }

      if (scrollView) {
        setScrollView(scrollView)
      }

      if (!currentStep) {
        startTries.current += 1
        requestAnimationFrame(() => start(flowTag))
      } else {
        eventEmitter.emit('start')
        await setCurrentStep(currentStep!)
        setVisible(true)
        startTries.current = 0
      }
    },
    [steps, scrollView],
  )

  const valueProvider = useMemo(() => {
    return {
      eventEmitter,
      registerStep,
      unregisterStep,
      getCurrentStep,
      start,
      stop,
      canStart,
      setScrollView,
    }
  }, [start, steps])

  return (
    <View style={[styles.container, wrapperStyle]}>
      <TourGuideContext.Provider value={valueProvider}>
        {children}
        <Modal
          ref={modal}
          {...{
            next,
            prev,
            stop,
            visible,
            isFirstStep,
            isLastStep,
            currentStep,
            labels,
            tooltipComponent,
            tooltipStyle,
            androidStatusBarVisible,
            backdropColor,
            animationDuration,
            maskOffset,
            borderRadius,
          }}
        />
      </TourGuideContext.Provider>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
