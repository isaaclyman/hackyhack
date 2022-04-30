import './_drawShape.scss'
import React, { useEffect, useState } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const DrawShape: CommandHandler = function(props: React.PropsWithChildren<CommandHandlerProps>) {
  const [classes, setClasses] = useState(['shape'])
  const [styles, setStyles] = useState({} as React.CSSProperties)

  useEffect(() => {
    const newStyles: React.CSSProperties = {
      borderColor: props.settings.color,
      color: props.settings.color
    }
    const newClasses: string[] = []
    
    for (const child of props.command.children) {
      const childValue = child.values.filter(val => typeof val === 'number')[0] as number;
  
      switch (child.name.toLowerCase()) {
        case 'rectangle':
          newClasses.push('shape-rectangle')
          continue
        case 'rectangle-rounded':
          newClasses.push('shape-rectangle-rounded')
          continue
        case 'rectangle-blank':
        case 'blank':
          newClasses.push('shape-rectangle-blank')
          continue
        case 'oval':
          newClasses.push('shape-oval')
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

    setClasses(classes.concat(newClasses))
    setStyles(newStyles)
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
