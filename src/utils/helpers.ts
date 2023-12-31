import {
  Account,
  InstrumentType,
  LoanType,
  Money,
  Position,
  TransactionType,
} from "src/gateway-api/types";

export const currencyValue = (
  m: Money | null | undefined,
  options?: Intl.NumberFormatOptions
) => {
  return m?.amt
    ? Intl.NumberFormat("sv", {
        style: m?.cy ? "currency" : "decimal",
        currency: m?.cy || undefined,
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
        currencyDisplay: "code",
        notation: (m?.amt || 0) > 9999999 ? "compact" : "standard",
        ...options,
      }).format(m?.amt || 0)
    : "-";
};

export function getNameFromTwoValues(
  val1: string | null | undefined,
  val2: string | null | undefined
): string {
  if (val1 === val2) return val1 || "";

  const name1 = !!val1 ? val1 : val2;
  if (!name1) return "";

  const name2 = val1 === name1 ? val2 : val1;
  return [name1, name2].filter(Boolean).join(" ");
}

export function tablesSort(
  a: string | number | null | undefined,
  b: string | number | null | undefined
) {
  if ((a === undefined && b === undefined) || (a === null && b === null))
    return 0;
  if (a === undefined || a === null) return -1;
  if (b === undefined || b === null) return 1;

  return a > b ? 1 : -1;
}

export const transformAccountType = (
  type: Account["subType"] | null | undefined
) => {
  switch (type) {
    case "CHECKING":
      return "CHK";
    case "SAVINGS":
      return "SV";
    case "OTHER":
      return "O";
    default:
      return type;
  }
};

export const formatTypeText = (
  type?: InstrumentType | TransactionType | LoanType
): string =>
  type
    ? type
        .split("_")
        .map((t) =>
          t === "ETF" ? t : t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
        )
        .join(" ")
    : "";

export const categorizePositionsByType = (positions?: Position[]) =>
  positions
    ?.map((el) => el.instrument.type)
    .filter((el, i, array) => array.indexOf(el) === i)
    .map((type) => ({
      type,
      positions: positions.filter((el) => el.instrument.type === type),
    }));

type PostMessageData = {
  type: "success" | "error";
  data?: any;
  error?: { type?: string; message?: any } | null;
};

export const sendPostMessage = (message: PostMessageData) => {
  const searchParams = new URLSearchParams(document.location.search);
  const targetOrigin = searchParams.get("redirect");

  if (targetOrigin) {
    window.parent.postMessage(JSON.stringify(message), targetOrigin);
  }
};
