
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format, parse } from 'date-fns';
import { ChapelEvent } from '@/types';

interface EventFormProps {
  event: ChapelEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: ChapelEvent) => void;
}

const EventForm = ({ event, open, onOpenChange, onSave }: EventFormProps) => {
  const defaultValues = event
    ? {
        title: event.title,
        startDate: format(event.start, 'yyyy-MM-dd'),
        startTime: format(event.start, 'HH:mm'),
        endDate: format(event.end, 'yyyy-MM-dd'),
        endTime: format(event.end, 'HH:mm'),
        description: event.description || '',
        location: event.location || '',
        speaker: event.speaker || '',
        color: event.color || '#4f46e5',
      }
    : {
        title: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        startTime: '09:00',
        endDate: format(new Date(), 'yyyy-MM-dd'),
        endTime: '10:00',
        description: '',
        location: 'Main Auditorium',
        speaker: '',
        color: '#4f46e5',
      };

  const { register, handleSubmit, formState: { errors }, watch } = useForm({ defaultValues });
  
  const watchStartDate = watch('startDate');
  const watchStartTime = watch('startTime');

  const handleSave = (data: any) => {
    const start = parse(
      `${data.startDate} ${data.startTime}`,
      'yyyy-MM-dd HH:mm',
      new Date()
    );
    
    const end = parse(
      `${data.endDate} ${data.endTime}`,
      'yyyy-MM-dd HH:mm',
      new Date()
    );
    
    const eventData: ChapelEvent = {
      id: event?.id || '',
      title: data.title,
      start,
      end,
      description: data.description,
      location: data.location,
      speaker: data.speaker,
      color: data.color,
    };
    
    onSave(eventData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
          <DialogDescription>
            Fill in the details for your chapel event
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                className="w-full"
                placeholder="Chapel Service"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message as string}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-red-500">*</span></Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                />
                {errors.startDate && (
                  <p className="text-sm text-red-500">{errors.startDate.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register('startTime', { required: 'Start time is required' })}
                />
                {errors.startTime && (
                  <p className="text-sm text-red-500">{errors.startTime.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date <span className="text-red-500">*</span></Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate', { 
                    required: 'End date is required',
                    validate: value => value >= watchStartDate || 'End date must be after start date'
                  })}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">{errors.endDate.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register('endTime', { 
                    required: 'End time is required',
                    validate: (value, formValues) => 
                      formValues.startDate !== formValues.endDate || 
                      value > watchStartTime || 
                      'End time must be after start time'
                  })}
                />
                {errors.endTime && (
                  <p className="text-sm text-red-500">{errors.endTime.message as string}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Main Auditorium"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="speaker">Speaker</Label>
              <Input
                id="speaker"
                {...register('speaker')}
                placeholder="Guest speaker name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Details about the chapel service..."
                className="h-20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color">Event Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="color"
                  type="color"
                  {...register('color')}
                  className="w-12 h-8 p-1"
                />
                <p className="text-sm text-muted-foreground">
                  Choose a color for the event display
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {event ? 'Update Event' : 'Create Event'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
