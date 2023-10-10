import { Button, QRCode, QRCodeProps, Typography, theme } from "antd";
import { useEffect, useState } from "react";
import { bankIdInit, pollBankIdStatus } from "gateway-api/gateway-service";
import { useQuery } from "@tanstack/react-query";
import {
  useConnectionSSN,
  useIsLoginWithSSN,
  useLoginIsSameDevice,
  useLoginProvider,
} from "utils/state-utils";
import { errorNotifier } from "utils/helpers";

type Props = {
  onSuccess: () => void;
  onCancel: () => void;
};

export default function ScanQrCode({ onSuccess, onCancel }: Props) {
  const { token } = theme.useToken();
  const [ssn] = useConnectionSSN();
  const [qrCode, setQrCode] = useState("bankid");
  const [qrStatus, setQrStatus] = useState<QRCodeProps["status"]>("loading");
  const [sid, setSid] = useState<string | null>(null);
  const [provider, setProvider] = useLoginProvider();
  const [isWithSNNConnection] = useIsLoginWithSSN();
  const [isSameDevice] = useLoginIsSameDevice();
  //@TODO handle this case
  if (!provider) return null;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!provider.name) return;
    try {
      const res = await bankIdInit(
        provider.name,
        isWithSNNConnection ? ssn : undefined,
        isSameDevice
      );

      if (res.imageChallengeData && res.sid) {
        setSid(res.sid);
        setQrCode(res.imageChallengeData);
        setQrStatus("active");
        if (bankIdStatusPulling.isFetchedAfterMount)
          bankIdStatusPulling.refetch();
      } else throw "There is no qr code data or session id";
    } catch (err) {
      console.error("bankIdInit error:", err);
      errorNotifier({
        description: (
          <pre>
            Fetch accounts error:{"\n"}
            {JSON.stringify(err, null, 2)}
          </pre>
        ),
      });
    }
  };

  const bankIdStatusPulling = useQuery({
    queryKey: ["bankIdStatus", sid],
    queryFn: () => pollBankIdStatus(sid as string, false, true),
    refetchInterval: (data) => {
      if (data?.imageChallengeData) setQrCode(data.imageChallengeData);
      if (data?.status === "complete") {
        setProvider({ ...provider, sid });
        onSuccess();
      }
      return data?.status == "pending" ? 1000 : false;
    },
    onError: () => setQrStatus("expired"),
    enabled: !!sid,
  });

  useEffect(() => {
    // @TODO handle all status accordingly
    if (
      bankIdStatusPulling.isFetchedAfterMount &&
      bankIdStatusPulling.data?.status !== "pending" &&
      bankIdStatusPulling.data?.status !== "complete"
    )
      setQrStatus("expired");
  }, [
    bankIdStatusPulling.isFetchedAfterMount,
    bankIdStatusPulling.data?.status,
  ]);

  return (
    <div
      style={{ display: "flex", alignItems: "center", flexDirection: "column" }}
    >
      <Typography.Text>1. Open the BankID app in your mobile.</Typography.Text>
      <Typography.Text>2. Click at the QR-code button.</Typography.Text>
      <Typography.Text>3. Scan the QR-code below.</Typography.Text>
      <div
        style={{
          margin: 40,
          background: token.colorBgContainer,
          borderRadius: 8,
        }}
      >
        <QRCode
          value={qrCode}
          status={qrStatus}
          style={{ background: token.colorBgContainer }}
          onRefresh={init}
        />
      </div>
      <Button
        block
        style={{ borderColor: token.colorPrimary }}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
}
