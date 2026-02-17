import { clients } from "../../constants";
import styles from "../../styles";

/* =========================
   Types
========================= */

interface Client {
  id: string;
  logo: string;
}

const Clients = () => {
  return (
    <section className={`${styles.flexCenter} my-4`}>
      <div className={`${styles.flexCenter} flex-wrap w-full`}>
        {clients.map((client: Client, i: number) => (
          <div
            key={client.id}
            className={`flex-1 ${styles.flexCenter} sm:min-w-[192px] min-w-[120px]`}
          >
            {/* Client Logo */}
            <img
              src={client.logo}
              alt={`client-${i + 1}`}
              className="sm:w-[192px] w-[100px] object-contain hover:brightness-0 hover:invert transition ease-in-out duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clients;