import React from "react";
import heroimg from "../../images/Homepage Img/heroimg.png";
import buyerImg from "../../images/Homepage Img/buyerImg.svg";
import sellerimg from "../../images/Homepage Img/sellerimg.svg";
import cardimg from "../../images/Homepage Img/cardimg.svg";
import ourfeatures from "../../images/Homepage Img/ourfeatures.svg";
import trust from "../../images/Homepage Img/trust.svg";
import support from "../../images/Homepage Img/support.svg";
import secured from "../../images/Homepage Img/secured.svg";
import { Link } from "react-router-dom";
import { StartTransaction } from "../../components/ButtonsComponent/TransactionButtons";
import { ReadMore } from "../../components/ButtonsComponent/NavigationAndViewButtons";
import {
  GetStarted,
  LearnMoreButton,
} from "../../components/ButtonsComponent/NavigationAndViewButtons";
const Homepage = () => {
  return (
    <div>
      {/* <NavBar /> */}
      <HeroSection />
      <HowItWorks />
      <ProcessFlow />
      <WhyChooseUs />
      <OurFeatures />
    </div>
  );
};

const HeroSection = () => {
  return (
    <header className="mb-5 pt-4 heroColor">
      <section className="container pt-5 mt-5 pb-5" id="BackTop">
        <div className="row mb-5 text-center text-lg-start">
          <div className="col-md-6 col-sm-12 col-lg-7 align-self-center">
            <h1 className="fw-bold">Better Way To Trasact</h1>
            <p className="fw-light">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat
              modi ratione dolor sit, amet consectetur
            </p>
            <Link to="/signup">
              <StartTransaction />
            </Link>
          </div>
          <div className="col-md-6 col-sm-12 col-lg-5">
            <img src={heroimg} className="img-fluid" alt="" />
          </div>
        </div>
      </section>
    </header>
  );
};

const HowItWorks = () => {
  return (
    <section className="pt-5 pb-5">
      <div className="text-center">
        <h2>How It Works</h2>
        <p>
          We reduce fraud between online buyers and sellers by providing a safe
          platform for them to transact without fear of being duped..
        </p>
      </div>
      {/* buyers scection starts */}
      <div className="mt-5 container mx-auto">
        <div className="row mb-5">
          <div className="col-lg-6 col-sm-12 col-md-6 mb-3">
            <img src={buyerImg} className="" alt="" />
          </div>
          <div
            className="col-lg-6 col-sm-12 col-md-6 align-self-center text-sm-center text-xs-center text-md-start text-lg-start
          "
          >
            <h2>Are you a buyer</h2>
            <p className="fw-lighter">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos fuga dolore corporis eius, nesciunt harum obcaecati
              facilis inventore laborum. Numquam fugiat, aut deserunt
              perspiciatis vitae in obcaecati.
            </p>
            <Link to="/signup">
              <StartTransaction />
            </Link>
          </div>
        </div>

        {/* buyers scection Ends */}

        {/* Sellers scection Ends */}

        <div className="row pt-5">
          <div className="col-lg-6 col-sm-12 col-md-6 mb-3 d-block d-sm-block d-md-block d-lg-none d-xl-none">
            <img src={sellerimg} className="" alt="" />
          </div>
          <div
            className="col-lg-6 col-sm-12 col-md-6 align-self-center text-sm-center text-xs-center text-md-start text-lg-end
          "
          >
            <h2>Are you a seller</h2>
            <p className="fw-lighter">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos fuga dolore corporis eius, nesciunt harum obcaecati
              facilis inventore laborum. Numquam fugiat, aut deserunt
              perspiciatis vitae in obcaecati.
            </p>
            <Link to="/signup">
              <StartTransaction />
            </Link>
          </div>
          <div className="col-lg-6 col-sm-12 mb-3 d-none d-lg-block d-xl-block">
            <img src={sellerimg} className="" alt="" />
          </div>
        </div>
      </div>
      {/* sellers scection starts */}
    </section>
  );
};

const ProcessFlow = () => {
  return (
    <section>
      {/* visible on  Medium and large screen sectin Starts */}
      <div className="overflow-hidden pt-5 mt-5 d-none d-md-block d-lg-block d-xxl-block d-xl-block">
        <div className="row gx-0 bgColor">
          <div className="col-lg-6 col-md-6 col-sm-12 align-self-center mx-auto container">
            <h3 className="mb-2 text-white text-nowrap">
              We Like to make it easy
            </h3>
            <p className=" mb-3 text-white text-break text-wrap fw-lighter">
              Every month, we shine a spotlight on one saver, asking them
              questions about their savings culture and how the product is
              specifically helping them shape how they spend and save
            </p>

            <span>
              <ReadMore />
            </span>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <img
              src={cardimg}
              class="img-fluid object-fit-none"
              alt="..."
            ></img>
          </div>
        </div>
      </div>
      {/* visible on  Medium and large screen section Ends */}

      {/* visible on Small screen section Starts*/}
      <div className="overflow-hidden d-lg-none d-xl-none d-xxxl-none d-md-none d-block">
        <div className="row gy-0 gx-0">
          <div className="col-sm-12">
            <img
              src={cardimg}
              class="object-fit-none h-100 object-fit-scale object-fit-cover"
              alt="..."
            ></img>
          </div>
          <div className="col-sm-12 p-5 align-self-center mx-auto bgColor h-100">
            <h3 className="mb-4 text-white h3">We Like to make it easy</h3>
            <p className=" mb-4 text-white text-break">
              Every month, we shine a spotlight on one saver, asking them
              questions about their savings culture and how the product is
              specifically helping them shape how they spend and save for future
              responsibilities. Lorem ipsum dolor sit amet consectetur
            </p>

            <span>
              <ReadMore />
            </span>
          </div>
        </div>
      </div>
      {/* visible on Small screen section Ends */}
    </section>
  );
};

const WhyChooseUs = () => {
  return (
    <section className="pt-5 mt-5 pb-5 BgColor">
      <div className="mx-auto p-5">
        {/* first card section starts */}
        <div className="row">
          <div className="col-lg-4 col-md-12 col-sm-12 align-self-center">
            <h3>
              Why Should You use <span className="text-success">MyDoshBox</span>
              ?
            </h3>
            <p>
              We reduce fraud between online buyers and sellers by providing a
              safe platform for them to transact without fear of being duped
              providing a safe platform for.
            </p>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12 mb-2">
            <div class="card cardBgColor border-0 ">
              <div class="card-body p-5 mt-2">
                <span className="cardNumberbg p-3 rounded-2 textColor fw-bolder float-right">
                  01
                </span>
                <div className="mt-4">
                  <h5 class="card-title mb-2 text-body-secondary">
                    As A Seller
                  </h5>
                  <p class="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12">
            <div class="card cardBgColor border-0 ">
              <div class="card-body p-5 mt-2">
                <span className="cardNumberbg p-3 rounded-2 textColor fw-bolder float-right">
                  02
                </span>
                <div className="mt-4">
                  <h5 class="card-title mb-2 text-body-secondary">
                    As A Seller
                  </h5>
                  <p class="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* first card section ends */}
        {/* second card section starts */}
        <div className="mt-3">
          <div className="row">
            <div className="col-lg-4 col-md-12 col-sm-12 mb-2">
              <div class="card cardBgColor border-0 ">
                <div class="card-body p-5 mt-2">
                  <span className="cardNumberbg p-3 rounded-2 textColor fw-bolder float-right">
                    03
                  </span>
                  <div className="mt-4">
                    <h5 class="card-title mb-2 text-body-secondary">
                      As A Seller
                    </h5>
                    <p class="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12">
              <div class="card cardBgColor border-0 ">
                <div class="card-body p-5 mt-2">
                  <span className="cardNumberbg p-3 rounded-2 textColor fw-bolder float-right">
                    04
                  </span>
                  <div className="mt-4">
                    <h5 class="card-title mb-2 text-body-secondary">
                      As A Seller
                    </h5>
                    <p class="card-text">
                      Some quick example text to build on the card title and
                      make up the bulk of the card's content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* second card section ends */}
      </div>
    </section>
  );
};

const OurFeatures = () => {
  return (
    <section className="bgColorSection mb-5 pb-5 mt-4">
      <div className="p-5">
        <div className="row gx-5">
          <div className="col-lg-5 mt-5">
            <h6 className="text-success mb-3">Our Awesome Features</h6>
            <h4 className="mb-3">We made it superb & usability</h4>
            <p className="text-dark fs-6 text-wrap text-break ">
              Indignation and dislike men who are so beguiled and deed by the
              charms of pleasure of the moment, so blinded by desir that they
              cannot foresee
            </p>
            <img src={ourfeatures} alt="" />
          </div>
          <div className="col-lg-7 mt-5">
            {/* First Section Starts */}
            <div className="row mt-sm-4 mb-3">
              <div className="col-lg-2">
                <img src={trust} alt="" />
              </div>
              <div className="col-lg-10">
                <h4> blinded by desir that they cannot foresee the pain </h4>
                <p>
                  Indignation and dislike men who are so beguiled and deed by
                  the charms of pleasure of the moment, so blinded by desir that
                  they cannot foresee the pain and trouble
                </p>
              </div>
            </div>
            {/* First Section Ends */}
            {/* second Section Starts */}
            <div className="row mt-sm-4 mb-3">
              <div className="col-lg-2">
                <img src={support} className="mb-sm-4" alt="" />
              </div>
              <div className="col-lg-10">
                <h4> blinded by desir that they cannot foresee the pain </h4>
                <p>
                  Indignation and dislike men who are so beguiled and deed by
                  the charms of pleasure of the moment, so blinded by desir that
                  they cannot foresee the pain and trouble
                </p>
              </div>
            </div>
            {/* second Section Ends */}
            {/* third Section Starts */}
            <div className="row mt-sm-4">
              <div className="col-lg-2 mb-sm-3 ">
                <img src={secured} alt="" />
              </div>
              <div className="col-lg-10 mt-sm-3">
                <h4> blinded by desir that they cannot foresee the pain </h4>
                <p>
                  Indignation and dislike men who are so beguiled and deed by
                  the charms of pleasure of the moment, so blinded by desir that
                  they cannot foresee the pain and trouble
                </p>
              </div>
            </div>
            {/* third Section Ends */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
