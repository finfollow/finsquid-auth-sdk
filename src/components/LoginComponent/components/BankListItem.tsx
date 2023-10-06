import { List, Space, Typography } from "antd";
import RadioIcon from "./RadioIcon";
import BankLogo from "components/BankLogo";
import { Provider } from "gateway-api/types";

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
    <List.Item style={{ cursor: "pointer" }} onClick={onClick}>
      <Space>
        <BankLogo src={item.iconUrl} />
        <Typography.Text>{item?.displayName}</Typography.Text>
      </Space>
      {selected !== undefined && <RadioIcon selected={selected} />}
    </List.Item>
  );
}
