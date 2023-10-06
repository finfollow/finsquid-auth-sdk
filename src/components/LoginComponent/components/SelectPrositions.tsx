import { Button, Grid, Space, Typography, theme } from "antd";
import { ColumnsType } from "antd/es/table";
import StyledTable from "components/StyledTable";
import { Position } from "gateway-api/types";
import { useAccountPositions } from "gateway-api/gateway-service";
import { useEffect, useMemo } from "react";
import {
  categorizePositionsByType,
  currencyValue,
  errorNotifier,
} from "utils/helpers";
import {
  useTransferingAccount,
  useTransferingPrositions,
  useTransferingProvider,
} from "utils/state-utils";
import useScreenSize from "utils/useScreenSize";
import RadioIcon from "./RadioIcon";
import BankLogo from "components/BankLogo";

type Props = {
  onSubmit: () => void;
};

export default function SelectPrositions({ onSubmit }: Props) {
  const { token } = theme.useToken();
  const { height } = useScreenSize();
  const { xs } = Grid.useBreakpoint();
  const [transferingPositions, setTransferingPositions] =
    useTransferingPrositions();
  const [provider] = useTransferingProvider();
  const [transferingAccount] = useTransferingAccount();
  if (!provider?.sid || !transferingAccount?.providerAccountId)
    return (
      <Typography.Text>There is no session ID or account ID</Typography.Text>
    );
  const { isFetching, data, error } = useAccountPositions(
    provider?.sid,
    transferingAccount?.providerAccountId
  );
  const tableData = useMemo(() => categorizePositionsByType(data), [data]);

  useEffect(() => {
    if (error)
      errorNotifier({
        description: (
          <pre>
            Fetch positions error:{"\n"}
            {JSON.stringify(error, null, 2)}
          </pre>
        ),
      });
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexGrow: 1,
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Space size={"middle"}>
          <BankLogo src={provider?.iconUrl} />
          <Typography.Text>
            Select which positions that you would like to transfer.
          </Typography.Text>
        </Space>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
          }}
        >
          <div style={{ display: "flex" }}>
            <div style={{ paddingRight: 20 }}>
              <Typography.Text
                style={{
                  marginBottom: 4,
                  display: "block",
                  lineHeight: "inherit",
                }}
              >
                Bank:
              </Typography.Text>{" "}
              <Typography.Text
                style={{ display: "block", lineHeight: "inherit" }}
              >
                Account:
              </Typography.Text>
            </div>
            <div>
              <Typography.Text
                style={{
                  marginBottom: 4,
                  display: "block",
                  lineHeight: "inherit",
                }}
              >
                {provider.displayName}
              </Typography.Text>
              <Typography.Text
                style={{ display: "block", lineHeight: "inherit" }}
              >
                {transferingAccount.name}
              </Typography.Text>
            </div>
          </div>
          {!!data?.length && transferingPositions.length !== data.length ? (
            <Button
              type="primary"
              onClick={() => setTransferingPositions(data)}
              style={{
                height: 40,
                borderRadius: 20,
              }}
            >
              Select all
            </Button>
          ) : !!data?.length && transferingPositions.length === data?.length ? (
            <Button
              onClick={() => setTransferingPositions([])}
              style={{
                height: 40,
                borderRadius: 20,
                borderColor: token.colorPrimary,
                borderWidth: 2,
              }}
            >
              Unselect all
            </Button>
          ) : null}
        </div>
        <StyledTable
          loading={isFetching}
          columns={columns}
          dataSource={tableData?.map((el, index) => ({
            ...el,
            key: index.toString(),
          }))}
          style={{ cursor: "pointer", height: xs ? height * 0.4 : 400 }}
          containerStyle={{ marginTop: 20 }}
          scroll={{ x: true, y: xs ? height * 0.4 : 400 }}
          expandable={{
            expandedRowRender: (record) => {
              const columns: ColumnsType<Position> = [
                {
                  title: "",
                  dataIndex: "name",
                  render: (_, pos) => pos.instrument?.name,
                },
                {
                  title: "",
                  dataIndex: "marketValueAC",
                  align: "right",
                  render: (m) => <b>{currencyValue(m)}</b>,
                },
                {
                  title: "",
                  key: "select",
                  width: 20,
                  render: (_, pos) => (
                    <RadioIcon
                      selected={
                        !!transferingPositions.find(
                          (el) => el.instrument.isin === pos.instrument.isin
                        )
                      }
                      size={12}
                      square
                    />
                  ),
                },
              ];

              return (
                <StyledTable
                  columns={columns}
                  dataSource={record.positions}
                  onRow={(pos) => ({
                    onClick: () =>
                      setTransferingPositions((prev) =>
                        transferingPositions.find(
                          (el) => el.instrument.isin === pos.instrument.isin
                        )
                          ? prev.filter(
                              (el) => pos.instrument.isin !== el.instrument.isin
                            )
                          : [...prev, pos]
                      ),
                  })}
                />
              );
            },
            defaultExpandedRowKeys: ["0"],
          }}
        />
      </div>
      <Button
        type="primary"
        block
        disabled={!transferingPositions.length}
        style={{
          height: 40,
          borderRadius: 20,
          borderColor: token.colorPrimary,
          borderWidth: 2,
        }}
        onClick={onSubmit}
      >
        Next
      </Button>
    </div>
  );
}

const columns: ColumnsType<{ type: string; positions: Position[] }> = [
  {
    title: "",
    dataIndex: "type",
    render: (type) => <b>{type}</b>,
  },
];
