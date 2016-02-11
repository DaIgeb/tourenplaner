import React from 'react';

const doSort = (item1, item2, attribute) => {
  const item1Value = item1.hasOwnProperty(attribute) ? item1[attribute] : null;
  const item2Value = item2.hasOwnProperty(attribute) ? item2[attribute] : null;
  if (typeof item1Value === 'string') {
    return item1Value.localeCompare(item2Value);
  }

  if (item1Value > item2Value) {
    return 1;
  }
  if (item1Value < item2Value) {
    return -1;
  }

  return 0;
};

export function sort(itemsToSort, sortOrders) {
  sortOrders.forEach(sortOption => {
    itemsToSort.sort((item1, item2) => {
      if (sortOption.ascending) {
        return doSort(item1, item2, sortOption.column);
      }

      return -1 * doSort(item1, item2, sortOption.column);
    });
  });

  return itemsToSort;
}

export function renderSortDirection(name, sorting) {
  const sortOrder = sorting.find(item => item.column === name);
  if (sortOrder) {
    if (sortOrder.ascending) {
      return <i className="fa fa-sort-asc"/>;
    }

    return <i className="fa fa-sort-desc"/>;
  }

  return <i className="fa fa-sort"/>;
}
