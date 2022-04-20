import { useUser } from "@auth0/nextjs-auth0";
import { EventDB, QuestionDB } from "@prisma/client";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Event from "../components/events/Event";
import Layout from "../components/layout/Layout";
import prisma from "../utils/prisma/prisma";
import { useEvents } from "../hooks/useData";
import { isString } from "../utils/guards/Type";

interface QuestionsProps {
  initialEvents: (EventDB & {
    questions: QuestionDB[];
  })[];
}

const Questions = ({ initialEvents }: QuestionsProps) => {
  const { user } = useUser();
  const { data: events, handleUpdateData: handleUpdateEvent } =
    useEvents(initialEvents);

  return (
    <>
      <Event
        event={events[0]}
        firstPage={false}
        onUpdateEvent={handleUpdateEvent}
      />
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
        initialEvents: JSON.parse(JSON.stringify([event])),
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
