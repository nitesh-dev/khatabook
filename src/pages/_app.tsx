import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/layouts/MainLayout";
import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/lib/AuthProvider";
import Signout from "@/components/Signout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Provider>
        <Layout>
          <Signout />
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </Provider>
    </AuthProvider>
  );
}
