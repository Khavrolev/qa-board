import classNames from "classnames";
import Head from "next/head";
import { FC, ReactNode } from "react";
import Header from "../header/Header";
import classes from "../../styles/Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>QA Board</title>
        <meta name="description" content="QA Board" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={classes.wrapper}>
        <Header />
        <main className={classNames(classes.wrapper__main, classes.main)}>
          {children}
        </main>
      </div>
    </>
  );
};

export default Layout;
