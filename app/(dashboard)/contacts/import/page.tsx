/**
 * CSV import page for contacts
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, FileText, CheckCircle, XCircle } from 'lucide-react';
import { useImportContacts } from '@/lib/api/hooks/useContacts';

interface ImportResult {
  created: number;
  errors: string[];
}

interface ParsedRow {
  name: string;
  email: string;
  phone?: string;
  status?: string;
}

export default function ContactImportPage() {
  const router = useRouter();
  const { importContacts, isLoading: importing } = useImportContacts();

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [hasHeader, setHasHeader] = useState(true);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setFile(file);
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((line) => line.trim());

      if (lines.length < 2) {
        toast.error('CSV file is empty or invalid');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const rows: ParsedRow[] = [];

      // Preview first 5 rows
      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        const values = lines[i].split(',').map((v) => v.trim());
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        const parsedRow: ParsedRow = {
          name: row['name'] || '',
          email: row['email'] || '',
          phone: row['phone'] || row['phone number'] || '',
          status: row['status'] || 'LEAD',
        };

        rows.push(parsedRow);
      }

      setPreview(rows);
      toast.success('File loaded successfully');
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      const result = await importContacts(file, hasHeader);

      setResult(result);

      if (result.errors.length === 0) {
        toast.success(`Successfully imported ${result.created} contacts`);
      } else {
        toast.warning(`Imported ${result.created} contacts with ${result.errors.length} errors`);
      }
    } catch (error) {
      // error already shown via toast
      toast.error(error instanceof Error ? error.message : 'Import failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Import Contacts</h1>
        <p className="text-gray-600 mt-1">Upload a CSV file to import contacts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop your CSV file here, or click to browse
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Choose File
            </Button>
            {file && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
              </div>
            )}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">CSV Format Requirements:</p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Required columns: name, email</li>
              <li>Optional columns: phone, status</li>
              <li>First row should contain column headers</li>
              <li>Status values: ACTIVE, INACTIVE, LEAD, CUSTOMER</li>
            </ul>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="has-header"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="has-header" className="text-sm text-gray-700">
              File has header row
            </label>
          </div>
        </CardContent>
      </Card>

      {preview.length > 0 && !result && (
        <Card>
          <CardHeader>
            <CardTitle>Preview (first 5 rows)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Phone</th>
                    <th className="text-left py-2 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{row.name}</td>
                      <td className="py-2 px-4">{row.email}</td>
                      <td className="py-2 px-4">{row.phone || '-'}</td>
                      <td className="py-2 px-4">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleImport} disabled={importing}>
                {importing ? 'Importing...' : 'Start Import'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {importing && (
        <Card>
          <CardHeader>
            <CardTitle>Importing...</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={50} className="mb-2" />
            <p className="text-sm text-gray-600">Processing your file...</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Import Complete</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{result.created} successful</span>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">{result.errors.length} failed</span>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Errors:</h4>
                <div className="bg-red-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                  {result.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-800">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={() => router.push('/contacts')}>View Contacts</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                  setResult(null);
                }}
              >
                Import Another File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
