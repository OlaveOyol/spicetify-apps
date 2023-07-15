import React, { useEffect, useState } from 'react';
import styles from 'css/app.module.scss';
import { HomeComponent } from './components/home.component';
import { JukeboxSongState } from './models/jukebox-song-state';
import { SettingsButton } from './components/settings/settings-button';
import { version } from '../package.json';
import ReactMarkdown from 'react-markdown';
import whatsNew from 'spcr-whats-new';
import { CHANGE_NOTES } from './change-notes';

function App() {
    const [songState, setSongState] = useState<JukeboxSongState | null>(null);

    useEffect(() => {
        const subscription = window.jukebox.songState$.subscribe(
            (songState) => {
                setSongState(songState);
            }
        );
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const markdown = <ReactMarkdown children={CHANGE_NOTES} />;

        whatsNew('eternal-jukebox', version, {
            title: `New in v${version}`,
            content: markdown,
            isLarge: true,
        });
    }, []);

    if (window.jukebox.isEnabled) {
        if (songState !== null) {
            return (
                <div className={styles['full-size-container']}>
                    <HomeComponent />
                </div>
            );
        } else {
            return (
                <div className={styles['empty-container']}>
                    <div className={styles['elements-container']}>
                        <SettingsButton />
                        <div>
                            <h1>Loading...</h1>
                        </div>
                    </div>
                </div>
            );
        }
    } else {
        return (
            <div className={styles['empty-container']}>
                <div className={styles['elements-container']}>
                    <SettingsButton />
                    <div>
                        <h1>Jukebox not enabled.</h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
