import Carousel from "../Carousel";
import logo from "../../images/NewDoshLogo.png";
import img1 from "../../images/brokenScreen1.png";
import img2 from "../../images/brokenScreen2.png";
import img3 from "../../images/brokenScreen3.png";

const TransactionSlip = () => {
  const images = [img1, img2, img3];
  return (
    <>
      <div className="card" style={{ width: "98%" }}>
        <p className="text-center pt-4">
          Transaction Slip for Transaction #13w2Wwqt542
        </p>
        <div className="row">
          <div className="col-6 ps-5">
            <img src={logo} alt="logo" style={{ marginBottom: "4rem" }} />
            <div style={{ marginBottom: "4rem" }}>
              <span
                className="d-block mb-2"
                style={{ color: "#757575", fontSize: "0.875rem" }}
              >
                Volkswagen’s Technologie
              </span>
              <span
                className="d-block mb-2"
                style={{ color: "#757575", fontSize: "0.875rem" }}
              >
                3864 Quiet Valley Lane
              </span>
              <span
                className="d-block"
                style={{ color: "#757575", fontSize: "0.875rem" }}
              >
                Sherman Oaks, CA, 91403
              </span>
            </div>
            <Carousel images={images} />
          </div>
          <div className="col-6">
            <div className="text-end pe-5">
              <h5>Transaction ID : #40725</h5>
              <p>Transaction Date: 14 March, 2023</p>
            </div>
            <div className="d-flex justify-content-end flex-column">
              <div
                className=" d-flex justify-content-between w-50 pe-5 ms-auto"
                style={{ color: "#757575", fontSize: "0.875rem" }}
              >
                <span className="ms-auto">Seller Name: </span>
                <span className="ms-auto">John Wick</span>
              </div>
              <div
                className=" d-flex justify-content-between w-50 pe-5 ms-auto"
                style={{ color: "#757575", fontSize: "0.875rem" }}
              >
                <span className="ms-auto">Buyer Name: </span>
                <span className="ms-auto">John Wick</span>
              </div>
              <div
                className=" d-flex justify-content-between w-50 pe-5 ms-auto"
                style={{ color: "#757575", fontSize: "0.875rem" }}
              >
                <span className="ms-auto">Product Name: </span>
                <span className="ms-auto">John Wick</span>
              </div>
            </div>
            <div className="d-flex justify-content-end flex-column p-5">
              <p className="me-auto">Price History</p>
              <div className="border border-secondary-subtle border-start-0 border-end-0 border-bottom-0 w-100 ms-auto">
                <div className="d-flex justify-content-between border border-bottom border-secondary-subtle border-top-0">
                  <div className="px-2 py-3">Product Price: </div>
                  <div className="px-2 py-3">$59685</div>
                </div>
                <div className="d-flex justify-content-between border border-bottom border-secondary-subtle border-top-0">
                  <div className="px-2 py-3">Product Price: </div>
                  <div className="px-2 py-3">$59685</div>
                </div>
                <div className="d-flex justify-content-between border border-bottom border-secondary-subtle border-top-0">
                  <div className="px-2 py-3">Product Price: </div>
                  <div className="px-2 py-3">$59685</div>
                </div>
                <div className="d-flex justify-content-between border border-bottom border-secondary-subtle border-top-0">
                  <div className="px-2 py-3">Product Price: </div>
                  <div className="px-2 py-3">$59685</div>
                </div>
                <div className="d-flex justify-content-between border border-bottom border-secondary-subtle border-top-0">
                  <div className="px-2 py-3">Product Price: </div>
                  <div className="px-2 py-3">$59685</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="ps-5">
          Product Description : Lorem ipsum dolor sit amet consectetur. Accumsan
          quis dui tellus quam id.
        </p>
      </div>
    </>
  );
};

export default TransactionSlip;
