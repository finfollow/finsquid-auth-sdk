import { Grid, Space, Typography, theme } from "antd";
import { ReactNode } from "react";
import BackButton from "components/BackButton";
import useScreenSize from "utils/useScreenSize";
import Stepper from "./Stepper";

type Props = {
  children?: ReactNode;
  title: string;
  currentStep?: StepsEnum;
  onBack?: () => void;
};

export enum StepsEnum {
  ConnectBank,
  SelectAccount,
  ConfirmTransfer,
}

const steps = ["Connect Bank", "Select Account", "Confirm Transfer"];

export default function Wrapper({
  children,
  title,
  currentStep,
  onBack,
}: Props) {
  const { height, width } = useScreenSize();
  const { token } = theme.useToken();
  const { lg, md, sm, xs } = Grid.useBreakpoint();

  return (
    <Space style={{ display: "flex", justifyContent: "center" }}>
      <div>
        {currentStep !== undefined && (
          <Stepper
            current={currentStep}
            items={steps.map((el) => ({ title: el }))}
            containerStyles={{ marginBottom: 24 }}
          />
        )}
        <div
          style={{
            boxSizing: "border-box",
            position: "relative",
            width: md ? 550 : sm ? 450 : xs ? width : "auto",
            minHeight: 300,
            height: xs ? height - 24 : 780,
            background: token.colorBgLayout,
            borderRadius: 55,
            padding: lg ? "50px 50px 20px 50px" : "40px 25px 20px 25px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {onBack && <BackButton onClick={onBack} />}
          <Typography.Title
            level={xs ? 3 : 1}
            style={{
              textAlign: "center",
              marginBottom: lg ? 50 : 40,
              padding: "0 35px",
            }}
          >
            {title}
          </Typography.Title>
          {children}
        </div>
      </div>
    </Space>
  );
}
