import { Image } from "antd";

type Props = {
  src?: string;
  style?: React.CSSProperties;
};

export default function BankLogo({ src, style }: Props) {
  return (
    <Image
      src={src}
      preview={false}
      style={{
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        border: "1px solid #D9DBE2",
        background: "#fff",
        objectFit: "contain",
        ...style,
      }}
    />
  );
}
