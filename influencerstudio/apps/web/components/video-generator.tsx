'use client'

import React, { useState } from 'react'
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui'
import { useAction } from 'convex/react'
import { useToast } from './toaster'

interface VideoGeneratorProps {
    avatarId: string
    avatarImageUrl: string
    avatarName: string
    onVideoGenerated?: (videoUrl: string) => void
}

const ELEVENLABS_VOICES = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'American, Female, Middle-aged' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'British, Male, Mature' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'American, Male, Deep' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', description: 'American, Female, Soft' },
    { id: 'MF3mGyEYCl7XYWbV9V6O', name: 'Elli', description: 'American, Female, Young' },
]

export function VideoGenerator({ avatarId, avatarImageUrl, avatarName, onVideoGenerated }: VideoGeneratorProps) {
    const [script, setScript] = useState('')
    const [videoPrompt, setVideoPrompt] = useState('a person is talking with natural hand gestures')
    const [voiceId, setVoiceId] = useState(ELEVENLABS_VOICES[0].id)
    const [generating, setGenerating] = useState(false)
    const [progress, setProgress] = useState('')
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)

    const { push: toast } = useToast()
    const generateVideo = useAction('avatars:generateVideo' as any) // Will be created in next step

    const handleGenerate = async () => {
        if (!script.trim()) {
            toast({ title: 'Script required', description: 'Please enter a script for the avatar to speak', variant: 'destructive' })
            return
        }

        setGenerating(true)
        setProgress('Starting video generation...')
        setGeneratedVideoUrl(null)

        try {
            setProgress('Converting script to speech...')

            const result = await generateVideo({
                avatarId,
                script: script.trim(),
                videoPrompt: videoPrompt.trim(),
                voiceId
            })

            setProgress('Video generated successfully!')
            setGeneratedVideoUrl(result.videoUrl)

            toast({
                title: 'Video generated!',
                description: `Duration: ${result.durationSec}s`,
                variant: 'success'
            })

            if (onVideoGenerated) {
                onVideoGenerated(result.videoUrl)
            }
        } catch (error) {
            console.error('Video generation error:', error)
            toast({
                title: 'Generation failed',
                description: error instanceof Error ? error.message : 'Unknown error',
                variant: 'destructive'
            })
            setProgress('')
        } finally {
            setGenerating(false)
        }
    }

    const handleGenerateScript = async () => {
        // Optional: Use LLM to generate a script
        toast({ title: 'Script generation', description: 'AI script generation coming soon!', variant: 'default' })
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Generate Video for {avatarName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Voice Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Voice</label>
                        <select
                            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                            value={voiceId}
                            onChange={(e) => setVoiceId(e.target.value)}
                            disabled={generating}
                        >
                            {ELEVENLABS_VOICES.map((voice) => (
                                <option key={voice.id} value={voice.id}>
                                    {voice.name} - {voice.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Script Input */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Script</label>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleGenerateScript}
                                disabled={generating}
                            >
                                Generate with AI
                            </Button>
                        </div>
                        <textarea
                            className="h-32 w-full rounded-md border bg-background p-3 text-sm outline-none resize-none"
                            placeholder="Enter the script for your avatar to speak..."
                            value={script}
                            onChange={(e) => setScript(e.target.value)}
                            disabled={generating}
                            maxLength={500}
                        />
                        <p className="text-xs text-muted-foreground text-right">
                            {script.length}/500 characters
                        </p>
                    </div>

                    {/* Video Prompt */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Video Prompt</label>
                        <Input
                            placeholder="e.g., a person talking with hand gestures"
                            value={videoPrompt}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVideoPrompt(e.target.value)}
                            disabled={generating}
                        />
                        <p className="text-xs text-muted-foreground">
                            Describe the action/movement for the avatar
                        </p>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={generating || !script.trim()}
                        className="w-full"
                    >
                        {generating ? 'Generating...' : 'Generate Video'}
                    </Button>

                    {/* Progress */}
                    {progress && (
                        <div className="rounded-md bg-muted p-3 text-sm">
                            {progress}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {generatedVideoUrl ? (
                        <div className="space-y-3">
                            <video
                                src={generatedVideoUrl}
                                controls
                                className="w-full rounded-lg"
                                poster={avatarImageUrl}
                            />
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => window.open(generatedVideoUrl, '_blank')}
                                >
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => {
                                        setGeneratedVideoUrl(null)
                                        setScript('')
                                    }}
                                >
                                    New Video
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-64 items-center justify-center rounded-lg bg-muted">
                            <p className="text-sm text-muted-foreground">
                                Generated video will appear here
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
