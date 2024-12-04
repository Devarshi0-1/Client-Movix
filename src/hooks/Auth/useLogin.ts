import { useAuthContext } from '@/context/AuthContext';
import { TBasicResponse, THookCallback, TUser } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type Login = (
	{
		username,
		password,
	}: {
		username: string;
		password: string;
	},
	callbacks?: THookCallback
) => Promise<void>;

const useLogin = () => {
	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const { setAuthUser } = useAuthContext();

	const login: Login = async ({ username, password }, callbacks) => {
		setFetchingState('loading');
		try {
			const { data } = await axios.post<TBasicResponse<TUser>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/auth/login`,
				{ username, password },
				{
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true,
				}
			);

			if (setAuthUser) setAuthUser(data.data);

			toast.success(data.message);

			setFetchingState('success');

			if (callbacks?.onSuccess) callbacks.onSuccess();

			toast.success(data.message);

			localStorage.setItem('user', JSON.stringify(data.data));
		} catch (error) {
			const err = error as AxiosError<TBasicResponse<null>>;
			setFetchingState('error');
			if (err?.response?.data?.error?.message) {
				toast.error(err.response.data.error.message);
			} else {
				toast.error(err.message);
			}
			if (callbacks?.onError) callbacks.onError();
		}
	};

	return { fetchingState, login };
};

export default useLogin;
