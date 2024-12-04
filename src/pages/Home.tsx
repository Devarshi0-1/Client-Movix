import MovieSearch from '@/components/Moderator/MovieSearch';
import MovieCard from '@/components/MovieCard';
import Navbar from '@/components/Navbar';
import { useStore } from '@/components/store/zustand';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { useAuthContext } from '@/context/AuthContext';
import useGetRecommendations from '@/hooks/Movie/useGetRecommendations';
import { Link } from 'react-router-dom';

const Home = () => {
	const { authUser } = useAuthContext();
	useGetRecommendations();

	const recommendedMovies = useStore((state) => state.recommendedMovies);

	return (
		<div className='w-full'>
			<header>
				<Navbar>
					<ul className='flex gap-2 items-center'>
						{authUser?.role === 'MODERATOR' ? (
							<li>
								<Link to='/mod'>Moderator</Link>
							</li>
						) : null}
					</ul>
				</Navbar>
				<div className='absolute inset-0 -z-20'>
					<img
						src='https://image.tmdb.org/t/p/original/p4INKu77iuTG1o1a5N3Y9vqeEGq.jpg'
						alt='Image of a famous movie'
						className='h-full w-full'
					/>
				</div>
				<div className='absolute inset-0 -z-10 bg-gradient-to-b from-background/10 to-background'></div>

				<div className='w-1/2 h-[calc(100vh-10rem)] m-auto gap-4 flex flex-col justify-center items-center'>
					<div>
						<h1 className='text-8xl tracking-wider font-bold'>Welcome</h1>
						<p className='text-xl'>Millions of Movies. Explore Now! Millions</p>
					</div>
					<div className='flex w-full items-center justify-center'>
						<MovieSearch />
					</div>
				</div>
			</header>

			<main className='flex flex-col gap-10 px-40 mt-20'>
				<h2 className='text-3xl'>Recommended</h2>
				<Carousel
					opts={{
						align: 'center',
					}}
					className='w-full'>
					<CarouselContent>
						{recommendedMovies.map((movie, index) => (
							<CarouselItem
								key={index}
								className='md:basis-1/2 lg:basis-1/5'>
								<MovieCard movie={movie} />
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious
						className='left-5'
						variant='secondary'
					/>
					<CarouselNext
						className='right-5'
						variant='secondary'
					/>
				</Carousel>
			</main>
		</div>
	);
};

export default Home;
