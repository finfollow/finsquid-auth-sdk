import { Grid } from "antd";
import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export default function CardContentWrapper({ children }: Props) {
  const { xs } = Grid.useBreakpoint();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: xs ? 1 : 0,
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
