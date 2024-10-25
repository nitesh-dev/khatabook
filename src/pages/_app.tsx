import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layouts/MainLayout";
import { Provider } from "@/components/ui/provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
