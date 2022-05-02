import { useEffect } from "react";
import { ContextSettings } from "../../data/contextSettings.data";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";

const defaultColor = 'rgb(70, 150, 241)'

const SetColorHandler: CommandHandler = function(props: CommandHandlerProps) {
  useEffect(() => {
    const newSettings = new ContextSettings(props.settings)
    const value = props.command.values.filter(val => typeof val === 'string')[0] as string
    newSettings.color = value || defaultColor
    props.setSettings(newSettings)
    props.done()
  }, [])

  return null
}

export default SetColorHandler
