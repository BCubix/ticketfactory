import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux'
import { fetchToDoTasks, createToDoTask, deleteToDoTask, editToDoTask } from '@Apps/Home/ToDoList/redux/toDoTasksSlice';

import { Api } from '@/AdminService/Api';

import { Button, IconButton, TextField, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export const ToDoList = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchToDoTasks());
    }, [dispatch]);
    
    const toDoTasks = useSelector(state => state?.toDoTasks?.toDoTasks || []);
    const loading = useSelector(state => state?.toDoTasks?.loading);
    const error = useSelector(state => state?.toDoTasks?.error);

    const [newTask, setNewTask] = useState('');
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTask, setEditedTask] = useState('');

    const handleAddTask = async () => {
        if (newTask.trim() === '') {
            alert('Task cannot be empty!');
            return;
        }
        const result = await Api.toDoTasksApi.createToDoTask(newTask);
        
        // ensure synchronization
        dispatch(fetchToDoTasks());
        
        setNewTask('');
    };

    const handleDeleteTask = (id) => {
        dispatch(deleteToDoTask(id));
    };

    const handleEditTask = (id, task) => {
        setEditingTaskId(id);
        setEditedTask(task);
    };

    const handleSaveEdit = () => {
        if (editedTask.trim()) {
            dispatch(editToDoTask(editingTaskId, { task: editedTask }));
            setEditingTaskId(null);
            setEditedTask('');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>To-Do List</h2>
            <List>
                {toDoTasks.map(task => (
                    <ListItem key={task.id}>
                        {editingTaskId === task.id ? (
                            <>
                                <TextField
                                    value={editedTask}
                                    onChange={(e) => setEditedTask(e.target.value)}
                                    label="Edit Task"
                                    fullWidth
                                />
                                <Button onClick={handleSaveEdit}>Save</Button>
                            </>
                        ) : (
                            <>
                                <ListItemText primary={task.message} />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => handleEditTask(task.id, task.message)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton edge="end" onClick={() => handleDeleteTask(task.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </>
                        )}
                    </ListItem>
                ))}
            </List>
            <div>
                <TextField
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    label="Add a new task"
                    fullWidth
                />
                <Button onClick={handleAddTask}>Add Task</Button>
            </div>
        </div>
    );
};

export default ToDoList;
