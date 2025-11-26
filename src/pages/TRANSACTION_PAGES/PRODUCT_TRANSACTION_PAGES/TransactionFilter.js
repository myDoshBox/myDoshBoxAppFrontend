import { Badge } from "react-bootstrap";

export const TRANSACTION_FILTERS = {
  ALL: {
    status: "all",
    title: "All Transactions",
    filterFunction: (transactions) => transactions,
    emptyMessage: "No Transactions Yet",
    emptyDescription: "Start your first secure transaction with MyDoshBox",
    showCreateButton: true,
  },
  IN_PROGRESS: {
    status: "inProgress",
    title: "Transactions In Progress",
    filterFunction: (transactions) => {
      return transactions.filter(
        (transaction) =>
          transaction.transaction_status === "processing" ||
          transaction.transaction_status === "awaiting_payment" ||
          transaction.transaction_status === "payment_verified" ||
          transaction.transaction_status === "awaiting_shipping" ||
          transaction.transaction_status === "in_transit"
      );
    },
    emptyMessage: "No Transactions In Progress",
    emptyDescription: "All your transactions are either completed or cancelled",
    showCreateButton: true,
  },
  SETTLED: {
    status: "settled",
    title: "Settled Transactions",
    filterFunction: (transactions) => {
      return transactions.filter(
        (transaction) => transaction.transaction_status === "completed"
      );
    },
    emptyMessage: "No Settled Transactions",
    emptyDescription: "Completed transactions will appear here",
    showCreateButton: false,
  },
  CANCELLED: {
    status: "cancelled",
    title: "Cancelled Transactions",
    filterFunction: (transactions) => {
      return transactions.filter(
        (transaction) => transaction.transaction_status === "cancelled"
      );
    },
    emptyMessage: "No Cancelled Transactions",
    emptyDescription: "Cancelled transactions will appear here",
    showCreateButton: false,
  },
  SHIPPING: {
    status: "shipping",
    title: "Shipping Transactions",
    filterFunction: (transactions) => {
      return transactions.filter(
        (transaction) =>
          transaction.transaction_status === "awaiting_shipping" ||
          transaction.transaction_status === "in_transit"
      );
    },
    emptyMessage: "No Shipping Transactions",
    emptyDescription:
      "Transactions awaiting shipping or in transit will appear here",
    showCreateButton: false,
  },
};

// ========================================
// STATUS BADGE HELPER FUNCTIONS
// ========================================

export const getStatusBadge = (status) => {
  const statusConfig = {
    processing: {
      variant: "secondary",
      bg: "#6c757d",
      text: "Processing",
    },
    awaiting_payment: {
      variant: "warning",
      bg: "#ffc107",
      text: "Awaiting Payment",
    },
    payment_verified: {
      variant: "info",
      bg: "#0dcaf0",
      text: "Payment Verified",
    },
    awaiting_shipping: {
      variant: "warning",
      bg: "#ffc107",
      text: "Awaiting Shipping",
    },
    in_transit: {
      variant: "primary",
      bg: "#0d6efd",
      text: "In Transit",
    },
    completed: {
      variant: "success",
      bg: "#198754",
      text: "Completed",
    },
    cancelled: {
      variant: "danger",
      bg: "#dc3545",
      text: "Cancelled",
    },
    inDispute: {
      variant: "danger",
      bg: "#dc3545",
      text: "In Dispute",
    },
  };

  const config = statusConfig[status] || {
    variant: "secondary",
    bg: "#6c757d",
    text: status || "Unknown",
  };

  return (
    <Badge
      bg={config.variant}
      style={{
        fontSize: "0.75rem",
        fontWeight: "500",
        padding: "4px 8px",
      }}>
      {config.text}
    </Badge>
  );
};

export const getPaymentStatus = (transaction) => {
  if (transaction?.verified_payment_status) {
    return (
      <Badge
        bg="success"
        style={{
          fontSize: "0.75rem",
          fontWeight: "500",
          padding: "4px 8px",
        }}>
        Paid
      </Badge>
    );
  }
  if (transaction?.transaction_status === "awaiting_payment") {
    return (
      <Badge
        bg="warning"
        style={{
          fontSize: "0.75rem",
          fontWeight: "500",
          padding: "4px 8px",
        }}>
        Pending
      </Badge>
    );
  }
  return (
    <Badge
      bg="secondary"
      style={{
        fontSize: "0.75rem",
        fontWeight: "500",
        padding: "4px 8px",
      }}>
      Not Initiated
    </Badge>
  );
};

export const getDisplayStatus = (transaction) => {
  if (
    transaction?.transaction_status === "payment_verified" &&
    !transaction?.shipping_submitted
  ) {
    return "awaiting_shipping";
  }

  if (transaction?.dispute_status === "active") {
    return "inDispute";
  }

  return transaction?.transaction_status;
};

export const shouldShowPayButton = (transaction, userEmail) => {
  return (
    transaction?.transaction_status === "awaiting_payment" &&
    transaction?.buyer_email === userEmail &&
    !transaction?.verified_payment_status
  );
};
