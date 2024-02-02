import { useState, useEffect } from 'react'
import { ref, remove, push, off, getDatabase, onChildAdded } from 'firebase/database';
import { app } from './firebase/firebaseConfig'
import Popup from './customPopUp/popUp';
import Edit from './edit/edit'
import './App.css'

function App() {
const [task, setTask] = useState('');
const [editedTasks, setEditedTasks] = useState([]);
const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
const [data, setData] = useState([]);

const [isEditing, setIsEditing] = useState(false);
const [editingTaskId, setEditingTaskId] = useState(null);

useEffect(() => {
  const taskRef = ref(database, 'task/');

  const fetchData = () => {
      try {
          onChildAdded(taskRef, (snapshot) => {
              const task = snapshot.val();
              setData((prevData) => [
                  ...prevData,
                  { id: snapshot.key, text: task.Task },
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


const database = getDatabase(app);

function List({ data }) {
  return (
      <div className='mapContainer'>
          {data.map(item => (
              <div key={item.id} className='map'>
                  <p>{item.text}</p>
                  <div className='btnContainer'>
                    <div className='btnEdit'>
                      <button onClick={() => handleEdit(item.id)}>Edit</button>
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

const handleSubmit = () => {
  const taskData = {
    Task: task
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
}

const handleDelete = (id) => {
    const taskRef = ref(database, `task/${id}`);
    remove(taskRef).then(() => {
      setData(prevData => prevData.filter(item => item.id !== id));
      })
      .catch((error) => {
          console.error('Error deleting task: ', error);
      });
}

  const handleEdit = (id) => {
    setEditingTaskId(id);
    setIsEditing(true);
  }

  const handleCloseEdit = () => {
    setEditingTaskId(null);
    setIsEditing(false);
  };

  const handleUpdate = () => {
    const taskRef = ref(database, `task/${editingTaskId}`);
    setIsEditing(false);
    window.location.reload();
  };



  return (
    <>
    <div className='title'>
      <h1>
        Enter your Task
      </h1>
    </div>
      <div className='input'>
        <textarea 
        rows="4" 
        cols="50"
        value={task}
        onChange={(event) => setTask(event.target.value)}/>
      </div>
    <div className='button'>
      <button onClick={handleSubmit}>Submit</button>     
    </div>
        <hr/>
        {data.length == 0 ? (
          <div>
            <h2>To Do List (0)</h2>
          </div>
        ) : (
          <div>
            <h2>To Do List ({data.length})</h2>
              <List data={data}/>
          </div>
        )}
        {isSuccessPopupVisible && (
              <Popup/>
            )}
        {isEditing && (
            <Edit
              id={editingTaskId}
              onClose={handleCloseEdit}
              onUpdate={handleUpdate}
            />
          )}
    </>
  )
}

export default App
