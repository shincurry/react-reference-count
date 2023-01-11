import { useEffect, useRef } from "react";
import { ReferenceCount } from "../class/ReferenceCount";

export function useReferenceCount(onCountChange?: (key: string, count: number) => void) {
  const rcRef = useRef<ReferenceCount>(new ReferenceCount())

  useEffect(() => {
    if (!onCountChange) return;
    rcRef.current.subscribeCountChange(onCountChange)
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      rcRef.current.unsubscribeCountChange(onCountChange)
    }
  }, [onCountChange])

  return {
    getCount: rcRef.current.getCount,
    retain: rcRef.current.retain,
    release: rcRef.current.release,
  }
}