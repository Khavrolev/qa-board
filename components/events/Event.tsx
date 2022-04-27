import classNames from "classnames";
import classes from "../../styles/events/Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import EventDate from "./EventDate";
import { ChangeEvent, FC, MouseEvent, useMemo } from "react";
import debounce from "lodash.debounce";
import { isString } from "../../utils/guards/Type";
import { DateType } from "../../utils/enums/Event";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import { EventDB } from "@prisma/client";
import BtnDelete from "../buttons/btnDelete";
import { useSession } from "next-auth/react";

const DEBOUNCE_TIMEOUT = 1000;
const HOT_TOPIC_AMOUNT = 10;

interface EventProps {
  event: EventDB & {
    _count: {
      questions: number;
    };
  };
  firstPage: boolean;
  onUpdateEvent: (event: EventDB, includeQuestions: boolean) => void;
  onDeleteEvent?: (id: string) => void;
}

const Event: FC<EventProps> = ({
  event,
  firstPage,
  onUpdateEvent,
  onDeleteEvent,
}) => {
  const { data: session } = useSession();

  const handleChangeName = debounce(
    (changeEvent: ChangeEvent<HTMLTextAreaElement>) => {
      onUpdateEvent({ ...event, name: changeEvent.target.value }, !firstPage);
    },
    DEBOUNCE_TIMEOUT,
  );

  const changeable = useMemo(
    () => session?.user.id === event.userId,
    [session?.user.id, event.userId],
  );

  const questionsCounter = event?._count.questions;

  return (
    <div className={classes.events__item}>
      {changeable && firstPage && (
        <BtnDelete
          id={event.id}
          style={classes.events__button}
          onDelete={onDeleteEvent}
        />
      )}
      <ReactTextareaAutosize
        disabled={!changeable}
        className={classes.events__name}
        defaultValue={isString(event.name) ? event.name : ""}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onChange={handleChangeName}
      />
      <div className={classNames(classes.events__dates, classes.dates)}>
        <EventDate
          event={event}
          firstPage={firstPage}
          onUpdateEvent={onUpdateEvent}
          type={DateType.Start}
          changeable={changeable}
        />
        <EventDate
          event={event}
          firstPage={firstPage}
          onUpdateEvent={onUpdateEvent}
          type={DateType.End}
          changeable={changeable}
        />
      </div>
      <div
        className={classes.events__creator}
      >{`Creator: ${event.userName}`}</div>
      <div className={classes.events__questions}>
        <div className={classes.events__qacounter}>
          {`Questions: ${questionsCounter}`}
        </div>
        {questionsCounter >= HOT_TOPIC_AMOUNT && (
          <Image
            className={classes.events__hot}
            src="/img/hot_topic.png"
            alt="comemnts"
            width={16}
            height={16}
          />
        )}
      </div>
    </div>
  );
};

export default Event;
