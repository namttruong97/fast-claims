import RootLayout from "@components/Layout/RootLayout";
import "@styles/global.css";
import theme from "@util/theme";
import { ConfigProvider } from "antd";
import { UserStateProvider } from "stores/UserStateContext";

function MyApp({ Component, pageProps }) {
  return (
    <ConfigProvider theme={theme}>
      <UserStateProvider {...pageProps}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </UserStateProvider>
    </ConfigProvider>
  );
}

export default MyApp;
