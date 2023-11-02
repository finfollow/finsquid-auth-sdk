import { Button, Image, theme } from "antd";
import CardContentWrapper from "src/components/CardContentWrapper";
import CardTitle from "src/components/CardTitle";
import { bankIdInit } from "src/gateway-api/gateway-service";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { sendPostMessage } from "src/utils/helpers";
import {
  useConnectionSSN,
  useIsLoginWithSSN,
  useLoginIsSameDevice,
  useLoginProvider,
} from "src/utils/state-utils";

type Props = {
  onSuccess: () => void;
};

export default function OpenBankId({ onSuccess }: Props) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [provider, setProvider] = useLoginProvider();
  const [isSameDevice] = useLoginIsSameDevice();
  const [isWithSNNConnection] = useIsLoginWithSSN();
  const [ssn] = useConnectionSSN();
  const [autostartToken, setAutostartToken] = useState<string | null>(null);
  const [showRetryBtn, setShowRetryBtn] = useState(false);
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
      } else if (res.status === "conflict") {
        setShowRetryBtn(true);
      } else throw "There is no start token or session id";
    } catch (error) {
      console.error("bankIdInit error:", error);
      sendPostMessage({
        type: "error",
        error: { type: t("error.Bank init error"), message: error },
      });
      setShowRetryBtn(true);
    } finally {
      setIsLoading(false);
    }
  };

  const isAndroid = /Android/i.test(navigator.userAgent);

  return (
    <CardContentWrapper>
      <CardTitle text="Connect Bank" />
      {!showRetryBtn ? (
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
      ) : (
        <Button
          loading={isLoading}
          block
          onClick={() => {
            setShowRetryBtn(false);
            init();
          }}
          style={{ borderColor: token.colorPrimary }}
        >
          {t("button.Try again")}
        </Button>
      )}
    </CardContentWrapper>
  );
}
