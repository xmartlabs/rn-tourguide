import * as React from 'react'
import { View, Text, StyleProp, ViewStyle } from 'react-native'

import styles from './style'

interface Props {
  wrapperStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  children?: any
}

export const Button: React.FC<Props> = ({ wrapperStyle, style, children, ...rest }) => (
  <View style={[styles.button, wrapperStyle]}>
    <Text style={[styles.buttonText, style]} {...rest}>
      {children}
    </Text>
  </View>
)
