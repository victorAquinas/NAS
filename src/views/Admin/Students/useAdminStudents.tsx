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
import { TableFilterOptions, TableFilters } from './types';
import { getCalendarGroups } from '../../../api/services';

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
	const [moveToType, setMoveToType] = useState<
		'groups' | 'location' | 'week' | null
	>(null);
	const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(false);
	const [canShowMoveToModal, setCanShowMoveToModal] = useState<boolean>(false);
	const [tableFilterOptions, setTableFilterOptions] =
		useState<TableFilterOptions>({
			groups: [],
			status: [
				{ label: 'All', value: '' },
				{ label: 'PENDING', value: UserStatus.PENDING },
				{ label: 'ACCEPTED', value: UserStatus.ACCEPTED },
				{ label: 'REJECTED', value: UserStatus.REJECTED },
				{ label: 'REJECT', value: UserStatus.REJECT },
				{ label: 'OPEN', value: UserStatus.OPEN },
			],
		});
	const [selectedUser, setSelectedUser] = useState<User>({
		id: 0,
		name: '',
		email: '',
		group: '',
	});
	const [tableFilter, setTableFilter] = useState<TableFilters>({
		name: '',
		email: '',
		phone: '',
		group: '',
		request_status: null,
	});

	const [location, setLocation] = useState<{
		headquarter_name: string;
		program_name: string;
	}>({
		headquarter_name: '',
		program_name: '',
	});

	const initialFilters = {
		name: '',
		email: '',
		phone: '',
		request_status: null,
		group: '',
	};
	const handleGetStudents = async (
		programSemesterId: string,
		filters: TableFilters | null
	) => {
		try {
			const students = await getStudentsByProgramSemesterId(
				programSemesterId,
				filters || initialFilters
			);
			setStudents(students);
			console.log(students);
		} catch (error) {
			console.error(error);
		}
	};

	const handleGetGroupsFilters = async (programSemesterId: string) => {
		try {
			const groups = await getCalendarGroups(programSemesterId);
			const filterGroups = groups.data.map((group) => ({
				label: group.group_name,
				value: String(group.group_id),
			}));
			setLocation({
				program_name: groups.data[0].program_name,
				headquarter_name: groups.data[0].headquarter,
			});
			updateTableFilterOptions({
				// groups: filterGroups,
				groups: [{ label: 'All', value: '' }, ...filterGroups],
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handleAcceptStudent = async (email: string, groupId: number) => {
		const idLoading = toast.loading('Accepting student');
		try {
			await acceptUserInGroup(email, groupId);

			if (programSemesterId) {
				handleGetStudents(programSemesterId, tableFilter);
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
				handleGetStudents(programSemesterId, tableFilter);
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

	const updateTableFilter = (updatedFields: Partial<TableFilters>) => {
		setTableFilter((prevUser) => ({
			...prevUser,
			...updatedFields,
		}));
	};

	const updateTableFilterOptions = (
		updatedFields: Partial<TableFilterOptions>
	) => {
		setTableFilterOptions((prevUser) => ({
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
				handleGetStudents(programSemesterId, tableFilter);
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
			handleGetStudents(programSemesterId, tableFilter);
			// handleGetGroups(programSemesterId);
			handleGetGroupsFilters(programSemesterId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [programSemesterId]);

	useEffect(() => {
		if (tableFilter && programSemesterId) {
			handleGetStudents(programSemesterId, tableFilter);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		tableFilter.email,
		tableFilter.group,
		tableFilter.request_status,
		programSemesterId,
	]);

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
		updateTableFilter,
		tableFilter,
		handleGetStudents,
		tableFilterOptions,
		location,
	};
};
