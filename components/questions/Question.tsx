import { useUser } from "@auth0/nextjs-auth0";
import { QuestionDB } from "@prisma/client";
import classNames from "classnames";
import Image from "next/image";
import { FC } from "react";
import classes from "../../styles/Question.module.css";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "../../utils/localStorage/localStorage";
import BtnDelete from "../buttons/btnDelete";

interface QuestionProps {
  question: QuestionDB;
  eventAuthorId: string;
  onUpdateQuestion: (question: QuestionDB) => void;
  onDeleteEvent: (id: string) => void;
}

const Question: FC<QuestionProps> = ({
  question,
  eventAuthorId,
  onUpdateQuestion,
  onDeleteEvent,
}) => {
  const { user } = useUser();

  const localStorage: string = `${process.env
    .NEXT_PUBLIC_LOCAL_STORAGE_QUESTION_LIKE!}_${question.id}`;
  const questionLiked = getFromLocalStorage(localStorage);

  const handleUpdateLikes = async () => {
    if (questionLiked) {
      removeFromLocalStorage(localStorage);
      await onUpdateQuestion({ ...question, likes: question.likes - 1 });
    } else {
      setToLocalStorage(localStorage, "liked");
      await onUpdateQuestion({ ...question, likes: question.likes + 1 });
    }
  };

  return (
    <li className={classes.question__item}>
      {(question.userId === user?.sub || eventAuthorId === user?.sub) && (
        <BtnDelete
          id={question.id}
          style={classes.question__button}
          onDelete={onDeleteEvent}
        />
      )}
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
        <div className={classes.question__likes} onClick={handleUpdateLikes}>
          <div
            className={classNames(classes.question__like, {
              [classes.question__like_not]: !questionLiked,
              [classes.question__like_yes]: questionLiked,
            })}
          ></div>
          <div className={classes.question__likescounter}>{question.likes}</div>
        </div>
      </div>
    </li>
  );
};

export default Question;
