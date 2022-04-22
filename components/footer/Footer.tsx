import classes from "../../styles/Footer.module.css";
import classNames from "classnames";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className={classNames(classes.wrapper__footer, classes.footer)}>
      <div className={classes.footer__title}>Sergey Khavrolev</div>
    </footer>
  );
};

export default Footer;
