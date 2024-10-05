import * as React from 'react';
import TextField from '@mui/material/TextField';
import {Controller} from 'react-hook-form'

export default function MyTextField(props) {
    const {label, placeholder, name, control, type} = props
  return (
    <Controller
        name = {name}
        control = {control}
        render ={({
        field:{onChange, value},
        fieldState:{error},
        formState
        }) =>
            (
              <TextField
                  onChange={onChange}
                  value={value}
                  id="standard-basic"
                  label={label}
                  variant="standard"
                  placeholder = {placeholder}
                  type={type} // Set the type to 'password' or 'text'
              />
            )
        }
    />
  );
}