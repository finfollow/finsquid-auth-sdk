import { ColumnsType } from "antd/es/table";
import { AccountOverview } from "src/gateway-api/types";
import {
  currencyValue,
  getNameFromTwoValues,
  sendPostMessage,
  tablesSort,
  transformAccountType,
} from "src/utils/helpers";
import RadioIcon from "./RadioIcon";
import { Button, Grid, Space, Typography, theme } from "antd";
import StyledTable from "src/components/StyledTable";
import { useReceivingAccounts } from "src/gateway-api/gateway-service";
import {
  useReceivingAccount,
  useTransferingAccount,
  useTransferingProvider,
} from "src/utils/state-utils";
import BankLogo from "src/components/BankLogo";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import CardContentWrapper from "src/components/CardContentWrapper";
import CardTitle from "src/components/CardTitle";

type Props = {
  onSubmit: () => void;
};

export default function SelectReceivingAccount({ onSubmit }: Props) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { xs } = Grid.useBreakpoint();
  const [provider] = useTransferingProvider();
  const [transferingAccount] = useTransferingAccount();
  const [receivingAccount, setReceivingAccount] = useReceivingAccount();
  const { isFetching, data, error } = useReceivingAccounts();

  useEffect(() => {
    if (error)
      sendPostMessage({
        type: "error",
        error: {
          type: t("error.Receiving accounts fetch error"),
          message: error,
        },
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
          {transformAccountType(acc.subType)}
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
    <>
      <CardTitle text="Receiving Account" />
      <CardContentWrapper>
        <div style={{ width: "100%" }}>
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
                transferingAccount?.subType === acc.subType &&
                setReceivingAccount((prev) =>
                  prev?.providerAccountId === acc.providerAccountId ? null : acc
                ),
            })}
            // scroll={{ x: true, y: xs ? height * 0.4 : 400 }}
          />
        </div>
        <Button
          type="primary"
          block
          disabled={!receivingAccount}
          style={{ marginTop: 30, borderColor: token.colorPrimary }}
          onClick={onSubmit}
        >
          {t("button.Next")}
        </Button>
      </CardContentWrapper>
    </>
  );
}
