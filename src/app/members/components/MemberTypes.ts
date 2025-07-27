export interface Member {
  userid: string;
  name: string;
  role: string;
  mobile: string;
  email: string;
  photo: string;
  aadhaar: string;
  pancard: string;
  account_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  upiid: string;
  street_or_house_no: string;
  landmark: string;
  address_one: string;
  address_two: string;
  city: string;
  state: string;
  pin: string;
  [key: string]: any;
}

export interface BasicInfoFields {
  name: string;
  phone_number: string;
  email: string;
  aadhar_no: string;
  pan_no: string;
  role: string;
  photo: string;
}

export interface AddressFields {
  street_or_house_no: string;
  landmark: string;
  address_one: string;
  address_two: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
}

export interface PayoutFields {
  account_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  upiid: string;
} 