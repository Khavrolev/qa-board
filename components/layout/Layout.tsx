import Head from "next/head";
import { FC, ReactNode } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import classes from "./Layout.module.css";

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
        <main className={classes.main}>{children}</main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;