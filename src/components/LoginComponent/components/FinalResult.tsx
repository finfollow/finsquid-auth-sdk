import { Button, Space, Typography } from "antd";
import {
  useLoginProvider,
  useReceivingAccount,
  useTransferingAccount,
  useTransferingPrositions,
  useTransferingProvider,
} from "utils/state-utils";

type Props = {
  onSubmit: () => void;
};

export default function FinalResult({ onSubmit }: Props) {
  const searchParams = new URLSearchParams(document.location.search);
  const redirectLink = searchParams.get("redirect");
  const [_p, setLoginProvider] = useLoginProvider();
  const [_tPr, setTransferingProvider] = useTransferingProvider();
  const [_tA, setTransferingAccount] = useTransferingAccount();
  const [_tRA, setReceivingAccount] = useReceivingAccount();
  const [_tPos, setTransferingPositions] = useTransferingPrositions();

  const handleSubmit = () => {
    setLoginProvider(null);
    setTransferingProvider(null);
    setTransferingAccount(null);
    setReceivingAccount(null);
    setTransferingPositions([]);
    onSubmit();
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography.Title>Thank you!</Typography.Title>
      <Space direction="vertical" style={{ marginTop: 200 }}>
        {!!redirectLink && (
          <Button
            type={"primary"}
            block
            onClick={() => (window.parent.location.href = redirectLink)}
          >
            Done
          </Button>
        )}
        <Button
          type={redirectLink ? "default" : "primary"}
          block
          onClick={handleSubmit}
        >
          Back to start
        </Button>
      </Space>
    </div>
  );
}
