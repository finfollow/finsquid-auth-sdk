import { LeftOutlined } from "@ant-design/icons";
import "./styles.css";

type Props = React.HTMLAttributes<HTMLDivElement> & { size?: number };

export default function BackButton(props: Props) {
  return (
    <div className="back-button" {...props}>
      <LeftOutlined style={{ fontSize: props.size || 18 }} />
    </div>
  );
}
