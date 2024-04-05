import RootLayout from "@/components/Layout/RootLayout";
import { ConfigProvider, theme } from "antd";
import { UserStateProvider } from "../../stores/UserStateContext";
import "../styles/global.css";

function MyApp({ Component, pageProps }: { Component: any, pageProps: any }) {
  return (
    <ConfigProvider theme={theme as any}>
      <UserStateProvider {...pageProps}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </UserStateProvider>
    </ConfigProvider>
  );
}

export default MyApp;
