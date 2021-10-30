import { Autocomplete, TextField } from '@mui/material';
import parse from 'autosuggest-highlight/parse';
import React, { FunctionComponent } from 'react';
import { FilterOptionsState } from '@mui/material/useAutocomplete';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { QuickScore } from 'quick-score';

export interface Option {
  label: string;
  value: string;
}

interface OmniboxProps {
  title: string;
  options: Option[];
  onChange: (value: string | null) => void;
  currentValue: Option | null;
  disabled?: boolean;
  loading?: boolean;
  groupBy?: (option: Option) => string;
  getOptionLabel?: (option: Option) => string;
}

interface OptionWithMatches extends Option {
  matches: [number, number][];
}

const Omnibox: FunctionComponent<OmniboxProps> = ({
  options,
  currentValue,
  onChange,
  title,
  disabled = false,
  loading = false,
  groupBy,
}) => {
  const onInputChange = (_event: any, opt: Option | null) => {
    if (opt && opt.value) {
      onChange(opt.value);
    } else {
      onChange(null);
    }
  };
  const filterOptions = (
    values: Option[],
    { inputValue }: FilterOptionsState<Option>
  ): OptionWithMatches[] => {
    if (inputValue) {
      const searchResults = new QuickScore(values, ['label']).search(
        inputValue
      );
      return searchResults.map(
        (result: { item: Option; matches: { label: number[][] } }) => {
          return {
            ...result.item,
            matches: result.matches.label,
          };
        }
      );
    }
    // if no inputValue, then maintain original item order
    return values.map((item) => {
      return {
        ...item,
        matches: [[0, 0]],
      };
    });
  };
  return (
    <Autocomplete
      id={`omnibox-${title}`}
      options={options}
      disablePortal
      fullWidth
      loading={loading}
      disabled={disabled}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, otherOption) =>
        option.value === otherOption.value
      }
      openOnFocus
      clearIcon={false}
      renderInput={(params) => (
        <TextField {...params} label={title} margin="none" />
      )}
      filterOptions={filterOptions}
      groupBy={groupBy}
      value={currentValue}
      onChange={onInputChange}
      renderOption={(props, option) => {
        const opt: OptionWithMatches = option as OptionWithMatches;
        const parts = parse(option.label, opt.matches);
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
