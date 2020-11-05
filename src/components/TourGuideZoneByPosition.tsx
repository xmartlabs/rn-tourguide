import * as React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { BorderRadiusObject, CommonProps, Shape } from '../types'
import { TourGuideZone } from './TourGuideZone'

interface TourGuideZoneByPositionProps extends CommonProps {
  zone: number
  isTourGuide?: boolean
  top?: number | string
  left?: number | string
  right?: number | string
  bottom?: number | string
  width?: number | string
  height?: number | string
  shape?: Shape
  borderRadiusObject?: BorderRadiusObject
  containerStyle?: StyleProp<ViewStyle>
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  insideScroll?: boolean
  scrollAdjustment?: number
}

export const TourGuideZoneByPosition = ({
  isTourGuide,
  zone,
  width,
  height,
  top,
  left,
  right,
  bottom,
  shape,
  containerStyle,
  keepTooltipPosition,
  tooltipBottomOffset,
  borderRadiusObject,
  tag
}: TourGuideZoneByPositionProps) => {
  if (!isTourGuide) {
    return null
  }

  return (
    <View
      pointerEvents='none'
      style={[StyleSheet.absoluteFillObject, containerStyle]}
    >
      <TourGuideZone
        tag={tag}
        isTourGuide
        {...{
          zone,
          shape,
          keepTooltipPosition,
          tooltipBottomOffset,
          borderRadiusObject,
        }}
        style={{
          height,
          width,
          top,
          right,
          bottom,
          left,
        }}
      />
    </View>
  )
}
