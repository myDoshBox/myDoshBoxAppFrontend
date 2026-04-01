// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useGetBankDetailsQuery } from "../../../src/redux/slices/profileSlice/profileAPISlice";

// const BankDetailsPromptModal = () => {
//   const navigate = useNavigate();
//   const [show, setShow] = useState(false);

//   const {
//     data: bankDetailsData,
//     isLoading,
//     isSuccess,
//   } = useGetBankDetailsQuery();

//   useEffect(() => {
//     if (!isSuccess) return;

//     const bankDetails = bankDetailsData?.data?.bank_details;
//     console.log(bankDetails, "current bank details");
//     const isMissing =
//       !bankDetails ||
//       !bankDetails.account_number ||
//       !bankDetails.bank_name ||
//       !bankDetails.account_name;

//     if (isMissing) {
//       setShow(true);
//     }
//   }, [isSuccess, bankDetailsData]);

//   if (isLoading || !show) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         style={{
//           position: "fixed",
//           inset: 0,
//           backgroundColor: "rgba(0,0,0,0.45)",
//           zIndex: 1050,
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           padding: "1rem",
//         }}
//       >
//         {/* Modal Card */}
//         <div
//           style={{
//             background: "var(--bs-white, #fff)",
//             borderRadius: "16px",
//             padding: "2rem",
//             width: "100%",
//             maxWidth: "420px",
//             boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
//           }}
//         >
//           {/* Icon */}
//           <div
//             style={{
//               width: 56,
//               height: 56,
//               borderRadius: "50%",
//               backgroundColor: "#E1F5EE",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto 1rem",
//             }}
//           >
//             <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
//               <rect
//                 x="2"
//                 y="6"
//                 width="20"
//                 height="13"
//                 rx="2"
//                 stroke="#1D9E75"
//                 strokeWidth="1.8"
//               />
//               <path d="M2 10H22" stroke="#1D9E75" strokeWidth="1.8" />
//               <path
//                 d="M6 14.5H10"
//                 stroke="#1D9E75"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//               />
//               <path
//                 d="M15 14.5H18"
//                 stroke="#1D9E75"
//                 strokeWidth="1.8"
//                 strokeLinecap="round"
//               />
//             </svg>
//           </div>

//           {/* Badge */}
//           <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
//             <span
//               style={{
//                 display: "inline-block",
//                 fontSize: 11,
//                 fontWeight: 500,
//                 padding: "3px 10px",
//                 borderRadius: 99,
//                 backgroundColor: "#FAEEDA",
//                 color: "#854F0B",
//               }}
//             >
//               Action required
//             </span>
//           </div>

//           <h5
//             style={{
//               fontWeight: 600,
//               textAlign: "center",
//               marginBottom: "0.5rem",
//               color: "#1E3A2F",
//             }}
//           >
//             Add your bank details
//           </h5>
//           <p
//             style={{
//               fontSize: 13,
//               textAlign: "center",
//               color: "#6B7280",
//               marginBottom: "1.5rem",
//               lineHeight: 1.6,
//             }}
//           >
//             Your account is active, but you need bank details to send and
//             receive payments on MyDoshBox.
//           </p>

//           {/* Steps */}
//           <div
//             style={{
//               backgroundColor: "#F9FAFB",
//               borderRadius: 10,
//               padding: "0.875rem 1rem",
//               marginBottom: "1.5rem",
//               display: "flex",
//               flexDirection: "column",
//               gap: 8,
//             }}
//           >
//             {[
//               "Select your Nigerian bank",
//               "Enter your account number",
//               "Verify & save",
//             ].map((step, i) => (
//               <div
//                 key={i}
//                 style={{ display: "flex", alignItems: "center", gap: 10 }}
//               >
//                 <span
//                   style={{
//                     width: 20,
//                     height: 20,
//                     borderRadius: "50%",
//                     backgroundColor: "#1D9E75",
//                     color: "#fff",
//                     fontSize: 11,
//                     fontWeight: 500,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     flexShrink: 0,
//                   }}
//                 >
//                   {i + 1}
//                 </span>
//                 <span style={{ fontSize: 13, color: "#6B7280" }}>{step}</span>
//               </div>
//             ))}
//           </div>

//           {/* CTA */}
//           <button
//             onClick={() => navigate("/userdashboard/settings/user/UpdateBank")}
//             style={{
//               width: "100%",
//               padding: "11px",
//               backgroundColor: "#1D9E75",
//               color: "#fff",
//               border: "none",
//               borderRadius: 10,
//               fontSize: 14,
//               fontWeight: 500,
//               cursor: "pointer",
//               marginBottom: "0.625rem",
//             }}
//           >
//             Update bank details
//           </button>

//           <button
//             onClick={() => setShow(false)}
//             style={{
//               width: "100%",
//               padding: "9px",
//               backgroundColor: "transparent",
//               color: "#6B7280",
//               border: "1px solid #E5E7EB",
//               borderRadius: 10,
//               fontSize: 13,
//               cursor: "pointer",
//             }}
//           >
//             Remind me later
//           </button>

//           <p
//             style={{
//               fontSize: 11,
//               textAlign: "center",
//               color: "#9CA3AF",
//               marginTop: "0.75rem",
//               marginBottom: 0,
//             }}
//           >
//             This reminder appears on every visit until your bank details are
//             saved.
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default BankDetailsPromptModal;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetBankDetailsQuery } from "../../../src/redux/slices/profileSlice/profileAPISlice";

const BankDetailsPromptModal = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const {
    data: bankDetailsData,
    isLoading,
    isSuccess,
    isFetching,
  } = useGetBankDetailsQuery(undefined, {
    refetchOnMountOrArgChange: true, // 👈 always re-fetches on mount/refresh
    refetchOnFocus: true, // 👈 re-fetches when tab regains focus
  });

  useEffect(() => {
    // Wait until we have a fresh response (not loading/fetching)
    if (!isSuccess || isFetching) return;

    const bankDetails = bankDetailsData?.data?.bank_details;

    const isMissing =
      !bankDetails ||
      !bankDetails.account_number ||
      !bankDetails.bank_name ||
      !bankDetails.account_name;

    // Always drive show from the live data — not from dismissed state
    setShow(isMissing);
  }, [isSuccess, isFetching, bankDetailsData]);

  if (isLoading || !show) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            background: "var(--bs-white, #fff)",
            borderRadius: "16px",
            padding: "2rem",
            width: "100%",
            maxWidth: "420px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: "#E1F5EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <rect
                x="2"
                y="6"
                width="20"
                height="13"
                rx="2"
                stroke="#1D9E75"
                strokeWidth="1.8"
              />
              <path d="M2 10H22" stroke="#1D9E75" strokeWidth="1.8" />
              <path
                d="M6 14.5H10"
                stroke="#1D9E75"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="M15 14.5H18"
                stroke="#1D9E75"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Badge */}
          <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 500,
                padding: "3px 10px",
                borderRadius: 99,
                backgroundColor: "#FAEEDA",
                color: "#854F0B",
              }}
            >
              Action required
            </span>
          </div>

          <h5
            style={{
              fontWeight: 600,
              textAlign: "center",
              marginBottom: "0.5rem",
              color: "#1E3A2F",
            }}
          >
            Add your bank details
          </h5>
          <p
            style={{
              fontSize: 13,
              textAlign: "center",
              color: "#6B7280",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Your account is active, but you need bank details to send and
            receive payments on MyDoshBox.
          </p>

          {/* Steps */}
          <div
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 10,
              padding: "0.875rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              "Select your Nigerian bank",
              "Enter your account number",
              "Verify & save",
            ].map((step, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    backgroundColor: "#1D9E75",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, color: "#6B7280" }}>{step}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate("/userdashboard/settings/user/UpdateBank")}
            style={{
              width: "100%",
              padding: "11px",
              backgroundColor: "#1D9E75",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              marginBottom: "0.625rem",
            }}
          >
            Update bank details
          </button>

          <button
            onClick={() => setShow(false)}
            style={{
              width: "100%",
              padding: "9px",
              backgroundColor: "transparent",
              color: "#6B7280",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Remind me later
          </button>
        </div>
      </div>
    </>
  );
};

export default BankDetailsPromptModal;
