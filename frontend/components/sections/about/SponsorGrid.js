import { useTranslation } from "next-i18next";
import toImageProps from "../../../hooks/toImageProps";
import Image from "../../image";

const SponsorGrid = ({ sponsorImages }) => {
  const { t } = useTranslation();

  return (
    <div className="columns">
      {Object.entries(sponsorImages).map(([sponsor, { name, imageData }]) => {
        const key = `sponsor-${sponsor}`;
        const i18nKeyPrefix = `pages.home.sections.our-sponsors.${key}`;
        const translatedName = t(`${i18nKeyPrefix}.name`, name);

        const alt = `Sponsor: ${translatedName}`;
        const imageProps = toImageProps({
          ...imageData,
          alt,
        });
        return (
          <figure className="column col-auto col-sm-12" id={key} key={key}>
            <Image {...imageProps} />
          </figure>
        );
      })}
    </div>
  );
};

export default SponsorGrid;
