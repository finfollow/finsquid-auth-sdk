import { LoadingOutlined } from "@ant-design/icons";
import { Image, theme } from "antd";

export default function Loader({
  size = 65,
  color,
}: {
  size?: number;
  color?: string;
}) {
  const { token } = theme.useToken();
  return (
    // @TODO here comes the finsquid loader after it will be done
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src="/FinSquid_icon.svg"
        alt="Finsquid"
        preview={false}
        style={{
          width: 0.6 * size,
          height: 0.6 * size,
        }}
      />
      <LoadingOutlined
        spin
        style={{
          fontSize: size,
          color: color || token.colorPrimary,
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />
    </div>
  );
}
