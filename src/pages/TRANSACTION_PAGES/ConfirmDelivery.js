// import { UserSidenav } from "../../components/NavbarComponents/SideNavbar";
import { DeliveryForm } from "../../components/FormComponents.js/TransactionForms";

export const SellerDeliveryForm = () => {
  return (
    <div className="d-flex w-100">
      {/* <div className="d-none d-lg-block">
        <UserSidenav />
      </div> */}
      <DeliveryForm
        heading={`Product Inspection and Shipping Form`}
        sub_value={`Sincerely acknowledge and confirm the condition of the product before it is shipped to the customer`}
        checkList={[
          {
            label:
              "Product description and condition have been accurately described",
          },
          { label: "Photos of the product have been included" },
          {
            label:
              "All key features have been checked and are in good working order",
          },
          {
            label:
              "I acknowledge that the product has no defect when being sent out for delivery",
          },
        ]}
      />
    </div>
  );
};

export const BuyerDeliveryForm = () => {
  return (
    <div className="d-flex w-100">
      {/* <div className="d-none d-lg-block">
        <UserSidenav />
      </div> */}
      <DeliveryForm
        heading={`Product Condition and Delivery Confirmation`}
        sub_value={`Sincerely acknowledge that you are satisfied with the goods
              delivered or service provided`}
        checkList={[
          {
            label:
              "Product description and condition have been accurately described",
          },
          { label: "Photos of the product have been included" },
          {
            label:
              "All key features have been checked and are in good working order",
          },
          {
            label:
            "The product is in the condition described by the seller",
          },
          {
            label:
              "I acknowledge that the product had no defect when it was delivered to me",
          },
        ]}
      />
    </div>
  );
};
