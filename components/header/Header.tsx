import classes from "./Header.module.css";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Popup from "../popup/Popup";
import { PopupType } from "../../utils/enums/popup";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupType, setPopupType] = useState<PopupType>();

  const { data: session, status } = useSession();
  const loading = status === "loading";

  const handleClick = (type: PopupType) => {
    setPopupType(type);
    setIsModalOpen(true);
  };

  const renderLoggedIn = () => {
    return (
      <div className={classes.header__logged}>
        <div className={classes.header__nickname}>{session?.user?.email}</div>
        <a
          href={`/api/auth/signout`}
          className={classNames(
            "button",
            "button__padding",
            classes.header__button,
          )}
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign Out
        </a>
      </div>
    );
  };

  const renderUnauthorized = () => {
    return (
      <div
        className={classNames({
          [classes.header__loading]: !session?.user && loading,
        })}
      >
        <button
          className={classNames(
            "button",
            "button__padding",
            classes.header__button,
          )}
          onClick={() => handleClick(PopupType.SignIn)}
        >
          Sign In
        </button>
        <button
          className={classNames(
            "button",
            "button__padding",
            classes.header__button,
          )}
          onClick={() => handleClick(PopupType.SignUp)}
        >
          Sign Up
        </button>
      </div>
    );
  };

  return (
    <>
      <Popup
        isModalOpen={isModalOpen}
        onIsModalOpenChange={setIsModalOpen}
        type={popupType}
      />
      <header className={classNames(classes.wrapper__header, classes.header)}>
        <Link href={`/`}>
          <a className={classes.header__title}>Q&A board</a>
        </Link>
        <div className={classes.header__buttons}>
          {session?.user ? renderLoggedIn() : renderUnauthorized()}
        </div>
      </header>
    </>
  );
};

export default Header;
