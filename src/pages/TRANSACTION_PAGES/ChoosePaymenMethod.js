import { Card } from "react-bootstrap";
import bank from "../../images/bank.jpg";
import atm from "../../images/atm.jpg";
import { UserSidenav } from "../../components/NavbarComponents/SideNavbar";
import { Link } from "react-router-dom";

export const ChoosePaymentMethod = () => {
  return (
    <div className="d-flex w-100">
      <div className="d-none d-lg-block">
        <UserSidenav />
      </div>
      <div className="mx-lg-5 mt-5 shadow InitiateEscrow w-100 p-3 p-lg-5 ">
        <div>
          <div className="row p-lg-3 p-2">
            <h4 className="text-center">Payment Method</h4>
            <p className="text-center">Choose your preferred mode of payment</p>
              <div className="col-lg-6 mt-3">
            <a href="https://paystack.com" className="text-decoration-none  link-color-reset">
                <Card className="d-flex flex-row align-items-center p-3 p-md-3 payment-method-card">
                  <img src={atm} alt="atm card" className="w-25" />
                  <div className="ms-2">
                    <h5>Paystack</h5>
                    <p className="fw-lighter text-muted">
                      Proceed to pay using your ATM card
                    </p>
                  </div>
                </Card>
            </a>
              </div>

              <div className="col-lg-6 mt-3 mb-3 ">
            <Link to="/bank-transfer-form" className="text-decoration-none link-color-reset">
                <Card className="d-flex flex-row align-items-center p-3 p-md-3 payment-method-card">
                  <img src={bank} alt="bank" className="w-25" />
                  <div>
                    <h5>Bank Transfer</h5>
                    <p className="fw-lighter text-muted">
                      Proceed to pay by transferring to our account
                    </p>
                  </div>
                </Card>
            </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};
