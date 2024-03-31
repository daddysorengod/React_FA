import { AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG } from "./BaseWithHeaderAutocomplete";

export function getMatchCount(sumStr: string, searchString: string) {
  const mergedString = sumStr;
  let matchCount = 0;

  let wordsArray = searchString.split(" ");

  // for (const char of searchString) {
  //   if (mergedString.includes(char)) {
  //     matchCount++;
  //     mergedString.replace(char, ""); // Loại bỏ kí tự đã được tìm thấy
  //   }
  // }

  for (let i = 0; i < wordsArray.length; i++) {
    if (mergedString.includes(wordsArray[i])) {
      matchCount++;
      mergedString.replace(wordsArray[i], "");
    }
  }

  // return matchCount;
  return { matchCount, wordsArrayLength: wordsArray.length };
}

export function searchAndSortObjects(
  list: any[],
  columnConfigs: AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG[],
  searchString: string,
  keepAll?: boolean,
): any[] {
  if (!searchString) return list;
  const searchResults: any[] = [];

  // Tìm kiếm các object có thuộc tính name hoặc address chứa searchString
  for (const obj of list) {
    let sumStr = "";
    columnConfigs.forEach(column => {
      sumStr += obj[column.key] + " - ";
    });

    sumStr = sumStr.substring(0, sumStr.length - 3);

    const res = getMatchCount(
      sumStr.toLocaleLowerCase(),
      searchString.toLocaleLowerCase(),
    );
    // if (keepAll) {
    //   searchResults.push({
    //     obj,
    //     matchCount: matchCount,
    //   });
    // } else {
    //   const percent = (matchCount / searchString.length) * 100;
    //   if (percent > 80) {
    //     searchResults.push({
    //       obj,
    //       matchCount: matchCount,
    //     });
    //   }
    // }

    if (keepAll) {
      searchResults.push({
        obj,
        matchCount: res.matchCount,
      });
    } else {
      if (res.matchCount === res.wordsArrayLength) {
        searchResults.push({
          obj,
          matchCount: res.matchCount,
        });
      }
    }
  }

  searchResults.sort((a, b) => b.matchCount - a.matchCount);
  const result = [...searchResults.map(result => result.obj)];
  return result;
}

export const FilterByString = (
  listData: any[],
  searchString: string,
  columnConfigs: AUTOCOMPLETE_WITH_HEADER_COLUMN_CONFIG[],
): any[] => {
  const searchResults: any[] = [];

  for (const item of listData) {
    for (const column of columnConfigs) {
      if (
        item?.[column.key]?.toLowerCase()?.includes(searchString.toLowerCase())
      ) {
        searchResults.push(item);
        break;
      }
    }
  }
  return searchResults;
};
