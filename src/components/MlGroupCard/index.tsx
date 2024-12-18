import { IoIosAddCircleOutline } from 'react-icons/io';
import AtButton from '../AtButton';

interface MlGroupCardProps {
	type: 'in-site' | 'off-site';
	address: string;
	shift: string;
	name: string;
}

export const MlGroupCard = ({
	type,
	address,
	shift,
	name,
}: MlGroupCardProps) => {
	return (
		<div className='group w-full xl:w-1/2'>
			<div className='group-card bg-white p-4 rounded-md'>
				<div className='header flex justify-between relative'>
					<div className='left w-1/2'>
						<div className='title text-primary font-medium'>
							{type === 'in-site' ? 'In-site' : 'Off-site'} - {name}
						</div>
						<div className='text-sm'>{address}</div>
					</div>
					<div className='right w-1/2 text-end absolute top-0 right-2'>
						<input
							type='text'
							placeholder='Time'
							className='w-[200px] h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
							defaultValue={shift}
						/>
					</div>
				</div>

				<div className='group-weeks mt-4 flex flex-col gap-y-6 relative'>
					<div className='week-card border border-black rounded-md flex'>
						<div className='week-number flex justify-center items-center w-[100px] border-r border-black p-2'>
							Week 1
						</div>
						<div className='week-rows p-2 w-full gap-y-2 flex flex-col'>
							<div className='week-row flex items-center justify-between px-2 gap-x-4'>
								<div>
									<input
										type='text'
										placeholder='Date'
										className=' w-full h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
										value={'10/10/2024'}
									/>
								</div>
								<div>7:00AM - 7:00 PM</div>

								<div className='w-max'>
									<select
										name='#'
										id='#'
										className='w-full h-full bg-white p-1  placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
									>
										<option value='all'>Coordinator</option>
										<option value='f.garcia'>F. Garcia</option>
									</select>
								</div>
							</div>
							<div className='week-row flex items-center justify-between px-2 gap-x-4'>
								<div>
									<input
										type='text'
										placeholder='Date'
										className=' w-full h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
										value={'10/10/2024'}
									/>
								</div>
								<div>7:00AM - 7:00 PM</div>

								<div className='w-max'>
									<select
										name='#'
										id='#'
										className='w-full h-full bg-white p-1  placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
									>
										<option value='all'>Coordinator</option>
										<option value='f.garcia'>F. Garcia</option>
									</select>
								</div>
							</div>
							<div className='week-row flex items-center justify-between px-2 gap-x-4'>
								<div>
									<input
										type='text'
										placeholder='Date'
										className=' w-full h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
										value={'10/10/2024'}
									/>
								</div>
								<div>7:00AM - 7:00 PM</div>

								<div className='w-max'>
									<select
										name='#'
										id='#'
										className='w-full h-full bg-white p-1  placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
									>
										<option value='all'>Coordinator</option>
										<option value='f.garcia'>F. Garcia</option>
									</select>
								</div>
							</div>
							<div className='text-2xl text-primary flex justify-center pt-2'>
								<button>
									<IoIosAddCircleOutline />
								</button>
							</div>
						</div>
					</div>

					<div className='week-card border border-black rounded-md flex'>
						<div className='week-number flex justify-center items-center w-[100px] border-r border-black p-2'>
							Week 2
						</div>
						<div className='week-rows p-2 w-full gap-y-2 flex flex-col'>
							<div className='week-row flex items-center justify-between px-2 gap-x-4'>
								<div>
									<input
										type='text'
										placeholder='Date'
										className=' w-full h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
										value={'10/10/2024'}
									/>
								</div>
								<div>7:00AM - 7:00 PM</div>

								<div className='w-max'>
									<select
										name='#'
										id='#'
										className='w-full h-full bg-white p-1  placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
									>
										<option value='all'>Coordinator</option>
										<option value='f.garcia'>F. Garcia</option>
									</select>
								</div>
							</div>
							<div className='week-row flex items-center justify-between px-2 gap-x-4'>
								<div>
									<input
										type='text'
										placeholder='Date'
										className=' w-full h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
										value={'10/10/2024'}
									/>
								</div>
								<div>7:00AM - 7:00 PM</div>

								<div className='w-max'>
									<select
										name='#'
										id='#'
										className='w-full h-full bg-white p-1  placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
									>
										<option value='all'>Coordinator</option>
										<option value='f.garcia'>F. Garcia</option>
									</select>
								</div>
							</div>
							<div className='week-row flex items-center justify-between px-2 gap-x-4'>
								<div>
									<input
										type='text'
										placeholder='Date'
										className=' w-full h-full bg-white p-1 placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
										value={'10/10/2024'}
									/>
								</div>
								<div>7:00AM - 7:00 PM</div>

								<div className='w-max'>
									<select
										name='#'
										id='#'
										className='w-full h-full bg-white p-1  placeholder:text-gray-400 font-normal rounded-md border border-gray-400'
									>
										<option value='all'>Coordinator</option>
										<option value='f.garcia'>F. Garcia</option>
									</select>
								</div>
							</div>
							<div className='text-2xl text-primary flex justify-center pt-2'>
								<button>
									<IoIosAddCircleOutline />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className='add-week-btn text-primary flex justify-center pt-2'>
					<AtButton variant='secondary' className='text-sm'>
						Add new week
					</AtButton>
				</div>
			</div>
		</div>
	);
};
