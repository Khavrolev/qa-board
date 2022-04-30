import { FC } from "react";
import classes from "./Error.module.css";

interface ErrorFetchingProps {
  errorMessage: string;
  onClick: () => void;
}

const ErrorFetching: FC<ErrorFetchingProps> = ({ errorMessage, onClick }) => {
  return (
    <div className={classes.error} onClick={onClick}>
      {errorMessage}
    </div>
  );
};

export default ErrorFetching;
