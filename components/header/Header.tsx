import classes from "./Header.module.css";
import classNames from "classnames";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

const Header = () => {
  const { user, error, isLoading } = useUser();
  console.log(user);
  return (
    <header className={classNames(classes.wrapper__header, classes.header)}>
      <div>QA board</div>
      <div className={classes.header__buttons}>
        {user && !isLoading && (
          <div className={classes.header__logged}>
            <div className={classes.header__name}>{user.name}</div>
            <Link href="/api/auth/logout">
              <a className={classes.header__button}>Logout</a>
            </Link>
          </div>
        )}
        {!user && !isLoading && (
          <Link href="/api/auth/login">
            <a className={classes.header__button}>Login</a>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
