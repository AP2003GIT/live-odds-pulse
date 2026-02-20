import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../src/services/mockOddsStream', () => ({
  startMockOddsStream: () => () => {}
}));

import App from '../src/App.vue';
import { useMatchesStore } from '../src/stores/matches';

describe('filter integration', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  it('filters board cards by search query', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    const wrapper = mount(App, {
      global: {
        plugins: [pinia]
      }
    });

    const store = useMatchesStore();
    await wrapper.vm.$nextTick();
    expect(store.matches.length).toBeGreaterThan(0);

    const search = wrapper.get('input[aria-label="Search teams"]');
    await search.setValue('Madrid');

    expect(store.filteredMatches.length).toBe(1);
    expect(store.filteredMatches[0].home).toContain('Madrid');
    expect(wrapper.findAll('[data-testid="match-card"]').length).toBe(1);
  });
});
