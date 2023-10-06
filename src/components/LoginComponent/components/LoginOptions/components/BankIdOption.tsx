import { Button, Image, Space, theme } from "antd";
import { StepT, steps } from "components/LoginComponent/constants";
import { useLoginIsSameDevice, useIsLoginWithSSN } from "utils/state-utils";

export default function BankIdOption({
  setNextStep,
  withSSN = false,
}: {
  setNextStep: (step: StepT) => void;
  withSSN?: boolean;
}) {
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
      <Button
        type="primary"
        block
        style={{
          height: 40,
          borderRadius: 20,
          position: "relative",
        }}
        onClick={() => onSubmit(true)}
      >
        Same Device
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
        style={{
          height: 40,
          borderRadius: 20,
          borderColor: token.colorPrimary,
          borderWidth: 2,
        }}
        onClick={() => onSubmit(false)}
      >
        Other Device
      </Button>
    </Space>
  );
}
