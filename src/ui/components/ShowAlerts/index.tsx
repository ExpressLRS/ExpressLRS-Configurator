import {Alert} from '@material-ui/core';
import React, {FunctionComponent, memo} from 'react';

interface ShowAlertsProps {
  severity: 'success' | 'info' | 'warning' | 'error';
  messages: string | undefined | null | (Error | string)[] | Error;
}

export const ShowAlerts: FunctionComponent<ShowAlertsProps> = memo(({messages, severity}) => {
  const isError = (e: any): e is Error => {
    return e && e.stack && e.message;
  };
  const renderMessage = (message: string | undefined | null | Error) => {
    return (
      <>
        {message && message?.toString()?.length > 0 && <Alert severity={severity!}>
          {isError(message) ? message.message : message}
        </Alert>}
      </>
    );
  };
  return (
    <>
      {Array.isArray(messages) && messages.map((message, idx) => (
        <div key={idx}>{(renderMessage(message))}</div>
      ))}
      {!Array.isArray(messages) && renderMessage(messages)}
    </>
  );
});

export default ShowAlerts;
