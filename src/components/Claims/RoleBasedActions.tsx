import useUpdateClaim from "@/src/hooks/useUpdateClaim";
import { useWindowSize } from "@/src/hooks/useWindowSize";
import { ClaimStatus, TClaim } from "@/src/types/claim";
import { TEmployeeRole } from "@/src/types/employee";
import {
  CheckCircleOutlined,
  EditOutlined,
  FileProtectOutlined,
  MinusCircleOutlined,
  VerifiedOutlined,
} from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import classNames from "classnames";
import { omit } from "lodash";
import useUserStateStore from "stores/userStateStore";
import { SCREEN_SIZE_MOBILE } from "./ManagerClaimsView";
interface IRoleBasedActions {
  record: TClaim;
  mode: "employee" | "manager";
  roles?: TEmployeeRole[];
}

export const RoleBasedActions = ({
  record,
  mode,
  roles = [],
}: IRoleBasedActions) => {
  const store = useUserStateStore();
  const { width } = useWindowSize();

  const isDisableEdit = record.claim_state !== ClaimStatus.DRAFT;
  const isDisableFinalized = record.claim_state !== ClaimStatus.APPROVED;
  const isDisableApprove = record.claim_state !== ClaimStatus.SUBMITTED;

  const { update } = useUpdateClaim();

  const handleEdit = () =>
    store.setEditModal({ isOpen: true, data: omit(record, ["children"]) as any });

  const updateClaim = (status: ClaimStatus) => {
    const recordData = omit(record, ["children"]);
    const newRecordData: any = {
      ...recordData,
      claim_state: status,
    };

    update(newRecordData);
  };

  const handleVerify = () => updateClaim(ClaimStatus.SUBMITTED);
  const handleFinalize = () => updateClaim(ClaimStatus.FINALIZED);

  const handleApprove = () => updateClaim(ClaimStatus.APPROVED);
  const handleReject = () => updateClaim(ClaimStatus.REJECTED);

  if (mode === "employee") {
    return (
      <div className="flex items-center">
        <Tooltip title="Edit">
          <Button
            className="flex items-center justify-center mr-2 !text-gray-600"
            disabled={isDisableEdit}
            onClick={handleEdit}
            icon={
              <EditOutlined
                className={classNames(
                  "!text-[18px]",
                  isDisableEdit
                    ? "!cursor-not-allowed !text-gray-400"
                    : "cursor-pointer "
                )}
              />
            }
          />
        </Tooltip>
        <Tooltip title="Verify">
          <Button
            className="flex items-center justify-center !text-green-600 border-green-600"
            disabled={isDisableEdit}
            onClick={handleVerify}
            icon={
              <VerifiedOutlined
                className={classNames(
                  "!text-[18px]",
                  isDisableEdit
                    ? "!cursor-not-allowed !text-gray-400"
                    : "!text-green-600 cursor-pointer"
                )}
              />
            }
          />
        </Tooltip>
      </div>
    );
  }

  if (mode === "manager") {
    return (
      <div className="flex items-center">
        <Tooltip title="Reject">
          <Button
            size={width < SCREEN_SIZE_MOBILE ? "small" : "middle"}
            className="flex items-center justify-center mr-2 !text-red-600 border-red-600"
            disabled={isDisableApprove}
            onClick={handleReject}
            icon={
              <MinusCircleOutlined
                className={classNames(
                  "!text-[14px] sm:!text-[18px] !w-fit",
                  isDisableApprove
                    ? "!text-gray-400 !cursor-not-allowed"
                    : "!text-red-600 cursor-pointer"
                )}
              />
            }
          />
        </Tooltip>
        <Tooltip title="Approve">
          <Button
            size={width < SCREEN_SIZE_MOBILE ? "small" : "middle"}
            className="flex items-center justify-center border-green-600"
            disabled={isDisableApprove}
            onClick={handleApprove}
            icon={
              <CheckCircleOutlined
                className={classNames(
                  "!text-[14px] sm:!text-[18px] font-bold",
                  isDisableApprove
                    ? "!text-gray-400 !cursor-not-allowed"
                    : "!text-green-600 cursor-pointer"
                )}
              />
            }
          />
        </Tooltip>
        {roles.includes("finalizer") && (
          <Tooltip title="Finalize">
            <Button
              size={width < SCREEN_SIZE_MOBILE ? "small" : "middle"}
              className="flex items-center justify-center ml-2 border-blue-primary"
              disabled={isDisableFinalized}
              onClick={handleFinalize}
              icon={
                <FileProtectOutlined
                  className={classNames(
                    "!text-[14px] sm:!text-[18px] font-bold",
                    isDisableFinalized
                      ? "!text-gray-400 !cursor-not-allowed"
                      : "!text-blue-primary cursor-pointer"
                  )}
                />
              }
            />
          </Tooltip>
        )}
      </div>
    );
  }
};

export default RoleBasedActions;
