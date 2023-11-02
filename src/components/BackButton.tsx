import { LeftOutlined } from "@ant-design/icons";
import { Button, Grid } from "antd";
import { ButtonProps } from "antd/lib";

type Props = Omit<ButtonProps & React.RefAttributes<HTMLElement>, "size"> & {
  size?: number;
};

export default function BackButton({ size = 18, ...props }: Props) {
  const { xs } = Grid.useBreakpoint();
  const containerSize = size + 14;
  return (
    <Button
      style={{
        padding: 0,
        position: "absolute",
        top: xs ? 15 : 25,
        left: xs ? 15 : 25,
        width: containerSize,
        height: containerSize,
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      type="text"
      {...props}
    >
      <LeftOutlined style={{ fontSize: size }} />
    </Button>
  );
}
