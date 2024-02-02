import React, { useEffect, useState } from 'react';
import { app } from '../firebase/firebaseConfig';
import { ref, getDatabase, update, onValue } from 'firebase/database';
import './Edit.css';

const Edit = ({ id, onClose, onUpdate }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [existingTaskData, setExistingTaskData] = useState('');
    const [editedTaskData, setEditedTaskData] = useState('');

    useEffect(() => {
        const database = getDatabase(app);
        const taskRef = ref(database, `task/${id}`);
        
        const disableListener = onValue(taskRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setExistingTaskData(data.Task);
                setEditedTaskData(data.Task);
            }
        });
        
        return () => {
            disableListener();
        };
    }, [id]);

    const handleUpdate = () => {
        const database = getDatabase(app);
        const taskRef = ref(database, `task/${id}`);
        update(taskRef, { Task: editedTaskData });
        onUpdate();
        onClose();
    };

    return (
        <div>
            {isOpen && (
                <div className="edit">
                    <div className="edit-content">
                        <textarea 
                            rows="4" 
                            cols="50"
                            value={editedTaskData}
                            onChange={(event) => setEditedTaskData(event.target.value)}
                        />
                        <div className='cancelEditBtn'>
                            <button onClick={handleUpdate}>Update</button>
                            <button onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Edit;
