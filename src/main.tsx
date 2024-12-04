import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.tsx';
import { AuthContextProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Router>
			<ThemeProvider
				defaultTheme='dark'
				storageKey='vite-ui-theme'>
				<AuthContextProvider>
					<App />
				</AuthContextProvider>
			</ThemeProvider>
		</Router>
		<Toaster
			richColors
			position='bottom-right'
			theme='dark'
		/>
	</StrictMode>
);
