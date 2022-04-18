import classNames from "classnames";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import classes from "../../styles/Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { FC } from "react";
import { isString } from "../../utils/guards/Type";
import { EventsData } from "../../utils/airtable/Interfaces";
import { DateType } from "../../utils/enums/Event";
import { useUser } from "@auth0/nextjs-auth0";

interface DateProps {
  event: EventsData;
  onUpdateEvent: (event: EventsData) => void;
  type: DateType;
}

const EventDate: FC<DateProps> = ({ event, onUpdateEvent, type }) => {
  const { user } = useUser();

  const currentDate = event.fields[type];
  const minDate =
    type === DateType.End
      ? new Date(isString(event.fields?.start) ? event.fields.start : "")
      : undefined;
  const maxDate =
    type === DateType.Start
      ? new Date(isString(event.fields?.end) ? event.fields.end : "")
      : undefined;
  const filterTime = (time: Date) => {
    if (
      type === DateType.Start &&
      currentDate !== undefined &&
      maxDate !== undefined
    ) {
      return time < maxDate;
    }
    if (
      type === DateType.End &&
      currentDate !== undefined &&
      minDate !== undefined
    ) {
      return time > minDate;
    }
    return true;
  };

  return (
    <div
      className={classNames(
        classes.dates__item,
        classes[`dates__item_${type}`],
      )}
    >
      <div className={classes.dates__desc}>{`${type}:`}</div>
      <DatePicker
        className={classes.dates__date}
        calendarClassName={classes.dates__calendar}
        disabled={user?.sub !== event.fields?.userId}
        selected={isString(currentDate) ? new Date(currentDate) : undefined}
        withPortal
        showTimeSelect
        dateFormat="Pp"
        locale={ru}
        filterTime={filterTime}
        minDate={minDate}
        maxDate={maxDate}
        onChange={(date) =>
          date &&
          onUpdateEvent({
            id: event.id,
            fields: { ...event.fields, [type]: date.toString() },
          })
        }
      />
    </div>
  );
};

export default EventDate;
