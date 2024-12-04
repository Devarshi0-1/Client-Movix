import { debounce } from '@/lib/utils';
import { PaginationInfo, SearchParams, TBasicResponse, TGenre } from '@/types';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type TGenreSearchResult = {
	genres: TGenre[];
	pagination: PaginationInfo;
};

type TSearchGenreHookReturn = {
	searchGenres: (query: string, selectedGenres?: TGenre[]) => Promise<TGenre[]>;
	fetchingState: 'loading' | 'error' | 'success';
};

const useSearchGenre = (): TSearchGenreHookReturn => {
	const [fetchingState, setFetchingState] = useState<
		'loading' | 'error' | 'success'
	>('loading');

	const searchGenres = useCallback(
		debounce(
			async (
				query: string,
				selectedGenres: TGenre[] = []
			): Promise<TGenre[]> => {
				// Trim and validate query
				const trimmedQuery = query.trim();

				if (trimmedQuery === '') return [];

				const params: SearchParams = {
					name: trimmedQuery,
					page: 1,
					limit: 5,
				};

				try {
					const { data } = await axios.get<TBasicResponse<TGenreSearchResult>>(
						`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/genre/search`,
						{
							params,
							withCredentials: true,
						}
					);
					setFetchingState('success');

					return data.data.genres.filter(
						(genre) =>
							!selectedGenres.some((selected) => selected.name === genre.name)
					);
				} catch (error) {
					setFetchingState('error');
					toast.error('Error fetching genres');
					return [];
				}
			},
			1000
		),
		[]
	);

	return { searchGenres, fetchingState };
};

export default useSearchGenre;
