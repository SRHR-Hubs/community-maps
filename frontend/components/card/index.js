import ImageComponent from "../image";
const Card = ({ children }) => <div className="card">{children}</div>;

const Image = (props) => (
  <div className="card-image">
    <ImageComponent {...props} />
  </div>
);

const Header = ({ title, subtitle }) => (
  <div className="card-header">
    <div className="card-title h5">{title}</div>
    {subtitle && <div className="card-subtitle text-gray">{subtitle}</div>}
  </div>
);

const Body = ({ children }) => <div className="card-body">{children}</div>;

const Footer = ({ children }) => <div className="card-footer">{children}</div>;

export default Card;

export { Image, Header, Body, Footer };
