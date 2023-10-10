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
import useScreenSize from "utils/useScreenSize";
import RadioIcon from "../RadioIcon";
import BankLogo from "components/BankLogo";
import { useEffect } from "react";
import "./styles.css";

type Props = {
  onSubmit: () => void;
  radioBtns?: boolean;
};

export default function SelectAccount({ onSubmit, radioBtns }: Props) {
  const { height } = useScreenSize();
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
      title: "Type",
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
      title: "Account",
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
      title: "Amount",
      dataIndex: "totalValue",
      align: "right",
      render: (m) => currencyValue(m),
      sorter: (a, b) => tablesSort(a.totalValue?.amt, b.totalValue?.amt),
    },
  ];

  if (radioBtns)
    columns.push({
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
            Choose the account or individual positions that you would like to
            transfer.
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
            !radioBtns && !isTransferableAccount(acc.type) ? "disabled-row" : ""
          }
          scroll={{ x: true, y: xs ? height * 0.4 : 400 }}
        />
      </div>
      {radioBtns && (
        <Button
          type="primary"
          block
          disabled={!transferingAccount}
          onClick={onSubmit}
        >
          Next
        </Button>
      )}
    </div>
  );
}
