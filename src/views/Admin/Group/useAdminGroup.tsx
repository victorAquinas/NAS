import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import {
	createGroup,
	createDayInWeek,
	createWeek,
	deleteDayInWeek,
	deleteWeek,
	getAdminSemesters,
	getPlaces,
	getSources,
	updateGroup,
	updateProgramSemester,
} from '../../../api/adminServices';

import {
	Group,
	GroupDetails,
	PracticaPlaceTypeId,
	Instructor,
	SelectOptionDescription,
	updateGroupType,
} from '../../../api/types';

import { newGroupSchema, NewGroupSchema } from './modalAddGroupValidation';
import { getCalendarGroups } from '../../../api/services';

// ------------------------------------------
// useAdminGroup Hook
// ------------------------------------------
export const useAdminGroup = () => {
	// ====================================
	// 1. Routing Params
	// ====================================
	const { programSemesterId, locationId, semesterId } = useParams();

	// ====================================
	// 2. Local state
	// ====================================
	const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
	const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
	const [groupIdToDelete, setGroupIdToDelete] = useState<number>(-99);
	const [showReleaseModal, setShowReleaseModal] = useState(false);

	const [groups, setGroups] = useState<Group[]>([]);
	const [coordinators, setCoordinators] = useState<Instructor[]>([]);
	const [places, setPlaces] = useState<SelectOptionDescription[]>([]); // Not always used, but left here if needed
	const [inSiteOptions, setInSiteOptions] = useState<SelectOptionDescription[]>(
		[]
	);
	const [offsiteOptions, setOffsiteOptions] = useState<
		SelectOptionDescription[]
	>([]);

	const [isLoading, setIsLoading] = useState(true);
	const [isCreatingGroup, setIsCreatingGroup] = useState(false);
	const [isDeletingGroup, setIsDeletingGroup] = useState(false);

	// For publishing
	const [maxEnrollmentDate, setMaxEnrollmentDate] = useState<string | null>(
		null
	);
	const [isPublished, setIsPublished] = useState<boolean>(false);

	const [location, setLocation] = useState<{
		headquarter_name: string;
		course_name: string;
	}>({
		headquarter_name: '',
		course_name: '',
	});

	// ====================================
	// 3. Form setup (React Hook Form + Zod)
	// ====================================
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

	// ====================================
	// 4. Derived States (Memoized)
	// ====================================
	const hasActiveGroup = useMemo(() => {
		return groups.some((g) => g.is_active);
	}, [groups]);

	// ====================================
	// 5. Data Fetching (initial + refresh)
	// ====================================
	/**
	 * Fetches groups, sources, places, and adminSemesters concurrently
	 * Sets states accordingly.
	 */
	const getInitialData = async () => {
		setIsLoading(true);
		try {
			if (!programSemesterId) {
				setIsLoading(false);
				return;
			}

			const [groupRes, sources, placesRes, adminSemesters] = await Promise.all([
				getCalendarGroups(programSemesterId),
				getSources(),
				getPlaces(import.meta.env.VITE_INSTITUTION_ID),
				getAdminSemesters(semesterId ?? ''),
			]);

			// 1) Groups info
			setGroups(groupRes.data);
			setMaxEnrollmentDate(groupRes.max_enrollment_date);
			setIsPublished(groupRes.let_enrollment);

			// 2) Possibly set fallback location from adminSemesters
			if (groupRes.data.length > 0) {
				// If we have groups, set location from first
				const firstGroup = groupRes.data[0];
				setLocation({
					headquarter_name: firstGroup.headquarter,
					course_name: firstGroup.program_name,
				});
			} else {
				// Otherwise, we try to read from adminSemesters
				const [firstSemester] = adminSemesters ?? [];
				if (firstSemester) {
					const selectedCourse = firstSemester.program_semesters?.find(
						(course) => String(course.id) === programSemesterId
					);
					setLocation({
						headquarter_name: firstSemester.headquarter?.name ?? '',
						course_name: selectedCourse?.program?.name ?? '',
					});
				}
			}

			// 3) Instructors
			const allInstructors = sources.instructors || [];
			const activeCoordinators = allInstructors.filter((c) => c.is_active);
			setCoordinators(activeCoordinators);

			// 4) Place Options

			const allPlaces = placesRes.data || [];
			const inSite = allPlaces
				.filter((p) => p.type_id === PracticaPlaceTypeId.IN_SITE)
				.map((p) => ({ label: p.name, value: p.id, description: p.address }));
			const offSite = allPlaces
				.filter((p) => p.type_id === PracticaPlaceTypeId.OFF_SITE)
				.map((p) => ({ label: p.name, value: p.id, description: p.address }));
			setInSiteOptions(inSite);
			setOffsiteOptions(offSite);

			const combinedOptions = [...inSite, ...offSite];
			setPlaces(combinedOptions);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Refreshes the group data (and possibly sources) after any mutation
	 */
	const refreshGroups = async () => {
		try {
			const groupRes = await getCalendarGroups(programSemesterId ?? '');
			setGroups(groupRes.data);
			setMaxEnrollmentDate(groupRes.max_enrollment_date);
			setIsPublished(groupRes.let_enrollment);
			// If you need to refresh sources or places, you can do that here as well
			// But that might not be needed after every single group mutation
		} catch (error) {
			console.error(error);
		}
	};

	// ====================================
	// 6. Lifecycle: Load data on mount / changes
	// ====================================
	useEffect(() => {
		getInitialData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [programSemesterId]);

	// ====================================
	// 7. Handlers (Create / Update / Delete etc.)
	// ====================================

	// -- Open/Close modals
	const handleOpenAddGroupModal = () => {
		reset();
		setIsAddGroupModalOpen(true);
	};
	const handleCloseAddGroupModal = () => {
		setIsAddGroupModalOpen(false);
	};
	const handleShowDeleteGroupModal = (groupId: number) => {
		setShowDeleteGroupModal(true);
		setGroupIdToDelete(groupId);
	};
	const handleCloseDeleteGroupModal = () => {
		setShowDeleteGroupModal(false);
		setGroupIdToDelete(-99);
	};

	// -- Create Group
	const handleCreateGroup = async (data: GroupDetails) => {
		const idLoading = toast.loading('Creating group...', { autoClose: 2000 });
		setIsCreatingGroup(true);
		try {
			await createGroup(data);
			toast.update(idLoading, {
				render: 'Group created',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			// Refresh data
			await refreshGroups();
			// Close modal / reset
			reset();
			handleCloseAddGroupModal();
		} catch (error) {
			console.error(error);
			toast.update(idLoading, {
				render: 'Error creating group',
				type: 'error',
				isLoading: false,
				autoClose: 1000,
			});
		} finally {
			setIsCreatingGroup(false);
		}
	};
	// Form submit
	const onSubmit = (data: NewGroupSchema) => {
		const cleanData: GroupDetails = {
			...data,
			default_instructor_id: data.default_instructor_id?.value,
			default_offsite_practice_place_id:
				data.default_offsite_practice_place_id?.value,
			default_insite_practice_place_id:
				data.default_insite_practice_place_id?.value,
			program_semester_id: parseInt(programSemesterId ?? '0', 10),
		};
		handleCreateGroup(cleanData);
	};

	const showToastError = () => {
		toast.error('Error', { autoClose: 1000 });
	};
	// -- Update Group
	const handleUpdateGroup = async (
		id: number,
		field: string,
		value: unknown,
		level: updateGroupType,
		refresh?: boolean
	) => {
		try {
			await updateGroup(id, field, value, level);

			if (refresh) {
				await refreshGroups();
			}
		} catch (error) {
			showToastError();

			console.error(error);
		}
	};

	// -- Create a Day
	const handleCreateDayInWeek = async (week_schedule_id: number) => {
		try {
			await createDayInWeek(week_schedule_id);
			await refreshGroups();
		} catch (error) {
			showToastError();
			console.error(error);
		}
	};

	// -- Delete Day
	const handleDeleteDayInWeek = async (
		week_schedule_id: number,
		day_id: number
	) => {
		try {
			await deleteDayInWeek(week_schedule_id, day_id);

			await refreshGroups();
		} catch (error) {
			showToastError();
			console.error(error);
		}
	};

	// -- Create Week
	const handleCreateWeek = async (group_id: number, is_insite: boolean) => {
		try {
			await createWeek(group_id, is_insite);

			await refreshGroups();
		} catch (error) {
			showToastError();
			console.error(error);
		}
	};

	// -- Delete Week
	const handleDeleteWeek = async (group_id: number, week_id: number) => {
		try {
			await deleteWeek(group_id, week_id);

			await refreshGroups();
		} catch (error) {
			showToastError();

			console.error(error);
		}
	};

	// -- Deactivate Group
	const handleDesactivateGroup = async (id: number) => {
		const idLoading = toast.loading('Deleting group...', { autoClose: 2000 });
		setIsDeletingGroup(true);
		try {
			await updateGroup(id, 'is_active', false, 'group');
			toast.update(idLoading, {
				render: 'Group deleted',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			await refreshGroups();
			handleCloseDeleteGroupModal();
		} catch (error) {
			const axiosError = error as AxiosError;
			if (axiosError.response?.status === 409) {
				toast.update(idLoading, {
					render:
						'This group has students assigned. Reassign them before deleting.',
					type: 'error',
					isLoading: false,
					autoClose: 3000,
				});
			} else {
				toast.update(idLoading, {
					render: 'Error deleting group',
					type: 'error',
					isLoading: false,
					autoClose: 2000,
				});
			}
			console.error(error);
		} finally {
			setIsDeletingGroup(false);
		}
	};

	// -- Publish Course or Update Enrollment Date
	const handlePublishCourse = async (
		programSemesterId: string,
		isPublished: boolean
	) => {
		const idLoading = toast.loading('Publishing Course...', {
			autoClose: 2000,
		});
		try {
			await updateProgramSemester(programSemesterId, undefined, !isPublished);
			toast.update(idLoading, {
				render: 'Course published',
				type: 'success',
				isLoading: false,
				autoClose: 1000,
			});
			setShowReleaseModal(false);
			// Refresh group data (since let_enrollment might have changed)
			refreshGroups();
		} catch (error) {
			console.error(error);
			toast.update(idLoading, {
				render: 'Error publishing course',
				type: 'error',
				isLoading: false,
				autoClose: 2000,
			});
		}
	};

	const handleUpdateMaxEnrollmentDate = async (
		programSemesterId: string,
		enrollmentDate: string,
		isPublished: boolean
	) => {
		try {
			await updateProgramSemester(
				programSemesterId,
				enrollmentDate,
				isPublished
			);

			refreshGroups();
		} catch (error) {
			console.error(error);
			showToastError();
		}
	};

	return {
		// UI States
		isAddGroupModalOpen,
		showDeleteGroupModal,
		groupIdToDelete,
		showReleaseModal,

		// Data
		groups,
		coordinators,
		places, // If you want to use them directly
		inSiteOptions,
		offsiteOptions,
		location,
		hasActiveGroup,
		maxEnrollmentDate,
		isPublished,

		// Loading
		isLoading,
		isCreatingGroup,
		isDeletingGroup,

		// Param references
		programSemesterId,
		locationId,
		semesterId,

		// Handlers
		handleOpenAddGroupModal,
		handleCloseAddGroupModal,
		handleShowDeleteGroupModal,
		handleCloseDeleteGroupModal,
		handleDesactivateGroup,
		handleCreateDayInWeek,
		handleDeleteDayInWeek,
		handleCreateWeek,
		handleDeleteWeek,
		handleUpdateGroup,
		handlePublishCourse,
		handleUpdateMaxEnrollmentDate,
		setShowReleaseModal,

		// Form
		register,
		handleSubmit,
		setValue,
		control,
		errors,
		onSubmit,
		handleCreateGroup,
	};
};
