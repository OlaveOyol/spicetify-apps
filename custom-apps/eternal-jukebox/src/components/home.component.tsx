import styles from '../css/app.module.scss';
import React, { useEffect, useState } from 'react';
import { JukeboxVisualizer } from './jukebox-visualizer.component';
import { RemixedSegment, RemixedTimeInterval } from '../models/remixer.types';
import { Beat } from '../models/graph/beat';
import { millisToMinutesAndSeconds } from '../utils/time-utils';

// TODO: Add settings button and modal

interface ITrackState {
    trackName: string;
    artistName: string;
}

interface IGraphState {
    beats: Beat[];
    segments: RemixedSegment[];
    remixedBeats: RemixedTimeInterval[];
}

interface IStatsState {
    beatsPlayed: number;
    currentRandomBranchChance: number;
    listenTime: string;
}

export function HomeComponent() {
    const [trackState, setTrackState] = useState<ITrackState>({
        trackName: '',
        artistName: '',
    });

    const [graphState, setGraphState] = useState<IGraphState>({
        beats: [],
        remixedBeats: [],
        segments: [],
    });

    const [statsState, setStatsState] = useState<IStatsState>({
        beatsPlayed: 0,
        listenTime: '0',
        currentRandomBranchChance: 0,
    });

    useEffect(() => {
        const subscription = window.jukebox.songState$.subscribe(
            (songState) => {
                setTrackState({
                    trackName: songState?.track?.metadata?.title ?? '',
                    artistName: songState?.track?.metadata?.artist_name ?? '',
                });

                setGraphState({
                    beats: songState?.graph.beats ?? [],
                    segments: songState?.analysis.segments ?? [],
                    remixedBeats: songState?.analysis.beats ?? [],
                });
            }
        );

        return subscription.unsubscribe;
    }, []);

    useEffect(() => {
        const subscription = window.jukebox.statsChanged$.subscribe((stats) => {
            setStatsState({
                beatsPlayed: stats.beatsPlayed,
                currentRandomBranchChance:
                    stats.currentRandomBranchChance * 100,
                listenTime: millisToMinutesAndSeconds(stats.listenTime),
            });
        });

        return subscription.unsubscribe;
    }, []);

    return (
        <div className={styles.container}>
            <h1>{trackState.trackName}</h1>
            <p>by</p>
            <h2>{trackState.artistName}</h2>

            <JukeboxVisualizer
                beats={graphState.beats}
                segments={graphState.segments}
                remixedBeats={graphState.remixedBeats}
            ></JukeboxVisualizer>

            <div className={styles.stats}>
                <span>{`Total Beats: ${statsState.beatsPlayed}`}</span>
                <span>
                    {`Current branch change: ${Math.round(
                        statsState.currentRandomBranchChance
                    )}%`}
                </span>
                <span>{`Listen Time: ${statsState.listenTime}`}</span>
            </div>
        </div>
    );
}
