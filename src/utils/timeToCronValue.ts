const timeToCronValue = (time: string): string => {
  const [hours, minutes] = time.split(':');
  return `${minutes} ${hours} * * *`;
};

export default timeToCronValue;
