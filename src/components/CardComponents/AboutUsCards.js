import React from "react";

// CoreValueCard
export const CoreValueCard = (props) => {
  const { title, number, description, numbers } = props;
  return (
    <div class="cardBgColor border-1 ">
      <div class="card-body p-5 mt-2">
        <span className="cardNumberbg p-3 rounded-2 textColor fw-bolder float-right ">
          {number}
        </span>
        <div className="mt-4">
          <h5 class="card-title mb-2 text-body-secondary">{title}</h5>
          <p class="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const TeamsCard = (props) => {
  const { name, job_description, description, images } = props;
  return (
    <div className=" container-fluid">
      <div class="shadow-sm border-0 rounded-3 pt-1">
        <div class="col teamValueStyle p-3 rounded-2">
          <div class="card h-100 border-0 teamValueStyle">
            <img src={images} class="card-img-top 75" alt="..." />
            <div class="card-body">
              <p class="card-text text-center">{description}</p>
            </div>
          </div>
          <div className="align-self-end p-3 text-end">
            <h5 className="card-title">{name}</h5>
            <span className="text-muted text-end">{job_description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// export const TeamsCard = (props) => {
//   const { name, job_description, description, images } = props;
//   return (
//     <div className=" container-fluid">
//       <div class="shadow-sm border-0 rounded-3 pt-1" style={{ width: "85%" }}>
//         <div class="col teamValueStyle p-3 rounded-2">
//           <div class="card h-100 border-0 teamValueStyle">
//             <img src={images} class="card-img-top 75" alt="..." />
//             <div class="card-body">
//               <p class="card-text text-center">{description}</p>
//             </div>
//           </div>
//           <div class="align-self-end p-3 text-end">
//             <h5 class="card-title">{name}</h5>
//             <span class="text-muted text-end">{job_description}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
