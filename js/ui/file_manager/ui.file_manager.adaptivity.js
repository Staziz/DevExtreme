import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isFunction } from "../../core/utils/type";
import { getWindow, hasWindow } from "../../core/utils/window";

import Widget from "../widget/ui.widget";
import Drawer from "../drawer/ui.drawer";
import SplitterControl from "../splitter";

const window = getWindow();
const ADAPTIVE_STATE_SCREEN_WIDTH = 573;

class FileManagerAdaptivityControl extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        this._isInAdaptiveState = false;

        const $drawer = $("<div>").appendTo(this.$element());

        const contentRenderer = this.option("contentTemplate");
        if(isFunction(contentRenderer)) {
            contentRenderer($drawer);
        }

        this._drawer = this._createComponent($drawer, Drawer);
        this._drawer.option({
            opened: true,
            template: this._createDrawerTemplate.bind(this)
        });
    }

    _createDrawerTemplate(container) {
        this.option("drawerTemplate")(container);
        const leftElement = container;
        const rightElement = this._drawer.viewContent();
        this._splitter = this._createComponent("<div>", SplitterControl, {
            container: this.$element(),
            leftElement,
            rightElement,
            onApplyPanelSize: this._onApplyPanelSize.bind(this)
        });
        this._splitter.$element().appendTo(container);
        this._leftElement = leftElement;
        this._rightElement = rightElement;
    }

    _render() {
        super._render();
        this._checkAdaptiveState();
    }

    _onApplyPanelSize(e) {
        this._setInnerElementsWidth(e);
    }

    _setInnerElementsWidth(widths) {
        if(!hasWindow()) {
            return;
        }
        this._leftElement.width(widths.leftPanelWidth);
        this._rightElement.width(widths.rightPanelWidth);
    }

    _dimensionChanged(dimension) {
        if(!dimension || dimension !== "height") {
            this._checkAdaptiveState();
        }
    }

    _checkAdaptiveState() {
        const oldState = this._isInAdaptiveState;
        this._isInAdaptiveState = this._isSmallScreen();
        if(oldState !== this._isInAdaptiveState) {
            this.toggleDrawer(!this._isInAdaptiveState, true);
            this._raiseAdaptiveStateChanged(this._isInAdaptiveState);
            this._toggleSplitter(!this._isInAdaptiveState);
        }
    }

    _isSmallScreen() {
        return $(window).width() <= ADAPTIVE_STATE_SCREEN_WIDTH;
    }

    _initActions() {
        this._actions = {
            onAdaptiveStateChanged: this._createActionByOption("onAdaptiveStateChanged")
        };
    }

    _raiseAdaptiveStateChanged(enabled) {
        this._actions.onAdaptiveStateChanged({ enabled });
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            drawerTemplate: null,
            contentTemplate: null,
            onAdaptiveStateChanged: null,
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "drawerTemplate":
            case "contentTemplate":
                this.repaint();
                break;
            case "onAdaptiveStateChanged":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    isInAdaptiveState() {
        return this._isInAdaptiveState;
    }

    toggleDrawer(showing, skipAnimation) {
        this._drawer.option("animationEnabled", !skipAnimation);
        this._drawer.toggle(showing);
    }

    _toggleSplitter(isActive) {
        if(isActive) {
            $(this._leftElement).removeClass("dx-splitter-disabled");
            this._splitter.$element().removeClass("dx-state-disabled");
            this._splitter._$splitter.removeClass("dx-state-disabled");
        } else {
            $(this._leftElement).addClass("dx-splitter-disabled");
            this._splitter.$element().addClass("dx-state-disabled");
            this._splitter._$splitter.addClass("dx-state-disabled");
        }
    }
}

module.exports = FileManagerAdaptivityControl;
