'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, X, ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ImageData {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

interface ImageGalleryProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
}

export function ImageGallery({ images, onImagesChange }: ImageGalleryProps) {
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [editingImage, setEditingImage] = useState<ImageData | null>(null);

  const addImage = () => {
    if (newImageUrl && newImageAlt) {
      const newImage: ImageData = {
        id: Date.now().toString(),
        url: newImageUrl,
        alt: newImageAlt,
        caption: newImageCaption || undefined,
      };
      onImagesChange([...images, newImage]);
      setNewImageUrl('');
      setNewImageAlt('');
      setNewImageCaption('');
      setIsAddingImage(false);
    }
  };

  const updateImage = (id: string, updates: Partial<ImageData>) => {
    onImagesChange(
      images.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
    setEditingImage(null);
  };

  const removeImage = (id: string) => {
    onImagesChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((image) => (
          <Dialog key={image.id}>
            <DialogTrigger asChild>
              <button
                className="relative group w-32 h-32 border rounded-lg overflow-hidden hover:border-primary transition-colors"
                onClick={() => setEditingImage(image)}
              >
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-white" />
                </div>
                <button
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(image.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Image</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Alt Text *</Label>
                  <Input
                    value={editingImage?.alt || image.alt}
                    onChange={(e) =>
                      setEditingImage(
                        editingImage
                          ? { ...editingImage, alt: e.target.value }
                          : { ...image, alt: e.target.value }
                      )
                    }
                    placeholder="Describe the image"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Textarea
                    value={editingImage?.caption || image.caption || ''}
                    onChange={(e) =>
                      setEditingImage(
                        editingImage
                          ? { ...editingImage, caption: e.target.value }
                          : { ...image, caption: e.target.value }
                      )
                    }
                    placeholder="Optional caption"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setEditingImage(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() =>
                      updateImage(image.id, {
                        alt: editingImage?.alt || image.alt,
                        caption: editingImage?.caption || image.caption,
                      })
                    }
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}

        {/* Add Image Button */}
        <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
          <DialogTrigger asChild>
            <button className="w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-accent/50 transition-colors">
              <Plus className="h-6 w-6" />
              <span className="text-xs">Add Image</span>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Image URL *</Label>
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Alt Text *</Label>
                <Input
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  placeholder="Describe the image for accessibility"
                />
              </div>
              <div className="space-y-2">
                <Label>Caption</Label>
                <Textarea
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  placeholder="Optional caption"
                  rows={2}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingImage(false);
                    setNewImageUrl('');
                    setNewImageAlt('');
                    setNewImageCaption('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addImage} disabled={!newImageUrl || !newImageAlt}>
                  Add Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
