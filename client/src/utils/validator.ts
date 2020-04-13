export function isValidYouTubeUrl(candidateUrl: string) {
  const youtubeUrlRegex = RegExp(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/);
  return youtubeUrlRegex.test(candidateUrl);
}
