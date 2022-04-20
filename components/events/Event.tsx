import classNames from "classnames";
import classes from "../../styles/Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import EventDate from "./EventDate";
import { ChangeEvent, FC, MouseEvent } from "react";
import debounce from "lodash.debounce";
import { isArray, isString } from "../../utils/guards/Type";
import { DateType } from "../../utils/enums/Event";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import Link from "next/link";
import { EventDB, QuestionDB } from "@prisma/client";

const DEBOUNCE_TIMEOUT = 1000;
const HOT_TOPIC_AMOUNT = 10;

interface EventProps {
  event: EventDB & {
    questions: QuestionDB[];
  };
  firstPage: boolean;
  onUpdateEvent: (event: EventDB) => void;
  onDeleteEvent?: (id: string) => void;
}

const Event: FC<EventProps> = ({
  event,
  firstPage,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const { user } = useUser();

  const handleChangeName = debounce(
    (changeEvent: ChangeEvent<HTMLTextAreaElement>) => {
      onUpdateEvent({ ...event, name: changeEvent.target.value });
    },
    DEBOUNCE_TIMEOUT,
  );

  const handleDeleteEvent = (clickEvent: MouseEvent<HTMLButtonElement>) => {
    clickEvent.stopPropagation();
    if (onDeleteEvent !== undefined) {
      onDeleteEvent(event.id);
    }
  };

  return (
    <Link href={firstPage ? `/${event.id}` : `#`} passHref>
      <li className={classes.events__item}>
        {user?.sub === event.userId && firstPage && (
          <button
            className={classNames("button", classes.events__button)}
            onClick={handleDeleteEvent}
          >
            <svg style={{ width: "15px", height: "15px" }} viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </button>
        )}
        <ReactTextareaAutosize
          disabled={user?.sub !== event.userId}
          className={classes.events__name}
          defaultValue={isString(event.name) ? event.name : ""}
          onClick={(clickEvent) => clickEvent.stopPropagation()}
          onChange={handleChangeName}
        />
        <div className={classNames(classes.events__dates, classes.dates)}>
          <EventDate
            event={event}
            onUpdateEvent={onUpdateEvent}
            type={DateType.Start}
          />
          <EventDate
            event={event}
            onUpdateEvent={onUpdateEvent}
            type={DateType.End}
          />
        </div>
        <div
          className={classes.events__creator}
        >{`Creator: ${event.userName}`}</div>
        <div className={classes.events__questions}>
          <div className={classes.events__qacounter}>
            {`Questions: ${event.questions.length}`}
          </div>
          {event.questions.length >= HOT_TOPIC_AMOUNT && (
            <Image
              className={classes.events__hot}
              src="/img/hot_topic.png"
              alt="comemnts"
              width={16}
              height={16}
            />
          )}
        </div>
      </li>
    </Link>
  );
};

export default Event;
