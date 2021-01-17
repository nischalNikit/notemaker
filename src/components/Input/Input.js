import React from 'react';
import classes from './Input.css';

const Input = props => {

    let inputElement = null;
    let inputClasses = [classes.Input];

    if(props.valid){
        inputClasses.push(classes.Valid);
    }
    else if(props.invalid && props.touched){
        inputClasses.push(classes.Invalid);
    }

    
    switch(props.elementtype){
        case ('input'):
            inputElement = (
                <input 
                    className = {inputClasses.join(' ')}
                    onChange  = {props.inputChange} 
                    {...props.elementconfig} 
                />
            );
            break;
        case ('dropdown'):
            inputElement = (
                <select 
                    className = {inputClasses.join(' ')} 
                    value     = {props.elementconfig.value}
                    onChange  = {props.inputChange}     
                > 
                   {
                       props.elementconfig.options.map((option) => (
                        <option key = {option}>
                            {option}
                        </option>
                       ))
                   }
                </select>
            );
            break;
        case ('textarea'):
            inputElement = (
               <textarea className = {classes.Input} {...props.elementConfig} />
            );
            break;
        default:
            break;
    }
  
    return(
        <div className = {classes.formElement}>
            {inputElement}
        </div>
    )
}

export default Input;