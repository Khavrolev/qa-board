import DatePicker from "react-datepicker";
import ru from "date-fns/locale/ru";
import classes from "./Event.module.css";
import "react-datepicker/dist/react-datepicker.css";
import { FC, MouseEvent } from "react";
import { DateType } from "../../utils/enums/event";
import { EventDB } from "@prisma/client";
import classNames from "classnames";

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
  const minDate = type === DateType.End ? new Date(event.start) : undefined;
  const maxDate = type === DateType.Start ? new Date(event.end) : undefined;
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

  const handleClickOnDate = (clickEvent: MouseEvent<HTMLDivElement>) => {
    if (changeable) {
      clickEvent.stopPropagation();
    }
  };

  return (
    <div className={classes.date}>
      <div className={classes.date__desc}>{`${type}:`}</div>
      <div
        className={classNames(classes.date__item, {
          [classes.date__item_changeable]: changeable,
        })}
        onClick={handleClickOnDate}
      >
        <DatePicker
          calendarClassName={classes.date__calendar}
          disabled={!changeable}
          selected={new Date(currentDate)}
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
    </div>
  );
};

export default EventDate;
