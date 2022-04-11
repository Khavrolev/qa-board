import { ReactElement } from "react";
import { UserProvider, useUser } from "@auth0/nextjs-auth0";
import Layout from "../components/layout/Layout";

const Page = () => {
  return <div>Hello world!</div>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProvider>
      <Layout>{page}</Layout>
    </UserProvider>
  );
};

export default Page;
