<script setup>
import LiveMatchCard from './LiveMatchCard.vue';

const props = defineProps({
  matches: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['toggle-favorite']);
</script>

<template>
  <section class="board" aria-live="polite">
    <p class="empty-state" v-if="props.matches.length === 0">
      No matches found for the selected filters.
    </p>

    <LiveMatchCard
      v-for="match in props.matches"
      :key="match.id"
      :match="match"
      @toggle-favorite="emit('toggle-favorite', $event)"
    />
  </section>
</template>
