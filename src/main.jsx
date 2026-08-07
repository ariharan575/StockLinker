import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents reloading every time user switches tabs
      retry: 1, // Only retry failed requests once before showing error
    },
  },
});


createRoot(document.getElementById('root')).render(
  
   <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
)
