import { Dispatch, SetStateAction, useState } from "react";
import Cookies from "js-cookie";

function isFunction<S>(value: unknown): value is () => S {
  return typeof value === "function";
}

export default function useCookieState<S>(key: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(() => {
    const value = Cookies.get(key);

    if (value) {
      return JSON.parse(value);
    }

    return isFunction(initialState) ? initialState() : initialState;
  });


  function setValue(value: S | ((prevState: S) => S)) {
    const newValue = isFunction(value) ? (value as (prevState: S) => S)(state) : value;
    setState(newValue);
    Cookies.set(key, JSON.stringify(newValue));
  }

  return [state, setValue];
}
