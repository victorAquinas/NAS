import { useEffect, useState } from 'react';
import {
	acceptUserInGroup,
	getGroups,
	getStudentsByProgramSemesterId,
	rejectUserInGroup,
	relocateStudent,
} from '../../../api/adminServices';
import { useParams } from 'react-router-dom';
import {
	ResponseGroups,
	SelectOptionDescription,
	StudentsResponse,
	UserStatus,
} from '../../../api/types';
import { AtBadge, BadgeVariantType } from '../../../components/AtBadge';
import { toast } from 'react-toastify';

interface User {
	id: number;
	name: string;
	email: string;
	group: string;
}

export const useAdminStudents = () => {
	const { programSemesterId, semesterId, locationId } = useParams();
	const [students, setStudents] = useState<StudentsResponse[]>([]);
	const [groups, setGroups] = useState<ResponseGroups[]>([]);
	const [selectedMoveTo, setSelectedMoveTo] =
		useState<SelectOptionDescription | null>(null);
	const [moveToType, setMoveToType] = useState<'groups' | 'location' | null>(
		null
	);
	const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(false);
	const [canShowMoveToModal, setCanShowMoveToModal] = useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<User>({
		id: 0,
		name: '',
		email: '',
		group: '',
	});

	const handleGetStudents = async (programSemesterId: string) => {
		try {
			const students = await getStudentsByProgramSemesterId(programSemesterId);
			setStudents(students);
			console.log(students);
		} catch (error) {
			console.error(error);
		}
	};

	const handleAcceptStudent = async (email: string, groupId: number) => {
		const idLoading = toast.loading('Accepting student');
		try {
			await acceptUserInGroup(email, groupId);

			if (programSemesterId) {
				handleGetStudents(programSemesterId);
			}

			toast.update(idLoading, {
				render: 'Student accepted',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			console.log('Llegue aqui');
		} catch (error) {
			console.error(error);
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 500,
			});
		}
	};

	const handleRejecttStudent = async (email: string, groupId: number) => {
		const idLoading = toast.loading('Rejecting student');
		try {
			await rejectUserInGroup(email, groupId);

			if (programSemesterId) {
				handleGetStudents(programSemesterId);
			}

			toast.update(idLoading, {
				render: 'Student was rejected.',
				type: 'success',
				isLoading: false,
				autoClose: 500,
			});
			console.log('Llegue aqui');
		} catch (error) {
			console.error(error);
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 500,
			});
		}
	};

	const getBadgeVariant = (status: UserStatus): BadgeVariantType => {
		const statusMap: Record<UserStatus, string> = {
			ACCEPTED: 'primary',
			OPEN: 'info',
			PENDING: 'warning',
			REJECTED: 'danger',
			REJECT: 'danger',
		};

		return (statusMap[status] as BadgeVariantType) || 'info'; // Default variant if status doesn't match
	};

	const AtBadgeDynamic = (status: UserStatus) => {
		// const requestedStatus = student.request.requested_group_status.toUpperCase() as UserStatus;

		return <AtBadge label={status} variant={getBadgeVariant(status)} />;
	};

	const handleGetGroups = async (
		programSemesterId: string,
		type: 'groups' | 'location'
	) => {
		setIsLoadingGroups(true);
		try {
			const groups = await getGroups(programSemesterId);

			if (type === 'groups') {
				setGroups(groups?.local_places);
				setIsLoadingGroups(false);
				return;
			}

			setGroups(groups?.foreign_places);
			setIsLoadingGroups(false);
		} catch (error) {
			setIsLoadingGroups(false);
			console.error(error);
		}
	};

	const handleSelectChange = async (
		moveType: 'groups' | 'location',
		programSemesterId: string
	) => {
		try {
			setSelectedMoveTo(null);
			if (moveType === 'groups') {
				handleGetGroups(programSemesterId, 'groups');
				setMoveToType('groups');
				return;
			}
			setMoveToType('location');
			handleGetGroups(programSemesterId, 'location');
		} catch (error) {
			console.error(error);
			setIsLoadingGroups(false);
		}
	};

	const updateSelectedUser = (updatedFields: Partial<User>) => {
		setSelectedUser((prevUser) => ({
			...prevUser,
			...updatedFields,
		}));
	};

	const handleShowMoveToModal = (updateFields: Partial<User>) => {
		setCanShowMoveToModal(true);
		updateSelectedUser(updateFields);
	};

	const handleCloseMoveToModal = () => {
		setCanShowMoveToModal(false);
		updateSelectedUser({
			id: 0,
			name: '',
			email: '',
			group: '',
		});
		setMoveToType(null);
		setSelectedMoveTo(null);
	};

	const handleSelectMoveTo = (moveTo: SelectOptionDescription) => {
		setSelectedMoveTo(moveTo);
	};

	const handleRelocateStudent = async (
		studentId: number,
		newGroupId: number
	) => {
		const idLoading = toast.loading('Transfering student');
		try {
			await relocateStudent(studentId, newGroupId);
			toast.update(idLoading, {
				render: 'Student transfered',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			handleCloseMoveToModal();

			if (programSemesterId) {
				handleGetStudents(programSemesterId);
			}
		} catch (error) {
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
			console.error(error);
		}
	};

	useEffect(() => {
		if (programSemesterId) {
			handleGetStudents(programSemesterId);
			// handleGetGroups(programSemesterId);
		}
	}, [programSemesterId]);

	return {
		students,
		AtBadgeDynamic,
		handleAcceptStudent,
		handleRejecttStudent,
		programSemesterId,
		groups,
		handleSelectChange,
		handleSelectMoveTo,
		selectedMoveTo,
		isLoadingGroups,
		moveToType,
		handleShowMoveToModal,
		selectedUser,
		canShowMoveToModal,
		handleCloseMoveToModal,
		handleRelocateStudent,
		semesterId,
		locationId,
	};
};
