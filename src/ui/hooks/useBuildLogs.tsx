import { useEffect, useRef, useState } from 'react';
import { useBuildLogUpdatesSubscription } from '../gql/generated/types';
import client from '../gql';
import EventsBatcher from '../library/EventsBatcher';

export default function useBuildLogs() {
  /*
    We batch log events in order to save React.js state updates and rendering performance.
   */
  const [buildLogs, setLogs] = useState<string>('');
  const logsRef = useRef<string[]>([]);
  const eventsBatcherRef = useRef<EventsBatcher<string> | null>(null);
  useEffect(() => {
    eventsBatcherRef.current = new EventsBatcher<string>(200);
    eventsBatcherRef.current.onBatch((newLogs) => {
      const newLogsList = [...logsRef.current, ...newLogs];
      logsRef.current = newLogsList;
      setLogs(newLogsList.join(''));
    });
  }, []);
  useBuildLogUpdatesSubscription({
    fetchPolicy: 'network-only',
    client,
    onSubscriptionData: (options) => {
      const args = options.subscriptionData.data?.buildLogUpdates.data;
      if (args !== undefined && eventsBatcherRef.current !== null) {
        eventsBatcherRef.current.enqueue(args);
      }
    },
  });

  const resetLogs = () => {
    logsRef.current = [];
    setLogs('');
  };

  return {
    buildLogs,
    resetLogs,
  };
}
