import { defineStore } from 'pinia';
import { seedMatches } from '../data/seedMatches';
import { startMockOddsStream } from '../services/mockOddsStream';

const FAVORITES_STORAGE_KEY = 'live-odds-pulse:favorites';

function resetMatch(match) {
  return {
    ...match,
    odds: { ...match.odds },
    movement: {
      home: 'same',
      draw: 'same',
      away: 'same'
    },
    isFavorite: false
  };
}

function safeParseFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

function safeSaveFavorites(matches) {
  try {
    const favorites = matches.filter((match) => match.isFavorite).map((match) => match.id);
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // Storage can fail in private mode or restricted environments.
  }
}

export const useMatchesStore = defineStore('matches', {
  state: () => ({
    matches: [],
    filters: {
      sport: 'All',
      league: 'All',
      search: ''
    },
    isConnected: false,
    lastUpdatedAt: null,
    stopStream: null
  }),
  getters: {
    sports(state) {
      return ['All', ...new Set(state.matches.map((match) => match.sport))];
    },
    leagues(state) {
      const selectedSport = state.filters.sport;
      const filtered =
        selectedSport === 'All'
          ? state.matches
          : state.matches.filter((match) => match.sport === selectedSport);
      return ['All', ...new Set(filtered.map((match) => match.league))];
    },
    filteredMatches(state) {
      const search = state.filters.search.trim().toLowerCase();

      return state.matches
        .filter((match) => {
          const sportMatch =
            state.filters.sport === 'All' || match.sport === state.filters.sport;
          const leagueMatch =
            state.filters.league === 'All' || match.league === state.filters.league;
          const searchMatch =
            !search || `${match.home} ${match.away}`.toLowerCase().includes(search);

          return sportMatch && leagueMatch && searchMatch;
        })
        .sort((left, right) => {
          if (left.isFavorite !== right.isFavorite) {
            return left.isFavorite ? -1 : 1;
          }
          return new Date(left.startTime).getTime() - new Date(right.startTime).getTime();
        });
    }
  },
  actions: {
    init() {
      const favorites = safeParseFavorites();
      this.matches = seedMatches.map((seed) => {
        const match = resetMatch(seed);
        if (favorites.has(match.id)) {
          match.isFavorite = true;
        }
        return match;
      });
      this.lastUpdatedAt = null;
    },
    connect() {
      if (this.stopStream) {
        return;
      }

      this.isConnected = true;
      this.stopStream = startMockOddsStream({
        matches: this.matches,
        onUpdate: (update) => this.applyOddsUpdate(update),
        onDisconnect: () => {
          this.isConnected = false;
        }
      });
    },
    disconnect() {
      if (this.stopStream) {
        this.stopStream();
        this.stopStream = null;
      }
      this.isConnected = false;
    },
    setFilters(partialFilters) {
      this.filters = {
        ...this.filters,
        ...partialFilters
      };

      if (!this.leagues.includes(this.filters.league)) {
        this.filters.league = 'All';
      }
    },
    toggleFavorite(matchId) {
      const match = this.matches.find((item) => item.id === matchId);
      if (!match) {
        return;
      }

      match.isFavorite = !match.isFavorite;
      safeSaveFavorites(this.matches);
    },
    applyOddsUpdate({ matchId, market, value }) {
      const match = this.matches.find((item) => item.id === matchId);
      if (!match || !Object.prototype.hasOwnProperty.call(match.odds, market)) {
        return;
      }

      const previous = match.odds[market];
      const nextValue = Number(value.toFixed(2));
      match.odds[market] = nextValue;

      if (nextValue > previous) {
        match.movement[market] = 'up';
      } else if (nextValue < previous) {
        match.movement[market] = 'down';
      } else {
        match.movement[market] = 'same';
      }

      this.lastUpdatedAt = new Date().toISOString();
    }
  }
});
