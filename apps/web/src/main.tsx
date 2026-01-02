import ReactDOM from 'react-dom/client'

import { AppProvider } from './providers/app'

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(<AppProvider />)
}
