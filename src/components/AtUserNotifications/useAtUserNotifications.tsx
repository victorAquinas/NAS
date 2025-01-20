import { useEffect, useState, useRef } from 'react';
import { getNotifications } from '../../api/adminServices';
import { Notification } from '../../api/types';
import { getTokenFromCookies } from '../../utils/cookies';
import { decodeToken } from '../../utils/decodeToken';

export const useAtUserNotifications = () => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [programSemesterId, setProgramSemesterId] = useState<number | null>();
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const containerRef = useRef<HTMLDivElement>(null);
	const token = getTokenFromCookies();
	const decodedToken = token ? decodeToken(token) : '';

	const getNotificationType = (
		description: string
	): 'accepted' | 'reject' | 'info' | 'unknown' => {
		const descriptionLower = description.toLowerCase();
		if (descriptionLower.includes('accepted')) {
			return 'accepted';
		} else if (descriptionLower.includes('approve or reject')) {
			return 'info';
		} else if (descriptionLower.includes('reject')) {
			return 'reject';
		} else if (
			descriptionLower.includes('updated') ||
			descriptionLower.includes('status') ||
			descriptionLower.includes('change')
		) {
			return 'info';
		}
		return 'unknown';
	};

	const handleGetNotifications = async (user_email: string) => {
		setIsLoading(true);
		try {
			const notifications = await getNotifications(user_email);
			const sortedNotifications = notifications?.data?.sort(
				(a, b) =>
					new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
			);
			setNotifications(sortedNotifications);
			setProgramSemesterId(notifications.current_semester_id);
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const handleOpenNotifications = () => {
		setIsOpen((prevState) => !prevState);
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (
			containerRef.current &&
			!containerRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen && decodedToken) {
			handleGetNotifications(decodedToken.user_email);
		}
	}, [isOpen]);

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return {
		notifications,
		getNotificationType,
		isOpen,
		setIsOpen,
		handleOpenNotifications,
		containerRef,
		programSemesterId,
		isLoading,
	};
};
