import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import useCreateGenre from '@/hooks/Genre/useCreateGenre';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type GenreFormData = {
	name: string;
	description: string;
};

export function CreateGenreDialog() {
	const [open, setOpen] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<GenreFormData>();

	const { createGenre } = useCreateGenre();

	const onSubmit = async (data: GenreFormData) => {
		await createGenre(
			{
				name: data.name,
				description: data.description,
			},
			{
				onSuccess: () => {
					setOpen(false);
					reset();
				},
			}
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Add Genre</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Create New Genre</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='name'>
							Genre Name
							<span className='text-red-500 ml-1'>*</span>
						</Label>
						<Input
							id='name'
							placeholder='e.g., Drama, Action, Comedy'
							{...register('name', {
								required: 'Genre name is required',
								minLength: {
									value: 2,
									message: 'Genre name must be at least 2 characters',
								},
							})}
						/>
						{errors.name && (
							<p className='text-sm text-red-500'>{errors.name.message}</p>
						)}
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>
							Description
							<span className='text-red-500 ml-1'>*</span>
						</Label>
						<Textarea
							id='description'
							placeholder='Provide a detailed description of this genre...'
							className='min-h-[100px]'
							{...register('description', {
								required: 'Genre description is required',
								minLength: {
									value: 20,
									message: 'Description must be at least 20 characters',
								},
							})}
						/>
						{errors.description && (
							<p className='text-sm text-red-500'>
								{errors.description.message}
							</p>
						)}
					</div>

					<div className='flex justify-end space-x-2'>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								reset();
								setOpen(false);
							}}>
							Cancel
						</Button>
						<Button type='submit'>Create Genre</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
