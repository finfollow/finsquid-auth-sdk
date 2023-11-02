import { Button, Space, Typography } from "antd";
import CardContentWrapper from "src/components/CardContentWrapper";
import { useTranslation } from "react-i18next";
import {
  useLoginProvider,
  useReceivingAccount,
  useTransferingAccount,
  useTransferingPrositions,
  useTransferingProvider,
} from "src/utils/state-utils";

type Props = {
  onSubmit: () => void;
};

export default function FinalResult({ onSubmit }: Props) {
  const { t } = useTranslation();
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
    <CardContentWrapper>
      <Typography.Title>{t("Thank you")}</Typography.Title>
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
          {t("button.Back to start")}
        </Button>
      </Space>
    </CardContentWrapper>
  );
}
