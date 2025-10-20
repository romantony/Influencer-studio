import { Card, CardContent, CardHeader, CardTitle, Input, Button } from '@/components/ui';

export default function SettingsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage storage, integrations, and API keys.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AWS S3 storage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="S3 bucket" defaultValue="influencerstudio-dev" />
            <Input placeholder="Region" defaultValue="us-east-1" />
            <Button>Save</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>StoryStudio API</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Base URL" defaultValue={process.env.STORYSTUDIO_API_BASE_URL ?? ''} />
            <Input placeholder="API key" defaultValue="sk-demo" />
            <Button>Save</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
