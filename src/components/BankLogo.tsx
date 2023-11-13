import { Image } from "antd";

type Props = {
  src?: string;
  size?: string | number;
  style?: React.CSSProperties;
};

export default function BankLogo({ src, size = "3rem", style }: Props) {
  return (
    <Image
      src={src}
      preview={false}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1px solid #D9DBE2",
        background: "#fff",
        objectFit: "contain",
        ...style,
      }}
    />
  );
}
