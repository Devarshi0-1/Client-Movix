import { TBasicResponse, THookCallback, TUser } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuthContext } from '../../context/AuthContext';

type TSignUp = (
	{
		username,
		email,
		password,
	}: {
		username: string;
		email: string;
		password: string;
	},
	callbacks?: THookCallback
) => Promise<void>;

const useSignUp = () => {
	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const { setAuthUser } = useAuthContext();

	const signUp: TSignUp = async ({ email, username, password }, callbacks) => {
		setFetchingState('loading');

		try {
			const { data } = await axios.post<TBasicResponse<TUser>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/auth/signup`,
				{
					email,
					username,
					password,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);

			if (setAuthUser) setAuthUser(data.data);

			toast.success(data.message);

			setFetchingState('success');

			if (callbacks?.onSuccess) callbacks.onSuccess();

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

	return { fetchingState, signUp };
};

export default useSignUp;
