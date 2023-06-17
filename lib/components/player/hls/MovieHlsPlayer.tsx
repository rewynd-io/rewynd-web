import { Navigate, useParams } from "react-router";
import React from "react";
import { HlsPlayer, MediaSelection } from "./HlsPlayer";
import { HttpClient } from "../../../const";

export function MovieHlsPlayer() {
  const { movieId } = useParams();
  if (!movieId) {
    return <Navigate to={"/"} />;
  }

  return (
    <HlsPlayer
      onInit={async () => {
        const [movie, prog] = await Promise.all([
          HttpClient.getMovie({ movieId: movieId }),
          HttpClient.getUserProgress({ id: movieId }).then((it) => it.percent),
        ]);
        if (movie) {
          return {
            request: {
              audioTrack: Object.keys(movie.audioTracks)[0],
              videoTrack: Object.keys(movie.videoTracks)[0],
              subtitleTrack: Object.keys(movie.subtitleTracks)[0],
              library: movie.libraryId,
              id: movie.id,
              startOffset: (prog ?? 0) * (movie.runTime ?? 0),
            },
            info: movie,
          } as MediaSelection;
        }
        return undefined;
      }}
    />
  );
}
