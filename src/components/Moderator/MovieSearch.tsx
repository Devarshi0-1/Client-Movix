import { FC, useState } from 'react';

import { Command } from '@/components/ui/command';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const MovieSearch: FC = () => {
	const navigate = useNavigate();
	const [searchValue, setSearchValue] = useState<string>('');

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		return navigate(`/search/${searchValue.toLowerCase()}`);
	};

	return (
		<Command className='overflow-visible bg-transparent w-full'>
			<form
				onSubmit={onSubmit}
				className='flex backdrop-blur-xl justify-center rounded-full overflow-hidden items-center'>
				<Input
					type='text'
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					onKeyDown={(e) =>
						e.key === 'Enter' &&
						searchValue.trim() &&
						navigate(`/search/${searchValue.toLowerCase()}`)
					}
					placeholder='Search for a movie'
					className='p-5 border-none outline-none h-auto ring-0 focus-visible:ring-0'
					required
				/>
				<Button
					type='submit'
					className='bg-transparent rounded-full text-primary hover:bg-primary/10 hover:text-primary h-full'>
					Search
				</Button>
			</form>
		</Command>
	);
};

export default MovieSearch;
