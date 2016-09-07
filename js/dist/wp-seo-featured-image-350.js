(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global wp */
/* global wpseoFeaturedImageL10n */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */

(function ($) {
	"use strict";

	var featuredImagePlugin;
	var featuredImageElement;

	var FeaturedImagePlugin = function FeaturedImagePlugin(app) {
		this._app = app;

		this.featuredImage = null;
		this.pluginName = "addFeaturedImagePlugin";

		this.registerPlugin();
		this.registerModifications();
	};

	/**
  * Set's the featured image to use in the analysis
  *
  * @param {String} featuredImage
  */
	FeaturedImagePlugin.prototype.setFeaturedImage = function (featuredImage) {
		this.featuredImage = featuredImage;

		this._app.pluginReloaded(this.pluginName);
	};

	/**
  * Removes featured image and reloads analyzer
  */
	FeaturedImagePlugin.prototype.removeFeaturedImage = function () {
		this.setFeaturedImage(null);
	};

	/**
  * Registers this plugin to YoastSEO
  */
	FeaturedImagePlugin.prototype.registerPlugin = function () {
		this._app.registerPlugin(this.pluginName, { status: "ready" });
	};

	/**
  * Registers modifications to YoastSEO
  */
	FeaturedImagePlugin.prototype.registerModifications = function () {
		this._app.registerModification("content", this.addImageToContent.bind(this), this.pluginName, 10);
	};

	/**
  * Adds featured image to sort so it can be analyzed
  *
  * @param {String} content
  * @returns {String}
  */
	FeaturedImagePlugin.prototype.addImageToContent = function (content) {
		if (null !== this.featuredImage) {
			content += this.featuredImage;
		}

		return content;
	};

	/**
  * Remove opengraph warning frame and borders
  */
	function removeOpengraphWarning() {
		$("#yst_opengraph_image_warning").remove();
		$("#postimagediv").css("border", "none");
	}

	/**
  * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
  * @param {object} featuredImage
  */
	function checkFeaturedImage(featuredImage) {
		var attachment = featuredImage.state().get("selection").first().toJSON();

		if (attachment.width < 200 || attachment.height < 200) {
			// Show warning to user and do not add image to OG
			if (0 === $("#yst_opengraph_image_warning").length) {
				var $postImageDiv = $("#postimagediv");
				$('<div id="yst_opengraph_image_warning"><p>' + wpseoFeaturedImageL10n.featured_image_notice + "</p></div>").insertBefore($postImageDiv);
				$postImageDiv.css({
					border: "solid #dd3d36",
					borderWidth: "3px 4px 4px 4px"
				});
			}
		} else {
			// Force reset warning
			removeOpengraphWarning();
		}
	}

	$(document).ready(function () {
		var featuredImage = wp.media.featuredImage.frame();

		featuredImagePlugin = new FeaturedImagePlugin(YoastSEO.app);

		featuredImage.on("select", function () {
			var selectedImageHTML, selectedImage, alt;

			checkFeaturedImage(featuredImage);

			selectedImage = featuredImage.state().get("selection").first();

			// WordPress falls back to the title for the alt attribute if no alt is present.
			alt = selectedImage.get("alt");

			if ("" === alt) {
				alt = selectedImage.get("title");
			}

			selectedImageHTML = "<img" + ' src="' + selectedImage.get("url") + '"' + ' width="' + selectedImage.get("width") + '"' + ' height="' + selectedImage.get("height") + '"' + ' alt="' + alt + '"/>';

			featuredImagePlugin.setFeaturedImage(selectedImageHTML);
		});

		$("#postimagediv").on("click", "#remove-post-thumbnail", function () {
			featuredImagePlugin.removeFeaturedImage();
			removeOpengraphWarning();
		});

		featuredImageElement = $("#set-post-thumbnail > img");
		if ("undefined" !== typeof featuredImageElement.prop("src")) {
			featuredImagePlugin.setFeaturedImage($("#set-post-thumbnail ").html());
		}
	});
})(jQuery);

/* eslint-disable */
/* jshint ignore:start */
/**
 * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
 * @param {object} featuredImage
 *
 * @deprecated since 3.1
 */
function yst_checkFeaturedImage(featuredImage) {
	return;
}

/**
 * Counter to make sure we do not end up in an endless loop if there' no remove-post-thumbnail id
 * @type {number}
 *
 * @deprecated since 3.1
 */
var thumbIdCounter = 0;

/**
 * Variable to hold the onclick function for remove-post-thumbnail.
 * @type {function}
 *
 * @deprecated since 3.1
 */
var removeThumb;

/**
 * If there's a remove-post-thumbnail id, add an onclick. When this id is clicked, call yst_removeOpengraphWarning
 * If not, check again after 100ms. Do not do this for more than 10 times so we do not end up in an endless loop
 *
 * @deprecated since 3.1
 */
function yst_overrideElemFunction() {
	return;
}

/**
 * Remove error message
 */
function yst_removeOpengraphWarning() {
	return;
}

window.yst_checkFeaturedImage = yst_checkFeaturedImage;
window.thumbIdCounter = thumbIdCounter;
window.removeThumb = removeThumb;
window.yst_overrideElemFunction = yst_overrideElemFunction;
window.yst_removeOpengraphWarning = yst_removeOpengraphWarning;
/* jshint ignore:end */
/* eslint-enable */

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWZlYXR1cmVkLWltYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVFLFdBQVUsQ0FBVixFQUFjO0FBQ2Y7O0FBQ0EsS0FBSSxtQkFBSjtBQUNBLEtBQUksb0JBQUo7O0FBRUEsS0FBSSxzQkFBc0IsU0FBdEIsbUJBQXNCLENBQVUsR0FBVixFQUFnQjtBQUN6QyxPQUFLLElBQUwsR0FBWSxHQUFaOztBQUVBLE9BQUssYUFBTCxHQUFxQixJQUFyQjtBQUNBLE9BQUssVUFBTCxHQUFrQix3QkFBbEI7O0FBRUEsT0FBSyxjQUFMO0FBQ0EsT0FBSyxxQkFBTDtBQUNBLEVBUkQ7O0FBVUE7Ozs7O0FBS0EscUJBQW9CLFNBQXBCLENBQThCLGdCQUE5QixHQUFpRCxVQUFVLGFBQVYsRUFBMEI7QUFDMUUsT0FBSyxhQUFMLEdBQXFCLGFBQXJCOztBQUVBLE9BQUssSUFBTCxDQUFVLGNBQVYsQ0FBMEIsS0FBSyxVQUEvQjtBQUNBLEVBSkQ7O0FBTUE7OztBQUdBLHFCQUFvQixTQUFwQixDQUE4QixtQkFBOUIsR0FBb0QsWUFBVztBQUM5RCxPQUFLLGdCQUFMLENBQXVCLElBQXZCO0FBQ0EsRUFGRDs7QUFJQTs7O0FBR0EscUJBQW9CLFNBQXBCLENBQThCLGNBQTlCLEdBQStDLFlBQVc7QUFDekQsT0FBSyxJQUFMLENBQVUsY0FBVixDQUEwQixLQUFLLFVBQS9CLEVBQTJDLEVBQUUsUUFBUSxPQUFWLEVBQTNDO0FBQ0EsRUFGRDs7QUFJQTs7O0FBR0EscUJBQW9CLFNBQXBCLENBQThCLHFCQUE5QixHQUFzRCxZQUFXO0FBQ2hFLE9BQUssSUFBTCxDQUFVLG9CQUFWLENBQWdDLFNBQWhDLEVBQTJDLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNkIsSUFBN0IsQ0FBM0MsRUFBZ0YsS0FBSyxVQUFyRixF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Ozs7OztBQU1BLElBQUksV0FBSjs7QUFFQTs7Ozs7O0FBTUEsU0FBUyx3QkFBVCxHQUFvQztBQUNuQztBQUNBOztBQUVEOzs7QUFHQSxTQUFTLDBCQUFULEdBQXNDO0FBQ3JDO0FBQ0E7O0FBRUQsT0FBTyxzQkFBUCxHQUFnQyxzQkFBaEM7QUFDQSxPQUFPLGNBQVAsR0FBd0IsY0FBeEI7QUFDQSxPQUFPLFdBQVAsR0FBcUIsV0FBckI7QUFDQSxPQUFPLHdCQUFQLEdBQWtDLHdCQUFsQztBQUNBLE9BQU8sMEJBQVAsR0FBb0MsMEJBQXBDO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBnbG9iYWwgd3AgKi9cbi8qIGdsb2JhbCB3cHNlb0ZlYXR1cmVkSW1hZ2VMMTBuICovXG4vKiBnbG9iYWwgWW9hc3RTRU8gKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IC1XMDAzICovXG5cbiggZnVuY3Rpb24oICQgKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXHR2YXIgZmVhdHVyZWRJbWFnZVBsdWdpbjtcblx0dmFyIGZlYXR1cmVkSW1hZ2VFbGVtZW50O1xuXG5cdHZhciBGZWF0dXJlZEltYWdlUGx1Z2luID0gZnVuY3Rpb24oIGFwcCApIHtcblx0XHR0aGlzLl9hcHAgPSBhcHA7XG5cblx0XHR0aGlzLmZlYXR1cmVkSW1hZ2UgPSBudWxsO1xuXHRcdHRoaXMucGx1Z2luTmFtZSA9IFwiYWRkRmVhdHVyZWRJbWFnZVBsdWdpblwiO1xuXG5cdFx0dGhpcy5yZWdpc3RlclBsdWdpbigpO1xuXHRcdHRoaXMucmVnaXN0ZXJNb2RpZmljYXRpb25zKCk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFNldCdzIHRoZSBmZWF0dXJlZCBpbWFnZSB0byB1c2UgaW4gdGhlIGFuYWx5c2lzXG5cdCAqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBmZWF0dXJlZEltYWdlXG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5zZXRGZWF0dXJlZEltYWdlID0gZnVuY3Rpb24oIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0dGhpcy5mZWF0dXJlZEltYWdlID0gZmVhdHVyZWRJbWFnZTtcblxuXHRcdHRoaXMuX2FwcC5wbHVnaW5SZWxvYWRlZCggdGhpcy5wbHVnaW5OYW1lICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgZmVhdHVyZWQgaW1hZ2UgYW5kIHJlbG9hZHMgYW5hbHl6ZXJcblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlbW92ZUZlYXR1cmVkSW1hZ2UgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldEZlYXR1cmVkSW1hZ2UoIG51bGwgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIHRoaXMgcGx1Z2luIHRvIFlvYXN0U0VPXG5cdCAqL1xuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5yZWdpc3RlclBsdWdpbiA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5yZWdpc3RlclBsdWdpbiggdGhpcy5wbHVnaW5OYW1lLCB7IHN0YXR1czogXCJyZWFkeVwiIH0gKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIG1vZGlmaWNhdGlvbnMgdG8gWW9hc3RTRU9cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5yZWdpc3Rlck1vZGlmaWNhdGlvbiggXCJjb250ZW50XCIsIHRoaXMuYWRkSW1hZ2VUb0NvbnRlbnQuYmluZCggdGhpcyApLCB0aGlzLnBsdWdpbk5hbWUsIDEwICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIEFkZHMgZmVhdHVyZWQgaW1hZ2UgdG8gc29ydCBzbyBpdCBjYW4gYmUgYW5hbHl6ZWRcblx0ICpcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNvbnRlbnRcblx0ICogQHJldHVybnMge1N0cmluZ31cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLmFkZEltYWdlVG9Db250ZW50ID0gZnVuY3Rpb24oIGNvbnRlbnQgKSB7XG5cdFx0aWYgKCBudWxsICE9PSB0aGlzLmZlYXR1cmVkSW1hZ2UgKSB7XG5cdFx0XHRjb250ZW50ICs9IHRoaXMuZmVhdHVyZWRJbWFnZTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29udGVudDtcblx0fTtcblxuXHQvKipcblx0ICogUmVtb3ZlIG9wZW5ncmFwaCB3YXJuaW5nIGZyYW1lIGFuZCBib3JkZXJzXG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCkge1xuXHRcdCQoIFwiI3lzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiICkucmVtb3ZlKCk7XG5cdFx0JCggXCIjcG9zdGltYWdlZGl2XCIgKS5jc3MoIFwiYm9yZGVyXCIsIFwibm9uZVwiICk7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgaWYgaW1hZ2UgaXMgc21hbGxlciB0aGFuIDIwMHgyMDAgcGl4ZWxzLiBJZiB0aGlzIGlzIHRoZSBjYXNlLCBzaG93IGEgd2FybmluZ1xuXHQgKiBAcGFyYW0ge29iamVjdH0gZmVhdHVyZWRJbWFnZVxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICkge1xuXHRcdHZhciBhdHRhY2htZW50ID0gZmVhdHVyZWRJbWFnZS5zdGF0ZSgpLmdldCggXCJzZWxlY3Rpb25cIiApLmZpcnN0KCkudG9KU09OKCk7XG5cblx0XHRpZiAoIGF0dGFjaG1lbnQud2lkdGggPCAyMDAgfHwgYXR0YWNobWVudC5oZWlnaHQgPCAyMDAgKSB7XG5cdFx0XHQvLyBTaG93IHdhcm5pbmcgdG8gdXNlciBhbmQgZG8gbm90IGFkZCBpbWFnZSB0byBPR1xuXHRcdFx0aWYgKCAwID09PSAkKCBcIiN5c3Rfb3BlbmdyYXBoX2ltYWdlX3dhcm5pbmdcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0dmFyICRwb3N0SW1hZ2VEaXYgPSAkKCBcIiNwb3N0aW1hZ2VkaXZcIiApO1xuXHRcdFx0XHQkKCAnPGRpdiBpZD1cInlzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiPjxwPicgKyB3cHNlb0ZlYXR1cmVkSW1hZ2VMMTBuLmZlYXR1cmVkX2ltYWdlX25vdGljZSArIFwiPC9wPjwvZGl2PlwiICkuaW5zZXJ0QmVmb3JlKCAkcG9zdEltYWdlRGl2ICk7XG5cdFx0XHRcdCRwb3N0SW1hZ2VEaXYuY3NzKCB7XG5cdFx0XHRcdFx0Ym9yZGVyOiBcInNvbGlkICNkZDNkMzZcIixcblx0XHRcdFx0XHRib3JkZXJXaWR0aDogXCIzcHggNHB4IDRweCA0cHhcIixcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBGb3JjZSByZXNldCB3YXJuaW5nXG5cdFx0XHRyZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCk7XG5cdFx0fVxuXHR9XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGZlYXR1cmVkSW1hZ2UgPSB3cC5tZWRpYS5mZWF0dXJlZEltYWdlLmZyYW1lKCk7XG5cblx0XHRmZWF0dXJlZEltYWdlUGx1Z2luID0gbmV3IEZlYXR1cmVkSW1hZ2VQbHVnaW4oIFlvYXN0U0VPLmFwcCApO1xuXG5cdFx0ZmVhdHVyZWRJbWFnZS5vbiggXCJzZWxlY3RcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgc2VsZWN0ZWRJbWFnZUhUTUwsIHNlbGVjdGVkSW1hZ2UsIGFsdDtcblxuXHRcdFx0Y2hlY2tGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICk7XG5cblx0XHRcdHNlbGVjdGVkSW1hZ2UgPSBmZWF0dXJlZEltYWdlLnN0YXRlKCkuZ2V0KCBcInNlbGVjdGlvblwiICkuZmlyc3QoKTtcblxuXHRcdFx0Ly8gV29yZFByZXNzIGZhbGxzIGJhY2sgdG8gdGhlIHRpdGxlIGZvciB0aGUgYWx0IGF0dHJpYnV0ZSBpZiBubyBhbHQgaXMgcHJlc2VudC5cblx0XHRcdGFsdCA9IHNlbGVjdGVkSW1hZ2UuZ2V0KCBcImFsdFwiICk7XG5cblx0XHRcdGlmICggXCJcIiA9PT0gYWx0ICkge1xuXHRcdFx0XHRhbHQgPSBzZWxlY3RlZEltYWdlLmdldCggXCJ0aXRsZVwiICk7XG5cdFx0XHR9XG5cblx0XHRcdHNlbGVjdGVkSW1hZ2VIVE1MID0gXCI8aW1nXCIgK1xuXHRcdFx0XHQnIHNyYz1cIicgKyBzZWxlY3RlZEltYWdlLmdldCggXCJ1cmxcIiApICsgJ1wiJyArXG5cdFx0XHRcdCcgd2lkdGg9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoIFwid2lkdGhcIiApICsgJ1wiJyArXG5cdFx0XHRcdCcgaGVpZ2h0PVwiJyArIHNlbGVjdGVkSW1hZ2UuZ2V0KCBcImhlaWdodFwiICkgKyAnXCInICtcblx0XHRcdFx0JyBhbHQ9XCInICsgYWx0ICtcblx0XHRcdFx0J1wiLz4nO1xuXG5cdFx0XHRmZWF0dXJlZEltYWdlUGx1Z2luLnNldEZlYXR1cmVkSW1hZ2UoIHNlbGVjdGVkSW1hZ2VIVE1MICk7XG5cdFx0fSApO1xuXG5cdFx0JCggXCIjcG9zdGltYWdlZGl2XCIgKS5vbiggXCJjbGlja1wiLCBcIiNyZW1vdmUtcG9zdC10aHVtYm5haWxcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHRmZWF0dXJlZEltYWdlUGx1Z2luLnJlbW92ZUZlYXR1cmVkSW1hZ2UoKTtcblx0XHRcdHJlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKTtcblx0XHR9ICk7XG5cblx0XHRmZWF0dXJlZEltYWdlRWxlbWVudCA9ICQoIFwiI3NldC1wb3N0LXRodW1ibmFpbCA+IGltZ1wiICk7XG5cdFx0aWYgKCBcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgZmVhdHVyZWRJbWFnZUVsZW1lbnQucHJvcCggXCJzcmNcIiApICkge1xuXHRcdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbi5zZXRGZWF0dXJlZEltYWdlKCAkKCBcIiNzZXQtcG9zdC10aHVtYm5haWwgXCIgKS5odG1sKCkgKTtcblx0XHR9XG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG5cbi8qIGVzbGludC1kaXNhYmxlICovXG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG4vKipcbiAqIENoZWNrIGlmIGltYWdlIGlzIHNtYWxsZXIgdGhhbiAyMDB4MjAwIHBpeGVscy4gSWYgdGhpcyBpcyB0aGUgY2FzZSwgc2hvdyBhIHdhcm5pbmdcbiAqIEBwYXJhbSB7b2JqZWN0fSBmZWF0dXJlZEltYWdlXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXG4gKi9cbmZ1bmN0aW9uIHlzdF9jaGVja0ZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdHJldHVybjtcbn1cblxuLyoqXG4gKiBDb3VudGVyIHRvIG1ha2Ugc3VyZSB3ZSBkbyBub3QgZW5kIHVwIGluIGFuIGVuZGxlc3MgbG9vcCBpZiB0aGVyZScgbm8gcmVtb3ZlLXBvc3QtdGh1bWJuYWlsIGlkXG4gKiBAdHlwZSB7bnVtYmVyfVxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxuICovXG52YXIgdGh1bWJJZENvdW50ZXIgPSAwO1xuXG4vKipcbiAqIFZhcmlhYmxlIHRvIGhvbGQgdGhlIG9uY2xpY2sgZnVuY3Rpb24gZm9yIHJlbW92ZS1wb3N0LXRodW1ibmFpbC5cbiAqIEB0eXBlIHtmdW5jdGlvbn1cbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAzLjFcbiAqL1xudmFyIHJlbW92ZVRodW1iO1xuXG4vKipcbiAqIElmIHRoZXJlJ3MgYSByZW1vdmUtcG9zdC10aHVtYm5haWwgaWQsIGFkZCBhbiBvbmNsaWNrLiBXaGVuIHRoaXMgaWQgaXMgY2xpY2tlZCwgY2FsbCB5c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZ1xuICogSWYgbm90LCBjaGVjayBhZ2FpbiBhZnRlciAxMDBtcy4gRG8gbm90IGRvIHRoaXMgZm9yIG1vcmUgdGhhbiAxMCB0aW1lcyBzbyB3ZSBkbyBub3QgZW5kIHVwIGluIGFuIGVuZGxlc3MgbG9vcFxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxuICovXG5mdW5jdGlvbiB5c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb24oKSB7XG5cdHJldHVybjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXJyb3IgbWVzc2FnZVxuICovXG5mdW5jdGlvbiB5c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZygpIHtcblx0cmV0dXJuO1xufVxuXG53aW5kb3cueXN0X2NoZWNrRmVhdHVyZWRJbWFnZSA9IHlzdF9jaGVja0ZlYXR1cmVkSW1hZ2U7XG53aW5kb3cudGh1bWJJZENvdW50ZXIgPSB0aHVtYklkQ291bnRlcjtcbndpbmRvdy5yZW1vdmVUaHVtYiA9IHJlbW92ZVRodW1iO1xud2luZG93LnlzdF9vdmVycmlkZUVsZW1GdW5jdGlvbiA9IHlzdF9vdmVycmlkZUVsZW1GdW5jdGlvbjtcbndpbmRvdy55c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZyA9IHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nO1xuLyoganNoaW50IGlnbm9yZTplbmQgKi9cbi8qIGVzbGludC1lbmFibGUgKi9cbiJdfQ==
