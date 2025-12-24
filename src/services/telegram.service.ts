import { BaseService } from './base.service';

interface TelegramSettings {
  telegram_base_url: string;
  telegram_token: string;
  telegram_group_id: string;
}

export class TelegramService extends BaseService {
  private async getSettings(): Promise<TelegramSettings> {
    const baseUrlSetting = await this.prisma.settings.findFirst({
      where: { slug: 'telegram_base_url', key: 'telegram_base_url' }
    });

    const tokenSetting = await this.prisma.settings.findFirst({
      where: { slug: 'telegram_token', key: 'telegram_token' }
    });

    const groupIdSetting = await this.prisma.settings.findFirst({
      where: { slug: 'telegram_group_id', key: 'telegram_group_id' }
    });

    if (!baseUrlSetting?.value || !tokenSetting?.value || !groupIdSetting?.value) {
      throw new Error('Telegram settings not configured properly');
    }

    return {
      telegram_base_url: baseUrlSetting.value,
      telegram_token: tokenSetting.value,
      telegram_group_id: groupIdSetting.value,
    };
  }

  async sendMessage(title: string, body: string): Promise<{ success: boolean; error?: string }> {
    try {
      const settings = await this.getSettings();

      // Format message with title and body
      const message = `📢 *${this.escapeMarkdown(title)}*\n\n${this.escapeMarkdown(body)}`;

      // Build Telegram API URL
      const url = `${settings.telegram_base_url}/bot${settings.telegram_token}/sendMessage`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: settings.telegram_group_id,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Telegram API error:', result);
        return {
          success: false,
          error: result.description || 'Failed to send Telegram message',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Escape special characters for Telegram Markdown
   */
  private escapeMarkdown(text: string): string {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  }

  /**
   * Send a notification and return status
   */
  async sendNotification(notification: {
    title: string;
    body: string;
  }): Promise<'success' | 'failed'> {
    const result = await this.sendMessage(notification.title, notification.body);
    return result.success ? 'success' : 'failed';
  }
}

export const telegramService = new TelegramService();
