import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useLogin from '@/hooks/Auth/useLogin';
import useSignUp from '@/hooks/Auth/useSignUp';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

export default function AuthPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [loginUsername, setLoginUsername] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [signupUsername, setSignupUsername] = useState('');
	const [signupEmail, setSignupEmail] = useState('');
	const [signupPassword, setSignupPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const { login } = useLogin();
	const { signUp } = useSignUp();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		// Login logic here
		await login({
			username: loginUsername,
			password: loginPassword,
		});
	};

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (signupPassword !== confirmPassword) {
			alert('Passwords do not match');
			return;
		}
		// Signup logic here
		await signUp({
			username: signupUsername,
			email: signupEmail,
			password: signupPassword,
		});
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4'>
			<Card className='w-full bg-background/60 max-w-md shadow-2xl border-none'>
				<Tabs
					defaultValue='login'
					className='w-full'>
					<TabsList className='grid w-full grid-cols-2 mb-4 bg-background/20'>
						<TabsTrigger
							value='login'
							className=''>
							Login
						</TabsTrigger>
						<TabsTrigger
							value='signup'
							className=''>
							Sign Up
						</TabsTrigger>
					</TabsList>

					{/* Login Tab */}
					<TabsContent value='login'>
						<CardHeader>
							<CardTitle className='text-2xl text-center'>
								Welcome Back
							</CardTitle>
							<CardDescription className='text-center'>
								Enter your credentials to access your account
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleLogin}
								className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='login-username'>Email</Label>
									<Input
										id='login-username'
										type='text'
										placeholder='johndoe_123'
										value={loginUsername}
										onChange={(e) => setLoginUsername(e.target.value)}
										required
									/>
								</div>
								<div className='space-y-2 relative'>
									<Label htmlFor='login-password'>Password</Label>
									<div className='relative'>
										<Input
											id='login-password'
											type={showPassword ? 'text' : 'password'}
											placeholder='Enter your password'
											value={loginPassword}
											onChange={(e) => setLoginPassword(e.target.value)}
											required
											className='pr-10'
										/>
										<Button
											type='button'
											variant='ghost'
											size='icon'
											className='absolute right-1 top-1/2 -translate-y-1/2'
											onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? (
												<EyeOff className='h-4 w-4' />
											) : (
												<Eye className='h-4 w-4' />
											)}
										</Button>
									</div>
								</div>
								<Button
									type='submit'
									className='w-full'>
									Login
								</Button>
							</form>
						</CardContent>
					</TabsContent>

					{/* Signup Tab */}
					<TabsContent value='signup'>
						<CardHeader>
							<CardTitle className='text-2xl text-center'>
								Create an Account
							</CardTitle>
							<CardDescription className='text-center'>
								Sign up to start your journey
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form
								onSubmit={handleSignup}
								className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='signup-username'>Username</Label>
									<Input
										id='signup-username'
										type='text'
										placeholder='Choose a username'
										value={signupUsername}
										onChange={(e) => setSignupUsername(e.target.value)}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='signup-email'>Email</Label>
									<Input
										id='signup-email'
										type='email'
										placeholder='you@example.com'
										value={signupEmail}
										onChange={(e) => setSignupEmail(e.target.value)}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='signup-password'>Password</Label>
									<Input
										id='signup-password'
										type={showPassword ? 'text' : 'password'}
										placeholder='Create a strong password'
										value={signupPassword}
										onChange={(e) => setSignupPassword(e.target.value)}
										required
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='confirm-password'>Confirm Password</Label>
									<Input
										id='confirm-password'
										type={showPassword ? 'text' : 'password'}
										placeholder='Repeat your password'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
									/>
								</div>
								<Button
									type='submit'
									className='w-full'>
									Sign Up
								</Button>
							</form>
						</CardContent>
					</TabsContent>
				</Tabs>
			</Card>
		</div>
	);
}
