import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import useDeleteMovie from '@/hooks/Movie/useDeleteMovie';
import useGetMyMovies from '@/hooks/Movie/useGetMyMovies';
import { getGenreColor } from '@/lib/utils';
import { TMovie } from '@/types';
import { MoreHorizontalIcon } from 'lucide-react';
import { useStore } from '../store/zustand';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CircularProgressBar } from '../ui/circular-progress-bar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';

const MovieTable = () => {
	useGetMyMovies();
	const globalMovies = useStore((state) => state.globalMovies);

	const { deleteMovie } = useDeleteMovie();

	const handleActorDelete = async (movie: TMovie) => {
		await deleteMovie({ movie });
	};

	return (
		<Table>
			<TableHeader>
				<TableRow className='bg-secondary/30'>
					<TableHead>Poster</TableHead>
					<TableHead>Title</TableHead>
					<TableHead className='hidden sm:table-cell'>Genres</TableHead>
					<TableHead className='hidden sm:table-cell'>Star Cast</TableHead>
					<TableHead>Rating</TableHead>
					<TableHead className='w-[70px]'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{globalMovies?.map((movie) => (
					<TableRow
						key={movie._id}
						className='border-b'>
						<TableCell>
							<Avatar className='h-20 w-20'>
								<AvatarImage
									className='object-cover'
									src={movie.poster_image.url || undefined}
									alt={movie.poster_image.alt || movie.title}
								/>
								<AvatarFallback>
									{movie.title.length > 2
										? movie.title.slice(0, 2)
										: movie.title}
								</AvatarFallback>
							</Avatar>
						</TableCell>
						<TableCell className='font-medium'>{movie.title}</TableCell>
						<TableCell className='hidden sm:table-cell'>
							<div className='flex flex-wrap gap-1'>
								{movie?.genre?.map((genre) => (
									<Badge
										key={genre._id}
										variant='secondary'
										className={`${getGenreColor(genre.name)} capitalize`}>
										{genre.name}
									</Badge>
								))}
							</div>
						</TableCell>
						<TableCell className='hidden sm:table-cell'>
							<div className='flex space-x-1 overflow-x-auto'>
								{movie.star_cast?.map((actor) => (
									<Avatar
										key={actor._id}
										className='h-8 w-8'>
										<AvatarImage
											src={actor.profile_image?.url || undefined}
											alt={actor.profile_image.alt || actor.name}
										/>
										<AvatarFallback>
											{actor.name.length > 2
												? actor.name.slice(0, 2)
												: actor.name}
										</AvatarFallback>
									</Avatar>
								))}
							</div>
						</TableCell>
						<TableCell>
							<div className='flex items-center'>
								<CircularProgressBar
									value={movie.rating || 0}
									size={40}
								/>
							</div>
						</TableCell>
						<TableCell>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='ghost'
										className='h-8 w-8 p-0'>
										<span className='sr-only'>Open menu</span>
										<MoreHorizontalIcon className='h-4 w-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem>View details</DropdownMenuItem>
									<DropdownMenuItem>Edit</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleActorDelete(movie)}
										className='text-red-600'>
										Delete
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default MovieTable;
