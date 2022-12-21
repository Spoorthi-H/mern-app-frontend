
import Task from "./Task"
import TaskForm from "./TaskForm"
import { useState } from "react";
import { useEffect } from "react";
import {toast} from 'react-toastify' 
import axios from 'axios';
import { URL } from "../App";
import loadingImg from "../assets/loader.gif"


const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setcompletedTasks] = useState([]);
    const [isLoading, setisLoading] = useState(false);

    const [formData, setformData] = useState({name : "",completed: false})
    const {name} = formData;
    
    const [isEditing, setisEditing] = useState(false);
    const [taskId, setTaskId] = useState("");

    const handleInputChange = (e) =>{
        const{name,value} = e.target;
        setformData({...formData,[name]:value})
    }

    const getTasks = async () => {
        setisLoading(true);
        try {
            const {data} =await axios.get(`${URL}/api/tasks`);
            setTasks(data);
            console.log(data);
            setisLoading(false);

        } catch (error) {
            toast.error("error.message");
            console.log(error);
            isLoading(false);
        }
    }
    useEffect(()=>{
            getTasks();
    },[]);

    const createTask = async (e) => {
        e.preventDefault();
        //console.log(formData);
        if(name === "")
        {
            return toast.error("Input Field cannot be empty");
        }
    
    try {
        await  axios.post(`${URL}/api/tasks`,formData)
        toast.success("Task added successfully");
        setformData({...formData,name:""});
        getTasks()
    }
     catch (error) {
       toast.error(error.message); 
    } 
} 

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${URL}/api/tasks/${id}`)
            getTasks();
        } catch (error) {
            toast.error(error);
        }

    }
    const getSingleTask = async (task)=>{
        setformData({name:task.name,completed:false})
        setTaskId(task._id);
        setisEditing(true);
    };
    const updateTask = async (e) =>{
        e.preventDefault();
        if(name === "")
        {
            return toast.error("Input field should not be left empty");
        }
        try {
            await axios.put(`${URL}/api/tasks/${taskId}`,formData);
            setformData({...formData,name:""});
            setisEditing(false);
            getTasks();

        } catch (error) {
            toast.error(error.message);
        }
    }
    const setToComplete = async (task) => {
        const newFormData = {
            name:task.name,
            completed: true,
        }
        try {
            await axios.put(`${URL}/api/tasks/${task._id}`,newFormData)
            console.log(FormData)
            //setformData({...formData,name:""});
            getTasks();
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        const ctasks = tasks.filter((task)=>{return (task.completed===true)})
        setcompletedTasks(ctasks);
    },[tasks])
    return (
        <div>
            <h2>Task Manager</h2>
            <TaskForm 
            name={name}
             handleInputChange={handleInputChange} 
             createTask={createTask}
             isEditing={isEditing}
             updateTask={updateTask}/>
             {tasks.length>0 && (<div className="--flex-between --pb">
                <p>
                <b>Total Tasks:{tasks.length}</b>
                </p>
    
                <p>
                <b>Completed Tasks:{completedTasks.length}</b>
                </p>
                </div>)}
            
            <hr/>

        { isLoading && (
                <div className="--flex-center">
                <img src={loadingImg} alt="loading"/>
                </div> )}
         {isLoading && tasks.length === 0 ? (<p className="--py">No task added. please add a task</p>):(
            <>
            {tasks.map((task,index)=>{
                return (<Task key={task._id} index={index} task={task} deleteTask={deleteTask} getSingleTask={getSingleTask} setToComplete={setToComplete}/>);
            })}
            </>
         )}
      
        
            

        </div>
    );
            }

export default TaskList;
