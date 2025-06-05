"use client"

import * as React from "react"
import MuiSlider from "@mui/material/Slider"

const Slider = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof MuiSlider>>(
  ({ ...props }, ref) => (
    <MuiSlider ref={ref} {...props} />
  )
)
Slider.displayName = "Slider"

export { Slider }
