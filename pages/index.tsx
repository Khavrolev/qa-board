import { ReactElement, useState } from "react";
import Layout from "../components/layout/Layout";
import { GetServerSideProps } from "next";
import Event from "../components/events/Event";
import classes from "../styles/events/Events.module.css";
import classNames from "classnames";
import { useEvents } from "../hooks/useEvents";
import { isString } from "../utils/guards/Type";
import prisma from "../utils/prisma/prisma";
import { EventDB } from "@prisma/client";
import Link from "next/link";
import ErrorFetching from "../components/errors/ErrorFetching";
import { useSession } from "next-auth/react";

interface EventsProps {
  initialEvents: (EventDB & {
    _count: {
      questions: number;
    };
  })[];
}

const Events = ({ initialEvents }: EventsProps) => {
  const { data: session } = useSession();
  const {
    events,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    errorFetching,
    handleResetError,
  } = useEvents(initialEvents);
  const [showOldEvents, setShowOldEvents] = useState(false);

  const filterEvents = (event: EventDB) => {
    if (isString(event.end) && !showOldEvents) {
      return new Date(event.end) >= new Date(new Date().setHours(0, 0, 0, 0));
    }
    return true;
  };
  console.log(session);
  return (
    <Layout>
      {errorFetching && (
        <div className={classNames(classes.main__error, classes.error)}>
          <ErrorFetching
            errorMessage={errorFetching}
            onClick={handleResetError}
          />
        </div>
      )}
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
        {session?.user && (
          <button
            className={classNames(
              "button",
              "button_padding",
              classes.main__button,
            )}
            onClick={() =>
              handleCreateEvent({
                name: "New event",
                start: new Date(),
                end: new Date(),
              })
            }
          >
            Add event
          </button>
        )}
      </div>
      <ul className={classNames(classes.main__events, classes.events)}>
        {events.filter(filterEvents).map((event) => (
          <Link key={event.id} href={`/${event.id}`} passHref>
            <li className={classes.events__link}>
              <Event
                event={event}
                firstPage={true}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            </li>
          </Link>
        ))}
      </ul>
    </Layout>
  );
};

Events.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const events = await prisma.eventDB.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { end: "asc" },
    });
    return {
      props: {
        initialEvents: JSON.parse(JSON.stringify(events)),
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};

export default Events;
