declare module 'react' {
  const React: any;
  export default React;
  export type ReactNode = any;
  export type FC<P = any> = (props: P) => any;
  export const useState: any;
  export const useEffect: any;
  export const useMemo: any;
  export const useRef: any;
  export const useCallback: any;
  export const createContext: any;
  export const useContext: any;
  export const Fragment: any;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
