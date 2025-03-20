
import { useState, useRef, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, parse } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockEvents } from '@/utils/mockData';
import { ChapelEvent } from '@/types';
import EventForm from './EventForm';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getEvents, storeEvents, addEvent, updateEvent } from '@/utils/eventStorage';

interface CalendarProps {
  className?: string;
}

const Calendar = ({ className }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ChapelEvent | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState<ChapelEvent[]>([]);
  const [draggedEvent, setDraggedEvent] = useState<ChapelEvent | null>(null);
  const [draggingOver, setDraggingOver] = useState<string | null>(null);
  
  const calendarRef = useRef<HTMLDivElement>(null);

  // Load events from storage on component mount
  useEffect(() => {
    const storedEvents = getEvents();
    
    // If no stored events, use mock events as initial data
    if (storedEvents.length === 0) {
      setEvents(mockEvents);
      storeEvents(mockEvents);
    } else {
      // Convert date strings back to Date objects for stored events
      const eventsWithDates = storedEvents.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
      setEvents(eventsWithDates);
    }
  }, []);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
  const endDate = endOfWeek(currentDate, { weekStartsOn: 0 });
  
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const goToPreviousWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(prevDate => addDays(prevDate, 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event: ChapelEvent) => {
    setSelectedEvent(event);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleSaveEvent = (eventData: ChapelEvent) => {
    let updatedEvents;
    
    if (selectedEvent) {
      // Update existing event
      updatedEvents = events.map(event => 
        event.id === selectedEvent.id ? { ...event, ...eventData } : event
      );
      setEvents(updatedEvents);
      storeEvents(updatedEvents);
      toast.success('Event updated successfully');
    } else {
      // Add new event
      const newEvent = {
        ...eventData,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      updatedEvents = [...events, newEvent];
      setEvents(updatedEvents);
      storeEvents(updatedEvents);
      toast.success('Event created successfully');
    }
    
    setShowEventForm(false);
  };

  const onDragStart = (event: React.DragEvent, chapelEvent: ChapelEvent) => {
    setDraggedEvent(chapelEvent);
    event.dataTransfer.setData('text/plain', chapelEvent.id);
    
    // Add styling to the dragged element
    const target = event.target as HTMLElement;
    setTimeout(() => {
      if (target.classList) {
        target.classList.add('event-dragging');
      }
    }, 0);
  };

  const onDragEnd = (event: React.DragEvent) => {
    setDraggedEvent(null);
    setDraggingOver(null);
    
    // Remove styling from the dragged element
    const target = event.target as HTMLElement;
    if (target.classList) {
      target.classList.remove('event-dragging');
    }
  };

  const onDragOver = (event: React.DragEvent, dateStr: string) => {
    event.preventDefault();
    setDraggingOver(dateStr);
  };

  const onDrop = (event: React.DragEvent, dateStr: string) => {
    event.preventDefault();
    
    if (!draggedEvent) return;
    
    const dropDate = parse(dateStr, 'yyyy-MM-dd', new Date());
    
    // Calculate the difference between the start and end date to maintain duration
    const duration = draggedEvent.end.getTime() - draggedEvent.start.getTime();
    
    // Update the event with the new dates
    const updatedEvent = {
      ...draggedEvent,
      start: dropDate,
      end: new Date(dropDate.getTime() + duration)
    };
    
    // Update the events array
    const updatedEvents = events.map(evt => 
      evt.id === draggedEvent.id ? updatedEvent : evt
    );
    
    setEvents(updatedEvents);
    storeEvents(updatedEvents);
    
    setDraggedEvent(null);
    setDraggingOver(null);
    
    toast.success('Event moved successfully');
  };

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start), date)
    );
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <CardTitle>Chapel Calendar</CardTitle>
          <CardDescription>
            View and manage chapel events
          </CardDescription>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </span>
          <Button size="sm" onClick={handleAddEvent} className="ml-auto">
            <Plus className="h-4 w-4 mr-1" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={calendarRef} className="border rounded-md overflow-hidden animate-scale-in">
          {/* Day headers */}
          <div className="grid grid-cols-7 bg-muted/30">
            {weekDays.map((day, index) => (
              <div 
                key={index} 
                className="p-2 text-center border-b border-r last:border-r-0 font-medium text-sm"
              >
                <div>{format(day, 'EEE')}</div>
                <div className={cn(
                  "h-7 w-7 rounded-full inline-flex items-center justify-center text-sm font-normal",
                  isToday(day) && "bg-primary text-primary-foreground"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          
          {/* Calendar body */}
          <div className="grid grid-cols-7 h-[calc(50vh-13rem)] md:h-[calc(70vh-13rem)]">
            {weekDays.map((day, dayIndex) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayEvents = getEventsForDay(day);
              
              return (
                <div 
                  key={dayIndex}
                  className={cn(
                    "min-h-[100px] p-1 border-b border-r last:border-r-0 overflow-y-auto",
                    isToday(day) && "bg-muted/30",
                    draggingOver === dateStr && "bg-muted/70"
                  )}
                  onDragOver={(e) => onDragOver(e, dateStr)}
                  onDrop={(e) => onDrop(e, dateStr)}
                >
                  <div className="space-y-1 py-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          "p-2 rounded-md text-sm cursor-pointer hover:opacity-90 transition-all",
                          "border border-transparent"
                        )}
                        style={{ backgroundColor: event.color }}
                        onClick={() => handleEventClick(event)}
                        draggable
                        onDragStart={(e) => onDragStart(e, event)}
                        onDragEnd={onDragEnd}
                      >
                        <div className="font-medium text-white truncate">{event.title}</div>
                        <div className="text-xs text-white/80 truncate">
                          {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
              <DialogDescription className="text-sm">
                {format(selectedEvent.start, 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="font-medium">Time:</div>
                <div>
                  {format(selectedEvent.start, 'h:mm a')} - {format(selectedEvent.end, 'h:mm a')}
                </div>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-2">
                  <div className="font-medium">Location:</div>
                  <div>{selectedEvent.location}</div>
                </div>
              )}
              {selectedEvent.speaker && (
                <div className="flex items-center gap-2">
                  <div className="font-medium">Speaker:</div>
                  <div>{selectedEvent.speaker}</div>
                </div>
              )}
              {selectedEvent.description && (
                <div className="space-y-1">
                  <div className="font-medium">Description:</div>
                  <div className="text-sm text-muted-foreground">{selectedEvent.description}</div>
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowEventForm(true);
                }}
              >
                Edit Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Event Form Dialog */}
      {showEventForm && (
        <EventForm
          event={selectedEvent}
          open={showEventForm}
          onOpenChange={setShowEventForm}
          onSave={handleSaveEvent}
        />
      )}
    </Card>
  );
};

export default Calendar;
