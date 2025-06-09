import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { UserDashboardNavbar } from "../../../components/NavbarComponents/TopNavbars";
import { Link, useNavigate } from "react-router-dom";
import { CancelButton } from "../../../components/ButtonsComponent/OtherButtons";
import { ProceedButton } from "../../../components/ButtonsComponent/TransactionButtons";

import { useDispatch, useSelector } from "react-redux";
import { setEscrowProduct } from "../../../redux/slices/escrowProductSlices/escrowProductContentSlice";
import { useAppContext } from "../../../context/appContext";
import { toast } from "react-toastify";

const InitiateProductEscrowForm = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5">
              <InitiateEscrowForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const InitiateEscrowForm = () => {
  // const { userInfo } = useSelector((state) => state.usersauth);
  const loggedInUser = localStorage.getItem("userInfo");

  const userInfo = JSON.parse(loggedInUser).user.email;
  const { storeInitiateEscrowProductForm, initiateEscrowProductForm } =
    useAppContext();

  const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);

  const initialValues = {
    vendor_phone_number: "",
    // buyer_email: userInfo.email,
    vendor_name: "",
    vendor_email: "",
    transaction_type: "buy",
    product_name: "",
    // product_category: "",
    product_quantity: 0,
    product_price: 0,
    transaction_total: 0,
    product_image: null,
    product_description: "",
    delivery_address: "",
  };
  const [transaction, setTransaction] = useState(
    escrowProductInfo || initialValues
  );

  // console.log("escrowProductInfo", escrowProductInfo);

  const [transactionDetails, setTransactionDetails] = useState([]);
  const [productImageFile, setProductImageFile] = useState(null);
  const [productImageURL, setProductImageURL] = useState("");

  const [transactionTotal, setTransactionTotal] = useState(0);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [buySellChoice, setBuySellChoice] = useState();

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    // the upload_preset is a naming convention from cloudinary do not rename it.
    formData.append("upload_preset", "ldk7mrmm");
    formData.append("cloud_name", "dotkplv0d");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dotkplv0d/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();
    setProductImageURL(data.secure_url);
    setTransaction({ ...transaction, product_image: data.secure_url });
    console.log(data.secure_url);
  };

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    // console.log({
    //   e: e.target,
    // });

    if (type === "file") {
      const file = files && files[0];
      if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
        const url = URL.createObjectURL(file);
        setProductImageURL(url);
        setProductImageFile(file);
        // setTransaction({ ...transaction, [name]: file });
        setTransaction({
          ...transaction,
          [name]: value || file,
        });
      } else {
        console.error("Please upload an image file in .png or .jpg format");
        setFormErrors({
          ...formErrors,
          [name]: "Please upload an image file in .png or .jpg format",
        });
      }
    } else {
      setTransaction({ ...transaction, [name]: e.target.value });
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleImageUpload = () => {
    if (!productImageFile) {
      console.error("No image selected for upload");
      setFormErrors({
        ...formErrors,
        product_image: "No image selected for upload",
      });
      return;
    }
  };

  const handleCancel = () => {
    dispatch(setEscrowProduct(null));
    navigate("../../userdashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTransactionDetails([...transactionDetails, transaction]);
    // setTransaction(initialValues);
    // }

    //  setFormErrors(validate(transaction));
    //  setIsSubmit(true);

    if (Object.keys(formErrors).length === 0) {
      // console.log(transaction);
      setIsSubmit(true);
      dispatch(setEscrowProduct(transaction));
      // console.log("transaction", transaction);
      // storeInitiateEscrowProductForm()
      navigate("/userdashboard/transactionsummary");
      // console.log("HI");
    }
  };

  // console.log("escrowProductInfo", escrowProductInfo);

  // console.log(transaction);

  useEffect(() => {
    // console.log(formErrors);
    // if (Object.keys(formErrors).length !== 0 && !isSubmit) {
    //   // console.log(transaction);
    //   setFormErrors(validate(transaction));
    // }
    setFormErrors(validate(transaction));
  }, [transaction]);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.vendor_name) {
      errors.vendor_name = "Please provide the vendor's name";
    }
    if (!values.vendor_phone_number) {
      errors.vendor_phone_number = "Please provide the vendor's phone number";
    }
    if (!values.vendor_email) {
      errors.vendor_email = "Please provide the vendor's email";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(values.vendor_email)
    ) {
      errors.vendor_email = "Email is not valid";
    }
    if (!values.transaction_type) {
      errors.transaction_type = "Please select a transaction type";
    }
    if (!values.product_name) {
      errors.product_name =
        "Please provide the name of the product that you are buying";
    }
    // if (!values.product_category) {
    //   errors.product_category =
    //     "Please provide the category of the product that you are buying";
    // }
    if (!values.product_quantity) {
      errors.product_quantity =
        "Please provide the quantity of the product you would like to purchase";
    }
    if (!values.product_price) {
      errors.product_price =
        "Please provide the price of the product you would like to purchase";
    }
    if (!values.product_image) {
      errors.product_image =
        "Please upload an image of the product you would like to purchase";
    } else {
      const allowedExtensions = [
        "png",
        "jpg",
        "jpeg",
        "image/png",
        "image/jpg",
        "image/jpeg",
      ];

      const imageExtension = values.product_image;
      // .split(".")
      // .pop()
      // .toLowerCase();

      // console.log("values.product_image", values.product_image);
      // console.log("values.product_image.type", values.product_image.type);

      if (!allowedExtensions.includes(productImageFile?.type)) {
        errors.product_image = "Only .jpg, .jpeg, and .png files are allowed";
      }
    }

    if (!values.product_description) {
      errors.product_description =
        "Please provide the description of the product that you are buying";
    }

    if (!values.delivery_address) {
      errors.delivery_address =
        "Please provide the delivery address where you want the product is to be delivered";
    }

    return errors;
  };

  // const handlePriceChange = (e) => {
  //   const newPrice = e.target.value;
  //   setTransaction((prevInfo) => ({
  //     ...prevInfo,
  //     product_price: newPrice,
  //   }));
  // };

  // const handleQuantityChange = (e) => {
  //   const newQuantity = e.target.value;
  //   setTransaction((prevInfo) => ({
  //     ...prevInfo,
  //     product_quantity: newQuantity,
  //   }));
  // };

  // useEffect(() => {
  //   if (
  //     escrowProductInfo &&
  //     escrowProductInfo.product_quantity &&
  //     escrowProductInfo.product_price
  //   ) {
  //     const totalCalc = () => {
  //       const total =
  //         parseInt(escrowProductInfo.product_quantity) *
  //           parseFloat(escrowProductInfo.product_price) +
  //         0.025 * parseFloat(escrowProductInfo.product_price);

  //       // setTransactionTotal(total.toFixed(2)); // Store the calculated total
  //       const calculatedTotal = total.toFixed(2);
  //       setTransactionTotal(calculatedTotal);

  //       // Update transaction object with transaction_total
  //       setTransaction((prevTransaction) => ({
  //         ...prevTransaction,
  //         transaction_total: calculatedTotal,
  //       }));
  //     };

  //     // Run calculation only if the required fields are filled
  //     // if (transaction.product_quantity && transaction.product_price) {
  //     totalCalc();
  //     // }
  //   }
  // }, [
  //   transaction.product_quantity,
  //   transaction.product_price,
  //   escrowProductInfo,
  // ]);

  useEffect(() => {
    const calculateTotal = () => {
      const total =
        parseInt(transaction?.product_quantity) *
          parseFloat(transaction?.product_price) +
        0.025 * parseFloat(transaction?.product_price);

      // Update both state and the transaction object
      setTransactionTotal(total.toFixed(2));
      setTransaction((prevTransaction) => ({
        ...prevTransaction,
        transaction_total: total.toFixed(2),
      }));
    };

    if (transaction?.product_quantity && transaction?.product_price) {
      calculateTotal();
    }
  }, [transaction?.product_quantity, transaction?.product_price]);

  useEffect(() => {
    if (escrowProductInfo) {
      setBuySellChoice(transaction?.transaction_type);
      setProductImageFile(transaction?.product_image);
    }
  }, [
    escrowProductInfo,
    transaction?.product_image,
    transaction?.transaction_type,
  ]);

  return (
    <div className="px-lg-5">
      <Form
        onSubmit={handleSubmit}
        className="w-100 mt-5 shadow InitiateEscrow p-3 p-lg-5 rounded"
      >
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Vendor Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter vendor's phone number"
            id="vendor_name"
            name="vendor_name"
            value={transaction?.vendor_name}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.vendor_name && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.vendor_name}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Vendor Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter vendor's phone number"
            id="vendor_phone_number"
            name="vendor_phone_number"
            value={transaction.vendor_phone_number}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.vendor_phone_number && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.vendor_phone_number}
            </div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Vendor Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter vendor's email"
            id="vendor_email"
            name="vendor_email"
            value={transaction.vendor_email}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.vendor_email && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.vendor_email}
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
          <Form.Label className="m-0">Product Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            id="product_name"
            name="product_name"
            value={transaction.product_name}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.product_name && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.product_name}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="m-0">Delivery Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter delivery address"
            id="delivery_address"
            name="delivery_address"
            value={transaction.delivery_address}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.delivery_address && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.delivery_address}
            </div>
          )}
        </Form.Group>
        {/* <Form.Group className="mb-3">
          <label className="">What are you transacting?</label>
          <div class="d-flex">
            <button
              type="button"
              class="w-50 btn btn-outline-primary me-3 EscrowTransactTypeBtn"
              onClick={handleProductButtonClick}
            >
              Product
            </button>
            <button
              type="button"
              class="w-50 btn btn-outline-secondary EscrowTransactTypeBtn"
              onClick={handleServiceButtonClick}
            >
              Service
            </button>
          </div>
        </Form.Group> */}
        {/* {showProductForm && ( */}
        {/* <> */}
        {/* <Form.Group className="mb-3">
            <Form.Label className="m-0">Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              id="name"
              className="escrow-input-field"
              placeholder="Enter product name"
            />
            <small className="small-text text-danger fst-italic fw-lighter">
              *This field is required
            </small>
        </Form.Group> */}
        {/* <div className="form-group mb-3">
            <label for="category">Category</label>
            <select
              className="form-select escrow-dropdown-field border"
              id="category"
              placeholder="Pick your product category"
            >
              <option
                className="escrow-dropdown-field"
                value="Jewelry and Ornaments"
              >
                Jewelry and Ornaments
              </option>
              <option
                className="escrow-dropdown-field"
                value="Food and Nutrition"
              >
                Food and Nutrition
              </option>
              <option
                className="escrow-dropdown-field"
                value="Clothing and Textiles"
              >
                Clothing and Textiles
              </option>
            </select>
          </div> */}
        {/* <Form.Group className="">
            <Form.Label className="m-0">Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter quantity"
              id="quantity"
              name="quantity"
              value={transaction.quantity}
              onChange={handleChange}
              className="escrow-input-field"
            />
            <span className="escrow-form-error ms-3">
              {formErrors.quantity}
            </span>
        </Form.Group> */}
        <Form.Group className="mb-3">
          <Form.Label className="m-0">Product Quantity</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product quantity"
            id="product_quantity"
            name="product_quantity"
            value={transaction.product_quantity}
            onChange={handleChange}
            // onChange={handleQuantityChange}
            className="escrow-input-field"
          />

          {formErrors.product_quantity && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.product_quantity}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="m-0">Product Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product price"
            id="product_price"
            name="product_price"
            value={transaction.product_price}
            onChange={handleChange}
            // onChange={handlePriceChange}
            className="escrow-input-field"
          />

          {formErrors.product_price && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.product_price}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="">Product Image</Form.Label>
          <Form.Control
            type="file"
            placeholder="Attach an Image"
            id="product_image"
            name="product_image"
            value={transaction.product_image?.name}
            onChange={handleChange}
            className="escrow-input-field escrow-images"
            accept="image/*"
          />

          {productImageURL ? (
            <div className="mt-2">
              <img src={productImageURL} alt="Selected product" width="100" />
            </div>
          ) : (
            <div className="mt-2">No image selected</div>
          )}

          {formErrors.product_image && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.product_image}
            </div>
          )}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="m-0">Description</Form.Label>
          <Form.Control
            type="text"
            as="textarea"
            aria-label="With textarea"
            placeholder="Enter product description"
            id="product_description"
            name="product_description"
            value={transaction.product_description}
            onChange={handleChange}
            className="escrow-input-field"
          />

          {formErrors.product_description && (
            <div className="text-danger p-1" style={{ fontSize: "10px" }}>
              {formErrors.product_description}
            </div>
          )}
        </Form.Group>

        <Form.Group className="my-3 d-flex align-items-center justify-content-end text-end">
          <label for="total" className="">
            Total
          </label>
          <span>
            <span
              id="total"
              name="total"
              // value={transaction.product_price}
              onChange={handleChange}
              className="ngn btn rounded-1"
            >
              ₦ {transactionTotal}
            </span>
            {/* <small className="d-block small-text text-danger fst-italic fw-lighter">
              *Service charge included
            </small> */}
          </span>
        </Form.Group>
        {/* </> */}
        {/* )} */}
        {/* 
        {showServiceForm && (
          <>
            <Form.Group className="mb-3">
              <Form.Label className="m-0">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                id="name"
                className="escrow-input-field"
                placeholder="Enter service name"
              />
              <small className="small-text text-danger fst-italic fw-lighter">
                *This field is required
              </small>
            </Form.Group>
            <Form.Group className="form-group mb-3">
              <label for="category">Category</label>
              <select
                className="form-select escrow-dropdown-field border"
                id="category"
                placeholder="Pick your service category"
              >
                <option className="escrow-dropdown-field" value="web design">
                  web design
                </option>
                <option className="escrow-dropdown-field" value="hair styling">
                  hair styling
                </option>
                <option
                  className="escrow-dropdown-field"
                  value="Catering and event planning"
                >
                  Catering and event planning
                </option>
              </select>
            </Form.Group>
            <Form.Group className="">
              <Form.Label className="m-0">Price</Form.Label>
              <div class="input-group">
                <input
                  className="form-control escrow-price-field"
                  aria-label="Price"
                  type="number"
                  placeholder="Enter the amount the product costs"
                  id="price"
                  name="price"
                  value={transaction.price}
                  onChange={handleChange}
                />
                <span className="input-group-text ngn2">₦</span>
              </div>
              <small className="small-text text-danger fst-italic fw-lighter">
                *There is a 5% service charge on each transaction
              </small>
              <span className="escrow-form-error ms-3">{formErrors.price}</span>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="">Image</Form.Label>
              <Form.Control
                type="file"
                placeholder="Attach Image(s)"
                id="image"
                name="image"
                value={transaction.image}
                onChange={handleChange}
                className="escrow-input-field escrow-images"
                accept="image/*"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="m-0">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter service description"
                id="description"
                name="description"
                value={transaction.description}
                onChange={handleChange}
                className="escrow-input-field"
              />
              <span className="escrow-form-error">
                {formErrors.description}
              </span>
            </Form.Group>
            <Form.Group className="form-group mb-3">
              <label for="from">Service Timeline</label>
              <div className="row">
                <div className="col-6 input-group w-50">
                  <label for="from" className="input-group-text">
                    From
                  </label>
                  <input
                    type="date"
                    className="form-control escrow-input-field date-input-field"
                    id="from"
                    placeholder="From"
                  />
                </div>
                <div className="col-6 input-group w-50">
                  <label for="to" className="input-group-text">
                    To
                  </label>
                  <input
                    type="date"
                    className="form-control escrow-input-field date-input-field"
                    id="to"
                    placeholder="To"
                  />
                </div>
              </div>
            </Form.Group>
            <Form.Group className="my-4 d-flex align-items-end text-end flex-column">
              <div>
                <label for="total" className="me-3">
                  Total
                </label>
                <span
                  id="total"
                  name="total"
                  value={transaction.total}
                  onChange={handleChange}
                  className="ngn btn rounded-1"
                >
                  ₦ {transaction.total}
                </span>
              </div>
              <div>
                <small className="d-block small-text text-danger fst-italic fw-lighter">
                  *Service charge included
                </small>
              </div>
            </Form.Group>
          </>
        )} */}
        <div className="d-flex justify-content-center">
          {/* <Link to="../../userdashboard"> */}
          {/* <CancelButton onClick={handleCancel} /> */}
          <Button
            className="border-0 mt-3 btn btn-danger text-white pale-red"
            style={{ width: "140px" }}
            onClick={handleCancel}
          >
            CANCEL
          </Button>
          {/* </Link> */}
          {/* <Link to="../transactionsummary"> */}
          <ProceedButton className="ms-3" />
          {/* </Link> */}
        </div>
      </Form>
    </div>
  );
};

export default InitiateProductEscrowForm;
