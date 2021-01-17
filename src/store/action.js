import * as actionTypes from './actionType';
import axios from 'axios';

export const addTask = (newTask) => {
    const taskState = {
        task: newTask,
        edit: false 
    }
    
    return (dispatch, getState) => {
        let updatedTaskState = {
            ...taskState,
            userId: getState().userId
        }

        axios.post('https://notemaker-app-default-rtdb.firebaseio.com/tasks.json?auth=' + getState().idToken, updatedTaskState)
        .then(response => {
            dispatch({
                type: actionTypes.ADD_TASK,
                task: {
                    ...taskState,
                    id: response.data.name
                }
            })
        })
        .catch(error => {
           console.log(error);
        });
    }

}

export const editTask = (taskId) => {
    return {
        type: actionTypes.EDIT_TASK,
        taskId: taskId
    }
}

export const editingTask = (taskId, task) => {
    return (dispatch, getState) => {
        const updatedTask = {
            task: task,
            edit: false,
            userId: getState().userId
        }
        axios.put(`https://notemaker-app-default-rtdb.firebaseio.com/tasks/${taskId}.json?auth=` + getState().idToken, updatedTask).then((response) => {
            dispatch({
                type: actionTypes.EDITING_TASK,
                taskID: taskId,
                task: task
            })
        }).catch((error) => {
            console.log(error)
        })
    }
}

export const deleteTask = (taskId) => {
    return (dispatch, getState) => {
        axios.delete(`https://notemaker-app-default-rtdb.firebaseio.com/tasks/${taskId}.json?auth=` + getState().idToken).then((response) => {
            dispatch({
                type: actionTypes.DELETE_TASK,
                taskId: taskId
            })
        }).catch((error) => {
            console.log(error)
        })
    }
}

export const getTasks = () => {
    return (dispatch, getState) => {
        const fetchedTasks = [];
        const queryParams = getState().idToken+'&orderBy="userId"&equalTo="'+getState().userId+'"';

        axios.get('https://notemaker-app-default-rtdb.firebaseio.com/tasks.json?auth=' + queryParams)
        .then(response => {
            for(let key in response.data){
                fetchedTasks.push({
                    ...response.data[key],
                    id: key
                });
            }
            dispatch({
                type: actionTypes.GET_TASKS,
                tasks: fetchedTasks
            })
        })
        .catch(error => {
            dispatch({
               type: actionTypes.GET_TASKS,
               tasks: []
            })
        });
    }
}

/*Authentication Actions*/
const authSuccess = (userId, idToken, email) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        email: email,
        userId: userId,
        idToken: idToken
    }
}

const authFailed = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error.message
    }
}

const authAutoLogout = (time) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout())
        }, time * 1000);
    }
}

export const authLogout = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("userEmail");

    return {
        type: actionTypes.AUTH_LOGOUT
    }
}


export const auth = (email, password, isSignUp) => {
    const info = {
        email    : email,
        password : password,
        returnSecureToken: true
    }

    let apiURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAcov0OpwuWECPltMeqL5FVg-6PgMvaSrM';

    if(!isSignUp){
        apiURL = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAcov0OpwuWECPltMeqL5FVg-6PgMvaSrM';
    }

    return dispatch => {    
        axios.post(apiURL, info)
        .then(response => { 
            dispatch(authSuccess(response.data.localId, response.data.idToken, info.email));
        
            localStorage.setItem("idToken",response.data.idToken);
            localStorage.setItem("userId",response.data.localId);
            localStorage.setItem("userEmail", info.email);
    
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000 * 24);
            localStorage.setItem('expirationDate', expirationDate);
    
            dispatch(authAutoLogout(response.data.expiresIn));
        })
        .catch(error => {
            dispatch(authFailed(error.response.data.error));
        })
    }
}

export const checkAuthState = () => {
    return dispatch => {
        let tokenId = localStorage.getItem("idToken");

        if(!tokenId){
            dispatch(authLogout());
        }
        else {
            let currentExpirationDate = new Date(localStorage.getItem("expirationDate"));

            if(currentExpirationDate > new Date()){
                const userId    = localStorage.getItem("userId");
                const idToken   = localStorage.getItem("idToken");
                const userEmail = localStorage.getItem("userEmail"); 

                dispatch(authSuccess(userId, idToken, userEmail));
            }
            else{
                authLogout();
            }

        }
    }
}
