
import { toast } from "sonner";
import { User } from '@/lib/auth';

export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  reminder?: number; // minutes before event
  createdBy?: string; // admin who created the event
  mandatory?: boolean; // whether attendance is mandatory
  targetGroups?: string[]; // specific student groups/levels this applies to
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

// Add a new event (for admin use)
export const addEvent = (event: Event): Event[] => {
  const events = getEvents();
  const updatedEvents = [...events, event];
  saveEvents(updatedEvents);
  return updatedEvents;
};

// Update an existing event
export const updateEvent = (eventId: string, updatedEvent: Event): Event[] => {
  const events = getEvents();
  const updatedEvents = events.map(event => 
    event.id === eventId ? { ...event, ...updatedEvent } : event
  );
  saveEvents(updatedEvents);
  return updatedEvents;
};

// Delete an event
export const deleteEvent = (eventId: string): Event[] => {
  const events = getEvents();
  const updatedEvents = events.filter(event => event.id !== eventId);
  saveEvents(updatedEvents);
  return updatedEvents;
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
export const checkUpcomingEvents = (currentUser?: User | null): void => {
  const events = getEvents();
  const notifiedEvents = getNotifiedEvents();
  const now = new Date();
  
  events.forEach(event => {
    // For each event, create different notification keys based on timing
    const startingSoonKey = `${event.id}-starting-soon`;
    const startingNowKey = `${event.id}-starting-now`;
    const reminderKey = `${event.id}-reminder-${event.reminder || 30}`;
    
    // Skip if user doesn't match target groups (if specified)
    if (currentUser && event.targetGroups && event.targetGroups.length > 0) {
      // In a real app, you'd check if the user's level/department matches any target group
      // Here we'll just assume all events apply to the current user
    }
    
    const timeDiff = event.startTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));
    
    // Show "starting now" notification (0-5 minutes)
    if (minutesDiff <= 0 && minutesDiff > -5 && !notifiedEvents.includes(startingNowKey)) {
      toast(`${event.title} is starting now at ${event.location || 'specified location'}`, {
        description: event.description,
        action: {
          label: "View Details",
          onClick: () => console.log("View event details", event.id)
        },
      });
      saveNotifiedEvent(startingNowKey);
    } 
    // Show "starting soon" notification (5-15 minutes)
    else if (minutesDiff > 0 && minutesDiff <= 15 && !notifiedEvents.includes(startingSoonKey)) {
      toast(`${event.title} starting in ${minutesDiff} minutes`, {
        description: `At ${event.location || 'specified location'}`,
        action: {
          label: "View Details",
          onClick: () => console.log("View event details", event.id)
        },
      });
      saveNotifiedEvent(startingSoonKey);
    }
    // Or show reminder based on reminder setting
    else if (event.reminder && minutesDiff > 15 && minutesDiff <= event.reminder && !notifiedEvents.includes(reminderKey)) {
      toast(`Reminder: ${event.title}`, {
        description: `Event scheduled for ${event.startTime.toLocaleTimeString()} at ${event.location || 'specified location'}`,
        action: {
          label: "Dismiss",
          onClick: () => {}
        },
      });
      saveNotifiedEvent(reminderKey);
    }
  });
};

// Initialize event notifications checker
export const initEventNotifications = (currentUser?: User | null): (() => void) => {
  // Check immediately
  checkUpcomingEvents(currentUser);
  
  // Then check every minute
  const intervalId = setInterval(() => {
    checkUpcomingEvents(currentUser);
  }, 30 * 1000); // Check every 30 seconds (more frequent for testing)
  
  return () => clearInterval(intervalId);
};
