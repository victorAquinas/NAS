import { useEffect, useState } from 'react';
import {
	acceptUserInGroup,
	getGroups,
	getLocations,
	getStudentsByProgramSemesterId,
	rejectUserInGroup,
	relocateStudent,
	relocateStudentInWeek,
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
import {
	ExternalTransferChoice,
	ExternalTransferChoiceEnum,
	MoveWeek,
	MoveWeekOptions,
	TableFilterOptions,
	TableFilters,
} from './types';
import {
	getCalendarGroups,
	getCalendarWeeksByStudentId,
} from '../../../api/services';

interface User {
	id: number;
	name: string;
	email: string;
	group: string;
	group_id: number | null;
}

export const useAdminStudents = () => {
	const { programSemesterId, semesterId, locationId } = useParams();
	const [students, setStudents] = useState<StudentsResponse[]>([]);
	const [groups, setGroups] = useState<ResponseGroups[]>([]);
	// Modal Move
	const [selectedUser, setSelectedUser] = useState<User>({
		id: 0,
		name: '',
		email: '',
		group: '',
		group_id: null,
	});
	const [selectedMoveTo, setSelectedMoveTo] =
		useState<SelectOptionDescription | null>(null);
	const [moveToType, setMoveToType] = useState<'groups' | 'location' | null>(
		null
	);
	const [externalTransferChoice, setExternalTransferChoice] =
		useState<ExternalTransferChoice>(null);
	const [moveWeek, setMoveWeek] = useState<MoveWeek>({
		selected_semester: null,
		selected_course: null,
		selected_origin_week: null,
		selected_destination_week: null,
	});
	const [moveWeekOptions, setMoveWeekOptions] = useState<MoveWeekOptions>({
		semesters: [],
		courses: [],
		originWeeks: [],
		destinationWeeks: [],
	});
	const [canShowMoveToModal, setCanShowMoveToModal] = useState<boolean>(false);
	// End modal Move
	const [isLoadingGroups, setIsLoadingGroups] = useState<boolean>(false);
	// Table
	const [tableFilterOptions, setTableFilterOptions] =
		useState<TableFilterOptions>({
			groups: [],
			status: [
				{ label: 'All', value: '' },
				{ label: 'PENDING', value: UserStatus.PENDING },
				{ label: 'ACCEPTED', value: UserStatus.ACCEPTED },
				{ label: 'REJECT', value: UserStatus.REJECT },
				{ label: 'OPEN', value: UserStatus.OPEN },
			],
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
	const [isImportationModalOpen, setIsImportationModalOpen] =
		useState<boolean>(false);

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

			return groups;
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
		type: 'groups' | 'location',
		groupId?: number | null
	) => {
		setIsLoadingGroups(true);
		try {
			const groups = await getGroups(programSemesterId);
			const filteredGroups = groups.local_places.filter(
				(group) => group.id !== groupId
			);

			if (type === 'groups') {
				setGroups(filteredGroups);
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
		programSemesterId: string,
		groupId?: number | null
	) => {
		try {
			// Clear form on every change
			setSelectedMoveTo(null);
			setMoveWeek({
				selected_semester: null,
				selected_course: null,
				selected_origin_week: null,
				selected_destination_week: null,
			});
			setExternalTransferChoice(null);

			if (moveType === 'groups') {
				handleGetGroups(programSemesterId, 'groups', groupId);
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

	const handleChangeExternalTransferChoice = async (
		externalTransferChoiceValue: ExternalTransferChoice
	) => {
		try {
			setExternalTransferChoice(externalTransferChoiceValue);
			setMoveWeek({
				selected_semester: null,
				selected_course: null,
				selected_origin_week: null,
				selected_destination_week: null,
			});
			setMoveWeekOptions({
				courses: [],
				semesters: [],
				originWeeks: [],
				destinationWeeks: [],
			});
			if (
				externalTransferChoiceValue ===
				ExternalTransferChoiceEnum.TO_ANOTHER_WEEK
			) {
				const locations = await getLocations();
				const allSemesters: SelectOptionDescription[] = locations
					?.flatMap((headquarter) =>
						headquarter?.semesters_in.map((semester) => ({
							...semester,
							headquarterName: headquarter?.headquarter_name, // Add the headquarter name here
						}))
					)
					.map((semester) => ({
						label: semester?.semester_name,
						value: semester?.semester_id,
						description: semester?.headquarterName, // Use the headquarter name here
					}));

				updateMoveWeekOptions({
					semesters: allSemesters,
				});
				console.log('Semesters', allSemesters);
				console.log('location', location);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleChangeSemester = async (semester: SelectOptionDescription) => {
		try {
			updateMoveWeek({
				selected_semester: semester,
				selected_course: null,
				selected_origin_week: null,
				selected_destination_week: null,
			});
			updateMoveWeekOptions({
				courses: [],
				originWeeks: [],
				destinationWeeks: [],
			});
			if (semester) {
				const locations = await getLocations();
				const location = locations[0]?.headquarter_name;

				const allCourses =
					locations
						?.flatMap((headquarter) => headquarter?.semesters_in)
						?.find((semester_el) => semester_el?.semester_id === semester.value)
						?.programs_in?.map((program) => ({
							programId: program.program.id,
							programName: program.program.name,
							programSemesterId: program.program_semester_id,
						}))
						.map((program) => ({
							label: program.programName,
							value: program.programSemesterId,
							description: `${location}`,
						})) || [];

				updateMoveWeekOptions({
					courses: allCourses,
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleChangeCourse = async (
		course: SelectOptionDescription,
		studentId: number
	) => {
		try {
			updateMoveWeek({
				selected_course: course,
				selected_origin_week: null,
				selected_destination_week: null,
			});
			updateMoveWeekOptions({
				originWeeks: [],
				destinationWeeks: [],
			});
			if (course) {
				const userWeek = await getCalendarWeeksByStudentId(studentId);
				const weeks = userWeek.data.weeks.map((week) => ({
					label: `Week ${week.week_number}`,
					value: week.week_id,
					description: `Dates: ${week.week_schedule.dates
						.map((date) => date.date)
						.join(', ')}`, // Combine dates into a string
				}));

				updateMoveWeekOptions({
					originWeeks: weeks,
				});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleChangeOriginWeek = async (
		originWeek: SelectOptionDescription,
		destionation_program_semester_id: string
	) => {
		try {
			updateMoveWeek({
				selected_origin_week: originWeek,
				selected_destination_week: null,
			});
			updateMoveWeekOptions({
				destinationWeeks: [],
			});
			if (originWeek) {
				const groupsInfo = await handleGetGroupsFilters(
					destionation_program_semester_id
				);
				const destinationWeeks = groupsInfo?.data
					.filter(
						(group) =>
							String(group.program_semester_id) ===
							destionation_program_semester_id
					)
					.flatMap((group) => group.weeks)
					.map((week) => ({
						label: `Week ${week.week_number}`,
						value: week.week_id,
						description: `Dates: ${week.week_schedule.dates
							.map((date) => date.date)
							.join(', ')}`,
					}));

				updateMoveWeekOptions({
					destinationWeeks: destinationWeeks,
				});
			}
		} catch (error) {
			console.error(error);
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

	const updateMoveWeek = (updatedFields: Partial<MoveWeek>) => {
		setMoveWeek((prevUser) => ({
			...prevUser,
			...updatedFields,
		}));
	};

	const updateMoveWeekOptions = (updatedFields: Partial<MoveWeekOptions>) => {
		setMoveWeekOptions((prevUser) => ({
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
		setMoveWeek({
			selected_semester: null,
			selected_course: null,
			selected_destination_week: null,
			selected_origin_week: null,
		});
		setMoveWeekOptions({
			semesters: [],
			courses: [],
			destinationWeeks: [],
			originWeeks: [],
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

	const handleRelocateStudentInWeek = async (
		studentId: number,
		originWeekId: number,
		destinationWeekId: number
	) => {
		const idLoading = toast.loading('Transfering student');
		try {
			await relocateStudentInWeek(studentId, originWeekId, destinationWeekId);
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
		moveWeek,
		moveWeekOptions,
		setExternalTransferChoice,
		externalTransferChoice,
		handleChangeExternalTransferChoice,
		handleChangeSemester,
		handleChangeCourse,
		handleChangeOriginWeek,
		updateMoveWeek,
		handleRelocateStudentInWeek,
		setIsImportationModalOpen,
		isImportationModalOpen,
	};
};
