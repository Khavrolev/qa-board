import { EventDB, QuestionDB } from "@prisma/client";
import { useCallback, useState } from "react";
import {
  fetchCreateEvent,
  fetchDeleteEvent,
  fetchUpdateEvent,
} from "../utils/api/Event";
import { CreateEventDB } from "../utils/api/Interfaces";
import { isString } from "../utils/guards/Type";

export const useEvents = (
  initialData: (EventDB & {
    questions: QuestionDB[];
  })[],
) => {
  const [data, setData] = useState(initialData);

  const sortData = (prev: EventDB, cur: EventDB) => {
    if (isString(prev.start) && isString(cur.start)) {
      return new Date(prev.start) >= new Date(cur.start) ? 1 : -1;
    }
    return 0;
  };

  const handleCreateData = async (data: CreateEventDB) => {
    try {
      const newData = await fetchCreateEvent(data);
      setData((prevData) => [...prevData, newData].sort(sortData));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateData = useCallback(async (data: EventDB) => {
    try {
      const updatedData = await fetchUpdateEvent(data);
      setData((prevData) =>
        prevData
          .map((data) => (data.id === updatedData.id ? updatedData : data))
          .sort(sortData),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleDeleteData = useCallback(async (id: string) => {
    try {
      const deletedData = await fetchDeleteEvent(id);
      setData((prevData) =>
        prevData.filter((data) => data.id !== deletedData.id),
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { data, handleCreateData, handleUpdateData, handleDeleteData };
};
