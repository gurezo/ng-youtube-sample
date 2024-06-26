import { Component } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [YouTubePlayer]
})
export class AppComponent {
  title = 'ng-youtube-sample';

  constructor() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}
