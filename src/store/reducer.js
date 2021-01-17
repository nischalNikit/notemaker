import * as actionTypes from './actionType';

const initialState = {
    tasks: [],
    userEmail: null,
    userId: null,
    idToken: null,
    error: null
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.ADD_TASK:
            return {
                ...state,
                tasks: state.tasks.concat(action.task)
            };
        case actionTypes.EDIT_TASK:{
            let editableTask = state.tasks.map(task => {
                if(task.id === action.taskId)
                    return {
                        ...task,
                        edit: true
                    }
                else    
                    return task
            })
            return {
                ...state,
                tasks: [...editableTask]
            }
        }
        case actionTypes.EDITING_TASK: {
            let updatedTask = {
                id: action.taskID,
                task: action.task,
                edit: false
            }
            const updatedTasks = state.tasks.map(task => {
                if(task.id === updatedTask.id)
                    return updatedTask
                else
                    return task
            })

            return {
                ...state,
                tasks: updatedTasks
            }
        }
        case actionTypes.DELETE_TASK:{
            let updatedTasks = state.tasks.filter(task => task.id !== action.taskId);
            return {
                ...state,
                tasks: [...updatedTasks]
            };
        }
        case actionTypes.AUTH_SUCCESS:{
            return {
                ...state,
                tasks     : [],
                userId    : action.userId,
                idToken   : action.idToken,
                userEmail : action.email
            };
        }  
        case actionTypes.AUTH_FAILED: {
            return {
                ...state,
                error : action.error
            }
        }
        case actionTypes.AUTH_LOGOUT: {
            return {
                ...state,
                tasks: [],
                userId: null,
                idToken: null,
                error: null,
                userEmail: ""
            }
        }
        case actionTypes.GET_TASKS: {
            return{
                ...state,
                tasks: action.tasks
            }
        }
        default:
            return state;
    }
}

export default reducer;