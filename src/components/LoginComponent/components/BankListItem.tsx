import { List, Space, Typography } from "antd";
import RadioIcon from "./RadioIcon";
import BankLogo from "src/components/BankLogo";
import { Provider } from "src/gateway-api/types";
import { RightOutlined } from "@ant-design/icons";

export default function BankListItem({
  item,
  selected,
  onClick,
}: {
  item: Provider;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <List.Item
      style={{ cursor: "pointer", paddingLeft: 0, paddingRight: 5 }}
      onClick={onClick}
    >
      <Space size="middle">
        <BankLogo src={item.iconUrl} size={50} />
        <Typography.Text style={{ fontSize: 16 }}>
          <b>{item?.displayName}</b>
        </Typography.Text>
      </Space>
      <div style={{ marginLeft: 15 }}>
        {selected !== undefined ? (
          <RadioIcon selected={selected} />
        ) : (
          <RightOutlined style={{ fontSize: 12 }} />
        )}
      </div>
    </List.Item>
  );
}
