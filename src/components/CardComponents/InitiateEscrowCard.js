import BuyerIllustration from "../../images/BuyerIllustration.png";
import SellerIllustration from "../../images/SellerIlustration.png";
import { Button, Tab, Nav, Col, Row } from "react-bootstrap";
import { useState } from "react";

const InitiatingEscrowCard = () => {
  return (
    <>
      <div className="card initiating-escrow px-3 px-md-4 px-lg-5 py-2 py-md-3 py-lg-4 shadow border-0">
        {/* <p>Are you buying or selling</p> */}
        <Tab.Container id="left-tabs-example" defaultActiveKey="first">
          <Row>
            <Col sm={6}>
              <Nav className="justify-content-center" variant="pills">
                <Nav.Item className="mx-auto my-2">
                  <Nav.Link eventKey="first">
                    {" "}
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="Vector"
                        d="M10.7463 0.839844V5.20348H8.35821L13.1343 9.56712L17.9104 5.20348H15.5224V0.839844M0 3.02166V5.20348H2.38806L6.68657 13.4944L5.01492 16.1126C4.89552 16.4398 4.77612 16.7671 4.77612 17.2035C4.77612 18.4035 5.85075 19.3853 7.16418 19.3853H21.4925V17.2035H7.64179C7.52239 17.2035 7.40298 17.0944 7.40298 16.9853V16.8762L8.47761 15.0217H17.3134C18.1493 15.0217 18.9851 14.5853 19.3433 13.9308L24 6.29439L21.9701 5.20348L17.3134 12.8398H8.95522L3.9403 3.02166M7.16418 20.4762C5.85075 20.4762 4.77612 21.458 4.77612 22.658C4.77612 23.858 5.85075 24.8398 7.16418 24.8398C8.47761 24.8398 9.55224 23.858 9.55224 22.658C9.55224 21.458 8.47761 20.4762 7.16418 20.4762ZM19.1045 20.4762C17.791 20.4762 16.7164 21.458 16.7164 22.658C16.7164 23.858 17.791 24.8398 19.1045 24.8398C20.4179 24.8398 21.4925 23.858 21.4925 22.658C21.4925 21.458 20.4179 20.4762 19.1045 20.4762Z"
                        fill="white"
                      />
                    </svg>
                    <span className="ms-2">Buyer</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mx-auto my-2">
                  <Nav.Link eventKey="second">
                    {" "}
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        id="Vector"
                        d="M10.7463 0.839844V5.20348H8.35821L13.1343 9.56712L17.9104 5.20348H15.5224V0.839844M0 3.02166V5.20348H2.38806L6.68657 13.4944L5.01492 16.1126C4.89552 16.4398 4.77612 16.7671 4.77612 17.2035C4.77612 18.4035 5.85075 19.3853 7.16418 19.3853H21.4925V17.2035H7.64179C7.52239 17.2035 7.40298 17.0944 7.40298 16.9853V16.8762L8.47761 15.0217H17.3134C18.1493 15.0217 18.9851 14.5853 19.3433 13.9308L24 6.29439L21.9701 5.20348L17.3134 12.8398H8.95522L3.9403 3.02166M7.16418 20.4762C5.85075 20.4762 4.77612 21.458 4.77612 22.658C4.77612 23.858 5.85075 24.8398 7.16418 24.8398C8.47761 24.8398 9.55224 23.858 9.55224 22.658C9.55224 21.458 8.47761 20.4762 7.16418 20.4762ZM19.1045 20.4762C17.791 20.4762 16.7164 21.458 16.7164 22.658C16.7164 23.858 17.791 24.8398 19.1045 24.8398C20.4179 24.8398 21.4925 23.858 21.4925 22.658C21.4925 21.458 20.4179 20.4762 19.1045 20.4762Z"
                        fill="white"
                      />
                    </svg>
                    <span className="ms-2">Seller</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={6}>
              <Tab.Content className="escrow-left">
                <Tab.Pane eventKey="first">
                  <TabNumber type={"Buyers Page"} number={1} />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <TabNumber type={"Sellers Page"} number={2} />
                </Tab.Pane>
              </Tab.Content>
            </Col>
            <Col sm={12}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <BuyerEscrowCard />
                </Tab.Pane>
                <Tab.Pane eventKey="second">
                  <SellerEscrowCard />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </div>
    </>
  );
};

export const BuyerEscrowCard = () => {
  return (
    <>
      <div className="row new-escrow mx-auto">
        <div className="col-5">
          <img src={BuyerIllustration} alt="buyers card" />
        </div>
        <div className="col-7">
          <h3 style={{ color: "rgba(0, 103, 71, 0.92)" }}>BUYER TRANSACTION</h3>
          <p className="mb-4 w-75 small-head" style={{ color: "#2E2A40" }}>
            Yes of course, Are there problems with your job?
          </p>
          <p style={{ color: "color: rgba(0, 0, 0, 0.54)" }}>
            Lorem ipsum dolor sit amet consectetur. Id consequat quam turpis
            feugiat odio vitae elit in. In eu a mi risus volutpat vitae aliquet.
            Posuere sed porttitor nulla auctor arcu sit. Lacus cursus mollis
            venenatis et aliquam arcu. Egestas curabitur bibendum accumsan
            mauris vitae turpis semper pharetra. Non lorem semper amet purus
            massa convallis
          </p>
          <Button className="p-2 escrow-button">
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector"
                d="M10.7463 0.839844V5.20348H8.35821L13.1343 9.56712L17.9104 5.20348H15.5224V0.839844M0 3.02166V5.20348H2.38806L6.68657 13.4944L5.01492 16.1126C4.89552 16.4398 4.77612 16.7671 4.77612 17.2035C4.77612 18.4035 5.85075 19.3853 7.16418 19.3853H21.4925V17.2035H7.64179C7.52239 17.2035 7.40298 17.0944 7.40298 16.9853V16.8762L8.47761 15.0217H17.3134C18.1493 15.0217 18.9851 14.5853 19.3433 13.9308L24 6.29439L21.9701 5.20348L17.3134 12.8398H8.95522L3.9403 3.02166M7.16418 20.4762C5.85075 20.4762 4.77612 21.458 4.77612 22.658C4.77612 23.858 5.85075 24.8398 7.16418 24.8398C8.47761 24.8398 9.55224 23.858 9.55224 22.658C9.55224 21.458 8.47761 20.4762 7.16418 20.4762ZM19.1045 20.4762C17.791 20.4762 16.7164 21.458 16.7164 22.658C16.7164 23.858 17.791 24.8398 19.1045 24.8398C20.4179 24.8398 21.4925 23.858 21.4925 22.658C21.4925 21.458 20.4179 20.4762 19.1045 20.4762Z"
                fill="white"
              />
            </svg>
            <span className="ms-2">Buyer</span>
          </Button>
        </div>
      </div>
    </>
  );
};

export const SellerEscrowCard = () => {
  return (
    <>
      <div className="row new-escrow mx-auto">
        <div className="col-5">
          <img src={SellerIllustration} alt="buyers card" />
        </div>
        <div className="col-7">
          <h3 style={{ color: "rgba(0, 103, 71, 0.92)" }}>
            SELLER TRANSACTION
          </h3>
          <p className="mb-4 w-75 small-head" style={{ color: "#2E2A40" }}>
            Yes of course, Are there problems with your job?
          </p>
          <p style={{ color: "color: rgba(0, 0, 0, 0.54)" }}>
            Lorem ipsum dolor sit amet consectetur. Id consequat quam turpis
            feugiat odio vitae elit in. In eu a mi risus volutpat vitae aliquet.
            Posuere sed porttitor nulla auctor arcu sit. Lacus cursus mollis
            venenatis et aliquam arcu. Egestas curabitur bibendum accumsan
            mauris vitae turpis semper pharetra. Non lorem semper amet purus
            massa convallis
          </p>
          <Button className="p-2 escrow-button">
            <svg
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                id="Vector"
                d="M10.7463 0.839844V5.20348H8.35821L13.1343 9.56712L17.9104 5.20348H15.5224V0.839844M0 3.02166V5.20348H2.38806L6.68657 13.4944L5.01492 16.1126C4.89552 16.4398 4.77612 16.7671 4.77612 17.2035C4.77612 18.4035 5.85075 19.3853 7.16418 19.3853H21.4925V17.2035H7.64179C7.52239 17.2035 7.40298 17.0944 7.40298 16.9853V16.8762L8.47761 15.0217H17.3134C18.1493 15.0217 18.9851 14.5853 19.3433 13.9308L24 6.29439L21.9701 5.20348L17.3134 12.8398H8.95522L3.9403 3.02166M7.16418 20.4762C5.85075 20.4762 4.77612 21.458 4.77612 22.658C4.77612 23.858 5.85075 24.8398 7.16418 24.8398C8.47761 24.8398 9.55224 23.858 9.55224 22.658C9.55224 21.458 8.47761 20.4762 7.16418 20.4762ZM19.1045 20.4762C17.791 20.4762 16.7164 21.458 16.7164 22.658C16.7164 23.858 17.791 24.8398 19.1045 24.8398C20.4179 24.8398 21.4925 23.858 21.4925 22.658C21.4925 21.458 20.4179 20.4762 19.1045 20.4762Z"
                fill="white"
              />
            </svg>
            <span className="ms-2">Seller</span>
          </Button>
        </div>
      </div>
    </>
  );
};

const TabNumber = (props) => {
  const { type, number } = props;
  return (
    <div className="box">
      <div className="group-wrapper">
        <div className="group">
          <div className="div">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="vector"
            >
              <path
                d="M10.7463 0V4.36364H8.35821L13.1343 8.72727L17.9104 4.36364H15.5224V0M0 2.18182V4.36364H2.38806L6.68657 12.6545L5.01492 15.2727C4.89552 15.6 4.77612 15.9273 4.77612 16.3636C4.77612 17.5636 5.85075 18.5455 7.16418 18.5455H21.4925V16.3636H7.64179C7.52239 16.3636 7.40298 16.2545 7.40298 16.1455V16.0364L8.47761 14.1818H17.3134C18.1493 14.1818 18.9851 13.7455 19.3433 13.0909L24 5.45455L21.9701 4.36364L17.3134 12H8.95522L3.9403 2.18182M7.16418 19.6364C5.85075 19.6364 4.77612 20.6182 4.77612 21.8182C4.77612 23.0182 5.85075 24 7.16418 24C8.47761 24 9.55224 23.0182 9.55224 21.8182C9.55224 20.6182 8.47761 19.6364 7.16418 19.6364ZM19.1045 19.6364C17.791 19.6364 16.7164 20.6182 16.7164 21.8182C16.7164 23.0182 17.791 24 19.1045 24C20.4179 24 21.4925 23.0182 21.4925 21.8182C21.4925 20.6182 20.4179 19.6364 19.1045 19.6364Z"
                fill="#006747"
                fill-opacity="0.92"
              />
            </svg>
            <span className="text-wrapper">{type}</span>
          </div>
          <div className="overlap-group-wrapper">
            <div className="overlap-group">
              <p className="text-wrapper-2">{number}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiatingEscrowCard;
