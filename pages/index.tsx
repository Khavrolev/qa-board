import { ReactElement, useState } from "react";
import { UserProvider } from "@auth0/nextjs-auth0";
import Layout from "../components/layout/Layout";
import { GetServerSideProps } from "next";
import { getMinifiedRecords, tableEvents } from "./api/utils/airtable/Airtable";
import { EventsData } from "./api/utils/airtable/Interfaces";
import Event from "../components/events/Event";
import classes from "../styles/Page.module.css";
import classNames from "classnames";
import { useEvents } from "../hooks/useEvents";

interface PageProps {
  initialEvents: EventsData[];
  error: string;
}

const Page = ({ initialEvents }: PageProps) => {
  const { events, handleCreateEvent, handleUpdateEvent, handleDeleteEvent } =
    useEvents(initialEvents);

  return (
    <ul className={classNames(classes.main__events, classes.events)}>
      {events.map((event) => (
        <Event
          key={event.id}
          event={event}
          onUpdateEvent={handleUpdateEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      ))}
    </ul>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProvider>
      <Layout>{page}</Layout>
    </UserProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const events = await tableEvents.select().firstPage();
    return {
      props: {
        initialEvents: getMinifiedRecords(events),
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

export default Page;
