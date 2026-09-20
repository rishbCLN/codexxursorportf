import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

// A tiny reusable boundary for the lazy WebGL scenes. If a 3D scene throws
// during render (a bad SVG extrude, a lost WebGL context, an unsupported
// driver, etc.) we contain the failure to that scene and keep the rest of the
// page alive instead of blanking the entire React tree to a black screen.
export default class SceneBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; label?: string },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[SceneBoundary${this.props.label ? ` · ${this.props.label}` : ''}] scene crashed:`, error, info)
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}
