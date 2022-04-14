import classNames from "classnames";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={classNames(classes.wrapper__footer, classes.footer)}>
      Футер
    </footer>
  );
};

export default Footer;
