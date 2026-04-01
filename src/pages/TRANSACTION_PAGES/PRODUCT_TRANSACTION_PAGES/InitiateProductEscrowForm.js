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
  Spinner,
  Badge,
} from "react-bootstrap";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setEscrowProduct } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import {
  useInitiateEscrowProductTransactionMutation,
  useEditEscrowProductTransactionMutation,
  useFetchSingleTransactionsQuery,
} from "../../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import {
  Alert,
  AlertDescription,
} from "../../../components/NotificationComponent/Alert";

// ============================================
// DELIVERY OPTIONS CONFIG
// ============================================
const DELIVERY_OPTIONS = [
  {
    value: "pickup",
    label: "Pickup",
    description: "Buyer picks up from seller's location",
    icon: "bi-person-walking",
  },
  {
    value: "pay_on_delivery",
    label: "Pay on Delivery",
    description: "Delivery fee paid on receipt",
    icon: "bi-cash-coin",
  },
  {
    value: "agreed_delivery_fee",
    label: "Agreed Delivery Fee",
    description: "Fixed delivery fee agreed upon by both parties",
    icon: "bi-truck",
  },
];

const DELIVERY_TIME_RANGES = [
  { value: "1-3 days", label: "1–3 Business Days" },
  { value: "3-5 days", label: "3–5 Business Days" },
  { value: "5-7 days", label: "5–7 Business Days" },
  { value: "1-2 weeks", label: "1–2 Weeks" },
  { value: "2-4 weeks", label: "2–4 Weeks" },
  { value: "custom_date", label: "Pick a Specific Date" },
];

// ============================================
// EMPTY PRODUCT TEMPLATE
// ============================================
const emptyProduct = {
  product_name: "",
  quantity: "",
  price: "",
  product_description: "",
  product_image: "",
};

const InitiateProductEscrowForm = () => {
  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}
    >
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <InitiateEscrowForm />
          </div>
        </div>
      </div>
    </div>
  );
};

const InitiateEscrowForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transaction_id");

  const { userInfo } = useSelector((state) => state.usersauth);
  const userEmail =
    userInfo?.user?.email ||
    userInfo?.email ||
    userInfo?.organization_email ||
    userInfo?.userInfo?.email;

  // API Hooks
  const [initiateTransaction, { isLoading }] =
    useInitiateEscrowProductTransactionMutation();
  const [editTransaction, { isLoading: isEditLoading }] =
    useEditEscrowProductTransactionMutation();
  const {
    data: transactionData,
    isLoading: isFetchingTransaction,
    isError: fetchError,
    error: fetchErrorData,
  } = useFetchSingleTransactionsQuery(transactionId, { skip: !transactionId });

  // ── UI State ──────────────────────────────────────────────
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [productImageURL, setProductImageURL] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [sumTotal, setSumTotal] = useState(0);
  const [transactionTotal, setTransactionTotal] = useState(0);

  // ── Edit-product-on-table state ───────────────────────────
  const [editingProductIndex, setEditingProductIndex] = useState(null); // which row is being edited
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProductData, setEditingProductData] = useState({
    ...emptyProduct,
  });
  const [editProductImageURL, setEditProductImageURL] = useState("");
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);

  // ── Form State ────────────────────────────────────────────
  const [vendor, setVendor] = useState({
    vendor_name: "",
    vendor_phone_number: "",
    vendor_email: "",
  });

  const [product, setProduct] = useState({ ...emptyProduct });
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [productList, setProductList] = useState([]);

  // ── Delivery option state ─────────────────────────────────
  const [deliveryOption, setDeliveryOption] = useState("");
  const [agreedDeliveryFee, setAgreedDeliveryFee] = useState("");

  // ── Expected delivery state ───────────────────────────────
  const [deliveryTimeType, setDeliveryTimeType] = useState(""); // "range" | "custom_date"
  const [deliveryTimeRange, setDeliveryTimeRange] = useState("");
  const [deliveryCustomDate, setDeliveryCustomDate] = useState("");

  // ── Helpers ───────────────────────────────────────────────
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const getTodayString = () => new Date().toISOString().split("T")[0];

  const getDeliveryDisplay = () => {
    if (!deliveryOption) return "—";
    const opt = DELIVERY_OPTIONS.find((o) => o.value === deliveryOption);
    let base = opt?.label || deliveryOption;
    if (deliveryOption === "agreed_delivery_fee" && agreedDeliveryFee) {
      base += ` (₦${Number(agreedDeliveryFee).toLocaleString()})`;
    }
    return base;
  };

  const getExpectedDeliveryDisplay = () => {
    if (deliveryTimeType === "custom_date" && deliveryCustomDate) {
      return new Date(deliveryCustomDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    if (deliveryTimeRange) {
      const found = DELIVERY_TIME_RANGES.find(
        (r) => r.value === deliveryTimeRange,
      );
      return found?.label || deliveryTimeRange;
    }
    return "—";
  };

  // ── Load transaction data for edit mode ───────────────────
  useEffect(() => {
    if (transactionData && transactionId) {
      const transaction = transactionData.data || transactionData;

      if (transaction.seller_confirmed) {
        showAlertMessage(
          "This transaction cannot be edited as the seller has already confirmed it.",
          "destructive",
        );
        setTimeout(() => navigate("/userdashboard/transaction-history"), 2000);
        return;
      }
      if (transaction.verified_payment_status) {
        showAlertMessage(
          "This transaction cannot be edited as payment has already been made.",
          "destructive",
        );
        setTimeout(() => navigate("/userdashboard/transaction-history"), 2000);
        return;
      }
      if (transaction.buyer_email !== userEmail) {
        showAlertMessage(
          "You are not authorized to edit this transaction.",
          "destructive",
        );
        setTimeout(() => navigate("/userdashboard/transaction-history"), 2000);
        return;
      }

      setIsEditMode(true);

      setVendor({
        vendor_name: transaction.vendor_name,
        vendor_phone_number: transaction.vendor_phone_number,
        vendor_email: transaction.vendor_email,
      });

      setDeliveryAddress(transaction.delivery_address || "");

      if (transaction.delivery_option) {
        setDeliveryOption(transaction.delivery_option);

        if (
          transaction.delivery_option === "agreed_delivery_fee" &&
          transaction.agreed_delivery_fee != null
        ) {
          setAgreedDeliveryFee(String(transaction.agreed_delivery_fee));
        }
      }

      if (transaction.expected_delivery_date != null) {
        setDeliveryTimeType("custom_date");
        setDeliveryCustomDate(transaction.expected_delivery_date.split("T")[0]);
        setDeliveryTimeRange(""); // clear range
      } else if (
        transaction.expected_delivery_range != null &&
        transaction.expected_delivery_range !== ""
      ) {
        setDeliveryTimeType("range");
        setDeliveryTimeRange(transaction.expected_delivery_range);
        setDeliveryCustomDate(""); // clear custom date
      }

      const formattedProducts = transaction.products.map((p) => ({
        name: p.name,
        quantity: Number(p.quantity),
        price: Number(p.price),
        description: p.description || "",
        image: p.image || "",
        total_price: Number(p.quantity) * Number(p.price),
      }));

      setProductList(formattedProducts);
      showAlertMessage("Transaction data loaded successfully!", "success");
    }
  }, [transactionData, transactionId, userEmail, navigate]);

  useEffect(() => {
    if (fetchError) {
      showAlertMessage(
        "Failed to load transaction data. Please try again.",
        "destructive",
      );
      setTimeout(() => navigate("/userdashboard/transaction-history"), 2000);
    }
  }, [fetchError]);

  // ── Totals ────────────────────────────────────────────────
  useEffect(() => {
    const productsTotal = productList.reduce(
      (sum, item) => sum + Number(item.total_price),
      0,
    );
    const deliveryFeeAmount =
      deliveryOption === "agreed_delivery_fee" && agreedDeliveryFee
        ? Number(agreedDeliveryFee)
        : 0;
    const base = productsTotal + deliveryFeeAmount;
    const commission = base * 0.01;
    setSumTotal(productsTotal);
    setTransactionTotal((base + commission).toFixed(2));
  }, [productList, deliveryOption, agreedDeliveryFee]);

  // ── Vendor handlers ───────────────────────────────────────
  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendor((prev) => ({ ...prev, [name]: value }));
  };

  // ── Product handlers ──────────────────────────────────────
  const uploadImage = async (file, onSuccess, onError, setUploading) => {
    if (!file || !["image/png", "image/jpeg"].includes(file.type)) {
      showAlertMessage("Please upload only PNG or JPEG images.", "destructive");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ldk7mrmm");
    formData.append("cloud_name", "dotkplv0d");
    setUploading(true);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dotkplv0d/image/upload",
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await res.json();
      onSuccess(data.secure_url);
      showAlertMessage("Image uploaded successfully!", "success");
    } catch {
      onError();
      showAlertMessage("Image upload failed. Please try again.", "destructive");
    } finally {
      setUploading(false);
    }
  };

  const handleProductChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      uploadImage(
        files[0],
        (url) => {
          setProductImageURL(url);
          setProduct((prev) => ({ ...prev, product_image: url }));
        },
        () => {},
        setIsProcessing,
      );
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateProduct = (p) => {
    const errors = {};
    if (!p.product_name) errors.product_name = "Product name required";
    if (!p.quantity || p.quantity <= 0)
      errors.quantity = "Valid quantity required";
    if (!p.price || p.price <= 0) errors.price = "Valid price required";
    if (!p.product_description)
      errors.product_description = "Description required";
    if (!p.product_image) errors.product_image = "Product image required";
    return errors;
  };

  const handleAddProduct = () => {
    const errors = validateProduct(product);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showAlertMessage(
        "Please fill all product details correctly.",
        "destructive",
      );
      return;
    }
    const newProduct = {
      name: product.product_name,
      quantity: Number(product.quantity),
      price: Number(product.price),
      description: product.product_description,
      image: product.product_image,
      total_price: Number(product.quantity) * Number(product.price),
    };
    setProductList((prev) => [...prev, newProduct]);
    setProduct({ ...emptyProduct });
    setProductImageURL("");
    showAlertMessage("Product added successfully!", "success");
  };

  // ── Edit product on table ─────────────────────────────────
  const handleOpenEditProduct = (index) => {
    const p = productList[index];
    setEditingProductIndex(index);
    setEditingProductData({
      product_name: p.name,
      quantity: String(p.quantity),
      price: String(p.price),
      product_description: p.description,
      product_image: p.image,
    });
    setEditProductImageURL(p.image || "");
    setShowEditProductModal(true);
  };

  const handleEditProductChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      uploadImage(
        files[0],
        (url) => {
          setEditProductImageURL(url);
          setEditingProductData((prev) => ({ ...prev, product_image: url }));
        },
        () => {},
        setIsUploadingEditImage,
      );
    } else {
      setEditingProductData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveEditProduct = () => {
    const errors = validateProduct(editingProductData);
    if (Object.keys(errors).length > 0) {
      showAlertMessage("Please fix errors before saving.", "destructive");
      return;
    }
    const updated = [...productList];
    updated[editingProductIndex] = {
      name: editingProductData.product_name,
      quantity: Number(editingProductData.quantity),
      price: Number(editingProductData.price),
      description: editingProductData.product_description,
      image: editingProductData.product_image,
      total_price:
        Number(editingProductData.quantity) * Number(editingProductData.price),
    };
    setProductList(updated);
    setShowEditProductModal(false);
    setEditingProductIndex(null);
    showAlertMessage("Product updated successfully!", "success");
  };

  // ── Remove product ────────────────────────────────────────
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

  // ── Delivery time handler ─────────────────────────────────
  const handleDeliveryTimeRangeChange = (value) => {
    if (value === "custom_date") {
      setDeliveryTimeType("custom_date");
      setDeliveryTimeRange("");
    } else {
      setDeliveryTimeType("range");
      setDeliveryTimeRange(value);
      setDeliveryCustomDate("");
    }
  };

  // ── Proceed / submit ──────────────────────────────────────
  const handleProceed = () => {
    if (
      !vendor.vendor_name ||
      !vendor.vendor_email ||
      !vendor.vendor_phone_number
    ) {
      showAlertMessage(
        "Please fill in all vendor details before proceeding.",
        "destructive",
      );
      return;
    }
    if (!deliveryAddress) {
      showAlertMessage("Please provide a delivery address.", "destructive");
      return;
    }
    if (!deliveryOption) {
      showAlertMessage("Please select a delivery option.", "destructive");
      return;
    }
    if (deliveryOption === "agreed_delivery_fee" && !agreedDeliveryFee) {
      showAlertMessage("Please enter the agreed delivery fee.", "destructive");
      return;
    }
    if (!deliveryTimeRange && !deliveryCustomDate) {
      showAlertMessage(
        "Please select an expected delivery timeframe.",
        "destructive",
      );
      return;
    }
    if (productList.length === 0) {
      showAlertMessage(
        "Please add at least one product before proceeding.",
        "destructive",
      );
      return;
    }
    setShowModal(true);
  };

  const confirmProceed = async () => {
    const payload = {
      buyer_email: userEmail,
      vendor_name: vendor.vendor_name,
      vendor_phone_number: vendor.vendor_phone_number,
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
      delivery_option: deliveryOption,
      ...(deliveryOption === "agreed_delivery_fee" && {
        agreed_delivery_fee: Number(agreedDeliveryFee),
      }),
      ...(deliveryTimeType === "custom_date"
        ? { expected_delivery_date: deliveryCustomDate }
        : { expected_delivery_range: deliveryTimeRange }),
    };

    try {
      setShowModal(false);
      setIsProcessing(true);
      let res;
      if (isEditMode && transactionId) {
        res = await editTransaction({
          transaction_id: transactionId,
          ...payload,
        }).unwrap();
        showAlertMessage("Transaction updated successfully!", "success");
      } else {
        res = await initiateTransaction(payload).unwrap();
        showAlertMessage("Transaction initiated successfully!", "success");
      }
      dispatch(setEscrowProduct(res));
      setTimeout(() => navigate("/userdashboard/transaction-history"), 2000);
    } catch (error) {
      showAlertMessage(
        error?.data?.message ||
          error?.message ||
          "Failed to process transaction",
        "destructive",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (isFetchingTransaction) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">Loading transaction data...</p>
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────
  return (
    <div className="px-lg-5">
      <Form className="w-100 mt-5 p-4 p-lg-5 rounded shadow bg-white">
        <h3 className="mb-4 fw-bold text-center text-success">
          {isEditMode
            ? "Edit Product Escrow Transaction"
            : "Initiate Product Escrow"}
        </h3>

        {isEditMode && (
          <div className="alert alert-info text-center mb-4" role="alert">
            <i className="bi bi-pencil-square me-2"></i>
            <strong>Edit Mode:</strong> You are editing transaction{" "}
            {transactionId}
          </div>
        )}

        {showAlert && (
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose
            autoCloseTime={5000}
          >
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        )}

        {/* ── VENDOR DETAILS ── */}
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

        {/* ── DELIVERY ADDRESS ── */}
        <div className="mb-4">
          <h5 className="fw-semibold text-success mb-3">Delivery Address</h5>
          <FloatingLabel label="Enter Delivery Address">
            <Form.Control
              as="textarea"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              style={{ height: "80px" }}
              placeholder="Enter delivery address"
            />
          </FloatingLabel>
        </div>

        {/* ── DELIVERY OPTION ── */}
        <div className="mb-4">
          <h5 className="fw-semibold text-success mb-3">
            Delivery Option <span className="text-danger">*</span>
          </h5>
          <Row className="g-3 mb-3">
            {DELIVERY_OPTIONS.map((opt) => (
              <Col md={4} key={opt.value}>
                <div
                  onClick={() => {
                    setDeliveryOption(opt.value);
                    if (opt.value !== "agreed_delivery_fee")
                      setAgreedDeliveryFee("");
                  }}
                  style={{
                    cursor: "pointer",
                    border: `2px solid ${deliveryOption === opt.value ? "#198754" : "#dee2e6"}`,
                    borderRadius: 10,
                    padding: "14px 16px",
                    backgroundColor:
                      deliveryOption === opt.value ? "#ECFDF5" : "#fff",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <i
                      className={`bi ${opt.icon}`}
                      style={{
                        color:
                          deliveryOption === opt.value ? "#198754" : "#6B7280",
                        fontSize: "1.1rem",
                      }}
                    ></i>
                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color:
                          deliveryOption === opt.value ? "#198754" : "#1a1a1a",
                      }}
                    >
                      {opt.label}
                    </span>
                    {deliveryOption === opt.value && (
                      <i
                        className="bi bi-check-circle-fill ms-auto"
                        style={{ color: "#198754" }}
                      ></i>
                    )}
                  </div>
                  <p
                    style={{ fontSize: "0.78rem", color: "#6B7280", margin: 0 }}
                  >
                    {opt.description}
                  </p>
                </div>
              </Col>
            ))}
          </Row>

          {/* Agreed delivery fee input */}
          {deliveryOption === "agreed_delivery_fee" && (
            <div
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: 10,
                padding: "1rem 1.25rem",
                marginTop: "0.5rem",
              }}
            >
              <Form.Label
                className="fw-semibold"
                style={{ fontSize: "0.9rem", color: "#065F46" }}
              >
                <i className="bi bi-truck me-2"></i>Agreed Delivery Fee (₦){" "}
                <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                min="0"
                value={agreedDeliveryFee}
                onChange={(e) => setAgreedDeliveryFee(e.target.value)}
                placeholder="Enter the delivery fee agreed by both parties"
                style={{ maxWidth: 320, borderColor: "#6EE7B7" }}
              />
              <small style={{ color: "#15803D", fontSize: "0.8rem" }}>
                This amount will be included in the total transaction cost.
              </small>
            </div>
          )}
        </div>

        {/* ── EXPECTED DELIVERY ── */}
        <div className="mb-4">
          <h5 className="fw-semibold text-success mb-3">
            Expected Delivery Timeframe <span className="text-danger">*</span>
          </h5>
          <Row className="g-3 align-items-end">
            <Col md={6}>
              <Form.Label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Select a timeframe
              </Form.Label>
              <Form.Select
                value={
                  deliveryTimeType === "custom_date"
                    ? "custom_date"
                    : deliveryTimeRange
                }
                onChange={(e) => handleDeliveryTimeRangeChange(e.target.value)}
                style={{ borderColor: "#dee2e6", padding: "12px 14px" }}
              >
                <option value="">-- Select delivery timeframe --</option>
                {DELIVERY_TIME_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Form.Select>
            </Col>

            {/* Custom date picker */}
            {deliveryTimeType === "custom_date" && (
              <Col md={4}>
                <Form.Label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                  Pick a date
                </Form.Label>
                <Form.Control
                  type="date"
                  min={getTodayString()}
                  value={deliveryCustomDate}
                  onChange={(e) => setDeliveryCustomDate(e.target.value)}
                  style={{ borderColor: "#dee2e6", padding: "11px 14px" }}
                />
              </Col>
            )}

            {/* Display selected */}
            {(deliveryTimeRange || deliveryCustomDate) && (
              <Col md="auto">
                <div
                  style={{
                    backgroundColor: "#ECFDF5",
                    border: "1px solid #6EE7B7",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: "0.85rem",
                    color: "#065F46",
                    fontWeight: 500,
                  }}
                >
                  <i className="bi bi-calendar2-check me-2"></i>
                  {getExpectedDeliveryDisplay()}
                </div>
              </Col>
            )}
          </Row>
        </div>

        {/* ── PRODUCT DETAILS ── */}
        <div className="mb-4">
          <h5 className="fw-semibold text-success mb-3">
            {isEditMode ? "Add / Modify Products" : "Product Details"}
          </h5>
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
                disabled={isProcessing}
              >
                {isProcessing ? "Uploading..." : "Add Product"}
              </Button>
            </Col>
          </Row>
        </div>

        {/* ── PRODUCT TABLE ── */}
        {productList.length > 0 && (
          <div className="table-responsive mt-4">
            <Table bordered hover>
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Qty</th>
                  <th>Price (₦)</th>
                  <th>Total (₦)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((p, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{
                            width: 44,
                            height: 44,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                          No image
                        </span>
                      )}
                    </td>
                    <td>
                      <span className="fw-semibold">{p.name}</span>
                      {p.description && (
                        <small
                          className="d-block text-muted"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {p.description.slice(0, 40)}
                          {p.description.length > 40 ? "…" : ""}
                        </small>
                      )}
                    </td>
                    <td>{p.quantity}</td>
                    <td>{Number(p.price).toLocaleString()}</td>
                    <td>{Number(p.total_price).toLocaleString()}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => handleOpenEditProduct(index)}
                          disabled={isProcessing}
                          title="Edit product"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveProduct(index)}
                          disabled={isProcessing}
                          title="Remove product"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* ── TOTALS ── */}
        <div
          className="mt-4 p-3 rounded"
          style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
        >
          <div className="d-flex justify-content-between fw-semibold">
            <span>Products Subtotal:</span>
            <span>₦ {sumTotal.toLocaleString()}</span>
          </div>
          {deliveryOption === "agreed_delivery_fee" && agreedDeliveryFee && (
            <div className="d-flex justify-content-between fw-semibold mt-2">
              <span>Agreed Delivery Fee:</span>
              <span>₦ {Number(agreedDeliveryFee).toLocaleString()}</span>
            </div>
          )}
          <div className="d-flex justify-content-between fw-semibold mt-2">
            <span>Platform Commission (1%):</span>
            <span>
              ₦{" "}
              {(
                (sumTotal +
                  (deliveryOption === "agreed_delivery_fee" && agreedDeliveryFee
                    ? Number(agreedDeliveryFee)
                    : 0)) *
                0.01
              ).toFixed(2)}
            </span>
          </div>
          <div className="d-flex justify-content-between fw-bold fs-5 mt-3 border-top pt-2">
            <span>Total Payable:</span>
            <span>₦ {Number(transactionTotal).toLocaleString()}</span>
          </div>
        </div>

        {/* ── BUTTONS ── */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            variant="outline-danger"
            onClick={() => navigate("/userdashboard/transaction-history")}
            style={{ width: "140px" }}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            className="btn-success text-white"
            style={{ width: "140px" }}
            onClick={handleProceed}
            disabled={
              productList.length === 0 ||
              isLoading ||
              isEditLoading ||
              isProcessing
            }
          >
            {isProcessing || isLoading || isEditLoading
              ? "Processing..."
              : isEditMode
                ? "Update"
                : "Proceed"}
          </Button>
        </div>
      </Form>

      {/* ══ CONFIRMATION MODAL ══ */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditMode ? "Update Transaction Summary" : "Transaction Summary"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h6 className="fw-bold">Vendor Details</h6>
          <p className="mb-1">Name: {vendor.vendor_name}</p>
          <p className="mb-1">Email: {vendor.vendor_email}</p>
          <p className="mb-3">Phone: {vendor.vendor_phone_number}</p>

          <div className="d-flex gap-3 mb-3">
            <div
              style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #E5E7EB",
              }}
            >
              <small
                className="text-muted d-block"
                style={{ fontSize: "0.75rem" }}
              >
                Delivery Option
              </small>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {getDeliveryDisplay()}
              </span>
            </div>
            <div
              style={{
                flex: 1,
                backgroundColor: "#F9FAFB",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid #E5E7EB",
              }}
            >
              <small
                className="text-muted d-block"
                style={{ fontSize: "0.75rem" }}
              >
                Expected Delivery
              </small>
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {getExpectedDeliveryDisplay()}
              </span>
            </div>
          </div>

          <hr />
          <h6 className="fw-bold mb-3">Products</h6>
          <Accordion>
            {productList.map((p, i) => (
              <Accordion.Item eventKey={i.toString()} key={i}>
                <Accordion.Header>
                  <strong className="text-success">{p.name}</strong>
                  <Badge bg="secondary" className="ms-2">
                    {p.quantity} × ₦{Number(p.price).toLocaleString()}
                  </Badge>
                </Accordion.Header>
                <Accordion.Body>
                  <div className="mb-2">
                    <strong>Qty:</strong> {p.quantity}
                  </div>
                  <div className="mb-2">
                    <strong>Unit Price:</strong> ₦
                    {Number(p.price).toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <strong>Line Total:</strong> ₦
                    {Number(p.total_price).toLocaleString()}
                  </div>
                  <div className="mb-2">
                    <strong>Description:</strong> {p.description}
                  </div>
                  <div className="mb-2">
                    <strong>Delivery Address:</strong> {deliveryAddress}
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
          <div
            className="mt-3 p-3 rounded"
            style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}
          >
            <div className="d-flex justify-content-between fw-semibold">
              <span>Products Subtotal:</span>
              <span>₦ {sumTotal.toLocaleString()}</span>
            </div>
            {deliveryOption === "agreed_delivery_fee" && agreedDeliveryFee && (
              <div className="d-flex justify-content-between fw-semibold mt-2">
                <span>Delivery Fee:</span>
                <span>₦ {Number(agreedDeliveryFee).toLocaleString()}</span>
              </div>
            )}
            <div className="d-flex justify-content-between fw-semibold mt-2">
              <span>Commission (1%):</span>
              <span>
                ₦{" "}
                {(
                  (sumTotal +
                    (deliveryOption === "agreed_delivery_fee" &&
                    agreedDeliveryFee
                      ? Number(agreedDeliveryFee)
                      : 0)) *
                  0.01
                ).toFixed(2)}
              </span>
            </div>
            <div className="d-flex justify-content-between fw-bold fs-5 mt-3 border-top pt-2">
              <span>Total Payable:</span>
              <span>₦ {Number(transactionTotal).toLocaleString()}</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={confirmProceed}
            disabled={isProcessing}
          >
            {isProcessing
              ? "Processing..."
              : isEditMode
                ? "Confirm Update"
                : "Confirm & Proceed"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ══ EDIT PRODUCT MODAL ══ */}
      <Modal
        show={showEditProductModal}
        onHide={() => setShowEditProductModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <FloatingLabel label="Product Name">
                <Form.Control
                  type="text"
                  name="product_name"
                  value={editingProductData.product_name}
                  onChange={handleEditProductChange}
                  placeholder="Product Name"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Quantity">
                <Form.Control
                  type="number"
                  name="quantity"
                  value={editingProductData.quantity}
                  onChange={handleEditProductChange}
                  placeholder="Quantity"
                />
              </FloatingLabel>
            </Col>
            <Col md={6}>
              <FloatingLabel label="Price (₦)">
                <Form.Control
                  type="number"
                  name="price"
                  value={editingProductData.price}
                  onChange={handleEditProductChange}
                  placeholder="Price"
                />
              </FloatingLabel>
            </Col>
            <Col md={12}>
              <FloatingLabel label="Description">
                <Form.Control
                  as="textarea"
                  name="product_description"
                  value={editingProductData.product_description}
                  onChange={handleEditProductChange}
                  style={{ height: "80px" }}
                  placeholder="Description"
                />
              </FloatingLabel>
            </Col>
            <Col md={12}>
              <Form.Label>Replace Image (optional)</Form.Label>
              <Form.Control
                type="file"
                name="product_image"
                onChange={handleEditProductChange}
                disabled={isUploadingEditImage}
              />
              {isUploadingEditImage && (
                <small className="text-info">Uploading...</small>
              )}
              {editProductImageURL && (
                <div className="text-center mt-2">
                  <img
                    src={editProductImageURL}
                    alt="preview"
                    className="img-fluid rounded"
                    style={{ maxWidth: "160px" }}
                  />
                </div>
              )}
            </Col>
          </Row>
          {editingProductData.quantity && editingProductData.price && (
            <div
              className="mt-3 p-2 rounded text-center"
              style={{
                backgroundColor: "#ECFDF5",
                border: "1px solid #6EE7B7",
              }}
            >
              <small style={{ color: "#065F46", fontWeight: 600 }}>
                Updated line total: ₦
                {(
                  Number(editingProductData.quantity) *
                  Number(editingProductData.price)
                ).toLocaleString()}
              </small>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowEditProductModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleSaveEditProduct}
            disabled={isUploadingEditImage}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ══ REMOVE PRODUCT MODAL ══ */}
      <Modal
        show={showRemoveModal}
        onHide={() => setShowRemoveModal(false)}
        centered
        size="sm"
      >
        <Modal.Body className="text-center p-4">
          <p className="fw-semibold mb-3">
            Are you sure you want to remove this product?
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Button variant="danger" size="sm" onClick={confirmRemoveProduct}>
              Yes, Remove
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowRemoveModal(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InitiateProductEscrowForm;
