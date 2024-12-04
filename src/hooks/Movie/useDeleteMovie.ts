import { useStore } from '@/components/store/zustand';
import { TBasicResponse, THookCallback, TMovie } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type TDeleteMovie = (
	{ movie }: { movie: TMovie },
	callbacks?: THookCallback
) => Promise<void>;

const useDeleteMovie = () => {
	const deleteMovieInStore = useStore((state) => state.deleteMovie);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');

	const deleteMovie: TDeleteMovie = async ({ movie }, callbacks) => {
		setFetchingState('loading');
		try {
			await axios.delete<TBasicResponse<null>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/movie/${movie._id}`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);

			setFetchingState('success');

			deleteMovieInStore(movie);

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

	return { fetchingState, deleteMovie };
};

export default useDeleteMovie;
