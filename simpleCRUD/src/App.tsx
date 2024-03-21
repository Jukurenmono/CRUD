import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import Popup from './customPopUp/popUp';
import Edit from './edit/edit';
import './App.css';
import { useCompletedTasks } from './context/CompletedTasksContext';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function App(): JSX.Element {
  const { completedTasks, addCompletedTask, removeCompletedTask } = useCompletedTasks();
  const [task, setTask] = useState<string>('');
  const [data, setData] = useState<Task[]>([]);
  const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const handleSubmit = (): void => {
    if (task.trim() !== '') {
      const newTask: Task = { id: Date.now().toString(), text: task, completed: false };
      setData([...data, newTask]);
      setTask('');
      setIsSuccessPopupVisible(true);
    }
  };

  const handleDelete = (id: string): void => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleEdit = (id: string): void => {
    setEditingTaskId(id);
    setIsEditing(true);
  };

  const handleCloseEdit = (): void => {
    setEditingTaskId(null);
    setIsEditing(false);
  };

  const handleUpdate = (updatedText: string): void => {
    setData(data.map((item) => (item.id === editingTaskId ? { ...item, text: updatedText } : item)));
    setIsEditing(false);
  };

  const handleCompleted = (id: string, text: string): void => {
    addCompletedTask({ id, text });
    setData(data.filter((item) => item.id !== id));
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
                <textarea rows={4} cols={50} value={task} onChange={(event) => setTask(event.target.value)} />
              </div>
              <div className='button'>
                <button onClick={handleSubmit}>Submit</button>
              </div>
              <hr />
              {data.length === 0 ? (
                <div>
                  <h2>To Do List (0)</h2>
                </div>
              ) : (
                <div>
                  <h2>To Do List ({data.length})</h2>
                  <List data={data} handleEdit={handleEdit} handleDelete={handleDelete} handleCompleted={handleCompleted} />
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
                  <CompletedList data={completedTasks} />
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
}

interface ListProps {
  data: Task[];
  handleEdit: (id: string) => void;
  handleDelete: (id: string) => void;
  handleCompleted: (id: string, text: string) => void;
}

function List({ data, handleEdit, handleDelete, handleCompleted }: ListProps): JSX.Element {
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

interface CompletedListProps {
  data: Task[];
}

function CompletedList({ data }: CompletedListProps): JSX.Element {
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
