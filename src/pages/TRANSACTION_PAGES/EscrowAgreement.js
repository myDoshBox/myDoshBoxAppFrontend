import { Link } from "react-router-dom";
import { GeneralModal } from "../../components/Modal";
import { UserDashboardNavbar } from "../../components/NavbarComponents/TopNavbars";
// import { Ireject } from "../../components/ButtonsComponent/OtherButtons";
import { Button, Container, Row, Col,} from "react-bootstrap";
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
  const [initiateEscrowProduct] = useInitiateEscrowProductTransactionMutation();
  const { escrowProductInfo } = useSelector((state) => state.escrowProductInfo);
  const { userInfo } = useSelector((state) => state.usersauth);

  const userEmail = userInfo?.user?.email;
  const vendorName = escrowProductInfo?.vendor_name || "Seller";
  const platformName = "Doshbox App";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    await initiateEscrowProduct({
      ...escrowProductInfo,
      buyer_email: userEmail,
    })
      .unwrap()
      .then((res) => {
        window.open(res.buyerPaysForEscrow.data.authorization_url, "_blank");
      })
      .catch((error) => {
        toast.error(error?.data?.message);
      });
  };

  return (
    <div className="w-100 mt-5 p-3 p-md-5 bg-white shadow-sm rounded">
      <h2 className="text-center text-success fw-bold mb-4">
        Escrow Initiation Agreement
      </h2>

      <p className="text-dark">
        This Escrow Agreement (the <em>"Agreement"</em>) is made and entered into
        on <strong className="text-success">{today}</strong> by and between{" "}
        <strong className="text-primary">{userEmail}</strong> (the <em>Buyer</em>) and{" "}
        <strong className="text-success">{vendorName}</strong> (the <em>Seller</em>), and{" "}
        <strong className="text-warning">{platformName}</strong> (the <em>Escrow Platform</em>).
      </p>

      <h5 className="text-secondary fw-semibold mt-4">RECITALS</h5>
      <ul className="ps-3">
        <li className="mb-3 text-muted">
          The Buyer desires to purchase from the Seller, and the Seller agrees to sell to
          the Buyer the following item or service:{" "}
          <em>{escrowProductInfo?.product_description || "[Product Description]"}</em>.
        </li>
        <li className="mb-4 text-muted">
          The parties agree to use the Escrow Platform to securely hold funds until
          delivery and acceptance of the Item by the Buyer.
        </li>
      </ul>

      <h5 className="text-secondary fw-semibold">AGREEMENT</h5>
      <ol className="ps-3 text-dark">
        <li className="mb-3">
          <strong>Item & Purchase Price:</strong> Buyer agrees to purchase for{" "}
          <strong className="text-success">₦{escrowProductInfo?.product_price}</strong>.
          Payment will be held in escrow until delivery is accepted.
        </li>
        <li className="mb-3">
          <strong>Delivery:</strong> Seller agrees to deliver within{" "}
          <strong>[Insert days]</strong> after payment confirmation.
        </li>
        <li className="mb-3">
          <strong>Refunds:</strong> If item is rejected or defective, a refund may
          be issued. If accepted, payment goes to Seller.
        </li>
        <li className="mb-3">
          <strong>Dispute Resolution:</strong> All disputes will be handled by{" "}
          <strong className="text-warning">{platformName}</strong>. If unresolved, binding arbitration applies.
        </li>
        <li className="mb-3">
          <strong>Governing Law:</strong> This agreement follows the laws of{" "}
          <strong>[Insert state]</strong>.
        </li>
        <li className="mb-3">
          <strong>Entire Agreement:</strong> This document supersedes all prior
          agreements.
        </li>
      </ol>

      <p className="mt-5">
        IN WITNESS WHEREOF, the parties have executed this Agreement as of the
        date first above written.
      </p>

      <div className="row mt-4 text-center text-md-start text-lg-center bg-light rounded p-3 h-50">
        <div className="col-md-6 mb-3">
          <p className="fw-bold mb-1 text-primary">Buyer's Signature</p>
          <p>{userEmail}</p>
        </div>
        <div className="col-md-6 bg-light rounded text-center p-3">
          <p className="fw-bold mb-1 text-warning"
          >Escrow Platform</p>
          <p>{platformName}</p>
        </div>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mt-5">
  <Link
    to="/userdashboard/transactionsummary"
    className="btn btn-outline-danger fw-semibold px-4 w-100 w-sm-auto"
  >
    I Reject
  </Link>

  <Button
    onClick={handleSubmit}
    className="btn btn-success fw-semibold px-4 w-100 w-sm-auto"
    
  >
    I Agree
  </Button>
</div>

    </div>
  );
};
export default EscrowAgreement;