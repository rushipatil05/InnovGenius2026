import { useState } from "react";
import { close, logo, menu } from "../assets";
import { navLinks } from "../../constants";
import Button from "./Button";

interface NavbarProps {
  onSignupClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSignupClick }) => {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      
      <img
        src={logo}
        alt="HooBank Logo"
        className="w-[120px] h-[100px] object-contain"
      />

      {/* Desktop */}
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav) => (
          <li
            key={nav.id}
            className="font-poppins font-normal cursor-pointer text-[16px] mr-10 text-white hover:text-secondary transition duration-100"
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}

        <li className="ml-6">
          <Button
            text="Sign Up"
            className="py-2 px-5 text-[15px]"
            onClick={onSignupClick}
          />
        </li>
      </ul>

      {/* Mobile */}
      <div className="sm:hidden flex flex-1 justify-end items-center relative">
        <img
          src={toggle ? close : menu}
          alt="Menu"
          className="w-[28px] h-[28px] object-contain cursor-pointer"
          onClick={() => setToggle((prev) => !prev)}
        />

        <div
          className={`${
            toggle ? "flex" : "hidden"
          } p-6 bg-black-gradient absolute top-16 right-0 mx-4 my-2 min-w-[160px] rounded-xl sidebar`}
        >
          <ul className="list-none flex flex-col items-center flex-1">
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className="font-poppins font-normal cursor-pointer text-[16px] mb-4 text-white hover:text-secondary"
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}

            <li className="text-secondary">
              <span
                onClick={() => {
                  onSignupClick();
                  setToggle(false);
                }}
                className="cursor-pointer"
              >
                Sign Up
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;