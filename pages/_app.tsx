import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Modal from "react-modal";

export default function App({ Component, pageProps }: AppProps) {
  Modal.setAppElement("#__next");
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
