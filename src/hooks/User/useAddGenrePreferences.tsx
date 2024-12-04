import { TBasicResponse, TGenre, THookCallback, TUser } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type TAddGenrePref = (
	genresId: TGenre['_id'][],
	callbacks?: THookCallback
) => Promise<void>;

const useAddGenrePreferences = () => {
	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');
	const [data, setData] = useState<TUser['preferences'] | null>(null);

	const addGenrePreferences: TAddGenrePref = async (genresId, callbacks) => {
		setFetchingState('loading');
		try {
			const { data } = await axios.put<TBasicResponse<TUser['preferences']>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/user/preferences`,
				{
					favorite_genres: genresId,
				},
				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);

			setFetchingState('success');

			toast.success('Success! Genre preferences added!');

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

	return { addGenrePreferences, fetchingState, data };
};

export default useAddGenrePreferences;
