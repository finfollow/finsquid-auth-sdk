import { ChangeEvent, useEffect, useState } from "react";
import { Button, Grid, Input, List, theme } from "antd";
import BankListItem from "./BankListItem";
import { SearchOutlined } from "@ant-design/icons";
import { useLoginProvider } from "utils/state-utils";
import { useProviders } from "gateway-api/gateway-service";
import { Provider } from "gateway-api/types";
import { errorNotifier, tablesSort } from "utils/helpers";
import { useTranslation } from "react-i18next";

type Props = {
  onSubmit: () => void;
  radioBtns?: boolean;
};

export default function SelectProvider({ onSubmit, radioBtns }: Props) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { lg, xs } = Grid.useBreakpoint();
  const { data, isFetching, error } = useProviders();
  const [banks, setBanks] = useState<Provider[]>([]);
  const [provider, setProvider] = useLoginProvider();

  useEffect(() => {
    setBanks(
      data?.sort((a, b) => tablesSort(a.displayName, b.displayName)) || []
    );
  }, [data]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setBanks(
      (data || []).filter((el) =>
        el.displayName?.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );

  useEffect(() => {
    if (error)
      errorNotifier({
        description: (
          <pre>
            Fetch Providers error:{"\n"}
            {JSON.stringify(error, null, 2)}
          </pre>
        ),
      });
  }, [error]);

  return (
    <>
      <div
        style={{
          padding: lg ? "0 70px 40px 70px" : "0 40px 30px 40px",
        }}
      >
        <Input
          onChange={handleSearch}
          style={{ borderRadius: 24, height: 48, width: 200 }}
          prefix={<SearchOutlined style={{ fontSize: 22 }} />}
        />
      </div>
      <div style={{ flex: "auto" }}>
        <List
          size={xs ? "small" : "default"}
          dataSource={banks}
          loading={isFetching}
          rowKey={"id"}
          renderItem={(item) => (
            <BankListItem
              item={item}
              onClick={() => {
                setProvider((prev) =>
                  radioBtns ? (item.name !== prev?.name ? item : null) : item
                );
                if (!radioBtns) onSubmit();
              }}
              selected={radioBtns ? item.name === provider?.name : undefined}
            />
          )}
          bordered
          style={{
            width: 300,
            height: "60vh",
            overflow: "scroll",
            background: token.colorBgContainer,
            borderRadius: 0,
          }}
        />
      </div>
      {radioBtns && (
        <Button
          type="primary"
          disabled={!provider}
          block
          style={{ height: 40, borderRadius: 20 }}
          onClick={onSubmit}
        >
          {t("button.Next")}
        </Button>
      )}
    </>
  );
}
