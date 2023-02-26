import Link from "next/link"

const MapPopup = ({name, slug, blurb}) => {
    return (
        <div>
            <Link target="_blank" prefetch={false} href={`/services/${slug}`}>
                <h3>{name}</h3>
                <p>{blurb}</p>
            </Link>
        </div>
    )
}
export default MapPopup