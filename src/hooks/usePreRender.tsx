import { useRef } from "react"

const usePreRender = (cb: Function) => {
  const willMount = useRef(true)

  if (willMount.current) cb()

  willMount.current = false
}

export default usePreRender