import { useStore } from '@/components/store/zustand';
import { TBasicResponse, THookCallback, TMovie } from '@/types';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TGetMyMovies = (callbacks?: THookCallback) => Promise<void>;

const useGetMyMovies = () => {
	const setMovies = useStore((state) => state.setMovies);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const getMyMovies: TGetMyMovies = async (callbacks) => {
		setFetchingState('loading');
		try {
			const { data } = await axios.get<TBasicResponse<TMovie[]>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/movie/my`,
				{
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' },
				}
			);

			setFetchingState('success');
			toast.success('Success! Movie was fetched!');
			setMovies(data.data);
			if (callbacks?.onSuccess) callbacks.onSuccess();
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

	useEffect(() => {
		getMyMovies();
	}, []);

	return { getMyMovies, fetchingState };
};

export default useGetMyMovies;
