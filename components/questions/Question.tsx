import { QuestionDB } from "@prisma/client";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import classes from "../../styles/questions/Question.module.css";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "../../utils/localStorage/localStorage";
import BtnDelete from "../buttons/BtnDelete";

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
  const { data: session } = useSession();

  const localVariable: string = `${process.env
    .NEXT_PUBLIC_LOCAL_STORAGE_QUESTION_LIKE!}_${question.id}`;
  const [liked, setLiked] = useState<boolean>();

  useEffect(() => {
    setLiked(getFromLocalStorage(localVariable) ? true : false);
  }, [localVariable]);

  const handleUpdateLikes = async () => {
    if (liked) {
      removeFromLocalStorage(localVariable);
      await onUpdateQuestion({ ...question, likes: question.likes - 1 });
      setLiked(false);
    } else {
      setToLocalStorage(localVariable, "liked");
      await onUpdateQuestion({ ...question, likes: question.likes + 1 });
      setLiked(true);
    }
  };

  return (
    <li className={classes.question__item}>
      {(question.userId === session?.user.id ||
        eventAuthorId === session?.user.id) && (
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
              [classes.question__like_not]: !liked,
              [classes.question__like_yes]: liked,
            })}
          ></div>
          <div className={classes.question__likescounter}>{question.likes}</div>
        </div>
      </div>
    </li>
  );
};

export default Question;
