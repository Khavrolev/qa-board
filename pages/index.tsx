import { ReactElement, useState } from "react";
import {
  getAccessToken,
  getSession,
  UserProvider,
  useUser,
} from "@auth0/nextjs-auth0";
import Layout from "../components/layout/Layout";
import { GetServerSideProps } from "next";
import Event from "../components/events/Event";
import classes from "../styles/Page.module.css";
import classNames from "classnames";
import { useEvents } from "../hooks/useEvents";
import { isString } from "../utils/guards/Type";
import { getMinifiedRecords, tableEvents } from "../utils/airtable/Airtable";
import { EventsData } from "../utils/airtable/Interfaces";

interface PageProps {
  initialEvents: EventsData[];
  error: string;
}

const Page = ({ initialEvents }: PageProps) => {
  const { user } = useUser();
  const { events, handleCreateEvent, handleUpdateEvent, handleDeleteEvent } =
    useEvents(initialEvents);
  const [showOldEvents, setShowOldEvents] = useState(false);

  const sortEvents = (prev: EventsData, cur: EventsData) => {
    if (isString(prev.fields?.start) && isString(cur.fields?.start)) {
      return new Date(prev.fields.start) >= new Date(cur.fields?.start)
        ? 1
        : -1;
    }
    return 0;
  };

  const filterEvents = (event: EventsData) => {
    if (isString(event.fields?.end) && !showOldEvents) {
      return (
        new Date(event.fields.end) >= new Date(new Date().setHours(0, 0, 0, 0))
      );
    }
    return true;
  };

  return (
    <>
      <div className={classes.main__head}>
        <label className={classes.main__label}>
          Show old events:{" "}
          <input
            className={classes.main__checkbox}
            type="checkbox"
            checked={showOldEvents}
            onChange={() => setShowOldEvents(!showOldEvents)}
          />
        </label>
        {user && (
          <button
            className={classes.main__button}
            onClick={() =>
              handleCreateEvent({
                name: "New event",
                start: new Date().toString(),
                end: new Date().toString(),
              })
            }
          >
            Add event
          </button>
        )}
      </div>
      <ul className={classNames(classes.main__events, classes.events)}>
        {events
          .sort((prev, cur) => sortEvents(prev, cur))
          .filter((event) => filterEvents(event))
          .map((event) => (
            <Event
              key={event.id}
              event={event}
              onUpdateEvent={handleUpdateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          ))}
      </ul>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProvider>
      <Layout>{page}</Layout>
    </UserProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
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
