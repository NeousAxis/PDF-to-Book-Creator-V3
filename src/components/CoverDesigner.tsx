import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { Upload, Wand2, Image as ImageIcon, Loader2, CheckCircle } from 'lucide-react';
import { CoverDesign } from '@/types';

interface CoverDesignerProps {
  onCoverDesigned: (design: CoverDesign) => void;
  bookTitle?: string;
  authorName?: string;
}

const CoverDesigner: React.FC<CoverDesignerProps> = ({
  onCoverDesigned,
  bookTitle = '',
  authorName = ''
}) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentAuthorName, setCurrentAuthorName] = useState(authorName);
  const [currentBookTitle, setCurrentBookTitle] = useState(bookTitle);
  const [backCoverText, setBackCoverText] = useState('');
  const [authorBio, setAuthorBio] = useState('');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const generateCoverWithAI = async () => {
    if (!generationPrompt.trim()) {
      setError('Please enter a description for your cover');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await fetch('/api/generate-cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: generationPrompt,
          bookTitle,
          authorName,
          style: 'professional'
        })
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (!response.ok) {
        throw new Error('Failed to generate cover');
      }

      const data = await response.json();
      
      // For now, we'll simulate a successful generation
      setSuccess('Cover generated successfully! (Note: AI generation will be implemented with OpenAI API)');
      setImagePreview('/api/placeholder/400/600'); // Placeholder for now
      
    } catch (err) {
      setError('Failed to generate cover. Please try again.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  };

  const handleSaveDesign = () => {
    const design: CoverDesign = {
      frontImage: coverImage || imagePreview,
      backText: backCoverText,
      authorBio: authorBio,
      spineWidth: 0.5,
      backCoverGenerated: !!backCoverText,
      backCoverData: backCoverText ? {
        description: backCoverText,
        authorBio: authorBio,
        isbn: '',
        publisher: 'Self-Published',
        category: 'General'
      } : undefined
    };

    onCoverDesigned(design);
    setSuccess('Cover design saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Design Your Book Cover</h2>
        <p className="text-muted-foreground">
          Upload your own image or generate one with AI
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Cover Creation */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Image
              </TabsTrigger>
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                AI Generate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Upload Cover Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                      isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {isDragActive ? 'Drop image here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supports JPG, PNG, WebP (max 10MB)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="generate" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    AI Cover Generation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">Describe your ideal cover</Label>
                    <Textarea
                      id="prompt"
                      placeholder="e.g., A mysterious forest at twilight with ancient trees and glowing lights, fantasy book cover style..."
                      value={generationPrompt}
                      onChange={(e) => setGenerationPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Generating your cover...</span>
                      </div>
                      <Progress value={generationProgress} className="w-full" />
                    </div>
                  )}
                  
                  <Button 
                    onClick={generateCoverWithAI}
                    disabled={isGenerating || !generationPrompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Cover
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Book Details Section */}
          <Card>
            <CardHeader>
              <CardTitle>Book Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bookTitle">Book Title</Label>
                <Input
                  id="bookTitle"
                  value={currentBookTitle}
                  onChange={(e) => setCurrentBookTitle(e.target.value)}
                  placeholder="Enter your book title"
                />
              </div>
              <div>
                <Label htmlFor="authorName">Author Name</Label>
                <Input
                  id="authorName"
                  value={currentAuthorName}
                  onChange={(e) => setCurrentAuthorName(e.target.value)}
                  placeholder="Enter author name"
                />
              </div>
            </CardContent>
          </Card>

          {/* Back Cover Content */}
          <Card>
            <CardHeader>
              <CardTitle>Back Cover Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="backText">Book Description</Label>
                <Textarea
                  id="backText"
                  placeholder="Enter a compelling description for the back cover..."
                  value={backCoverText}
                  onChange={(e) => setBackCoverText(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="authorBio">Author Bio</Label>
                <Textarea
                  id="authorBio"
                  placeholder="Brief author biography..."
                  value={authorBio}
                  onChange={(e) => setAuthorBio(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cover Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[2/3] bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                    <p>Cover preview will appear here</p>
                  </div>
                )}
              </div>
              
              {(coverImage || imagePreview) && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <strong>Title:</strong> {bookTitle || 'Your Book Title'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <strong>Author:</strong> {authorName || 'Author Name'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button 
            onClick={handleSaveDesign}
            disabled={!coverImage && !imagePreview}
            className="w-full"
            size="lg"
          >
            Save Cover Design
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CoverDesigner;
