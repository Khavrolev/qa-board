import { QuestionDB } from "@prisma/client";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import classes from "./Question.module.css";
import {
  getFromLocalStorage,
  toggleInLocalStorage,
} from "../../utils/localStorage/localStorage";
import ButtonDelete from "../buttons/ButtonDelete";
import { Roles } from "../../utils/enums/user";
import { UpdateQuestionDB } from "../../utils/api/interfaces";
import { UpdateLikeType } from "../../utils/enums/question";

interface QuestionProps {
  question: QuestionDB;
  onUpdateQuestion: (question: UpdateQuestionDB) => void;
  onDeleteEvent: (id: string) => void;
}

const Question: FC<QuestionProps> = ({
  question,
  onUpdateQuestion,
  onDeleteEvent,
}) => {
  const { data: session } = useSession();

  const [liked, setLiked] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(getFromLocalStorage(question.id));
  }, [question.id]);

  const handleUpdateLikes = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    toggleInLocalStorage(question.id, liked);
    await onUpdateQuestion({
      id: question.id,
      type: liked ? UpdateLikeType.Decrement : UpdateLikeType.Increment,
    });
    setLiked((liked) => !liked);
    setLoading(false);
  };

  return (
    <li className={classes.question}>
      {(question.userId === session?.user.id ||
        session?.user.role === Roles.Admin) && (
        <ButtonDelete
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
