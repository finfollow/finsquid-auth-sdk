import { StepsEnum } from "./components/Wrapper";
import { AccountOverview, ProviderName } from "gateway-api/types";

export type StepsT = Record<
  | "selectProvider"
  | "loginOptions"
  | "provideSSN"
  | "openBankID"
  | "scanQRcode"
  | "waitingConnection"
  | "selectUserAccount"
  | "successConnect"
  | "selectAccount"
  | "selectPositions"
  | "selectReceivingAccount"
  | "transactionSummary",
  StepT
>;

export type StepT = {
  title: string;
  wrapperStep: StepsEnum;
  value: keyof StepsT;
  prevStep: keyof StepsT | null;
};

export const steps: StepsT = {
  selectProvider: {
    title: "Connect Bank",
    value: "selectProvider",
    wrapperStep: StepsEnum["ConnectBank"],
    prevStep: null,
  },
  loginOptions: {
    title: "Connect Bank",
    value: "loginOptions",
    wrapperStep: StepsEnum["ConnectBank"],
    prevStep: "selectProvider",
  },
  provideSSN: {
    title: "Connect Bank",
    value: "provideSSN",
    wrapperStep: StepsEnum["ConnectBank"],
    prevStep: "loginOptions",
  },
  scanQRcode: {
    title: "Scan QR-code",
    value: "scanQRcode",
    wrapperStep: StepsEnum["ConnectBank"],
    prevStep: "loginOptions",
  },
  openBankID: {
    title: "Connect Bank",
    value: "openBankID",
    wrapperStep: StepsEnum["ConnectBank"],
    prevStep: "loginOptions",
  },
  waitingConnection: {
    title: "Waiting for authentication",
    value: "waitingConnection",
    wrapperStep: StepsEnum["ConnectBank"],
    prevStep: "loginOptions",
  },
  selectUserAccount: {
    title: "Connecting bank",
    value: "selectUserAccount",
    wrapperStep: StepsEnum["ConnectBank"],
    prevStep: "loginOptions",
  },
  successConnect: {
    title: "Bank successfully connected!",
    value: "successConnect",
    wrapperStep: StepsEnum["ConnectBank"],
    prevStep: "selectProvider",
  },
  selectAccount: {
    title: "Select Account",
    value: "selectAccount",
    wrapperStep: StepsEnum["SelectAccount"],
    prevStep: "loginOptions",
  },
  selectPositions: {
    title: "Select Positions",
    value: "selectPositions",
    wrapperStep: StepsEnum["SelectAccount"],
    prevStep: "selectAccount",
  },
  selectReceivingAccount: {
    title: "Receiving Account",
    value: "selectReceivingAccount",
    wrapperStep: StepsEnum["SelectAccount"],
    prevStep: "selectPositions",
  },
  transactionSummary: {
    title: "Summary",
    value: "transactionSummary",
    wrapperStep: StepsEnum["ConfirmTransfer"],
    prevStep: "selectReceivingAccount",
  },
};

export const dummyReceivingAccounts: AccountOverview[] = [
  {
    providerAccountId: "56624924",
    providerAccountType: "AKTIEFONDKONTO",
    providerAccountNumber: "56624924",
    name: "Test 1",
    owner: true,
    type: "AF",
    provider: "Bank XYZ" as ProviderName,
    providerAccountCreated: "2010-09-30",
    balance: {
      amt: 12652.12,
      cy: "SEK",
    },
    totalValue: {
      amt: 54652.57,
      cy: "SEK",
    },
  },
  {
    providerAccountId: "45121534",
    providerAccountType: "INVESTERINGSSPARKONTO",
    providerAccountNumber: "45121534",
    name: "Test 2",
    owner: true,
    type: "ISK",
    provider: "Bank XYZ" as ProviderName,
    providerAccountCreated: "2017-03-21",
    balance: {
      amt: 7620.27,
      cy: "SEK",
    },
    totalValue: {
      amt: 130595.7886,
      cy: "SEK",
    },
  },
  {
    providerAccountId: "2355121",
    providerAccountType: "INVESTERINGSSPARKONTO",
    providerAccountNumber: "2355121",
    name: "Test 3",
    owner: true,
    type: "ISK",
    provider: "Bank XYZ" as ProviderName,
    providerAccountCreated: "2017-05-01",
    balance: {
      amt: 422.96,
      cy: "SEK",
    },
    totalValue: {
      amt: 17196.4095,
      cy: "SEK",
    },
  },
  {
    providerAccountId: "8237290",
    providerAccountType: "KAPITALFORSAKRING",
    providerAccountNumber: "8237290",
    name: "Test 4",
    owner: true,
    type: "KF",
    provider: "Bank XYZ" as ProviderName,
    providerAccountCreated: "2010-09-30",
    balance: {
      amt: 27.38,
      cy: "SEK",
    },
    totalValue: {
      amt: 27.38,
      cy: "SEK",
    },
  },
];
