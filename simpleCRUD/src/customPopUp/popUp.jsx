import React, { useState } from 'react';
import './Popup.css';

function Popup() {
    const [isOpen, setIsOpen] = useState(true);

    const togglePopup = () => {
        setIsOpen(!isOpen);
        window.location.reload()
    };

    return (
        <div>
            {isOpen && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>TASK SUBMITTED</h2>
                        <p>Task submitted to the database.</p>
                        <button onClick={togglePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Popup;
