import { ShapeAnimation, ShapeAnimationQueueing } from "../types/shape.animation"
import { TextAnimation } from "../types/text.animation"

export class ContextSettings {
  constructor(settingsToCopy?: ContextSettings) {
    if (settingsToCopy) {
      this.textAnimation = settingsToCopy.textAnimation
      this.textTypeAnimationDelay = settingsToCopy.textTypeAnimationDelay
      this.textLineAnimationDelay = settingsToCopy.textLineAnimationDelay
  
      this.shapeAnimation = settingsToCopy.shapeAnimation
      this.shapeAnimationDelay = settingsToCopy.shapeAnimationDelay
      this.shapeAnimationQueueing = settingsToCopy.shapeAnimationQueueing
      
      this.color = settingsToCopy.color
      this.seed = settingsToCopy.seed
    }
  }

  textAnimation = TextAnimation.TYPE
  textTypeAnimationDelay = 15
  textLineAnimationDelay: number | null = null

  shapeAnimation = ShapeAnimation.NONE
  shapeAnimationDelay = 250
  shapeAnimationQueueing = ShapeAnimationQueueing.QUEUE

  color = 'rgba(70, 150, 241, 1)'
  seed = 'scriptname'
}
