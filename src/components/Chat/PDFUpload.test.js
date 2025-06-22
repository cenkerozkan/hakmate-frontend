import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PDFUpload from './PDFUpload';
import { ChatAPI } from '../../api/apiChat';

// Mock the ChatAPI
jest.mock('../../api/apiChat', () => ({
  ChatAPI: {
    uploadPDF: jest.fn(),
  },
}));

describe('PDFUpload Component', () => {
  const mockProps = {
    chatId: 'test-chat-id',
    disabled: false,
    onUploadSuccess: jest.fn(),
    onUploadError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload button when not disabled', () => {
    render(<PDFUpload {...mockProps} />);
    const uploadButton = screen.getByRole('button');
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).not.toBeDisabled();
  });

  it('disables upload button when disabled prop is true', () => {
    render(<PDFUpload {...mockProps} disabled={true} />);
    const uploadButton = screen.getByRole('button');
    expect(uploadButton).toBeDisabled();
  });

  it('shows loading state when uploading', async () => {
    ChatAPI.uploadPDF.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<PDFUpload {...mockProps} />);
    const uploadButton = screen.getByRole('button');
    
    // Create a mock file
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    // Should show loading state
    expect(uploadButton).toBeDisabled();
  });

  it('validates file type and shows error for non-PDF files', () => {
    render(<PDFUpload {...mockProps} />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('Sadece PDF dosyaları yüklenebilir')).toBeInTheDocument();
  });

  it('validates file size and shows error for large files', () => {
    render(<PDFUpload {...mockProps} />);
    
    // Create a mock file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [largeFile] } });
    
    expect(screen.getByText(/PDF dosyası çok büyük/)).toBeInTheDocument();
  });

  it('calls onUploadSuccess when upload is successful', async () => {
    const mockSuccessResponse = { success: true, message: 'Upload successful' };
    ChatAPI.uploadPDF.mockResolvedValue(mockSuccessResponse);
    
    render(<PDFUpload {...mockProps} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockProps.onUploadSuccess).toHaveBeenCalledWith(mockSuccessResponse);
    });
  });

  it('calls onUploadError when upload fails', async () => {
    const mockError = new Error('Upload failed');
    ChatAPI.uploadPDF.mockRejectedValue(mockError);
    
    render(<PDFUpload {...mockProps} />);
    
    const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByDisplayValue('');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockProps.onUploadError).toHaveBeenCalledWith(mockError);
    });
  });
}); 