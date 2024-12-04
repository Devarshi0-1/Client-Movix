export type TUser = {
	_id: string;
	username: string;
	email: string;
	// phone_number: string;
	role: 'USER' | 'MODERATOR' | 'ADMIN';
	// mfaSecret?: string;
	// mfaEnabled: boolean;
	watchedMovie: {
		movie: TMovie;
		rating?: number;
		watchDate?: string;
	}[];
	preferences: {
		favorite_genres: TGenre[];
	};
	createdAt: Date;
	updatedAt: Date;
};

export type TMovie = {
	_id: string;
	title: string;
	description?: string;
	release_date: Date;
	rating?: number;
	duration: number;
	poster_image: {
		url: string | null;
		alt: string | null;
	};
	reviews?: TReview[];
	star_cast: TActor[];
	genre: TGenre[];
	createdBy: TUser;
	updatedBy: TUser;
	createdAt: Date;
	updatedAt: Date;
};

export type TReview = {
	_id: string;
	createdBy: TUser;
	movie: TMovie;
	rating: number;
	comment?: string;
	helpful_votes: number;
	weight: number;
	createdAt: Date;
	updatedAt: Date;
};

export type TGenre = {
	_id: string;
	name: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
};

export type TActor = {
	_id: string;
	name: string;
	biography: string | null;
	birth_date: Date;
	profile_image: {
		url: string | null;
		alt: string | null;
	};
	createdBy: TUser;
	updatedBy: TUser;
	gender: 'male' | 'female' | 'other' | 'unknown';
	createdAt: Date;
	updatedAt: Date;
};

export type THookCallback = {
	onSuccess?: () => void;
	onError?: () => void;
};

export type TBasicResponse<T> = {
	success: boolean;
	data: T;
	message: string;
	isError: boolean;
	error: {
		message: string;
	};
};

export type PaginationInfo = {
	current_page: number;
	total_pages: number;
	total_actors: number;
	per_page: number;
};

export type SearchParams = {
	name: string;
	page?: number;
	limit?: number;
};
