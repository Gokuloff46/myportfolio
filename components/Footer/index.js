import React, { useState } from "react";
import Socials from "../Socials";
import Link from "next/link";
import Button from "../Button";
import FeedbackForm from "../FeedbackForm";
import data from "../../data/portfolio.json";

const Footer = ({}) => {
  const [showContact, setShowContact] = useState(false);
  // Find contact number from socials
  const contactSocial = data.socials.find((s) =>
    s.title.toLowerCase().includes("contact number")
  );
  const contactNumber = contactSocial
    ? contactSocial.link
    : data.contact?.phone
    ? `tel:${data.contact.phone}`
    : "#";

  return (
    <>
      <div className="mt-5 laptop:mt-40 p-2 laptop:p-0">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="flex-1 min-w-0 flex flex-col gap-0">
            <h1 className="text-2xl text-bold">Contact.</h1>
            <div className="flex flex-col md:flex-row md:items-center md:gap-8 mt-10">
              <div className="flex flex-col md:flex-row w-full">
                <div className="flex flex-col mr-8">
                  <span className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl text-bold whitespace-nowrap">
                    LET&apos;S WORK
                  </span>
                  <span className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl text-bold whitespace-nowrap">
                    TOGETHER
                  </span>
                  <a
                    href={contactNumber}
                    className="mt-3 mb-2 w-fit px-4 py-1 text-xs bg-black text-white rounded-lg hover:bg-blue-700 transition"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Contact Number
                  </a>
                </div>
                {/* FeedbackForm: right on desktop, bottom on mobile */}
                <div className="w-full md:max-w-xs md:w-[340px] flex-shrink-0 flex items-center ml-0 md:ml-24 mt-8 md:mt-0 order-2 md:order-none">
                  <FeedbackForm />
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Socials />
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-sm text-bold mt-2 laptop:mt-10 p-2 laptop:p-0">
        Made With ❤ by{" "}
        <Link href="/" legacyBehavior>
          <a className="underline underline-offset-1">KGR</a>
        </Link>
      </h1>
    </>
  );
};

export default Footer;
