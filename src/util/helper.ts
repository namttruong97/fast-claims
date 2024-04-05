import dayjs from "dayjs";
import { difference, differenceBy, isEmpty, uniqWith } from "lodash";
import { TClaim, TClaimCurrency } from "../types/claim";

const DEFAULT_LENGTH_SHORTEN = 30;
export const DATE_TIME_FORMAT = "MM/DD/YYYY hh:mm A";

export const getCategoryColor = (category) => {
  switch (category) {
    case "Medical":
      return "blue";
    case "Travel":
      return "purple";
    case "Meals":
      return "red";
    default:
      return "grey";
  }
};

export const transferShortenCurrency = (value: number): string => {
  if (value <= 0) {
    return "";
  }

  // Nine Zeroes for Billions
  return value >= 1.0e9
    ? (value / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    value >= 1.0e6
    ? (value / 1.0e6).toFixed(2) + "MM"
    : // Three Zeroes for Thousands
    value >= 1.0e3
    ? (value / 1.0e3).toFixed(2) + "K"
    : value.toFixed(2).toString();
};

// I assume we only have three currency type
export const getSymbolCurrency = (currency: TClaimCurrency) => {
  const mappingCurrency = {
    SGD: "S$",
    USD: "$",
    VND: "₫",
  };

  return mappingCurrency[currency];
};

export const shortenStaffName = (name: string) => {
  if (!name) {
    return "";
  }

  return name.slice(DEFAULT_LENGTH_SHORTEN);
};

export const checkDuplicateClaim = (item: TClaim, nextItem: TClaim) => {
  const sameID = item.receipt_unique_id === nextItem.receipt_unique_id;

  const sameMerchantNameReceipt =
    item.receipt_merchant_name === nextItem.receipt_merchant_name &&
    item.receipt_datetime_of_purchase ===
      nextItem.receipt_datetime_of_purchase &&
    item.receipt_total_amount === nextItem.receipt_total_amount;

  const sameAddressReceipt =
    item.receipt_address === nextItem.receipt_address &&
    item.receipt_datetime_of_purchase ===
      nextItem.receipt_datetime_of_purchase &&
    item.receipt_total_amount === nextItem.receipt_total_amount;

  return sameID || sameMerchantNameReceipt || sameAddressReceipt;
};

export const mergeDuplicateDataTable = (claimRecords: TClaim[]) => {
  if (!claimRecords?.length) {
    return [];
  }

  const uniqClaims = uniqWith(claimRecords, checkDuplicateClaim);
  let leftClaims = difference(claimRecords, uniqClaims);

  const results = uniqClaims.reduce((arr, claim) => {
    const pickLeftDuplicate = leftClaims.filter((item) =>
      checkDuplicateClaim(item, claim)
    );

    if (!isEmpty(pickLeftDuplicate)) {
      claim.children = pickLeftDuplicate;
      leftClaims = difference(leftClaims, pickLeftDuplicate);
    }

    return [...arr, ...[claim]];
  }, []);

  return results;
};

export const transferDuplicated = (claimRecords: TClaim[]) => {
  if (!claimRecords?.length) {
    return [];
  }

  const uniqClaims = uniqWith(claimRecords, checkDuplicateClaim);
  let leftClaims = difference(claimRecords, uniqClaims);

  const results = uniqClaims.reduce((arr, claim) => {
    const pickLeftDuplicate = leftClaims
      .filter((item) => checkDuplicateClaim(item, claim))
      ?.map((item) => ({ ...item, isDuplicated: true }));

    if (!isEmpty(pickLeftDuplicate)) {
      claim.isDuplicated = true;
      leftClaims = differenceBy(leftClaims, pickLeftDuplicate, "claim_id");
    }

    const arrHasDuplicated = [...[claim], ...pickLeftDuplicate];
    return [...arr, ...arrHasDuplicated];
  }, []);

  return results;
};

export const downloadCSV = (content) => {
  // Create a blob
  var blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement("a");
  pom.href = url;

  const fileName = `Finalized_${dayjs().format(DATE_TIME_FORMAT)}`;
  pom.setAttribute("download", fileName);
  pom.click();
};

export const convertToCSV = (items) => {
  const replacer = (key, value) => (value === null ? "" : value);
  const header = Object.keys(items[0]);
  let csv = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(",")
  );
  csv.unshift(header.join(","));
  csv = csv.join("\r\n");
  return csv;
};
