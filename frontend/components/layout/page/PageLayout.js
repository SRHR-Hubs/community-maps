import useScrollDirection, { UP } from "../../../hooks/useScrollDirection";
import ContactSection from "../../sections/contact/ContactSection";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import SkipToContent from "../skip-to-content/SkipToContent";

/** Important notes for this file:
 * - Currently, page components merely *compose* this component,
 * i.e., wrapping their content in this layout.
 * NextJS also has support for a `getLayout` method, which apparently helps to maintain
 * state while navigating through the app in an SPA style.
 * We'll have to see if, e.g., users lose their state in forms when going between pages,
 * given how much of the site will end up static anyhow.
 */

//TODO: NextHead stuff
const PageLayout = ({
  renderHeader = true,
  renderFooter = true,
  renderContactSection = true,
  showHeader = true,
  showFooter = true,
  children,
  ...props
}) => {
  // If the user scrolls up, snap the header into view
  const scrollDirection = useScrollDirection();
  return (
    <>
      <SkipToContent />
      <div className="page" {...props}>
        {renderHeader && <Header show={showHeader && scrollDirection === UP} />}
        <main
          className="container grid-lg"
          role="main"
          id="content"
          tabIndex={-1}
        >
          {children}
          {renderContactSection && <ContactSection />}
        </main>
        {renderFooter && <Footer show={showFooter} />}
      </div>
    </>
  );
};

export default PageLayout;
