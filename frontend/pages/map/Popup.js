import Link from "next/link"

const MapPopup = ({name, slug, description}) => {
    return (
        <div>
            <Link target="_blank" href={`/services/${slug}`}>
                <h3>{name}</h3>
                <p>{description}</p>
            </Link>
        </div>
    )
}
export default MapPopup