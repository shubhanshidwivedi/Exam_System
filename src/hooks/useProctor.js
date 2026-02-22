import { useEffect, useRef } from "react";

export default function useProctor({ attemptId, endTime, onAutoSubmit }) {
  const violationCount = useRef(0);
  const mediaStream = useRef(null);

  // ================= CAMERA + MIC =================
  const requestMedia = async () => {
    try {
      mediaStream.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return true;
    } catch (err) {
      alert("Camera & Mic permission required to start exam");
      return false;
    }
  };

  // ================= FULLSCREEN =================
  const enterFullScreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  // ================= SEND VIOLATION =================
  const sendViolation = async (type) => {
    try {
      await fetch(
        `http://localhost:8080/api/student/attempts/${attemptId}/violation?type=${type}`,
        { method: "POST" }
      );
    } catch (e) {}
  };

  // ================= TAB SWITCH =================
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        violationCount.current++;
        sendViolation("TAB_SWITCH");

        if (violationCount.current >= 3) {
          alert("Multiple tab switches detected. Auto submitting...");
          onAutoSubmit();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // ================= FULLSCREEN EXIT =================
  useEffect(() => {
    const handleFullScreen = () => {
      if (!document.fullscreenElement) {
        violationCount.current++;
        sendViolation("FULLSCREEN_EXIT");

        if (violationCount.current >= 3) {
          alert("Fullscreen exited multiple times. Auto submitting...");
          onAutoSubmit();
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullScreen);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreen);
  }, []);

  // ================= TIMER AUTO SUBMIT =================
  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();

      if (now >= end) {
        clearInterval(interval);
        alert("Time over. Auto submitting exam.");
        onAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // ================= INIT =================
  const initProctor = async () => {
    const allowed = await requestMedia();
    if (!allowed) return false;

    enterFullScreen();
    return true;
  };

  // ================= CLEANUP =================
  const stopMedia = () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((t) => t.stop());
    }
  };

  return { initProctor, stopMedia, mediaStream };
}
