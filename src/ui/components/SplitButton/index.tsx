import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup, { ButtonGroupProps } from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { FunctionComponent, useState } from 'react';
import { uniqueId } from 'lodash';

export interface Option {
  label: string;
  value: string;
}

interface SplitButtonProps extends ButtonGroupProps {
  options: Option[];
  onButtonClick: (value: string | null) => void;
}

const SplitButton: FunctionComponent<SplitButtonProps> = ({
  options,
  onButtonClick,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [splitButtonMenuId] = useState(() => uniqueId('split-button-menu-'));

  const handleClick = () => {
    onButtonClick(options[selectedIndex].value);
  };

  const handleMenuItemClick = (event: any, index: number) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (
      anchorRef.current &&
      event.target &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup {...props} ref={anchorRef}>
        <Button onClick={handleClick}>{options[selectedIndex].label}</Button>
        <Button
          size="small"
          aria-controls={open ? splitButtonMenuId : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select button"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id={splitButtonMenuId}>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option.value}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default SplitButton;
