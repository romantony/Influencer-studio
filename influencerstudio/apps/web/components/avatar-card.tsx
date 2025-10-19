import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@influencerstudio/ui';

interface AvatarCardProps {
  name: string;
  style: string;
  imageUrl: string;
  onSelect?: () => void;
}

export function AvatarCard({ name, style, imageUrl, onSelect }: AvatarCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="capitalize text-xs text-muted-foreground">
          {style} style avatar
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-muted">
          <Image src={imageUrl} alt={name} fill className="object-cover" />
        </div>
        {onSelect ? (
          <Button onClick={onSelect}>Use avatar</Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
