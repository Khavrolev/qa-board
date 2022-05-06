import { useCallback, useState } from "react";

export const useError = () => {
  const [errorFetching, setErrorFetching] = useState<string | null>(null);

  const handleResetError = useCallback(() => {
    setErrorFetching(null);
  }, []);

  return { errorFetching, setErrorFetching, handleResetError };
};
