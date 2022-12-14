import React from "react";
import { ScrollUpIcon } from "./IconComponent/NavigationAndViewIcon";
import { GeneralBtnStyle1Icon } from "./ButtonsComponent/Button";
import FooterLogo from "../images/FooterLogo.jpg";
import {
	InstagramIcon,
	LinkedinIcon,
	FacebookIcon,
	TwitterIcon,
	WhatsAppIcon,
} from "./IconComponent/SocialMediaIcons";

export const Footer = () => {
	return (
		<footer className="FooterBgColor mt-5">
			{/* Back to Top Icon Section starts  */}
			<div className="d-flex justify-content-end ">
				<GeneralBtnStyle1Icon righticon={<ScrollUpIcon />} />
			</div>
			{/* Back to Top Icon Section Ends */}
			{/* Footer Menu Section Starts  */}
			<nav className="ms-1 row text-white  mx-auto mt-3">
				<div className="col-lg-1 col-sm-12 col-md-6 ">
					<img src={FooterLogo} className=" w-75" alt="" />
				</div>
				<div className="col-lg-3 col-sm-12 col-md-6 d-flex mb-4 sm-ms-5">
					<div className="col-4 col-sm-6">
						<h6>The Project</h6>
						<ul className="fs-6 list-inline">
							<li>
								<a href="">Home</a>
							</li>
							<li>
								<a href="">About Us</a>
							</li>
							<li>
								<a href="">Services</a>
							</li>
							<li>
								<a href="">Pricing</a>
							</li>
						</ul>
					</div>
					<div className="col-7 col-sm-6">
						<h6>Support</h6>
						<ul className="fs-6 list-inline  text-white">
							<li>
								<a href="">Contact</a>
							</li>
							<li>
								<a href="">FAQ</a>
							</li>
							<li>
								<a href="">Terms Of Use</a>
							</li>
							<li>
								<a href="">Private Policy</a>
							</li>
							<li>
								<a href="">Customer Care</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="col-lg-4 col-md-6 col-sm-12 ">
					<h6 className="text-center">ADDRESS</h6>
					<p className="text-break text-white opacity-75">
						The 8thGear Space, 11b Colin Onabule Crescent, Diamond Estate Off
						CMD Road (beside Secretariat/Magodo gate) Lagos Nigeria
					</p>
				</div>
				<div className="col-lg-4 col-sm-12 col-md-6">
					<div className="row">
						<div class="input-group mb-3">
							<input
								type="text"
								className="form-control placeholder "
								placeholder="Enter email to receive updates and newsletter"
								aria-label="Subscribe"
								aria-describedby="basic-addon2"
							/>
							<span
								className="input-group-text btn border text-white "
								id="basic-addon2">
								SUBSCRIBE
							</span>
						</div>
					</div>
					<div className="row opacity-75">
						<h6>Connect With US</h6>
						{/* Social Medial Icon Sectin Starts */}
						<span className="mt-2 mb-5">
							<a
								href=""
								className="border border-white  rounded-circle p-2 me-2 ">
								<InstagramIcon />
							</a>
							<a
								href=""
								className="border border-white  rounded-circle p-2 me-2 ">
								<LinkedinIcon />
							</a>
							<a
								href=""
								className="border border-white  rounded-circle p-2 me-2">
								<FacebookIcon />
							</a>
							<a
								href=""
								className="border border-white  rounded-circle p-2 me-2 ">
								<TwitterIcon />
							</a>
							<a
								href=""
								className="border border-white  rounded-circle p-2 me-2 ">
								<WhatsAppIcon />
							</a>
						</span>
						{/* Social Medial Icon Sectin Ends */}
					</div>
				</div>
			</nav>
			{/* Footer Menu Section Ends  */}
		</footer>
	);
};
