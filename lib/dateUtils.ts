// utils/dateUtils.ts
export const getDateDifferenceText = (dueDate: string): string => {
  const today = new Date();
  const due = new Date(dueDate);
  const timeDiff = due.getTime() - today.getTime();
  const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (dayDiff < 0) {
    return 'Overdue';
  } else if (dayDiff === 0) {
    return 'Today';
  } else if (dayDiff === 1) {
    return 'Tomorrow';
  } else if (dayDiff <= 7) {
    return `In ${dayDiff} days`;
  } else {
    const weekDiff = Math.floor(dayDiff / 7);
    if (weekDiff === 1) return 'In 1 week';
    if (weekDiff <= 4) return `In ${weekDiff} weeks`;

    const monthDiff = Math.floor(dayDiff / 30);
    if (monthDiff === 1) return 'In 1 month';
    return `In ${monthDiff} months`;
  }
};
