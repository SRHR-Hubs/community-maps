import { Trans } from "next-i18next";

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
  </section>
);

export default ContactSection;
