import { AvatarCard } from '@/components/avatar-card';
import { MediaUploader } from '@/components/media-uploader';
import { Button } from '@influencerstudio/ui';

const mockAvatars = [
  {
    id: 'avatar-1',
    name: 'Luna Byte',
    style: 'cinematic',
    baseImageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80'
  }
];

export default function AvatarsPage() {
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Avatars</h1>
          <p className="text-sm text-muted-foreground">
            Generate AI avatars from text prompts or selfies.
          </p>
        </div>
        <Button>Create avatar</Button>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {mockAvatars.map((avatar) => (
          <AvatarCard key={avatar.id} name={avatar.name} style={avatar.style} imageUrl={avatar.baseImageUrl} />
        ))}
      </div>
      <div className="rounded-xl border border-dashed border-border p-6">
        <h2 className="text-lg font-semibold">Upload a selfie</h2>
        <p className="text-sm text-muted-foreground">
          We will stylize your selfie into the selected avatar aesthetic.
        </p>
        <MediaUploader onUploaded={(key) => console.log('Uploaded to', key)} />
      </div>
    </section>
  );
}
