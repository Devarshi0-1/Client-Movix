import { debounce } from '@/lib/utils';
import { PaginationInfo, SearchParams, TActor, TBasicResponse } from '@/types';
import axios, { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type TActorSearchResult = {
	actors: TActor[];
	pagination: PaginationInfo;
};

type TSearchActorHookReturn = {
	searchActors: (query: string, selectedActors?: TActor[]) => Promise<TActor[]>;
	fetchingState: 'loading' | 'error' | 'success';
};

const useSearchActor = (): TSearchActorHookReturn => {
	const [fetchingState, setFetchingState] = useState<
		'loading' | 'error' | 'success'
	>('loading');

	const searchActors = useCallback(
		debounce(
			async (
				query: string,
				selectedActors: TActor[] = []
			): Promise<TActor[]> => {
				// Trim and validate query
				const trimmedQuery = query.trim();

				if (trimmedQuery === '') return [];

				const params: SearchParams = {
					name: trimmedQuery,
					page: 1,
					limit: 5,
				};

				try {
					const { data } = await axios.get<TBasicResponse<TActorSearchResult>>(
						`${import.meta.env.VITE_BACKEND_V1_ENDPOINT}/actor/search`,
						{
							params,
							withCredentials: true,
							headers: {
								'Content-Type': 'application/json',
							},
						}
					);

					setFetchingState('success');

					// Filter out already selected actors
					const filteredSuggestions = data.data.actors.filter(
						(actor) =>
							!selectedActors.some((selected) => selected.name === actor.name)
					);

					return filteredSuggestions;
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

	return { searchActors, fetchingState };
};

export default useSearchActor;
