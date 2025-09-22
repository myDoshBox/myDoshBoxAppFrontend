import { useState } from "react";
import { UserDashboardNavbar } from "../../components/NavbarComponents/TopNavbars";
import { Link } from "react-router-dom";

const InitiateDisputesForm = () => {
  return (
    <>
      <div className="contestPage" style={{backgroundColor: "rgba(230, 240, 237, 0.32)"}}>
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5">
              <ComplaintForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ComplaintForm = () => {
  const initialValues = {
    phoneNumber: "",
    transactionId: "",
    complaintType: "",
    file: "",
    provideDetails: "",
  };

  const [dispute, setDispute] = useState(initialValues);
  const [disputeDetails, setDisputeDetails] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setDispute({
      ...dispute,
      [name]: name === "file" ? files[0]?.name : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      dispute.phoneNumber &&
      dispute.transactionId &&
      dispute.complaintType &&
      dispute.file &&
      dispute.provideDetails
    ) {
      setDisputeDetails([...disputeDetails, dispute]);
      setDispute(initialValues);
    }
  };

  return (
    <div className="container my-5">
      <div className="mx-auto" style={{ maxWidth: "960px" }}>
        <div className="card rounded-2 p-4 border-0 ">
          <div className="text-center mb-4">
            <h4 className="fw-bold text-success">Complaint Form</h4>
            <p className="text-muted">Submit details about your transaction issue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label fw-semibold">
                Phone Number <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={dispute.phoneNumber}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="transactionId" className="form-label fw-semibold">
                Transaction ID <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                name="transactionId"
                id="transactionId"
                value={dispute.transactionId}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter transaction reference"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="complaintType" className="form-label fw-semibold">
                Complaint Type <span className="text-danger">*</span>
              </label>
              <select
                name="complaintType"
                id="complaintType"
                className="form-select"
                value={dispute.complaintType}
                onChange={handleChange}
              >
                <option value="">Select complaint type</option>
                <option value="Failed Transactions">Failed Transactions</option>
                <option value="Wrong Items">Wrong Items</option>
                <option value="Incomplete Items">Incomplete Items</option>
                <option value="Incomplete Payment">Incomplete Payment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="file" className="form-label fw-semibold">
                Attach Supporting Image(s) <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                name="file"
                id="file"
                className="form-control"
                onChange={handleChange}
              />
              {dispute.file && (
                <small className="text-muted fst-italic mt-1 d-block">Selected: {dispute.file}</small>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="provideDetails" className="form-label fw-semibold">
                Details of Complaint <span className="text-danger">*</span>
              </label>
              <textarea
                name="provideDetails"
                id="provideDetails"
                rows="4"
                className="form-control"
                placeholder="Explain the reason for this complaint"
                value={dispute.provideDetails}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-success rounded-pill">
                Submit Complaint
              </button>
            </div>

            <div className="text-center mt-3">
              <Link to="../ticket" className="text-decoration-none text-success">
                View Submitted Complaints
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};



// const ComplaintForm = () => {
//   const initialValues = {
//     phoneNumber: "",
//     transactionId: "",
//     complaintType: "",
//     file: "",
//     provideDetails: "",
//   };

//   const [dispute, setDispute] = useState(initialValues);
//   const [disputeDetails, setDisputeDetails] = useState([]);

//   const handleChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setDispute({ ...dispute, [name]: value });
//   };
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (
//       dispute.phoneNumber &&
//       dispute.transactionId &&
//       dispute.complaintType &&
//       dispute.file &&
//       dispute.provideDetails
//     ) {
//       setDisputeDetails([...disputeDetails, dispute]);
//       setDispute(initialValues);
//     }
//   };

//   return (
//     <>
//       <div className="mx-auto">
//         <div className="text-center">
//           <h5 className="fw-bold">COMPLAINT FORM</h5>
//         </div>

//         {/* Form Section Starts */}

//         <form className="form mt-5" onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <input
//               value={dispute.phoneNumber}
//               onChange={handleChange}
//               placeholder="Phone Number"
//               type="tel"
//               className="form-control"
//               id="phoneNumber"
//               name="phoneNumber"
//             />

//             <span
//               id="nameHelp"
//               className="form-text text-danger fst-italic fw-lighter"
//             >
//               *This field is required
//             </span>
//           </div>
//           <div className="mb-4">
//             <input
//               value={dispute.transactionId}
//               onChange={handleChange}
//               placeholder="Transaction ID"
//               type="text"
//               className="form-control"
//               id="transactionId"
//               name="transactionId"
//             />

//             <span
//               id="nameHelp"
//               className="form-text text-danger fst-italic fw-lighter"
//             >
//               *This field is required
//             </span>
//           </div>

//           <div>
//             <select
//               value={dispute.complaintType}
//               onChange={handleChange}
//               className="form-select mb-4"
//               aria-label="Default select example"
//               id="complaintType"
//               name="complaintType"
//             >
//               <option selected>Failed Transactions</option>
//               <option value="1">Wrong Items</option>
//               <option value="2">Incomplete Items</option>
//               <option value="3">Incomplete Payment</option>
//               <option value="4">Other</option>
//             </select>

//             <span
//               id="nameHelp"
//               className="form-text text-danger fst-italic fw-lighter"
//             >
//               *This field is required
//             </span>
//           </div>

//           <div className="input-group mb-3">
//             <input
//               value={dispute.file}
//               onChange={handleChange}
//               type="file"
//               className="form-control"
//               id="file"
//               name="file"
//               placeholder="Attach Image(s)"
//             />
//           </div>

//           <div className="mb-3 mt-4">
//             <textarea
//               value={dispute.provideDetails}
//               onChange={handleChange}
//               placeholder="Reasons for contesting this complaint"
//               className="form-control "
//               id="provideDetails"
//               name="provideDetails"
//               rows="3"
//             ></textarea>
//           </div>

//           <div className="d-grid gap-2 w-25 mx-auto mt-4">
//             <Link to={"../ticket"}>
//               <button className="btn btn-success w-100" type="submit">
//                 Submit
//               </button>
//             </Link>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

export default InitiateDisputesForm;

// start here

// import { useState, useEffect } from "react";
// import { Button, Form } from "react-bootstrap";
// import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
// import { Link, useNavigate } from "react-router-dom";
// import { CancelButton } from "../../../components/ButtonsComponent/OtherButtons";
// import { ProceedButton } from "../../../components/ButtonsComponent/TransactionButtons";

// import { useDispatch, useSelector } from "react-redux";
// // import { setEscrowProduct } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
// import { setShippingInfo } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
// import { useAppContext } from "../../../context/appContext";
// import { toast } from "react-toastify";

// const ShippingDetailsForm = () => {
//   return (
//     <>
//       <div className="contestPage">
//         <div className="row">
//           <div className="col-lg-3 col-sm-12"></div>

//           <div className="col-lg-9 col-sm-12">
//             <UserDashboardNavbar />
//             <div className="mt-5">
//               <ShippingDetailsFormLogic />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const ShippingDetailsFormLogic = () => {
//   // const { userInfo } = useSelector((state) => state.usersauth);
//   const loggedInUser = localStorage.getItem("userInfo");

//   const userInfo = JSON.parse(loggedInUser).user.email;
//   const { storeInitiateEscrowProductForm, initiateEscrowProductForm } =
//     useAppContext();

//   const { shippingInfo } = useSelector((state) => state.escrowProductInfo);

//   const initialValues = {
//     shipping_company: "",
//     delivery_person_name: "",
//     delivery_person_number: "",
//     delivery_person_email: "",
//     delivery_date: "",
//     pick_up_address: "",
//     transaction_id: "",
//   };

//   const [shippingValues, setShippingValues] = useState(
//     shippingInfo || initialValues
//   );

//   // console.log("shippingInfo", shippingInfo);

//   const [shippingDetails, setShippingDetails] = useState([]);
//   const [productImageFile, setProductImageFile] = useState(null);
//   const [productImageURL, setProductImageURL] = useState("");

//   const [formErrors, setFormErrors] = useState({});
//   const [isSubmit, setIsSubmit] = useState(false);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [buySellChoice, setBuySellChoice] = useState();

//   //   if (!productImageFile) {
//   //     console.error("No image selected for upload");
//   //     setFormErrors({
//   //       ...formErrors,
//   //       product_image: "No image selected for upload",
//   //     });
//   //     return;
//   //   }
//   // };

//   const handleChange = (e) => {
//     const name = e.target.name;
//     const value = e.target.value;
//     setShippingValues({ ...shippingValues, [name]: value });
//   };

//   const handleCancel = () => {
//     dispatch(setShippingInfo(null));
//     navigate("/userdashboard/transaction-history");
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShippingDetails([...shippingDetails, shippingValues]);
//     // setShippingDetails(shippingValues);

//     if (Object.keys(formErrors).length === 0) {
//       setIsSubmit(true);
//       dispatch(setShippingInfo(shippingValues));
//       navigate(
//         `/userdashboard/transaction-history/confirm-escrow-product-transaction/shipping-details-form/shipping-details-summary/${shippingValues?.transaction_id}`
//       );
//     }

//     // console.log(shippingValues);
//   };

//   useEffect(() => {
//     setFormErrors(validate(shippingValues));
//   }, [shippingValues]);

//   const validate = (values) => {
//     const errors = {};
//     const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

//     if (!values.transaction_id) {
//       errors.transaction_id =
//         "Please provide the price of the product you would like to purchase";
//     }
//     if (!values.shipping_company) {
//       errors.shipping_company = "Please provide the name of shipping company";
//     }
//     if (!values.delivery_person_name) {
//       errors.delivery_person_name =
//         "Please provide the name of the delivery person";
//     }
//     if (!values.delivery_person_number) {
//       errors.delivery_person_number =
//         "Please provide the phone number of the delivery person";
//     }

//     // if (
//     //   !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(
//     //     values.delivery_person_email
//     //   )
//     // ) {
//     //   errors.delivery_person_email = "Email is not valid";
//     // }

//     if (
//       values.delivery_person_email &&
//       !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(
//         values.delivery_person_email
//       )
//     ) {
//       errors.delivery_person_email = "Email is not valid";
//     }

//     if (!values.delivery_date) {
//       errors.delivery_date = "Please provide the expected delivery date";
//     }

//     if (!values.pick_up_address) {
//       errors.pick_up_address = "Please provide the agreed pickup address";
//     }

//     return errors;
//   };

//   return (
//     <div className="px-lg-5">
//       <Form
//         onSubmit={handleSubmit}
//         className="w-100 mt-5 shadow InitiateEscrow p-3 p-lg-5 rounded"
//       >
//         <Form.Group className="mb-3">
//           <Form.Label className="m-0">Transaction ID</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter the transaction id for this transaction"
//             id="transaction_id"
//             name="transaction_id"
//             value={shippingValues?.transaction_id}
//             onChange={handleChange}
//             className="escrow-input-field"
//           />

//           {formErrors.transaction_id && (
//             <div className="text-danger p-1" style={{ fontSize: "10px" }}>
//               {formErrors.transaction_id}
//             </div>
//           )}
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label className="m-0">Shipping Company Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter the name of the shipping company"
//             id="shipping_company"
//             name="shipping_company"
//             value={shippingValues?.shipping_company}
//             onChange={handleChange}
//             className="escrow-input-field"
//           />

//           {formErrors.shipping_company && (
//             <div className="text-danger p-1" style={{ fontSize: "10px" }}>
//               {formErrors.shipping_company}
//             </div>
//           )}
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label className="m-0">Name of Delivery Person</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter the name of the delivery person"
//             id="delivery_person_name"
//             name="delivery_person_name"
//             value={shippingValues.delivery_person_name}
//             onChange={handleChange}
//             className="escrow-input-field"
//           />

//           {formErrors.delivery_person_name && (
//             <div className="text-danger p-1" style={{ fontSize: "10px" }}>
//               {formErrors.delivery_person_name}
//             </div>
//           )}
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label className="m-0">
//             Phone Number of Delivery Person
//           </Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter the phone number of delivery person number"
//             id="delivery_person_number"
//             name="delivery_person_number"
//             value={shippingValues.delivery_person_number}
//             onChange={handleChange}
//             className="escrow-input-field"
//           />

//           {formErrors.delivery_person_number && (
//             <div className="text-danger p-1" style={{ fontSize: "10px" }}>
//               {formErrors.delivery_person_number}
//             </div>
//           )}
//         </Form.Group>
//         {/* <Form.Group className="mb-3">
//           <label className="">What type of transaction are you making?</label>
//           <div className="d-flex">
//             <div className="d-flex justify-content-between border border-1 rounded-1 px-2 pt-2 pb-1 me-3 EscrowChoice">
//               <label className="form-check-label me-2 me-lg-3" for="buying">
//                 Buying
//               </label>
//               <input
//                 type="radio"
//                 className="form-check"
//                 checked={buySellChoice === "buy"}
//                 onChange={(e) => {
//                   setBuySellChoice("buy");
//                   handleChange(e);
//                 }}
//                 id="transaction_type"
//                 name="transaction_type"
//                 // value="buy"
//                 value={"buy"}
//               />
//             </div>
//             <div className="d-flex justify-content-between border border-1 rounded-1 px-2 pt-2 pb-1 EscrowChoice">
//               <label className="form-check-label me-2 me-lg-3" for="selling">
//                 Sell
//               </label>
//               <input
//                 type="radio"
//                 className="form-check"
//                 checked={buySellChoice === "sell"}
//                 onChange={(e) => {
//                   setBuySellChoice("sell");
//                   handleChange(e);
//                 }}
//                 id="transaction_type"
//                 name="transaction_type"
//                 value={"sell"}
//               />
//             </div>
//           </div>
//           {formErrors.transaction_type && (
//             <div className="text-danger p-1" style={{ fontSize: "10px" }}>
//               {formErrors.transaction_type}
//             </div>
//           )}
//         </Form.Group> */}

//         <Form.Group className="mb-3">
//           <Form.Label className="m-0">Email of Delivery Person</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter the email of delivery person"
//             id="delivery_person_email"
//             name="delivery_person_email"
//             value={shippingValues.delivery_person_email}
//             onChange={handleChange}
//             className="escrow-input-field"
//           />

//           {formErrors.delivery_person_email && (
//             <div className="text-danger p-1" style={{ fontSize: "10px" }}>
//               {formErrors.delivery_person_email}
//             </div>
//           )}
//         </Form.Group>
//         <Form.Group className="mb-3">
//           <Form.Label className="m-0">Delivery Date</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter the expected delivery date"
//             id="delivery_date"
//             name="delivery_date"
//             value={shippingValues.delivery_date}
//             onChange={handleChange}
//             className="escrow-input-field"
//           />

//           {formErrors.delivery_date && (
//             <div className="text-danger p-1" style={{ fontSize: "10px" }}>
//               {formErrors.delivery_date}
//             </div>
//           )}
//         </Form.Group>

//         <Form.Group className="mb-3">
//           <Form.Label className="m-0">Agreed Pickup Address</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter the agreed pickup address"
//             id="pick_up_address"
//             name="pick_up_address"
//             value={shippingValues.pick_up_address}
//             onChange={handleChange}
//             className="escrow-input-field"
//           />

//           {formErrors.pick_up_address && (
//             <div className="text-danger p-1" style={{ fontSize: "10px" }}>
//               {formErrors.pick_up_address}
//             </div>
//           )}
//         </Form.Group>

//         <div className="d-flex justify-content-center">
//           <Button
//             className="border-0 mt-3 btn btn-danger text-white pale-red"
//             style={{ width: "140px" }}
//             onClick={handleCancel}
//           >
//             CANCEL
//           </Button>

//           <Button
//             className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
//             style={{ width: "120px" }}
//             type="submit"
//           >
//             PROCEED
//           </Button>
//         </div>
//       </Form>
//     </div>
//   );
// };

// export default ShippingDetailsForm;
