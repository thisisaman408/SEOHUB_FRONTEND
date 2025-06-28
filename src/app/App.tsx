import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/context/AuthContext';
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from 'react-router-dom';
import { ToolMarketplacePage } from '../pages/marketplace/ToolMarketplacePage';
import { MyToolsPage } from '../pages/tools/MyToolsPage';
import { ToolDetailPage } from '../pages/tools/ToolDetailPage';
import { ToolSubmissionPage } from '../pages/tools/ToolSubmissionPage';
import { UserProfilePage } from '../pages/user/UserProfilePage';
import { AdminRoutes } from './AdminRoutes';
import { AppLayout } from './AppLayout';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/admin/*" element={<AdminRoutes />} />
					<Route element={<AppLayout />}>
						<Route path="/submit-tool" element={<ToolSubmissionPage />} />
						<Route path="/" element={<ToolMarketplacePage />} />
						<Route path="/submit-tool" element={<ToolSubmissionPage />} />
						<Route path="/my-tools" element={<MyToolsPage />} />
						<Route path="/profile" element={<UserProfilePage />} />
						<Route path="/tool/:toolSlug" element={<ToolDetailPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Route>
				</Routes>
			</Router>
			<Toaster richColors position="top-right" />
		</AuthProvider>
	);
}

export default App;
