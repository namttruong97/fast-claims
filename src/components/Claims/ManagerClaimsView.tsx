import useUpdateClaim from "@/src/hooks/useUpdateClaim";
import { useWindowSize } from "@/src/hooks/useWindowSize";
import { ClaimStatus, TClaim } from "@/src/types/claim";
import { TEmployeeRole } from "@/src/types/employee";
import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  convertToCSV,
  downloadCSV,
  getCategoryColor,
  getSymbolCurrency,
  mergeDuplicateDataTable,
  shortenStaffName,
  transferShortenCurrency,
} from "@util/helper";
import {
  Button,
  Card,
  Skeleton,
  Spin,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { difference, isEmpty } from "lodash";
import { useEffect, useState } from "react";
import {
  fetchManagerialViewClaimRecords,
  prettifyDatetime,
} from "src/calls/claims";
import useUserStateStore from "stores/userStateStore";
import ClaimsStatus from "./ClaimsStatus";
import RoleBasedActions from "./RoleBasedActions";

export const SCREEN_SIZE_MOBILE = 640;
const getColumn = (
  roles: TEmployeeRole[],
  screenWidth: number
): TableColumnsType<TClaim & { children?: TClaim[] }> => [
  {
    title: "ID",
    fixed: screenWidth < SCREEN_SIZE_MOBILE ? "left" : undefined,
    dataIndex: "staff_id",
    key: "staff_id",
    render: (text, record) => {
      return (
        <div>
          <div>{shortenStaffName(text)}</div>
          {record.children?.length && (
            <Tag
              className="!ml-6"
              color="orange"
              icon={<ExclamationCircleOutlined />}
            >
              Duplicate Detected
            </Tag>
          )}
        </div>
      );
    },
  },
  ,
  {
    title: "Date of Purchase",
    dataIndex: "receipt_datetime_of_purchase",
    key: "receipt_datetime_of_purchase",
    render: (text) => {
      return prettifyDatetime(text);
    },
  },
  {
    title: "Merchant Name",
    dataIndex: "receipt_merchant_name",
    key: "receipt_merchant_name",
  },
  {
    title: "Currency",
    hidden: screenWidth < SCREEN_SIZE_MOBILE,
    dataIndex: "receipt_ccy",
    key: "receipt_ccy",
  },
  {
    title: "Total Amount",
    dataIndex: "receipt_total_amount",
    key: "receipt_total_amount",
    render: (text, record) => (
      <div>
        {getSymbolCurrency(record.receipt_ccy)}
        <span className="ml-[2px]">{transferShortenCurrency(text)}</span>
      </div>
    ),
  },
  {
    title: "Category",
    dataIndex: "claim_category",
    key: "claim_category",
    render: (text) => (
      <span>
        <TagOutlined
          style={{ marginRight: 8, color: getCategoryColor(text) }}
        />
        {text}
      </span>
    ),
  },
  {
    title: "Description",
    dataIndex: "claim_description",
    key: "claim_description",
  },
  {
    title: "Status",
    dataIndex: "claim_state",
    key: "claim_state",
    render: (text) => <ClaimsStatus status={text} />,
  },
  {
    title: "Action",
    key: "action",
    fixed: screenWidth < SCREEN_SIZE_MOBILE ? "right" : undefined,
    render: (record) => (
      <RoleBasedActions record={record} mode="manager" roles={roles} />
    ),
  },
];

export default function ManagerClaimsView() {
  const store = useUserStateStore();
  const { update } = useUpdateClaim();
  const { width } = useWindowSize();
  
  const [claimRecords, setClaimRecords] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const columns = getColumn(store.loggedInUser?.roles, width);
  const dataSource: TClaim[] = mergeDuplicateDataTable(claimRecords);

  useEffect(() => {
    const staffId = store.loggedInUser?.staff_id;
    if (!staffId) {
      return;
    }

    const manageClaims = store.applicationData?.[staffId]?.manageClaims;
    if (!manageClaims?.length) {
      const fetchRecords = async () => {
        try {
          let recordsResponse = await fetchManagerialViewClaimRecords(staffId);

          recordsResponse = [
            ...recordsResponse,
            ...[
              {
                claim_id: "ae7edd1a-bb07-4431-86c8-6029f34a2289",
                org_id: "8f98b6bd-7f7d-4128-b0cc-525d97dbc126",
                staff_id: "1d640009-98f3-4522-a706-72a74575e72d",
                receipt_language: "Vietnamese",
                receipt_address: "Singapore",
                receipt_unique_id: "dda5878a-66db-49f9-bd0e-0a29e2423d1b",
                receipt_datetime_of_purchase: "2020-04-18T17:52:26.35324+00:00",
                receipt_merchant_name: "Simpson, Perez and Davis2",
                receipt_ccy: "SGD",
                receipt_total_amount: 443,
                receipt_items: "",
                receipt_taxes: 17.39,
                receipt_img_url: "https://placekitten.com/493/385",
                claim_description: "Agree blue follow organization some.",
                receipt_payment_method: "Card",
                claim_category: "Travel",
                claim_account: "00040 Acc Example",
                claim_state: "SUBMITTED",
                receipt_country: "Vietnam",
                initial_pred: null,
                ocr_text: null,
                "flagged?": null,
                updatedAt: "2024-03-26T15:46:44.325412+00:00",
                createdAt: "2024-03-26T15:46:44.539184+00:00",
                report_id: null,
              },
            ],
          ];
          setClaimRecords(recordsResponse);

          const newDataManageClaims = {
            [staffId]: {
              ...structuredClone(store.applicationData?.[staffId]),
              manageClaims: recordsResponse,
            },
          };

          store.setApplicationData({
            ...structuredClone(store.applicationData),
            ...newDataManageClaims,
          });
        } catch (error) {
          setClaimRecords([]);
        }
      };

      fetchRecords();
    } else {
      setClaimRecords(manageClaims);
    }
  }, [store.loggedInUser]);

  if (isEmpty(dataSource)) {
    return (
      <Spin spinning={true}>
        <Skeleton loading={true} active />
      </Spin>
    );
  }

  const handleSelectAllApproved = () => {
    const rowKeyApproved = dataSource
      .filter((item) => item.claim_state === ClaimStatus.APPROVED)
      ?.map((item) => item.claim_id);

    setSelectedRowKeys(rowKeyApproved);
  };

  const handleFinalizeSelected = () => {
    const approvedRecords = dataSource.filter((item) =>
      selectedRowKeys.includes(item.claim_id)
    );
    const newRecords = approvedRecords.map((item) => ({
      ...item,
      claim_state: ClaimStatus.FINALIZED,
    }));

    newRecords.forEach((item) => update(item));
    setSelectedRowKeys([]);
  };

  const handleDownloadCSV = () => {
    const finalizeRecords = dataSource?.filter(
      (item) => item.claim_state === ClaimStatus.FINALIZED
    );
    const csvRecords = convertToCSV(finalizeRecords);
    downloadCSV(csvRecords);
  };

  const isDisableFinalizeSelected = () => {
    const recordIds = dataSource
      ?.filter((item) => item.claim_state === ClaimStatus.APPROVED)
      ?.map((item) => item.claim_id);

    if (
      selectedRowKeys?.length &&
      !difference(selectedRowKeys, recordIds)?.length
    ) {
      return false;
    }
    return true;
  };

  const isDisableDownloadCSV = () => {
    const recordIds = dataSource
      ?.filter((item) => item.claim_state === ClaimStatus.FINALIZED)
      ?.map((item) => item.claim_id);

    if (
      selectedRowKeys?.length &&
      !difference(selectedRowKeys, recordIds)?.length
    ) {
      return false;
    }
    return true;
  };
  const isDisableApproveSelected = !dataSource?.find(
    (item) => item.claim_state === ClaimStatus.APPROVED
  );

  return (
    <div className="site-layout-content">
      <Card title={<div className="text-3xl font-bold">Manager View</div>}>
        {store.loggedInUser?.roles.includes("finalizer") && (
          <div className="grid flex-wrap items-center gap-2 mb-2 mb:grid-cols-2 sm:flex sm:my-4">
            <Button
              className="text-xs sm:text-[14px]"
              onClick={handleSelectAllApproved}
              disabled={isDisableApproveSelected}
            >
              Select All Approved
            </Button>
            <Button
              className="text-xs sm:text-[14px]"
              disabled={isDisableFinalizeSelected()}
              onClick={handleFinalizeSelected}
            >
              Finalize Selected
            </Button>
            <Button
              className="grid-span-2 sm:mt-0 text-xs sm:text-[14px]"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadCSV}
              disabled={isDisableDownloadCSV()}
            >
              Download Finalized
            </Button>
          </div>
        )}
        <Table
          expandable={{
            defaultExpandAllRows: true,
          }}
          className="!text-xs sm:!text-[14px]"
          rowSelection={{
            selectedRowKeys,
            type: "checkbox",
            onChange: (selectedRowKeys: string[]) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          size={width < SCREEN_SIZE_MOBILE ? "small" : "middle"}
          scroll={{ x: "max-content" }}
          columns={columns}
          dataSource={dataSource}
          rowKey={(obj) => obj.claim_id}
        />
      </Card>
    </div>
  );
}
