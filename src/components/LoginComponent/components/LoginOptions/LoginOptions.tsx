import { Space, Typography } from "antd";
import BankLogo from "components/BankLogo";
import { useLoginProvider } from "utils/state-utils";
import { StepT } from "../../constants";
import BankIdOption from "./components/BankIdOption";

type Props = {
  setNextStep: (step: StepT) => void;
};

export default function LoginOptions({ setNextStep }: Props) {
  const [provider] = useLoginProvider();

  return (
    <>
      <Space size={"middle"}>
        <BankLogo src={provider?.iconUrl} />
        <Typography.Text>
          Connect your bank accounts with BankID and find all account
          information.
        </Typography.Text>
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
