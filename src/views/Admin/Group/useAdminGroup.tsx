import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCalendarGroups } from '../../../api/services';
import {
	Group,
	GroupDetails,
	Instructor,
	Place,
	PracticaPlaceTypeId,
	SelectOptionDescription,
	updateGroupType,
} from '../../../api/types';
import {
	createDayInWeek,
	createGroup,
	createWeek,
	deleteDayInWeek,
	deleteWeek,
	getAdminSemesters,
	getPlaces,
	getSources,
	updateGroup,
	updateProgramSemester,
	// createGroupPlace,
} from '../../../api/adminServices';
import { useForm } from 'react-hook-form';
import { newGroupSchema, NewGroupSchema } from './modalAddGroupValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export const useAdminGroup = () => {
	const { programSemesterId, locationId, semesterId } = useParams();
	const [isAddGroupModalOpen, setIsAddGroupModalOpen] =
		useState<boolean>(false);
	const [coordinators, setCoordinators] = useState<Instructor[]>([]);
	const [places, setPlaces] = useState<Place[]>([]);
	const [groups, setGroups] = useState<Group[]>([]);
	const [groupIdToDelete, setGroupIdToDelete] = useState<number>(-99);
	const [showDeleteGroupModal, setShowDeleteGroupModal] =
		useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
	const [isDeletingGroup, setIsDeletingGroup] = useState<boolean>(false);
	const [hasActiveGroup, seHasActiveGroups] = useState<boolean>(false);
	const [maxEnrollmentDate, setMaxEnrollmentDate] = useState<string | null>(
		null
	);
	const [isPublished, setIsPublished] = useState<boolean>(false);

	// Estas son la que son para el formulario de creacion de grupo, son todas las ubicaciones
	const [inSiteOptions, setInSiteOptions] = useState<SelectOptionDescription[]>(
		[]
	);
	const [offsiteOptions, setOffsiteOptions] = useState<
		SelectOptionDescription[]
	>([]);
	const [location, setLocation] = useState<{
		headquarter_name: string;
		course_name: string;
	}>({
		headquarter_name: '',
		course_name: '',
	});
	const [showReleaseModal, setShowReleaseModal] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		control,
		reset,
	} = useForm<NewGroupSchema>({
		resolver: zodResolver(newGroupSchema),
		defaultValues: {
			group_name: '',
			start_date: '',
			end_date: '',
			default_start_time: '',
			default_end_time: '',
			max_students: undefined,
			default_instructor_id: undefined,
			default_offsite_practice_place_id: undefined,
			verity_group_id: '',
			offsite_num_weeks_for_generate: undefined,
			default_insite_practice_place_id: undefined,
			insite_num_weeks_for_generate: undefined,
			in_days: [],
		},
	});

	const handleOpenAddGroupModal = () => {
		reset();
		setIsAddGroupModalOpen(true);
	};

	const handleShowDeleteGroupModal = (groupId: number) => {
		setShowDeleteGroupModal(true);
		setGroupIdToDelete(groupId);
	};

	const handleCloseDeleteGroupModal = () => {
		setShowDeleteGroupModal(false);
		setGroupIdToDelete(-99);
	};

	const handleCloseAddGroupModal = () => {
		setIsAddGroupModalOpen(false);
	};

	const getCourseGroups = async () => {
		try {
			const groups = await getCalendarGroups(programSemesterId ?? '');
			setMaxEnrollmentDate(groups?.max_enrollment_date);
			setIsPublished(groups?.let_enrollment);
			const hasActiveGroups =
				groups?.data.some((group) => group.is_active) || false;

			if (groups?.data.length > 0) {
				setLocation({
					headquarter_name: groups?.data[0]?.headquarter,
					course_name: groups?.data[0]?.program_name,
				});
			} else {
				const semesters = await getAdminSemesters(semesterId ?? '');
				const selectedCourse = semesters[0]?.program_semesters.filter(
					(course) => String(course.id) === programSemesterId
				);

				setLocation({
					headquarter_name: semesters[0]?.headquarter?.name,
					course_name: selectedCourse[0].program.name,
				});
			}

			seHasActiveGroups(hasActiveGroups);
			setGroups(groups.data);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
		}
	};

	const getGroupSources = async () => {
		try {
			const sources = await getSources();
			const places = await getPlaces(import.meta.env.VITE_INSTITUTION_ID);
			const insitePlaces = places?.data
				?.filter((place) => place.type_id === PracticaPlaceTypeId.IN_SITE)
				.map((place) => ({
					label: place.name,
					value: place.id,
					description: place.address,
				}));
			const offsitePlaces = places?.data
				?.filter((place) => place.type_id === PracticaPlaceTypeId.OFF_SITE)
				.map((place) => ({
					label: place.name,
					value: place.id,
					description: place.address,
				}));

			const currentPlaces = sources?.places?.filter(
				(place) =>
					place.program_semester_id === parseInt(programSemesterId ?? '0')
			);

			const activeCoordinators = sources?.instructors?.filter(
				(coordinator) => coordinator?.is_active
			);

			setCoordinators(activeCoordinators);
			setPlaces(currentPlaces);

			// MODAL NUEVO GRUPO
			setInSiteOptions(insitePlaces ?? []);
			setOffsiteOptions(offsitePlaces ?? []);
		} catch (error) {
			console.error(error);
		}
	};

	const handleUpdateGroup = async (
		id: number,
		field: string,
		value: unknown,
		level: updateGroupType
	) => {
		try {
			await updateGroup(id, field, value, level);
			// await getCourseGroups();
		} catch (error) {
			console.error(error);
		}
	};

	const handleCreateDayInWeek = async (week_schedule_id: number) => {
		try {
			await createDayInWeek(week_schedule_id);
			await getCourseGroups();
			await getGroupSources();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteDayInWeek = async (
		week_schedule_id: number,
		day_id: number
	) => {
		try {
			await deleteDayInWeek(week_schedule_id, day_id);
			await getCourseGroups();
			await getGroupSources();
		} catch (error) {
			console.error(error);
		}
	};

	const handleCreateWeek = async (group_id: number, is_insite: boolean) => {
		try {
			await createWeek(group_id, is_insite);
			await getCourseGroups();
			await getGroupSources();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDeleteWeek = async (group_id: number, week_id: number) => {
		try {
			await deleteWeek(group_id, week_id);
			await getCourseGroups();
			await getGroupSources();
		} catch (error) {
			console.error(error);
		}
	};

	const handleDesactivateGroup = async (id: number) => {
		const idLoading = toast.loading('Deleting group');
		setIsDeletingGroup(true);
		try {
			await updateGroup(id, 'is_active', false, 'group');
			await getCourseGroups();
			await getGroupSources();
			setIsDeletingGroup(false);
			handleCloseDeleteGroupModal();
			toast.update(idLoading, {
				render: 'Group delete',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
		} catch (error) {
			const axiosError = error as AxiosError; // Assert the type
			if (axiosError.response?.status === 409) {
				toast.update(idLoading, {
					render:
						'This group has students assigned. Please reassign the students to another group before deleting this group.',
					type: 'error',
					isLoading: false,
					autoClose: 3000,
				});
				console.error(error);
				setIsDeletingGroup(false);
				return;
			}
			console.error(error);
			setIsDeletingGroup(false);
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		}
	};

	const handleCreateGroup = async (data: GroupDetails) => {
		const idLoading = toast.loading('Creating group...');
		setIsCreatingGroup(true);
		try {
			const allData = {
				...data,
				program_semester_id: parseInt(programSemesterId ?? '0'),
			};
			await createGroup(allData);
			await getCourseGroups();
			await getGroupSources();
			toast.update(idLoading, {
				render: 'Group created',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			setIsCreatingGroup(false);
			reset();
			handleCloseAddGroupModal();
		} catch (error) {
			console.error(error);
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
			setIsCreatingGroup(false);
		}
	};

	const onSubmit = async (data: NewGroupSchema) => {
		const cleanData = {
			...data,
			default_instructor_id: data.default_instructor_id.value,
			default_offsite_practice_place_id:
				data.default_offsite_practice_place_id.value,
			default_insite_practice_place_id:
				data.default_insite_practice_place_id.value,
		};

		handleCreateGroup(cleanData);
	};

	const handlePublishCourse = async (
		programSemesterId: string,
		isPublished: boolean
	) => {
		const idLoading = toast.loading('Publishing Course');
		try {
			await updateProgramSemester(programSemesterId, undefined, !isPublished);
			toast.update(idLoading, {
				render: 'Course published',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			setShowReleaseModal(false);
			getCourseGroups();
		} catch (error) {
			console.error(error);
			toast.error('Error');
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		}
	};

	const handleUpdateMaxEnrollmentDate = async (
		programSemesterId: string,
		enrollmentDate: string,
		isPublished: boolean
	) => {
		const idLoading = toast.loading('Updating enrollment date');
		try {
			await updateProgramSemester(
				programSemesterId,
				enrollmentDate,
				isPublished
			);
			toast.update(idLoading, {
				render: 'Enrollment date updated',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			getCourseGroups();
		} catch (error) {
			console.error(error);
			toast.error('Error');
			toast.update(idLoading, {
				render: 'Error',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		}
	};
	useEffect(() => {
		setIsLoading(true);
		getCourseGroups().then(() => setIsLoading(false));

		if (programSemesterId) {
			getGroupSources();
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [programSemesterId]);

	return {
		isAddGroupModalOpen,
		handleOpenAddGroupModal,
		handleCloseAddGroupModal,
		groups,
		coordinators,
		places,
		handleUpdateGroup,
		handleCreateDayInWeek,
		handleDeleteDayInWeek,
		handleCreateWeek,
		handleDeleteWeek,
		handleDesactivateGroup,
		onSubmit,
		register,
		handleSubmit,
		setValue,
		control,
		errors,
		groupIdToDelete,
		showDeleteGroupModal,
		handleShowDeleteGroupModal,
		handleCloseDeleteGroupModal,
		isLoading,
		isCreatingGroup,
		isDeletingGroup,
		hasActiveGroup,
		programSemesterId,
		offsiteOptions,
		inSiteOptions,
		locationId,
		semesterId,
		location,
		handlePublishCourse,
		maxEnrollmentDate,
		isPublished,
		handleUpdateMaxEnrollmentDate,
		setShowReleaseModal,
		showReleaseModal,
	};
};
