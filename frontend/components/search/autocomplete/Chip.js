const Chip = ({ children, handleClose, ...props }) => {
  return (
    <div className="chip" {...props}>
      {children}
      {handleClose && (
        <a
          href="#"
          className="btn btn-clear"
          aria-label="Close"
          role="button"
          onClick={handleClose}
        ></a>
      )}
    </div>
  );
};
export default Chip;
