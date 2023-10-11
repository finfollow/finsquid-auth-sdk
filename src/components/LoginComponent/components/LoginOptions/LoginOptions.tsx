import { Space, Typography } from "antd";
import BankLogo from "components/BankLogo";
import { useLoginProvider } from "utils/state-utils";
import { StepT } from "../../constants";
import BankIdOption from "./components/BankIdOption";
import { useTranslation } from "react-i18next";

type Props = {
  setNextStep: (step: StepT) => void;
};

export default function LoginOptions({ setNextStep }: Props) {
  const { t } = useTranslation();
  const [provider] = useLoginProvider();

  return (
    <>
      <Space
        size={"middle"}
        direction="vertical"
        style={{ alignItems: "center" }}
      >
        <BankLogo src={provider?.iconUrl} style={{ width: 100, height: 100 }} />
        <div style={{ width: 220, textAlign: "center", marginTop: 20 }}>
          <Typography.Text>
            {t(
              "Connect your bank accounts with BankID and find all account information."
            )}
          </Typography.Text>
        </div>
      </Space>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 50,
        }}
      >
        {provider?.loginOptions?.map((option) => {
          switch (option.loginMethod) {
            case "bankid":
              if (!!option.params?.find((el) => el.name === "sameDevice")) {
                return (
                  <BankIdOption
                    key={option.loginMethod}
                    setNextStep={setNextStep}
                  />
                );
              }
              return null;
            case "bankidSSN":
              if (!!option.params?.find((el) => el.name === "userId")) {
                return (
                  <BankIdOption
                    key={option.loginMethod}
                    setNextStep={setNextStep}
                    withSSN
                  />
                );
              }
              return null;
            default:
              return null;
          }
        })}
      </div>
    </>
  );
}
