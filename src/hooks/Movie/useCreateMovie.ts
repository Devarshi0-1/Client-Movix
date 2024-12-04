import { useStore } from '@/components/store/zustand';
import { TBasicResponse, TGenre, THookCallback, TMovie } from '@/types';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type TCreateMovie = (
	data: Omit<
		TMovie,
		| '_id'
		| 'createdBy'
		| 'updatedBy'
		| 'createdAt'
		| 'updatedAt'
		| 'poster_image'
		| 'star_cast'
		| 'rating'
		| 'genre'
	> & {
		poster_image: string | null;
		poster_alt: string | null;
		star_cast: string[];
		genres: TGenre[];
	},
	callbacks?: THookCallback
) => Promise<void>;

const useCreateMovie = () => {
	const addMovie = useStore((state) => state.addMovie);

	const [fetchingState, setFetchingState] = useState<
		'none' | 'loading' | 'success' | 'error'
	>('none');

	const createMovie: TCreateMovie = async (
		{
			title,
			description,
			release_date,
			duration,
			poster_image,
			poster_alt,
			star_cast,
			genres,
		},
		callbacks
    ) => {
        setFetchingState('loading')
		try {
			const { data } = await axios.post<TBasicResponse<TMovie>>(
				`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/movie`,
				{
					title,
					description,
					release_date,
					duration,
					poster_image,
					poster_alt,
					star_cast,
					genres: genres.map((genre) => genre._id),
				},

				{
					headers: {
						'Content-Type': 'application/json',
					},
					withCredentials: true,
				}
			);

			addMovie(data.data);

			setFetchingState('success');

			toast.success('Success! Movie added!');

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

	return { createMovie, fetchingState };
};

export default useCreateMovie;
