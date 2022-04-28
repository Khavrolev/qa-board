import classes from "../../styles/Header.module.css";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import Popup from "../popup/Popup";
import { PopupType } from "../../utils/enums/Popup";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [popupType, setPopupType] = useState<PopupType>();

  const { data: session, status } = useSession();
  const loading = status === "loading";

  const signIn = () => {
    setPopupType(PopupType.SignIn);
    setIsModalOpen(true);
  };

  const signUp = () => {
    setPopupType(PopupType.SignUp);
    setIsModalOpen(true);
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
          {session?.user ? (
            <div className={classes.header__logged}>
              <div className={classes.header__nickname}>
                {session?.user?.email}
              </div>
              <a
                href={`/api/auth/signout`}
                className={classNames(
                  "button",
                  "button_padding",
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
          ) : (
            <div
              className={classNames({
                [classes.header__notlogged]: !session?.user && loading,
              })}
            >
              <button
                className={classNames(
                  "button",
                  "button_padding",
                  classes.header__button,
                )}
                onClick={signIn}
              >
                Sign In
              </button>
              <button
                className={classNames(
                  "button",
                  "button_padding",
                  classes.header__button,
                )}
                onClick={signUp}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
