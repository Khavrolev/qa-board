import classNames from "classnames";
import { FC, MouseEvent } from "react";

interface ButtonDeleteProps {
  id: string;
  style: string;
  onDelete?: (id: string) => void;
}

const ButtonDelete: FC<ButtonDeleteProps> = ({ id, style, onDelete }) => {
  const handleDelete = (clickEvent: MouseEvent<HTMLButtonElement>) => {
    clickEvent.stopPropagation();
    if (onDelete !== undefined) {
      onDelete(id);
    }
  };

  return (
    <button className={classNames("button", style)} onClick={handleDelete}>
      <svg style={{ width: "15px", height: "15px" }} viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
        />
      </svg>
    </button>
  );
};

export default ButtonDelete;
