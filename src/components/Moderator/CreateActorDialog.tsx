import useCreateActor from '@/hooks/Actor/useCreateActor';
import { TActor } from '@/types';
import { ChangeEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

type ActorFormData = Omit<
	TActor,
	| '_id'
	| 'createdBy'
	| 'updatedBy'
	| 'createdAt'
	| 'updatedAt'
	| 'profile_image'
> & {
	profile_image: string | null;
	profile_alt: string | null;
};

const CreateActorDialog = () => {
	const [open, setOpen] = useState(false);
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ActorFormData>();
	const [selectedImage, setSelectedImage] = useState<string | null>(null); // Base64 string for the image

	// Handle image selection and conversion to Base64
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

	const { createActor } = useCreateActor();

	const convertDateStringToDate = (dateString: string): Date | null => {
		const [day, month, year] = dateString.split('/').map(Number);
		if (day && month && year) {
			return new Date(year, month - 1, day); // Month is zero-indexed
		}
		return null;
	};

	const onSubmit = async (data: ActorFormData) => {
		const birthDate = convertDateStringToDate(
			data.birth_date as unknown as string
		);

		if (!birthDate) {
			toast.error('Invalid birth date format. Please use DD/MM/YYYY.');
			return;
		}

		// Prepare data to send to the backend
		const actorData = {
			...data,
			birth_date: birthDate,
			profile_image: selectedImage || null, // Use Base64 image string
		};

		// Call API
		await createActor(actorData, {
			onSuccess: () => {
				setOpen(false);
				setSelectedImage(null);
				reset();
			},
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='outline'>Add Actor</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Create New Actor</DialogTitle>
					<DialogDescription>
						Fill in the details below to add a new actor to the database.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-6'>
					<div className='grid gap-6 sm:grid-cols-2'>
						{/* Name Input */}
						<div className='space-y-2'>
							<Label htmlFor='name'>
								Name<span className='text-red-500 ml-1'>*</span>
							</Label>
							<Input
								id='name'
								{...register('name', {
									required: 'Actor name is required',
									minLength: {
										value: 2,
										message: 'Name must be at least 2 characters',
									},
								})}
							/>
							{errors.name && (
								<p
									className='text-sm text-red-500'
									role='alert'>
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Gender Selection */}
						<div className='space-y-2'>
							<Label htmlFor='gender'>
								Gender<span className='text-red-500 ml-1'>*</span>
							</Label>
							<Controller
								name='gender'
								control={control}
								defaultValue='unknown'
								rules={{ required: 'Please select a gender' }}
								render={({ field }) => (
									<Select
										onValueChange={field.onChange}
										value={field.value}>
										<SelectTrigger id='gender'>
											<SelectValue placeholder='Select gender' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='male'>Male</SelectItem>
											<SelectItem value='female'>Female</SelectItem>
											<SelectItem value='other'>Other</SelectItem>
											<SelectItem value='unknown'>Prefer not to say</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.gender && (
								<p
									className='text-sm text-red-500'
									role='alert'>
									{errors.gender.message}
								</p>
							)}
						</div>

						{/* Birth Date Input */}
						<div className='space-y-2'>
							<Label htmlFor='birth_date'>Birth Date (DD/MM/YYYY)</Label>
							<Input
								id='birth_date'
								{...register('birth_date', {
									required: 'Birth date is required',
									pattern: {
										value: /^\d{2}\/\d{2}\/\d{4}$/,
										message: 'Invalid date format. Use DD/MM/YYYY.',
									},
								})}
								placeholder='Enter date in DD/MM/YYYY'
							/>
							{errors.birth_date && (
								<p
									className='text-sm text-red-500'
									role='alert'>
									{errors.birth_date.message}
								</p>
							)}
						</div>

						{/* Profile Image Input */}
						<div className='space-y-2'>
							<Label htmlFor='profile-image-upload'>Profile Image</Label>
							<Input
								type='file'
								id='profile-image-upload'
								accept='image/png, image/jpg, image/svg, image/ico, image/jfif, image/webp'
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

						{/* Profile Alt Text */}
						<div className='sm:col-span-2 space-y-2'>
							<Label htmlFor='profile_alt'>Profile Image Alt Text</Label>
							<Input
								id='profile_alt'
								{...register('profile_alt')}
								placeholder='Brief description of the image'
							/>
						</div>

						{/* Biography Input */}
						<div className='sm:col-span-2 space-y-2'>
							<Label htmlFor='biography'>Biography</Label>
							<Textarea
								id='biography'
								className='min-h-[150px] resize-none'
								placeholder="Write about the actor's career, achievements, and background..."
								{...register('biography')}
							/>
						</div>
					</div>

					{/* Form Actions */}
					<div className='flex justify-end gap-4 pt-4'>
						<Button
							type='button'
							variant='outline'
							onClick={() => {
								reset();
								setOpen(false);
								setSelectedImage(null);
							}}>
							Cancel
						</Button>
						<Button
							type='submit'
							disabled={isSubmitting}>
							{isSubmitting ? (
								<span className='flex items-center gap-2'>
									<span className='h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
									Creating...
								</span>
							) : (
								'Create Actor'
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateActorDialog;
