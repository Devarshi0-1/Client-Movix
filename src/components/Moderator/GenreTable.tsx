import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import useDeleteGenre from '@/hooks/Genre/useDeleteGenre';
import useGetMyGenre from '@/hooks/Genre/useGetMyGenre';
import { TGenre } from '@/types';
import { format } from 'date-fns';
import { MoreHorizontalIcon } from 'lucide-react';
import { useStore } from '../store/zustand';

const GenreTable = () => {
	useGetMyGenre();
	const globalGenres = useStore((state) => state.globalGenres);

	const { deleteGenre } = useDeleteGenre();

	const truncateBiography = (text: string, maxLength: number = 10) => {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	};

	const handleGenreDelete = async (genre: TGenre) => {
		await deleteGenre({ genre });
	};

	return (
		<Table>
			<TableHeader>
				<TableRow className='bg-secondary/30'>
					<TableHead>Name</TableHead>
					<TableHead>Description</TableHead>
					<TableHead>Created</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{globalGenres?.map((genre) => (
					<TableRow
						key={genre._id}
						className='border-b'>
						<TableCell className='font-medium'>{genre.name}</TableCell>
						<TableCell className='hidden sm:table-cell'>
							{truncateBiography(genre.description || '')}
						</TableCell>
						<TableCell className='hidden sm:table-cell'>
							{format(genre.createdAt, 'h:mm a, MMM d, yyyy')}
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
										onClick={() => handleGenreDelete(genre)}
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
export default GenreTable;
