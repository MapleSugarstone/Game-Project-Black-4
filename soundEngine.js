class SoundEngine {
    constructor() {
        // Core audio state properties
        this.currentMusic = null;        // Currently playing background music
        this.audioEnabled = true;        // Global audio mute/unmute state
        this.musicVolume = 0.3;          // Background music volume (0-1)
        this.sfxVolume = 0.5;           // Sound effects volume (0-1)
        this.currentScene = null;        // Tracks current game scene for music changes
        
        // Maps scenes to their background music files
        // Add new scenes and music files here
        this.sceneMusicMap = {
            "MainMenu": "./Sounds/menuMusic.mp3"
            // Example additional scenes:
            // "Shop": "./Sounds/shopMusic.mp3", 
            // "Battle": "./Sounds/battleMusic.mp3",
            // "Win round": "./Sounds/victoryMusic.mp3",
            // "Lose round": "./Sounds/defeatMusic.mp3",
            // "Draw round": "./Sounds/drawMusic.mp3",
            // "End Game": "./Sounds/endMusic.mp3"
        };

        // Maps sound effect names to their audio files
        // Add new sound effects here
        this.soundEffects = {
            // Example sound effects:
            // "purchase": "./Sounds/purchase.mp3",
            // "sell": "./Sounds/sell.mp3",
            // "upgrade": "./Sounds/upgrade.mp3",
            // "roll": "./Sounds/roll.mp3",
            // "attack": "./Sounds/attack.mp3",
            // "hurt": "./Sounds/hurt.mp3",
            // "death": "./Sounds/death.mp3",
            // "victory": "./Sounds/victory.mp3",
            // "defeat": "./Sounds/defeat.mp3",
            // "click": "./Sounds/click.mp3"
        };
    }

    // Initialize sound engine by queuing all audio files for loading
    init() {
        // Queue background music tracks
        Object.values(this.sceneMusicMap).forEach(path => {
            ASSET_MANAGER.queueAudioDownload(path);
        });

        // Queue sound effects
        Object.values(this.soundEffects).forEach(path => {
            ASSET_MANAGER.queueAudioDownload(path);
        });
    }

    // Toggle global audio mute state
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        if (this.audioEnabled) {
            ASSET_MANAGER.unmuteAll();
            // Resume background music if it exists
            if (this.currentMusic) {
                this.currentMusic.play().catch(error => {
                    console.log('Play failed after unmute:', error);
                });
            }
        } else {
            ASSET_MANAGER.muteAll();
            if (this.currentMusic) {
                this.currentMusic.pause();
            }
        }
    }

    // Set background music volume (0-1)
    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.currentMusic) {
            this.currentMusic.volume = volume;
        }
    }

    // Set sound effects volume (0-1)
    setSFXVolume(volume) {
        this.sfxVolume = volume;
        ASSET_MANAGER.setVolume(volume);
    }

    // Handle scene changes and update background music accordingly
    updateScene(newScene) {
        console.log("Updating scene to:", newScene);
        if (this.currentScene !== newScene) {
            this.currentScene = newScene;
            this.playSceneMusic(newScene);
        }
    }

    // Play the background music for a given scene
    playSceneMusic(scene) {
        console.log("Playing scene music for:", scene);
        
        // Stop current background music if playing
        if (this.currentMusic) {
            console.log("Stopping current music");
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }

        // Get new scene's music file path
        const musicPath = this.sceneMusicMap[scene];
        console.log("Music path:", musicPath);
        
        if (musicPath) {
            // Load and setup new background music
            this.currentMusic = ASSET_MANAGER.getAsset(musicPath);
            console.log("Got audio asset:", this.currentMusic);
            
            if (this.currentMusic && this.audioEnabled) {
                console.log("Attempting to play music");
                this.currentMusic.volume = this.musicVolume;
                this.currentMusic.loop = true;
                
                // Handle browser autoplay restrictions
                const playPromise = this.currentMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log('Play failed, will retry on user interaction:', error);
                        // Will retry playing when user interacts with page
                    });
                }
            }
        }
    }

    // Play a sound effect by name
    playSFX(soundName) {
        if (this.audioEnabled && this.soundEffects[soundName]) {
            const sfx = ASSET_MANAGER.playAsset(this.soundEffects[soundName]);
            if (sfx) {
                sfx.volume = this.sfxVolume;
            }
        }
    }
}
