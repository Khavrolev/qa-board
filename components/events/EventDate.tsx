import classNames from "classnames";
import { EventsData } from "../../pages/api/utils/airtable/Interfaces";
import { isString } from "../../pages/api/utils/guards/Type";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import classes from "./Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { FC } from "react";

interface DateProps {
  event: EventsData;
  onUpdateEvent: (event: EventsData) => void;
  type: string;
}

const EventDate: FC<DateProps> = ({ event, onUpdateEvent, type }) => {
  const currentDate = event.fields[type.toLowerCase()];

  return (
    <div
      className={classNames(
        classes.dates__item,
        classes[`dates__item_${type.toLowerCase()}`],
      )}
    >
      <div className={classes.dates__desc}>{`${type}:`}</div>
      <DatePicker
        className={classes.dates__date}
        selected={new Date(isString(currentDate) ? currentDate : "")}
        showTimeSelect
        dateFormat="Pp"
        locale={ru}
        onChange={(date) =>
          date &&
          onUpdateEvent({
            id: event.id,
            fields: { ...event.fields, [type.toLowerCase()]: date.toString() },
          })
        }
      />
    </div>
  );
};

export default EventDate;
