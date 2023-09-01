import Link from "next/link";
import { forwardRef } from "react";

const MapPopup = ({ feature }, ref) => {
  return (
    <div className="popup" ref={ref}>
      {feature && (
        <Link
          target="_blank"
          prefetch={false}
          href={`/services/${feature.slug}`}
        >
          <h3>{feature.name}</h3>
          <p>{feature.blurb}</p>
        </Link>
      )}
    </div>
  );
};
export default forwardRef(MapPopup);
