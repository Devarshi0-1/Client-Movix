import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getRatingColor = (rating: number) => {
	switch (rating) {
		case 1:
			return 'text-red-600'; // Very low rating
		case 2:
			return 'text-orange-500'; // Low rating
		case 3:
			return 'text-yellow-500'; // Average rating
		case 4:
			return 'text-green-500'; // Good rating
		case 5:
			return 'text-emerald-600'; // Excellent rating
		default:
			return 'text-gray-500'; // Fallback or unrated
	}
};

export const getGenderColor = (
	gender: 'male' | 'female' | 'other' | 'unknown'
) => {
	switch (gender) {
		case 'male':
			return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
		case 'female':
			return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
		case 'other':
			return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
		default:
			return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
	}
};

type GenreColors = {
	[genre: string]: string;
};

export const getGenreColor = (genreName: string): string => {
	const colors: GenreColors = {
		horror: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
		comedy:
			'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
		drama: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
		suspense:
			'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
		thriller:
			'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
		mystery:
			'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
		romance: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
		action:
			'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
		scifi: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
		fantasy:
			'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
		adventure: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
		Documentary:
			'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
		animation: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
		crime: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
		biography:
			'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
		musical:
			'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
	};

	return (
		colors[genreName.toLowerCase()] ??
		'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
	);
};

export const debounce = <F extends (...args: any[]) => Promise<any>>(
	func: F,
	delay: number
) => {
	let timeoutId: NodeJS.Timeout;
	return (...args: Parameters<F>): Promise<any> => {
		return new Promise((resolve) => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(async () => {
				try {
					const result = await func(...args);
					resolve(result);
				} catch (error) {
					resolve([]);
				}
			}, delay);
		});
	};
};
