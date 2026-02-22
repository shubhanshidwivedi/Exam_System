import { useEffect, useState } from "react";

export default function ExamTimer({ endTime }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(endTime) - new Date();

      if (diff <= 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
        return;
      }

      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${m}:${s < 10 ? "0" : ""}${s}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div style={{ position: "fixed", top: 10, right: 20, fontWeight: "bold" }}>
      ⏱ {timeLeft}
    </div>
  );
}
