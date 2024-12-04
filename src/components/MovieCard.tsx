import { getRatingColor } from '@/lib/utils';
import { TMovie } from '@/types';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { CircularProgressBar } from './ui/circular-progress-bar';

const MovieCard = ({ movie }: { movie: TMovie }) => {
    console.log(movie)

	return (
		<div className='relative h-full'>
			<Card className='h-full hover:opacity-80 transition-opacity cursor-pointer'>
				<CardContent className='h-full flex relative items-center justify-center p-0'>
					<img
						src={movie.poster_image.url || undefined}
						alt={movie.poster_image?.alt || movie.title}
						className='rounded-xl h-full object-cover'
					/>
					{movie?.genre?.length && (
						<div className='absolute inset-0 flex items-end justify-end p-4 gap-3'>
							{movie?.genre?.map((genre, index) =>
								index < 2 ? <Badge key={genre._id}> {genre.name}</Badge> : null
							)}
						</div>
					)}
					{movie.rating ? (
						<div className='p-0 absolute left-2 -bottom-8'>
							<CircularProgressBar
								size={50}
								value={movie.rating}
								colors={{
									value_circle: getRatingColor(movie.rating),
								}}
							/>
						</div>
					) : null}
				</CardContent>
			</Card>

			<div className='mt-3 font-semibold text-xl'>
				<p>{movie.title}</p>
			</div>
		</div>
	);
};
export default MovieCard;
