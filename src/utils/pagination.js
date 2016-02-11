import React from 'react';

const renderPagination = (current, size, numberOfPages, selectPage) => {
  const renderPrevious = () => {
    if (current === 0) {
      return (<li className="disabled">
                  <span>
                    <span aria-hidden="true">&laquo;</span>
                  </span>
        </li>
      );
    }

    return (
      <li>
        <a href="#" aria-label="Previous" onClick={() => selectPage(current - 1)}>
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    );
  };
  const renderNext = () => {
    if (current >= numberOfPages - 1) {
      return (<li className="disabled">
                  <span>
                    <span aria-hidden="true">&raquo;</span>
                  </span>
        </li>
      );
    }

    return (
      <li>
        <a href="#" aria-label="Next" onClick={() => selectPage(current + 1)}>
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    );
  };
  return (<nav>
    <ul className="pagination">
      {renderPrevious()}
      {Array
        .apply(null, {length: numberOfPages})
        .map(Number.call, Number)
        .map(number => {
          if (current === number) {
            return (
              <li key={number} className="active">
                <span>{number + 1} <span className="sr-only">(current)</span></span>
              </li>
            );
          }

          return <li key={number}><a href="#" onClick={() => selectPage(number)}>{number + 1}</a></li>;
        })}
      {renderNext()}
    </ul>
  </nav>);
};

export function renderPagedContent(current, size, numberOfPages, selectPage, renderContent) {
  return (
    <div>
      {renderPagination(current, size, numberOfPages, selectPage)}
      {renderContent()}
      {renderPagination(current, size, numberOfPages, selectPage)}
    </div>
  );
}
