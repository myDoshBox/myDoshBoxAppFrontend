import React from "react";
import { useEffect, useState, useMemo } from "react";

const NextStepsSection = ({ transaction, userEmail }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getNextSteps = () => {
    const isBuyer = userEmail === transaction?.buyer_email;
    const isVendor = userEmail === transaction?.vendor_email;
    const status = transaction?.transaction_status;

    // Processing - Buyer initiated, awaiting seller confirmation
    if (
      status === "processing" &&
      transaction?.buyer_initiated &&
      !transaction?.seller_confirmed
    ) {
      if (isBuyer) {
        return {
          title: "Awaiting Vendor Confirmation",
          icon: "clock-history",
          color: "#ffc107",
          bgColor: "#fff3cd",
          steps: [
            "The vendor has been notified of your transaction request",
            "Please wait for the vendor to review and accept the transaction",
            "You will receive an email notification once the vendor responds",
            "You can cancel this transaction if needed",
          ],
        };
      }
      if (isVendor) {
        return {
          title: "Action Required: Confirm Transaction",
          icon: "hand-thumbs-up",
          color: "#006747EB",
          bgColor: "#d1e7dd",
          steps: [
            "Review the transaction details carefully",
            "Ensure you can fulfill this order as specified",
            'Click "Confirm Transaction" to accept, or "Decline" to reject',
            "The buyer will be notified of your decision immediately",
          ],
        };
      }
    }

    // Awaiting Payment - Seller confirmed, buyer needs to pay
    if (status === "awaiting_payment" && transaction?.seller_confirmed) {
      if (isBuyer) {
        return {
          title: "Payment Required",
          icon: "credit-card",
          color: "#dc3545",
          bgColor: "#f8d7da",
          steps: [
            "The vendor has accepted your transaction request",
            'Click the "Proceed to Payment" button to pay securely via Paystack',
            "Your payment will be held in escrow for protection",
            "You will be notified once payment is confirmed",
          ],
        };
      }
      if (isVendor) {
        return {
          title: "Awaiting Buyer Payment",
          icon: "clock-history",
          color: "#0dcaf0",
          bgColor: "#cff4fc",
          steps: [
            "You have successfully confirmed this transaction",
            "The buyer has been notified to proceed with payment",
            "Please wait for payment confirmation",
            "You will be notified to submit shipping details once payment is verified",
          ],
        };
      }
    }

    // Payment Verified - Awaiting shipping details
    if (
      status === "payment_verified" &&
      transaction?.verified_payment_status &&
      !transaction?.shipping_submitted
    ) {
      if (isVendor) {
        return {
          title: "Action Required: Submit Shipping Details",
          icon: "truck",
          color: "#006747EB",
          bgColor: "#d1e7dd",
          steps: [
            "Payment has been verified and held in escrow",
            'Click "Fill Shipping Details" to provide delivery information',
            "Include accurate shipping company and tracking details",
            "The buyer will be notified once you submit the information",
          ],
        };
      }
      if (isBuyer) {
        return {
          title: "Payment Confirmed - Awaiting Shipping details & Shipment",
          icon: "check-circle",
          color: "#198754",
          bgColor: "#d1e7dd",
          steps: [
            "Your payment has been successfully verified",
            "Funds are securely held in escrow",
            "The vendor will soon provide shipping details",
            "You will be notified when your item is shipped",
          ],
        };
      }
    }

    // In Transit - Package shipped
    if (status === "in_transit" && transaction?.shipping_submitted) {
      if (isBuyer) {
        return {
          title: "Package In Transit",
          icon: "box-seam",
          color: "#0d6efd",
          bgColor: "#cfe2ff",
          steps: [
            "Your item has been shipped and is on the way",
            "Check the shipping details section for tracking information",
            "Once you receive the product, inspect it carefully",
            'Click "Confirm Delivery" to release payment to the vendor',
          ],
        };
      }
      if (isVendor) {
        return {
          title: "Awaiting Delivery Confirmation",
          icon: "clock-history",
          color: "#0d6efd",
          bgColor: "#cfe2ff",
          steps: [
            "Shipping details have been submitted successfully",
            "The buyer has been notified about the shipment",
            "Please ensure timely delivery as per the shipping details",
            "Funds will be released once the buyer confirms receipt",
          ],
        };
      }
    }

    // Completed
    if (status === "completed") {
      return {
        title: "Transaction Completed",
        icon: "check-circle-fill",
        color: "#198754",
        bgColor: "#d1e7dd",
        steps: [
          "This transaction has been successfully completed",
          "Payment has been released to the vendor",
          "Thank you for using MyDoshBox Escrow",
          "You can download your transaction receipt",
        ],
      };
    }

    // In Dispute
    // if (
    //   transaction?.dispute_status !== "none" &&
    //   transaction?.dispute_status !== "resolved"
    // ) {
    //   return {
    //     title: "Transaction In Dispute",
    //     icon: "exclamation-triangle-fill",
    //     color: "#dc3545",
    //     bgColor: "#f8d7da",
    //     steps: [
    //       "This transaction is currently under dispute",
    //       'Click "View Dispute Details" to see the full dispute information',
    //       "Work with the other party to resolve the issue",
    //       "A mediator may be assigned if needed",
    //     ],
    //   };
    // }

    // Cancelled
    if (status === "cancelled") {
      return {
        title: "Transaction Cancelled",
        icon: "x-circle-fill",
        color: "#6c757d",
        bgColor: "#e2e3e5",
        steps: [
          "This transaction has been cancelled",
          "No further action is required",
          "If payment was made, refund will be processed",
          "Contact support if you have any questions",
        ],
      };
    }

    // Declined
    if (status === "declined") {
      return {
        title: "Transaction Declined",
        icon: "x-circle-fill",
        color: "#dc3545",
        bgColor: "#f8d7da",
        steps: [
          "This transaction was declined by the vendor",
          "You may contact the vendor for more information",
          "Consider creating a new transaction if needed",
          "No payment was processed",
        ],
      };
    }

    // Default fallback
    return {
      title: "Transaction Status",
      icon: "info-circle",
      color: "#6c757d",
      bgColor: "#e2e3e5",
      steps: [
        "Transaction is being processed",
        "Check back later for updates",
        "You will receive email notifications for any changes",
      ],
    };
  };

  const nextSteps = getNextSteps();

  return (
    <div
      className="p-2 rounded-3 mb-3"
      style={{
        backgroundColor: nextSteps.bgColor,
        border: ` ${nextSteps.color}`,
      }}
    >
      {/* Clickable header to toggle expand/collapse */}
      <div
        className="d-flex align-items-center gap-3 mb-3"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <i
          className={`bi bi-${nextSteps.icon}`}
          style={{
            fontSize: "2rem",
            color: nextSteps.color,
            flexShrink: 0,
          }}
        ></i>
        <h6
          className="mb-0 fw-bold"
          style={{
            fontSize: "1rem",
            color: nextSteps.color,
          }}
        >
          {nextSteps.title}
        </h6>
        {/* Expand/collapse icon */}
        <i
          className={`bi bi-chevron-${isExpanded ? "up" : "down"} ms-auto`}
          style={{
            color: nextSteps.color,
            fontSize: "1.2rem",
          }}
        ></i>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="ps-2">
          <ul className="mb-0" style={{ paddingLeft: "1.25rem" }}>
            {nextSteps.steps.map((step, index) => (
              <li
                key={index}
                className="mb-2"
                style={{
                  fontSize: "0.875rem",
                  color: "#1a1a1a",
                  lineHeight: "1.6",
                }}
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NextStepsSection;
