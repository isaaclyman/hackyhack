export interface ColorCssGeneratorProps {
  color: string
  parentClass: string
}

export default function ColorCssGenerator(props: ColorCssGeneratorProps) {
  function prefix(selector: string): string {
    return props.parentClass ? `.${props.parentClass} ${selector}` : selector
  }

  return (
    <style>
      {props.parentClass ? (
        <>
          {`.${props.parentClass} {
            color: ${props.color};
            fill: ${props.color};
            text-shadow: 0px 0px 2px ${props.color};
          }`}
        </>
      ) : (
        <>
          {`${prefix('html')}, ${prefix('body')} {
            color: ${props.color};
            fill: ${props.color};
            text-shadow: 0px 0px 2px ${props.color};
          }`}
        </>
      )}

      {`${prefix('a')}, ${prefix('button')}, ${prefix('input')}, ${prefix('textarea')} {
        color: ${props.color};
        text-shadow: 0px 0px 2px ${props.color};
      }`}
    </style>
  )
}