import { useCallback, useState } from "react"

export const useForceUpdate = (): () => void => {
  const [, dispatch] = useState<{}>(Object.create(null))

  return useCallback(
    () => dispatch(Object.create(null)),
    [dispatch]
  )
}