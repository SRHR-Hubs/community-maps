import Link from "next/link";

const PaginationMenu = ({ page, pathname, totalPages }) => {
  const prevEnabled = page > 1;
  const nextEnabled = page < totalPages;

  const nextPage = nextEnabled ? { page: page + 1 } : {};
  const prevPage = page > 2 ? { page: page - 1 } : {};

  const previousFew = [page - 1, page - 2, page - 3]
    .filter((p) => p >= 1)
    .reverse();
  const nextFew = [page + 1, page + 2, page + 3].filter((p) => p <= totalPages);
  return (
    <ul
      className="pagination"
      role="list"
      aria-label="Pagination button group"
      style={{
        width: "60%",
        justifyContent: "space-between",
        margin: "0 auto",
      }}
    >
      <li className={"page-item " + (!prevEnabled && "disabled")}>
        <Link scroll={false} href={{ pathname, query: prevPage }}>
          Previous
        </Link>
      </li>
      {page > 4 && (
        <>
          <li className="page-item">
            <Link
              scroll={false}
              href={{
                pathname,
                query: { page: 1 },
              }}
            >
              1
            </Link>
          </li>
          <li className="page-item">
            <span>...</span>
          </li>
        </>
      )}
      {previousFew.map((pg) => (
        <li className="page-item">
          <Link
            scroll={false}
            href={{
              pathname,
              query: { page: pg },
            }}
          >
            {pg}
          </Link>
        </li>
      ))}
      <li className="page-item active">
        <Link scroll={false} href="#">
          {page}
        </Link>
      </li>

      {nextFew.map((pg) => (
        <li className="page-item">
          <Link
            scroll={false}
            href={{
              pathname,
              query: { page: pg },
            }}
          >
            {pg}
          </Link>
        </li>
      ))}
      {page + 4 < totalPages && (
        <>
          <li className="page-item">
            <span>...</span>
          </li>
          <li className="page-item">
            <Link
              scroll={false}
              href={{
                pathname,
                query: { page: totalPages },
              }}
            >
              {totalPages}
            </Link>
          </li>
        </>
      )}
      <li className={"page-item " + (!nextEnabled && "disabled")}>
        <Link scroll={false} href={{ pathname, query: nextPage }}>
          Next
        </Link>
      </li>
    </ul>
  );
};

export default PaginationMenu;
