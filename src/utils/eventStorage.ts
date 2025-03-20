
import { ChapelEvent } from '@/types';
import { encryptData, decryptData } from './encryption';

// Local storage key
const EVENTS_STORAGE_KEY = 'mtu_chapel_events';

/**
 * Stores events in localStorage as a temporary solution
 * In a production app, this would use GitHub storage API
 */
export const storeEvents = (events: ChapelEvent[]): void => {
  try {
    // Encrypt the events data
    const encryptedEvents = encryptData(events);
    localStorage.setItem(EVENTS_STORAGE_KEY, encryptedEvents);
  } catch (error) {
    console.error('Error storing events:', error);
  }
};

/**
 * Retrieves events from localStorage
 * In a production app, this would use GitHub storage API
 */
export const getEvents = (): ChapelEvent[] => {
  try {
    const storedEvents = localStorage.getItem(EVENTS_STORAGE_KEY);
    
    if (!storedEvents) {
      return [];
    }
    
    // Decrypt the stored events data
    const decryptedEvents = decryptData(storedEvents);
    return decryptedEvents || [];
  } catch (error) {
    console.error('Error retrieving events:', error);
    return [];
  }
};

/**
 * Adds a new event and saves to storage
 */
export const addEvent = (event: ChapelEvent): ChapelEvent[] => {
  const events = getEvents();
  const updatedEvents = [...events, event];
  storeEvents(updatedEvents);
  return updatedEvents;
};

/**
 * Updates an existing event and saves to storage
 */
export const updateEvent = (eventId: string, updatedEvent: ChapelEvent): ChapelEvent[] => {
  const events = getEvents();
  const updatedEvents = events.map(event => 
    event.id === eventId ? { ...event, ...updatedEvent } : event
  );
  storeEvents(updatedEvents);
  return updatedEvents;
};

/**
 * Deletes an event and saves to storage
 */
export const deleteEvent = (eventId: string): ChapelEvent[] => {
  const events = getEvents();
  const updatedEvents = events.filter(event => event.id !== eventId);
  storeEvents(updatedEvents);
  return updatedEvents;
};
