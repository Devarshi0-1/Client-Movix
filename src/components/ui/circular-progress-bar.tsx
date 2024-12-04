interface CircularProgressBarProps {
	value: number;
	size?: number;
	strokeWidth?: number;
	colors?: {
		whole_circle?: string;
		value_circle?: string;
	};
}

export function CircularProgressBar({
	value,
	size = 120,
	strokeWidth = 8,
	colors = {
		whole_circle: 'text-primary-foreground',
		value_circle: 'text-primary',
	},
}: CircularProgressBarProps) {
	const percentage = (value / 5) * 100;
	const radius = 45;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (percentage / 100) * circumference;

	return (
		<div
			className='relative inline-flex bg-background border-primary items-center justify-center rounded-full'
			style={{
				width: size,
				height: size,
			}}>
			<svg
				className='w-full h-full -rotate-90'
				viewBox='0 0 100 100'>
				<circle
					className={`${colors.whole_circle} stroke-current`}
					strokeWidth={strokeWidth}
					stroke='currentColor'
					fill='transparent'
					r={radius}
					cx='50'
					cy='50'
				/>
				<circle
					className={`${colors.value_circle} stroke-current`}
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap='round'
					stroke='currentColor'
					fill='transparent'
					r={radius}
					cx='50'
					cy='50'
					style={{
						transition: 'stroke-dashoffset 0.5s ease 0s',
					}}
				/>
			</svg>
			<div className='absolute text-xl font-bold'>{value}</div>
		</div>
	);
}
