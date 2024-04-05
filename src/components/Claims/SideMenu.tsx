import {
  AccountBookOutlined,
  HomeOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useUserStateStore from "stores/userStateStore";

const { Sider } = Layout;

export default function SideMenu({}) {
  const router = useRouter();
  const [current, setCurrent] = useState<string>();

  const store = useUserStateStore();
  const isDisableManageView = !(
    store.loggedInUser?.roles.includes("manager") ||
    store.loggedInUser?.roles.includes("finalizer")
  );

  useEffect(() => {
    if (router.asPath) {
      setCurrent(router.asPath);
    }
  }, [router.asPath]);

  const items: MenuProps["items"] = [
    {
      label: "Home",
      key: "/",
      icon: <HomeOutlined />,
    },
    {
      label: "Claims",
      key: "claims",
      icon: <WalletOutlined />,
      children: [
        {
          label: "My Claims",
          key: "/claims/personal",
        },
        {
          label: "Manager View",
          disabled: isDisableManageView,
          key: "/claims/manager_view",
        },
      ],
    },
  ];

  const onClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "/claims/personal":
        router.push("/claims/personal");
        break;

      case "/claims/manager_view":
        router.push("/claims/manager_view");
        break;

      case "/":
        router.push("/");
        break;

      default:
        break;
    }
    setCurrent(e.key);
  };

  return (
    <>
      <Sider
        className="!fixed left-0 hidden h-full lg:block z-50"
        theme="light"
      >
        <div className="z-30 flex justify-center logo bg-blue-primary">
          <img alt="Company Logo" src="/images/companyLogo.png" width="64" />
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["/"]}
          defaultOpenKeys={["claims"]}
          selectedKeys={[current]}
          items={items}
          onClick={onClick}
        />
      </Sider>
      <div
        className={classNames(
          "fixed bottom-0 left-0 z-10 grid w-full shadow lg:hidden bg-blue-primary",
          isDisableManageView ? "grid-cols-2" : "grid-cols-3"
        )}
      >
        <button>
          <Link
            href="/"
            className={classNames(
              "flex flex-col items-center justify-center py-3 text-white",
              current === "/" && "bg-white !text-blue-primary"
            )}
          >
            <HomeOutlined className="mb-1 text-xl" />
            <span>Home</span>
          </Link>
        </button>
        <button>
          <Link
            href="/claims/personal"
            className={classNames(
              "flex flex-col items-center justify-center py-3 text-white",
              current === "/claims/personal" && "bg-white !text-blue-primary"
            )}
          >
            <WalletOutlined className="mb-1 text-xl" />
            <span>My Claim</span>
          </Link>
        </button>
        {!isDisableManageView && (
          <button>
            <Link
              href="/claims/manager_view"
              onClick={(e) => {
                if (isDisableManageView) {
                  e.preventDefault();
                }
              }}
              className={classNames(
                "flex flex-col items-center justify-center py-3 text-white",
                current === "/claims/manager_view" &&
                  "bg-white !text-blue-primary"
              )}
            >
              <AccountBookOutlined className="mb-1 text-xl" />
              <span>Manage Claim</span>
            </Link>
          </button>
        )}
      </div>
    </>
  );
}
