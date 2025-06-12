export class AssetLoader {
    constructor(assetManifest) {
        this.assetManifest = assetManifest;
        this.assets = {};
        this.assetsToLoad = assetManifest.length;
        this.assetsLoaded = 0;
    }

    /**
     * Recupera um asset pré-carregado pelo seu ID.
     * @param {string} id - O ID do asset definido no manifesto.
     * @returns {Image} O objeto de imagem carregado.
     */
    getAsset(id) {
        return this.assets[id];
    }

    /**
     * Inicia o carregamento de todos os assets.
     * @param {function} onComplete - A função a ser chamada quando todos os assets estiverem prontos.
     */
    loadAll(onComplete) {
        if (this.assetsToLoad === 0) {
            onComplete();
            return;
        }

        this.assetManifest.forEach(assetInfo => {
            const image = new Image();
            image.onload = () => {
                this.assetsLoaded++;
                console.log(`✅ Asset '${assetInfo.id}' carregado.`);
                if (this.assetsLoaded === this.assetsToLoad) {
                    onComplete();
                }
            };
            image.onerror = () => {
                this.assetsLoaded++;
                console.error(`❌ Falha ao carregar asset '${assetInfo.id}' de ${assetInfo.src}`);
                if (this.assetsLoaded === this.assetsToLoad) {
                    onComplete();
                }
            };
            this.assets[assetInfo.id] = image;
            image.src = assetInfo.src;
        });
    }
}