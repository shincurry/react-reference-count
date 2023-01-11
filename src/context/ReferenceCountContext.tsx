import React, { useContext, useEffect, useRef } from "react";
import { ReferenceCount } from "../class/ReferenceCount";


export interface ReferenceCountValue {
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
    const rcRef = useRef<ReferenceCount>(new ReferenceCount())
    return (
      <Context.Provider
        value={{
          retain: rcRef.current.retain,
          release: rcRef.current.release,
          subscribeCountChange: rcRef.current.subscribeCountChange,
          unsubscribeCountChange: rcRef.current.unsubscribeCountChange,
        }}
      >
        {props.children}
      </Context.Provider>
    )
  };

  const useContextValue = (errorMessage?: string) => {
    const fallbackErrorMessage = "please use useReferenceCountContextValue in ReferenceCountContext.Provider"
    const contextValue = useContext(Context)
    if (!contextValue) {
      console.warn(errorMessage || fallbackErrorMessage)
      throw new Error(errorMessage || fallbackErrorMessage)
    }
    return contextValue;
  }

  const useReference = () => {
    const contextValue = useContextValue("please use useReference in ReferenceCountContext.Provider")
    return {
      reference: contextValue.retain,
      unreference: contextValue.release,
    }
  }

  const useAutoReference = (key: string) => {
    const contextValue = useContextValue("please use useAutoReference in ReferenceCountContext.Provider")
    useEffect(() => {
      contextValue.retain(key)
      return () => {
        contextValue.release(key)
      }
    }, [contextValue, key])
  }

  const useCountWatch = (onCountChange: (key: string, count: number) => void) => {
    const contextValue = useContextValue("please use useCount in ReferenceCountContext.Provider")
    useEffect(() => {
      contextValue.subscribeCountChange(onCountChange)
      return () => {
        contextValue.unsubscribeCountChange(onCountChange)
      }
    }, [contextValue, onCountChange])
  }

  return {
    displayName,
    Consumer,
    Provider,
    useContextValue,
    useCountWatch,
    useReference,
    useAutoReference,
  }
}
