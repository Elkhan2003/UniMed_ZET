import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { store } from './store'
import App from './App'

import { Natification } from './components/Natification/Natification'

import './index.css'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<Provider store={store}>
					<Natification>
						<App />
					</Natification>
				</Provider>
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
)
