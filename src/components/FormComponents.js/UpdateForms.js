import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";

import {
  SaveChanges,
  SaveChangesBtn,
  UpdateBtn,
  UpdateProfileBtn,
} from "../ButtonsComponent/EditButtons";

export const UpdateProfile = () => {
  const initialValues = {
    email: "",
    phone: "",
  };
  const [UpdateProfile, setUpdateProfile] = useState(initialValues);
  const [NewProfile, setNewProfile] = useState([]);
  const [ValidationError, setValidationError] = useState({});
  const [FormSubmission, setFormSubmission] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUpdateProfile({ ...UpdateProfile, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (UpdateProfile.email && UpdateProfile.phone) {
      setNewProfile({ ...NewProfile, UpdateProfile });
      setUpdateProfile({
        email: "",
        phone: "",
      });
    }
    setValidationError(validate(UpdateProfile));
    setFormSubmission(true);
  };

  useEffect(() => {
    // console.log(ValidationError);
    if (Object.keys(ValidationError).length === 0 && FormSubmission) {
      // console.log(UpdateProfile);
      navigate("../../userdashboard");
    }
  }, [ValidationError]);

  const validate = (formValues) => {
    const errorValues = {};
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const phoneRegex =
      /((?:\+|00)[17](?: |-)?|(?:\+|00)[1-9]\d{0,2}(?: |-)?|(?:\+|00)1-\d{3}(?: |-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |-)[0-9]{3}(?: |-)[0-9]{4})|([0-9]{7}))$/;
    if (!formValues.email) {
      errorValues.email = "Email Address is Required";
    } else if (!emailRegex.test(formValues.email)) {
      errorValues.email = "Please Enter a Valid Email Address";
    }
    if (!formValues.phone) {
      errorValues.phone = "Phone Number is Required";
    } else if (!phoneRegex.test(formValues.phone)) {
      errorValues.phone = "Please add your country code";
    }
    return errorValues;
  };

  return (
    <div className="bg-white rounded-3 shadow card p-4">
      <p className="text-uppercase">Update Profile</p>
      <Form className="ms-3 mt-4 mb-5">
        <Form.Group className="Email mb-3" controlId="Email">
          <Form.Label className="m-0">Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Example@email.com"
            name="email"
            value={UpdateProfile.email}
            onChange={handleChange}
          />
          <small className="text-danger fw-lighter">
            {ValidationError.email}
          </small>
        </Form.Group>
        <Form.Group className="Password mb-3" controlId="Password">
          <Form.Label className="m-0">Phone Number</Form.Label>
          <Form.Control
            type="tel"
            placeholder="Use this format: +234 815 672 3165"
            name="phone"
            value={UpdateProfile.phone}
            onChange={handleChange}
          />
          <small className="text-danger fw-lighter">
            {ValidationError.phone}
          </small>
        </Form.Group>
        <div onClick={handleSubmit}>
          <SaveChangesBtn />
        </div>
      </Form>
    </div>
  );
};

export const UpdatePassword = () => {
  const initialValues = {
    NewPassword: "",
    ConfirmPassword: "",
  };
  const [UpdatePassword, setUpdatePassword] = useState(initialValues);
  const [NewPassword, setNewPassword] = useState([]);

  // States for validation
  const [ValidationError, setValidationError] = useState({});
  const [FormSubmission, setFormSubmission] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUpdatePassword({ ...UpdatePassword, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (UpdatePassword.NewPassword === UpdatePassword.ConfirmPassword) {
      setNewPassword({ ...NewPassword, UpdatePassword });
      setUpdatePassword({
        NewPassword: "",
        ConfirmPassword: "",
      });
    }
    setValidationError(validate(UpdatePassword));
    setFormSubmission(true);
  };

  useEffect(() => {
    // console.log(ValidationError);
    if (Object.keys(ValidationError).length === 0 && FormSubmission) {
      // console.log(UpdateProfile);
    }
  }, [ValidationError]);

  const validate = (formValues) => {
    const errorValues = {};
    const PasswordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!formValues.NewPassword) {
      errorValues.NewPassword = "Password is Required";
    } else if (!PasswordRegex.test(formValues.NewPassword)) {
      errorValues.NewPassword = `Password must at least contain:
      an upper case and lower case letter, one digit and one special character`;
    } else if (formValues.NewPassword !== formValues.ConfirmPassword) {
      errorValues.NewPassword = "Passwords are not the same";
    }

    if (!formValues.ConfirmPassword) {
      errorValues.ConfirmPassword = "Password is Required";
    } else if (formValues.ConfirmPassword !== formValues.NewPassword) {
      errorValues.ConfirmPassword = "Passwords are not the same";
    }

    return errorValues;
  };

  return (
    <div className="bg-white rounded-3 shadow card p-4">
      <p className="text-uppercase">Update Password</p>
      <Form className="ms-3 mt-4 mb-5">
        <Form.Group className="mb-3 Password" controlId="NewPassword">
          <Form.Label className="m-0" style={{ width: "15rem" }}>
            New Password
          </Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter a New Password"
            name="NewPassword"
            value={UpdatePassword.NewPassword}
            onChange={handleChange}
          />
          <small id="validatePrompt" className="text-danger fw-lighter">
            {ValidationError.NewPassword}
          </small>
        </Form.Group>

        <Form.Group className="mb-3 Password" controlId="ConfirmPassword">
          <Form.Label className="m-0">Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Your New Password"
            name="ConfirmPassword"
            value={UpdatePassword.ConfirmPassword}
            onChange={handleChange}
          />
          <small id="validatePrompt" className="text-danger fw-lighter">
            {ValidationError.ConfirmPassword}
          </small>
        </Form.Group>
        <div onClick={handleSubmit}>
          <SaveChangesBtn />
        </div>
      </Form>
    </div>
  );
};

export const UpdateBankDetails = () => {
  const initialValues = {
    AccountNumber: "",
    BankName: "",
    AccountName: "",
  };
  const [BankDetails, setBankDetails] = useState(initialValues);
  const [NewBankDetails, setNewBankDetails] = useState([]);

  // States for validation
  const [ValidationError, setValidationError] = useState({});
  const [FormSubmission, setFormSubmission] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBankDetails({ ...BankDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      BankDetails.AccountNumber &&
      BankDetails.BankName &&
      BankDetails.AccountName
    ) {
      setNewBankDetails({ ...NewBankDetails, BankDetails });
      setBankDetails(initialValues);
    }
    setValidationError(validate(BankDetails));
    setFormSubmission(true);
  };

  useEffect(() => {
    // console.log(ValidationError);
    if (Object.keys(ValidationError).length === 0 && FormSubmission) {
      // console.log(UpdateProfile);
      navigate("../../userdashboard");
    }
  }, [ValidationError]);

  const validate = (formValues) => {
    const errorValues = {};
    if (!formValues.AccountNumber) {
      errorValues.AccountNumber = "Bank Account Number is Required";
    }
    if (!formValues.BankName) {
      errorValues.BankName = "Bank Name is Required";
    }
    if (!formValues.AccountName) {
      errorValues.AccountName = "Bank Account Name is Required";
    }
    return errorValues;
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="border-0 bg-white rounded-3 shadow card p-4 px-lg-5 py-lg-3"
    >
      <Form.Group className="mb-3 AccountNum" controlId="AccountNum">
        <Form.Label className="mb-0">Account Number</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your bank account number"
          name="AccountNumber"
          value={BankDetails.AccountNumber}
          onChange={handleChange}
          className=""
        />
        <small id="validatePrompt" className="text-danger fw-lighter">
          {ValidationError.AccountNumber}
        </small>
      </Form.Group>

      <Form.Group className="mb-3 BankName" controlId="BankName">
        <Form.Label className="mb-0">Bank Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your bank name"
          name="BankName"
          value={BankDetails.BankName}
          onChange={handleChange}
          className=""
        />
        <small id="validatePrompt" className="text-danger fw-lighter">
          {ValidationError.BankName}
        </small>
      </Form.Group>
      <Form.Group className="mb-3 AccountName" controlId="AccountName">
        <Form.Label className="mb-0">Account Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your bank account name"
          name="AccountName"
          value={BankDetails.AccountName}
          onChange={handleChange}
          className=""
        />
        <small id="validatePrompt" className="text-danger fw-lighter">
          {ValidationError.AccountName}
        </small>
      </Form.Group>
      <div className="mb-4">
        <div onClick={handleSubmit}>
          <UpdateBtn />
        </div>
      </div>
    </Form>
  );
};

export const UserUpdateProfile = () => {
  const initialValues = {
    Email: "",
    PhoneNumber: "",
    NewPassword: "",
    ConfirmPassword: "",
  };
  const [UserDetails, setUserDetails] = useState(initialValues);
  const [NewUserDetails, setNewUserDetails] = useState([]);
  const navigate = useNavigate();

  // States for validation
  const [ValidationError, setValidationError] = useState({});
  const [FormSubmission, setFormSubmission] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUserDetails({ ...UserDetails, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      UserDetails.Email &&
      UserDetails.PhoneNumber &&
      UserDetails.NewPassword &&
      UserDetails.ConfirmPassword
    ) {
      setNewUserDetails({ ...NewUserDetails, UserDetails });
      setUserDetails(initialValues);
    }
    setValidationError(validate(UserDetails));
    setFormSubmission(true);
  };

  useEffect(() => {
    // console.log(ValidationError);
    if (Object.keys(ValidationError).length === 0 && FormSubmission) {
      // console.log(UpdateProfile);
      navigate("../../userdashboard");
    }
  }, [ValidationError]);

  const validate = (formValues) => {
    const errorValues = {};

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const phoneRegex =
      /((?:\+|00)[17](?: |-)?|(?:\+|00)[1-9]\d{0,2}(?: |-)?|(?:\+|00)1-\d{3}(?: |-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |-)[0-9]{3}(?: |-)[0-9]{4})|([0-9]{7}))$/;
    const PasswordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

    if (!formValues.Email) {
      errorValues.Email = "Email Address is Required";
    } else if (!emailRegex.test(formValues.Email)) {
      errorValues.Email = "Please Enter a Valid Email Address";
    }
    if (!formValues.PhoneNumber) {
      errorValues.PhoneNumber = "Phone Number is Required";
    } else if (!phoneRegex.test(formValues.PhoneNumber)) {
      errorValues.PhoneNumber = "Please enter a valid Phone Number";
    }
    if (!formValues.NewPassword) {
      errorValues.NewPassword = "Password is Required";
    } else if (!PasswordRegex.test(formValues.NewPassword)) {
      errorValues.NewPassword = `Password must at least contain:
      an upper case and lower case letter, one digit and one special character`;
    } else if (formValues.NewPassword !== formValues.ConfirmPassword) {
      errorValues.NewPassword = "Passwords are not the same";
    }

    if (!formValues.ConfirmPassword) {
      errorValues.ConfirmPassword = "Password is Required";
    } else if (formValues.ConfirmPassword !== formValues.NewPassword) {
      errorValues.ConfirmPassword = "Passwords are not the same";
    }
    return errorValues;
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="bg-white rounded-3 UserUpdateProfile shadow card p-3 px-lg-5 py-lg-4"
    >
      <Form.Group className="mb-4 UpdateEmail" controlId="Email">
        <Form.Label className="m-0">Email Address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter your email"
          name="Email"
          value={UserDetails.Email}
          onChange={handleChange}
          className=""
        />
        <small id="validatePrompt" className="text-danger fw-lighter">
          {ValidationError.Email}
        </small>
      </Form.Group>
      <Form.Group className="mb-3 Phone" controlId="PhoneNumber">
        <Form.Label className="m-0">Phone Number</Form.Label>
        <Form.Control
          type="tel"
          placeholder="Enter Phone Number"
          name="PhoneNumber"
          value={UserDetails.PhoneNumber}
          onChange={handleChange}
          className=""
        />
        <small id="validatePrompt" className="text-danger fw-lighter">
          {ValidationError.PhoneNumber}
        </small>
      </Form.Group>

      <Form.Group className="mb-4 Pass" controlId="Password">
        <Form.Label className="m-0">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter a new password"
          name="NewPassword"
          value={UserDetails.NewPassword}
          onChange={handleChange}
          className=""
        />
        <small id="validatePrompt" className="text-danger fw-lighter">
          {ValidationError.NewPassword}
        </small>
      </Form.Group>
      <Form.Group className="pb-4 Pass" controlId="ConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm password"
          name="ConfirmPassword"
          value={UserDetails.ConfirmPassword}
          onChange={handleChange}
          className=""
        />
        <small id="validatePrompt" className="text-danger fw-lighter">
          {ValidationError.ConfirmPassword}
        </small>
      </Form.Group>

      <div onClick={handleSubmit} className="mb-4">
        <UpdateProfileBtn />
      </div>
    </Form>
  );
};
