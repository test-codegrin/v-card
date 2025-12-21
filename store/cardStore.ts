import { create } from 'zustand';
import { Card } from '@/types/card';
import { createCard, deleteCard, getCardBySlug, getCards, updateCard } from '@/lib/api';
import { useAuthStore } from './authStore';

type CardState = {
  cards: Card[];
  loading: boolean;
  error: string | null;
  fetchCards: () => Promise<void>;
  createCard: (payload: Omit<Card, 'slug' | 'createdAt'>) => Promise<Card>;
  updateCard: (slug: string, payload: Partial<Card>) => Promise<Card>;
  deleteCard: (slug: string) => Promise<void>;
  getCard: (slug: string, opts?: { public?: boolean }) => Promise<Card | null>;
};

export const useCardStore = create<CardState>((set, get) => ({
  cards: [],
  loading: false,
  error: null,

  fetchCards: async () => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const data = await getCards(token);
      set({ cards: data, loading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch cards';
      set({ error: message, loading: false });
    }
  },

  createCard: async (payload) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('Unauthorized');
    set({ loading: true, error: null });
    try {
      const card = await createCard(token, payload);
      set((state) => ({ cards: [card, ...state.cards], loading: false }));
      return card;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create card';
      set({ error: message, loading: false });
      throw error;
    }
  },

  updateCard: async (slug, payload) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('Unauthorized');
    set({ loading: true, error: null });
    try {
      const card = await updateCard(slug, token, payload);
      set((state) => ({
        cards: state.cards.map((c) => (c.slug === slug ? card : c)),
        loading: false
      }));
      return card;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update card';
      set({ error: message, loading: false });
      throw error;
    }
  },

  deleteCard: async (slug) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('Unauthorized');
    set({ loading: true, error: null });
    try {
      await deleteCard(slug, token);
      set((state) => ({ cards: state.cards.filter((c) => c.slug !== slug), loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete card';
      set({ error: message, loading: false });
      throw error;
    }
  },

  // If opts.public is true, do not send auth header.
  getCard: async (slug, opts) => {
    const token = opts?.public ? null : useAuthStore.getState().token;
    set({ loading: true, error: null });
    try {
      const card = await getCardBySlug(slug, token);
      if (!opts?.public) {
        set((state) => {
          const exists = state.cards.some((c) => c.slug === card.slug);
          return { cards: exists ? state.cards.map((c) => (c.slug === card.slug ? card : c)) : [card, ...state.cards], loading: false };
        });
      } else {
        set({ loading: false });
      }
      return card;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch card';
      set({ error: message, loading: false });
      return null;
    }
  }
}));
