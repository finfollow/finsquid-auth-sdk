import { Button, Image } from "antd";
import CardContentWrapper from "components/CardContentWrapper";
import CardTitle from "components/CardTitle";
import { bankIdInit } from "gateway-api/gateway-service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { errorNotifier } from "utils/helpers";
import {
  useConnectionSSN,
  useIsLoginWithSSN,
  useLoginIsSameDevice,
  useLoginProvider,
} from "utils/state-utils";

type Props = {
  onSuccess: () => void;
};

export default function OpenBankId({ onSuccess }: Props) {
  const { t } = useTranslation();
  const [provider, setProvider] = useLoginProvider();
  const [isSameDevice] = useLoginIsSameDevice();
  const [isWithSNNConnection] = useIsLoginWithSSN();
  const [ssn] = useConnectionSSN();
  const [autostartToken, setAutostartToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //@TODO handle this case
  if (!provider) return null;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!provider.name) return;
    try {
      setIsLoading(true);
      const res = await bankIdInit(
        provider.name,
        isWithSNNConnection ? ssn : undefined,
        isSameDevice
      );

      if (res.autostartToken && res.sid) {
        setProvider({ ...provider, sid: res.sid });
        setAutostartToken(res.autostartToken);
      } else throw "There is no start token or session id";
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
    } finally {
      setIsLoading(false);
    }
  };

  const isAndroid = /Android/i.test(navigator.userAgent);

  return (
    <CardContentWrapper>
      <CardTitle text="Connect Bank" />
      <Button
        type={"primary"}
        loading={isLoading}
        disabled={!autostartToken}
        block
        onClick={() => {
          window.open(
            isAndroid
              ? `bankid:///?autostarttoken=${autostartToken}&redirect=null`
              : `https://app.bankid.com/?autostarttoken=${autostartToken}&redirect=null`
          );
          onSuccess();
        }}
      >
        {t("Open BankID")}
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
          src="bankID_logo_white.svg"
        />
      </Button>
    </CardContentWrapper>
  );
}
