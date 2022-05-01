import VariableManager from "../../data/variable.manager";
import { CommandHandler, CommandHandlerProps } from "../../types/commandHandler";
import { kdljs, format } from "kdljs";
import usePreRender from "../../hooks/usePreRender";

const IfHandler: CommandHandler = function(props: CommandHandlerProps) {
  usePreRender(() => {
    const stringValues = props.command.values.filter(val => typeof val === 'string') as string[]
    const initialValue = stringValues[0]
    const simpleOperator = stringValues.length > 1 ?
      stringValues[1] :
      null;
    let complexOperator: string | null = null
    let compareValue: string | null = null
    for (const key in props.command.properties) {
      complexOperator = key
      compareValue = props.command.properties[key] as string
    }
  
    function interpolateString(str: string | null): string {
      if (!str) {
        return ''
      }
  
      if (str.startsWith('$') && str.length > 1) {
        return VariableManager.getVariable(str).trim().toLowerCase()
      }
  
      return str.trim().toLowerCase()
    }
  
    function readOutStatement(): string {
      const document: kdljs.Document = [{
        ...props.command,
        children: []
      }]
      return format(document)
    }
  
    if (!simpleOperator && !complexOperator) {
      throw new Error(`No operator provided for IF statement: ${readOutStatement()}`)
    }
  
    let evaluatesTrue: boolean
    switch ((simpleOperator || complexOperator)!.toLowerCase()) {
      case 'equals':
        evaluatesTrue = interpolateString(initialValue) === interpolateString(compareValue)
        break
      case 'not-equals':
        evaluatesTrue = interpolateString(initialValue) !== interpolateString(compareValue)
        break
      case 'contains':
        evaluatesTrue = interpolateString(initialValue).includes(interpolateString(compareValue))
        break
      case 'not-contains':
        evaluatesTrue = !interpolateString(initialValue).includes(interpolateString(compareValue))
        break
      case 'empty':
        evaluatesTrue = !interpolateString(initialValue).length
        break
      case 'not-empty':
        evaluatesTrue = !!interpolateString(initialValue).length
        break
      default:
        throw new Error(`Unrecognized operator '${(simpleOperator || complexOperator)}'.`)
    }
  
    if (!evaluatesTrue) {
      props.done()
      return
    }

    props.insertCommands(props.command.children)
    props.done()
  })

  return null
}

export default IfHandler