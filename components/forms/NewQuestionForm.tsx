import classNames from "classnames";
import { Session } from "next-auth";
import { FC, FormEvent } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { CreateQuestionDB } from "../../utils/api/Interfacess";
import classes from "./NewQuestionForm.module.css";

interface NewQuestionFormProps {
  event_id: string;
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
  handleCreateQuestion: (question: CreateQuestionDB) => void;
}

const NewQuestionForm: FC<NewQuestionFormProps> = ({
  event_id,
  session,
  status,
  handleCreateQuestion,
}) => {
  const loading = status === "loading";

  const onCreateQuestion = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    handleCreateQuestion({
      text: submitEvent.currentTarget.question.value,
      event_id,
      anonymousName: submitEvent.currentTarget?.anonymousname?.value,
    });

    submitEvent.currentTarget.question.value = "";
  };

  return (
    <div
      className={classNames(classes.newquestion, {
        [classes.newquestion__loading]: !session?.user && loading,
      })}
    >
      <h3 className={classes.newquestion__title}>Leave your question bellow</h3>
      <form className={classes.newquestion__form} onSubmit={onCreateQuestion}>
        {!session?.user && (
          <ReactTextareaAutosize
            name="anonymousname"
            className={classes.newquestion__textarea}
            required
            placeholder="Type your name"
          ></ReactTextareaAutosize>
        )}
        <ReactTextareaAutosize
          name="question"
          className={classes.newquestion__textarea}
          required
          placeholder="Leave your question"
        ></ReactTextareaAutosize>
        <input
          className={classNames(
            "button",
            "button__padding",
            classes.newquestion__askbutton,
          )}
          type="submit"
          value="Ask"
        />
      </form>
    </div>
  );
};

export default NewQuestionForm;
