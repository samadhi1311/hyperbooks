'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageWrapper, Section } from '@/components/ui/layout';
import { useAuth } from '@/hooks/use-auth';
import { useFirestoreAdd } from '@/hooks/use-firestore';
import { ProfileData } from '@/lib/types';
import { storage } from '@/firebase.config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Compressor from 'compressorjs';
import { ChangeEvent, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CircleCheckIcon, ImagePlusIcon, Loader2Icon, SendHorizonalIcon, XCircleIcon } from 'lucide-react';
import { H2 } from '@/components/ui/typography';

export default function Profile() {
	const { user } = useAuth();
	const { updateUserProfile, loading } = useFirestoreAdd<ProfileData>();
	const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
	const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

	const formSchema = z.object({
		name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(50),
		email: z.string().email({ message: 'Invalid email address' }),
		phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' }),
		address: z.array(z.string().max(100)).optional(),
		website: z.string().url({ message: 'Invalid website URL' }).optional(),
		logo: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			email: user?.email || '',
			phone: '',
			address: [''],
			website: '',
			logo: '',
		},
	});

	function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
			setSelectedImage(file);
		}
	}

	async function handleImageUpload(): Promise<string | null> {
		if (!selectedImage || !user) return null;

		const options = {
			quality: 0.8,
			resize: 'cover' as 'cover' | 'none' | 'contain',
			width: 480,
			height: 480,
		};

		return new Promise<string>((resolve, reject) => {
			new Compressor(selectedImage, {
				...options,
				success: async (compressedBlob: Blob) => {
					try {
						const extension = selectedImage.name.split('.').pop()?.toLowerCase() || 'jpg';
						const compressedFile = new File([compressedBlob], `logo.${extension}`, { type: `image/${extension}` });

						const imageRef = ref(storage, `users/${user.uid}/logo.${extension}`);
						await uploadBytes(imageRef, compressedFile);

						const downloadURL = await getDownloadURL(imageRef);
						resolve(downloadURL);
					} catch (error) {
						console.error('Failed to upload image:', error);
						setUploadStatus('error');
						reject(error);
					}
				},
				error: (error) => {
					console.error('Image compression failed:', error);
					setUploadStatus('error');
					reject(error);
				},
			});
		});
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setUploadStatus('uploading');
			if (selectedImage) {
				const logoUrl = await handleImageUpload();
				if (logoUrl) {
					values.logo = logoUrl;
				}
			}

			if (user) {
				await updateUserProfile(values);
			}
			setUploadStatus('success');
		} catch (error) {
			console.error('Submission error:', error);
		}
	}

	return (
		<PageWrapper>
			<Section className='mx-auto max-w-screen-sm space-y-8'>
				<H2>Profile</H2>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder='Your Business Name' {...field} />
									</FormControl>
									<FormDescription>Your business name will be appear on the header of invoice.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Logo Upload */}
						<div>
							<Label>Business Logo</Label>
							<Card className='mt-2 aspect-square w-64 overflow-hidden border border-input'>
								<CardContent className='aspect-square h-full w-64 p-0'>
									<Input name='image' id='image' type='file' accept='image/jpeg,image/png' onChange={handleImageChange} className='hidden' />
									<Label htmlFor='image' className='group relative flex h-full w-full cursor-pointer items-center justify-center'>
										{selectedImage ? (
											<img
												className='pointer-events-none absolute h-full w-full overflow-hidden object-cover brightness-75 transition-all duration-300 group-hover:scale-105 group-hover:brightness-50'
												src={URL.createObjectURL(selectedImage)}
												alt='Preview'
											/>
										) : (
											<div className='z-10 flex items-center justify-center gap-2'>
												<ImagePlusIcon className='size-5' />
												Select a Logo
											</div>
										)}
									</Label>
								</CardContent>
							</Card>
							<p className='mt-2 text-sm text-muted-foreground'>
								(Optional) Upload a JPG or PNG file. Image will be compressed upon upload. Image with transparent background is Recommended.
							</p>
						</div>

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder='you@example.com' {...field} />
									</FormControl>
									<FormDescription>Your business contact Email</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input placeholder='+1234567890' {...field} />
									</FormControl>
									<FormDescription>Your business contact number</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Street Address, City, State, Zip'
											{...field}
											value={field.value?.join('\n') || ''}
											onChange={(e) => field.onChange(e.target.value.split('\n'))}
										/>
									</FormControl>
									<FormDescription>(Optional) Your business address one line per address line. Recommended to keep at 3 lines.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='website'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Website</FormLabel>
									<FormControl>
										<Input placeholder='https://www.example.com' {...field} />
									</FormControl>
									<FormDescription>(Optional) Your business website</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='logo'
							render={({ field }) => (
								<FormItem className='hidden'>
									<FormLabel>Logo URL</FormLabel>
									<FormControl>
										<Input placeholder='https://www.example.com/logo.png' {...field} />
									</FormControl>
									<FormDescription>Optional business logo image URL</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							disabled={loading}
							className={`flex items-center gap-3 
                                ${uploadStatus === 'uploading' ? 'cursor-not-allowed' : ''}
                                ${uploadStatus === 'success' ? 'bg-emerald-500 cursor-not-allowed text-white' : ''}
                                ${uploadStatus === 'error' ? 'bg-red-500' : ''}`}>
							{uploadStatus === 'uploading' || loading ? (
								<Loader2Icon className='animate-spin' />
							) : uploadStatus === 'success' ? (
								<CircleCheckIcon />
							) : uploadStatus === 'error' ? (
								<XCircleIcon />
							) : (
								<SendHorizonalIcon className='size-4' />
							)}
							{uploadStatus === 'uploading' || loading ? 'Uploading...' : ''}
							{uploadStatus === 'success' ? 'Success' : uploadStatus === 'error' ? 'Error' : ''}
							{uploadStatus === 'idle' ? 'Update' : ''}
						</Button>
					</form>
				</Form>
			</Section>
		</PageWrapper>
	);
}
