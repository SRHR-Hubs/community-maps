import { useRouter } from "next/router";
import { Trans } from "next-i18next";

const GetOutQuick = () => {
  const router = useRouter();
  const handleClick = () => {
    router.replace("https://en.wikipedia.org/wiki/Special:Random");
  };
  return (
    <button className="btn get-out-quick" onClick={handleClick}>
      <Trans i18nKey="layout.get-out-quick">Get out quick</Trans>
    </button>
  );
};
export default GetOutQuick