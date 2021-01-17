import React, {useState, useEffect } from 'react';
import {Redirect} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import classes from './Screens.css';

import * as actions from '../store/action';

const Home = (props) => {
    const dispatch = useDispatch();
    const tasks = useSelector(store => store.tasks);
    const isAuthenticated = useSelector(store => store.userId !== null);

    const [newTask, setNewTask]   = useState('');
    const [editTask, setEditTask] = useState('');

    useEffect(() => {
        if(isAuthenticated)
            dispatch(actions.getTasks());
    },[]);

    let redirectContent = null;

    const newTaskHandler = (e) => {
        let inputTask = e.target.value;
        setNewTask(inputTask);
    }

    const deleteHandler = (taskId) => {
        if(taskId)
            dispatch(actions.deleteTask(taskId));
    }

    const editTaskHandler = (e) => {
        let editingTask = e.target.value;
        setEditTask(editingTask);
    }

    const editHandler = (taskId, task) => {
        if(taskId){
            setEditTask(task);
            dispatch(actions.editTask(taskId));
        }    
    }

    const editSubmitHandler = (taskId) => {
        if(taskId && editTask){
            dispatch(actions.editingTask(taskId, editTask));
            setEditTask('');
        }
    }

    const submitForm = (e) => {
        e.preventDefault();

        if(newTask)
            dispatch(actions.addTask(newTask));
        setNewTask('');
    }

    if(!isAuthenticated)
        redirectContent = <Redirect to = '/auth' />

    return(
        <div className = {classes.Home}>
            {redirectContent}
            <div className = {classes.TaskInputContainer}>
                <span className = {classes.InputHeadline}>create a task</span>
                <form 
                    className = {classes.InputForm}
                    onSubmit = {(e) => submitForm(e)}
                >
                    <textarea
                        value = {newTask}
                        placeholder = "Write a new task..."
                        className = {classes.Input}
                        onChange = {newTaskHandler}
                    />
                    <button
                        className = {classes.InputButton}
                    >add task</button>
                </form>
            </div> 
            <hr className = {classes.hr} /> 
            <div className = {classes.TaskListContainer}>
                <span className = {classes.InputHeadline}>Your current tasks.</span>
                <div className = {classes.TaskContainer}>
                {
                    tasks.map(task => {
                        return(
                            <div 
                                key = {task.id}
                                className = {classes.Taskbox}
                            >
                                <textarea 
                                    className = {classes.Title}
                                    value = {
                                        task.edit ? editTask : task.task
                                    }
                                    disabled = {!task.edit}
                                    onChange = {editTaskHandler}
                                />
                                <div className = {classes.Control}>
                                    <button
                                        className = {classes.TaskButton}
                                        style = {
                                            task.edit 
                                            ? {backgroundColor: 'var(--color-green)'}
                                            : {backgroundColor: 'var(--color-yellow)'} 
                                        }
                                        onClick = {
                                            task.edit 
                                            ? () => editSubmitHandler(task.id)
                                            : () => editHandler(task.id, task.task)
                                        }
                                    >
                                    {
                                        task.edit ? "add" : "edit"    
                                    }
                                    </button>
                                    <button
                                        className = {classes.TaskButton}
                                        style = {{backgroundColor: 'var(--color-red)'}}
                                        onClick = {() => deleteHandler(task.id)}
                                    >delete</button>
                                </div>
                            </div>
                        )
                    })  
                }
                </div>
            </div> 
        </div>
    )
}

export default Home;