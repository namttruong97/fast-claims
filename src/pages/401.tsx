import { Button } from "antd";
import { useRouter } from "next/router";

const Page401 = () => {
  const router = useRouter();

  return (
    <div className="h-[100vh] m-auto flex items-center justify-center">
      <div className="flex flex-col items-center  w-1/3 max-w-[600px] min-w-[350px] p-8 text-center bg-white rounded-xl">
        <div className="text-[40px] font-medium text-blue-primary">401</div>
        <div className="my-4 text-xl font-medium">
          Hey, you! Stop right there. Authorization required.
        </div>
        <Button
          type="primary"
          className="!text-xl !py-3 !px-6 !h-auto"
          onClick={() => {
            router.replace("/");
          }}
        >
          Back to home page
        </Button>
      </div>
    </div>
  );
};

export default Page401;
