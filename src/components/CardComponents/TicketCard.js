import { Cancel } from "../../components/IconComponent/NeutralsDashboardIcons";
import { Link } from "react-router-dom";
import { EditTicketButton } from "../ButtonsComponent/EditButtons";
import { ProceedButton } from "../ButtonsComponent/TransactionButtons";
import { CancelButton } from "../ButtonsComponent/OtherButtons";

// For Generated Ticket Card
export const GeneratedTicketCard = (props) => {
  const {
    tell,
    transaction_id,
    compliant_type,
    Img,
    Img1,
    Img2,
    Img3,
    Futher_info,
    btn1,
    btn2,
    btn3,
    link1,
    link2,
    link3,
  } = props;
  return (
    <section>
      <div>
        <div className="card border-0 shadow">
          <div class="card-body p-4">
            <span className="d-flex justify-content-end">
              <Link to={"../../userdashboard"}>
                <Cancel />
              </Link>
            </span>
            <h5 class="card-title text-center">TICKET No.19234</h5>
            <table className="mt-4">
              <tr>
                <td className="fw-bold">PHONE NUMBER :</td>
                <td className="text-muted p-2">{tell}</td>
              </tr>
              <tr>
                <td className="fw-bold">TRANSACTION ID :</td>
                <td className="text-muted p-2">{transaction_id}</td>
              </tr>
              <tr>
                <td className="fw-bold">COMPLAINT TYPE :</td>
                <td className="text-muted p-2">{compliant_type}</td>
              </tr>
            </table>
            {/* Image Collapse section starts */}
            <div>
              <div className="mt-2 mx-auto">
                <span className="d-flex">
                  <a
                    data-bs-toggle="collapse"
                    href="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    data-bs-target="#collapseExample"
                  >
                    <img src={Img} alt="" />
                  </a>

                  <a
                    data-bs-toggle="collapse"
                    href="#collapseExample1"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample1"
                    data-bs-target="#collapseExample1"
                  >
                    <img src={Img} alt="" />
                  </a>
                  <a
                    data-bs-toggle="collapse"
                    href="#collapseExample2"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample2"
                    data-bs-target="#collapseExample2"
                  >
                    <img src={Img} alt="" />
                  </a>
                </span>
              </div>
              <span className="d-flex mb-3">
                <div class="collapse collapse-horizontal" id="collapseExample">
                  <div class="w-75 d-flex">
                    <img src={Img1} className="" alt="" />
                  </div>
                </div>
                <div class="collapse collapse-horizontal" id="collapseExample1">
                  <div class="w-75 d-flex">
                    <img src={Img2} className="" alt="" />
                  </div>
                </div>
                <div class="collapse collapse-horizontal" id="collapseExample2">
                  <div class="w-75 d-flex">
                    <img src={Img3} className="" alt="" />
                  </div>
                </div>
              </span>
            </div>
            {/* Image Collapse section Ends */}
            <div className="mb-4">
              <h5>FURTHER INFORMATION: </h5>
              <p>{Futher_info}</p>
            </div>
            <div className="mb-3 d-flex justify-content-md-evenly flex-column flex-md-row">
              <Link to={link1} className="mx-auto mb-2">
                <EditTicketButton />
              </Link>
              <Link to={link2} className="mx-auto mb-2">
                <ProceedButton />
              </Link>
              <Link to={link3} className="mx-auto mb-2">
                <CancelButton />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// For | SellerResolveCoflictNotification |SellersGeneratedContestTicket
export const OtherTicket = (props) => {
  const {
    full_name,
    transaction_id,
    compliant_type,
    Img,
    Img1,
    Img2,
    Img3,
    Futher_info,
    btn1,
    btn2,
  } = props;
  return (
    <section>
      <div>
        <div className="card border-0 shadow" style={{ width: "40rem" }}>
          <div class="card-body p-4">
            <span className="d-flex justify-content-end">
              <Cancel />
            </span>
            <h5 class="card-title text-center">TICKET No.19234</h5>
            <table className="mt-4">
              <tr>
                <td className="fw-bold">Full Name :</td>
                <td className="text-muted p-2">{full_name}</td>
              </tr>

              <tr>
                <td className="fw-bold">TRANSACTION ID :</td>
                <td className="text-muted p-2">{transaction_id}</td>
              </tr>
              <tr>
                <td className="fw-bold">COMPLAINT TYPE :</td>
                <td className="text-muted p-2">{compliant_type}</td>
              </tr>
            </table>
            {/* Image Collapse section starts */}
            <div>
              <div className="mt-2 mx-auto">
                <span className="d-flex">
                  <a
                    data-bs-toggle="collapse"
                    href="#collapseExample"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                    data-bs-target="#collapseExample"
                  >
                    <img src={Img} alt="" />
                  </a>

                  <a
                    data-bs-toggle="collapse"
                    href="#collapseExample1"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample1"
                    data-bs-target="#collapseExample1"
                  >
                    <img src={Img} alt="" />
                  </a>
                  <a
                    data-bs-toggle="collapse"
                    href="#collapseExample2"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample2"
                    data-bs-target="#collapseExample2"
                  >
                    <img src={Img} alt="" />
                  </a>
                </span>
              </div>
              <span className="d-flex mb-3">
                <div class="collapse collapse-horizontal" id="collapseExample">
                  <div class="w-75 d-flex">
                    <img src={Img1} className="" alt="" />
                  </div>
                </div>
                <div class="collapse collapse-horizontal" id="collapseExample1">
                  <div class="w-75 d-flex">
                    <img src={Img2} className="" alt="" />
                  </div>
                </div>
                <div class="collapse collapse-horizontal" id="collapseExample2">
                  <div class="w-75 d-flex">
                    <img src={Img3} className="" alt="" />
                  </div>
                </div>
              </span>
            </div>
            {/* Image Collapse section Ends */}
            <div className="mb-4">
              <h5>FURTHER INFORMATION: </h5>
              <p>{Futher_info}</p>
            </div>
            <div className="mb-3 d-flex justify-content-evenly">
              <EditTicketButton />

              <ProceedButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
