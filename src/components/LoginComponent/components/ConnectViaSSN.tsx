import { Button, Image, Input, Space, Typography } from "antd";
import {
  useConnectionSSN,
  useLoginIsSameDevice,
  useLoginProvider,
} from "utils/state-utils";
import { StepT, steps } from "../constants";
import BankLogo from "components/BankLogo";
import Personnummer from "personnummer";

type Props = {
  setNextStep: React.Dispatch<React.SetStateAction<StepT>>;
};

export default function ConnectViaSSN({ setNextStep }: Props) {
  const [ssn, setSsn] = useConnectionSSN();
  const [provider] = useLoginProvider();
  const [isSameDevice] = useLoginIsSameDevice();

  //@TODO handle this case
  if (!provider) return null;

  const onSubmit = () => {
    if (isSameDevice) setNextStep(steps.openBankID);
    else setNextStep(steps.scanQRcode);
  };

  return (
    <>
      <Space size={"middle"}>
        <BankLogo src={provider.iconUrl} />
        <Typography.Text>
          Type in you Social Security Number (Personnummer) below.
        </Typography.Text>
      </Space>
      <div style={{ margin: "40px 0" }}>
        <Input
          value={ssn}
          onChange={(e) => setSsn(e.target.value)}
          placeholder="Ex 19850709-9805"
          style={{ borderRadius: 20, height: 40, textAlign: "center" }}
          onPressEnter={onSubmit}
        />
      </div>
      <Button
        type={"primary"}
        disabled={!Personnummer.valid(ssn)}
        block
        style={{
          height: 40,
          borderRadius: 20,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={onSubmit}
      >
        Connect Bank
        {isSameDevice && (
          <Image
            preview={false}
            style={{
              position: "absolute",
              objectFit: "cover",
              width: 30,
              height: 40,
              top: -20,
              left: 20,
            }}
            src="BankID_logo_white.svg"
          />
        )}
      </Button>
    </>
  );
}
