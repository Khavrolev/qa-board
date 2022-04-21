import { useUser } from "@auth0/nextjs-auth0";
import { EventDB, QuestionDB } from "@prisma/client";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Event from "../components/events/Event";
import classes from "../styles/Questions.module.css";
import Layout from "../components/layout/Layout";
import prisma from "../utils/prisma/prisma";
import { isString } from "../utils/guards/Type";
import { useEvent } from "../hooks/useEvent";
import classNames from "classnames";
import Question from "../components/questions/Question";

interface QuestionsProps {
  initialEvent: EventDB & {
    questions: QuestionDB[];
  };
}

const Questions = ({ initialEvent }: QuestionsProps) => {
  const { user } = useUser();
  const { event, handleUpdateEvent } = useEvent(initialEvent);
  console.log(event);
  return (
    <>
      <Event
        event={{ ...event, _count: { questions: event.questions.length } }}
        firstPage={false}
        onUpdateEvent={handleUpdateEvent}
      />
      <h3 className={classes.main__title}>Questions</h3>
      <ul className={classNames(classes.main__questions, classes.questions)}>
        {event.questions.map((question) => (
          <Question key={question.id} question={question} />
        ))}
      </ul>
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
