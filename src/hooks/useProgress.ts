import { useState, useEffect, useCallback } from "react";

export interface SessionRecord {
  type: string;
  score: number;
  date: string;
  emoji: string;
}

export interface ProgressData {
  sessions: SessionRecord[];
  learnedChars: string[];
  lastUpdated: string;
}

const STORAGE_KEY = "eye_path_progress";

function loadData(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch {
    // ignore
  }
  return { sessions: [], learnedChars: [], lastUpdated: "" };
}

function saveData(data: ProgressData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function useProgress() {
  const [data, setData] = useState<ProgressData>(loadData);

  // Persist on every change
  useEffect(() => {
    saveData(data);
  }, [data]);

  const addSession = useCallback((session: Omit<SessionRecord, "date">) => {
    const record: SessionRecord = {
      ...session,
      date: new Date().toLocaleString("zh-CN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setData((prev) => ({
      ...prev,
      sessions: [...prev.sessions, record],
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  const addLearnedChar = useCallback((char: string) => {
    setData((prev) => {
      if (prev.learnedChars.includes(char)) return prev;
      return {
        ...prev,
        learnedChars: [...prev.learnedChars, char],
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const clearAll = useCallback(() => {
    const fresh: ProgressData = { sessions: [], learnedChars: [], lastUpdated: "" };
    setData(fresh);
    saveData(fresh);
  }, []);

  return { data, addSession, addLearnedChar, clearAll };
}
