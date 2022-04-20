import { useUser } from "@auth0/nextjs-auth0";
import { EventDB } from "@prisma/client";
import { GetServerSideProps } from "next";
import { ReactElement } from "react";
import Event from "../components/events/Event";
import Layout from "../components/layout/Layout";
import { useEvents } from "../hooks/useData";

interface QuestionsProps {
  initialEvents: EventDB[];
}

const Questions = ({ initialEvents }: QuestionsProps) => {
  // const { user } = useUser();
  // const { data: events, handleUpdateData: handleUpdateEvent } =
  //   useEvents(initialEvents);

  return (
    <>
      {/* <Event
        key={events[0].id}
        event={events[0]}
        firstPage={false}
        onUpdateEvent={handleUpdateEvent}
      /> */}
    </>
  );
};

Questions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { id } = context.query;
//   try {
//     const events = await tableEvents.select().firstPage();
//     const event = events.filter((item) => item.id === id);
//     return {
//       props: {
//         initialEvents: getMinifiedRecords(event),
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return {
//       props: {
//         error: "Ooops! Something went wrong",
//       },
//     };
//   }
// };

export default Questions;
