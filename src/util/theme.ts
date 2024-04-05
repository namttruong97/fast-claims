// theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    fontSize: 14,
    fontFamily: "Roboto, sans-serif",
    colorPrimary: "#1B387E",
  },
  components: {
    Layout: {
      headerBg: '#1B387E',
    }
  }
};

export default theme;
