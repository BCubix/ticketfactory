import React, { useState } from 'react';
import { Component } from '@/AdminService/Component';
import { useDispatch } from 'react-redux';
import { editToDoTask, deleteToDoTask, switchState} from '@Apps/Home/ToDoList/redux/toDoTasksSlice';
import { Api } from '@/AdminService/Api';
import { Button, Box, IconButton, TextField, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Checkbox, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

export const ToDoList = ({toDoTasks, loading, error}) => {
    const dispatch = useDispatch();

    const [newTask, setNewTask] = useState('');
    const [editingToDoTaskId, setEditingToDoTaskId] = useState(null);
    const [editedMessage, setEditedMessage] = useState('');

    const handleAddTask = async () => {
        if (newTask.trim() === '') {
            alert('Task cannot be empty!');
            return;
        }
        const result = await Api.toDoTasksApi.createToDoTask({ message: newTask });
        
        setNewTask('');
    };

    const handleEditToDoTask = (id, message) => {
        setEditingToDoTaskId(id);
        setEditedMessage(message);
    };

    const handleSaveEdit = () => {
        if (editedMessage.trim()) {
            dispatch(editToDoTask(editingToDoTaskId, { id: editingToDoTaskId, message: editedMessage }));
            setEditingToDoTaskId(null);
            setEditedMessage('');
        }
    };

    const handleDeleteTask = (id) => {
        dispatch(deleteToDoTask(id));
    };

    const handleToggleFinished = (id) => {
        dispatch(switchState(id));
    };

    const handleKeyPress = (e, handler) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handler();
        }
    };
    
    return (
        <Component.CmtCard
            sx={{
                height: '65vh',
                maxWidth: '800px',
                display: 'flex',
                flexDirection: 'column',
                margin: 'auto',
            }}
        >
            <Component.CmtCardHeader title="To-Do List" />
            {toDoTasks.length <= 3 ?
                <Box>
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', padding: "10px" }}>
                        Ceci est un espace où vous et votre équipe pouvez ajouter des tâches à accomplir.
                    </Typography>
                    <Divider variant="middle" />
                </Box>
                : <></>}
            <Box flexGrow={1} overflow="auto" sx={{ height: 'calc(100% - 100px)', overflowY: 'auto', padding: '10px' }}>
                <List sx={{ height: '100%' }}>
                    {toDoTasks.map((task, index) => (
                        <React.Fragment key={task.id}>
                            <ListItem
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {editingToDoTaskId === task.id ? (
                                    <>
                                        <TextField
                                            value={editedMessage}
                                            onChange={(e) => setEditedMessage(e.target.value)}
                                            label="Edit Note"
                                            fullWidth
                                            onKeyPress={(e) => handleKeyPress(e, handleSaveEdit)}
                                        />
                                        <IconButton
                                            onClick={handleSaveEdit}
                                            sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <ListItemText
                                            primary={task.message}
                                            sx={{
                                                wordWrap: 'break-word',
                                                whiteSpace: 'normal',
                                                maxWidth: 'calc(100% - 100px)',
                                                overflow: 'hidden',
                                                textDecoration: task.finished ? 'line-through' : 'none',
                                            }}
                                        />
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                checked={task.finished}
                                                onChange={() => handleToggleFinished(task.id)}
                                            />
                                            <IconButton
                                                edge="end"
                                                onClick={() => handleEditToDoTask(task.id, task.message)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                sx={{ color: 'rgba(192, 57, 43, 0.8)' }}
                                                onClick={() => handleDeleteTask(task.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </>
                                )}
                            </ListItem>
                            {index < toDoTasks.length - 1 && <Divider variant="middle" component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" sx={{ padding: '15px', marginTop: '10px' }}>
                <TextField
                    variant="outlined"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    label="Ajouter une tache à faire"
                    fullWidth
                    onKeyPress={(e) => handleKeyPress(e, handleAddTask)}
                />
            </Box>
            <Box display="flex" justifyContent="center" sx={{ paddingBottom: 4 }}>
                <Button variant="contained" onClick={handleAddTask} sx={{ padding: "5px" }}>
                    Ajouter
                </Button>
            </Box>
        </Component.CmtCard>
    );
};
