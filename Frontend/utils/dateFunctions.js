const dateToText = (date) => {
  const newDate = new Date(date);
  const time =
    newDate.getDate() +
    "/" +
    (newDate.getMonth() + 1) +
    "/" +
    newDate.getFullYear();
  return time;
};

const timeToText = (date) => {
  const newDate = new Date(date);
  const time =
    newDate.getHours() +
    "h" +
    newDate.getMinutes().toString().padStart(2, "0") +
    "min";
  return time;
};

const secondsToText = (nbSeconds) => {
  const time =
    Math.floor(nbSeconds / 3600).toString() +
    "h" +
    ((nbSeconds / 60) % 60).toString().padStart(2, "0") +
    "min";
  return time;
};

const isToday = (date) => {
  const today = new Date();
  return (
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear()
  );
};

const messageTime = (date) => {
  let time = "";
  if (!isToday(date)) {
    time += dateToText(date);
  }
  time += date.getHours() + "h" + date.getMinutes().toString().padStart(2, "0");

  return time;
};

module.exports = { dateToText, timeToText, isToday, secondsToText, messageTime };
