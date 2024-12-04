import { useStore } from '@/components/store/zustand';
import { TBasicResponse, TGenre, THookCallback } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type TDeleteGenre = (
	{ genre }: { genre: TGenre },
	callbacks?: THookCallback
) => Promise<void>;

const useDeleteGenre = () => {
	const deleteGenreInStore = useStore((state) => state.deleteGenre);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');

	const deleteGenre: TDeleteGenre = async ({ genre }, callbacks) => {
		setFetchingState('loading');
		console.log(import.meta.env.VITE_BACKEND_V1_ENDPOINT);

		try {
			await axios.delete<TBasicResponse<null>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/genre/${genre._id}`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);

			setFetchingState('success');

			deleteGenreInStore(genre);

			toast.success('Genre deleted successfully!');

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

	return { fetchingState, deleteGenre };
};

export default useDeleteGenre;
