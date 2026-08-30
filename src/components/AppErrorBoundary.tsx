import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

const STORAGE_KEY = 'design-lab:v1'

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Design Lab failed to render', error, info)
  }

  private resetSavedWorkspace = () => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved) {
      window.localStorage.setItem(`design-lab:recovery:${Date.now()}`, saved)
    }
    window.localStorage.removeItem(STORAGE_KEY)
    window.location.reload()
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <main
        style={{
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          background: '#09090b',
          color: '#f4f4f5',
          fontFamily: 'DM Sans, system-ui, sans-serif',
        }}
      >
        <section style={{ width: 'min(560px, 100%)' }}>
          <p style={{ margin: 0, color: '#a1a1aa', fontSize: 12, letterSpacing: '0.12em' }}>
            DESIGN LAB RECOVERY
          </p>
          <h1 style={{ margin: '12px 0 8px', fontSize: 30 }}>The workspace could not load.</h1>
          <p style={{ margin: 0, color: '#a1a1aa', lineHeight: 1.6 }}>
            Your saved browser workspace may come from an older build. Try reloading first. If the
            problem remains, reset the saved workspace; Design Lab will keep a recovery copy in this
            browser before starting from the default template.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ padding: '10px 14px', borderRadius: 8, border: 0, cursor: 'pointer' }}
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.resetSavedWorkspace}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: '1px solid #3f3f46',
                background: '#18181b',
                color: '#f4f4f5',
                cursor: 'pointer',
              }}
            >
              Reset saved workspace
            </button>
          </div>
        </section>
      </main>
    )
  }
}
