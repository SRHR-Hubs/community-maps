import { Trans } from "next-i18next";
import Link from "next/link";
import FORMS from "../../../config/forms";

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
      {Object.keys(FORMS).map((key) => (
        <div className="column col-6 col-xs-12" key={key}>
          {/* IMPORTANT!
            Using <Link> here causes the Cognito script
            to only load once, making the same form render
            on every contact page if you use these buttons
            to navigate between them consecutively.
            It's stupid, but a known issue:
            https://github.com/vercel/next.js/discussions/17919
          */}
          <a href={`/contact/${key}`} className="btn btn-secondary">
            {/* <button className="btn btn-secondary"> */}
              <Trans
                i18nKey={`pages.common.sections.contact.form-button.${key}`}
              />
            {/* </button> */}
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default ContactSection;
