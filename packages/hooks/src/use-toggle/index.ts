"use client";

import { useState, useCallback } from "react";

interface UseToggleOutput {
  isOn: boolean;
  toggle: () => void;
  setOn: () => void;
  setOff: () => void;
  set: (value: boolean) => void;
}

export const useToggle = (initialValue = false): UseToggleOutput => {
  const [isOn, setIsOn] = useState<boolean>(initialValue);

  const toggle = useCallback(() => {
    setIsOn((prev) => !prev);
  }, []);

  const setOn = useCallback(() => {
    setIsOn(true);
  }, []);

  const setOff = useCallback(() => {
    setIsOn(false);
  }, []);

  const set = useCallback((value: boolean) => {
    setIsOn(value);
  }, []);

  return {
    isOn,
    toggle,
    setOn,
    setOff,
    set,
  };
};

export default useToggle;
