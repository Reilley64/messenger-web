import { Dispatch, SetStateAction, useState } from "react";

function isFunction<S>(value: unknown): value is () => S {
  return typeof value === "function";
}

export default function useLocalStorageState<S>(key: string, initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(() => {
    const value = localStorage.getItem(key);
    console.log(key, value);

    if (value) {
      return JSON.parse(value);
    }

    return isFunction(initialState) ? initialState() : initialState;
  });


  function setValue(value: S | ((prevState: S) => S)) {
    const newValue = isFunction(value) ? (value as (prevState: S) => S)(state) : value;
    setState(newValue);
    console.log("here", newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  }

  return [state, setValue];
}
