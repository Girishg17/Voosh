import React, { useState } from 'react';
import { SelectChangeEvent, Card, CardContent, Box, Typography, Button } from '@mui/material';
import Navbar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import Dialogs from '../Components/Dialog';
import { AddTaskButton, CardContainer } from '../Components/styles';
import DialogViews from '../Components/DialogView';

// Define types for tasks
type Task = {
  id: string;
  description: string;
};

type TaskColumns = {
  [key: string]: Task[];
};

// Initial data
const initialData: TaskColumns = {
  'TODO': [
    { id: 'task-1', description: 'Task 1' },
    { id: 'task-2', description: 'Task 2' },
  ],
  'IN PROGRESS': [
    { id: 'task-3', description: 'Task 3' },
  ],
  'DONE': [
    { id: 'task-4', description: 'Task 4' },
  ],
};

const Home: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState('recent');
  const [tasks, setTasks] = useState<TaskColumns>(initialData);
  const [dialogData, setDialogData] = useState<{ title: string; description: string } | null>(null);
  const [dialogview, setDialogView] = useState(false);

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleAddTaskClick = () => {
    setDialogData({ title: '', description: '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogData(null);
  };

  const handleCloseDialogView = () => {
    setDialogView(false);
    setDialogData(null);
  };

  const handleSave = (data: { title: string; description: string }) => {

    console.log(data);
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

  const handleViewDetails = (id: string) => {
    const task = Object.values(tasks).flat().find(t => t.id === id);
    if (task) {
      setDialogData({ title: task.id, description: task.description });
      setDialogView(true);
    }
  };

  const handleEdit = (id: string) => {
    const task = Object.values(tasks).flat().find(t => t.id === id);
    if (task) {
      setDialogData({ title: task.id, description: task.description });
      setDialogOpen(true);
    }
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

      <Dialogs
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSave}
        heading={dialogData ? 'Edit Task' : 'Add Task'}
        title={dialogData?.title}
        description={dialogData?.description}
      />

      <DialogViews open={dialogview} heading='Task Details' title={dialogData?.title} description={dialogData?.description} onClose={handleCloseDialogView} />

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
                  <select name="selectedsort" value={sortOption} style={{ marginLeft: '7px' }}>
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
                sx={{ marginBottom: '10px', cursor: 'move', position: 'relative', backgroundColor: '#99ccff', height: '150px' }}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" sx={{ height: '100%' }}>
                    <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ flex: 1 }}>{task.id}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ flex: 1 }}>{task.description}</Typography>
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
