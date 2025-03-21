
import { toast } from "@/components/ui/use-toast";

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  reminder?: number; // minutes before event
}

const EVENT_STORAGE_KEY = 'mtu_events';
const NOTIFIED_EVENTS_KEY = 'mtu_notified_events';

// Get events from storage
export const getEvents = (): Event[] => {
  try {
    const savedEvents = localStorage.getItem(EVENT_STORAGE_KEY);
    if (!savedEvents) return [];
    return JSON.parse(savedEvents, (key, value) => {
      if (key === 'startTime' || key === 'endTime') {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    console.error('Error retrieving events:', error);
    return [];
  }
};

// Save events to storage
export const saveEvents = (events: Event[]): void => {
  localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
};

// Get already notified events
const getNotifiedEvents = (): string[] => {
  try {
    const notifiedEvents = localStorage.getItem(NOTIFIED_EVENTS_KEY);
    if (!notifiedEvents) return [];
    return JSON.parse(notifiedEvents);
  } catch (error) {
    console.error('Error retrieving notified events:', error);
    return [];
  }
};

// Save notified event
const saveNotifiedEvent = (eventId: string): void => {
  const notifiedEvents = getNotifiedEvents();
  if (!notifiedEvents.includes(eventId)) {
    notifiedEvents.push(eventId);
    localStorage.setItem(NOTIFIED_EVENTS_KEY, JSON.stringify(notifiedEvents));
  }
};

// Check for upcoming events and show notifications
export const checkUpcomingEvents = (): void => {
  const events = getEvents();
  const notifiedEvents = getNotifiedEvents();
  const now = new Date();
  
  events.forEach(event => {
    const notificationKey = `${event.id}-${event.startTime.getTime()}`;
    
    // Skip if already notified
    if (notifiedEvents.includes(notificationKey)) {
      return;
    }
    
    const timeDiff = event.startTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    // Notify if event is starting now
    if (minutesDiff <= 0 && minutesDiff > -5) {
      toast({
        title: "Event Starting Now",
        description: `${event.title} is starting now at ${event.location || 'specified location'}`,
        variant: "default",
      });
      saveNotifiedEvent(notificationKey);
    } 
    // Or notify based on reminder setting
    else if (event.reminder && minutesDiff > 0 && minutesDiff <= event.reminder) {
      toast({
        title: "Upcoming Event Reminder",
        description: `${event.title} will start in ${minutesDiff} minutes at ${event.location || 'specified location'}`,
        variant: "default",
      });
      saveNotifiedEvent(notificationKey);
    }
  });
};

// Initialize event notifications checker
export const initEventNotifications = (): (() => void) => {
  // Check immediately
  checkUpcomingEvents();
  
  // Then check every minute
  const intervalId = setInterval(() => {
    checkUpcomingEvents();
  }, 60 * 1000);
  
  return () => clearInterval(intervalId);
};
