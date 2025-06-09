import { UpdatePassword } from "../../components/FormComponents.js/UpdateForms";
import { UpdateProfile } from "../../components/FormComponents.js/UpdateForms";
export const NeutralSetting = () => {
  return (
    // <section className="container">
    //   <div className="col-lg-3 col-sm-12 px-0"></div>
    //   <div className="col-lg-9 col-sm-12">
    //     <div className="row">
    //       <div className="col-3 px-0">
    //         <p className="fw-bold text-dark">UPDATE PROFILE</p>
    //         <p className="fw-bold">UPDATE PASSWORD</p>
    //       </div>
    //       <div className="col-7 px-0 container">
    //         {/* First Card Section Starts */}

    //         <div className="mb-4">
    //           <UpdateProfile />
    //         </div>
    //         {/* First Card Section Ends */}
    //         {/* Second Card Section Starts */}
    //         <div>
    //           <UpdatePassword />
    //         </div>
    //         {/* Second Card Section Ends */}
    //       </div>
    //     </div>
    //   </div>
    // </section>
    <section className="row">
      <div className="col-lg-3 col-sm-12 px-0"></div>
      <div className="col-lg-9 col-sm-12">
        <div className="mt-4 ms-5">
          <div className="col-10">
            {/* First Card Section Starts */}
            <div className="mb-4 mt-3">
              <p className="fw-bold">UPDATE PROFILE</p>
              <UpdateProfile />
            </div>
            {/* First Card Section Ends */}
            {/* Second Card Section Starts */}
            <div>
              <p className="fw-bold">UPDATE PASSWORD</p>
              <UpdatePassword />
            </div>
            {/* Second Card Section Ends */}
          </div>
        </div>
      </div>
    </section>
  );
};
