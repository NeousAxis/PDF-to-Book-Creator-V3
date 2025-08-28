import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { DocumentFile } from '@/types';

interface FileUploadProps {
  onFileUploaded: (file: DocumentFile) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
}

<<<<<<< HEAD
=======
// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

>>>>>>> aec467ed3928a3c06b776f5151452efa07227606
const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  acceptedFileTypes = ['.pdf', '.docx', '.odt'],
  maxFileSize = 50 * 1024 * 1024 // 50MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<DocumentFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size exceeds ${Math.round(maxFileSize / (1024 * 1024))}MB limit`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `File type ${fileExtension} is not supported. Please upload ${acceptedFileTypes.join(', ')} files.`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<DocumentFile> => {
    const formData = new FormData();
    formData.append('pdf', file);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
<<<<<<< HEAD
          try {
            const response = JSON.parse(xhr.responseText);
            const documentFile: DocumentFile = {
              file,
              type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'odt',
              pages: 0, // Will be calculated later
              validationStatus: 'normalized'
            };
            resolve(documentFile);
          } catch (parseError) {
            reject(new Error('Invalid server response'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.error || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
=======
          const response = JSON.parse(xhr.responseText);
          const documentFile: DocumentFile = {
            file,
            type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.docx') ? 'docx' : 'odt',
            pages: 0, // Will be calculated by backend
            validationStatus: 'normalized'
          };
          resolve(documentFile);
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
>>>>>>> aec467ed3928a3c06b776f5151452efa07227606
        }
      });

      xhr.addEventListener('error', () => {
<<<<<<< HEAD
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', '/api/upload-pdf');
=======
        reject(new Error('Network error during upload'));
      });

      // Use the configured API base URL
      xhr.open('POST', `${API_BASE_URL}/api/upload-pdf`);
>>>>>>> aec467ed3928a3c06b776f5151452efa07227606
      xhr.send(formData);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploadProgress(0);

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      const documentFile = await uploadFile(file);
      setUploadedFile(documentFile);
      onFileUploaded(documentFile);
    } catch (err) {
<<<<<<< HEAD
=======
      console.error('Upload error:', err);
>>>>>>> aec467ed3928a3c06b776f5151452efa07227606
      setError('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onFileUploaded, maxFileSize, acceptedFileTypes]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.oasis.opendocument.text': ['.odt']
    },
    multiple: false,
    disabled: uploading || !!uploadedFile
  });

  const resetUpload = () => {
    setUploadedFile(null);
    setError(null);
    setUploadProgress(0);
  };

  if (uploadedFile) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-green-800">File uploaded successfully!</h3>
              <p className="text-sm text-green-600">
                {uploadedFile.file.name} ({Math.round(uploadedFile.file.size / 1024)} KB)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Type: {uploadedFile.type.toUpperCase()} • Status: {uploadedFile.validationStatus}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetUpload}>
              Upload Different File
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : uploading
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Uploading your document...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-sm text-muted-foreground">{uploadProgress}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? 'Drop your document here' : 'Upload your document'}
                </p>
                <p className="text-muted-foreground">
                  Drag & drop a PDF, DOCX, or ODT file here, or click to browse
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                <span className="bg-gray-100 px-2 py-1 rounded">PDF</span>
                <span className="bg-gray-100 px-2 py-1 rounded">DOCX</span>
                <span className="bg-gray-100 px-2 py-1 rounded">ODT</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Max {Math.round(maxFileSize / (1024 * 1024))}MB</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
