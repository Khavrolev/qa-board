import classes from "../../styles/Header.module.css";
import classNames from "classnames";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

const Header = () => {
  const { user, isLoading } = useUser();

  return (
    <header className={classNames(classes.wrapper__header, classes.header)}>
      <Link href={`/`}>
        <a className={classes.header__title}>QA board</a>
      </Link>
      <div className={classes.header__buttons}>
        {user && !isLoading && (
          <div className={classes.header__logged}>
            <Link href="/api/auth/logout">
              <a className={classNames("button", classes.header__button)}>
                Logout
              </a>
            </Link>
            <div className={classes.header__nickname}>{user.nickname}</div>
          </div>
        )}
        {!user && !isLoading && (
          <Link href="/api/auth/login">
            <a className={classNames("button", classes.header__button)}>
              Login
            </a>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
