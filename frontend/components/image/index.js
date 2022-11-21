import NextImage from 'next/image'

// TODO: proper typing

const Image = ({container, image}) => (
    <div className="image-container" {...container}><NextImage 
            className="image-component"
            fill
            placeholder='blur'
            {...image}
        /></div>
) 

export default Image