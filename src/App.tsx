import { useAuthContext } from '@/context/AuthContext';
import AddingGenre from '@/pages/AddingGenre';
import AuthPage from '@/pages/Auth';
import Home from '@/pages/Home';
import Moderator from '@/pages/Moderator';
import { Navigate, Route, Routes } from 'react-router-dom';
import Search from './pages/Search';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { authUser } = useAuthContext();

	if (!authUser) {
		// If user is not authenticated, redirect to the auth page
		return <Navigate to='/' />;
	}

	if (
		!Array.isArray(authUser.preferences?.favorite_genres) ||
		authUser.preferences.favorite_genres.length === 0
	) {
		// If favorite genres are not set, redirect to the add-genre page
		return <Navigate to='/add-genre' />;
	}

	return children;
};

const App = () => {
	const { authUser } = useAuthContext();

	return (
		<Routes>
			<Route
				path='/'
				element={authUser ? <Navigate to='/home' /> : <AuthPage />}
			/>
			<Route
				path='/add-genre'
				element={
					authUser ? (
						Array.isArray(authUser.preferences?.favorite_genres) &&
						authUser.preferences.favorite_genres.length > 0 ? (
							<Navigate to='/home' />
						) : (
							<AddingGenre />
						)
					) : (
						<Navigate to='/' />
					)
				}
			/>
			<Route
				path='/home'
				element={
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/search/:name'
				element={
					<ProtectedRoute>
						<Search />
					</ProtectedRoute>
				}
			/>
			<Route
				path='/mod'
				element={
					authUser?.role === 'MODERATOR' ? (
						<Moderator />
					) : (
						<Navigate to='/home' />
					)
				}
			/>
		</Routes>
	);
};

export default App;
