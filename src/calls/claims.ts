import supabase from "@util/supabase";
import { isEmpty } from 'lodash';



export async function fetchEmployees() {
    const { data, error } = await supabase
        .from('org_employees')
        .select('*')

    if (error) {
        console.error('Error fetching unique employees:', error);
        return [];
    }

  const result = data.map((item) => {
    if (!isEmpty(item.roles)) {
      return ({ ...item, roles: JSON.parse(item.roles.replace(/'/g, '"')) })
    }
    return item
  })
  return result;
}

function parseDateString(dateString) {
    if (!dateString) {
      return new Date()
    }
    const parts = dateString.split(' ');
    const dateParts = parts[0].split('-');
    const timeParts = parts[1].split(':');
    // Note: month is 0-based in JavaScript Date constructor
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0], timeParts[0], timeParts[1]).getTime();
}

async function fetchStaffUnderManager(manager_id){
    const { data, error } = await supabase
    .from('org_employees')
    .select('staff_id')
    .eq('manager_id', manager_id)

    console.log('fetchStaffUnderManager',data)
    return data
}

export async function fetchManagerialViewClaimRecords(staff_id) {
    const managing_staff_ids = (await fetchStaffUnderManager(staff_id)).map(record => record.staff_id)


        const { data, error } = await supabase
        .from('Claims')
        .select('*')
        .in('staff_id', managing_staff_ids)
        .in('claim_state', ['SUBMITTED','APPROVED','REJECTED','FINALIZED'])

        console.log('fetchManagerialViewClaimRecords',data)


    if (error) {
        console.error('Error fetching claim records:', error);
        return [];
    }


    return data
    // Sort the records after fetching
    // const sortedData = data.sort((a, b) => parseDateString(a.updatedDt) - parseDateString(b.updatedDt));

    // // console.log(sortedData);
    // return sortedData;
}


export async function fetchPersonalClaimRecords(staff_id) {
    const { data, error } = await supabase
        .from('Claims')
        .select('*')
        .eq('staff_id', staff_id)


    if (error) {
        console.error('Error fetching claim records:', error);
        return [];
    }


    // Sort the records after fetching
    const sortedData = data.toSorted()

    console.log('fetchPersonalClaimRecords',sortedData);
    return sortedData;
}

export async function handleApprove(record_id) {

}

export async function handleReject(record_id) {

}

export async function handleFinalize(record_id) {

}

export async function handleVerify(record_id) {

}



export async function handleDelete(record_id) {

}



const data = [
    {
      "claim_id": "26c23c93-2cd2-4329-a083-2aa31ccf812b",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "259a260a-25e0-4014-b099-39445e6157fc",
      "receipt_language": "English",
      "receipt_address": "D2 Thao Dien, Vietnam",
      "receipt_country": "Vietnam",
      "receipt_unique_id": "04cf2f1a-211c-405b-ac69-980ed964a599",
      "receipt_datetime_of_purchase": "2023-04-25T23:11:42.311577",
      "receipt_merchant_name": "Jordan and Sons",
      "receipt_ccy": "VND",
      "receipt_total_amount": 342.0,
      "receipt_items": [],
      "receipt_taxes": 70.5,
      "receipt_img_url": "https://dummyimage.com/998x245",
      "claim_description": "Similar fight information forward forward wonder choice win.",
      "receipt_payment_method": "Online",
      "claim_category": "Travel",
      "claim_account": "00040 Acc Example",
      "claim_state": "DRAFT"
    },
    {
      "claim_id": "9ae48463-8331-4541-8820-7e7b6327a8e4",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "608dad12-654b-493e-826a-9e19bf718bef",
      "receipt_language": "English",
      "receipt_address": "D2 Thao Dien, Vietnam",
      "receipt_country": "Singapore",
      "receipt_unique_id": "e55dcb66-852f-4229-9cca-17213430e224",
      "receipt_datetime_of_purchase": "2020-12-21T03:10:59.112780",
      "receipt_merchant_name": "Reed Inc",
      "receipt_ccy": "VND",
      "receipt_total_amount": 68.42,
      "receipt_items": [],
      "receipt_taxes": 95.32,
      "receipt_img_url": "https://placekitten.com/825/135",
      "claim_description": "Billion type reflect politics about example my strategy.",
      "receipt_payment_method": "Online",
      "claim_category": "Meals",
      "claim_account": "00040 Acc Example",
      "claim_state": "FINALIZED"
    },
    {
      "claim_id": "f63b422c-39c1-4af8-af81-c84efa71c408",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "1f88f7a4-e25f-4d23-89d5-69e351d2f3b4",
      "receipt_language": "Vietnamese",
      "receipt_address": "Singapore",
      "receipt_country": "Vietnam",
      "receipt_unique_id": "ceef17f7-61c7-472f-8c28-a8dd9c957295",
      "receipt_datetime_of_purchase": "2022-06-14T15:55:27.797278",
      "receipt_merchant_name": "Elliott-Wagner",
      "receipt_ccy": "VND",
      "receipt_total_amount": 575.18,
      "receipt_items": [],
      "receipt_taxes": 92.4,
      "receipt_img_url": "https://dummyimage.com/258x647",
      "claim_description": "Movement seem fill phone.",
      "receipt_payment_method": "Cash",
      "claim_category": "Other",
      "claim_account": "00040 Acc Example",
      "claim_state": "APPROVED"
    },
    {
      "claim_id": "da3b958c-60b5-466f-927b-03ec1ee7d657",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "bf20f38f-b53f-4db4-bd79-dcb75b255db0",
      "receipt_language": "Vietnamese",
      "receipt_address": "D2 Thao Dien, Vietnam",
      "receipt_country": "Singapore",
      "receipt_unique_id": "fdc5ad54-f792-4a04-846b-3378949a2161",
      "receipt_datetime_of_purchase": "2023-05-01T16:58:57.885456",
      "receipt_merchant_name": "Hart LLC",
      "receipt_ccy": "VND",
      "receipt_total_amount": 671.6,
      "receipt_items": [],
      "receipt_taxes": 29.06,
      "receipt_img_url": "https://picsum.photos/640/671",
      "claim_description": "Law walk break.",
      "receipt_payment_method": "Online",
      "claim_category": "Other",
      "claim_account": "600401 QBE",
      "claim_state": "REJECTED"
    },
    {
      "claim_id": "60587149-9cf6-4bb2-ade9-515005c194d9",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "55013e5d-6418-4463-a287-56132aaa692e",
      "receipt_language": "English",
      "receipt_address": "D2 Thao Dien, Vietnam",
      "receipt_country": "Vietnam",
      "receipt_unique_id": "9fd35de9-316a-4ebf-9ba0-a9e1ce3077c9",
      "receipt_datetime_of_purchase": "2021-06-20T09:10:21.578365",
      "receipt_merchant_name": "Gonzalez, Baker and Frederick",
      "receipt_ccy": "USD",
      "receipt_total_amount": 519.01,
      "receipt_items": [],
      "receipt_taxes": 79.47,
      "receipt_img_url": "https://dummyimage.com/578x784",
      "claim_description": "Standard law interesting name reality.",
      "receipt_payment_method": "Online",
      "claim_category": "Other",
      "claim_account": "600401 QBE",
      "claim_state": "PENDING"
    },
    {
      "claim_id": "673c38d7-52ea-4810-89ee-a9ed634f3680",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "fa9e4cea-2eb7-4091-ac9b-cde77b833c5b",
      "receipt_language": "Vietnamese",
      "receipt_address": "Singapore",
      "receipt_country": "Singapore",
      "receipt_unique_id": "8df16169-18d2-43b4-a2cf-9008b548d961",
      "receipt_datetime_of_purchase": "2023-02-06T10:02:29.271570",
      "receipt_merchant_name": "Ayala, Hall and Lynn",
      "receipt_ccy": "VND",
      "receipt_total_amount": 155.04,
      "receipt_items": [],
      "receipt_taxes": 22.68,
      "receipt_img_url": "https://dummyimage.com/988x756",
      "claim_description": "Last window prepare top note actually in.",
      "receipt_payment_method": "Cash",
      "claim_category": "Meals",
      "claim_account": "00040 Acc Example",
      "claim_state": "REJECTED"
    },
    {
      "claim_id": "46b21e92-aad9-4732-aee3-af45ec0b68c0",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "fed54f45-86a3-4202-ae71-4cec7b589a8e",
      "receipt_language": "Vietnamese",
      "receipt_address": "Singapore",
      "receipt_country": "Singapore",
      "receipt_unique_id": "e24aa164-82f9-41a9-ae42-45e1fef91642",
      "receipt_datetime_of_purchase": "2023-10-24T09:58:35.852466",
      "receipt_merchant_name": "Pope Inc",
      "receipt_ccy": "USD",
      "receipt_total_amount": 430.09,
      "receipt_items": [],
      "receipt_taxes": 89.38,
      "receipt_img_url": "https://dummyimage.com/249x114",
      "claim_description": "Us look career give term class million.",
      "receipt_payment_method": "Cash",
      "claim_category": "Meals",
      "claim_account": "00040 Acc Example",
      "claim_state": "DRAFT"
    },
    {
      "claim_id": "932ad339-de46-497a-ba7e-245c31adc982",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "e3b02009-2fea-4368-a1a2-dbaa78d0f412",
      "receipt_language": "Vietnamese",
      "receipt_address": "Singapore",
      "receipt_country": "Singapore",
      "receipt_unique_id": "1d3a3c01-b602-4fc4-8238-769038c02ed6",
      "receipt_datetime_of_purchase": "2021-02-10T10:32:01.857290",
      "receipt_merchant_name": "Rowe Inc",
      "receipt_ccy": "VND",
      "receipt_total_amount": 180.29,
      "receipt_items": [],
      "receipt_taxes": 62.72,
      "receipt_img_url": "https://placekitten.com/282/745",
      "claim_description": "Then group family good program.",
      "receipt_payment_method": "Cash",
      "claim_category": "Meals",
      "claim_account": "00040 Acc Example",
      "claim_state": "REJECTED"
    },
    {
      "claim_id": "095d2e6b-d1e5-45fb-a0a1-ff3645fa33dd",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "c339cfb4-41bc-4fe4-a492-2763697f1ab0",
      "receipt_language": "Vietnamese",
      "receipt_address": "D2 Thao Dien, Vietnam",
      "receipt_country": "Vietnam",
      "receipt_unique_id": "60e63e82-ae15-4c4d-807d-1c6bfb7c0939",
      "receipt_datetime_of_purchase": "2022-02-19T05:26:24.712121",
      "receipt_merchant_name": "Erickson-Rodgers",
      "receipt_ccy": "USD",
      "receipt_total_amount": 604.12,
      "receipt_items": [],
      "receipt_taxes": 91.25,
      "receipt_img_url": "https://dummyimage.com/621x277",
      "claim_description": "Woman author quality western focus admit.",
      "receipt_payment_method": "Cash",
      "claim_category": "Travel",
      "claim_account": "600401 QBE",
      "claim_state": "DRAFT"
    },
    {
      "claim_id": "c46e3f28-5be3-4f57-b0f2-5834b2415f52",
      "org_id": "9c245e7c-8ba7-4098-8c20-d85ef933366a",
      "staff_id": "37a72af1-be29-4639-8d70-6c8c94cc233b",
      "receipt_language": "English",
      "receipt_address": "Singapore",
      "receipt_country": "Singapore",
      "receipt_unique_id": "1535c0d1-3632-4064-9a87-e0076a82e1c6",
      "receipt_datetime_of_purchase": "2022-10-27T16:58:42.176528",
      "receipt_merchant_name": "Fisher-Flynn",
      "receipt_ccy": "VND",
      "receipt_total_amount": 60.27,
      "receipt_items": [],
      "receipt_taxes": 88.1,
      "receipt_img_url": "https://picsum.photos/399/624",
      "claim_description": "Reflect carry six interest effort issue behind floor.",
      "receipt_payment_method": "Card",
      "claim_category": "Meals",
      "claim_account": "00040 Acc Example",
      "claim_state": "APPROVED"
    }
  ]
  
  export function prettifyDatetime(dt_str) {
    const date = new Date(dt_str);
    const options = { 
      month: 'short', 
      day: '2-digit', 
      year: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true // Specify whether you want to use 12-hour format, true or false
    };
    return date.toLocaleString('en-US');
  }