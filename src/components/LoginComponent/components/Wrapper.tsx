import { Grid, theme } from "antd";
import { ReactNode } from "react";
import BackButton from "src/components/BackButton";
import Stepper from "./Stepper";
import { useTranslation } from "react-i18next";

type Props = {
  children?: ReactNode;
  title?: string;
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
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { lg, xs } = Grid.useBreakpoint();

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: token.colorBgLayout,
          padding: xs ? "40px 0" : "50px",
        }}
      >
        {onBack && <BackButton onClick={onBack} />}
        {currentStep !== undefined && (
          <Stepper
            current={currentStep}
            items={steps.map((step) => ({ title: t(`stepper.${step}`) }))}
            containerStyles={{ marginBottom: 24 }}
          />
        )}
        {children}
      </div>
    </div>
  );
}
