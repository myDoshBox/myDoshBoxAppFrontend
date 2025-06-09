import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { CancelButton } from "../../../components/ButtonsComponent/OtherButtons";
import { ProceedButton } from "../../../components/ButtonsComponent/TransactionButtons";

import { useDispatch, useSelector } from "react-redux";
// import { setEscrowProduct } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { setShippingInfo } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { useAppContext } from "../../../context/appContext";
import { toast } from "react-toastify";

const ShippingDetailsForm = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5">
              <ShippingDetailsFormLogic />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ShippingDetailsFormLogic = () => {
  // const { userInfo } = useSelector((state) => state.usersauth);
  const loggedInUser = localStorage.getItem("userInfo");

  const userInfo = JSON.parse(loggedInUser).user.email;
  const { storeInitiateEscrowProductForm, initiateEscrowProductForm } =
    useAppContext();

  const { shippingInfo } = useSelector((state) => state.escrowProductInfo);

  const initialValues = {
    shipping_company: "",
    delivery_person_name: "",
    delivery_person_number: "",
    delivery_person_email: "",
    delivery_date: "",
    pick_up_address: "",
    transaction_id: "",
  };

  const [shippingValues, setShippingValues] = useState(
    shippingInfo || initialValues
  );

  // console.log("shippingInfo", shippingInfo);

  const [shippingDetails, setShippingDetails] = useState([]);
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImageURL, setProductImageURL] = useState("");

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [buySellChoice, setBuySellChoice] = useState();

  //   if (!productImageFile) {
  //     console.error("No image selected for upload");
  //     setFormErrors({
  //       ...formErrors,
  //       product_image: "No image selected for upload",
  //     });
  //     return;
  //   }
  // };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setShippingValues({ ...shippingValues, [name]: value });
  };

  const handleCancel = () => {
    dispatch(setShippingInfo(null));
    navigate("/userdashboard/transaction-history");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShippingDetails([...shippingDetails, shippingValues]);
    // setShippingDetails(shippingValues);

    if (Object.keys(formErrors).length === 0) {
      setIsSubmit(true);
      dispatch(setShippingInfo(shippingValues));
      navigate(
        `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/shipping-details-summary/${shippingValues?.transaction_id}`
      );
    }

    // console.log(shippingValues);
  };

  useEffect(() => {
    setFormErrors(validate(shippingValues));
  }, [shippingValues]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.transaction_id) {
      errors.transaction_id =
        "Please provide the price of the product you would like to purchase";
    }
    if (!values.shipping_company) {
      errors.shipping_company = "Please provide the name of shipping company";
    }
    if (!values.delivery_person_name) {
      errors.delivery_person_name =
        "Please provide the name of the delivery person";
    }
    if (!values.delivery_person_number) {
      errors.delivery_person_number =
        "Please provide the phone number of the delivery person";
    }

    // if (
    //   !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(
    //     values.delivery_person_email
    //   )
    // ) {
    //   errors.delivery_person_email = "Email is not valid";
    // }

    if (
      values.delivery_person_email &&
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(
        values.delivery_person_email
      )
    ) {
      errors.delivery_person_email = "Email is not valid";
    }

    if (!values.delivery_date) {
      errors.delivery_date = "Please provide the expected delivery date";
    }

    if (!values.pick_up_address) {
      errors.pick_up_address = "Please provide the agreed pickup address";
    }

    return errors;
  };

  return (
    <div className="px-lg-5">
      <Form
        onSubmit={handleSubmit}
        className="w-100 mt-5 shadow InitiateEscrow p-3 p-lg-5 rounded"
      >
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Transaction ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the transaction id for this transaction"
            id="transaction_id"
            name="transaction_id"
            value={shippingValues?.transaction_id}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.transaction_id && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.transaction_id}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="m-0">Shipping Company Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the name of the shipping company"
            id="shipping_company"
            name="shipping_company"
            value={shippingValues?.shipping_company}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.shipping_company && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.shipping_company}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="m-0">Name of Delivery Person</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the name of the delivery person"
            id="delivery_person_name"
            name="delivery_person_name"
            value={shippingValues.delivery_person_name}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.delivery_person_name && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.delivery_person_name}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="m-0">
            Phone Number of Delivery Person
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the phone number of delivery person number"
            id="delivery_person_number"
            name="delivery_person_number"
            value={shippingValues.delivery_person_number}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.delivery_person_number && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.delivery_person_number}
            </div>
          )}
        </Form.Group>
        {/* <Form.Group className="mb-3">
          <label className="">What type of transaction are you making?</label>
          <div className="d-flex">
            <div className="d-flex justify-content-between border border-1 rounded-1 px-2 pt-2 pb-1 me-3 EscrowChoice">
              <label className="form-check-label me-2 me-lg-3" for="buying">
                Buying
              </label>
              <input
                type="radio"
                className="form-check"
                checked={buySellChoice === "buy"}
                onChange={(e) => {
                  setBuySellChoice("buy");
                  handleChange(e);
                }}
                id="transaction_type"
                name="transaction_type"
                // value="buy"
                value={"buy"}
              />
            </div>
            <div className="d-flex justify-content-between border border-1 rounded-1 px-2 pt-2 pb-1 EscrowChoice">
              <label className="form-check-label me-2 me-lg-3" for="selling">
                Sell
              </label>
              <input
                type="radio"
                className="form-check"
                checked={buySellChoice === "sell"}
                onChange={(e) => {
                  setBuySellChoice("sell");
                  handleChange(e);
                }}
                id="transaction_type"
                name="transaction_type"
                value={"sell"}
              />
            </div>
          </div>
          {formErrors.transaction_type && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.transaction_type}
            </div>
          )}
        </Form.Group> */}

        <Form.Group className="mb-3">
          <Form.Label className="m-0">Email of Delivery Person</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the email of delivery person"
            id="delivery_person_email"
            name="delivery_person_email"
            value={shippingValues.delivery_person_email}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.delivery_person_email && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.delivery_person_email}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Delivery Date</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the expected delivery date"
            id="delivery_date"
            name="delivery_date"
            value={shippingValues.delivery_date}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.delivery_date && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.delivery_date}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="m-0">Agreed Pickup Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter the agreed pickup address"
            id="pick_up_address"
            name="pick_up_address"
            value={shippingValues.pick_up_address}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.pick_up_address && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.pick_up_address}
            </div>
          )}
        </Form.Group>

        <div className="d-flex justify-content-center">
          <Button
            className="border-0 mt-3 btn btn-danger text-white pale-red"
            style={{ width: "140px" }}
            onClick={handleCancel}
          >
            CANCEL
          </Button>

          <Button
            className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
            style={{ width: "120px" }}
            type="submit"
          >
            PROCEED
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ShippingDetailsForm;
