import { useQuery } from "@tanstack/react-query";
import { Button, Image, Space, Typography } from "antd";
import Loader from "components/Loader";
import { pollBankIdStatus } from "gateway-api/gateway-service";
import { useLoginProvider } from "utils/state-utils";

type Props = {
  onSuccess: () => void;
  onRetry: () => void;
};

export default function WaitingConnection({ onSuccess, onRetry }: Props) {
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
    enabled: !!provider?.sid,
  });

  // @TODO handle all status accordingly
  if (
    bankIdStatusPulling.isFetchedAfterMount &&
    bankIdStatusPulling.data?.status !== "pending" &&
    bankIdStatusPulling.data?.status !== "complete"
  )
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography.Text>Something went wrong.</Typography.Text>
        <Button
          type="primary"
          block
          style={{
            height: 40,
            borderRadius: 20,
            position: "relative",
            marginTop: 30,
          }}
          onClick={onRetry}
        >
          Try again
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
            src="BankID_logo_white.svg"
          />
        </Button>
      </div>
    );

  return (
    <Space
      direction="vertical"
      style={{ alignItems: "center", marginTop: 100 }}
    >
      {bankIdStatusPulling.data?.status === "pending" && <Loader />}
    </Space>
  );
}
