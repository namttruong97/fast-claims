import { isEmpty } from "lodash";
import useUserStateStore from "stores/userStateStore";
import { TClaim } from "../types/claim";

const useUpdateClaim = () => {
  const store = useUserStateStore();

  const update = (newRecord: TClaim) => {
    let personalClaims =
      store.applicationData?.[newRecord?.staff_id]?.personalClaims;

    if (!isEmpty(personalClaims)) {
      const indexReplace = personalClaims.findIndex(
        (item) => item.claim_id === newRecord.claim_id
      );

      personalClaims[indexReplace] = newRecord;
    } else {
      personalClaims = [newRecord];
    }

    // Update manage claim if existed
    let manageClaims =
      store.applicationData?.[newRecord?.staff_id]?.manageClaims;
    if (!isEmpty(manageClaims)) {
      const indexManageReplace = manageClaims.findIndex(
        (item) => item.claim_id === newRecord.claim_id
      );
      manageClaims[indexManageReplace] = newRecord;
    } else {
      manageClaims = [newRecord];
    }

    const newDataPersonalStaff = {
      [newRecord?.staff_id]: {
        ...structuredClone(store.applicationData?.[newRecord?.staff_id]),
        personalClaims,
        manageClaims,
      },
    };

    store.setApplicationData({
      ...structuredClone(store.applicationData),
      ...newDataPersonalStaff,
    });
  };

  return {
    update,
  };
};

export default useUpdateClaim;
