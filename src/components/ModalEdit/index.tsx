
import {
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  TimePicker,
} from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import useUpdateClaim from "hooks/useUpdateClaim";
import { pick } from "lodash";
import { useEffect } from "react";
import { TClaim } from "types/claim";
import useUserStateStore from "../../../stores/userStateStore";

export interface IModalEdit {
  title?: string;
  data?: TClaim;
  isOpen?: boolean;
}

export default function ModalEdit({ title = "Edit Claim" }: IModalEdit) {
  const store = useUserStateStore();
  const [form] = useForm<TClaim>();

  const { editModal } = store;
  const { update } = useUpdateClaim();

  useEffect(() => {
    form.resetFields();
  }, []);

  const handleCancel = () => {
    store.setEditModal({ ...editModal, isOpen: false, data: undefined });
  };

  const transferNewClaim = () => {
    const newDate = form.getFieldValue("date_of_purchase").format("MM/DD/YYYY");
    const newTime = form.getFieldValue("time_of_purchase").format("hh:mm A");
    const datetimePurchase = dayjs(`${newDate} ${newTime}`).toDate();

    const formValues = form.getFieldsValue();
    const newClaim = {
      ...editModal.data,
      claim_category: formValues.claim_category,
      receipt_total_amount: formValues.receipt_total_amount,
      receipt_merchant_name: formValues.receipt_merchant_name,
      receipt_ccy: formValues.receipt_ccy,
      receipt_datetime_of_purchase: datetimePurchase,
    };

    return newClaim;
  };

  const onFinish = () => {
    const newClaim = transferNewClaim();

    update(newClaim as any);
    handleCancel();
  };

  const initialValues = pick(editModal.data, [
    "claim_category",
    "receipt_total_amount",
    "receipt_merchant_name",
    "receipt_ccy",
  ]);

  const transferInitValues = (initvals: any) => {
    initvals.date_of_purchase = dayjs(
      editModal.data?.receipt_datetime_of_purchase
    );

    initvals.time_of_purchase = dayjs(
      editModal.data?.receipt_datetime_of_purchase
    );

    return initvals;
  };

  return (
    <Modal
      title={title}
      open={editModal.isOpen}
      onOk={form.submit}
      onCancel={handleCancel}
      okText="Save"
    >
      <Form
        form={form}
        labelCol={{ span: 6 }}
        style={{ maxWidth: 500 }}
        initialValues={transferInitValues(initialValues)}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Merchant"
          name="receipt_merchant_name"
          rules={[{ required: true, message: "Please input merchant name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Category"
          name="claim_category"
          rules={[{ required: true, message: "Please input category!" }]}
        >
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-x-2">
          <Form.Item
            labelCol={{
              sm: 12,
            }}
            label="Date Purchase"
            name="date_of_purchase"
            rules={[{ required: true, message: "Please input Date!" }]}
          >
            <DatePicker allowClear={false} format="MM/DD/YYYY" />
          </Form.Item>
          <Form.Item
            label="Time Purchase"
            name="time_of_purchase"
            labelCol={{
              sm: 12,
            }}
          >
            <TimePicker format="hh:mm A" />
          </Form.Item>
          <Form.Item
            label="Receipt Total"
            name="receipt_total_amount"
            labelCol={{
              sm: 12,
            }}
            rules={[{ required: true, message: "Please input total!" }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
          <Form.Item
            labelCol={{
              sm: 12,
            }}
            label="Receipt CCY"
            name="receipt_ccy"
            rules={[{ required: true, message: "Please input CCY!" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <Form.Item label="Receipt Image">
          <Image
            className="max-h-24 sm:max-h-[300px]"
            src={editModal.data?.receipt_img_url}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
