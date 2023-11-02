import { useQuery } from "@tanstack/react-query";
import { Button, Image, Space, Typography, theme } from "antd";
import CardContentWrapper from "src/components/CardContentWrapper";
import CardTitle from "src/components/CardTitle";
import Loader from "src/components/Loader";
import { pollBankIdStatus } from "src/gateway-api/gateway-service";
import { useTranslation } from "react-i18next";
import { sendPostMessage } from "src/utils/helpers";
import { useLoginProvider } from "src/utils/state-utils";

type Props = {
  onSuccess: () => void;
  onRetry: () => void;
  onCancel: () => void;
};

export default function WaitingConnection({
  onSuccess,
  onRetry,
  onCancel,
}: Props) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [provider] = useLoginProvider();
  //@TODO handle this case
  if (!provider) return null;

  const bankIdStatusPulling = useQuery({
    queryKey: ["bankIdStatus", provider?.sid],
    queryFn: () => pollBankIdStatus(provider?.sid as string, true, true),
    refetchInterval: (data) => {
      if (data?.status === "complete") {
        onSuccess();
      }
      return data?.status == "pending" ? 1000 : false;
    },
    onError: (error) => {
      sendPostMessage({
        type: "error",
        error: {
          type: t("error.Bank id status pulling error"),
          message: error,
        },
      });
    },
    enabled: !!provider?.sid,
  });

  // @TODO handle all status accordingly
  if (
    bankIdStatusPulling.isFetchedAfterMount &&
    bankIdStatusPulling.data?.status !== "pending" &&
    bankIdStatusPulling.data?.status !== "complete"
  )
    return (
      <CardContentWrapper>
        <CardTitle text="Waiting for authentication" />
        <Typography.Text>{t("error.Something went wrong.")}</Typography.Text>
        <Button
          type="primary"
          block
          style={{ marginTop: 30 }}
          onClick={onRetry}
        >
          {t("button.Try again")}
          <Image
            preview={false}
            style={{
              objectFit: "cover",
              position: "absolute",
              width: 30,
              height: 40,
              top: -25,
              left: 10,
            }}
            src="bankID_logo_white.svg"
          />
        </Button>
      </CardContentWrapper>
    );

  return (
    <CardContentWrapper>
      <CardTitle text="Waiting for authentication" />
      {bankIdStatusPulling.data?.status === "pending" && <Loader />}
      <Button
        block
        style={{ borderColor: token.colorPrimary, marginTop: 30 }}
        onClick={onCancel}
      >
        {t("button.Cancel")}
      </Button>
    </CardContentWrapper>
  );
}
