'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button, Input } from '@/components/ui';
import { useToast } from './toaster';

interface MediaUploaderProps {
  onUploaded(key: string): void;
}

export function MediaUploader({ onUploaded }: MediaUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  async function upload() {
    if (!file) return;
    setUploading(true);
    try {
      const key = `users/mock/uploads/${Date.now()}-${file.name}`;
      const { data } = await axios.post('/api/storage/presign', {
        key,
        contentType: file.type
      });
      await axios.put(data.uploadUrl, file, {
        headers: { 'Content-Type': file.type }
      });
      onUploaded(key);
      toast.push({ title: 'Upload complete', variant: 'success' });
    } catch (error) {
      console.error(error);
      toast.push({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="file"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setFile(event.target.files?.[0] ?? null)
        }
      />
      <Button onClick={upload} disabled={!file || uploading}>
        {uploading ? 'Uploading…' : 'Upload'}
      </Button>
    </div>
  );
}

