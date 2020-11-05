import React, { useContext } from 'react'
import { CommonProps } from '../types'
import { ConnectedStep } from './ConnectedStep'
import { TourGuideContext } from './TourGuideContext'

interface LayoutProps extends CommonProps{
  active?: boolean
  children: React.ReactNode
}

export const Step: React.FC<LayoutProps> = (props) => {
  const context = useContext(TourGuideContext)
  return <ConnectedStep {...{ ...props, context }} />
}
