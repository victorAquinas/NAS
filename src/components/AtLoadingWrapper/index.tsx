import ReactLoading from 'react-loading';

interface AtLoadingWrapperProps {
	isLoading: boolean;
}
export const AtLoadingWrapper = ({ isLoading }: AtLoadingWrapperProps) => {
	const loadingMessages: string[] = [
		'Loading magic...',
		'Please wait, brewing coffee ☕',
		'Loading: One moment of awesomeness.',
		"Hang tight, we're making things perfect!",
		'10%... 20%... 30%... you get the idea.',
		'Loading happiness 🎉',
		'Bringing awesomeness to your screen!',
		'Loading: This won’t take forever… hopefully.',
		'Preparing everything you love.',
		'Almost there… still loading.',
		'Give us a moment... 🕒',
		'Patience is a virtue, friend.',
		'Loading in 3, 2, 1… wait.',
		'Fetching wonders from the cloud.',
		'The bits and bytes are working hard.',
		'Hold tight, unicorns are running! 🦄',
		'Good things take time!',
		'Relax... it’s loading.',
		'Optimizing awesomeness.',
		'Generating cool stuff for you.',
		'This is where the magic happens.',
		'Loading, because robots need time, too. 🤖',
		'Please stand by for greatness.',
		'Summoning resources...',
		'We’re on it, trust us.',
		'While you wait... think happy thoughts.',
		'Building something cool.',
		'Loading: Don’t close your eyes!',
		'Let’s make this worth the wait.',
		'Data in transit... please wait.',
		'If waiting was an art, you’d be a master.',
		'Loading dreams and wishes...',
		'Just around the corner.',
		"Loading: We're 99% ready (almost).",
		'Don’t go anywhere! Cool stuff is coming.',
		'Wait for it… wait for it...',
		'Sorting things just for you.',
		'Cranking the gears…',
		'Entering hyperspeed 🚀',
		'There’s light at the end of the tunnel.',
		'Buffing pixels...',
		'Loading faster than you think.',
		'Not long now!',
		'Making some digital magic happen ✨',
		'Plugging in the matrix.',
		'Keep calm, loading is happening.',
		'Pixels are falling into place.',
		'Your patience = appreciated.',
		'This is not forever, promise.',
		'Preparing data love.',
		'Gathering dust bunnies 🐰',
		'Sit tight, this’ll be worth it.',
		'Just a little bit longer…',
		'Processing... Beep-boop 🤖',
		'Filling your screen with awesome.',
		'Streaming awesomeness.',
		'Tech elves at work!',
		'Adding finishing touches...',
		'Life is loading!',
		'Prepping data surprises.',
		'Watch this space!',
		'1%… 2%… 3%... patience, please.',
		'Firing up engines… 🛠️',
		'Assembling pieces of perfection.',
		'Almost ready, you’re doing great!',
		'Engaging turbo mode ⚡',
		'Loading happiness for your screen.',
		'Sending good vibes while you wait.',
		'Final touches in progress…',
		'Thanks for hanging with us!',
		'Checking connections...',
		'Bringing brilliance to life.',
		'Hold your breath… okay, don’t.',
		'Data marathon in progress. 🏃‍♂️',
		'One moment closer to greatness.',
		'Tuning the loading orchestra 🎼',
		'Downloading cosmic energy. 🌌',
		'Calculating awesomeness percentage.',
		'Hope you love surprises!',
		'Letting the pixels warm up.',
		'Making sure all systems go.',
		'The internet hamsters are running! 🐹',
		'Stuffing rainbows into your screen. 🌈',
		'Almost there, hang in!',
		'Wait for the magic to happen...',
		'A wizard is preparing your content.',
		'Hold tight, we’re juggling data.',
		'Snapping things into place…',
		'Charging the excitement bar…',
		'Making it sparkle ✨',
		'Fetching awesomeness just for you.',
		'Serving you something fresh.',
		'Gaining momentum…',
		'Optimizing experience in progress.',
		'Loading the fun bits!',
		'Fasten your seatbelts, loading!',
		'42% complete… just kidding.',
		'Pumping up the good vibes.',
		'Time flies when you’re waiting.',
		'And now… the moment you’ve been waiting for!',
	];

	const getRandomLoadingMessage = (): string => {
		const randomIndex = Math.floor(Math.random() * loadingMessages.length);
		return loadingMessages[randomIndex];
	};

	return (
		<>
			{isLoading ? (
				<div className='bg-white z-20 flex-col fixed left-[115px] top-[52px] right-0 h-full flex items-center justify-center'>
					<ReactLoading type='cylon' color='#00BC92' width={100} />

					<p className='text-2xl w-[400px] pt-6 text-center text-secondary'>
						{getRandomLoadingMessage()}
					</p>
				</div>
			) : (
				''
			)}
		</>
	);
};
