
import { Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { differenceInDays } from "date-fns";

interface BookingCardProps {
  pricePerNight: number;
  maxGuests: number;
  dates: {
    checkIn: string;
    checkOut: string;
  };
  guests: number;
  isLoading: boolean;
  minDate: string;
  onDatesChange: (dates: { checkIn: string; checkOut: string }) => void;
  onGuestsChange: (guests: number) => void;
  onBookingSubmit: () => void;
}

export const BookingCard = ({
  pricePerNight,
  maxGuests,
  dates,
  guests,
  isLoading,
  minDate,
  onDatesChange,
  onGuestsChange,
  onBookingSubmit,
}: BookingCardProps) => {
  const priceInRupees = Math.round(pricePerNight * 83);

  return (
    <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-airbnb-dark">₹{priceInRupees.toLocaleString('en-IN')}</span>
        <span className="text-airbnb-light">per night</span>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center border rounded-lg p-3">
          <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input
            type="date"
            min={minDate}
            value={dates.checkIn}
            onChange={(e) => onDatesChange({ ...dates, checkIn: e.target.value })}
            className="border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-lg p-3">
          <Calendar className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input
            type="date"
            min={dates.checkIn || minDate}
            value={dates.checkOut}
            onChange={(e) => onDatesChange({ ...dates, checkOut: e.target.value })}
            className="border-none focus:outline-none"
          />
        </div>
        <div className="flex items-center border rounded-lg p-3">
          <User className="w-5 h-5 text-airbnb-primary mr-2" />
          <Input
            type="number"
            min="1"
            max={maxGuests}
            value={guests}
            onChange={(e) => onGuestsChange(parseInt(e.target.value))}
            className="border-none focus:outline-none"
            placeholder="Guests"
          />
        </div>
      </div>

      {dates.checkIn && dates.checkOut && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between mb-2">
            <span>₹{priceInRupees} × {differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))} nights</span>
            <span>₹{(priceInRupees * differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{(priceInRupees * differenceInDays(new Date(dates.checkOut), new Date(dates.checkIn))).toLocaleString('en-IN')}</span>
          </div>
        </div>
      )}

      <Button 
        className="w-full bg-airbnb-primary hover:bg-airbnb-primary/90 text-white"
        onClick={onBookingSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Confirming..." : "Reserve Now"}
      </Button>
    </div>
  );
};
