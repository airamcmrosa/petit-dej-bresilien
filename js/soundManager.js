export class SoundManager {
    constructor(soundEffectIds, backgroundMusicId, musicToggleButtonId) {
        this.sounds = {};
        this.backgroundMusic = null;
        this.musicToggleButton = null;
        this.musicButtonUpdateCallback = null;

        for (const key in soundEffectIds) {
            const element = document.getElementById(soundEffectIds[key]);
            if (element) {
                this.sounds[key] = element;
            } else {
                console.warn(`Elemento de áudio com ID '${soundEffectIds[key]}' não encontrado.`);
            }
        }
        if (backgroundMusicId) {
            this.backgroundMusic = document.getElementById(backgroundMusicId);
            if (!this.backgroundMusic) {
                console.warn(`[SoundManager] Elemento de música de fundo com ID '${backgroundMusicId}' não encontrado.`);
            } else {
                this.backgroundMusic.volume = 0.3;
            }
        }
        if (musicToggleButtonId) {
            this.musicToggleButton = document.getElementById(musicToggleButtonId);
            if (!this.musicToggleButton) {
                console.warn(`[SoundManager] Botão de música com ID '${musicToggleButtonId}' não encontrado.`);
            } else {

                this.musicToggleButton.addEventListener('click', () => this.toggleBackgroundMusic());
            }
        }
        this.updateMusicButtonAppearance();
    }

    playEffect(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(error => console.warn(`[SoundManager] Erro ao tocar efeito ${soundName}:`, error));
        } else {
            console.warn(`[SoundManager] Efeito sonoro chamado '${soundName}' não encontrado.`);
        }
    }

    // --- NOVOS MÉTODOS PARA MÚSICA DE FUNDO ---
    toggleBackgroundMusic() {
        if (!this.backgroundMusic) return;

        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().then(() => {
                this.updateMusicButtonAppearance();
            }).catch(error => {
                console.error("[SoundManager] Erro ao tocar música de fundo:", error);
                this.updateMusicButtonAppearance();
            });
        } else {
            this.backgroundMusic.pause();
            this.updateMusicButtonAppearance();
        }
    }

    updateMusicButtonAppearance() {
        if (!this.backgroundMusic || !this.musicToggleButton) return;

        if (this.backgroundMusic.paused) {
            this.musicToggleButton.classList.add('paused');
            this.musicToggleButton.textContent = '♫';
        } else {
            this.musicToggleButton.classList.remove('paused');
            this.musicToggleButton.textContent = '❚❚';
        }
    }

}