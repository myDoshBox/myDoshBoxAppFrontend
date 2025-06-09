import { Link } from "react-router-dom";
import { GeneralModal } from "../../components/Modal";
import { UserDashboardNavbar } from "../../components/NavbarComponents/TopNavbars";
// import { Ireject } from "../../components/ButtonsComponent/OtherButtons";
import { Button } from "react-bootstrap";
import { useInitiateEscrowProductTransactionMutation } from "../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
// import { useVerifyEscrowProductTransactionPaymentMutation } from "../../redux/slices/escrowProductSlices/escrowProductsAPISlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const EscrowAgreement = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5 px-lg-5">
              <EscrowAgreementText />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const EscrowAgreementText = () => {
  const [initiateEscrowProduct, { data }] =
    useInitiateEscrowProductTransactionMutation();

  // const [verifyEscrowProductTransactionPayment] =
  //   useVerifyEscrowProductTransactionPaymentMutation();

  const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);
  // const loggedInUser = localStorage.getItem("userInfo");
  // const userInfo = JSON.parse(loggedInUser).user.email;

  const { userInfo } = useSelector((state) => state.usersauth);

  // console.log("userEmail", userEmail);
  const userEmail = userInfo?.user?.email;

  // const navigate = useNavigate();

  // // Get the current URL's query parameters
  // const urlParams = new URLSearchParams(window.location.search);

  // // Extract the 'reference' parameter from the URL
  // const reference = urlParams.get("reference");

  // // Log or use the 'reference'
  // console.log(reference); // This will output: db917a34-7d04-4400-85fc-4c8d1918cbda

  // // console.log(escrowProductInfo);
  // // console.log(userInfo);

  // useEffect(() => {
  //   if (reference) {
  //     const verifyEscrowProductTransaction = async () => {
  //       await verifyEscrowProductTransactionPayment(reference)
  //         .unwrap()
  //         .then((res) => {
  //           // console.log(res);

  //           toast.success(res?.message);
  //         })
  //         .catch((error) => {
  //           // console.log(error);
  //         });
  //     };
  //     verifyEscrowProductTransaction();
  //   }
  // }, [reference, verifyEscrowProductTransactionPayment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await initiateEscrowProduct({
      ...escrowProductInfo,
      buyer_email: userEmail,
    })
      .unwrap()
      .then((res) => {
        // const { buyerPaysForEscrow } = data || {};
        // console.log("res", res.buyerPaysForEscrow.data.authorization_url);
        window.open(res.buyerPaysForEscrow.data.authorization_url, "_blank");
      })
      .catch((error) => {
        // console.log(error);
        toast.error(error?.data?.message);
      });
  };

  return (
    <div className="w-100 mt-5 shadow InitiateEscrow p-3 p-lg-5 rounded">
      <h1 className="fs-4 text-center">Escrow Initiation Agreement</h1>
      <div>
        <p className="mb-4">
          This Escrow Agreement (the "Agreement") is made and entered into on
          [Date] by and between [Buyer's Name] (the "Buyer") and [Seller's Name]
          (the "Seller"), and [Escrow Platform's Name] (the "Escrow Platform").
        </p>
        <h6 className="fs-6">RECITALS</h6>
        <ul className="">
          <li className="normal-text mb-3">
            The Buyer desires to purchase from the Seller and the Seller desires
            to sell to the Buyer the following item or service (the "Item"):
            [Insert description of Item, including any relevant details such as
            name, quantity, price, etc.]
          </li>
          <li className="normal-text mb-4">
            The Buyer and the Seller agree to use the Escrow Platform to
            facilitate the transaction and hold the purchase price in escrow
            until the Item has been delivered and accepted by the Buyer.
          </li>
        </ul>
        <h6 className="fs-6">AGREEMENT</h6>
        <ol className="">
          <li className="normal-text mb-3">
            Item and Purchase Price. The Buyer agrees to purchase the Item from
            the Seller for the purchase price of [Insert purchase price]. The
            Buyer agrees to pay the purchase price to the Escrow Platform, which
            will hold the funds in escrow until the Item has been delivered and
            accepted by the Buyer.
          </li>
          <li className="normal-text mb-3">
            Delivery and Acceptance. The Seller agrees to deliver the Item to
            the Buyer within [Insert number] days of receiving payment from the
            Escrow Platform. The Buyer agrees to accept the Item upon delivery,
            unless the Item is not as described in the Agreement or is
            defective. In such cases, the Buyer may reject the Item and request
            a refund of the purchase price.
          </li>
          <li className="normal-text mb-3">
            Refunds. If the Buyer rejects the Item or requests a refund for any
            other reason, the Escrow Platform will release the purchase price to
            the Buyer and the transaction will be considered terminated. If the
            Buyer does not reject the Item within [Insert number] days of
            delivery, the Item will be considered accepted and the Escrow
            Platform will release the purchase price to the Seller.
          </li>
          <li className="normal-text mb-3">
            Dispute Resolution. In the event of a dispute between the Buyer and
            the Seller, the parties agree to work with the Escrow Platform to
            resolve the issue in a fair and amicable manner. If the dispute
            cannot be resolved through mutual agreement, the parties agree to
            submit to binding arbitration.
          </li>
          <li className="normal-text mb-3">
            Governing Law. This Agreement shall be governed by and construed in
            accordance with the laws of the State of [Insert state].
          </li>
          <li className="normal-text mb-5">
            Entire Agreement. This Agreement constitutes the entire agreement
            between the parties and supersedes any prior agreements or
            understandings, whether written or oral. This Agreement may not be
            amended or modified except in writing signed by both parties.
          </li>
        </ol>

        <p className="mb-5">
          IN WITNESS WHEREOF, the parties have executed this Agreement as of the
          date and year first above written.
        </p>
        <div className="d-flex justify-content-between">
          <p className="fw-bold">[Buyer's signature/name]</p>{" "}
          <p className="fw-bold">[Escrow Platform's signature]</p>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-5">
        {/* <Link to={-1}>
          <Ireject />
        </Link> */}

        <Link
          to="/userdashboard/transactionsummary"
          className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white pale-red  me-3"
          style={{ width: "110px" }}
        >
          I Reject
        </Link>

        <Button
          className="all-btn border-0 mt-3 GeneralBtnStyle1 btn all-btn text-white"
          style={{ width: "110px" }}
          onClick={handleSubmit}
        >
          I Agree
        </Button>

        {/* <GeneralModal
          openModalText="I Agree"
          modalBtnStyle="GeneralBtnStyle1 btn all-btn text-white mx-5 my-3"
          modalTitle="User Notified"
          modalMessage="User Opeyemi Andrewson has just been notified of the transaction you created. You will be notified once the transaction is accepted"
          modalRoute="../../userdashboard"
          closeModalText="Home"
        /> */}
      </div>
    </div>
  );
};

export default EscrowAgreement;
