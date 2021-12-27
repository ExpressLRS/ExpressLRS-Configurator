import React, { FunctionComponent, useEffect, useState } from 'react';
import {
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ApplicationStorage from '../../storage';

const SensitiveTextField: FunctionComponent<TextFieldProps> = ({
  ...props
}) => {
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    (async () => {
      const storage = new ApplicationStorage();
      const showFieldData = props.name
        ? await storage.getShowSensitiveFieldData(props.name)
        : false;
      setShowData(showFieldData ?? false);
    })();
  }, []);

  const onVisibilityChange = () => {
    setShowData((value) => {
      const newValue = !value;
      if (props.name) {
        const storage = new ApplicationStorage();
        storage.setShowSensitiveFieldData(props.name, newValue);
      }
      return newValue;
    });
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
