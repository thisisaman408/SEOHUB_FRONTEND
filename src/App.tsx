import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AdminRoutes } from './AdminRoutes';
import { AppLayout } from './AppLayout';
import { LandingPage } from './pages/LandingPage';
import { MyToolsPage } from './pages/MyToolsPage';
import { SubmitToolPage } from './pages/SubmitToolPage';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/admin/*" element={<AdminRoutes />} />

					<Route element={<AppLayout />}>
						<Route path="/" element={<LandingPage />} />
						<Route path="/submit-tool" element={<SubmitToolPage />} />
						<Route path="/my-tools" element={<MyToolsPage />} />
					</Route>
				</Routes>
			</Router>
			<Toaster />
		</AuthProvider>
	);
}

export default App;
