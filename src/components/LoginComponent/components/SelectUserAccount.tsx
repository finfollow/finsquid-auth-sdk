import { Button, Select, Space, Typography } from "antd";
import Loader from "components/Loader";
import { UserAccount } from "gateway-api/types";
import {
  getUserAccounts,
  selectUserAccount,
} from "gateway-api/gateway-service";
import { useEffect, useState } from "react";
import { errorNotifier } from "utils/helpers";
import { useLoginProvider } from "utils/state-utils";

type Props = {
  onSuccess: () => void;
};

export default function SelectUserAccount({ onSuccess }: Props) {
  const [provider] = useLoginProvider();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectLoading, setIsSelectLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [useraccounts, setUseraccounts] = useState<UserAccount[] | null>(null);

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
    } catch (err) {
      console.error("fetch useraccounts error:", err);
      errorNotifier({
        description: (
          <pre>
            Fetch user accounts error:{"\n"}
            {JSON.stringify(err, null, 2)}
          </pre>
        ),
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
    } catch (err) {
      console.error("select useraccount error:", err);
      errorNotifier({
        description: (
          <pre>
            Select user account error:{"\n"}
            {JSON.stringify(err, null, 2)}
          </pre>
        ),
      });
    } finally {
      setIsSelectLoading(false);
    }
  };

  if (isLoading)
    return (
      <Space
        direction="vertical"
        style={{ alignItems: "center", marginTop: 100 }}
      >
        <Loader />
      </Space>
    );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography.Text style={{ width: 250 }}>
        You have more than one user accounts with this bank. Select which one
        that you would like to connect.
      </Typography.Text>
      <Select
        value={selectedAccount}
        style={{ width: 250, height: 48, marginTop: 30 }}
        placeholder={"-- Select --"}
        loading={isSelectLoading}
        onChange={setSelectedAccount}
        options={useraccounts?.map((el) => ({
          value: el.accountId,
          label: el.accountName,
        }))}
      />
      <Button
        type="primary"
        block
        loading={isSelectLoading}
        disabled={!selectedAccount}
        style={{ height: 40, marginTop: 50, borderRadius: 20 }}
        onClick={() => selectedAccount && selectAccount(selectedAccount)}
      >
        Next
      </Button>
    </div>
  );
}
