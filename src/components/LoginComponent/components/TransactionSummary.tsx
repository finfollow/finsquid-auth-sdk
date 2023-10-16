import { Button, Grid, Image, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import StyledTable from "components/StyledTable";
import { Position } from "gateway-api/types";
import { categorizePositionsByType, currencyValue } from "utils/helpers";
import {
  useReceivingAccount,
  useTransferingAccount,
  useTransferingPrositions,
  useTransferingProvider,
} from "utils/state-utils";
import useScreenSize from "utils/useScreenSize";
import { SwapOutlined } from "@ant-design/icons";
import BankLogo from "components/BankLogo";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: () => void;
};

export default function TransactionSummary({ onSubmit }: Props) {
  const { t } = useTranslation();
  const { height } = useScreenSize();
  const { xs } = Grid.useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);
  const [tProvider] = useTransferingProvider();
  const [tAccount] = useTransferingAccount();
  const [receivingAccount] = useReceivingAccount();
  const [tPositions] = useTransferingPrositions();
  const tableHeight = xs ? height * 0.3 : 300;

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(onSubmit, 1000);
  };

  const columns: ColumnsType<{ type?: string; positions: Position[] }> = [
    {
      title: "",
      dataIndex: "type",
      render: (type) => <b>{t(`instrumentType.${type}`)}</b>,
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              flex: 0.4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <BankLogo
              src={tProvider?.iconUrl}
              style={{ marginBottom: 8, width: 55, height: 55 }}
            />
            <Typography.Text>{tProvider?.displayName}</Typography.Text>
            <Typography.Text>
              <b>{tAccount?.name}</b>
            </Typography.Text>
          </div>
          <div style={{ display: "flex", flex: 0.2, justifyContent: "center" }}>
            <SwapOutlined style={{ fontSize: 32 }} />
          </div>
          <div
            style={{
              flex: 0.4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 55,
                height: 55,
                borderRadius: "50%",
                border: "1px solid #D9DBE2",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              <Typography.Text style={{ fontSize: 12, lineHeight: 1.1 }}>
                {t("Your logo")}
              </Typography.Text>
            </div>
            <Typography.Text>{receivingAccount?.provider}</Typography.Text>
            <Typography.Text>
              <b>{receivingAccount?.name}</b>
            </Typography.Text>
          </div>
        </div>
        <StyledTable
          tableTitle={t("Details")}
          columns={columns}
          dataSource={categorizePositionsByType(tPositions)}
          style={{ cursor: "pointer", height: tableHeight }}
          containerStyle={{ marginTop: 10, borderRadius: xs ? 0 : 10 }}
          scroll={{ x: true, y: tableHeight }}
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
              ];

              return (
                <StyledTable columns={columns} dataSource={record.positions} />
              );
            },
            defaultExpandAllRows: true,
          }}
        />
      </div>
      <Button type={"primary"} block onClick={handleSubmit} loading={isLoading}>
        {t("button.Confirm Transfer")}
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
    </div>
  );
}
