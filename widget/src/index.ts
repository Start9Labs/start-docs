export {};

/**
 * StartOS Docs Support Agent Widget
 * Vanilla TypeScript - no framework dependencies
 */

// Types
type Config = {
  apiBaseUrl: string;
  position?: "bottom-right" | "bottom-left";
};

type Session = {
  token: string;
  sessionId: string;
};

type Chat = {
  chat_id: string;
  created_at: string;
  messages?: Array<{ role: string; content: string }>;
};

type Message = {
  id?: string;
  role: "user" | "assistant";
  content: string;
};

// API Client
class DocsAgentAPI {
  constructor(private baseUrl: string) {}

  private getHeaders(token?: string): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async exchangeCode(code: string): Promise<Session> {
    const res = await fetch(`${this.baseUrl}/auth/exchange`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ code }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Exchange failed" }));
      throw new Error(err.error || "Exchange failed");
    }
    const data = await res.json();
    return { token: data.session_token, sessionId: data.session_id };
  }

  async createChat(token: string): Promise<Chat> {
    const res = await fetch(`${this.baseUrl}/chats`, {
      method: "POST",
      headers: this.getHeaders(token),
    });
    if (!res.ok) {
      if (res.status === 401) throw new Error("Unauthorized");
      const err = await res
        .json()
        .catch(() => ({ error: "Failed to create chat" }));
      throw new Error(err.error || "Failed to create chat");
    }
    return res.json();
  }

  async getChat(token: string, chatId: string): Promise<Chat> {
    const res = await fetch(`${this.baseUrl}/chats/${chatId}`, {
      headers: this.getHeaders(token),
    });
    if (!res.ok) {
      if (res.status === 401) throw new Error("Unauthorized");
      throw new Error("Failed to fetch chat");
    }
    return res.json();
  }

  async sendMessage(
    token: string,
    chatId: string,
    content: string,
    onText: (text: string) => void,
    onDone: () => void,
    onError: (err: string) => void,
  ): Promise<void> {
    const res = await fetch(`${this.baseUrl}/chats/${chatId}/messages`, {
      method: "POST",
      headers: this.getHeaders(token),
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      if (res.status === 401) {
        onError("Unauthorized");
        return;
      }
      const err = await res
        .json()
        .catch(() => ({ error: "Failed to send message" }));
      onError(err.error || "Failed to send message");
      return;
    }

    const reader = res.body?.getReader();
    if (!reader) {
      onError("Streaming not supported");
      return;
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          const event = line.slice(7);
          if (event === "done") {
            onDone();
            return;
          } else if (event === "error") {
            onError("Stream error");
            return;
          }
        } else if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) {
              onText(data.text);
            } else if (data.error) {
              onError(data.error);
              return;
            }
          } catch {}
        }
      }
    }
    onDone();
  }
}

// Widget
class DocsAgentWidget {
  private api: DocsAgentAPI;
  private container: HTMLElement | null = null;
  private isOpen = false;
  private isLoading = false;
  private isStreaming = false;
  private shouldAutoScroll = true;
  private messages: Message[] = [];
  private session: Session | null = null;
  private chatId: string | null = null;
  private needsAccessCode = false;
  private position: "bottom-right" | "bottom-left";
  private storageKey = "docs-agent-session";
  private inputEl!: HTMLTextAreaElement;

  constructor(private config: Config) {
    this.api = new DocsAgentAPI(config.apiBaseUrl);
    this.position = config.position || "bottom-right";
    this.loadSession();
    this.init();
  }

  private loadSession(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.session = data.session;
        this.chatId = data.chatId;
        this.messages = data.messages || [];
      }
    } catch {}

    if (!this.session) {
      this.needsAccessCode = true;
    } else if (this.chatId && this.messages.length === 0) {
      // Have a chat but no messages (maybe localStorage was partial) - fetch from server
      this.fetchChatHistory();
    }
  }

  private saveSession(): void {
    if (this.session) {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          session: this.session,
          chatId: this.chatId,
          messages: this.messages,
        }),
      );
    }
  }

  private async fetchChatHistory(): Promise<void> {
    if (!this.session || !this.chatId) return;

    try {
      const chat = await this.api.getChat(this.session.token, this.chatId);
      if (chat.messages) {
        this.messages = chat.messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));
        this.saveSession();
        this.render();
      }
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        this.logout();
        return;
      }
      // If fetch fails, just start fresh
      this.chatId = null;
      this.messages = [];
      this.saveSession();
    }
  }

  private logout(): void {
    this.session = null;
    this.chatId = null;
    this.messages = [];
    this.needsAccessCode = true;
    localStorage.removeItem(this.storageKey);
    this.render();
  }

  private init(): void {
    this.container = document.createElement("div");
    this.container.id = "docs-agent-widget";
    this.container.className = `da-widget da-${this.position}`;
    document.body.appendChild(this.container);
    this.render();
  }

  private render(): void {
    if (!this.container) return;
    this.container.innerHTML = this.isOpen
      ? this.renderOpen()
      : this.renderClosed();
    this.bindEvents();
  }

  private renderClosed(): string {
    return `
      <button class="da-fab" aria-label="Open support chat">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M3 5h4"/>
          <path d="M19 17v4"/>
          <path d="M17 19h4"/>
        </svg>
      </button>
    `;
  }

  private renderOpen(): string {
    return `
      <div class="da-panel">
        <div class="da-header">
          <span class="da-title">Start Bot</span>
          <div class="da-header-actions">
            ${
              this.session
                ? `
              <button class="da-logout-btn" title="Log out">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            `
                : ""
            }
            <button class="da-close-btn" aria-label="Minimize" title="Minimize">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 14 10 14 10 20"></polyline>
                <polyline points="20 10 14 10 14 4"></polyline>
                <line x1="14" y1="10" x2="21" y2="3"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="da-body">
          ${this.needsAccessCode ? this.renderAccessCodeForm() : this.renderChat()}
        </div>
      </div>
    `;
  }

  private renderAccessCodeForm(): string {
    return `
    <div class="da-access-code-form">
      <div class="da-access-code-info">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
          <path d="M5 3v4"/>
          <path d="M3 5h4"/>
          <path d="M19 17v4"/>
          <path d="M17 19h4"/>
        </svg>
        <h3>Meet Start Bot</h3>
        <p>Your AI assistant for all things StartOS. Enter your support access code to start chatting.</p>
      </div>
      <form class="da-code-form">
        <input 
          type="text" 
          class="da-code-input" 
          placeholder="Access code"
          autocomplete="off"
          autocapitalize="off"
        />
        <button type="submit" class="da-code-submit">
          Continue
        </button>
      </form>
    </div>
  `;
  }

  private renderChat(): string {
    const messagesHtml =
      this.messages.length === 0
        ? `<div class="da-welcome">
        <p>Hi, I'm Start Bot. Ask me anything about StartOS.</p>
      </div>`
        : this.messages.map((m) => this.renderMessage(m)).join("");

    return `
      <div class="da-messages">${messagesHtml}</div>
      <div class="da-input-area">
        <div class="da-input-row">
          <textarea 
            class="da-input" 
            placeholder="Ask a question..." 
            rows="1"
            ${this.isLoading || this.isStreaming ? "disabled" : ""}
          ></textarea>
          <button class="da-send-btn" ${this.isLoading || this.isStreaming ? "disabled" : ""}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div class="da-input-footer">
          ${this.messages.length > 0 ? `<button class="da-end-chat-btn">End chat</button>` : ""}
        </div>
      </div>
    `;
  }

  private renderMessage(message: Message): string {
    const isUser = message.role === "user";
    const contentHtml = isUser
      ? this.escapeHtml(message.content)
      : this.renderMarkdown(message.content);
    const cursorHtml =
      this.isStreaming &&
      !isUser &&
      message === this.messages[this.messages.length - 1]
        ? '<span class="da-cursor"></span>'
        : "";
    return `
      <div class="da-message da-message-${message.role}">
        <div class="da-message-content">${contentHtml}${cursorHtml}</div>
      </div>
    `;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  private renderMarkdown(text: string): string {
    // Simple markdown: code blocks, inline code, links, bold, italic
    let html = this.escapeHtml(text);

    // Code blocks
    html = html.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      "<pre><code>$2</code></pre>",
    );

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Line breaks
    html = html.replace(/\n/g, "<br>");

    return html;
  }

  private bindEvents(): void {
    if (!this.container) return;

    const fab = this.container.querySelector(".da-fab");
    fab?.addEventListener("click", () => this.toggle());

    const closeBtn = this.container.querySelector(".da-close-btn");
    closeBtn?.addEventListener("click", () => this.toggle());

    const logoutBtn = this.container.querySelector(".da-logout-btn");
    logoutBtn?.addEventListener("click", () => this.logout());

    // Access code form
    const codeForm = this.container.querySelector(".da-code-form");
    codeForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleAccessCodeSubmit();
    });

    const codeInput = this.container.querySelector(
      ".da-code-input",
    ) as HTMLInputElement;
    codeInput?.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });

    // Chat input
    this.inputEl = this.container.querySelector(
      ".da-input",
    ) as HTMLTextAreaElement;
    if (this.inputEl) {
      this.inputEl.addEventListener("keydown", (e) => {
        e.stopPropagation();
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.handleSend();
        }
      });
      this.inputEl.addEventListener("input", () => this.autoResizeInput());
    }

    const sendBtn = this.container.querySelector(".da-send-btn");
    sendBtn?.addEventListener("click", () => this.handleSend());

    const endChatBtn = this.container.querySelector(".da-end-chat-btn");
    endChatBtn?.addEventListener("click", () => this.endChat());

    // Track scroll to detect user scroll-up during streaming
    const messagesEl = this.container.querySelector(".da-messages");
    if (messagesEl) {
      messagesEl.addEventListener("scroll", () => {
        if (!this.isStreaming) return;

        const { scrollTop, scrollHeight, clientHeight } = messagesEl;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

        // If user scrolls up during streaming, stop auto-scroll
        if (!isAtBottom) {
          this.shouldAutoScroll = false;
        }
      });
    }
  }

  private toggle(): void {
    this.isOpen = !this.isOpen;
    this.render();
    if (this.isOpen && this.inputEl) {
      this.inputEl.focus();
    }
  }

  private autoResizeInput(): void {
    if (!this.inputEl) return;
    this.inputEl.style.height = "40px"; // Reset to single line
    if (this.inputEl.scrollHeight > 40) {
      this.inputEl.style.height =
        Math.min(this.inputEl.scrollHeight, 120) + "px";
    }
  }

  private updateSendButton(): void {
    const btn = this.container?.querySelector(
      ".da-send-btn",
    ) as HTMLButtonElement;
    if (btn) {
      btn.disabled = this.isLoading || this.isStreaming;
    }
  }

  private scrollToBottom(): void {
    requestAnimationFrame(() => {
      const messagesEl = this.container?.querySelector(".da-messages");
      if (messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    });
  }

  private async handleAccessCodeSubmit(): Promise<void> {
    const input = this.container?.querySelector(
      ".da-code-input",
    ) as HTMLInputElement;
    const code = input?.value.trim();
    if (!code) return;

    const submitBtn = this.container?.querySelector(
      ".da-code-submit",
    ) as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Verifying...";
    }

    try {
      this.session = await this.api.exchangeCode(code);
      this.needsAccessCode = false;
      this.saveSession();
      this.render();
    } catch (err: any) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "Continue";
      }
      this.showError(err.message || "Invalid access code");
    }
  }

  private async handleSend(): Promise<void> {
    const content = this.inputEl.value.trim();
    if (!content || this.isLoading || this.isStreaming) return;

    this.inputEl.value = "";
    this.autoResizeInput();
    this.updateSendButton();

    if (!this.session) {
      this.needsAccessCode = true;
      this.render();
      return;
    }

    if (!this.chatId) {
      try {
        const chat = await this.api.createChat(this.session.token);
        this.chatId = chat.chat_id;
        this.saveSession();
      } catch (err: any) {
        if (err.message === "Unauthorized") {
          this.logout();
          return;
        }
        this.showError(err.message);
        return;
      }
    }

    // Add user message
    this.messages.push({ role: "user", content });
    this.saveSession();
    this.render();
    this.scrollToBottom(); // Always scroll when user sends a message

    // Add placeholder for assistant
    this.messages.push({ role: "assistant", content: "" });
    this.isStreaming = true;
    this.shouldAutoScroll = true; // Reset auto-scroll for new response
    this.render();

    try {
      await this.api.sendMessage(
        this.session.token,
        this.chatId,
        content,
        (text) => {
          const lastMsg = this.messages[this.messages.length - 1];
          if (lastMsg.role === "assistant") {
            lastMsg.content += text;
            this.updateLastMessage();
          }
        },
        () => {
          this.isStreaming = false;
          this.saveSession();

          // Save scroll position before render
          const messagesEl = this.container?.querySelector(".da-messages");
          const scrollPos = messagesEl?.scrollTop || 0;

          this.render();

          // Restore scroll position after render
          requestAnimationFrame(() => {
            const newMessagesEl = this.container?.querySelector(".da-messages");
            if (newMessagesEl) {
              newMessagesEl.scrollTop = scrollPos;
            }
          });
        },
        (err) => {
          if (err === "Unauthorized") {
            this.logout();
            return;
          }
          this.isStreaming = false;
          const lastMsg = this.messages[this.messages.length - 1];
          if (lastMsg.role === "assistant" && !lastMsg.content) {
            lastMsg.content = "Sorry, something went wrong. Please try again.";
          }
          this.saveSession();
          this.render();
        },
      );
    } catch (err: any) {
      if (err.message === "Unauthorized") {
        this.logout();
        return;
      }
      this.isStreaming = false;
      this.showError(err.message);
      this.render();
    }
  }

  private updateLastMessage(): void {
    const messagesEl = this.container?.querySelector(".da-messages");
    const lastMsgEl = messagesEl?.querySelector(
      ".da-message:last-child .da-message-content",
    );
    const lastMsg = this.messages[this.messages.length - 1];
    if (lastMsgEl && lastMsg) {
      lastMsgEl.innerHTML =
        this.renderMarkdown(lastMsg.content) +
        '<span class="da-cursor"></span>';

      // Only scroll if user hasn't scrolled up
      if (this.shouldAutoScroll && messagesEl) {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    }
  }

  private endChat(): void {
    if (this.messages.length > 0 && !confirm("End this chat?")) {
      return;
    }
    this.chatId = null;
    this.messages = [];
    this.saveSession();
    this.render();
  }

  private showError(message: string): void {
    const existingError = this.container?.querySelector(".da-error");
    existingError?.remove();

    const errorEl = document.createElement("div");
    errorEl.className = "da-error";
    errorEl.textContent = message;

    const body = this.container?.querySelector(".da-body");
    body?.insertBefore(errorEl, body.firstChild);

    setTimeout(() => errorEl.remove(), 5000);
  }
}

// Initialize
declare global {
  interface Window {
    DocsAgentConfig?: Config;
    DocsAgent?: DocsAgentWidget;
  }
}

function init() {
  if (window.DocsAgentConfig) {
    window.DocsAgent = new DocsAgentWidget(window.DocsAgentConfig);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
