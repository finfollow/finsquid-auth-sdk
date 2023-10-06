/* eslint-disable react-hooks/exhaustive-deps */
import dataProvider, { axiosInstance } from "@refinedev/simple-rest";
import LoginComponent from "components/LoginComponent";
import { Refine } from "@refinedev/core";
import { LoginComponentType } from "components/LoginComponent/LoginComponent";
import { ConfigProvider, theme } from "antd";
import "@refinedev/antd/dist/reset.css";

const API_URL = "http://localhost:3000";

function App() {
  const searchParams = new URLSearchParams(document.location.search);
  const type = searchParams.get("type") as LoginComponentType;
  const radioBtns = searchParams.get("radio-buttons");
  axiosInstance.defaults.headers.common = {
    Authorization: `Bearer ${searchParams.get("api_key")}`,
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#7D00FF",
          colorBgContainer: "#FFFFFF",
          colorBgLayout: "#F5F7FE",
        },
      }}
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
