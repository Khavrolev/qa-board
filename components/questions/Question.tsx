import { QuestionDB } from "@prisma/client";
import Image from "next/image";
import { FC } from "react";
import classes from "../../styles/Question.module.css";

interface QuestionProps {
  question: QuestionDB;
}
const Question: FC<QuestionProps> = ({ question }) => {
  return (
    <li className={classes.question__item}>
      <div className={classes.question__username}>{question.userName}</div>
      <div className={classes.question__text}>{question.text}</div>
      <div className={classes.question__bottom}>
        <div className={classes.question__time}>
          <Image
            className={classes.question__clocks}
            src="/img/time.png"
            alt="time"
            width={14}
            height={14}
          />
          <div className={classes.question__left}>
            {new Date(question.createdAt).toLocaleString("ru-RU")}
          </div>
        </div>
        <div className={classes.question__likes}>5 лайков</div>
      </div>
    </li>
  );
};

export default Question;
