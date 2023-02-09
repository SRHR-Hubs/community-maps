import { Trans } from "next-i18next";

const SkipToContent = ({ href = "#content" }) => (
  <a id="skip-to-content" href={href} className="toast">
    <Trans i18nKey="layout.skip-to-content">Skip to content</Trans>
  </a>
);

export default SkipToContent;
