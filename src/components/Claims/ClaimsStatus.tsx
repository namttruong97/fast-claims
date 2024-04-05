import { Tag } from "antd";

const getStatusColor = (category) => {
  switch (category) {
    case "SUBMITTED":
      return "blue";
    case "DRAFT":
      return "grey";
    case "APPROVED":
      return "green";
    case "REJECTED":
      return "red";
    case "FINALIZED":
      return "orange";
    case "CHECKED":
        return "purple";
    default:
      return "white";
  }
};

export const ClaimsStatus = ({ status }) => {
  return <Tag className="text-xs" color={getStatusColor(status)}>{status}</Tag>;
};

export default ClaimsStatus;
