import { useAccounts } from "gateway-api/gateway-service";
import {
  ProviderT,
  useConnectedProviders,
  useLoginProvider,
  useTransferingProvider,
} from "utils/state-utils";
import { Button, Space, Typography, theme } from "antd";
import { useEffect } from "react";
import Loader from "components/Loader";
import { errorNotifier } from "utils/helpers";
import { useTranslation } from "react-i18next";
import CardContentWrapper from "components/CardContentWrapper";
import CardTitle from "components/CardTitle";

type Props = {
  onBack: () => void;
  onSubmit?: () => void;
};

export default function SuccessConnect({ onSubmit, onBack }: Props) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const searchParams = new URLSearchParams(document.location.search);
  const [provider, setProvider] = useLoginProvider();
  const [_cp, setConnectedProviders] = useConnectedProviders();
  const [_tp, setTransferingProvider] = useTransferingProvider();
  const { isFetching, data, error } = useAccounts(provider?.sid);
  const accountsNumber = data?.accounts.length || 0;
  const isPluralAccounts = accountsNumber > 1;

  useEffect(() => {
    // @TODO handle the case if there are no any accounts
    if (onSubmit && data?.accounts.length) {
      setTransferingProvider(provider as ProviderT);
      onSubmit();
    }
    if (!onSubmit && data?.accounts.length) {
      setConnectedProviders((prev) => [...prev, provider as ProviderT]);
      setProvider(null);
      if (window.parent) {
        window.parent.postMessage(
          JSON.stringify({ type: "success", data: provider, error: null }),
          "*"
        );
      }
    }
  }, [data?.accounts]);

  useEffect(() => {
    if (error)
      errorNotifier({
        description: (
          <pre>
            Fetch accounts error:{"\n"}
            {JSON.stringify(error, null, 2)}
          </pre>
        ),
      });
  }, [error]);

  const handleSubmit = () => {
    const redirectLink = searchParams.get("redirect");
    if (redirectLink) window.parent.location.href = redirectLink;
  };

  if (isFetching) {
    return (
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
        }}
      >
        <CardTitle text="Bank successfully connected!" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <CardContentWrapper>
      <CardTitle text="Bank successfully connected!" />
      <Space direction="vertical" style={{ alignItems: "center", gap: 0 }}>
        <Typography.Text style={{ fontWeight: "bold" }}>
          {accountsNumber}{" "}
          {isPluralAccounts
            ? t("SuccessConnect.accounts")
            : t("SuccessConnect.account")}
        </Typography.Text>
        <Typography.Text>
          {isPluralAccounts
            ? t("SuccessConnect.were successfully connected")
            : t("SuccessConnect.was successfully connected")}
        </Typography.Text>
        <Typography.Text>{t("SuccessConnect.from your bank!")}</Typography.Text>
      </Space>
      <Space direction="vertical" style={{ marginTop: 50 }}>
        {!onSubmit && (
          <Button
            block
            style={{ borderColor: token.colorPrimary }}
            onClick={onBack}
          >
            {t("button.Add Bank")}
          </Button>
        )}
        <Button
          type="primary"
          block
          onClick={() => (onSubmit ? onSubmit() : handleSubmit())}
        >
          {t("button.Done")}
        </Button>
      </Space>
    </CardContentWrapper>
  );
}
