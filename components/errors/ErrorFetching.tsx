import { FC } from "react";
import classes from "./Error.module.css";

interface ErrorFetchingProps {
  errorMessage: string;
  handleClick: () => void;
}

const ErrorFetching: FC<ErrorFetchingProps> = ({
  errorMessage,
  handleClick,
}) => {
  return (
    <div className={classes.error} onClick={handleClick}>
      {errorMessage}
    </div>
  );
};

export default ErrorFetching;
