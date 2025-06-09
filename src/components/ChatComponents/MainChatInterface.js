import React from "react";
import ImageThree from "../../images/MainChatInterfacImages/ImageThree.png";
import ImageOne from "../../images/MainChatInterfacImages/ImageOne.png";
import ImageTwo from "../../images/MainChatInterfacImages/ImageTwo.png";
import ImageFour from "../../images/MainChatInterfacImages/ImageFour.png";
import ImageFive from "../../images/MainChatInterfacImages/ImageFive.png";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdCall } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GiPaperClip } from "react-icons/gi";
import { BsMic } from "react-icons/bs";

const MainChatInterface = () => {
  return (
    <>
      <section className="row mt-5 gx-0  mx-5  justify-content-center ">
        {/* Section For All contact Starts */}
        <div className="col-3  bg-success  d-none  d-md-block d-lg-block mt-2  ">
          <div className=" d-flex BgColor p-2 ">
            <img className="col-2 ms-4  mt-2" src={ImageOne} alt="" />

            <h4 className="ms-5 mt-4 text-white fw-bold ">Chats</h4>
          </div>
          <div className="  p-2 mx-2 mt-3 ">
            <input
              type="text"
              placeholder="Search"
              className="form-control rounded-1  "
              id="exampleInputEmail1"
              aria-describedby="textHelp"
            />
          </div>
          {/* list of contact Section starts */}
          <ul className="  list-group list-group-flush mt-3 ">
            {/* first Contact Starts */}
            <li class="  bg-success list-group-item d-flex justify-content-between align-items-start text-white">
              <img src={ImageTwo} alt="" />
              <div class="ms-2 me-auto mt-4">
                <div class="fw-bold">Korode Wills</div>
                Content for list item
              </div>
              <span class="badge bg-danger rounded-pill mt-3">6</span>
            </li>
            {/* first Contact Ends */}

            {/* Second Contact Starts */}
            <li class="   ActiveChat  list-group-item d-flex justify-content-between align-items-start text-white   ">
              <img src={ImageThree} alt="" />
              <div class="ms-2 me-auto mt-4">
                <div class="fw-bold">Korode Wills</div>
                Content for list item
              </div>
              <span class="badge bg-danger rounded-pill mt-3">3</span>
            </li>
            {/* Second Contact Ends */}

            {/* ThridContact Starts */}
            <li class="  bg-success list-group-item d-flex justify-content-between align-items-start text-white   ">
              <img src={ImageFour} alt="" />
              <div class="ms-2 me-auto mt-4">
                <div class="fw-bold">Korode Wills</div>
                Content for list item
              </div>
              <span class="badge bg-danger rounded-pill mt-3">10</span>
            </li>
            {/* Third Contact Ends */}

            {/* Fourth Contact Starts */}
            <li class="  bg-success list-group-item d-flex justify-content-between align-items-start text-white   ">
              <img src={ImageFive} alt="" />
              <div class="ms-2 me-auto mt-4">
                <div class="fw-bold">Korode Wills</div>
                Content for list item
              </div>
              <span class="badge bg-danger rounded-pill mt-3">4</span>
            </li>
            {/* Fourth Contact Ends */}
          </ul>
          {/* list of contact Section Ends */}
        </div>
        {/* Section For All contact Ends */}

        {/* Parent Section For Screen  Starts */}

        <section className="col-8  col-sm-12 col-md-7 mt-2  ">
          {/* First Row starts */}
          <header className=" BgColorScreen  ">
            <div className="row  ">
              <span className="col-sm-3 ms-5">
                <img src={ImageThree} alt="" />
              </span>
              <div className="col mt-3 ">
                <h4 className="text-white fw-bolder   ">
                  Bessie Cooper <br></br>
                  <span className="fw-lighter">online</span>
                </h4>
              </div>
              {/* icon section */}
              <div className="d-flex justify-content-end col mt-4 me-3">
                <a href="">
                  <AiOutlineSearch
                    color="white"
                    size="27px"
                    className="me-3  "
                  />
                </a>
                <a href="">
                  <IoMdCall color="white" size="27px" className="me-3  " />
                </a>
                <a href="">
                  <BsThreeDotsVertical
                    color="white"
                    size="27px "
                    className="  "
                  />
                </a>
              </div>
            </div>
          </header>
          {/* First Row Ends */}

          {/* Second Row Starts*/}
          <div className=" ScreenBgColor ">
            <div className="row">
              <div className=" col-9 col-sm-6  col-md-5 ms-4 mt-3 bg-white p-3 ">
                <p className="mt-2 ">
                  Hi, we both know that this sapa is real and we want to japa.
                  <br></br>
                  <span className="fw-bold">MyDoshBox</span> has decided to help
                  you make that dream come true. refer a friend using your
                  unique referral code EXYOIV and get 3000 Naira off your next
                  transaction. this way you can save up quickly for that plane
                  ticket
                </p>
              </div>
            </div>
            <div className=" mt-5  d-flex justify-content-end mb-5 ">
              <p className="  col-5  col-sm-5 col-md-4 me-3 BgColor text-white p-3 text-end text-center mt-2  ">
                Wow! thanks so much....
              </p>
            </div>
            {/* input section Starts */}
            <footer className="   InputBgColor p-3  p-4">
              <div className=" row">
                <div className="col-1">
                  <GiPaperClip
                    className=" d-none d-md-block d-lg-block"
                    color="black"
                    size="35px  "
                  />
                </div>
                <div className="col-9 col-sm-12 col-md-9 ">
                  <input
                    className="rounded-3 "
                    type="text"
                    placeholder="Type Your Message"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                  />
                </div>
                <span className="col-2 d-none d-md-block d-lg-block">
                  <BsMic className="me-2 " color="black" size="35px  " />
                </span>
              </div>
            </footer>
            {/* input section Ends */}
          </div>
          {/* Second Row Ends*/}
        </section>

        {/* Parent Section For Screen  Ends */}
      </section>
    </>
  );
};
export default MainChatInterface;
