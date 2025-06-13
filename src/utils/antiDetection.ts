
// Browser-compatible anti-detection utilities
export class AntiDetectionUtil {
  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  ];

  async getRandomUserAgent(): Promise<string> {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async humanLikeClick(page: any, selector: string): Promise<void> {
    console.log(`Mock human-like click on ${selector}`);
    // In browser environment, this would delegate to server
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
  }

  async humanLikeType(page: any, selector: string, text: string): Promise<void> {
    console.log(`Mock human-like typing "${text}" into ${selector}`);
    // Simulate typing delay
    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    }
  }

  async humanLikeClickPuppeteer(page: any, selector: string): Promise<void> {
    return this.humanLikeClick(page, selector);
  }

  async humanLikeTypePuppeteer(page: any, selector: string, text: string): Promise<void> {
    return this.humanLikeType(page, selector, text);
  }

  generateRandomDelay(min: number = 1000, max: number = 3000): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async randomWait(min: number = 1000, max: number = 3000): Promise<void> {
    const delay = this.generateRandomDelay(min, max);
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}
