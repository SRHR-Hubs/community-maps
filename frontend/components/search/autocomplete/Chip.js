const Chip = ({ children, showClose = false, handleClose, ...props }) => {
  return (
    <span className="chip" {...props}>
      {children}
      {showClose && (
        <a
          className="btn btn-clear"
          aria-label="Close"
          role="button"
          onClick={handleClose}
        ></a>
      )}
    </span>
  );
};
export default Chip;
