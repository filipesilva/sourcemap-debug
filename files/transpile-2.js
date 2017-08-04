import { __extends } from "tslib";
import { InjectionToken, Inject } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { MdIconRegistry } from '@angular/material';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';
/**
 * Use SVG_ICONS (and SvgIconInfo) as "multi" providers to provide the SVG source
 * code for the icons that you wish to have preloaded in the `CustomMdIconRegistry`
 * For compatibility with the MdIconComponent, please ensure that the SVG source has
 * the following attributes:
 *
 * * `xmlns="http://www.w3.org/2000/svg"`
 * * `focusable="false"` (disable IE11 default behavior to make SVGs focusable)
 * * `height="100%"` (the default)
 * * `width="100%"` (the default)
 * * `preserveAspectRatio="xMidYMid meet"` (the default)
 *
 */
export var SVG_ICONS = new InjectionToken('SvgIcons');
/**
 * A custom replacement for Angular Material's `MdIconRegistry`, which allows
 * us to provide preloaded icon SVG sources.
 */
var CustomMdIconRegistry = (function (_super) {
    __extends(CustomMdIconRegistry, _super);
    function CustomMdIconRegistry(http, sanitizer, svgIcons) {
        var _this = _super.call(this, http, sanitizer) || this;
        _this.preloadedSvgElements = {};
        _this.loadSvgElements(svgIcons);
        return _this;
    }
    CustomMdIconRegistry.prototype.getNamedSvgIcon = function (iconName, namespace) {
        if (this.preloadedSvgElements[iconName]) {
            return of(this.preloadedSvgElements[iconName].cloneNode(true));
        }
        return _super.prototype.getNamedSvgIcon.call(this, iconName, namespace);
    };
    CustomMdIconRegistry.prototype.loadSvgElements = function (svgIcons) {
        var _this = this;
        var div = document.createElement('DIV');
        svgIcons.forEach(function (icon) {
            // SECURITY: the source for the SVG icons is provided in code by trusted developers
            div.innerHTML = icon.svgSource;
            _this.preloadedSvgElements[icon.name] = div.querySelector('svg');
        });
    };
    CustomMdIconRegistry.ctorParameters = function () { return [{ type: Http }, { type: DomSanitizer }, { type: null, decorators: [{ type: Inject, args: [SVG_ICONS] }] }]; };
    return CustomMdIconRegistry;
}(MdIconRegistry));
export { CustomMdIconRegistry };


