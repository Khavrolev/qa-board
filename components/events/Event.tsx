import classNames from "classnames";
import moment from "moment";
import "moment/locale/ru";
import { EventsData } from "../../pages/api/utils/airtable/Interfaces";
import { isArray, isString } from "../../pages/api/utils/guards/Type";
import classes from "./Event.module.css";

interface EventProps {
  event: EventsData;
}

const Event = ({ event }: EventProps) => {
  return (
    <li className={classes.events__item}>
      <div className={classes.events__title}>
        <div className={classes.events__name}>
          {isString(event.fields.name) && event.fields.name}
        </div>
        <button className={classes.events__delete}>Delete</button>
      </div>
      <div className={classes.events__dates}>
        <div
          className={classNames(
            classes.events__date,
            classes.events__date_start,
          )}
        >
          {isString(event.fields.start) &&
            `Start: ${moment(event.fields.start).format("LLL")}`}
        </div>
      </div>
      <div
        className={classNames(classes.events__date, classes.events__date_end)}
      >
        {isString(event.fields.end) &&
          `End: ${moment(event.fields.end).format("LLL")}`}
      </div>
      <div className={classes.events__qacounter}>
        {isArray<string>(event.fields.questions) &&
          `Questions: ${event.fields.questions?.length}`}
      </div>
    </li>
  );
};

export default Event;
