// start here

import { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { setShippingInfo } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { setShippingInfo } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { useAppContext } from "../../../context/appContext";
import { toast } from "react-toastify";
import { useInitiateDisputeMutation } from "../../../redux/slices/disputeSlices/disputeAPISlice";

const InitiateProductDisputesForm = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5">
              <InitiateDisputesFormLogic />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InitiateDisputesFormLogic = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transaction = location.state?.transaction;

  const [formData, setFormData] = useState({
    reason_for_dispute: "",
    dispute_description: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [initiateDispute] = useInitiateDisputeMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceed = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    const payload = {
      transaction_id: transaction.transaction_id,
      product_name: transaction.product_name,
      product_image: transaction.product_image,
      reason_for_dispute: formData.reason_for_dispute,
      dispute_description: formData.dispute_description,
      buyer_email: transaction.buyer_email,
      vendor_name: transaction.vendor_name,
      vendor_email: transaction.vendor_email,
      vendor_phone_number: transaction.vendor_phone_number,
      user_email: transaction.buyer_email,
      dispute_raised_by: transaction.buyer_email,
    };

    try {
      await initiateDispute(payload).unwrap();
      toast.success("Dispute submitted successfully!");
      setShowModal(false);
      navigate("/userdashboard/disputes", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Error submitting dispute. Please try again.");
    }
  };

  if (!transaction) {
    return (
      <div className="container text-center mt-5">
        <h4>No transaction selected for dispute.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h3 className="mb-4">Raise a Dispute</h3>
      <form onSubmit={handleProceed}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Transaction ID</label>
          <input
            type="text"
            className="form-control"
            value={transaction.transaction_id}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Product Name</label>
          <input
            type="text"
            className="form-control"
            value={transaction.product_name}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Product Image</label>
          <div>
            <img
              src={transaction.product_image}
              alt="Product"
              className="img-fluid rounded"
              style={{ maxHeight: "200px" }}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Reason for Dispute</label>
          <textarea
            className="form-control"
            name="reason_for_dispute"
            rows="2"
            placeholder="Enter the main reason for this dispute"
            value={formData.reason_for_dispute}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Dispute Description</label>
          <textarea
            className="form-control"
            name="dispute_description"
            rows="4"
            placeholder="Provide more details about the dispute"
            value={formData.dispute_description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-success mt-3 w-100">
          Proceed
        </button>
      </form>

      {/* Summary Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Dispute Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Transaction ID:</strong> {transaction.transaction_id}</p>
          <p><strong>Product Name:</strong> {transaction.product_name}</p>
          <p><strong>Reason:</strong> {formData.reason_for_dispute}</p>
          <p><strong>Description:</strong> {formData.dispute_description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleConfirmSubmit}>
            Submit Dispute
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InitiateProductDisputesForm;

// const InitiateDisputesFormLogic = () => {
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
//         <h3>Initiate Disputes Form</h3>
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

// export default InitiateProductDisputesForm;
