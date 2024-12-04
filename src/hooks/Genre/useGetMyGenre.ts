import { useStore } from '@/components/store/zustand';
import { TBasicResponse, TGenre, THookCallback } from '@/types';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TGetMyGenre = (callbacks?: THookCallback) => Promise<void>;

const useGetMyGenre = () => {
	const setGenres = useStore((state) => state.setGenres);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const [data, setData] = useState<TGenre[] | null>(null);

	const getMyGenre: TGetMyGenre = async (callbacks) => {
		setFetchingState('loading');
		try {
			const { data } = await axios.get<TBasicResponse<TGenre[]>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/genre/my`,
				{
					withCredentials: true,
					headers: { 'Content-Type': 'application/json' },
				}
			);

			setFetchingState('success');

			setGenres(data.data);

			toast.success('Success! Genre was created!');

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

	useEffect(() => {
		getMyGenre();
	}, []);

	return { getMyGenre, fetchingState, data };
};

export default useGetMyGenre;
