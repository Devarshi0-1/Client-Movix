import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import useDeleteActor from '@/hooks/Actor/useDeleteActor';
import useGetMyActors from '@/hooks/Actor/useGetMyActors';
import { getGenderColor } from '@/lib/utils';
import { TActor } from '@/types';
import { format } from 'date-fns';
import { MoreHorizontalIcon } from 'lucide-react';
import { useStore } from '../store/zustand';

const ActorTable = () => {
	useGetMyActors();
	const globalActors = useStore((state) => state.globalActors);
	const { deleteActor } = useDeleteActor();

	const truncateBiography = (text: string, maxLength: number = 10) => {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + '...';
	};

	const handleActorDelete = async (actor: TActor) => {
		await deleteActor({ actor });
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Profile</TableHead>
					<TableHead>Name</TableHead>
					<TableHead className='hidden md:table-cell'>Birth Date</TableHead>
					<TableHead className='hidden sm:table-cell'>Biography</TableHead>
					<TableHead>Gender</TableHead>
					<TableHead className='w-[70px]'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{globalActors?.map((actor) => (
					<TableRow key={actor._id}>
						<TableCell>
							<Avatar>
								<AvatarImage
									src={actor.profile_image.url || undefined}
									alt={actor.profile_image.alt || undefined}
								/>
								<AvatarFallback>{actor.name.slice(0, 2)}</AvatarFallback>
							</Avatar>
						</TableCell>
						<TableCell className='font-medium'>{actor.name}</TableCell>
						<TableCell className='hidden md:table-cell'>
							{format(actor.birth_date, 'MMM d, yyyy')}
						</TableCell>
						<TableCell className='hidden sm:table-cell max-w-[300px]'>
							{truncateBiography(actor.biography || '')}
						</TableCell>
						<TableCell>
							<Badge
								variant='secondary'
								className={`${getGenderColor(actor.gender)} capitalize`}>
								{actor.gender}
							</Badge>
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
										onClick={() => handleActorDelete(actor)}
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
export default ActorTable;
