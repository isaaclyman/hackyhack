import { kdljs } from "kdljs"
import { useEffect } from "react"
import { ContextSettings } from "../../data/contextSettings.data"
import { CommandHandler } from "../../types/commandHandler"
import { TextAnimation } from "../../types/text.animation"

const defaultSettings = new ContextSettings()
const defaultLineAnimationDelay = defaultSettings.textLineAnimationDelay as number
const defaultTypeAnimationDelay = defaultSettings.textTypeAnimationDelay as number

function getAnimationDelay(commandValues: kdljs.Value[], defaultValue: number): number {
  const numericValues = commandValues.filter(val => typeof val === 'number')
  if (!numericValues.length) {
    return defaultValue
  }

  return numericValues[0] as number
}

const AnimateText: CommandHandler = function(props) {
  useEffect(() => {
    const newSettings = new ContextSettings(props.settings)
  
    for (const child of props.command.children) {
      switch (child.name.toLowerCase()) {
        case 'none':
          newSettings.textAnimation = TextAnimation.NONE
          continue
        case 'line':
          newSettings.textAnimation = TextAnimation.LINE
          newSettings.textLineAnimationDelay = getAnimationDelay(child.values, defaultLineAnimationDelay)
          continue
        case 'type':
          newSettings.textAnimation = TextAnimation.TYPE
          newSettings.textTypeAnimationDelay = getAnimationDelay(child.values, defaultTypeAnimationDelay)
          continue
        case 'line-type':
          newSettings.textAnimation = TextAnimation.LINETYPE
          newSettings.textLineAnimationDelay = getAnimationDelay(child.values.slice(0, 1), defaultLineAnimationDelay)
          newSettings.textTypeAnimationDelay = getAnimationDelay(child.values.slice(1), defaultTypeAnimationDelay)
          continue
      }
    }
  
    props.setSettings(newSettings)
    props.done()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default AnimateText