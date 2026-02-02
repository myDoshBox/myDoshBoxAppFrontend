import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ScrollUpIcon } from "./IconComponent/NavigationAndViewIcon";
import Logo from "../images/Homepage Img/logo.png";
import {
  InstagramIcon,
  LinkedinIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "./IconComponent/SocialMediaIcons";
import { SubscribeForm } from "../components/FormComponents.js/ContactForms";
import { useRef } from "react";

// const Footer = () => {
// const disappearEl = useRef(null);

// const handleDisappear = () => {
//   disappearEl.style.display = "none";
// };
// const location = useLocation();
// const [showFooter, setShowFooter] = useState(false);
// useEffect(() => {
//   const paths = ["/", "/aboutus", "/contactus", "/pricingpage", "/faqs"];
//   if (paths.includes(location.pathname)) {
//     setShowFooter(true);
//   } else {
//     setShowFooter(false);
//   }
// }, [location.pathname]);
// return showFooter ? (

//     <footer className="FooterBgColor mt-5 pb-5">
//       {/* Back to Top  icon Starts */}
//       <div className="d-flex justify-content-end pt-3 me-3">
//         <a href="#BackTop">
//           <ScrollUpIcon />
//         </a>
//       </div>
//       {/* Back to Top  icon Ends */}
//       <section className="p-5">
//         <div className="row">
//           <div className="col-sm-12 col-md-4 col-lg-3 ">
//             {/* image section starts */}
//             <img src={Logo} className="mb-3" alt="Logo" />
//             {/* image section Ends */}
//             <span className="pb-3">
//               <div className="mb-3">
//                 <i class="bi bi-telephone-plus-fill opacity-75 me-2"></i>+ (234)
//                 9032166042
//               </div>
//               <div>
//                 <i class="bi bi-envelope-fill opacity-75 me-2"></i>
//                 Info@mydoshbox.com
//               </div>
//             </span>
//             {/* Social media section Starts */}
//             <div className="opacity-75 mt-3 hstack gap-2">
//               <a href="" className="p-2">
//                 <InstagramIcon />
//               </a>
//               <a href="" className="p-2">
//                 <LinkedinIcon />
//               </a>
//               <a href="" className="p-2">
//                 <FacebookIcon />
//               </a>
//               <a href="" className="p-2">
//                 <TwitterIcon />
//               </a>
//               <a href="" className="p-2">
//                 <WhatsAppIcon />
//               </a>
//             </div>
//             {/* Social media section Ends */}
//           </div>

//           {/* Menu Section starts */}
//           <div className="col-sm-12 col-md-8 col-lg-4  mx-auto">
//             <div className="row">
//               <div className="col">
//                 <h5 className="text-black opacity-75">The Project</h5>
//                 <span class="nav flex-column">
//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to="/"
//                     className="nav-item text-black opacity-75 p-2"
//                   >
//                     Home
//                   </Link>

//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to="/aboutus"
//                     className="text-black opacity-75 nav-item p-2"
//                   >
//                     About
//                   </Link>

//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to=".."
//                     className="text-black opacity-75 nav-item link p-2"
//                   >
//                     Service
//                   </Link>

//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to="/pricingpage"
//                     className="text-black opacity-75 nav-item p-2"
//                   >
//                     Pricing
//                   </Link>

//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to="/contactus"
//                     className="text-black opacity-75 p-2 nav-item"
//                   >
//                     Contact
//                   </Link>
//                 </span>
//               </div>
//               <div className="col g-3">
//                 <h5 className="text-black opacity-75">Support</h5>
//                 <ul class="nav flex-column ">
//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to="/faqs"
//                     className="text-black opacity-75 p-2
//                   nav-item"
//                   >
//                     FAQ
//                   </Link>

//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to=".."
//                     className="text-black opacity-75 p-2 nav-item"
//                   >
//                     Terms of Use
//                   </Link>

//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to=".."
//                     className="text-black opacity-75 p-2 nav-item"
//                   >
//                     Private Policy
//                   </Link>

//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to=".."
//                     className="text-black opacity-75 p-2 nav-item"
//                   >
//                     Customer Care
//                   </Link>

//                   <Link
//                     onClick={handleDisappear}
//                     style={{ textDecoration: "none" }}
//                     to="/contactus"
//                     className="text-black opacity-75 p-2 nav-item"
//                   >
//                     Testimonial
//                   </Link>
//                 </ul>
//               </div>
//             </div>
//           </div>
//           {/* Menu Section Ends */}

//           {/* Address section starts */}
//           <div className="col-sm-12 col-md-12 col-lg-5">
//             <div className="row">
//               <h5 className="text-center text-black opacity-75 mb-2">
//                 ADDRESS
//               </h5>
//               <span className="text-break opacity-75 mb-2 fw-lighter fs-6 ">
//                 The 8thGear Space, 11b Colin Onabule Crescent, Diamond Estate
//                 Off CMD Road (beside Secretariat/Magodo gate) Lagos Nigeria
//               </span>
//             </div>
//             <div className="row">
//               <span className="mt-3">
//                 <SubscribeForm />
//               </span>
//               <div className="mt-3">
//                 <h6 className="mb-3 text-black opacity-75">Connect With US</h6>
//               </div>
//             </div>
//             {/* Address section Ends */}
//           </div>
//         </div>
//       </section>
//     </footer>
//   ) : null;
// };

const Footer = () => {
  const disappearEl = useRef(null);

  const handleDisappear = () => {
    disappearEl.style.display = "none";
  };
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(false);
  useEffect(() => {
    const paths = ["/", "/aboutus", "/contactus", "/pricingpage", "/faqs"];
    if (paths.includes(location.pathname)) {
      setShowFooter(true);
    } else {
      setShowFooter(false);
    }
  }, [location.pathname]);
  return showFooter ? (
    <footer className="FooterBgColor pt-5">
      <section className="p-4 ms-5">
        {/* Back to Top icon Starts */}
        <div className="justify-content-end d-flex">
          <a href="#BackTop">
            <ScrollUpIcon />
          </a>
        </div>
        {/* Back to Top  icon Ends */}

        {/* Newspaper Section Starts */}
        <div></div>
        <hr />
        {/* Newspaper Section Ends */}
        {/* Main menu Section Starts */}
        <div className="row p-2">
          {/* first Section Starts */}
          <div className="col-lg-3 col-sm-12 col-md-6 mt-5">
            <span className="">
              <img src={Logo} alt="" />
            </span>
            <div className="p-2 mt-2">
              <span className="">
                <div className="mb-4">
                  <i class="bi bi-telephone-plus-fill opacity-75 me-2"></i>+
                  (234) 9032166042
                </div>

                <div>
                  <i class="bi bi-envelope-fill opacity-75 me-2"></i>
                  Info@mydoshbox.com
                </div>
              </span>
            </div>
          </div>
          {/* first Section Ends */}
          {/* Second Section Starts */}
          {/* Menu Section Starts */}
          <div className="col-lg-4 col-sm-12 col-md-6 mt-5">
            <div className="row">
              <div className="col">
                <h5 className="text-black opacity-75">The Project</h5>
                <span class="nav flex-column">
                  <Link
                    onClick={handleDisappear}
                    style={{ textDecoration: "none" }}
                    to="/"
                    className="nav-item text-black opacity-75 p-2"
                  >
                    Home
                  </Link>

                  <Link
                    onClick={handleDisappear}
                    style={{ textDecoration: "none" }}
                    to="/aboutus"
                    className="text-black opacity-75 nav-item p-2"
                  >
                    About
                  </Link>

                  <Link
                    onClick={handleDisappear}
                    style={{ textDecoration: "none" }}
                    to=".."
                    className="text-black opacity-75 nav-item link p-2"
                  >
                    Service
                  </Link>

                  <Link
                    onClick={handleDisappear}
                    style={{ textDecoration: "none" }}
                    to="/pricingpage"
                    className="text-black opacity-75 nav-item p-2"
                  >
                    Pricing
                  </Link>

                  <Link
                    onClick={handleDisappear}
                    style={{ textDecoration: "none" }}
                    to="/contactus"
                    className="text-black opacity-75 p-2 nav-item"
                  >
                    Contact
                  </Link>
                </span>
              </div>
              <div className="col">
                <span className="col">
                  <h5 className="text-black opacity-75">Support</h5>
                  <ul class="nav flex-column ">
                    <Link
                      onClick={handleDisappear}
                      style={{ textDecoration: "none" }}
                      to="/faqs"
                      className="text-black opacity-75 p-2
                   nav-item"
                    >
                      FAQ
                    </Link>

                    <Link
                      onClick={handleDisappear}
                      style={{ textDecoration: "none" }}
                      to=".."
                      className="text-black opacity-75 p-2 nav-item"
                    >
                      Terms of Use
                    </Link>

                    <Link
                      onClick={handleDisappear}
                      style={{ textDecoration: "none" }}
                      to=".."
                      className="text-black opacity-75 p-2 nav-item"
                    >
                      Private Policy
                    </Link>

                    <Link
                      onClick={handleDisappear}
                      style={{ textDecoration: "none" }}
                      to=".."
                      className="text-black opacity-75 p-2 nav-item"
                    >
                      Customer Care
                    </Link>

                    <Link
                      onClick={handleDisappear}
                      style={{ textDecoration: "none" }}
                      to="/contactus"
                      className="text-black opacity-75 p-2 nav-item"
                    >
                      Testimonial
                    </Link>
                  </ul>
                </span>
              </div>
            </div>
          </div>
          {/* Menu Section Ends */}
          {/* Second Section Ends */}
          {/* Thrid Section Starts */}
          {/* Address Section Starts */}
          <div className="col-lg-5 col-sm-12 col-md-12 mt-5">
            <div className="text-sm-center text-xs-center text-md-center text-lg-start">
              <h5 className="text-black opacity-75 mb-2">ADDRESS</h5>
              <p className="text-break opacity-75 mb-2 fw-lighter lh-lg ">
                The 8thGear Space, 11b Colin Onabule Crescent, Diamond Estate
                Off CMD Road (beside Secretariat/Magodo gate) Lagos Nigeria
              </p>
            </div>
            {/* Social media section Starts */}
            <div className="p-2 mt-3">
              <h5>Connect with us</h5>
              <div className="opacity-75 hstack gap-3">
                <a href="" className="p-2">
                  <InstagramIcon />
                </a>

                <a href="" className="p-2">
                  <LinkedinIcon />
                </a>

                <a href="" className="p-2">
                  <FacebookIcon />
                </a>

                <a href="" className="p-2">
                  <TwitterIcon />
                </a>

                <a href="" className="p-2">
                  <WhatsAppIcon />
                </a>
              </div>
            </div>
            {/* Social media section Ends */}
          </div>
          {/* Address Section Ends */}
          {/* Thrid Section Ends */}
        </div>
        {/* Main menu Section Ends */}
        <div className="mt-5 text-center">
          <p> &copy; Copyright 2023.All right reserved. </p>
        </div>
      </section>
    </footer>
  ) : null;
};

export default Footer;
