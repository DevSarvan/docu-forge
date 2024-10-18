import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-pdf-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatFormFieldModule,
    PdfViewerModule,
    LoaderComponent,
  ],
  templateUrl: './pdf-ai-chat.component.html',
  styleUrls: ['./pdf-ai-chat.component.scss'],
})
export class PdfAiChatComponent implements OnInit {
  pdfSrc: string | Uint8Array | undefined | null = null;
  messages: { text: string; isUser: boolean }[] = [];
  currentMessage = '';
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Simulate loading assets
    setTimeout(() => {
      this.isLoading = false;
    }, 2000); // Change this to actual asset loading time
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('pdf', file);

      // TODO: Replace with your actual upload API endpoint
      this.http.post('/api/upload-pdf', formData).subscribe({
        next: (response: any) => {
          console.log('PDF uploaded successfully');
          this.pdfSrc = response.pdfUrl; // Assuming the API returns the URL of the uploaded PDF
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error uploading PDF:', error);
          this.isLoading = false;
        },
      });
    }
  }

  sendMessage(): void {
    if (this.currentMessage.trim()) {
      this.messages.push({ text: this.currentMessage, isUser: true });
      this.isLoading = true;

      // TODO: Replace with your actual AI chat API endpoint
      this.http.post('/api/chat', { message: this.currentMessage }).subscribe({
        next: (response: any) => {
          this.messages.push({ text: response.reply, isUser: false });
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.isLoading = false;
        },
      });

      this.currentMessage = '';
    }
  }
}
