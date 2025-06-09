// WhyChooseUsCard

// export const WhyChooseUsCard = (props) => {
//   const { image, title, description } = props;
//   return (
//     <div className="container p-2">
//       <div className="pt-3">
//         <img src={image} alt="" className="mx-auto" />
//       </div>
//       <div className="pt-4">
//         <h5 className="text-center">{title}</h5>
//         <p className="text-center">{description}</p>
//       </div>
//     </div>
//   );
// };
export const WhyChooseUsCard1 = (props) => {
  const { title, numbers, description } = props;
  return (
    <div class="card cardBgColor border-0 " style={{ width: "25%" }}>
      <div class="card-body p-5 mt-2">
        <span className="cardNumberbg p-3 rounded-2 textColor fw-bolder float-right">
          {numbers}
        </span>
        <div className="mt-4">
          <h5 class="card-title mb-2 text-body-secondary">{title}</h5>
          <p class="card-text">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const OurProcessFlow = ({ image, title }) => {
  return (
    <div className="p-5">
      <div>
        <div className="pb-3">
          <img src={image} className="mx-auto" alt="..." />
        </div>
        <div className="text-center">{title}</div>
      </div>
    </div>
  );
};
