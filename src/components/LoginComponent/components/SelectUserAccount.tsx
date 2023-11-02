import { Button, Select, Typography } from "antd";
import Loader from "src/components/Loader";
import { UserAccount } from "src/gateway-api/types";
import {
  getUserAccounts,
  selectUserAccount,
} from "src/gateway-api/gateway-service";
import { useEffect, useState } from "react";
import { sendPostMessage } from "src/utils/helpers";
import { useLoginProvider } from "src/utils/state-utils";
import { useTranslation } from "react-i18next";
import CardContentWrapper from "src/components/CardContentWrapper";
import CardTitle from "src/components/CardTitle";

type Props = {
  onSuccess: () => void;
};

export default function SelectUserAccount({ onSuccess }: Props) {
  const { t } = useTranslation();
  const [provider] = useLoginProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectLoading, setIsSelectLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [useraccounts, setUseraccounts] = useState<UserAccount[] | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!provider?.sid) return;
    try {
      setIsLoading(true);
      const _useraccounts = await getUserAccounts(provider.sid);
      console.log("useraccounts: ", _useraccounts);
      if (_useraccounts.length > 1) setUseraccounts(_useraccounts);
      if (_useraccounts.length === 1)
        await selectAccount(_useraccounts[0].accountId);
      if (_useraccounts.length === 0) onSuccess();
    } catch (error) {
      console.error("fetch useraccounts error:", error);
      setIsError(true);
      sendPostMessage({
        type: "error",
        error: { type: t("error.User accounts fetch error"), message: error },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectAccount = async (accountId: string) => {
    if (!provider?.sid) return;
    setIsSelectLoading(true);
    try {
      const res = await selectUserAccount(provider?.sid, accountId);
      console.log("selectAccount res: ", res);
      if (res.status === "complete") onSuccess();
    } catch (error) {
      console.error("select useraccount error:", error);
      sendPostMessage({
        type: "error",
        error: { type: t("error.Select user account error"), message: error },
      });
    } finally {
      setIsSelectLoading(false);
    }
  };

  if (isLoading || isError)
    return (
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
        }}
      >
        <CardTitle text="Connect Bank" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
          }}
        >
          {isLoading && <Loader />}
          {isError && (
            <Button
              type="primary"
              block
              onClick={() => {
                setIsError(false);
                init();
              }}
            >
              {t("button.Try again")}
            </Button>
          )}
        </div>
      </div>
    );

  return (
    <CardContentWrapper>
      <CardTitle text="Connect Bank" />
      <div style={{ width: 250 }}>
        <Typography.Text>
          {t(
            "You have more than one user accounts with this bank. Select which one that you would like to connect."
          )}
        </Typography.Text>
        <Select
          value={selectedAccount}
          style={{ width: 250, height: 48, marginTop: 30 }}
          placeholder={t("placeholder.accountSelect")}
          loading={isSelectLoading}
          onChange={setSelectedAccount}
          options={useraccounts?.map((el) => ({
            value: el.accountId,
            label: el.accountName,
          }))}
        />
      </div>
      <Button
        type="primary"
        block
        loading={isSelectLoading}
        disabled={!selectedAccount}
        style={{ height: 40, marginTop: 50, borderRadius: 20 }}
        onClick={() => selectedAccount && selectAccount(selectedAccount)}
      >
        {t("button.Next")}
      </Button>
    </CardContentWrapper>
  );
}
