import Page401 from "@/src/pages/401";
import { BlockLoading } from "@components/BlockLoading";
import SideMenu from "@components/Claims/SideMenu";
import UserSwitch from "@components/Claims/UserSwitch";
import { Layout } from "antd";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import useUserStateStore from "stores/userStateStore";
const { Header, Content } = Layout;

const RootLayout = ({ children }) => {
  const store = useUserStateStore();
  const router = useRouter();

  if (isEmpty(store.loggedInUser)) {
    return (
      <>
        <BlockLoading isOpen={true} />
        <UserSwitch store={store} />
      </>
    );
  }

  if (
    router.asPath === "/claims/manager_view" &&
    !store.loggedInUser?.roles.includes("manager")
  ) {
    return (
      <Content>
        <Header className="flex justify-end header">
          <UserSwitch store={store} />
        </Header>
        <Page401 />
      </Content>
    );
  }

  return (
    <Layout className="layout">
      <SideMenu />
      <Layout>
        <Header className="fixed z-10 flex justify-end w-full h-16 header">
          <img
            className="absolute block left-5 lg:hidden"
            alt="Company Logo"
            src="/images/companyLogo.png"
            width="64"
          />
          <UserSwitch store={store} />
        </Header>
        <Content className="px-2 sm:px-4 my-[72px] lg:p-4 lg:ml-[200px] lg:my-[68px]">{children}</Content>
      </Layout>
    </Layout>
  );
};
export default RootLayout;
