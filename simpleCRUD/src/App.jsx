import { useState, useEffect } from 'react';
import { ref, remove, push, off, getDatabase, onChildAdded } from 'firebase/database';
import { app } from './firebase/firebaseConfig';
import { Tab } from '@headlessui/react';
import Popup from './customPopUp/popUp';
import Edit from './edit/edit';
import './App.css';
import { useCompletedTasks } from './context/CompletedTasksContext';

function App() {
  const { completedTasks, addCompletedTask, removeCompletedTask } = useCompletedTasks();
  const [task, setTask] = useState('');
  const [editedTasks, setEditedTasks] = useState([]);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const database = getDatabase(app);
    const taskRef = ref(database, 'task/');

    const fetchData = () => {
      try {
        onChildAdded(taskRef, (snapshot) => {
          const task = snapshot.val();
          setData((prevData) => [
            ...prevData,
            { id: snapshot.key, text: task.Task, completed: task.completed },
          ]);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      off(taskRef, 'child_added');
    };
  }, []);

  const handleSubmit = () => {
    const database = getDatabase(app);
    const taskData = {
      Task: task,
      completed: false,
    };

    if (task.trim() !== '') {
      const taskRef = push(ref(database, 'task/'), taskData)
        .then(() => {
          setIsSuccessPopupVisible(true);
          setTask('');
        })
        .catch((error) => {
          console.error('Error storing data: ', error);
        });
    }
  };

  const handleDelete = (id) => {
    const database = getDatabase(app);
    const taskRef = ref(database, `task/${id}`);
    remove(taskRef)
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting task: ', error);
      });
  };

  const handleEdit = (id) => {
    setEditingTaskId(id);
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setEditingTaskId(null);
    setIsEditing(false);
  };

  const handleUpdate = () => {
    const database = getDatabase(app);
    const taskRef = ref(database, `task/${editingTaskId}`);
    setIsEditing(false);
  };

  const handleCompleted = (id, text) => {
    const updatedTasks = data.map((task) => {
      if (task.id === id) {
        return { ...task, completed: true };
      }
      return task;
    });
  
    setData(updatedTasks);
    addCompletedTask({ id, text });
    const database = getDatabase(app);
    const taskRef = ref(database, `task/${id}`);
    remove(taskRef)
      .then(() => {
        setData((prevData) => prevData.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting task: ', error);
      });
  };
  

  return (
    <>
      <div className='w-full max-w-md px-2 py-16 sm:px-0'>
        <Tab.Group>
          <Tab.List className='flex space-x-1 rounded-xl bg-blue-900/20 p-1'>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                  selected ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
              style={{ marginRight: '10px' }}
              >
              To Do
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                  selected ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }>
              Completed
            </Tab>
          </Tab.List>
          <Tab.Panels className='mt-2'>
            <Tab.Panel className='rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'>
              <div className='title'>
                <h1>Enter your Task</h1>
              </div>
              <div className='input'>
                <textarea rows='4' cols='50' value={task} onChange={(event) => setTask(event.target.value)} />
              </div>
              <div className='button'>
                <button onClick={handleSubmit}>Submit</button>
              </div>
              <hr />
              {data.length == 0 ? (
                <div>
                  <h2>To Do List (0)</h2>
                </div>
              ) : (
                <div>
                  <h2>To Do List ({data.length})</h2>
                  <List data={data.filter((task) => !task.completed)} handleEdit={handleEdit} handleDelete={handleDelete} handleCompleted={handleCompleted}/>
                </div>
              )}
              {isSuccessPopupVisible && <Popup />}
              {isEditing && <Edit id={editingTaskId} onClose={handleCloseEdit} onUpdate={handleUpdate} />}
            </Tab.Panel>
            <Tab.Panel className='rounded-xl bg-white p-3 ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'>
            {completedTasks.length === 0 ? (
              <div>
                <h2>Completed Tasks (0)</h2>
              </div>
            ) : (
              <div>
                <h2>Completed Tasks ({completedTasks.length})</h2>
                <CompletedList data={completedTasks}/>
              </div>
            )}
          </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}

function List({ data, handleEdit, handleDelete, handleCompleted }) {
  return (
    <div className='mapContainer'>
      {data.map((item) => (
        <div key={item.id} className='map'>
          <p>{item.text}</p>
          <div className='btnContainer'>
            <div className='btnEdit'>
              <button onClick={() => handleEdit(item.id)}>Edit</button>
            </div>
            <div className='btnCompleted'>
              <button onClick={() => handleCompleted(item.id, item.text)}>✓</button>
            </div>
            <div className='btnDelete'>
              <button onClick={() => handleDelete(item.id)}>X</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CompletedList({ data }) {
  return (
    <div className='mapContainer'>
      {data.map((item) => (
        <div key={item.id} className='map'>
          <p>{item.text}</p>
          <h6>COMPLETED</h6>
        </div>
      ))}
    </div>
  );
}


export default App;
