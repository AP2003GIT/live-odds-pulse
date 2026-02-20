<script setup>
const props = defineProps({
  match: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle-favorite']);

function formatStartTime(value) {
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function movementSymbol(direction) {
  if (direction === 'up') {
    return '+';
  }
  if (direction === 'down') {
    return '-';
  }
  return '=';
}

function movementClass(direction) {
  if (direction === 'up') {
    return 'is-up';
  }
  if (direction === 'down') {
    return 'is-down';
  }
  return 'is-same';
}
</script>

<template>
  <article class="match-card" data-testid="match-card">
    <header class="card-header">
      <div>
        <p class="league">{{ props.match.sport }} / {{ props.match.league }}</p>
        <h2>{{ props.match.home }} vs {{ props.match.away }}</h2>
      </div>
      <div class="meta-actions">
        <p class="kickoff">{{ formatStartTime(props.match.startTime) }}</p>
        <button
          type="button"
          class="favorite-btn"
          :aria-pressed="props.match.isFavorite"
          @click="emit('toggle-favorite', props.match.id)"
        >
          {{ props.match.isFavorite ? 'Saved' : 'Save' }}
        </button>
      </div>
    </header>

    <div class="odds-grid" role="list" aria-label="Current odds">
      <div class="odd-box" role="listitem">
        <span class="odd-label">Home</span>
        <strong>{{ props.match.odds.home.toFixed(2) }}</strong>
        <small :class="movementClass(props.match.movement.home)">
          {{ movementSymbol(props.match.movement.home) }}
        </small>
      </div>

      <div class="odd-box" role="listitem" v-if="props.match.odds.draw > 0">
        <span class="odd-label">Draw</span>
        <strong>{{ props.match.odds.draw.toFixed(2) }}</strong>
        <small :class="movementClass(props.match.movement.draw)">
          {{ movementSymbol(props.match.movement.draw) }}
        </small>
      </div>

      <div class="odd-box" role="listitem">
        <span class="odd-label">Away</span>
        <strong>{{ props.match.odds.away.toFixed(2) }}</strong>
        <small :class="movementClass(props.match.movement.away)">
          {{ movementSymbol(props.match.movement.away) }}
        </small>
      </div>
    </div>
  </article>
</template>
