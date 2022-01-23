const extractTargets = (data: string): string[] => {
  const targetsRegexp = /\[env:(.*)\]/g;
  const parsedResults = [...data.matchAll(targetsRegexp)];

  return parsedResults
    .map((matchedGroups) => {
      if (matchedGroups.length === 2) {
        return matchedGroups[1];
      }
      return '';
    })
    .filter((i) => i);
};

export default extractTargets;
