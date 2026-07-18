import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from './chat.service';
import { ChatMessage } from './chat.model';

@Component({
    selector: 'app-root',
    imports: [FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  messages = signal<ChatMessage[]>([]);
  draft = '';
  sending = signal(false);
  error = signal<string | null>(null);

  constructor(private chatService: ChatService) {}

  async send(): Promise<void> {
    const text = this.draft.trim();
    if (!text || this.sending()) return;

    this.error.set(null);
    this.draft = '';
    this.messages.update((msgs) => [...msgs, { role: 'user', content: text }]);
    this.messages.update((msgs) => [...msgs, { role: 'assistant', content: '' }]);
    this.sending.set(true);

    try {
      await this.chatService.streamReply(this.messages().slice(0, -1), (chunk) => {
        this.messages.update((msgs) => {
          const copy = [...msgs];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      });
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
    } finally {
      this.sending.set(false);
    }
  }
}
