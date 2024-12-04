import ActorTable from '@/components/Moderator/ActorTable';
import CreateActorDialog from '@/components/Moderator/CreateActorDialog';
import { CreateGenreDialog } from '@/components/Moderator/CreateGenreDialog';
import CreateMovieDialog from '@/components/Moderator/CreateMovieDialog';
import GenreTable from '@/components/Moderator/GenreTable';
import MovieTable from '@/components/Moderator/MovieTable';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const Moderator = () => {
	return (
		<div>
			<header className='relative'>
				<Navbar className='sticky'>
					<ul className='flex gap-2 items-center'>
						<li>
							<Link to='/'>Home</Link>
						</li>
					</ul>
				</Navbar>
			</header>

			<main className='lg:px-40 md:px-20 sm:px-5 space-y-40 my-10'>
				<div className='flex flex-col gap-2'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-2xl'>Movies Created</h2>
						<CreateMovieDialog />
					</div>
					<div className='overflow-x-auto'>
						<MovieTable />
					</div>
				</div>
				<div className='flex flex-col gap-2'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-2xl'>Actor Created</h2>
						<CreateActorDialog />
					</div>
					<div className='overflow-x-auto'>
						<ActorTable />
					</div>
				</div>
				<div className='flex flex-col gap-2'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-2xl'>Genre Created</h2>
						<CreateGenreDialog />
					</div>
					<div className='overflow-x-auto flex gap-3 text-2xl'>
						<GenreTable />
					</div>
				</div>
			</main>
		</div>
	);
};
export default Moderator;
