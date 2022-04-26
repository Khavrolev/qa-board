import { FC } from "react";
import classes from "../../styles/errors/Error.module.css";

interface ErrorFetchingProps {
  errorMessage: string;
  onClick: () => void;
}

const ErrorFetching: FC<ErrorFetchingProps> = ({ errorMessage, onClick }) => {
  return (
    <div className={classes.error__item} onClick={onClick}>
      {errorMessage}
    </div>
  );
};

export default ErrorFetching;
