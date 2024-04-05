import useUpdateClaim from "@/src/hooks/useUpdateClaim";
import { ClaimStatus, TClaim } from "@/src/types/claim";
import { TEmployeeRole } from "@/src/types/employee";
import {
  EditOutlined,
  ExclamationCircleOutlined,
  TagOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";
import ModalEdit from "@components/ModalEdit";
import {
  DATE_TIME_FORMAT,
  getCategoryColor,
  getSymbolCurrency,
  mergeDuplicateDataTable,
  shortenStaffName,
  transferDuplicated,
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
import dayjs from "dayjs";
import { isEmpty, omit } from "lodash";
import { useEffect, useState } from "react";
import { fetchPersonalClaimRecords } from "src/calls/claims";
import useUserStateStore from "stores/userStateStore";
import ClaimsStatus from "./ClaimsStatus";
import RoleBasedActions from "./RoleBasedActions";

export default function PersonalClaimsView() {
  const store = useUserStateStore();
  const { update } = useUpdateClaim();

  const [claimRecords, setClaimRecords] = useState<TClaim[]>([]);
  const dataSource = mergeDuplicateDataTable(structuredClone(claimRecords));
  const dataList = transferDuplicated(structuredClone(claimRecords));

  useEffect(() => {
    const staffId = store.loggedInUser?.staff_id;
    if (!staffId) {
      return;
    }

    const personalStaff = store.applicationData?.[staffId]?.personalClaims;
    if (!personalStaff?.length) {
      const fetchRecords = async () => {
        try {
          const recordsResponse = await fetchPersonalClaimRecords(staffId);
          setClaimRecords(recordsResponse);

          const newDataPersonalStaff = {
            [staffId]: {
              ...structuredClone(store.applicationData?.[staffId]),
              personalClaims: recordsResponse,
            },
          };

          store.setApplicationData({
            ...structuredClone(store.applicationData),
            ...newDataPersonalStaff,
          });
        } catch (error) {
          console.log("error", error);
          setClaimRecords([]);
        }
      };

      fetchRecords();
    } else {
      setClaimRecords(personalStaff);
    }
  }, [store.loggedInUser, store.applicationData]);

  const getColumns = (
    roles: TEmployeeRole[]
  ): TableColumnsType<TClaim & { children?: TClaim[] }> => [
    {
      title: "Date of Purchase",
      dataIndex: "receipt_datetime_of_purchase",
      key: "receipt_datetime_of_purchase",
      render: (text, record) => {
        return (
          <div>
            <div>{dayjs(text).format(DATE_TIME_FORMAT)}</div>
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
    {
      title: "Merchant Name",
      dataIndex: "receipt_merchant_name",
      key: "receipt_merchant_name",
    },
    {
      title: "Currency",
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
      render: (status) => <ClaimsStatus status={status} />,
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <RoleBasedActions record={record} mode="employee" roles={roles} />
      ),
    },
  ];

  const columns = getColumns(store.loggedInUser?.roles);
  const handleVerify = (item: TClaim) => {
    const newRecordData: TClaim = {
      ...item,
      claim_state: ClaimStatus.SUBMITTED,
    };

    update(newRecordData);
  };

  const handleEdit = (item) =>
    store.setEditModal({ isOpen: true, data: omit(item) });

  if (isEmpty(dataSource)) {
    return (
      <Spin spinning={true}>
        <Skeleton loading={true} active />
      </Spin>
    );
  }

  return (
    <>
      <Card
        className="hidden lg:block"
        title={<div className="text-3xl font-bold">My Claims</div>}
      >
        <ModalEdit />
        <Table
          expandable={{
            defaultExpandAllRows: true,
          }}
          scroll={{ x: "max-content" }}
          loading={!claimRecords.length}
          columns={columns}
          dataSource={dataSource}
          rowKey={(obj) => obj.claim_id}
        />
      </Card>

      {/* Show on mobile */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 lg:hidden personal-claims">
        {dataList?.map((item) => {
          return (
            <Card
              key={item.claim_id}
              className="w-full mb-3"
              size="small"
              title={
                <div className="text-[14px] flex items-center">
                  <h2 className="mr-1">
                    {shortenStaffName(item.receipt_unique_id)}
                  </h2>
                  {item?.isDuplicated && (
                    <Tag className="mr-1 text-xs" color="orange">
                      Duplicate Detected
                    </Tag>
                  )}
                  <ClaimsStatus status={item.claim_state} />
                </div>
              }
              extra={
                <div className="flex items-center">
                  <TagOutlined
                    style={{
                      marginRight: 4,
                      color: getCategoryColor(item.claim_category),
                    }}
                  />
                  <span className="text-[14px]">{item.claim_category}</span>
                </div>
              }
            >
              <div className="grid grid-cols-4">
                <ul className="col-span-3 text-xs leading-5 text-gray-600">
                  <li className="flex">
                    <span className="w-[100px] min-w-[100px] ">Merchant:</span>
                    <span className="max-w-[200px] text-ellipsis whitespace-nowrap overflow-hidden">
                      {item.receipt_merchant_name}
                    </span>
                  </li>
                  <li className="flex">
                    <span className="inline-block w-[100px] min-w-[100px] ">
                      Purchase Date:
                    </span>
                    <span>
                      {dayjs(item.receipt_datetime_of_purchase).format(
                        DATE_TIME_FORMAT
                      )}
                    </span>
                  </li>

                  <li className="flex">
                    <span className="inline-block w-[100px] min-w-[100px] ">
                      Receipt Address:
                    </span>
                    <span>{item.receipt_address}</span>
                  </li>
                  <li className="flex">
                    <span className="inline-block w-[100px] min-w-[100px] ">
                      Receipt Total:
                    </span>
                    <span className="underline text-blue-primary">
                      {getSymbolCurrency(item.receipt_ccy)}
                      <span className="ml-[2px] font-semi">
                        {transferShortenCurrency(item.receipt_total_amount)}
                      </span>
                    </span>
                  </li>
                </ul>
                <div className="flex flex-col items-end">
                  <Button
                    onClick={() => handleEdit(item)}
                    icon={<EditOutlined />}
                    className="mb-2 text-xs w-[70px]"
                    size="small"
                    disabled={item.claim_state !== ClaimStatus.DRAFT}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleVerify(item)}
                    type="primary"
                    icon={<VerifiedOutlined />}
                    className="text-xs w-[70px]"
                    size="small"
                    disabled={item.claim_state !== ClaimStatus.DRAFT}
                  >
                    Verify
                  </Button>
                </div>
              </div>
              <div className="flex text-xs text-gray-600">
                <span className="inline-block w-[100px] min-w-[100px] ">
                  Description:
                </span>
                <span>{item.claim_description}</span>
              </div>
            </Card>
          );
        })}
      </section>
    </>
  );
}
