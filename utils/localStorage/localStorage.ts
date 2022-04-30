import { LOCAL_STORAGE_QUESTION_LIKES } from "../const";

export const getFromLocalStorage = (key: string) => {
  const likes = getLikes();

  return likes[key] ? true : false;
};

export const setToLocalStorage = (key: string) => {
  const likes = getLikes();
  likes[key] = true;

  updateLikes(likes);
};

export const removeFromLocalStorage = (key: string) => {
  const likes = getLikes();
  delete likes[key];

  updateLikes(likes);
};

const getLikes = () =>
  parseLocalStorage(localStorage.getItem(LOCAL_STORAGE_QUESTION_LIKES));

const updateLikes = (likes: any) =>
  localStorage.setItem(LOCAL_STORAGE_QUESTION_LIKES, JSON.stringify(likes));

const parseLocalStorage = (item: string | null) => {
  if (!item) {
    return {};
  }

  return JSON.parse(item);
};
