import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Modal from "react-modal";
import Layout from "../components/layout/Layout";

export default function App({ Component, pageProps }: AppProps) {
  Modal.setAppElement("#__next");
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
