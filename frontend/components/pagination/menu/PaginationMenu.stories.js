import PaginationMenu from "./PaginationMenu";
export default {
  component: PaginationMenu,
  args: {
    pathname: "#",
    totalPages: 10,
    page: 1,
  },
  argTypes: {
    page: {control: { type: 'range', min: 1, max: 10, step: 1 }}
  }
};
export const Default = {};
