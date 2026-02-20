<script setup>
const props = defineProps({
  sports: {
    type: Array,
    required: true
  },
  leagues: {
    type: Array,
    required: true
  },
  filters: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-filters']);

function onSportChange(event) {
  emit('update-filters', {
    sport: event.target.value,
    league: 'All'
  });
}

function onLeagueChange(event) {
  emit('update-filters', {
    league: event.target.value
  });
}

function onSearchChange(event) {
  emit('update-filters', {
    search: event.target.value
  });
}
</script>

<template>
  <section class="filter-bar" aria-label="Match filters">
    <label class="field" for="sport-filter">
      <span>Sport</span>
      <select
        id="sport-filter"
        :value="props.filters.sport"
        aria-label="Filter by sport"
        @change="onSportChange"
      >
        <option v-for="sport in props.sports" :key="sport" :value="sport">
          {{ sport }}
        </option>
      </select>
    </label>

    <label class="field" for="league-filter">
      <span>League</span>
      <select
        id="league-filter"
        :value="props.filters.league"
        aria-label="Filter by league"
        @change="onLeagueChange"
      >
        <option v-for="league in props.leagues" :key="league" :value="league">
          {{ league }}
        </option>
      </select>
    </label>

    <label class="field field-wide" for="search-filter">
      <span>Search team</span>
      <input
        id="search-filter"
        type="search"
        placeholder="e.g. Madrid"
        :value="props.filters.search"
        aria-label="Search teams"
        @input="onSearchChange"
      />
    </label>
  </section>
</template>
