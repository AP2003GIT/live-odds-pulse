import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useMatchesStore } from '../src/stores/matches';

describe('matches store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('loads seed matches and favorites from storage', () => {
    localStorage.setItem('live-odds-pulse:favorites', JSON.stringify(['f-101']));

    const store = useMatchesStore();
    store.init();

    expect(store.matches.length).toBeGreaterThan(0);
    expect(store.matches.find((match) => match.id === 'f-101')?.isFavorite).toBe(true);
  });

  it('toggles favorites and persists to localStorage', () => {
    const store = useMatchesStore();
    store.init();

    store.toggleFavorite('f-102');

    const persisted = JSON.parse(localStorage.getItem('live-odds-pulse:favorites'));
    expect(persisted).toContain('f-102');
  });

  it('updates movement direction when odds change', () => {
    const store = useMatchesStore();
    store.init();

    const previous = store.matches.find((match) => match.id === 'f-103').odds.home;

    store.applyOddsUpdate({
      matchId: 'f-103',
      market: 'home',
      value: previous + 0.2
    });

    const updated = store.matches.find((match) => match.id === 'f-103');
    expect(updated.movement.home).toBe('up');

    store.applyOddsUpdate({
      matchId: 'f-103',
      market: 'home',
      value: previous - 0.1
    });

    expect(updated.movement.home).toBe('down');
  });
});
