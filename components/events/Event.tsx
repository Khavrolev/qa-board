import classNames from "classnames";
import classes from "./Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import EventDate from "./EventDate";
import { ChangeEvent, FC } from "react";
import debounce from "lodash.debounce";
import { isArray, isString } from "../../utils/guards/Type";
import { EventsData } from "../../utils/airtable/Interfaces";
import { DateType } from "../../utils/enums/Event";
import { useUser } from "@auth0/nextjs-auth0";

const DEBOUNCE_TIMEOUT = 1000;

interface EventProps {
  event: EventsData;
  onUpdateEvent: (event: EventsData) => void;
  onDeleteEvent: (id: string) => void;
}

const Event: FC<EventProps> = ({ event, onUpdateEvent, onDeleteEvent }) => {
  const { user } = useUser();

  const handleChangeName = debounce(
    (changeEvent: ChangeEvent<HTMLInputElement>) => {
      onUpdateEvent({
        id: event.id,
        fields: { ...event.fields, name: changeEvent.target.value },
      });
    },
    DEBOUNCE_TIMEOUT,
  );

  return (
    <li className={classes.events__item}>
      <div className={classes.events__title}>
        <input
          type="text"
          disabled={!user}
          className={classes.events__name}
          defaultValue={isString(event.fields.name) ? event.fields.name : ""}
          onChange={(event) => handleChangeName(event)}
        />
        {user?.sub === event.fields?.userId && (
          <button
            className={classes.events__button}
            onClick={() => onDeleteEvent(event.id)}
          >
            Delete
          </button>
        )}
      </div>
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
      <div className={classes.events__qacounter}>
        {`Questions: ${
          isArray<string>(event.fields.questions)
            ? event.fields.questions?.length
            : 0
        }`}
      </div>
    </li>
  );
};

export default Event;
