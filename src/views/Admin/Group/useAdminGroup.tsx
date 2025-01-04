import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCalendarGroups } from '../../../api/services';
import {
	AvailablePlace,
	Group,
	GroupDetails,
	Instructor,
	Place,
	updateGroupType,
} from '../../../api/types';
import {
	createDayInWeek,
	createGroup,
	createWeek,
	deleteDayInWeek,
	deleteWeek,
	getSources,
	updateGroup,
} from '../../../api/adminServices';
import { useForm } from 'react-hook-form';
import { newGroupSchema, NewGroupSchema } from './modalAddGroupValidation';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

export const useAdminGroup = () => {
	const { programSemesterId } = useParams();
	const [isAddGroupModalOpen, setIsAddGroupModalOpen] =
		useState<boolean>(false);
	const [coordinators, setCoordinators] = useState<Instructor[]>([]);
	const [places, setPlaces] = useState<Place[]>([]);
	const [inSitePlaces, setInSitePlaces] = useState<AvailablePlace[]>([]);
	const [offSitesPlaces, setOffSitePlaces] = useState<AvailablePlace[]>([]);
	const [groups, setGroups] = useState<Group[]>([]);
	const [groupIdToDelete, setGroupIdToDelete] = useState<number>(-99);
	const [showDeleteGroupModal, setShowDeleteGroupModal] =
		useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isCreatingGroup, setIsCreatingGroup] = useState<boolean>(false);
	const [isDeletingGroup, setIsDeletingGroup] = useState<boolean>(false);
	const [hasActiveGroup, seHasActiveGroups] = useState<boolean>(false);

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
			console.log('Groups', groups);
			const hasActiveGroups =
				groups?.data.some((group) => group.is_active) || false;
			console.log('HasActiveGroups', hasActiveGroups);
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
			const currentPlaces = sources?.places?.filter(
				(place) =>
					place.program_semester_id === parseInt(programSemesterId ?? '0')
			);
			const InSitePlaces = currentPlaces[0]?.available_places?.filter(
				(place) => place.type.name === 'In-Site'
			);
			const OffSitePlaces = currentPlaces[0]?.available_places?.filter(
				(place) => place.type.name === 'Off-Site'
			);

			setCoordinators(sources.instructors);
			setPlaces(currentPlaces);

			setInSitePlaces(InSitePlaces ?? []);
			setOffSitePlaces(OffSitePlaces ?? []);
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
			await getCourseGroups();
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
		setIsDeletingGroup(true);
		try {
			await updateGroup(id, 'is_active', false, 'group');
			await getCourseGroups();
			await getGroupSources();
			setIsDeletingGroup(false);
			handleCloseDeleteGroupModal();
		} catch (error) {
			console.error(error);
			setIsDeletingGroup(false);
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

	const onSubmit = (data: NewGroupSchema) => {
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
		inSitePlaces,
		offSitesPlaces,
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
	};
};
