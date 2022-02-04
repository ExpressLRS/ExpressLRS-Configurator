import UserDefineKey from '../../library/FirmwareBuilder/Enum/UserDefineKey';

const extractCompatibleKeys = (userDefinesTxt: string): UserDefineKey[] => {
  const userDefinesRegexp = /^#*?-(D[A-z0-9-_]*?)(?==|\s|$)/gm;
  const parsedResults = [...userDefinesTxt.matchAll(userDefinesRegexp)];

  return parsedResults
    .map((matchedGroups) => {
      if (matchedGroups.length === 2) {
        return matchedGroups[1] as UserDefineKey;
      }
      return null;
    })
    .filter((item: UserDefineKey | null): item is UserDefineKey => {
      return item != null;
    });
};

export default extractCompatibleKeys;
