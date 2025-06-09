import { UserSidenav } from "../../components/NavbarComponents/SideNavbar";
// import { CustomBtn } from "../../components/ButtonsComponent/GenandAuthBtn";
import { CautionIcon } from "../../components/IconComponent/UserdashboardIcons";
import { Cancel } from "../../components/IconComponent/NeutralsDashboardIcons";

export const NeutalsInvolvementNotification = () => {
  return (
    <section className="d-flex">
      {/* side Bar Section Starts */}
      <div>
        <UserSidenav />
      </div>
      {/* side Bar Section Ends*/}

      <div
        class=" align-self-center mx-auto alert alert-danger d-flex align-items-center p-5 border-start border-danger border-0 border-3 rounded-0"
        role="alert"
        style={{ width: "50rem" }}
      >
        <div className="d-flex mb-4 p-4 mt-4">
          <span className="">
            {/* <CustomBtn righticon={<CautionIcon />} /> */}
          </span>
          <div>
            <p>
              <span className="fw-bold">Note:</span> Your current conflict has
              not been able to be resolved, Neutrals have been involved to
              resolve the conflict
            </p>
          </div>
        </div>
        {/* <div className="align-self-end">
          <CustomBtn
            value="Proceed"
            styles=" GeneralBtnStyle1 btn all-btn text-white rounded-1"
          />
        </div> */}
      </div>
    </section>
  );
};
