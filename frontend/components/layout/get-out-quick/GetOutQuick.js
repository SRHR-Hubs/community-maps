import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next";

const GetOutQuick = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const handleClick = () => {
    router.replace(t('layout.get-out-quick.destination', 'https://www.cbc.ca/news'));
  };

  t('layout.get-out-quick')
  return (
    <button className="btn get-out-quick" onClick={handleClick}>
      <Trans i18nKey="layout.get-out-quick.button">Get out quick</Trans>
    </button>
  );
};
export default GetOutQuick