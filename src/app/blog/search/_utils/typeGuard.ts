export function isSeacrhOptionValue(value: any): value is SearchOptionValue {
  const searchOptionValues: SearchOptionValue[] = [
    undefined,
    "in:body",
    "in:comments",
    "in:title",
    "in:title,body",
  ];

  return searchOptionValues.includes(value);
}

export function isSortOptionValue(value: any): value is SortOptionValue {
  const sortOptionValues: SortOptionValue[] = [
    "comments",
    "created",
    "updated",
  ];

  return sortOptionValues.includes(value);
}

export function isOrderOptionValue(value: any): value is OrderOptionValue {
  const orderOptionValues: OrderOptionValue[] = [undefined, "asc", "desc"];

  return orderOptionValues.includes(value);
}
