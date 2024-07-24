import React, { useEffect, useState } from 'react';
import { SelectChangeEvent, Card, CardContent, Box, Typography, Button } from '@mui/material';
import Navbar from '../Components/NavBar';
import { useNavigate } from 'react-router-dom';
import Dialogs from '../Components/Dialog';
import { AddTaskButton, CardContainer } from '../Components/styles';
import DialogViews from '../Components/DialogView';
import { deleteTask, fetchTasks, puttsask, saveTask, updateTasks } from '../utils/api';
import Dialogedit from '../Components/Dialogedit';


// Define types for tasks
type Task = {
  id: string;
  title: string;
  description: string;
};

type TaskColumns = {
  [key: string]: Task[];
};

// Initial data
const initialData: TaskColumns = {
  'TODO': [],
  'INPROGRESS': [],
  'DONE': [],
};

const Home: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState('recent');
  const [tasks, setTasks] = useState<TaskColumns>(initialData);
  const [dialogData, setDialogData] = useState<{ title: string; description: string } | null>(null);
  const [dialogview, setDialogView] = useState(false);
  const [edit,setedit]=useState(false);

  const navigate = useNavigate();

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    navigate('/');
  };

  const handleAddTaskClick = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseDialogView = () => {
    setDialogView(false);
    setDialogData(null);
  };

  const handleSave = async (data: { title: string; description: string }) => {
    console.log("handle save with srrnng",data.title);
    const userId = localStorage.getItem('userid');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    const newTask = { id:  Date.now().toString(), title: data.title, description: data.description };


    try {
        await saveTask(userId, 'TODO', newTask);
        setTasks(prevTasks => ({ ...prevTasks, 'TODO': [...prevTasks['TODO'], newTask] }));
      // }

      handleCloseDialog();
    } catch (error) {
      console.error('Error saving task:', error);
    }
    setDialogData(null);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortOption(event.target.value);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: Task) => {
    e.dataTransfer.setData('text/plain', item.id);
  };

  // const handleDrop = (e: React.DragEvent<HTMLDivElement>, column: string) => {
  //   const itemId = e.dataTransfer.getData('text/plain');
  //   if (!itemId) return;

  //   const draggedItem = Object.values(tasks).flat().find(task => task.id === itemId);
  //   if (!draggedItem) return;

  //   const updatedTasks = { ...tasks };
  //   Object.keys(updatedTasks).forEach(key => {
  //     updatedTasks[key] = updatedTasks[key].filter(task => task.id !== itemId);
  //   });
  //   updatedTasks[column].push(draggedItem);
  //   setTasks(updatedTasks);
  //   console.log("column",column);
  //   const userId = localStorage.getItem('userid');
  //   console.log("dragged draggeditem",draggedItem);
  //   // saveTask(userId, column, draggedItem);
    
  // };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, column: string) => {
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
  
    const userId = localStorage.getItem('userid');
    if (!userId) {
      console.error('User ID not found');
      return;
    }
  
    const updatedTask = { ...draggedItem, column };
    
    try {
      await puttsask(userId, column, updatedTask);
    } catch (error) {
      console.error('Error updating task on the backend:', error);
    }
    
    console.log("Dragged item updated:", updatedTask);
  };
  
  

  const handleDelete = async (id: string) => {
    const userId = localStorage.getItem('userid');
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    try {
      await deleteTask(userId, id);
      const updatedTasks = { ...tasks };
      Object.keys(updatedTasks).forEach(key => {
        updatedTasks[key] = updatedTasks[key].filter(task => task.id !== id);
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleViewDetails = (id: string) => {
    const task = Object.values(tasks).flat().find(t => t.id === id);
    if (task) {
      setDialogData({ title: task.title, description: task.description });
      setDialogView(true);
    }
  };
  const handleSaveEdit=(data: { title: string; description: string })=>{
    setDialogData({ title:data.title, description: data.description });
    setedit(false);
    
    console.log("on save edit",data.title);
  }

  const handleEdit = (id: string) => {
    const task = Object.values(tasks).flat().find(t => t.id === id);
    if (task) {
      setDialogData({ title: task.title, description: task.description });
    }
    setedit(true);
  };



  useEffect(() => {
    const loadTasks = async () => {
      const userId = localStorage.getItem('userid');
      if (!userId) {
        console.error('User ID not found');
        return;
      }

      try {
        const fetchedTasks = await fetchTasks(userId);
        const formattedTasks = {
          'TODO': Array.isArray(fetchedTasks['TODO']) ? fetchedTasks['TODO'] : [],
          'INPROGRESS': Array.isArray(fetchedTasks['INPROGRESS']) ? fetchedTasks['INPROGRESS'] : [],
          'DONE': Array.isArray(fetchedTasks['DONE']) ? fetchedTasks['DONE'] : [],
        };
        
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    loadTasks();
  }, []);

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
  
      />
      <Dialogedit open={edit} onClose={()=>{setedit(false)}} onSave={ handleSaveEdit} heading='Edit Task' title={dialogData?.title} description={dialogData?.description}/>

      <DialogViews open={dialogview} heading='Task Details' title={dialogData?.title} description={dialogData?.description} onClose={handleCloseDialogView} />
      {/* <Dialogedit open={} /> */}
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
                      <Typography variant="body1" sx={{ flex: 1 }}>{task.title}</Typography>
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
