import { Grid, Typography } from "antd";
import { useTranslation } from "react-i18next";

export default function CardTitle({ text }: { text: string }) {
  const { t } = useTranslation();
  const { xs, lg } = Grid.useBreakpoint();

  return (
    <Typography.Title
      level={xs ? 3 : 1}
      style={{
        textAlign: "center",
        marginBottom: lg ? 50 : 40,
        padding: "0 45px",
      }}
    >
      {t(`title.${text}`)}
    </Typography.Title>
  );
}
