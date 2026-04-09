import { useRef, useState } from 'react';
import { useSubscription } from '@apollo/client/react';
import {
  BuildProgressNotification,
  BuildProgressNotificationsDocument,
} from '../gql/generated/types';
import client from '../gql';

export default function useBuildProgressNotifications() {
  const [buildProgressNotifications, setBuildProgressNotifications] = useState<
    BuildProgressNotification[]
  >([]);
  const buildProgressNotificationsRef = useRef<BuildProgressNotification[]>([]);
  const [lastBuildProgressNotification, setLastBuildProgressNotification]
    = useState<BuildProgressNotification | null>(null);

  useSubscription(BuildProgressNotificationsDocument, {
    client,
    onData: ({ data }) => {
      const args = data.data?.buildProgressNotifications;
      if (args !== undefined) {
        const newNotificationsList = [
          ...buildProgressNotificationsRef.current,
          args,
        ];
        buildProgressNotificationsRef.current = newNotificationsList;
        setBuildProgressNotifications(newNotificationsList);
        setLastBuildProgressNotification(args);
      }
    },
  });

  const resetBuildProgressNotifications = () => {
    buildProgressNotificationsRef.current = [];
    setBuildProgressNotifications([]);
    setLastBuildProgressNotification(null);
  };

  return {
    buildProgressNotifications,
    lastBuildProgressNotification,
    resetBuildProgressNotifications,
  };
}
