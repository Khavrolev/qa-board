import classes from "../../styles/Footer.module.css";
import classNames from "classnames";

const Footer = () => {
  return (
    <footer className={classNames(classes.wrapper__footer, classes.footer)}>
      <div className={classes.footer__title}></div>
    </footer>
  );
};

export default Footer;
