import { Button, Grid, Space, Typography, theme } from "antd";
import { ColumnsType } from "antd/es/table";
import StyledTable from "src/components/StyledTable";
import { Position } from "src/gateway-api/types";
import { useAccountPositions } from "src/gateway-api/gateway-service";
import { useEffect, useMemo } from "react";
import {
  categorizePositionsByType,
  currencyValue,
  sendPostMessage,
} from "src/utils/helpers";
import {
  useTransferingAccount,
  useTransferingPrositions,
  useTransferingProvider,
} from "src/utils/state-utils";
import RadioIcon from "./RadioIcon";
import BankLogo from "src/components/BankLogo";
import { useTranslation } from "react-i18next";
import CardContentWrapper from "src/components/CardContentWrapper";
import CardTitle from "src/components/CardTitle";

type Props = {
  onSubmit: () => void;
};

export default function SelectPositions({ onSubmit }: Props) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { xs } = Grid.useBreakpoint();
  const [transferingPositions, setTransferingPositions] =
    useTransferingPrositions();
  const [provider] = useTransferingProvider();
  const [transferingAccount] = useTransferingAccount();
  if (!provider?.sid || !transferingAccount?.providerAccountId)
    return (
      <Typography.Text>
        {t("error.There is no session ID or account ID")}
      </Typography.Text>
    );
  const { isFetching, data, error } = useAccountPositions(
    provider?.sid,
    transferingAccount?.providerAccountId
  );
  const tableData = useMemo(() => categorizePositionsByType(data), [data]);

  useEffect(() => {
    if (error)
      sendPostMessage({
        type: "error",
        error: {
          type: t("error.Account positions fetch error"),
          message: error,
        },
      });
  }, [error]);

  const columns: ColumnsType<{ type?: string; positions: Position[] }> = [
    {
      title: "",
      dataIndex: "type",
      render: (type) => <b>{t(`instrumentType.${type}`)}</b>,
    },
  ];

  return (
    <CardContentWrapper>
      <CardTitle text="Select Positions" />
      <div style={{ width: "100%" }}>
        <Space size={"middle"} style={{ padding: xs ? "0 25px" : 0 }}>
          <BankLogo src={provider?.iconUrl} />
          <Typography.Text>
            {t("Select which positions that you would like to transfer.")}
          </Typography.Text>
        </Space>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 20,
            padding: xs ? "0 25px" : 0,
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
                {t("Bank")}
              </Typography.Text>{" "}
              <Typography.Text
                style={{ display: "block", lineHeight: "inherit" }}
              >
                {t("Account")}
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
              {t("button.Select all")}
            </Button>
          ) : !!data?.length && transferingPositions.length === data?.length ? (
            <Button
              onClick={() => setTransferingPositions([])}
              style={{
                height: 40,
                borderRadius: 20,
                borderColor: token.colorPrimary,
              }}
            >
              {t("button.Unselect all")}
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
          style={{ cursor: "pointer" /* height: xs ? height * 0.4 : 400 */ }}
          containerStyle={{ marginTop: 20, borderRadius: xs ? 0 : 10 }}
          // scroll={{ x: true, y: xs ? height * 0.4 : 400 }}
          expandable={{
            expandedRowRender: (record) => {
              const columns: ColumnsType<Position> = [
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
        style={{ marginTop: 30, borderColor: token.colorPrimary }}
        onClick={onSubmit}
      >
        {t("button.Next")}
      </Button>
    </CardContentWrapper>
  );
}
