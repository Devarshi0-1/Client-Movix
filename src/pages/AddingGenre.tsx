import Navbar from '@/components/Navbar';
import { useStore } from '@/components/store/zustand';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';
import useGetAllGenre from '@/hooks/Genre/useGetAllGenre';
import useAddGenrePreferences from '@/hooks/User/useAddGenrePreferences';
import { getGenreColor } from '@/lib/utils';
import { TGenre } from '@/types';
import { useState } from 'react';

export default function AddGenreClient() {
	useGetAllGenre();
	const { authUser, setAuthUser } = useAuthContext();

	const { addGenrePreferences } = useAddGenrePreferences();

	const globalGenres = useStore((state) => state.globalGenres);
	const [selectedGenres, setSelectedGenres] = useState<TGenre[]>([]);

	const handleGenreToggle = (genre: TGenre) => {
		setSelectedGenres((prev) =>
			// prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
			prev.some((prevGenre) => prevGenre._id === genre._id)
				? prev.filter((g) => g._id !== genre._id)
				: [...prev, genre]
		);
	};

	const handleSubmit = async () => {
		if (!selectedGenres.length) return;
		await addGenrePreferences(
			selectedGenres.map((genre) => genre._id),
			{
				onSuccess: () => {
					if (setAuthUser && authUser)
						setAuthUser({
							...authUser,
							preferences: {
								favorite_genres: selectedGenres,
							},
						});
				},
			}
		);
	};

	return (
		<div className='h-screen w-full'>
			<Navbar className='w-full sticky top-0 mb-10' />
			<div className='px-36 h-[calc(100%-10rem)]'>
				<div className='grid grid-cols-3 h-1/2 md:grid-cols-3 mb-5 lg:grid-cols-4 gap-14'>
					{globalGenres.map((genre) => (
						<Button
							key={genre.name}
							onClick={() => handleGenreToggle(genre)}
							className={`${getGenreColor(
								genre.name
							)} w-full rounded-full grayscale text-3xl h-fit transition-all duration-300 transform hover:scale-105 ${
								selectedGenres.some(
									(selectedGenre) => selectedGenre.name === genre.name
								)
									? `grayscale-0 ring ring-primary`
									: 'grayscale'
							}`}>
							{genre.name}
						</Button>
					))}
				</div>

				<Button
					onClick={handleSubmit}
					className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-full transition-all duration-300 transform hover:scale-105'>
					Add Selected Genres
				</Button>
			</div>
		</div>
	);
}
