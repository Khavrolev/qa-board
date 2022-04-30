import { ReactElement, useState } from "react";
import Layout from "../components/layout/Layout";
import { GetServerSideProps } from "next";
import Event from "../components/events/Event";
import classes from "../styles/Events.module.css";
import classNames from "classnames";
import { useEvents } from "../hooks/useEvents";
import { isString } from "../utils/guards/Type";
import prisma from "../utils/prisma/prisma";
import { EventDB } from "@prisma/client";
import Link from "next/link";
import ErrorFetching from "../components/errors/ErrorFetching";
import { useSession } from "next-auth/react";
import { adminRole } from "../utils/const";

interface EventsProps {
  initialEvents: (EventDB & {
    _count: {
      questions: number;
    };
  })[];
}

const Events = ({ initialEvents }: EventsProps) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

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

  return (
    <Layout>
      {session?.user ? (
        <>
          {errorFetching && (
            <div className={classes.main__error}>
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
            {session?.user.role === adminRole && (
              <button
                className={classNames(
                  "button",
                  "button__padding",
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
          <ul className={classes.main__events}>
            {events.filter(filterEvents).map((event) => (
              <Link key={event.id} href={`/${event.id}`} passHref>
                <li className={classes.main__event}>
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
        </>
      ) : (
        <div
          className={classNames(classes.main__notauthorized, {
            [classes.main__loading]: !session?.user && loading,
          })}
        >
          The list of events is only available to authorized users
        </div>
      )}
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
