import * as Card from "../card";

const BlogCard = ({ title, subtitle, description }) => (
  <Card.default>
    <Card.Header {...{ title, subtitle }} />
    <Card.Body>{description}</Card.Body>
  </Card.default>
);

export default BlogCard;
