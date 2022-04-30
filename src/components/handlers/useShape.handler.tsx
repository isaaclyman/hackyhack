import { useEffect } from "react";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

let counter = 0

const UseShapeHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    const nameNode = props.command.children.find(child => child.name.toLowerCase() === 'name')
    const name = nameNode ? nameNode.values[0] as string : `$__unnamed_shape_${counter++}`

    props.createContext(name, {
      ...props.command,
      name: '#DRAW-SHAPE'
    })
  }, [])

  return null
}

export default UseShapeHandler
