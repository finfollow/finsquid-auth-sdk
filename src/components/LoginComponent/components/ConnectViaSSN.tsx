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
      <div style={{ width: 232, marginTop: 20 }}>
        <Typography.Text>
          Type in you Social Security Number (Personnummer) below.
        </Typography.Text>
      </div>
      <div style={{ margin: "40px 0" }}>
        <Input
          value={ssn}
          onChange={(e) => setSsn(e.target.value)}
          placeholder="YYYYMMDDXXXX"
          style={{ width: 232, height: 40, textAlign: "center" }}
          onPressEnter={onSubmit}
        />
      </div>
      <Button
        type={"primary"}
        disabled={!Personnummer.valid(ssn)}
        block
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
              top: -25,
              left: 20,
            }}
            src="BankID_logo_white.svg"
          />
        )}
      </Button>
    </>
  );
}
