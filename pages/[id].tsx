import { ReactElement } from "react";
import Layout from "../components/layout/Layout";
import { EventData } from "../utils/airtable/Interfaces";

interface QuestionsProps {
  event: EventData;
}

const Questions = ({ event }: QuestionsProps) => {
  return <div>Hello world</div>;
};

Questions.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Questions;
