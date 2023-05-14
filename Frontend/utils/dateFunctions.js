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

const dateToTextWeb = (date) => {
  const newDate = new Date(date);
  const time =
    newDate.getFullYear() +
    "-" +
    (newDate.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    newDate.getDate();
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

const timeToTextWeb = (date) => {
  const newDate = new Date(date);
  const time =
    newDate.getHours().toString().padStart(2, "0") +
    ":" +
    newDate.getMinutes().toString().padStart(2, "0");
  return time;
};

const secondsToHHMM = (nbSeconds) => {
  const time =
    Math.floor(nbSeconds / 3600).toString() +
    "h" +
    ((nbSeconds / 60) % 60).toString().padStart(2, "0") +
    "min";
  return time;
};

const secondsToHHMMSS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedTime =
    (hours > 0 ? `${hours.toString().padStart(2, "0")}h` : "") +
    (hours > 0 || minutes > 0
      ? `${minutes.toString().padStart(2, "0")}min`
      : "") +
    `${seconds.toString().padStart(2, "0")}s`;
  return formattedTime;
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

const timeDifference = (date) => {
  const currentTime = new Date();
  const targetTime = new Date(date);

  const time = targetTime.getTime() - currentTime.getTime();

  return Math.floor(time / 1000);
};

module.exports = {
  dateToText,
  dateToTextWeb,
  timeToText,
  timeToTextWeb,
  isToday,
  secondsToHHMM,
  secondsToHHMMSS,
  messageTime,
  timeDifference,
};
