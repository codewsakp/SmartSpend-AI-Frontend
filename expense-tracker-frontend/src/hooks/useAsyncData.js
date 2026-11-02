import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "../services/api";

/*
 * Runs an async loader and tracks { data, loading, error }.
 * Pass a loader wrapped in useCallback; it re-runs whenever the loader
 * changes (for example when the selected month changes) or reload() is called.
 * Responses from outdated requests are ignored.
 */
export default function useAsyncData(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const requestId = useRef(0);

  const run = useCallback(
    async ({ silent = false } = {}) => {
      const id = ++requestId.current;
      if (!silent) setState((s) => ({ ...s, loading: true, error: "" }));

      try {
        const data = await loader();
        if (id === requestId.current) setState({ data, loading: false, error: "" });
      } catch (error) {
        if (id === requestId.current) {
          setState((s) => ({ data: s.data, loading: false, error: getApiErrorMessage(error) }));
        }
      }
    },
    [loader]
  );

  useEffect(() => {
    run();
    return () => {
      requestId.current++;
    };
  }, [run]);

  const reload = useCallback(() => run({ silent: true }), [run]);
  const retry = useCallback(() => run(), [run]);

  return { ...state, reload, retry };
}
