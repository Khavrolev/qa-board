import { FC } from "react";
import Modal from "react-modal";
import classes from "./Popup.module.css";
import { PopupType } from "../../utils/enums/popup";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

interface PopupProps {
  isModalOpen: boolean;
  onIsModalOpenChange: (isModalOpen: boolean) => void;
  type: PopupType | undefined;
}

const Popup: FC<PopupProps> = ({ isModalOpen, onIsModalOpenChange, type }) => {
  const getContent = () => {
    switch (type) {
      case PopupType.SignIn:
        return {
          component: <SignIn onIsModalOpenChange={onIsModalOpenChange} />,
          title: "Sign In",
        };
      case PopupType.SignUp:
        return {
          component: <SignUp onIsModalOpenChange={onIsModalOpenChange} />,
          title: "Sign Up",
        };
      default:
        return {
          component: (
            <div
              className={classes.popup__wrongtype}
            >{`Wrong popup's type`}</div>
          ),
          title: "Error",
        };
    }
  };

  const content = getContent();

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => onIsModalOpenChange(false)}
      className={classes.popup}
      overlayClassName={classes.popup__overlay}
    >
      <h3 className={classes.popup__title}>{content.title}</h3>
      <div className={classes.popup__body}>{content.component}</div>
    </Modal>
  );
};

export default Popup;
