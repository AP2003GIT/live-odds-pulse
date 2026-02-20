<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue';
import FilterBar from './components/FilterBar.vue';
import LiveBoard from './components/LiveBoard.vue';
import { useMatchesStore } from './stores/matches';

const store = useMatchesStore();

onMounted(() => {
  store.init();
  store.connect();
});

onBeforeUnmount(() => {
  store.disconnect();
});

const lastUpdateText = computed(() => {
  if (!store.lastUpdatedAt) {
    return 'waiting for first update';
  }

  return `updated at ${new Date(store.lastUpdatedAt).toLocaleTimeString()}`;
});

function toggleStream() {
  if (store.isConnected) {
    store.disconnect();
  } else {
    store.connect();
  }
}
</script>

<template>
  <main class="app-shell">
    <header class="top-header">
      <div>
        <p class="product-label">LIVE ODDS PULSE</p>
        <h1>Real-time Match Monitor</h1>
        <p class="hint">
          Fast, filterable, and keyboard-friendly live dashboard with mocked streaming odds.
        </p>
      </div>

      <div class="status-panel">
        <p>
          Stream:
          <span :class="['pill', store.isConnected ? 'pill-ok' : 'pill-off']">
            {{ store.isConnected ? 'Connected' : 'Paused' }}
          </span>
        </p>
        <p class="subtle">{{ lastUpdateText }}</p>
        <button type="button" class="stream-btn" @click="toggleStream">
          {{ store.isConnected ? 'Pause updates' : 'Resume updates' }}
        </button>
      </div>
    </header>

    <FilterBar
      :sports="store.sports"
      :leagues="store.leagues"
      :filters="store.filters"
      @update-filters="store.setFilters"
    />

    <LiveBoard :matches="store.filteredMatches" @toggle-favorite="store.toggleFavorite" />
  </main>
</template>
