export type Shape =
  | 'circle'
  | 'rectangle'
  | 'circle_and_keep'
  | 'rectangle_and_keep'

export interface IStep extends CommonProps {
  visible?: boolean
  target: any
  wrapper: any
}

export interface CommonProps {
  name: string
  order: number
  text: string
  tag: string
  keepTooltipPosition?: boolean
  tooltipBottomOffset?: number
  borderRadiusObject?: BorderRadiusObject
  insideScroll?: boolean
  scrollAdjustment?: number
  maskOffset?: number
  borderRadius?: number
  shape?: Shape
}


export interface StepObject {
  [key: string]: IStep
}
export type Steps = StepObject | IStep[]

export interface ValueXY {
  x: number
  y: number
}

export interface BorderRadiusObject {
  topLeft?: number
  topRight?: number
  bottomRight?: number
  bottomLeft?: number
}

export type SvgPath = string

// with flubber
export interface AnimJSValue {
  _value: number
}
export interface SVGMaskPathMorphParam {
  animation: AnimJSValue
  previousPath: SvgPath
  to: {
    position: ValueXY
    size: ValueXY
    shape?: Shape
    maskOffset?: number
    borderRadius?: number
    borderRadiusObject?: BorderRadiusObject
  }
}
export type SVGMaskPathMorph = (
  param: SVGMaskPathMorphParam,
) => string | string[]

export interface Labels {
  skip?: string
  previous?: string
  next?: string
  finish?: string
}
