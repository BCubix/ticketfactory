import axios from '@Services/api/config';

const TO_DO_TASKS_BASE_PATH = '/toDoTask';

const toDoTasksApi = {
    getToDoTasks: async () => {
        const result = await axios.get(TO_DO_TASKS_BASE_PATH);
        return result;
    },
    
    createToDoTask: async (toDoTaskData) => {
        const result = await axios.post(TO_DO_TASKS_BASE_PATH, toDoTaskData);
        return result;
    },

    editToDoTask: async (toDoTaskId, toDoTaskData) => {
        const result = await axios.post(`${TO_DO_TASKS_BASE_PATH}/${toDoTaskId}`, toDoTaskData);
        return result;
    },

    deleteToDoTask: async (toDoTaskId) => {
        const result = await axios.delete(`${TO_DO_TASKS_BASE_PATH}/${toDoTaskId}`);
        return result;
    },
};

export default toDoTasksApi;