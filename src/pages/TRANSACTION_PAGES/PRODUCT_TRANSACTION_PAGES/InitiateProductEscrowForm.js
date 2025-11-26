// import { useState, useEffect } from "react";
// import { Button, Form, Row, Col, FloatingLabel, Table, Modal, Accordion  } from "react-bootstrap";
// import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
// import { Link, useNavigate } from "react-router-dom";
// import { CancelButton } from "../../../components/ButtonsComponent/OtherButtons";
// import { ProceedButton } from "../../../components/ButtonsComponent/TransactionButtons";

// import { useDispatch, useSelector } from "react-redux";
// import { setEscrowProduct } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
// import { useInitiateEscrowProductTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { useAppContext } from "../../../context/appContext";
// import { toast, ToastContainer } from "react-toastify";
// // import { useAppContext } from "../../context/AppContext";

// const InitiateProductEscrowForm = () => {
//   return (
//     <>
//       <div className="contestPage">
//         <div className="row">
//           <div className="col-lg-3 col-sm-12"></div>

//           <div className="col-lg-9 col-sm-12">
//             <UserDashboardNavbar />
//             <div className="mt-5">
//               <InitiateEscrowForm />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const InitiateEscrowForm = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const loggedInUser = localStorage.getItem("userInfo");
//     // const userInfo = JSON.parse(loggedInUser)?.user?.email;
//   const { userInfo } = useSelector((state) => state.usersauth);
//   console.log(userInfo);
//   console.log(loggedInUser);

//   const [initiateTransaction, { isLoading }] =
//     useInitiateEscrowProductTransactionMutation();

//   // State
//   const [vendor, setVendor] = useState({
//     vendor_name: "",
//     vendor_phone_number: "",
//     vendor_email: "",
//   });

//   const [product, setProduct] = useState({
//     product_name: "",
//     quantity: "",
//     price: "",
//     product_description: "",
//     product_image: "",
//   });

//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [productList, setProductList] = useState([]);
//   const [productImageURL, setProductImageURL] = useState("");
//   const [formErrors, setFormErrors] = useState({});
//   const [showModal, setShowModal] = useState(false);
//   const [showRemoveModal, setShowRemoveModal] = useState(false);
//   const [productToRemove, setProductToRemove] = useState(null);
//   const [sumTotal, setSumTotal] = useState(0);
//   const [transactionTotal, setTransactionTotal] = useState(0);

//   // Vendor input
//   const handleVendorChange = (e) => {
//     const { name, value } = e.target;
//     setVendor((prev) => ({ ...prev, [name]: value }));
//   };

//   // Product input
//   const handleProductChange = (e) => {
//     const { name, type, value, files } = e.target;
//     if (type === "file") {
//       const file = files[0];
//       if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("upload_preset", "ldk7mrmm");
//         formData.append("cloud_name", "dotkplv0d");

//         fetch("https://api.cloudinary.com/v1_1/dotkplv0d/image/upload", {
//           method: "POST",
//           body: formData,
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             setProductImageURL(data.secure_url);
//             setProduct((prev) => ({ ...prev, product_image: data.secure_url }));
//           })
//           .catch(() => toast.error("Image upload failed"));
//       }
//     } else {
//       setProduct((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   // Validation
//   const validateProduct = () => {
//     const errors = {};
//     if (!product.product_name) errors.product_name = "Product name required";
//     if (!product.quantity || product.quantity <= 0)
//       errors.quantity = "Valid quantity required";
//     if (!product.price || product.price <= 0)
//       errors.price = "Valid price required";
//     if (!product.product_description)
//       errors.product_description = "Description required";
//     if (!product.product_image) errors.product_image = "Product image required";
//     return errors;
//   };

//   // Add product
//   const handleAddProduct = () => {
//     const errors = validateProduct();
//     setFormErrors(errors);
//     if (Object.keys(errors).length > 0) return;

//     const newProduct = {
//       name: product.product_name,
//       quantity: Number(product.quantity),
//       price: Number(product.price),
//       description: product.product_description,
//       image: product.product_image,
//       total_price: product.quantity * product.price,
//     };

//     setProductList((prev) => [...prev, newProduct]);
//     setProduct({
//       product_name: "",
//       quantity: "",
//       price: "",
//       product_description: "",
//       product_image: "",
//     });
//     setProductImageURL("");
//   };

//   // Remove product
//   const handleRemoveProduct = (index) => {
//     setProductToRemove(index);
//     setShowRemoveModal(true);
//   };

//   const confirmRemoveProduct = () => {
//     const updatedList = [...productList];
//     updatedList.splice(productToRemove, 1);
//     setProductList(updatedList);
//     setShowRemoveModal(false);
//   };

//   // Totals
//   useEffect(() => {
//     const total = productList.reduce(
//       (sum, item) => sum + Number(item.total_price),
//       0
//     );
//     setSumTotal(total);
//     setTransactionTotal((total * 0.01).toFixed(2));
//   }, [productList]);

//   // Proceed
//   const handleProceed = () => {
//     if (
//       !vendor.vendor_name ||
//       !vendor.vendor_email ||
//       !vendor.vendor_phone_number
//     ) {
//       toast.error("Please fill in all vendor details before proceeding.");
//       return;
//     }
//     if (!deliveryAddress) {
//       toast.error("Please provide a delivery address.");
//       return;
//     }
//     if (productList.length === 0) {
//       toast.error("Please add at least one product before proceeding.");
//       return;
//     }
//     setShowModal(true);
//   };

//   // Confirm Proceed
//   const confirmProceed = async () => {
//     console.log("Vendor Name Before Submit:", vendor.vendor_name);

//     const payload = {
//       vendor_name: vendor.vendor_name,
//       vendor_phone_number: vendor.vendor_phone_number,
//       buyer_email: userInfo,
//       vendor_email: vendor.vendor_email,
//       transaction_type: "escrow",
//       products: productList.map((p) => ({
//         name: p.name,
//         quantity: p.quantity,
//         price: p.price,
//         image: p.image,
//         description: p.description,
//       })),
//       delivery_address: deliveryAddress,
//     };

//     console.log("📦 Payload being sent to backend:", payload);

//     try {
//       const res = await initiateTransaction(payload).unwrap();
//       dispatch(setEscrowProduct(res));
//       setShowModal(false);
//       toast.success("Transaction initiated successfully!");
//       navigate("/userdashboard/transaction-history");
//     } catch (error) {
//       toast.error(error?.data?.message || "Failed to initiate escrow transaction");
//     }
//   };

//   const handleCancel = () => navigate("/userdashboard");

//   return (
//     <div className="px-lg-5">
//       <Form className="w-100 mt-5 p-4 p-lg-5 rounded shadow bg-white">
//         <h3 className="mb-4 fw-bold text-center text-success">
//           Initiate Product Escrow
//         </h3>

//         {/* Vendor Details */}
//         <div className="mb-4">
//           <h5 className="fw-semibold text-success mb-3">Vendor Details</h5>
//           <Row className="g-4">
//             <Col md={4}>
//               <FloatingLabel label="Vendor Name">
//                 <Form.Control
//                   type="text"
//                   name="vendor_name"
//                   value={vendor.vendor_name}
//                   onChange={handleVendorChange}
//                 />
//               </FloatingLabel>
//             </Col>
//             <Col md={4}>
//               <FloatingLabel label="Vendor Phone Number">
//                 <Form.Control
//                   type="text"
//                   name="vendor_phone_number"
//                   value={vendor.vendor_phone_number}
//                   onChange={handleVendorChange}
//                 />
//               </FloatingLabel>
//             </Col>
//             <Col md={4}>
//               <FloatingLabel label="Vendor Email">
//                 <Form.Control
//                   type="email"
//                   name="vendor_email"
//                   value={vendor.vendor_email}
//                   onChange={handleVendorChange}
//                 />
//               </FloatingLabel>
//             </Col>
//           </Row>
//         </div>

//         {/* Delivery Address */}
//         <div className="mb-4">
//           <h5 className="fw-semibold text-success mb-3">Delivery Address</h5>
//           <FloatingLabel label="Enter Delivery Address">
//             <Form.Control
//               as="textarea"
//               name="delivery_address"
//               value={deliveryAddress}
//               onChange={(e) => setDeliveryAddress(e.target.value)}
//               style={{ height: "80px" }}
//             />
//           </FloatingLabel>
//         </div>

//         {/* Product Details */}
//         <div className="mb-4">
//           <h5 className="fw-semibold text-success mb-3">Product Details</h5>
//           <Row className="g-4">
//             <Col md={4}>
//               <FloatingLabel label="Product Name">
//                 <Form.Control
//                   type="text"
//                   name="product_name"
//                   value={product.product_name}
//                   onChange={handleProductChange}
//                 />
//               </FloatingLabel>
//               {formErrors.product_name && (
//                 <small className="text-danger">{formErrors.product_name}</small>
//               )}
//             </Col>

//             <Col md={4}>
//               <FloatingLabel label="Quantity">
//                 <Form.Control
//                   type="number"
//                   name="quantity"
//                   value={product.quantity}
//                   onChange={handleProductChange}
//                 />
//               </FloatingLabel>
//               {formErrors.quantity && (
//                 <small className="text-danger">{formErrors.quantity}</small>
//               )}
//             </Col>

//             <Col md={4}>
//               <FloatingLabel label="Price (₦)">
//                 <Form.Control
//                   type="number"
//                   name="price"
//                   value={product.price}
//                   onChange={handleProductChange}
//                 />
//               </FloatingLabel>
//               {formErrors.price && (
//                 <small className="text-danger">{formErrors.price}</small>
//               )}
//             </Col>

//             <Col md={12}>
//               <FloatingLabel label="Product Description">
//                 <Form.Control
//                   as="textarea"
//                   name="product_description"
//                   value={product.product_description}
//                   onChange={handleProductChange}
//                   style={{ height: "80px" }}
//                 />
//               </FloatingLabel>
//               {formErrors.product_description && (
//                 <small className="text-danger">
//                   {formErrors.product_description}
//                 </small>
//               )}
//             </Col>

//             <Col md={12}>
//               <Form.Label>Product Image</Form.Label>
//               <Form.Control
//                 type="file"
//                 name="product_image"
//                 onChange={handleProductChange}
//               />
//               {formErrors.product_image && (
//                 <small className="text-danger">{formErrors.product_image}</small>
//               )}
//               {productImageURL && (
//                 <div className="text-center mt-2">
//                   <img
//                     src={productImageURL}
//                     alt="preview"
//                     className="img-fluid rounded shadow-sm"
//                     style={{ maxWidth: "200px" }}
//                   />
//                 </div>
//               )}
//             </Col>

//             <Col md={12} className="text-center mt-3">
//               <Button variant="success" onClick={handleAddProduct}>
//                 Add Product
//               </Button>
//             </Col>
//           </Row>
//         </div>

//         {/* Product Table */}
//         {productList.length > 0 && (
//           <div className="table-responsive mt-4">
//             <Table bordered hover>
//               <thead className="table-light">
//                 <tr>
//                   <th>#</th>
//                   <th>Product Name</th>
//                   <th>Quantity</th>
//                   <th>Price (₦)</th>
//                   <th>Total (₦)</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {productList.map((p, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{p.name}</td>
//                     <td>{p.quantity}</td>
//                     <td>{p.price}</td>
//                     <td>{p.total_price}</td>
//                     <td>
//                       <Button
//                         variant="outline-danger"
//                         size="sm"
//                         onClick={() => handleRemoveProduct(index)}
//                       >
//                         Remove
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         )}

//         {/* Totals */}
//         <div className="mt-4">
//           <div className="d-flex justify-content-between fw-semibold">
//             <span>Sum Total (Product Price):</span>
//             <span>₦ {sumTotal.toFixed(2)}</span>
//           </div>
//           <div className="d-flex justify-content-between fw-semibold mt-2">
//             <span>Transaction Total (1% Commission):</span>
//             <span>₦ {transactionTotal}</span>
//           </div>
//           <div className="d-flex justify-content-between fw-bold fs-5 mt-3 border-top pt-2">
//             <span> Total</span>
//             <span>₦ {(sumTotal + Number(transactionTotal)).toFixed(2)}</span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="d-flex justify-content-center gap-3 mt-4">
//           <Button
//             variant="outline-danger"
//             onClick={handleCancel}
//             style={{ width: "140px" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             className="btn-success text-white"
//             style={{ width: "140px" }}
//             onClick={handleProceed}
//             disabled={productList.length === 0 || isLoading}
//           >
//             {isLoading ? "Processing..." : "Proceed"}
//           </Button>
//         </div>
//       </Form>

//       {/* Confirmation Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Transaction Summary</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h6 className="fw-bold">Vendor Details</h6>
//           <p>Name: {vendor.vendor_name}</p>
//           <p>Email: {vendor.vendor_email}</p>
//           <p>Phone: {vendor.vendor_phone_number}</p>

//           <hr />
//           <h6 className="fw-bold mb-3">Products</h6>

//           <Accordion>
//             {productList.map((p, i) => (
//               <Accordion.Item eventKey={i.toString()} key={i}>
//                 <Accordion.Header>
//                   <strong className="text-success">{p.name}</strong>
//                 </Accordion.Header>
//                 <Accordion.Body>
//                   <div className="mb-2">
//                     <strong>Product Name:</strong> {p.name}
//                   </div>
//                   <div className="mb-2">
//                     <strong>Quantity:</strong> {p.quantity}
//                   </div>
//                   <div className="mb-2">
//                     <strong>Price (₦):</strong> {p.price.toLocaleString()}
//                   </div>
//                   <div className="mb-2">
//                     <strong> Delivery Address:</strong> {deliveryAddress}
//                   </div>
//                   <div className="mb-2">
//                     <strong>Description:</strong> {p.description}
//                   </div>
//                   {p.image && (
//                     <div className="mt-3 text-center">
//                       <img
//                         src={p.image}
//                         alt={p.name}
//                         className="img-fluid rounded shadow-sm"
//                         style={{ maxWidth: "200px" }}
//                       />
//                     </div>
//                   )}
//                 </Accordion.Body>
//               </Accordion.Item>
//             ))}
//           </Accordion>

//           <hr />

//           {/* Totals */}
//         <div className="mt-4">
//           <div className="d-flex justify-content-between fw-semibold">
//             <span className="bg-success text-white p-1 rounded-1">Sum Total (Product Price):</span>
//             <span>₦ {sumTotal.toFixed(2)}</span>
//           </div>
//           <div className="d-flex justify-content-between fw-semibold mt-2">
//             <span className="bg-success text-white p-1 rounded-1">Transaction Total (1% Commission):</span>
//             <span>₦ {transactionTotal}</span>
//           </div>
//           <div className="d-flex justify-content-between fw-bold fs-5 mt-3 border-top pt-2">
//             <span className="bg-success text-white p-1 rounded-1"> Total</span>
//             <span>₦ {(sumTotal + Number(transactionTotal)).toFixed(2)}</span>
//           </div>
//         </div>

//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="success" onClick={confirmProceed}>
//             Confirm & Proceed
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Remove Product Modal */}
//       <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)} centered size="sm">
//         <Modal.Body className="text-center p-4">
//           <p className="fw-semibold mb-3">
//             Are you sure you want to remove this product?
//           </p>
//           <div className="d-flex justify-content-center gap-2">
//             <Button variant="danger" size="sm" onClick={confirmRemoveProduct}>
//               Yes
//             </Button>
//             <Button variant="success" size="sm" onClick={() => setShowRemoveModal(false)}>
//               No
//             </Button>
//           </div>
//         </Modal.Body>
//       </Modal>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// };

// export default InitiateProductEscrowForm;

import { useState, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  FloatingLabel,
  Table,
  Modal,
  Accordion,
} from "react-bootstrap";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { CancelButton } from "../../../components/ButtonsComponent/OtherButtons";
import { ProceedButton } from "../../../components/ButtonsComponent/TransactionButtons";

import { useDispatch, useSelector } from "react-redux";
import { setEscrowProduct } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { useInitiateEscrowProductTransactionMutation } from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useAppContext } from "../../../context/appContext";
import {
  Alert,
  AlertDescription,
} from "../../../components/NotificationComponent/Alert";

const InitiateProductEscrowForm = () => {
  return (
    <>
      <div
        className="container-fluid px-0"
        style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
        <div className="row g-0">
          <div className="col-12">
            <UserDashboardNavbar />
            <div className="px-3 px-lg-4 py-2">
              <InitiateEscrowForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InitiateEscrowForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.usersauth);
  const userToken = userInfo?.token;

  console.log("Current userInfo:", userInfo);

  // Try different possible email paths
  const userEmail =
    userInfo?.user?.email ||
    userInfo?.email ||
    userInfo?.organization_email ||
    userInfo?.userInfo?.email;

  console.log("userInfo:", userInfo);
  console.log("User Email:", userEmail);
  console.log("User Token:", userToken);

  const [initiateTransaction, { isLoading }] =
    useInitiateEscrowProductTransactionMutation();

  // Alert State
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  // State
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_phone_number: "",
    vendor_email: "",
  });

  const [product, setProduct] = useState({
    product_name: "",
    quantity: "",
    price: "",
    product_description: "",
    product_image: "",
  });

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [productList, setProductList] = useState([]);
  const [productImageURL, setProductImageURL] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [sumTotal, setSumTotal] = useState(0);
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Alert function
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  // Vendor input
  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  // Product input
  const handleProductChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "ldk7mrmm");
        formData.append("cloud_name", "dotkplv0d");

        setIsProcessing(true);
        fetch("https://api.cloudinary.com/v1_1/dotkplv0d/image/upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            setProductImageURL(data.secure_url);
            setProduct((prev) => ({ ...prev, product_image: data.secure_url }));
            showAlertMessage("Product image uploaded successfully!", "success");
          })
          .catch(() => {
            showAlertMessage(
              "Image upload failed. Please try again.",
              "destructive"
            );
          })
          .finally(() => {
            setIsProcessing(false);
          });
      } else {
        showAlertMessage(
          "Please upload only PNG or JPEG images.",
          "destructive"
        );
      }
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validation
  const validateProduct = () => {
    const errors = {};
    if (!product.product_name) errors.product_name = "Product name required";
    if (!product.quantity || product.quantity <= 0)
      errors.quantity = "Valid quantity required";
    if (!product.price || product.price <= 0)
      errors.price = "Valid price required";
    if (!product.product_description)
      errors.product_description = "Description required";
    if (!product.product_image) errors.product_image = "Product image required";
    return errors;
  };

  // Add product
  const handleAddProduct = () => {
    const errors = validateProduct();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showAlertMessage(
        "Please fill all product details correctly.",
        "destructive"
      );
      return;
    }

    const newProduct = {
      name: product.product_name,
      quantity: Number(product.quantity),
      price: Number(product.price),
      description: product.product_description,
      image: product.product_image,
      total_price: product.quantity * product.price,
    };

    setProductList((prev) => [...prev, newProduct]);
    setProduct({
      product_name: "",
      quantity: "",
      price: "",
      product_description: "",
      product_image: "",
    });
    setProductImageURL("");
    showAlertMessage("Product added successfully!", "success");
  };

  // Remove product
  const handleRemoveProduct = (index) => {
    setProductToRemove(index);
    setShowRemoveModal(true);
  };

  const confirmRemoveProduct = () => {
    const updatedList = [...productList];
    updatedList.splice(productToRemove, 1);
    setProductList(updatedList);
    setShowRemoveModal(false);
    showAlertMessage("Product removed successfully!", "success");
  };

  // Totals
  useEffect(() => {
    const total = productList.reduce(
      (sum, item) => sum + Number(item.total_price),
      0
    );
    setSumTotal(total);
    setTransactionTotal((total * 0.01).toFixed(2));
  }, [productList]);

  // Proceed
  const handleProceed = () => {
    if (
      !vendor.vendor_name ||
      !vendor.vendor_email ||
      !vendor.vendor_phone_number
    ) {
      showAlertMessage(
        "Please fill in all vendor details before proceeding.",
        "destructive"
      );
      return;
    }
    if (!deliveryAddress) {
      showAlertMessage("Please provide a delivery address.", "destructive");
      return;
    }
    if (productList.length === 0) {
      showAlertMessage(
        "Please add at least one product before proceeding.",
        "destructive"
      );
      return;
    }
    setShowModal(true);
  };

  // Confirm Proceed
  const confirmProceed = async () => {
    const payload = {
      vendor_name: vendor.vendor_name,
      vendor_phone_number: vendor.vendor_phone_number,
      buyer_email: userEmail,
      vendor_email: vendor.vendor_email,
      transaction_type: "escrow",
      products: productList.map((p) => ({
        name: p.name,
        quantity: p.quantity,
        price: p.price,
        image: p.image,
        description: p.description,
      })),
      delivery_address: deliveryAddress,
    };

    console.log("📦 Payload being sent to backend:", payload);

    try {
      setShowModal(false);
      setIsProcessing(true);

      const res = await initiateTransaction(payload).unwrap();
      dispatch(setEscrowProduct(res));

      showAlertMessage("Transaction initiated successfully!", "success");

      // Show success message for 2 seconds before navigating
      setTimeout(() => {
        navigate("/userdashboard/transaction-history");
      }, 2000);
    } catch (error) {
      console.error("Transaction Error:", error);
      showAlertMessage(
        error?.data?.message || "Failed to initiate escrow transaction",
        "destructive"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => navigate("/userdashboard");

  return (
    <div className="px-lg-5">
      <Form className="w-100 mt-5 p-4 p-lg-5 rounded shadow bg-white">
        <h3 className="mb-4 fw-bold text-center text-success">
          Initiate Product Escrow
        </h3>

        {/* Alert Component */}
        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        )}

        {/* Vendor Details */}
        <div className="mb-4">
          <h5 className="fw-semibold text-success mb-3">Vendor Details</h5>
          <Row className="g-4">
            <Col md={4}>
              <FloatingLabel label="Vendor Name">
                <Form.Control
                  type="text"
                  name="vendor_name"
                  value={vendor.vendor_name}
                  onChange={handleVendorChange}
                  placeholder="Vendor Name"
                />
              </FloatingLabel>
            </Col>
            <Col md={4}>
              <FloatingLabel label="Vendor Phone Number">
                <Form.Control
                  type="text"
                  name="vendor_phone_number"
                  value={vendor.vendor_phone_number}
                  onChange={handleVendorChange}
                  placeholder="Vendor Phone Number"
                />
              </FloatingLabel>
            </Col>
            <Col md={4}>
              <FloatingLabel label="Vendor Email">
                <Form.Control
                  type="email"
                  name="vendor_email"
                  value={vendor.vendor_email}
                  onChange={handleVendorChange}
                  placeholder="Vendor Email"
                />
              </FloatingLabel>
            </Col>
          </Row>
        </div>

        {/* Delivery Address */}
        <div className="mb-4">
          <h5 className="fw-semibold text-success mb-3">Delivery Address</h5>
          <FloatingLabel label="Enter Delivery Address">
            <Form.Control
              as="textarea"
              name="delivery_address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              style={{ height: "80px" }}
              placeholder="Enter delivery address"
            />
          </FloatingLabel>
        </div>

        {/* Product Details */}
        <div className="mb-4">
          <h5 className="fw-semibold text-success mb-3">Product Details</h5>
          <Row className="g-4">
            <Col md={4}>
              <FloatingLabel label="Product Name">
                <Form.Control
                  type="text"
                  name="product_name"
                  value={product.product_name}
                  onChange={handleProductChange}
                  placeholder="Product Name"
                />
              </FloatingLabel>
              {formErrors.product_name && (
                <small className="text-danger">{formErrors.product_name}</small>
              )}
            </Col>

            <Col md={4}>
              <FloatingLabel label="Quantity">
                <Form.Control
                  type="number"
                  name="quantity"
                  value={product.quantity}
                  onChange={handleProductChange}
                  placeholder="Quantity"
                />
              </FloatingLabel>
              {formErrors.quantity && (
                <small className="text-danger">{formErrors.quantity}</small>
              )}
            </Col>

            <Col md={4}>
              <FloatingLabel label="Price (₦)">
                <Form.Control
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleProductChange}
                  placeholder="Price"
                />
              </FloatingLabel>
              {formErrors.price && (
                <small className="text-danger">{formErrors.price}</small>
              )}
            </Col>

            <Col md={12}>
              <FloatingLabel label="Product Description">
                <Form.Control
                  as="textarea"
                  name="product_description"
                  value={product.product_description}
                  onChange={handleProductChange}
                  style={{ height: "80px" }}
                  placeholder="Product Description"
                />
              </FloatingLabel>
              {formErrors.product_description && (
                <small className="text-danger">
                  {formErrors.product_description}
                </small>
              )}
            </Col>

            <Col md={12}>
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                name="product_image"
                onChange={handleProductChange}
                disabled={isProcessing}
              />
              {isProcessing && (
                <small className="text-info">Uploading image...</small>
              )}
              {formErrors.product_image && (
                <small className="text-danger">
                  {formErrors.product_image}
                </small>
              )}
              {productImageURL && (
                <div className="text-center mt-2">
                  <img
                    src={productImageURL}
                    alt="preview"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxWidth: "200px" }}
                  />
                </div>
              )}
            </Col>

            <Col md={12} className="text-center mt-3">
              <Button
                variant="success"
                onClick={handleAddProduct}
                disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Add Product"}
              </Button>
            </Col>
          </Row>
        </div>

        {/* Product Table */}
        {productList.length > 0 && (
          <div className="table-responsive mt-4">
            <Table bordered hover>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price (₦)</th>
                  <th>Total (₦)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((p, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.quantity}</td>
                    <td>{p.price}</td>
                    <td>{p.total_price}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveProduct(index)}
                        disabled={isProcessing}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Totals */}
        <div className="mt-4">
          <div className="d-flex justify-content-between fw-semibold">
            <span>Sum Total (Product Price):</span>
            <span>₦ {sumTotal.toFixed(2)}</span>
          </div>
          <div className="d-flex justify-content-between fw-semibold mt-2">
            <span>Transaction Total (1% Commission):</span>
            <span>₦ {transactionTotal}</span>
          </div>
          <div className="d-flex justify-content-between fw-bold fs-5 mt-3 border-top pt-2">
            <span> Total</span>
            <span>₦ {(sumTotal + Number(transactionTotal)).toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            variant="outline-danger"
            onClick={handleCancel}
            style={{ width: "140px" }}
            disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            className="btn-success text-white"
            style={{ width: "140px" }}
            onClick={handleProceed}
            disabled={productList.length === 0 || isLoading || isProcessing}>
            {isProcessing
              ? "Processing..."
              : isLoading
              ? "Processing..."
              : "Proceed"}
          </Button>
        </div>
      </Form>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Summary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="fw-bold">Vendor Details</h6>
          <p>Name: {vendor.vendor_name}</p>
          <p>Email: {vendor.vendor_email}</p>
          <p>Phone: {vendor.vendor_phone_number}</p>

          <hr />
          <h6 className="fw-bold mb-3">Products</h6>

          <Accordion>
            {productList.map((p, i) => (
              <Accordion.Item eventKey={i.toString()} key={i}>
                <Accordion.Header>
                  <strong className="text-success">{p.name}</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="mb-2">
                    <strong>Product Name:</strong> {p.name}
                  </div>
                  <div className="mb-2">
                    <strong>Quantity:</strong> {p.quantity}
                  </div>
                  <div className="mb-2">
                    <strong>Price (₦):</strong> {p.price.toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <strong> Delivery Address:</strong> {deliveryAddress}
                  </div>
                  <div className="mb-2">
                    <strong>Description:</strong> {p.description}
                  </div>
                  {p.image && (
                    <div className="mt-3 text-center">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="img-fluid rounded shadow-sm"
                        style={{ maxWidth: "200px" }}
                      />
                    </div>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <hr />

          {/* Totals */}
          <div className="mt-4">
            <div className="d-flex justify-content-between fw-semibold">
              <span className="bg-success text-white p-1 rounded-1">
                Sum Total (Product Price):
              </span>
              <span>₦ {sumTotal.toFixed(2)}</span>
            </div>
            <div className="d-flex justify-content-between fw-semibold mt-2">
              <span className="bg-success text-white p-1 rounded-1">
                Transaction Total (1% Commission):
              </span>
              <span>₦ {transactionTotal}</span>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5 mt-3 border-top pt-2">
              <span className="bg-success text-white p-1 rounded-1">
                {" "}
                Total
              </span>
              <span>₦ {(sumTotal + Number(transactionTotal)).toFixed(2)}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={confirmProceed}
            disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Confirm & Proceed"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Remove Product Modal */}
      <Modal
        show={showRemoveModal}
        onHide={() => setShowRemoveModal(false)}
        centered
        size="sm">
        <Modal.Body className="text-center p-4">
          <p className="fw-semibold mb-3">
            Are you sure you want to remove this product?
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="danger" size="sm" onClick={confirmRemoveProduct}>
              Yes
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowRemoveModal(false)}>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InitiateProductEscrowForm;
