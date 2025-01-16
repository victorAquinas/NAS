import { Link } from 'react-router-dom';

type BreadcrumbItem = {
	label: string;
	link?: string;
};

type AtBreadcrumbProps = {
	items: BreadcrumbItem[];
	separator?: string;
};

const AtBreadcrumb: React.FC<AtBreadcrumbProps> = ({
	items,
	separator = '/',
}) => {
	return (
		<nav aria-label='breadcrumb'>
			<ol className='flex list-none p-0 m-0'>
				{items.map((item, index) => (
					<li key={index} className='flex items-center'>
						{item.link ? (
							<Link to={item.link} className='text-primary underline'>
								{item.label}
							</Link>
						) : (
							<span className='text-gray-500'>{item.label}</span>
						)}
						{index < items.length - 1 && (
							<span className='mx-2 text-gray-400'>{separator}</span>
						)}
					</li>
				))}
			</ol>
		</nav>
	);
};

export default AtBreadcrumb;
