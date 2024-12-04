import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useCreateMovie from '@/hooks/Movie/useCreateMovie';
import { TGenre } from '@/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import SearchSelectActors from './SearchSelectActors';
import SelectSearchGenre from './SearchSelectGenre';

const CreateMovieDialog = () => {
	const [open, setOpen] = useState<boolean>(false);

	const [title, setTitle] = useState<string>('');
	const [description, setDescription] = useState<string>('');
	const [release_date, setReleaseDate] = useState<string>('');
	const [duration, setDuration] = useState<number>(0);
	const [star_cast, setStarCast] = useState<string[]>([]);
	const [genres, setGenres] = useState<TGenre[]>([]);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [posterImageAlt, setPosterImageAlt] = useState<string>('');

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				if (reader.result) {
					setSelectedImage(reader.result as string); // Set Base64 string
				}
			};
			reader.readAsDataURL(file); // Convert file to Base64
		}
	};

	const { createMovie, fetchingState } = useCreateMovie();

	const convertDateStringToDate = (dateString: string): Date | null => {
		const [day, month, year] = dateString.split('/').map(Number);
		if (day && month && year) {
			return new Date(year, month - 1, day); // Month is zero-indexed
		}
		return null;
	};

	const onSubmit = async () => {
		if (
			!title ||
			!description ||
			!release_date ||
			!duration ||
			!star_cast ||
			!genres
		) {
			toast.error('Please fill all the required fields.');
			return;
		}

		const releaseDate = convertDateStringToDate(release_date);

		if (!releaseDate) {
			toast.error('Invalid release date format. Please use DD/MM/YYYY.');
			return;
		}

		await createMovie(
			{
				title,
				description,
				release_date: releaseDate,
				duration,
				poster_image: selectedImage || null, // Use Base64 image string
				poster_alt: posterImageAlt,
				star_cast,
				genres,
			},
			{ onSuccess: () => setOpen(false) }
		);
	};

	useEffect(() => {
		console.table({ fetchingState });
	}, [fetchingState]);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Add Movie</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Create New Movie</DialogTitle>
					<DialogDescription>
						Fill in the details below to add a new movie to the database.
					</DialogDescription>
				</DialogHeader>
				<form className='space-y-6'>
					<div className='grid gap-6 sm:grid-cols-2'>
						<div className='space-y-2'>
							<Label htmlFor='title'>
								Title
								<span className='text-red-500 ml-1'>*</span>
							</Label>
							<Input
								id='title'
								min={1}
								type='text'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='poster-image-upload'>Poster Image</Label>
							<Input
								type='file'
								id='poster-image-upload'
								accept='image/*'
								onChange={handleImageChange}
							/>
							{selectedImage && (
								<div className='mt-4'>
									<img
										src={selectedImage}
										alt='Selected image preview'
										className='max-w-full h-auto'
									/>
								</div>
							)}
						</div>
						<div className='space-y-2'>
							<Label htmlFor='poster-image-alt'>Poster Image Alt</Label>
							<Input
								type='text'
								id='poster-image-alt'
								value={posterImageAlt}
								onChange={(e) => setPosterImageAlt(e.target.value)}
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='duration'>
								Duration (minutes)
								<span className='text-red-500 ml-1'>*</span>
							</Label>
							<Input
								id='duration'
								type='number'
								min={1}
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								required
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='release_date'>
								Release Date
								<span className='text-red-500 ml-1'>*</span>
							</Label>

							<Input
								id='release_date'
								type='text'
								placeholder='DD/MM/YYYY'
								value={release_date}
								onChange={(e) => setReleaseDate(e.target.value)}
								required
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='select_genre'>
								Add Genre
								<span className='text-red-500 ml-1'>*</span>
							</Label>
							<SelectSearchGenre setGenres={setGenres} />
						</div>
						<div className='space-y-2'>
							<Label htmlFor='select_genre'>
								Add Star Cast
								<span className='text-red-500 ml-1'>*</span>
							</Label>
							<SearchSelectActors setStarCast={setStarCast} />
						</div>

						<div className='sm:col-span-2 space-y-2'>
							<Label htmlFor='description'>Description</Label>
							<Textarea
								id='description'
								className='min-h-[100px] resize-none'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder='Write a brief description of the movie...'
								required
							/>
						</div>
					</div>

					<div className='flex justify-end gap-4 pt-4'>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								setOpen(false);
							}}>
							Cancel
						</Button>
						<Button
							type='button'
							disabled={false}
							onClick={onSubmit}>
							{fetchingState === 'loading' ? (
								<span className='flex items-center gap-2'>
									<span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
									Creating...
								</span>
							) : (
								'Create Movie'
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateMovieDialog;
