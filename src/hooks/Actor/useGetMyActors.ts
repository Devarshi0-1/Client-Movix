import { useStore } from '@/components/store/zustand';
import { TActor, TBasicResponse, THookCallback } from '@/types';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type TGetMyActors = (callbacks?: THookCallback) => Promise<void>;

const useGetMyActors = () => {
	const setActors = useStore((state) => state.setActors);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const [data, setData] = useState<TActor[] | null>(null);

	const getMyActors: TGetMyActors = async (callbacks) => {
		setFetchingState('loading');

		try {
			const { data } = await axios.get<TBasicResponse<TActor[]>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/actor/my`,

				{
					withCredentials: true,
				}
			);

			setFetchingState('success');

			setActors(data.data);

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
		getMyActors();
	}, []);

	return { getMyActors, fetchingState, data };
};

export default useGetMyActors;
