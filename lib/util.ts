import {
  EpisodeInfo,
  MediaInfo,
  MovieInfo,
  Progress,
} from "@rewynd.io/rewynd-client-typescript";
import {
  instanceOfEpisodeInfo,
  instanceOfMovieInfo,
} from "@rewynd.io/rewynd-client-typescript";

export type Nil = undefined | null | void;

export function isNotNil<T>(t: T | Nil): t is T {
  return !isNil(t);
}

export function isNil<T>(t: T | Nil): t is Nil {
  return t === undefined || t === null;
}

export function formatSeason(seasonNumber: number) {
  const ceilSeason = Math.ceil(seasonNumber);
  return ceilSeason < 10 ? `S0${ceilSeason}` : `S${ceilSeason}`;
}

export function formatEpisode(
  episodeStartNumber: number,
  episodeEndNumber?: number
) {
  const ceilEpStart = Math.ceil(episodeStartNumber);
  const ceilEpEnd = episodeEndNumber ? Math.ceil(episodeEndNumber) : undefined;
  return ceilEpEnd
    ? ceilEpEnd < 10
      ? ceilEpStart < 10
        ? `E0${ceilEpStart}-E0${ceilEpEnd}`
        : `E${ceilEpStart}-E0${ceilEpEnd}`
      : ceilEpStart < 10
      ? `E0${ceilEpStart}-E${ceilEpEnd}`
      : `E${ceilEpStart}-E${ceilEpEnd}`
    : ceilEpStart < 10
    ? `E0${ceilEpStart}`
    : `E${ceilEpStart}`;
}

export function formatSeasonEpisode(
  seasonNumber: number,
  episodeStartNumber: number,
  episodeEndNumber?: number
) {
  const seasonStr = formatSeason(seasonNumber);
  const epStr = formatEpisode(episodeStartNumber, episodeEndNumber);

  return `${seasonStr}${epStr}`;
}

export function mediaInfoTitle(mediaInfo: MediaInfo): string {
  if (isEpisodeInfo(mediaInfo)) {
    return `${mediaInfo.showName} - ${formatSeasonEpisode(
      mediaInfo.season ?? 0,
      mediaInfo.episode ?? 0,
      mediaInfo.episodeNumberEnd
    )} - ${mediaInfo.title}`;
  } else if (isMovieInfo(mediaInfo)) {
    return mediaInfo.title;
  } else {
    return mediaInfo.id;
  }
}

function isEpisodeInfo(obj: unknown): obj is EpisodeInfo {
  return !!obj && typeof obj === "object" && instanceOfEpisodeInfo(obj);
}
function isMovieInfo(obj: unknown): obj is MovieInfo {
  return !!obj && typeof obj === "object" && instanceOfMovieInfo(obj);
}

export function resetCompletedProgress(progress: Progress): Progress {
  return progress.percent <= 0.99
    ? progress
    : { id: progress.id, percent: 0, timestamp: Date.now() };
}
