import { createSlice } from '@reduxjs/toolkit';
import { Api } from '@/AdminService/Api';

export const toDoTasksSlice = createSlice({
    name: 'toDoTasks',
    initialState: {
        toDoTasks: null,
        loadingToDo: false,
        errorToDo: null,
    },
    reducers: {
        setToDoTasks: (state, action) => {
            state.toDoTasks = action.payload;
        },
        addToDoTask: (state, action) => {
            state.toDoTasks.push(action.payload);
        },
        updateToDoTask: (state, action) => {
            const index = state.toDoTasks.findIndex(toDoTask => toDoTask.id === action.payload.id);
            if (index !== -1) {
                state.toDoTasks[index] = action.payload;
            }
        },
        removeToDoTask: (state, action) => {
            state.toDoTasks = state.toDoTasks.filter(toDoTask => toDoTask.id !== action.payload.id);
        },
        setLoading: (state, action) => {
            state.loadingToDo = action.payload;
        },
        setError: (state, action) => {
            state.errorToDo = action.payload;
        },
    },
});

export const fetchToDoTasks = () => async dispatch => {
    dispatch(setLoading(true));
    try {
        const response = await Api.toDoTasksApi.getToDoTasks();
        dispatch(setToDoTasks(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    } finally {
        dispatch(setLoading(false));
    }
};

export const createToDoTask = (toDoTaskData) => async dispatch => {
    try {
        const response = await Api.toDoTasksApi.createToDoTask(toDoTaskData);
        dispatch(addToDoTask(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const editToDoTask = (toDoTaskId, toDoTaskData) => async dispatch => {
    try {
        const response = await Api.toDoTasksApi.editToDoTask(toDoTaskId, toDoTaskData);
        dispatch(updateToDoTask(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const deleteToDoTask = (toDoTaskId) => async dispatch => {
    try {
        await Api.toDoTasksApi.deleteToDoTask(toDoTaskId);
        dispatch(removeToDoTask({ id: toDoTaskId }));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const switchState = (toDoTaskId ) => async (dispatch) => {
    try {
        const response = await Api.toDoTasksApi.switchToDoTask(toDoTaskId);
        dispatch(updateToDoTask(response.data));
    } catch (error) {
        dispatch(setError(error.message));
    }
};

export const {
    setToDoTasks,
    addToDoTask,
    updateToDoTask,
    removeToDoTask,
    setLoading,
    setError,
} = toDoTasksSlice.actions;
export const toDoTasksSelector = (state) => state.toDoTasks;
export default toDoTasksSlice.reducer;
