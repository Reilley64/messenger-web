import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";

export default function usePreferenceState<T>(key: string, initialState?: T): [T | undefined, (state: T) => Promise<void>] {
  const [state, setState] = useState<T>();

  useEffect(() => {
    async function loadValue() {
      const result = await Preferences.get({ key });
      if (result.value == undefined && initialState != undefined) {
        result.value = JSON.stringify(initialState);
        setState(JSON.parse(result.value));
      } else {
        if (result.value) {
          setState(JSON.parse(result.value));
        } else {
          setState(undefined);
        }
      }
    }

    void loadValue();
  }, [key]);

  async function setValue(value: T) {
    setState(value);
    await Preferences.set({ key, value: JSON.stringify(value) });
  }

  return [state, setValue];
}
