import { useStore } from '@/components/store/zustand';
import { TActor, TBasicResponse, THookCallback } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type TDeleteActor = (
	{ actor }: { actor: TActor },
	callbacks?: THookCallback
) => Promise<void>;

const useDeleteActor = () => {
	const deleteActorInStore = useStore((state) => state.deleteActor);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');

	const deleteActor: TDeleteActor = async ({ actor }, callbacks) => {
		setFetchingState('loading');
		try {
			await axios.delete<TBasicResponse<null>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/actor/${actor._id}`,
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);

			setFetchingState('success');

			deleteActorInStore(actor);

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

	return { fetchingState, deleteActor };
};

export default useDeleteActor;
