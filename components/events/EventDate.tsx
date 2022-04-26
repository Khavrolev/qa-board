import classNames from "classnames";
import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import classes from "../../styles/events/Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { FC } from "react";
import { isString } from "../../utils/guards/Type";
import { DateType } from "../../utils/enums/Event";
import { EventDB } from "@prisma/client";

interface EventDateProps {
  event: EventDB;
  firstPage: boolean;
  onUpdateEvent: (event: EventDB, includeQuestions: boolean) => void;
  type: DateType;
  changeable: boolean;
}

const EventDate: FC<EventDateProps> = ({
  event,
  firstPage,
  onUpdateEvent,
  type,
  changeable,
}) => {
  const currentDate = event[type];
  const minDate =
    type === DateType.End
      ? new Date(isString(event.start) ? event.start : "")
      : undefined;
  const maxDate =
    type === DateType.Start
      ? new Date(isString(event.end) ? event.end : "")
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
      onClick={(clickEvent) => clickEvent.stopPropagation()}
    >
      <div className={classes.dates__desc}>{`${type}:`}</div>
      <DatePicker
        className={classNames(classes.dates__date, {
          [classes.dates__date_disabled]: !changeable,
        })}
        calendarClassName={classes.dates__calendar}
        disabled={!changeable}
        selected={isString(currentDate) ? new Date(currentDate) : undefined}
        withPortal
        showTimeSelect
        dateFormat="Pp"
        locale={ru}
        filterTime={filterTime}
        minDate={minDate}
        maxDate={maxDate}
        onChange={(date) =>
          date && onUpdateEvent({ ...event, [type]: date }, !firstPage)
        }
      />
    </div>
  );
};

export default EventDate;
