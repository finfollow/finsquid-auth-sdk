export type Provider = {
  id: number;
  name?: string;
  country?: string;
  displayName?: string;
  loginOptions?: LoginOptions[];
  customer?: ["Personal" | "Corporate"];
  providerType?: ProviderType;
  iconUrl?: string;
  isTest?: boolean;
  deprecated?: boolean;
};

export enum ProviderType {
  "Retail",
  "Commercial",
  "Investment",
  "Credit Union",
  "Private",
  "S&L",
  "Challenger",
  "Neobank",
  "Other",
  "Test",
}

export type ProviderName =
  | "nordnet"
  | "avanza"
  | "swedbank"
  | "seb"
  | "soderbergpartners"
  | "carnegie"
  | "handelsbanken"
  | "testprovider"
  | "nordea_se";

export type LoginOptions = {
  loginMethod?: LoginMethod;
  params?: LoginParam[];
  iconUrl?: string;
};

export type LoginMethod =
  | "bankid"
  | "bankidSSN"
  | "usernamePassword"
  | "card reader w/cable"
  | "card reader w/o cable"
  | "QR-reader";

export type LoginParam = {
  name?: string;
  type?: string;
  regexValidator?: string | null;
  optional?: boolean;
};

export type BankIdInitQueryParams = {
  includeRawData: boolean;
  sameDevice: boolean;
  userId?: string;
};

export type BankIdRes = {
  autostartToken: string;
  imageChallengeData?: string;
  sid: string;
  success: boolean;
  status: SessionStatus;
};

export type BankIdStatus = {
  imageChallengeData?: string;
  status: SessionStatus;
  raw?: any;
};

export type LoginStatus = {
  status: SessionStatus;
  raw?: any;
};

export type SessionStatus =
  | "complete"
  | "pending"
  | "timeout"
  | "conflict"
  | "error"
  | "failed";

export type UserAccount = {
  accountId: string;
  accountName: string;
};

export type AccountOverview = Partial<Account> | Account;
export type AccountsOverview = {
  accounts: Partial<Account>[] | Account[];
};

export type Account = {
  /** Provider's internal id of account */
  providerAccountId: string;
  /** The provider's internal name of account type */
  providerAccountType: string;
  /** If current user is owner, true or false */
  owner?: boolean;
  /** Provider's account number */
  providerAccountNumber: string;
  /** User's given name of account, or provider's default name if none is given */
  name: string;
  /** Current account's account type */
  type: AccountType;
  subType: AccountSubType;
  /** Current balance in liquid cash */
  balance?: Money;
  /** Current total value of account */
  totalValue?: Money;
  /** Account provider */
  provider: ProviderName;
  providerAccountCreated?: LocalDate;
  /**Raw account data */
  raw?: any;
  sid?: string;
};

export type AccountType =
  | "BANKACCOUNT"
  | "INVESTMENT"
  | "PENSION"
  | "LOAN"
  | "OTHER";

export type AccountSubType =
  | "KF"
  | "AF"
  | "ISK"
  | "TJP"
  | "SAVINGS"
  | "CHECKING"
  | "OTHER";

export type TransactionType =
  | "BUY"
  | "SELL"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "DIVIDEND"
  | "INTEREST_AND_FEES"
  | "TAX"
  | "OTHER";

export type LoanType =
  | "MORTGAGE"
  | "BLANCO"
  | "MEMBERSHIP"
  | "VEHICLE"
  | "LAND"
  | "STUDENT"
  | "CREDIT"
  | "OTHER";

export type Money = {
  amt?: number;
  cy?: Currency;
};

export type LocalDate = string;
export type Currency = string;
// export type ISIN = string;
// export type CountryCode = string;

export type Position = {
  /** Total amount held of instrument */
  quantity: number;
  /** The average acquired price of the instrument */
  acquiredPrice?: Money;
  /** The last price of the instrument */
  lastPrice?: Money;
  /** Opening price of the position */
  morningPriceTC?: Money;
  /** Current held value of instrument in traded currency */
  marketValueTC?: Money;
  /** Current held value of instrument in account currency */
  marketValueAC?: Money;
  /** The instruments currency */
  currency: Currency;
  /** Max returns in percent */
  pctReturn?: number;
  /** Percentage return today*/
  pctToday?: number;
  /** Return today in traded currency */
  todayTC?: Money;
  /** Max returns in traded currency */
  returnTC?: Money;
  /** Instrument of position */
  instrument: Instrument;
  /** Raws position data */
  raw?: any;
};

export type Instrument = {
  /** ISIN code of the instrument */
  isin: string;
  /** Internal id of the instrument from the provider */
  internalId: string;
  /** Full name of the instrument */
  name: string;
  /** Symbol or short name of the instrument */
  symbol?: string;
  /** Instrument type converted to enum */
  type?: InstrumentType;

  /** Instrument group type  */
  groupType?: string;

  /** Internal id of the market according to the provider */
  marketId?: string | null;
  /** Market identifier code */
  mic?: string;

  // TODO: Reseach type,groupType and assetClass usage
  /** Instrument type according to the provider */
  internalType?: string;
  // TODO: Reseach type,groupType and assetClass usage
  /** Instrument asset class */
  assetClass?: string;

  /** Instruments traded currency */
  currency?: Currency;
  /** Last price of the instrument */
  lastPrice?: Money;

  /** Market capitalization of the instrument */
  marketCap?: Money;
  /** Instrument sector */
  sector?: string;
  /** Instrument sector group */
  sectorGroup?: string;
  /** Collateral value of the instrument */
  collateralValue?: number;
  /** Management fee in percent */
  productFee?: number;
  /** Raw instrument data */
  raw?: any;
};

export type InstrumentType = "STOCK" | "FUND" | "ETF" | "CERTIFICATE" | "OTHER";
