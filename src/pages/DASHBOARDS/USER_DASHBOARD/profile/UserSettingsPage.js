import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BigLogoutIcon,
  ChangeBankIcon,
  ContactUsIcon,
  FaqIcon,
  FeedbackIcon,
  UpdateProfileIcon,
} from "../../../../components/IconComponent/UserdashboardIcons";
import { UserDashboardCard } from "../../../../components/CardComponents/UsersCards";
import { MiniProfileCardSettings } from "../../../../components/CardComponents/MiniProfileCardSettings";
import { UserDashboardNavbar } from "../../../../components/NavbarComponents/TopNavbars";

const UserSettingsPage = () => {
  return (
    <div
      className="container-fluid px-0"
      style={{ backgroundColor: "#F9F9FB", minHeight: "100vh" }}>
      <div className="row g-0">
        <div className="col-12">
          <UserDashboardNavbar />
          <div className="px-3 px-lg-4 py-2">
            <SettingsPage />
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Redirect to home/login page
    navigate("/");
  };

  return (
    <div className="row mt-5 mb-5">
      {/* Left Column - Profile Information Card */}
      <div className="col-lg-5 col-sm-12 mb-4 mb-lg-0">
        <MiniProfileCardSettings />
      </div>

      {/* Right Column - Action Cards Grid */}
      <div className="col-lg-7 col-sm-12">
        {/* Row 1: Profile & Bank Updates */}
        <div className="row mb-3">
          <div className="col-sm-12 col-lg-6 mb-3">
            <UserDashboardCard
              icon={<UpdateProfileIcon />}
              text="Update Profile"
              link="user/updateprofile"
            />
          </div>
          <div className="col-sm-12 col-lg-6 mb-3">
            <UserDashboardCard
              icon={<ChangeBankIcon />}
              text="Update Bank Details"
              link="user/UpdateBank"
            />
          </div>
        </div>

        {/* Row 2: Support Options */}
        <div className="row mb-3">
          <div className="col-sm-12 col-lg-6 mb-3">
            <UserDashboardCard
              icon={<FeedbackIcon />}
              text="Report App Defect"
              link="../reportissues"
            />
          </div>
          <div className="col-sm-12 col-lg-6 mb-3">
            <UserDashboardCard
              icon={<ContactUsIcon />}
              text="Contact Us"
              link="/contactus"
            />
          </div>
        </div>

        {/* Row 3: Help & Logout */}
        <div className="row">
          <div className="col-sm-12 col-lg-6 mb-3">
            <UserDashboardCard icon={<FaqIcon />} text="FAQs" link="/faqs" />
          </div>
          <div className="col-sm-12 col-lg-6 mb-3">
            <div onClick={handleLogout} style={{ cursor: "pointer" }}>
              <UserDashboardCard icon={<BigLogoutIcon />} text="Logout" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;
