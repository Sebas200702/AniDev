import 'react'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lite-youtube': {
        videoid: string
        params?: string
        style?: React.CSSProperties
        ref?: React.Ref<HTMLElement>
        class?: string
      }
    }
  }
}
