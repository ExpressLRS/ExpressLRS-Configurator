import { Autocomplete, TextField } from '@material-ui/core';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { FunctionComponent } from 'react';

export interface Option {
  label: string;
  value: string;
}

interface OmniboxProps {
  title: string;
  options: Option[];
  onChange: (value: string | null) => void;
  currentValue: Option | null;
}

const Omnibox: FunctionComponent<OmniboxProps> = ({
  options,
  currentValue,
  onChange,
  title,
}) => {
  const onInputChange = (_event: any, opt: Option | null) => {
    if (opt && opt.value) {
      onChange(opt.value);
    } else {
      onChange(null);
    }
  };
  return (
    <Autocomplete
      id={`omnibox-${title}`}
      options={options}
      disablePortal
      autoHighlight
      getOptionLabel={(option) => option.label}
      getOptionSelected={(option, otherOption) =>
        option.value === otherOption.value
      }
      openOnFocus
      clearIcon={false}
      renderInput={(params) => (
        <TextField {...params} label={title} margin="none" />
      )}
      value={currentValue}
      onChange={onInputChange}
      renderOption={(props, option, { inputValue }) => {
        const matches = match(option.label, inputValue);
        const parts = parse(option.label, matches);

        return (
          <li {...props}>
            <div>
              {parts.map(
                (
                  part: { highlight: any; text: React.ReactNode },
                  index: string | number | null | undefined
                ) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 800 : 400,
                    }}
                  >
                    {part.text}
                  </span>
                )
              )}
            </div>
          </li>
        );
      }}
    />
  );
};

export default Omnibox;
