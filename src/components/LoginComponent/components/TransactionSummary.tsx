import { Button, Grid, Image, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import StyledTable from "components/StyledTable";
import { Position } from "gateway-api/types";
import { categorizePositionsByType, currencyValue } from "utils/helpers";
import {
  useLoginProvider,
  useReceivingAccount,
  useTransferingAccount,
  useTransferingPrositions,
  useTransferingProvider,
} from "utils/state-utils";
import useScreenSize from "utils/useScreenSize";
import { SwapOutlined } from "@ant-design/icons";
import BankLogo from "components/BankLogo";

type Props = {
  onSubmit: () => void;
};

export default function TransactionSummary({ onSubmit }: Props) {
  const searchParams = new URLSearchParams(document.location.search);
  const { height } = useScreenSize();
  const { xs } = Grid.useBreakpoint();
  const [_, setLoginProvider] = useLoginProvider();
  const [tProvider, setTransferingProvider] = useTransferingProvider();
  const [tAccount, setTransferingAccount] = useTransferingAccount();
  const [receivingAccount, setReceivingAccount] = useReceivingAccount();
  const [tPositions, setTransferingPositions] = useTransferingPrositions();
  const tableHeight = xs ? height * 0.3 : 300;

  const handleSubmit = () => {
    const redirectLink = searchParams.get("redirect");
    if (redirectLink) window.parent.location.href = redirectLink;
    else {
      setLoginProvider(null);
      setTransferingProvider(null);
      setTransferingAccount(null);
      setReceivingAccount(null);
      setTransferingPositions([]);
      onSubmit();
    }
  };

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <div style={{ flex: 0.4 }}>
            <Typography.Text>From</Typography.Text>
            <div style={{ display: "flex", marginTop: 14 }}>
              <BankLogo src={tProvider?.iconUrl} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  padding: "0 12px",
                }}
              >
                <Typography.Text>{tProvider?.displayName}</Typography.Text>
                <Typography.Text>
                  <b>{tAccount?.name}</b>
                </Typography.Text>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flex: 0.2, justifyContent: "center" }}>
            <SwapOutlined style={{ fontSize: 32 }} />
          </div>
          <div style={{ flex: 0.4, paddingLeft: 8 }}>
            <Typography.Text>To</Typography.Text>
            <div style={{ display: "flex", marginTop: 14 }}>
              <div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 23,
                    border: "1px solid #D9DBE2",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    textAlign: "center",
                    fontSize: 12,
                  }}
                >
                  <Typography.Text style={{ fontSize: 12 }}>
                    Your logo
                  </Typography.Text>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  padding: "0 12px",
                }}
              >
                <Typography.Text>{receivingAccount?.provider}</Typography.Text>
                <Typography.Text>
                  <b>{receivingAccount?.name}</b>
                </Typography.Text>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Typography.Text>Details</Typography.Text>
          <StyledTable
            columns={columns}
            dataSource={categorizePositionsByType(tPositions)}
            style={{ cursor: "pointer", height: tableHeight }}
            containerStyle={{ marginTop: 10 }}
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
      </div>
      <Button
        type={"primary"}
        block
        style={{
          height: 40,
          borderRadius: 20,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={handleSubmit}
      >
        Confirm Transfer
        <Image
          preview={false}
          style={{
            position: "absolute",
            objectFit: "cover",
            width: 30,
            height: 40,
            top: -20,
            left: 20,
          }}
          src="BankID_logo_white.svg"
        />
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
