import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { CalendarIcon, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface BookingDialogProps {
  tutor: any;
  tutorSkills: any[];
  isOpen: boolean;
  onClose: () => void;
}

export const BookingDialog = ({ tutor, tutorSkills, isOpen, onClose }: BookingDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedSkill, setSelectedSkill] = useState('');
  const [lessonDate, setLessonDate] = useState<Date>();
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('1');
  const [lessonType, setLessonType] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedSkillData = tutorSkills.find(s => s.id === selectedSkill);
  const hourlyRate = selectedSkillData?.hourly_rate || 0;
  const totalAmount = hourlyRate * parseFloat(duration);

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const handleSubmit = async () => {
    if (!user || !selectedSkill || !lessonDate || !startTime || !lessonType) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Get learner profile
      const { data: learnerProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      // Calculate end time
      const [hours, minutes] = startTime.split(':');
      const startDateTime = new Date(lessonDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + parseFloat(duration));

      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          tutor_id: tutor.id,
          learner_id: learnerProfile.id,
          skill_id: selectedSkill,
          lesson_date: format(lessonDate, 'yyyy-MM-dd'),
          start_time: startTime,
          end_time: format(endDateTime, 'HH:mm'),
          duration_hours: parseFloat(duration),
          lesson_type: lessonType,
          location: location || null,
          hourly_rate: hourlyRate,
          total_amount: totalAmount,
          notes: notes || null,
          status: 'pending'
        }]);

      if (bookingError) throw bookingError;

      toast({
        title: "Success",
        description: "Booking request sent successfully! The tutor will respond soon.",
      });

      onClose();
      
      // Reset form
      setSelectedSkill('');
      setLessonDate(undefined);
      setStartTime('');
      setDuration('1');
      setLessonType('');
      setLocation('');
      setNotes('');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book a Lesson with {tutor.first_name}</DialogTitle>
          <DialogDescription>
            Fill in the details below to request a lesson booking.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Subject Selection */}
          <div className="grid gap-2">
            <Label htmlFor="skill">Subject *</Label>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {tutorSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id}>
                    {skill.skills.name} - R{skill.hourly_rate}/hour
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Lesson Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lessonDate ? format(lessonDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={lessonDate}
                    onSelect={setLessonDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger>
                  <Clock className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration and Lesson Type */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (hours) *</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">30 minutes</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="1.5">1.5 hours</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lessonType">Lesson Type *</Label>
              <Select value={lessonType} onValueChange={setLessonType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="in-person">In-person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="grid gap-2">
            <Label htmlFor="location">
              Location {lessonType === 'in-person' ? '*' : '(Optional)'}
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter meeting location or address"
            />
          </div>

          {/* Notes */}
          <div className="grid gap-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific topics you'd like to focus on or special requirements..."
              rows={3}
            />
          </div>

          {/* Cost Summary */}
          {selectedSkillData && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cost Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Hourly Rate:</span>
                  <span>R{hourlyRate}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{duration} hour{parseFloat(duration) !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>R{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} className="flex-1">
              {submitting ? 'Sending Request...' : 'Send Booking Request'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};