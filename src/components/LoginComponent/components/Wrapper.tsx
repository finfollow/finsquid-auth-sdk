import { Grid, Typography, theme } from "antd";
import { ReactNode } from "react";
import BackButton from "components/BackButton";
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
  const { token } = theme.useToken();
  const { lg, xs } = Grid.useBreakpoint();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: token.colorBgLayout,
          padding: xs ? "40px 0 20px 0" : "50px 50px 20px 50px",
        }}
      >
        {onBack && <BackButton onClick={onBack} />}
        {currentStep !== undefined && (
          <Stepper
            current={currentStep}
            items={steps.map((el) => ({ title: el }))}
            containerStyles={{ marginBottom: 24 }}
          />
        )}
        <Typography.Title
          level={xs ? 3 : 1}
          style={{
            textAlign: "center",
            marginBottom: lg ? 50 : 40,
            padding: "0 45px",
          }}
        >
          {title}
        </Typography.Title>
        {children}
      </div>
    </div>
  );
}
