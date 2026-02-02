import React from "react";
import Pricing_Data from "../../data/dummyData/pricingpage.json";

const PricingPage = () => {
  const mainColor = "rgb(77, 149, 127)";
  const lightGreen = "rgba(77, 149, 127, 0.1)";
  const hoverGreen = "rgba(77, 149, 127, 0.15)";

  return (
    <div className="container py-5 px-3 px-md-5">
      {/* Page Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: mainColor }}>
          Our Transparent Pricing
        </h2>
        <p className="text-muted fs-5">
          Low escrow fees designed to protect both buyers and sellers.
        </p>
        <hr
          style={{
            borderTop: `3px solid ${mainColor}`,
            width: "60px",
            margin: "0 auto",
          }}
        />
      </div>

      {/* Table for medium and larger screens */}
      <div className="d-none d-md-block shadow rounded-4 overflow-hidden">
        <table className="table table-hover mb-0">
          <thead style={{ backgroundColor: mainColor }}>
            <tr>
              <th className="text-white text-center py-4 fs-6">
                Transaction Amount
              </th>
              <th className="text-white text-center py-4 fs-6">
                Doshbox Fees <i className="bi bi-info-circle" data-bs-toggle="tooltip" title="These are escrow processing fees." />
              </th>
            </tr>
          </thead>
          <tbody>
            {Pricing_Data.pricing_data.map((item, index) => (
              <tr
                key={index}
                className="text-center align-middle"
                style={{
                  backgroundColor: index % 2 === 0 ? "#fff" : lightGreen,
                  transition: "background-color 0.2s ease-in-out",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = hoverGreen)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    index % 2 === 0 ? "#fff" : lightGreen)
                }
              >
                <td className="py-4 fw-semibold">{item.transaction_amount}</td>
                <td className="py-4 fw-semibold">
                  {item.charges}{" "}
                  <span className="badge bg-success ms-2">Flat</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Collapsible cards for small screens */}
      <div className="d-md-none mt-4">
        {Pricing_Data.pricing_data.map((item, idx) => (
          <div
            key={idx}
            className="card mb-3 border-0 shadow-sm"
            style={{ backgroundColor: lightGreen }}
          >
            <div className="card-body">
              <h6 className="card-title text-muted">Transaction Amount</h6>
              <p className="card-text fw-semibold">{item.transaction_amount}</p>

              <h6 className="card-title text-muted mt-3">Doshbox Fee</h6>
              <p className="card-text fw-semibold">
                {item.charges}{" "}
                <span className="badge bg-success ms-2">Flat</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};;


export default PricingPage;
