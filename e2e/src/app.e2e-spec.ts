import { expect, test, type Page } from '@playwright/test';

test('renders the YouTube player', async ({ page }) => {
  const pageErrors: string[] = [];

  page.on('pageerror', error => pageErrors.push(error.message));
  await mockYouTubeIframeApi(page);

  await page.goto('/');

  const player = page.locator('app-root youtube-player');
  await expect(player).toBeAttached();

  await expect(page.getByRole('button', { name: 'Play video' })).toBeVisible();
  await page.getByRole('button', { name: 'Play video' }).click();

  const iframe = player.locator('iframe[title="YouTube video player"]');
  await expect(iframe).toBeAttached();
  await expect(iframe).toHaveAttribute('src', /8Bbao7u6DH8/);

  expect(pageErrors).toEqual([]);
});

async function mockYouTubeIframeApi(page: Page): Promise<void> {
  await page.route('https://www.youtube.com/iframe_api', async route => {
    await route.fulfill({
      contentType: 'application/javascript',
      body: `
        window.YT = {
          Player: function Player(element, options) {
            const iframe = document.createElement('iframe');
            iframe.title = 'YouTube video player';
            iframe.src = 'https://www.youtube.com/embed/' + options.videoId;
            iframe.width = String(options.width);
            iframe.height = String(options.height);
            element.appendChild(iframe);

            this.destroy = function destroy() {};
            this.getIframe = function getIframe() { return iframe; };
            this.getPlayerState = function getPlayerState() { return -1; };
            this.cueVideoById = function cueVideoById() {};
            this.playVideo = function playVideo() {};
            this.seekTo = function seekTo() {};
            this.setSize = function setSize() {};
            this.setPlaybackQuality = function setPlaybackQuality() {};
            this.addEventListener = function addEventListener(name, handler) {
              if (name === 'onReady') {
                setTimeout(function notifyReady() {
                  handler({ target: this });
                }.bind(this), 0);
              }
            };
            this.removeEventListener = function removeEventListener() {};
          },
          PlayerState: {}
        };

        window.onYouTubeIframeAPIReady?.();
      `,
    });
  });
}
