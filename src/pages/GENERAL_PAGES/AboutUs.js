import React from "react";
import Abouthero from "../../images/AboutUs Image/Abouthero.svg";
import mission from "../../images/AboutUs Image/mission.svg";
import Vision from "../../images/AboutUs Image/vision.svg";
import {
  CoreValueCard,
  TeamsCard,
} from "../../components/CardComponents/AboutUsCards";
import aboutusData from "../../data/aboutusData.json";

import { ReadMore } from "../../components/ButtonsComponent/NavigationAndViewButtons";
import cardimg from "../../images/Homepage Img/cardimg.svg";

const AboutUs = () => {
  return (
    <div>
      <HeroSection />
      <VisionMission />
      <CoreValueSection />
      <ProcessFlow />
      <TeamsSection />
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="container hero pt-5 mt-5 pb-5" id="BackTop">
      <div className="row mb-5">
        <div className="col-md-6 col-sm-12 col-lg-7 align-self-center">
          <h2 className="text-success fw-bold ">
            We're a team of creators & innovators
          </h2>
          <p className="fw-light col-10">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat
            modi ratione dolor sit, amet consectetur
          </p>
        </div>
        <div className="col-md-6 col-sm-12 col-lg-5">
          <img src={Abouthero} className="img-fluid" alt="" />
        </div>
      </div>
    </section>
  );
};

const VisionMission = () => {
  return (
    <section className="container pt-5 pb-5">
      <div className="text-center">
        <h3 className="fw-bold">Lorem ipsum dolor </h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi.
          Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,
          mattis ligula consectetur, Aliquam in hendrerit urna. Pellentesque sit
          amet sapien fringilla, mattis ligula consectetur,
        </p>
      </div>

      {/*  Mission section Starts */}
      <div className="row mt-5 pt-5 container pb-5">
        <div className="col-sm-12 col-md-6 col-lg-5">
          <img src={mission} alt="" />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 align-self-center text-sm-center text-xs-center text-md-start text-lg-start">
          <h4 className="fw-bold mb-2">Mission</h4>
          <p className=" fs-light">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo
            non, esse cum minus ab iure Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Explicabo non, esse cum minus ab iure.
          </p>
        </div>
      </div>
      {/* Mission section Ends */}
      {/* Vision section Starts */}
      <div className="row mt-3 mx-auto container">
        <div className="col-sm-12 col-md-6 col-lg-4 text-xs-center d-block d-sm-block d-md-none mb-3">
          <img src={Vision} alt="" />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 align-self-center text-sm-center text-md-start text-lg-start text-xs-center">
          <h4 className="fw-bold mb-2">Vision</h4>
          <p className=" fs-lighter">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo
            non, esse cum minus ab iure Lorem ipsum dolor sit amet, consectetur
            adipisicing elit. Explicabo non, esse cum minus ab iure.
          </p>
        </div>
        {/* Sm image Appear */}
        <div className="col-sm-12 col-md-6 col-lg-4 d-none d-md-block d-lg-block d-xl-block d-xxl-block ">
          <img src={Vision} alt="" />
        </div>
        {/* Sm image Appear */}
      </div>
      {/* Vision Card section Ends */}
    </section>
  );
};

const CoreValueSection = () => {
  return (
    <section className="container pt-5 pb-5">
      <div>
        <div>
          <h3 className="fw-bold mb-2">Core Values</h3>
          <p class="text-break fw-lighter">
            We reduce fraud between online buyers and sellers by providing a
            safe platform for them to transact without fear of being duped..
          </p>
        </div>

        <div className="container d-flex justify-content-between">
          <div className="row gy-4">
            {aboutusData.corevalues.map((corevalue) => {
              return (
                <div className="col-md-4 col-sm-12" key={corevalue.id}>
                  <CoreValueCard {...corevalue} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
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

const TeamsSection = () => {
  return (
    <section className="mt-5 pt-5 container d-flex flex-column align-items-center pb-5">
      <div className="">
        <h2 className="text-center fw-bold">TEAMS</h2>
        <div className="mb-3 row">
          <h4 className="mb-3 fw-bold">Founder Team</h4>
          {aboutusData.businessteam.map((busteam) => {
            return (
              <div
                className="col-lg-6 mx-auto col-md-auto mb-5"
                key={busteam.id}
              >
                <TeamsCard {...busteam} />
              </div>
            );
          })}
        </div>

        <div className="pt-5 row">
          <h4 className="mb-3 fw-bold">Brand and Content Team</h4>
          {aboutusData.marketing_team.map((busteam) => {
            return (
              <div
                className="col-lg-6 mx-auto col-md-auto mb-5"
                key={busteam.id}
              >
                <TeamsCard {...busteam} />
              </div>
            );
          })}
        </div>

        <div className="pt-5 row">
          <h4 className="mb-3 fw-bold">Developer Team</h4>
          {aboutusData.developers_team.map((busteam) => {
            return (
              <div className="col-lg-6 mx-auto mb-5 container" key={busteam.id}>
                <TeamsCard {...busteam} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
