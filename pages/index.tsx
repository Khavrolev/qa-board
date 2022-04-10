import { ReactElement } from "react";
import Layout from "../components/layout/Layout";

const Page = () => {
  return <div>Hello world!</div>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Page;
