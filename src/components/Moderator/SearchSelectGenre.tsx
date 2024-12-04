import { Loader2Icon, X } from 'lucide-react';
import React, {
	Dispatch,
	FC,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { Badge } from '@/components/ui/badge';
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import useSearchGenre from '@/hooks/Genre/useSearchGenre';
import { TGenre } from '@/types';
import { Command as CommandPrimitive } from 'cmdk';

const SelectSearchGenre: FC<{
	setGenres: Dispatch<SetStateAction<TGenre[]>>;
}> = ({ setGenres }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [selectedGenres, setSelectedGenres] = useState<TGenre[]>([]);
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<TGenre[]>([]);

	const { searchGenres, fetchingState } = useSearchGenre();

	// Fetch suggestions based on the query
	useEffect(() => {
		const fetchSuggestions = async () => {
			if (query.trim()) {
				const results = await searchGenres(query, selectedGenres);
				setSuggestions(results);
			} else {
				setSuggestions([]);
			}
		};

		fetchSuggestions();
	}, [query, selectedGenres, searchGenres]);

	useEffect(() => {
		if (setGenres) setGenres(selectedGenres);
	}, [selectedGenres]);

	// Remove genre from the selected list
	const handleUnselect = useCallback((genre: TGenre) => {
		setSelectedGenres((prev) =>
			prev.filter((selected) => selected._id !== genre._id)
		);
	}, []);

	// Handle keyboard interactions
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (input) {
				if ((e.key === 'Delete' || e.key === 'Backspace') && query === '') {
					setSelectedGenres((prev) => prev.slice(0, -1));
				}
				if (e.key === 'Escape') {
					input.blur();
				}
			}
		},
		[query]
	);

	const availableSuggestions = suggestions.filter(
		(genre) => !selectedGenres.some((selected) => selected._id === genre._id)
	);

	return (
		<Command
			onKeyDown={handleKeyDown}
			className='overflow-visible bg-transparent'>
			<div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
				<div className='flex flex-wrap gap-1'>
					{selectedGenres.map((genre) => (
						<Badge
							key={genre._id}
							variant='secondary'>
							{genre.name}
							<button
								className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleUnselect(genre);
									}
								}}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								onClick={() => handleUnselect(genre)}>
								<X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
							</button>
						</Badge>
					))}
					<CommandPrimitive.Input
						ref={inputRef}
						value={query}
						onValueChange={setQuery}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder='Select genres...'
						className='ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
					/>
				</div>
			</div>
			<div className='relative mt-2'>
				<CommandList>
					{open &&
					(availableSuggestions.length > 0 || fetchingState === 'loading') ? (
						<div className='absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
							<CommandGroup>
								{fetchingState === 'loading' ? (
									<div className='p-4'>
										<Loader2Icon className='m-auto animate-spin h-5 w-5' />
									</div>
								) : (
									availableSuggestions.map((genre) => (
										<CommandItem
											key={genre._id}
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											onSelect={() => {
												setQuery('');
												setSelectedGenres((prev) => [...prev, genre]);
											}}
											className='cursor-pointer'>
											{genre.name}
										</CommandItem>
									))
								)}
							</CommandGroup>
						</div>
					) : null}
				</CommandList>
			</div>
		</Command>
	);
};

export default SelectSearchGenre;
