import { ChangeEvent, useEffect, useState } from "react";
import { Button, Grid, Input, List, theme } from "antd";
import BankListItem from "./BankListItem";
import { SearchOutlined } from "@ant-design/icons";
import { useLoginProvider } from "utils/state-utils";
import useScreenSize from "utils/useScreenSize";
import { useProviders } from "gateway-api/gateway-service";
import { Provider } from "gateway-api/types";
import { errorNotifier, tablesSort } from "utils/helpers";

type Props = {
  onSubmit: () => void;
  radioBtns?: boolean;
};

export default function SelectProvider({ onSubmit, radioBtns }: Props) {
  const { token } = theme.useToken();
  const { height } = useScreenSize();
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
      <div style={{ padding: lg ? "0 70px 40px 70px" : "0 40px 30px 40px" }}>
        <Input
          onChange={handleSearch}
          style={{ borderRadius: 20, height: 40 }}
          prefix={<SearchOutlined />}
        />
      </div>
      <div style={{ flex: "auto" }}>
        <List
          size={xs ? "small" : "default"}
          dataSource={banks}
          loading={isFetching}
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
            height: xs ? height * 0.6 : 460,
            overflow: "scroll",
            background: token.colorBgContainer,
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
          Next
        </Button>
      )}
    </>
  );
}
