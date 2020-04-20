import { logger } from './logger';
import * as SimpleYouTubeAPI from 'simple-youtube-api';
import { VideoInfos } from '../../../shared/types';
import { YOUTUBE_API } from '../config';

const youtube = new SimpleYouTubeAPI(YOUTUBE_API);

export module YouTube {
  export async function getVideoInfos(url: string) {
    let result;
    try {
      result = await youtube.getVideo(url);
    } catch (err) {
      logger.error(err);
      return;
    }

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
