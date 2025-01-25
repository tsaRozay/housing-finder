const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

const formatDateTime = (date) => {
  const formattedDate = new Date(date).toISOString().slice(0, 10);
  const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const formattedTime = new Intl.DateTimeFormat('en-US', options).format(new Date(date));
  return `${formattedDate} ${formattedTime}`;
};

module.exports ={ formatDate, formatDateTime };