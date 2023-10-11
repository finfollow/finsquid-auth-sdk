import { Button, Image, Space, theme } from "antd";
import { StepT, steps } from "components/LoginComponent/constants";
import { useTranslation } from "react-i18next";
import { useLoginIsSameDevice, useIsLoginWithSSN } from "utils/state-utils";

export default function BankIdOption({
  setNextStep,
  withSSN = false,
}: {
  setNextStep: (step: StepT) => void;
  withSSN?: boolean;
}) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [_, setIsSameDevice] = useLoginIsSameDevice();
  const [_ssn, setIsWithSNN] = useIsLoginWithSSN();

  const onSubmit = (isSameDevice: boolean) => {
    setIsWithSNN(withSSN);
    setIsSameDevice(isSameDevice);
    if (withSSN) setNextStep(steps.provideSSN);
    else if (isSameDevice) setNextStep(steps.openBankID);
    else setNextStep(steps.scanQRcode);
  };

  return (
    <Space direction="vertical">
      <Button type="primary" block onClick={() => onSubmit(true)}>
        {t("Same Device")}
        <Image
          preview={false}
          style={{
            objectFit: "cover",
            position: "absolute",
            width: 30,
            height: 40,
            top: -25,
            left: 20,
          }}
          src="BankID_logo_white.svg"
        />
      </Button>
      <Button
        block
        style={{ borderColor: token.colorPrimary }}
        onClick={() => onSubmit(false)}
      >
        {t("Other Device")}
      </Button>
    </Space>
  );
}
