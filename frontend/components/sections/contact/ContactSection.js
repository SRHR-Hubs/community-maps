import { Trans } from "next-i18next";
import Link from "next/link";

const jotforms = [
  {
    key: "add-service",
    link: "https://form.jotform.com/230260611235240",
  },
  {
    key: "request-changes",
    link: "https://form.jotform.com/230269168149260",
  },
  {
    key: "contact-us",
    link: "https://form.jotform.com/230395487928269",
  },
  {
    key: "website-feedback",
    link: "https://form.jotform.com/230271104656246",
  },
];

const ContactSection = () => (
  <section id="contact">
    <h2>
      <Trans i18nKey="pages.common.sections.contact.title">
        Let&apos;s get in touch.
      </Trans>
    </h2>
    <p>
      <Trans i18nKey="pages.common.sections.contact.content">
        Have any thoughts, comments or suggestions? Know of any services that
        should be listed on the SRHR Hubs Community Map?
        <br />
        Don&apos;t hesitate to reach out. We&apos;d love to hear from you!
      </Trans>
    </p>
    <div className="columns button-list">
      {jotforms.map(({ key, link }) => (
        <div className="column col-auto" key={key}>
          <Link href={link} target="_blank">
            <button className="btn btn-secondary">
              <Trans i18nKey={`common.sections.contact.form-button.${key}`} />
            </button>
          </Link>
        </div>
      ))}
    </div>
  </section>
);

export default ContactSection;
