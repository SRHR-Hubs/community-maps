const Header = ({show, ...props}) => (
    <header data-show={show}>
        <a href="#sidebar" className="off-canvas-toggle btn btn-link btn-action">
            <i className="icon icon-menu"></i>
        </a>
        <div id="sidebar" className="off-canvas-sidebar">

        </div>
        <a href="#close" className="off-canvas-overlay"></a>
        <div className="off-canvas-content"></div>
        Header!
    </header>
)

export default Header