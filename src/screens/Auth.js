import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import classes from './Screens.css';

import * as actions from '../store/action';
import {updateObject, checkValidity} from "../utility/utility";
import Input from '../components/Input/Input';

const Auth = (props) => {
    const dispatch = useDispatch();

    const errorMessage = useSelector(store => store.error);
    const isAuthenticated = useSelector(store => store.userId !== null);

    const [isForSignUp, changeSignUp] = useState(true);
    const [authForm, modifyAuthForm]  = useState({
        email:{
            elementType: "input",
            elementConfig: {
                type: "email",
                placeholder: "Your Email.",
                value: ""
            },
            validation: {
                required: true
            },
            valid: false,
            touched: false,
            label: "E-mail"
        },
        password:{
            elementType: "input",
            elementConfig: {
                type: "password",
                placeholder: "Password.",
                value: ""
            },
            validation: {
                required: true,
                minLength: 8
            },
            valid: false,
            touched: false,
            label: "Password"
        }
    });

    const onAuth = (email,password, formStatus) => {
        dispatch(actions.auth(email,password, formStatus));
    };

    const inputChangeHandler = (event, formKey) => {
        let newformOrder = updateObject(authForm, {
            [formKey] : updateObject(authForm[formKey], {
                elementConfig : updateObject(authForm[formKey].elementConfig, {
                    value : event.target.value
                }),
                valid : checkValidity(event.target.value, authForm[formKey].validation),
                touched : true
            })
        });

        modifyAuthForm(newformOrder);
    }

    const changeFormStatus = (event) => {
        event.preventDefault();
        changeSignUp((prevSignUpState) => !prevSignUpState);
    }
    
    const orderHandler = (event) => {
        event.preventDefault();
        let email      = authForm.email.elementConfig.value;
        let password   = authForm.password.elementConfig.value;
        let formStatus = isForSignUp;
        
        onAuth(email, password, formStatus);
    }

    let formElements = [];
    for(let formElement in authForm){
        formElements.push({
            ...authForm[formElement],
            id: formElement
        })
    }

    let inputs = formElements.map((formElement) => (
        <Input 
            key           = {formElement.id} 
            elementtype   = {formElement.elementType}
            elementconfig = {formElement.elementConfig}
            label         = {formElement.label}
            valid         = {formElement.valid}
            invalid       = {!formElement.valid}
            touched       = {formElement.touched}
            inputChange   = {(event) => inputChangeHandler(event, formElement.id)}
        />
    ));

    let formJSX = null;
    formJSX = (
        <form 
            className = {classes.AuthForm} 
        >
            {
                errorMessage
                ? <h2 className = {classes.error}>
                    {errorMessage.split("_").join(" ")}
                   </h2>
                : null
            }
                {inputs}
            <button 
                onClick   = {orderHandler} 
                className = {classes.AuthButton}
            >
                {
                    isForSignUp ? "Create An Account" : "Log In"
                }
            </button>
            <button 
                className = {classes.AuthChangeButton}
                onClick   = {changeFormStatus} 
            >
                {
                    isForSignUp 
                    ? "Already a user? Sign In." 
                    : "First time here? Sign Up."
                }
            </button>
        </form>
    );

    return(
        <div className = {classes.Auth}>
            <div className = {classes.AuthMain}>
                <h3 className = {classes.SubTitle}>
                {
                    isForSignUp ? "Sign Up" : "Sign In"
                }
                </h3>
                {formJSX}
            </div>
            {
                isAuthenticated 
                ? <Redirect to = '/home' />
                : null
            } 
        </div>
    )
}

export default Auth;