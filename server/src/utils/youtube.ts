import * as SimpleYouTubeAPI from 'simple-youtube-api';
import { VideoInfos } from '../../../shared/types';
import { YOUTUBE_API } from '../config';

const youtube = new SimpleYouTubeAPI(YOUTUBE_API);

export module YouTube {
  export async function getVideoInfos(url: string) {
    const result = await youtube.getVideo(url);
    const videoInfos: VideoInfos = {
      id: result.id,
      title: result.title,
      thumbnail: result.thumbnails.default.url,
      channel: result.channel.title,
      url,
    };
    return videoInfos;
  }
}
