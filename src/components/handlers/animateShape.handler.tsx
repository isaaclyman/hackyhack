import { kdljs } from "kdljs"
import { useEffect } from "react"
import { ContextSettings } from "../../data/contextSettings.data"
import { CommandHandler } from "../../types/commandHandler"
import { ShapeAnimation } from "../../types/shape.animation"

const defaultAnimationDelay = new ContextSettings().shapeAnimationDelay

function getAnimationDelay(commandValues: kdljs.Value[]): number {
  const numericValues = commandValues.filter(val => typeof val === 'number')
  if (!numericValues.length) {
    return defaultAnimationDelay
  }

  return numericValues[0] as number
}

const AnimateShapeHandler: CommandHandler = function(props) {
  useEffect(() => {
    const newSettings = new ContextSettings(props.settings)
  
    for (const child of props.command.children) {
      switch (child.name.toLowerCase()) {
        case 'none':
          newSettings.shapeAnimation = ShapeAnimation.NONE
          continue
        case 'grow':
          newSettings.shapeAnimation = ShapeAnimation.GROW
          newSettings.shapeAnimationDelay = getAnimationDelay(child.values)
          continue
        case 'fade':
          newSettings.shapeAnimation = ShapeAnimation.FADE
          newSettings.shapeAnimationDelay = getAnimationDelay(child.values)
          continue
      }
    }
  
    props.setSettings(newSettings)
    props.done()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default AnimateShapeHandler