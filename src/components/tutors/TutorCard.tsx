import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TutorCardProps {
  tutor: {
    id: string;
    first_name: string;
    last_name: string;
    bio: string;
    location: string;
    avatar_url?: string;
    skills: Array<{
      id: string;
      name: string;
      hourly_rate: number;
      description: string;
    }>;
    rating?: number;
    reviews_count?: number;
  };
}

export const TutorCard = ({ tutor }: TutorCardProps) => {
  const initials = `${tutor.first_name?.[0] || ''}${tutor.last_name?.[0] || ''}`;
  const minRate = Math.min(...tutor.skills.map(s => s.hourly_rate));
  const maxRate = Math.max(...tutor.skills.map(s => s.hourly_rate));
  const rateDisplay = minRate === maxRate ? `R${minRate}` : `R${minRate}-${maxRate}`;

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={tutor.avatar_url} alt={`${tutor.first_name} ${tutor.last_name}`} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">
              {tutor.first_name} {tutor.last_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              {tutor.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{tutor.location}</span>
                </div>
              )}
            </div>
            {tutor.rating && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{tutor.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({tutor.reviews_count} reviews)
                </span>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {tutor.bio}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {tutor.skills.slice(0, 3).map((skill) => (
            <Badge key={skill.id} variant="secondary" className="text-xs">
              {skill.name}
            </Badge>
          ))}
          {tutor.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tutor.skills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-lg font-semibold">
            <DollarSign className="h-4 w-4" />
            <span>{rateDisplay}</span>
            <span className="text-sm font-normal text-muted-foreground">/hour</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Available</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link to={`/tutors/${tutor.id}`}>
            View Profile & Book
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};