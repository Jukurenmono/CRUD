import React, { createContext, useContext, useState } from 'react';

const CompletedTasksContext = createContext();

export const useCompletedTasks = () => {
  return useContext(CompletedTasksContext);
};

export const CompletedTasksProvider = ({ children }) => {
  const [completedTasks, setCompletedTasks] = useState([]);

  const addCompletedTask = (task) => {
    setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, task]);
  };

  const removeCompletedTask = (taskId) => {
    setCompletedTasks((prevCompletedTasks) => prevCompletedTasks.filter((task) => task.id !== taskId));
  };

  return (
    <CompletedTasksContext.Provider value={{ completedTasks, addCompletedTask, removeCompletedTask }}>
      {children}
    </CompletedTasksContext.Provider>
  );
};
