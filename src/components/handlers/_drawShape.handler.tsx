import './_drawShape.scss'
import React, { useEffect } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const DrawShape: CommandHandler = function(props: React.PropsWithChildren<CommandHandlerProps>) {
  const classes = ['shape']
  let styles: React.CSSProperties = {}

  useEffect(() => {
    const newStyles: React.CSSProperties = {
      borderColor: props.settings.color,
      color: props.settings.color
    }
    
    for (const child of props.command.children) {
      const childValue = child.values.filter(val => typeof val === 'number')[0] as number;
  
      switch (child.name.toLowerCase()) {
        case 'rectangle':
          classes.push('shape-rectangle')
          continue
        case 'rectangle-rounded':
          classes.push('shape-rectangle-rounded')
          continue
        case 'rectangle-blank':
        case 'blank':
          classes.push('shape-rectangle-blank')
          continue
        case 'oval':
          classes.push('shape-oval')
          continue
        case 'name':
          // Names are consumed by the USE SHAPE command
          continue
        case 'layer':
          newStyles.zIndex = childValue
          continue
        case 'left':
          newStyles.left = childValue + '%'
          continue
        case 'top':
          newStyles.top = childValue + '%'
          continue
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

    styles = newStyles
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

export default DrawShape
