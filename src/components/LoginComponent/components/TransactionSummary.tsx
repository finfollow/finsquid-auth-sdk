import { Button, Grid, Image, Typography, theme } from "antd";
import { ColumnsType } from "antd/es/table";
import StyledTable from "src/components/StyledTable";
import { Position } from "src/gateway-api/types";
import { categorizePositionsByType, currencyValue } from "src/utils/helpers";
import {
  useReceivingAccount,
  useTransferingAccount,
  useTransferingPrositions,
  useTransferingProvider,
} from "src/utils/state-utils";
import { SwapOutlined } from "@ant-design/icons";
import BankLogo from "src/components/BankLogo";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CardTitle from "src/components/CardTitle";
import CardContentWrapper from "src/components/CardContentWrapper";

type Props = {
  onSubmit: () => void;
};

export default function TransactionSummary({ onSubmit }: Props) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { xs } = Grid.useBreakpoint();
  const [isLoading, setIsLoading] = useState(false);
  const [tProvider] = useTransferingProvider();
  const [tAccount] = useTransferingAccount();
  const [receivingAccount] = useReceivingAccount();
  const [tPositions] = useTransferingPrositions();

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
    <>
      <CardTitle text="Summary" />
      <CardContentWrapper>
        <div style={{ width: "100%" }}>
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
            <div
              style={{ display: "flex", flex: 0.2, justifyContent: "center" }}
            >
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
            style={{ cursor: "pointer" }}
            containerStyle={{ marginTop: 10, borderRadius: xs ? 0 : 10 }}
            // scroll={{ x: true, y: tableHeight }}
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
                  <StyledTable
                    columns={columns}
                    dataSource={record.positions}
                  />
                );
              },
              defaultExpandAllRows: true,
            }}
          />
        </div>
        <Button
          type={"primary"}
          block
          onClick={handleSubmit}
          loading={isLoading}
          style={{ marginTop: 30, borderColor: token.colorPrimary }}
        >
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
      </CardContentWrapper>
    </>
  );
}
