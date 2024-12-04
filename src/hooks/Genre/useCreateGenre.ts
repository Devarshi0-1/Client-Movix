import { useStore } from '@/components/store/zustand';
import { TBasicResponse, TGenre, THookCallback } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type TCreateGenre = (
	{ name, description }: { name: string; description: string },
	callbacks?: THookCallback
) => Promise<void>;

const useCreateGenre = () => {
	const globalGenres = useStore((state) => state.globalGenres);
	const addGenre = useStore((state) => state.addGenre);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const [data, setData] = useState<TGenre | null>(null);

	const createGenre: TCreateGenre = async (
		{ name, description },
		callbacks
	) => {
		setFetchingState('loading');

		try {
			const { data } = await axios.post<TBasicResponse<TGenre>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/genre`,
				{
					name,
					description,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);

			setFetchingState('success');

			if (globalGenres.some((genre) => genre._id !== data.data._id))
				addGenre(data.data);

			if (callbacks?.onSuccess) callbacks.onSuccess();

			setData(data.data);
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

	return { createGenre, fetchingState, data };
};

export default useCreateGenre;
