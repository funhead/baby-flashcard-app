///<reference path="CropEntities.ts"/>
/**
 * Created by scorpio on 01/02/2016.
 */
var ImageDataManager = (function () {
    function ImageDataManager(seedData, changeCallback) {
        this.seedData = seedData;
        this.changeCallback = changeCallback;
        this.changeHash = '-1';
        this.backlog = [];
        this.imageDataItems = [];
        this.currentItem = null;
        if (seedData) {
            this.backlog = seedData.backlog;
            this.imageDataItems = seedData.imageDataItems;
        }
    }
    ImageDataManager.prototype.loadBacklogItem = function (backlogItem, target) {
        this.currentItem = null;
        var targetDims = new BoxDims(0, 0, target.width(), target.height());
        for (var i = 0; i < this.imageDataItems.length; i++) {
            var item = this.imageDataItems[i];
            if (item.id == backlogItem.id) {
                this.currentItem = item;
            }
        }
        if (this.currentItem == null) {
            this.currentItem = ImageDataManager.createNewImageDataItem(backlogItem);
            this.imageDataItems.push(this.currentItem);
        }
        this.currentItem.sizingDims = targetDims;
        this.changeHash = this.currentItem.id.toString();
        this.recalculateCropStates();
        this.finishLoadAsync(target);
    };
    ImageDataManager.prototype.finishLoadAsync = function (target) {
        var img = new Image();
        var dm = this;
        img.onload = function () {
            dm.currentItem.originalDims = new BoxDims(0, 0, img.width, img.height);
            if (dm.changeCallback)
                dm.changeCallback();
        };
        img.src = target.attr('src');
    };
    ImageDataManager.prototype.setStateForIndex = function (index) {
        switch (index) {
            case 0:
                this.activeCropDef = this.currentItem.twelve16.masterCropDef;
                break;
            case 1:
                this.activeCropDef = this.currentItem.twelve16.altCropDef;
                break;
            case 2:
                this.activeCropDef = this.currentItem.nine16.masterCropDef;
                break;
            case 3:
                this.activeCropDef = this.currentItem.nine16.altCropDef;
                break;
        }
    };
    ImageDataManager.prototype.clearCropActions = function () {
        this.activeCropDef = null;
    };
    ImageDataManager.prototype.setMasterCropOrientation = function (orientation) {
        if (this.activeCropDef) {
            var cropSet = this.activeCropDef.parent;
            cropSet.masterCropDef.orientation = orientation;
            cropSet.altCropDef.orientation = ImageCropUtils.getOtherOrientation(orientation);
            this.recalculateCropStates();
        }
    };
    ImageDataManager.prototype.getExistingIndexesForDeck = function (deckName) {
        var existingIndexes = [];
        for (var i = 0; i < this.imageDataItems.length; i++) {
            var item = this.imageDataItems[i];
            if (item.deck && item.deck.name == deckName && item.indexInDeck > -1) {
                existingIndexes.push(item.indexInDeck);
            }
        }
        return existingIndexes;
    };
    ImageDataManager.createNewImageDataItem = function (backlogItem) {
        var item = new ImageDataItem(backlogItem.id, backlogItem.path);
        item.twelve16 = new CropSet(CropFormat.twelve16, new CropDef('twM', CropTarget.master), new CropDef('twA', CropTarget.alt));
        item.nine16 = new CropSet(CropFormat.nine16, new CropDef('nnM', CropTarget.master), new CropDef('nnA', CropTarget.alt));
        return item;
    };
    ImageDataManager.prototype.recalculateCropStates = function () {
        var ci = this.currentItem;
        ci.twelve16.masterCropDef.crop =
            ImageCropUtils.getBoxBounds(ci.twelve16.masterCropDef.orientation, ci.twelve16.format, ci.sizingDims);
        ci.twelve16.altCropDef.crop =
            ImageCropUtils.getBoxBounds(ci.twelve16.altCropDef.orientation, ci.twelve16.format, ci.sizingDims);
        ci.nine16.masterCropDef.crop =
            ImageCropUtils.getBoxBounds(ci.nine16.masterCropDef.orientation, ci.nine16.format, ci.sizingDims);
        ci.nine16.altCropDef.crop =
            ImageCropUtils.getBoxBounds(ci.nine16.altCropDef.orientation, ci.nine16.format, ci.sizingDims);
    };
    return ImageDataManager;
})();
//# sourceMappingURL=ImageDataManager.js.map