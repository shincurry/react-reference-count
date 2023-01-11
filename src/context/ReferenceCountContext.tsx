import React, { useContext, useEffect, useMemo, useRef } from "react";
import { ReferenceCount } from "../class/ReferenceCount";
import { useForceUpdate } from "../utils/useForceUpdate";


export interface ReferenceCountValue {
  getCountMap: () => Map<string, number>;
  getCount: (key: string) => number | undefined;
  retain: (key: string, n?: number) => void;
  release: (key: string, n?: number) => void;
  subscribeCountChange: (listener: (key: string, count: number) => void) => void;
  unsubscribeCountChange: (listener: (key: string, count: number) => void) => void;
}
export interface ReferenceCountProviderProps {
  children: React.ReactNode;
}

export function createReferenceCountContext() {
  const displayName = "ReferenceCountContext";

  const Context = React.createContext<ReferenceCountValue | null>(null);
  Context.displayName = displayName;

  const Consumer = Context.Consumer;
  const Provider = (props: ReferenceCountProviderProps) => {
    const forceUpdate = useForceUpdate()
    const rcRef = useRef<ReferenceCount>(new ReferenceCount())
    useEffect(() => {
      const listener = () => forceUpdate()
      rcRef.current.subscribeCountChange(listener)
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        rcRef.current.unsubscribeCountChange(listener)
      }
    }, [forceUpdate])
    return (
      <Context.Provider
        value={{
          getCountMap: rcRef.current.getCountMap.bind(rcRef.current),
          getCount: rcRef.current.getCount.bind(rcRef.current),
          retain: rcRef.current.retain.bind(rcRef.current),
          release: rcRef.current.release.bind(rcRef.current),
          subscribeCountChange: rcRef.current.subscribeCountChange.bind(rcRef.current),
          unsubscribeCountChange: rcRef.current.unsubscribeCountChange.bind(rcRef.current),
        }}
      >
        {props.children}
      </Context.Provider>
    )
  };

  const useContextValue = (errorMessage?: string) => {
    const fallbackErrorMessage = "please use useReferenceCountContextValue in ReferenceCountContext.Provider"
    const _errorMessage = errorMessage ?? fallbackErrorMessage
    const contextValue = useContext(Context)
    if (!contextValue) {
      console.warn(_errorMessage)
      throw new Error(_errorMessage)
    }
    return contextValue;
  }

  const useCountMap = () => {
    const contextValue = useContextValue("please use useCount in ReferenceCountContext.Provider")

    const countMap = useMemo(() => {
      return contextValue.getCountMap()
    }, [contextValue])

    return countMap
  }

  const useCount = (key: string) => {
    const contextValue = useContextValue("please use useCount in ReferenceCountContext.Provider")

    const count = useMemo(() => {
      return contextValue.getCount(key)
    }, [contextValue, key])

    return count
  }

  const useReference = () => {
    const contextValue = useContextValue("please use useReference in ReferenceCountContext.Provider")
    return {
      retain: contextValue.retain,
      release: contextValue.release,
    }
  }

  const useAutoReference = (key: string, n: number = 1) => {
    const contextValue = useContextValue("please use useAutoReference in ReferenceCountContext.Provider")
    useEffect(() => {
      contextValue.retain(key, n)
      return () => {
        contextValue.release(key, n)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [key, n])
  }

  const useCountWatch = (onCountChange: (key: string, count: number) => void) => {
    const contextValue = useContextValue("please use useCount in ReferenceCountContext.Provider")
    useEffect(() => {
      contextValue.subscribeCountChange(onCountChange)
      return () => {
        contextValue.unsubscribeCountChange(onCountChange)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onCountChange])
  }

  return {
    displayName,
    Consumer,
    Provider,
    useContextValue,
    useCountMap,
    useCount,
    useCountWatch,
    useReference,
    useAutoReference,
  }
}
