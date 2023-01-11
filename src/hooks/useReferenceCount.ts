import { useEffect, useRef } from "react";
import { ReferenceCount } from "../class/ReferenceCount";
import { useForceUpdate } from "../utils/useForceUpdate";

export function useReferenceCount(onCountChange?: (key: string, count: number) => void) {
  const forceUpdate = useForceUpdate()
  const rcRef = useRef<ReferenceCount>(new ReferenceCount())

  useEffect(() => {
    const listener = () => forceUpdate()
    rcRef.current.subscribeCountChange(listener)
    return () => {
      rcRef.current.unsubscribeCountChange(listener)
    }
  }, [])

  useEffect(() => {
    if (!onCountChange) return;
    rcRef.current.subscribeCountChange(onCountChange)
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      rcRef.current.unsubscribeCountChange(onCountChange)
    }
  }, [onCountChange])

  return {
    getCount: rcRef.current.getCount.bind(rcRef.current),
    retain: rcRef.current.retain.bind(rcRef.current),
    release: rcRef.current.release.bind(rcRef.current),
  }
}