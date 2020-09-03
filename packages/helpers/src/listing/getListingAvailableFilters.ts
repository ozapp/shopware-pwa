import { UiCategoryFilter, UiCategoryFilterType } from "../ui-interfaces";
import {
  Aggregations,
  AggregationFilterEntityOption,
} from "@shopware-pwa/commons/interfaces/search/Aggregations";

const getFilterType = (aggregation: any) => {
  if (aggregation.entities && Array.isArray(aggregation.entities)) {
    return UiCategoryFilterType.entity;
  }

  if (aggregation.min && aggregation.max) {
    return UiCategoryFilterType.range;
  }

  if (aggregation.max && !aggregation.min) {
    return UiCategoryFilterType.max;
  }

  throw new Error("Unrecognized type");
};

/**
 * TODO: https://github.com/DivanteLtd/shopware-pwa/issues/841
 * TODO: https://github.com/DivanteLtd/shopware-pwa/issues/840
 */

const extractEntityTypeFilter = (
  name: string,
  options: AggregationFilterEntityOption[]
) => ({
  name,
  type: UiCategoryFilterType.entity,
  options: options.map((filterData: AggregationFilterEntityOption) => ({
    label: filterData.translated.name,
    value: filterData.id,
    // false when there's no color property is fine, UI accepts it
    color: filterData.colorHexCode,
    ...filterData, // pass additional info that may be useful
  })),
});

/**
 * @beta
 */
export function getListingAvailableFilters(
  aggregations: Aggregations | undefined | null
): UiCategoryFilter[] {
  if (!aggregations) {
    return [];
  }
  const transformedFilters: UiCategoryFilter[] = [];
  for (const [aggregationName, aggregation] of Object.entries(aggregations)) {
    try {
      const filterType = getFilterType(aggregation);
      // entity type
      if (filterType === UiCategoryFilterType.entity) {
        transformedFilters.push(
          extractEntityTypeFilter(aggregationName, aggregation.entities)
        );
      } else {
        // other types
        transformedFilters.push({
          name: aggregationName,
          type: filterType,
          ...aggregation,
        });
      }
    } catch (error) {
      console.warn(
        `[helpers][getListingAvailableFilters][getFilterType]: ${error} | ${aggregationName}`
      );
    }
  }

  return transformedFilters;
}
