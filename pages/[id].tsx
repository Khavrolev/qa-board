import { EventDB, QuestionDB } from "@prisma/client";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Event from "../components/events/Event";
import classes from "../styles/Questions.module.css";
import Layout from "../components/layout/Layout";
import prisma from "../utils/prisma/prisma";
import { useEvent } from "../hooks/useEvent";
import Question from "../components/questions/Question";
import ErrorFetching from "../components/errors/ErrorFetching";
import { useSession } from "next-auth/react";
import NewQuestionForm from "../components/forms/NewQuestionForm";

interface QuestionsProps {
  initialEvent: EventDB & {
    questions: QuestionDB[];
  };
}

const Questions = ({ initialEvent }: QuestionsProps) => {
  const { data: session, status } = useSession();
  const {
    event,
    handleUpdateEvent,
    handleCreateQuestion,
    handleUpdateQuestion,
    handleDeleteEvent,
    errorFetching,
    handleResetError,
  } = useEvent(initialEvent);

  const renderCurrentQuestions = () => (
    <ul className={classes.main__questions}>
      {event.questions.map((question) => (
        <Question
          key={question.id}
          question={question}
          onUpdateQuestion={handleUpdateQuestion}
          onDeleteEvent={handleDeleteEvent}
        />
      ))}
    </ul>
  );

  return (
    <>
      {errorFetching && (
        <div className={classes.main__error}>
          <ErrorFetching
            errorMessage={errorFetching}
            handleClick={handleResetError}
          />
        </div>
      )}
      <div className={classes.main__event}>
        <Event
          event={{ ...event, _count: { questions: event.questions.length } }}
          firstPage={false}
          onUpdateEvent={handleUpdateEvent}
        />
      </div>
      <div className={classes.main__questionblock}>
        <h2
          className={classes.main__title}
        >{`Questions (${event.questions.length})`}</h2>
        {event.questions.length > 0 ? (
          renderCurrentQuestions()
        ) : (
          <div className={classes.main__noquestions}>No questions</div>
        )}
      </div>
      <div className={classes.main__newquestion}>
        <NewQuestionForm
          event_id={event.id}
          session={session}
          status={status}
          handleCreateQuestion={handleCreateQuestion}
        />
      </div>
    </>
  );
};

Questions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;

  try {
    if (!id || Array.isArray(id)) {
      throw new Error();
    }

    const event = await prisma.eventDB.findUnique({
      where: { id },
      include: { questions: { orderBy: { likes: "desc" } } },
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
      notFound: true,
    };
  }
};

export default Questions;
