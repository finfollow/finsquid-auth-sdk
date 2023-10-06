import { Table, TableProps, Typography, theme } from "antd";
import "./styles.css";

type Props<T = object> = TableProps<T> & {
  tableTitle?: string;
  containerStyle?: React.CSSProperties;
};

export default function StyledTable<T = object>({
  columns,
  dataSource,
  tableTitle,
  pagination = false,
  containerStyle,
  ...props
}: Props<T>) {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        border: "1px solid #D9DBE2",
        borderRadius: 10,
        padding: 10,
        background: token.colorBgContainer,
        ...containerStyle,
      }}
    >
      {!!tableTitle && (
        <Typography.Title level={5} style={{ marginLeft: 8, marginTop: 10 }}>
          {tableTitle}
        </Typography.Title>
      )}
      <Table
        // @ts-ignore
        columns={columns}
        // @ts-ignore
        dataSource={dataSource}
        size="small"
        pagination={pagination}
        {...props}
      />
    </div>
  );
}
