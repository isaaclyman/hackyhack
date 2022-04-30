import './_drawShape.scss'
import React, { useEffect, useRef, useState } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import { ShapeAnimation } from '../../types/shape.animation';

const DrawShapeHandler: CommandHandler = function (props: React.PropsWithChildren<CommandHandlerProps>) {
  const baseStyles: React.CSSProperties = {
    borderColor: props.settings.color,
    color: props.settings.color
  }
  const baseClasses: string[] = []

  if (props.settings.shapeAnimation === ShapeAnimation.FADE) {
    baseClasses.push('animate-shape-fade')
    baseStyles.transition = `opacity ${props.settings.shapeAnimationDelay}ms`
  }

  if (props.settings.shapeAnimation === ShapeAnimation.GROW) {
    baseClasses.push('animate-shape-grow')
    baseStyles.transition =
      `height ${props.settings.shapeAnimationDelay}ms,` +
      `width ${props.settings.shapeAnimationDelay}ms`
  }

  for (const child of props.command.children) {
    const childValue = child.values.filter(val => typeof val === 'number')[0] as number;

    switch (child.name.toLowerCase()) {
      case 'rectangle':
        baseClasses.push('shape-rectangle')
        continue
      case 'rectangle-rounded':
        baseClasses.push('shape-rectangle-rounded')
        continue
      case 'rectangle-blank':
      case 'blank':
        baseClasses.push('shape-rectangle-blank')
        continue
      case 'oval':
        baseClasses.push('shape-oval')
        continue
      case 'layer':
        baseStyles.zIndex = childValue
        continue
      case 'left':
        baseStyles.left = childValue + '%'
        continue
      case 'top':
        baseStyles.top = childValue + '%'
        continue
    }
  }

  console.log(baseStyles)

  const [classes, setClasses] = useState(['shape', ...baseClasses])
  const [styles, setStyles] = useState(baseStyles)

  useEffect(() => {
    // Transition does not occur unless a timeout occurs
    // See https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions#javascript_examples
    setTimeout(() => {
      const newStyles: React.CSSProperties = {}
      const newClasses: string[] = []
  
      if (props.settings.shapeAnimation === ShapeAnimation.FADE) {
        newStyles.opacity = '1;'
      }
  
      for (const child of props.command.children) {
        const childValue = child.values.filter(val => typeof val === 'number')[0] as number;
  
        switch (child.name.toLowerCase()) {
          case 'width':
            newStyles.width = childValue + '%'
            continue
          case 'height':
            newStyles.height = childValue + '%'
            continue
          case 'transparent':
            newStyles.opacity = (100 - childValue) + '%'
            continue
        }
      }

      if (
        props.settings.shapeAnimation === ShapeAnimation.NONE ||
        props.settings.shapeAnimationDelay === 0
      ) {
        props.done()
      } else {
        setTimeout(() => {
          props.done()
        }, props.settings.shapeAnimationDelay)
      }
  
      setClasses(classes.concat(newClasses))
      setStyles({ ...styles, ...newStyles })
    }, 10)
  }, [])

  return (
    <div
      className={classes.filter(c => !!c).join(' ')}
      style={styles}
    >
      {props.children}
    </div>
  )
}

export default DrawShapeHandler
