// Update src/app/AdminRoutes.tsx
import { useAuth } from '@/context/AuthContext';
import { AdminCommentsPage } from '@/pages/admin/AdminCommentsPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';

export function AdminRoutes() {
	const { user } = useAuth();

	if (!user) {
		return (
			<Routes>
				<Route
					path="/login"
					element={<AdminLoginPage onAdminLogin={() => {}} />}
				/>
				<Route path="*" element={<Navigate to="/admin/login" replace />} />
			</Routes>
		);
	}

	if (user.role !== 'admin') {
		return <Navigate to="/" replace />;
	}

	return (
		<Routes>
			<Route element={<AdminLayout />}>
				<Route path="/dashboard" element={<AdminDashboardPage />} />
				<Route path="/comments" element={<AdminCommentsPage />} />
				<Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
			</Route>
		</Routes>
	);
}
