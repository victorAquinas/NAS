import { AccordionItem } from '@szhsin/react-accordion';
import { BiChevronDown } from 'react-icons/bi';

interface AtAccordionItemProps {
	header: string;
	children: React.ReactNode;
	isOpen?: boolean;
}
const AtAccordionItem = ({
	header,
	children,
	isOpen = false,
}: AtAccordionItemProps) => {
	return (
		<AccordionItem
			header={(data) => (
				<div className='flex justify-between items-center'>
					{header}{' '}
					<span
						className={`text-2xl transition-transform duration-250 ease-[cubic-bezier(0,_0,_0,_1)]  ${
							data?.state.isEnter && 'rotate-180'
						}`}
					>
						<BiChevronDown />
					</span>
				</div>
			)}
			initialEntered={isOpen}
			buttonProps={{
				className: `w-full text-start bg-gray-200 p-2 px-3 rounded-md text-sm font-normal px-2 `,
			}}
			contentProps={{
				className:
					'transition-[height] duration-200 ease-[cubic-bezier(0,_0,_0,_1)]',
			}}
		>
			{children}
		</AccordionItem>
	);
};

export default AtAccordionItem;
