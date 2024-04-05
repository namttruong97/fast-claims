
import { Dropdown, MenuProps } from "antd";
import { fetchEmployees } from "calls/claims";
import { useEffect, useState } from "react";
import { TEmployee } from "types/employee";
import { shortenStaffName } from "util/helper";
import { UserState } from "../../../stores/userStateStore";

export default function UserSwitch({ store }: { store: UserState }) {
  const staffId = shortenStaffName(store.loggedInUser?.staff_id);
  const [employees, setEmployees] = useState<TEmployee[]>([]);

  useEffect(() => {
    if (!store.listUsers.length) {
      const fetchUsers = async () => {
        const empsResponse = await fetchEmployees();
        setEmployees(empsResponse);
        store.setListUser(empsResponse);

        // Set default user is the first user
        store.setLoggedInUser(empsResponse?.[0]);
      };

      fetchUsers();
      return;
    }
    setEmployees(store.listUsers);
  }, []);

  const handleSelectEmployee = (value: any) => {
    const selectedUser = employees.find((item) => item.staff_id === value);
    store.setLoggedInUser(selectedUser);
  };

  const items: MenuProps["items"] = employees.map((item) => {
    return {
      key: item.staff_id,
      label: (
        <div className="flex items-center cursor-pointer">
          <span className="flex items-center mr-2">
            <span className="w-[55px]">{shortenStaffName(item.staff_id)}</span>: 
            {item.roles.length > 0 ? ` Role: ${item.roles}` : " No Role"}
          </span>
        </div>
      ),
    };
  });

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items,
        onClick: (e) => {
          handleSelectEmployee(e.key);
        },
      }}
    >
      <div className="flex flex-col w-[180px] lg:w-[210px]  items-center px-0 lg:px-4 justify-center !leading-3  h-[64px] text-white cursor-pointer group hover:text-blue-primary hover:bg-white focus:bg-white focus:text-blue-primary">
        <div className="mb-[10px] text-[14px] font-bold">Switch User</div>
        <div className="h-3">
          <span className="inline-block">
            {staffId} -
            {store.loggedInUser?.roles?.length
              ? ` ${store.loggedInUser.roles}`
              : " No Role"}
          </span>
        </div>
      </div>
    </Dropdown>
  );
}
