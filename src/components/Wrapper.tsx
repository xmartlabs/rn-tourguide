import * as React from 'react'
import { View, StyleProp, ViewStyle } from 'react-native'

interface WrapperProps {
  copilot?: any
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
}
export const Wrapper: React.FC<WrapperProps> = ({ copilot, children, style }) => (
  <View style={style} {...copilot}>
    {children}
  </View>
)
