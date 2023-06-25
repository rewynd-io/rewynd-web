import {
  EpisodeInfo,
  Library,
  Progress,
} from "@rewynd.io/rewynd-client-typescript";
import React, { useEffect, useState } from "react";
import { ButtonLink } from "./ButtonLink";
import { WebRoutes } from "../routes";
import { NavBar } from "./NavBar";
import { Box, Grid, Typography } from "@mui/material";
import { List } from "immutable";
import { cardWidth, HttpClient } from "../const";
import { EpisodeCard } from "./browser/card/EpisodeCard";
import { WebLog } from "../log";
import "../util";
import { isNotNil } from "../util";
import { ApiImage } from "./Image";
import { Link } from "./Link";

interface ProgressedEpisodeInfo {
  readonly episode: EpisodeInfo;
  readonly progress: Progress;
}

const log = WebLog.getChildCategory("Home");

export function Home() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [episodes, setEpisodes] = useState<ProgressedEpisodeInfo[]>([]);

  useEffect(() => {
    HttpClient.listLibraries().then((it) => setLibraries(it));
    HttpClient.listProgress({
      listProgressRequest: {
        minPercent: 0.05,
        maxPercent: 0.95,
        limit: 20,
      },
    })
      .then((it) => {
        const results = it.results;
        return Promise.all(
          results?.map(async (prog) => {
            try {
              const res = await HttpClient.getEpisode({ episodeId: prog.id });
              return { progress: prog, episode: res };
            } catch (e) {
              log.error("Failed to load episode", e);
              return undefined;
            }
          }) ?? []
        );
      })
      .then((it) =>
        setEpisodes(
          List(it)
            .filter(isNotNil)
            .sortBy((a) => a.progress)
            .reverse()
            .toArray()
        )
      );
  }, []);

  const libEntries = libraries.map((lib) => {
    return { route: WebRoutes.formatLibraryRoute(lib.name), name: lib.name };
  });

  return (
    <NavBar>
      <Grid height={"100%"} width={"100%"} container direction={"column"}>
        <Grid
          container
          item
          direction={"row"}
          justifyContent={"flex-start"}
          wrap={"nowrap"}
          sx={{ overflowX: "scroll" }}
          minHeight={"15em"}
          width={"100%"}
        >
          {libEntries.map((libEntry) => {
            return (
              <Box sx={{ minWidth: cardWidth }} key={libEntry.name}>
                <ButtonLink
                  to={libEntry.route}
                  style={{ minHeight: "12em", width: "100%" }}
                >
                  {/* TODO display random image from Library */}
                  <ApiImage
                    alt={libEntry.name}
                    sx={{ minHeight: "12em", width: "100%" }}
                  ></ApiImage>
                </ButtonLink>
                <Link to={libEntry.route}>
                  <Typography align={"center"}>{libEntry.name}</Typography>
                </Link>
              </Box>
            );
          })}
        </Grid>
        <Grid
          container
          item
          direction={"row"}
          justifyContent={"flex-start"}
          wrap={"nowrap"}
          sx={{ overflowX: "scroll" }}
          minHeight={"15em"}
          width={"100%"}
        >
          {episodes.map((episode) => (
            <EpisodeCard {...episode} key={episode.episode.id} />
          ))}
        </Grid>
      </Grid>
    </NavBar>
  );
}
