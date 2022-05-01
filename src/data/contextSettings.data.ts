import { ShapeAnimation } from "../types/shape.animation"
import { TextAnimation } from "../types/text.animation"

export class ContextSettings {
  constructor(settingsToCopy?: ContextSettings) {
    if (settingsToCopy) {
      this.isTextContainer = settingsToCopy.isTextContainer

      this.textAnimation = settingsToCopy.textAnimation
      this.textTypeAnimationDelay = settingsToCopy.textTypeAnimationDelay
      this.textLineAnimationDelay = settingsToCopy.textLineAnimationDelay
  
      this.shapeAnimation = settingsToCopy.shapeAnimation
      this.shapeAnimationDelay = settingsToCopy.shapeAnimationDelay
      
      this.color = settingsToCopy.color
      this.seed = settingsToCopy.seed
    }
  }

  isTextContainer = true

  textAnimation = TextAnimation.TYPE
  textTypeAnimationDelay = 10
  textLineAnimationDelay: number | null = null

  shapeAnimation = ShapeAnimation.NONE
  shapeAnimationDelay = 250

  color = 'rgba(70, 150, 241, 1)'
  seed = 'scriptname'
}
