
import {
  DownloadOutlined,
  ExclamationCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Skeleton,
  Spin,
  Table,
  Tag
} from "antd";
import { difference, isEmpty } from "lodash";
import { useEffect, useState } from "react";

import { fetchManagerialViewClaimRecords, prettifyDatetime } from "calls/claims";
import useUpdateClaim from "hooks/useUpdateClaim";
import { useWindowSize } from "hooks/useWindowSize";
import { ClaimStatus, TClaim } from "types/claim";
import { TEmployeeRole } from "types/employee";
import { convertToCSV, downloadCSV, getCategoryColor, getSymbolCurrency, mergeDuplicateDataTable, shortenStaffName, transferShortenCurrency } from "util/helper";
import useUserStateStore from "../../../stores/userStateStore";
import ClaimsStatus from "./ClaimsStatus";
import RoleBasedActions from "./RoleBasedActions";

export const SCREEN_SIZE_MOBILE = 640;
const getColumn = (
  roles: TEmployeeRole[],
  screenWidth: number
): any=> [
  {
    title: "ID",
    fixed: screenWidth < SCREEN_SIZE_MOBILE ? "left" : undefined,
    dataIndex: "staff_id",
    key: "staff_id",
    render: (text: any, record: any) => {
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
    render: (text: any) => {
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
    render: (text: any, record: any) => (
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
    render: (text: any) => (
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
    render: (text: any) => <ClaimsStatus status={text} />,
  },
  {
    title: "Action",
    key: "action",
    fixed: screenWidth < SCREEN_SIZE_MOBILE ? "right" : undefined,
    render: (record: any) => (
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
          setClaimRecords(recordsResponse as any);

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
      setClaimRecords(manageClaims as any);
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
            onChange: (selectedRowKeys: any) => {
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
