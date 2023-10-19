import { Button, Grid, Space, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import StyledTable from "components/StyledTable";
import { AccountOverview, AccountType } from "gateway-api/types";
import { useAccounts } from "gateway-api/gateway-service";
import {
  currencyValue,
  errorNotifier,
  getNameFromTwoValues,
  tablesSort,
  transformAccountType,
} from "utils/helpers";
import {
  useTransferingAccount,
  useTransferingProvider,
} from "utils/state-utils";
import RadioIcon from "../RadioIcon";
import BankLogo from "components/BankLogo";
import { useEffect } from "react";
import "./styles.css";
import { useTranslation } from "react-i18next";
import CardContentWrapper from "components/CardContentWrapper";
import CardTitle from "components/CardTitle";

type Props = {
  onSubmit: () => void;
  radioBtns?: boolean;
};

export default function SelectAccount({ onSubmit, radioBtns }: Props) {
  const { t } = useTranslation();
  const { xs } = Grid.useBreakpoint();
  const [provider] = useTransferingProvider();
  const [transferingAccount, setTransferingAccount] = useTransferingAccount();
  const { isFetching, data, error } = useAccounts(provider?.sid);
  const isTransferableAccount = (type?: AccountType) =>
    ["ISK", "AF"].includes(type || "");

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

  const columns: ColumnsType<AccountOverview> = [
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

  if (radioBtns)
    columns.unshift({
      title: "",
      key: "select",
      render: (_, acc) => (
        <RadioIcon
          selected={
            acc.providerAccountId === transferingAccount?.providerAccountId
          }
          disabled={!["ISK", "AF"].includes(acc.type || "")}
        />
      ),
    });

  return (
    <>
      <CardTitle text="Select Account" />
      <CardContentWrapper>
        <div style={{ width: "100%" }}>
          <Space size={"middle"} style={{ padding: xs ? "0 25px" : 0 }}>
            <BankLogo src={provider?.iconUrl} />
            <Typography.Text>
              {t("Choose which account you would like to transfer.")}
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
              onClick: () => {
                if (isTransferableAccount(acc.type)) {
                  if (radioBtns)
                    setTransferingAccount((prev) =>
                      prev?.providerAccountId === acc.providerAccountId
                        ? null
                        : acc
                    );
                  else {
                    setTransferingAccount(acc);
                    onSubmit();
                  }
                }
              },
            })}
            rowClassName={(acc) =>
              !radioBtns && !isTransferableAccount(acc.type)
                ? "disabled-row"
                : ""
            }
            // scroll={{ x: true, y: xs ? height * 0.4 : 400 }}
          />
        </div>
        {radioBtns && (
          <Button
            type="primary"
            block
            disabled={!transferingAccount}
            onClick={onSubmit}
            style={{ marginTop: 30 }}
          >
            {t("button.Next")}
          </Button>
        )}
      </CardContentWrapper>
    </>
  );
}
