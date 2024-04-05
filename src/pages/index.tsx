import { Card } from "antd";
import { shortenStaffName } from "util/helper";
import useUserStateStore from "../../stores/userStateStore";

function IndexPage() {
  const store = useUserStateStore();
  const staffId = shortenStaffName(store.loggedInUser?.staff_id);

  return (
    <Card title={<div className="text-3xl font-bold">Home</div>}>
      <span className="text-xl font-light">Welcome, {staffId}</span>
    </Card>
  );
}

export default IndexPage;
