import { useEffect, useState } from "react";
import { CapacitorCookies } from "@capacitor/core";

export default function useCookieState<T>(key: string, initialState: T): [T | undefined, (state: T, expires?: string) => Promise<void>] {
  const [state, setState] = useState<T>();

  useEffect(() => {
    async function loadValue() {
      const cookies = await CapacitorCookies.getCookies();
      let value = cookies[key];
      if (value == undefined && initialState != undefined) {
        value = JSON.stringify(initialState);
        setState(JSON.parse(value));
      } else {
        if (value) {
          setState(JSON.parse(value));
        } else {
          setState(undefined);
        }
      }
    }

    void loadValue();
  }, [key]);

  async function setValue(value: T, expires?: string ) {
    setState(value);
    await CapacitorCookies.setCookie({ key, value: JSON.stringify(value), expires });
  }

  return [state, setValue];
}
