import React, { useState } from "react";
import faqData from "../../data/dummyData/faqData.json";

const FAQs = () => {
  const [activeAccordion, setActiveAccordion] = useState("");

  const handleAccordionClick = (id) => {
    if (activeAccordion === id) {
      setActiveAccordion("");
    } else {
      setActiveAccordion(id);
    }
  };

  return (
    <>
      {faqData.faqs.map((faq) => (
        <div className="FAQs row justify-content-center gy-5 mx-3 mt-3">
          <h6 className="fs-6 text-white text-center py-3 mb-0 faqs-header">
            {faq.header}
          </h6>
          {faq.accordions.map((accordion) => (
            <div
              class="accordion accordion-flush mt-0 px-0"
              id="accordionFlushExample"
            >
              <div
                class={`accordion-item border  ${
                  activeAccordion === accordion.id ? "" : "border-top-0"
                }`}
              >
                <h2
                  class={`accordion-header ${
                    activeAccordion === accordion.id ? "accordion-head" : ""
                  }`}
                  id={`flush-heading${accordion.id}`}
                >
                  <button
                    class={`accordion-button accordion-title ${
                      activeAccordion === accordion.id ? "" : "collapsed"
                    }`}
                    type="button"
                    onClick={() => handleAccordionClick(accordion.id)}
                    aria-expanded={
                      activeAccordion === accordion.id ? "true" : "false"
                    }
                    aria-controls={`flush-collapse${accordion.id}`}
                  >
                    {accordion.title}
                  </button>
                </h2>
                <div
                  id={`flush-collapse${accordion.id}`}
                  class={`accordion-collapse collapse ${
                    activeAccordion === accordion.id ? "show" : ""
                  }`}
                  aria-labelledby={`flush-heading${accordion.id}`}
                  data-bs-parent="#accordionFlushExample"
                >
                  <div class="accordion-body opacity-50">
                    {accordion.details}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default FAQs;
