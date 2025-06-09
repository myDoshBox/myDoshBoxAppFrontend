import { UserSidenav } from "../../components/NavbarComponents/SideNavbar";
import { OtherTicket } from "../../components/CardComponents/TicketCard";
import TicketData from "../../data/TicketData.json";

export const SellersGeneratedContestTicket = () => {
  return (
    <section className="d-flex">
      {/* side Bar Section Starts */}
      <div>{/* <UserSidenav /> */}</div>
      {/* side Bar Section Ends*/}
      <div className="align-self-center mx-auto p-4">
        {TicketData.Ticket3.map((ticket) => {
          return (
            <div key={ticket.id}>
              <OtherTicket {...ticket} />
            </div>
          );
        })}
      </div>
    </section>
  );
};
