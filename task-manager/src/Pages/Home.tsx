import React, { useState } from 'react';
import { SelectChangeEvent, Card, CardContent, Box, Typography, Button } from '@mui/material';
import Navbar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import Dialogs from '../Components/Dialog';
import { AddTaskButton, CardContainer } from '../Components/styles';


// Define types for tasks
type Task = {
    id: string;
    content: string;
};

type TaskColumns = {
    [key: string]: Task[];
};

// Initial data
const initialData: TaskColumns = {
    'to-do': [
        { id: 'task-1', content: 'Task 1' },
        { id: 'task-2', content: 'Task 2' },
    ],
    'in-progress': [
        { id: 'task-3', content: 'Task 3' },
    ],
    'done': [
        { id: 'task-4', content: 'Task 4' },
    ],
};

const Home: React.FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [sortOption, setSortOption] = useState('recent');
    const [tasks, setTasks] = useState<TaskColumns>(initialData);

    const navigate = useNavigate();

    const handleLogoutClick = () => {
        navigate('/');
    };

    const handleAddTaskClick = () => {
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleSortChange = (event: SelectChangeEvent<string>) => {
        setSortOption(event.target.value);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Task) => {
        e.dataTransfer.setData('text/plain', item.id);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, column: string) => {
        const itemId = e.dataTransfer.getData('text/plain');
        if (!itemId) return;

        const draggedItem = Object.values(tasks).flat().find(task => task.id === itemId);
        if (!draggedItem) return;

        const updatedTasks = { ...tasks };
        Object.keys(updatedTasks).forEach(key => {
            updatedTasks[key] = updatedTasks[key].filter(task => task.id !== itemId);
        });
        updatedTasks[column].push(draggedItem);
        setTasks(updatedTasks);
    };

    const handleDelete = (id: string) => {
        const updatedTasks = { ...tasks };
        Object.keys(updatedTasks).forEach(key => {
            updatedTasks[key] = updatedTasks[key].filter(task => task.id !== id);
        });
        setTasks(updatedTasks);
    };

    const handleEdit = (id: string) => {
        // Add your edit logic here
    };

    const handleViewDetails = (id: string) => {
        // Add your view details logic here
    };

    return (
        <div>
            <Navbar
                buttons={[
                    {
                        label: 'Logout',
                        onClick: handleLogoutClick,
                        color: 'red',
                    },
                ]}
            />
            <AddTaskButton onClick={handleAddTaskClick}>Add Task</AddTaskButton>

            <Dialogs open={dialogOpen} onClose={handleCloseDialog} onSave={handleCloseDialog} />

            <CardContainer>
                <Card>
                    <CardContent>
                        <Box display="flex" flexDirection="column" sx={{ width: '100%', marginLeft: '5px' }}>
                            <Box display="flex" flexWrap="wrap" alignItems="center" sx={{ marginBottom: '16px' }}>
                                <label style={{ flex: 1, marginRight: '16px' }}>
                                    Search: <input name="myInput" placeholder='Search...' style={{ width: '30%' }} />
                                </label>
                                
                                <label>
                                    Sort By:
                                    <select name="selectedsort" value={sortOption}  style={{ marginLeft: '7px' }}>
                                        <option value="recent">Recent</option>
                                    </select>
                                </label>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </CardContainer>

            <Box display="flex" justifyContent="space-between" boxShadow={3} sx={{ padding: '10px' }}>
                {Object.keys(tasks).map((column) => (
                    <Box
                        key={column}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, column)}
                        sx={{
                            flex: 1,
                            margin: '0 10px', 
                            minWidth: '200px', 
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #ccc', 
                            padding: '10px',
                        }}
                    >
                        <Box
                            sx={{
                                backgroundColor: '#0080ff',
                                color: 'white',
                                padding: '10px',
                                marginBottom: '10px',
                                borderRadius: '4px',
                            }}
                        >
                            <Typography variant="h6">{column.charAt(0).toUpperCase() + column.slice(1)}</Typography>
                        </Box>
                        {tasks[column].map((task) => (
                            <Card
                                key={task.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, task)}
                                sx={{ marginBottom: '10px', cursor: 'move', position: 'relative' ,backgroundColor:'#99ccff',height:'150px'}}
                            >
                                <CardContent>
                                    <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
                                        <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
                                            <Typography variant="body1" sx={{ flex: 1 }}>{task.content}</Typography>
                                          
                                        </Box>
                                        <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
                                            <Typography variant="body1" sx={{ flex: 1 }}>{task.content}</Typography>
                                            
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="flex-end"
                                            sx={{ marginTop: '10px', position: 'absolute', bottom: '10px', right: '10px' }}
                                        >
                                            <Button
                                                onClick={() => handleDelete(task.id)}
                                                size="small"
                                                variant="contained"
                                                sx={{ backgroundColor: 'red', color: 'white', marginRight: '5px' }}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                onClick={() => handleEdit(task.id)}
                                                size="small"
                                                variant="contained"
                                                sx={{ backgroundColor: '#3399ff', marginRight: '5px' }}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                onClick={() => handleViewDetails(task.id)}
                                                size="small"
                                                variant="contained"
                                                sx={{ backgroundColor: '#0080ff', color: 'white' }}
                                            >
                                                View Details
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                ))}
            </Box>
        </div>
    );
};

export default Home;
