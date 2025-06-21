import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuth();
	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				Loading...
			</div>
		);
	}

	if (user && user.role === 'admin') {
		return <>{children}</>;
	}
	return <Navigate to="/admin/login" replace />;
}

export function AdminRoutes() {
	const navigate = useNavigate();

	const handleAdminLogin = () => {
		navigate('/admin/dashboard');
	};

	return (
		<Routes>
			<Route
				path="login"
				element={<AdminLoginPage onAdminLogin={handleAdminLogin} />}
			/>
			<Route
				path="dashboard"
				element={
					<AdminProtectedRoute>
						<AdminDashboardPage />
					</AdminProtectedRoute>
				}
			/>
			<Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
		</Routes>
	);
}
