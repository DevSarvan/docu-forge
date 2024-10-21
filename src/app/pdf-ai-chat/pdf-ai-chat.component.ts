import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
    MatFormFieldModule,
    MatIconModule,
    PdfViewerModule,
    LoaderComponent,
  ],
  templateUrl: './pdf-ai-chat.component.html',
  styleUrls: ['./pdf-ai-chat.component.scss'],
})
export class PdfAiChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessages') private chatMessagesContainer!: ElementRef;

  pdfSrc: string | null = null;
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

  ngAfterViewChecked() { 
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop =
        this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('file', file);
      

     // TODO: Replace with your actual upload API endpoint
      this.http.post('http://localhost:8080/api/pdf/upload', formData).subscribe({
        next: (response: any) => {
          console.log('PDF uploaded successfully', response);
          this.messages.push({ text: response.summary, isUser: false });
         // this.pdfSrc = response.pdfUrl; // Assuming the API returns the URL of the uploaded PDF
         if (file) {
          const reader = new FileReader();
          reader.onload = (event: ProgressEvent<FileReader>) => {
            this.pdfSrc = event.target?.result as string;
          };
          reader.readAsDataURL(file);
          this.isLoading = false;
        }
          this.isLoading = false;
          console.log(this.messages);
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
      // let urlSearchParams = new URLSearchParams();
      // urlSearchParams.append('query', this.currentMessage);
      // TODO: Replace with your actual AI chat API endpoint 
      this.http.post('http://localhost:8080/api/pdf/chat?query='+this.currentMessage, { }).subscribe({
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

  adjustTextareaHeight(event: any): void {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
