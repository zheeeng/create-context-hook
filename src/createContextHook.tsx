import React, { useContext } from 'react'

// eslint-disable-next-line no-new-wrappers
const initialSymbol: unique symbol = new String('initialSymbol') as any

export function createContextHook <T, P>(contextFactory: (props: P) => T) {
  const Context = React.createContext<T | typeof initialSymbol>(initialSymbol)

  const Provider: React.FC<P> = React.memo(props => {
    const context = contextFactory(props)

    return <Context.Provider value={context}>{props.children}</Context.Provider>
  })

  function provideContext <Props extends { contextParams: never }>(Component: React.ComponentType<Props>) {
    return React.forwardRef<React.ComponentType<Props>, Props & { contextParams: P }>(({ contextParams, ...props }, ref) => (
      <Provider {...contextParams}>
        <Component {...props as Props} ref={ref} />
      </Provider>
    ))
  }

  function useContextHook (ignoreProvider: true): null | T
  function useContextHook (ignoreProvider?: false): T
  function useContextHook (ignoreProvider?: boolean): null | T
  function useContextHook (ignoreProvider = false) {
    const context = useContext(Context)

    if (ignoreProvider) return context === initialSymbol ? null : context

    if (context === initialSymbol) throw Error('Wrap topper components with Provider')

    return context
  }

  return [provideContext, useContextHook, Provider] as const
}
