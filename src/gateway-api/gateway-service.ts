import axios, { AxiosInstance } from "axios";
import {
  AccountsOverview,
  BankIdInitQueryParams,
  BankIdRes,
  BankIdStatus,
  LoginStatus,
  Position,
  Provider,
  UserAccount,
} from "./types";
import { useQuery } from "@tanstack/react-query";
import { dummyReceivingAccounts } from "src/components/LoginComponent/constants";

const apiUrl = new URLSearchParams(document.location.search).get("api_url");
const url =
  apiUrl || import.meta.env.VITE_GATEWAY_URL || "http://localhost:8787";

export const httpClient: AxiosInstance = axios.create({
  url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export function useProviders() {
  return useQuery<Provider[]>({
    queryKey: ["providersList"],
    queryFn: () =>
      httpClient(`${url}/v1/providers`)
        .then((res) => res.data)
        .catch((err) => {
          throw err?.response?.data || err;
        }),
  });
}

export async function bankIdInit(
  provider: string,
  ssn?: string,
  sameDevice = true,
  includeRawData = false
): Promise<Partial<BankIdRes>> {
  try {
    const data: BankIdInitQueryParams = {
      includeRawData: includeRawData,
      sameDevice: sameDevice,
    };
    if (ssn) data.userId = ssn;

    const res = await httpClient.post(
      `${url}/v1/login/${provider}/bankid/init
      `,
      data
    );

    const sid = res.headers["sid"];

    return {
      autostartToken: res.data.autostartToken,
      imageChallengeData: res.data.imageChallengeData,
      sid: sid,
      success: true,
    };
  } catch (error: any) {
    console.log("BankID init failed with error: ", error);
    throw error?.response?.data ?? error;
  }
}

export async function pollBankIdStatus(
  sid: string,
  sameDevice: boolean,
  includeRawData = false
): Promise<BankIdStatus> {
  try {
    console.log("pollBankIdStatus params: ", {
      sid,
      sameDevice,
      includeRawData,
    });
    const res = await httpClient(
      `${url}/v1/login/bankid/status?includeRawData=${includeRawData}&sameDevice=${sameDevice}`,
      { headers: { sid } }
    );
    console.log("BankID status", res.data.status);

    return {
      status: res.data.status,
      raw: res.data.raw,
      imageChallengeData: res.data.imageChallengeData,
    };
  } catch (error: any) {
    console.error("BankID status failed", error);
    throw error?.response?.data ?? error;
  }
}

export async function getUserAccounts(
  sid: string,
  includeRawData = false
): Promise<UserAccount[]> {
  try {
    const headers = {
      sid: sid,
    };
    const res = await httpClient(
      `${url}/v1/login/useraccounts?includeRawData=${includeRawData}`,
      { headers: headers }
    );
    return res.data;
  } catch (error: any) {
    console.error("getUserAccounts", error);
    throw error?.response?.data ?? error;
  }
}

export async function selectUserAccount(
  sid: string,
  userAccountId: string,
  includeRawData = false
): Promise<LoginStatus> {
  try {
    const res = await httpClient(
      `${url}/v1/login/useraccounts/select/${userAccountId}?includeRawData=${includeRawData}`,
      { headers: { sid } }
    );
    return res.data;
  } catch (error: any) {
    console.error("getUserAccounts", error);
    throw error?.response?.data ?? error;
  }
}

export function useAccounts(sid?: string | null, includeRawData = false) {
  return useQuery<AccountsOverview>({
    queryKey: ["accounts", sid],
    queryFn: () =>
      httpClient(`${url}/v1/accounts?includeRawData=${includeRawData}`, {
        headers: { sid: sid as string },
      })
        .then((res) => res.data)
        .catch((err) => {
          throw err?.response?.data || err;
        }),
    enabled: !!sid,
  });
}

export function useAccountPositions(
  sid: string,
  accountId: string,
  includeRawData = false
) {
  return useQuery<Position[]>({
    queryKey: ["positions", sid, accountId],
    queryFn: () =>
      httpClient(
        `${url}/v1/accounts/${accountId}/positions?includeRawData=${includeRawData}`,
        { headers: { sid: sid } }
      )
        .then((res) => res.data)
        .catch((err) => {
          throw err?.response?.data || err;
        }),
  });
}

//dummy receiving request
export function useReceivingAccounts() {
  return useQuery<AccountsOverview>({
    queryKey: ["receivingAccounts"],
    queryFn: () =>
      new Promise((resolve) => {
        setTimeout(() => {
          const data = { accounts: dummyReceivingAccounts };
          resolve(data);
        }, 1000);
      }),
  });
}
