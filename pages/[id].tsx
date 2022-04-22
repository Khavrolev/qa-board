import { useUser } from "@auth0/nextjs-auth0";
import { EventDB, QuestionDB } from "@prisma/client";
import { GetServerSideProps } from "next";
import { FormEvent, ReactElement } from "react";
import Event from "../components/events/Event";
import classes from "../styles/Questions.module.css";
import Layout from "../components/layout/Layout";
import prisma from "../utils/prisma/prisma";
import { isString } from "../utils/guards/Type";
import { useEvent } from "../hooks/useEvent";
import classNames from "classnames";
import Question from "../components/questions/Question";
import ReactTextareaAutosize from "react-textarea-autosize";

interface QuestionsProps {
  initialEvent: EventDB & {
    questions: QuestionDB[];
  };
}

const Questions = ({ initialEvent }: QuestionsProps) => {
  const { user } = useUser();
  const {
    event,
    handleUpdateEvent,
    handleCreateQuestion,
    handleUpdateQuestion,
    handleDeleteEvent,
  } = useEvent(initialEvent);

  const onCreateQuestion = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    handleCreateQuestion({
      text: submitEvent.currentTarget.question.value,
      event_id: event.id,
    });

    submitEvent.currentTarget.question.value = "";
  };

  console.log(event);
  return (
    <>
      <Event
        event={{ ...event, _count: { questions: event.questions.length } }}
        firstPage={false}
        onUpdateEvent={handleUpdateEvent}
      />
      <div className={classes.main__questionblock}>
        <h2
          className={classes.main__title}
        >{`Questions (${event.questions.length})`}</h2>
        {event.questions.length > 0 ? (
          <ul
            className={classNames(classes.main__questions, classes.questions)}
          >
            {event.questions.map((question) => (
              <Question
                key={question.id}
                question={question}
                eventAuthorId={event.userId}
                onUpdateQuestion={handleUpdateQuestion}
                onDeleteEvent={handleDeleteEvent}
              />
            ))}
          </ul>
        ) : (
          <div className={classes.main__noquestions}>No questions</div>
        )}
      </div>
      {user && (
        <div className={classes.main__newcomment}>
          <h3 className={classes.main__title}>Leave your question bellow</h3>
          <form className={classes.main__form} onSubmit={onCreateQuestion}>
            <ReactTextareaAutosize
              name="question"
              className={classes.main__textarea}
              required
              placeholder="Leave your question"
            ></ReactTextareaAutosize>
            <input
              className={classNames(
                "button",
                "button_padding",
                classes.main__askbutton,
              )}
              type="submit"
              value="Ask"
            />
          </form>
        </div>
      )}
    </>
  );
};

Questions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  try {
    if (!isString(id)) {
      throw new Error();
    }

    const event = await prisma.eventDB.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!event) {
      throw new Error();
    }
    return {
      props: {
        initialEvent: JSON.parse(JSON.stringify(event)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        error: "Ooops! Something went wrong",
      },
    };
  }
};

export default Questions;
