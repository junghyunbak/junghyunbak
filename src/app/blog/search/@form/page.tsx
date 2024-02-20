"use client";

import { useState } from "react";
import Select, { SingleValue } from "react-select";
import { type Endpoints } from "@octokit/types";
import { useSearchParams, useRouter } from "next/navigation";

type SelectOption<Value extends string | undefined> = {
  value: Value;
  label: string;
};

type SearchOptionValue =
  | undefined
  | `in:${"title" | "body" | "comments" | "title,body"}`;

const searchOptions: SelectOption<SearchOptionValue>[] = [
  {
    value: undefined,
    label: "전체 (기본값)",
  },
  {
    value: "in:title",
    label: "제목",
  },
  {
    value: "in:title,body",
    label: "제목 & 내용",
  },
  {
    value: "in:body",
    label: "내용",
  },
  {
    value: "in:comments",
    label: "댓글",
  },
];

type SortOptionValue = Extract<
  Endpoints["GET /search/issues"]["parameters"]["sort"],
  "created" | "updated" | "comments"
>;

const sortOptions: SelectOption<SortOptionValue>[] = [
  {
    value: "created",
    label: "생성일 (기본값)",
  },
  {
    value: "updated",
    label: "수정일",
  },
  {
    value: "comments",
    label: "댓글",
  },
];

type OrderOptionValue = Endpoints["GET /search/issues"]["parameters"]["order"];

const orderOptions: SelectOption<OrderOptionValue>[] = [
  {
    value: "desc",
    label: "내림차순 (기본값)",
  },
  {
    value: "asc",
    label: "오름차순",
  },
];

export function IsSeacrhOptionValue(value: any): value is SearchOptionValue {
  const searchOptionValues: SearchOptionValue[] = [
    undefined,
    "in:body",
    "in:comments",
    "in:title",
    "in:title,body",
  ];

  return searchOptionValues.includes(value);
}

export function IsSortOptionValue(value: any): value is SortOptionValue {
  const sortOptionValues: SortOptionValue[] = [
    "comments",
    "created",
    "updated",
  ];

  return sortOptionValues.includes(value);
}

export function IsOrderOptionValue(value: any): value is OrderOptionValue {
  const orderOptionValues: OrderOptionValue[] = [undefined, "asc", "desc"];

  return orderOptionValues.includes(value);
}

export default function SearchForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchOptionParam = searchParams.get("search");
  const sortOptionParam = searchParams.get("sort");
  const orderOptionParam = searchParams.get("order");
  const keywordParam = searchParams.get("keyword");

  const [searchOption, setSearchOption] = useState<
    SingleValue<SelectOption<SearchOptionValue>>
  >(
    IsSeacrhOptionValue(searchOptionParam)
      ? {
          value: searchOptionParam,
          label:
            searchOptions.find((v) => v.value === searchOptionParam)?.label ||
            "",
        }
      : null
  );
  const [sortOption, setSortOption] = useState<
    SingleValue<SelectOption<SortOptionValue>>
  >(
    IsSortOptionValue(sortOptionParam)
      ? {
          value: sortOptionParam,
          label:
            sortOptions.find((v) => v.value === sortOptionParam)?.label || "",
        }
      : null
  );
  const [orderOption, setOrderOption] = useState<
    SingleValue<SelectOption<OrderOptionValue>>
  >(
    IsOrderOptionValue(orderOptionParam)
      ? {
          value: orderOptionParam,
          label:
            orderOptions.find((v) => v.value === orderOptionParam)?.label || "",
        }
      : null
  );

  const [searchKeyword, setSearchKeyword] = useState<string>(
    keywordParam || ""
  );

  const handleSearchButtonClick = () => {
    const queryString = [`keyword=${searchKeyword}`];

    if (searchOption) {
      queryString.push(`search=${searchOption.value}`);
    }

    if (sortOption) {
      queryString.push(`sort=${sortOption.value}`);
    }

    if (orderOption) {
      queryString.push(`order=${orderOption.value}`);
    }

    router.replace(`/blog/search?${queryString.join("&")}`);
  };

  return (
    <div className="flex flex-col gap-2.5 w-full p-5 border border-gray-300 rounded-sm mt-11 bg-g20">
      <div className="flex flex-wrap gap-2.5">
        <Select
          placeholder="-- 검색 기준 --"
          defaultValue={searchOption}
          onChange={setSearchOption}
          options={searchOptions}
          isSearchable={false}
        />
        <Select
          placeholder="-- 정렬 기준 --"
          defaultValue={sortOption}
          onChange={setSortOption}
          options={sortOptions}
          isSearchable={false}
        />
        <Select
          placeholder="-- 정렬 순서 --"
          defaultValue={orderOption}
          onChange={setOrderOption}
          options={orderOptions}
          isSearchable={false}
        />
      </div>

      <div className="flex gap-2.5 flex-wrap">
        <input
          type="text"
          placeholder="검색어 입력"
          className="flex-1 border border-gray-300 px-3.5 rounded h-[38px]"
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchButtonClick();
            }
          }}
          value={searchKeyword}
        />

        <div
          className="rounded bg-secondaryA px-3.5 h-[38px] flex justify-center items-center cursor-pointer"
          onClick={handleSearchButtonClick}
        >
          <p className="text-white">검색</p>
        </div>
      </div>
    </div>
  );
}
