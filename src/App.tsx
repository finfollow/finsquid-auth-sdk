/* eslint-disable react-hooks/exhaustive-deps */
import dataProvider, { axiosInstance } from "@refinedev/simple-rest";
import LoginComponent from "components/LoginComponent";
import { Refine } from "@refinedev/core";
import { LoginComponentType } from "components/LoginComponent/LoginComponent";
import { ConfigProvider, theme } from "antd";
import "@refinedev/antd/dist/reset.css";
import "./i18n";
import "./styles.css";
import svSE from "antd/locale/sv_SE";
import enUS from "antd/locale/en_US";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const API_URL = "http://localhost:3000";

function App() {
  const { i18n } = useTranslation();
  const searchParams = new URLSearchParams(document.location.search);
  const type = searchParams.get("type") as LoginComponentType;
  const radioBtns = searchParams.get("radio-buttons");
  axiosInstance.defaults.headers.common = {
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
      <Refine dataProvider={dataProvider(API_URL)}>
        {!!type && (
          <LoginComponent type={type} radioBtns={radioBtns === "true"} />
        )}
      </Refine>
    </ConfigProvider>
  );
}

export default App;
