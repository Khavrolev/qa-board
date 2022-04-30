import axios from "axios";
import { signIn } from "next-auth/react";
import { FC, useState } from "react";
import classes from ".//Popup.module.css";
import { fetchCreateUser } from "../../utils/api/Users";

const PASSWORD_REX = /.{5,}$/;

interface SignUpProps {
  onIsModalOpenChange: (isModalOpen: boolean) => void;
}

const SignUp: FC<SignUpProps> = ({ onIsModalOpenChange }) => {
  const [error, setError] = useState<string>();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = event.currentTarget.email.value;
    const password = event.currentTarget.password.value;
    const confirmpassword = event.currentTarget.confirmpassword.value;

    if (password !== confirmpassword) {
      setError("Passwords don't match");
      return;
    }

    if (!password.match(PASSWORD_REX)) {
      setError("Passwords must contains minimum five characters");
      return;
    }

    try {
      const user = await fetchCreateUser({ email, password });

      await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      }
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
          autoComplete="new-password"
          required
        />
      </div>
      <div className={classes.popup__input}>
        <label>Confirm Password </label>
        <input
          className={classes.popup__text}
          type="password"
          name="confirmpassword"
          autoComplete="new-password"
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

export default SignUp;
