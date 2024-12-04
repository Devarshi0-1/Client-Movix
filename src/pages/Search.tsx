import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { useAuthContext } from '@/context/AuthContext';
import useSearchMovie from '@/hooks/Movie/useSearchMovie';
import { TMovie } from '@/types';
import { Loader2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const Search = () => {
	const { authUser } = useAuthContext();
	const { name } = useParams();
	const { searchMovies, fetchingState } = useSearchMovie();
	const [suggestions, setSuggestions] = useState<TMovie[]>([]);

	useEffect(() => {
		const fetchSuggestions = async () => {
			if (name?.trim()) {
				const results = await searchMovies(name);
				setSuggestions(results);
			} else {
				setSuggestions([]);
			}
		};

		fetchSuggestions();
	}, [name, searchMovies]);

	return (
		<div>
			<header className='relative'>
				<Navbar className='sticky'>
					<ul className='flex gap-5 items-center'>
						<li>
							<Link to='/'>Home</Link>
						</li>
						{authUser?.role === 'MODERATOR' ? (
							<li>
								<Link to='/mod'>Moderator</Link>
							</li>
						) : null}
					</ul>
				</Navbar>
			</header>
			<main className='px-40 mt-10'>
				<h1 className='text-4xl'>
					Search Results for <span className='capitalize'>"{name}"</span>
				</h1>
				<div className='mt-20'>
					{fetchingState === 'loading' ? (
						<div className='p-4'>
							<Loader2Icon className='m-auto h-5 w-5 animate-spin' />
						</div>
					) : (
						<Carousel
							opts={{
								align: 'center',
							}}
							className='flex flex-wrap w-full'>
							<CarouselContent>
								{suggestions.map((movie, index) => (
									<CarouselItem
										key={index}
										className='md:basis-1/2 lg:basis-1/5'>
										<MovieCard movie={movie} />
									</CarouselItem>
								))}
							</CarouselContent>
						</Carousel>
					)}
				</div>
			</main>
		</div>
	);
};
export default Search;
