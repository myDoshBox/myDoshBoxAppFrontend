import React from "react";
import Pricing_Data from "../../data/dummyData/pricingpage.json";

const PricingPage = () => {
  return (
    <div className="mt-4">
      <div className="px-md-5 px-2">
        <div className="text-start">
          <h4>Low Fees</h4>
          <p className="text-wrap">
            The low cost of our secure auto escrow service is either paid by the
            Buyer, the Seller, or shared between them.
          </p>
        </div>
        {/* table Section starts */}
        <section>
          <table className="table table-bordered border-white pricing-table">
            <thead>
              <tr className="BgColor">
                <th className="text-white p-3 text-center">
                  Transaction Amount
                </th>
                <th className="text-white p-3 text-center">Doshbox Fess</th>
              </tr>
            </thead>
            <tbody>
              {Pricing_Data.pricing_data.map((prices) => {
                return <PricingTable {...prices} />;
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

const PricingTable = (props) => {
  const { transaction_amount, charges } = props;

  return (
    <tr>
      <td className="p-3 text-center">{transaction_amount}</td>
      <td className="p-3 text-center">{charges}</td>
    </tr>
  );
};

export default PricingPage;
