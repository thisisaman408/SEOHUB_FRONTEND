import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom';
import { AdminRoutes } from './AdminRoutes';
import { AppLayout } from './AppLayout';
import { UserProfilePage } from './components/UserProfilePage';
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
						<Route path="/profile" element={<UserProfilePage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Route>
				</Routes>
			</Router>
			<Toaster richColors position="top-right" />
		</AuthProvider>
	);
}

export default App;
