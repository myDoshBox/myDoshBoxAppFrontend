import { GeneratedTicketCard } from "../../components/CardComponents/TicketCard";
import TicketData from "../../data/TicketData.json";
import { UserDashboardNavbar } from "../../components/NavbarComponents/TopNavbars";

export const GeneratedTicket = () => {
  return (
    <>
      <div className="contestPage">
        <div className="row">
          <div className="col-lg-3 col-sm-12"></div>

          <div className="col-lg-9 col-sm-12">
            <UserDashboardNavbar />
            <div className="mt-5">
              <TicketDatas />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const TicketDatas = () => {
  return (
    <section className="d-flex">
      <div className="align-self-center mx-auto p-4">
        {TicketData.Ticket1.map((ticket) => {
          return (
            <div key={ticket.id}>
              <GeneratedTicketCard {...ticket} />
            </div>
          );
        })}
      </div>
    </section>
  );
};
