import { TBasicResponse } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '../../context/AuthContext';

const useLogout = () => {
	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const { setAuthUser } = useAuthContext();

	const logout = async () => {
		setFetchingState('loading');
		try {
			const { data } = await axios.post<TBasicResponse<null>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/auth/logout`,
				{},
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			);

			if (setAuthUser) setAuthUser(null);

			toast.success(data.message);

			setFetchingState('success');

			localStorage.removeItem('user');
		} catch (error: unknown) {
			const err = error as AxiosError<TBasicResponse<null>>;
			setFetchingState('error');

			if (err?.response?.data?.error?.message) {
				toast.error(err.response.data.error.message);
			} else {
				toast.error(err.message);
			}
		}
	};

	return { fetchingState, logout };
};
export default useLogout;
