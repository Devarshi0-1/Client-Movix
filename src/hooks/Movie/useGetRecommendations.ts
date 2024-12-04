import { useStore } from '@/components/store/zustand';
import { TBasicResponse, THookCallback, TMovie } from '@/types';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TGetRecommendations = (callbacks?: THookCallback) => Promise<void>;

const useGetRecommendations = () => {
	const setRecommendedMovies = useStore((state) => state.setRecommendedMovies);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const getRecommendations: TGetRecommendations = async (callbacks) => {
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
			setRecommendedMovies(data.data);
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
		getRecommendations();
	}, []);

	return { getRecommendations, fetchingState };
};

export default useGetRecommendations;
