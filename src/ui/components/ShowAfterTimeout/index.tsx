import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

interface ShowAfterTimeoutProps {
  timeout: number;
  active: boolean;
  children?: React.ReactNode;
}

const ShowAfterTimeout: FunctionComponent<ShowAfterTimeoutProps> = ({
  timeout,
  active,
  ...props
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const activeRef = useRef(active);
  activeRef.current = active;
  const timeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (activeRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        setVisible(true);
      }, timeout);
    } else {
      setVisible(false);
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    }
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [active, timeout]);
  return visible ? props.children : null;
};

export default ShowAfterTimeout;
