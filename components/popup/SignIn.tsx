import { signIn } from "next-auth/react";
import { FC, useState } from "react";
import classes from "../../styles/Popup.module.css";

interface SignInProps {
  onIsModalOpenChange: (isModalOpen: boolean) => void;
}

const SignIn: FC<SignInProps> = ({ onIsModalOpenChange }) => {
  const [error, setError] = useState<string>();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (!response?.ok) {
        setError("Wrong email or password");
        return;
      }
    } catch (error) {
      setError("Error ocurred");
      console.error(error);
      return;
    }

    onIsModalOpenChange(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={classes.popup__input}>
        <label>Email </label>
        <input
          className={classes.popup__text}
          type="email"
          name="email"
          autoComplete="username"
          required
        />
      </div>
      <div className={classes.popup__input}>
        <label>Password </label>
        <input
          className={classes.popup__text}
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </div>
      <div
        style={{
          visibility: error ? "visible" : "hidden",
        }}
        className={classes.popup__error}
      >
        {error}
      </div>
      <div className={classes.popup__button}>
        <input className={classes.popup__submit} type="submit" />
      </div>
    </form>
  );
};

export default SignIn;
