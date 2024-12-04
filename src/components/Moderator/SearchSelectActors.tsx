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
import useSearchActor from '@/hooks/Actor/useSearchActor';
import { TActor } from '@/types';
import { Command as CommandPrimitive } from 'cmdk';

const SearchSelectActors: FC<{
	setStarCast: Dispatch<SetStateAction<string[]>>;
}> = ({ setStarCast }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [open, setOpen] = useState(false);
	const [selectedActors, setSelectedActors] = useState<TActor[]>([]);
	const [query, setQuery] = useState('');
	const [suggestions, setSuggestions] = useState<TActor[]>([]);

	const { searchActors, fetchingState } = useSearchActor();

	// Fetch suggestions based on the query
	useEffect(() => {
		const fetchSuggestions = async () => {
			if (query.trim()) {
				const results = await searchActors(query, selectedActors);
				setSuggestions(results);
			} else {
				setSuggestions([]);
			}
		};

		fetchSuggestions();
	}, [query, selectedActors, searchActors]);

	useEffect(() => {
		if (setStarCast) setStarCast(selectedActors.map((actor) => actor._id));
	}, [setStarCast, selectedActors]);

	// Remove actor from the selected list
	const handleUnselect = useCallback((actor: TActor) => {
		setSelectedActors((prev) =>
			prev.filter((selected) => selected._id !== actor._id)
		);
	}, []);

	// Handle keyboard interactions
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (input) {
				if ((e.key === 'Delete' || e.key === 'Backspace') && query === '') {
					setSelectedActors((prev) => prev.slice(0, -1));
				}
				if (e.key === 'Escape') {
					input.blur();
				}
			}
		},
		[query]
	);

	const availableSuggestions = suggestions.filter(
		(actor) => !selectedActors.some((selected) => selected._id === actor._id)
	);

	return (
		<Command
			onKeyDown={handleKeyDown}
			className='overflow-visible bg-transparent'>
			<div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
				<div className='flex flex-wrap gap-1'>
					{selectedActors.map((actor) => (
						<Badge
							key={actor._id}
							variant='secondary'>
							{actor.name}
							<button
								className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleUnselect(actor);
									}
								}}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								onClick={() => handleUnselect(actor)}>
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
						placeholder='Select star cast'
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
									availableSuggestions.map((actor) => (
										<CommandItem
											key={actor._id}
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											onSelect={() => {
												// setQuery('');
												setSelectedActors((prev) => [...prev, actor]);
											}}
											className='cursor-pointer'>
											{actor.name}
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

export default SearchSelectActors;
