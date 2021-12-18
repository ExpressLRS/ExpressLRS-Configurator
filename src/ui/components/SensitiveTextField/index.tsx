import React, { FunctionComponent, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const SensitiveTextField: FunctionComponent<TextFieldProps> = ({
  ...props
}) => {
  const [showData, setShowData] = useState(false);
  const onVisibilityChange = () => {
    setShowData((value) => !value);
  };
  return (
    <TextField
      {...props}
      type={showData ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={onVisibilityChange}
              onMouseDown={onVisibilityChange}
            >
              {showData ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SensitiveTextField;
