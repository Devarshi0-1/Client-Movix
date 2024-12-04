import { TActor, TGenre, TMovie } from '@/types';
import { create } from 'zustand';

type Store = {
	globalGenres: TGenre[];
	setGenres: (genre: TGenre[]) => void;
	addGenre: (genre: TGenre) => void;
	deleteGenre: (genre: TGenre) => void;

	globalActors: TActor[];
	setActors: (actor: TActor[]) => void;
	addActor: (actor: TActor) => void;
	deleteActor: (actor: TActor) => void;

	globalMovies: TMovie[];
	setMovies: (movie: TMovie[]) => void;
	addMovie: (movie: TMovie) => void;
	deleteMovie: (movie: TMovie) => void;

	recommendedMovies: TMovie[];
	setRecommendedMovies: (movies: TMovie[]) => void;
};

export const useStore = create<Store>()((set) => ({
	globalGenres: [],
	setGenres: (genre) => set({ globalGenres: genre }),
	addGenre: (genre) =>
		set((state) => ({ globalGenres: [...state.globalGenres, genre] })),
	deleteGenre: (genre) =>
		set((state) => ({
			globalGenres: state.globalGenres.filter((g) => g._id !== genre._id),
		})),

	globalActors: [],
	setActors: (actor) => set({ globalActors: actor }),
	addActor: (actor) =>
		set((state) => ({ globalActors: [...state.globalActors, actor] })),
	deleteActor: (actor) =>
		set((state) => ({
			globalActors: state.globalActors.filter((a) => a._id !== actor._id),
		})),

	globalMovies: [],
	setMovies: (movie) => set({ globalMovies: movie }),
	addMovie: (movie) =>
		set((state) => ({ globalMovies: [...state.globalMovies, movie] })),
	deleteMovie(movie) {
		set((state) => ({
			globalMovies: state.globalMovies.filter((m) => m._id !== movie._id),
		}));
	},

	recommendedMovies: [],
	setRecommendedMovies: (movies) => set({ recommendedMovies: movies }),
}));
