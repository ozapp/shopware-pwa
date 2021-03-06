<template>
  <div
    class="cms-element-category-navigation-sidebar-filter sw-navbar navbar section"
  >
    <div class="sw-navbar navbar__main">
      <SwButton
        class="sf-button--text navbar__filters-button"
        @click="isFilterSidebarOpen = true"
      >
        <SfIcon size="14px" icon="filter" style="margin-right: 10px;" />Filters
      </SwButton>
      <div class="navbar__sort desktop-only">
        <span class="navbar__label">Sort by:</span>
        <SfSelect v-model="sortBy" :size="sorting.length" class="sort-by">
          <SfSelectOption
            v-for="(option, key) in sorting"
            :key="key"
            :value="option"
            class="sort-by__option"
            >{{ getSortLabel(option) }}</SfSelectOption
          >
        </SfSelect>
      </div>
      <div class="navbar__counter">
        <span class="navbar__label desktop-only">Products found:</span>
        <strong class="desktop-only">{{ productsTotal }}</strong>
        <span class="navbar__label mobile-only">{{ productsTotal }} Items</span>
      </div>
      <div class="navbar__view">
        <span class="navbar__view-label desktop-only">View</span>
        <SwButton
          class="sf-button--pure"
          aria-label="Change to grid view"
          :aria-pressed="!isListView.toString()"
          @click="switchToListView(false)"
        >
          <SfIcon
            class="navbar__view-icon"
            :color="!isListView ? '#1D1F22' : '#BEBFC4'"
            icon="tiles"
            size="12px"
          />
        </SwButton>
        <SwButton
          class="sf-button--pure"
          aria-label="Change to list view"
          :aria-pressed="isListView.toString()"
          @click="switchToListView(true)"
        >
          <SfIcon
            class="navbar__view-icon"
            :color="isListView ? '#1D1F22' : '#BEBFC4'"
            icon="list"
            size="12px"
          />
        </SwButton>
      </div>
      <SfSidebar
        title="Filters"
        :visible="isFilterSidebarOpen"
        class="filters-sidebar"
        @close="isFilterSidebarOpen = false"
      >
        <div class="filters">
          <SwProductListingFilter
            class="filters__filter"
            :filter="filter"
            v-for="filter in filters"
            :selected-filters="selectedFilters"
            :selected-entity-filters="selectedEntityFilters"
            :key="filter.name"
            @toggle-filter-value="toggleFilterValue"
          />
        </div>
        <template #content-bottom>
          <div class="filters__buttons">
            <SwButton class="sf-button--full-width" @click="submitFilters()"
              >Done</SwButton
            >
            <SwButton
              class="sf-button--full-width filters__button-clear"
              @click="clearAllFilters()"
              >Clear all</SwButton
            >
          </div>
        </template>
      </SfSidebar>
    </div>
  </div>
</template>

<script>
import {
  SfIcon,
  SfSelect,
  SfFilter,
  SfHeading,
  SfSidebar,
} from "@storefront-ui/vue"
import { computed } from "@vue/composition-api"

import {
  useCategoryFilters,
  useProductListing,
  useUIState,
} from "@shopware-pwa/composables"
import { getSortingLabel } from "@shopware-pwa/default-theme/helpers"
import SwButton from "@shopware-pwa/default-theme/components/atoms/SwButton"
import SwProductListingFilter from "@shopware-pwa/default-theme/components/listing/SwProductListingFilter"

export default {
  name: "CmsElementCategorySidebarFilter",
  components: {
    SwButton,
    SfIcon,
    SfSelect,
    SfFilter,
    SfHeading,
    SfSidebar,
    SwProductListingFilter,
  },
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { root }) {
    const { availableFilters, availableSorting } = useCategoryFilters(root)
    const {
      toggleFilter,
      changeSorting,
      selectedSorting,
      search,
      selectedFilters,
      selectedEntityFilters,
      resetFilters,
      productsTotal,
    } = useProductListing(root, null)

    const { isOpen: isListView, switchState: switchToListView } = useUIState(
      root,
      "PRODUCT_LISTING_STATE"
    )

    return {
      toggleFilter,
      changeSorting,
      selectedSorting,
      search,
      selectedFilters,
      selectedEntityFilters,
      resetFilters,
      productsTotal,
      isListView,
      switchToListView,
      availableFilters,
      availableSorting,
    }
  },
  data() {
    return {
      isFilterSidebarOpen: false,
      sortBy: this.selectedSorting,
    }
  },
  computed: {
    filters() {
      return this.availableFilters || []
    },
    sorting() {
      return this.availableSorting || []
    },
    getMedia() {
      return this.content && this.content.data && this.content.data.media
    },
    imgUrl() {
      return this.getMedia && this.getMedia.url
    },
    alt() {
      return this.getMedia && this.getMedia.alt
    },
    title() {
      return this.getMedia && this.getMedia.title
    },
    lazyLoad() {
      return true
    },
  },
  watch: {
    sortBy(newSorting, oldOne) {
      // prevent reloading on default sorting
      if (oldOne.name !== newSorting.name) {
        this.changeSorting(newSorting)
      }
    },
  },
  methods: {
    toggleFilterValue(value) {
      this.toggleFilter(value)
    },
    async clearAllFilters() {
      this.resetFilters()
      await this.search()
      this.isFilterSidebarOpen = false
    },
    async submitFilters() {
      await this.search()
      this.isFilterSidebarOpen = false
    },
    getSortLabel(sorting) {
      return getSortingLabel(sorting)
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../settings.scss";

.navbar {
  position: relative;
  display: flex;
  width: 100%;
  border-bottom: 1px solid var(--c-light);

  @include for-desktop {
    margin-top: 20px;
    border-top: 1px solid var(--c-light);
  }

  &__aside {
    display: flex;
    align-items: center;
    flex: 0 0 15%;
    padding: var(--spacer-base) var(--spacer-xl);
    border-right: 1px solid var(--c-light);
  }
  &__main {
    flex: 1;
    display: flex;
    align-items: center;
    padding: var(--spacer-sm);
    font-size: var(--font-sm);
    @include for-desktop {
      padding: var(--spacer-base) 0;
    }
  }
  &__title {
    padding: 0;
    font-size: var(--font-lg);
    line-height: 2.23;
  }
  &__filters-button {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    background: transparent;
    color: inherit;
    font-size: inherit;
    font-weight: 500;
    @include for-mobile {
      order: 1;
    }
    @include for-desktop {
      margin: 0 0 0 var(--spacer-xl);
      font-weight: 400;
      text-transform: none;
    }
    svg {
      fill: var(--c-dark);
      @include for-desktop {
        fill: var(--c-gray-variant);
      }
    }
    &:hover {
      color: var(--c-primary);
      svg {
        fill: var(--c-primary);
      }
    }
  }
  &__label {
    color: var(--c-gray-variant);
  }
  &__sort {
    display: flex;
    align-items: center;
    margin-left: var(--spacer-xl);
    margin-right: auto;
  }
  &__counter {
    margin: auto;
    @include for-desktop {
      margin-right: 20px;
    }
  }
  &__view {
    display: flex;
    align-items: center;
    margin: 0 var(--spacer-xl);
    &-icon {
      margin: 11px;
    }
    @include for-mobile {
      margin: 0;
      order: -1;
    }
  }
}

.sort-by {
  flex: unset;
  max-height: 40px;
  padding: 0 10px;
  width: 190px;
  --select-margin: 0;
  --select-selected-padding: 0 var(--spacer-lg) 0 var(--spacer-2xs);

  &--mobile {
    width: auto;
    padding-right: 0px;
  }
}

.filters {
  &__filter {
    padding: 1rem 0;
  }
}
.filters-sidebar {
  --sidebar-z-index: 4;
  --overlay-z-index: 4;
}
</style>
