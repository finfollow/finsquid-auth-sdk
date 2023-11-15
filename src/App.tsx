/* eslint-disable react-hooks/exhaustive-deps */
import LoginComponent from "src/components/LoginComponent";
import { LoginComponentType } from "src/components/LoginComponent/LoginComponent";
import { ConfigProvider, theme } from "antd";
import "antd/dist/reset.css";
import "./i18n";
import "./styles.css";
import svSE from "antd/locale/sv_SE";
import enUS from "antd/locale/en_US";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { httpClient } from "./gateway-api/gateway-service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

function App() {
  const { i18n } = useTranslation();
  const searchParams = new URLSearchParams(document.location.search);
  const type = searchParams.get("type") as LoginComponentType;
  const radioBtns = searchParams.get("radio-buttons");
  httpClient.defaults.headers.common = {
    Authorization: `Bearer ${searchParams.get("api_key")}`,
  };
  const themeParams = searchParams.get("theme");
  const clientTheme =
    themeParams && JSON.parse(decodeURIComponent(themeParams));
  const lang = searchParams.get("lang");

  useEffect(() => {
    lang && i18n.changeLanguage(lang);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorBgContainer: "#FFFFFF",
            colorBgLayout: "#F5F7FE",
            ...clientTheme,
          },
          components: {
            Button: {
              ...clientTheme,
            },
          },
        }}
        locale={lang === "en" ? enUS : svSE}
      >
        {!!type && (
          <LoginComponent type={type} radioBtns={radioBtns === "true"} />
        )}
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
