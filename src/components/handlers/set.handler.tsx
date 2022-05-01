import { useEffect } from "react";
import VariableManager from "../../data/variable.manager";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const SetHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    let varname = ''
    let value = ''

    for (const key in props.command.properties) {
      if (!props.command.properties.hasOwnProperty(key)) {
        continue
      }
      varname = key
      value = props.command.properties[key] as string
    }

    VariableManager.setVariable(varname, value)
    props.done()
  }, [])

  return null
}

export default SetHandler