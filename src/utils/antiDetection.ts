import { faker } from '@faker-js/faker';
import UserAgent from 'user-agents';

export class AntiDetectionUtil {
  private userAgentsList: string[] = [];

  constructor() {
    this.initializeUserAgents();
  }

  private initializeUserAgents(): void {
    // Generate a pool of realistic user agents
    for (let i = 0; i < 50; i++) {
      const userAgent = new UserAgent({ deviceCategory: 'desktop' });
      this.userAgentsList.push(userAgent.toString());
    }
  }

  async getRandomUserAgent(): Promise<string> {
    return faker.helpers.arrayElement(this.userAgentsList);
  }

  async getRandomDelay(min: number = 100, max: number = 300): Promise<number> {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async humanLikeType(page: any, selector: string, text: string): Promise<void> {
    await page.click(selector);
    await page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLInputElement;
      if (element) element.value = '';
    }, selector);

    for (const char of text) {
      const delay = await this.getRandomDelay(50, 150);
      await page.type(selector, char, { delay });
      
      // Random pauses to simulate thinking
      if (Math.random() < 0.1) {
        await page.waitForTimeout(await this.getRandomDelay(200, 500));
      }
    }
  }

  async humanLikeTypePuppeteer(page: any, selector: string, text: string): Promise<void> {
    await page.click(selector);
    await page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLInputElement;
      if (element) element.value = '';
    }, selector);

    for (const char of text) {
      const delay = await this.getRandomDelay(50, 150);
      await page.type(selector, char, { delay });
      
      // Random pauses to simulate thinking
      if (Math.random() < 0.1) {
        await page.waitForTimeout(await this.getRandomDelay(200, 500));
      }
    }
  }

  async humanLikeClick(page: any, selector: string): Promise<void> {
    // Move mouse to element before clicking
    const element = await page.$(selector);
    if (element) {
      const box = await element.boundingBox();
      if (box) {
        // Add some randomness to click position
        const x = box.x + box.width / 2 + (Math.random() - 0.5) * 10;
        const y = box.y + box.height / 2 + (Math.random() - 0.5) * 10;
        
        await page.mouse.move(x, y, { steps: faker.number.int({ min: 5, max: 15 }) });
        await page.waitForTimeout(await this.getRandomDelay(100, 300));
        await page.mouse.click(x, y);
      }
    }
  }

  async humanLikeClickPuppeteer(page: any, selector: string): Promise<void> {
    // Move mouse to element before clicking
    const element = await page.$(selector);
    if (element) {
      const box = await element.boundingBox();
      if (box) {
        // Add some randomness to click position
        const x = box.x + box.width / 2 + (Math.random() - 0.5) * 10;
        const y = box.y + box.height / 2 + (Math.random() - 0.5) * 10;
        
        await page.mouse.move(x, y, { steps: faker.number.int({ min: 5, max: 15 }) });
        await page.waitForTimeout(await this.getRandomDelay(100, 300));
        await page.mouse.click(x, y);
      }
    }
  }

  async simulateHumanBehavior(page: any): Promise<void> {
    // Random mouse movements
    const viewport = page.viewport();
    for (let i = 0; i < faker.number.int({ min: 2, max: 5 }); i++) {
      const x = faker.number.int({ min: 0, max: viewport.width });
      const y = faker.number.int({ min: 0, max: viewport.height });
      await page.mouse.move(x, y, { steps: faker.number.int({ min: 3, max: 10 }) });
      await page.waitForTimeout(await this.getRandomDelay(500, 1500));
    }

    // Random scrolling
    const scrollCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < scrollCount; i++) {
      const scrollDistance = faker.number.int({ min: 100, max: 500 });
      await page.evaluate((distance: number) => {
        window.scrollBy(0, distance);
      }, scrollDistance);
      await page.waitForTimeout(await this.getRandomDelay(300, 800));
    }
  }

  getRandomViewport(): { width: number; height: number } {
    const viewports = [
      { width: 1920, height: 1080 },
      { width: 1366, height: 768 },
      { width: 1440, height: 900 },
      { width: 1280, height: 720 },
      { width: 1536, height: 864 }
    ];
    return faker.helpers.arrayElement(viewports);
  }

  async addNoiseToMouseMovement(page: any, targetX: number, targetY: number): Promise<void> {
    const steps = faker.number.int({ min: 10, max: 30 });
    const currentPosition = await page.mouse;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const noise = (Math.random() - 0.5) * 5; // Small random noise
      
      const x = currentPosition.x + (targetX - currentPosition.x) * progress + noise;
      const y = currentPosition.y + (targetY - currentPosition.y) * progress + noise;
      
      await page.mouse.move(x, y);
      await page.waitForTimeout(faker.number.int({ min: 5, max: 20 }));
    }
  }
}
