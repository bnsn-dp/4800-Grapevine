import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

export default function MyTextField(props) {
  const { label, placeholder, name, control, type, multiline = false, rows = 1, maxLength, resizable = false } = props;
  const [charCount, setCharCount] = useState(0);

  const handleCharChange = (event, onChange) => {
    const value = event.target.value;
    if (maxLength && value.length <= maxLength) {
      setCharCount(value.length); // Update character count
      onChange(value); // Pass the value to the form state
    } else if (!maxLength) {
      onChange(value); // If no maxLength, just update
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, value },
        fieldState: { error },
        formState
      }) => (
        <div>
          <TextField
            onChange={(e) => handleCharChange(e, onChange)}
            value={value || ''} // Ensure value is an empty string if undefined
            id="standard-basic"
            label={label}
            variant="standard"
            placeholder={placeholder}
            type={type}
            multiline={multiline}
            rows={rows}
            inputProps={{ maxLength }} // Set the maxLength if provided
            sx={{
              resize: resizable ? 'both' : 'none', // Toggle resizing based on prop
              overflow: 'auto',
            }}
            InputProps={{
              sx: {
                '& textarea': {
                  resize: resizable ? 'both' : 'none', // Apply based on resizable prop
                  overflow: 'auto'
                }
              }
            }}
          />
          {/* Display character count if maxLength is provided */}
          {maxLength && (
            <div style={{ textAlign: 'right', marginTop: '5px', fontSize: '12px', color: 'gray' }}>
              {charCount}/{maxLength} characters
            </div>
          )}
        </div>
      )}
    />
  );
}
