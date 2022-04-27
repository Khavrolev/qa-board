import classes from "../../styles/Header.module.css";
import classNames from "classnames";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header className={classNames(classes.wrapper__header, classes.header)}>
      <Link href={`/`}>
        <a className={classes.header__title}>Q&A board</a>
      </Link>
      <div className={classes.header__buttons}>
        {session?.user ? (
          <div className={classes.header__logged}>
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
              Logout
            </a>
            <div className={classes.header__nickname}>
              {session?.user?.email || session?.user?.name}
            </div>
          </div>
        ) : (
          <div
            className={classNames({
              [classes.header__notlogged]: !session?.user && loading,
            })}
          >
            <a
              href={`/api/auth/signin`}
              className={classNames(
                "button",
                "button_padding",
                classes.header__button,
              )}
              onClick={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              Login
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
