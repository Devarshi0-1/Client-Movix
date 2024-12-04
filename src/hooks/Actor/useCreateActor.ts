import { useStore } from '@/components/store/zustand';
import { TActor, TBasicResponse, THookCallback } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type TCreateActor = (
	actor: Omit<
		TActor,
		| '_id'
		| 'createdBy'
		| 'updatedBy'
		| 'createdAt'
		| 'updatedAt'
		| 'profile_image'
	> & { profile_image: string | null; profile_alt: string | null },
	callbacks?: THookCallback
) => Promise<void>;

const useCreateActor = () => {
	const addActor = useStore((state) => state.addActor);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const [data, setData] = useState<TActor | null>(null);

	const createActor: TCreateActor = async (
		{ name, biography, birth_date, gender, profile_image, profile_alt },
		callbacks
	) => {
		setFetchingState('loading');
		try {
			const { data } = await axios.post<TBasicResponse<TActor>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/actor/`,
				{
					name,
					biography,
					birth_date,
					gender,
					profile_image,
					profile_alt,
				},
				{
					withCredentials: true,
				}
			);

			setFetchingState('success');

			addActor(data.data);

			toast.success('Success! Actor was created!');

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

	return { createActor, fetchingState, data };
};

export default useCreateActor;
