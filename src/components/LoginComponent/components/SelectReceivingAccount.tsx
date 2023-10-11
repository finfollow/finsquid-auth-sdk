import { ColumnsType } from "antd/es/table";
import { AccountOverview } from "gateway-api/types";
import {
  currencyValue,
  errorNotifier,
  getNameFromTwoValues,
  tablesSort,
  transformAccountType,
} from "utils/helpers";
import RadioIcon from "./RadioIcon";
import { Button, Grid, Space, Typography } from "antd";
import StyledTable from "components/StyledTable";
import useScreenSize from "utils/useScreenSize";
import { useReceivingAccounts } from "gateway-api/gateway-service";
import {
  useReceivingAccount,
  useTransferingAccount,
  useTransferingProvider,
} from "utils/state-utils";
import BankLogo from "components/BankLogo";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: () => void;
};

export default function SelectReceivingAccount({ onSubmit }: Props) {
  const { t } = useTranslation();
  const { height } = useScreenSize();
  const { xs } = Grid.useBreakpoint();
  const [provider] = useTransferingProvider();
  const [transferingAccount] = useTransferingAccount();
  const [receivingAccount, setReceivingAccount] = useReceivingAccount();
  const { isFetching, data, error } = useReceivingAccounts();

  useEffect(() => {
    if (error)
      errorNotifier({
        description: (
          <pre>
            Fetch receiving accounts error:{"\n"}
            {JSON.stringify(error, null, 2)}
          </pre>
        ),
      });
  }, [error]);

  const columns: ColumnsType<AccountOverview> = [
    {
      title: "",
      key: "select",
      render: (_, acc) => (
        <RadioIcon
          selected={
            acc.providerAccountId === receivingAccount?.providerAccountId
          }
          disabled={transferingAccount?.type !== acc.type}
        />
      ),
    },
    {
      title: t("table.Type"),
      key: "type",
      render: (_, acc) => (
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "50%",
            border: "1px solid #D9DBE2",
            fontSize: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {transformAccountType(acc.type)}
        </div>
      ),
      sorter: (a, b) => tablesSort(a.type, b.type),
    },
    {
      title: t("table.Account"),
      key: "name",
      render: (_, acc) =>
        getNameFromTwoValues(acc.name, acc.providerAccountNumber),
      sorter: (a, b) =>
        tablesSort(
          getNameFromTwoValues(a.name, a.providerAccountNumber),
          getNameFromTwoValues(b.name, b.providerAccountNumber)
        ),
    },
    {
      title: t("table.Amount"),
      dataIndex: "totalValue",
      align: "right",
      render: (m) => currencyValue(m),
      sorter: (a, b) => tablesSort(a.totalValue?.amt, b.totalValue?.amt),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <Space size={"middle"} style={{ padding: xs ? "0 25px" : 0 }}>
          <BankLogo src={provider?.iconUrl} />
          <Typography.Text>
            {t(
              "Select to which account you’d like to transfer your positions. You can only transfer to the same account type as you have your positions currently."
            )}
          </Typography.Text>
        </Space>
        <StyledTable
          loading={isFetching}
          columns={columns}
          dataSource={data?.accounts || []}
          rowKey={(acc) => acc.providerAccountId as string}
          style={{ cursor: "pointer" }}
          containerStyle={{ marginTop: 20, borderRadius: xs ? 0 : 10 }}
          onRow={(acc) => ({
            onClick: () =>
              transferingAccount?.type === acc.type &&
              setReceivingAccount((prev) =>
                prev?.providerAccountId === acc.providerAccountId ? null : acc
              ),
          })}
          scroll={{ x: true, y: xs ? height * 0.4 : 400 }}
        />
      </div>
      <Button
        type="primary"
        block
        disabled={!receivingAccount}
        onClick={onSubmit}
      >
        {t("button.Next")}
      </Button>
    </div>
  );
}
