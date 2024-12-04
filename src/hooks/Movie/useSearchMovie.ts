import { debounce } from '@/lib/utils';
import { PaginationInfo, SearchParams, TBasicResponse, TMovie } from '@/types';
import axios, { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type TMovieSearchResult = {
	movies: TMovie[];
	pagination: PaginationInfo;
};

type TSearchMovieHookReturn = {
	searchMovies: (query: string, selectedMovies?: TMovie[]) => Promise<TMovie[]>;
	fetchingState: 'loading' | 'error' | 'success';
};

const useSearchMovie = (): TSearchMovieHookReturn => {
	const [fetchingState, setFetchingState] = useState<
		'loading' | 'error' | 'success'
	>('loading');

	const searchMovies = useCallback(
		debounce(
			async (
				query: string,
				selectedMovies: TMovie[] = []
			): Promise<TMovie[]> => {
				// Trim and validate query
				const trimmedQuery = query.trim();

				if (trimmedQuery === '') return [];

				const params: SearchParams = {
					name: trimmedQuery,
					page: 1,
					limit: 5,
				};

				try {
					const { data } = await axios.get<TBasicResponse<TMovieSearchResult>>(
						`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/movie/search`,
						{
							params,
							withCredentials: true,
						}
					);
					setFetchingState('success');

					return data.data.movies.filter(
						(movie) =>
							!selectedMovies.some((selected) => selected.title === movie.title)
					);
				} catch (error) {
					const err = error as AxiosError<TBasicResponse<null>>;
					setFetchingState('error');
					if (err?.response?.data?.error?.message) {
						toast.error(err.response.data.error.message);
					} else {
						toast.error(err.message);
					}
					return [];
				}
			},
			1000
		),
		[]
	);

	return { searchMovies, fetchingState };
};

export default useSearchMovie;
