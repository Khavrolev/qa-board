import classNames from "classnames";
import { EventsData } from "../../pages/api/utils/airtable/Interfaces";
import { isArray, isString } from "../../pages/api/utils/guards/Type";
import classes from "./Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import EventDate from "./EventDate";
import { ChangeEvent, FC } from "react";
import debounce from "lodash.debounce";

const DEBOUNCE_TIMEOUT = 1000;

interface EventProps {
  event: EventsData;
  onUpdateEvent: (event: EventsData) => void;
  onDeleteEvent: (id: string) => void;
}

const Event: FC<EventProps> = ({ event, onUpdateEvent, onDeleteEvent }) => {
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
          className={classes.events__name}
          defaultValue={isString(event.fields.name) ? event.fields.name : ""}
          onChange={(event) => handleChangeName(event)}
        />
        <button
          className={classNames(
            classes.events__button,
            classes.events__button_delete,
          )}
          onClick={() => onDeleteEvent(event.id)}
        >
          Delete
        </button>
      </div>
      <div className={classNames(classes.events__dates, classes.dates)}>
        <EventDate
          event={event}
          onUpdateEvent={onUpdateEvent}
          type="Start"
          date={isString(event.fields.start) ? event.fields.start : ""}
        />
        <EventDate
          event={event}
          onUpdateEvent={onUpdateEvent}
          type="End"
          date={isString(event.fields.end) ? event.fields.end : ""}
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
