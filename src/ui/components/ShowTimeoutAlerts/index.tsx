import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import ShowAlerts, { ShowAlertsProps } from '../ShowAlerts';

interface ShowTimeoutAlertsProps extends ShowAlertsProps {
  timeout: number;
  active: boolean;
}

const ShowTimeoutAlerts: FunctionComponent<ShowTimeoutAlertsProps> = ({
  timeout,
  active,
  ...props
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const buildInProgressRef = useRef(active);
  buildInProgressRef.current = active;
  const slowBuildTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (buildInProgressRef.current) {
      slowBuildTimeoutRef.current = window.setTimeout(() => {
        setVisible(true);
      }, timeout);
    } else {
      setVisible(false);
      if (slowBuildTimeoutRef.current !== null) {
        clearTimeout(slowBuildTimeoutRef.current);
      }
    }
    return () => {
      if (slowBuildTimeoutRef.current !== null) {
        clearTimeout(slowBuildTimeoutRef.current);
      }
    };
  }, [active, timeout]);
  return visible ? <ShowAlerts {...props} /> : null;
};

export default ShowTimeoutAlerts;
