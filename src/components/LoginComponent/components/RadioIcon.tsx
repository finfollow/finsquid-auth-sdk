import { theme } from "antd";

type Props = {
  selected: boolean;
  disabled?: boolean;
  size?: number | string;
  square?: boolean;
};

export default function RadioIcon({
  selected,
  disabled,
  size = 20,
  square,
}: Props) {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: !square ? "50%" : 0,
        border: `1px solid ${
          disabled ? "rgba(0,0,0,0.04)" : token.colorPrimary
        }`,
        background: selected
          ? token.colorPrimary
          : disabled
          ? token.colorBgLayout
          : undefined,
      }}
    />
  );
}
