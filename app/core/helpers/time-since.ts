const timeSinceIntervals = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

const timeSince = (date?: Date | null) => {
  if (!date) return "some time ago";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "a moment ago";

  const interval = timeSinceIntervals.find((i) => i.seconds < seconds);

  if (interval) {
    const count = Math.floor(seconds / interval.seconds);
    return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
  } else {
    return "some time ago";
  }
};

export default timeSince;
