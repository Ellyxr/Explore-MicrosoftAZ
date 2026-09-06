import { useState } from 'react'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

function App() {
  const [message, setMessage] = useState('Click the button to call the Express API.')
  const [loading, setLoading] = useState(false)

  async function callApi() {
    setLoading(true)
    try {
      const response = await fetch(`${apiBaseUrl}/api/hello`)
      if (!response.ok) throw new Error(`Request failed with ${response.status}`)
      const data = await response.json()
      setMessage(data.message)
    } catch (error) {
      setMessage(`Could not reach the API: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <p className="eyebrow">Azure Student Starter</p>
      <h1>React + Express, ready for Azure.</h1>
      <p className="intro">
        A tiny full-stack app for learning how a static frontend talks to a web API.
      </p>
      <section className="panel" aria-live="polite">
        <p className="label">API response</p>
        <p className="message">{message}</p>
        <button type="button" onClick={callApi} disabled={loading}>
          {loading ? 'Calling API...' : 'Call /api/hello'}
        </button>
      </section>
    </main>
  )
}

export default App
