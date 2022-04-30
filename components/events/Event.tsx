import classes from "./Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import EventDate from "./EventDate";
import { ChangeEvent, FC } from "react";
import debounce from "lodash.debounce";
import { DateType } from "../../utils/enums/event";
import Image from "next/image";
import ReactTextareaAutosize from "react-textarea-autosize";
import { EventDB } from "@prisma/client";
import ButtonDelete from "../buttons/ButtonDelete";
import { useSession } from "next-auth/react";
import { Roles } from "../../utils/enums/user";
import { isString } from "../../utils/guards/type";

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

  const changeable = session?.user.role === Roles.Admin;
  const questionsCounter = event?._count.questions;

  return (
    <div className={classes.event}>
      {changeable && firstPage && (
        <ButtonDelete
          id={event.id}
          style={classes.event__button}
          onDelete={onDeleteEvent}
        />
      )}
      <ReactTextareaAutosize
        disabled={!changeable}
        className={classes.event__name}
        defaultValue={isString(event.name) ? event.name : ""}
        onClick={(clickEvent) => clickEvent.stopPropagation()}
        onChange={handleChangeName}
      />
      <div className={classes.event__dates}>
        <div className={classes.event__date}>
          <EventDate
            event={event}
            firstPage={firstPage}
            onUpdateEvent={onUpdateEvent}
            type={DateType.Start}
            changeable={changeable}
          />
        </div>
        <div className={classes.event__date}>
          <EventDate
            event={event}
            firstPage={firstPage}
            onUpdateEvent={onUpdateEvent}
            type={DateType.End}
            changeable={changeable}
          />
        </div>
      </div>
      <div
        className={classes.event__creator}
      >{`Creator: ${event.userName}`}</div>
      <div className={classes.event__questions}>
        <div className={classes.event__qacounter}>
          {`Questions: ${questionsCounter}`}
        </div>
        {questionsCounter >= HOT_TOPIC_AMOUNT && (
          <Image
            className={classes.event__hot}
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
