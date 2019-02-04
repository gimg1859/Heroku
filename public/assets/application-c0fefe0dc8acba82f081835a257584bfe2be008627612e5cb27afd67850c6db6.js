/*
Unobtrusive JavaScript
https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts
Released under the MIT license
 */


(function() {
  var context = this;

  (function() {
    (function() {
      this.Rails = {
        linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote]:not([disabled]), a[data-disable-with], a[data-disable]',
        buttonClickSelector: {
          selector: 'button[data-remote]:not([form]), button[data-confirm]:not([form])',
          exclude: 'form button'
        },
        inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',
        formSubmitSelector: 'form',
        formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type]), input[type=submit][form], input[type=image][form], button[type=submit][form], button[form]:not([type])',
        formDisableSelector: 'input[data-disable-with]:enabled, button[data-disable-with]:enabled, textarea[data-disable-with]:enabled, input[data-disable]:enabled, button[data-disable]:enabled, textarea[data-disable]:enabled',
        formEnableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled, input[data-disable]:disabled, button[data-disable]:disabled, textarea[data-disable]:disabled',
        fileInputSelector: 'input[name][type=file]:not([disabled])',
        linkDisableSelector: 'a[data-disable-with], a[data-disable]',
        buttonDisableSelector: 'button[data-remote][data-disable-with], button[data-remote][data-disable]'
      };

    }).call(this);
  }).call(context);

  var Rails = context.Rails;

  (function() {
    (function() {
      var cspNonce;

      cspNonce = Rails.cspNonce = function() {
        var meta;
        meta = document.querySelector('meta[name=csp-nonce]');
        return meta && meta.content;
      };

    }).call(this);
    (function() {
      var expando, m;

      m = Element.prototype.matches || Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector;

      Rails.matches = function(element, selector) {
        if (selector.exclude != null) {
          return m.call(element, selector.selector) && !m.call(element, selector.exclude);
        } else {
          return m.call(element, selector);
        }
      };

      expando = '_ujsData';

      Rails.getData = function(element, key) {
        var ref;
        return (ref = element[expando]) != null ? ref[key] : void 0;
      };

      Rails.setData = function(element, key, value) {
        if (element[expando] == null) {
          element[expando] = {};
        }
        return element[expando][key] = value;
      };

      Rails.$ = function(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector));
      };

    }).call(this);
    (function() {
      var $, csrfParam, csrfToken;

      $ = Rails.$;

      csrfToken = Rails.csrfToken = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-token]');
        return meta && meta.content;
      };

      csrfParam = Rails.csrfParam = function() {
        var meta;
        meta = document.querySelector('meta[name=csrf-param]');
        return meta && meta.content;
      };

      Rails.CSRFProtection = function(xhr) {
        var token;
        token = csrfToken();
        if (token != null) {
          return xhr.setRequestHeader('X-CSRF-Token', token);
        }
      };

      Rails.refreshCSRFTokens = function() {
        var param, token;
        token = csrfToken();
        param = csrfParam();
        if ((token != null) && (param != null)) {
          return $('form input[name="' + param + '"]').forEach(function(input) {
            return input.value = token;
          });
        }
      };

    }).call(this);
    (function() {
      var CustomEvent, fire, matches, preventDefault;

      matches = Rails.matches;

      CustomEvent = window.CustomEvent;

      if (typeof CustomEvent !== 'function') {
        CustomEvent = function(event, params) {
          var evt;
          evt = document.createEvent('CustomEvent');
          evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
          return evt;
        };
        CustomEvent.prototype = window.Event.prototype;
        preventDefault = CustomEvent.prototype.preventDefault;
        CustomEvent.prototype.preventDefault = function() {
          var result;
          result = preventDefault.call(this);
          if (this.cancelable && !this.defaultPrevented) {
            Object.defineProperty(this, 'defaultPrevented', {
              get: function() {
                return true;
              }
            });
          }
          return result;
        };
      }

      fire = Rails.fire = function(obj, name, data) {
        var event;
        event = new CustomEvent(name, {
          bubbles: true,
          cancelable: true,
          detail: data
        });
        obj.dispatchEvent(event);
        return !event.defaultPrevented;
      };

      Rails.stopEverything = function(e) {
        fire(e.target, 'ujs:everythingStopped');
        e.preventDefault();
        e.stopPropagation();
        return e.stopImmediatePropagation();
      };

      Rails.delegate = function(element, selector, eventType, handler) {
        return element.addEventListener(eventType, function(e) {
          var target;
          target = e.target;
          while (!(!(target instanceof Element) || matches(target, selector))) {
            target = target.parentNode;
          }
          if (target instanceof Element && handler.call(target, e) === false) {
            e.preventDefault();
            return e.stopPropagation();
          }
        });
      };

    }).call(this);
    (function() {
      var AcceptHeaders, CSRFProtection, createXHR, cspNonce, fire, prepareOptions, processResponse;

      cspNonce = Rails.cspNonce, CSRFProtection = Rails.CSRFProtection, fire = Rails.fire;

      AcceptHeaders = {
        '*': '*/*',
        text: 'text/plain',
        html: 'text/html',
        xml: 'application/xml, text/xml',
        json: 'application/json, text/javascript',
        script: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript'
      };

      Rails.ajax = function(options) {
        var xhr;
        options = prepareOptions(options);
        xhr = createXHR(options, function() {
          var ref, response;
          response = processResponse((ref = xhr.response) != null ? ref : xhr.responseText, xhr.getResponseHeader('Content-Type'));
          if (Math.floor(xhr.status / 100) === 2) {
            if (typeof options.success === "function") {
              options.success(response, xhr.statusText, xhr);
            }
          } else {
            if (typeof options.error === "function") {
              options.error(response, xhr.statusText, xhr);
            }
          }
          return typeof options.complete === "function" ? options.complete(xhr, xhr.statusText) : void 0;
        });
        if ((options.beforeSend != null) && !options.beforeSend(xhr, options)) {
          return false;
        }
        if (xhr.readyState === XMLHttpRequest.OPENED) {
          return xhr.send(options.data);
        }
      };

      prepareOptions = function(options) {
        options.url = options.url || location.href;
        options.type = options.type.toUpperCase();
        if (options.type === 'GET' && options.data) {
          if (options.url.indexOf('?') < 0) {
            options.url += '?' + options.data;
          } else {
            options.url += '&' + options.data;
          }
        }
        if (AcceptHeaders[options.dataType] == null) {
          options.dataType = '*';
        }
        options.accept = AcceptHeaders[options.dataType];
        if (options.dataType !== '*') {
          options.accept += ', */*; q=0.01';
        }
        return options;
      };

      createXHR = function(options, done) {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open(options.type, options.url, true);
        xhr.setRequestHeader('Accept', options.accept);
        if (typeof options.data === 'string') {
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        }
        if (!options.crossDomain) {
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        }
        CSRFProtection(xhr);
        xhr.withCredentials = !!options.withCredentials;
        xhr.onreadystatechange = function() {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            return done(xhr);
          }
        };
        return xhr;
      };

      processResponse = function(response, type) {
        var parser, script;
        if (typeof response === 'string' && typeof type === 'string') {
          if (type.match(/\bjson\b/)) {
            try {
              response = JSON.parse(response);
            } catch (error) {}
          } else if (type.match(/\b(?:java|ecma)script\b/)) {
            script = document.createElement('script');
            script.setAttribute('nonce', cspNonce());
            script.text = response;
            document.head.appendChild(script).parentNode.removeChild(script);
          } else if (type.match(/\b(xml|html|svg)\b/)) {
            parser = new DOMParser();
            type = type.replace(/;.+/, '');
            try {
              response = parser.parseFromString(response, type);
            } catch (error) {}
          }
        }
        return response;
      };

      Rails.href = function(element) {
        return element.href;
      };

      Rails.isCrossDomain = function(url) {
        var e, originAnchor, urlAnchor;
        originAnchor = document.createElement('a');
        originAnchor.href = location.href;
        urlAnchor = document.createElement('a');
        try {
          urlAnchor.href = url;
          return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) || (originAnchor.protocol + '//' + originAnchor.host === urlAnchor.protocol + '//' + urlAnchor.host));
        } catch (error) {
          e = error;
          return true;
        }
      };

    }).call(this);
    (function() {
      var matches, toArray;

      matches = Rails.matches;

      toArray = function(e) {
        return Array.prototype.slice.call(e);
      };

      Rails.serializeElement = function(element, additionalParam) {
        var inputs, params;
        inputs = [element];
        if (matches(element, 'form')) {
          inputs = toArray(element.elements);
        }
        params = [];
        inputs.forEach(function(input) {
          if (!input.name || input.disabled) {
            return;
          }
          if (matches(input, 'select')) {
            return toArray(input.options).forEach(function(option) {
              if (option.selected) {
                return params.push({
                  name: input.name,
                  value: option.value
                });
              }
            });
          } else if (input.checked || ['radio', 'checkbox', 'submit'].indexOf(input.type) === -1) {
            return params.push({
              name: input.name,
              value: input.value
            });
          }
        });
        if (additionalParam) {
          params.push(additionalParam);
        }
        return params.map(function(param) {
          if (param.name != null) {
            return (encodeURIComponent(param.name)) + "=" + (encodeURIComponent(param.value));
          } else {
            return param;
          }
        }).join('&');
      };

      Rails.formElements = function(form, selector) {
        if (matches(form, 'form')) {
          return toArray(form.elements).filter(function(el) {
            return matches(el, selector);
          });
        } else {
          return toArray(form.querySelectorAll(selector));
        }
      };

    }).call(this);
    (function() {
      var allowAction, fire, stopEverything;

      fire = Rails.fire, stopEverything = Rails.stopEverything;

      Rails.handleConfirm = function(e) {
        if (!allowAction(this)) {
          return stopEverything(e);
        }
      };

      allowAction = function(element) {
        var answer, callback, message;
        message = element.getAttribute('data-confirm');
        if (!message) {
          return true;
        }
        answer = false;
        if (fire(element, 'confirm')) {
          try {
            answer = confirm(message);
          } catch (error) {}
          callback = fire(element, 'confirm:complete', [answer]);
        }
        return answer && callback;
      };

    }).call(this);
    (function() {
      var disableFormElement, disableFormElements, disableLinkElement, enableFormElement, enableFormElements, enableLinkElement, formElements, getData, matches, setData, stopEverything;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, stopEverything = Rails.stopEverything, formElements = Rails.formElements;

      Rails.handleDisabledElement = function(e) {
        var element;
        element = this;
        if (element.disabled) {
          return stopEverything(e);
        }
      };

      Rails.enableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return enableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formEnableSelector)) {
          return enableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return enableFormElements(element);
        }
      };

      Rails.disableElement = function(e) {
        var element;
        element = e instanceof Event ? e.target : e;
        if (matches(element, Rails.linkDisableSelector)) {
          return disableLinkElement(element);
        } else if (matches(element, Rails.buttonDisableSelector) || matches(element, Rails.formDisableSelector)) {
          return disableFormElement(element);
        } else if (matches(element, Rails.formSubmitSelector)) {
          return disableFormElements(element);
        }
      };

      disableLinkElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          setData(element, 'ujs:enable-with', element.innerHTML);
          element.innerHTML = replacement;
        }
        element.addEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', true);
      };

      enableLinkElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          element.innerHTML = originalText;
          setData(element, 'ujs:enable-with', null);
        }
        element.removeEventListener('click', stopEverything);
        return setData(element, 'ujs:disabled', null);
      };

      disableFormElements = function(form) {
        return formElements(form, Rails.formDisableSelector).forEach(disableFormElement);
      };

      disableFormElement = function(element) {
        var replacement;
        replacement = element.getAttribute('data-disable-with');
        if (replacement != null) {
          if (matches(element, 'button')) {
            setData(element, 'ujs:enable-with', element.innerHTML);
            element.innerHTML = replacement;
          } else {
            setData(element, 'ujs:enable-with', element.value);
            element.value = replacement;
          }
        }
        element.disabled = true;
        return setData(element, 'ujs:disabled', true);
      };

      enableFormElements = function(form) {
        return formElements(form, Rails.formEnableSelector).forEach(enableFormElement);
      };

      enableFormElement = function(element) {
        var originalText;
        originalText = getData(element, 'ujs:enable-with');
        if (originalText != null) {
          if (matches(element, 'button')) {
            element.innerHTML = originalText;
          } else {
            element.value = originalText;
          }
          setData(element, 'ujs:enable-with', null);
        }
        element.disabled = false;
        return setData(element, 'ujs:disabled', null);
      };

    }).call(this);
    (function() {
      var stopEverything;

      stopEverything = Rails.stopEverything;

      Rails.handleMethod = function(e) {
        var csrfParam, csrfToken, form, formContent, href, link, method;
        link = this;
        method = link.getAttribute('data-method');
        if (!method) {
          return;
        }
        href = Rails.href(link);
        csrfToken = Rails.csrfToken();
        csrfParam = Rails.csrfParam();
        form = document.createElement('form');
        formContent = "<input name='_method' value='" + method + "' type='hidden' />";
        if ((csrfParam != null) && (csrfToken != null) && !Rails.isCrossDomain(href)) {
          formContent += "<input name='" + csrfParam + "' value='" + csrfToken + "' type='hidden' />";
        }
        formContent += '<input type="submit" />';
        form.method = 'post';
        form.action = href;
        form.target = link.target;
        form.innerHTML = formContent;
        form.style.display = 'none';
        document.body.appendChild(form);
        form.querySelector('[type="submit"]').click();
        return stopEverything(e);
      };

    }).call(this);
    (function() {
      var ajax, fire, getData, isCrossDomain, isRemote, matches, serializeElement, setData, stopEverything,
        slice = [].slice;

      matches = Rails.matches, getData = Rails.getData, setData = Rails.setData, fire = Rails.fire, stopEverything = Rails.stopEverything, ajax = Rails.ajax, isCrossDomain = Rails.isCrossDomain, serializeElement = Rails.serializeElement;

      isRemote = function(element) {
        var value;
        value = element.getAttribute('data-remote');
        return (value != null) && value !== 'false';
      };

      Rails.handleRemote = function(e) {
        var button, data, dataType, element, method, url, withCredentials;
        element = this;
        if (!isRemote(element)) {
          return true;
        }
        if (!fire(element, 'ajax:before')) {
          fire(element, 'ajax:stopped');
          return false;
        }
        withCredentials = element.getAttribute('data-with-credentials');
        dataType = element.getAttribute('data-type') || 'script';
        if (matches(element, Rails.formSubmitSelector)) {
          button = getData(element, 'ujs:submit-button');
          method = getData(element, 'ujs:submit-button-formmethod') || element.method;
          url = getData(element, 'ujs:submit-button-formaction') || element.getAttribute('action') || location.href;
          if (method.toUpperCase() === 'GET') {
            url = url.replace(/\?.*$/, '');
          }
          if (element.enctype === 'multipart/form-data') {
            data = new FormData(element);
            if (button != null) {
              data.append(button.name, button.value);
            }
          } else {
            data = serializeElement(element, button);
          }
          setData(element, 'ujs:submit-button', null);
          setData(element, 'ujs:submit-button-formmethod', null);
          setData(element, 'ujs:submit-button-formaction', null);
        } else if (matches(element, Rails.buttonClickSelector) || matches(element, Rails.inputChangeSelector)) {
          method = element.getAttribute('data-method');
          url = element.getAttribute('data-url');
          data = serializeElement(element, element.getAttribute('data-params'));
        } else {
          method = element.getAttribute('data-method');
          url = Rails.href(element);
          data = element.getAttribute('data-params');
        }
        ajax({
          type: method || 'GET',
          url: url,
          data: data,
          dataType: dataType,
          beforeSend: function(xhr, options) {
            if (fire(element, 'ajax:beforeSend', [xhr, options])) {
              return fire(element, 'ajax:send', [xhr]);
            } else {
              fire(element, 'ajax:stopped');
              return false;
            }
          },
          success: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:success', args);
          },
          error: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:error', args);
          },
          complete: function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return fire(element, 'ajax:complete', args);
          },
          crossDomain: isCrossDomain(url),
          withCredentials: (withCredentials != null) && withCredentials !== 'false'
        });
        return stopEverything(e);
      };

      Rails.formSubmitButtonClick = function(e) {
        var button, form;
        button = this;
        form = button.form;
        if (!form) {
          return;
        }
        if (button.name) {
          setData(form, 'ujs:submit-button', {
            name: button.name,
            value: button.value
          });
        }
        setData(form, 'ujs:formnovalidate-button', button.formNoValidate);
        setData(form, 'ujs:submit-button-formaction', button.getAttribute('formaction'));
        return setData(form, 'ujs:submit-button-formmethod', button.getAttribute('formmethod'));
      };

      Rails.handleMetaClick = function(e) {
        var data, link, metaClick, method;
        link = this;
        method = (link.getAttribute('data-method') || 'GET').toUpperCase();
        data = link.getAttribute('data-params');
        metaClick = e.metaKey || e.ctrlKey;
        if (metaClick && method === 'GET' && !data) {
          return e.stopImmediatePropagation();
        }
      };

    }).call(this);
    (function() {
      var $, CSRFProtection, delegate, disableElement, enableElement, fire, formSubmitButtonClick, getData, handleConfirm, handleDisabledElement, handleMetaClick, handleMethod, handleRemote, refreshCSRFTokens;

      fire = Rails.fire, delegate = Rails.delegate, getData = Rails.getData, $ = Rails.$, refreshCSRFTokens = Rails.refreshCSRFTokens, CSRFProtection = Rails.CSRFProtection, enableElement = Rails.enableElement, disableElement = Rails.disableElement, handleDisabledElement = Rails.handleDisabledElement, handleConfirm = Rails.handleConfirm, handleRemote = Rails.handleRemote, formSubmitButtonClick = Rails.formSubmitButtonClick, handleMetaClick = Rails.handleMetaClick, handleMethod = Rails.handleMethod;

      if ((typeof jQuery !== "undefined" && jQuery !== null) && (jQuery.ajax != null) && !jQuery.rails) {
        jQuery.rails = Rails;
        jQuery.ajaxPrefilter(function(options, originalOptions, xhr) {
          if (!options.crossDomain) {
            return CSRFProtection(xhr);
          }
        });
      }

      Rails.start = function() {
        if (window._rails_loaded) {
          throw new Error('rails-ujs has already been loaded!');
        }
        window.addEventListener('pageshow', function() {
          $(Rails.formEnableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
          return $(Rails.linkDisableSelector).forEach(function(el) {
            if (getData(el, 'ujs:disabled')) {
              return enableElement(el);
            }
          });
        });
        delegate(document, Rails.linkDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.linkDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.buttonDisableSelector, 'ajax:stopped', enableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.linkClickSelector, 'click', handleConfirm);
        delegate(document, Rails.linkClickSelector, 'click', handleMetaClick);
        delegate(document, Rails.linkClickSelector, 'click', disableElement);
        delegate(document, Rails.linkClickSelector, 'click', handleRemote);
        delegate(document, Rails.linkClickSelector, 'click', handleMethod);
        delegate(document, Rails.buttonClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleConfirm);
        delegate(document, Rails.buttonClickSelector, 'click', disableElement);
        delegate(document, Rails.buttonClickSelector, 'click', handleRemote);
        delegate(document, Rails.inputChangeSelector, 'change', handleDisabledElement);
        delegate(document, Rails.inputChangeSelector, 'change', handleConfirm);
        delegate(document, Rails.inputChangeSelector, 'change', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', handleDisabledElement);
        delegate(document, Rails.formSubmitSelector, 'submit', handleConfirm);
        delegate(document, Rails.formSubmitSelector, 'submit', handleRemote);
        delegate(document, Rails.formSubmitSelector, 'submit', function(e) {
          return setTimeout((function() {
            return disableElement(e);
          }), 13);
        });
        delegate(document, Rails.formSubmitSelector, 'ajax:send', disableElement);
        delegate(document, Rails.formSubmitSelector, 'ajax:complete', enableElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleDisabledElement);
        delegate(document, Rails.formInputClickSelector, 'click', handleConfirm);
        delegate(document, Rails.formInputClickSelector, 'click', formSubmitButtonClick);
        document.addEventListener('DOMContentLoaded', refreshCSRFTokens);
        return window._rails_loaded = true;
      };

      if (window.Rails === Rails && fire(document, 'rails:attachBindings')) {
        Rails.start();
      }

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = Rails;
  } else if (typeof define === "function" && define.amd) {
    define(Rails);
  }
}).call(this);
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.ActiveStorage=e():t.ActiveStorage=e()}(this,function(){return function(t){function e(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var r={};return e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,r){"use strict";function n(t){var e=a(document.head,'meta[name="'+t+'"]');if(e)return e.getAttribute("content")}function i(t,e){return"string"==typeof t&&(e=t,t=document),o(t.querySelectorAll(e))}function a(t,e){return"string"==typeof t&&(e=t,t=document),t.querySelector(e)}function u(t,e){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=t.disabled,i=r.bubbles,a=r.cancelable,u=r.detail,o=document.createEvent("Event");o.initEvent(e,i||!0,a||!0),o.detail=u||{};try{t.disabled=!1,t.dispatchEvent(o)}finally{t.disabled=n}return o}function o(t){return Array.isArray(t)?t:Array.from?Array.from(t):[].slice.call(t)}e.d=n,e.c=i,e.b=a,e.a=u,e.e=o},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){if(t&&"function"==typeof t[e]){for(var r=arguments.length,n=Array(r>2?r-2:0),i=2;i<r;i++)n[i-2]=arguments[i];return t[e].apply(t,n)}}r.d(e,"a",function(){return c});var a=r(6),u=r(8),o=r(9),s=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),f=0,c=function(){function t(e,r,i){n(this,t),this.id=++f,this.file=e,this.url=r,this.delegate=i}return s(t,[{key:"create",value:function(t){var e=this;a.a.create(this.file,function(r,n){if(r)return void t(r);var a=new u.a(e.file,n,e.url);i(e.delegate,"directUploadWillCreateBlobWithXHR",a.xhr),a.create(function(r){if(r)t(r);else{var n=new o.a(a);i(e.delegate,"directUploadWillStoreFileWithXHR",n.xhr),n.create(function(e){e?t(e):t(null,a.toJSON())})}})})}}]),t}()},function(t,e,r){"use strict";function n(){window.ActiveStorage&&Object(i.a)()}Object.defineProperty(e,"__esModule",{value:!0});var i=r(3),a=r(1);r.d(e,"start",function(){return i.a}),r.d(e,"DirectUpload",function(){return a.a}),setTimeout(n,1)},function(t,e,r){"use strict";function n(){d||(d=!0,document.addEventListener("submit",i),document.addEventListener("ajax:before",a))}function i(t){u(t)}function a(t){"FORM"==t.target.tagName&&u(t)}function u(t){var e=t.target;if(e.hasAttribute(l))return void t.preventDefault();var r=new c.a(e),n=r.inputs;n.length&&(t.preventDefault(),e.setAttribute(l,""),n.forEach(s),r.start(function(t){e.removeAttribute(l),t?n.forEach(f):o(e)}))}function o(t){var e=Object(h.b)(t,"input[type=submit]");if(e){var r=e,n=r.disabled;e.disabled=!1,e.focus(),e.click(),e.disabled=n}else e=document.createElement("input"),e.type="submit",e.style.display="none",t.appendChild(e),e.click(),t.removeChild(e)}function s(t){t.disabled=!0}function f(t){t.disabled=!1}e.a=n;var c=r(4),h=r(0),l="data-direct-uploads-processing",d=!1},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return s});var i=r(5),a=r(0),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o="input[type=file][data-direct-upload-url]:not([disabled])",s=function(){function t(e){n(this,t),this.form=e,this.inputs=Object(a.c)(e,o).filter(function(t){return t.files.length})}return u(t,[{key:"start",value:function(t){var e=this,r=this.createDirectUploadControllers();this.dispatch("start"),function n(){var i=r.shift();i?i.start(function(r){r?(t(r),e.dispatch("end")):n()}):(t(),e.dispatch("end"))}()}},{key:"createDirectUploadControllers",value:function(){var t=[];return this.inputs.forEach(function(e){Object(a.e)(e.files).forEach(function(r){var n=new i.a(e,r);t.push(n)})}),t}},{key:"dispatch",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return Object(a.a)(this.form,"direct-uploads:"+t,{detail:e})}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return o});var i=r(1),a=r(0),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=function(){function t(e,r){n(this,t),this.input=e,this.file=r,this.directUpload=new i.a(this.file,this.url,this),this.dispatch("initialize")}return u(t,[{key:"start",value:function(t){var e=this,r=document.createElement("input");r.type="hidden",r.name=this.input.name,this.input.insertAdjacentElement("beforebegin",r),this.dispatch("start"),this.directUpload.create(function(n,i){n?(r.parentNode.removeChild(r),e.dispatchError(n)):r.value=i.signed_id,e.dispatch("end"),t(n)})}},{key:"uploadRequestDidProgress",value:function(t){var e=t.loaded/t.total*100;e&&this.dispatch("progress",{progress:e})}},{key:"dispatch",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.file=this.file,e.id=this.directUpload.id,Object(a.a)(this.input,"direct-upload:"+t,{detail:e})}},{key:"dispatchError",value:function(t){this.dispatch("error",{error:t}).defaultPrevented||alert(t)}},{key:"directUploadWillCreateBlobWithXHR",value:function(t){this.dispatch("before-blob-request",{xhr:t})}},{key:"directUploadWillStoreFileWithXHR",value:function(t){var e=this;this.dispatch("before-storage-request",{xhr:t}),t.upload.addEventListener("progress",function(t){return e.uploadRequestDidProgress(t)})}},{key:"url",get:function(){return this.input.getAttribute("data-direct-upload-url")}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return s});var i=r(7),a=r.n(i),u=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),o=File.prototype.slice||File.prototype.mozSlice||File.prototype.webkitSlice,s=function(){function t(e){n(this,t),this.file=e,this.chunkSize=2097152,this.chunkCount=Math.ceil(this.file.size/this.chunkSize),this.chunkIndex=0}return u(t,null,[{key:"create",value:function(e,r){new t(e).create(r)}}]),u(t,[{key:"create",value:function(t){var e=this;this.callback=t,this.md5Buffer=new a.a.ArrayBuffer,this.fileReader=new FileReader,this.fileReader.addEventListener("load",function(t){return e.fileReaderDidLoad(t)}),this.fileReader.addEventListener("error",function(t){return e.fileReaderDidError(t)}),this.readNextChunk()}},{key:"fileReaderDidLoad",value:function(t){if(this.md5Buffer.append(t.target.result),!this.readNextChunk()){var e=this.md5Buffer.end(!0),r=btoa(e);this.callback(null,r)}}},{key:"fileReaderDidError",value:function(t){this.callback("Error reading "+this.file.name)}},{key:"readNextChunk",value:function(){if(this.chunkIndex<this.chunkCount||0==this.chunkIndex&&0==this.chunkCount){var t=this.chunkIndex*this.chunkSize,e=Math.min(t+this.chunkSize,this.file.size),r=o.call(this.file,t,e);return this.fileReader.readAsArrayBuffer(r),this.chunkIndex++,!0}return!1}}]),t}()},function(t,e,r){!function(e){t.exports=e()}(function(t){"use strict";function e(t,e){var r=t[0],n=t[1],i=t[2],a=t[3];r+=(n&i|~n&a)+e[0]-680876936|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[1]-389564586|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[2]+606105819|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[3]-1044525330|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[4]-176418897|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[5]+1200080426|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[6]-1473231341|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[7]-45705983|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[8]+1770035416|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[9]-1958414417|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[10]-42063|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[11]-1990404162|0,n=(n<<22|n>>>10)+i|0,r+=(n&i|~n&a)+e[12]+1804603682|0,r=(r<<7|r>>>25)+n|0,a+=(r&n|~r&i)+e[13]-40341101|0,a=(a<<12|a>>>20)+r|0,i+=(a&r|~a&n)+e[14]-1502002290|0,i=(i<<17|i>>>15)+a|0,n+=(i&a|~i&r)+e[15]+1236535329|0,n=(n<<22|n>>>10)+i|0,r+=(n&a|i&~a)+e[1]-165796510|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[6]-1069501632|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[11]+643717713|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[0]-373897302|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[5]-701558691|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[10]+38016083|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[15]-660478335|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[4]-405537848|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[9]+568446438|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[14]-1019803690|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[3]-187363961|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[8]+1163531501|0,n=(n<<20|n>>>12)+i|0,r+=(n&a|i&~a)+e[13]-1444681467|0,r=(r<<5|r>>>27)+n|0,a+=(r&i|n&~i)+e[2]-51403784|0,a=(a<<9|a>>>23)+r|0,i+=(a&n|r&~n)+e[7]+1735328473|0,i=(i<<14|i>>>18)+a|0,n+=(i&r|a&~r)+e[12]-1926607734|0,n=(n<<20|n>>>12)+i|0,r+=(n^i^a)+e[5]-378558|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[8]-2022574463|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[11]+1839030562|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[14]-35309556|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[1]-1530992060|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[4]+1272893353|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[7]-155497632|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[10]-1094730640|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[13]+681279174|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[0]-358537222|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[3]-722521979|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[6]+76029189|0,n=(n<<23|n>>>9)+i|0,r+=(n^i^a)+e[9]-640364487|0,r=(r<<4|r>>>28)+n|0,a+=(r^n^i)+e[12]-421815835|0,a=(a<<11|a>>>21)+r|0,i+=(a^r^n)+e[15]+530742520|0,i=(i<<16|i>>>16)+a|0,n+=(i^a^r)+e[2]-995338651|0,n=(n<<23|n>>>9)+i|0,r+=(i^(n|~a))+e[0]-198630844|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[7]+1126891415|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[14]-1416354905|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[5]-57434055|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[12]+1700485571|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[3]-1894986606|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[10]-1051523|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[1]-2054922799|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[8]+1873313359|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[15]-30611744|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[6]-1560198380|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[13]+1309151649|0,n=(n<<21|n>>>11)+i|0,r+=(i^(n|~a))+e[4]-145523070|0,r=(r<<6|r>>>26)+n|0,a+=(n^(r|~i))+e[11]-1120210379|0,a=(a<<10|a>>>22)+r|0,i+=(r^(a|~n))+e[2]+718787259|0,i=(i<<15|i>>>17)+a|0,n+=(a^(i|~r))+e[9]-343485551|0,n=(n<<21|n>>>11)+i|0,t[0]=r+t[0]|0,t[1]=n+t[1]|0,t[2]=i+t[2]|0,t[3]=a+t[3]|0}function r(t){var e,r=[];for(e=0;e<64;e+=4)r[e>>2]=t.charCodeAt(e)+(t.charCodeAt(e+1)<<8)+(t.charCodeAt(e+2)<<16)+(t.charCodeAt(e+3)<<24);return r}function n(t){var e,r=[];for(e=0;e<64;e+=4)r[e>>2]=t[e]+(t[e+1]<<8)+(t[e+2]<<16)+(t[e+3]<<24);return r}function i(t){var n,i,a,u,o,s,f=t.length,c=[1732584193,-271733879,-1732584194,271733878];for(n=64;n<=f;n+=64)e(c,r(t.substring(n-64,n)));for(t=t.substring(n-64),i=t.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],n=0;n<i;n+=1)a[n>>2]|=t.charCodeAt(n)<<(n%4<<3);if(a[n>>2]|=128<<(n%4<<3),n>55)for(e(c,a),n=0;n<16;n+=1)a[n]=0;return u=8*f,u=u.toString(16).match(/(.*?)(.{0,8})$/),o=parseInt(u[2],16),s=parseInt(u[1],16)||0,a[14]=o,a[15]=s,e(c,a),c}function a(t){var r,i,a,u,o,s,f=t.length,c=[1732584193,-271733879,-1732584194,271733878];for(r=64;r<=f;r+=64)e(c,n(t.subarray(r-64,r)));for(t=r-64<f?t.subarray(r-64):new Uint8Array(0),i=t.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],r=0;r<i;r+=1)a[r>>2]|=t[r]<<(r%4<<3);if(a[r>>2]|=128<<(r%4<<3),r>55)for(e(c,a),r=0;r<16;r+=1)a[r]=0;return u=8*f,u=u.toString(16).match(/(.*?)(.{0,8})$/),o=parseInt(u[2],16),s=parseInt(u[1],16)||0,a[14]=o,a[15]=s,e(c,a),c}function u(t){var e,r="";for(e=0;e<4;e+=1)r+=p[t>>8*e+4&15]+p[t>>8*e&15];return r}function o(t){var e;for(e=0;e<t.length;e+=1)t[e]=u(t[e]);return t.join("")}function s(t){return/[\u0080-\uFFFF]/.test(t)&&(t=unescape(encodeURIComponent(t))),t}function f(t,e){var r,n=t.length,i=new ArrayBuffer(n),a=new Uint8Array(i);for(r=0;r<n;r+=1)a[r]=t.charCodeAt(r);return e?a:i}function c(t){return String.fromCharCode.apply(null,new Uint8Array(t))}function h(t,e,r){var n=new Uint8Array(t.byteLength+e.byteLength);return n.set(new Uint8Array(t)),n.set(new Uint8Array(e),t.byteLength),r?n:n.buffer}function l(t){var e,r=[],n=t.length;for(e=0;e<n-1;e+=2)r.push(parseInt(t.substr(e,2),16));return String.fromCharCode.apply(String,r)}function d(){this.reset()}var p=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];return"5d41402abc4b2a76b9719d911017c592"!==o(i("hello"))&&function(t,e){var r=(65535&t)+(65535&e);return(t>>16)+(e>>16)+(r>>16)<<16|65535&r},"undefined"==typeof ArrayBuffer||ArrayBuffer.prototype.slice||function(){function e(t,e){return t=0|t||0,t<0?Math.max(t+e,0):Math.min(t,e)}ArrayBuffer.prototype.slice=function(r,n){var i,a,u,o,s=this.byteLength,f=e(r,s),c=s;return n!==t&&(c=e(n,s)),f>c?new ArrayBuffer(0):(i=c-f,a=new ArrayBuffer(i),u=new Uint8Array(a),o=new Uint8Array(this,f,i),u.set(o),a)}}(),d.prototype.append=function(t){return this.appendBinary(s(t)),this},d.prototype.appendBinary=function(t){this._buff+=t,this._length+=t.length;var n,i=this._buff.length;for(n=64;n<=i;n+=64)e(this._hash,r(this._buff.substring(n-64,n)));return this._buff=this._buff.substring(n-64),this},d.prototype.end=function(t){var e,r,n=this._buff,i=n.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<i;e+=1)a[e>>2]|=n.charCodeAt(e)<<(e%4<<3);return this._finish(a,i),r=o(this._hash),t&&(r=l(r)),this.reset(),r},d.prototype.reset=function(){return this._buff="",this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},d.prototype.getState=function(){return{buff:this._buff,length:this._length,hash:this._hash}},d.prototype.setState=function(t){return this._buff=t.buff,this._length=t.length,this._hash=t.hash,this},d.prototype.destroy=function(){delete this._hash,delete this._buff,delete this._length},d.prototype._finish=function(t,r){var n,i,a,u=r;if(t[u>>2]|=128<<(u%4<<3),u>55)for(e(this._hash,t),u=0;u<16;u+=1)t[u]=0;n=8*this._length,n=n.toString(16).match(/(.*?)(.{0,8})$/),i=parseInt(n[2],16),a=parseInt(n[1],16)||0,t[14]=i,t[15]=a,e(this._hash,t)},d.hash=function(t,e){return d.hashBinary(s(t),e)},d.hashBinary=function(t,e){var r=i(t),n=o(r);return e?l(n):n},d.ArrayBuffer=function(){this.reset()},d.ArrayBuffer.prototype.append=function(t){var r,i=h(this._buff.buffer,t,!0),a=i.length;for(this._length+=t.byteLength,r=64;r<=a;r+=64)e(this._hash,n(i.subarray(r-64,r)));return this._buff=r-64<a?new Uint8Array(i.buffer.slice(r-64)):new Uint8Array(0),this},d.ArrayBuffer.prototype.end=function(t){var e,r,n=this._buff,i=n.length,a=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(e=0;e<i;e+=1)a[e>>2]|=n[e]<<(e%4<<3);return this._finish(a,i),r=o(this._hash),t&&(r=l(r)),this.reset(),r},d.ArrayBuffer.prototype.reset=function(){return this._buff=new Uint8Array(0),this._length=0,this._hash=[1732584193,-271733879,-1732584194,271733878],this},d.ArrayBuffer.prototype.getState=function(){var t=d.prototype.getState.call(this);return t.buff=c(t.buff),t},d.ArrayBuffer.prototype.setState=function(t){return t.buff=f(t.buff,!0),d.prototype.setState.call(this,t)},d.ArrayBuffer.prototype.destroy=d.prototype.destroy,d.ArrayBuffer.prototype._finish=d.prototype._finish,d.ArrayBuffer.hash=function(t,e){var r=a(new Uint8Array(t)),n=o(r);return e?l(n):n},d})},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return u});var i=r(0),a=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),u=function(){function t(e,r,a){var u=this;n(this,t),this.file=e,this.attributes={filename:e.name,content_type:e.type,byte_size:e.size,checksum:r},this.xhr=new XMLHttpRequest,this.xhr.open("POST",a,!0),this.xhr.responseType="json",this.xhr.setRequestHeader("Content-Type","application/json"),this.xhr.setRequestHeader("Accept","application/json"),this.xhr.setRequestHeader("X-Requested-With","XMLHttpRequest"),this.xhr.setRequestHeader("X-CSRF-Token",Object(i.d)("csrf-token")),this.xhr.addEventListener("load",function(t){return u.requestDidLoad(t)}),this.xhr.addEventListener("error",function(t){return u.requestDidError(t)})}return a(t,[{key:"create",value:function(t){this.callback=t,this.xhr.send(JSON.stringify({blob:this.attributes}))}},{key:"requestDidLoad",value:function(t){if(this.status>=200&&this.status<300){var e=this.response,r=e.direct_upload;delete e.direct_upload,this.attributes=e,this.directUploadData=r,this.callback(null,this.toJSON())}else this.requestDidError(t)}},{key:"requestDidError",value:function(t){this.callback('Error creating Blob for "'+this.file.name+'". Status: '+this.status)}},{key:"toJSON",value:function(){var t={};for(var e in this.attributes)t[e]=this.attributes[e];return t}},{key:"status",get:function(){return this.xhr.status}},{key:"response",get:function(){var t=this.xhr,e=t.responseType,r=t.response;return"json"==e?r:JSON.parse(r)}}]),t}()},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}r.d(e,"a",function(){return a});var i=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),a=function(){function t(e){var r=this;n(this,t),this.blob=e,this.file=e.file;var i=e.directUploadData,a=i.url,u=i.headers;this.xhr=new XMLHttpRequest,this.xhr.open("PUT",a,!0),this.xhr.responseType="text";for(var o in u)this.xhr.setRequestHeader(o,u[o]);this.xhr.addEventListener("load",function(t){return r.requestDidLoad(t)}),this.xhr.addEventListener("error",function(t){return r.requestDidError(t)})}return i(t,[{key:"create",value:function(t){this.callback=t,this.xhr.send(this.file.slice())}},{key:"requestDidLoad",value:function(t){var e=this.xhr,r=e.status,n=e.response;r>=200&&r<300?this.callback(null,n):this.requestDidError(t)}},{key:"requestDidError",value:function(t){this.callback('Error storing "'+this.file.name+'". Status: '+this.xhr.status)}}]),t}()}])});
/*
Turbolinks 5.2.0
Copyright © 2018 Basecamp, LLC
 */

(function(){var t=this;(function(){(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame&&null!=window.addEventListener}(),visit:function(t,r){return e.controller.visit(t,r)},clearCache:function(){return e.controller.clearCache()},setProgressBarDelay:function(t){return e.controller.setProgressBarDelay(t)}}}).call(this)}).call(t);var e=t.Turbolinks;(function(){(function(){var t,r,n,o=[].slice;e.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},e.closest=function(e,r){return t.call(e,r)},t=function(){var t,e;return t=document.documentElement,null!=(e=t.closest)?e:function(t){var e;for(e=this;e;){if(e.nodeType===Node.ELEMENT_NODE&&r.call(e,t))return e;e=e.parentNode}}}(),e.defer=function(t){return setTimeout(t,1)},e.throttle=function(t){var e;return e=null,function(){var r;return r=1<=arguments.length?o.call(arguments,0):[],null!=e?e:e=requestAnimationFrame(function(n){return function(){return e=null,t.apply(n,r)}}(this))}},e.dispatch=function(t,e){var r,o,i,s,a,u;return a=null!=e?e:{},u=a.target,r=a.cancelable,o=a.data,i=document.createEvent("Events"),i.initEvent(t,!0,r===!0),i.data=null!=o?o:{},i.cancelable&&!n&&(s=i.preventDefault,i.preventDefault=function(){return this.defaultPrevented||Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}),s.call(this)}),(null!=u?u:document).dispatchEvent(i),i},n=function(){var t;return t=document.createEvent("Events"),t.initEvent("test",!0,!0),t.preventDefault(),t.defaultPrevented}(),e.match=function(t,e){return r.call(t,e)},r=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),e.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}).call(this),function(){e.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.HttpRequest=function(){function r(r,n,o){this.delegate=r,this.requestCanceled=t(this.requestCanceled,this),this.requestTimedOut=t(this.requestTimedOut,this),this.requestFailed=t(this.requestFailed,this),this.requestLoaded=t(this.requestLoaded,this),this.requestProgressed=t(this.requestProgressed,this),this.url=e.Location.wrap(n).requestURL,this.referrer=e.Location.wrap(o).absoluteURL,this.createXHR()}return r.NETWORK_FAILURE=0,r.TIMEOUT_FAILURE=-1,r.timeout=60,r.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},r.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},r.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},r.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},r.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},r.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},r.prototype.requestCanceled=function(){return this.endRequest()},r.prototype.notifyApplicationBeforeRequestStart=function(){return e.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},r.prototype.notifyApplicationAfterRequestEnd=function(){return e.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},r.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},r.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},r.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},r.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ProgressBar=function(){function e(){this.trickle=t(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,e.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",e.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},e.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},e.prototype.setValue=function(t){return this.value=t,this.refresh()},e.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},e.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},e.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},e.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},e.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},e.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},e.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},e.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},e.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},e.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.BrowserAdapter=function(){function r(r){this.controller=r,this.showProgressBar=t(this.showProgressBar,this),this.progressBar=new e.ProgressBar}var n,o,i;return i=e.HttpRequest,n=i.NETWORK_FAILURE,o=i.TIMEOUT_FAILURE,r.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},r.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},r.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},r.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},r.prototype.visitRequestCompleted=function(t){return t.loadResponse()},r.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case n:case o:return this.reload();default:return t.loadResponse()}},r.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},r.prototype.visitCompleted=function(t){return t.followRedirect()},r.prototype.pageInvalidated=function(){return this.reload()},r.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,this.controller.progressBarDelay)},r.prototype.showProgressBar=function(){return this.progressBar.show()},r.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},r.prototype.reload=function(){return window.location.reload()},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.History=function(){function r(e){this.delegate=e,this.onPageLoad=t(this.onPageLoad,this),this.onPopState=t(this.onPopState,this)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),addEventListener("load",this.onPageLoad,!1),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),removeEventListener("load",this.onPageLoad,!1),this.started=!1):void 0},r.prototype.push=function(t,r){return t=e.Location.wrap(t),this.update("push",t,r)},r.prototype.replace=function(t,r){return t=e.Location.wrap(t),this.update("replace",t,r)},r.prototype.onPopState=function(t){var r,n,o,i;return this.shouldHandlePopState()&&(i=null!=(n=t.state)?n.turbolinks:void 0)?(r=e.Location.wrap(window.location),o=i.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(r,o)):void 0},r.prototype.onPageLoad=function(t){return e.defer(function(t){return function(){return t.pageLoaded=!0}}(this))},r.prototype.shouldHandlePopState=function(){return this.pageIsLoaded()},r.prototype.pageIsLoaded=function(){return this.pageLoaded||"complete"===document.readyState},r.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},r}()}.call(this),function(){e.HeadDetails=function(){function t(t){var e,r,n,s,a,u;for(this.elements={},n=0,a=t.length;a>n;n++)u=t[n],u.nodeType===Node.ELEMENT_NODE&&(s=u.outerHTML,r=null!=(e=this.elements)[s]?e[s]:e[s]={type:i(u),tracked:o(u),elements:[]},r.elements.push(u))}var e,r,n,o,i;return t.fromHeadElement=function(t){var e;return new this(null!=(e=null!=t?t.childNodes:void 0)?e:[])},t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},t.prototype.getMetaValue=function(t){var e;return null!=(e=this.findMetaElementByName(t))?e.getAttribute("content"):void 0},t.prototype.findMetaElementByName=function(t){var r,n,o,i;r=void 0,i=this.elements;for(o in i)n=i[o].elements,e(n[0],t)&&(r=n[0]);return r},i=function(t){return r(t)?"script":n(t)?"stylesheet":void 0},o=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},r=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},n=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},e=function(t,e){var r;return r=t.tagName.toLowerCase(),"meta"===r&&t.getAttribute("name")===e},t}()}.call(this),function(){e.Snapshot=function(){function t(t,e){this.headDetails=t,this.bodyElement=e}return t.wrap=function(t){return t instanceof this?t:"string"==typeof t?this.fromHTMLString(t):this.fromHTMLElement(t)},t.fromHTMLString=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromHTMLElement(e)},t.fromHTMLElement=function(t){var r,n,o,i;return o=t.querySelector("head"),r=null!=(i=t.querySelector("body"))?i:document.createElement("body"),n=e.HeadDetails.fromHeadElement(o),new this(n,r)},t.prototype.clone=function(){return new this.constructor(this.headDetails,this.bodyElement.cloneNode(!0))},t.prototype.getRootLocation=function(){var t,r;return r=null!=(t=this.getSetting("root"))?t:"/",new e.Location(r)},t.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},t.prototype.getElementForAnchor=function(t){try{return this.bodyElement.querySelector("[id='"+t+"'], a[name='"+t+"']")}catch(e){}},t.prototype.getPermanentElements=function(){return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")},t.prototype.getPermanentElementById=function(t){return this.bodyElement.querySelector("#"+t+"[data-turbolinks-permanent]")},t.prototype.getPermanentElementsPresentInSnapshot=function(t){var e,r,n,o,i;for(o=this.getPermanentElements(),i=[],r=0,n=o.length;n>r;r++)e=o[r],t.getPermanentElementById(e.id)&&i.push(e);return i},t.prototype.findFirstAutofocusableElement=function(){return this.bodyElement.querySelector("[autofocus]")},t.prototype.hasAnchor=function(t){return null!=this.getElementForAnchor(t)},t.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},t.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},t.prototype.isVisitable=function(){return"reload"!==this.getSetting("visit-control")},t.prototype.getSetting=function(t){return this.headDetails.getMetaValue("turbolinks-"+t)},t}()}.call(this),function(){var t=[].slice;e.Renderer=function(){function e(){}var r;return e.render=function(){var e,r,n,o;return n=arguments[0],r=arguments[1],e=3<=arguments.length?t.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,e,function(){}),o.delegate=n,o.render(r),o},e.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},e.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},e.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,e.async=!1,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},e}()}.call(this),function(){var t,r,n=function(t,e){function r(){this.constructor=t}for(var n in e)o.call(e,n)&&(t[n]=e[n]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t},o={}.hasOwnProperty;e.SnapshotRenderer=function(e){function o(t,e,r){this.currentSnapshot=t,this.newSnapshot=e,this.isPreview=r,this.currentHeadDetails=this.currentSnapshot.headDetails,this.newHeadDetails=this.newSnapshot.headDetails,this.currentBody=this.currentSnapshot.bodyElement,this.newBody=this.newSnapshot.bodyElement}return n(o,e),o.prototype.render=function(t){return this.shouldRender()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.isPreview||e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},o.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},o.prototype.replaceBody=function(){var t;return t=this.relocateCurrentBodyPermanentElements(),this.activateNewBodyScriptElements(),this.assignNewBody(),this.replacePlaceholderElementsWithClonedPermanentElements(t)},o.prototype.shouldRender=function(){return this.newSnapshot.isVisitable()&&this.trackedElementsAreIdentical()},o.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},o.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},o.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},o.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.relocateCurrentBodyPermanentElements=function(){var e,n,o,i,s,a,u;for(a=this.getCurrentBodyPermanentElements(),u=[],e=0,n=a.length;n>e;e++)i=a[e],s=t(i),o=this.newSnapshot.getPermanentElementById(i.id),r(i,s.element),r(o,i),u.push(s);return u},o.prototype.replacePlaceholderElementsWithClonedPermanentElements=function(t){var e,n,o,i,s,a,u;for(u=[],o=0,i=t.length;i>o;o++)a=t[o],n=a.element,s=a.permanentElement,e=s.cloneNode(!0),u.push(r(n,e));return u},o.prototype.activateNewBodyScriptElements=function(){var t,e,n,o,i,s;for(i=this.getNewBodyScriptElements(),s=[],e=0,o=i.length;o>e;e++)n=i[e],t=this.createScriptElement(n),s.push(r(n,t));return s},o.prototype.assignNewBody=function(){return document.body=this.newBody},o.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.newSnapshot.findFirstAutofocusableElement())?t.focus():void 0},o.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},o.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},o.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},o.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},o.prototype.getCurrentBodyPermanentElements=function(){return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)},o.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},o}(e.Renderer),t=function(t){var e;return e=document.createElement("meta"),e.setAttribute("name","turbolinks-permanent-placeholder"),e.setAttribute("content",t.id),{element:e,permanentElement:t}},r=function(t,e){var r;return(r=t.parentNode)?r.replaceChild(e,t):void 0}}.call(this),function(){var t=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;e.ErrorRenderer=function(e){function r(t){var e;e=document.createElement("html"),e.innerHTML=t,this.newHead=e.querySelector("head"),this.newBody=e.querySelector("body")}return t(r,e),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceHeadAndBody(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceHeadAndBody=function(){var t,e;return e=document.head,t=document.body,e.parentNode.replaceChild(this.newHead,e),t.parentNode.replaceChild(this.newBody,t)},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(e.Renderer)}.call(this),function(){e.View=function(){function t(t){this.delegate=t,this.htmlElement=document.documentElement}return t.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},t.prototype.getElementForAnchor=function(t){return this.getSnapshot().getElementForAnchor(t)},t.prototype.getSnapshot=function(){return e.Snapshot.fromHTMLElement(this.htmlElement)},t.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,n,e):this.renderError(r,e)},t.prototype.markAsPreview=function(t){return t?this.htmlElement.setAttribute("data-turbolinks-preview",""):this.htmlElement.removeAttribute("data-turbolinks-preview")},t.prototype.renderSnapshot=function(t,r,n){return e.SnapshotRenderer.render(this.delegate,n,this.getSnapshot(),e.Snapshot.wrap(t),r)},t.prototype.renderError=function(t,r){return e.ErrorRenderer.render(this.delegate,r,t)},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ScrollManager=function(){function r(r){this.delegate=r,this.onScroll=t(this.onScroll,this),this.onScroll=e.throttle(this.onScroll)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},r.prototype.scrollToElement=function(t){return t.scrollIntoView()},r.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},r.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},r.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},r}()}.call(this),function(){e.SnapshotCache=function(){function t(t){this.size=t,this.keys=[],this.snapshots={}}var r;return t.prototype.has=function(t){var e;return e=r(t),e in this.snapshots},t.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},t.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},t.prototype.read=function(t){var e;return e=r(t),this.snapshots[e]},t.prototype.write=function(t,e){var n;return n=r(t),this.snapshots[n]=e},t.prototype.touch=function(t){var e,n;return n=r(t),e=this.keys.indexOf(n),e>-1&&this.keys.splice(e,1),this.keys.unshift(n),this.trim()},t.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},r=function(t){return e.Location.wrap(t).toCacheKey()},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Visit=function(){function r(r,n,o){this.controller=r,this.action=o,this.performScroll=t(this.performScroll,this),this.identifier=e.uuid(),this.location=e.Location.wrap(n),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var n;return r.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},r.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},r.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},r.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},r.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=n(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},r.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new e.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},r.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},r.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},r.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},r.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},r.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},r.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},r.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},r.prototype.requestCompletedWithResponse=function(t,r){return this.response=t,null!=r&&(this.redirectedToLocation=e.Location.wrap(r)),this.adapter.visitRequestCompleted(this)},r.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},r.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},r.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},r.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},r.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},r.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},r.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},r.prototype.getTimingMetrics=function(){return e.copyObject(this.timingMetrics)},n=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},r.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},r.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},r.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},r.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Controller=function(){function r(){this.clickBubbled=t(this.clickBubbled,this),this.clickCaptured=t(this.clickCaptured,this),this.pageLoaded=t(this.pageLoaded,this),this.history=new e.History(this),this.view=new e.View(this),this.scrollManager=new e.ScrollManager(this),this.restorationData={},this.clearCache(),this.setProgressBarDelay(500)}return r.prototype.start=function(){return e.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},r.prototype.disable=function(){return this.enabled=!1},r.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},r.prototype.clearCache=function(){return this.cache=new e.SnapshotCache(10)},r.prototype.visit=function(t,r){var n,o;return null==r&&(r={}),t=e.Location.wrap(t),this.applicationAllowsVisitingLocation(t)?this.locationIsVisitable(t)?(n=null!=(o=r.action)?o:"advance",this.adapter.visitProposedToLocationWithAction(t,n)):window.location=t:void 0},r.prototype.startVisitToLocationWithAction=function(t,r,n){var o;return e.supported?(o=this.getRestorationDataForIdentifier(n),this.startVisit(t,r,{restorationData:o})):window.location=t},r.prototype.setProgressBarDelay=function(t){return this.progressBarDelay=t},r.prototype.startHistory=function(){return this.location=e.Location.wrap(window.location),this.restorationIdentifier=e.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.stopHistory=function(){return this.history.stop()},r.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.push(this.location,this.restorationIdentifier)},r.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.historyPoppedToLocationWithRestorationIdentifier=function(t,r){var n;return this.restorationIdentifier=r,this.enabled?(n=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(t,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:n,historyChanged:!0}),this.location=e.Location.wrap(t)):this.adapter.pageInvalidated()},r.prototype.getCachedSnapshotForLocation=function(t){var e;return null!=(e=this.cache.get(t))?e.clone():void 0},r.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable();
},r.prototype.cacheSnapshot=function(){var t,r;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),r=this.view.getSnapshot(),t=this.lastRenderedLocation,e.defer(function(e){return function(){return e.cache.put(t,r.clone())}}(this))):void 0},r.prototype.scrollToAnchor=function(t){var e;return(e=this.view.getElementForAnchor(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},r.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},r.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},r.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},r.prototype.render=function(t,e){return this.view.render(t,e)},r.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},r.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},r.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},r.prototype.pageLoaded=function(){return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},r.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},r.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},r.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},r.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},r.prototype.notifyApplicationAfterClickingLinkToLocation=function(t,r){return e.dispatch("turbolinks:click",{target:t,data:{url:r.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationBeforeVisitingLocation=function(t){return e.dispatch("turbolinks:before-visit",{data:{url:t.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationAfterVisitingLocation=function(t){return e.dispatch("turbolinks:visit",{data:{url:t.absoluteURL}})},r.prototype.notifyApplicationBeforeCachingSnapshot=function(){return e.dispatch("turbolinks:before-cache")},r.prototype.notifyApplicationBeforeRender=function(t){return e.dispatch("turbolinks:before-render",{data:{newBody:t}})},r.prototype.notifyApplicationAfterRender=function(){return e.dispatch("turbolinks:render")},r.prototype.notifyApplicationAfterPageLoad=function(t){return null==t&&(t={}),e.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:t}})},r.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},r.prototype.createVisit=function(t,r,n){var o,i,s,a,u;return i=null!=n?n:{},a=i.restorationIdentifier,s=i.restorationData,o=i.historyChanged,u=new e.Visit(this,t,r),u.restorationIdentifier=null!=a?a:e.uuid(),u.restorationData=e.copyObject(s),u.historyChanged=o,u.referrer=this.location,u},r.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},r.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},r.prototype.getVisitableLinkForNode=function(t){return this.nodeIsVisitable(t)?e.closest(t,"a[href]:not([target]):not([download])"):void 0},r.prototype.getVisitableLocationForLink=function(t){var r;return r=new e.Location(t.getAttribute("href")),this.locationIsVisitable(r)?r:void 0},r.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},r.prototype.nodeIsVisitable=function(t){var r;return(r=e.closest(t,"[data-turbolinks]"))?"false"!==r.getAttribute("data-turbolinks"):!0},r.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},r.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},r.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},r}()}.call(this),function(){!function(){var t,e;if((t=e=document.currentScript)&&!e.hasAttribute("data-turbolinks-suppress-warning"))for(;t=t.parentNode;)if(t===document.body)return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s",e.outerHTML)}()}.call(this),function(){var t,r,n;e.start=function(){return r()?(null==e.controller&&(e.controller=t()),e.controller.start()):void 0},r=function(){return null==window.Turbolinks&&(window.Turbolinks=e),n()},t=function(){var t;return t=new e.Controller,t.adapter=new e.BrowserAdapter(t),t},n=function(){return window.Turbolinks===e},n()&&e.start()}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=e:"function"==typeof define&&define.amd&&define(e)}).call(this);
(function() {
  var context = this;

  (function() {
    (function() {
      var slice = [].slice;

      this.ActionCable = {
        INTERNAL: {
          "message_types": {
            "welcome": "welcome",
            "ping": "ping",
            "confirmation": "confirm_subscription",
            "rejection": "reject_subscription"
          },
          "default_mount_path": "/cable",
          "protocols": ["actioncable-v1-json", "actioncable-unsupported"]
        },
        WebSocket: window.WebSocket,
        logger: window.console,
        createConsumer: function(url) {
          var ref;
          if (url == null) {
            url = (ref = this.getConfig("url")) != null ? ref : this.INTERNAL.default_mount_path;
          }
          return new ActionCable.Consumer(this.createWebSocketURL(url));
        },
        getConfig: function(name) {
          var element;
          element = document.head.querySelector("meta[name='action-cable-" + name + "']");
          return element != null ? element.getAttribute("content") : void 0;
        },
        createWebSocketURL: function(url) {
          var a;
          if (url && !/^wss?:/i.test(url)) {
            a = document.createElement("a");
            a.href = url;
            a.href = a.href;
            a.protocol = a.protocol.replace("http", "ws");
            return a.href;
          } else {
            return url;
          }
        },
        startDebugging: function() {
          return this.debugging = true;
        },
        stopDebugging: function() {
          return this.debugging = null;
        },
        log: function() {
          var messages, ref;
          messages = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          if (this.debugging) {
            messages.push(Date.now());
            return (ref = this.logger).log.apply(ref, ["[ActionCable]"].concat(slice.call(messages)));
          }
        }
      };

    }).call(this);
  }).call(context);

  var ActionCable = context.ActionCable;

  (function() {
    (function() {
      var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

      ActionCable.ConnectionMonitor = (function() {
        var clamp, now, secondsSince;

        ConnectionMonitor.pollInterval = {
          min: 3,
          max: 30
        };

        ConnectionMonitor.staleThreshold = 6;

        function ConnectionMonitor(connection) {
          this.connection = connection;
          this.visibilityDidChange = bind(this.visibilityDidChange, this);
          this.reconnectAttempts = 0;
        }

        ConnectionMonitor.prototype.start = function() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            document.addEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor started. pollInterval = " + (this.getPollInterval()) + " ms");
          }
        };

        ConnectionMonitor.prototype.stop = function() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            document.removeEventListener("visibilitychange", this.visibilityDidChange);
            return ActionCable.log("ConnectionMonitor stopped");
          }
        };

        ConnectionMonitor.prototype.isRunning = function() {
          return (this.startedAt != null) && (this.stoppedAt == null);
        };

        ConnectionMonitor.prototype.recordPing = function() {
          return this.pingedAt = now();
        };

        ConnectionMonitor.prototype.recordConnect = function() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          return ActionCable.log("ConnectionMonitor recorded connect");
        };

        ConnectionMonitor.prototype.recordDisconnect = function() {
          this.disconnectedAt = now();
          return ActionCable.log("ConnectionMonitor recorded disconnect");
        };

        ConnectionMonitor.prototype.startPolling = function() {
          this.stopPolling();
          return this.poll();
        };

        ConnectionMonitor.prototype.stopPolling = function() {
          return clearTimeout(this.pollTimeout);
        };

        ConnectionMonitor.prototype.poll = function() {
          return this.pollTimeout = setTimeout((function(_this) {
            return function() {
              _this.reconnectIfStale();
              return _this.poll();
            };
          })(this), this.getPollInterval());
        };

        ConnectionMonitor.prototype.getPollInterval = function() {
          var interval, max, min, ref;
          ref = this.constructor.pollInterval, min = ref.min, max = ref.max;
          interval = 5 * Math.log(this.reconnectAttempts + 1);
          return Math.round(clamp(interval, min, max) * 1000);
        };

        ConnectionMonitor.prototype.reconnectIfStale = function() {
          if (this.connectionIsStale()) {
            ActionCable.log("ConnectionMonitor detected stale connection. reconnectAttempts = " + this.reconnectAttempts + ", pollInterval = " + (this.getPollInterval()) + " ms, time disconnected = " + (secondsSince(this.disconnectedAt)) + " s, stale threshold = " + this.constructor.staleThreshold + " s");
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              return ActionCable.log("ConnectionMonitor skipping reopening recent disconnect");
            } else {
              ActionCable.log("ConnectionMonitor reopening");
              return this.connection.reopen();
            }
          }
        };

        ConnectionMonitor.prototype.connectionIsStale = function() {
          var ref;
          return secondsSince((ref = this.pingedAt) != null ? ref : this.startedAt) > this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.disconnectedRecently = function() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        };

        ConnectionMonitor.prototype.visibilityDidChange = function() {
          if (document.visibilityState === "visible") {
            return setTimeout((function(_this) {
              return function() {
                if (_this.connectionIsStale() || !_this.connection.isOpen()) {
                  ActionCable.log("ConnectionMonitor reopening stale connection on visibilitychange. visbilityState = " + document.visibilityState);
                  return _this.connection.reopen();
                }
              };
            })(this), 200);
          }
        };

        now = function() {
          return new Date().getTime();
        };

        secondsSince = function(time) {
          return (now() - time) / 1000;
        };

        clamp = function(number, min, max) {
          return Math.max(min, Math.min(max, number));
        };

        return ConnectionMonitor;

      })();

    }).call(this);
    (function() {
      var i, message_types, protocols, ref, supportedProtocols, unsupportedProtocol,
        slice = [].slice,
        bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
        indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

      ref = ActionCable.INTERNAL, message_types = ref.message_types, protocols = ref.protocols;

      supportedProtocols = 2 <= protocols.length ? slice.call(protocols, 0, i = protocols.length - 1) : (i = 0, []), unsupportedProtocol = protocols[i++];

      ActionCable.Connection = (function() {
        Connection.reopenDelay = 500;

        function Connection(consumer) {
          this.consumer = consumer;
          this.open = bind(this.open, this);
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new ActionCable.ConnectionMonitor(this);
          this.disconnected = true;
        }

        Connection.prototype.send = function(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.open = function() {
          if (this.isActive()) {
            ActionCable.log("Attempted to open WebSocket, but existing socket is " + (this.getState()));
            return false;
          } else {
            ActionCable.log("Opening WebSocket, current state is " + (this.getState()) + ", subprotocols: " + protocols);
            if (this.webSocket != null) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new ActionCable.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        };

        Connection.prototype.close = function(arg) {
          var allowReconnect, ref1;
          allowReconnect = (arg != null ? arg : {
            allowReconnect: true
          }).allowReconnect;
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return (ref1 = this.webSocket) != null ? ref1.close() : void 0;
          }
        };

        Connection.prototype.reopen = function() {
          var error;
          ActionCable.log("Reopening WebSocket, current state is " + (this.getState()));
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error1) {
              error = error1;
              return ActionCable.log("Failed to reopen WebSocket", error);
            } finally {
              ActionCable.log("Reopening WebSocket in " + this.constructor.reopenDelay + "ms");
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        };

        Connection.prototype.getProtocol = function() {
          var ref1;
          return (ref1 = this.webSocket) != null ? ref1.protocol : void 0;
        };

        Connection.prototype.isOpen = function() {
          return this.isState("open");
        };

        Connection.prototype.isActive = function() {
          return this.isState("open", "connecting");
        };

        Connection.prototype.isProtocolSupported = function() {
          var ref1;
          return ref1 = this.getProtocol(), indexOf.call(supportedProtocols, ref1) >= 0;
        };

        Connection.prototype.isState = function() {
          var ref1, states;
          states = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return ref1 = this.getState(), indexOf.call(states, ref1) >= 0;
        };

        Connection.prototype.getState = function() {
          var ref1, state, value;
          for (state in WebSocket) {
            value = WebSocket[state];
            if (value === ((ref1 = this.webSocket) != null ? ref1.readyState : void 0)) {
              return state.toLowerCase();
            }
          }
          return null;
        };

        Connection.prototype.installEventHandlers = function() {
          var eventName, handler;
          for (eventName in this.events) {
            handler = this.events[eventName].bind(this);
            this.webSocket["on" + eventName] = handler;
          }
        };

        Connection.prototype.uninstallEventHandlers = function() {
          var eventName;
          for (eventName in this.events) {
            this.webSocket["on" + eventName] = function() {};
          }
        };

        Connection.prototype.events = {
          message: function(event) {
            var identifier, message, ref1, type;
            if (!this.isProtocolSupported()) {
              return;
            }
            ref1 = JSON.parse(event.data), identifier = ref1.identifier, message = ref1.message, type = ref1.type;
            switch (type) {
              case message_types.welcome:
                this.monitor.recordConnect();
                return this.subscriptions.reload();
              case message_types.ping:
                return this.monitor.recordPing();
              case message_types.confirmation:
                return this.subscriptions.notify(identifier, "connected");
              case message_types.rejection:
                return this.subscriptions.reject(identifier);
              default:
                return this.subscriptions.notify(identifier, "received", message);
            }
          },
          open: function() {
            ActionCable.log("WebSocket onopen event, using '" + (this.getProtocol()) + "' subprotocol");
            this.disconnected = false;
            if (!this.isProtocolSupported()) {
              ActionCable.log("Protocol is unsupported. Stopping monitor and disconnecting.");
              return this.close({
                allowReconnect: false
              });
            }
          },
          close: function(event) {
            ActionCable.log("WebSocket onclose event");
            if (this.disconnected) {
              return;
            }
            this.disconnected = true;
            this.monitor.recordDisconnect();
            return this.subscriptions.notifyAll("disconnected", {
              willAttemptReconnect: this.monitor.isRunning()
            });
          },
          error: function() {
            return ActionCable.log("WebSocket onerror event");
          }
        };

        return Connection;

      })();

    }).call(this);
    (function() {
      var slice = [].slice;

      ActionCable.Subscriptions = (function() {
        function Subscriptions(consumer) {
          this.consumer = consumer;
          this.subscriptions = [];
        }

        Subscriptions.prototype.create = function(channelName, mixin) {
          var channel, params, subscription;
          channel = channelName;
          params = typeof channel === "object" ? channel : {
            channel: channel
          };
          subscription = new ActionCable.Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        };

        Subscriptions.prototype.add = function(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.sendCommand(subscription, "subscribe");
          return subscription;
        };

        Subscriptions.prototype.remove = function(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        };

        Subscriptions.prototype.reject = function(identifier) {
          var i, len, ref, results, subscription;
          ref = this.findAll(identifier);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            this.forget(subscription);
            this.notify(subscription, "rejected");
            results.push(subscription);
          }
          return results;
        };

        Subscriptions.prototype.forget = function(subscription) {
          var s;
          this.subscriptions = (function() {
            var i, len, ref, results;
            ref = this.subscriptions;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              s = ref[i];
              if (s !== subscription) {
                results.push(s);
              }
            }
            return results;
          }).call(this);
          return subscription;
        };

        Subscriptions.prototype.findAll = function(identifier) {
          var i, len, ref, results, s;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            if (s.identifier === identifier) {
              results.push(s);
            }
          }
          return results;
        };

        Subscriptions.prototype.reload = function() {
          var i, len, ref, results, subscription;
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.sendCommand(subscription, "subscribe"));
          }
          return results;
        };

        Subscriptions.prototype.notifyAll = function() {
          var args, callbackName, i, len, ref, results, subscription;
          callbackName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          ref = this.subscriptions;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            subscription = ref[i];
            results.push(this.notify.apply(this, [subscription, callbackName].concat(slice.call(args))));
          }
          return results;
        };

        Subscriptions.prototype.notify = function() {
          var args, callbackName, i, len, results, subscription, subscriptions;
          subscription = arguments[0], callbackName = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          results = [];
          for (i = 0, len = subscriptions.length; i < len; i++) {
            subscription = subscriptions[i];
            results.push(typeof subscription[callbackName] === "function" ? subscription[callbackName].apply(subscription, args) : void 0);
          }
          return results;
        };

        Subscriptions.prototype.sendCommand = function(subscription, command) {
          var identifier;
          identifier = subscription.identifier;
          return this.consumer.send({
            command: command,
            identifier: identifier
          });
        };

        return Subscriptions;

      })();

    }).call(this);
    (function() {
      ActionCable.Subscription = (function() {
        var extend;

        function Subscription(consumer, params, mixin) {
          this.consumer = consumer;
          if (params == null) {
            params = {};
          }
          this.identifier = JSON.stringify(params);
          extend(this, mixin);
        }

        Subscription.prototype.perform = function(action, data) {
          if (data == null) {
            data = {};
          }
          data.action = action;
          return this.send(data);
        };

        Subscription.prototype.send = function(data) {
          return this.consumer.send({
            command: "message",
            identifier: this.identifier,
            data: JSON.stringify(data)
          });
        };

        Subscription.prototype.unsubscribe = function() {
          return this.consumer.subscriptions.remove(this);
        };

        extend = function(object, properties) {
          var key, value;
          if (properties != null) {
            for (key in properties) {
              value = properties[key];
              object[key] = value;
            }
          }
          return object;
        };

        return Subscription;

      })();

    }).call(this);
    (function() {
      ActionCable.Consumer = (function() {
        function Consumer(url) {
          this.url = url;
          this.subscriptions = new ActionCable.Subscriptions(this);
          this.connection = new ActionCable.Connection(this);
        }

        Consumer.prototype.send = function(data) {
          return this.connection.send(data);
        };

        Consumer.prototype.connect = function() {
          return this.connection.open();
        };

        Consumer.prototype.disconnect = function() {
          return this.connection.close({
            allowReconnect: false
          });
        };

        Consumer.prototype.ensureActiveConnection = function() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        };

        return Consumer;

      })();

    }).call(this);
  }).call(this);

  if (typeof module === "object" && module.exports) {
    module.exports = ActionCable;
  } else if (typeof define === "function" && define.amd) {
    define(ActionCable);
  }
}).call(this);
// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//




(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);
(function() {


}).call(this);
/*! UIkit 3.0.2 | http://www.getuikit.com | (c) 2014 - 2018 YOOtheme | MIT License */


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('uikiticons', factory) :
    (global = global || self, global.UIkitIcons = factory());
}(this, function () { 'use strict';

    function plugin(UIkit) {

        if (plugin.installed) {
            return;
        }

        UIkit.icon.add({
        "500px": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.624,11.866c-0.141,0.132,0.479,0.658,0.662,0.418c0.051-0.046,0.607-0.61,0.662-0.664c0,0,0.738,0.719,0.814,0.719 c0.1,0,0.207-0.055,0.322-0.17c0.27-0.269,0.135-0.416,0.066-0.495l-0.631-0.616l0.658-0.668c0.146-0.156,0.021-0.314-0.1-0.449 c-0.182-0.18-0.359-0.226-0.471-0.125l-0.656,0.654l-0.654-0.654c-0.033-0.034-0.08-0.045-0.124-0.045 c-0.079,0-0.191,0.068-0.307,0.181c-0.202,0.202-0.247,0.351-0.133,0.462l0.665,0.665L9.624,11.866z\"/><path d=\"M11.066,2.884c-1.061,0-2.185,0.248-3.011,0.604c-0.087,0.034-0.141,0.106-0.15,0.205C7.893,3.784,7.919,3.909,7.982,4.066 c0.05,0.136,0.187,0.474,0.452,0.372c0.844-0.326,1.779-0.507,2.633-0.507c0.963,0,1.9,0.191,2.781,0.564 c0.695,0.292,1.357,0.719,2.078,1.34c0.051,0.044,0.105,0.068,0.164,0.068c0.143,0,0.273-0.137,0.389-0.271 c0.191-0.214,0.324-0.395,0.135-0.575c-0.686-0.654-1.436-1.138-2.363-1.533C13.24,3.097,12.168,2.884,11.066,2.884z\"/><path d=\"M16.43,15.747c-0.092-0.028-0.242,0.05-0.309,0.119l0,0c-0.652,0.652-1.42,1.169-2.268,1.521 c-0.877,0.371-1.814,0.551-2.779,0.551c-0.961,0-1.896-0.189-2.775-0.564c-0.848-0.36-1.612-0.879-2.268-1.53 c-0.682-0.688-1.196-1.455-1.529-2.268c-0.325-0.799-0.471-1.643-0.471-1.643c-0.045-0.24-0.258-0.249-0.567-0.203 c-0.128,0.021-0.519,0.079-0.483,0.36v0.01c0.105,0.644,0.289,1.284,0.545,1.895c0.417,0.969,1.002,1.849,1.756,2.604 c0.757,0.754,1.636,1.34,2.604,1.757C8.901,18.785,9.97,19,11.088,19c1.104,0,2.186-0.215,3.188-0.645 c1.838-0.896,2.604-1.757,2.604-1.757c0.182-0.204,0.227-0.317-0.1-0.643C16.779,15.956,16.525,15.774,16.43,15.747z\"/><path d=\"M5.633,13.287c0.293,0.71,0.723,1.341,1.262,1.882c0.54,0.54,1.172,0.971,1.882,1.264c0.731,0.303,1.509,0.461,2.298,0.461 c0.801,0,1.578-0.158,2.297-0.461c0.711-0.293,1.344-0.724,1.883-1.264c0.543-0.541,0.971-1.172,1.264-1.882 c0.314-0.721,0.463-1.5,0.463-2.298c0-0.79-0.148-1.569-0.463-2.289c-0.293-0.699-0.721-1.329-1.264-1.881 c-0.539-0.541-1.172-0.959-1.867-1.263c-0.721-0.303-1.5-0.461-2.299-0.461c-0.802,0-1.613,0.159-2.322,0.461 c-0.577,0.25-1.544,0.867-2.119,1.454v0.012V2.108h8.16C15.1,2.104,15.1,1.69,15.1,1.552C15.1,1.417,15.1,1,14.809,1H5.915 C5.676,1,5.527,1.192,5.527,1.384v6.84c0,0.214,0.273,0.372,0.529,0.428c0.5,0.105,0.614-0.056,0.737-0.224l0,0 c0.18-0.273,0.776-0.884,0.787-0.894c0.901-0.905,2.117-1.408,3.416-1.408c1.285,0,2.5,0.501,3.412,1.408 c0.914,0.914,1.408,2.122,1.408,3.405c0,1.288-0.508,2.496-1.408,3.405c-0.9,0.896-2.152,1.406-3.438,1.406 c-0.877,0-1.711-0.229-2.433-0.671v-4.158c0-0.553,0.237-1.151,0.643-1.614c0.462-0.519,1.094-0.799,1.782-0.799 c0.664,0,1.293,0.253,1.758,0.715c0.459,0.459,0.709,1.071,0.709,1.723c0,1.385-1.094,2.468-2.488,2.468 c-0.273,0-0.769-0.121-0.781-0.125c-0.281-0.087-0.405,0.306-0.438,0.436c-0.159,0.496,0.079,0.585,0.123,0.607 c0.452,0.137,0.743,0.157,1.129,0.157c1.973,0,3.572-1.6,3.572-3.57c0-1.964-1.6-3.552-3.572-3.552c-0.97,0-1.872,0.36-2.546,1.038 c-0.656,0.631-1.027,1.487-1.027,2.322v3.438v-0.011c-0.372-0.42-0.732-1.041-0.981-1.682c-0.102-0.248-0.315-0.202-0.607-0.113 c-0.135,0.035-0.519,0.157-0.44,0.439C5.372,12.799,5.577,13.164,5.633,13.287z\"/></svg>",
        "album": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"5\" y=\"2\" width=\"10\" height=\"1\"/><rect x=\"3\" y=\"4\" width=\"14\" height=\"1\"/><rect fill=\"none\" stroke=\"#000\" x=\"1.5\" y=\"6.5\" width=\"17\" height=\"11\"/></svg>",
        "arrow-down": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"10.5,16.08 5.63,10.66 6.37,10 10.5,14.58 14.63,10 15.37,10.66\"/><line fill=\"none\" stroke=\"#000\" x1=\"10.5\" y1=\"4\" x2=\"10.5\" y2=\"15\"/></svg>",
        "arrow-left": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" points=\"10 14 5 9.5 10 5\"/><line fill=\"none\" stroke=\"#000\" x1=\"16\" y1=\"9.5\" x2=\"5\" y2=\"9.52\"/></svg>",
        "arrow-right": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" points=\"10 5 15 9.5 10 14\"/><line fill=\"none\" stroke=\"#000\" x1=\"4\" y1=\"9.5\" x2=\"15\" y2=\"9.5\"/></svg>",
        "arrow-up": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"10.5,4 15.37,9.4 14.63,10.08 10.5,5.49 6.37,10.08 5.63,9.4\"/><line fill=\"none\" stroke=\"#000\" x1=\"10.5\" y1=\"16\" x2=\"10.5\" y2=\"5\"/></svg>",
        "ban": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10\" cy=\"10\" r=\"9\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"4\" y1=\"3.5\" x2=\"16\" y2=\"16.5\"/></svg>",
        "behance": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.5,10.6c-0.4-0.5-0.9-0.9-1.6-1.1c1.7-1,2.2-3.2,0.7-4.7C7.8,4,6.3,4,5.2,4C3.5,4,1.7,4,0,4v12c1.7,0,3.4,0,5.2,0 c1,0,2.1,0,3.1-0.5C10.2,14.6,10.5,12.3,9.5,10.6L9.5,10.6z M5.6,6.1c1.8,0,1.8,2.7-0.1,2.7c-1,0-2,0-2.9,0V6.1H5.6z M2.6,13.8v-3.1 c1.1,0,2.1,0,3.2,0c2.1,0,2.1,3.2,0.1,3.2L2.6,13.8z\"/><path d=\"M19.9,10.9C19.7,9.2,18.7,7.6,17,7c-4.2-1.3-7.3,3.4-5.3,7.1c0.9,1.7,2.8,2.3,4.7,2.1c1.7-0.2,2.9-1.3,3.4-2.9h-2.2 c-0.4,1.3-2.4,1.5-3.5,0.6c-0.4-0.4-0.6-1.1-0.6-1.7H20C20,11.7,19.9,10.9,19.9,10.9z M13.5,10.6c0-1.6,2.3-2.7,3.5-1.4 c0.4,0.4,0.5,0.9,0.6,1.4H13.5L13.5,10.6z\"/><rect x=\"13\" y=\"4\" width=\"5\" height=\"1.4\"/></svg>",
        "bell": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M17,15.5 L3,15.5 C2.99,14.61 3.79,13.34 4.1,12.51 C4.58,11.3 4.72,10.35 5.19,7.01 C5.54,4.53 5.89,3.2 7.28,2.16 C8.13,1.56 9.37,1.5 9.81,1.5 L9.96,1.5 C9.96,1.5 11.62,1.41 12.67,2.17 C14.08,3.2 14.42,4.54 14.77,7.02 C15.26,10.35 15.4,11.31 15.87,12.52 C16.2,13.34 17.01,14.61 17,15.5 L17,15.5 Z\"/><path fill=\"none\" stroke=\"#000\" d=\"M12.39,16 C12.39,17.37 11.35,18.43 9.91,18.43 C8.48,18.43 7.42,17.37 7.42,16\"/></svg>",
        "bold": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5,15.3 C5.66,15.3 5.9,15 5.9,14.53 L5.9,5.5 C5.9,4.92 5.56,4.7 5,4.7 L5,4 L8.95,4 C12.6,4 13.7,5.37 13.7,6.9 C13.7,7.87 13.14,9.17 10.86,9.59 L10.86,9.7 C13.25,9.86 14.29,11.28 14.3,12.54 C14.3,14.47 12.94,16 9,16 L5,16 L5,15.3 Z M9,9.3 C11.19,9.3 11.8,8.5 11.85,7 C11.85,5.65 11.3,4.8 9,4.8 L7.67,4.8 L7.67,9.3 L9,9.3 Z M9.185,15.22 C11.97,15 12.39,14 12.4,12.58 C12.4,11.15 11.39,10 9,10 L7.67,10 L7.67,15 L9.18,15 Z\"/></svg>",
        "bolt": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M4.74,20 L7.73,12 L3,12 L15.43,1 L12.32,9 L17.02,9 L4.74,20 L4.74,20 L4.74,20 Z M9.18,11 L7.1,16.39 L14.47,10 L10.86,10 L12.99,4.67 L5.61,11 L9.18,11 L9.18,11 L9.18,11 Z\"/></svg>",
        "bookmark": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon fill=\"none\" stroke=\"#000\" points=\"5.5 1.5 15.5 1.5 15.5 17.5 10.5 12.5 5.5 17.5\"/></svg>",
        "calendar": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 2,3 2,17 18,17 18,3 2,3 Z M 17,16 3,16 3,8 17,8 17,16 Z M 17,7 3,7 3,4 17,4 17,7 Z\"/><rect width=\"1\" height=\"3\" x=\"6\" y=\"2\"/><rect width=\"1\" height=\"3\" x=\"13\" y=\"2\"/></svg>",
        "camera": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10\" cy=\"10.8\" r=\"3.8\"/><path fill=\"none\" stroke=\"#000\" d=\"M1,4.5 C0.7,4.5 0.5,4.7 0.5,5 L0.5,17 C0.5,17.3 0.7,17.5 1,17.5 L19,17.5 C19.3,17.5 19.5,17.3 19.5,17 L19.5,5 C19.5,4.7 19.3,4.5 19,4.5 L13.5,4.5 L13.5,2.9 C13.5,2.6 13.3,2.5 13,2.5 L7,2.5 C6.7,2.5 6.5,2.6 6.5,2.9 L6.5,4.5 L1,4.5 L1,4.5 Z\"/></svg>",
        "cart": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"7.3\" cy=\"17.3\" r=\"1.4\"/><circle cx=\"13.3\" cy=\"17.3\" r=\"1.4\"/><polyline fill=\"none\" stroke=\"#000\" points=\"0 2 3.2 4 5.3 12.5 16 12.5 18 6.5 8 6.5\"/></svg>",
        "check": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" points=\"4,10 8,15 17,4\"/></svg>",
        "chevron-double-left": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" points=\"10 14 6 10 10 6\"/><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" points=\"14 14 10 10 14 6\"/></svg>",
        "chevron-double-right": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" points=\"10 6 14 10 10 14\"/><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" points=\"6 6 10 10 6 14\"/></svg>",
        "chevron-down": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" points=\"16 7 10 13 4 7\"/></svg>",
        "chevron-left": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" points=\"13 16 7 10 13 4\"/></svg>",
        "chevron-right": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" points=\"7 4 13 10 7 16\"/></svg>",
        "chevron-up": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" points=\"4 13 10 7 16 13\"/></svg>",
        "clock": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10\" cy=\"10\" r=\"9\"/><rect x=\"9\" y=\"4\" width=\"1\" height=\"7\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M13.018,14.197 L9.445,10.625\"/></svg>",
        "close": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.06\" d=\"M16,16 L4,4\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.06\" d=\"M16,4 L4,16\"/></svg>",
        "cloud-download": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M6.5,14.61 L3.75,14.61 C1.96,14.61 0.5,13.17 0.5,11.39 C0.5,9.76 1.72,8.41 3.3,8.2 C3.38,5.31 5.75,3 8.68,3 C11.19,3 13.31,4.71 13.89,7.02 C14.39,6.8 14.93,6.68 15.5,6.68 C17.71,6.68 19.5,8.45 19.5,10.64 C19.5,12.83 17.71,14.6 15.5,14.6 L12.5,14.6\"/><polyline fill=\"none\" stroke=\"#000\" points=\"11.75 16 9.5 18.25 7.25 16\"/><path fill=\"none\" stroke=\"#000\" d=\"M9.5,18 L9.5,9.5\"/></svg>",
        "cloud-upload": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M6.5,14.61 L3.75,14.61 C1.96,14.61 0.5,13.17 0.5,11.39 C0.5,9.76 1.72,8.41 3.31,8.2 C3.38,5.31 5.75,3 8.68,3 C11.19,3 13.31,4.71 13.89,7.02 C14.39,6.8 14.93,6.68 15.5,6.68 C17.71,6.68 19.5,8.45 19.5,10.64 C19.5,12.83 17.71,14.6 15.5,14.6 L12.5,14.6\"/><polyline fill=\"none\" stroke=\"#000\" points=\"7.25 11.75 9.5 9.5 11.75 11.75\"/><path fill=\"none\" stroke=\"#000\" d=\"M9.5,18 L9.5,9.5\"/></svg>",
        "code": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.01\" points=\"13,4 19,10 13,16\"/><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.01\" points=\"7,4 1,10 7,16\"/></svg>",
        "cog": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" cx=\"9.997\" cy=\"10\" r=\"3.31\"/><path fill=\"none\" stroke=\"#000\" d=\"M18.488,12.285 L16.205,16.237 C15.322,15.496 14.185,15.281 13.303,15.791 C12.428,16.289 12.047,17.373 12.246,18.5 L7.735,18.5 C7.938,17.374 7.553,16.299 6.684,15.791 C5.801,15.27 4.655,15.492 3.773,16.237 L1.5,12.285 C2.573,11.871 3.317,10.999 3.317,9.991 C3.305,8.98 2.573,8.121 1.5,7.716 L3.765,3.784 C4.645,4.516 5.794,4.738 6.687,4.232 C7.555,3.722 7.939,2.637 7.735,1.5 L12.263,1.5 C12.072,2.637 12.441,3.71 13.314,4.22 C14.206,4.73 15.343,4.516 16.225,3.794 L18.487,7.714 C17.404,8.117 16.661,8.988 16.67,10.009 C16.672,11.018 17.415,11.88 18.488,12.285 L18.488,12.285 Z\"/></svg>",
        "comment": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6,18.71 L6,14 L1,14 L1,1 L19,1 L19,14 L10.71,14 L6,18.71 L6,18.71 Z M2,13 L7,13 L7,16.29 L10.29,13 L18,13 L18,2 L2,2 L2,13 L2,13 Z\"/></svg>",
        "commenting": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon fill=\"none\" stroke=\"#000\" points=\"1.5,1.5 18.5,1.5 18.5,13.5 10.5,13.5 6.5,17.5 6.5,13.5 1.5,13.5\"/><circle cx=\"10\" cy=\"8\" r=\"1\"/><circle cx=\"6\" cy=\"8\" r=\"1\"/><circle cx=\"14\" cy=\"8\" r=\"1\"/></svg>",
        "comments": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" points=\"2 0.5 19.5 0.5 19.5 13\"/><path d=\"M5,19.71 L5,15 L0,15 L0,2 L18,2 L18,15 L9.71,15 L5,19.71 L5,19.71 L5,19.71 Z M1,14 L6,14 L6,17.29 L9.29,14 L17,14 L17,3 L1,3 L1,14 L1,14 L1,14 Z\"/></svg>",
        "copy": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect fill=\"none\" stroke=\"#000\" x=\"3.5\" y=\"2.5\" width=\"12\" height=\"16\"/><polyline fill=\"none\" stroke=\"#000\" points=\"5 0.5 17.5 0.5 17.5 17\"/></svg>",
        "credit-card": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect fill=\"none\" stroke=\"#000\" x=\"1.5\" y=\"4.5\" width=\"17\" height=\"12\"/><rect x=\"1\" y=\"7\" width=\"18\" height=\"3\"/></svg>",
        "database": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><ellipse fill=\"none\" stroke=\"#000\" cx=\"10\" cy=\"4.64\" rx=\"7.5\" ry=\"3.14\"/><path fill=\"none\" stroke=\"#000\" d=\"M17.5,8.11 C17.5,9.85 14.14,11.25 10,11.25 C5.86,11.25 2.5,9.84 2.5,8.11\"/><path fill=\"none\" stroke=\"#000\" d=\"M17.5,11.25 C17.5,12.99 14.14,14.39 10,14.39 C5.86,14.39 2.5,12.98 2.5,11.25\"/><path fill=\"none\" stroke=\"#000\" d=\"M17.49,4.64 L17.5,14.36 C17.5,16.1 14.14,17.5 10,17.5 C5.86,17.5 2.5,16.09 2.5,14.36 L2.5,4.64\"/></svg>",
        "desktop": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"8\" y=\"15\" width=\"1\" height=\"2\"/><rect x=\"11\" y=\"15\" width=\"1\" height=\"2\"/><rect x=\"5\" y=\"16\" width=\"10\" height=\"1\"/><rect fill=\"none\" stroke=\"#000\" x=\"1.5\" y=\"3.5\" width=\"17\" height=\"11\"/></svg>",
        "download": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" points=\"14,10 9.5,14.5 5,10\"/><rect x=\"3\" y=\"17\" width=\"13\" height=\"1\"/><line fill=\"none\" stroke=\"#000\" x1=\"9.5\" y1=\"13.91\" x2=\"9.5\" y2=\"3\"/></svg>",
        "dribbble": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" d=\"M1.3,8.9c0,0,5,0.1,8.6-1c1.4-0.4,2.6-0.9,4-1.9 c1.4-1.1,2.5-2.5,2.5-2.5\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" d=\"M3.9,16.6c0,0,1.7-2.8,3.5-4.2 c1.8-1.3,4-2,5.7-2.2C16,10,19,10.6,19,10.6\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" d=\"M6.9,1.6c0,0,3.3,4.6,4.2,6.8 c0.4,0.9,1.3,3.1,1.9,5.2c0.6,2,0.9,4.4,0.9,4.4\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" cx=\"10\" cy=\"10\" r=\"9\"/></svg>",
        "expand": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"13 2 18 2 18 7 17 7 17 3 13 3\"/><polygon points=\"2 13 3 13 3 17 7 17 7 18 2 18\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M11,9 L17,3\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M3,17 L9,11\"/></svg>",
        "facebook": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11,10h2.6l0.4-3H11V5.3c0-0.9,0.2-1.5,1.5-1.5H14V1.1c-0.3,0-1-0.1-2.1-0.1C9.6,1,8,2.4,8,5v2H5.5v3H8v8h3V10z\"/></svg>",
        "file-edit": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" d=\"M18.65,1.68 C18.41,1.45 18.109,1.33 17.81,1.33 C17.499,1.33 17.209,1.45 16.98,1.68 L8.92,9.76 L8,12.33 L10.55,11.41 L18.651,3.34 C19.12,2.87 19.12,2.15 18.65,1.68 L18.65,1.68 L18.65,1.68 Z\"/><polyline fill=\"none\" stroke=\"#000\" points=\"16.5 8.482 16.5 18.5 3.5 18.5 3.5 1.5 14.211 1.5\"/></svg>",
        "file-pdf": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect fill=\"none\" stroke=\"#000\" width=\"13\" height=\"17\" x=\"3.5\" y=\"1.5\"/><path d=\"M14.65 11.67c-.48.3-1.37-.19-1.79-.37a4.65 4.65 0 0 1 1.49.06c.35.1.36.28.3.31zm-6.3.06l.43-.79a14.7 14.7 0 0 0 .75-1.64 5.48 5.48 0 0 0 1.25 1.55l.2.15a16.36 16.36 0 0 0-2.63.73zM9.5 5.32c.2 0 .32.5.32.97a1.99 1.99 0 0 1-.23 1.04 5.05 5.05 0 0 1-.17-1.3s0-.71.08-.71zm-3.9 9a4.35 4.35 0 0 1 1.21-1.46l.24-.22a4.35 4.35 0 0 1-1.46 1.68zm9.23-3.3a2.05 2.05 0 0 0-1.32-.3 11.07 11.07 0 0 0-1.58.11 4.09 4.09 0 0 1-.74-.5 5.39 5.39 0 0 1-1.32-2.06 10.37 10.37 0 0 0 .28-2.62 1.83 1.83 0 0 0-.07-.25.57.57 0 0 0-.52-.4H9.4a.59.59 0 0 0-.6.38 6.95 6.95 0 0 0 .37 3.14c-.26.63-1 2.12-1 2.12-.3.58-.57 1.08-.82 1.5l-.8.44A3.11 3.11 0 0 0 5 14.16a.39.39 0 0 0 .15.42l.24.13c1.15.56 2.28-1.74 2.66-2.42a23.1 23.1 0 0 1 3.59-.85 4.56 4.56 0 0 0 2.91.8.5.5 0 0 0 .3-.21 1.1 1.1 0 0 0 .12-.75.84.84 0 0 0-.14-.25z\"/></svg>",
        "file-text": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect fill=\"none\" stroke=\"#000\" width=\"13\" height=\"17\" x=\"3.5\" y=\"1.5\"/><line fill=\"none\" stroke=\"#000\" x1=\"6\" x2=\"12\" y1=\"12.5\" y2=\"12.5\"/><line fill=\"none\" stroke=\"#000\" x1=\"6\" x2=\"14\" y1=\"8.5\" y2=\"8.5\"/><line fill=\"none\" stroke=\"#000\" x1=\"6\" x2=\"14\" y1=\"6.5\" y2=\"6.5\"/><line fill=\"none\" stroke=\"#000\" x1=\"6\" x2=\"14\" y1=\"10.5\" y2=\"10.5\"/></svg>",
        "file": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect fill=\"none\" stroke=\"#000\" x=\"3.5\" y=\"1.5\" width=\"13\" height=\"17\"/></svg>",
        "flickr": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"5.5\" cy=\"9.5\" r=\"3.5\"/><circle cx=\"14.5\" cy=\"9.5\" r=\"3.5\"/></svg>",
        "folder": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon fill=\"none\" stroke=\"#000\" points=\"9.5 5.5 8.5 3.5 1.5 3.5 1.5 16.5 18.5 16.5 18.5 5.5\"/></svg>",
        "forward": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2.47,13.11 C4.02,10.02 6.27,7.85 9.04,6.61 C9.48,6.41 10.27,6.13 11,5.91 L11,2 L18.89,9 L11,16 L11,12.13 C9.25,12.47 7.58,13.19 6.02,14.25 C3.03,16.28 1.63,18.54 1.63,18.54 C1.63,18.54 1.38,15.28 2.47,13.11 L2.47,13.11 Z M5.3,13.53 C6.92,12.4 9.04,11.4 12,10.92 L12,13.63 L17.36,9 L12,4.25 L12,6.8 C11.71,6.86 10.86,7.02 9.67,7.49 C6.79,8.65 4.58,10.96 3.49,13.08 C3.18,13.7 2.68,14.87 2.49,16 C3.28,15.05 4.4,14.15 5.3,13.53 L5.3,13.53 Z\"/></svg>",
        "foursquare": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15.23,2 C15.96,2 16.4,2.41 16.5,2.86 C16.57,3.15 16.56,3.44 16.51,3.73 C16.46,4.04 14.86,11.72 14.75,12.03 C14.56,12.56 14.16,12.82 13.61,12.83 C13.03,12.84 11.09,12.51 10.69,13 C10.38,13.38 7.79,16.39 6.81,17.53 C6.61,17.76 6.4,17.96 6.08,17.99 C5.68,18.04 5.29,17.87 5.17,17.45 C5.12,17.28 5.1,17.09 5.1,16.91 C5.1,12.4 4.86,7.81 5.11,3.31 C5.17,2.5 5.81,2.12 6.53,2 L15.23,2 L15.23,2 Z M9.76,11.42 C9.94,11.19 10.17,11.1 10.45,11.1 L12.86,11.1 C13.12,11.1 13.31,10.94 13.36,10.69 C13.37,10.64 13.62,9.41 13.74,8.83 C13.81,8.52 13.53,8.28 13.27,8.28 C12.35,8.29 11.42,8.28 10.5,8.28 C9.84,8.28 9.83,7.69 9.82,7.21 C9.8,6.85 10.13,6.55 10.5,6.55 C11.59,6.56 12.67,6.55 13.76,6.55 C14.03,6.55 14.23,6.4 14.28,6.14 C14.34,5.87 14.67,4.29 14.67,4.29 C14.67,4.29 14.82,3.74 14.19,3.74 L7.34,3.74 C7,3.75 6.84,4.02 6.84,4.33 C6.84,7.58 6.85,14.95 6.85,14.99 C6.87,15 8.89,12.51 9.76,11.42 L9.76,11.42 Z\"/></svg>",
        "future": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline points=\"19 2 18 2 18 6 14 6 14 7 19 7 19 2\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M18,6.548 C16.709,3.29 13.354,1 9.6,1 C4.6,1 0.6,5 0.6,10 C0.6,15 4.6,19 9.6,19 C14.6,19 18.6,15 18.6,10\"/><rect x=\"9\" y=\"4\" width=\"1\" height=\"7\"/><path d=\"M13.018,14.197 L9.445,10.625\" fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\"/></svg>",
        "git-branch": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" cx=\"7\" cy=\"3\" r=\"2\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" cx=\"14\" cy=\"6\" r=\"2\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" cx=\"7\" cy=\"17\" r=\"2\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"2\" d=\"M14,8 C14,10.41 12.43,10.87 10.56,11.25 C9.09,11.54 7,12.06 7,15 L7,5\"/></svg>",
        "git-fork": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" cx=\"5.79\" cy=\"2.79\" r=\"1.79\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" cx=\"14.19\" cy=\"2.79\" r=\"1.79\"/><ellipse fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" cx=\"10.03\" cy=\"16.79\" rx=\"1.79\" ry=\"1.79\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"2\" d=\"M5.79,4.57 L5.79,6.56 C5.79,9.19 10.03,10.22 10.03,13.31 C10.03,14.86 10.04,14.55 10.04,14.55 C10.04,14.37 10.04,14.86 10.04,13.31 C10.04,10.22 14.2,9.19 14.2,6.56 L14.2,4.57\"/></svg>",
        "github-alt": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10,0.5 C4.75,0.5 0.5,4.76 0.5,10.01 C0.5,15.26 4.75,19.51 10,19.51 C15.24,19.51 19.5,15.26 19.5,10.01 C19.5,4.76 15.25,0.5 10,0.5 L10,0.5 Z M12.81,17.69 C12.81,17.69 12.81,17.7 12.79,17.69 C12.47,17.75 12.35,17.59 12.35,17.36 L12.35,16.17 C12.35,15.45 12.09,14.92 11.58,14.56 C12.2,14.51 12.77,14.39 13.26,14.21 C13.87,13.98 14.36,13.69 14.74,13.29 C15.42,12.59 15.76,11.55 15.76,10.17 C15.76,9.25 15.45,8.46 14.83,7.8 C15.1,7.08 15.07,6.29 14.75,5.44 L14.51,5.42 C14.34,5.4 14.06,5.46 13.67,5.61 C13.25,5.78 12.79,6.03 12.31,6.35 C11.55,6.16 10.81,6.05 10.09,6.05 C9.36,6.05 8.61,6.15 7.88,6.35 C7.28,5.96 6.75,5.68 6.26,5.54 C6.07,5.47 5.9,5.44 5.78,5.44 L5.42,5.44 C5.06,6.29 5.04,7.08 5.32,7.8 C4.7,8.46 4.4,9.25 4.4,10.17 C4.4,11.94 4.96,13.16 6.08,13.84 C6.53,14.13 7.05,14.32 7.69,14.43 C8.03,14.5 8.32,14.54 8.55,14.55 C8.07,14.89 7.82,15.42 7.82,16.16 L7.82,17.51 C7.8,17.69 7.7,17.8 7.51,17.8 C4.21,16.74 1.82,13.65 1.82,10.01 C1.82,5.5 5.49,1.83 10,1.83 C14.5,1.83 18.17,5.5 18.17,10.01 C18.18,13.53 15.94,16.54 12.81,17.69 L12.81,17.69 Z\"/></svg>",
        "github": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10,1 C5.03,1 1,5.03 1,10 C1,13.98 3.58,17.35 7.16,18.54 C7.61,18.62 7.77,18.34 7.77,18.11 C7.77,17.9 7.76,17.33 7.76,16.58 C5.26,17.12 4.73,15.37 4.73,15.37 C4.32,14.33 3.73,14.05 3.73,14.05 C2.91,13.5 3.79,13.5 3.79,13.5 C4.69,13.56 5.17,14.43 5.17,14.43 C5.97,15.8 7.28,15.41 7.79,15.18 C7.87,14.6 8.1,14.2 8.36,13.98 C6.36,13.75 4.26,12.98 4.26,9.53 C4.26,8.55 4.61,7.74 5.19,7.11 C5.1,6.88 4.79,5.97 5.28,4.73 C5.28,4.73 6.04,4.49 7.75,5.65 C8.47,5.45 9.24,5.35 10,5.35 C10.76,5.35 11.53,5.45 12.25,5.65 C13.97,4.48 14.72,4.73 14.72,4.73 C15.21,5.97 14.9,6.88 14.81,7.11 C15.39,7.74 15.73,8.54 15.73,9.53 C15.73,12.99 13.63,13.75 11.62,13.97 C11.94,14.25 12.23,14.8 12.23,15.64 C12.23,16.84 12.22,17.81 12.22,18.11 C12.22,18.35 12.38,18.63 12.84,18.54 C16.42,17.35 19,13.98 19,10 C19,5.03 14.97,1 10,1 L10,1 Z\"/></svg>",
        "gitter": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"3.5\" y=\"1\" width=\"1.531\" height=\"11.471\"/><rect x=\"7.324\" y=\"4.059\" width=\"1.529\" height=\"15.294\"/><rect x=\"11.148\" y=\"4.059\" width=\"1.527\" height=\"15.294\"/><rect x=\"14.971\" y=\"4.059\" width=\"1.529\" height=\"8.412\"/></svg>",
        "google-plus": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.9,9c0,2.7-0.6,5-3.2,6.3c-3.7,1.8-8.1,0.2-9.4-3.6C-1.1,7.6,1.9,3.3,6.1,3c1.7-0.1,3.2,0.3,4.6,1.3 c0.1,0.1,0.3,0.2,0.4,0.4c-0.5,0.5-1.2,1-1.7,1.6c-1-0.8-2.1-1.1-3.5-0.9C5,5.6,4.2,6,3.6,6.7c-1.3,1.3-1.5,3.4-0.5,5 c1,1.7,2.6,2.3,4.6,1.9c1.4-0.3,2.4-1.2,2.6-2.6H6.9V9H12.9z\"/><polygon points=\"20,9 20,11 18,11 18,13 16,13 16,11 14,11 14,9 16,9 16,7 18,7 18,9\"/></svg>",
        "google": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.86,9.09 C18.46,12.12 17.14,16.05 13.81,17.56 C9.45,19.53 4.13,17.68 2.47,12.87 C0.68,7.68 4.22,2.42 9.5,2.03 C11.57,1.88 13.42,2.37 15.05,3.65 C15.22,3.78 15.37,3.93 15.61,4.14 C14.9,4.81 14.23,5.45 13.5,6.14 C12.27,5.08 10.84,4.72 9.28,4.98 C8.12,5.17 7.16,5.76 6.37,6.63 C4.88,8.27 4.62,10.86 5.76,12.82 C6.95,14.87 9.17,15.8 11.57,15.25 C13.27,14.87 14.76,13.33 14.89,11.75 L10.51,11.75 L10.51,9.09 L17.86,9.09 L17.86,9.09 Z\"/></svg>",
        "grid": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"2\" y=\"2\" width=\"3\" height=\"3\"/><rect x=\"8\" y=\"2\" width=\"3\" height=\"3\"/><rect x=\"14\" y=\"2\" width=\"3\" height=\"3\"/><rect x=\"2\" y=\"8\" width=\"3\" height=\"3\"/><rect x=\"8\" y=\"8\" width=\"3\" height=\"3\"/><rect x=\"14\" y=\"8\" width=\"3\" height=\"3\"/><rect x=\"2\" y=\"14\" width=\"3\" height=\"3\"/><rect x=\"8\" y=\"14\" width=\"3\" height=\"3\"/><rect x=\"14\" y=\"14\" width=\"3\" height=\"3\"/></svg>",
        "happy": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"13\" cy=\"7\" r=\"1\"/><circle cx=\"7\" cy=\"7\" r=\"1\"/><circle fill=\"none\" stroke=\"#000\" cx=\"10\" cy=\"10\" r=\"8.5\"/><path fill=\"none\" stroke=\"#000\" d=\"M14.6,11.4 C13.9,13.3 12.1,14.5 10,14.5 C7.9,14.5 6.1,13.3 5.4,11.4\"/></svg>",
        "hashtag": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15.431,8 L15.661,7 L12.911,7 L13.831,3 L12.901,3 L11.98,7 L9.29,7 L10.21,3 L9.281,3 L8.361,7 L5.23,7 L5,8 L8.13,8 L7.21,12 L4.23,12 L4,13 L6.98,13 L6.061,17 L6.991,17 L7.911,13 L10.601,13 L9.681,17 L10.611,17 L11.531,13 L14.431,13 L14.661,12 L11.76,12 L12.681,8 L15.431,8 Z M10.831,12 L8.141,12 L9.061,8 L11.75,8 L10.831,12 Z\"/></svg>",
        "heart": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.03\" d=\"M10,4 C10,4 8.1,2 5.74,2 C3.38,2 1,3.55 1,6.73 C1,8.84 2.67,10.44 2.67,10.44 L10,18 L17.33,10.44 C17.33,10.44 19,8.84 19,6.73 C19,3.55 16.62,2 14.26,2 C11.9,2 10,4 10,4 L10,4 Z\"/></svg>",
        "history": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"#000\" points=\"1 2 2 2 2 6 6 6 6 7 1 7 1 2\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M2.1,6.548 C3.391,3.29 6.746,1 10.5,1 C15.5,1 19.5,5 19.5,10 C19.5,15 15.5,19 10.5,19 C5.5,19 1.5,15 1.5,10\"/><rect x=\"9\" y=\"4\" width=\"1\" height=\"7\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M13.018,14.197 L9.445,10.625\"/></svg>",
        "home": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"18.65 11.35 10 2.71 1.35 11.35 0.65 10.65 10 1.29 19.35 10.65\"/><polygon points=\"15 4 18 4 18 7 17 7 17 5 15 5\"/><polygon points=\"3 11 4 11 4 18 7 18 7 12 12 12 12 18 16 18 16 11 17 11 17 19 11 19 11 13 8 13 8 19 3 19\"/></svg>",
        "image": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"16.1\" cy=\"6.1\" r=\"1.1\"/><rect fill=\"none\" stroke=\"#000\" x=\".5\" y=\"2.5\" width=\"19\" height=\"15\"/><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.01\" points=\"4,13 8,9 13,14\"/><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.01\" points=\"11,12 12.5,10.5 16,14\"/></svg>",
        "info": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.13,11.59 C11.97,12.84 10.35,14.12 9.1,14.16 C6.17,14.2 9.89,9.46 8.74,8.37 C9.3,8.16 10.62,7.83 10.62,8.81 C10.62,9.63 10.12,10.55 9.88,11.32 C8.66,15.16 12.13,11.15 12.14,11.18 C12.16,11.21 12.16,11.35 12.13,11.59 C12.08,11.95 12.16,11.35 12.13,11.59 L12.13,11.59 Z M11.56,5.67 C11.56,6.67 9.36,7.15 9.36,6.03 C9.36,5 11.56,4.54 11.56,5.67 L11.56,5.67 Z\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10\" cy=\"10\" r=\"9\"/></svg>",
        "instagram": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13.55,1H6.46C3.45,1,1,3.44,1,6.44v7.12c0,3,2.45,5.44,5.46,5.44h7.08c3.02,0,5.46-2.44,5.46-5.44V6.44 C19.01,3.44,16.56,1,13.55,1z M17.5,14c0,1.93-1.57,3.5-3.5,3.5H6c-1.93,0-3.5-1.57-3.5-3.5V6c0-1.93,1.57-3.5,3.5-3.5h8 c1.93,0,3.5,1.57,3.5,3.5V14z\"/><circle cx=\"14.87\" cy=\"5.26\" r=\"1.09\"/><path d=\"M10.03,5.45c-2.55,0-4.63,2.06-4.63,4.6c0,2.55,2.07,4.61,4.63,4.61c2.56,0,4.63-2.061,4.63-4.61 C14.65,7.51,12.58,5.45,10.03,5.45L10.03,5.45L10.03,5.45z M10.08,13c-1.66,0-3-1.34-3-2.99c0-1.65,1.34-2.99,3-2.99s3,1.34,3,2.99 C13.08,11.66,11.74,13,10.08,13L10.08,13L10.08,13z\"/></svg>",
        "italic": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M12.63,5.48 L10.15,14.52 C10,15.08 10.37,15.25 11.92,15.3 L11.72,16 L6,16 L6.2,15.31 C7.78,15.26 8.19,15.09 8.34,14.53 L10.82,5.49 C10.97,4.92 10.63,4.76 9.09,4.71 L9.28,4 L15,4 L14.81,4.69 C13.23,4.75 12.78,4.91 12.63,5.48 L12.63,5.48 Z\"/></svg>",
        "joomla": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.8,13.4l1.7-1.7L5.9,8c-0.6-0.5-0.6-1.5,0-2c0.6-0.6,1.4-0.6,2,0l1.7-1.7c-1-1-2.3-1.3-3.6-1C5.8,2.2,4.8,1.4,3.7,1.4 c-1.3,0-2.3,1-2.3,2.3c0,1.1,0.8,2,1.8,2.3c-0.4,1.3-0.1,2.8,1,3.8L7.8,13.4L7.8,13.4z\"/><path d=\"M10.2,4.3c1-1,2.5-1.4,3.8-1c0.2-1.1,1.1-2,2.3-2c1.3,0,2.3,1,2.3,2.3c0,1.2-0.9,2.2-2,2.3c0.4,1.3,0,2.8-1,3.8L13.9,8 c0.6-0.5,0.6-1.5,0-2c-0.5-0.6-1.5-0.6-2,0L8.2,9.7L6.5,8\"/><path d=\"M14.1,16.8c-1.3,0.4-2.8,0.1-3.8-1l1.7-1.7c0.6,0.6,1.5,0.6,2,0c0.5-0.6,0.6-1.5,0-2l-3.7-3.7L12,6.7l3.7,3.7 c1,1,1.3,2.4,1,3.6c1.1,0.2,2,1.1,2,2.3c0,1.3-1,2.3-2.3,2.3C15.2,18.6,14.3,17.8,14.1,16.8\"/><path d=\"M13.2,12.2l-3.7,3.7c-1,1-2.4,1.3-3.6,1c-0.2,1-1.2,1.8-2.2,1.8c-1.3,0-2.3-1-2.3-2.3c0-1.1,0.8-2,1.8-2.3 c-0.3-1.3,0-2.7,1-3.7l1.7,1.7c-0.6,0.6-0.6,1.5,0,2c0.6,0.6,1.4,0.6,2,0l3.7-3.7\"/></svg>",
        "laptop": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect y=\"16\" width=\"20\" height=\"1\"/><rect fill=\"none\" stroke=\"#000\" x=\"2.5\" y=\"4.5\" width=\"15\" height=\"10\"/></svg>",
        "lifesaver": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10,0.5 C4.76,0.5 0.5,4.76 0.5,10 C0.5,15.24 4.76,19.5 10,19.5 C15.24,19.5 19.5,15.24 19.5,10 C19.5,4.76 15.24,0.5 10,0.5 L10,0.5 Z M10,1.5 C11.49,1.5 12.89,1.88 14.11,2.56 L11.85,4.82 C11.27,4.61 10.65,4.5 10,4.5 C9.21,4.5 8.47,4.67 7.79,4.96 L5.58,2.75 C6.87,1.95 8.38,1.5 10,1.5 L10,1.5 Z M4.96,7.8 C4.67,8.48 4.5,9.21 4.5,10 C4.5,10.65 4.61,11.27 4.83,11.85 L2.56,14.11 C1.88,12.89 1.5,11.49 1.5,10 C1.5,8.38 1.95,6.87 2.75,5.58 L4.96,7.79 L4.96,7.8 L4.96,7.8 Z M10,18.5 C8.25,18.5 6.62,17.97 5.27,17.06 L7.46,14.87 C8.22,15.27 9.08,15.5 10,15.5 C10.79,15.5 11.53,15.33 12.21,15.04 L14.42,17.25 C13.13,18.05 11.62,18.5 10,18.5 L10,18.5 Z M10,14.5 C7.52,14.5 5.5,12.48 5.5,10 C5.5,7.52 7.52,5.5 10,5.5 C12.48,5.5 14.5,7.52 14.5,10 C14.5,12.48 12.48,14.5 10,14.5 L10,14.5 Z M15.04,12.21 C15.33,11.53 15.5,10.79 15.5,10 C15.5,9.08 15.27,8.22 14.87,7.46 L17.06,5.27 C17.97,6.62 18.5,8.25 18.5,10 C18.5,11.62 18.05,13.13 17.25,14.42 L15.04,12.21 L15.04,12.21 Z\"/></svg>",
        "link": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M10.625,12.375 L7.525,15.475 C6.825,16.175 5.925,16.175 5.225,15.475 L4.525,14.775 C3.825,14.074 3.825,13.175 4.525,12.475 L7.625,9.375\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M9.325,7.375 L12.425,4.275 C13.125,3.575 14.025,3.575 14.724,4.275 L15.425,4.975 C16.125,5.675 16.125,6.575 15.425,7.275 L12.325,10.375\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M7.925,11.875 L11.925,7.975\"/></svg>",
        "linkedin": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5.77,17.89 L5.77,7.17 L2.21,7.17 L2.21,17.89 L5.77,17.89 L5.77,17.89 Z M3.99,5.71 C5.23,5.71 6.01,4.89 6.01,3.86 C5.99,2.8 5.24,2 4.02,2 C2.8,2 2,2.8 2,3.85 C2,4.88 2.77,5.7 3.97,5.7 L3.99,5.7 L3.99,5.71 L3.99,5.71 Z\"/><path d=\"M7.75,17.89 L11.31,17.89 L11.31,11.9 C11.31,11.58 11.33,11.26 11.43,11.03 C11.69,10.39 12.27,9.73 13.26,9.73 C14.55,9.73 15.06,10.71 15.06,12.15 L15.06,17.89 L18.62,17.89 L18.62,11.74 C18.62,8.45 16.86,6.92 14.52,6.92 C12.6,6.92 11.75,7.99 11.28,8.73 L11.3,8.73 L11.3,7.17 L7.75,7.17 C7.79,8.17 7.75,17.89 7.75,17.89 L7.75,17.89 L7.75,17.89 Z\"/></svg>",
        "list": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"6\" y=\"4\" width=\"12\" height=\"1\"/><rect x=\"6\" y=\"9\" width=\"12\" height=\"1\"/><rect x=\"6\" y=\"14\" width=\"12\" height=\"1\"/><rect x=\"2\" y=\"4\" width=\"2\" height=\"1\"/><rect x=\"2\" y=\"9\" width=\"2\" height=\"1\"/><rect x=\"2\" y=\"14\" width=\"2\" height=\"1\"/></svg>",
        "location": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.01\" d=\"M10,0.5 C6.41,0.5 3.5,3.39 3.5,6.98 C3.5,11.83 10,19 10,19 C10,19 16.5,11.83 16.5,6.98 C16.5,3.39 13.59,0.5 10,0.5 L10,0.5 Z\"/><circle fill=\"none\" stroke=\"#000\" cx=\"10\" cy=\"6.8\" r=\"2.3\"/></svg>",
        "lock": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect fill=\"none\" stroke=\"#000\" height=\"10\" width=\"13\" y=\"8.5\" x=\"3.5\"/><path fill=\"none\" stroke=\"#000\" d=\"M6.5,8 L6.5,4.88 C6.5,3.01 8.07,1.5 10,1.5 C11.93,1.5 13.5,3.01 13.5,4.88 L13.5,8\"/></svg>",
        "mail": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" points=\"1.4,6.5 10,11 18.6,6.5\"/><path d=\"M 1,4 1,16 19,16 19,4 1,4 Z M 18,15 2,15 2,5 18,5 18,15 Z\"/></svg>",
        "menu": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"2\" y=\"4\" width=\"16\" height=\"1\"/><rect x=\"2\" y=\"9\" width=\"16\" height=\"1\"/><rect x=\"2\" y=\"14\" width=\"16\" height=\"1\"/></svg>",
        "microphone": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" x1=\"10\" x2=\"10\" y1=\"16.44\" y2=\"18.5\"/><line fill=\"none\" stroke=\"#000\" x1=\"7\" x2=\"13\" y1=\"18.5\" y2=\"18.5\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M13.5 4.89v5.87a3.5 3.5 0 0 1-7 0V4.89a3.5 3.5 0 0 1 7 0z\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M15.5 10.36V11a5.5 5.5 0 0 1-11 0v-.6\"/></svg>",
        "minus-circle": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9.5\" cy=\"9.5\" r=\"9\"/><line fill=\"none\" stroke=\"#000\" x1=\"5\" y1=\"9.5\" x2=\"14\" y2=\"9.5\"/></svg>",
        "minus": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect height=\"1\" width=\"18\" y=\"9\" x=\"1\"/></svg>",
        "more-vertical": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"10\" cy=\"3\" r=\"2\"/><circle cx=\"10\" cy=\"10\" r=\"2\"/><circle cx=\"10\" cy=\"17\" r=\"2\"/></svg>",
        "more": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"3\" cy=\"10\" r=\"2\"/><circle cx=\"10\" cy=\"10\" r=\"2\"/><circle cx=\"17\" cy=\"10\" r=\"2\"/></svg>",
        "move": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"4,5 1,5 1,9 2,9 2,6 4,6\"/><polygon points=\"1,16 2,16 2,18 4,18 4,19 1,19\"/><polygon points=\"14,16 14,19 11,19 11,18 13,18 13,16\"/><rect fill=\"none\" stroke=\"#000\" x=\"5.5\" y=\"1.5\" width=\"13\" height=\"13\"/><rect x=\"1\" y=\"11\" width=\"1\" height=\"3\"/><rect x=\"6\" y=\"18\" width=\"3\" height=\"1\"/></svg>",
        "nut": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon fill=\"none\" stroke=\"#000\" points=\"2.5,5.7 10,1.3 17.5,5.7 17.5,14.3 10,18.7 2.5,14.3\"/><circle fill=\"none\" stroke=\"#000\" cx=\"10\" cy=\"10\" r=\"3.5\"/></svg>",
        "pagekit": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"3,1 17,1 17,16 10,16 10,13 14,13 14,4 6,4 6,16 10,16 10,19 3,19\"/></svg>",
        "paint-bucket": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10.21,1 L0,11.21 L8.1,19.31 L18.31,9.1 L10.21,1 L10.21,1 Z M16.89,9.1 L15,11 L1.7,11 L10.21,2.42 L16.89,9.1 Z\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M6.42,2.33 L11.7,7.61\"/><path d=\"M18.49,12 C18.49,12 20,14.06 20,15.36 C20,16.28 19.24,17 18.49,17 L18.49,17 C17.74,17 17,16.28 17,15.36 C17,14.06 18.49,12 18.49,12 L18.49,12 Z\"/></svg>",
        "pencil": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" d=\"M17.25,6.01 L7.12,16.1 L3.82,17.2 L5.02,13.9 L15.12,3.88 C15.71,3.29 16.66,3.29 17.25,3.88 C17.83,4.47 17.83,5.42 17.25,6.01 L17.25,6.01 Z\"/><path fill=\"none\" stroke=\"#000\" d=\"M15.98,7.268 L13.851,5.148\"/></svg>",
        "phone-landscape": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" d=\"M17,5.5 C17.8,5.5 18.5,6.2 18.5,7 L18.5,14 C18.5,14.8 17.8,15.5 17,15.5 L3,15.5 C2.2,15.5 1.5,14.8 1.5,14 L1.5,7 C1.5,6.2 2.2,5.5 3,5.5 L17,5.5 L17,5.5 L17,5.5 Z\"/><circle cx=\"3.8\" cy=\"10.5\" r=\".8\"/></svg>",
        "phone": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" d=\"M15.5,17 C15.5,17.8 14.8,18.5 14,18.5 L7,18.5 C6.2,18.5 5.5,17.8 5.5,17 L5.5,3 C5.5,2.2 6.2,1.5 7,1.5 L14,1.5 C14.8,1.5 15.5,2.2 15.5,3 L15.5,17 L15.5,17 L15.5,17 Z\"/><circle cx=\"10.5\" cy=\"16.5\" r=\".8\"/></svg>",
        "pinterest": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10.21,1 C5.5,1 3,4.16 3,7.61 C3,9.21 3.85,11.2 5.22,11.84 C5.43,11.94 5.54,11.89 5.58,11.69 C5.62,11.54 5.8,10.8 5.88,10.45 C5.91,10.34 5.89,10.24 5.8,10.14 C5.36,9.59 5,8.58 5,7.65 C5,5.24 6.82,2.91 9.93,2.91 C12.61,2.91 14.49,4.74 14.49,7.35 C14.49,10.3 13,12.35 11.06,12.35 C9.99,12.35 9.19,11.47 9.44,10.38 C9.75,9.08 10.35,7.68 10.35,6.75 C10.35,5.91 9.9,5.21 8.97,5.21 C7.87,5.21 6.99,6.34 6.99,7.86 C6.99,8.83 7.32,9.48 7.32,9.48 C7.32,9.48 6.24,14.06 6.04,14.91 C5.7,16.35 6.08,18.7 6.12,18.9 C6.14,19.01 6.26,19.05 6.33,18.95 C6.44,18.81 7.74,16.85 8.11,15.44 C8.24,14.93 8.79,12.84 8.79,12.84 C9.15,13.52 10.19,14.09 11.29,14.09 C14.58,14.09 16.96,11.06 16.96,7.3 C16.94,3.7 14,1 10.21,1\"/></svg>",
        "play-circle": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" points=\"8.5 7 13.5 10 8.5 13\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10\" cy=\"10\" r=\"9\"/></svg>",
        "play": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon fill=\"none\" stroke=\"#000\" points=\"6.5,5 14.5,10 6.5,15\"/></svg>",
        "plus-circle": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9.5\" cy=\"9.5\" r=\"9\"/><line fill=\"none\" stroke=\"#000\" x1=\"9.5\" y1=\"5\" x2=\"9.5\" y2=\"14\"/><line fill=\"none\" stroke=\"#000\" x1=\"5\" y1=\"9.5\" x2=\"14\" y2=\"9.5\"/></svg>",
        "plus": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"9\" y=\"1\" width=\"1\" height=\"17\"/><rect x=\"1\" y=\"9\" width=\"17\" height=\"1\"/></svg>",
        "print": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" points=\"4.5 13.5 1.5 13.5 1.5 6.5 18.5 6.5 18.5 13.5 15.5 13.5\"/><polyline fill=\"none\" stroke=\"#000\" points=\"15.5 6.5 15.5 2.5 4.5 2.5 4.5 6.5\"/><rect fill=\"none\" stroke=\"#000\" width=\"11\" height=\"6\" x=\"4.5\" y=\"11.5\"/><rect width=\"8\" height=\"1\" x=\"6\" y=\"13\"/><rect width=\"8\" height=\"1\" x=\"6\" y=\"15\"/></svg>",
        "pull": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"6.85,8 9.5,10.6 12.15,8 12.85,8.7 9.5,12 6.15,8.7\"/><line fill=\"none\" stroke=\"#000\" x1=\"9.5\" y1=\"11\" x2=\"9.5\" y2=\"2\"/><polyline fill=\"none\" stroke=\"#000\" points=\"6,5.5 3.5,5.5 3.5,18.5 15.5,18.5 15.5,5.5 13,5.5\"/></svg>",
        "push": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"12.15,4 9.5,1.4 6.85,4 6.15,3.3 9.5,0 12.85,3.3\"/><line fill=\"none\" stroke=\"#000\" x1=\"9.5\" y1=\"10\" x2=\"9.5\" y2=\"1\"/><polyline fill=\"none\" stroke=\"#000\" points=\"6 5.5 3.5 5.5 3.5 18.5 15.5 18.5 15.5 5.5 13 5.5\"/></svg>",
        "question": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10\" cy=\"10\" r=\"9\"/><circle cx=\"10.44\" cy=\"14.42\" r=\"1.05\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" d=\"M8.17,7.79 C8.17,4.75 12.72,4.73 12.72,7.72 C12.72,8.67 11.81,9.15 11.23,9.75 C10.75,10.24 10.51,10.73 10.45,11.4 C10.44,11.53 10.43,11.64 10.43,11.75\"/></svg>",
        "quote-right": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.27,7.79 C17.27,9.45 16.97,10.43 15.99,12.02 C14.98,13.64 13,15.23 11.56,15.97 L11.1,15.08 C12.34,14.2 13.14,13.51 14.02,11.82 C14.27,11.34 14.41,10.92 14.49,10.54 C14.3,10.58 14.09,10.6 13.88,10.6 C12.06,10.6 10.59,9.12 10.59,7.3 C10.59,5.48 12.06,4 13.88,4 C15.39,4 16.67,5.02 17.05,6.42 C17.19,6.82 17.27,7.27 17.27,7.79 L17.27,7.79 Z\"/><path d=\"M8.68,7.79 C8.68,9.45 8.38,10.43 7.4,12.02 C6.39,13.64 4.41,15.23 2.97,15.97 L2.51,15.08 C3.75,14.2 4.55,13.51 5.43,11.82 C5.68,11.34 5.82,10.92 5.9,10.54 C5.71,10.58 5.5,10.6 5.29,10.6 C3.47,10.6 2,9.12 2,7.3 C2,5.48 3.47,4 5.29,4 C6.8,4 8.08,5.02 8.46,6.42 C8.6,6.82 8.68,7.27 8.68,7.79 L8.68,7.79 Z\"/></svg>",
        "receiver": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.01\" d=\"M6.189,13.611C8.134,15.525 11.097,18.239 13.867,18.257C16.47,18.275 18.2,16.241 18.2,16.241L14.509,12.551L11.539,13.639L6.189,8.29L7.313,5.355L3.76,1.8C3.76,1.8 1.732,3.537 1.7,6.092C1.667,8.809 4.347,11.738 6.189,13.611\"/></svg>",
        "reddit": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19 9.05a2.56 2.56 0 0 0-2.56-2.56 2.59 2.59 0 0 0-1.88.82 10.63 10.63 0 0 0-4.14-1v-.08c.58-1.62 1.58-3.89 2.7-4.1.38-.08.77.12 1.19.57a1.15 1.15 0 0 0-.06.37 1.48 1.48 0 1 0 1.51-1.45 1.43 1.43 0 0 0-.76.19A2.29 2.29 0 0 0 12.91 1c-2.11.43-3.39 4.38-3.63 5.19 0 0 0 .11-.06.11a10.65 10.65 0 0 0-3.75 1A2.56 2.56 0 0 0 1 9.05a2.42 2.42 0 0 0 .72 1.76A5.18 5.18 0 0 0 1.24 13c0 3.66 3.92 6.64 8.73 6.64s8.74-3 8.74-6.64a5.23 5.23 0 0 0-.46-2.13A2.58 2.58 0 0 0 19 9.05zm-16.88 0a1.44 1.44 0 0 1 2.27-1.19 7.68 7.68 0 0 0-2.07 1.91 1.33 1.33 0 0 1-.2-.72zM10 18.4c-4.17 0-7.55-2.4-7.55-5.4S5.83 7.53 10 7.53 17.5 10 17.5 13s-3.38 5.4-7.5 5.4zm7.69-8.61a7.62 7.62 0 0 0-2.09-1.91 1.41 1.41 0 0 1 .84-.28 1.47 1.47 0 0 1 1.44 1.45 1.34 1.34 0 0 1-.21.72z\"/><path d=\"M6.69 12.58a1.39 1.39 0 1 1 1.39-1.39 1.38 1.38 0 0 1-1.38 1.39z\"/><path d=\"M14.26 11.2a1.39 1.39 0 1 1-1.39-1.39 1.39 1.39 0 0 1 1.39 1.39z\"/><path d=\"M13.09 14.88a.54.54 0 0 1-.09.77 5.3 5.3 0 0 1-3.26 1.19 5.61 5.61 0 0 1-3.4-1.22.55.55 0 1 1 .73-.83 4.09 4.09 0 0 0 5.25 0 .56.56 0 0 1 .77.09z\"/></svg>",
        "refresh": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M17.08,11.15 C17.09,11.31 17.1,11.47 17.1,11.64 C17.1,15.53 13.94,18.69 10.05,18.69 C6.16,18.68 3,15.53 3,11.63 C3,7.74 6.16,4.58 10.05,4.58 C10.9,4.58 11.71,4.73 12.46,5\"/><polyline fill=\"none\" stroke=\"#000\" points=\"9.9 2 12.79 4.89 9.79 7.9\"/></svg>",
        "reply": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.7,13.11 C16.12,10.02 13.84,7.85 11.02,6.61 C10.57,6.41 9.75,6.13 9,5.91 L9,2 L1,9 L9,16 L9,12.13 C10.78,12.47 12.5,13.19 14.09,14.25 C17.13,16.28 18.56,18.54 18.56,18.54 C18.56,18.54 18.81,15.28 17.7,13.11 L17.7,13.11 Z M14.82,13.53 C13.17,12.4 11.01,11.4 8,10.92 L8,13.63 L2.55,9 L8,4.25 L8,6.8 C8.3,6.86 9.16,7.02 10.37,7.49 C13.3,8.65 15.54,10.96 16.65,13.08 C16.97,13.7 17.48,14.86 17.68,16 C16.87,15.05 15.73,14.15 14.82,13.53 L14.82,13.53 Z\"/></svg>",
        "rss": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"3.12\" cy=\"16.8\" r=\"1.85\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M1.5,8.2 C1.78,8.18 2.06,8.16 2.35,8.16 C7.57,8.16 11.81,12.37 11.81,17.57 C11.81,17.89 11.79,18.19 11.76,18.5\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M1.5,2.52 C1.78,2.51 2.06,2.5 2.35,2.5 C10.72,2.5 17.5,9.24 17.5,17.57 C17.5,17.89 17.49,18.19 17.47,18.5\"/></svg>",
        "search": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9\" cy=\"9\" r=\"7\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M14,14 L18,18 L14,14 Z\"/></svg>",
        "server": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"3\" y=\"3\" width=\"1\" height=\"2\"/><rect x=\"5\" y=\"3\" width=\"1\" height=\"2\"/><rect x=\"7\" y=\"3\" width=\"1\" height=\"2\"/><rect x=\"16\" y=\"3\" width=\"1\" height=\"1\"/><rect x=\"16\" y=\"10\" width=\"1\" height=\"1\"/><circle fill=\"none\" stroke=\"#000\" cx=\"9.9\" cy=\"17.4\" r=\"1.4\"/><rect x=\"3\" y=\"10\" width=\"1\" height=\"2\"/><rect x=\"5\" y=\"10\" width=\"1\" height=\"2\"/><rect x=\"9.5\" y=\"14\" width=\"1\" height=\"2\"/><rect x=\"3\" y=\"17\" width=\"6\" height=\"1\"/><rect x=\"11\" y=\"17\" width=\"6\" height=\"1\"/><rect fill=\"none\" stroke=\"#000\" x=\"1.5\" y=\"1.5\" width=\"17\" height=\"5\"/><rect fill=\"none\" stroke=\"#000\" x=\"1.5\" y=\"8.5\" width=\"17\" height=\"5\"/></svg>",
        "settings": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><ellipse fill=\"none\" stroke=\"#000\" cx=\"6.11\" cy=\"3.55\" rx=\"2.11\" ry=\"2.15\"/><ellipse fill=\"none\" stroke=\"#000\" cx=\"6.11\" cy=\"15.55\" rx=\"2.11\" ry=\"2.15\"/><circle fill=\"none\" stroke=\"#000\" cx=\"13.15\" cy=\"9.55\" r=\"2.15\"/><rect x=\"1\" y=\"3\" width=\"3\" height=\"1\"/><rect x=\"10\" y=\"3\" width=\"8\" height=\"1\"/><rect x=\"1\" y=\"9\" width=\"8\" height=\"1\"/><rect x=\"15\" y=\"9\" width=\"3\" height=\"1\"/><rect x=\"1\" y=\"15\" width=\"3\" height=\"1\"/><rect x=\"10\" y=\"15\" width=\"8\" height=\"1\"/></svg>",
        "shrink": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"11 4 12 4 12 8 16 8 16 9 11 9\"/><polygon points=\"4 11 9 11 9 16 8 16 8 12 4 12\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M12,8 L18,2\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M2,18 L8,12\"/></svg>",
        "sign-in": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"7 2 17 2 17 17 7 17 7 16 16 16 16 3 7 3\"/><polygon points=\"9.1 13.4 8.5 12.8 11.28 10 4 10 4 9 11.28 9 8.5 6.2 9.1 5.62 13 9.5\"/></svg>",
        "sign-out": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"13.1 13.4 12.5 12.8 15.28 10 8 10 8 9 15.28 9 12.5 6.2 13.1 5.62 17 9.5\"/><polygon points=\"13 2 3 2 3 17 13 17 13 16 4 16 4 3 13 3\"/></svg>",
        "social": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"13.4\" y1=\"14\" x2=\"6.3\" y2=\"10.7\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"13.5\" y1=\"5.5\" x2=\"6.5\" y2=\"8.8\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"15.5\" cy=\"4.6\" r=\"2.3\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"15.5\" cy=\"14.8\" r=\"2.3\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"4.5\" cy=\"9.8\" r=\"2.3\"/></svg>",
        "soundcloud": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.2,9.4c-0.4,0-0.8,0.1-1.101,0.2c-0.199-2.5-2.399-4.5-5-4.5c-0.6,0-1.2,0.1-1.7,0.3C9.2,5.5,9.1,5.6,9.1,5.6V15h8 c1.601,0,2.801-1.2,2.801-2.8C20,10.7,18.7,9.4,17.2,9.4L17.2,9.4z\"/><rect x=\"6\" y=\"6.5\" width=\"1.5\" height=\"8.5\"/><rect x=\"3\" y=\"8\" width=\"1.5\" height=\"7\"/><rect y=\"10\" width=\"1.5\" height=\"5\"/></svg>",
        "star": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon fill=\"none\" stroke=\"#000\" stroke-width=\"1.01\" points=\"10 2 12.63 7.27 18.5 8.12 14.25 12.22 15.25 18 10 15.27 4.75 18 5.75 12.22 1.5 8.12 7.37 7.27\"/></svg>",
        "strikethrough": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6,13.02 L6.65,13.02 C7.64,15.16 8.86,16.12 10.41,16.12 C12.22,16.12 12.92,14.93 12.92,13.89 C12.92,12.55 11.99,12.03 9.74,11.23 C8.05,10.64 6.23,10.11 6.23,7.83 C6.23,5.5 8.09,4.09 10.4,4.09 C11.44,4.09 12.13,4.31 12.72,4.54 L13.33,4 L13.81,4 L13.81,7.59 L13.16,7.59 C12.55,5.88 11.52,4.89 10.07,4.89 C8.84,4.89 7.89,5.69 7.89,7.03 C7.89,8.29 8.89,8.78 10.88,9.45 C12.57,10.03 14.38,10.6 14.38,12.91 C14.38,14.75 13.27,16.93 10.18,16.93 C9.18,16.93 8.17,16.69 7.46,16.39 L6.52,17 L6,17 L6,13.02 L6,13.02 Z\"/><rect x=\"3\" y=\"10\" width=\"15\" height=\"1\"/></svg>",
        "table": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"1\" y=\"3\" width=\"18\" height=\"1\"/><rect x=\"1\" y=\"7\" width=\"18\" height=\"1\"/><rect x=\"1\" y=\"11\" width=\"18\" height=\"1\"/><rect x=\"1\" y=\"15\" width=\"18\" height=\"1\"/></svg>",
        "tablet-landscape": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" d=\"M1.5,5 C1.5,4.2 2.2,3.5 3,3.5 L17,3.5 C17.8,3.5 18.5,4.2 18.5,5 L18.5,16 C18.5,16.8 17.8,17.5 17,17.5 L3,17.5 C2.2,17.5 1.5,16.8 1.5,16 L1.5,5 L1.5,5 L1.5,5 Z\"/><circle cx=\"3.7\" cy=\"10.5\" r=\".8\"/></svg>",
        "tablet": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" d=\"M5,18.5 C4.2,18.5 3.5,17.8 3.5,17 L3.5,3 C3.5,2.2 4.2,1.5 5,1.5 L16,1.5 C16.8,1.5 17.5,2.2 17.5,3 L17.5,17 C17.5,17.8 16.8,18.5 16,18.5 L5,18.5 L5,18.5 L5,18.5 Z\"/><circle cx=\"10.5\" cy=\"16.3\" r=\".8\"/></svg>",
        "tag": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M17.5,3.71 L17.5,7.72 C17.5,7.96 17.4,8.2 17.21,8.39 L8.39,17.2 C7.99,17.6 7.33,17.6 6.93,17.2 L2.8,13.07 C2.4,12.67 2.4,12.01 2.8,11.61 L11.61,2.8 C11.81,2.6 12.08,2.5 12.34,2.5 L16.19,2.5 C16.52,2.5 16.86,2.63 17.11,2.88 C17.35,3.11 17.48,3.4 17.5,3.71 L17.5,3.71 Z\"/><circle cx=\"14\" cy=\"6\" r=\"1\"/></svg>",
        "thumbnails": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect fill=\"none\" stroke=\"#000\" x=\"3.5\" y=\"3.5\" width=\"5\" height=\"5\"/><rect fill=\"none\" stroke=\"#000\" x=\"11.5\" y=\"3.5\" width=\"5\" height=\"5\"/><rect fill=\"none\" stroke=\"#000\" x=\"11.5\" y=\"11.5\" width=\"5\" height=\"5\"/><rect fill=\"none\" stroke=\"#000\" x=\"3.5\" y=\"11.5\" width=\"5\" height=\"5\"/></svg>",
        "trash": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" points=\"6.5 3 6.5 1.5 13.5 1.5 13.5 3\"/><polyline fill=\"none\" stroke=\"#000\" points=\"4.5 4 4.5 18.5 15.5 18.5 15.5 4\"/><rect x=\"8\" y=\"7\" width=\"1\" height=\"9\"/><rect x=\"11\" y=\"7\" width=\"1\" height=\"9\"/><rect x=\"2\" y=\"3\" width=\"16\" height=\"1\"/></svg>",
        "triangle-down": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"5 7 15 7 10 12\"/></svg>",
        "triangle-left": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"12 5 7 10 12 15\"/></svg>",
        "triangle-right": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"8 5 13 10 8 15\"/></svg>",
        "triangle-up": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"5 13 10 8 15 13\"/></svg>",
        "tripadvisor": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19.021,7.866C19.256,6.862,20,5.854,20,5.854h-3.346C14.781,4.641,12.504,4,9.98,4C7.363,4,4.999,4.651,3.135,5.876H0\tc0,0,0.738,0.987,0.976,1.988c-0.611,0.837-0.973,1.852-0.973,2.964c0,2.763,2.249,5.009,5.011,5.009\tc1.576,0,2.976-0.737,3.901-1.879l1.063,1.599l1.075-1.615c0.475,0.611,1.1,1.111,1.838,1.451c1.213,0.547,2.574,0.612,3.825,0.15\tc2.589-0.963,3.913-3.852,2.964-6.439c-0.175-0.463-0.4-0.876-0.675-1.238H19.021z M16.38,14.594\tc-1.002,0.371-2.088,0.328-3.06-0.119c-0.688-0.317-1.252-0.817-1.657-1.438c-0.164-0.25-0.313-0.52-0.417-0.811\tc-0.124-0.328-0.186-0.668-0.217-1.014c-0.063-0.689,0.037-1.396,0.339-2.043c0.448-0.971,1.251-1.71,2.25-2.079\tc2.075-0.765,4.375,0.3,5.14,2.366c0.762,2.066-0.301,4.37-2.363,5.134L16.38,14.594L16.38,14.594z M8.322,13.066\tc-0.72,1.059-1.935,1.76-3.309,1.76c-2.207,0-4.001-1.797-4.001-3.996c0-2.203,1.795-4.002,4.001-4.002\tc2.204,0,3.999,1.8,3.999,4.002c0,0.137-0.024,0.261-0.04,0.396c-0.067,0.678-0.284,1.313-0.648,1.853v-0.013H8.322z M2.472,10.775\tc0,1.367,1.112,2.479,2.476,2.479c1.363,0,2.472-1.11,2.472-2.479c0-1.359-1.11-2.468-2.472-2.468\tC3.584,8.306,2.473,9.416,2.472,10.775L2.472,10.775z M12.514,10.775c0,1.367,1.104,2.479,2.471,2.479\tc1.363,0,2.474-1.108,2.474-2.479c0-1.359-1.11-2.468-2.474-2.468c-1.364,0-2.477,1.109-2.477,2.468H12.514z M3.324,10.775\tc0-0.893,0.726-1.618,1.614-1.618c0.889,0,1.625,0.727,1.625,1.618c0,0.898-0.725,1.627-1.625,1.627\tc-0.901,0-1.625-0.729-1.625-1.627H3.324z M13.354,10.775c0-0.893,0.726-1.618,1.627-1.618c0.886,0,1.61,0.727,1.61,1.618\tc0,0.898-0.726,1.627-1.626,1.627s-1.625-0.729-1.625-1.627H13.354z M9.977,4.875c1.798,0,3.425,0.324,4.849,0.968\tc-0.535,0.015-1.061,0.108-1.586,0.3c-1.264,0.463-2.264,1.388-2.815,2.604c-0.262,0.551-0.398,1.133-0.448,1.72\tC9.79,7.905,7.677,5.873,5.076,5.82C6.501,5.208,8.153,4.875,9.94,4.875H9.977z\"/></svg>",
        "tumblr": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M6.885,8.598c0,0,0,3.393,0,4.996c0,0.282,0,0.66,0.094,0.942c0.377,1.509,1.131,2.545,2.545,3.11 c1.319,0.472,2.356,0.472,3.676,0c0.565-0.188,1.132-0.659,1.132-0.659l-0.849-2.263c0,0-1.036,0.378-1.603,0.283 c-0.565-0.094-1.226-0.66-1.226-1.508c0-1.603,0-4.902,0-4.902h2.828V5.771h-2.828V2H8.205c0,0-0.094,0.66-0.188,0.942 C7.828,3.791,7.262,4.733,6.603,5.394C5.848,6.147,5,6.43,5,6.43v2.168H6.885z\"/></svg>",
        "tv": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"7\" y=\"16\" width=\"6\" height=\"1\"/><rect fill=\"none\" stroke=\"#000\" x=\".5\" y=\"3.5\" width=\"19\" height=\"11\"/></svg>",
        "twitter": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19,4.74 C18.339,5.029 17.626,5.229 16.881,5.32 C17.644,4.86 18.227,4.139 18.503,3.28 C17.79,3.7 17.001,4.009 16.159,4.17 C15.485,3.45 14.526,3 13.464,3 C11.423,3 9.771,4.66 9.771,6.7 C9.771,6.99 9.804,7.269 9.868,7.539 C6.795,7.38 4.076,5.919 2.254,3.679 C1.936,4.219 1.754,4.86 1.754,5.539 C1.754,6.82 2.405,7.95 3.397,8.61 C2.79,8.589 2.22,8.429 1.723,8.149 L1.723,8.189 C1.723,9.978 2.997,11.478 4.686,11.82 C4.376,11.899 4.049,11.939 3.713,11.939 C3.475,11.939 3.245,11.919 3.018,11.88 C3.49,13.349 4.852,14.419 6.469,14.449 C5.205,15.429 3.612,16.019 1.882,16.019 C1.583,16.019 1.29,16.009 1,15.969 C2.635,17.019 4.576,17.629 6.662,17.629 C13.454,17.629 17.17,12 17.17,7.129 C17.17,6.969 17.166,6.809 17.157,6.649 C17.879,6.129 18.504,5.478 19,4.74\"/></svg>",
        "uikit": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"14.4,3.1 11.3,5.1 15,7.3 15,12.9 10,15.7 5,12.9 5,8.5 2,6.8 2,14.8 9.9,19.5 18,14.8 18,5.3\"/><polygon points=\"9.8,4.2 6.7,2.4 9.8,0.4 12.9,2.3\"/></svg>",
        "unlock": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect fill=\"none\" stroke=\"#000\" x=\"3.5\" y=\"8.5\" width=\"13\" height=\"10\"/><path fill=\"none\" stroke=\"#000\" d=\"M6.5,8.5 L6.5,4.9 C6.5,3 8.1,1.5 10,1.5 C11.9,1.5 13.5,3 13.5,4.9\"/></svg>",
        "upload": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" points=\"5 8 9.5 3.5 14 8\"/><rect x=\"3\" y=\"17\" width=\"13\" height=\"1\"/><line fill=\"none\" stroke=\"#000\" x1=\"9.5\" y1=\"15\" x2=\"9.5\" y2=\"4\"/></svg>",
        "user": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9.9\" cy=\"6.4\" r=\"4.4\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M1.5,19 C2.3,14.5 5.8,11.2 10,11.2 C14.2,11.2 17.7,14.6 18.5,19.2\"/></svg>",
        "users": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"7.7\" cy=\"8.6\" r=\"3.5\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M1,18.1 C1.7,14.6 4.4,12.1 7.6,12.1 C10.9,12.1 13.7,14.8 14.3,18.3\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M11.4,4 C12.8,2.4 15.4,2.8 16.3,4.7 C17.2,6.6 15.7,8.9 13.6,8.9 C16.5,8.9 18.8,11.3 19.2,14.1\"/></svg>",
        "video-camera": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><polygon fill=\"none\" stroke=\"#000\" points=\"17.5 6.9 17.5 13.1 13.5 10.4 13.5 14.5 2.5 14.5 2.5 5.5 13.5 5.5 13.5 9.6 17.5 6.9\"/></svg>",
        "vimeo": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2.065,7.59C1.84,7.367,1.654,7.082,1.468,6.838c-0.332-0.42-0.137-0.411,0.274-0.772c1.026-0.91,2.004-1.896,3.127-2.688 c1.017-0.713,2.365-1.173,3.286-0.039c0.849,1.045,0.869,2.629,1.084,3.891c0.215,1.309,0.421,2.648,0.88,3.901 c0.127,0.352,0.37,1.018,0.81,1.074c0.567,0.078,1.145-0.917,1.408-1.289c0.684-0.987,1.611-2.317,1.494-3.587 c-0.115-1.349-1.572-1.095-2.482-0.773c0.146-1.514,1.555-3.216,2.912-3.792c1.439-0.597,3.579-0.587,4.302,1.036 c0.772,1.759,0.078,3.802-0.763,5.396c-0.918,1.731-2.1,3.333-3.363,4.829c-1.114,1.329-2.432,2.787-4.093,3.422 c-1.897,0.723-3.021-0.686-3.667-2.318c-0.705-1.777-1.056-3.771-1.565-5.621C4.898,8.726,4.644,7.836,4.136,7.191 C3.473,6.358,2.72,7.141,2.065,7.59C1.977,7.502,2.115,7.551,2.065,7.59L2.065,7.59z\"/></svg>",
        "warning": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"10\" cy=\"14\" r=\"1\"/><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10\" cy=\"10\" r=\"9\"/><path d=\"M10.97,7.72 C10.85,9.54 10.56,11.29 10.56,11.29 C10.51,11.87 10.27,12 9.99,12 C9.69,12 9.49,11.87 9.43,11.29 C9.43,11.29 9.16,9.54 9.03,7.72 C8.96,6.54 9.03,6 9.03,6 C9.03,5.45 9.46,5.02 9.99,5 C10.53,5.01 10.97,5.44 10.97,6 C10.97,6 11.04,6.54 10.97,7.72 L10.97,7.72 Z\"/></svg>",
        "whatsapp": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16.7,3.3c-1.8-1.8-4.1-2.8-6.7-2.8c-5.2,0-9.4,4.2-9.4,9.4c0,1.7,0.4,3.3,1.3,4.7l-1.3,4.9l5-1.3c1.4,0.8,2.9,1.2,4.5,1.2 l0,0l0,0c5.2,0,9.4-4.2,9.4-9.4C19.5,7.4,18.5,5,16.7,3.3 M10.1,17.7L10.1,17.7c-1.4,0-2.8-0.4-4-1.1l-0.3-0.2l-3,0.8l0.8-2.9 l-0.2-0.3c-0.8-1.2-1.2-2.7-1.2-4.2c0-4.3,3.5-7.8,7.8-7.8c2.1,0,4.1,0.8,5.5,2.3c1.5,1.5,2.3,3.4,2.3,5.5 C17.9,14.2,14.4,17.7,10.1,17.7 M14.4,11.9c-0.2-0.1-1.4-0.7-1.6-0.8c-0.2-0.1-0.4-0.1-0.5,0.1c-0.2,0.2-0.6,0.8-0.8,0.9 c-0.1,0.2-0.3,0.2-0.5,0.1c-0.2-0.1-1-0.4-1.9-1.2c-0.7-0.6-1.2-1.4-1.3-1.6c-0.1-0.2,0-0.4,0.1-0.5C8,8.8,8.1,8.7,8.2,8.5 c0.1-0.1,0.2-0.2,0.2-0.4c0.1-0.2,0-0.3,0-0.4C8.4,7.6,7.9,6.5,7.7,6C7.5,5.5,7.3,5.6,7.2,5.6c-0.1,0-0.3,0-0.4,0 c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.8,0.8-0.8,2c0,1.2,0.8,2.3,1,2.4c0.1,0.2,1.7,2.5,4,3.5c0.6,0.2,1,0.4,1.3,0.5 c0.6,0.2,1.1,0.2,1.5,0.1c0.5-0.1,1.4-0.6,1.6-1.1c0.2-0.5,0.2-1,0.1-1.1C14.8,12.1,14.6,12,14.4,11.9\"/></svg>",
        "wordpress": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10,0.5c-5.2,0-9.5,4.3-9.5,9.5s4.3,9.5,9.5,9.5c5.2,0,9.5-4.3,9.5-9.5S15.2,0.5,10,0.5L10,0.5L10,0.5z M15.6,3.9h-0.1 c-0.8,0-1.4,0.7-1.4,1.5c0,0.7,0.4,1.3,0.8,1.9c0.3,0.6,0.7,1.3,0.7,2.3c0,0.7-0.3,1.5-0.6,2.7L14.1,15l-3-8.9 c0.5,0,0.9-0.1,0.9-0.1C12.5,6,12.5,5.3,12,5.4c0,0-1.3,0.1-2.2,0.1C9,5.5,7.7,5.4,7.7,5.4C7.2,5.3,7.2,6,7.6,6c0,0,0.4,0.1,0.9,0.1 l1.3,3.5L8,15L5,6.1C5.5,6.1,5.9,6,5.9,6C6.4,6,6.3,5.3,5.9,5.4c0,0-1.3,0.1-2.2,0.1c-0.2,0-0.3,0-0.5,0c1.5-2.2,4-3.7,6.9-3.7 C12.2,1.7,14.1,2.6,15.6,3.9L15.6,3.9L15.6,3.9z M2.5,6.6l3.9,10.8c-2.7-1.3-4.6-4.2-4.6-7.4C1.8,8.8,2,7.6,2.5,6.6L2.5,6.6L2.5,6.6 z M10.2,10.7l2.5,6.9c0,0,0,0.1,0.1,0.1C11.9,18,11,18.2,10,18.2c-0.8,0-1.6-0.1-2.3-0.3L10.2,10.7L10.2,10.7L10.2,10.7z M14.2,17.1 l2.5-7.3c0.5-1.2,0.6-2.1,0.6-2.9c0-0.3,0-0.6-0.1-0.8c0.6,1.2,1,2.5,1,4C18.3,13,16.6,15.7,14.2,17.1L14.2,17.1L14.2,17.1z\"/></svg>",
        "world": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"none\" stroke=\"#000\" d=\"M1,10.5 L19,10.5\"/><path fill=\"none\" stroke=\"#000\" d=\"M2.35,15.5 L17.65,15.5\"/><path fill=\"none\" stroke=\"#000\" d=\"M2.35,5.5 L17.523,5.5\"/><path fill=\"none\" stroke=\"#000\" d=\"M10,19.46 L9.98,19.46 C7.31,17.33 5.61,14.141 5.61,10.58 C5.61,7.02 7.33,3.83 10,1.7 C10.01,1.7 9.99,1.7 10,1.7 L10,1.7 C12.67,3.83 14.4,7.02 14.4,10.58 C14.4,14.141 12.67,17.33 10,19.46 L10,19.46 L10,19.46 L10,19.46 Z\"/><circle fill=\"none\" stroke=\"#000\" cx=\"10\" cy=\"10.5\" r=\"9\"/></svg>",
        "xing": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M4.4,4.56 C4.24,4.56 4.11,4.61 4.05,4.72 C3.98,4.83 3.99,4.97 4.07,5.12 L5.82,8.16 L5.82,8.17 L3.06,13.04 C2.99,13.18 2.99,13.33 3.06,13.44 C3.12,13.55 3.24,13.62 3.4,13.62 L6,13.62 C6.39,13.62 6.57,13.36 6.71,13.12 C6.71,13.12 9.41,8.35 9.51,8.16 C9.49,8.14 7.72,5.04 7.72,5.04 C7.58,4.81 7.39,4.56 6.99,4.56 L4.4,4.56 L4.4,4.56 Z\"/><path d=\"M15.3,1 C14.91,1 14.74,1.25 14.6,1.5 C14.6,1.5 9.01,11.42 8.82,11.74 C8.83,11.76 12.51,18.51 12.51,18.51 C12.64,18.74 12.84,19 13.23,19 L15.82,19 C15.98,19 16.1,18.94 16.16,18.83 C16.23,18.72 16.23,18.57 16.16,18.43 L12.5,11.74 L12.5,11.72 L18.25,1.56 C18.32,1.42 18.32,1.27 18.25,1.16 C18.21,1.06 18.08,1 17.93,1 L15.3,1 L15.3,1 Z\"/></svg>",
        "yelp": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M17.175,14.971c-0.112,0.77-1.686,2.767-2.406,3.054c-0.246,0.1-0.487,0.076-0.675-0.069\tc-0.122-0.096-2.446-3.859-2.446-3.859c-0.194-0.293-0.157-0.682,0.083-0.978c0.234-0.284,0.581-0.393,0.881-0.276\tc0.016,0.01,4.21,1.394,4.332,1.482c0.178,0.148,0.263,0.379,0.225,0.646L17.175,14.971L17.175,14.971z M11.464,10.789\tc-0.203-0.307-0.199-0.666,0.009-0.916c0,0,2.625-3.574,2.745-3.657c0.203-0.135,0.452-0.141,0.69-0.025\tc0.691,0.335,2.085,2.405,2.167,3.199v0.027c0.024,0.271-0.082,0.491-0.273,0.623c-0.132,0.083-4.43,1.155-4.43,1.155\tc-0.322,0.096-0.68-0.06-0.882-0.381L11.464,10.789z M9.475,9.563C9.32,9.609,8.848,9.757,8.269,8.817c0,0-3.916-6.16-4.007-6.351\tc-0.057-0.212,0.011-0.455,0.202-0.65C5.047,1.211,8.21,0.327,9.037,0.529c0.27,0.069,0.457,0.238,0.522,0.479\tc0.047,0.266,0.433,5.982,0.488,7.264C10.098,9.368,9.629,9.517,9.475,9.563z M9.927,19.066c-0.083,0.225-0.273,0.373-0.54,0.421\tc-0.762,0.13-3.15-0.751-3.647-1.342c-0.096-0.131-0.155-0.262-0.167-0.394c-0.011-0.095,0-0.189,0.036-0.272\tc0.061-0.155,2.917-3.538,2.917-3.538c0.214-0.272,0.595-0.355,0.952-0.213c0.345,0.13,0.56,0.428,0.536,0.749\tC10.014,14.479,9.977,18.923,9.927,19.066z M3.495,13.912c-0.235-0.009-0.444-0.148-0.568-0.382c-0.089-0.17-0.151-0.453-0.19-0.794\tC2.63,11.701,2.761,10.144,3.07,9.648c0.145-0.226,0.357-0.345,0.592-0.336c0.154,0,4.255,1.667,4.255,1.667\tc0.321,0.118,0.521,0.453,0.5,0.833c-0.023,0.37-0.236,0.655-0.551,0.738L3.495,13.912z\"/></svg>",
        "youtube": "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15,4.1c1,0.1,2.3,0,3,0.8c0.8,0.8,0.9,2.1,0.9,3.1C19,9.2,19,10.9,19,12c-0.1,1.1,0,2.4-0.5,3.4c-0.5,1.1-1.4,1.5-2.5,1.6 c-1.2,0.1-8.6,0.1-11,0c-1.1-0.1-2.4-0.1-3.2-1c-0.7-0.8-0.7-2-0.8-3C1,11.8,1,10.1,1,8.9c0-1.1,0-2.4,0.5-3.4C2,4.5,3,4.3,4.1,4.2 C5.3,4.1,12.6,4,15,4.1z M8,7.5v6l5.5-3L8,7.5z\"/></svg>"
    });

    }

    if (typeof window !== 'undefined' && window.UIkit) {
        window.UIkit.use(plugin);
    }

    return plugin;

}));
/*! UIkit 3.0.2 | http://www.getuikit.com | (c) 2014 - 2018 YOOtheme | MIT License */


!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define("uikiticons",i):(t=t||self).UIkitIcons=i()}(this,function(){"use strict";function i(t){i.installed||t.icon.add({"500px":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.624,11.866c-0.141,0.132,0.479,0.658,0.662,0.418c0.051-0.046,0.607-0.61,0.662-0.664c0,0,0.738,0.719,0.814,0.719 c0.1,0,0.207-0.055,0.322-0.17c0.27-0.269,0.135-0.416,0.066-0.495l-0.631-0.616l0.658-0.668c0.146-0.156,0.021-0.314-0.1-0.449 c-0.182-0.18-0.359-0.226-0.471-0.125l-0.656,0.654l-0.654-0.654c-0.033-0.034-0.08-0.045-0.124-0.045 c-0.079,0-0.191,0.068-0.307,0.181c-0.202,0.202-0.247,0.351-0.133,0.462l0.665,0.665L9.624,11.866z"/><path d="M11.066,2.884c-1.061,0-2.185,0.248-3.011,0.604c-0.087,0.034-0.141,0.106-0.15,0.205C7.893,3.784,7.919,3.909,7.982,4.066 c0.05,0.136,0.187,0.474,0.452,0.372c0.844-0.326,1.779-0.507,2.633-0.507c0.963,0,1.9,0.191,2.781,0.564 c0.695,0.292,1.357,0.719,2.078,1.34c0.051,0.044,0.105,0.068,0.164,0.068c0.143,0,0.273-0.137,0.389-0.271 c0.191-0.214,0.324-0.395,0.135-0.575c-0.686-0.654-1.436-1.138-2.363-1.533C13.24,3.097,12.168,2.884,11.066,2.884z"/><path d="M16.43,15.747c-0.092-0.028-0.242,0.05-0.309,0.119l0,0c-0.652,0.652-1.42,1.169-2.268,1.521 c-0.877,0.371-1.814,0.551-2.779,0.551c-0.961,0-1.896-0.189-2.775-0.564c-0.848-0.36-1.612-0.879-2.268-1.53 c-0.682-0.688-1.196-1.455-1.529-2.268c-0.325-0.799-0.471-1.643-0.471-1.643c-0.045-0.24-0.258-0.249-0.567-0.203 c-0.128,0.021-0.519,0.079-0.483,0.36v0.01c0.105,0.644,0.289,1.284,0.545,1.895c0.417,0.969,1.002,1.849,1.756,2.604 c0.757,0.754,1.636,1.34,2.604,1.757C8.901,18.785,9.97,19,11.088,19c1.104,0,2.186-0.215,3.188-0.645 c1.838-0.896,2.604-1.757,2.604-1.757c0.182-0.204,0.227-0.317-0.1-0.643C16.779,15.956,16.525,15.774,16.43,15.747z"/><path d="M5.633,13.287c0.293,0.71,0.723,1.341,1.262,1.882c0.54,0.54,1.172,0.971,1.882,1.264c0.731,0.303,1.509,0.461,2.298,0.461 c0.801,0,1.578-0.158,2.297-0.461c0.711-0.293,1.344-0.724,1.883-1.264c0.543-0.541,0.971-1.172,1.264-1.882 c0.314-0.721,0.463-1.5,0.463-2.298c0-0.79-0.148-1.569-0.463-2.289c-0.293-0.699-0.721-1.329-1.264-1.881 c-0.539-0.541-1.172-0.959-1.867-1.263c-0.721-0.303-1.5-0.461-2.299-0.461c-0.802,0-1.613,0.159-2.322,0.461 c-0.577,0.25-1.544,0.867-2.119,1.454v0.012V2.108h8.16C15.1,2.104,15.1,1.69,15.1,1.552C15.1,1.417,15.1,1,14.809,1H5.915 C5.676,1,5.527,1.192,5.527,1.384v6.84c0,0.214,0.273,0.372,0.529,0.428c0.5,0.105,0.614-0.056,0.737-0.224l0,0 c0.18-0.273,0.776-0.884,0.787-0.894c0.901-0.905,2.117-1.408,3.416-1.408c1.285,0,2.5,0.501,3.412,1.408 c0.914,0.914,1.408,2.122,1.408,3.405c0,1.288-0.508,2.496-1.408,3.405c-0.9,0.896-2.152,1.406-3.438,1.406 c-0.877,0-1.711-0.229-2.433-0.671v-4.158c0-0.553,0.237-1.151,0.643-1.614c0.462-0.519,1.094-0.799,1.782-0.799 c0.664,0,1.293,0.253,1.758,0.715c0.459,0.459,0.709,1.071,0.709,1.723c0,1.385-1.094,2.468-2.488,2.468 c-0.273,0-0.769-0.121-0.781-0.125c-0.281-0.087-0.405,0.306-0.438,0.436c-0.159,0.496,0.079,0.585,0.123,0.607 c0.452,0.137,0.743,0.157,1.129,0.157c1.973,0,3.572-1.6,3.572-3.57c0-1.964-1.6-3.552-3.572-3.552c-0.97,0-1.872,0.36-2.546,1.038 c-0.656,0.631-1.027,1.487-1.027,2.322v3.438v-0.011c-0.372-0.42-0.732-1.041-0.981-1.682c-0.102-0.248-0.315-0.202-0.607-0.113 c-0.135,0.035-0.519,0.157-0.44,0.439C5.372,12.799,5.577,13.164,5.633,13.287z"/></svg>',album:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="2" width="10" height="1"/><rect x="3" y="4" width="14" height="1"/><rect fill="none" stroke="#000" x="1.5" y="6.5" width="17" height="11"/></svg>',"arrow-down":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="10.5,16.08 5.63,10.66 6.37,10 10.5,14.58 14.63,10 15.37,10.66"/><line fill="none" stroke="#000" x1="10.5" y1="4" x2="10.5" y2="15"/></svg>',"arrow-left":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" points="10 14 5 9.5 10 5"/><line fill="none" stroke="#000" x1="16" y1="9.5" x2="5" y2="9.52"/></svg>',"arrow-right":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" points="10 5 15 9.5 10 14"/><line fill="none" stroke="#000" x1="4" y1="9.5" x2="15" y2="9.5"/></svg>',"arrow-up":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="10.5,4 15.37,9.4 14.63,10.08 10.5,5.49 6.37,10.08 5.63,9.4"/><line fill="none" stroke="#000" x1="10.5" y1="16" x2="10.5" y2="5"/></svg>',ban:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="10" cy="10" r="9"/><line fill="none" stroke="#000" stroke-width="1.1" x1="4" y1="3.5" x2="16" y2="16.5"/></svg>',behance:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.5,10.6c-0.4-0.5-0.9-0.9-1.6-1.1c1.7-1,2.2-3.2,0.7-4.7C7.8,4,6.3,4,5.2,4C3.5,4,1.7,4,0,4v12c1.7,0,3.4,0,5.2,0 c1,0,2.1,0,3.1-0.5C10.2,14.6,10.5,12.3,9.5,10.6L9.5,10.6z M5.6,6.1c1.8,0,1.8,2.7-0.1,2.7c-1,0-2,0-2.9,0V6.1H5.6z M2.6,13.8v-3.1 c1.1,0,2.1,0,3.2,0c2.1,0,2.1,3.2,0.1,3.2L2.6,13.8z"/><path d="M19.9,10.9C19.7,9.2,18.7,7.6,17,7c-4.2-1.3-7.3,3.4-5.3,7.1c0.9,1.7,2.8,2.3,4.7,2.1c1.7-0.2,2.9-1.3,3.4-2.9h-2.2 c-0.4,1.3-2.4,1.5-3.5,0.6c-0.4-0.4-0.6-1.1-0.6-1.7H20C20,11.7,19.9,10.9,19.9,10.9z M13.5,10.6c0-1.6,2.3-2.7,3.5-1.4 c0.4,0.4,0.5,0.9,0.6,1.4H13.5L13.5,10.6z"/><rect x="13" y="4" width="5" height="1.4"/></svg>',bell:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.1" d="M17,15.5 L3,15.5 C2.99,14.61 3.79,13.34 4.1,12.51 C4.58,11.3 4.72,10.35 5.19,7.01 C5.54,4.53 5.89,3.2 7.28,2.16 C8.13,1.56 9.37,1.5 9.81,1.5 L9.96,1.5 C9.96,1.5 11.62,1.41 12.67,2.17 C14.08,3.2 14.42,4.54 14.77,7.02 C15.26,10.35 15.4,11.31 15.87,12.52 C16.2,13.34 17.01,14.61 17,15.5 L17,15.5 Z"/><path fill="none" stroke="#000" d="M12.39,16 C12.39,17.37 11.35,18.43 9.91,18.43 C8.48,18.43 7.42,17.37 7.42,16"/></svg>',bold:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5,15.3 C5.66,15.3 5.9,15 5.9,14.53 L5.9,5.5 C5.9,4.92 5.56,4.7 5,4.7 L5,4 L8.95,4 C12.6,4 13.7,5.37 13.7,6.9 C13.7,7.87 13.14,9.17 10.86,9.59 L10.86,9.7 C13.25,9.86 14.29,11.28 14.3,12.54 C14.3,14.47 12.94,16 9,16 L5,16 L5,15.3 Z M9,9.3 C11.19,9.3 11.8,8.5 11.85,7 C11.85,5.65 11.3,4.8 9,4.8 L7.67,4.8 L7.67,9.3 L9,9.3 Z M9.185,15.22 C11.97,15 12.39,14 12.4,12.58 C12.4,11.15 11.39,10 9,10 L7.67,10 L7.67,15 L9.18,15 Z"/></svg>',bolt:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.74,20 L7.73,12 L3,12 L15.43,1 L12.32,9 L17.02,9 L4.74,20 L4.74,20 L4.74,20 Z M9.18,11 L7.1,16.39 L14.47,10 L10.86,10 L12.99,4.67 L5.61,11 L9.18,11 L9.18,11 L9.18,11 Z"/></svg>',bookmark:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" points="5.5 1.5 15.5 1.5 15.5 17.5 10.5 12.5 5.5 17.5"/></svg>',calendar:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M 2,3 2,17 18,17 18,3 2,3 Z M 17,16 3,16 3,8 17,8 17,16 Z M 17,7 3,7 3,4 17,4 17,7 Z"/><rect width="1" height="3" x="6" y="2"/><rect width="1" height="3" x="13" y="2"/></svg>',camera:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="10" cy="10.8" r="3.8"/><path fill="none" stroke="#000" d="M1,4.5 C0.7,4.5 0.5,4.7 0.5,5 L0.5,17 C0.5,17.3 0.7,17.5 1,17.5 L19,17.5 C19.3,17.5 19.5,17.3 19.5,17 L19.5,5 C19.5,4.7 19.3,4.5 19,4.5 L13.5,4.5 L13.5,2.9 C13.5,2.6 13.3,2.5 13,2.5 L7,2.5 C6.7,2.5 6.5,2.6 6.5,2.9 L6.5,4.5 L1,4.5 L1,4.5 Z"/></svg>',cart:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="7.3" cy="17.3" r="1.4"/><circle cx="13.3" cy="17.3" r="1.4"/><polyline fill="none" stroke="#000" points="0 2 3.2 4 5.3 12.5 16 12.5 18 6.5 8 6.5"/></svg>',check:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.1" points="4,10 8,15 17,4"/></svg>',"chevron-double-left":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.03" points="10 14 6 10 10 6"/><polyline fill="none" stroke="#000" stroke-width="1.03" points="14 14 10 10 14 6"/></svg>',"chevron-double-right":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.03" points="10 6 14 10 10 14"/><polyline fill="none" stroke="#000" stroke-width="1.03" points="6 6 10 10 6 14"/></svg>',"chevron-down":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.03" points="16 7 10 13 4 7"/></svg>',"chevron-left":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.03" points="13 16 7 10 13 4"/></svg>',"chevron-right":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.03" points="7 4 13 10 7 16"/></svg>',"chevron-up":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.03" points="4 13 10 7 16 13"/></svg>',clock:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="10" cy="10" r="9"/><rect x="9" y="4" width="1" height="7"/><path fill="none" stroke="#000" stroke-width="1.1" d="M13.018,14.197 L9.445,10.625"/></svg>',close:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.06" d="M16,16 L4,4"/><path fill="none" stroke="#000" stroke-width="1.06" d="M16,4 L4,16"/></svg>',"cloud-download":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.1" d="M6.5,14.61 L3.75,14.61 C1.96,14.61 0.5,13.17 0.5,11.39 C0.5,9.76 1.72,8.41 3.3,8.2 C3.38,5.31 5.75,3 8.68,3 C11.19,3 13.31,4.71 13.89,7.02 C14.39,6.8 14.93,6.68 15.5,6.68 C17.71,6.68 19.5,8.45 19.5,10.64 C19.5,12.83 17.71,14.6 15.5,14.6 L12.5,14.6"/><polyline fill="none" stroke="#000" points="11.75 16 9.5 18.25 7.25 16"/><path fill="none" stroke="#000" d="M9.5,18 L9.5,9.5"/></svg>',"cloud-upload":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.1" d="M6.5,14.61 L3.75,14.61 C1.96,14.61 0.5,13.17 0.5,11.39 C0.5,9.76 1.72,8.41 3.31,8.2 C3.38,5.31 5.75,3 8.68,3 C11.19,3 13.31,4.71 13.89,7.02 C14.39,6.8 14.93,6.68 15.5,6.68 C17.71,6.68 19.5,8.45 19.5,10.64 C19.5,12.83 17.71,14.6 15.5,14.6 L12.5,14.6"/><polyline fill="none" stroke="#000" points="7.25 11.75 9.5 9.5 11.75 11.75"/><path fill="none" stroke="#000" d="M9.5,18 L9.5,9.5"/></svg>',code:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.01" points="13,4 19,10 13,16"/><polyline fill="none" stroke="#000" stroke-width="1.01" points="7,4 1,10 7,16"/></svg>',cog:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" cx="9.997" cy="10" r="3.31"/><path fill="none" stroke="#000" d="M18.488,12.285 L16.205,16.237 C15.322,15.496 14.185,15.281 13.303,15.791 C12.428,16.289 12.047,17.373 12.246,18.5 L7.735,18.5 C7.938,17.374 7.553,16.299 6.684,15.791 C5.801,15.27 4.655,15.492 3.773,16.237 L1.5,12.285 C2.573,11.871 3.317,10.999 3.317,9.991 C3.305,8.98 2.573,8.121 1.5,7.716 L3.765,3.784 C4.645,4.516 5.794,4.738 6.687,4.232 C7.555,3.722 7.939,2.637 7.735,1.5 L12.263,1.5 C12.072,2.637 12.441,3.71 13.314,4.22 C14.206,4.73 15.343,4.516 16.225,3.794 L18.487,7.714 C17.404,8.117 16.661,8.988 16.67,10.009 C16.672,11.018 17.415,11.88 18.488,12.285 L18.488,12.285 Z"/></svg>',comment:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6,18.71 L6,14 L1,14 L1,1 L19,1 L19,14 L10.71,14 L6,18.71 L6,18.71 Z M2,13 L7,13 L7,16.29 L10.29,13 L18,13 L18,2 L2,2 L2,13 L2,13 Z"/></svg>',commenting:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" points="1.5,1.5 18.5,1.5 18.5,13.5 10.5,13.5 6.5,17.5 6.5,13.5 1.5,13.5"/><circle cx="10" cy="8" r="1"/><circle cx="6" cy="8" r="1"/><circle cx="14" cy="8" r="1"/></svg>',comments:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" points="2 0.5 19.5 0.5 19.5 13"/><path d="M5,19.71 L5,15 L0,15 L0,2 L18,2 L18,15 L9.71,15 L5,19.71 L5,19.71 L5,19.71 Z M1,14 L6,14 L6,17.29 L9.29,14 L17,14 L17,3 L1,3 L1,14 L1,14 L1,14 Z"/></svg>',copy:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect fill="none" stroke="#000" x="3.5" y="2.5" width="12" height="16"/><polyline fill="none" stroke="#000" points="5 0.5 17.5 0.5 17.5 17"/></svg>',"credit-card":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect fill="none" stroke="#000" x="1.5" y="4.5" width="17" height="12"/><rect x="1" y="7" width="18" height="3"/></svg>',database:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><ellipse fill="none" stroke="#000" cx="10" cy="4.64" rx="7.5" ry="3.14"/><path fill="none" stroke="#000" d="M17.5,8.11 C17.5,9.85 14.14,11.25 10,11.25 C5.86,11.25 2.5,9.84 2.5,8.11"/><path fill="none" stroke="#000" d="M17.5,11.25 C17.5,12.99 14.14,14.39 10,14.39 C5.86,14.39 2.5,12.98 2.5,11.25"/><path fill="none" stroke="#000" d="M17.49,4.64 L17.5,14.36 C17.5,16.1 14.14,17.5 10,17.5 C5.86,17.5 2.5,16.09 2.5,14.36 L2.5,4.64"/></svg>',desktop:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="15" width="1" height="2"/><rect x="11" y="15" width="1" height="2"/><rect x="5" y="16" width="10" height="1"/><rect fill="none" stroke="#000" x="1.5" y="3.5" width="17" height="11"/></svg>',download:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" points="14,10 9.5,14.5 5,10"/><rect x="3" y="17" width="13" height="1"/><line fill="none" stroke="#000" x1="9.5" y1="13.91" x2="9.5" y2="3"/></svg>',dribbble:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.4" d="M1.3,8.9c0,0,5,0.1,8.6-1c1.4-0.4,2.6-0.9,4-1.9 c1.4-1.1,2.5-2.5,2.5-2.5"/><path fill="none" stroke="#000" stroke-width="1.4" d="M3.9,16.6c0,0,1.7-2.8,3.5-4.2 c1.8-1.3,4-2,5.7-2.2C16,10,19,10.6,19,10.6"/><path fill="none" stroke="#000" stroke-width="1.4" d="M6.9,1.6c0,0,3.3,4.6,4.2,6.8 c0.4,0.9,1.3,3.1,1.9,5.2c0.6,2,0.9,4.4,0.9,4.4"/><circle fill="none" stroke="#000" stroke-width="1.4" cx="10" cy="10" r="9"/></svg>',expand:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="13 2 18 2 18 7 17 7 17 3 13 3"/><polygon points="2 13 3 13 3 17 7 17 7 18 2 18"/><path fill="none" stroke="#000" stroke-width="1.1" d="M11,9 L17,3"/><path fill="none" stroke="#000" stroke-width="1.1" d="M3,17 L9,11"/></svg>',facebook:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M11,10h2.6l0.4-3H11V5.3c0-0.9,0.2-1.5,1.5-1.5H14V1.1c-0.3,0-1-0.1-2.1-0.1C9.6,1,8,2.4,8,5v2H5.5v3H8v8h3V10z"/></svg>',"file-edit":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" d="M18.65,1.68 C18.41,1.45 18.109,1.33 17.81,1.33 C17.499,1.33 17.209,1.45 16.98,1.68 L8.92,9.76 L8,12.33 L10.55,11.41 L18.651,3.34 C19.12,2.87 19.12,2.15 18.65,1.68 L18.65,1.68 L18.65,1.68 Z"/><polyline fill="none" stroke="#000" points="16.5 8.482 16.5 18.5 3.5 18.5 3.5 1.5 14.211 1.5"/></svg>',"file-pdf":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect fill="none" stroke="#000" width="13" height="17" x="3.5" y="1.5"/><path d="M14.65 11.67c-.48.3-1.37-.19-1.79-.37a4.65 4.65 0 0 1 1.49.06c.35.1.36.28.3.31zm-6.3.06l.43-.79a14.7 14.7 0 0 0 .75-1.64 5.48 5.48 0 0 0 1.25 1.55l.2.15a16.36 16.36 0 0 0-2.63.73zM9.5 5.32c.2 0 .32.5.32.97a1.99 1.99 0 0 1-.23 1.04 5.05 5.05 0 0 1-.17-1.3s0-.71.08-.71zm-3.9 9a4.35 4.35 0 0 1 1.21-1.46l.24-.22a4.35 4.35 0 0 1-1.46 1.68zm9.23-3.3a2.05 2.05 0 0 0-1.32-.3 11.07 11.07 0 0 0-1.58.11 4.09 4.09 0 0 1-.74-.5 5.39 5.39 0 0 1-1.32-2.06 10.37 10.37 0 0 0 .28-2.62 1.83 1.83 0 0 0-.07-.25.57.57 0 0 0-.52-.4H9.4a.59.59 0 0 0-.6.38 6.95 6.95 0 0 0 .37 3.14c-.26.63-1 2.12-1 2.12-.3.58-.57 1.08-.82 1.5l-.8.44A3.11 3.11 0 0 0 5 14.16a.39.39 0 0 0 .15.42l.24.13c1.15.56 2.28-1.74 2.66-2.42a23.1 23.1 0 0 1 3.59-.85 4.56 4.56 0 0 0 2.91.8.5.5 0 0 0 .3-.21 1.1 1.1 0 0 0 .12-.75.84.84 0 0 0-.14-.25z"/></svg>',"file-text":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect fill="none" stroke="#000" width="13" height="17" x="3.5" y="1.5"/><line fill="none" stroke="#000" x1="6" x2="12" y1="12.5" y2="12.5"/><line fill="none" stroke="#000" x1="6" x2="14" y1="8.5" y2="8.5"/><line fill="none" stroke="#000" x1="6" x2="14" y1="6.5" y2="6.5"/><line fill="none" stroke="#000" x1="6" x2="14" y1="10.5" y2="10.5"/></svg>',file:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect fill="none" stroke="#000" x="3.5" y="1.5" width="13" height="17"/></svg>',flickr:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="5.5" cy="9.5" r="3.5"/><circle cx="14.5" cy="9.5" r="3.5"/></svg>',folder:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" points="9.5 5.5 8.5 3.5 1.5 3.5 1.5 16.5 18.5 16.5 18.5 5.5"/></svg>',forward:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.47,13.11 C4.02,10.02 6.27,7.85 9.04,6.61 C9.48,6.41 10.27,6.13 11,5.91 L11,2 L18.89,9 L11,16 L11,12.13 C9.25,12.47 7.58,13.19 6.02,14.25 C3.03,16.28 1.63,18.54 1.63,18.54 C1.63,18.54 1.38,15.28 2.47,13.11 L2.47,13.11 Z M5.3,13.53 C6.92,12.4 9.04,11.4 12,10.92 L12,13.63 L17.36,9 L12,4.25 L12,6.8 C11.71,6.86 10.86,7.02 9.67,7.49 C6.79,8.65 4.58,10.96 3.49,13.08 C3.18,13.7 2.68,14.87 2.49,16 C3.28,15.05 4.4,14.15 5.3,13.53 L5.3,13.53 Z"/></svg>',foursquare:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.23,2 C15.96,2 16.4,2.41 16.5,2.86 C16.57,3.15 16.56,3.44 16.51,3.73 C16.46,4.04 14.86,11.72 14.75,12.03 C14.56,12.56 14.16,12.82 13.61,12.83 C13.03,12.84 11.09,12.51 10.69,13 C10.38,13.38 7.79,16.39 6.81,17.53 C6.61,17.76 6.4,17.96 6.08,17.99 C5.68,18.04 5.29,17.87 5.17,17.45 C5.12,17.28 5.1,17.09 5.1,16.91 C5.1,12.4 4.86,7.81 5.11,3.31 C5.17,2.5 5.81,2.12 6.53,2 L15.23,2 L15.23,2 Z M9.76,11.42 C9.94,11.19 10.17,11.1 10.45,11.1 L12.86,11.1 C13.12,11.1 13.31,10.94 13.36,10.69 C13.37,10.64 13.62,9.41 13.74,8.83 C13.81,8.52 13.53,8.28 13.27,8.28 C12.35,8.29 11.42,8.28 10.5,8.28 C9.84,8.28 9.83,7.69 9.82,7.21 C9.8,6.85 10.13,6.55 10.5,6.55 C11.59,6.56 12.67,6.55 13.76,6.55 C14.03,6.55 14.23,6.4 14.28,6.14 C14.34,5.87 14.67,4.29 14.67,4.29 C14.67,4.29 14.82,3.74 14.19,3.74 L7.34,3.74 C7,3.75 6.84,4.02 6.84,4.33 C6.84,7.58 6.85,14.95 6.85,14.99 C6.87,15 8.89,12.51 9.76,11.42 L9.76,11.42 Z"/></svg>',future:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline points="19 2 18 2 18 6 14 6 14 7 19 7 19 2"/><path fill="none" stroke="#000" stroke-width="1.1" d="M18,6.548 C16.709,3.29 13.354,1 9.6,1 C4.6,1 0.6,5 0.6,10 C0.6,15 4.6,19 9.6,19 C14.6,19 18.6,15 18.6,10"/><rect x="9" y="4" width="1" height="7"/><path d="M13.018,14.197 L9.445,10.625" fill="none" stroke="#000" stroke-width="1.1"/></svg>',"git-branch":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.2" cx="7" cy="3" r="2"/><circle fill="none" stroke="#000" stroke-width="1.2" cx="14" cy="6" r="2"/><circle fill="none" stroke="#000" stroke-width="1.2" cx="7" cy="17" r="2"/><path fill="none" stroke="#000" stroke-width="2" d="M14,8 C14,10.41 12.43,10.87 10.56,11.25 C9.09,11.54 7,12.06 7,15 L7,5"/></svg>',"git-fork":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.2" cx="5.79" cy="2.79" r="1.79"/><circle fill="none" stroke="#000" stroke-width="1.2" cx="14.19" cy="2.79" r="1.79"/><ellipse fill="none" stroke="#000" stroke-width="1.2" cx="10.03" cy="16.79" rx="1.79" ry="1.79"/><path fill="none" stroke="#000" stroke-width="2" d="M5.79,4.57 L5.79,6.56 C5.79,9.19 10.03,10.22 10.03,13.31 C10.03,14.86 10.04,14.55 10.04,14.55 C10.04,14.37 10.04,14.86 10.04,13.31 C10.04,10.22 14.2,9.19 14.2,6.56 L14.2,4.57"/></svg>',"github-alt":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10,0.5 C4.75,0.5 0.5,4.76 0.5,10.01 C0.5,15.26 4.75,19.51 10,19.51 C15.24,19.51 19.5,15.26 19.5,10.01 C19.5,4.76 15.25,0.5 10,0.5 L10,0.5 Z M12.81,17.69 C12.81,17.69 12.81,17.7 12.79,17.69 C12.47,17.75 12.35,17.59 12.35,17.36 L12.35,16.17 C12.35,15.45 12.09,14.92 11.58,14.56 C12.2,14.51 12.77,14.39 13.26,14.21 C13.87,13.98 14.36,13.69 14.74,13.29 C15.42,12.59 15.76,11.55 15.76,10.17 C15.76,9.25 15.45,8.46 14.83,7.8 C15.1,7.08 15.07,6.29 14.75,5.44 L14.51,5.42 C14.34,5.4 14.06,5.46 13.67,5.61 C13.25,5.78 12.79,6.03 12.31,6.35 C11.55,6.16 10.81,6.05 10.09,6.05 C9.36,6.05 8.61,6.15 7.88,6.35 C7.28,5.96 6.75,5.68 6.26,5.54 C6.07,5.47 5.9,5.44 5.78,5.44 L5.42,5.44 C5.06,6.29 5.04,7.08 5.32,7.8 C4.7,8.46 4.4,9.25 4.4,10.17 C4.4,11.94 4.96,13.16 6.08,13.84 C6.53,14.13 7.05,14.32 7.69,14.43 C8.03,14.5 8.32,14.54 8.55,14.55 C8.07,14.89 7.82,15.42 7.82,16.16 L7.82,17.51 C7.8,17.69 7.7,17.8 7.51,17.8 C4.21,16.74 1.82,13.65 1.82,10.01 C1.82,5.5 5.49,1.83 10,1.83 C14.5,1.83 18.17,5.5 18.17,10.01 C18.18,13.53 15.94,16.54 12.81,17.69 L12.81,17.69 Z"/></svg>',github:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10,1 C5.03,1 1,5.03 1,10 C1,13.98 3.58,17.35 7.16,18.54 C7.61,18.62 7.77,18.34 7.77,18.11 C7.77,17.9 7.76,17.33 7.76,16.58 C5.26,17.12 4.73,15.37 4.73,15.37 C4.32,14.33 3.73,14.05 3.73,14.05 C2.91,13.5 3.79,13.5 3.79,13.5 C4.69,13.56 5.17,14.43 5.17,14.43 C5.97,15.8 7.28,15.41 7.79,15.18 C7.87,14.6 8.1,14.2 8.36,13.98 C6.36,13.75 4.26,12.98 4.26,9.53 C4.26,8.55 4.61,7.74 5.19,7.11 C5.1,6.88 4.79,5.97 5.28,4.73 C5.28,4.73 6.04,4.49 7.75,5.65 C8.47,5.45 9.24,5.35 10,5.35 C10.76,5.35 11.53,5.45 12.25,5.65 C13.97,4.48 14.72,4.73 14.72,4.73 C15.21,5.97 14.9,6.88 14.81,7.11 C15.39,7.74 15.73,8.54 15.73,9.53 C15.73,12.99 13.63,13.75 11.62,13.97 C11.94,14.25 12.23,14.8 12.23,15.64 C12.23,16.84 12.22,17.81 12.22,18.11 C12.22,18.35 12.38,18.63 12.84,18.54 C16.42,17.35 19,13.98 19,10 C19,5.03 14.97,1 10,1 L10,1 Z"/></svg>',gitter:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="3.5" y="1" width="1.531" height="11.471"/><rect x="7.324" y="4.059" width="1.529" height="15.294"/><rect x="11.148" y="4.059" width="1.527" height="15.294"/><rect x="14.971" y="4.059" width="1.529" height="8.412"/></svg>',"google-plus":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.9,9c0,2.7-0.6,5-3.2,6.3c-3.7,1.8-8.1,0.2-9.4-3.6C-1.1,7.6,1.9,3.3,6.1,3c1.7-0.1,3.2,0.3,4.6,1.3 c0.1,0.1,0.3,0.2,0.4,0.4c-0.5,0.5-1.2,1-1.7,1.6c-1-0.8-2.1-1.1-3.5-0.9C5,5.6,4.2,6,3.6,6.7c-1.3,1.3-1.5,3.4-0.5,5 c1,1.7,2.6,2.3,4.6,1.9c1.4-0.3,2.4-1.2,2.6-2.6H6.9V9H12.9z"/><polygon points="20,9 20,11 18,11 18,13 16,13 16,11 14,11 14,9 16,9 16,7 18,7 18,9"/></svg>',google:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.86,9.09 C18.46,12.12 17.14,16.05 13.81,17.56 C9.45,19.53 4.13,17.68 2.47,12.87 C0.68,7.68 4.22,2.42 9.5,2.03 C11.57,1.88 13.42,2.37 15.05,3.65 C15.22,3.78 15.37,3.93 15.61,4.14 C14.9,4.81 14.23,5.45 13.5,6.14 C12.27,5.08 10.84,4.72 9.28,4.98 C8.12,5.17 7.16,5.76 6.37,6.63 C4.88,8.27 4.62,10.86 5.76,12.82 C6.95,14.87 9.17,15.8 11.57,15.25 C13.27,14.87 14.76,13.33 14.89,11.75 L10.51,11.75 L10.51,9.09 L17.86,9.09 L17.86,9.09 Z"/></svg>',grid:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="3" height="3"/><rect x="8" y="2" width="3" height="3"/><rect x="14" y="2" width="3" height="3"/><rect x="2" y="8" width="3" height="3"/><rect x="8" y="8" width="3" height="3"/><rect x="14" y="8" width="3" height="3"/><rect x="2" y="14" width="3" height="3"/><rect x="8" y="14" width="3" height="3"/><rect x="14" y="14" width="3" height="3"/></svg>',happy:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="7" r="1"/><circle cx="7" cy="7" r="1"/><circle fill="none" stroke="#000" cx="10" cy="10" r="8.5"/><path fill="none" stroke="#000" d="M14.6,11.4 C13.9,13.3 12.1,14.5 10,14.5 C7.9,14.5 6.1,13.3 5.4,11.4"/></svg>',hashtag:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.431,8 L15.661,7 L12.911,7 L13.831,3 L12.901,3 L11.98,7 L9.29,7 L10.21,3 L9.281,3 L8.361,7 L5.23,7 L5,8 L8.13,8 L7.21,12 L4.23,12 L4,13 L6.98,13 L6.061,17 L6.991,17 L7.911,13 L10.601,13 L9.681,17 L10.611,17 L11.531,13 L14.431,13 L14.661,12 L11.76,12 L12.681,8 L15.431,8 Z M10.831,12 L8.141,12 L9.061,8 L11.75,8 L10.831,12 Z"/></svg>',heart:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.03" d="M10,4 C10,4 8.1,2 5.74,2 C3.38,2 1,3.55 1,6.73 C1,8.84 2.67,10.44 2.67,10.44 L10,18 L17.33,10.44 C17.33,10.44 19,8.84 19,6.73 C19,3.55 16.62,2 14.26,2 C11.9,2 10,4 10,4 L10,4 Z"/></svg>',history:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="#000" points="1 2 2 2 2 6 6 6 6 7 1 7 1 2"/><path fill="none" stroke="#000" stroke-width="1.1" d="M2.1,6.548 C3.391,3.29 6.746,1 10.5,1 C15.5,1 19.5,5 19.5,10 C19.5,15 15.5,19 10.5,19 C5.5,19 1.5,15 1.5,10"/><rect x="9" y="4" width="1" height="7"/><path fill="none" stroke="#000" stroke-width="1.1" d="M13.018,14.197 L9.445,10.625"/></svg>',home:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="18.65 11.35 10 2.71 1.35 11.35 0.65 10.65 10 1.29 19.35 10.65"/><polygon points="15 4 18 4 18 7 17 7 17 5 15 5"/><polygon points="3 11 4 11 4 18 7 18 7 12 12 12 12 18 16 18 16 11 17 11 17 19 11 19 11 13 8 13 8 19 3 19"/></svg>',image:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="16.1" cy="6.1" r="1.1"/><rect fill="none" stroke="#000" x=".5" y="2.5" width="19" height="15"/><polyline fill="none" stroke="#000" stroke-width="1.01" points="4,13 8,9 13,14"/><polyline fill="none" stroke="#000" stroke-width="1.01" points="11,12 12.5,10.5 16,14"/></svg>',info:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.13,11.59 C11.97,12.84 10.35,14.12 9.1,14.16 C6.17,14.2 9.89,9.46 8.74,8.37 C9.3,8.16 10.62,7.83 10.62,8.81 C10.62,9.63 10.12,10.55 9.88,11.32 C8.66,15.16 12.13,11.15 12.14,11.18 C12.16,11.21 12.16,11.35 12.13,11.59 C12.08,11.95 12.16,11.35 12.13,11.59 L12.13,11.59 Z M11.56,5.67 C11.56,6.67 9.36,7.15 9.36,6.03 C9.36,5 11.56,4.54 11.56,5.67 L11.56,5.67 Z"/><circle fill="none" stroke="#000" stroke-width="1.1" cx="10" cy="10" r="9"/></svg>',instagram:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.55,1H6.46C3.45,1,1,3.44,1,6.44v7.12c0,3,2.45,5.44,5.46,5.44h7.08c3.02,0,5.46-2.44,5.46-5.44V6.44 C19.01,3.44,16.56,1,13.55,1z M17.5,14c0,1.93-1.57,3.5-3.5,3.5H6c-1.93,0-3.5-1.57-3.5-3.5V6c0-1.93,1.57-3.5,3.5-3.5h8 c1.93,0,3.5,1.57,3.5,3.5V14z"/><circle cx="14.87" cy="5.26" r="1.09"/><path d="M10.03,5.45c-2.55,0-4.63,2.06-4.63,4.6c0,2.55,2.07,4.61,4.63,4.61c2.56,0,4.63-2.061,4.63-4.61 C14.65,7.51,12.58,5.45,10.03,5.45L10.03,5.45L10.03,5.45z M10.08,13c-1.66,0-3-1.34-3-2.99c0-1.65,1.34-2.99,3-2.99s3,1.34,3,2.99 C13.08,11.66,11.74,13,10.08,13L10.08,13L10.08,13z"/></svg>',italic:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.63,5.48 L10.15,14.52 C10,15.08 10.37,15.25 11.92,15.3 L11.72,16 L6,16 L6.2,15.31 C7.78,15.26 8.19,15.09 8.34,14.53 L10.82,5.49 C10.97,4.92 10.63,4.76 9.09,4.71 L9.28,4 L15,4 L14.81,4.69 C13.23,4.75 12.78,4.91 12.63,5.48 L12.63,5.48 Z"/></svg>',joomla:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M7.8,13.4l1.7-1.7L5.9,8c-0.6-0.5-0.6-1.5,0-2c0.6-0.6,1.4-0.6,2,0l1.7-1.7c-1-1-2.3-1.3-3.6-1C5.8,2.2,4.8,1.4,3.7,1.4 c-1.3,0-2.3,1-2.3,2.3c0,1.1,0.8,2,1.8,2.3c-0.4,1.3-0.1,2.8,1,3.8L7.8,13.4L7.8,13.4z"/><path d="M10.2,4.3c1-1,2.5-1.4,3.8-1c0.2-1.1,1.1-2,2.3-2c1.3,0,2.3,1,2.3,2.3c0,1.2-0.9,2.2-2,2.3c0.4,1.3,0,2.8-1,3.8L13.9,8 c0.6-0.5,0.6-1.5,0-2c-0.5-0.6-1.5-0.6-2,0L8.2,9.7L6.5,8"/><path d="M14.1,16.8c-1.3,0.4-2.8,0.1-3.8-1l1.7-1.7c0.6,0.6,1.5,0.6,2,0c0.5-0.6,0.6-1.5,0-2l-3.7-3.7L12,6.7l3.7,3.7 c1,1,1.3,2.4,1,3.6c1.1,0.2,2,1.1,2,2.3c0,1.3-1,2.3-2.3,2.3C15.2,18.6,14.3,17.8,14.1,16.8"/><path d="M13.2,12.2l-3.7,3.7c-1,1-2.4,1.3-3.6,1c-0.2,1-1.2,1.8-2.2,1.8c-1.3,0-2.3-1-2.3-2.3c0-1.1,0.8-2,1.8-2.3 c-0.3-1.3,0-2.7,1-3.7l1.7,1.7c-0.6,0.6-0.6,1.5,0,2c0.6,0.6,1.4,0.6,2,0l3.7-3.7"/></svg>',laptop:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect y="16" width="20" height="1"/><rect fill="none" stroke="#000" x="2.5" y="4.5" width="15" height="10"/></svg>',lifesaver:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10,0.5 C4.76,0.5 0.5,4.76 0.5,10 C0.5,15.24 4.76,19.5 10,19.5 C15.24,19.5 19.5,15.24 19.5,10 C19.5,4.76 15.24,0.5 10,0.5 L10,0.5 Z M10,1.5 C11.49,1.5 12.89,1.88 14.11,2.56 L11.85,4.82 C11.27,4.61 10.65,4.5 10,4.5 C9.21,4.5 8.47,4.67 7.79,4.96 L5.58,2.75 C6.87,1.95 8.38,1.5 10,1.5 L10,1.5 Z M4.96,7.8 C4.67,8.48 4.5,9.21 4.5,10 C4.5,10.65 4.61,11.27 4.83,11.85 L2.56,14.11 C1.88,12.89 1.5,11.49 1.5,10 C1.5,8.38 1.95,6.87 2.75,5.58 L4.96,7.79 L4.96,7.8 L4.96,7.8 Z M10,18.5 C8.25,18.5 6.62,17.97 5.27,17.06 L7.46,14.87 C8.22,15.27 9.08,15.5 10,15.5 C10.79,15.5 11.53,15.33 12.21,15.04 L14.42,17.25 C13.13,18.05 11.62,18.5 10,18.5 L10,18.5 Z M10,14.5 C7.52,14.5 5.5,12.48 5.5,10 C5.5,7.52 7.52,5.5 10,5.5 C12.48,5.5 14.5,7.52 14.5,10 C14.5,12.48 12.48,14.5 10,14.5 L10,14.5 Z M15.04,12.21 C15.33,11.53 15.5,10.79 15.5,10 C15.5,9.08 15.27,8.22 14.87,7.46 L17.06,5.27 C17.97,6.62 18.5,8.25 18.5,10 C18.5,11.62 18.05,13.13 17.25,14.42 L15.04,12.21 L15.04,12.21 Z"/></svg>',link:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.1" d="M10.625,12.375 L7.525,15.475 C6.825,16.175 5.925,16.175 5.225,15.475 L4.525,14.775 C3.825,14.074 3.825,13.175 4.525,12.475 L7.625,9.375"/><path fill="none" stroke="#000" stroke-width="1.1" d="M9.325,7.375 L12.425,4.275 C13.125,3.575 14.025,3.575 14.724,4.275 L15.425,4.975 C16.125,5.675 16.125,6.575 15.425,7.275 L12.325,10.375"/><path fill="none" stroke="#000" stroke-width="1.1" d="M7.925,11.875 L11.925,7.975"/></svg>',linkedin:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5.77,17.89 L5.77,7.17 L2.21,7.17 L2.21,17.89 L5.77,17.89 L5.77,17.89 Z M3.99,5.71 C5.23,5.71 6.01,4.89 6.01,3.86 C5.99,2.8 5.24,2 4.02,2 C2.8,2 2,2.8 2,3.85 C2,4.88 2.77,5.7 3.97,5.7 L3.99,5.7 L3.99,5.71 L3.99,5.71 Z"/><path d="M7.75,17.89 L11.31,17.89 L11.31,11.9 C11.31,11.58 11.33,11.26 11.43,11.03 C11.69,10.39 12.27,9.73 13.26,9.73 C14.55,9.73 15.06,10.71 15.06,12.15 L15.06,17.89 L18.62,17.89 L18.62,11.74 C18.62,8.45 16.86,6.92 14.52,6.92 C12.6,6.92 11.75,7.99 11.28,8.73 L11.3,8.73 L11.3,7.17 L7.75,7.17 C7.79,8.17 7.75,17.89 7.75,17.89 L7.75,17.89 L7.75,17.89 Z"/></svg>',list:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="12" height="1"/><rect x="6" y="9" width="12" height="1"/><rect x="6" y="14" width="12" height="1"/><rect x="2" y="4" width="2" height="1"/><rect x="2" y="9" width="2" height="1"/><rect x="2" y="14" width="2" height="1"/></svg>',location:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.01" d="M10,0.5 C6.41,0.5 3.5,3.39 3.5,6.98 C3.5,11.83 10,19 10,19 C10,19 16.5,11.83 16.5,6.98 C16.5,3.39 13.59,0.5 10,0.5 L10,0.5 Z"/><circle fill="none" stroke="#000" cx="10" cy="6.8" r="2.3"/></svg>',lock:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect fill="none" stroke="#000" height="10" width="13" y="8.5" x="3.5"/><path fill="none" stroke="#000" d="M6.5,8 L6.5,4.88 C6.5,3.01 8.07,1.5 10,1.5 C11.93,1.5 13.5,3.01 13.5,4.88 L13.5,8"/></svg>',mail:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" points="1.4,6.5 10,11 18.6,6.5"/><path d="M 1,4 1,16 19,16 19,4 1,4 Z M 18,15 2,15 2,5 18,5 18,15 Z"/></svg>',menu:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="16" height="1"/><rect x="2" y="9" width="16" height="1"/><rect x="2" y="14" width="16" height="1"/></svg>',microphone:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" x1="10" x2="10" y1="16.44" y2="18.5"/><line fill="none" stroke="#000" x1="7" x2="13" y1="18.5" y2="18.5"/><path fill="none" stroke="#000" stroke-width="1.1" d="M13.5 4.89v5.87a3.5 3.5 0 0 1-7 0V4.89a3.5 3.5 0 0 1 7 0z"/><path fill="none" stroke="#000" stroke-width="1.1" d="M15.5 10.36V11a5.5 5.5 0 0 1-11 0v-.6"/></svg>',"minus-circle":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="9.5" cy="9.5" r="9"/><line fill="none" stroke="#000" x1="5" y1="9.5" x2="14" y2="9.5"/></svg>',minus:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect height="1" width="18" y="9" x="1"/></svg>',"more-vertical":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="3" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="10" cy="17" r="2"/></svg>',more:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="3" cy="10" r="2"/><circle cx="10" cy="10" r="2"/><circle cx="17" cy="10" r="2"/></svg>',move:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="4,5 1,5 1,9 2,9 2,6 4,6"/><polygon points="1,16 2,16 2,18 4,18 4,19 1,19"/><polygon points="14,16 14,19 11,19 11,18 13,18 13,16"/><rect fill="none" stroke="#000" x="5.5" y="1.5" width="13" height="13"/><rect x="1" y="11" width="1" height="3"/><rect x="6" y="18" width="3" height="1"/></svg>',nut:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" points="2.5,5.7 10,1.3 17.5,5.7 17.5,14.3 10,18.7 2.5,14.3"/><circle fill="none" stroke="#000" cx="10" cy="10" r="3.5"/></svg>',pagekit:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="3,1 17,1 17,16 10,16 10,13 14,13 14,4 6,4 6,16 10,16 10,19 3,19"/></svg>',"paint-bucket":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.21,1 L0,11.21 L8.1,19.31 L18.31,9.1 L10.21,1 L10.21,1 Z M16.89,9.1 L15,11 L1.7,11 L10.21,2.42 L16.89,9.1 Z"/><path fill="none" stroke="#000" stroke-width="1.1" d="M6.42,2.33 L11.7,7.61"/><path d="M18.49,12 C18.49,12 20,14.06 20,15.36 C20,16.28 19.24,17 18.49,17 L18.49,17 C17.74,17 17,16.28 17,15.36 C17,14.06 18.49,12 18.49,12 L18.49,12 Z"/></svg>',pencil:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" d="M17.25,6.01 L7.12,16.1 L3.82,17.2 L5.02,13.9 L15.12,3.88 C15.71,3.29 16.66,3.29 17.25,3.88 C17.83,4.47 17.83,5.42 17.25,6.01 L17.25,6.01 Z"/><path fill="none" stroke="#000" d="M15.98,7.268 L13.851,5.148"/></svg>',"phone-landscape":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" d="M17,5.5 C17.8,5.5 18.5,6.2 18.5,7 L18.5,14 C18.5,14.8 17.8,15.5 17,15.5 L3,15.5 C2.2,15.5 1.5,14.8 1.5,14 L1.5,7 C1.5,6.2 2.2,5.5 3,5.5 L17,5.5 L17,5.5 L17,5.5 Z"/><circle cx="3.8" cy="10.5" r=".8"/></svg>',phone:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" d="M15.5,17 C15.5,17.8 14.8,18.5 14,18.5 L7,18.5 C6.2,18.5 5.5,17.8 5.5,17 L5.5,3 C5.5,2.2 6.2,1.5 7,1.5 L14,1.5 C14.8,1.5 15.5,2.2 15.5,3 L15.5,17 L15.5,17 L15.5,17 Z"/><circle cx="10.5" cy="16.5" r=".8"/></svg>',pinterest:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.21,1 C5.5,1 3,4.16 3,7.61 C3,9.21 3.85,11.2 5.22,11.84 C5.43,11.94 5.54,11.89 5.58,11.69 C5.62,11.54 5.8,10.8 5.88,10.45 C5.91,10.34 5.89,10.24 5.8,10.14 C5.36,9.59 5,8.58 5,7.65 C5,5.24 6.82,2.91 9.93,2.91 C12.61,2.91 14.49,4.74 14.49,7.35 C14.49,10.3 13,12.35 11.06,12.35 C9.99,12.35 9.19,11.47 9.44,10.38 C9.75,9.08 10.35,7.68 10.35,6.75 C10.35,5.91 9.9,5.21 8.97,5.21 C7.87,5.21 6.99,6.34 6.99,7.86 C6.99,8.83 7.32,9.48 7.32,9.48 C7.32,9.48 6.24,14.06 6.04,14.91 C5.7,16.35 6.08,18.7 6.12,18.9 C6.14,19.01 6.26,19.05 6.33,18.95 C6.44,18.81 7.74,16.85 8.11,15.44 C8.24,14.93 8.79,12.84 8.79,12.84 C9.15,13.52 10.19,14.09 11.29,14.09 C14.58,14.09 16.96,11.06 16.96,7.3 C16.94,3.7 14,1 10.21,1"/></svg>',"play-circle":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" stroke-width="1.1" points="8.5 7 13.5 10 8.5 13"/><circle fill="none" stroke="#000" stroke-width="1.1" cx="10" cy="10" r="9"/></svg>',play:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" points="6.5,5 14.5,10 6.5,15"/></svg>',"plus-circle":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="9.5" cy="9.5" r="9"/><line fill="none" stroke="#000" x1="9.5" y1="5" x2="9.5" y2="14"/><line fill="none" stroke="#000" x1="5" y1="9.5" x2="14" y2="9.5"/></svg>',plus:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="1" width="1" height="17"/><rect x="1" y="9" width="17" height="1"/></svg>',print:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" points="4.5 13.5 1.5 13.5 1.5 6.5 18.5 6.5 18.5 13.5 15.5 13.5"/><polyline fill="none" stroke="#000" points="15.5 6.5 15.5 2.5 4.5 2.5 4.5 6.5"/><rect fill="none" stroke="#000" width="11" height="6" x="4.5" y="11.5"/><rect width="8" height="1" x="6" y="13"/><rect width="8" height="1" x="6" y="15"/></svg>',pull:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="6.85,8 9.5,10.6 12.15,8 12.85,8.7 9.5,12 6.15,8.7"/><line fill="none" stroke="#000" x1="9.5" y1="11" x2="9.5" y2="2"/><polyline fill="none" stroke="#000" points="6,5.5 3.5,5.5 3.5,18.5 15.5,18.5 15.5,5.5 13,5.5"/></svg>',push:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="12.15,4 9.5,1.4 6.85,4 6.15,3.3 9.5,0 12.85,3.3"/><line fill="none" stroke="#000" x1="9.5" y1="10" x2="9.5" y2="1"/><polyline fill="none" stroke="#000" points="6 5.5 3.5 5.5 3.5 18.5 15.5 18.5 15.5 5.5 13 5.5"/></svg>',question:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="10" cy="10" r="9"/><circle cx="10.44" cy="14.42" r="1.05"/><path fill="none" stroke="#000" stroke-width="1.2" d="M8.17,7.79 C8.17,4.75 12.72,4.73 12.72,7.72 C12.72,8.67 11.81,9.15 11.23,9.75 C10.75,10.24 10.51,10.73 10.45,11.4 C10.44,11.53 10.43,11.64 10.43,11.75"/></svg>',"quote-right":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.27,7.79 C17.27,9.45 16.97,10.43 15.99,12.02 C14.98,13.64 13,15.23 11.56,15.97 L11.1,15.08 C12.34,14.2 13.14,13.51 14.02,11.82 C14.27,11.34 14.41,10.92 14.49,10.54 C14.3,10.58 14.09,10.6 13.88,10.6 C12.06,10.6 10.59,9.12 10.59,7.3 C10.59,5.48 12.06,4 13.88,4 C15.39,4 16.67,5.02 17.05,6.42 C17.19,6.82 17.27,7.27 17.27,7.79 L17.27,7.79 Z"/><path d="M8.68,7.79 C8.68,9.45 8.38,10.43 7.4,12.02 C6.39,13.64 4.41,15.23 2.97,15.97 L2.51,15.08 C3.75,14.2 4.55,13.51 5.43,11.82 C5.68,11.34 5.82,10.92 5.9,10.54 C5.71,10.58 5.5,10.6 5.29,10.6 C3.47,10.6 2,9.12 2,7.3 C2,5.48 3.47,4 5.29,4 C6.8,4 8.08,5.02 8.46,6.42 C8.6,6.82 8.68,7.27 8.68,7.79 L8.68,7.79 Z"/></svg>',receiver:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.01" d="M6.189,13.611C8.134,15.525 11.097,18.239 13.867,18.257C16.47,18.275 18.2,16.241 18.2,16.241L14.509,12.551L11.539,13.639L6.189,8.29L7.313,5.355L3.76,1.8C3.76,1.8 1.732,3.537 1.7,6.092C1.667,8.809 4.347,11.738 6.189,13.611"/></svg>',reddit:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M19 9.05a2.56 2.56 0 0 0-2.56-2.56 2.59 2.59 0 0 0-1.88.82 10.63 10.63 0 0 0-4.14-1v-.08c.58-1.62 1.58-3.89 2.7-4.1.38-.08.77.12 1.19.57a1.15 1.15 0 0 0-.06.37 1.48 1.48 0 1 0 1.51-1.45 1.43 1.43 0 0 0-.76.19A2.29 2.29 0 0 0 12.91 1c-2.11.43-3.39 4.38-3.63 5.19 0 0 0 .11-.06.11a10.65 10.65 0 0 0-3.75 1A2.56 2.56 0 0 0 1 9.05a2.42 2.42 0 0 0 .72 1.76A5.18 5.18 0 0 0 1.24 13c0 3.66 3.92 6.64 8.73 6.64s8.74-3 8.74-6.64a5.23 5.23 0 0 0-.46-2.13A2.58 2.58 0 0 0 19 9.05zm-16.88 0a1.44 1.44 0 0 1 2.27-1.19 7.68 7.68 0 0 0-2.07 1.91 1.33 1.33 0 0 1-.2-.72zM10 18.4c-4.17 0-7.55-2.4-7.55-5.4S5.83 7.53 10 7.53 17.5 10 17.5 13s-3.38 5.4-7.5 5.4zm7.69-8.61a7.62 7.62 0 0 0-2.09-1.91 1.41 1.41 0 0 1 .84-.28 1.47 1.47 0 0 1 1.44 1.45 1.34 1.34 0 0 1-.21.72z"/><path d="M6.69 12.58a1.39 1.39 0 1 1 1.39-1.39 1.38 1.38 0 0 1-1.38 1.39z"/><path d="M14.26 11.2a1.39 1.39 0 1 1-1.39-1.39 1.39 1.39 0 0 1 1.39 1.39z"/><path d="M13.09 14.88a.54.54 0 0 1-.09.77 5.3 5.3 0 0 1-3.26 1.19 5.61 5.61 0 0 1-3.4-1.22.55.55 0 1 1 .73-.83 4.09 4.09 0 0 0 5.25 0 .56.56 0 0 1 .77.09z"/></svg>',refresh:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.1" d="M17.08,11.15 C17.09,11.31 17.1,11.47 17.1,11.64 C17.1,15.53 13.94,18.69 10.05,18.69 C6.16,18.68 3,15.53 3,11.63 C3,7.74 6.16,4.58 10.05,4.58 C10.9,4.58 11.71,4.73 12.46,5"/><polyline fill="none" stroke="#000" points="9.9 2 12.79 4.89 9.79 7.9"/></svg>',reply:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.7,13.11 C16.12,10.02 13.84,7.85 11.02,6.61 C10.57,6.41 9.75,6.13 9,5.91 L9,2 L1,9 L9,16 L9,12.13 C10.78,12.47 12.5,13.19 14.09,14.25 C17.13,16.28 18.56,18.54 18.56,18.54 C18.56,18.54 18.81,15.28 17.7,13.11 L17.7,13.11 Z M14.82,13.53 C13.17,12.4 11.01,11.4 8,10.92 L8,13.63 L2.55,9 L8,4.25 L8,6.8 C8.3,6.86 9.16,7.02 10.37,7.49 C13.3,8.65 15.54,10.96 16.65,13.08 C16.97,13.7 17.48,14.86 17.68,16 C16.87,15.05 15.73,14.15 14.82,13.53 L14.82,13.53 Z"/></svg>',rss:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="3.12" cy="16.8" r="1.85"/><path fill="none" stroke="#000" stroke-width="1.1" d="M1.5,8.2 C1.78,8.18 2.06,8.16 2.35,8.16 C7.57,8.16 11.81,12.37 11.81,17.57 C11.81,17.89 11.79,18.19 11.76,18.5"/><path fill="none" stroke="#000" stroke-width="1.1" d="M1.5,2.52 C1.78,2.51 2.06,2.5 2.35,2.5 C10.72,2.5 17.5,9.24 17.5,17.57 C17.5,17.89 17.49,18.19 17.47,18.5"/></svg>',search:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="9" cy="9" r="7"/><path fill="none" stroke="#000" stroke-width="1.1" d="M14,14 L18,18 L14,14 Z"/></svg>',server:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="1" height="2"/><rect x="5" y="3" width="1" height="2"/><rect x="7" y="3" width="1" height="2"/><rect x="16" y="3" width="1" height="1"/><rect x="16" y="10" width="1" height="1"/><circle fill="none" stroke="#000" cx="9.9" cy="17.4" r="1.4"/><rect x="3" y="10" width="1" height="2"/><rect x="5" y="10" width="1" height="2"/><rect x="9.5" y="14" width="1" height="2"/><rect x="3" y="17" width="6" height="1"/><rect x="11" y="17" width="6" height="1"/><rect fill="none" stroke="#000" x="1.5" y="1.5" width="17" height="5"/><rect fill="none" stroke="#000" x="1.5" y="8.5" width="17" height="5"/></svg>',settings:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><ellipse fill="none" stroke="#000" cx="6.11" cy="3.55" rx="2.11" ry="2.15"/><ellipse fill="none" stroke="#000" cx="6.11" cy="15.55" rx="2.11" ry="2.15"/><circle fill="none" stroke="#000" cx="13.15" cy="9.55" r="2.15"/><rect x="1" y="3" width="3" height="1"/><rect x="10" y="3" width="8" height="1"/><rect x="1" y="9" width="8" height="1"/><rect x="15" y="9" width="3" height="1"/><rect x="1" y="15" width="3" height="1"/><rect x="10" y="15" width="8" height="1"/></svg>',shrink:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="11 4 12 4 12 8 16 8 16 9 11 9"/><polygon points="4 11 9 11 9 16 8 16 8 12 4 12"/><path fill="none" stroke="#000" stroke-width="1.1" d="M12,8 L18,2"/><path fill="none" stroke="#000" stroke-width="1.1" d="M2,18 L8,12"/></svg>',"sign-in":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="7 2 17 2 17 17 7 17 7 16 16 16 16 3 7 3"/><polygon points="9.1 13.4 8.5 12.8 11.28 10 4 10 4 9 11.28 9 8.5 6.2 9.1 5.62 13 9.5"/></svg>',"sign-out":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="13.1 13.4 12.5 12.8 15.28 10 8 10 8 9 15.28 9 12.5 6.2 13.1 5.62 17 9.5"/><polygon points="13 2 3 2 3 17 13 17 13 16 4 16 4 3 13 3"/></svg>',social:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" stroke-width="1.1" x1="13.4" y1="14" x2="6.3" y2="10.7"/><line fill="none" stroke="#000" stroke-width="1.1" x1="13.5" y1="5.5" x2="6.5" y2="8.8"/><circle fill="none" stroke="#000" stroke-width="1.1" cx="15.5" cy="4.6" r="2.3"/><circle fill="none" stroke="#000" stroke-width="1.1" cx="15.5" cy="14.8" r="2.3"/><circle fill="none" stroke="#000" stroke-width="1.1" cx="4.5" cy="9.8" r="2.3"/></svg>',soundcloud:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.2,9.4c-0.4,0-0.8,0.1-1.101,0.2c-0.199-2.5-2.399-4.5-5-4.5c-0.6,0-1.2,0.1-1.7,0.3C9.2,5.5,9.1,5.6,9.1,5.6V15h8 c1.601,0,2.801-1.2,2.801-2.8C20,10.7,18.7,9.4,17.2,9.4L17.2,9.4z"/><rect x="6" y="6.5" width="1.5" height="8.5"/><rect x="3" y="8" width="1.5" height="7"/><rect y="10" width="1.5" height="5"/></svg>',star:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" stroke-width="1.01" points="10 2 12.63 7.27 18.5 8.12 14.25 12.22 15.25 18 10 15.27 4.75 18 5.75 12.22 1.5 8.12 7.37 7.27"/></svg>',strikethrough:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6,13.02 L6.65,13.02 C7.64,15.16 8.86,16.12 10.41,16.12 C12.22,16.12 12.92,14.93 12.92,13.89 C12.92,12.55 11.99,12.03 9.74,11.23 C8.05,10.64 6.23,10.11 6.23,7.83 C6.23,5.5 8.09,4.09 10.4,4.09 C11.44,4.09 12.13,4.31 12.72,4.54 L13.33,4 L13.81,4 L13.81,7.59 L13.16,7.59 C12.55,5.88 11.52,4.89 10.07,4.89 C8.84,4.89 7.89,5.69 7.89,7.03 C7.89,8.29 8.89,8.78 10.88,9.45 C12.57,10.03 14.38,10.6 14.38,12.91 C14.38,14.75 13.27,16.93 10.18,16.93 C9.18,16.93 8.17,16.69 7.46,16.39 L6.52,17 L6,17 L6,13.02 L6,13.02 Z"/><rect x="3" y="10" width="15" height="1"/></svg>',table:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="3" width="18" height="1"/><rect x="1" y="7" width="18" height="1"/><rect x="1" y="11" width="18" height="1"/><rect x="1" y="15" width="18" height="1"/></svg>',"tablet-landscape":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" d="M1.5,5 C1.5,4.2 2.2,3.5 3,3.5 L17,3.5 C17.8,3.5 18.5,4.2 18.5,5 L18.5,16 C18.5,16.8 17.8,17.5 17,17.5 L3,17.5 C2.2,17.5 1.5,16.8 1.5,16 L1.5,5 L1.5,5 L1.5,5 Z"/><circle cx="3.7" cy="10.5" r=".8"/></svg>',tablet:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" d="M5,18.5 C4.2,18.5 3.5,17.8 3.5,17 L3.5,3 C3.5,2.2 4.2,1.5 5,1.5 L16,1.5 C16.8,1.5 17.5,2.2 17.5,3 L17.5,17 C17.5,17.8 16.8,18.5 16,18.5 L5,18.5 L5,18.5 L5,18.5 Z"/><circle cx="10.5" cy="16.3" r=".8"/></svg>',tag:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" stroke-width="1.1" d="M17.5,3.71 L17.5,7.72 C17.5,7.96 17.4,8.2 17.21,8.39 L8.39,17.2 C7.99,17.6 7.33,17.6 6.93,17.2 L2.8,13.07 C2.4,12.67 2.4,12.01 2.8,11.61 L11.61,2.8 C11.81,2.6 12.08,2.5 12.34,2.5 L16.19,2.5 C16.52,2.5 16.86,2.63 17.11,2.88 C17.35,3.11 17.48,3.4 17.5,3.71 L17.5,3.71 Z"/><circle cx="14" cy="6" r="1"/></svg>',thumbnails:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect fill="none" stroke="#000" x="3.5" y="3.5" width="5" height="5"/><rect fill="none" stroke="#000" x="11.5" y="3.5" width="5" height="5"/><rect fill="none" stroke="#000" x="11.5" y="11.5" width="5" height="5"/><rect fill="none" stroke="#000" x="3.5" y="11.5" width="5" height="5"/></svg>',trash:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" points="6.5 3 6.5 1.5 13.5 1.5 13.5 3"/><polyline fill="none" stroke="#000" points="4.5 4 4.5 18.5 15.5 18.5 15.5 4"/><rect x="8" y="7" width="1" height="9"/><rect x="11" y="7" width="1" height="9"/><rect x="2" y="3" width="16" height="1"/></svg>',"triangle-down":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="5 7 15 7 10 12"/></svg>',"triangle-left":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="12 5 7 10 12 15"/></svg>',"triangle-right":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="8 5 13 10 8 15"/></svg>',"triangle-up":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="5 13 10 8 15 13"/></svg>',tripadvisor:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M19.021,7.866C19.256,6.862,20,5.854,20,5.854h-3.346C14.781,4.641,12.504,4,9.98,4C7.363,4,4.999,4.651,3.135,5.876H0\tc0,0,0.738,0.987,0.976,1.988c-0.611,0.837-0.973,1.852-0.973,2.964c0,2.763,2.249,5.009,5.011,5.009\tc1.576,0,2.976-0.737,3.901-1.879l1.063,1.599l1.075-1.615c0.475,0.611,1.1,1.111,1.838,1.451c1.213,0.547,2.574,0.612,3.825,0.15\tc2.589-0.963,3.913-3.852,2.964-6.439c-0.175-0.463-0.4-0.876-0.675-1.238H19.021z M16.38,14.594\tc-1.002,0.371-2.088,0.328-3.06-0.119c-0.688-0.317-1.252-0.817-1.657-1.438c-0.164-0.25-0.313-0.52-0.417-0.811\tc-0.124-0.328-0.186-0.668-0.217-1.014c-0.063-0.689,0.037-1.396,0.339-2.043c0.448-0.971,1.251-1.71,2.25-2.079\tc2.075-0.765,4.375,0.3,5.14,2.366c0.762,2.066-0.301,4.37-2.363,5.134L16.38,14.594L16.38,14.594z M8.322,13.066\tc-0.72,1.059-1.935,1.76-3.309,1.76c-2.207,0-4.001-1.797-4.001-3.996c0-2.203,1.795-4.002,4.001-4.002\tc2.204,0,3.999,1.8,3.999,4.002c0,0.137-0.024,0.261-0.04,0.396c-0.067,0.678-0.284,1.313-0.648,1.853v-0.013H8.322z M2.472,10.775\tc0,1.367,1.112,2.479,2.476,2.479c1.363,0,2.472-1.11,2.472-2.479c0-1.359-1.11-2.468-2.472-2.468\tC3.584,8.306,2.473,9.416,2.472,10.775L2.472,10.775z M12.514,10.775c0,1.367,1.104,2.479,2.471,2.479\tc1.363,0,2.474-1.108,2.474-2.479c0-1.359-1.11-2.468-2.474-2.468c-1.364,0-2.477,1.109-2.477,2.468H12.514z M3.324,10.775\tc0-0.893,0.726-1.618,1.614-1.618c0.889,0,1.625,0.727,1.625,1.618c0,0.898-0.725,1.627-1.625,1.627\tc-0.901,0-1.625-0.729-1.625-1.627H3.324z M13.354,10.775c0-0.893,0.726-1.618,1.627-1.618c0.886,0,1.61,0.727,1.61,1.618\tc0,0.898-0.726,1.627-1.626,1.627s-1.625-0.729-1.625-1.627H13.354z M9.977,4.875c1.798,0,3.425,0.324,4.849,0.968\tc-0.535,0.015-1.061,0.108-1.586,0.3c-1.264,0.463-2.264,1.388-2.815,2.604c-0.262,0.551-0.398,1.133-0.448,1.72\tC9.79,7.905,7.677,5.873,5.076,5.82C6.501,5.208,8.153,4.875,9.94,4.875H9.977z"/></svg>',tumblr:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M6.885,8.598c0,0,0,3.393,0,4.996c0,0.282,0,0.66,0.094,0.942c0.377,1.509,1.131,2.545,2.545,3.11 c1.319,0.472,2.356,0.472,3.676,0c0.565-0.188,1.132-0.659,1.132-0.659l-0.849-2.263c0,0-1.036,0.378-1.603,0.283 c-0.565-0.094-1.226-0.66-1.226-1.508c0-1.603,0-4.902,0-4.902h2.828V5.771h-2.828V2H8.205c0,0-0.094,0.66-0.188,0.942 C7.828,3.791,7.262,4.733,6.603,5.394C5.848,6.147,5,6.43,5,6.43v2.168H6.885z"/></svg>',tv:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="7" y="16" width="6" height="1"/><rect fill="none" stroke="#000" x=".5" y="3.5" width="19" height="11"/></svg>',twitter:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M19,4.74 C18.339,5.029 17.626,5.229 16.881,5.32 C17.644,4.86 18.227,4.139 18.503,3.28 C17.79,3.7 17.001,4.009 16.159,4.17 C15.485,3.45 14.526,3 13.464,3 C11.423,3 9.771,4.66 9.771,6.7 C9.771,6.99 9.804,7.269 9.868,7.539 C6.795,7.38 4.076,5.919 2.254,3.679 C1.936,4.219 1.754,4.86 1.754,5.539 C1.754,6.82 2.405,7.95 3.397,8.61 C2.79,8.589 2.22,8.429 1.723,8.149 L1.723,8.189 C1.723,9.978 2.997,11.478 4.686,11.82 C4.376,11.899 4.049,11.939 3.713,11.939 C3.475,11.939 3.245,11.919 3.018,11.88 C3.49,13.349 4.852,14.419 6.469,14.449 C5.205,15.429 3.612,16.019 1.882,16.019 C1.583,16.019 1.29,16.009 1,15.969 C2.635,17.019 4.576,17.629 6.662,17.629 C13.454,17.629 17.17,12 17.17,7.129 C17.17,6.969 17.166,6.809 17.157,6.649 C17.879,6.129 18.504,5.478 19,4.74"/></svg>',uikit:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon points="14.4,3.1 11.3,5.1 15,7.3 15,12.9 10,15.7 5,12.9 5,8.5 2,6.8 2,14.8 9.9,19.5 18,14.8 18,5.3"/><polygon points="9.8,4.2 6.7,2.4 9.8,0.4 12.9,2.3"/></svg>',unlock:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect fill="none" stroke="#000" x="3.5" y="8.5" width="13" height="10"/><path fill="none" stroke="#000" d="M6.5,8.5 L6.5,4.9 C6.5,3 8.1,1.5 10,1.5 C11.9,1.5 13.5,3 13.5,4.9"/></svg>',upload:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" points="5 8 9.5 3.5 14 8"/><rect x="3" y="17" width="13" height="1"/><line fill="none" stroke="#000" x1="9.5" y1="15" x2="9.5" y2="4"/></svg>',user:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="9.9" cy="6.4" r="4.4"/><path fill="none" stroke="#000" stroke-width="1.1" d="M1.5,19 C2.3,14.5 5.8,11.2 10,11.2 C14.2,11.2 17.7,14.6 18.5,19.2"/></svg>',users:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="7.7" cy="8.6" r="3.5"/><path fill="none" stroke="#000" stroke-width="1.1" d="M1,18.1 C1.7,14.6 4.4,12.1 7.6,12.1 C10.9,12.1 13.7,14.8 14.3,18.3"/><path fill="none" stroke="#000" stroke-width="1.1" d="M11.4,4 C12.8,2.4 15.4,2.8 16.3,4.7 C17.2,6.6 15.7,8.9 13.6,8.9 C16.5,8.9 18.8,11.3 19.2,14.1"/></svg>',"video-camera":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polygon fill="none" stroke="#000" points="17.5 6.9 17.5 13.1 13.5 10.4 13.5 14.5 2.5 14.5 2.5 5.5 13.5 5.5 13.5 9.6 17.5 6.9"/></svg>',vimeo:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.065,7.59C1.84,7.367,1.654,7.082,1.468,6.838c-0.332-0.42-0.137-0.411,0.274-0.772c1.026-0.91,2.004-1.896,3.127-2.688 c1.017-0.713,2.365-1.173,3.286-0.039c0.849,1.045,0.869,2.629,1.084,3.891c0.215,1.309,0.421,2.648,0.88,3.901 c0.127,0.352,0.37,1.018,0.81,1.074c0.567,0.078,1.145-0.917,1.408-1.289c0.684-0.987,1.611-2.317,1.494-3.587 c-0.115-1.349-1.572-1.095-2.482-0.773c0.146-1.514,1.555-3.216,2.912-3.792c1.439-0.597,3.579-0.587,4.302,1.036 c0.772,1.759,0.078,3.802-0.763,5.396c-0.918,1.731-2.1,3.333-3.363,4.829c-1.114,1.329-2.432,2.787-4.093,3.422 c-1.897,0.723-3.021-0.686-3.667-2.318c-0.705-1.777-1.056-3.771-1.565-5.621C4.898,8.726,4.644,7.836,4.136,7.191 C3.473,6.358,2.72,7.141,2.065,7.59C1.977,7.502,2.115,7.551,2.065,7.59L2.065,7.59z"/></svg>',warning:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="14" r="1"/><circle fill="none" stroke="#000" stroke-width="1.1" cx="10" cy="10" r="9"/><path d="M10.97,7.72 C10.85,9.54 10.56,11.29 10.56,11.29 C10.51,11.87 10.27,12 9.99,12 C9.69,12 9.49,11.87 9.43,11.29 C9.43,11.29 9.16,9.54 9.03,7.72 C8.96,6.54 9.03,6 9.03,6 C9.03,5.45 9.46,5.02 9.99,5 C10.53,5.01 10.97,5.44 10.97,6 C10.97,6 11.04,6.54 10.97,7.72 L10.97,7.72 Z"/></svg>',whatsapp:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M16.7,3.3c-1.8-1.8-4.1-2.8-6.7-2.8c-5.2,0-9.4,4.2-9.4,9.4c0,1.7,0.4,3.3,1.3,4.7l-1.3,4.9l5-1.3c1.4,0.8,2.9,1.2,4.5,1.2 l0,0l0,0c5.2,0,9.4-4.2,9.4-9.4C19.5,7.4,18.5,5,16.7,3.3 M10.1,17.7L10.1,17.7c-1.4,0-2.8-0.4-4-1.1l-0.3-0.2l-3,0.8l0.8-2.9 l-0.2-0.3c-0.8-1.2-1.2-2.7-1.2-4.2c0-4.3,3.5-7.8,7.8-7.8c2.1,0,4.1,0.8,5.5,2.3c1.5,1.5,2.3,3.4,2.3,5.5 C17.9,14.2,14.4,17.7,10.1,17.7 M14.4,11.9c-0.2-0.1-1.4-0.7-1.6-0.8c-0.2-0.1-0.4-0.1-0.5,0.1c-0.2,0.2-0.6,0.8-0.8,0.9 c-0.1,0.2-0.3,0.2-0.5,0.1c-0.2-0.1-1-0.4-1.9-1.2c-0.7-0.6-1.2-1.4-1.3-1.6c-0.1-0.2,0-0.4,0.1-0.5C8,8.8,8.1,8.7,8.2,8.5 c0.1-0.1,0.2-0.2,0.2-0.4c0.1-0.2,0-0.3,0-0.4C8.4,7.6,7.9,6.5,7.7,6C7.5,5.5,7.3,5.6,7.2,5.6c-0.1,0-0.3,0-0.4,0 c-0.2,0-0.4,0.1-0.6,0.3c-0.2,0.2-0.8,0.8-0.8,2c0,1.2,0.8,2.3,1,2.4c0.1,0.2,1.7,2.5,4,3.5c0.6,0.2,1,0.4,1.3,0.5 c0.6,0.2,1.1,0.2,1.5,0.1c0.5-0.1,1.4-0.6,1.6-1.1c0.2-0.5,0.2-1,0.1-1.1C14.8,12.1,14.6,12,14.4,11.9"/></svg>',wordpress:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10,0.5c-5.2,0-9.5,4.3-9.5,9.5s4.3,9.5,9.5,9.5c5.2,0,9.5-4.3,9.5-9.5S15.2,0.5,10,0.5L10,0.5L10,0.5z M15.6,3.9h-0.1 c-0.8,0-1.4,0.7-1.4,1.5c0,0.7,0.4,1.3,0.8,1.9c0.3,0.6,0.7,1.3,0.7,2.3c0,0.7-0.3,1.5-0.6,2.7L14.1,15l-3-8.9 c0.5,0,0.9-0.1,0.9-0.1C12.5,6,12.5,5.3,12,5.4c0,0-1.3,0.1-2.2,0.1C9,5.5,7.7,5.4,7.7,5.4C7.2,5.3,7.2,6,7.6,6c0,0,0.4,0.1,0.9,0.1 l1.3,3.5L8,15L5,6.1C5.5,6.1,5.9,6,5.9,6C6.4,6,6.3,5.3,5.9,5.4c0,0-1.3,0.1-2.2,0.1c-0.2,0-0.3,0-0.5,0c1.5-2.2,4-3.7,6.9-3.7 C12.2,1.7,14.1,2.6,15.6,3.9L15.6,3.9L15.6,3.9z M2.5,6.6l3.9,10.8c-2.7-1.3-4.6-4.2-4.6-7.4C1.8,8.8,2,7.6,2.5,6.6L2.5,6.6L2.5,6.6 z M10.2,10.7l2.5,6.9c0,0,0,0.1,0.1,0.1C11.9,18,11,18.2,10,18.2c-0.8,0-1.6-0.1-2.3-0.3L10.2,10.7L10.2,10.7L10.2,10.7z M14.2,17.1 l2.5-7.3c0.5-1.2,0.6-2.1,0.6-2.9c0-0.3,0-0.6-0.1-0.8c0.6,1.2,1,2.5,1,4C18.3,13,16.6,15.7,14.2,17.1L14.2,17.1L14.2,17.1z"/></svg>',world:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000" d="M1,10.5 L19,10.5"/><path fill="none" stroke="#000" d="M2.35,15.5 L17.65,15.5"/><path fill="none" stroke="#000" d="M2.35,5.5 L17.523,5.5"/><path fill="none" stroke="#000" d="M10,19.46 L9.98,19.46 C7.31,17.33 5.61,14.141 5.61,10.58 C5.61,7.02 7.33,3.83 10,1.7 C10.01,1.7 9.99,1.7 10,1.7 L10,1.7 C12.67,3.83 14.4,7.02 14.4,10.58 C14.4,14.141 12.67,17.33 10,19.46 L10,19.46 L10,19.46 L10,19.46 Z"/><circle fill="none" stroke="#000" cx="10" cy="10.5" r="9"/></svg>',xing:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4.4,4.56 C4.24,4.56 4.11,4.61 4.05,4.72 C3.98,4.83 3.99,4.97 4.07,5.12 L5.82,8.16 L5.82,8.17 L3.06,13.04 C2.99,13.18 2.99,13.33 3.06,13.44 C3.12,13.55 3.24,13.62 3.4,13.62 L6,13.62 C6.39,13.62 6.57,13.36 6.71,13.12 C6.71,13.12 9.41,8.35 9.51,8.16 C9.49,8.14 7.72,5.04 7.72,5.04 C7.58,4.81 7.39,4.56 6.99,4.56 L4.4,4.56 L4.4,4.56 Z"/><path d="M15.3,1 C14.91,1 14.74,1.25 14.6,1.5 C14.6,1.5 9.01,11.42 8.82,11.74 C8.83,11.76 12.51,18.51 12.51,18.51 C12.64,18.74 12.84,19 13.23,19 L15.82,19 C15.98,19 16.1,18.94 16.16,18.83 C16.23,18.72 16.23,18.57 16.16,18.43 L12.5,11.74 L12.5,11.72 L18.25,1.56 C18.32,1.42 18.32,1.27 18.25,1.16 C18.21,1.06 18.08,1 17.93,1 L15.3,1 L15.3,1 Z"/></svg>',yelp:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.175,14.971c-0.112,0.77-1.686,2.767-2.406,3.054c-0.246,0.1-0.487,0.076-0.675-0.069\tc-0.122-0.096-2.446-3.859-2.446-3.859c-0.194-0.293-0.157-0.682,0.083-0.978c0.234-0.284,0.581-0.393,0.881-0.276\tc0.016,0.01,4.21,1.394,4.332,1.482c0.178,0.148,0.263,0.379,0.225,0.646L17.175,14.971L17.175,14.971z M11.464,10.789\tc-0.203-0.307-0.199-0.666,0.009-0.916c0,0,2.625-3.574,2.745-3.657c0.203-0.135,0.452-0.141,0.69-0.025\tc0.691,0.335,2.085,2.405,2.167,3.199v0.027c0.024,0.271-0.082,0.491-0.273,0.623c-0.132,0.083-4.43,1.155-4.43,1.155\tc-0.322,0.096-0.68-0.06-0.882-0.381L11.464,10.789z M9.475,9.563C9.32,9.609,8.848,9.757,8.269,8.817c0,0-3.916-6.16-4.007-6.351\tc-0.057-0.212,0.011-0.455,0.202-0.65C5.047,1.211,8.21,0.327,9.037,0.529c0.27,0.069,0.457,0.238,0.522,0.479\tc0.047,0.266,0.433,5.982,0.488,7.264C10.098,9.368,9.629,9.517,9.475,9.563z M9.927,19.066c-0.083,0.225-0.273,0.373-0.54,0.421\tc-0.762,0.13-3.15-0.751-3.647-1.342c-0.096-0.131-0.155-0.262-0.167-0.394c-0.011-0.095,0-0.189,0.036-0.272\tc0.061-0.155,2.917-3.538,2.917-3.538c0.214-0.272,0.595-0.355,0.952-0.213c0.345,0.13,0.56,0.428,0.536,0.749\tC10.014,14.479,9.977,18.923,9.927,19.066z M3.495,13.912c-0.235-0.009-0.444-0.148-0.568-0.382c-0.089-0.17-0.151-0.453-0.19-0.794\tC2.63,11.701,2.761,10.144,3.07,9.648c0.145-0.226,0.357-0.345,0.592-0.336c0.154,0,4.255,1.667,4.255,1.667\tc0.321,0.118,0.521,0.453,0.5,0.833c-0.023,0.37-0.236,0.655-0.551,0.738L3.495,13.912z"/></svg>',youtube:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15,4.1c1,0.1,2.3,0,3,0.8c0.8,0.8,0.9,2.1,0.9,3.1C19,9.2,19,10.9,19,12c-0.1,1.1,0,2.4-0.5,3.4c-0.5,1.1-1.4,1.5-2.5,1.6 c-1.2,0.1-8.6,0.1-11,0c-1.1-0.1-2.4-0.1-3.2-1c-0.7-0.8-0.7-2-0.8-3C1,11.8,1,10.1,1,8.9c0-1.1,0-2.4,0.5-3.4C2,4.5,3,4.3,4.1,4.2 C5.3,4.1,12.6,4,15,4.1z M8,7.5v6l5.5-3L8,7.5z"/></svg>'})}return"undefined"!=typeof window&&window.UIkit&&window.UIkit.use(i),i});
/*! UIkit 3.0.2 | http://www.getuikit.com | (c) 2014 - 2018 YOOtheme | MIT License */


(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('uikit', factory) :
    (global = global || self, global.UIkit = factory());
}(this, function () { 'use strict';

    function bind(fn, context) {
        return function (a) {
            var l = arguments.length;
            return l ? l > 1 ? fn.apply(context, arguments) : fn.call(context, a) : fn.call(context);
        };
    }

    var objPrototype = Object.prototype;
    var hasOwnProperty = objPrototype.hasOwnProperty;

    function hasOwn(obj, key) {
        return hasOwnProperty.call(obj, key);
    }

    var hyphenateCache = {};
    var hyphenateRe = /([a-z\d])([A-Z])/g;

    function hyphenate(str) {

        if (!(str in hyphenateCache)) {
            hyphenateCache[str] = str
                .replace(hyphenateRe, '$1-$2')
                .toLowerCase();
        }

        return hyphenateCache[str];
    }

    var camelizeRe = /-(\w)/g;

    function camelize(str) {
        return str.replace(camelizeRe, toUpper);
    }

    function toUpper(_, c) {
        return c ? c.toUpperCase() : '';
    }

    function ucfirst(str) {
        return str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '';
    }

    var strPrototype = String.prototype;
    var startsWithFn = strPrototype.startsWith || function (search) { return this.lastIndexOf(search, 0) === 0; };

    function startsWith(str, search) {
        return startsWithFn.call(str, search);
    }

    var endsWithFn = strPrototype.endsWith || function (search) { return this.substr(-search.length) === search; };

    function endsWith(str, search) {
        return endsWithFn.call(str, search);
    }

    var includesFn = function (search) { return ~this.indexOf(search); };
    var includesStr = strPrototype.includes || includesFn;
    var includesArray = Array.prototype.includes || includesFn;

    function includes(obj, search) {
        return obj && (isString(obj) ? includesStr : includesArray).call(obj, search);
    }

    var isArray = Array.isArray;

    function isFunction(obj) {
        return typeof obj === 'function';
    }

    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }

    function isPlainObject(obj) {
        return isObject(obj) && Object.getPrototypeOf(obj) === objPrototype;
    }

    function isWindow(obj) {
        return isObject(obj) && obj === obj.window;
    }

    function isDocument(obj) {
        return isObject(obj) && obj.nodeType === 9;
    }

    function isJQuery(obj) {
        return isObject(obj) && !!obj.jquery;
    }

    function isNode(obj) {
        return obj instanceof Node || isObject(obj) && obj.nodeType >= 1;
    }

    var toString = objPrototype.toString;
    function isNodeCollection(obj) {
        return toString.call(obj).match(/^\[object (NodeList|HTMLCollection)\]$/);
    }

    function isBoolean(value) {
        return typeof value === 'boolean';
    }

    function isString(value) {
        return typeof value === 'string';
    }

    function isNumber(value) {
        return typeof value === 'number';
    }

    function isNumeric(value) {
        return isNumber(value) || isString(value) && !isNaN(value - parseFloat(value));
    }

    function isUndefined(value) {
        return value === void 0;
    }

    function toBoolean(value) {
        return isBoolean(value)
            ? value
            : value === 'true' || value === '1' || value === ''
                ? true
                : value === 'false' || value === '0'
                    ? false
                    : value;
    }

    function toNumber(value) {
        var number = Number(value);
        return !isNaN(number) ? number : false;
    }

    function toFloat(value) {
        return parseFloat(value) || 0;
    }

    function toNode(element) {
        return isNode(element) || isWindow(element) || isDocument(element)
            ? element
            : isNodeCollection(element) || isJQuery(element)
                ? element[0]
                : isArray(element)
                    ? toNode(element[0])
                    : null;
    }

    var arrayProto = Array.prototype;
    function toNodes(element) {
        return isNode(element)
            ? [element]
            : isNodeCollection(element)
                ? arrayProto.slice.call(element)
                : isArray(element)
                    ? element.map(toNode).filter(Boolean)
                    : isJQuery(element)
                        ? element.toArray()
                        : [];
    }

    function toList(value) {
        return isArray(value)
            ? value
            : isString(value)
                ? value.split(/,(?![^(]*\))/).map(function (value) { return isNumeric(value)
                    ? toNumber(value)
                    : toBoolean(value.trim()); })
                : [value];
    }

    function toMs(time) {
        return !time
            ? 0
            : endsWith(time, 'ms')
                ? toFloat(time)
                : toFloat(time) * 1000;
    }

    function swap(value, a, b) {
        return value.replace(new RegExp((a + "|" + b), 'mg'), function (match) {
            return match === a ? b : a;
        });
    }

    var assign = Object.assign || function (target) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        target = Object(target);
        for (var i = 0; i < args.length; i++) {
            var source = args[i];
            if (source !== null) {
                for (var key in source) {
                    if (hasOwn(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };

    function each(obj, cb) {
        for (var key in obj) {
            cb.call(obj[key], obj[key], key);
        }
    }

    function sortBy(collection, prop) {
        return collection.sort(function (ref, ref$1) {
                var propA = ref[prop]; if ( propA === void 0 ) propA = 0;
                var propB = ref$1[prop]; if ( propB === void 0 ) propB = 0;

                return propA > propB
                ? 1
                : propB > propA
                    ? -1
                    : 0;
        }
        );
    }

    function clamp(number, min, max) {
        if ( min === void 0 ) min = 0;
        if ( max === void 0 ) max = 1;

        return Math.min(Math.max(toNumber(number) || 0, min), max);
    }

    function noop() {}

    function intersectRect(r1, r2) {
        return r1.left < r2.right &&
            r1.right > r2.left &&
            r1.top < r2.bottom &&
            r1.bottom > r2.top;
    }

    function pointInRect(point, rect) {
        return point.x <= rect.right &&
            point.x >= rect.left &&
            point.y <= rect.bottom &&
            point.y >= rect.top;
    }

    var Dimensions = {

        ratio: function(dimensions, prop, value) {
            var obj;


            var aProp = prop === 'width' ? 'height' : 'width';

            return ( obj = {}, obj[aProp] = dimensions[prop] ? Math.round(value * dimensions[aProp] / dimensions[prop]) : dimensions[aProp], obj[prop] = value, obj );
        },

        contain: function(dimensions, maxDimensions) {
            var this$1 = this;

            dimensions = assign({}, dimensions);

            each(dimensions, function (_, prop) { return dimensions = dimensions[prop] > maxDimensions[prop]
                ? this$1.ratio(dimensions, prop, maxDimensions[prop])
                : dimensions; }
            );

            return dimensions;
        },

        cover: function(dimensions, maxDimensions) {
            var this$1 = this;

            dimensions = this.contain(dimensions, maxDimensions);

            each(dimensions, function (_, prop) { return dimensions = dimensions[prop] < maxDimensions[prop]
                ? this$1.ratio(dimensions, prop, maxDimensions[prop])
                : dimensions; }
            );

            return dimensions;
        }

    };

    function attr(element, name, value) {

        if (isObject(name)) {
            for (var key in name) {
                attr(element, key, name[key]);
            }
            return;
        }

        if (isUndefined(value)) {
            element = toNode(element);
            return element && element.getAttribute(name);
        } else {
            toNodes(element).forEach(function (element) {

                if (isFunction(value)) {
                    value = value.call(element, attr(element, name));
                }

                if (value === null) {
                    removeAttr(element, name);
                } else {
                    element.setAttribute(name, value);
                }
            });
        }

    }

    function hasAttr(element, name) {
        return toNodes(element).some(function (element) { return element.hasAttribute(name); });
    }

    function removeAttr(element, name) {
        element = toNodes(element);
        name.split(' ').forEach(function (name) { return element.forEach(function (element) { return element.removeAttribute(name); }
            ); }
        );
    }

    function data(element, attribute) {
        for (var i = 0, attrs = [attribute, ("data-" + attribute)]; i < attrs.length; i++) {
            if (hasAttr(element, attrs[i])) {
                return attr(element, attrs[i]);
            }
        }
    }

    function query(selector, context) {
        return toNode(selector) || find(selector, getContext(selector, context));
    }

    function queryAll(selector, context) {
        var nodes = toNodes(selector);
        return nodes.length && nodes || findAll(selector, getContext(selector, context));
    }

    function getContext(selector, context) {
        if ( context === void 0 ) context = document;

        return isContextSelector(selector) || isDocument(context)
            ? context
            : context.ownerDocument;
    }

    function find(selector, context) {
        return toNode(_query(selector, context, 'querySelector'));
    }

    function findAll(selector, context) {
        return toNodes(_query(selector, context, 'querySelectorAll'));
    }

    function _query(selector, context, queryFn) {
        if ( context === void 0 ) context = document;


        if (!selector || !isString(selector)) {
            return null;
        }

        selector = selector.replace(contextSanitizeRe, '$1 *');

        var removes;

        if (isContextSelector(selector)) {

            removes = [];

            selector = selector.split(',').map(function (selector, i) {

                var ctx = context;

                selector = selector.trim();

                if (selector[0] === '!') {

                    var selectors = selector.substr(1).trim().split(' ');
                    ctx = closest(context.parentNode, selectors[0]);
                    selector = selectors.slice(1).join(' ').trim();

                }

                if (selector[0] === '-') {

                    var selectors$1 = selector.substr(1).trim().split(' ');
                    var prev = (ctx || context).previousElementSibling;
                    ctx = matches(prev, selector.substr(1)) ? prev : null;
                    selector = selectors$1.slice(1).join(' ');

                }

                if (!ctx) {
                    return null;
                }

                if (!ctx.id) {
                    ctx.id = "uk-" + (Date.now()) + i;
                    removes.push(function () { return removeAttr(ctx, 'id'); });
                }

                return ("#" + (escape(ctx.id)) + " " + selector);

            }).filter(Boolean).join(',');

            context = document;

        }

        try {

            return context[queryFn](selector);

        } catch (e) {

            return null;

        } finally {

            removes && removes.forEach(function (remove) { return remove(); });

        }

    }

    var contextSelectorRe = /(^|,)\s*[!>+~-]/;
    var contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;

    function isContextSelector(selector) {
        return isString(selector) && selector.match(contextSelectorRe);
    }

    var elProto = Element.prototype;
    var matchesFn = elProto.matches || elProto.webkitMatchesSelector || elProto.msMatchesSelector;

    function matches(element, selector) {
        return toNodes(element).some(function (element) { return matchesFn.call(element, selector); });
    }

    var closestFn = elProto.closest || function (selector) {
        var ancestor = this;

        do {

            if (matches(ancestor, selector)) {
                return ancestor;
            }

            ancestor = ancestor.parentNode;

        } while (ancestor && ancestor.nodeType === 1);
    };

    function closest(element, selector) {

        if (startsWith(selector, '>')) {
            selector = selector.slice(1);
        }

        return isNode(element)
            ? element.parentNode && closestFn.call(element, selector)
            : toNodes(element).map(function (element) { return closest(element, selector); }).filter(Boolean);
    }

    function parents(element, selector) {
        var elements = [];
        var parent = toNode(element).parentNode;

        while (parent && parent.nodeType === 1) {

            if (matches(parent, selector)) {
                elements.push(parent);
            }

            parent = parent.parentNode;
        }

        return elements;
    }

    var escapeFn = window.CSS && CSS.escape || function (css) { return css.replace(/([^\x7f-\uFFFF\w-])/g, function (match) { return ("\\" + match); }); };
    function escape(css) {
        return isString(css) ? escapeFn.call(null, css) : '';
    }

    var voidElements = {
        area: true,
        base: true,
        br: true,
        col: true,
        embed: true,
        hr: true,
        img: true,
        input: true,
        keygen: true,
        link: true,
        menuitem: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
    };
    function isVoidElement(element) {
        return toNodes(element).some(function (element) { return voidElements[element.tagName.toLowerCase()]; });
    }

    function isVisible(element) {
        return toNodes(element).some(function (element) { return element.offsetWidth || element.offsetHeight || element.getClientRects().length; });
    }

    var selInput = 'input,select,textarea,button';
    function isInput(element) {
        return toNodes(element).some(function (element) { return matches(element, selInput); });
    }

    function filter(element, selector) {
        return toNodes(element).filter(function (element) { return matches(element, selector); });
    }

    function within(element, selector) {
        return !isString(selector)
            ? element === selector || (isDocument(selector)
                ? selector.documentElement
                : toNode(selector)).contains(toNode(element)) // IE 11 document does not implement contains
            : matches(element, selector) || closest(element, selector);
    }

    /* global DocumentTouch */

    var isIE = /msie|trident/i.test(window.navigator.userAgent);
    var isRtl = attr(document.documentElement, 'dir') === 'rtl';

    var hasTouchEvents = 'ontouchstart' in window;
    var hasPointerEvents = window.PointerEvent;
    var hasTouch = hasTouchEvents
        || window.DocumentTouch && document instanceof DocumentTouch
        || navigator.maxTouchPoints; // IE >=11

    var pointerDown = hasPointerEvents ? 'pointerdown' : hasTouchEvents ? 'touchstart' : 'mousedown';
    var pointerMove = hasPointerEvents ? 'pointermove' : hasTouchEvents ? 'touchmove' : 'mousemove';
    var pointerUp = hasPointerEvents ? 'pointerup' : hasTouchEvents ? 'touchend' : 'mouseup';
    var pointerEnter = hasPointerEvents ? 'pointerenter' : hasTouchEvents ? '' : 'mouseenter';
    var pointerLeave = hasPointerEvents ? 'pointerleave' : hasTouchEvents ? '' : 'mouseleave';
    var pointerCancel = hasPointerEvents ? 'pointercancel' : 'touchcancel';

    function on() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];


        var ref = getArgs(args);
        var targets = ref[0];
        var type = ref[1];
        var selector = ref[2];
        var listener = ref[3];
        var useCapture = ref[4];

        targets = toEventTargets(targets);

        if (selector) {
            listener = delegate(targets, selector, listener);
        }

        if (listener.length > 1) {
            listener = detail(listener);
        }

        type.split(' ').forEach(function (type) { return targets.forEach(function (target) { return target.addEventListener(type, listener, useCapture); }
            ); }
        );
        return function () { return off(targets, type, listener, useCapture); };
    }

    function off(targets, type, listener, useCapture) {
        if ( useCapture === void 0 ) useCapture = false;

        targets = toEventTargets(targets);
        type.split(' ').forEach(function (type) { return targets.forEach(function (target) { return target.removeEventListener(type, listener, useCapture); }
            ); }
        );
    }

    function once() {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];


        var ref = getArgs(args);
        var element = ref[0];
        var type = ref[1];
        var selector = ref[2];
        var listener = ref[3];
        var useCapture = ref[4];
        var condition = ref[5];
        var off = on(element, type, selector, function (e) {
            var result = !condition || condition(e);
            if (result) {
                off();
                listener(e, result);
            }
        }, useCapture);

        return off;
    }

    function trigger(targets, event, detail) {
        return toEventTargets(targets).reduce(function (notCanceled, target) { return notCanceled && target.dispatchEvent(createEvent(event, true, true, detail)); }
            , true);
    }

    function createEvent(e, bubbles, cancelable, detail) {
        if ( bubbles === void 0 ) bubbles = true;
        if ( cancelable === void 0 ) cancelable = false;

        if (isString(e)) {
            var event = document.createEvent('CustomEvent'); // IE 11
            event.initCustomEvent(e, bubbles, cancelable, detail);
            e = event;
        }

        return e;
    }

    function getArgs(args) {
        if (isFunction(args[2])) {
            args.splice(2, 0, false);
        }
        return args;
    }

    function delegate(delegates, selector, listener) {
        var this$1 = this;

        return function (e) {

            delegates.forEach(function (delegate) {

                var current = selector[0] === '>'
                    ? findAll(selector, delegate).reverse().filter(function (element) { return within(e.target, element); })[0]
                    : closest(e.target, selector);

                if (current) {
                    e.delegate = delegate;
                    e.current = current;

                    listener.call(this$1, e);
                }

            });

        };
    }

    function detail(listener) {
        return function (e) { return isArray(e.detail) ? listener.apply(void 0, [e].concat(e.detail)) : listener(e); };
    }

    function isEventTarget(target) {
        return target && 'addEventListener' in target;
    }

    function toEventTarget(target) {
        return isEventTarget(target) ? target : toNode(target);
    }

    function toEventTargets(target) {
        return isArray(target)
                ? target.map(toEventTarget).filter(Boolean)
                : isString(target)
                    ? findAll(target)
                    : isEventTarget(target)
                        ? [target]
                        : toNodes(target);
    }

    function preventClick() {

        var timer = setTimeout(once(document, 'click', function (e) {

            e.preventDefault();
            e.stopImmediatePropagation();

            clearTimeout(timer);

        }, true));

        trigger(document, pointerCancel);

    }

    /* global setImmediate */

    var Promise = 'Promise' in window ? window.Promise : PromiseFn;

    var Deferred = function() {
        var this$1 = this;

        this.promise = new Promise(function (resolve, reject) {
            this$1.reject = reject;
            this$1.resolve = resolve;
        });
    };

    /**
     * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
     */

    var RESOLVED = 0;
    var REJECTED = 1;
    var PENDING = 2;

    var async = 'setImmediate' in window ? setImmediate : setTimeout;

    function PromiseFn(executor) {

        this.state = PENDING;
        this.value = undefined;
        this.deferred = [];

        var promise = this;

        try {
            executor(
                function (x) {
                    promise.resolve(x);
                },
                function (r) {
                    promise.reject(r);
                }
            );
        } catch (e) {
            promise.reject(e);
        }
    }

    PromiseFn.reject = function (r) {
        return new PromiseFn(function (resolve, reject) {
            reject(r);
        });
    };

    PromiseFn.resolve = function (x) {
        return new PromiseFn(function (resolve, reject) {
            resolve(x);
        });
    };

    PromiseFn.all = function all(iterable) {
        return new PromiseFn(function (resolve, reject) {
            var result = [];
            var count = 0;

            if (iterable.length === 0) {
                resolve(result);
            }

            function resolver(i) {
                return function (x) {
                    result[i] = x;
                    count += 1;

                    if (count === iterable.length) {
                        resolve(result);
                    }
                };
            }

            for (var i = 0; i < iterable.length; i += 1) {
                PromiseFn.resolve(iterable[i]).then(resolver(i), reject);
            }
        });
    };

    PromiseFn.race = function race(iterable) {
        return new PromiseFn(function (resolve, reject) {
            for (var i = 0; i < iterable.length; i += 1) {
                PromiseFn.resolve(iterable[i]).then(resolve, reject);
            }
        });
    };

    var p = PromiseFn.prototype;

    p.resolve = function resolve(x) {
        var promise = this;

        if (promise.state === PENDING) {
            if (x === promise) {
                throw new TypeError('Promise settled with itself.');
            }

            var called = false;

            try {
                var then = x && x.then;

                if (x !== null && isObject(x) && isFunction(then)) {
                    then.call(
                        x,
                        function (x) {
                            if (!called) {
                                promise.resolve(x);
                            }
                            called = true;
                        },
                        function (r) {
                            if (!called) {
                                promise.reject(r);
                            }
                            called = true;
                        }
                    );
                    return;
                }
            } catch (e) {
                if (!called) {
                    promise.reject(e);
                }
                return;
            }

            promise.state = RESOLVED;
            promise.value = x;
            promise.notify();
        }
    };

    p.reject = function reject(reason) {
        var promise = this;

        if (promise.state === PENDING) {
            if (reason === promise) {
                throw new TypeError('Promise settled with itself.');
            }

            promise.state = REJECTED;
            promise.value = reason;
            promise.notify();
        }
    };

    p.notify = function notify() {
        var this$1 = this;

        async(function () {
            if (this$1.state !== PENDING) {
                while (this$1.deferred.length) {
                    var ref = this$1.deferred.shift();
                    var onResolved = ref[0];
                    var onRejected = ref[1];
                    var resolve = ref[2];
                    var reject = ref[3];

                    try {
                        if (this$1.state === RESOLVED) {
                            if (isFunction(onResolved)) {
                                resolve(onResolved.call(undefined, this$1.value));
                            } else {
                                resolve(this$1.value);
                            }
                        } else if (this$1.state === REJECTED) {
                            if (isFunction(onRejected)) {
                                resolve(onRejected.call(undefined, this$1.value));
                            } else {
                                reject(this$1.value);
                            }
                        }
                    } catch (e) {
                        reject(e);
                    }
                }
            }
        });
    };

    p.then = function then(onResolved, onRejected) {
        var this$1 = this;

        return new PromiseFn(function (resolve, reject) {
            this$1.deferred.push([onResolved, onRejected, resolve, reject]);
            this$1.notify();
        });
    };

    p.catch = function (onRejected) {
        return this.then(undefined, onRejected);
    };

    function ajax(url, options) {
        return new Promise(function (resolve, reject) {

            var env = assign({
                data: null,
                method: 'GET',
                headers: {},
                xhr: new XMLHttpRequest(),
                beforeSend: noop,
                responseType: ''
            }, options);

            env.beforeSend(env);

            var xhr = env.xhr;

            for (var prop in env) {
                if (prop in xhr) {
                    try {

                        xhr[prop] = env[prop];

                    } catch (e) {}
                }
            }

            xhr.open(env.method.toUpperCase(), url);

            for (var header in env.headers) {
                xhr.setRequestHeader(header, env.headers[header]);
            }

            on(xhr, 'load', function () {

                if (xhr.status === 0 || xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                    resolve(xhr);
                } else {
                    reject(assign(Error(xhr.statusText), {
                        xhr: xhr,
                        status: xhr.status
                    }));
                }

            });

            on(xhr, 'error', function () { return reject(assign(Error('Network Error'), {xhr: xhr})); });
            on(xhr, 'timeout', function () { return reject(assign(Error('Network Timeout'), {xhr: xhr})); });

            xhr.send(env.data);
        });
    }

    function getImage(src, srcset, sizes) {

        return new Promise(function (resolve, reject) {
            var img = new Image();

            img.onerror = reject;
            img.onload = function () { return resolve(img); };

            sizes && (img.sizes = sizes);
            srcset && (img.srcset = srcset);
            img.src = src;
        });

    }

    function isReady() {
        return document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll;
    }

    function ready(fn) {

        if (isReady()) {
            fn();
            return;
        }

        var handle = function () {
            unbind1();
            unbind2();
            fn();
        };
        var unbind1 = on(document, 'DOMContentLoaded', handle);
        var unbind2 = on(window, 'load', handle);
    }

    function index(element, ref) {
        return ref
            ? toNodes(element).indexOf(toNode(ref))
            : toNodes((element = toNode(element)) && element.parentNode.children).indexOf(element);
    }

    function getIndex(i, elements, current, finite) {
        if ( current === void 0 ) current = 0;
        if ( finite === void 0 ) finite = false;


        elements = toNodes(elements);

        var length = elements.length;

        i = isNumeric(i)
            ? toNumber(i)
            : i === 'next'
                ? current + 1
                : i === 'previous'
                    ? current - 1
                    : index(elements, i);

        if (finite) {
            return clamp(i, 0, length - 1);
        }

        i %= length;

        return i < 0 ? i + length : i;
    }

    function empty(element) {
        element = $(element);
        element.innerHTML = '';
        return element;
    }

    function html(parent, html) {
        parent = $(parent);
        return isUndefined(html)
            ? parent.innerHTML
            : append(parent.hasChildNodes() ? empty(parent) : parent, html);
    }

    function prepend(parent, element) {

        parent = $(parent);

        if (!parent.hasChildNodes()) {
            return append(parent, element);
        } else {
            return insertNodes(element, function (element) { return parent.insertBefore(element, parent.firstChild); });
        }
    }

    function append(parent, element) {
        parent = $(parent);
        return insertNodes(element, function (element) { return parent.appendChild(element); });
    }

    function before(ref, element) {
        ref = $(ref);
        return insertNodes(element, function (element) { return ref.parentNode.insertBefore(element, ref); });
    }

    function after(ref, element) {
        ref = $(ref);
        return insertNodes(element, function (element) { return ref.nextSibling
            ? before(ref.nextSibling, element)
            : append(ref.parentNode, element); }
        );
    }

    function insertNodes(element, fn) {
        element = isString(element) ? fragment(element) : element;
        return element
            ? 'length' in element
                ? toNodes(element).map(fn)
                : fn(element)
            : null;
    }

    function remove(element) {
        toNodes(element).map(function (element) { return element.parentNode && element.parentNode.removeChild(element); });
    }

    function wrapAll(element, structure) {

        structure = toNode(before(element, structure));

        while (structure.firstChild) {
            structure = structure.firstChild;
        }

        append(structure, element);

        return structure;
    }

    function wrapInner(element, structure) {
        return toNodes(toNodes(element).map(function (element) { return element.hasChildNodes ? wrapAll(toNodes(element.childNodes), structure) : append(element, structure); }
        ));
    }

    function unwrap(element) {
        toNodes(element)
            .map(function (element) { return element.parentNode; })
            .filter(function (value, index, self) { return self.indexOf(value) === index; })
            .forEach(function (parent) {
                before(parent, parent.childNodes);
                remove(parent);
            });
    }

    var fragmentRe = /^\s*<(\w+|!)[^>]*>/;
    var singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

    function fragment(html) {

        var matches$$1 = singleTagRe.exec(html);
        if (matches$$1) {
            return document.createElement(matches$$1[1]);
        }

        var container = document.createElement('div');
        if (fragmentRe.test(html)) {
            container.insertAdjacentHTML('beforeend', html.trim());
        } else {
            container.textContent = html;
        }

        return container.childNodes.length > 1 ? toNodes(container.childNodes) : container.firstChild;

    }

    function apply(node, fn) {

        if (!node || node.nodeType !== 1) {
            return;
        }

        fn(node);
        node = node.firstElementChild;
        while (node) {
            apply(node, fn);
            node = node.nextElementSibling;
        }
    }

    function $(selector, context) {
        return !isString(selector)
            ? toNode(selector)
            : isHtml(selector)
                ? toNode(fragment(selector))
                : find(selector, context);
    }

    function $$(selector, context) {
        return !isString(selector)
            ? toNodes(selector)
            : isHtml(selector)
                ? toNodes(fragment(selector))
                : findAll(selector, context);
    }

    function isHtml(str) {
        return str[0] === '<' || str.match(/^\s*</);
    }

    function addClass(element) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        apply$1(element, args, 'add');
    }

    function removeClass(element) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        apply$1(element, args, 'remove');
    }

    function removeClasses(element, cls) {
        attr(element, 'class', function (value) { return (value || '').replace(new RegExp(("\\b" + cls + "\\b"), 'g'), ''); });
    }

    function replaceClass(element) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        args[0] && removeClass(element, args[0]);
        args[1] && addClass(element, args[1]);
    }

    function hasClass(element, cls) {
        return cls && toNodes(element).some(function (element) { return element.classList.contains(cls.split(' ')[0]); });
    }

    function toggleClass(element) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];


        if (!args.length) {
            return;
        }

        args = getArgs$1(args);

        var force = !isString(args[args.length - 1]) ? args.pop() : []; // in iOS 9.3 force === undefined evaluates to false

        args = args.filter(Boolean);

        toNodes(element).forEach(function (ref) {
            var classList = ref.classList;

            for (var i = 0; i < args.length; i++) {
                supports.Force
                    ? classList.toggle.apply(classList, [args[i]].concat(force))
                    : (classList[(!isUndefined(force) ? force : !classList.contains(args[i])) ? 'add' : 'remove'](args[i]));
            }
        });

    }

    function apply$1(element, args, fn) {
        args = getArgs$1(args).filter(Boolean);

        args.length && toNodes(element).forEach(function (ref) {
            var classList = ref.classList;

            supports.Multiple
                ? classList[fn].apply(classList, args)
                : args.forEach(function (cls) { return classList[fn](cls); });
        });
    }

    function getArgs$1(args) {
        return args.reduce(function (args, arg) { return args.concat.call(args, isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : arg); }
            , []);
    }

    var supports = {};

    // IE 11
    (function () {

        var list = document.createElement('_').classList;
        if (list) {
            list.add('a', 'b');
            list.toggle('c', false);
            supports.Multiple = list.contains('b');
            supports.Force = !list.contains('c');
        }
        list = null;

    })();

    var cssNumber = {
        'animation-iteration-count': true,
        'column-count': true,
        'fill-opacity': true,
        'flex-grow': true,
        'flex-shrink': true,
        'font-weight': true,
        'line-height': true,
        'opacity': true,
        'order': true,
        'orphans': true,
        'widows': true,
        'z-index': true,
        'zoom': true
    };

    function css(element, property, value) {

        return toNodes(element).map(function (element) {

            if (isString(property)) {

                property = propName(property);

                if (isUndefined(value)) {
                    return getStyle(element, property);
                } else if (!value && !isNumber(value)) {
                    element.style.removeProperty(property);
                } else {
                    element.style[property] = isNumeric(value) && !cssNumber[property] ? (value + "px") : value;
                }

            } else if (isArray(property)) {

                var styles = getStyles(element);

                return property.reduce(function (props, property) {
                    props[property] = styles[propName(property)];
                    return props;
                }, {});

            } else if (isObject(property)) {
                each(property, function (value, property) { return css(element, property, value); });
            }

            return element;

        })[0];

    }

    function getStyles(element, pseudoElt) {
        element = toNode(element);
        return element.ownerDocument.defaultView.getComputedStyle(element, pseudoElt);
    }

    function getStyle(element, property, pseudoElt) {
        return getStyles(element, pseudoElt)[property];
    }

    var vars = {};

    function getCssVar(name) {

        var docEl = document.documentElement;

        if (!isIE) {
            return getStyles(docEl).getPropertyValue(("--uk-" + name));
        }

        if (!(name in vars)) {

            /* usage in css: .uk-name:before { content:"xyz" } */

            var element = append(docEl, document.createElement('div'));

            addClass(element, ("uk-" + name));

            vars[name] = getStyle(element, 'content', ':before').replace(/^["'](.*)["']$/, '$1');

            remove(element);

        }

        return vars[name];

    }

    var cssProps = {};

    function propName(name) {

        var ret = cssProps[name];
        if (!ret) {
            ret = cssProps[name] = vendorPropName(name) || name;
        }
        return ret;
    }

    var cssPrefixes = ['webkit', 'moz', 'ms'];
    var ref = document.createElement('_');
    var style = ref.style;

    function vendorPropName(name) {

        name = hyphenate(name);

        if (name in style) {
            return name;
        }

        var i = cssPrefixes.length, prefixedName;

        while (i--) {
            prefixedName = "-" + (cssPrefixes[i]) + "-" + name;
            if (prefixedName in style) {
                return prefixedName;
            }
        }
    }

    function transition(element, props, duration, timing) {
        if ( duration === void 0 ) duration = 400;
        if ( timing === void 0 ) timing = 'linear';


        return Promise.all(toNodes(element).map(function (element) { return new Promise(function (resolve, reject) {

                for (var name in props) {
                    var value = css(element, name);
                    if (value === '') {
                        css(element, name, value);
                    }
                }

                var timer = setTimeout(function () { return trigger(element, 'transitionend'); }, duration);

                once(element, 'transitionend transitioncanceled', function (ref) {
                    var type = ref.type;

                    clearTimeout(timer);
                    removeClass(element, 'uk-transition');
                    css(element, {
                        'transition-property': '',
                        'transition-duration': '',
                        'transition-timing-function': ''
                    });
                    type === 'transitioncanceled' ? reject() : resolve();
                }, false, function (ref) {
                    var target = ref.target;

                    return element === target;
                });

                addClass(element, 'uk-transition');
                css(element, assign({
                    'transition-property': Object.keys(props).map(propName).join(','),
                    'transition-duration': (duration + "ms"),
                    'transition-timing-function': timing
                }, props));

            }); }
        ));

    }

    var Transition = {

        start: transition,

        stop: function(element) {
            trigger(element, 'transitionend');
            return Promise.resolve();
        },

        cancel: function(element) {
            trigger(element, 'transitioncanceled');
        },

        inProgress: function(element) {
            return hasClass(element, 'uk-transition');
        }

    };

    var animationPrefix = 'uk-animation-';
    var clsCancelAnimation = 'uk-cancel-animation';

    function animate(element, animation, duration, origin, out) {
        var arguments$1 = arguments;
        if ( duration === void 0 ) duration = 200;


        return Promise.all(toNodes(element).map(function (element) { return new Promise(function (resolve, reject) {

                if (hasClass(element, clsCancelAnimation)) {
                    requestAnimationFrame(function () { return Promise.resolve().then(function () { return animate.apply(void 0, arguments$1).then(resolve, reject); }
                        ); }
                    );
                    return;
                }

                var cls = animation + " " + animationPrefix + (out ? 'leave' : 'enter');

                if (startsWith(animation, animationPrefix)) {

                    if (origin) {
                        cls += " uk-transform-origin-" + origin;
                    }

                    if (out) {
                        cls += " " + animationPrefix + "reverse";
                    }

                }

                reset();

                once(element, 'animationend animationcancel', function (ref) {
                    var type = ref.type;


                    var hasReset = false;

                    if (type === 'animationcancel') {
                        reject();
                        reset();
                    } else {
                        resolve();
                        Promise.resolve().then(function () {
                            hasReset = true;
                            reset();
                        });
                    }

                    requestAnimationFrame(function () {
                        if (!hasReset) {
                            addClass(element, clsCancelAnimation);

                            requestAnimationFrame(function () { return removeClass(element, clsCancelAnimation); });
                        }
                    });

                }, false, function (ref) {
                    var target = ref.target;

                    return element === target;
                });

                css(element, 'animationDuration', (duration + "ms"));
                addClass(element, cls);

                function reset() {
                    css(element, 'animationDuration', '');
                    removeClasses(element, (animationPrefix + "\\S*"));
                }

            }); }
        ));

    }

    var inProgress = new RegExp((animationPrefix + "(enter|leave)"));
    var Animation = {

        in: function(element, animation, duration, origin) {
            return animate(element, animation, duration, origin, false);
        },

        out: function(element, animation, duration, origin) {
            return animate(element, animation, duration, origin, true);
        },

        inProgress: function(element) {
            return inProgress.test(attr(element, 'class'));
        },

        cancel: function(element) {
            trigger(element, 'animationcancel');
        }

    };

    var dirs = {
        width: ['x', 'left', 'right'],
        height: ['y', 'top', 'bottom']
    };

    function positionAt(element, target, elAttach, targetAttach, elOffset, targetOffset, flip, boundary) {

        elAttach = getPos(elAttach);
        targetAttach = getPos(targetAttach);

        var flipped = {element: elAttach, target: targetAttach};

        if (!element || !target) {
            return flipped;
        }

        var dim = getDimensions(element);
        var targetDim = getDimensions(target);
        var position = targetDim;

        moveTo(position, elAttach, dim, -1);
        moveTo(position, targetAttach, targetDim, 1);

        elOffset = getOffsets(elOffset, dim.width, dim.height);
        targetOffset = getOffsets(targetOffset, targetDim.width, targetDim.height);

        elOffset['x'] += targetOffset['x'];
        elOffset['y'] += targetOffset['y'];

        position.left += elOffset['x'];
        position.top += elOffset['y'];

        if (flip) {

            var boundaries = [getDimensions(window$1(element))];

            if (boundary) {
                boundaries.unshift(getDimensions(boundary));
            }

            each(dirs, function (ref, prop) {
                var dir = ref[0];
                var align = ref[1];
                var alignFlip = ref[2];


                if (!(flip === true || includes(flip, dir))) {
                    return;
                }

                boundaries.some(function (boundary) {

                    var elemOffset = elAttach[dir] === align
                        ? -dim[prop]
                        : elAttach[dir] === alignFlip
                            ? dim[prop]
                            : 0;

                    var targetOffset = targetAttach[dir] === align
                        ? targetDim[prop]
                        : targetAttach[dir] === alignFlip
                            ? -targetDim[prop]
                            : 0;

                    if (position[align] < boundary[align] || position[align] + dim[prop] > boundary[alignFlip]) {

                        var centerOffset = dim[prop] / 2;
                        var centerTargetOffset = targetAttach[dir] === 'center' ? -targetDim[prop] / 2 : 0;

                        return elAttach[dir] === 'center' && (
                            apply(centerOffset, centerTargetOffset)
                            || apply(-centerOffset, -centerTargetOffset)
                        ) || apply(elemOffset, targetOffset);

                    }

                    function apply(elemOffset, targetOffset) {

                        var newVal = position[align] + elemOffset + targetOffset - elOffset[dir] * 2;

                        if (newVal >= boundary[align] && newVal + dim[prop] <= boundary[alignFlip]) {
                            position[align] = newVal;

                            ['element', 'target'].forEach(function (el) {
                                flipped[el][dir] = !elemOffset
                                    ? flipped[el][dir]
                                    : flipped[el][dir] === dirs[prop][1]
                                        ? dirs[prop][2]
                                        : dirs[prop][1];
                            });

                            return true;
                        }

                    }

                });

            });
        }

        offset(element, position);

        return flipped;
    }

    function offset(element, coordinates) {

        element = toNode(element);

        if (coordinates) {

            var currentOffset = offset(element);
            var pos = css(element, 'position');

            ['left', 'top'].forEach(function (prop) {
                if (prop in coordinates) {
                    var value = css(element, prop);
                    css(element, prop, coordinates[prop] - currentOffset[prop]
                        + toFloat(pos === 'absolute' && value === 'auto'
                            ? position(element)[prop]
                            : value)
                    );
                }
            });

            return;
        }

        return getDimensions(element);
    }

    function getDimensions(element) {

        element = toNode(element);

        var ref = window$1(element);
        var top = ref.pageYOffset;
        var left = ref.pageXOffset;

        if (isWindow(element)) {

            var height = element.innerHeight;
            var width = element.innerWidth;

            return {
                top: top,
                left: left,
                height: height,
                width: width,
                bottom: top + height,
                right: left + width,
            };
        }

        var style, hidden;

        if (!isVisible(element)) {
            style = attr(element, 'style');
            hidden = attr(element, 'hidden');

            attr(element, {
                style: ((style || '') + ";display:block !important;"),
                hidden: null
            });
        }

        var rect = element.getBoundingClientRect();

        if (!isUndefined(style)) {
            attr(element, {style: style, hidden: hidden});
        }

        return {
            height: rect.height,
            width: rect.width,
            top: rect.top + top,
            left: rect.left + left,
            bottom: rect.bottom + top,
            right: rect.right + left,
        };
    }

    function position(element) {
        element = toNode(element);

        var parent = element.offsetParent || docEl(element);
        var parentOffset = offset(parent);
        var ref = ['top', 'left'].reduce(function (props, prop) {
            var propName$$1 = ucfirst(prop);
            props[prop] -= parentOffset[prop]
                + toFloat(css(element, ("margin" + propName$$1)))
                + toFloat(css(parent, ("border" + propName$$1 + "Width")));
            return props;
        }, offset(element));
        var top = ref.top;
        var left = ref.left;

        return {top: top, left: left};
    }

    var height = dimension('height');
    var width = dimension('width');

    function dimension(prop) {
        var propName$$1 = ucfirst(prop);
        return function (element, value) {

            element = toNode(element);

            if (isUndefined(value)) {

                if (isWindow(element)) {
                    return element[("inner" + propName$$1)];
                }

                if (isDocument(element)) {
                    var doc = element.documentElement;
                    return Math.max(doc[("offset" + propName$$1)], doc[("scroll" + propName$$1)]);
                }

                value = css(element, prop);
                value = value === 'auto' ? element[("offset" + propName$$1)] : toFloat(value) || 0;

                return value - boxModelAdjust(prop, element);

            } else {

                css(element, prop, !value && value !== 0
                    ? ''
                    : +value + boxModelAdjust(prop, element) + 'px'
                );

            }

        };
    }

    function boxModelAdjust(prop, element, sizing) {
        if ( sizing === void 0 ) sizing = 'border-box';

        return css(element, 'boxSizing') === sizing
            ? dirs[prop].slice(1).map(ucfirst).reduce(function (value, prop) { return value
                + toFloat(css(element, ("padding" + prop)))
                + toFloat(css(element, ("border" + prop + "Width"))); }
                , 0)
            : 0;
    }

    function moveTo(position, attach, dim, factor) {
        each(dirs, function (ref, prop) {
            var dir = ref[0];
            var align = ref[1];
            var alignFlip = ref[2];

            if (attach[dir] === alignFlip) {
                position[align] += dim[prop] * factor;
            } else if (attach[dir] === 'center') {
                position[align] += dim[prop] * factor / 2;
            }
        });
    }

    function getPos(pos) {

        var x = /left|center|right/;
        var y = /top|center|bottom/;

        pos = (pos || '').split(' ');

        if (pos.length === 1) {
            pos = x.test(pos[0])
                ? pos.concat(['center'])
                : y.test(pos[0])
                    ? ['center'].concat(pos)
                    : ['center', 'center'];
        }

        return {
            x: x.test(pos[0]) ? pos[0] : 'center',
            y: y.test(pos[1]) ? pos[1] : 'center'
        };
    }

    function getOffsets(offsets, width, height) {

        var ref = (offsets || '').split(' ');
        var x = ref[0];
        var y = ref[1];

        return {
            x: x ? toFloat(x) * (endsWith(x, '%') ? width / 100 : 1) : 0,
            y: y ? toFloat(y) * (endsWith(y, '%') ? height / 100 : 1) : 0
        };
    }

    function flipPosition(pos) {
        switch (pos) {
            case 'left':
                return 'right';
            case 'right':
                return 'left';
            case 'top':
                return 'bottom';
            case 'bottom':
                return 'top';
            default:
                return pos;
        }
    }

    function isInView(element, topOffset, leftOffset) {
        if ( topOffset === void 0 ) topOffset = 0;
        if ( leftOffset === void 0 ) leftOffset = 0;


        if (!isVisible(element)) {
            return false;
        }

        element = toNode(element);

        var win = window$1(element);
        var client = element.getBoundingClientRect();
        var bounding = {
            top: -topOffset,
            left: -leftOffset,
            bottom: topOffset + height(win),
            right: leftOffset + width(win)
        };

        return intersectRect(client, bounding) || pointInRect({x: client.left, y: client.top}, bounding);

    }

    function scrolledOver(element, heightOffset) {
        if ( heightOffset === void 0 ) heightOffset = 0;


        if (!isVisible(element)) {
            return 0;
        }

        element = toNode(element);

        var win = window$1(element);
        var doc = document$1(element);
        var elHeight = element.offsetHeight + heightOffset;
        var ref = offsetPosition(element);
        var top = ref[0];
        var vp = height(win);
        var vh = vp + Math.min(0, top - vp);
        var diff = Math.max(0, vp - (height(doc) + heightOffset - (top + elHeight)));

        return clamp(((vh + win.pageYOffset - top) / ((vh + (elHeight - (diff < vp ? diff : 0))) / 100)) / 100);
    }

    function scrollTop(element, top) {
        element = toNode(element);

        if (isWindow(element) || isDocument(element)) {
            var ref = window$1(element);
            var scrollTo = ref.scrollTo;
            var pageXOffset = ref.pageXOffset;
            scrollTo(pageXOffset, top);
        } else {
            element.scrollTop = top;
        }
    }

    function offsetPosition(element) {
        var offset = [0, 0];

        do {

            offset[0] += element.offsetTop;
            offset[1] += element.offsetLeft;

            if (css(element, 'position') === 'fixed') {
                var win = window$1(element);
                offset[0] += win.pageYOffset;
                offset[1] += win.pageXOffset;
                return offset;
            }

        } while ((element = element.offsetParent));

        return offset;
    }

    function window$1(element) {
        return isWindow(element) ? element : document$1(element).defaultView;
    }

    function document$1(element) {
        return toNode(element).ownerDocument;
    }

    function docEl(element) {
        return document$1(element).documentElement;
    }

    /*
        Based on:
        Copyright (c) 2016 Wilson Page wilsonpage@me.com
        https://github.com/wilsonpage/fastdom
    */

    var fastdom = {

        reads: [],
        writes: [],

        read: function(task) {
            this.reads.push(task);
            scheduleFlush();
            return task;
        },

        write: function(task) {
            this.writes.push(task);
            scheduleFlush();
            return task;
        },

        clear: function(task) {
            return remove$1(this.reads, task) || remove$1(this.writes, task);
        },

        flush: function() {

            runTasks(this.reads);
            runTasks(this.writes.splice(0, this.writes.length));

            this.scheduled = false;

            if (this.reads.length || this.writes.length) {
                scheduleFlush();
            }

        }

    };

    function scheduleFlush() {
        if (!fastdom.scheduled) {
            fastdom.scheduled = true;
            requestAnimationFrame(fastdom.flush.bind(fastdom));
        }
    }

    function runTasks(tasks) {
        var task;
        while ((task = tasks.shift())) {
            task();
        }
    }

    function remove$1(array, item) {
        var index = array.indexOf(item);
        return !!~index && !!array.splice(index, 1);
    }

    function MouseTracker() {}

    MouseTracker.prototype = {

        positions: [],
        position: null,

        init: function() {
            var this$1 = this;


            this.positions = [];
            this.position = null;

            var ticking = false;
            this.unbind = on(document, 'mousemove', function (e) {

                if (ticking) {
                    return;
                }

                setTimeout(function () {

                    var time = Date.now();
                    var ref = this$1.positions;
                    var length = ref.length;

                    if (length && (time - this$1.positions[length - 1].time > 100)) {
                        this$1.positions.splice(0, length);
                    }

                    this$1.positions.push({time: time, x: e.pageX, y: e.pageY});

                    if (this$1.positions.length > 5) {
                        this$1.positions.shift();
                    }

                    ticking = false;
                }, 5);

                ticking = true;
            });

        },

        cancel: function() {
            if (this.unbind) {
                this.unbind();
            }
        },

        movesTo: function(target) {

            if (this.positions.length < 2) {
                return false;
            }

            var p = offset(target);
            var position$$1 = this.positions[this.positions.length - 1];
            var ref = this.positions;
            var prevPos = ref[0];

            if (p.left <= position$$1.x && position$$1.x <= p.right && p.top <= position$$1.y && position$$1.y <= p.bottom) {
                return false;
            }

            var points = [
                [{x: p.left, y: p.top}, {x: p.right, y: p.bottom}],
                [{x: p.right, y: p.top}, {x: p.left, y: p.bottom}]
            ];

            if (p.right <= position$$1.x) ; else if (p.left >= position$$1.x) {
                points[0].reverse();
                points[1].reverse();
            } else if (p.bottom <= position$$1.y) {
                points[0].reverse();
            } else if (p.top >= position$$1.y) {
                points[1].reverse();
            }

            return !!points.reduce(function (result, point) {
                return result + (slope(prevPos, point[0]) < slope(position$$1, point[0]) && slope(prevPos, point[1]) > slope(position$$1, point[1]));
            }, 0);
        }

    };

    function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
    }

    var strats = {};

    strats.events =
    strats.created =
    strats.beforeConnect =
    strats.connected =
    strats.beforeDisconnect =
    strats.disconnected =
    strats.destroy = concatStrat;

    // args strategy
    strats.args = function (parentVal, childVal) {
        return concatStrat(childVal || parentVal);
    };

    // update strategy
    strats.update = function (parentVal, childVal) {
        return sortBy(concatStrat(parentVal, isFunction(childVal) ? {read: childVal} : childVal), 'order');
    };

    // property strategy
    strats.props = function (parentVal, childVal) {

        if (isArray(childVal)) {
            childVal = childVal.reduce(function (value, key) {
                value[key] = String;
                return value;
            }, {});
        }

        return strats.methods(parentVal, childVal);
    };

    // extend strategy
    strats.computed =
    strats.methods = function (parentVal, childVal) {
        return childVal
            ? parentVal
                ? assign({}, parentVal, childVal)
                : childVal
            : parentVal;
    };

    // data strategy
    strats.data = function (parentVal, childVal, vm) {

        if (!vm) {

            if (!childVal) {
                return parentVal;
            }

            if (!parentVal) {
                return childVal;
            }

            return function (vm) {
                return mergeFnData(parentVal, childVal, vm);
            };

        }

        return mergeFnData(parentVal, childVal, vm);
    };

    function mergeFnData(parentVal, childVal, vm) {
        return strats.computed(
            isFunction(parentVal)
                ? parentVal.call(vm, vm)
                : parentVal,
            isFunction(childVal)
                ? childVal.call(vm, vm)
                : childVal
        );
    }

    // concat strategy
    function concatStrat(parentVal, childVal) {

        parentVal = parentVal && !isArray(parentVal) ? [parentVal] : parentVal;

        return childVal
            ? parentVal
                ? parentVal.concat(childVal)
                : isArray(childVal)
                    ? childVal
                    : [childVal]
            : parentVal;
    }

    // default strategy
    function defaultStrat(parentVal, childVal) {
        return isUndefined(childVal) ? parentVal : childVal;
    }

    function mergeOptions(parent, child, vm) {

        var options = {};

        if (isFunction(child)) {
            child = child.options;
        }

        if (child.extends) {
            parent = mergeOptions(parent, child.extends, vm);
        }

        if (child.mixins) {
            for (var i = 0, l = child.mixins.length; i < l; i++) {
                parent = mergeOptions(parent, child.mixins[i], vm);
            }
        }

        for (var key in parent) {
            mergeKey(key);
        }

        for (var key$1 in child) {
            if (!hasOwn(parent, key$1)) {
                mergeKey(key$1);
            }
        }

        function mergeKey(key) {
            options[key] = (strats[key] || defaultStrat)(parent[key], child[key], vm);
        }

        return options;
    }

    function parseOptions(options, args) {
        var obj;

        if ( args === void 0 ) args = [];

        try {

            return !options
                ? {}
                : startsWith(options, '{')
                    ? JSON.parse(options)
                    : args.length && !includes(options, ':')
                        ? (( obj = {}, obj[args[0]] = options, obj ))
                        : options.split(';').reduce(function (options, option) {
                            var ref = option.split(/:(.*)/);
                            var key = ref[0];
                            var value = ref[1];
                            if (key && !isUndefined(value)) {
                                options[key.trim()] = value.trim();
                            }
                            return options;
                        }, {});

        } catch (e) {
            return {};
        }

    }

    var id = 0;

    var Player = function(el) {
        this.id = ++id;
        this.el = toNode(el);
    };

    Player.prototype.isVideo = function () {
        return this.isYoutube() || this.isVimeo() || this.isHTML5();
    };

    Player.prototype.isHTML5 = function () {
        return this.el.tagName === 'VIDEO';
    };

    Player.prototype.isIFrame = function () {
        return this.el.tagName === 'IFRAME';
    };

    Player.prototype.isYoutube = function () {
        return this.isIFrame() && !!this.el.src.match(/\/\/.*?youtube(-nocookie)?\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/);
    };

    Player.prototype.isVimeo = function () {
        return this.isIFrame() && !!this.el.src.match(/vimeo\.com\/video\/.*/);
    };

    Player.prototype.enableApi = function () {
            var this$1 = this;


        if (this.ready) {
            return this.ready;
        }

        var youtube = this.isYoutube();
        var vimeo = this.isVimeo();

        var poller;

        if (youtube || vimeo) {

            return this.ready = new Promise(function (resolve) {

                once(this$1.el, 'load', function () {
                    if (youtube) {
                        var listener = function () { return post(this$1.el, {event: 'listening', id: this$1.id}); };
                        poller = setInterval(listener, 100);
                        listener();
                    }
                });

                listen(function (data$$1) { return youtube && data$$1.id === this$1.id && data$$1.event === 'onReady' || vimeo && Number(data$$1.player_id) === this$1.id; })
                    .then(function () {
                        resolve();
                        poller && clearInterval(poller);
                    });

                attr(this$1.el, 'src', ("" + (this$1.el.src) + (includes(this$1.el.src, '?') ? '&' : '?') + (youtube ? 'enablejsapi=1' : ("api=1&player_id=" + (this$1.id)))));

            });

        }

        return Promise.resolve();

    };

    Player.prototype.play = function () {
            var this$1 = this;


        if (!this.isVideo()) {
            return;
        }

        if (this.isIFrame()) {
            this.enableApi().then(function () { return post(this$1.el, {func: 'playVideo', method: 'play'}); });
        } else if (this.isHTML5()) {
            try {
                var promise = this.el.play();

                if (promise) {
                    promise.catch(noop);
                }
            } catch (e) {}
        }
    };

    Player.prototype.pause = function () {
            var this$1 = this;


        if (!this.isVideo()) {
            return;
        }

        if (this.isIFrame()) {
            this.enableApi().then(function () { return post(this$1.el, {func: 'pauseVideo', method: 'pause'}); });
        } else if (this.isHTML5()) {
            this.el.pause();
        }
    };

    Player.prototype.mute = function () {
            var this$1 = this;


        if (!this.isVideo()) {
            return;
        }

        if (this.isIFrame()) {
            this.enableApi().then(function () { return post(this$1.el, {func: 'mute', method: 'setVolume', value: 0}); });
        } else if (this.isHTML5()) {
            this.el.muted = true;
            attr(this.el, 'muted', '');
        }

    };

    function post(el, cmd) {
        try {
            el.contentWindow.postMessage(JSON.stringify(assign({event: 'command'}, cmd)), '*');
        } catch (e) {}
    }

    function listen(cb) {

        return new Promise(function (resolve) {

            once(window, 'message', function (_, data$$1) { return resolve(data$$1); }, false, function (ref) {
                var data$$1 = ref.data;


                if (!data$$1 || !isString(data$$1)) {
                    return;
                }

                try {
                    data$$1 = JSON.parse(data$$1);
                } catch (e) {
                    return;
                }

                return data$$1 && cb(data$$1);

            });

        });

    }

    var touch = {}, swipeTimeout, touching;

    on(document, pointerDown, function (e) {

        if (touch.el) {
            touch = {};
        }

        var target = e.target;
        var ref = getPos$1(e);
        var x = ref.x;
        var y = ref.y;

        touch.el = 'tagName' in target ? target : target.parentNode;
        touch.x = x;
        touch.y = y;

        touching = true;

    });

    on(document, pointerUp, function (e) {

        var ref = getPos$1(e);
        var x = ref.x;
        var y = ref.y;

        // swipe
        if (touch.el && x && Math.abs(touch.x - x) > 100 || y && Math.abs(touch.y - y) > 100) {

            swipeTimeout = setTimeout(function () {
                if (touch.el) {
                    trigger(touch.el, 'swipe');
                    trigger(touch.el, ("swipe" + (swipeDirection(touch.x, touch.y, x, y))));
                }
                touch = {};
            });

        } else {
            touch = {};
        }

        setTimeout(function () { return touching = false; });

    });

    on(document, pointerCancel, cancelAll);

    function isTouch(e) {
        return e.pointerType === 'touch' || e.touches || touching;
    }

    function getPos$1(e, prop) {
        if ( prop === void 0 ) prop = 'client';

        var touches = e.touches;
        var changedTouches = e.changedTouches;
        var ref = touches && touches[0] || changedTouches && changedTouches[0] || e;
        var x = ref[(prop + "X")];
        var y = ref[(prop + "Y")];

        return {x: x, y: y};
    }

    function swipeDirection(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) >= Math.abs(y1 - y2)
            ? x1 - x2 > 0
                ? 'Left'
                : 'Right'
            : y1 - y2 > 0
                ? 'Up'
                : 'Down';
    }

    function cancelAll() {
        swipeTimeout && clearTimeout(swipeTimeout);
        swipeTimeout = null;
        touch = {};
    }



    var util = /*#__PURE__*/Object.freeze({
        ajax: ajax,
        getImage: getImage,
        transition: transition,
        Transition: Transition,
        animate: animate,
        Animation: Animation,
        attr: attr,
        hasAttr: hasAttr,
        removeAttr: removeAttr,
        data: data,
        addClass: addClass,
        removeClass: removeClass,
        removeClasses: removeClasses,
        replaceClass: replaceClass,
        hasClass: hasClass,
        toggleClass: toggleClass,
        positionAt: positionAt,
        offset: offset,
        position: position,
        height: height,
        width: width,
        boxModelAdjust: boxModelAdjust,
        flipPosition: flipPosition,
        isInView: isInView,
        scrolledOver: scrolledOver,
        scrollTop: scrollTop,
        offsetPosition: offsetPosition,
        isReady: isReady,
        ready: ready,
        index: index,
        getIndex: getIndex,
        empty: empty,
        html: html,
        prepend: prepend,
        append: append,
        before: before,
        after: after,
        remove: remove,
        wrapAll: wrapAll,
        wrapInner: wrapInner,
        unwrap: unwrap,
        fragment: fragment,
        apply: apply,
        $: $,
        $$: $$,
        isIE: isIE,
        isRtl: isRtl,
        hasTouch: hasTouch,
        pointerDown: pointerDown,
        pointerMove: pointerMove,
        pointerUp: pointerUp,
        pointerEnter: pointerEnter,
        pointerLeave: pointerLeave,
        pointerCancel: pointerCancel,
        on: on,
        off: off,
        once: once,
        trigger: trigger,
        createEvent: createEvent,
        toEventTargets: toEventTargets,
        preventClick: preventClick,
        fastdom: fastdom,
        isVoidElement: isVoidElement,
        isVisible: isVisible,
        selInput: selInput,
        isInput: isInput,
        filter: filter,
        within: within,
        bind: bind,
        hasOwn: hasOwn,
        hyphenate: hyphenate,
        camelize: camelize,
        ucfirst: ucfirst,
        startsWith: startsWith,
        endsWith: endsWith,
        includes: includes,
        isArray: isArray,
        isFunction: isFunction,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isWindow: isWindow,
        isDocument: isDocument,
        isJQuery: isJQuery,
        isNode: isNode,
        isNodeCollection: isNodeCollection,
        isBoolean: isBoolean,
        isString: isString,
        isNumber: isNumber,
        isNumeric: isNumeric,
        isUndefined: isUndefined,
        toBoolean: toBoolean,
        toNumber: toNumber,
        toFloat: toFloat,
        toNode: toNode,
        toNodes: toNodes,
        toList: toList,
        toMs: toMs,
        swap: swap,
        assign: assign,
        each: each,
        sortBy: sortBy,
        clamp: clamp,
        noop: noop,
        intersectRect: intersectRect,
        pointInRect: pointInRect,
        Dimensions: Dimensions,
        MouseTracker: MouseTracker,
        mergeOptions: mergeOptions,
        parseOptions: parseOptions,
        Player: Player,
        Promise: Promise,
        Deferred: Deferred,
        query: query,
        queryAll: queryAll,
        find: find,
        findAll: findAll,
        matches: matches,
        closest: closest,
        parents: parents,
        escape: escape,
        css: css,
        getStyles: getStyles,
        getStyle: getStyle,
        getCssVar: getCssVar,
        propName: propName,
        isTouch: isTouch,
        getPos: getPos$1
    });

    function componentAPI (UIkit) {

        var DATA = UIkit.data;

        var components = {};

        UIkit.component = function (name, options) {

            if (!options) {

                if (isPlainObject(components[name])) {
                    components[name] = UIkit.extend(components[name]);
                }

                return components[name];

            }

            UIkit[name] = function (element, data$$1) {
                var i = arguments.length, argsArray = Array(i);
                while ( i-- ) argsArray[i] = arguments[i];


                var component = UIkit.component(name);

                if (isPlainObject(element)) {
                    return new component({data: element});
                }

                if (component.options.functional) {
                    return new component({data: [].concat( argsArray )});
                }

                return element && element.nodeType ? init(element) : $$(element).map(init)[0];

                function init(element) {

                    var instance = UIkit.getComponent(element, name);

                    if (instance) {
                        if (!data$$1) {
                            return instance;
                        } else {
                            instance.$destroy();
                        }
                    }

                    return new component({el: element, data: data$$1});

                }

            };

            var opt = isPlainObject(options) ? assign({}, options) : options.options;

            opt.name = name;

            if (opt.install) {
                opt.install(UIkit, opt, name);
            }

            if (UIkit._initialized && !opt.functional) {
                var id = hyphenate(name);
                fastdom.read(function () { return UIkit[name](("[uk-" + id + "],[data-uk-" + id + "]")); });
            }

            return components[name] = isPlainObject(options) ? opt : options;
        };

        UIkit.getComponents = function (element) { return element && element[DATA] || {}; };
        UIkit.getComponent = function (element, name) { return UIkit.getComponents(element)[name]; };

        UIkit.connect = function (node) {

            if (node[DATA]) {
                for (var name in node[DATA]) {
                    node[DATA][name]._callConnected();
                }
            }

            for (var i = 0; i < node.attributes.length; i++) {

                var name$1 = getComponentName(node.attributes[i].name);

                if (name$1 && name$1 in components) {
                    UIkit[name$1](node);
                }

            }

        };

        UIkit.disconnect = function (node) {
            for (var name in node[DATA]) {
                node[DATA][name]._callDisconnected();
            }
        };

    }

    function getComponentName(attribute) {
        return startsWith(attribute, 'uk-') || startsWith(attribute, 'data-uk-')
            ? camelize(attribute.replace('data-uk-', '').replace('uk-', ''))
            : false;
    }

    function boot (UIkit) {

        var connect = UIkit.connect;
        var disconnect = UIkit.disconnect;

        if (!('MutationObserver' in window)) {
            return;
        }

        if (document.body) {

            init();

        } else {

            (new MutationObserver(function () {

                if (document.body) {
                    this.disconnect();
                    init();
                }

            })).observe(document, {childList: true, subtree: true});

        }

        function init() {

            apply$$1(document.body, connect);

            fastdom.flush();

            (new MutationObserver(function (mutations) { return mutations.forEach(applyMutation); })).observe(document, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true
            });

            UIkit._initialized = true;
        }

        function applyMutation(mutation) {

            var target = mutation.target;
            var type = mutation.type;

            var update = type !== 'attributes'
                ? applyChildList(mutation)
                : applyAttribute(mutation);

            update && UIkit.update(target);

        }

        function applyAttribute(ref) {
            var target = ref.target;
            var attributeName = ref.attributeName;


            if (attributeName === 'href') {
                return true;
            }

            var name = getComponentName(attributeName);

            if (!name || !(name in UIkit)) {
                return;
            }

            if (hasAttr(target, attributeName)) {
                UIkit[name](target);
                return true;
            }

            var component = UIkit.getComponent(target, name);

            if (component) {
                component.$destroy();
                return true;
            }

        }

        function applyChildList(ref) {
            var addedNodes = ref.addedNodes;
            var removedNodes = ref.removedNodes;


            for (var i = 0; i < addedNodes.length; i++) {
                apply$$1(addedNodes[i], connect);
            }

            for (var i$1 = 0; i$1 < removedNodes.length; i$1++) {
                apply$$1(removedNodes[i$1], disconnect);
            }

            return true;
        }

        function apply$$1(node, fn) {

            if (node.nodeType !== 1 || hasAttr(node, 'uk-no-boot')) {
                return;
            }

            fn(node);
            node = node.firstElementChild;
            while (node) {
                var next = node.nextElementSibling;
                apply$$1(node, fn);
                node = next;
            }
        }

    }

    function globalAPI (UIkit) {

        var DATA = UIkit.data;

        UIkit.use = function (plugin) {

            if (plugin.installed) {
                return;
            }

            plugin.call(null, this);
            plugin.installed = true;

            return this;
        };

        UIkit.mixin = function (mixin, component) {
            component = (isString(component) ? UIkit.component(component) : component) || this;
            component.options = mergeOptions(component.options, mixin);
        };

        UIkit.extend = function (options) {

            options = options || {};

            var Super = this;
            var Sub = function UIkitComponent (options) {
                this._init(options);
            };

            Sub.prototype = Object.create(Super.prototype);
            Sub.prototype.constructor = Sub;
            Sub.options = mergeOptions(Super.options, options);

            Sub.super = Super;
            Sub.extend = Super.extend;

            return Sub;
        };

        UIkit.update = function (element, e) {

            e = createEvent(e || 'update');
            element = element ? toNode(element) : document.body;

            path(element, function (element) { return update(element[DATA], e); });
            apply(element, function (element) { return update(element[DATA], e); });

        };

        var container;
        Object.defineProperty(UIkit, 'container', {

            get: function() {
                return container || document.body;
            },

            set: function(element) {
                container = $(element);
            }

        });

        function update(data$$1, e) {

            if (!data$$1) {
                return;
            }

            for (var name in data$$1) {
                if (data$$1[name]._connected) {
                    data$$1[name]._callUpdate(e);
                }
            }

        }

        function path(node, fn) {
            if (node && node !== document.body && node.parentNode) {
                path(node.parentNode, fn);
                fn(node.parentNode);
            }
        }

    }

    function hooksAPI (UIkit) {

        UIkit.prototype._callHook = function (hook) {
            var this$1 = this;


            var handlers = this.$options[hook];

            if (handlers) {
                handlers.forEach(function (handler) { return handler.call(this$1); });
            }
        };

        UIkit.prototype._callConnected = function () {

            if (this._connected) {
                return;
            }

            this._data = {};
            this._initProps();

            this._callHook('beforeConnect');
            this._connected = true;

            this._initEvents();
            this._initObserver();

            this._callHook('connected');
            this._callUpdate();
        };

        UIkit.prototype._callDisconnected = function () {

            if (!this._connected) {
                return;
            }

            this._callHook('beforeDisconnect');

            if (this._observer) {
                this._observer.disconnect();
                this._observer = null;
            }

            this._unbindEvents();
            this._callHook('disconnected');

            this._connected = false;

        };

        UIkit.prototype._callUpdate = function (e) {
            var this$1 = this;


            e = createEvent(e || 'update');

            var type = e.type;

            if (includes(['update', 'load', 'resize'], type)) {
                this._resetComputeds();
            }

            var updates = this.$options.update;
            var ref = this._frames;
            var reads = ref.reads;
            var writes = ref.writes;

            if (!updates) {
                return;
            }

            updates.forEach(function (ref, i) {
                var read = ref.read;
                var write = ref.write;
                var events = ref.events;


                if (type !== 'update' && !includes(events, type)) {
                    return;
                }

                if (read && !includes(fastdom.reads, reads[i])) {
                    reads[i] = fastdom.read(function () {

                        var result = this$1._connected && read.call(this$1, this$1._data, e);

                        if (result === false && write) {
                            fastdom.clear(writes[i]);
                        } else if (isPlainObject(result)) {
                            assign(this$1._data, result);
                        }
                    });
                }

                if (write && !includes(fastdom.writes, writes[i])) {
                    writes[i] = fastdom.write(function () { return this$1._connected && write.call(this$1, this$1._data, e); });
                }

            });

        };

    }

    function stateAPI (UIkit) {

        var uid = 0;

        UIkit.prototype._init = function (options) {

            options = options || {};
            options.data = normalizeData(options, this.constructor.options);

            this.$options = mergeOptions(this.constructor.options, options, this);
            this.$el = null;
            this.$props = {};

            this._frames = {reads: {}, writes: {}};
            this._events = [];

            this._uid = uid++;
            this._initData();
            this._initMethods();
            this._initComputeds();
            this._callHook('created');

            if (options.el) {
                this.$mount(options.el);
            }
        };

        UIkit.prototype._initData = function () {

            var ref = this.$options;
            var data$$1 = ref.data; if ( data$$1 === void 0 ) data$$1 = {};

            for (var key in data$$1) {
                this.$props[key] = this[key] = data$$1[key];
            }
        };

        UIkit.prototype._initMethods = function () {

            var ref = this.$options;
            var methods = ref.methods;

            if (methods) {
                for (var key in methods) {
                    this[key] = bind(methods[key], this);
                }
            }
        };

        UIkit.prototype._initComputeds = function () {

            var ref = this.$options;
            var computed = ref.computed;

            this._resetComputeds();

            if (computed) {
                for (var key in computed) {
                    registerComputed(this, key, computed[key]);
                }
            }
        };

        UIkit.prototype._resetComputeds = function () {
            this._computeds = {};
        };

        UIkit.prototype._initProps = function (props) {

            var key;

            this._resetComputeds();

            props = props || getProps(this.$options, this.$name);

            for (key in props) {
                if (!isUndefined(props[key])) {
                    this.$props[key] = props[key];
                }
            }

            var exclude = [this.$options.computed, this.$options.methods];
            for (key in this.$props) {
                if (key in props && notIn(exclude, key)) {
                    this[key] = this.$props[key];
                }
            }
        };

        UIkit.prototype._initEvents = function () {
            var this$1 = this;


            var ref = this.$options;
            var events = ref.events;

            if (events) {

                events.forEach(function (event) {

                    if (!hasOwn(event, 'handler')) {
                        for (var key in event) {
                            registerEvent(this$1, event[key], key);
                        }
                    } else {
                        registerEvent(this$1, event);
                    }

                });
            }
        };

        UIkit.prototype._unbindEvents = function () {
            this._events.forEach(function (unbind) { return unbind(); });
            this._events = [];
        };

        UIkit.prototype._initObserver = function () {
            var this$1 = this;


            var ref = this.$options;
            var attrs = ref.attrs;
            var props = ref.props;
            var el = ref.el;
            if (this._observer || !props || attrs === false) {
                return;
            }

            attrs = isArray(attrs) ? attrs : Object.keys(props);

            this._observer = new MutationObserver(function () {

                var data$$1 = getProps(this$1.$options, this$1.$name);
                if (attrs.some(function (key) { return !isUndefined(data$$1[key]) && data$$1[key] !== this$1.$props[key]; })) {
                    this$1.$reset();
                }

            });

            var filter$$1 = attrs.map(function (key) { return hyphenate(key); }).concat(this.$name);

            this._observer.observe(el, {
                attributes: true,
                attributeFilter: filter$$1.concat(filter$$1.map(function (key) { return ("data-" + key); }))
            });
        };

        function getProps(opts, name) {

            var data$$1 = {};
            var args = opts.args; if ( args === void 0 ) args = [];
            var props = opts.props; if ( props === void 0 ) props = {};
            var el = opts.el;

            if (!props) {
                return data$$1;
            }

            for (var key in props) {
                var prop = hyphenate(key);
                var value = data(el, prop);

                if (!isUndefined(value)) {

                    value = props[key] === Boolean && value === ''
                        ? true
                        : coerce(props[key], value);

                    if (prop === 'target' && (!value || startsWith(value, '_'))) {
                        continue;
                    }

                    data$$1[key] = value;
                }
            }

            var options = parseOptions(data(el, name), args);

            for (var key$1 in options) {
                var prop$1 = camelize(key$1);
                if (props[prop$1] !== undefined) {
                    data$$1[prop$1] = coerce(props[prop$1], options[key$1]);
                }
            }

            return data$$1;
        }

        function registerComputed(component, key, cb) {
            Object.defineProperty(component, key, {

                enumerable: true,

                get: function() {

                    var _computeds = component._computeds;
                    var $props = component.$props;
                    var $el = component.$el;

                    if (!hasOwn(_computeds, key)) {
                        _computeds[key] = (cb.get || cb).call(component, $props, $el);
                    }

                    return _computeds[key];
                },

                set: function(value) {

                    var _computeds = component._computeds;

                    _computeds[key] = cb.set ? cb.set.call(component, value) : value;

                    if (isUndefined(_computeds[key])) {
                        delete _computeds[key];
                    }
                }

            });
        }

        function registerEvent(component, event, key) {

            if (!isPlainObject(event)) {
                event = ({name: key, handler: event});
            }

            var name = event.name;
            var el = event.el;
            var handler = event.handler;
            var capture = event.capture;
            var passive = event.passive;
            var delegate = event.delegate;
            var filter$$1 = event.filter;
            var self = event.self;
            el = isFunction(el)
                ? el.call(component)
                : el || component.$el;

            if (isArray(el)) {
                el.forEach(function (el) { return registerEvent(component, assign({}, event, {el: el}), key); });
                return;
            }

            if (!el || filter$$1 && !filter$$1.call(component)) {
                return;
            }

            handler = detail(isString(handler) ? component[handler] : bind(handler, component));

            if (self) {
                handler = selfFilter(handler);
            }

            component._events.push(
                on(
                    el,
                    name,
                    !delegate
                        ? null
                        : isString(delegate)
                            ? delegate
                            : delegate.call(component),
                    handler,
                    isBoolean(passive)
                        ? {passive: passive, capture: capture}
                        : capture
                )
            );

        }

        function selfFilter(handler) {
            return function selfHandler(e) {
                if (e.target === e.currentTarget || e.target === e.current) {
                    return handler.call(null, e);
                }
            };
        }

        function notIn(options, key) {
            return options.every(function (arr) { return !arr || !hasOwn(arr, key); });
        }

        function detail(listener) {
            return function (e) { return isArray(e.detail) ? listener.apply(void 0, [e].concat(e.detail)) : listener(e); };
        }

        function coerce(type, value) {

            if (type === Boolean) {
                return toBoolean(value);
            } else if (type === Number) {
                return toNumber(value);
            } else if (type === 'list') {
                return toList(value);
            }

            return type ? type(value) : value;
        }

        function normalizeData(ref, ref$1) {
            var data$$1 = ref.data;
            var el = ref.el;
            var args = ref$1.args;
            var props = ref$1.props; if ( props === void 0 ) props = {};

            data$$1 = isArray(data$$1)
                ? args && args.length
                    ? data$$1.slice(0, args.length).reduce(function (data$$1, value, index$$1) {
                        if (isPlainObject(value)) {
                            assign(data$$1, value);
                        } else {
                            data$$1[args[index$$1]] = value;
                        }
                        return data$$1;
                    }, {})
                    : undefined
                : data$$1;

            if (data$$1) {
                for (var key in data$$1) {
                    if (isUndefined(data$$1[key])) {
                        delete data$$1[key];
                    } else {
                        data$$1[key] = props[key] ? coerce(props[key], data$$1[key], el) : data$$1[key];
                    }
                }
            }

            return data$$1;
        }
    }

    function instanceAPI (UIkit) {

        var DATA = UIkit.data;

        UIkit.prototype.$mount = function (el) {

            var ref = this.$options;
            var name = ref.name;

            if (!el[DATA]) {
                el[DATA] = {};
            }

            if (el[DATA][name]) {
                return;
            }

            el[DATA][name] = this;

            this.$el = this.$options.el = this.$options.el || el;

            if (within(el, document)) {
                this._callConnected();
            }
        };

        UIkit.prototype.$emit = function (e) {
            this._callUpdate(e);
        };

        UIkit.prototype.$reset = function () {
            this._callDisconnected();
            this._callConnected();
        };

        UIkit.prototype.$destroy = function (removeEl) {
            if ( removeEl === void 0 ) removeEl = false;


            var ref = this.$options;
            var el = ref.el;
            var name = ref.name;

            if (el) {
                this._callDisconnected();
            }

            this._callHook('destroy');

            if (!el || !el[DATA]) {
                return;
            }

            delete el[DATA][name];

            if (!Object.keys(el[DATA]).length) {
                delete el[DATA];
            }

            if (removeEl) {
                remove(this.$el);
            }
        };

        UIkit.prototype.$create = function (component, element, data$$1) {
            return UIkit[component](element, data$$1);
        };

        UIkit.prototype.$update = UIkit.update;
        UIkit.prototype.$getComponent = UIkit.getComponent;

        var names = {};
        Object.defineProperties(UIkit.prototype, {

            $container: Object.getOwnPropertyDescriptor(UIkit, 'container'),

            $name: {

                get: function() {
                    var ref = this.$options;
                    var name = ref.name;

                    if (!names[name]) {
                        names[name] = UIkit.prefix + hyphenate(name);
                    }

                    return names[name];
                }

            }

        });

    }

    var UIkit = function (options) {
        this._init(options);
    };

    UIkit.util = util;
    UIkit.data = '__uikit__';
    UIkit.prefix = 'uk-';
    UIkit.options = {};

    globalAPI(UIkit);
    hooksAPI(UIkit);
    stateAPI(UIkit);
    componentAPI(UIkit);
    instanceAPI(UIkit);

    var Class = {

        connected: function() {
            !hasClass(this.$el, this.$name) && addClass(this.$el, this.$name);
        }

    };

    var Togglable = {

        props: {
            cls: Boolean,
            animation: 'list',
            duration: Number,
            origin: String,
            transition: String,
            queued: Boolean
        },

        data: {
            cls: false,
            animation: [false],
            duration: 200,
            origin: false,
            transition: 'linear',
            queued: false,

            initProps: {
                overflow: '',
                height: '',
                paddingTop: '',
                paddingBottom: '',
                marginTop: '',
                marginBottom: ''
            },

            hideProps: {
                overflow: 'hidden',
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0
            }

        },

        computed: {

            hasAnimation: function(ref) {
                var animation = ref.animation;

                return !!animation[0];
            },

            hasTransition: function(ref) {
                var animation = ref.animation;

                return this.hasAnimation && animation[0] === true;
            }

        },

        methods: {

            toggleElement: function(targets, show, animate$$1) {
                var this$1 = this;

                return new Promise(function (resolve) {

                    targets = toNodes(targets);

                    var all = function (targets) { return Promise.all(targets.map(function (el) { return this$1._toggleElement(el, show, animate$$1); })); };
                    var toggled = targets.filter(function (el) { return this$1.isToggled(el); });
                    var untoggled = targets.filter(function (el) { return !includes(toggled, el); });

                    var p;

                    if (!this$1.queued || !isUndefined(animate$$1) || !isUndefined(show) || !this$1.hasAnimation || targets.length < 2) {

                        p = all(untoggled.concat(toggled));

                    } else {

                        var body = document.body;
                        var scroll = body.scrollTop;
                        var el = toggled[0];
                        var inProgress = Animation.inProgress(el) && hasClass(el, 'uk-animation-leave')
                                || Transition.inProgress(el) && el.style.height === '0px';

                        p = all(toggled);

                        if (!inProgress) {
                            p = p.then(function () {
                                var p = all(untoggled);
                                body.scrollTop = scroll;
                                return p;
                            });
                        }

                    }

                    p.then(resolve, noop);

                });
            },

            toggleNow: function(targets, show) {
                var this$1 = this;

                return new Promise(function (resolve) { return Promise.all(toNodes(targets).map(function (el) { return this$1._toggleElement(el, show, false); })).then(resolve, noop); });
            },

            isToggled: function(el) {
                var nodes = toNodes(el || this.$el);
                return this.cls
                    ? hasClass(nodes, this.cls.split(' ')[0])
                    : !hasAttr(nodes, 'hidden');
            },

            updateAria: function(el) {
                if (this.cls === false) {
                    attr(el, 'aria-hidden', !this.isToggled(el));
                }
            },

            _toggleElement: function(el, show, animate$$1) {
                var this$1 = this;


                show = isBoolean(show)
                    ? show
                    : Animation.inProgress(el)
                        ? hasClass(el, 'uk-animation-leave')
                        : Transition.inProgress(el)
                            ? el.style.height === '0px'
                            : !this.isToggled(el);

                if (!trigger(el, ("before" + (show ? 'show' : 'hide')), [this])) {
                    return Promise.reject();
                }

                var promise = (
                    isFunction(animate$$1)
                        ? animate$$1
                        : animate$$1 === false || !this.hasAnimation
                            ? this._toggle
                            : this.hasTransition
                                ? toggleHeight(this)
                                : toggleAnimation(this)
                )(el, show);

                trigger(el, show ? 'show' : 'hide', [this]);

                var final = function () {
                    trigger(el, show ? 'shown' : 'hidden', [this$1]);
                    this$1.$update(el);
                };

                return promise ? promise.then(final) : Promise.resolve(final());
            },

            _toggle: function(el, toggled) {

                if (!el) {
                    return;
                }

                var changed;
                if (this.cls) {
                    changed = includes(this.cls, ' ') || Boolean(toggled) !== hasClass(el, this.cls);
                    changed && toggleClass(el, this.cls, includes(this.cls, ' ') ? undefined : toggled);
                } else {
                    changed = Boolean(toggled) === hasAttr(el, 'hidden');
                    changed && attr(el, 'hidden', !toggled ? '' : null);
                }

                $$('[autofocus]', el).some(function (el) { return isVisible(el) && (el.focus() || true); });

                this.updateAria(el);
                changed && this.$update(el);
            }

        }

    };

    function toggleHeight(ref) {
        var isToggled = ref.isToggled;
        var duration = ref.duration;
        var initProps = ref.initProps;
        var hideProps = ref.hideProps;
        var transition$$1 = ref.transition;
        var _toggle = ref._toggle;

        return function (el, show) {

            var inProgress = Transition.inProgress(el);
            var inner = el.hasChildNodes ? toFloat(css(el.firstElementChild, 'marginTop')) + toFloat(css(el.lastElementChild, 'marginBottom')) : 0;
            var currentHeight = isVisible(el) ? height(el) + (inProgress ? 0 : inner) : 0;

            Transition.cancel(el);

            if (!isToggled(el)) {
                _toggle(el, true);
            }

            height(el, '');

            // Update child components first
            fastdom.flush();

            var endHeight = height(el) + (inProgress ? 0 : inner);
            height(el, currentHeight);

            return (show
                    ? Transition.start(el, assign({}, initProps, {overflow: 'hidden', height: endHeight}), Math.round(duration * (1 - currentHeight / endHeight)), transition$$1)
                    : Transition.start(el, hideProps, Math.round(duration * (currentHeight / endHeight)), transition$$1).then(function () { return _toggle(el, false); })
            ).then(function () { return css(el, initProps); });

        };
    }

    function toggleAnimation(ref) {
        var animation = ref.animation;
        var duration = ref.duration;
        var origin = ref.origin;
        var _toggle = ref._toggle;

        return function (el, show) {

            Animation.cancel(el);

            if (show) {
                _toggle(el, true);
                return Animation.in(el, animation[0], duration, origin);
            }

            return Animation.out(el, animation[1] || animation[0], duration, origin).then(function () { return _toggle(el, false); });
        };
    }

    var Accordion = {

        mixins: [Class, Togglable],

        props: {
            targets: String,
            active: null,
            collapsible: Boolean,
            multiple: Boolean,
            toggle: String,
            content: String,
            transition: String
        },

        data: {
            targets: '> *',
            active: false,
            animation: [true],
            collapsible: true,
            multiple: false,
            clsOpen: 'uk-open',
            toggle: '> .uk-accordion-title',
            content: '> .uk-accordion-content',
            transition: 'ease'
        },

        computed: {

            items: function(ref, $el) {
                var targets = ref.targets;

                return $$(targets, $el);
            }

        },

        events: [

            {

                name: 'click',

                delegate: function() {
                    return ((this.targets) + " " + (this.$props.toggle));
                },

                handler: function(e) {
                    e.preventDefault();
                    this.toggle(index($$(((this.targets) + " " + (this.$props.toggle)), this.$el), e.current));
                }

            }

        ],

        connected: function() {

            if (this.active === false) {
                return;
            }

            var active = this.items[Number(this.active)];
            if (active && !hasClass(active, this.clsOpen)) {
                this.toggle(active, false);
            }
        },

        update: function() {
            var this$1 = this;


            this.items.forEach(function (el) { return this$1._toggle($(this$1.content, el), hasClass(el, this$1.clsOpen)); });

            var active = !this.collapsible && !hasClass(this.items, this.clsOpen) && this.items[0];
            if (active) {
                this.toggle(active, false);
            }
        },

        methods: {

            toggle: function(item, animate$$1) {
                var this$1 = this;


                var index$$1 = getIndex(item, this.items);
                var active = filter(this.items, ("." + (this.clsOpen)));

                item = this.items[index$$1];

                item && [item]
                    .concat(!this.multiple && !includes(active, item) && active || [])
                    .forEach(function (el) {

                        var isItem = el === item;
                        var state = isItem && !hasClass(el, this$1.clsOpen);

                        if (!state && isItem && !this$1.collapsible && active.length < 2) {
                            return;
                        }

                        toggleClass(el, this$1.clsOpen, state);

                        var content = el._wrapper ? el._wrapper.firstElementChild : $(this$1.content, el);

                        if (!el._wrapper) {
                            el._wrapper = wrapAll(content, '<div>');
                            attr(el._wrapper, 'hidden', state ? '' : null);
                        }

                        this$1._toggle(content, true);
                        this$1.toggleElement(el._wrapper, state, animate$$1).then(function () {

                            if (hasClass(el, this$1.clsOpen) !== state) {
                                return;
                            }

                            if (!state) {
                                this$1._toggle(content, false);
                            }

                            el._wrapper = null;
                            unwrap(content);

                        });

                    });
            }

        }

    };

    var Alert = {

        mixins: [Class, Togglable],

        args: 'animation',

        props: {
            close: String
        },

        data: {
            animation: [true],
            selClose: '.uk-alert-close',
            duration: 150,
            hideProps: assign({opacity: 0}, Togglable.data.hideProps)
        },

        events: [

            {

                name: 'click',

                delegate: function() {
                    return this.selClose;
                },

                handler: function(e) {
                    e.preventDefault();
                    this.close();
                }

            }

        ],

        methods: {

            close: function() {
                var this$1 = this;

                this.toggleElement(this.$el).then(function () { return this$1.$destroy(true); });
            }

        }

    };

    function Core (UIkit) {

        ready(function () {

            UIkit.update();

            var scroll = 0;
            var started = 0;

            on(window, 'load resize', function (e) { return UIkit.update(null, e); });
            on(window, 'scroll', function (e) {
                var target = e.target;
                e.dir = scroll <= window.pageYOffset ? 'down' : 'up';
                e.pageYOffset = scroll = window.pageYOffset;
                UIkit.update(target.nodeType !== 1 ? document.body : target, e);
            }, {passive: true, capture: true});
            on(document, 'loadedmetadata load', function (ref) {
                var target = ref.target;

                return UIkit.update(target, 'load');
            }, true);

            on(document, 'animationstart', function (ref) {
                var target = ref.target;

                if ((css(target, 'animationName') || '').match(/^uk-.*(left|right)/)) {

                    started++;
                    css(document.body, 'overflowX', 'hidden');
                    setTimeout(function () {
                        if (!--started) {
                            css(document.body, 'overflowX', '');
                        }
                    }, toMs(css(target, 'animationDuration')) + 100);
                }
            }, true);

        });

    }

    var Video = {

        args: 'autoplay',

        props: {
            automute: Boolean,
            autoplay: Boolean,
        },

        data: {
            automute: false,
            autoplay: true
        },

        computed: {

            inView: function(ref) {
                var autoplay = ref.autoplay;

                return autoplay === 'inview';
            }

        },

        connected: function() {

            if (this.inView && !hasAttr(this.$el, 'preload')) {
                this.$el.preload = 'none';
            }

            this.player = new Player(this.$el);

            if (this.automute) {
                this.player.mute();
            }

        },

        update: {

            read: function(_, ref) {
                var type = ref.type;


                return !this.player || (type === 'scroll' || type === 'resize') && !this.inView
                    ? false
                    : {
                        visible: isVisible(this.$el) && css(this.$el, 'visibility') !== 'hidden',
                        inView: this.inView && isInView(this.$el)
                    };
            },

            write: function(ref) {
                var visible = ref.visible;
                var inView = ref.inView;


                if (!visible || this.inView && !inView) {
                    this.player.pause();
                } else if (this.autoplay === true || this.inView && inView) {
                    this.player.play();
                }

            },

            events: ['load', 'resize', 'scroll']

        }

    };

    var Cover = {

        mixins: [Class, Video],

        props: {
            width: Number,
            height: Number
        },

        data: {
            automute: true
        },

        update: {

            read: function() {

                var el = this.$el;

                if (!isVisible(el)) {
                    return false;
                }

                var ref = el.parentNode;
                var height$$1 = ref.offsetHeight;
                var width$$1 = ref.offsetWidth;

                return {height: height$$1, width: width$$1};
            },

            write: function(ref) {
                var height$$1 = ref.height;
                var width$$1 = ref.width;


                var el = this.$el;
                var elWidth = this.width || el.naturalWidth || el.videoWidth || el.clientWidth;
                var elHeight = this.height || el.naturalHeight || el.videoHeight || el.clientHeight;

                if (!elWidth || !elHeight) {
                    return;
                }

                css(el, Dimensions.cover(
                    {
                        width: elWidth,
                        height: elHeight
                    },
                    {
                        width: width$$1 + (width$$1 % 2 ? 1 : 0),
                        height: height$$1 + (height$$1 % 2 ? 1 : 0)
                    }
                ));

            },

            events: ['load', 'resize']

        }

    };

    var Position = {

        props: {
            pos: String,
            offset: null,
            flip: Boolean,
            clsPos: String
        },

        data: {
            pos: ("bottom-" + (!isRtl ? 'left' : 'right')),
            flip: true,
            offset: false,
            clsPos: ''
        },

        computed: {

            pos: function(ref) {
                var pos = ref.pos;

                return (pos + (!includes(pos, '-') ? '-center' : '')).split('-');
            },

            dir: function() {
                return this.pos[0];
            },

            align: function() {
                return this.pos[1];
            }

        },

        methods: {

            positionAt: function(element, target, boundary) {

                removeClasses(element, ((this.clsPos) + "-(top|bottom|left|right)(-[a-z]+)?"));
                css(element, {top: '', left: ''});

                var node;
                var ref = this;
                var offset$$1 = ref.offset;
                var axis = this.getAxis();

                if (!isNumeric(offset$$1)) {
                    node = $(offset$$1);
                    offset$$1 = node
                        ? offset(node)[axis === 'x' ? 'left' : 'top'] - offset(target)[axis === 'x' ? 'right' : 'bottom']
                        : 0;
                }

                var ref$1 = positionAt(
                    element,
                    target,
                    axis === 'x' ? ((flipPosition(this.dir)) + " " + (this.align)) : ((this.align) + " " + (flipPosition(this.dir))),
                    axis === 'x' ? ((this.dir) + " " + (this.align)) : ((this.align) + " " + (this.dir)),
                    axis === 'x' ? ("" + (this.dir === 'left' ? -offset$$1 : offset$$1)) : (" " + (this.dir === 'top' ? -offset$$1 : offset$$1)),
                    null,
                    this.flip,
                    boundary
                ).target;
                var x = ref$1.x;
                var y = ref$1.y;

                this.dir = axis === 'x' ? x : y;
                this.align = axis === 'x' ? y : x;

                toggleClass(element, ((this.clsPos) + "-" + (this.dir) + "-" + (this.align)), this.offset === false);

            },

            getAxis: function() {
                return this.dir === 'top' || this.dir === 'bottom' ? 'y' : 'x';
            }

        }

    };

    var active;

    var Drop = {

        mixins: [Position, Togglable],

        args: 'pos',

        props: {
            mode: 'list',
            toggle: Boolean,
            boundary: Boolean,
            boundaryAlign: Boolean,
            delayShow: Number,
            delayHide: Number,
            clsDrop: String
        },

        data: {
            mode: ['click', 'hover'],
            toggle: '- *',
            boundary: window,
            boundaryAlign: false,
            delayShow: 0,
            delayHide: 800,
            clsDrop: false,
            hoverIdle: 200,
            animation: ['uk-animation-fade'],
            cls: 'uk-open'
        },

        computed: {

            boundary: function(ref, $el) {
                var boundary = ref.boundary;

                return query(boundary, $el);
            },

            clsDrop: function(ref) {
                var clsDrop = ref.clsDrop;

                return clsDrop || ("uk-" + (this.$options.name));
            },

            clsPos: function() {
                return this.clsDrop;
            }

        },

        created: function() {
            this.tracker = new MouseTracker();
        },

        connected: function() {

            addClass(this.$el, this.clsDrop);

            var ref = this.$props;
            var toggle = ref.toggle;
            this.toggle = toggle && this.$create('toggle', query(toggle, this.$el), {
                target: this.$el,
                mode: this.mode
            });

            !this.toggle && trigger(this.$el, 'updatearia');

        },

        events: [


            {

                name: 'click',

                delegate: function() {
                    return ("." + (this.clsDrop) + "-close");
                },

                handler: function(e) {
                    e.preventDefault();
                    this.hide(false);
                }

            },

            {

                name: 'click',

                delegate: function() {
                    return 'a[href^="#"]';
                },

                handler: function(e) {

                    if (e.defaultPrevented) {
                        return;
                    }

                    var id = e.target.hash;

                    if (!id) {
                        e.preventDefault();
                    }

                    if (!id || !within(id, this.$el)) {
                        this.hide(false);
                    }
                }

            },

            {

                name: 'beforescroll',

                handler: function() {
                    this.hide(false);
                }

            },

            {

                name: 'toggle',

                self: true,

                handler: function(e, toggle) {

                    e.preventDefault();

                    if (this.isToggled()) {
                        this.hide(false);
                    } else {
                        this.show(toggle, false);
                    }
                }

            },

            {

                name: pointerEnter,

                filter: function() {
                    return includes(this.mode, 'hover');
                },

                handler: function(e) {

                    if (isTouch(e)) {
                        return;
                    }

                    if (active
                        && active !== this
                        && active.toggle
                        && includes(active.toggle.mode, 'hover')
                        && !within(e.target, active.toggle.$el)
                        && !pointInRect({x: e.pageX, y: e.pageY}, offset(active.$el))
                    ) {
                        active.hide(false);
                    }

                    e.preventDefault();
                    this.show(this.toggle);
                }

            },

            {

                name: 'toggleshow',

                handler: function(e, toggle) {

                    if (toggle && !includes(toggle.target, this.$el)) {
                        return;
                    }

                    e.preventDefault();
                    this.show(toggle || this.toggle);
                }

            },

            {

                name: ("togglehide " + pointerLeave),

                handler: function(e, toggle) {

                    if (isTouch(e) || toggle && !includes(toggle.target, this.$el)) {
                        return;
                    }

                    e.preventDefault();

                    if (this.toggle && includes(this.toggle.mode, 'hover')) {
                        this.hide();
                    }
                }

            },

            {

                name: 'beforeshow',

                self: true,

                handler: function() {
                    this.clearTimers();
                    Animation.cancel(this.$el);
                    this.position();
                }

            },

            {

                name: 'show',

                self: true,

                handler: function() {
                    this.tracker.init();
                    trigger(this.$el, 'updatearia');
                    registerEvent();
                }

            },

            {

                name: 'beforehide',

                self: true,

                handler: function() {
                    this.clearTimers();
                }

            },

            {

                name: 'hide',

                handler: function(ref) {
                    var target = ref.target;


                    if (this.$el !== target) {
                        active = active === null && within(target, this.$el) && this.isToggled() ? this : active;
                        return;
                    }

                    active = this.isActive() ? null : active;
                    trigger(this.$el, 'updatearia');
                    this.tracker.cancel();
                }

            },

            {

                name: 'updatearia',

                self: true,

                handler: function(e, toggle) {

                    e.preventDefault();

                    this.updateAria(this.$el);

                    if (toggle || this.toggle) {
                        attr((toggle || this.toggle).$el, 'aria-expanded', this.isToggled() ? 'true' : 'false');
                        toggleClass(this.toggle.$el, this.cls, this.isToggled());
                    }
                }
            }

        ],

        update: {

            write: function() {

                if (this.isToggled() && !Animation.inProgress(this.$el)) {
                    this.position();
                }

            },

            events: ['resize']

        },

        methods: {

            show: function(toggle, delay) {
                var this$1 = this;
                if ( delay === void 0 ) delay = true;


                var show = function () { return !this$1.isToggled() && this$1.toggleElement(this$1.$el, true); };
                var tryShow = function () {

                    this$1.toggle = toggle || this$1.toggle;

                    this$1.clearTimers();

                    if (this$1.isActive()) {
                        return;
                    } else if (delay && active && active !== this$1 && active.isDelaying) {
                        this$1.showTimer = setTimeout(this$1.show, 10);
                        return;
                    } else if (this$1.isParentOf(active)) {

                        if (active.hideTimer) {
                            active.hide(false);
                        } else {
                            return;
                        }

                    } else if (active && this$1.isChildOf(active)) {

                        active.clearTimers();

                    } else if (active && !this$1.isChildOf(active) && !this$1.isParentOf(active)) {

                        var prev;
                        while (active && active !== prev && !this$1.isChildOf(active)) {
                            prev = active;
                            active.hide(false);
                        }

                    }

                    if (delay && this$1.delayShow) {
                        this$1.showTimer = setTimeout(show, this$1.delayShow);
                    } else {
                        show();
                    }

                    active = this$1;
                };

                if (toggle && this.toggle && toggle.$el !== this.toggle.$el) {

                    once(this.$el, 'hide', tryShow);
                    this.hide(false);

                } else {
                    tryShow();
                }
            },

            hide: function(delay) {
                var this$1 = this;
                if ( delay === void 0 ) delay = true;


                var hide = function () { return this$1.toggleNow(this$1.$el, false); };

                this.clearTimers();

                this.isDelaying = this.tracker.movesTo(this.$el);

                if (delay && this.isDelaying) {
                    this.hideTimer = setTimeout(this.hide, this.hoverIdle);
                } else if (delay && this.delayHide) {
                    this.hideTimer = setTimeout(hide, this.delayHide);
                } else {
                    hide();
                }
            },

            clearTimers: function() {
                clearTimeout(this.showTimer);
                clearTimeout(this.hideTimer);
                this.showTimer = null;
                this.hideTimer = null;
                this.isDelaying = false;
            },

            isActive: function() {
                return active === this;
            },

            isChildOf: function(drop) {
                return drop && drop !== this && within(this.$el, drop.$el);
            },

            isParentOf: function(drop) {
                return drop && drop !== this && within(drop.$el, this.$el);
            },

            position: function() {

                removeClasses(this.$el, ((this.clsDrop) + "-(stack|boundary)"));
                css(this.$el, {top: '', left: '', display: 'block'});
                toggleClass(this.$el, ((this.clsDrop) + "-boundary"), this.boundaryAlign);

                var boundary = offset(this.boundary);
                var alignTo = this.boundaryAlign ? boundary : offset(this.toggle.$el);

                if (this.align === 'justify') {
                    var prop = this.getAxis() === 'y' ? 'width' : 'height';
                    css(this.$el, prop, alignTo[prop]);
                } else if (this.$el.offsetWidth > Math.max(boundary.right - alignTo.left, alignTo.right - boundary.left)) {
                    addClass(this.$el, ((this.clsDrop) + "-stack"));
                }

                this.positionAt(this.$el, this.boundaryAlign ? this.boundary : this.toggle.$el, this.boundary);

                css(this.$el, 'display', '');

            }

        }

    };

    var registered;

    function registerEvent() {

        if (registered) {
            return;
        }

        registered = true;
        on(document, pointerUp, function (ref) {
            var target = ref.target;
            var defaultPrevented = ref.defaultPrevented;

            var prev;

            if (defaultPrevented) {
                return;
            }

            while (active && active !== prev && !within(target, active.$el) && !(active.toggle && within(target, active.toggle.$el))) {
                prev = active;
                active.hide(false);
            }
        });
    }

    var Dropdown = {

        extends: Drop

    };

    var FormCustom = {

        mixins: [Class],

        args: 'target',

        props: {
            target: Boolean
        },

        data: {
            target: false
        },

        computed: {

            input: function(_, $el) {
                return $(selInput, $el);
            },

            state: function() {
                return this.input.nextElementSibling;
            },

            target: function(ref, $el) {
                var target = ref.target;

                return target && (target === true
                    && this.input.parentNode === $el
                    && this.input.nextElementSibling
                    || query(target, $el));
            }

        },

        update: function() {

            var ref = this;
            var target = ref.target;
            var input = ref.input;

            if (!target) {
                return;
            }

            var option;
            var prop = isInput(target) ? 'value' : 'textContent';
            var prev = target[prop];
            var value = input.files && input.files[0]
                ? input.files[0].name
                : matches(input, 'select') && (option = $$('option', input).filter(function (el) { return el.selected; })[0])
                    ? option.textContent
                    : input.value;

            if (prev !== value) {
                target[prop] = value;
            }

        },

        events: [

            {

                name: 'focusin focusout mouseenter mouseleave',

                delegate: selInput,

                handler: function(ref) {
                    var type = ref.type;
                    var current = ref.current;

                    if (current === this.input) {
                        toggleClass(
                            this.state,
                            ("uk-" + (includes(type, 'focus') ? 'focus' : 'hover')),
                            includes(['focusin', 'mouseenter'], type)
                        );
                    }
                }

            },

            {

                name: 'change',

                handler: function() {
                    this.$emit();
                }

            }

        ]

    };

    // Deprecated
    var Gif = {

        update: {

            read: function(data$$1) {

                var inview = isInView(this.$el);

                if (!inview || data$$1.isInView === inview) {
                    return false;
                }

                data$$1.isInView = inview;
            },

            write: function() {
                this.$el.src = this.$el.src;
            },

            events: ['scroll', 'load', 'resize']
        }

    };

    var Margin = {

        props: {
            margin: String,
            firstColumn: Boolean
        },

        data: {
            margin: 'uk-margin-small-top',
            firstColumn: 'uk-first-column'
        },

        update: {

            read: function(data$$1) {

                var items = this.$el.children;
                var rows = [[]];

                if (!items.length || !isVisible(this.$el)) {
                    return data$$1.rows = rows;
                }

                data$$1.rows = getRows(items);
                data$$1.stacks = !data$$1.rows.some(function (row) { return row.length > 1; });

            },

            write: function(ref) {
                var this$1 = this;
                var rows = ref.rows;


                rows.forEach(function (row, i) { return row.forEach(function (el, j) {
                        toggleClass(el, this$1.margin, i !== 0);
                        toggleClass(el, this$1.firstColumn, j === 0);
                    }); }
                );

            },

            events: ['load', 'resize']

        }

    };

    function getRows(items) {
        var rows = [[]];

        for (var i = 0; i < items.length; i++) {

            var el = items[i];
            var dim = getOffset(el);

            if (!dim.height) {
                continue;
            }

            for (var j = rows.length - 1; j >= 0; j--) {

                var row = rows[j];

                if (!row[0]) {
                    row.push(el);
                    break;
                }

                var leftDim = (void 0);
                if (row[0].offsetParent === el.offsetParent) {
                    leftDim = getOffset(row[0]);
                } else {
                    dim = getOffset(el, true);
                    leftDim = getOffset(row[0], true);
                }

                if (dim.top >= leftDim.bottom - 1) {
                    rows.push([el]);
                    break;
                }

                if (dim.bottom > leftDim.top) {

                    if (dim.left < leftDim.left && !isRtl) {
                        row.unshift(el);
                        break;
                    }

                    row.push(el);
                    break;
                }

                if (j === 0) {
                    rows.unshift([el]);
                    break;
                }

            }

        }

        return rows;

    }

    function getOffset(element, offset$$1) {
        var assign$$1;

        if ( offset$$1 === void 0 ) offset$$1 = false;

        var offsetTop = element.offsetTop;
        var offsetLeft = element.offsetLeft;
        var offsetHeight = element.offsetHeight;

        if (offset$$1) {
            (assign$$1 = offsetPosition(element), offsetTop = assign$$1[0], offsetLeft = assign$$1[1]);
        }

        return {
            top: offsetTop,
            left: offsetLeft,
            height: offsetHeight,
            bottom: offsetTop + offsetHeight
        };
    }

    var Grid = {

        extends: Margin,

        mixins: [Class],

        name: 'grid',

        props: {
            masonry: Boolean,
            parallax: Number
        },

        data: {
            margin: 'uk-grid-margin',
            clsStack: 'uk-grid-stack',
            masonry: false,
            parallax: 0
        },

        computed: {

            length: function(_, $el) {
                return $el.children.length;
            },

            parallax: function(ref) {
                var parallax = ref.parallax;

                return parallax && this.length ? Math.abs(parallax) : '';
            }

        },

        connected: function() {
            this.masonry && addClass(this.$el, 'uk-flex-top uk-flex-wrap-top');
        },

        update: [

            {

                read: function(ref) {
                    var rows = ref.rows;


                    if (this.masonry || this.parallax) {
                        rows = rows.map(function (elements) { return sortBy(elements, 'offsetLeft'); });

                        if (isRtl) {
                            rows.map(function (row) { return row.reverse(); });
                        }

                    }

                    var transitionInProgress = rows.some(function (elements) { return elements.some(Transition.inProgress); });
                    var translates = false;
                    var elHeight = '';

                    if (this.masonry && this.length) {

                        var height$$1 = 0;

                        translates = rows.reduce(function (translates, row, i) {

                            translates[i] = row.map(function (_, j) { return i === 0 ? 0 : toFloat(translates[i - 1][j]) + (height$$1 - toFloat(rows[i - 1][j] && rows[i - 1][j].offsetHeight)); });
                            height$$1 = row.reduce(function (height$$1, el) { return Math.max(height$$1, el.offsetHeight); }, 0);

                            return translates;

                        }, []);

                        elHeight = maxColumnHeight(rows) + getMarginTop(this.$el, this.margin) * (rows.length - 1);

                    }

                    return {rows: rows, translates: translates, height: !transitionInProgress ? elHeight : false};

                },

                write: function(ref) {
                    var stacks = ref.stacks;
                    var height$$1 = ref.height;


                    toggleClass(this.$el, this.clsStack, stacks);

                    css(this.$el, 'paddingBottom', this.parallax);
                    height$$1 !== false && css(this.$el, 'height', height$$1);

                },

                events: ['load', 'resize']

            },

            {

                read: function(ref) {
                    var height$$1 = ref.height;

                    return {
                        scrolled: this.parallax
                            ? scrolledOver(this.$el, height$$1 ? height$$1 - height(this.$el) : 0) * this.parallax
                            : false
                    };
                },

                write: function(ref) {
                    var rows = ref.rows;
                    var scrolled = ref.scrolled;
                    var translates = ref.translates;


                    if (scrolled === false && !translates) {
                        return;
                    }

                    rows.forEach(function (row, i) { return row.forEach(function (el, j) { return css(el, 'transform', !scrolled && !translates ? '' : ("translateY(" + ((translates && -translates[i][j]) + (scrolled ? j % 2 ? scrolled : scrolled / 8 : 0)) + "px)")); }
                        ); }
                    );

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    };

    function getMarginTop(root, cls) {

        var nodes = toNodes(root.children);
        var ref = nodes.filter(function (el) { return hasClass(el, cls); });
        var node = ref[0];

        return toFloat(node
            ? css(node, 'marginTop')
            : css(nodes[0], 'paddingLeft'));
    }

    function maxColumnHeight(rows) {
        return Math.max.apply(Math, rows.reduce(function (sum, row) {
            row.forEach(function (el, i) { return sum[i] = (sum[i] || 0) + el.offsetHeight; });
            return sum;
        }, []));
    }

    // IE 11 fix (min-height on a flex container won't apply to its flex items)
    var FlexBug = isIE ? {

        data: {
            selMinHeight: false,
            forceHeight: false
        },

        computed: {

            elements: function(ref, $el) {
                var selMinHeight = ref.selMinHeight;

                return selMinHeight ? $$(selMinHeight, $el) : [$el];
            }

        },

        update: [

            {

                read: function() {
                    css(this.elements, 'height', '');
                },

                order: -5,

                events: ['load', 'resize']

            },

            {

                write: function() {
                    var this$1 = this;

                    this.elements.forEach(function (el) {
                        var height$$1 = toFloat(css(el, 'minHeight'));
                        if (height$$1 && (this$1.forceHeight || Math.round(height$$1 + boxModelAdjust('height', el, 'content-box')) >= el.offsetHeight)) {
                            css(el, 'height', height$$1);
                        }
                    });
                },

                order: 5,

                events: ['load', 'resize']

            }

        ]

    } : {};

    var HeightMatch = {

        mixins: [FlexBug],

        args: 'target',

        props: {
            target: String,
            row: Boolean
        },

        data: {
            target: '> *',
            row: true,
            forceHeight: true
        },

        computed: {

            elements: function(ref, $el) {
                var target = ref.target;

                return $$(target, $el);
            }

        },

        update: {

            read: function() {
                return {
                    rows: (this.row ? getRows(this.elements) : [this.elements]).map(match)
                };
            },

            write: function(ref) {
                var rows = ref.rows;

                rows.forEach(function (ref) {
                        var heights = ref.heights;
                        var elements = ref.elements;

                        return elements.forEach(function (el, i) { return css(el, 'minHeight', heights[i]); }
                    );
                }
                );
            },

            events: ['load', 'resize']

        }

    };

    function match(elements) {
        var assign$$1;


        if (elements.length < 2) {
            return {heights: [''], elements: elements};
        }

        var ref = getHeights(elements);
        var heights = ref.heights;
        var max = ref.max;
        var hasMinHeight = elements.some(function (el) { return el.style.minHeight; });
        var hasShrunk = elements.some(function (el, i) { return !el.style.minHeight && heights[i] < max; });

        if (hasMinHeight && hasShrunk) {
            css(elements, 'minHeight', '');
            ((assign$$1 = getHeights(elements), heights = assign$$1.heights, max = assign$$1.max));
        }

        heights = elements.map(function (el, i) { return heights[i] === max && toFloat(el.style.minHeight).toFixed(2) !== max.toFixed(2) ? '' : max; }
        );

        return {heights: heights, elements: elements};
    }

    function getHeights(elements) {
        var heights = elements.map(function (el) { return offset(el).height - boxModelAdjust('height', el, 'content-box'); });
        var max = Math.max.apply(null, heights);

        return {heights: heights, max: max};
    }

    var HeightViewport = {

        mixins: [FlexBug],

        props: {
            expand: Boolean,
            offsetTop: Boolean,
            offsetBottom: Boolean,
            minHeight: Number
        },

        data: {
            expand: false,
            offsetTop: false,
            offsetBottom: false,
            minHeight: 0
        },

        update: {

            read: function() {

                var minHeight = '';
                var box = boxModelAdjust('height', this.$el, 'content-box');

                if (this.expand) {

                    minHeight = height(window) - (offsetHeight(document.documentElement) - offsetHeight(this.$el)) - box || '';

                } else {

                    // on mobile devices (iOS and Android) window.innerHeight !== 100vh
                    minHeight = 'calc(100vh';

                    if (this.offsetTop) {

                        var ref = offset(this.$el);
                        var top = ref.top;
                        minHeight += top < height(window) / 2 ? (" - " + top + "px") : '';

                    }

                    if (this.offsetBottom === true) {

                        minHeight += " - " + (offsetHeight(this.$el.nextElementSibling)) + "px";

                    } else if (isNumeric(this.offsetBottom)) {

                        minHeight += " - " + (this.offsetBottom) + "vh";

                    } else if (this.offsetBottom && endsWith(this.offsetBottom, 'px')) {

                        minHeight += " - " + (toFloat(this.offsetBottom)) + "px";

                    } else if (isString(this.offsetBottom)) {

                        minHeight += " - " + (offsetHeight(query(this.offsetBottom, this.$el))) + "px";

                    }

                    minHeight += (box ? (" - " + box + "px") : '') + ")";

                }

                return {minHeight: minHeight};
            },

            write: function(ref) {
                var minHeight = ref.minHeight;


                css(this.$el, {minHeight: minHeight});

                if (this.minHeight && toFloat(css(this.$el, 'minHeight')) < this.minHeight) {
                    css(this.$el, 'minHeight', this.minHeight);
                }

            },

            events: ['load', 'resize']

        }

    };

    function offsetHeight(el) {
        return el && el.offsetHeight || 0;
    }

    var svgs = {};

    var SVG = {

        args: 'src',

        props: {
            id: String,
            icon: String,
            src: String,
            style: String,
            width: Number,
            height: Number,
            ratio: Number,
            'class': String
        },

        data: {
            ratio: 1,
            id: false,
            exclude: ['ratio', 'src', 'icon'],
            'class': ''
        },

        connected: function() {
            var this$1 = this;
            var assign$$1;


            this.class += ' uk-svg';

            if (!this.icon && includes(this.src, '#')) {

                var parts = this.src.split('#');

                if (parts.length > 1) {
                    (assign$$1 = parts, this.src = assign$$1[0], this.icon = assign$$1[1]);
                }
            }

            this.svg = this.getSvg().then(function (svg) {

                var el;

                if (isString(svg)) {

                    if (this$1.icon && includes(svg, '<symbol')) {
                        svg = parseSymbols(svg, this$1.icon) || svg;
                    }

                    el = $(svg.substr(svg.indexOf('<svg')));

                } else {
                    el = svg.cloneNode(true);
                }

                if (!el) {
                    return Promise.reject('SVG not found.');
                }

                var dimensions = attr(el, 'viewBox');

                if (dimensions) {
                    dimensions = dimensions.split(' ');
                    this$1.width = this$1.$props.width || dimensions[2];
                    this$1.height = this$1.$props.height || dimensions[3];
                }

                this$1.width *= this$1.ratio;
                this$1.height *= this$1.ratio;

                for (var prop in this$1.$options.props) {
                    if (this$1[prop] && !includes(this$1.exclude, prop)) {
                        attr(el, prop, this$1[prop]);
                    }
                }

                if (!this$1.id) {
                    removeAttr(el, 'id');
                }

                if (this$1.width && !this$1.height) {
                    removeAttr(el, 'height');
                }

                if (this$1.height && !this$1.width) {
                    removeAttr(el, 'width');
                }

                var src = this$1.icon || this$1.src;
                attr(el, 'data-svg', src);

                var root = this$1.$el;
                if (isVoidElement(root) || root.tagName === 'CANVAS') {

                    attr(root, {hidden: true, id: null});

                    var next = root.nextElementSibling;
                    if (src === attr(next, 'data-svg')) {
                        el = next;
                    } else {
                        after(root, el);
                    }

                } else {

                    var last = root.lastElementChild;
                    if (src === attr(last, 'data-svg')) {
                        el = last;
                    } else {
                        append(root, el);
                    }

                }

                this$1.svgEl = el;

                return el;

            }, noop);

        },

        disconnected: function() {
            var this$1 = this;


            if (isVoidElement(this.$el)) {
                attr(this.$el, {hidden: null, id: this.id || null});
            }

            if (this.svg) {
                this.svg.then(function (svg) { return (!this$1._connected || svg !== this$1.svgEl) && remove(svg); }, noop);
            }

            this.svg = this.svgEl = null;

        },

        methods: {

            getSvg: function() {
                var this$1 = this;


                if (!this.src) {
                    return Promise.reject();
                }

                if (svgs[this.src]) {
                    return svgs[this.src];
                }

                svgs[this.src] = new Promise(function (resolve, reject) {

                    if (startsWith(this$1.src, 'data:')) {
                        resolve(decodeURIComponent(this$1.src.split(',')[1]));
                    } else {

                        ajax(this$1.src).then(
                            function (xhr) { return resolve(xhr.response); },
                            function () { return reject('SVG not found.'); }
                        );

                    }

                });

                return svgs[this.src];

            }

        }

    };

    var symbolRe = /<symbol(.*?id=(['"])(.*?)\2[^]*?<\/)symbol>/g;
    var symbols = {};

    function parseSymbols(svg, icon) {

        if (!symbols[svg]) {

            symbols[svg] = {};

            var match;
            while ((match = symbolRe.exec(svg))) {
                symbols[svg][match[3]] = "<svg xmlns=\"http://www.w3.org/2000/svg\"" + (match[1]) + "svg>";
            }

            symbolRe.lastIndex = 0;

        }

        return symbols[svg][icon];
    }

    var closeIcon = "<svg width=\"14\" height=\"14\" viewBox=\"0 0 14 14\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"1\" y1=\"1\" x2=\"13\" y2=\"13\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"13\" y1=\"1\" x2=\"1\" y2=\"13\"/></svg>";

    var closeLarge = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"1\" y1=\"1\" x2=\"19\" y2=\"19\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" x1=\"19\" y1=\"1\" x2=\"1\" y2=\"19\"/></svg>";

    var marker = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"9\" y=\"4\" width=\"1\" height=\"11\"/><rect x=\"4\" y=\"9\" width=\"11\" height=\"1\"/></svg>";

    var navbarToggleIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><rect y=\"9\" width=\"20\" height=\"2\"/><rect y=\"3\" width=\"20\" height=\"2\"/><rect y=\"15\" width=\"20\" height=\"2\"/></svg>";

    var overlayIcon = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"19\" y=\"0\" width=\"1\" height=\"40\"/><rect x=\"0\" y=\"19\" width=\"40\" height=\"1\"/></svg>";

    var paginationNext = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 1 6 6 1 11\"/></svg>";

    var paginationPrevious = "<svg width=\"7\" height=\"12\" viewBox=\"0 0 7 12\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"6 1 1 6 6 11\"/></svg>";

    var searchIcon = "<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"9\" cy=\"9\" r=\"7\"/><path fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" d=\"M14,14 L18,18 L14,14 Z\"/></svg>";

    var searchLarge = "<svg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" cx=\"17.5\" cy=\"17.5\" r=\"16.5\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.8\" x1=\"38\" y1=\"39\" x2=\"29\" y2=\"30\"/></svg>";

    var searchNavbar = "<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" cx=\"10.5\" cy=\"10.5\" r=\"9.5\"/><line fill=\"none\" stroke=\"#000\" stroke-width=\"1.1\" x1=\"23\" y1=\"23\" x2=\"17\" y2=\"17\"/></svg>";

    var slidenavNext = "<svg width=\"14px\" height=\"24px\" viewBox=\"0 0 14 24\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"1.225,23 12.775,12 1.225,1 \"/></svg>";

    var slidenavNextLarge = "<svg width=\"25px\" height=\"40px\" viewBox=\"0 0 25 40\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"2\" points=\"4.002,38.547 22.527,20.024 4,1.5 \"/></svg>";

    var slidenavPrevious = "<svg width=\"14px\" height=\"24px\" viewBox=\"0 0 14 24\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.4\" points=\"12.775,1 1.225,12 12.775,23 \"/></svg>";

    var slidenavPreviousLarge = "<svg width=\"25px\" height=\"40px\" viewBox=\"0 0 25 40\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"2\" points=\"20.527,1.5 2,20.024 20.525,38.547 \"/></svg>";

    var spinner = "<svg width=\"30\" height=\"30\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"none\" stroke=\"#000\" cx=\"15\" cy=\"15\" r=\"14\"/></svg>";

    var totop = "<svg width=\"18\" height=\"10\" viewBox=\"0 0 18 10\" xmlns=\"http://www.w3.org/2000/svg\"><polyline fill=\"none\" stroke=\"#000\" stroke-width=\"1.2\" points=\"1 9 9 1 17 9 \"/></svg>";

    var parsed = {};
    var icons = {
        spinner: spinner,
        totop: totop,
        marker: marker,
        'close-icon': closeIcon,
        'close-large': closeLarge,
        'navbar-toggle-icon': navbarToggleIcon,
        'overlay-icon': overlayIcon,
        'pagination-next': paginationNext,
        'pagination-previous': paginationPrevious,
        'search-icon': searchIcon,
        'search-large': searchLarge,
        'search-navbar': searchNavbar,
        'slidenav-next': slidenavNext,
        'slidenav-next-large': slidenavNextLarge,
        'slidenav-previous': slidenavPrevious,
        'slidenav-previous-large': slidenavPreviousLarge
    };

    var Icon = {

        install: install,

        attrs: ['icon', 'ratio'],

        mixins: [Class, SVG],

        args: 'icon',

        props: ['icon'],

        data: {exclude: ['id', 'style', 'class', 'src', 'icon', 'ratio']},

        isIcon: true,

        connected: function() {
            addClass(this.$el, 'uk-icon');
        },

        methods: {

            getSvg: function() {

                var icon = getIcon(applyRtl(this.icon));

                if (!icon) {
                    return Promise.reject('Icon not found.');
                }

                return Promise.resolve(icon);
            }

        }

    };

    var IconComponent = {

        extends: Icon,

        data: function (vm) { return ({
            icon: hyphenate(vm.constructor.options.name)
        }); }

    };

    var Slidenav = {

        extends: IconComponent,

        connected: function() {
            addClass(this.$el, 'uk-slidenav');
        },

        computed: {

            icon: function(ref, $el) {
                var icon = ref.icon;

                return hasClass($el, 'uk-slidenav-large')
                    ? (icon + "-large")
                    : icon;
            }

        }

    };

    var Search = {

        extends: IconComponent,

        computed: {

            icon: function(ref, $el) {
                var icon = ref.icon;

                return hasClass($el, 'uk-search-icon') && parents($el, '.uk-search-large').length
                    ? 'search-large'
                    : parents($el, '.uk-search-navbar').length
                        ? 'search-navbar'
                        : icon;
            }

        }

    };

    var Close = {

        extends: IconComponent,

        computed: {

            icon: function() {
                return ("close-" + (hasClass(this.$el, 'uk-close-large') ? 'large' : 'icon'));
            }

        }

    };

    var Spinner = {

        extends: IconComponent,

        connected: function() {
            var this$1 = this;

            this.svg.then(function (svg) { return this$1.ratio !== 1 && css($('circle', svg), 'strokeWidth', 1 / this$1.ratio); }, noop);
        }

    };

    function install(UIkit) {
        UIkit.icon.add = function (name, svg) {
            var obj;


            var added = isString(name) ? (( obj = {}, obj[name] = svg, obj )) : name;
            each(added, function (svg, name) {
                icons[name] = svg;
                delete parsed[name];
            });

            if (UIkit._initialized) {
                apply(document.body, function (el) { return each(UIkit.getComponents(el), function (cmp) { return cmp.$options.isIcon && cmp.icon in added && cmp.$reset(); }
                    ); }
                );
            }
        };
    }

    function getIcon(icon) {

        if (!icons[icon]) {
            return null;
        }

        if (!parsed[icon]) {
            parsed[icon] = $(icons[icon].trim());
        }

        return parsed[icon];
    }

    function applyRtl(icon) {
        return isRtl ? swap(swap(icon, 'left', 'right'), 'previous', 'next') : icon;
    }

    var Img = {

        props: {
            dataSrc: String,
            dataSrcset: Boolean,
            sizes: String,
            width: Number,
            height: Number,
            offsetTop: String,
            offsetLeft: String,
            target: String
        },

        data: {
            dataSrc: '',
            dataSrcset: false,
            sizes: false,
            width: false,
            height: false,
            offsetTop: '50vh',
            offsetLeft: 0,
            target: false
        },

        computed: {

            cacheKey: function(ref) {
                var dataSrc = ref.dataSrc;

                return ((this.$name) + "." + dataSrc);
            },

            width: function(ref) {
                var width$$1 = ref.width;
                var dataWidth = ref.dataWidth;

                return width$$1 || dataWidth;
            },

            height: function(ref) {
                var height$$1 = ref.height;
                var dataHeight = ref.dataHeight;

                return height$$1 || dataHeight;
            },

            sizes: function(ref) {
                var sizes = ref.sizes;
                var dataSizes = ref.dataSizes;

                return sizes || dataSizes;
            },

            isImg: function(_, $el) {
                return isImg($el);
            },

            target: function(ref) {
                var target = ref.target;

                return [this.$el].concat(queryAll(target, this.$el));
            },

            offsetTop: function(ref) {
                var offsetTop = ref.offsetTop;

                return toPx(offsetTop, 'height');
            },

            offsetLeft: function(ref) {
                var offsetLeft = ref.offsetLeft;

                return toPx(offsetLeft, 'width');
            }

        },

        connected: function() {

            if (storage[this.cacheKey]) {
                setSrcAttrs(this.$el, storage[this.cacheKey] || this.dataSrc, this.dataSrcset, this.sizes);
            } else if (this.isImg && this.width && this.height) {
                setSrcAttrs(this.$el, getPlaceholderImage(this.width, this.height, this.sizes));
            }

        },

        update: {

            read: function(ref) {
                var this$1 = this;
                var update = ref.update;
                var image = ref.image;


                if (!update) {
                    return;
                }

                if (image || !this.target.some(function (el) { return isInView(el, this$1.offsetTop, this$1.offsetLeft); })) {

                    if (!this.isImg && image) {
                        image.then(function (img) { return img && img.currentSrc !== '' && setSrcAttrs(this$1.$el, currentSrc(img)); });
                    }

                    return;
                }

                if (this.$el.src && isVisible(this.$el) && !height(this.$el)) {
                    return;
                }

                return {
                    image: getImage(this.dataSrc, this.dataSrcset, this.sizes).then(function (img) {

                        setSrcAttrs(this$1.$el, currentSrc(img), img.srcset, img.sizes);
                        storage[this$1.cacheKey] = currentSrc(img);
                        return img;

                    }, noop)
                };

            },

            write: function(data$$1) {

                // Give placeholder images time to apply their dimensions
                if (!data$$1.update) {
                    this.$emit();
                    return data$$1.update = true;
                }

                if (!this.isImg && this.dataSrcset && window.devicePixelRatio !== 1) {

                    var bgSize = css(this.$el, 'backgroundSize');
                    if (bgSize === 'auto' || toFloat(bgSize) === data$$1.bgSize) {
                        data$$1.bgSize = getSourceSize(this.dataSrcset, this.sizes);
                        css(this.$el, 'backgroundSize', ((data$$1.bgSize) + "px"));
                    }

                }

            },

            events: ['scroll', 'load', 'resize']

        }

    };

    function setSrcAttrs(el, src, srcset, sizes) {

        if (isImg(el)) {
            sizes && (el.sizes = sizes);
            srcset && (el.srcset = srcset);
            src && (el.src = src);
        } else if (src) {

            var change = !includes(el.style.backgroundImage, src);
            if (change) {
                css(el, 'backgroundImage', ("url(" + (escape(src)) + ")"));
                trigger(el, createEvent('load', false));
            }

        }

    }

    function getPlaceholderImage(width$$1, height$$1, sizes) {
        var assign$$1;


        if (sizes) {
            ((assign$$1 = Dimensions.ratio({width: width$$1, height: height$$1}, 'width', toPx(sizesToPixel(sizes))), width$$1 = assign$$1.width, height$$1 = assign$$1.height));
        }

        return ("data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"" + width$$1 + "\" height=\"" + height$$1 + "\"></svg>");
    }

    var sizesRe = /\s*(.*?)\s*(\w+|calc\(.*?\))\s*(?:,|$)/g;
    function sizesToPixel(sizes) {
        var matches$$1;

        sizesRe.lastIndex = 0;

        while ((matches$$1 = sizesRe.exec(sizes))) {
            if (!matches$$1[1] || window.matchMedia(matches$$1[1]).matches) {
                matches$$1 = evaluateSize(matches$$1[2]);
                break;
            }
        }

        return matches$$1;
    }

    var sizeRe = /\d+(?:\w+|%)/g;
    var additionRe = /[+-]?(\d+)/g;
    function evaluateSize(size) {
        return startsWith(size, 'calc')
            ? size
                .substring(5, size.length - 1)
                .replace(sizeRe, function (size) { return toPx(size); })
                .replace(/ /g, '')
                .match(additionRe)
                .reduce(function (a, b) { return a + +b; }, 0)
            : size;
    }

    function toPx(value, property, element) {
        if ( property === void 0 ) property = 'width';
        if ( element === void 0 ) element = window;

        value = value || '100vw';
        return isNumeric(value)
            ? +value
            : endsWith(value, 'vw')
                ? percent(element, 'width', value)
                : endsWith(value, 'vh')
                    ? percent(element, 'height', value)
                    : endsWith(value, '%')
                        ? percent(element, property, value)
                        : toFloat(value);
    }

    var srcSetRe = /\s+\d+w\s*(?:,|$)/g;
    function getSourceSize(srcset, sizes) {
        var srcSize = toPx(sizesToPixel(sizes));
        var descriptors = (srcset.match(srcSetRe) || []).map(toFloat).sort(function (a, b) { return a - b; });

        return descriptors.filter(function (size) { return size > srcSize; })[0] || descriptors.pop() || '';
    }

    var dimensions = {height: height, width: width};
    function percent(element, property, value) {
        return dimensions[property](element) * toFloat(value) / 100;
    }

    function isImg(el) {
        return el.tagName === 'IMG';
    }

    function currentSrc(el) {
        return el.currentSrc || el.src;
    }

    var key = '__test__';
    var storage;

    // workaround for Safari's private browsing mode and accessing sessionStorage in Blink
    try {
        storage = window.sessionStorage || {};
        storage[key] = 1;
        delete storage[key];
    } catch (e) {
        storage = {};
    }

    var Media = {

        props: {
            media: Boolean
        },

        data: {
            media: false
        },

        computed: {

            matchMedia: function() {
                var media = toMedia(this.media);
                return !media || window.matchMedia(media).matches;
            }

        }

    };

    function toMedia(value) {

        if (isString(value)) {
            if (value[0] === '@') {
                var name = "breakpoint-" + (value.substr(1));
                value = toFloat(getCssVar(name));
            } else if (isNaN(value)) {
                return value;
            }
        }

        return value && !isNaN(value) ? ("(min-width: " + value + "px)") : false;
    }

    var Leader = {

        mixins: [Class, Media],

        props: {
            fill: String
        },

        data: {
            fill: '',
            clsWrapper: 'uk-leader-fill',
            clsHide: 'uk-leader-hide',
            attrFill: 'data-fill'
        },

        computed: {

            fill: function(ref) {
                var fill = ref.fill;

                return fill || getCssVar('leader-fill-content');
            }

        },

        connected: function() {
            var assign$$1;

            (assign$$1 = wrapInner(this.$el, ("<span class=\"" + (this.clsWrapper) + "\">")), this.wrapper = assign$$1[0]);
        },

        disconnected: function() {
            unwrap(this.wrapper.childNodes);
        },

        update: {

            read: function(ref) {
                var changed = ref.changed;
                var width$$1 = ref.width;


                var prev = width$$1;

                width$$1 = Math.floor(this.$el.offsetWidth / 2);

                return {
                    width: width$$1,
                    changed: changed || prev !== width$$1,
                    hide: !this.matchMedia
                };
            },

            write: function(data$$1) {

                toggleClass(this.wrapper, this.clsHide, data$$1.hide);

                if (data$$1.changed) {
                    data$$1.changed = false;
                    attr(this.wrapper, this.attrFill, new Array(data$$1.width).join(this.fill));
                }

            },

            events: ['load', 'resize']

        }

    };

    var Container = {

        props: {
            container: Boolean
        },

        data: {
            container: true
        },

        computed: {

            container: function(ref) {
                var container = ref.container;

                return container === true && this.$container || container && $(container);
            }

        }

    };

    var active$1;

    var Modal = {

        mixins: [Class, Container, Togglable],

        props: {
            selPanel: String,
            selClose: String,
            escClose: Boolean,
            bgClose: Boolean,
            stack: Boolean
        },

        data: {
            cls: 'uk-open',
            escClose: true,
            bgClose: true,
            overlay: true,
            stack: false
        },

        computed: {

            panel: function(ref, $el) {
                var selPanel = ref.selPanel;

                return $(selPanel, $el);
            },

            transitionElement: function() {
                return this.panel;
            },

            bgClose: function(ref) {
                var bgClose = ref.bgClose;

                return bgClose && this.panel;
            }

        },

        beforeDisconnect: function() {
            if (this.isToggled()) {
                this.toggleNow(this.$el, false);
            }
        },

        events: [

            {

                name: 'click',

                delegate: function() {
                    return this.selClose;
                },

                handler: function(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'toggle',

                self: true,

                handler: function(e) {

                    if (e.defaultPrevented) {
                        return;
                    }

                    e.preventDefault();
                    this.toggle();
                }

            },

            {
                name: 'beforeshow',

                self: true,

                handler: function(e) {

                    var prev = active$1 && active$1 !== this && active$1;

                    active$1 = this;

                    if (prev) {
                        if (this.stack) {
                            this.prev = prev;
                        } else {

                            active$1 = prev;

                            if (prev.isToggled()) {
                                prev.hide().then(this.show);
                            } else {
                                once(prev.$el, 'beforeshow hidden', this.show, false, function (ref) {
                                    var target = ref.target;
                                    var type = ref.type;

                                    return type === 'hidden' && target === prev.$el;
                                });
                            }
                            e.preventDefault();

                        }

                        return;
                    }

                    registerEvents();

                }

            },

            {

                name: 'show',

                self: true,

                handler: function() {

                    if (!hasClass(document.documentElement, this.clsPage)) {
                        this.scrollbarWidth = width(window) - width(document);
                        css(document.body, 'overflowY', this.scrollbarWidth && this.overlay ? 'scroll' : '');
                    }

                    addClass(document.documentElement, this.clsPage);

                }

            },

            {

                name: 'hide',

                self: true,

                handler: function() {
                    if (!active$1 || active$1 === this && !this.prev) {
                        deregisterEvents();
                    }
                }

            },

            {

                name: 'hidden',

                self: true,

                handler: function() {

                    var found;
                    var ref = this;
                    var prev = ref.prev;

                    active$1 = active$1 && active$1 !== this && active$1 || prev;

                    if (!active$1) {

                        css(document.body, 'overflowY', '');

                    } else {
                        while (prev) {

                            if (prev.clsPage === this.clsPage) {
                                found = true;
                                break;
                            }

                            prev = prev.prev;

                        }

                    }

                    if (!found) {
                        removeClass(document.documentElement, this.clsPage);
                    }

                }

            }

        ],

        methods: {

            toggle: function() {
                return this.isToggled() ? this.hide() : this.show();
            },

            show: function() {
                var this$1 = this;


                if (this.isToggled()) {
                    return Promise.resolve();
                }

                if (this.container && this.$el.parentNode !== this.container) {
                    append(this.container, this.$el);
                    return new Promise(function (resolve) { return requestAnimationFrame(function () { return this$1.show().then(resolve); }
                        ); }
                    );
                }

                return this.toggleElement(this.$el, true, animate$1(this));
            },

            hide: function() {
                return this.isToggled()
                    ? this.toggleElement(this.$el, false, animate$1(this))
                    : Promise.resolve();
            },

            getActive: function() {
                return active$1;
            }

        }

    };

    var events;

    function registerEvents() {

        if (events) {
            return;
        }

        events = [
            on(document, pointerUp, function (ref) {
                var target = ref.target;
                var defaultPrevented = ref.defaultPrevented;

                if (active$1 && active$1.bgClose && !defaultPrevented && (!active$1.overlay || within(target, active$1.$el)) && !within(target, active$1.panel)) {
                    active$1.hide();
                }
            }),
            on(document, 'keydown', function (e) {
                if (e.keyCode === 27 && active$1 && active$1.escClose) {
                    e.preventDefault();
                    active$1.hide();
                }
            })
        ];
    }

    function deregisterEvents() {
        events && events.forEach(function (unbind) { return unbind(); });
        events = null;
    }

    function animate$1(ref) {
        var transitionElement = ref.transitionElement;
        var _toggle = ref._toggle;

        return function (el, show) { return new Promise(function (resolve, reject) { return once(el, 'show hide', function () {
                    el._reject && el._reject();
                    el._reject = reject;

                    _toggle(el, show);

                    if (toMs(css(transitionElement, 'transitionDuration'))) {
                        once(transitionElement, 'transitionend', resolve, false, function (e) { return e.target === transitionElement; });
                    } else {
                        resolve();
                    }
                }); }
            ); };
    }

    var Modal$1 = {

        install: install$1,

        mixins: [Modal],

        data: {
            clsPage: 'uk-modal-page',
            selPanel: '.uk-modal-dialog',
            selClose: '.uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full'
        },

        events: [

            {
                name: 'show',

                self: true,

                handler: function() {

                    if (hasClass(this.panel, 'uk-margin-auto-vertical')) {
                        addClass(this.$el, 'uk-flex');
                    } else {
                        css(this.$el, 'display', 'block');
                    }

                    height(this.$el); // force reflow
                }
            },

            {
                name: 'hidden',

                self: true,

                handler: function() {

                    css(this.$el, 'display', '');
                    removeClass(this.$el, 'uk-flex');

                }
            }

        ]

    };

    function install$1 (UIkit) {

        UIkit.modal.dialog = function (content, options) {

            var dialog = UIkit.modal((" <div class=\"uk-modal\"> <div class=\"uk-modal-dialog\">" + content + "</div> </div> "), options);

            dialog.show();

            on(dialog.$el, 'hidden', function (ref) {
                var target = ref.target;
                var currentTarget = ref.currentTarget;

                if (target === currentTarget) {
                    Promise.resolve(function () { return dialog.$destroy(true); });
                }
            });

            return dialog;
        };

        UIkit.modal.alert = function (message, options) {

            options = assign({bgClose: false, escClose: false, labels: UIkit.modal.labels}, options);

            return new Promise(
                function (resolve) { return on(UIkit.modal.dialog((" <div class=\"uk-modal-body\">" + (isString(message) ? message : html(message)) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-primary uk-modal-close\" autofocus>" + (options.labels.ok) + "</button> </div> "), options).$el, 'hide', resolve); }
            );
        };

        UIkit.modal.confirm = function (message, options) {

            options = assign({bgClose: false, escClose: true, labels: UIkit.modal.labels}, options);

            return new Promise(function (resolve, reject) {

                var confirm = UIkit.modal.dialog((" <form> <div class=\"uk-modal-body\">" + (isString(message) ? message : html(message)) + "</div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" + (options.labels.cancel) + "</button> <button class=\"uk-button uk-button-primary\" autofocus>" + (options.labels.ok) + "</button> </div> </form> "), options);

                var resolved = false;

                on(confirm.$el, 'submit', 'form', function (e) {
                    e.preventDefault();
                    resolve();
                    resolved = true;
                    confirm.hide();
                });
                on(confirm.$el, 'hide', function () {
                    if (!resolved) {
                        reject();
                    }
                });

            });
        };

        UIkit.modal.prompt = function (message, value, options) {

            options = assign({bgClose: false, escClose: true, labels: UIkit.modal.labels}, options);

            return new Promise(function (resolve) {

                var prompt = UIkit.modal.dialog((" <form class=\"uk-form-stacked\"> <div class=\"uk-modal-body\"> <label>" + (isString(message) ? message : html(message)) + "</label> <input class=\"uk-input\" autofocus> </div> <div class=\"uk-modal-footer uk-text-right\"> <button class=\"uk-button uk-button-default uk-modal-close\" type=\"button\">" + (options.labels.cancel) + "</button> <button class=\"uk-button uk-button-primary\">" + (options.labels.ok) + "</button> </div> </form> "), options),
                    input = $('input', prompt.$el);

                input.value = value;

                var resolved = false;

                on(prompt.$el, 'submit', 'form', function (e) {
                    e.preventDefault();
                    resolve(input.value);
                    resolved = true;
                    prompt.hide();
                });
                on(prompt.$el, 'hide', function () {
                    if (!resolved) {
                        resolve(null);
                    }
                });

            });
        };

        UIkit.modal.labels = {
            ok: 'Ok',
            cancel: 'Cancel'
        };

    }

    var Nav = {

        extends: Accordion,

        data: {
            targets: '> .uk-parent',
            toggle: '> a',
            content: '> ul'
        }

    };

    var Navbar = {

        mixins: [Class, FlexBug],

        props: {
            dropdown: String,
            mode: 'list',
            align: String,
            offset: Number,
            boundary: Boolean,
            boundaryAlign: Boolean,
            clsDrop: String,
            delayShow: Number,
            delayHide: Number,
            dropbar: Boolean,
            dropbarMode: String,
            dropbarAnchor: Boolean,
            duration: Number
        },

        data: {
            dropdown: '.uk-navbar-nav > li',
            align: !isRtl ? 'left' : 'right',
            clsDrop: 'uk-navbar-dropdown',
            mode: undefined,
            offset: undefined,
            delayShow: undefined,
            delayHide: undefined,
            boundaryAlign: undefined,
            flip: 'x',
            boundary: true,
            dropbar: false,
            dropbarMode: 'slide',
            dropbarAnchor: false,
            duration: 200,
            forceHeight: true,
            selMinHeight: '.uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle'
        },

        computed: {

            boundary: function(ref, $el) {
                var boundary = ref.boundary;
                var boundaryAlign = ref.boundaryAlign;

                return (boundary === true || boundaryAlign) ? $el : boundary;
            },

            dropbarAnchor: function(ref, $el) {
                var dropbarAnchor = ref.dropbarAnchor;

                return query(dropbarAnchor, $el);
            },

            pos: function(ref) {
                var align = ref.align;

                return ("bottom-" + align);
            },

            dropdowns: function(ref, $el) {
                var dropdown = ref.dropdown;
                var clsDrop = ref.clsDrop;

                return $$((dropdown + " ." + clsDrop), $el);
            }

        },

        beforeConnect: function() {

            var ref = this.$props;
            var dropbar = ref.dropbar;

            this.dropbar = dropbar && (query(dropbar, this.$el) || $('+ .uk-navbar-dropbar', this.$el) || $('<div></div>'));

            if (this.dropbar) {

                addClass(this.dropbar, 'uk-navbar-dropbar');

                if (this.dropbarMode === 'slide') {
                    addClass(this.dropbar, 'uk-navbar-dropbar-slide');
                }
            }

        },

        disconnected: function() {
            this.dropbar && remove(this.dropbar);
        },

        update: function() {
            var this$1 = this;


            this.$create(
                'drop',
                this.dropdowns.filter(function (el) { return !this$1.getDropdown(el); }),
                assign({}, this.$props, {boundary: this.boundary, pos: this.pos, offset: this.dropbar || this.offset})
            );

        },

        events: [

            {
                name: 'mouseover',

                delegate: function() {
                    return this.dropdown;
                },

                handler: function(ref) {
                    var current = ref.current;

                    var active = this.getActive();
                    if (active && active.toggle && !within(active.toggle.$el, current) && !active.tracker.movesTo(active.$el)) {
                        active.hide(false);
                    }
                }

            },

            {
                name: 'mouseleave',

                el: function() {
                    return this.dropbar;
                },

                handler: function() {
                    var active = this.getActive();

                    if (active && !matches(this.dropbar, ':hover')) {
                        active.hide();
                    }
                }
            },

            {
                name: 'beforeshow',

                capture: true,

                filter: function() {
                    return this.dropbar;
                },

                handler: function() {

                    if (!this.dropbar.parentNode) {
                        after(this.dropbarAnchor || this.$el, this.dropbar);
                    }

                }
            },

            {
                name: 'show',

                capture: true,

                filter: function() {
                    return this.dropbar;
                },

                handler: function(_, drop) {

                    var $el = drop.$el;
                    var dir = drop.dir;

                    this.clsDrop && addClass($el, ((this.clsDrop) + "-dropbar"));

                    if (dir === 'bottom') {
                        this.transitionTo($el.offsetHeight + toFloat(css($el, 'marginTop')) + toFloat(css($el, 'marginBottom')), $el);
                    }
                }
            },

            {
                name: 'beforehide',

                filter: function() {
                    return this.dropbar;
                },

                handler: function(e, ref) {
                    var $el = ref.$el;


                    var active = this.getActive();

                    if (matches(this.dropbar, ':hover') && active && active.$el === $el) {
                        e.preventDefault();
                    }
                }
            },

            {
                name: 'hide',

                filter: function() {
                    return this.dropbar;
                },

                handler: function(_, ref) {
                    var $el = ref.$el;


                    var active = this.getActive();

                    if (!active || active && active.$el === $el) {
                        this.transitionTo(0);
                    }
                }
            }

        ],

        methods: {

            getActive: function() {
                var ref = this.dropdowns.map(this.getDropdown).filter(function (drop) { return drop && drop.isActive(); });
                var active = ref[0];
                return active && includes(active.mode, 'hover') && within(active.toggle.$el, this.$el) && active;
            },

            transitionTo: function(newHeight, el) {
                var this$1 = this;


                var ref = this;
                var dropbar = ref.dropbar;
                var oldHeight = isVisible(dropbar) ? height(dropbar) : 0;

                el = oldHeight < newHeight && el;

                css(el, 'clip', ("rect(0," + (el.offsetWidth) + "px," + oldHeight + "px,0)"));

                height(dropbar, oldHeight);

                Transition.cancel([el, dropbar]);
                return Promise.all([
                    Transition.start(dropbar, {height: newHeight}, this.duration),
                    Transition.start(el, {clip: ("rect(0," + (el.offsetWidth) + "px," + newHeight + "px,0)")}, this.duration)
                ])
                    .catch(noop)
                    .then(function () {
                        css(el, {clip: ''});
                        this$1.$update(dropbar);
                    });
            },

            getDropdown: function(el) {
                return this.$getComponent(el, 'drop') || this.$getComponent(el, 'dropdown');
            }

        }

    };

    var Offcanvas = {

        mixins: [Modal],

        args: 'mode',

        props: {
            mode: String,
            flip: Boolean,
            overlay: Boolean
        },

        data: {
            mode: 'slide',
            flip: false,
            overlay: false,
            clsPage: 'uk-offcanvas-page',
            clsContainer: 'uk-offcanvas-container',
            selPanel: '.uk-offcanvas-bar',
            clsFlip: 'uk-offcanvas-flip',
            clsContainerAnimation: 'uk-offcanvas-container-animation',
            clsSidebarAnimation: 'uk-offcanvas-bar-animation',
            clsMode: 'uk-offcanvas',
            clsOverlay: 'uk-offcanvas-overlay',
            selClose: '.uk-offcanvas-close'
        },

        computed: {

            clsFlip: function(ref) {
                var flip = ref.flip;
                var clsFlip = ref.clsFlip;

                return flip ? clsFlip : '';
            },

            clsOverlay: function(ref) {
                var overlay = ref.overlay;
                var clsOverlay = ref.clsOverlay;

                return overlay ? clsOverlay : '';
            },

            clsMode: function(ref) {
                var mode = ref.mode;
                var clsMode = ref.clsMode;

                return (clsMode + "-" + mode);
            },

            clsSidebarAnimation: function(ref) {
                var mode = ref.mode;
                var clsSidebarAnimation = ref.clsSidebarAnimation;

                return mode === 'none' || mode === 'reveal' ? '' : clsSidebarAnimation;
            },

            clsContainerAnimation: function(ref) {
                var mode = ref.mode;
                var clsContainerAnimation = ref.clsContainerAnimation;

                return mode !== 'push' && mode !== 'reveal' ? '' : clsContainerAnimation;
            },

            transitionElement: function(ref) {
                var mode = ref.mode;

                return mode === 'reveal' ? this.panel.parentNode : this.panel;
            }

        },

        events: [

            {

                name: 'click',

                delegate: function() {
                    return 'a[href^="#"]';
                },

                handler: function(ref) {
                    var current = ref.current;

                    if (current.hash && $(current.hash, document.body)) {
                        this.hide();
                    }
                }

            },

            {
                name: 'touchstart',

                el: function() {
                    return this.panel;
                },

                handler: function(ref) {
                    var targetTouches = ref.targetTouches;


                    if (targetTouches.length === 1) {
                        this.clientY = targetTouches[0].clientY;
                    }

                }

            },

            {
                name: 'touchmove',

                self: true,
                passive: false,

                filter: function() {
                    return this.overlay;
                },

                handler: function(e) {
                    e.preventDefault();
                }

            },

            {
                name: 'touchmove',

                passive: false,

                el: function() {
                    return this.panel;
                },

                handler: function(e) {

                    if (e.targetTouches.length !== 1) {
                        return;
                    }

                    var clientY = event.targetTouches[0].clientY - this.clientY;
                    var ref = this.panel;
                    var scrollTop$$1 = ref.scrollTop;
                    var scrollHeight = ref.scrollHeight;
                    var clientHeight = ref.clientHeight;

                    if (clientHeight >= scrollHeight
                        || scrollTop$$1 === 0 && clientY > 0
                        || scrollHeight - scrollTop$$1 <= clientHeight && clientY < 0
                    ) {
                        e.preventDefault();
                    }

                }

            },

            {
                name: 'show',

                self: true,

                handler: function() {

                    if (this.mode === 'reveal' && !hasClass(this.panel.parentNode, this.clsMode)) {
                        wrapAll(this.panel, '<div>');
                        addClass(this.panel.parentNode, this.clsMode);
                    }

                    css(document.documentElement, 'overflowY', this.overlay ? 'hidden' : '');
                    addClass(document.body, this.clsContainer, this.clsFlip);
                    css(this.$el, 'display', 'block');
                    addClass(this.$el, this.clsOverlay);
                    addClass(this.panel, this.clsSidebarAnimation, this.mode !== 'reveal' ? this.clsMode : '');

                    height(document.body); // force reflow
                    addClass(document.body, this.clsContainerAnimation);

                    this.clsContainerAnimation && suppressUserScale();

                }
            },

            {
                name: 'hide',

                self: true,

                handler: function() {
                    removeClass(document.body, this.clsContainerAnimation);

                    var active = this.getActive();
                    if (this.mode === 'none' || active && active !== this && active !== this.prev) {
                        trigger(this.panel, 'transitionend');
                    }
                }
            },

            {
                name: 'hidden',

                self: true,

                handler: function() {

                    this.clsContainerAnimation && resumeUserScale();

                    if (this.mode === 'reveal') {
                        unwrap(this.panel);
                    }

                    removeClass(this.panel, this.clsSidebarAnimation, this.clsMode);
                    removeClass(this.$el, this.clsOverlay);
                    css(this.$el, 'display', '');
                    removeClass(document.body, this.clsContainer, this.clsFlip);

                    css(document.documentElement, 'overflowY', '');

                }
            },

            {
                name: 'swipeLeft swipeRight',

                handler: function(e) {

                    if (this.isToggled() && isTouch(e) && e.type === 'swipeLeft' ^ this.flip) {
                        this.hide();
                    }

                }
            }

        ]

    };

    // Chrome in responsive mode zooms page upon opening offcanvas
    function suppressUserScale() {
        getViewport().content += ',user-scalable=0';
    }

    function resumeUserScale() {
        var viewport = getViewport();
        viewport.content = viewport.content.replace(/,user-scalable=0$/, '');
    }

    function getViewport() {
        return $('meta[name="viewport"]', document.head) || append(document.head, '<meta name="viewport">');
    }

    var OverflowAuto = {

        mixins: [Class],

        props: {
            selContainer: String,
            selContent: String,
        },

        data: {
            selContainer: '.uk-modal',
            selContent: '.uk-modal-dialog',
        },

        computed: {

            container: function(ref, $el) {
                var selContainer = ref.selContainer;

                return closest($el, selContainer);
            },

            content: function(ref, $el) {
                var selContent = ref.selContent;

                return closest($el, selContent);
            }

        },

        connected: function() {
            css(this.$el, 'minHeight', 150);
        },

        update: {

            read: function() {

                if (!this.content || !this.container) {
                    return false;
                }

                return {
                    current: toFloat(css(this.$el, 'maxHeight')),
                    max: Math.max(150, height(this.container) - (offset(this.content).height - height(this.$el)))
                };
            },

            write: function(ref) {
                var current = ref.current;
                var max = ref.max;

                css(this.$el, 'maxHeight', max);
                if (Math.round(current) !== Math.round(max)) {
                    trigger(this.$el, 'resize');
                }
            },

            events: ['load', 'resize']

        }

    };

    var Responsive = {

        props: ['width', 'height'],

        connected: function() {
            addClass(this.$el, 'uk-responsive-width');
        },

        update: {

            read: function() {
                return isVisible(this.$el) && this.width && this.height
                    ? {width: width(this.$el.parentNode), height: this.height}
                    : false;
            },

            write: function(dim) {
                height(this.$el, Dimensions.contain({
                    height: this.height,
                    width: this.width
                }, dim).height);
            },

            events: ['load', 'resize']

        }

    };

    var Scroll = {

        props: {
            duration: Number,
            offset: Number
        },

        data: {
            duration: 1000,
            offset: 0
        },

        methods: {

            scrollTo: function(el) {
                var this$1 = this;


                el = el && $(el) || document.body;

                var docHeight = height(document);
                var winHeight = height(window);

                var target = offset(el).top - this.offset;
                if (target + winHeight > docHeight) {
                    target = docHeight - winHeight;
                }

                if (!trigger(this.$el, 'beforescroll', [this, el])) {
                    return;
                }

                var start = Date.now();
                var startY = window.pageYOffset;
                var step = function () {

                    var currentY = startY + (target - startY) * ease(clamp((Date.now() - start) / this$1.duration));

                    scrollTop(window, currentY);

                    // scroll more if we have not reached our destination
                    if (currentY !== target) {
                        requestAnimationFrame(step);
                    } else {
                        trigger(this$1.$el, 'scrolled', [this$1, el]);
                    }

                };

                step();

            }

        },

        events: {

            click: function(e) {

                if (e.defaultPrevented) {
                    return;
                }

                e.preventDefault();
                this.scrollTo(escape(decodeURIComponent(this.$el.hash)).substr(1));
            }

        }

    };

    function ease(k) {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    var Scrollspy = {

        args: 'cls',

        props: {
            cls: 'list',
            target: String,
            hidden: Boolean,
            offsetTop: Number,
            offsetLeft: Number,
            repeat: Boolean,
            delay: Number
        },

        data: function () { return ({
            cls: [],
            target: false,
            hidden: true,
            offsetTop: 0,
            offsetLeft: 0,
            repeat: false,
            delay: 0,
            inViewClass: 'uk-scrollspy-inview'
        }); },

        computed: {

            elements: function(ref, $el) {
                var target = ref.target;

                return target ? $$(target, $el) : [$el];
            }

        },

        update: [

            {

                write: function() {
                    if (this.hidden) {
                        css(filter(this.elements, (":not(." + (this.inViewClass) + ")")), 'visibility', 'hidden');
                    }
                }

            },

            {

                read: function(els) {
                    var this$1 = this;


                    if (!els.update) {
                        return;
                    }

                    this.elements.forEach(function (el, i) {

                        var elData = els[i];

                        if (!elData || elData.el !== el) {
                            var cls = data(el, 'uk-scrollspy-class');
                            elData = {el: el, toggles: cls && cls.split(',') || this$1.cls};
                        }

                        elData.show = isInView(el, this$1.offsetTop, this$1.offsetLeft);
                        els[i] = elData;

                    });

                },

                write: function(els) {
                    var this$1 = this;


                    // Let child components be applied at least once first
                    if (!els.update) {
                        this.$emit();
                        return els.update = true;
                    }

                    this.elements.forEach(function (el, i) {

                        var elData = els[i];
                        var cls = elData.toggles[i] || elData.toggles[0];

                        if (elData.show && !elData.inview && !elData.queued) {

                            var show = function () {

                                css(el, 'visibility', '');
                                addClass(el, this$1.inViewClass);
                                toggleClass(el, cls);

                                trigger(el, 'inview');

                                this$1.$update(el);

                                elData.inview = true;
                                elData.abort && elData.abort();
                            };

                            if (this$1.delay) {

                                elData.queued = true;
                                els.promise = (els.promise || Promise.resolve()).then(function () {
                                    return !elData.inview && new Promise(function (resolve) {

                                        var timer = setTimeout(function () {

                                            show();
                                            resolve();

                                        }, els.promise || this$1.elements.length === 1 ? this$1.delay : 0);

                                        elData.abort = function () {
                                            clearTimeout(timer);
                                            resolve();
                                            elData.queued = false;
                                        };

                                    });

                                });

                            } else {
                                show();
                            }

                        } else if (!elData.show && (elData.inview || elData.queued) && this$1.repeat) {

                            elData.abort && elData.abort();

                            if (!elData.inview) {
                                return;
                            }

                            css(el, 'visibility', this$1.hidden ? 'hidden' : '');
                            removeClass(el, this$1.inViewClass);
                            toggleClass(el, cls);

                            trigger(el, 'outview');

                            this$1.$update(el);

                            elData.inview = false;

                        }


                    });

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    };

    var ScrollspyNav = {

        props: {
            cls: String,
            closest: String,
            scroll: Boolean,
            overflow: Boolean,
            offset: Number
        },

        data: {
            cls: 'uk-active',
            closest: false,
            scroll: false,
            overflow: true,
            offset: 0
        },

        computed: {

            links: function(_, $el) {
                return $$('a[href^="#"]', $el).filter(function (el) { return el.hash; });
            },

            elements: function() {
                return this.closest ? closest(this.links, this.closest) : this.links;
            },

            targets: function() {
                return $$(this.links.map(function (el) { return el.hash; }).join(','));
            }

        },

        update: [

            {

                read: function() {
                    if (this.scroll) {
                        this.$create('scroll', this.links, {offset: this.offset || 0});
                    }
                }

            },

            {

                read: function(data$$1) {
                    var this$1 = this;


                    var scroll = window.pageYOffset + this.offset + 1;
                    var max = height(document) - height(window) + this.offset;

                    data$$1.active = false;

                    this.targets.every(function (el, i) {

                        var ref = offset(el);
                        var top = ref.top;
                        var last = i + 1 === this$1.targets.length;

                        if (!this$1.overflow && (i === 0 && top > scroll || last && top + el.offsetTop < scroll)) {
                            return false;
                        }

                        if (!last && offset(this$1.targets[i + 1]).top <= scroll) {
                            return true;
                        }

                        if (scroll >= max) {
                            for (var j = this$1.targets.length - 1; j > i; j--) {
                                if (isInView(this$1.targets[j])) {
                                    el = this$1.targets[j];
                                    break;
                                }
                            }
                        }

                        return !(data$$1.active = $(filter(this$1.links, ("[href=\"#" + (el.id) + "\"]"))));

                    });

                },

                write: function(ref) {
                    var active = ref.active;


                    this.links.forEach(function (el) { return el.blur(); });
                    removeClass(this.elements, this.cls);

                    if (active) {
                        trigger(this.$el, 'active', [active, addClass(this.closest ? closest(active, this.closest) : active, this.cls)]);
                    }

                },

                events: ['scroll', 'load', 'resize']

            }

        ]

    };

    var Sticky = {

        mixins: [Class, Media],

        props: {
            top: null,
            bottom: Boolean,
            offset: Number,
            animation: String,
            clsActive: String,
            clsInactive: String,
            clsFixed: String,
            clsBelow: String,
            selTarget: String,
            widthElement: Boolean,
            showOnUp: Boolean,
            targetOffset: Number
        },

        data: {
            top: 0,
            bottom: false,
            offset: 0,
            animation: '',
            clsActive: 'uk-active',
            clsInactive: '',
            clsFixed: 'uk-sticky-fixed',
            clsBelow: 'uk-sticky-below',
            selTarget: '',
            widthElement: false,
            showOnUp: false,
            targetOffset: false
        },

        computed: {

            selTarget: function(ref, $el) {
                var selTarget = ref.selTarget;

                return selTarget && $(selTarget, $el) || $el;
            },

            widthElement: function(ref, $el) {
                var widthElement = ref.widthElement;

                return query(widthElement, $el) || this.placeholder;
            },

            isActive: {

                get: function() {
                    return hasClass(this.selTarget, this.clsActive);
                },

                set: function(value) {
                    if (value && !this.isActive) {
                        replaceClass(this.selTarget, this.clsInactive, this.clsActive);
                        trigger(this.$el, 'active');
                    } else if (!value && !hasClass(this.selTarget, this.clsInactive)) {
                        replaceClass(this.selTarget, this.clsActive, this.clsInactive);
                        trigger(this.$el, 'inactive');
                    }
                }

            },

        },

        connected: function() {
            this.placeholder = $('+ .uk-sticky-placeholder', this.$el) || $('<div class="uk-sticky-placeholder"></div>');
            this.isFixed = false;
            this.isActive = false;
        },

        disconnected: function() {

            if (this.isFixed) {
                this.hide();
                removeClass(this.selTarget, this.clsInactive);
            }

            remove(this.placeholder);
            this.placeholder = null;
            this.widthElement = null;
        },

        events: [

            {

                name: 'load hashchange popstate',

                el: window,

                handler: function() {
                    var this$1 = this;


                    if (!(this.targetOffset !== false && location.hash && window.pageYOffset > 0)) {
                        return;
                    }

                    var target = $(location.hash);

                    if (target) {
                        fastdom.read(function () {

                            var ref = offset(target);
                            var top = ref.top;
                            var elTop = offset(this$1.$el).top;
                            var elHeight = this$1.$el.offsetHeight;

                            if (this$1.isFixed && elTop + elHeight >= top && elTop <= top + target.offsetHeight) {
                                scrollTop(window, top - elHeight - (isNumeric(this$1.targetOffset) ? this$1.targetOffset : 0) - this$1.offset);
                            }

                        });
                    }

                }

            }

        ],

        update: [

            {

                read: function(ref, ref$1) {
                    var height$$1 = ref.height;
                    var type = ref$1.type;


                    if (this.isActive && type !== 'update') {

                        this.hide();
                        height$$1 = this.$el.offsetHeight;
                        this.show();

                    }

                    height$$1 = !this.isActive ? this.$el.offsetHeight : height$$1;

                    this.topOffset = offset(this.isFixed ? this.placeholder : this.$el).top;
                    this.bottomOffset = this.topOffset + height$$1;

                    var bottom = parseProp('bottom', this);

                    this.top = Math.max(toFloat(parseProp('top', this)), this.topOffset) - this.offset;
                    this.bottom = bottom && bottom - height$$1;
                    this.inactive = !this.matchMedia;

                    return {
                        lastScroll: false,
                        height: height$$1,
                        margins: css(this.$el, ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'])
                    };
                },

                write: function(ref) {
                    var height$$1 = ref.height;
                    var margins = ref.margins;


                    var ref$1 = this;
                    var placeholder = ref$1.placeholder;

                    css(placeholder, assign({height: height$$1}, margins));

                    if (!within(placeholder, document)) {
                        after(this.$el, placeholder);
                        attr(placeholder, 'hidden', '');
                    }

                    // ensure active/inactive classes are applied
                    this.isActive = this.isActive;

                },

                events: ['load', 'resize']

            },

            {

                read: function(_, ref) {
                    var scrollY = ref.scrollY; if ( scrollY === void 0 ) scrollY = window.pageYOffset;


                    this.width = (isVisible(this.widthElement) ? this.widthElement : this.$el).offsetWidth;

                    return {
                        scroll: this.scroll = scrollY,
                        visible: isVisible(this.$el),
                        top: offsetPosition(this.placeholder)[0]
                    };
                },

                write: function(data$$1, ref) {
                    var this$1 = this;
                    if ( ref === void 0 ) ref = {};
                    var dir = ref.dir;


                    var initTimestamp = data$$1.initTimestamp; if ( initTimestamp === void 0 ) initTimestamp = 0;
                    var lastDir = data$$1.lastDir;
                    var lastScroll = data$$1.lastScroll;
                    var scroll = data$$1.scroll;
                    var top = data$$1.top;
                    var visible = data$$1.visible;
                    var now = performance.now();

                    data$$1.lastScroll = scroll;

                    if (scroll < 0 || scroll === lastScroll || !visible || this.disabled || this.showOnUp && !dir) {
                        return;
                    }

                    if (now - initTimestamp > 300 || dir !== lastDir) {
                        data$$1.initScroll = scroll;
                        data$$1.initTimestamp = now;
                    }

                    data$$1.lastDir = dir;

                    if (this.showOnUp && Math.abs(data$$1.initScroll - scroll) <= 30 && Math.abs(lastScroll - scroll) <= 10) {
                        return;
                    }

                    if (this.inactive
                        || scroll < this.top
                        || this.showOnUp && (scroll <= this.top || dir === 'down' || dir === 'up' && !this.isFixed && scroll <= this.bottomOffset)
                    ) {

                        if (!this.isFixed) {

                            if (Animation.inProgress(this.$el) && top > scroll) {
                                Animation.cancel(this.$el);
                                this.hide();
                            }

                            return;
                        }

                        this.isFixed = false;

                        if (this.animation && scroll > this.topOffset) {
                            Animation.cancel(this.$el);
                            Animation.out(this.$el, this.animation).then(function () { return this$1.hide(); }, noop);
                        } else {
                            this.hide();
                        }

                    } else if (this.isFixed) {

                        this.update();

                    } else if (this.animation) {

                        Animation.cancel(this.$el);
                        this.show();
                        Animation.in(this.$el, this.animation).catch(noop);

                    } else {
                        this.show();
                    }

                },

                events: ['load', 'resize', 'scroll']

            } ],

        methods: {

            show: function() {

                this.isFixed = true;
                this.update();
                attr(this.placeholder, 'hidden', null);

            },

            hide: function() {

                this.isActive = false;
                removeClass(this.$el, this.clsFixed, this.clsBelow);
                css(this.$el, {position: '', top: '', width: ''});
                attr(this.placeholder, 'hidden', '');

            },

            update: function() {

                var active = this.top !== 0 || this.scroll > this.top;
                var top = Math.max(0, this.offset);

                if (this.bottom && this.scroll > this.bottom - this.offset) {
                    top = this.bottom - this.scroll;
                }

                css(this.$el, {
                    position: 'fixed',
                    top: (top + "px"),
                    width: this.width
                });

                this.isActive = active;
                toggleClass(this.$el, this.clsBelow, this.scroll > this.bottomOffset);
                addClass(this.$el, this.clsFixed);

            }

        }

    };

    function parseProp(prop, ref) {
        var $props = ref.$props;
        var $el = ref.$el;
        var propOffset = ref[(prop + "Offset")];


        var value = $props[prop];

        if (!value) {
            return;
        }

        if (isNumeric(value)) {

            return propOffset + toFloat(value);

        } else if (isString(value) && value.match(/^-?\d+vh$/)) {

            return height(window) * toFloat(value) / 100;

        } else {

            var el = value === true ? $el.parentNode : query(value, $el);

            if (el) {
                return offset(el).top + el.offsetHeight;
            }

        }
    }

    var Switcher = {

        mixins: [Togglable],

        args: 'connect',

        props: {
            connect: String,
            toggle: String,
            active: Number,
            swiping: Boolean
        },

        data: {
            connect: '~.uk-switcher',
            toggle: '> * > :first-child',
            active: 0,
            swiping: true,
            cls: 'uk-active',
            clsContainer: 'uk-switcher',
            attrItem: 'uk-switcher-item',
            queued: true
        },

        computed: {

            connects: function(ref, $el) {
                var connect = ref.connect;

                return queryAll(connect, $el);
            },

            toggles: function(ref, $el) {
                var toggle = ref.toggle;

                return $$(toggle, $el);
            }

        },

        events: [

            {

                name: 'click',

                delegate: function() {
                    return ((this.toggle) + ":not(.uk-disabled)");
                },

                handler: function(e) {
                    e.preventDefault();
                    this.show(toNodes(this.$el.children).filter(function (el) { return within(e.current, el); })[0]);
                }

            },

            {
                name: 'click',

                el: function() {
                    return this.connects;
                },

                delegate: function() {
                    return ("[" + (this.attrItem) + "],[data-" + (this.attrItem) + "]");
                },

                handler: function(e) {
                    e.preventDefault();
                    this.show(data(e.current, this.attrItem));
                }
            },

            {
                name: 'swipeRight swipeLeft',

                filter: function() {
                    return this.swiping;
                },

                el: function() {
                    return this.connects;
                },

                handler: function(e) {
                    if (!isTouch(e)) {
                        return;
                    }

                    e.preventDefault();
                    if (!window.getSelection().toString()) {
                        this.show(e.type === 'swipeLeft' ? 'next' : 'previous');
                    }
                }
            }

        ],

        update: function() {
            var this$1 = this;


            this.connects.forEach(function (list) { return this$1.updateAria(list.children); });
            var ref = this.$el;
            var children = ref.children;
            this.show(filter(children, ("." + (this.cls)))[0] || children[this.active] || children[0]);

        },

        methods: {

            index: function() {
                return !!this.connects.length && index(filter(this.connects[0].children, ("." + (this.cls)))[0]);
            },

            show: function(item) {
                var this$1 = this;


                var ref = this.$el;
                var children = ref.children;
                var length = children.length;
                var prev = this.index();
                var hasPrev = prev >= 0;
                var dir = item === 'previous' ? -1 : 1;

                var toggle, active, next = getIndex(item, children, prev);

                for (var i = 0; i < length; i++, next = (next + dir + length) % length) {
                    if (!matches(this.toggles[next], '.uk-disabled *, .uk-disabled, [disabled]')) {
                        toggle = this.toggles[next];
                        active = children[next];
                        break;
                    }
                }

                if (!active || prev >= 0 && hasClass(active, this.cls) || prev === next) {
                    return;
                }

                removeClass(children, this.cls);
                addClass(active, this.cls);
                attr(this.toggles, 'aria-expanded', false);
                attr(toggle, 'aria-expanded', true);

                this.connects.forEach(function (list) {
                    if (!hasPrev) {
                        this$1.toggleNow(list.children[next]);
                    } else {
                        this$1.toggleElement([list.children[prev], list.children[next]]);
                    }
                });

            }

        }

    };

    var Tab = {

        mixins: [Class],

        extends: Switcher,

        props: {
            media: Boolean
        },

        data: {
            media: 960,
            attrItem: 'uk-tab-item'
        },

        connected: function() {

            var cls = hasClass(this.$el, 'uk-tab-left')
                ? 'uk-tab-left'
                : hasClass(this.$el, 'uk-tab-right')
                    ? 'uk-tab-right'
                    : false;

            if (cls) {
                this.$create('toggle', this.$el, {cls: cls, mode: 'media', media: this.media});
            }
        }

    };

    var Toggle = {

        mixins: [Media, Togglable],

        args: 'target',

        props: {
            href: String,
            target: null,
            mode: 'list',
        },

        data: {
            href: false,
            target: false,
            mode: 'click',
            queued: true,
        },

        computed: {

            target: function(ref, $el) {
                var href = ref.href;
                var target = ref.target;

                target = queryAll(target || href, $el);
                return target.length && target || [$el];
            }

        },

        connected: function() {
            trigger(this.target, 'updatearia', [this]);
        },

        events: [

            {

                name: (pointerEnter + " " + pointerLeave),

                filter: function() {
                    return includes(this.mode, 'hover');
                },

                handler: function(e) {
                    if (!isTouch(e)) {
                        this.toggle(("toggle" + (e.type === pointerEnter ? 'show' : 'hide')));
                    }
                }

            },

            {

                name: 'click',

                filter: function() {
                    return includes(this.mode, 'click') || hasTouch && includes(this.mode, 'hover');
                },

                handler: function(e) {

                    if (!isTouch(e) && !includes(this.mode, 'click')) {
                        return;
                    }

                    // TODO better isToggled handling
                    var link;
                    if (closest(e.target, 'a[href="#"], a[href=""], button')
                        || (link = closest(e.target, 'a[href]')) && (
                            this.cls
                            || !isVisible(this.target)
                            || link.hash && matches(this.target, link.hash)
                        )
                    ) {
                        e.preventDefault();
                    }

                    this.toggle();
                }

            }

        ],

        update: {

            write: function() {

                if (!includes(this.mode, 'media') || !this.media) {
                    return;
                }

                var toggled = this.isToggled(this.target);
                if (this.matchMedia ? !toggled : toggled) {
                    this.toggle();
                }

            },

            events: ['load', 'resize']

        },

        methods: {

            toggle: function(type) {
                if (trigger(this.target, type || 'toggle', [this])) {
                    this.toggleElement(this.target);
                }
            }

        }

    };

    function core (UIkit) {

        // core components
        UIkit.component('accordion', Accordion);
        UIkit.component('alert', Alert);
        UIkit.component('cover', Cover);
        UIkit.component('drop', Drop);
        UIkit.component('dropdown', Dropdown);
        UIkit.component('formCustom', FormCustom);
        UIkit.component('gif', Gif);
        UIkit.component('grid', Grid);
        UIkit.component('heightMatch', HeightMatch);
        UIkit.component('heightViewport', HeightViewport);
        UIkit.component('icon', Icon);
        UIkit.component('img', Img);
        UIkit.component('leader', Leader);
        UIkit.component('margin', Margin);
        UIkit.component('modal', Modal$1);
        UIkit.component('nav', Nav);
        UIkit.component('navbar', Navbar);
        UIkit.component('offcanvas', Offcanvas);
        UIkit.component('overflowAuto', OverflowAuto);
        UIkit.component('responsive', Responsive);
        UIkit.component('scroll', Scroll);
        UIkit.component('scrollspy', Scrollspy);
        UIkit.component('scrollspyNav', ScrollspyNav);
        UIkit.component('sticky', Sticky);
        UIkit.component('svg', SVG);
        UIkit.component('switcher', Switcher);
        UIkit.component('tab', Tab);
        UIkit.component('toggle', Toggle);
        UIkit.component('video', Video);

        // Icon components
        UIkit.component('close', Close);
        UIkit.component('marker', IconComponent);
        UIkit.component('navbarToggleIcon', IconComponent);
        UIkit.component('overlayIcon', IconComponent);
        UIkit.component('paginationNext', IconComponent);
        UIkit.component('paginationPrevious', IconComponent);
        UIkit.component('searchIcon', Search);
        UIkit.component('slidenavNext', Slidenav);
        UIkit.component('slidenavPrevious', Slidenav);
        UIkit.component('spinner', Spinner);
        UIkit.component('totop', IconComponent);

        // core functionality
        UIkit.use(Core);

    }

    UIkit.version = '3.0.2';

    core(UIkit);

    var Countdown = {

        mixins: [Class],

        props: {
            date: String,
            clsWrapper: String
        },

        data: {
            date: '',
            clsWrapper: '.uk-countdown-%unit%'
        },

        computed: {

            date: function(ref) {
                var date = ref.date;

                return Date.parse(date);
            },

            days: function(ref, $el) {
                var clsWrapper = ref.clsWrapper;

                return $(clsWrapper.replace('%unit%', 'days'), $el);
            },

            hours: function(ref, $el) {
                var clsWrapper = ref.clsWrapper;

                return $(clsWrapper.replace('%unit%', 'hours'), $el);
            },

            minutes: function(ref, $el) {
                var clsWrapper = ref.clsWrapper;

                return $(clsWrapper.replace('%unit%', 'minutes'), $el);
            },

            seconds: function(ref, $el) {
                var clsWrapper = ref.clsWrapper;

                return $(clsWrapper.replace('%unit%', 'seconds'), $el);
            },

            units: function() {
                var this$1 = this;

                return ['days', 'hours', 'minutes', 'seconds'].filter(function (unit) { return this$1[unit]; });
            }

        },

        connected: function() {
            this.start();
        },

        disconnected: function() {
            var this$1 = this;

            this.stop();
            this.units.forEach(function (unit) { return empty(this$1[unit]); });
        },

        events: [

            {

                name: 'visibilitychange',

                el: document,

                handler: function() {
                    if (document.hidden) {
                        this.stop();
                    } else {
                        this.start();
                    }
                }

            }

        ],

        update: {

            write: function() {
                var this$1 = this;


                var timespan = getTimeSpan(this.date);

                if (timespan.total <= 0) {

                    this.stop();

                    timespan.days
                        = timespan.hours
                        = timespan.minutes
                        = timespan.seconds
                        = 0;
                }

                this.units.forEach(function (unit) {

                    var digits = String(Math.floor(timespan[unit]));

                    digits = digits.length < 2 ? ("0" + digits) : digits;

                    var el = this$1[unit];
                    if (el.textContent !== digits) {
                        digits = digits.split('');

                        if (digits.length !== el.children.length) {
                            html(el, digits.map(function () { return '<span></span>'; }).join(''));
                        }

                        digits.forEach(function (digit, i) { return el.children[i].textContent = digit; });
                    }

                });

            }

        },

        methods: {

            start: function() {
                var this$1 = this;


                this.stop();

                if (this.date && this.units.length) {
                    this.$emit();
                    this.timer = setInterval(function () { return this$1.$emit(); }, 1000);
                }

            },

            stop: function() {

                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }

            }

        }

    };

    function getTimeSpan(date) {

        var total = date - Date.now();

        return {
            total: total,
            seconds: total / 1000 % 60,
            minutes: total / 1000 / 60 % 60,
            hours: total / 1000 / 60 / 60 % 24,
            days: total / 1000 / 60 / 60 / 24
        };
    }

    var targetClass = 'uk-animation-target';

    var Animate = {

        props: {
            animation: Number
        },

        data: {
            animation: 150
        },

        computed: {

            target: function() {
                return this.$el;
            }

        },

        methods: {

            animate: function(action) {
                var this$1 = this;


                addStyle();

                var children = toNodes(this.target.children);
                var propsFrom = children.map(function (el) { return getProps(el, true); });

                var oldHeight = height(this.target);
                var oldScrollY = window.pageYOffset;

                action();

                Transition.cancel(this.target);
                children.forEach(Transition.cancel);

                reset(this.target);
                this.$update(this.target);
                fastdom.flush();

                var newHeight = height(this.target);

                children = children.concat(toNodes(this.target.children).filter(function (el) { return !includes(children, el); }));

                var propsTo = children.map(function (el, i) { return el.parentNode && i in propsFrom
                        ? propsFrom[i]
                        ? isVisible(el)
                            ? getPositionWithMargin(el)
                            : {opacity: 0}
                        : {opacity: isVisible(el) ? 1 : 0}
                        : false; }
                );

                propsFrom = propsTo.map(function (props, i) {
                    var from = children[i].parentNode === this$1.target
                        ? propsFrom[i] || getProps(children[i])
                        : false;

                    if (from) {
                        if (!props) {
                            delete from.opacity;
                        } else if (!('opacity' in props)) {
                            var opacity = from.opacity;

                            if (opacity % 1) {
                                props.opacity = 1;
                            } else {
                                delete from.opacity;
                            }
                        }
                    }

                    return from;
                });

                addClass(this.target, targetClass);
                children.forEach(function (el, i) { return propsFrom[i] && css(el, propsFrom[i]); });
                css(this.target, 'height', oldHeight);
                scrollTop(window, oldScrollY);

                return Promise.all(children.map(function (el, i) { return propsFrom[i] && propsTo[i]
                        ? Transition.start(el, propsTo[i], this$1.animation, 'ease')
                        : Promise.resolve(); }
                ).concat(Transition.start(this.target, {height: newHeight}, this.animation, 'ease'))).then(function () {
                    children.forEach(function (el, i) { return css(el, {display: propsTo[i].opacity === 0 ? 'none' : '', zIndex: ''}); });
                    reset(this$1.target);
                    this$1.$update(this$1.target);
                    fastdom.flush(); // needed for IE11
                }, noop);

            }
        }
    };

    function getProps(el, opacity) {

        var zIndex = css(el, 'zIndex');

        return isVisible(el)
            ? assign({
                display: '',
                opacity: opacity ? css(el, 'opacity') : '0',
                pointerEvents: 'none',
                position: 'absolute',
                zIndex: zIndex === 'auto' ? index(el) : zIndex
            }, getPositionWithMargin(el))
            : false;
    }

    function reset(el) {
        css(el.children, {
            height: '',
            left: '',
            opacity: '',
            pointerEvents: '',
            position: '',
            top: '',
            width: ''
        });
        removeClass(el, targetClass);
        css(el, 'height', '');
    }

    function getPositionWithMargin(el) {
        var ref = el.getBoundingClientRect();
        var height$$1 = ref.height;
        var width$$1 = ref.width;
        var ref$1 = position(el);
        var top = ref$1.top;
        var left = ref$1.left;
        top += toFloat(css(el, 'marginTop'));

        return {top: top, left: left, height: height$$1, width: width$$1};
    }

    var style$1;

    function addStyle() {
        if (!style$1) {
            style$1 = append(document.head, '<style>').sheet;
            style$1.insertRule(
                ("." + targetClass + " > * {\n                    margin-top: 0 !important;\n                    transform: none !important;\n                }"), 0
            );
        }
    }

    var Filter = {

        mixins: [Animate],

        args: 'target',

        props: {
            target: Boolean,
            selActive: Boolean
        },

        data: {
            target: null,
            selActive: false,
            attrItem: 'uk-filter-control',
            cls: 'uk-active',
            animation: 250
        },

        computed: {

            toggles: function(ref, $el) {
                var attrItem = ref.attrItem;

                return $$(("[" + (this.attrItem) + "],[data-" + (this.attrItem) + "]"), $el);
            },

            target: function(ref, $el) {
                var target = ref.target;

                return $(target, $el);
            }

        },

        events: [

            {

                name: 'click',

                delegate: function() {
                    return ("[" + (this.attrItem) + "],[data-" + (this.attrItem) + "]");
                },

                handler: function(e) {

                    e.preventDefault();
                    this.apply(e.current);

                }

            }

        ],

        connected: function() {
            var this$1 = this;


            if (this.selActive === false) {
                return;
            }

            var actives = $$(this.selActive, this.$el);
            this.toggles.forEach(function (el) { return toggleClass(el, this$1.cls, includes(actives, el)); });
        },

        update: function(data$$1) {

            var toggles = data$$1.toggles;
            var children = data$$1.children;
            if (isEqualList(toggles, this.toggles, false) && isEqualList(children, this.target.children, false)) {
                return;
            }

            data$$1.toggles = this.toggles;
            data$$1.children = this.target.children;

            this.setState(this.getState(), false);

        },

        methods: {

            apply: function(el) {
                this.setState(mergeState(el, this.attrItem, this.getState()));
            },

            getState: function() {
                var this$1 = this;

                return this.toggles
                    .filter(function (item) { return hasClass(item, this$1.cls); })
                    .reduce(function (state, el) { return mergeState(el, this$1.attrItem, state); }, {filter: {'': ''}, sort: []});
            },

            setState: function(state, animate$$1) {
                var this$1 = this;
                if ( animate$$1 === void 0 ) animate$$1 = true;


                state = assign({filter: {'': ''}, sort: []}, state);

                trigger(this.$el, 'beforeFilter', [this, state]);

                var children = toNodes(this.target.children);

                this.toggles.forEach(function (el) { return toggleClass(el, this$1.cls, matchFilter(el, this$1.attrItem, state)); });

                var apply$$1 = function () {

                    var selector = getSelector(state);

                    children.forEach(function (el) { return css(el, 'display', selector && !matches(el, selector) ? 'none' : ''); });

                    var ref = state.sort;
                    var sort = ref[0];
                    var order = ref[1];

                    if (sort) {
                        var sorted = sortItems(children, sort, order);
                        if (!isEqualList(sorted, children)) {
                            sorted.forEach(function (el) { return append(this$1.target, el); });
                        }
                    }

                };

                if (animate$$1) {
                    this.animate(apply$$1).then(function () { return trigger(this$1.$el, 'afterFilter', [this$1]); });
                } else {
                    apply$$1();
                    trigger(this.$el, 'afterFilter', [this]);
                }

            }

        }

    };

    function getFilter(el, attr$$1) {
        return parseOptions(data(el, attr$$1), ['filter']);
    }

    function mergeState(el, attr$$1, state) {

        toNodes(el).forEach(function (el) {
            var filterBy = getFilter(el, attr$$1);
            var filter$$1 = filterBy.filter;
            var group = filterBy.group;
            var sort = filterBy.sort;
            var order = filterBy.order; if ( order === void 0 ) order = 'asc';

            if (filter$$1 || isUndefined(sort)) {

                if (group) {
                    delete state.filter[''];
                    state.filter[group] = filter$$1;
                } else {
                    state.filter = {'': filter$$1 || ''};
                }

            }

            if (!isUndefined(sort)) {
                state.sort = [sort, order];
            }
        });

        return state;
    }

    function matchFilter(el, attr$$1, ref) {
        var stateFilter = ref.filter; if ( stateFilter === void 0 ) stateFilter = {'': ''};
        var ref_sort = ref.sort;
        var stateSort = ref_sort[0];
        var stateOrder = ref_sort[1];


        var ref$1 = getFilter(el, attr$$1);
        var filter$$1 = ref$1.filter;
        var group = ref$1.group; if ( group === void 0 ) group = '';
        var sort = ref$1.sort;
        var order = ref$1.order; if ( order === void 0 ) order = 'asc';

        filter$$1 = isUndefined(sort) ? filter$$1 || '' : filter$$1;
        sort = isUndefined(filter$$1) ? sort || '' : sort;

        return (isUndefined(filter$$1) || group in stateFilter && filter$$1 === stateFilter[group])
            && (isUndefined(sort) || stateSort === sort && stateOrder === order);
    }

    function isEqualList(listA, listB, strict) {
        if ( strict === void 0 ) strict = true;


        listA = toNodes(listA);
        listB = toNodes(listB);

        return listA.length === listB.length
            && listA.every(function (el, i) { return strict ? el === listB[i] : ~listB.indexOf(el); });
    }

    function getSelector(ref) {
        var filter$$1 = ref.filter;

        var selector = '';
        each(filter$$1, function (value) { return selector += value || ''; });
        return selector;
    }

    function sortItems(nodes, sort, order) {
        return toNodes(nodes).sort(function (a, b) { return data(a, sort).localeCompare(data(b, sort), undefined, {numeric: true}) * (order === 'asc' || -1); });
    }

    var Animations = {

        slide: {

            show: function(dir) {
                return [
                    {transform: translate(dir * -100)},
                    {transform: translate()}
                ];
            },

            percent: function(current) {
                return translated(current);
            },

            translate: function(percent, dir) {
                return [
                    {transform: translate(dir * -100 * percent)},
                    {transform: translate(dir * 100 * (1 - percent))}
                ];
            }

        }

    };

    function translated(el) {
        return Math.abs(css(el, 'transform').split(',')[4] / el.offsetWidth) || 0;
    }

    function translate(value, unit) {
        if ( value === void 0 ) value = 0;
        if ( unit === void 0 ) unit = '%';

        return ("translateX(" + value + (value ? unit : '') + ")"); // currently not translate3d to support IE, translate3d within translate3d does not work while transitioning
    }

    function scale3d(value) {
        return ("scale3d(" + value + ", " + value + ", 1)");
    }

    var Animations$1 = assign({}, Animations, {

        fade: {

            show: function() {
                return [
                    {opacity: 0},
                    {opacity: 1}
                ];
            },

            percent: function(current) {
                return 1 - css(current, 'opacity');
            },

            translate: function(percent) {
                return [
                    {opacity: 1 - percent},
                    {opacity: percent}
                ];
            }

        },

        scale: {

            show: function() {
                return [
                    {opacity: 0, transform: scale3d(1 - .2)},
                    {opacity: 1, transform: scale3d(1)}
                ];
            },

            percent: function(current) {
                return 1 - css(current, 'opacity');
            },

            translate: function(percent) {
                return [
                    {opacity: 1 - percent, transform: scale3d(1 - .2 * percent)},
                    {opacity: percent, transform: scale3d(1 - .2 + .2 * percent)}
                ];
            }

        }

    });

    function Transitioner(prev, next, dir, ref) {
        var animation = ref.animation;
        var easing = ref.easing;


        var percent = animation.percent;
        var translate = animation.translate;
        var show = animation.show; if ( show === void 0 ) show = noop;
        var props = show(dir);
        var deferred = new Deferred();

        return {

            dir: dir,

            show: function(duration, percent, linear) {
                var this$1 = this;
                if ( percent === void 0 ) percent = 0;


                var timing = linear ? 'linear' : easing;
                duration -= Math.round(duration * clamp(percent, -1, 1));

                this.translate(percent);

                triggerUpdate(next, 'itemin', {percent: percent, duration: duration, timing: timing, dir: dir});
                triggerUpdate(prev, 'itemout', {percent: 1 - percent, duration: duration, timing: timing, dir: dir});

                Promise.all([
                    Transition.start(next, props[1], duration, timing),
                    Transition.start(prev, props[0], duration, timing)
                ]).then(function () {
                    this$1.reset();
                    deferred.resolve();
                }, noop);

                return deferred.promise;
            },

            stop: function() {
                return Transition.stop([next, prev]);
            },

            cancel: function() {
                Transition.cancel([next, prev]);
            },

            reset: function() {
                for (var prop in props[0]) {
                    css([next, prev], prop, '');
                }
            },

            forward: function(duration, percent) {
                if ( percent === void 0 ) percent = this.percent();

                Transition.cancel([next, prev]);
                return this.show(duration, percent, true);

            },

            translate: function(percent) {

                this.reset();

                var props = translate(percent, dir);
                css(next, props[1]);
                css(prev, props[0]);
                triggerUpdate(next, 'itemtranslatein', {percent: percent, dir: dir});
                triggerUpdate(prev, 'itemtranslateout', {percent: 1 - percent, dir: dir});

            },

            percent: function() {
                return percent(prev || next, next, dir);
            },

            getDistance: function() {
                return prev && prev.offsetWidth;
            }

        };

    }

    function triggerUpdate(el, type, data$$1) {
        trigger(el, createEvent(type, false, false, data$$1));
    }

    var SliderAutoplay = {

        props: {
            autoplay: Boolean,
            autoplayInterval: Number,
            pauseOnHover: Boolean
        },

        data: {
            autoplay: false,
            autoplayInterval: 7000,
            pauseOnHover: true
        },

        connected: function() {
            this.startAutoplay();
            this.userInteracted = false;
        },

        disconnected: function() {
            this.stopAutoplay();
        },

        events: [

            {

                name: 'visibilitychange',

                el: document,

                handler: function() {
                    if (document.hidden) {
                        this.stopAutoplay();
                    } else {
                        !this.userInteracted && this.startAutoplay();
                    }
                }

            },

            {

                name: pointerDown,
                handler: function() {
                    this.userInteracted = true;
                    this.stopAutoplay();
                }

            },

            {

                name: 'mouseenter',

                filter: function() {
                    return this.autoplay;
                },

                handler: function() {
                    this.isHovering = true;
                }

            },

            {

                name: 'mouseleave',

                filter: function() {
                    return this.autoplay;
                },

                handler: function() {
                    this.isHovering = false;
                }

            }

        ],

        methods: {

            startAutoplay: function() {
                var this$1 = this;


                this.stopAutoplay();

                if (this.autoplay) {
                    this.interval = setInterval(
                        function () { return !(this$1.isHovering && this$1.pauseOnHover) && !this$1.stack.length && this$1.show('next'); },
                        this.autoplayInterval
                    );
                }

            },

            stopAutoplay: function() {
                if (this.interval) {
                    clearInterval(this.interval);
                }
            }

        }

    };

    var SliderDrag = {

        props: {
            draggable: Boolean
        },

        data: {
            draggable: true,
            threshold: 10
        },

        created: function() {
            var this$1 = this;


            ['start', 'move', 'end'].forEach(function (key) {

                var fn = this$1[key];
                this$1[key] = function (e) {

                    var pos = getPos$1(e).x * (isRtl ? -1 : 1);

                    this$1.prevPos = pos !== this$1.pos ? this$1.pos : this$1.prevPos;
                    this$1.pos = pos;

                    fn(e);
                };

            });

        },

        events: [

            {

                name: pointerDown,

                delegate: function() {
                    return this.selSlides;
                },

                handler: function(e) {

                    if (!this.draggable
                        || !isTouch(e) && hasTextNodesOnly(e.target)
                        || e.button > 0
                        || this.length < 2
                    ) {
                        return;
                    }

                    this.start(e);
                }

            },

            {

                // Workaround for iOS 11 bug: https://bugs.webkit.org/show_bug.cgi?id=184250

                name: 'touchmove',
                passive: false,
                handler: 'move',
                delegate: function() {
                    return this.selSlides;
                }

            },

            {
                name: 'dragstart',

                handler: function(e) {
                    e.preventDefault();
                }
            }

        ],

        methods: {

            start: function() {
                var this$1 = this;


                this.drag = this.pos;

                if (this._transitioner) {

                    this.percent = this._transitioner.percent();
                    this.drag += this._transitioner.getDistance() * this.percent * this.dir;

                    this._transitioner.cancel();
                    this._transitioner.translate(this.percent);

                    this.dragging = true;

                    this.stack = [];

                } else {
                    this.prevIndex = this.index;
                }

                // See above workaround notice
                var off$$1 = pointerMove !== 'touchmove'
                    ? on(document, pointerMove, this.move, {passive: false})
                    : noop;
                this.unbindMove = function () {
                    off$$1();
                    this$1.unbindMove = null;
                };
                on(window, 'scroll', this.unbindMove);
                on(document, pointerUp, this.end, true);

            },

            move: function(e) {
                var this$1 = this;


                // See above workaround notice
                if (!this.unbindMove) {
                    return;
                }

                var distance = this.pos - this.drag;

                if (distance === 0 || this.prevPos === this.pos || !this.dragging && Math.abs(distance) < this.threshold) {
                    return;
                }

                e.cancelable && e.preventDefault();

                this.dragging = true;
                this.dir = (distance < 0 ? 1 : -1);

                var ref = this;
                var slides = ref.slides;
                var ref$1 = this;
                var prevIndex = ref$1.prevIndex;
                var dis = Math.abs(distance);
                var nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
                var width$$1 = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;

                while (nextIndex !== prevIndex && dis > width$$1) {

                    this.drag -= width$$1 * this.dir;

                    prevIndex = nextIndex;
                    dis -= width$$1;
                    nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
                    width$$1 = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;

                }

                this.percent = dis / width$$1;

                var prev = slides[prevIndex];
                var next = slides[nextIndex];
                var changed = this.index !== nextIndex;
                var edge = prevIndex === nextIndex;

                var itemShown;

                [this.index, this.prevIndex].filter(function (i) { return !includes([nextIndex, prevIndex], i); }).forEach(function (i) {
                    trigger(slides[i], 'itemhidden', [this$1]);

                    if (edge) {
                        itemShown = true;
                        this$1.prevIndex = prevIndex;
                    }

                });

                if (this.index === prevIndex && this.prevIndex !== prevIndex || itemShown) {
                    trigger(slides[this.index], 'itemshown', [this]);
                }

                if (changed) {
                    this.prevIndex = prevIndex;
                    this.index = nextIndex;

                    !edge && trigger(prev, 'beforeitemhide', [this]);
                    trigger(next, 'beforeitemshow', [this]);
                }

                this._transitioner = this._translate(Math.abs(this.percent), prev, !edge && next);

                if (changed) {
                    !edge && trigger(prev, 'itemhide', [this]);
                    trigger(next, 'itemshow', [this]);
                }

            },

            end: function() {

                off(window, 'scroll', this.unbindMove);
                this.unbindMove && this.unbindMove();
                off(document, pointerUp, this.end, true);

                if (this.dragging) {

                    this.dragging = null;

                    if (this.index === this.prevIndex) {
                        this.percent = 1 - this.percent;
                        this.dir *= -1;
                        this._show(false, this.index, true);
                        this._transitioner = null;
                    } else {

                        var dirChange = (isRtl ? this.dir * (isRtl ? 1 : -1) : this.dir) < 0 === this.prevPos > this.pos;
                        this.index = dirChange ? this.index : this.prevIndex;

                        if (dirChange) {
                            this.percent = 1 - this.percent;
                        }

                        this.show(this.dir > 0 && !dirChange || this.dir < 0 && dirChange ? 'next' : 'previous', true);
                    }

                    preventClick();

                }

                this.drag
                    = this.percent
                    = null;

            }

        }

    };

    function hasTextNodesOnly(el) {
        return !el.children.length && el.childNodes.length;
    }

    var SliderNav = {

        data: {
            selNav: false
        },

        computed: {

            nav: function(ref, $el) {
                var selNav = ref.selNav;

                return $(selNav, $el);
            },

            selNavItem: function(ref) {
                var attrItem = ref.attrItem;

                return ("[" + attrItem + "],[data-" + attrItem + "]");
            },

            navItems: function(_, $el) {
                return $$(this.selNavItem, $el);
            }

        },

        update: {

            write: function() {
                var this$1 = this;


                if (this.nav && this.length !== this.nav.children.length) {
                    html(this.nav, this.slides.map(function (_, i) { return ("<li " + (this$1.attrItem) + "=\"" + i + "\"><a href=\"#\"></a></li>"); }).join(''));
                }

                toggleClass($$(this.selNavItem, this.$el).concat(this.nav), 'uk-hidden', !this.maxIndex);

                this.updateNav();

            },

            events: ['load', 'resize']

        },

        events: [

            {

                name: 'click',

                delegate: function() {
                    return this.selNavItem;
                },

                handler: function(e) {
                    e.preventDefault();
                    this.show(data(e.current, this.attrItem));
                }

            },

            {

                name: 'itemshow',
                handler: 'updateNav'

            }

        ],

        methods: {

            updateNav: function() {
                var this$1 = this;


                var i = this.getValidIndex();
                this.navItems.forEach(function (el) {

                    var cmd = data(el, this$1.attrItem);

                    toggleClass(el, this$1.clsActive, toNumber(cmd) === i);
                    toggleClass(el, 'uk-invisible', this$1.finite && (cmd === 'previous' && i === 0 || cmd === 'next' && i >= this$1.maxIndex));
                });

            }

        }

    };

    var Slider = {

        mixins: [SliderAutoplay, SliderDrag, SliderNav],

        props: {
            clsActivated: Boolean,
            easing: String,
            index: Number,
            finite: Boolean,
            velocity: Number
        },

        data: function () { return ({
            easing: 'ease',
            finite: false,
            velocity: 1,
            index: 0,
            stack: [],
            percent: 0,
            clsActive: 'uk-active',
            clsActivated: false,
            Transitioner: false,
            transitionOptions: {}
        }); },

        computed: {

            duration: function(ref, $el) {
                var velocity = ref.velocity;

                return speedUp($el.offsetWidth / velocity);
            },

            length: function() {
                return this.slides.length;
            },

            list: function(ref, $el) {
                var selList = ref.selList;

                return $(selList, $el);
            },

            maxIndex: function() {
                return this.length - 1;
            },

            selSlides: function(ref) {
                var selList = ref.selList;

                return (selList + " > *");
            },

            slides: function() {
                return toNodes(this.list.children);
            }

        },

        events: {

            itemshown: function() {
                this.$update(this.list);
            }

        },

        methods: {

            show: function(index$$1, force) {
                var this$1 = this;
                if ( force === void 0 ) force = false;


                if (this.dragging || !this.length) {
                    return;
                }

                var ref = this;
                var stack = ref.stack;
                var queueIndex = force ? 0 : stack.length;
                var reset = function () {
                    stack.splice(queueIndex, 1);

                    if (stack.length) {
                        this$1.show(stack.shift(), true);
                    }
                };

                stack[force ? 'unshift' : 'push'](index$$1);

                if (!force && stack.length > 1) {

                    if (stack.length === 2) {
                        this._transitioner.forward(Math.min(this.duration, 200));
                    }

                    return;
                }

                var prevIndex = this.index;
                var prev = hasClass(this.slides, this.clsActive) && this.slides[prevIndex];
                var nextIndex = this.getIndex(index$$1, this.index);
                var next = this.slides[nextIndex];

                if (prev === next) {
                    reset();
                    return;
                }

                this.dir = getDirection(index$$1, prevIndex);
                this.prevIndex = prevIndex;
                this.index = nextIndex;

                prev && trigger(prev, 'beforeitemhide', [this]);
                if (!trigger(next, 'beforeitemshow', [this, prev])) {
                    this.index = this.prevIndex;
                    reset();
                    return;
                }

                var promise = this._show(prev, next, force).then(function () {

                    prev && trigger(prev, 'itemhidden', [this$1]);
                    trigger(next, 'itemshown', [this$1]);

                    return new Promise(function (resolve) {
                        fastdom.write(function () {
                            stack.shift();
                            if (stack.length) {
                                this$1.show(stack.shift(), true);
                            } else {
                                this$1._transitioner = null;
                            }
                            resolve();
                        });
                    });

                });

                prev && trigger(prev, 'itemhide', [this]);
                trigger(next, 'itemshow', [this]);

                return promise;

            },

            getIndex: function(index$$1, prev) {
                if ( index$$1 === void 0 ) index$$1 = this.index;
                if ( prev === void 0 ) prev = this.index;

                return clamp(getIndex(index$$1, this.slides, prev, this.finite), 0, this.maxIndex);
            },

            getValidIndex: function(index$$1, prevIndex) {
                if ( index$$1 === void 0 ) index$$1 = this.index;
                if ( prevIndex === void 0 ) prevIndex = this.prevIndex;

                return this.getIndex(index$$1, prevIndex);
            },

            _show: function(prev, next, force) {

                this._transitioner = this._getTransitioner(
                    prev,
                    next,
                    this.dir,
                    assign({
                        easing: force
                            ? next.offsetWidth < 600
                                ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' /* easeOutQuad */
                                : 'cubic-bezier(0.165, 0.84, 0.44, 1)' /* easeOutQuart */
                            : this.easing
                    }, this.transitionOptions)
                );

                if (!force && !prev) {
                    this._transitioner.translate(1);
                    return Promise.resolve();
                }

                var ref = this.stack;
                var length = ref.length;
                return this._transitioner[length > 1 ? 'forward' : 'show'](length > 1 ? Math.min(this.duration, 75 + 75 / (length - 1)) : this.duration, this.percent);

            },

            _getDistance: function(prev, next) {
                return new this._getTransitioner(prev, prev !== next && next).getDistance();
            },

            _translate: function(percent, prev, next) {
                if ( prev === void 0 ) prev = this.prevIndex;
                if ( next === void 0 ) next = this.index;

                var transitioner = this._getTransitioner(prev !== next ? prev : false, next);
                transitioner.translate(percent);
                return transitioner;
            },

            _getTransitioner: function(prev, next, dir, options) {
                if ( prev === void 0 ) prev = this.prevIndex;
                if ( next === void 0 ) next = this.index;
                if ( dir === void 0 ) dir = this.dir || 1;
                if ( options === void 0 ) options = this.transitionOptions;

                return new this.Transitioner(
                    isNumber(prev) ? this.slides[prev] : prev,
                    isNumber(next) ? this.slides[next] : next,
                    dir * (isRtl ? -1 : 1),
                    options
                );
            }

        }

    };

    function getDirection(index$$1, prevIndex) {
        return index$$1 === 'next'
            ? 1
            : index$$1 === 'previous'
                ? -1
                : index$$1 < prevIndex
                    ? -1
                    : 1;
    }

    function speedUp(x) {
        return .5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
    }

    var Slideshow = {

        mixins: [Slider],

        props: {
            animation: String
        },

        data: {
            animation: 'slide',
            clsActivated: 'uk-transition-active',
            Animations: Animations,
            Transitioner: Transitioner
        },

        computed: {

            animation: function(ref) {
                var animation = ref.animation;
                var Animations$$1 = ref.Animations;

                return assign(animation in Animations$$1 ? Animations$$1[animation] : Animations$$1.slide, {name: animation});
            },

            transitionOptions: function() {
                return {animation: this.animation};
            }

        },

        events: {

            'itemshow itemhide itemshown itemhidden': function(ref) {
                var target = ref.target;

                this.$update(target);
            },

            itemshow: function() {
                isNumber(this.prevIndex) && fastdom.flush(); // iOS 10+ will honor the video.play only if called from a gesture handler
            },

            beforeitemshow: function(ref) {
                var target = ref.target;

                addClass(target, this.clsActive);
            },

            itemshown: function(ref) {
                var target = ref.target;

                addClass(target, this.clsActivated);
            },

            itemhidden: function(ref) {
                var target = ref.target;

                removeClass(target, this.clsActive, this.clsActivated);
            }

        }

    };

    var LightboxPanel = {

        mixins: [Container, Modal, Togglable, Slideshow],

        functional: true,

        props: {
            delayControls: Number,
            preload: Number,
            videoAutoplay: Boolean,
            template: String
        },

        data: function () { return ({
            preload: 1,
            videoAutoplay: false,
            delayControls: 3000,
            items: [],
            cls: 'uk-open',
            clsPage: 'uk-lightbox-page',
            selList: '.uk-lightbox-items',
            attrItem: 'uk-lightbox-item',
            selClose: '.uk-close-large',
            pauseOnHover: false,
            velocity: 2,
            Animations: Animations$1,
            template: "<div class=\"uk-lightbox uk-overflow-hidden\"> <ul class=\"uk-lightbox-items\"></ul> <div class=\"uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque\"> <button class=\"uk-lightbox-toolbar-icon uk-close-large\" type=\"button\" uk-close></button> </div> <a class=\"uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade\" href=\"#\" uk-slidenav-previous uk-lightbox-item=\"previous\"></a> <a class=\"uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade\" href=\"#\" uk-slidenav-next uk-lightbox-item=\"next\"></a> <div class=\"uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque\"></div> </div>"
        }); },

        created: function() {
            var this$1 = this;


            this.$mount(append(this.container, this.template));

            this.caption = $('.uk-lightbox-caption', this.$el);

            this.items.forEach(function () { return append(this$1.list, '<li></li>'); });

        },

        events: [

            {

                name: (pointerMove + " " + pointerDown + " keydown"),

                handler: 'showControls'

            },

            {

                name: pointerUp,

                self: true,

                delegate: function() {
                    return this.selSlides;
                },

                handler: function(e) {
                    e.preventDefault();
                    this.hide();
                }

            },

            {

                name: 'shown',

                self: true,

                handler: function() {
                    this.startAutoplay();
                    this.showControls();
                }

            },

            {

                name: 'hide',

                self: true,

                handler: function() {

                    this.stopAutoplay();
                    this.hideControls();

                    removeClass(this.slides, this.clsActive);
                    Transition.stop(this.slides);

                }
            },

            {

                name: 'hidden',

                self: true,

                handler: function() {
                    this.$destroy(true);
                }

            },

            {

                name: 'keyup',

                el: document,

                handler: function(e) {

                    if (!this.isToggled(this.$el)) {
                        return;
                    }

                    switch (e.keyCode) {
                        case 37:
                            this.show('previous');
                            break;
                        case 39:
                            this.show('next');
                            break;
                    }
                }
            },

            {

                name: 'beforeitemshow',

                handler: function(e) {

                    if (this.isToggled()) {
                        return;
                    }

                    this.draggable = false;

                    e.preventDefault();

                    this.toggleNow(this.$el, true);

                    this.animation = Animations$1['scale'];
                    removeClass(e.target, this.clsActive);
                    this.stack.splice(1, 0, this.index);

                }

            },

            {

                name: 'itemshow',

                handler: function(ref) {
                    var target = ref.target;


                    var i = index(target);
                    var ref$1 = this.getItem(i);
                    var caption = ref$1.caption;

                    css(this.caption, 'display', caption ? '' : 'none');
                    html(this.caption, caption);

                    for (var j = 0; j <= this.preload; j++) {
                        this.loadItem(this.getIndex(i + j));
                        this.loadItem(this.getIndex(i - j));
                    }

                }

            },

            {

                name: 'itemshown',

                handler: function() {
                    this.draggable = this.$props.draggable;
                }

            },

            {

                name: 'itemload',

                handler: function(_, item) {
                    var this$1 = this;


                    var source = item.source;
                    var type = item.type;
                    var alt = item.alt;

                    this.setItem(item, '<span uk-spinner></span>');

                    if (!source) {
                        return;
                    }

                    var matches$$1;

                    // Image
                    if (type === 'image' || source.match(/\.(jp(e)?g|png|gif|svg)($|\?)/i)) {

                        getImage(source).then(
                            function (img) { return this$1.setItem(item, ("<img width=\"" + (img.width) + "\" height=\"" + (img.height) + "\" src=\"" + source + "\" alt=\"" + (alt ? alt : '') + "\">")); },
                            function () { return this$1.setError(item); }
                        );

                        // Video
                    } else if (type === 'video' || source.match(/\.(mp4|webm|ogv)($|\?)/i)) {

                        var video = $(("<video controls playsinline" + (item.poster ? (" poster=\"" + (item.poster) + "\"") : '') + " uk-video=\"" + (this.videoAutoplay) + "\"></video>"));
                        attr(video, 'src', source);

                        once(video, 'error loadedmetadata', function (type) {
                            if (type === 'error') {
                                this$1.setError(item);
                            } else {
                                attr(video, {width: video.videoWidth, height: video.videoHeight});
                                this$1.setItem(item, video);
                            }
                        });

                        // Iframe
                    } else if (type === 'iframe' || source.match(/\.(html|php)($|\?)/i)) {

                        this.setItem(item, ("<iframe class=\"uk-lightbox-iframe\" src=\"" + source + "\" frameborder=\"0\" allowfullscreen></iframe>"));

                        // YouTube
                    } else if ((matches$$1 = source.match(/\/\/.*?youtube(-nocookie)?\.[a-z]+\/watch\?v=([^&\s]+)/) || source.match(/()youtu\.be\/(.*)/))) {

                        var id = matches$$1[2];
                        var setIframe = function (width$$1, height$$1) {
                            if ( width$$1 === void 0 ) width$$1 = 640;
                            if ( height$$1 === void 0 ) height$$1 = 450;

                            return this$1.setItem(item, getIframe(("https://www.youtube" + (matches$$1[1] || '') + ".com/embed/" + id), width$$1, height$$1, this$1.videoAutoplay));
                        };

                        getImage(("https://img.youtube.com/vi/" + id + "/maxresdefault.jpg")).then(
                            function (ref) {
                                var width$$1 = ref.width;
                                var height$$1 = ref.height;

                                // YouTube default 404 thumb, fall back to low resolution
                                if (width$$1 === 120 && height$$1 === 90) {
                                    getImage(("https://img.youtube.com/vi/" + id + "/0.jpg")).then(
                                        function (ref) {
                                            var width$$1 = ref.width;
                                            var height$$1 = ref.height;

                                            return setIframe(width$$1, height$$1);
                                    },
                                        setIframe
                                    );
                                } else {
                                    setIframe(width$$1, height$$1);
                                }
                            },
                            setIframe
                        );

                        // Vimeo
                    } else if ((matches$$1 = source.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/))) {

                        ajax(("https://vimeo.com/api/oembed.json?maxwidth=1920&url=" + (encodeURI(source))), {responseType: 'json', withCredentials: false})
                            .then(
                                function (ref) {
                                    var ref_response = ref.response;
                                    var height$$1 = ref_response.height;
                                    var width$$1 = ref_response.width;

                                    return this$1.setItem(item, getIframe(("https://player.vimeo.com/video/" + (matches$$1[2])), width$$1, height$$1, this$1.videoAutoplay));
                        },
                                function () { return this$1.setError(item); }
                            );

                    }

                }

            }

        ],

        methods: {

            loadItem: function(index$$1) {
                if ( index$$1 === void 0 ) index$$1 = this.index;


                var item = this.getItem(index$$1);

                if (item.content) {
                    return;
                }

                trigger(this.$el, 'itemload', [item]);
            },

            getItem: function(index$$1) {
                if ( index$$1 === void 0 ) index$$1 = this.index;

                return this.items[index$$1] || {};
            },

            setItem: function(item, content) {
                assign(item, {content: content});
                var el = html(this.slides[this.items.indexOf(item)], content);
                trigger(this.$el, 'itemloaded', [this, el]);
                this.$update(el);
            },

            setError: function(item) {
                this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
            },

            showControls: function() {

                clearTimeout(this.controlsTimer);
                this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

                addClass(this.$el, 'uk-active', 'uk-transition-active');

            },

            hideControls: function() {
                removeClass(this.$el, 'uk-active', 'uk-transition-active');
            }

        }

    };

    function getIframe(src, width$$1, height$$1, autoplay) {
        return ("<iframe src=\"" + src + "\" width=\"" + width$$1 + "\" height=\"" + height$$1 + "\" style=\"max-width: 100%; box-sizing: border-box;\" frameborder=\"0\" allowfullscreen uk-video=\"autoplay: " + autoplay + "\" uk-responsive></iframe>");
    }

    var Lightbox = {

        install: install$2,

        props: {toggle: String},

        data: {toggle: 'a'},

        computed: {

            toggles: function(ref, $el) {
                var toggle = ref.toggle;

                return $$(toggle, $el);
            }

        },

        disconnected: function() {
            this.hide();
        },

        events: [

            {

                name: 'click',

                delegate: function() {
                    return ((this.toggle) + ":not(.uk-disabled)");
                },

                handler: function(e) {
                    e.preventDefault();
                    this.show(index(this.toggles, e.current));
                }

            }

        ],

        update: function(data$$1) {

            data$$1.toggles = this.panel && data$$1.toggles || this.toggles;

            if (!this.panel || isEqualList$1(data$$1.toggles, this.toggles)) {
                return;
            }

            data$$1.toggles = this.toggles;
            this.panel.hide();

        },

        methods: {

            show: function(index$$1) {
                var this$1 = this;


                this.panel = this.panel || this.$create('lightboxPanel', assign({}, this.$props, {
                    items: this.toggles.reduce(function (items, el) {
                        items.push(['href', 'caption', 'type', 'poster', 'alt'].reduce(function (obj, attr$$1) {
                            obj[attr$$1 === 'href' ? 'source' : attr$$1] = data(el, attr$$1);
                            return obj;
                        }, {}));
                        return items;
                    }, [])
                }));

                on(this.panel.$el, 'hidden', function () { return this$1.panel = false; });
                return this.panel.show(index$$1);
            },

            hide: function() {

                return this.panel && this.panel.hide();

            }

        }

    };

    function isEqualList$1(listA, listB) {
        return listA.length === listB.length
            && listA.every(function (el, i) { return el === listB[i]; });
    }

    function install$2(UIkit, Lightbox) {

        if (!UIkit.lightboxPanel) {
            UIkit.component('lightboxPanel', LightboxPanel);
        }

        assign(
            Lightbox.props,
            UIkit.component('lightboxPanel').options.props
        );

    }

    var obj;

    var containers = {};

    var Notification = {

        functional: true,

        args: ['message', 'status'],

        data: {
            message: '',
            status: '',
            timeout: 5000,
            group: null,
            pos: 'top-center',
            clsClose: 'uk-notification-close',
            clsMsg: 'uk-notification-message'
        },

        install: install$3,

        computed: {

            marginProp: function(ref) {
                var pos = ref.pos;

                return ("margin" + (startsWith(pos, 'top') ? 'Top' : 'Bottom'));
            },

            startProps: function() {
                var obj;

                return ( obj = {opacity: 0}, obj[this.marginProp] = -this.$el.offsetHeight, obj );
            }

        },

        created: function() {

            if (!containers[this.pos]) {
                containers[this.pos] = append(this.$container, ("<div class=\"uk-notification uk-notification-" + (this.pos) + "\"></div>"));
            }

            var container = css(containers[this.pos], 'display', 'block');

            this.$mount(append(container,
                ("<div class=\"" + (this.clsMsg) + (this.status ? (" " + (this.clsMsg) + "-" + (this.status)) : '') + "\"> <a href=\"#\" class=\"" + (this.clsClose) + "\" data-uk-close></a> <div>" + (this.message) + "</div> </div>")
            ));

        },

        connected: function() {
            var this$1 = this;
            var obj;


            var margin = toFloat(css(this.$el, this.marginProp));
            Transition.start(
                css(this.$el, this.startProps),
                ( obj = {opacity: 1}, obj[this.marginProp] = margin, obj )
            ).then(function () {
                if (this$1.timeout) {
                    this$1.timer = setTimeout(this$1.close, this$1.timeout);
                }
            });

        },

        events: ( obj = {

            click: function(e) {
                if (closest(e.target, 'a[href="#"],a[href=""]')) {
                    e.preventDefault();
                }
                this.close();
            }

        }, obj[pointerEnter] = function () {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            }, obj[pointerLeave] = function () {
                if (this.timeout) {
                    this.timer = setTimeout(this.close, this.timeout);
                }
            }, obj ),

        methods: {

            close: function(immediate) {
                var this$1 = this;


                var removeFn = function () {

                    trigger(this$1.$el, 'close', [this$1]);
                    remove(this$1.$el);

                    if (!containers[this$1.pos].children.length) {
                        css(containers[this$1.pos], 'display', 'none');
                    }

                };

                if (this.timer) {
                    clearTimeout(this.timer);
                }

                if (immediate) {
                    removeFn();
                } else {
                    Transition.start(this.$el, this.startProps).then(removeFn);
                }
            }

        }

    };

    function install$3(UIkit) {
        UIkit.notification.closeAll = function (group, immediate) {
            apply(document.body, function (el) {
                var notification = UIkit.getComponent(el, 'notification');
                if (notification && (!group || group === notification.group)) {
                    notification.close(immediate);
                }
            });
        };
    }

    var props = ['x', 'y', 'bgx', 'bgy', 'rotate', 'scale', 'color', 'backgroundColor', 'borderColor', 'opacity', 'blur', 'hue', 'grayscale', 'invert', 'saturate', 'sepia', 'fopacity'];

    var Parallax = {

        mixins: [Media],

        props: props.reduce(function (props, prop) {
            props[prop] = 'list';
            return props;
        }, {}),

        data: props.reduce(function (data$$1, prop) {
            data$$1[prop] = undefined;
            return data$$1;
        }, {}),

        computed: {

            props: function(properties, $el) {
                var this$1 = this;


                return props.reduce(function (props, prop) {

                    if (isUndefined(properties[prop])) {
                        return props;
                    }

                    var isColor = prop.match(/color/i);
                    var isCssProp = isColor || prop === 'opacity';

                    var pos, bgPos, diff;
                    var steps = properties[prop].slice(0);

                    if (isCssProp) {
                        css($el, prop, '');
                    }

                    if (steps.length < 2) {
                        steps.unshift((prop === 'scale'
                            ? 1
                            : isCssProp
                                ? css($el, prop)
                                : 0) || 0);
                    }

                    var unit = includes(steps.join(''), '%') ? '%' : 'px';

                    if (isColor) {

                        var ref = $el.style;
                        var color = ref.color;
                        steps = steps.map(function (step) { return parseColor($el, step); });
                        $el.style.color = color;

                    } else {

                        steps = steps.map(toFloat);

                    }

                    if (prop.match(/^bg/)) {

                        css($el, ("background-position-" + (prop[2])), '');
                        bgPos = css($el, 'backgroundPosition').split(' ')[prop[2] === 'x' ? 0 : 1]; // IE 11 can't read background-position-[x|y]

                        if (this$1.covers) {

                            var min = Math.min.apply(Math, steps);
                            var max = Math.max.apply(Math, steps);
                            var down = steps.indexOf(min) < steps.indexOf(max);

                            diff = max - min;

                            steps = steps.map(function (step) { return step - (down ? min : max); });
                            pos = (down ? -diff : 0) + "px";

                        } else {

                            pos = bgPos;

                        }
                    }

                    props[prop] = {steps: steps, unit: unit, pos: pos, bgPos: bgPos, diff: diff};

                    return props;

                }, {});

            },

            bgProps: function() {
                var this$1 = this;

                return ['bgx', 'bgy'].filter(function (bg) { return bg in this$1.props; });
            },

            covers: function(_, $el) {
                return covers($el);
            }

        },

        disconnected: function() {
            delete this._image;
        },

        update: {

            read: function(data$$1) {
                var this$1 = this;


                data$$1.active = this.matchMedia;

                if (!data$$1.active) {
                    return;
                }

                if (!data$$1.image && this.covers && this.bgProps.length) {
                    var src = css(this.$el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

                    if (src) {
                        var img = new Image();
                        img.src = src;
                        data$$1.image = img;

                        if (!img.naturalWidth) {
                            img.onload = function () { return this$1.$emit(); };
                        }
                    }

                }

                var image = data$$1.image;

                if (!image || !image.naturalWidth) {
                    return;
                }

                var dimEl = {
                    width: this.$el.offsetWidth,
                    height: this.$el.offsetHeight
                };
                var dimImage = {
                    width: image.naturalWidth,
                    height: image.naturalHeight
                };

                var dim = Dimensions.cover(dimImage, dimEl);

                this.bgProps.forEach(function (prop) {

                    var ref = this$1.props[prop];
                    var diff = ref.diff;
                    var bgPos = ref.bgPos;
                    var steps = ref.steps;
                    var attr$$1 = prop === 'bgy' ? 'height' : 'width';
                    var span = dim[attr$$1] - dimEl[attr$$1];

                    if (!bgPos.match(/%$|0px/)) {
                        return;
                    }

                    if (span < diff) {
                        dimEl[attr$$1] = dim[attr$$1] + diff - span;
                    } else if (span > diff) {

                        var bgPosFloat = parseFloat(bgPos);

                        if (bgPosFloat) {
                            this$1.props[prop].steps = steps.map(function (step) { return step - (span - diff) / (100 / bgPosFloat); });
                        }
                    }

                    dim = Dimensions.cover(dimImage, dimEl);
                });

                data$$1.dim = dim;
            },

            write: function(ref) {
                var dim = ref.dim;
                var active = ref.active;


                if (!active) {
                    css(this.$el, {backgroundSize: '', backgroundRepeat: ''});
                    return;
                }

                dim && css(this.$el, {
                    backgroundSize: ((dim.width) + "px " + (dim.height) + "px"),
                    backgroundRepeat: 'no-repeat'
                });

            },

            events: ['load', 'resize']

        },

        methods: {

            reset: function() {
                var this$1 = this;

                each(this.getCss(0), function (_, prop) { return css(this$1.$el, prop, ''); });
            },

            getCss: function(percent) {

                var ref = this;
                var props = ref.props;
                var translated = false;

                return Object.keys(props).reduce(function (css$$1, prop) {

                    var ref = props[prop];
                    var steps = ref.steps;
                    var unit = ref.unit;
                    var pos = ref.pos;
                    var value = getValue(steps, percent);

                    switch (prop) {

                        // transforms
                        case 'x':
                        case 'y': {

                            if (translated) {
                                break;
                            }

                            var ref$1 = ['x', 'y'].map(function (dir) { return prop === dir
                                ? toFloat(value).toFixed(0) + unit
                                : props[dir]
                                    ? getValue(props[dir].steps, percent, 1) + props[dir].unit
                                    : 0; }
                            );
                            var x = ref$1[0];
                            var y = ref$1[1];

                            translated = css$$1.transform += " translate3d(" + x + ", " + y + ", 0)";
                            break;
                        }
                        case 'rotate':
                            css$$1.transform += " rotate(" + value + "deg)";
                            break;
                        case 'scale':
                            css$$1.transform += " scale(" + value + ")";
                            break;

                        // bg image
                        case 'bgy':
                        case 'bgx':
                            css$$1[("background-position-" + (prop[2]))] = "calc(" + pos + " + " + (value + unit) + ")";
                            break;

                        // color
                        case 'color':
                        case 'backgroundColor':
                        case 'borderColor': {

                            var ref$2 = getStep(steps, percent);
                            var start = ref$2[0];
                            var end = ref$2[1];
                            var p = ref$2[2];

                            css$$1[prop] = "rgba(" + (start.map(function (value, i) {
                                    value = value + p * (end[i] - value);
                                    return i === 3 ? toFloat(value) : parseInt(value, 10);
                                }).join(',')) + ")";
                            break;
                        }
                        // CSS Filter
                        case 'blur':
                            css$$1.filter += " blur(" + value + "px)";
                            break;
                        case 'hue':
                            css$$1.filter += " hue-rotate(" + value + "deg)";
                            break;
                        case 'fopacity':
                            css$$1.filter += " opacity(" + value + "%)";
                            break;
                        case 'grayscale':
                        case 'invert':
                        case 'saturate':
                        case 'sepia':
                            css$$1.filter += " " + prop + "(" + value + "%)";
                            break;

                        default:
                            css$$1[prop] = value;
                    }

                    return css$$1;

                }, {transform: '', filter: ''});

            }

        }

    };

    function parseColor(el, color) {
        return css(css(el, 'color', color), 'color').split(/[(),]/g).slice(1, -1).concat(1).slice(0, 4).map(function (n) { return toFloat(n); });
    }

    function getStep(steps, percent) {
        var count = steps.length - 1;
        var index$$1 = Math.min(Math.floor(count * percent), count - 1);
        var step = steps.slice(index$$1, index$$1 + 2);

        step.push(percent === 1 ? 1 : percent % (1 / count) * count);

        return step;
    }

    function getValue(steps, percent, digits) {
        if ( digits === void 0 ) digits = 2;

        var ref = getStep(steps, percent);
        var start = ref[0];
        var end = ref[1];
        var p = ref[2];
        return (isNumber(start)
                ? start + Math.abs(start - end) * p * (start < end ? 1 : -1)
                : +end
        ).toFixed(digits);
    }

    function covers(el) {
        var ref = el.style;
        var backgroundSize = ref.backgroundSize;
        var covers = css(css(el, 'backgroundSize', ''), 'backgroundSize') === 'cover';
        el.style.backgroundSize = backgroundSize;
        return covers;
    }

    var Parallax$1 = {

        mixins: [Parallax],

        props: {
            target: String,
            viewport: Number,
            easing: Number,
        },

        data: {
            target: false,
            viewport: 1,
            easing: 1,
        },

        computed: {

            target: function(ref, $el) {
                var target = ref.target;

                return target && query(target, $el) || $el;
            }

        },

        update: {

            read: function(ref, ref$1) {
                var percent = ref.percent;
                var active = ref.active;
                var type = ref$1.type;


                if (type !== 'scroll') {
                    percent = false;
                }

                if (!active) {
                    return;
                }

                var prev = percent;
                percent = ease$1(scrolledOver(this.target) / (this.viewport || 1), this.easing);

                return {
                    percent: percent,
                    style: prev !== percent ? this.getCss(percent) : false
                };
            },

            write: function(ref) {
                var style = ref.style;
                var active = ref.active;


                if (!active) {
                    this.reset();
                    return;
                }

                style && css(this.$el, style);

            },

            events: ['scroll', 'load', 'resize']
        }

    };

    function ease$1(percent, easing) {
        return clamp(percent * (1 - (easing - easing * percent)));
    }

    var SliderReactive = {

        update: {

            write: function() {

                if (this.stack.length || this.dragging) {
                    return;
                }

                var index$$1 = this.getValidIndex();
                delete this.index;
                removeClass(this.slides, this.clsActive, this.clsActivated);
                this.show(index$$1);

            },

            events: ['load', 'resize']

        }

    };

    function Transitioner$1 (prev, next, dir, ref) {
        var center = ref.center;
        var easing = ref.easing;
        var list = ref.list;


        var deferred = new Deferred();

        var from = prev
            ? getLeft(prev, list, center)
            : getLeft(next, list, center) + bounds(next).width * dir;
        var to = next
            ? getLeft(next, list, center)
            : from + bounds(prev).width * dir * (isRtl ? -1 : 1);

        return {

            dir: dir,

            show: function(duration, percent, linear) {
                if ( percent === void 0 ) percent = 0;


                var timing = linear ? 'linear' : easing;
                duration -= Math.round(duration * clamp(percent, -1, 1));

                this.translate(percent);

                prev && this.updateTranslates();
                percent = prev ? percent : clamp(percent, 0, 1);
                triggerUpdate$1(this.getItemIn(), 'itemin', {percent: percent, duration: duration, timing: timing, dir: dir});
                prev && triggerUpdate$1(this.getItemIn(true), 'itemout', {percent: 1 - percent, duration: duration, timing: timing, dir: dir});

                Transition
                    .start(list, {transform: translate(-to * (isRtl ? -1 : 1), 'px')}, duration, timing)
                    .then(deferred.resolve, noop);

                return deferred.promise;

            },

            stop: function() {
                return Transition.stop(list);
            },

            cancel: function() {
                Transition.cancel(list);
            },

            reset: function() {
                css(list, 'transform', '');
            },

            forward: function(duration, percent) {
                if ( percent === void 0 ) percent = this.percent();

                Transition.cancel(list);
                return this.show(duration, percent, true);
            },

            translate: function(percent) {

                var distance = this.getDistance() * dir * (isRtl ? -1 : 1);

                css(list, 'transform', translate(clamp(
                    -to + (distance - distance * percent),
                    -getWidth(list),
                    bounds(list).width
                ) * (isRtl ? -1 : 1), 'px'));

                this.updateTranslates();

                if (prev) {
                    percent = clamp(percent, -1, 1);
                    triggerUpdate$1(this.getItemIn(), 'itemtranslatein', {percent: percent, dir: dir});
                    triggerUpdate$1(this.getItemIn(true), 'itemtranslateout', {percent: 1 - percent, dir: dir});
                }

            },

            percent: function() {
                return Math.abs((css(list, 'transform').split(',')[4] * (isRtl ? -1 : 1) + from) / (to - from));
            },

            getDistance: function() {
                return Math.abs(to - from);
            },

            getItemIn: function(out) {
                if ( out === void 0 ) out = false;


                var actives = this.getActives();
                var all = sortBy(slides(list), 'offsetLeft');
                var i = index(all, actives[dir * (out ? -1 : 1) > 0 ? actives.length - 1 : 0]);

                return ~i && all[i + (prev && !out ? dir : 0)];

            },

            getActives: function() {

                var left = getLeft(prev || next, list, center);

                return sortBy(slides(list).filter(function (slide) {
                    var slideLeft = getElLeft(slide, list);
                    return slideLeft >= left && slideLeft + bounds(slide).width <= bounds(list).width + left;
                }), 'offsetLeft');

            },

            updateTranslates: function() {

                var actives = this.getActives();

                slides(list).forEach(function (slide) {
                    var isActive = includes(actives, slide);

                    triggerUpdate$1(slide, ("itemtranslate" + (isActive ? 'in' : 'out')), {
                        percent: isActive ? 1 : 0,
                        dir: slide.offsetLeft <= next.offsetLeft ? 1 : -1
                    });
                });
            }

        };

    }

    function getLeft(el, list, center) {

        var left = getElLeft(el, list);

        return center
            ? left - centerEl(el, list)
            : Math.min(left, getMax(list));

    }

    function getMax(list) {
        return Math.max(0, getWidth(list) - bounds(list).width);
    }

    function getWidth(list) {
        return slides(list).reduce(function (right, el) { return bounds(el).width + right; }, 0);
    }

    function getMaxWidth(list) {
        return slides(list).reduce(function (right, el) { return Math.max(right, bounds(el).width); }, 0);
    }

    function centerEl(el, list) {
        return bounds(list).width / 2 - bounds(el).width / 2;
    }

    function getElLeft(el, list) {
        return (position(el).left + (isRtl ? bounds(el).width - bounds(list).width : 0)) * (isRtl ? -1 : 1);
    }

    function bounds(el) {
        return el.getBoundingClientRect();
    }

    function triggerUpdate$1(el, type, data$$1) {
        trigger(el, createEvent(type, false, false, data$$1));
    }

    function slides(list) {
        return toNodes(list.children);
    }

    var Slider$1 = {

        mixins: [Class, Slider, SliderReactive],

        props: {
            center: Boolean,
            sets: Boolean,
        },

        data: {
            center: false,
            sets: false,
            attrItem: 'uk-slider-item',
            selList: '.uk-slider-items',
            selNav: '.uk-slider-nav',
            clsContainer: 'uk-slider-container',
            Transitioner: Transitioner$1
        },

        computed: {

            avgWidth: function() {
                return getWidth(this.list) / this.length;
            },

            finite: function(ref) {
                var finite = ref.finite;

                return finite || getWidth(this.list) < bounds(this.list).width + getMaxWidth(this.list) + this.center;
            },

            maxIndex: function() {

                if (!this.finite || this.center && !this.sets) {
                    return this.length - 1;
                }

                if (this.center) {
                    return this.sets[this.sets.length - 1];
                }

                css(this.slides, 'order', '');

                var max = getMax(this.list);
                var i = this.length;

                while (i--) {
                    if (getElLeft(this.list.children[i], this.list) < max) {
                        return Math.min(i + 1, this.length - 1);
                    }
                }

                return 0;
            },

            sets: function(ref) {
                var this$1 = this;
                var sets = ref.sets;


                var width$$1 = bounds(this.list).width / (this.center ? 2 : 1);

                var left = 0;
                var leftCenter = width$$1;
                var slideLeft = 0;

                sets = sets && this.slides.reduce(function (sets, slide, i) {

                    var ref = bounds(slide);
                    var slideWidth = ref.width;
                    var slideRight = slideLeft + slideWidth;

                    if (slideRight > left) {

                        if (!this$1.center && i > this$1.maxIndex) {
                            i = this$1.maxIndex;
                        }

                        if (!includes(sets, i)) {

                            var cmp = this$1.slides[i + 1];
                            if (this$1.center && cmp && slideWidth < leftCenter - bounds(cmp).width / 2) {
                                leftCenter -= slideWidth;
                            } else {
                                leftCenter = width$$1;
                                sets.push(i);
                                left = slideLeft + width$$1 + (this$1.center ? slideWidth / 2 : 0);
                            }

                        }
                    }

                    slideLeft += slideWidth;

                    return sets;

                }, []);

                return sets && sets.length && sets;

            },

            transitionOptions: function() {
                return {
                    center: this.center,
                    list: this.list
                };
            }

        },

        connected: function() {
            toggleClass(this.$el, this.clsContainer, !$(("." + (this.clsContainer)), this.$el));
        },

        update: {

            write: function() {
                var this$1 = this;


                $$(("[" + (this.attrItem) + "],[data-" + (this.attrItem) + "]"), this.$el).forEach(function (el) {
                    var index$$1 = data(el, this$1.attrItem);
                    this$1.maxIndex && toggleClass(el, 'uk-hidden', isNumeric(index$$1) && (this$1.sets && !includes(this$1.sets, toFloat(index$$1)) || index$$1 > this$1.maxIndex));
                });

            },

            events: ['load', 'resize']

        },

        events: {

            beforeitemshow: function(e) {

                if (!this.dragging && this.sets && this.stack.length < 2 && !includes(this.sets, this.index)) {
                    this.index = this.getValidIndex();
                }

                var diff = Math.abs(
                    this.index
                    - this.prevIndex
                    + (this.dir > 0 && this.index < this.prevIndex || this.dir < 0 && this.index > this.prevIndex ? (this.maxIndex + 1) * this.dir : 0)
                );

                if (!this.dragging && diff > 1) {

                    for (var i = 0; i < diff; i++) {
                        this.stack.splice(1, 0, this.dir > 0 ? 'next' : 'previous');
                    }

                    e.preventDefault();
                    return;
                }

                this.duration = speedUp(this.avgWidth / this.velocity)
                    * (bounds(
                        this.dir < 0 || !this.slides[this.prevIndex]
                            ? this.slides[this.index]
                            : this.slides[this.prevIndex]
                    ).width / this.avgWidth);

                this.reorder();

            },

            itemshow: function() {
                !isUndefined(this.prevIndex) && addClass(this._getTransitioner().getItemIn(), this.clsActive);
            },

            itemshown: function() {
                var this$1 = this;

                var actives = this._getTransitioner(this.index).getActives();
                this.slides.forEach(function (slide) { return toggleClass(slide, this$1.clsActive, includes(actives, slide)); });
                (!this.sets || includes(this.sets, toFloat(this.index))) && this.slides.forEach(function (slide) { return toggleClass(slide, this$1.clsActivated, includes(actives, slide)); });
            }

        },

        methods: {

            reorder: function() {
                var this$1 = this;


                css(this.slides, 'order', '');

                if (this.finite) {
                    return;
                }

                var index$$1 = this.dir > 0 && this.slides[this.prevIndex] ? this.prevIndex : this.index;

                this.slides.forEach(function (slide, i) { return css(slide, 'order', this$1.dir > 0 && i < index$$1
                        ? 1
                        : this$1.dir < 0 && i >= this$1.index
                            ? -1
                            : ''
                    ); }
                );

                if (!this.center) {
                    return;
                }

                var next = this.slides[index$$1];
                var width$$1 = bounds(this.list).width / 2 - bounds(next).width / 2;
                var j = 0;

                while (width$$1 > 0) {
                    var slideIndex = this.getIndex(--j + index$$1, index$$1);
                    var slide = this.slides[slideIndex];

                    css(slide, 'order', slideIndex > index$$1 ? -2 : -1);
                    width$$1 -= bounds(slide).width;
                }

            },

            getValidIndex: function(index$$1, prevIndex) {
                if ( index$$1 === void 0 ) index$$1 = this.index;
                if ( prevIndex === void 0 ) prevIndex = this.prevIndex;


                index$$1 = this.getIndex(index$$1, prevIndex);

                if (!this.sets) {
                    return index$$1;
                }

                var prev;

                do {

                    if (includes(this.sets, index$$1)) {
                        return index$$1;
                    }

                    prev = index$$1;
                    index$$1 = this.getIndex(index$$1 + this.dir, prevIndex);

                } while (index$$1 !== prev);

                return index$$1;
            }

        }

    };

    var SliderParallax = {

        mixins: [Parallax],

        data: {
            selItem: '!li'
        },

        computed: {

            item: function(ref, $el) {
                var selItem = ref.selItem;

                return query(selItem, $el);
            }

        },

        events: [

            {

                name: 'itemshown',

                self: true,

                el: function() {
                    return this.item;
                },

                handler: function() {
                    css(this.$el, this.getCss(.5));
                }

            },

            {
                name: 'itemin itemout',

                self: true,

                el: function() {
                    return this.item;
                },

                handler: function(ref) {
                    var type = ref.type;
                    var ref_detail = ref.detail;
                    var percent = ref_detail.percent;
                    var duration = ref_detail.duration;
                    var timing = ref_detail.timing;
                    var dir = ref_detail.dir;


                    Transition.cancel(this.$el);
                    css(this.$el, this.getCss(getCurrent(type, dir, percent)));

                    Transition.start(this.$el, this.getCss(isIn(type)
                        ? .5
                        : dir > 0
                            ? 1
                            : 0
                    ), duration, timing).catch(noop);

                }
            },

            {
                name: 'transitioncanceled transitionend',

                self: true,

                el: function() {
                    return this.item;
                },

                handler: function() {
                    Transition.cancel(this.$el);
                }

            },

            {
                name: 'itemtranslatein itemtranslateout',

                self: true,

                el: function() {
                    return this.item;
                },

                handler: function(ref) {
                    var type = ref.type;
                    var ref_detail = ref.detail;
                    var percent = ref_detail.percent;
                    var dir = ref_detail.dir;

                    Transition.cancel(this.$el);
                    css(this.$el, this.getCss(getCurrent(type, dir, percent)));
                }
            }

        ]

    };

    function isIn(type) {
        return endsWith(type, 'in');
    }

    function getCurrent(type, dir, percent) {

        percent /= 2;

        return !isIn(type)
            ? dir < 0
                ? percent
                : 1 - percent
            : dir < 0
                ? 1 - percent
                : percent;
    }

    var Animations$2 = assign({}, Animations, {

        fade: {

            show: function() {
                return [
                    {opacity: 0, zIndex: 0},
                    {zIndex: -1}
                ];
            },

            percent: function(current) {
                return 1 - css(current, 'opacity');
            },

            translate: function(percent) {
                return [
                    {opacity: 1 - percent, zIndex: 0},
                    {zIndex: -1}
                ];
            }

        },

        scale: {

            show: function() {
                return [
                    {opacity: 0, transform: scale3d(1 + .5), zIndex: 0},
                    {zIndex: -1}
                ];
            },

            percent: function(current) {
                return 1 - css(current, 'opacity');
            },

            translate: function(percent) {
                return [
                    {opacity: 1 - percent, transform: scale3d(1 + .5 * percent), zIndex: 0},
                    {zIndex: -1}
                ];
            }

        },

        pull: {

            show: function(dir) {
                return dir < 0
                    ? [
                        {transform: translate(30), zIndex: -1},
                        {transform: translate(), zIndex: 0} ]
                    : [
                        {transform: translate(-100), zIndex: 0},
                        {transform: translate(), zIndex: -1}
                    ];
            },

            percent: function(current, next, dir) {
                return dir < 0
                    ? 1 - translated(next)
                    : translated(current);
            },

            translate: function(percent, dir) {
                return dir < 0
                    ? [
                        {transform: translate(30 * percent), zIndex: -1},
                        {transform: translate(-100 * (1 - percent)), zIndex: 0} ]
                    : [
                        {transform: translate(-percent * 100), zIndex: 0},
                        {transform: translate(30 * (1 - percent)), zIndex: -1}
                    ];
            }

        },

        push: {

            show: function(dir) {
                return dir < 0
                    ? [
                        {transform: translate(100), zIndex: 0},
                        {transform: translate(), zIndex: -1} ]
                    : [
                        {transform: translate(-30), zIndex: -1},
                        {transform: translate(), zIndex: 0}
                    ];
            },

            percent: function(current, next, dir) {
                return dir > 0
                    ? 1 - translated(next)
                    : translated(current);
            },

            translate: function(percent, dir) {
                return dir < 0
                    ? [
                        {transform: translate(percent * 100), zIndex: 0},
                        {transform: translate(-30 * (1 - percent)), zIndex: -1} ]
                    : [
                        {transform: translate(-30 * percent), zIndex: -1},
                        {transform: translate(100 * (1 - percent)), zIndex: 0}
                    ];
            }

        }

    });

    var Slideshow$1 = {

        mixins: [Class, Slideshow, SliderReactive],

        props: {
            ratio: String,
            minHeight: Boolean,
            maxHeight: Boolean,
        },

        data: {
            ratio: '16:9',
            minHeight: false,
            maxHeight: false,
            selList: '.uk-slideshow-items',
            attrItem: 'uk-slideshow-item',
            selNav: '.uk-slideshow-nav',
            Animations: Animations$2
        },

        update: {

            read: function() {

                var ref = this.ratio.split(':').map(Number);
                var width$$1 = ref[0];
                var height$$1 = ref[1];

                height$$1 = height$$1 * this.list.offsetWidth / width$$1;

                if (this.minHeight) {
                    height$$1 = Math.max(this.minHeight, height$$1);
                }

                if (this.maxHeight) {
                    height$$1 = Math.min(this.maxHeight, height$$1);
                }

                return {height: height$$1 - boxModelAdjust(this.list, 'content-box')};
            },

            write: function(ref) {
                var height$$1 = ref.height;

                css(this.list, 'minHeight', height$$1);
            },

            events: ['load', 'resize']

        }

    };

    var Sortable = {

        mixins: [Class, Animate],

        props: {
            group: String,
            threshold: Number,
            clsItem: String,
            clsPlaceholder: String,
            clsDrag: String,
            clsDragState: String,
            clsBase: String,
            clsNoDrag: String,
            clsEmpty: String,
            clsCustom: String,
            handle: String
        },

        data: {
            group: false,
            threshold: 5,
            clsItem: 'uk-sortable-item',
            clsPlaceholder: 'uk-sortable-placeholder',
            clsDrag: 'uk-sortable-drag',
            clsDragState: 'uk-drag',
            clsBase: 'uk-sortable',
            clsNoDrag: 'uk-sortable-nodrag',
            clsEmpty: 'uk-sortable-empty',
            clsCustom: '',
            handle: false
        },

        created: function() {
            var this$1 = this;

            ['init', 'start', 'move', 'end'].forEach(function (key) {
                var fn = this$1[key];
                this$1[key] = function (e) {
                    this$1.scrollY = window.pageYOffset;
                    var ref = getPos$1(e, 'page');
                    var x = ref.x;
                    var y = ref.y;
                    this$1.pos = {x: x, y: y};

                    fn(e);
                };
            });
        },

        events: {

            name: pointerDown,
            passive: false,
            handler: 'init'

        },

        update: {

            write: function() {

                if (this.clsEmpty) {
                    toggleClass(this.$el, this.clsEmpty, !this.$el.children.length);
                }

                css(this.handle ? $$(this.handle, this.$el) : this.$el.children, 'touchAction', 'none');

                if (!this.drag) {
                    return;
                }

                offset(this.drag, {top: this.pos.y + this.origin.top, left: this.pos.x + this.origin.left});

                var ref = offset(this.drag);
                var top = ref.top;
                var offsetHeight = ref.height;
                var bottom = top + offsetHeight;
                var scroll;

                if (top > 0 && top < this.scrollY) {
                    scroll = this.scrollY - 5;
                } else if (bottom < height(document) && bottom > height(window) + this.scrollY) {
                    scroll = this.scrollY + 5;
                }

                scroll && setTimeout(function () { return scrollTop(window, scroll); }, 5);
            }

        },

        methods: {

            init: function(e) {

                var target = e.target;
                var button = e.button;
                var defaultPrevented = e.defaultPrevented;
                var ref = toNodes(this.$el.children).filter(function (el) { return within(target, el); });
                var placeholder = ref[0];

                if (!placeholder
                    || isInput(target)
                    || this.handle && !within(target, this.handle)
                    || button > 0
                    || within(target, ("." + (this.clsNoDrag)))
                    || defaultPrevented
                ) {
                    return;
                }

                e.preventDefault();

                this.touched = [this];
                this.placeholder = placeholder;
                this.origin = assign({target: target, index: index(placeholder)}, this.pos);

                on(document, pointerMove, this.move);
                on(document, pointerUp, this.end);
                on(window, 'scroll', this.scroll);

                if (!this.threshold) {
                    this.start(e);
                }

            },

            start: function(e) {

                this.drag = append(this.$container, this.placeholder.outerHTML.replace(/^<li/i, '<div').replace(/li>$/i, 'div>'));

                css(this.drag, assign({
                    boxSizing: 'border-box',
                    width: this.placeholder.offsetWidth,
                    height: this.placeholder.offsetHeight
                }, css(this.placeholder, ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom'])));
                attr(this.drag, 'uk-no-boot', '');
                addClass(this.drag, this.clsDrag, this.clsCustom);

                height(this.drag.firstElementChild, height(this.placeholder.firstElementChild));

                var ref = offset(this.placeholder);
                var left = ref.left;
                var top = ref.top;
                assign(this.origin, {left: left - this.pos.x, top: top - this.pos.y});

                addClass(this.placeholder, this.clsPlaceholder);
                addClass(this.$el.children, this.clsItem);
                addClass(document.documentElement, this.clsDragState);

                trigger(this.$el, 'start', [this, this.placeholder]);

                this.move(e);
            },

            move: function(e) {

                if (!this.drag) {

                    if (Math.abs(this.pos.x - this.origin.x) > this.threshold || Math.abs(this.pos.y - this.origin.y) > this.threshold) {
                        this.start(e);
                    }

                    return;
                }

                this.$emit();

                var target = e.type === 'mousemove' ? e.target : document.elementFromPoint(this.pos.x - window.pageXOffset, this.pos.y - window.pageYOffset);

                var sortable = this.getSortable(target);
                var previous = this.getSortable(this.placeholder);
                var move = sortable !== previous;

                if (!sortable || within(target, this.placeholder) || move && (!sortable.group || sortable.group !== previous.group)) {
                    return;
                }

                target = sortable.$el === target.parentNode && target || toNodes(sortable.$el.children).filter(function (element) { return within(target, element); })[0];

                if (move) {
                    previous.remove(this.placeholder);
                } else if (!target) {
                    return;
                }

                sortable.insert(this.placeholder, target);

                if (!includes(this.touched, sortable)) {
                    this.touched.push(sortable);
                }

            },

            end: function(e) {

                off(document, pointerMove, this.move);
                off(document, pointerUp, this.end);
                off(window, 'scroll', this.scroll);

                if (!this.drag) {
                    if (e.type === 'touchend') {
                        e.target.click();
                    }

                    return;
                }

                preventClick();

                var sortable = this.getSortable(this.placeholder);

                if (this === sortable) {
                    if (this.origin.index !== index(this.placeholder)) {
                        trigger(this.$el, 'moved', [this, this.placeholder]);
                    }
                } else {
                    trigger(sortable.$el, 'added', [sortable, this.placeholder]);
                    trigger(this.$el, 'removed', [this, this.placeholder]);
                }

                trigger(this.$el, 'stop', [this, this.placeholder]);

                remove(this.drag);
                this.drag = null;

                var classes = this.touched.map(function (sortable) { return ((sortable.clsPlaceholder) + " " + (sortable.clsItem)); }).join(' ');
                this.touched.forEach(function (sortable) { return removeClass(sortable.$el.children, classes); });

                removeClass(document.documentElement, this.clsDragState);

            },

            scroll: function() {
                var scroll = window.pageYOffset;
                if (scroll !== this.scrollY) {
                    this.pos.y += scroll - this.scrollY;
                    this.scrollY = scroll;
                    this.$emit();
                }
            },

            insert: function(element, target) {
                var this$1 = this;


                addClass(this.$el.children, this.clsItem);

                var insert = function () {

                    if (target) {

                        if (!within(element, this$1.$el) || isPredecessor(element, target)) {
                            before(target, element);
                        } else {
                            after(target, element);
                        }

                    } else {
                        append(this$1.$el, element);
                    }

                };

                if (this.animation) {
                    this.animate(insert);
                } else {
                    insert();
                }

            },

            remove: function(element) {

                if (!within(element, this.$el)) {
                    return;
                }

                if (this.animation) {
                    this.animate(function () { return remove(element); });
                } else {
                    remove(element);
                }

            },

            getSortable: function(element) {
                return element && (this.$getComponent(element, 'sortable') || this.getSortable(element.parentNode));
            }

        }

    };

    function isPredecessor(element, target) {
        return element.parentNode === target.parentNode && index(element) > index(target);
    }

    var obj$1;

    var actives = [];

    var Tooltip = {

        mixins: [Container, Togglable, Position],

        args: 'title',

        props: {
            delay: Number,
            title: String
        },

        data: {
            pos: 'top',
            title: '',
            delay: 0,
            animation: ['uk-animation-scale-up'],
            duration: 100,
            cls: 'uk-active',
            clsPos: 'uk-tooltip'
        },

        beforeConnect: function() {
            this._hasTitle = hasAttr(this.$el, 'title');
            attr(this.$el, {title: '', 'aria-expanded': false});
        },

        disconnected: function() {
            this.hide();
            attr(this.$el, {title: this._hasTitle ? this.title : null, 'aria-expanded': null});
        },

        methods: {

            show: function() {
                var this$1 = this;


                if (includes(actives, this)) {
                    return;
                }

                actives.forEach(function (active) { return active.hide(); });
                actives.push(this);

                this._unbind = on(document, pointerUp, function (e) { return !within(e.target, this$1.$el) && this$1.hide(); });

                clearTimeout(this.showTimer);
                this.showTimer = setTimeout(function () {
                    this$1._show();
                    this$1.hideTimer = setInterval(function () {

                        if (!isVisible(this$1.$el)) {
                            this$1.hide();
                        }

                    }, 150);
                }, this.delay);
            },

            hide: function() {

                var index$$1 = actives.indexOf(this);

                if (!~index$$1 || matches(this.$el, 'input') && this.$el === document.activeElement) {
                    return;
                }

                actives.splice(index$$1, 1);

                clearTimeout(this.showTimer);
                clearInterval(this.hideTimer);
                attr(this.$el, 'aria-expanded', false);
                this.toggleElement(this.tooltip, false);
                this.tooltip && remove(this.tooltip);
                this.tooltip = false;
                this._unbind();

            },

            _show: function() {

                this.tooltip = append(this.container,
                    ("<div class=\"" + (this.clsPos) + "\" aria-expanded=\"true\" aria-hidden> <div class=\"" + (this.clsPos) + "-inner\">" + (this.title) + "</div> </div>")
                );

                this.positionAt(this.tooltip, this.$el);

                this.origin = this.getAxis() === 'y'
                    ? ((flipPosition(this.dir)) + "-" + (this.align))
                    : ((this.align) + "-" + (flipPosition(this.dir)));

                this.toggleElement(this.tooltip, true);

            }

        },

        events: ( obj$1 = {}, obj$1[("focus " + pointerEnter + " " + pointerDown)] = function (e) {
                if (e.type !== pointerDown || !isTouch(e)) {
                    this.show();
                }
            }, obj$1.blur = 'hide', obj$1[pointerLeave] = function (e) {
                if (!isTouch(e)) {
                    this.hide();
                }
            }, obj$1 )

    };

    var Upload = {

        props: {
            allow: String,
            clsDragover: String,
            concurrent: Number,
            maxSize: Number,
            method: String,
            mime: String,
            msgInvalidMime: String,
            msgInvalidName: String,
            msgInvalidSize: String,
            multiple: Boolean,
            name: String,
            params: Object,
            type: String,
            url: String,
        },

        data: {
            allow: false,
            clsDragover: 'uk-dragover',
            concurrent: 1,
            maxSize: 0,
            method: 'POST',
            mime: false,
            msgInvalidMime: 'Invalid File Type: %s',
            msgInvalidName: 'Invalid File Name: %s',
            msgInvalidSize: 'Invalid File Size: %s Kilobytes Max',
            multiple: false,
            name: 'files[]',
            params: {},
            type: '',
            url: '',
            abort: noop,
            beforeAll: noop,
            beforeSend: noop,
            complete: noop,
            completeAll: noop,
            error: noop,
            fail: noop,
            load: noop,
            loadEnd: noop,
            loadStart: noop,
            progress: noop
        },

        events: {

            change: function(e) {

                if (!matches(e.target, 'input[type="file"]')) {
                    return;
                }

                e.preventDefault();

                if (e.target.files) {
                    this.upload(e.target.files);
                }

                e.target.value = '';
            },

            drop: function(e) {
                stop(e);

                var transfer = e.dataTransfer;

                if (!transfer || !transfer.files) {
                    return;
                }

                removeClass(this.$el, this.clsDragover);

                this.upload(transfer.files);
            },

            dragenter: function(e) {
                stop(e);
            },

            dragover: function(e) {
                stop(e);
                addClass(this.$el, this.clsDragover);
            },

            dragleave: function(e) {
                stop(e);
                removeClass(this.$el, this.clsDragover);
            }

        },

        methods: {

            upload: function(files) {
                var this$1 = this;


                if (!files.length) {
                    return;
                }

                trigger(this.$el, 'upload', [files]);

                for (var i = 0; i < files.length; i++) {

                    if (this.maxSize && this.maxSize * 1000 < files[i].size) {
                        this.fail(this.msgInvalidSize.replace('%s', this.maxSize));
                        return;
                    }

                    if (this.allow && !match$1(this.allow, files[i].name)) {
                        this.fail(this.msgInvalidName.replace('%s', this.allow));
                        return;
                    }

                    if (this.mime && !match$1(this.mime, files[i].type)) {
                        this.fail(this.msgInvalidMime.replace('%s', this.mime));
                        return;
                    }

                }

                if (!this.multiple) {
                    files = [files[0]];
                }

                this.beforeAll(this, files);

                var chunks = chunk(files, this.concurrent);
                var upload = function (files) {

                    var data$$1 = new FormData();

                    files.forEach(function (file) { return data$$1.append(this$1.name, file); });

                    for (var key in this$1.params) {
                        data$$1.append(key, this$1.params[key]);
                    }

                    ajax(this$1.url, {
                        data: data$$1,
                        method: this$1.method,
                        responseType: this$1.type,
                        beforeSend: function (env) {

                            var xhr = env.xhr;
                            xhr.upload && on(xhr.upload, 'progress', this$1.progress);
                            ['loadStart', 'load', 'loadEnd', 'abort'].forEach(function (type) { return on(xhr, type.toLowerCase(), this$1[type]); }
                            );

                            this$1.beforeSend(env);

                        }
                    }).then(
                        function (xhr) {

                            this$1.complete(xhr);

                            if (chunks.length) {
                                upload(chunks.shift());
                            } else {
                                this$1.completeAll(xhr);
                            }

                        },
                        function (e) { return this$1.error(e); }
                    );

                };

                upload(chunks.shift());

            }

        }

    };

    function match$1(pattern, path) {
        return path.match(new RegExp(("^" + (pattern.replace(/\//g, '\\/').replace(/\*\*/g, '(\\/[^\\/]+)*').replace(/\*/g, '[^\\/]+').replace(/((?!\\))\?/g, '$1.')) + "$"), 'i'));
    }

    function chunk(files, size) {
        var chunks = [];
        for (var i = 0; i < files.length; i += size) {
            var chunk = [];
            for (var j = 0; j < size; j++) {
                chunk.push(files[i + j]);
            }
            chunks.push(chunk);
        }
        return chunks;
    }

    function stop(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    UIkit.component('countdown', Countdown);
    UIkit.component('filter', Filter);
    UIkit.component('lightbox', Lightbox);
    UIkit.component('lightboxPanel', LightboxPanel);
    UIkit.component('notification', Notification);
    UIkit.component('parallax', Parallax$1);
    UIkit.component('slider', Slider$1);
    UIkit.component('sliderParallax', SliderParallax);
    UIkit.component('slideshow', Slideshow$1);
    UIkit.component('slideshowParallax', SliderParallax);
    UIkit.component('sortable', Sortable);
    UIkit.component('tooltip', Tooltip);
    UIkit.component('upload', Upload);

    {
        boot(UIkit);
    }

    return UIkit;

}));
/*! UIkit 3.0.2 | http://www.getuikit.com | (c) 2014 - 2018 YOOtheme | MIT License */


!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define("uikit",e):(t=t||self).UIkit=e()}(this,function(){"use strict";function p(i,n){return function(t){var e=arguments.length;return e?1<e?i.apply(n,arguments):i.call(n,t):i.call(n)}}var e=Object.prototype,i=e.hasOwnProperty;function l(t,e){return i.call(t,e)}var n={},r=/([a-z\d])([A-Z])/g;function m(t){return t in n||(n[t]=t.replace(r,"$1-$2").toLowerCase()),n[t]}var o=/-(\w)/g;function g(t){return t.replace(o,s)}function s(t,e){return e?e.toUpperCase():""}function a(t){return t.length?s(0,t.charAt(0))+t.slice(1):""}var t=String.prototype,h=t.startsWith||function(t){return 0===this.lastIndexOf(t,0)};function v(t,e){return h.call(t,e)}var c=t.endsWith||function(t){return this.substr(-t.length)===t};function u(t,e){return c.call(t,e)}var d=function(t){return~this.indexOf(t)},f=t.includes||d,w=Array.prototype.includes||d;function b(t,e){return t&&(_(t)?f:w).call(t,e)}var y=Array.isArray;function x(t){return"function"==typeof t}function k(t){return null!==t&&"object"==typeof t}function $(t){return k(t)&&Object.getPrototypeOf(t)===e}function I(t){return k(t)&&t===t.window}function S(t){return k(t)&&9===t.nodeType}function T(t){return k(t)&&!!t.jquery}function E(t){return t instanceof Node||k(t)&&1<=t.nodeType}var C=e.toString;function A(t){return C.call(t).match(/^\[object (NodeList|HTMLCollection)\]$/)}function N(t){return"boolean"==typeof t}function _(t){return"string"==typeof t}function M(t){return"number"==typeof t}function D(t){return M(t)||_(t)&&!isNaN(t-parseFloat(t))}function O(t){return void 0===t}function B(t){return N(t)?t:"true"===t||"1"===t||""===t||"false"!==t&&"0"!==t&&t}function z(t){var e=Number(t);return!isNaN(e)&&e}function P(t){return parseFloat(t)||0}function H(t){return E(t)||I(t)||S(t)?t:A(t)||T(t)?t[0]:y(t)?H(t[0]):null}var F=Array.prototype;function L(t){return E(t)?[t]:A(t)?F.slice.call(t):y(t)?t.map(H).filter(Boolean):T(t)?t.toArray():[]}function j(t){return y(t)?t:_(t)?t.split(/,(?![^(]*\))/).map(function(t){return D(t)?z(t):B(t.trim())}):[t]}function W(t){return t?u(t,"ms")?P(t):1e3*P(t):0}function V(t,e,i){return t.replace(new RegExp(e+"|"+i,"mg"),function(t){return t===e?i:e})}var Y=Object.assign||function(t){for(var e=[],i=arguments.length-1;0<i--;)e[i]=arguments[i+1];t=Object(t);for(var n=0;n<e.length;n++){var r=e[n];if(null!==r)for(var o in r)l(r,o)&&(t[o]=r[o])}return t};function R(t,e){for(var i in t)e.call(t[i],t[i],i)}function q(t,r){return t.sort(function(t,e){var i=t[r];void 0===i&&(i=0);var n=e[r];return void 0===n&&(n=0),n<i?1:i<n?-1:0})}function U(t,e,i){return void 0===e&&(e=0),void 0===i&&(i=1),Math.min(Math.max(z(t)||0,e),i)}function X(){}function K(t,e){return t.left<e.right&&t.right>e.left&&t.top<e.bottom&&t.bottom>e.top}function G(t,e){return t.x<=e.right&&t.x>=e.left&&t.y<=e.bottom&&t.y>=e.top}var J={ratio:function(t,e,i){var n,r="width"===e?"height":"width";return(n={})[r]=t[e]?Math.round(i*t[r]/t[e]):t[r],n[e]=i,n},contain:function(i,n){var r=this;return R(i=Y({},i),function(t,e){return i=i[e]>n[e]?r.ratio(i,e,n[e]):i}),i},cover:function(i,n){var r=this;return R(i=this.contain(i,n),function(t,e){return i=i[e]<n[e]?r.ratio(i,e,n[e]):i}),i}};function Z(t,e,i){if(k(e))for(var n in e)Z(t,n,e[n]);else{if(O(i))return(t=H(t))&&t.getAttribute(e);L(t).forEach(function(t){x(i)&&(i=i.call(t,Z(t,e))),null===i?tt(t,e):t.setAttribute(e,i)})}}function Q(t,e){return L(t).some(function(t){return t.hasAttribute(e)})}function tt(t,e){t=L(t),e.split(" ").forEach(function(e){return t.forEach(function(t){return t.removeAttribute(e)})})}function et(t,e){for(var i=0,n=[e,"data-"+e];i<n.length;i++)if(Q(t,n[i]))return Z(t,n[i])}function it(t,e){return H(t)||ot(t,rt(t,e))}function nt(t,e){var i=L(t);return i.length&&i||st(t,rt(t,e))}function rt(t,e){return void 0===e&&(e=document),ct(t)||S(e)?e:e.ownerDocument}function ot(t,e){return H(at(t,e,"querySelector"))}function st(t,e){return L(at(t,e,"querySelectorAll"))}function at(t,s,e){if(void 0===s&&(s=document),!t||!_(t))return null;var a;ct(t=t.replace(lt,"$1 *"))&&(a=[],t=t.split(",").map(function(t,e){var i=s;if("!"===(t=t.trim())[0]){var n=t.substr(1).trim().split(" ");i=mt(s.parentNode,n[0]),t=n.slice(1).join(" ").trim()}if("-"===t[0]){var r=t.substr(1).trim().split(" "),o=(i||s).previousElementSibling;i=ft(o,t.substr(1))?o:null,t=r.slice(1).join(" ")}return i?(i.id||(i.id="uk-"+Date.now()+e,a.push(function(){return tt(i,"id")})),"#"+wt(i.id)+" "+t):null}).filter(Boolean).join(","),s=document);try{return s[e](t)}catch(t){return null}finally{a&&a.forEach(function(t){return t()})}}var ht=/(^|,)\s*[!>+~-]/,lt=/([!>+~-])(?=\s+[!>+~-]|\s*$)/g;function ct(t){return _(t)&&t.match(ht)}var ut=Element.prototype,dt=ut.matches||ut.webkitMatchesSelector||ut.msMatchesSelector;function ft(t,e){return L(t).some(function(t){return dt.call(t,e)})}var pt=ut.closest||function(t){var e=this;do{if(ft(e,t))return e;e=e.parentNode}while(e&&1===e.nodeType)};function mt(t,e){return v(e,">")&&(e=e.slice(1)),E(t)?t.parentNode&&pt.call(t,e):L(t).map(function(t){return mt(t,e)}).filter(Boolean)}function gt(t,e){for(var i=[],n=H(t).parentNode;n&&1===n.nodeType;)ft(n,e)&&i.push(n),n=n.parentNode;return i}var vt=window.CSS&&CSS.escape||function(t){return t.replace(/([^\x7f-\uFFFF\w-])/g,function(t){return"\\"+t})};function wt(t){return _(t)?vt.call(null,t):""}var bt={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,menuitem:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0};function yt(t){return L(t).some(function(t){return bt[t.tagName.toLowerCase()]})}function xt(t){return L(t).some(function(t){return t.offsetWidth||t.offsetHeight||t.getClientRects().length})}var kt="input,select,textarea,button";function $t(t){return L(t).some(function(t){return ft(t,kt)})}function It(t,e){return L(t).filter(function(t){return ft(t,e)})}function St(t,e){return _(e)?ft(t,e)||mt(t,e):t===e||(S(e)?e.documentElement:H(e)).contains(H(t))}var Tt=/msie|trident/i.test(window.navigator.userAgent),Et="rtl"===Z(document.documentElement,"dir"),Ct="ontouchstart"in window,At=window.PointerEvent,Nt=Ct||window.DocumentTouch&&document instanceof DocumentTouch||navigator.maxTouchPoints,_t=At?"pointerdown":Ct?"touchstart":"mousedown",Mt=At?"pointermove":Ct?"touchmove":"mousemove",Dt=At?"pointerup":Ct?"touchend":"mouseup",Ot=At?"pointerenter":Ct?"":"mouseenter",Bt=At?"pointerleave":Ct?"":"mouseleave",zt=At?"pointercancel":"touchcancel";function Pt(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];var i,n=Wt(t),r=n[0],o=n[1],s=n[2],a=n[3],h=n[4];return r=Rt(r),s&&(a=function(t,n,r){var o=this;return function(i){t.forEach(function(t){var e=">"===n[0]?st(n,t).reverse().filter(function(t){return St(i.target,t)})[0]:mt(i.target,n);e&&(i.delegate=t,i.current=e,r.call(o,i))})}}(r,s,a)),1<a.length&&(i=a,a=function(t){return y(t.detail)?i.apply(void 0,[t].concat(t.detail)):i(t)}),o.split(" ").forEach(function(e){return r.forEach(function(t){return t.addEventListener(e,a,h)})}),function(){return Ht(r,o,a,h)}}function Ht(t,e,i,n){void 0===n&&(n=!1),t=Rt(t),e.split(" ").forEach(function(e){return t.forEach(function(t){return t.removeEventListener(e,i,n)})})}function Ft(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];var i=Wt(t),n=i[0],r=i[1],o=i[2],s=i[3],a=i[4],h=i[5],l=Pt(n,r,o,function(t){var e=!h||h(t);e&&(l(),s(t,e))},a);return l}function Lt(t,i,n){return Rt(t).reduce(function(t,e){return t&&e.dispatchEvent(jt(i,!0,!0,n))},!0)}function jt(t,e,i,n){if(void 0===e&&(e=!0),void 0===i&&(i=!1),_(t)){var r=document.createEvent("CustomEvent");r.initCustomEvent(t,e,i,n),t=r}return t}function Wt(t){return x(t[2])&&t.splice(2,0,!1),t}function Vt(t){return t&&"addEventListener"in t}function Yt(t){return Vt(t)?t:H(t)}function Rt(t){return y(t)?t.map(Yt).filter(Boolean):_(t)?st(t):Vt(t)?[t]:L(t)}function qt(){var e=setTimeout(Ft(document,"click",function(t){t.preventDefault(),t.stopImmediatePropagation(),clearTimeout(e)},!0));Lt(document,zt)}var Ut="Promise"in window?window.Promise:Jt,Xt=function(){var i=this;this.promise=new Ut(function(t,e){i.reject=e,i.resolve=t})},Kt=2,Gt="setImmediate"in window?setImmediate:setTimeout;function Jt(t){this.state=Kt,this.value=void 0,this.deferred=[];var e=this;try{t(function(t){e.resolve(t)},function(t){e.reject(t)})}catch(t){e.reject(t)}}Jt.reject=function(i){return new Jt(function(t,e){e(i)})},Jt.resolve=function(i){return new Jt(function(t,e){t(i)})},Jt.all=function(s){return new Jt(function(i,t){var n=[],r=0;function e(e){return function(t){n[e]=t,(r+=1)===s.length&&i(n)}}0===s.length&&i(n);for(var o=0;o<s.length;o+=1)Jt.resolve(s[o]).then(e(o),t)})},Jt.race=function(n){return new Jt(function(t,e){for(var i=0;i<n.length;i+=1)Jt.resolve(n[i]).then(t,e)})};var Zt=Jt.prototype;function Qt(s,a){return new Ut(function(t,e){var i=Y({data:null,method:"GET",headers:{},xhr:new XMLHttpRequest,beforeSend:X,responseType:""},a);i.beforeSend(i);var n=i.xhr;for(var r in i)if(r in n)try{n[r]=i[r]}catch(t){}for(var o in n.open(i.method.toUpperCase(),s),i.headers)n.setRequestHeader(o,i.headers[o]);Pt(n,"load",function(){0===n.status||200<=n.status&&n.status<300||304===n.status?t(n):e(Y(Error(n.statusText),{xhr:n,status:n.status}))}),Pt(n,"error",function(){return e(Y(Error("Network Error"),{xhr:n}))}),Pt(n,"timeout",function(){return e(Y(Error("Network Timeout"),{xhr:n}))}),n.send(i.data)})}function te(n,r,o){return new Ut(function(t,e){var i=new Image;i.onerror=e,i.onload=function(){return t(i)},o&&(i.sizes=o),r&&(i.srcset=r),i.src=n})}function ee(){return"complete"===document.readyState||"loading"!==document.readyState&&!document.documentElement.doScroll}function ie(t){if(ee())t();else var e=function(){i(),n(),t()},i=Pt(document,"DOMContentLoaded",e),n=Pt(window,"load",e)}function ne(t,e){return e?L(t).indexOf(H(e)):L((t=H(t))&&t.parentNode.children).indexOf(t)}function re(t,e,i,n){void 0===i&&(i=0),void 0===n&&(n=!1);var r=(e=L(e)).length;return t=D(t)?z(t):"next"===t?i+1:"previous"===t?i-1:ne(e,t),n?U(t,0,r-1):(t%=r)<0?t+r:t}function oe(t){return(t=be(t)).innerHTML="",t}function se(t,e){return t=be(t),O(e)?t.innerHTML:ae(t.hasChildNodes()?oe(t):t,e)}function ae(e,t){return e=be(e),ce(t,function(t){return e.appendChild(t)})}function he(e,t){return e=be(e),ce(t,function(t){return e.parentNode.insertBefore(t,e)})}function le(e,t){return e=be(e),ce(t,function(t){return e.nextSibling?he(e.nextSibling,t):ae(e.parentNode,t)})}function ce(t,e){return(t=_(t)?ve(t):t)?"length"in t?L(t).map(e):e(t):null}function ue(t){L(t).map(function(t){return t.parentNode&&t.parentNode.removeChild(t)})}function de(t,e){for(e=H(he(t,e));e.firstChild;)e=e.firstChild;return ae(e,t),e}function fe(t,e){return L(L(t).map(function(t){return t.hasChildNodes?de(L(t.childNodes),e):ae(t,e)}))}function pe(t){L(t).map(function(t){return t.parentNode}).filter(function(t,e,i){return i.indexOf(t)===e}).forEach(function(t){he(t,t.childNodes),ue(t)})}Zt.resolve=function(t){var e=this;if(e.state===Kt){if(t===e)throw new TypeError("Promise settled with itself.");var i=!1;try{var n=t&&t.then;if(null!==t&&k(t)&&x(n))return void n.call(t,function(t){i||e.resolve(t),i=!0},function(t){i||e.reject(t),i=!0})}catch(t){return void(i||e.reject(t))}e.state=0,e.value=t,e.notify()}},Zt.reject=function(t){var e=this;if(e.state===Kt){if(t===e)throw new TypeError("Promise settled with itself.");e.state=1,e.value=t,e.notify()}},Zt.notify=function(){var o=this;Gt(function(){if(o.state!==Kt)for(;o.deferred.length;){var t=o.deferred.shift(),e=t[0],i=t[1],n=t[2],r=t[3];try{0===o.state?x(e)?n(e.call(void 0,o.value)):n(o.value):1===o.state&&(x(i)?n(i.call(void 0,o.value)):r(o.value))}catch(t){r(t)}}})},Zt.then=function(i,n){var r=this;return new Jt(function(t,e){r.deferred.push([i,n,t,e]),r.notify()})},Zt.catch=function(t){return this.then(void 0,t)};var me=/^\s*<(\w+|!)[^>]*>/,ge=/^<(\w+)\s*\/?>(?:<\/\1>)?$/;function ve(t){var e=ge.exec(t);if(e)return document.createElement(e[1]);var i=document.createElement("div");return me.test(t)?i.insertAdjacentHTML("beforeend",t.trim()):i.textContent=t,1<i.childNodes.length?L(i.childNodes):i.firstChild}function we(t,e){if(t&&1===t.nodeType)for(e(t),t=t.firstElementChild;t;)we(t,e),t=t.nextElementSibling}function be(t,e){return _(t)?xe(t)?H(ve(t)):ot(t,e):H(t)}function ye(t,e){return _(t)?xe(t)?L(ve(t)):st(t,e):L(t)}function xe(t){return"<"===t[0]||t.match(/^\s*</)}function ke(t){for(var e=[],i=arguments.length-1;0<i--;)e[i]=arguments[i+1];Ce(t,e,"add")}function $e(t){for(var e=[],i=arguments.length-1;0<i--;)e[i]=arguments[i+1];Ce(t,e,"remove")}function Ie(t,e){Z(t,"class",function(t){return(t||"").replace(new RegExp("\\b"+e+"\\b","g"),"")})}function Se(t){for(var e=[],i=arguments.length-1;0<i--;)e[i]=arguments[i+1];e[0]&&$e(t,e[0]),e[1]&&ke(t,e[1])}function Te(t,e){return e&&L(t).some(function(t){return t.classList.contains(e.split(" ")[0])})}function Ee(t){for(var n=[],e=arguments.length-1;0<e--;)n[e]=arguments[e+1];if(n.length){var r=_((n=Ae(n))[n.length-1])?[]:n.pop();n=n.filter(Boolean),L(t).forEach(function(t){for(var e=t.classList,i=0;i<n.length;i++)_e.Force?e.toggle.apply(e,[n[i]].concat(r)):e[(O(r)?!e.contains(n[i]):r)?"add":"remove"](n[i])})}}function Ce(t,i,n){(i=Ae(i).filter(Boolean)).length&&L(t).forEach(function(t){var e=t.classList;_e.Multiple?e[n].apply(e,i):i.forEach(function(t){return e[n](t)})})}function Ae(t){return t.reduce(function(t,e){return t.concat.call(t,_(e)&&b(e," ")?e.trim().split(" "):e)},[])}var Ne,_e={};(Ne=document.createElement("_").classList)&&(Ne.add("a","b"),Ne.toggle("c",!1),_e.Multiple=Ne.contains("b"),_e.Force=!Ne.contains("c"));var Me={"animation-iteration-count":!(Ne=null),"column-count":!0,"fill-opacity":!0,"flex-grow":!0,"flex-shrink":!0,"font-weight":!0,"line-height":!0,opacity:!0,order:!0,orphans:!0,widows:!0,"z-index":!0,zoom:!0};function De(t,e,r){return L(t).map(function(i){if(_(e)){if(e=Fe(e),O(r))return Be(i,e);r||M(r)?i.style[e]=D(r)&&!Me[e]?r+"px":r:i.style.removeProperty(e)}else{if(y(e)){var n=Oe(i);return e.reduce(function(t,e){return t[e]=n[Fe(e)],t},{})}k(e)&&R(e,function(t,e){return De(i,e,t)})}return i})[0]}function Oe(t,e){return(t=H(t)).ownerDocument.defaultView.getComputedStyle(t,e)}function Be(t,e,i){return Oe(t,i)[e]}var ze={};function Pe(t){var e=document.documentElement;if(!Tt)return Oe(e).getPropertyValue("--uk-"+t);if(!(t in ze)){var i=ae(e,document.createElement("div"));ke(i,"uk-"+t),ze[t]=Be(i,"content",":before").replace(/^["'](.*)["']$/,"$1"),ue(i)}return ze[t]}var He={};function Fe(t){var e=He[t];return e||(e=He[t]=function(t){if((t=m(t))in je)return t;var e,i=Le.length;for(;i--;)if((e="-"+Le[i]+"-"+t)in je)return e}(t)||t),e}var Le=["webkit","moz","ms"],je=document.createElement("_").style;function We(t,s,a,h){return void 0===a&&(a=400),void 0===h&&(h="linear"),Ut.all(L(t).map(function(o){return new Ut(function(i,n){for(var t in s){var e=De(o,t);""===e&&De(o,t,e)}var r=setTimeout(function(){return Lt(o,"transitionend")},a);Ft(o,"transitionend transitioncanceled",function(t){var e=t.type;clearTimeout(r),$e(o,"uk-transition"),De(o,{"transition-property":"","transition-duration":"","transition-timing-function":""}),"transitioncanceled"===e?n():i()},!1,function(t){var e=t.target;return o===e}),ke(o,"uk-transition"),De(o,Y({"transition-property":Object.keys(s).map(Fe).join(","),"transition-duration":a+"ms","transition-timing-function":h},s))})}))}var Ve={start:We,stop:function(t){return Lt(t,"transitionend"),Ut.resolve()},cancel:function(t){Lt(t,"transitioncanceled")},inProgress:function(t){return Te(t,"uk-transition")}},Ye="uk-animation-",Re="uk-cancel-animation";function qe(t,e,i,a,h){var l=arguments;return void 0===i&&(i=200),Ut.all(L(t).map(function(s){return new Ut(function(n,r){if(Te(s,Re))requestAnimationFrame(function(){return Ut.resolve().then(function(){return qe.apply(void 0,l).then(n,r)})});else{var t=e+" "+Ye+(h?"leave":"enter");v(e,Ye)&&(a&&(t+=" uk-transform-origin-"+a),h&&(t+=" "+Ye+"reverse")),o(),Ft(s,"animationend animationcancel",function(t){var e=t.type,i=!1;"animationcancel"===e?(r(),o()):(n(),Ut.resolve().then(function(){i=!0,o()})),requestAnimationFrame(function(){i||(ke(s,Re),requestAnimationFrame(function(){return $e(s,Re)}))})},!1,function(t){var e=t.target;return s===e}),De(s,"animationDuration",i+"ms"),ke(s,t)}function o(){De(s,"animationDuration",""),Ie(s,Ye+"\\S*")}})}))}var Ue=new RegExp(Ye+"(enter|leave)"),Xe={in:function(t,e,i,n){return qe(t,e,i,n,!1)},out:function(t,e,i,n){return qe(t,e,i,n,!0)},inProgress:function(t){return Ue.test(Z(t,"class"))},cancel:function(t){Lt(t,"animationcancel")}},Ke={width:["x","left","right"],height:["y","top","bottom"]};function Ge(t,e,c,u,d,i,n,r){c=oi(c),u=oi(u);var f={element:c,target:u};if(!t||!e)return f;var p=Ze(t),m=Ze(e),g=m;if(ri(g,c,p,-1),ri(g,u,m,1),d=si(d,p.width,p.height),i=si(i,m.width,m.height),d.x+=i.x,d.y+=i.y,g.left+=d.x,g.top+=d.y,n){var o=[Ze(di(t))];r&&o.unshift(Ze(r)),R(Ke,function(t,s){var a=t[0],h=t[1],l=t[2];(!0===n||b(n,a))&&o.some(function(n){var t=c[a]===h?-p[s]:c[a]===l?p[s]:0,e=u[a]===h?m[s]:u[a]===l?-m[s]:0;if(g[h]<n[h]||g[h]+p[s]>n[l]){var i=p[s]/2,r="center"===u[a]?-m[s]/2:0;return"center"===c[a]&&(o(i,r)||o(-i,-r))||o(t,e)}function o(e,t){var i=g[h]+e+t-2*d[a];if(i>=n[h]&&i+p[s]<=n[l])return g[h]=i,["element","target"].forEach(function(t){f[t][a]=e?f[t][a]===Ke[s][1]?Ke[s][2]:Ke[s][1]:f[t][a]}),!0}})})}return Je(t,g),f}function Je(i,n){if(i=H(i),!n)return Ze(i);var r=Je(i),o=De(i,"position");["left","top"].forEach(function(t){if(t in n){var e=De(i,t);De(i,t,n[t]-r[t]+P("absolute"===o&&"auto"===e?Qe(i)[t]:e))}})}function Ze(t){var e,i,n=di(t=H(t)),r=n.pageYOffset,o=n.pageXOffset;if(I(t)){var s=t.innerHeight,a=t.innerWidth;return{top:r,left:o,height:s,width:a,bottom:r+s,right:o+a}}xt(t)||(e=Z(t,"style"),i=Z(t,"hidden"),Z(t,{style:(e||"")+";display:block !important;",hidden:null}));var h=t.getBoundingClientRect();return O(e)||Z(t,{style:e,hidden:i}),{height:h.height,width:h.width,top:h.top+r,left:h.left+o,bottom:h.bottom+r,right:h.right+o}}function Qe(n){var r=(n=H(n)).offsetParent||fi(n).documentElement,o=Je(r),t=["top","left"].reduce(function(t,e){var i=a(e);return t[e]-=o[e]+P(De(n,"margin"+i))+P(De(r,"border"+i+"Width")),t},Je(n));return{top:t.top,left:t.left}}var ti=ii("height"),ei=ii("width");function ii(n){var r=a(n);return function(t,e){if(t=H(t),O(e)){if(I(t))return t["inner"+r];if(S(t)){var i=t.documentElement;return Math.max(i["offset"+r],i["scroll"+r])}return(e="auto"===(e=De(t,n))?t["offset"+r]:P(e)||0)-ni(n,t)}De(t,n,e||0===e?+e+ni(n,t)+"px":"")}}function ni(t,i,e){return void 0===e&&(e="border-box"),De(i,"boxSizing")===e?Ke[t].slice(1).map(a).reduce(function(t,e){return t+P(De(i,"padding"+e))+P(De(i,"border"+e+"Width"))},0):0}function ri(o,s,a,h){R(Ke,function(t,e){var i=t[0],n=t[1],r=t[2];s[i]===r?o[n]+=a[e]*h:"center"===s[i]&&(o[n]+=a[e]*h/2)})}function oi(t){var e=/left|center|right/,i=/top|center|bottom/;return 1===(t=(t||"").split(" ")).length&&(t=e.test(t[0])?t.concat(["center"]):i.test(t[0])?["center"].concat(t):["center","center"]),{x:e.test(t[0])?t[0]:"center",y:i.test(t[1])?t[1]:"center"}}function si(t,e,i){var n=(t||"").split(" "),r=n[0],o=n[1];return{x:r?P(r)*(u(r,"%")?e/100:1):0,y:o?P(o)*(u(o,"%")?i/100:1):0}}function ai(t){switch(t){case"left":return"right";case"right":return"left";case"top":return"bottom";case"bottom":return"top";default:return t}}function hi(t,e,i){if(void 0===e&&(e=0),void 0===i&&(i=0),!xt(t))return!1;var n=di(t=H(t)),r=t.getBoundingClientRect(),o={top:-e,left:-i,bottom:e+ti(n),right:i+ei(n)};return K(r,o)||G({x:r.left,y:r.top},o)}function li(t,e){if(void 0===e&&(e=0),!xt(t))return 0;var i=di(t=H(t)),n=fi(t),r=t.offsetHeight+e,o=ui(t)[0],s=ti(i),a=s+Math.min(0,o-s),h=Math.max(0,s-(ti(n)+e-(o+r)));return U((a+i.pageYOffset-o)/((a+(r-(h<s?h:0)))/100)/100)}function ci(t,e){if(I(t=H(t))||S(t)){var i=di(t);(0,i.scrollTo)(i.pageXOffset,e)}else t.scrollTop=e}function ui(t){var e=[0,0];do{if(e[0]+=t.offsetTop,e[1]+=t.offsetLeft,"fixed"===De(t,"position")){var i=di(t);return e[0]+=i.pageYOffset,e[1]+=i.pageXOffset,e}}while(t=t.offsetParent);return e}function di(t){return I(t)?t:fi(t).defaultView}function fi(t){return H(t).ownerDocument}var pi={reads:[],writes:[],read:function(t){return this.reads.push(t),mi(),t},write:function(t){return this.writes.push(t),mi(),t},clear:function(t){return vi(this.reads,t)||vi(this.writes,t)},flush:function(){gi(this.reads),gi(this.writes.splice(0,this.writes.length)),this.scheduled=!1,(this.reads.length||this.writes.length)&&mi()}};function mi(){pi.scheduled||(pi.scheduled=!0,requestAnimationFrame(pi.flush.bind(pi)))}function gi(t){for(var e;e=t.shift();)e()}function vi(t,e){var i=t.indexOf(e);return!!~i&&!!t.splice(i,1)}function wi(){}function bi(t,e){return(e.y-t.y)/(e.x-t.x)}wi.prototype={positions:[],position:null,init:function(){var n=this;this.positions=[],this.position=null;var r=!1;this.unbind=Pt(document,"mousemove",function(i){r||(setTimeout(function(){var t=Date.now(),e=n.positions.length;e&&100<t-n.positions[e-1].time&&n.positions.splice(0,e),n.positions.push({time:t,x:i.pageX,y:i.pageY}),5<n.positions.length&&n.positions.shift(),r=!1},5),r=!0)})},cancel:function(){this.unbind&&this.unbind()},movesTo:function(t){if(this.positions.length<2)return!1;var e=Je(t),i=this.positions[this.positions.length-1],n=this.positions[0];if(e.left<=i.x&&i.x<=e.right&&e.top<=i.y&&i.y<=e.bottom)return!1;var r=[[{x:e.left,y:e.top},{x:e.right,y:e.bottom}],[{x:e.right,y:e.top},{x:e.left,y:e.bottom}]];return e.right<=i.x||(e.left>=i.x?(r[0].reverse(),r[1].reverse()):e.bottom<=i.y?r[0].reverse():e.top>=i.y&&r[1].reverse()),!!r.reduce(function(t,e){return t+(bi(n,e[0])<bi(i,e[0])&&bi(n,e[1])>bi(i,e[1]))},0)}};var yi={};function xi(t,e,i){return yi.computed(x(t)?t.call(i,i):t,x(e)?e.call(i,i):e)}function ki(t,e){return t=t&&!y(t)?[t]:t,e?t?t.concat(e):y(e)?e:[e]:t}function $i(e,i,n){var r={};if(x(i)&&(i=i.options),i.extends&&(e=$i(e,i.extends,n)),i.mixins)for(var t=0,o=i.mixins.length;t<o;t++)e=$i(e,i.mixins[t],n);for(var s in e)h(s);for(var a in i)l(e,a)||h(a);function h(t){r[t]=(yi[t]||function(t,e){return O(e)?t:e})(e[t],i[t],n)}return r}function Ii(t,e){var i;void 0===e&&(e=[]);try{return t?v(t,"{")?JSON.parse(t):e.length&&!b(t,":")?((i={})[e[0]]=t,i):t.split(";").reduce(function(t,e){var i=e.split(/:(.*)/),n=i[0],r=i[1];return n&&!O(r)&&(t[n.trim()]=r.trim()),t},{}):{}}catch(t){return{}}}yi.events=yi.created=yi.beforeConnect=yi.connected=yi.beforeDisconnect=yi.disconnected=yi.destroy=ki,yi.args=function(t,e){return ki(e||t)},yi.update=function(t,e){return q(ki(t,x(e)?{read:e}:e),"order")},yi.props=function(t,e){return y(e)&&(e=e.reduce(function(t,e){return t[e]=String,t},{})),yi.methods(t,e)},yi.computed=yi.methods=function(t,e){return e?t?Y({},t,e):e:t},yi.data=function(e,i,t){return t?xi(e,i,t):i?e?function(t){return xi(e,i,t)}:i:e};var Si=0,Ti=function(t){this.id=++Si,this.el=H(t)};function Ei(t,e){try{t.contentWindow.postMessage(JSON.stringify(Y({event:"command"},e)),"*")}catch(t){}}Ti.prototype.isVideo=function(){return this.isYoutube()||this.isVimeo()||this.isHTML5()},Ti.prototype.isHTML5=function(){return"VIDEO"===this.el.tagName},Ti.prototype.isIFrame=function(){return"IFRAME"===this.el.tagName},Ti.prototype.isYoutube=function(){return this.isIFrame()&&!!this.el.src.match(/\/\/.*?youtube(-nocookie)?\.[a-z]+\/(watch\?v=[^&\s]+|embed)|youtu\.be\/.*/)},Ti.prototype.isVimeo=function(){return this.isIFrame()&&!!this.el.src.match(/vimeo\.com\/video\/.*/)},Ti.prototype.enableApi=function(){var e=this;if(this.ready)return this.ready;var i,r=this.isYoutube(),o=this.isVimeo();return r||o?this.ready=new Ut(function(t){var n;Ft(e.el,"load",function(){if(r){var t=function(){return Ei(e.el,{event:"listening",id:e.id})};i=setInterval(t,100),t()}}),(n=function(t){return r&&t.id===e.id&&"onReady"===t.event||o&&Number(t.player_id)===e.id},new Ut(function(i){Ft(window,"message",function(t,e){return i(e)},!1,function(t){var e=t.data;if(e&&_(e)){try{e=JSON.parse(e)}catch(t){return}return e&&n(e)}})})).then(function(){t(),i&&clearInterval(i)}),Z(e.el,"src",e.el.src+(b(e.el.src,"?")?"&":"?")+(r?"enablejsapi=1":"api=1&player_id="+e.id))}):Ut.resolve()},Ti.prototype.play=function(){var t=this;if(this.isVideo())if(this.isIFrame())this.enableApi().then(function(){return Ei(t.el,{func:"playVideo",method:"play"})});else if(this.isHTML5())try{var e=this.el.play();e&&e.catch(X)}catch(t){}},Ti.prototype.pause=function(){var t=this;this.isVideo()&&(this.isIFrame()?this.enableApi().then(function(){return Ei(t.el,{func:"pauseVideo",method:"pause"})}):this.isHTML5()&&this.el.pause())},Ti.prototype.mute=function(){var t=this;this.isVideo()&&(this.isIFrame()?this.enableApi().then(function(){return Ei(t.el,{func:"mute",method:"setVolume",value:0})}):this.isHTML5()&&(this.el.muted=!0,Z(this.el,"muted","")))};var Ci,Ai,Ni={};function _i(t){return"touch"===t.pointerType||t.touches||Ai}function Mi(t,e){void 0===e&&(e="client");var i=t.touches,n=t.changedTouches,r=i&&i[0]||n&&n[0]||t;return{x:r[e+"X"],y:r[e+"Y"]}}function Di(t){return!(!v(t,"uk-")&&!v(t,"data-uk-"))&&g(t.replace("data-uk-","").replace("uk-",""))}Pt(document,_t,function(t){Ni.el&&(Ni={});var e=t.target,i=Mi(t),n=i.x,r=i.y;Ni.el="tagName"in e?e:e.parentNode,Ni.x=n,Ni.y=r,Ai=!0}),Pt(document,Dt,function(t){var e=Mi(t),r=e.x,o=e.y;Ni.el&&r&&100<Math.abs(Ni.x-r)||o&&100<Math.abs(Ni.y-o)?Ci=setTimeout(function(){var t,e,i,n;Ni.el&&(Lt(Ni.el,"swipe"),Lt(Ni.el,"swipe"+(t=Ni.x,e=Ni.y,i=r,n=o,Math.abs(t-i)>=Math.abs(e-n)?0<t-i?"Left":"Right":0<e-n?"Up":"Down"))),Ni={}}):Ni={},setTimeout(function(){return Ai=!1})}),Pt(document,zt,function(){Ci&&clearTimeout(Ci),Ci=null,Ni={}});var Oi,Bi,zi,Pi,Hi=function(t){this._init(t)};Hi.util=Object.freeze({ajax:Qt,getImage:te,transition:We,Transition:Ve,animate:qe,Animation:Xe,attr:Z,hasAttr:Q,removeAttr:tt,data:et,addClass:ke,removeClass:$e,removeClasses:Ie,replaceClass:Se,hasClass:Te,toggleClass:Ee,positionAt:Ge,offset:Je,position:Qe,height:ti,width:ei,boxModelAdjust:ni,flipPosition:ai,isInView:hi,scrolledOver:li,scrollTop:ci,offsetPosition:ui,isReady:ee,ready:ie,index:ne,getIndex:re,empty:oe,html:se,prepend:function(e,t){return(e=be(e)).hasChildNodes()?ce(t,function(t){return e.insertBefore(t,e.firstChild)}):ae(e,t)},append:ae,before:he,after:le,remove:ue,wrapAll:de,wrapInner:fe,unwrap:pe,fragment:ve,apply:we,$:be,$$:ye,isIE:Tt,isRtl:Et,hasTouch:Nt,pointerDown:_t,pointerMove:Mt,pointerUp:Dt,pointerEnter:Ot,pointerLeave:Bt,pointerCancel:zt,on:Pt,off:Ht,once:Ft,trigger:Lt,createEvent:jt,toEventTargets:Rt,preventClick:qt,fastdom:pi,isVoidElement:yt,isVisible:xt,selInput:kt,isInput:$t,filter:It,within:St,bind:p,hasOwn:l,hyphenate:m,camelize:g,ucfirst:a,startsWith:v,endsWith:u,includes:b,isArray:y,isFunction:x,isObject:k,isPlainObject:$,isWindow:I,isDocument:S,isJQuery:T,isNode:E,isNodeCollection:A,isBoolean:N,isString:_,isNumber:M,isNumeric:D,isUndefined:O,toBoolean:B,toNumber:z,toFloat:P,toNode:H,toNodes:L,toList:j,toMs:W,swap:V,assign:Y,each:R,sortBy:q,clamp:U,noop:X,intersectRect:K,pointInRect:G,Dimensions:J,MouseTracker:wi,mergeOptions:$i,parseOptions:Ii,Player:Ti,Promise:Ut,Deferred:Xt,query:it,queryAll:nt,find:ot,findAll:st,matches:ft,closest:mt,parents:gt,escape:wt,css:De,getStyles:Oe,getStyle:Be,getCssVar:Pe,propName:Fe,isTouch:_i,getPos:Mi}),Hi.data="__uikit__",Hi.prefix="uk-",Hi.options={},function(i){var e,n=i.data;function r(t,e){if(t)for(var i in t)t[i]._connected&&t[i]._callUpdate(e)}i.use=function(t){if(!t.installed)return t.call(null,this),t.installed=!0,this},i.mixin=function(t,e){(e=(_(e)?i.component(e):e)||this).options=$i(e.options,t)},i.extend=function(t){t=t||{};var e=function(t){this._init(t)};return((e.prototype=Object.create(this.prototype)).constructor=e).options=$i(this.options,t),e.super=this,e.extend=this.extend,e},i.update=function(t,e){e=jt(e||"update"),function t(e,i){e&&e!==document.body&&e.parentNode&&(t(e.parentNode,i),i(e.parentNode))}(t=t?H(t):document.body,function(t){return r(t[n],e)}),we(t,function(t){return r(t[n],e)})},Object.defineProperty(i,"container",{get:function(){return e||document.body},set:function(t){e=be(t)}})}(Hi),(Oi=Hi).prototype._callHook=function(t){var e=this,i=this.$options[t];i&&i.forEach(function(t){return t.call(e)})},Oi.prototype._callConnected=function(){this._connected||(this._data={},this._initProps(),this._callHook("beforeConnect"),this._connected=!0,this._initEvents(),this._initObserver(),this._callHook("connected"),this._callUpdate())},Oi.prototype._callDisconnected=function(){this._connected&&(this._callHook("beforeDisconnect"),this._observer&&(this._observer.disconnect(),this._observer=null),this._unbindEvents(),this._callHook("disconnected"),this._connected=!1)},Oi.prototype._callUpdate=function(o){var s=this,a=(o=jt(o||"update")).type;b(["update","load","resize"],a)&&this._resetComputeds();var t=this.$options.update,e=this._frames,h=e.reads,l=e.writes;t&&t.forEach(function(t,e){var i=t.read,n=t.write,r=t.events;("update"===a||b(r,a))&&(i&&!b(pi.reads,h[e])&&(h[e]=pi.read(function(){var t=s._connected&&i.call(s,s._data,o);!1===t&&n?pi.clear(l[e]):$(t)&&Y(s._data,t)})),n&&!b(pi.writes,l[e])&&(l[e]=pi.write(function(){return s._connected&&n.call(s,s._data,o)})))})},function(t){var e=0;function s(t,e){var i={},n=t.args;void 0===n&&(n=[]);var r=t.props;void 0===r&&(r={});var o=t.el;if(!r)return i;for(var s in r){var a=m(s),h=et(o,a);if(!O(h)){if(h=r[s]===Boolean&&""===h||d(r[s],h),"target"===a&&(!h||v(h,"_")))continue;i[s]=h}}var l=Ii(et(o,e),n);for(var c in l){var u=g(c);void 0!==r[u]&&(i[u]=d(r[u],l[c]))}return i}function i(n,r,o){Object.defineProperty(n,r,{enumerable:!0,get:function(){var t=n._computeds,e=n.$props,i=n.$el;return l(t,r)||(t[r]=(o.get||o).call(n,e,i)),t[r]},set:function(t){var e=n._computeds;e[r]=o.set?o.set.call(n,t):t,O(e[r])&&delete e[r]}})}function f(e,i,n){$(i)||(i={name:n,handler:i});var r,o,t=i.name,s=i.el,a=i.handler,h=i.capture,l=i.passive,c=i.delegate,u=i.filter,d=i.self;s=x(s)?s.call(e):s||e.$el,y(s)?s.forEach(function(t){return f(e,Y({},i,{el:t}),n)}):!s||u&&!u.call(e)||(r=_(a)?e[a]:p(a,e),a=function(t){return y(t.detail)?r.apply(void 0,[t].concat(t.detail)):r(t)},d&&(o=a,a=function(t){if(t.target===t.currentTarget||t.target===t.current)return o.call(null,t)}),e._events.push(Pt(s,t,c?_(c)?c:c.call(e):null,a,N(l)?{passive:l,capture:h}:h)))}function n(t,e){return t.every(function(t){return!t||!l(t,e)})}function d(t,e){return t===Boolean?B(e):t===Number?z(e):"list"===t?j(e):t?t(e):e}t.prototype._init=function(t){(t=t||{}).data=function(t,e){var i=t.data,n=(t.el,e.args),r=e.props;if(void 0===r&&(r={}),i=y(i)?n&&n.length?i.slice(0,n.length).reduce(function(t,e,i){return $(e)?Y(t,e):t[n[i]]=e,t},{}):void 0:i)for(var o in i)O(i[o])?delete i[o]:i[o]=r[o]?d(r[o],i[o]):i[o];return i}(t,this.constructor.options),this.$options=$i(this.constructor.options,t,this),this.$el=null,this.$props={},this._frames={reads:{},writes:{}},this._events=[],this._uid=e++,this._initData(),this._initMethods(),this._initComputeds(),this._callHook("created"),t.el&&this.$mount(t.el)},t.prototype._initData=function(){var t=this.$options.data;for(var e in void 0===t&&(t={}),t)this.$props[e]=this[e]=t[e]},t.prototype._initMethods=function(){var t=this.$options.methods;if(t)for(var e in t)this[e]=p(t[e],this)},t.prototype._initComputeds=function(){var t=this.$options.computed;if(this._resetComputeds(),t)for(var e in t)i(this,e,t[e])},t.prototype._resetComputeds=function(){this._computeds={}},t.prototype._initProps=function(t){var e;for(e in this._resetComputeds(),t=t||s(this.$options,this.$name))O(t[e])||(this.$props[e]=t[e]);var i=[this.$options.computed,this.$options.methods];for(e in this.$props)e in t&&n(i,e)&&(this[e]=this.$props[e])},t.prototype._initEvents=function(){var i=this,t=this.$options.events;t&&t.forEach(function(t){if(l(t,"handler"))f(i,t);else for(var e in t)f(i,t[e],e)})},t.prototype._unbindEvents=function(){this._events.forEach(function(t){return t()}),this._events=[]},t.prototype._initObserver=function(){var i=this,t=this.$options,n=t.attrs,e=t.props,r=t.el;if(!this._observer&&e&&!1!==n){n=y(n)?n:Object.keys(e),this._observer=new MutationObserver(function(){var e=s(i.$options,i.$name);n.some(function(t){return!O(e[t])&&e[t]!==i.$props[t]})&&i.$reset()});var o=n.map(function(t){return m(t)}).concat(this.$name);this._observer.observe(r,{attributes:!0,attributeFilter:o.concat(o.map(function(t){return"data-"+t}))})}}}(Hi),zi=(Bi=Hi).data,Pi={},Bi.component=function(s,t){if(!t)return $(Pi[s])&&(Pi[s]=Bi.extend(Pi[s])),Pi[s];Bi[s]=function(t,i){for(var e=arguments.length,n=Array(e);e--;)n[e]=arguments[e];var r=Bi.component(s);return $(t)?new r({data:t}):r.options.functional?new r({data:[].concat(n)}):t&&t.nodeType?o(t):ye(t).map(o)[0];function o(t){var e=Bi.getComponent(t,s);if(e){if(!i)return e;e.$destroy()}return new r({el:t,data:i})}};var e=$(t)?Y({},t):t.options;if(e.name=s,e.install&&e.install(Bi,e,s),Bi._initialized&&!e.functional){var i=m(s);pi.read(function(){return Bi[s]("[uk-"+i+"],[data-uk-"+i+"]")})}return Pi[s]=$(t)?e:t},Bi.getComponents=function(t){return t&&t[zi]||{}},Bi.getComponent=function(t,e){return Bi.getComponents(t)[e]},Bi.connect=function(t){if(t[zi])for(var e in t[zi])t[zi][e]._callConnected();for(var i=0;i<t.attributes.length;i++){var n=Di(t.attributes[i].name);n&&n in Pi&&Bi[n](t)}},Bi.disconnect=function(t){for(var e in t[zi])t[zi][e]._callDisconnected()},function(n){var r=n.data;n.prototype.$mount=function(t){var e=this.$options.name;t[r]||(t[r]={}),t[r][e]||((t[r][e]=this).$el=this.$options.el=this.$options.el||t,St(t,document)&&this._callConnected())},n.prototype.$emit=function(t){this._callUpdate(t)},n.prototype.$reset=function(){this._callDisconnected(),this._callConnected()},n.prototype.$destroy=function(t){void 0===t&&(t=!1);var e=this.$options,i=e.el,n=e.name;i&&this._callDisconnected(),this._callHook("destroy"),i&&i[r]&&(delete i[r][n],Object.keys(i[r]).length||delete i[r],t&&ue(this.$el))},n.prototype.$create=function(t,e,i){return n[t](e,i)},n.prototype.$update=n.update,n.prototype.$getComponent=n.getComponent;var e={};Object.defineProperties(n.prototype,{$container:Object.getOwnPropertyDescriptor(n,"container"),$name:{get:function(){var t=this.$options.name;return e[t]||(e[t]=n.prefix+m(t)),e[t]}}})}(Hi);var Fi={connected:function(){!Te(this.$el,this.$name)&&ke(this.$el,this.$name)}},Li={props:{cls:Boolean,animation:"list",duration:Number,origin:String,transition:String,queued:Boolean},data:{cls:!1,animation:[!1],duration:200,origin:!1,transition:"linear",queued:!1,initProps:{overflow:"",height:"",paddingTop:"",paddingBottom:"",marginTop:"",marginBottom:""},hideProps:{overflow:"hidden",height:0,paddingTop:0,paddingBottom:0,marginTop:0,marginBottom:0}},computed:{hasAnimation:function(t){return!!t.animation[0]},hasTransition:function(t){var e=t.animation;return this.hasAnimation&&!0===e[0]}},methods:{toggleElement:function(l,c,u){var d=this;return new Ut(function(t){l=L(l);var e,i=function(t){return Ut.all(t.map(function(t){return d._toggleElement(t,c,u)}))},n=l.filter(function(t){return d.isToggled(t)}),r=l.filter(function(t){return!b(n,t)});if(d.queued&&O(u)&&O(c)&&d.hasAnimation&&!(l.length<2)){var o=document.body,s=o.scrollTop,a=n[0],h=Xe.inProgress(a)&&Te(a,"uk-animation-leave")||Ve.inProgress(a)&&"0px"===a.style.height;e=i(n),h||(e=e.then(function(){var t=i(r);return o.scrollTop=s,t}))}else e=i(r.concat(n));e.then(t,X)})},toggleNow:function(e,i){var n=this;return new Ut(function(t){return Ut.all(L(e).map(function(t){return n._toggleElement(t,i,!1)})).then(t,X)})},isToggled:function(t){var e=L(t||this.$el);return this.cls?Te(e,this.cls.split(" ")[0]):!Q(e,"hidden")},updateAria:function(t){!1===this.cls&&Z(t,"aria-hidden",!this.isToggled(t))},_toggleElement:function(t,e,i){var n=this;if(e=N(e)?e:Xe.inProgress(t)?Te(t,"uk-animation-leave"):Ve.inProgress(t)?"0px"===t.style.height:!this.isToggled(t),!Lt(t,"before"+(e?"show":"hide"),[this]))return Ut.reject();var r,o,s,a,h,l,c,u,d,f,p,m,g=(x(i)?i:!1!==i&&this.hasAnimation?this.hasTransition?(c=(l=this).isToggled,u=l.duration,d=l.initProps,f=l.hideProps,p=l.transition,m=l._toggle,function(t,e){var i=Ve.inProgress(t),n=t.hasChildNodes?P(De(t.firstElementChild,"marginTop"))+P(De(t.lastElementChild,"marginBottom")):0,r=xt(t)?ti(t)+(i?0:n):0;Ve.cancel(t),c(t)||m(t,!0),ti(t,""),pi.flush();var o=ti(t)+(i?0:n);return ti(t,r),(e?Ve.start(t,Y({},d,{overflow:"hidden",height:o}),Math.round(u*(1-r/o)),p):Ve.start(t,f,Math.round(u*(r/o)),p).then(function(){return m(t,!1)})).then(function(){return De(t,d)})}):(o=(r=this).animation,s=r.duration,a=r.origin,h=r._toggle,function(t,e){return Xe.cancel(t),e?(h(t,!0),Xe.in(t,o[0],s,a)):Xe.out(t,o[1]||o[0],s,a).then(function(){return h(t,!1)})}):this._toggle)(t,e);Lt(t,e?"show":"hide",[this]);var v=function(){Lt(t,e?"shown":"hidden",[n]),n.$update(t)};return g?g.then(v):Ut.resolve(v())},_toggle:function(t,e){var i;t&&(this.cls?(i=b(this.cls," ")||Boolean(e)!==Te(t,this.cls))&&Ee(t,this.cls,b(this.cls," ")?void 0:e):(i=Boolean(e)===Q(t,"hidden"))&&Z(t,"hidden",e?null:""),ye("[autofocus]",t).some(function(t){return xt(t)&&(t.focus()||!0)}),this.updateAria(t),i&&this.$update(t))}}};var ji={mixins:[Fi,Li],props:{targets:String,active:null,collapsible:Boolean,multiple:Boolean,toggle:String,content:String,transition:String},data:{targets:"> *",active:!1,animation:[!0],collapsible:!0,multiple:!1,clsOpen:"uk-open",toggle:"> .uk-accordion-title",content:"> .uk-accordion-content",transition:"ease"},computed:{items:function(t,e){return ye(t.targets,e)}},events:[{name:"click",delegate:function(){return this.targets+" "+this.$props.toggle},handler:function(t){t.preventDefault(),this.toggle(ne(ye(this.targets+" "+this.$props.toggle,this.$el),t.current))}}],connected:function(){if(!1!==this.active){var t=this.items[Number(this.active)];t&&!Te(t,this.clsOpen)&&this.toggle(t,!1)}},update:function(){var e=this;this.items.forEach(function(t){return e._toggle(be(e.content,t),Te(t,e.clsOpen))});var t=!this.collapsible&&!Te(this.items,this.clsOpen)&&this.items[0];t&&this.toggle(t,!1)},methods:{toggle:function(r,o){var s=this,t=re(r,this.items),a=It(this.items,"."+this.clsOpen);(r=this.items[t])&&[r].concat(!this.multiple&&!b(a,r)&&a||[]).forEach(function(t){var e=t===r,i=e&&!Te(t,s.clsOpen);if(i||!e||s.collapsible||!(a.length<2)){Ee(t,s.clsOpen,i);var n=t._wrapper?t._wrapper.firstElementChild:be(s.content,t);t._wrapper||(t._wrapper=de(n,"<div>"),Z(t._wrapper,"hidden",i?"":null)),s._toggle(n,!0),s.toggleElement(t._wrapper,i,o).then(function(){Te(t,s.clsOpen)===i&&(i||s._toggle(n,!1),t._wrapper=null,pe(n))})}})}}},Wi={mixins:[Fi,Li],args:"animation",props:{close:String},data:{animation:[!0],selClose:".uk-alert-close",duration:150,hideProps:Y({opacity:0},Li.data.hideProps)},events:[{name:"click",delegate:function(){return this.selClose},handler:function(t){t.preventDefault(),this.close()}}],methods:{close:function(){var t=this;this.toggleElement(this.$el).then(function(){return t.$destroy(!0)})}}};function Vi(r){ie(function(){r.update();var i=0,n=0;Pt(window,"load resize",function(t){return r.update(null,t)}),Pt(window,"scroll",function(t){var e=t.target;t.dir=i<=window.pageYOffset?"down":"up",t.pageYOffset=i=window.pageYOffset,r.update(1!==e.nodeType?document.body:e,t)},{passive:!0,capture:!0}),Pt(document,"loadedmetadata load",function(t){var e=t.target;return r.update(e,"load")},!0),Pt(document,"animationstart",function(t){var e=t.target;(De(e,"animationName")||"").match(/^uk-.*(left|right)/)&&(n++,De(document.body,"overflowX","hidden"),setTimeout(function(){--n||De(document.body,"overflowX","")},W(De(e,"animationDuration"))+100))},!0)})}var Yi,Ri,qi={args:"autoplay",props:{automute:Boolean,autoplay:Boolean},data:{automute:!1,autoplay:!0},computed:{inView:function(t){return"inview"===t.autoplay}},connected:function(){this.inView&&!Q(this.$el,"preload")&&(this.$el.preload="none"),this.player=new Ti(this.$el),this.automute&&this.player.mute()},update:{read:function(t,e){var i=e.type;return!(!this.player||!("scroll"!==i&&"resize"!==i||this.inView))&&{visible:xt(this.$el)&&"hidden"!==De(this.$el,"visibility"),inView:this.inView&&hi(this.$el)}},write:function(t){var e=t.visible,i=t.inView;!e||this.inView&&!i?this.player.pause():(!0===this.autoplay||this.inView&&i)&&this.player.play()},events:["load","resize","scroll"]}},Ui={mixins:[Fi,qi],props:{width:Number,height:Number},data:{automute:!0},update:{read:function(){var t=this.$el;if(!xt(t))return!1;var e=t.parentNode;return{height:e.offsetHeight,width:e.offsetWidth}},write:function(t){var e=t.height,i=t.width,n=this.$el,r=this.width||n.naturalWidth||n.videoWidth||n.clientWidth,o=this.height||n.naturalHeight||n.videoHeight||n.clientHeight;r&&o&&De(n,J.cover({width:r,height:o},{width:i+(i%2?1:0),height:e+(e%2?1:0)}))},events:["load","resize"]}},Xi={props:{pos:String,offset:null,flip:Boolean,clsPos:String},data:{pos:"bottom-"+(Et?"right":"left"),flip:!0,offset:!1,clsPos:""},computed:{pos:function(t){var e=t.pos;return(e+(b(e,"-")?"":"-center")).split("-")},dir:function(){return this.pos[0]},align:function(){return this.pos[1]}},methods:{positionAt:function(t,e,i){var n;Ie(t,this.clsPos+"-(top|bottom|left|right)(-[a-z]+)?"),De(t,{top:"",left:""});var r=this.offset,o=this.getAxis();D(r)||(r=(n=be(r))?Je(n)["x"===o?"left":"top"]-Je(e)["x"===o?"right":"bottom"]:0);var s=Ge(t,e,"x"===o?ai(this.dir)+" "+this.align:this.align+" "+ai(this.dir),"x"===o?this.dir+" "+this.align:this.align+" "+this.dir,"x"===o?""+("left"===this.dir?-r:r):" "+("top"===this.dir?-r:r),null,this.flip,i).target,a=s.x,h=s.y;this.dir="x"===o?a:h,this.align="x"===o?h:a,Ee(t,this.clsPos+"-"+this.dir+"-"+this.align,!1===this.offset)},getAxis:function(){return"top"===this.dir||"bottom"===this.dir?"y":"x"}}},Ki={mixins:[Xi,Li],args:"pos",props:{mode:"list",toggle:Boolean,boundary:Boolean,boundaryAlign:Boolean,delayShow:Number,delayHide:Number,clsDrop:String},data:{mode:["click","hover"],toggle:"- *",boundary:window,boundaryAlign:!1,delayShow:0,delayHide:800,clsDrop:!1,hoverIdle:200,animation:["uk-animation-fade"],cls:"uk-open"},computed:{boundary:function(t,e){return it(t.boundary,e)},clsDrop:function(t){return t.clsDrop||"uk-"+this.$options.name},clsPos:function(){return this.clsDrop}},created:function(){this.tracker=new wi},connected:function(){ke(this.$el,this.clsDrop);var t=this.$props.toggle;this.toggle=t&&this.$create("toggle",it(t,this.$el),{target:this.$el,mode:this.mode}),!this.toggle&&Lt(this.$el,"updatearia")},events:[{name:"click",delegate:function(){return"."+this.clsDrop+"-close"},handler:function(t){t.preventDefault(),this.hide(!1)}},{name:"click",delegate:function(){return'a[href^="#"]'},handler:function(t){if(!t.defaultPrevented){var e=t.target.hash;e||t.preventDefault(),e&&St(e,this.$el)||this.hide(!1)}}},{name:"beforescroll",handler:function(){this.hide(!1)}},{name:"toggle",self:!0,handler:function(t,e){t.preventDefault(),this.isToggled()?this.hide(!1):this.show(e,!1)}},{name:Ot,filter:function(){return b(this.mode,"hover")},handler:function(t){_i(t)||(Yi&&Yi!==this&&Yi.toggle&&b(Yi.toggle.mode,"hover")&&!St(t.target,Yi.toggle.$el)&&!G({x:t.pageX,y:t.pageY},Je(Yi.$el))&&Yi.hide(!1),t.preventDefault(),this.show(this.toggle))}},{name:"toggleshow",handler:function(t,e){e&&!b(e.target,this.$el)||(t.preventDefault(),this.show(e||this.toggle))}},{name:"togglehide "+Bt,handler:function(t,e){_i(t)||e&&!b(e.target,this.$el)||(t.preventDefault(),this.toggle&&b(this.toggle.mode,"hover")&&this.hide())}},{name:"beforeshow",self:!0,handler:function(){this.clearTimers(),Xe.cancel(this.$el),this.position()}},{name:"show",self:!0,handler:function(){this.tracker.init(),Lt(this.$el,"updatearia"),function(){if(Ri)return;Ri=!0,Pt(document,Dt,function(t){var e,i=t.target,n=t.defaultPrevented;if(!n)for(;Yi&&Yi!==e&&!St(i,Yi.$el)&&(!Yi.toggle||!St(i,Yi.toggle.$el));)(e=Yi).hide(!1)})}()}},{name:"beforehide",self:!0,handler:function(){this.clearTimers()}},{name:"hide",handler:function(t){var e=t.target;this.$el===e?(Yi=this.isActive()?null:Yi,Lt(this.$el,"updatearia"),this.tracker.cancel()):Yi=null===Yi&&St(e,this.$el)&&this.isToggled()?this:Yi}},{name:"updatearia",self:!0,handler:function(t,e){t.preventDefault(),this.updateAria(this.$el),(e||this.toggle)&&(Z((e||this.toggle).$el,"aria-expanded",this.isToggled()?"true":"false"),Ee(this.toggle.$el,this.cls,this.isToggled()))}}],update:{write:function(){this.isToggled()&&!Xe.inProgress(this.$el)&&this.position()},events:["resize"]},methods:{show:function(e,i){var n=this;void 0===i&&(i=!0);var r=function(){return!n.isToggled()&&n.toggleElement(n.$el,!0)},t=function(){if(n.toggle=e||n.toggle,n.clearTimers(),!n.isActive())if(i&&Yi&&Yi!==n&&Yi.isDelaying)n.showTimer=setTimeout(n.show,10);else{if(n.isParentOf(Yi)){if(!Yi.hideTimer)return;Yi.hide(!1)}else if(Yi&&n.isChildOf(Yi))Yi.clearTimers();else if(Yi&&!n.isChildOf(Yi)&&!n.isParentOf(Yi))for(var t;Yi&&Yi!==t&&!n.isChildOf(Yi);)(t=Yi).hide(!1);i&&n.delayShow?n.showTimer=setTimeout(r,n.delayShow):r(),Yi=n}};e&&this.toggle&&e.$el!==this.toggle.$el?(Ft(this.$el,"hide",t),this.hide(!1)):t()},hide:function(t){var e=this;void 0===t&&(t=!0);var i=function(){return e.toggleNow(e.$el,!1)};this.clearTimers(),this.isDelaying=this.tracker.movesTo(this.$el),t&&this.isDelaying?this.hideTimer=setTimeout(this.hide,this.hoverIdle):t&&this.delayHide?this.hideTimer=setTimeout(i,this.delayHide):i()},clearTimers:function(){clearTimeout(this.showTimer),clearTimeout(this.hideTimer),this.showTimer=null,this.hideTimer=null,this.isDelaying=!1},isActive:function(){return Yi===this},isChildOf:function(t){return t&&t!==this&&St(this.$el,t.$el)},isParentOf:function(t){return t&&t!==this&&St(t.$el,this.$el)},position:function(){Ie(this.$el,this.clsDrop+"-(stack|boundary)"),De(this.$el,{top:"",left:"",display:"block"}),Ee(this.$el,this.clsDrop+"-boundary",this.boundaryAlign);var t=Je(this.boundary),e=this.boundaryAlign?t:Je(this.toggle.$el);if("justify"===this.align){var i="y"===this.getAxis()?"width":"height";De(this.$el,i,e[i])}else this.$el.offsetWidth>Math.max(t.right-e.left,e.right-t.left)&&ke(this.$el,this.clsDrop+"-stack");this.positionAt(this.$el,this.boundaryAlign?this.boundary:this.toggle.$el,this.boundary),De(this.$el,"display","")}}};var Gi={extends:Ki},Ji={mixins:[Fi],args:"target",props:{target:Boolean},data:{target:!1},computed:{input:function(t,e){return be(kt,e)},state:function(){return this.input.nextElementSibling},target:function(t,e){var i=t.target;return i&&(!0===i&&this.input.parentNode===e&&this.input.nextElementSibling||it(i,e))}},update:function(){var t=this.target,e=this.input;if(t){var i,n=$t(t)?"value":"textContent",r=t[n],o=e.files&&e.files[0]?e.files[0].name:ft(e,"select")&&(i=ye("option",e).filter(function(t){return t.selected})[0])?i.textContent:e.value;r!==o&&(t[n]=o)}},events:[{name:"focusin focusout mouseenter mouseleave",delegate:kt,handler:function(t){var e=t.type;t.current===this.input&&Ee(this.state,"uk-"+(b(e,"focus")?"focus":"hover"),b(["focusin","mouseenter"],e))}},{name:"change",handler:function(){this.$emit()}}]},Zi={update:{read:function(t){var e=hi(this.$el);if(!e||t.isInView===e)return!1;t.isInView=e},write:function(){this.$el.src=this.$el.src},events:["scroll","load","resize"]}},Qi={props:{margin:String,firstColumn:Boolean},data:{margin:"uk-margin-small-top",firstColumn:"uk-first-column"},update:{read:function(t){var e=this.$el.children;if(!e.length||!xt(this.$el))return t.rows=[[]];t.rows=tn(e),t.stacks=!t.rows.some(function(t){return 1<t.length})},write:function(t){var n=this;t.rows.forEach(function(t,i){return t.forEach(function(t,e){Ee(t,n.margin,0!==i),Ee(t,n.firstColumn,0===e)})})},events:["load","resize"]}};function tn(t){for(var e=[[]],i=0;i<t.length;i++){var n=t[i],r=en(n);if(r.height)for(var o=e.length-1;0<=o;o--){var s=e[o];if(!s[0]){s.push(n);break}var a=void 0;if(a=s[0].offsetParent===n.offsetParent?en(s[0]):(r=en(n,!0),en(s[0],!0)),r.top>=a.bottom-1){e.push([n]);break}if(r.bottom>a.top){if(r.left<a.left&&!Et){s.unshift(n);break}s.push(n);break}if(0===o){e.unshift([n]);break}}}return e}function en(t,e){var i;void 0===e&&(e=!1);var n=t.offsetTop,r=t.offsetLeft,o=t.offsetHeight;return e&&(n=(i=ui(t))[0],r=i[1]),{top:n,left:r,height:o,bottom:n+o}}var nn={extends:Qi,mixins:[Fi],name:"grid",props:{masonry:Boolean,parallax:Number},data:{margin:"uk-grid-margin",clsStack:"uk-grid-stack",masonry:!1,parallax:0},computed:{length:function(t,e){return e.children.length},parallax:function(t){var e=t.parallax;return e&&this.length?Math.abs(e):""}},connected:function(){this.masonry&&ke(this.$el,"uk-flex-top uk-flex-wrap-top")},update:[{read:function(t){var r=t.rows;(this.masonry||this.parallax)&&(r=r.map(function(t){return q(t,"offsetLeft")}),Et&&r.map(function(t){return t.reverse()}));var e,i,n,o,s,a=r.some(function(t){return t.some(Ve.inProgress)}),h=!1,l="";if(this.masonry&&this.length){var c=0;h=r.reduce(function(i,t,n){return i[n]=t.map(function(t,e){return 0===n?0:P(i[n-1][e])+(c-P(r[n-1][e]&&r[n-1][e].offsetHeight))}),c=t.reduce(function(t,e){return Math.max(t,e.offsetHeight)},0),i},[]),s=r,l=Math.max.apply(Math,s.reduce(function(i,t){return t.forEach(function(t,e){return i[e]=(i[e]||0)+t.offsetHeight}),i},[]))+(e=this.$el,i=this.margin,n=L(e.children),P((o=n.filter(function(t){return Te(t,i)})[0])?De(o,"marginTop"):De(n[0],"paddingLeft"))*(r.length-1))}return{rows:r,translates:h,height:!a&&l}},write:function(t){var e=t.stacks,i=t.height;Ee(this.$el,this.clsStack,e),De(this.$el,"paddingBottom",this.parallax),!1!==i&&De(this.$el,"height",i)},events:["load","resize"]},{read:function(t){var e=t.height;return{scrolled:!!this.parallax&&li(this.$el,e?e-ti(this.$el):0)*this.parallax}},write:function(t){var e=t.rows,n=t.scrolled,r=t.translates;(!1!==n||r)&&e.forEach(function(t,i){return t.forEach(function(t,e){return De(t,"transform",n||r?"translateY("+((r&&-r[i][e])+(n?e%2?n:n/8:0))+"px)":"")})})},events:["scroll","load","resize"]}]};var rn=Tt?{data:{selMinHeight:!1,forceHeight:!1},computed:{elements:function(t,e){var i=t.selMinHeight;return i?ye(i,e):[e]}},update:[{read:function(){De(this.elements,"height","")},order:-5,events:["load","resize"]},{write:function(){var i=this;this.elements.forEach(function(t){var e=P(De(t,"minHeight"));e&&(i.forceHeight||Math.round(e+ni("height",t,"content-box"))>=t.offsetHeight)&&De(t,"height",e)})},order:5,events:["load","resize"]}]}:{},on={mixins:[rn],args:"target",props:{target:String,row:Boolean},data:{target:"> *",row:!0,forceHeight:!0},computed:{elements:function(t,e){return ye(t.target,e)}},update:{read:function(){return{rows:(this.row?tn(this.elements):[this.elements]).map(sn)}},write:function(t){t.rows.forEach(function(t){var i=t.heights;return t.elements.forEach(function(t,e){return De(t,"minHeight",i[e])})})},events:["load","resize"]}};function sn(t){var e;if(t.length<2)return{heights:[""],elements:t};var i=an(t),n=i.heights,r=i.max,o=t.some(function(t){return t.style.minHeight}),s=t.some(function(t,e){return!t.style.minHeight&&n[e]<r});return o&&s&&(De(t,"minHeight",""),e=an(t),n=e.heights,r=e.max),{heights:n=t.map(function(t,e){return n[e]===r&&P(t.style.minHeight).toFixed(2)!==r.toFixed(2)?"":r}),elements:t}}function an(t){var e=t.map(function(t){return Je(t).height-ni("height",t,"content-box")});return{heights:e,max:Math.max.apply(null,e)}}var hn={mixins:[rn],props:{expand:Boolean,offsetTop:Boolean,offsetBottom:Boolean,minHeight:Number},data:{expand:!1,offsetTop:!1,offsetBottom:!1,minHeight:0},update:{read:function(){var t="",e=ni("height",this.$el,"content-box");if(this.expand)t=ti(window)-(ln(document.documentElement)-ln(this.$el))-e||"";else{if(t="calc(100vh",this.offsetTop){var i=Je(this.$el).top;t+=i<ti(window)/2?" - "+i+"px":""}!0===this.offsetBottom?t+=" - "+ln(this.$el.nextElementSibling)+"px":D(this.offsetBottom)?t+=" - "+this.offsetBottom+"vh":this.offsetBottom&&u(this.offsetBottom,"px")?t+=" - "+P(this.offsetBottom)+"px":_(this.offsetBottom)&&(t+=" - "+ln(it(this.offsetBottom,this.$el))+"px"),t+=(e?" - "+e+"px":"")+")"}return{minHeight:t}},write:function(t){var e=t.minHeight;De(this.$el,{minHeight:e}),this.minHeight&&P(De(this.$el,"minHeight"))<this.minHeight&&De(this.$el,"minHeight",this.minHeight)},events:["load","resize"]}};function ln(t){return t&&t.offsetHeight||0}var cn={},un={args:"src",props:{id:String,icon:String,src:String,style:String,width:Number,height:Number,ratio:Number,class:String},data:{ratio:1,id:!1,exclude:["ratio","src","icon"],class:""},connected:function(){var t,h=this;if(this.class+=" uk-svg",!this.icon&&b(this.src,"#")){var e=this.src.split("#");1<e.length&&(t=e,this.src=t[0],this.icon=t[1])}this.svg=this.getSvg().then(function(t){var e;if(!(e=_(t)?(h.icon&&b(t,"<symbol")&&(t=function(t,e){if(!fn[t]){var i;for(fn[t]={};i=dn.exec(t);)fn[t][i[3]]='<svg xmlns="http://www.w3.org/2000/svg"'+i[1]+"svg>";dn.lastIndex=0}return fn[t][e]}(t,h.icon)||t),be(t.substr(t.indexOf("<svg")))):t.cloneNode(!0)))return Ut.reject("SVG not found.");var i=Z(e,"viewBox");for(var n in i&&(i=i.split(" "),h.width=h.$props.width||i[2],h.height=h.$props.height||i[3]),h.width*=h.ratio,h.height*=h.ratio,h.$options.props)h[n]&&!b(h.exclude,n)&&Z(e,n,h[n]);h.id||tt(e,"id"),h.width&&!h.height&&tt(e,"height"),h.height&&!h.width&&tt(e,"width");var r=h.icon||h.src;Z(e,"data-svg",r);var o=h.$el;if(yt(o)||"CANVAS"===o.tagName){Z(o,{hidden:!0,id:null});var s=o.nextElementSibling;r===Z(s,"data-svg")?e=s:le(o,e)}else{var a=o.lastElementChild;r===Z(a,"data-svg")?e=a:ae(o,e)}return h.svgEl=e},X)},disconnected:function(){var e=this;yt(this.$el)&&Z(this.$el,{hidden:null,id:this.id||null}),this.svg&&this.svg.then(function(t){return(!e._connected||t!==e.svgEl)&&ue(t)},X),this.svg=this.svgEl=null},methods:{getSvg:function(){var i=this;return this.src?(cn[this.src]||(cn[this.src]=new Ut(function(e,t){v(i.src,"data:")?e(decodeURIComponent(i.src.split(",")[1])):Qt(i.src).then(function(t){return e(t.response)},function(){return t("SVG not found.")})})),cn[this.src]):Ut.reject()}}},dn=/<symbol(.*?id=(['"])(.*?)\2[^]*?<\/)symbol>/g,fn={};var pn={},mn={spinner:'<svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" cx="15" cy="15" r="14"/></svg>',totop:'<svg width="18" height="10" viewBox="0 0 18 10" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="1 9 9 1 17 9 "/></svg>',marker:'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="4" width="1" height="11"/><rect x="4" y="9" width="11" height="1"/></svg>',"close-icon":'<svg width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" stroke-width="1.1" x1="1" y1="1" x2="13" y2="13"/><line fill="none" stroke="#000" stroke-width="1.1" x1="13" y1="1" x2="1" y2="13"/></svg>',"close-large":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><line fill="none" stroke="#000" stroke-width="1.4" x1="1" y1="1" x2="19" y2="19"/><line fill="none" stroke="#000" stroke-width="1.4" x1="19" y1="1" x2="1" y2="19"/></svg>',"navbar-toggle-icon":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect y="9" width="20" height="2"/><rect y="3" width="20" height="2"/><rect y="15" width="20" height="2"/></svg>',"overlay-icon":'<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect x="19" y="0" width="1" height="40"/><rect x="0" y="19" width="40" height="1"/></svg>',"pagination-next":'<svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="1 1 6 6 1 11"/></svg>',"pagination-previous":'<svg width="7" height="12" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.2" points="6 1 1 6 6 11"/></svg>',"search-icon":'<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="9" cy="9" r="7"/><path fill="none" stroke="#000" stroke-width="1.1" d="M14,14 L18,18 L14,14 Z"/></svg>',"search-large":'<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.8" cx="17.5" cy="17.5" r="16.5"/><line fill="none" stroke="#000" stroke-width="1.8" x1="38" y1="39" x2="29" y2="30"/></svg>',"search-navbar":'<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle fill="none" stroke="#000" stroke-width="1.1" cx="10.5" cy="10.5" r="9.5"/><line fill="none" stroke="#000" stroke-width="1.1" x1="23" y1="23" x2="17" y2="17"/></svg>',"slidenav-next":'<svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.4" points="1.225,23 12.775,12 1.225,1 "/></svg>',"slidenav-next-large":'<svg width="25px" height="40px" viewBox="0 0 25 40" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="2" points="4.002,38.547 22.527,20.024 4,1.5 "/></svg>',"slidenav-previous":'<svg width="14px" height="24px" viewBox="0 0 14 24" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="1.4" points="12.775,1 1.225,12 12.775,23 "/></svg>',"slidenav-previous-large":'<svg width="25px" height="40px" viewBox="0 0 25 40" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" stroke-width="2" points="20.527,1.5 2,20.024 20.525,38.547 "/></svg>'},gn={install:function(r){r.icon.add=function(t,e){var i,n=_(t)?((i={})[t]=e,i):t;R(n,function(t,e){mn[e]=t,delete pn[e]}),r._initialized&&we(document.body,function(t){return R(r.getComponents(t),function(t){return t.$options.isIcon&&t.icon in n&&t.$reset()})})}},attrs:["icon","ratio"],mixins:[Fi,un],args:"icon",props:["icon"],data:{exclude:["id","style","class","src","icon","ratio"]},isIcon:!0,connected:function(){ke(this.$el,"uk-icon")},methods:{getSvg:function(){var t,e=function(t){if(!mn[t])return null;pn[t]||(pn[t]=be(mn[t].trim()));return pn[t]}((t=this.icon,Et?V(V(t,"left","right"),"previous","next"):t));return e?Ut.resolve(e):Ut.reject("Icon not found.")}}},vn={extends:gn,data:function(t){return{icon:m(t.constructor.options.name)}}},wn={extends:vn,connected:function(){ke(this.$el,"uk-slidenav")},computed:{icon:function(t,e){var i=t.icon;return Te(e,"uk-slidenav-large")?i+"-large":i}}},bn={extends:vn,computed:{icon:function(t,e){var i=t.icon;return Te(e,"uk-search-icon")&&gt(e,".uk-search-large").length?"search-large":gt(e,".uk-search-navbar").length?"search-navbar":i}}},yn={extends:vn,computed:{icon:function(){return"close-"+(Te(this.$el,"uk-close-large")?"large":"icon")}}},xn={extends:vn,connected:function(){var e=this;this.svg.then(function(t){return 1!==e.ratio&&De(be("circle",t),"strokeWidth",1/e.ratio)},X)}};var kn={props:{dataSrc:String,dataSrcset:Boolean,sizes:String,width:Number,height:Number,offsetTop:String,offsetLeft:String,target:String},data:{dataSrc:"",dataSrcset:!1,sizes:!1,width:!1,height:!1,offsetTop:"50vh",offsetLeft:0,target:!1},computed:{cacheKey:function(t){var e=t.dataSrc;return this.$name+"."+e},width:function(t){var e=t.width,i=t.dataWidth;return e||i},height:function(t){var e=t.height,i=t.dataHeight;return e||i},sizes:function(t){var e=t.sizes,i=t.dataSizes;return e||i},isImg:function(t,e){return Mn(e)},target:function(t){var e=t.target;return[this.$el].concat(nt(e,this.$el))},offsetTop:function(t){return Cn(t.offsetTop,"height")},offsetLeft:function(t){return Cn(t.offsetLeft,"width")}},connected:function(){On[this.cacheKey]?$n(this.$el,On[this.cacheKey]||this.dataSrc,this.dataSrcset,this.sizes):this.isImg&&this.width&&this.height&&$n(this.$el,function(t,e,i){var n;i&&(n=J.ratio({width:t,height:e},"width",Cn(Sn(i))),t=n.width,e=n.height);return'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'+t+'" height="'+e+'"></svg>'}(this.width,this.height,this.sizes))},update:{read:function(t){var e=this,i=t.update,n=t.image;if(i)if(!n&&this.target.some(function(t){return hi(t,e.offsetTop,e.offsetLeft)})){if(!this.$el.src||!xt(this.$el)||ti(this.$el))return{image:te(this.dataSrc,this.dataSrcset,this.sizes).then(function(t){return $n(e.$el,Dn(t),t.srcset,t.sizes),On[e.cacheKey]=Dn(t),t},X)}}else!this.isImg&&n&&n.then(function(t){return t&&""!==t.currentSrc&&$n(e.$el,Dn(t))})},write:function(t){if(!t.update)return this.$emit(),t.update=!0;if(!this.isImg&&this.dataSrcset&&1!==window.devicePixelRatio){var e=De(this.$el,"backgroundSize");"auto"!==e&&P(e)!==t.bgSize||(t.bgSize=(i=this.dataSrcset,n=this.sizes,r=Cn(Sn(n)),(o=(i.match(An)||[]).map(P).sort(function(t,e){return t-e})).filter(function(t){return r<t})[0]||o.pop()||""),De(this.$el,"backgroundSize",t.bgSize+"px"))}var i,n,r,o},events:["scroll","load","resize"]}};function $n(t,e,i,n){if(Mn(t))n&&(t.sizes=n),i&&(t.srcset=i),e&&(t.src=e);else if(e){!b(t.style.backgroundImage,e)&&(De(t,"backgroundImage","url("+wt(e)+")"),Lt(t,jt("load",!1)))}}var In=/\s*(.*?)\s*(\w+|calc\(.*?\))\s*(?:,|$)/g;function Sn(t){var e,i;for(In.lastIndex=0;e=In.exec(t);)if(!e[1]||window.matchMedia(e[1]).matches){e=v(i=e[2],"calc")?i.substring(5,i.length-1).replace(Tn,function(t){return Cn(t)}).replace(/ /g,"").match(En).reduce(function(t,e){return t+ +e},0):i;break}return e}var Tn=/\d+(?:\w+|%)/g,En=/[+-]?(\d+)/g;function Cn(t,e,i){return void 0===e&&(e="width"),void 0===i&&(i=window),D(t=t||"100vw")?+t:u(t,"vw")?_n(i,"width",t):u(t,"vh")?_n(i,"height",t):u(t,"%")?_n(i,e,t):P(t)}var An=/\s+\d+w\s*(?:,|$)/g;var Nn={height:ti,width:ei};function _n(t,e,i){return Nn[e](t)*P(i)/100}function Mn(t){return"IMG"===t.tagName}function Dn(t){return t.currentSrc||t.src}var On,Bn="__test__";try{(On=window.sessionStorage||{})[Bn]=1,delete On[Bn]}catch(t){On={}}var zn={props:{media:Boolean},data:{media:!1},computed:{matchMedia:function(){var t=function(t){if(_(t))if("@"===t[0]){var e="breakpoint-"+t.substr(1);t=P(Pe(e))}else if(isNaN(t))return t;return!(!t||isNaN(t))&&"(min-width: "+t+"px)"}(this.media);return!t||window.matchMedia(t).matches}}};var Pn,Hn,Fn={mixins:[Fi,zn],props:{fill:String},data:{fill:"",clsWrapper:"uk-leader-fill",clsHide:"uk-leader-hide",attrFill:"data-fill"},computed:{fill:function(t){return t.fill||Pe("leader-fill-content")}},connected:function(){var t;t=fe(this.$el,'<span class="'+this.clsWrapper+'">'),this.wrapper=t[0]},disconnected:function(){pe(this.wrapper.childNodes)},update:{read:function(t){var e=t.changed,i=t.width,n=i;return{width:i=Math.floor(this.$el.offsetWidth/2),changed:e||n!==i,hide:!this.matchMedia}},write:function(t){Ee(this.wrapper,this.clsHide,t.hide),t.changed&&(t.changed=!1,Z(this.wrapper,this.attrFill,new Array(t.width).join(this.fill)))},events:["load","resize"]}},Ln={props:{container:Boolean},data:{container:!0},computed:{container:function(t){var e=t.container;return!0===e&&this.$container||e&&be(e)}}},jn={mixins:[Fi,Ln,Li],props:{selPanel:String,selClose:String,escClose:Boolean,bgClose:Boolean,stack:Boolean},data:{cls:"uk-open",escClose:!0,bgClose:!0,overlay:!0,stack:!1},computed:{panel:function(t,e){return be(t.selPanel,e)},transitionElement:function(){return this.panel},bgClose:function(t){return t.bgClose&&this.panel}},beforeDisconnect:function(){this.isToggled()&&this.toggleNow(this.$el,!1)},events:[{name:"click",delegate:function(){return this.selClose},handler:function(t){t.preventDefault(),this.hide()}},{name:"toggle",self:!0,handler:function(t){t.defaultPrevented||(t.preventDefault(),this.toggle())}},{name:"beforeshow",self:!0,handler:function(t){var i=Pn&&Pn!==this&&Pn;Pn=this,i?this.stack?this.prev=i:((Pn=i).isToggled()?i.hide().then(this.show):Ft(i.$el,"beforeshow hidden",this.show,!1,function(t){var e=t.target;return"hidden"===t.type&&e===i.$el}),t.preventDefault()):function(){if(Hn)return;Hn=[Pt(document,Dt,function(t){var e=t.target,i=t.defaultPrevented;!Pn||!Pn.bgClose||i||Pn.overlay&&!St(e,Pn.$el)||St(e,Pn.panel)||Pn.hide()}),Pt(document,"keydown",function(t){27===t.keyCode&&Pn&&Pn.escClose&&(t.preventDefault(),Pn.hide())})]}()}},{name:"show",self:!0,handler:function(){Te(document.documentElement,this.clsPage)||(this.scrollbarWidth=ei(window)-ei(document),De(document.body,"overflowY",this.scrollbarWidth&&this.overlay?"scroll":"")),ke(document.documentElement,this.clsPage)}},{name:"hide",self:!0,handler:function(){Pn&&(Pn!==this||this.prev)||(Hn&&Hn.forEach(function(t){return t()}),Hn=null)}},{name:"hidden",self:!0,handler:function(){var t,e=this.prev;if(Pn=Pn&&Pn!==this&&Pn||e)for(;e;){if(e.clsPage===this.clsPage){t=!0;break}e=e.prev}else De(document.body,"overflowY","");t||$e(document.documentElement,this.clsPage)}}],methods:{toggle:function(){return this.isToggled()?this.hide():this.show()},show:function(){var e=this;return this.isToggled()?Ut.resolve():this.container&&this.$el.parentNode!==this.container?(ae(this.container,this.$el),new Ut(function(t){return requestAnimationFrame(function(){return e.show().then(t)})})):this.toggleElement(this.$el,!0,Wn(this))},hide:function(){return this.isToggled()?this.toggleElement(this.$el,!1,Wn(this)):Ut.resolve()},getActive:function(){return Pn}}};function Wn(t){var r=t.transitionElement,o=t._toggle;return function(i,n){return new Ut(function(t,e){return Ft(i,"show hide",function(){i._reject&&i._reject(),i._reject=e,o(i,n),W(De(r,"transitionDuration"))?Ft(r,"transitionend",t,!1,function(t){return t.target===r}):t()})})}}var Vn={install:function(a){a.modal.dialog=function(t,e){var n=a.modal(' <div class="uk-modal"> <div class="uk-modal-dialog">'+t+"</div> </div> ",e);return n.show(),Pt(n.$el,"hidden",function(t){var e=t.target,i=t.currentTarget;e===i&&Ut.resolve(function(){return n.$destroy(!0)})}),n},a.modal.alert=function(e,i){return i=Y({bgClose:!1,escClose:!1,labels:a.modal.labels},i),new Ut(function(t){return Pt(a.modal.dialog(' <div class="uk-modal-body">'+(_(e)?e:se(e))+'</div> <div class="uk-modal-footer uk-text-right"> <button class="uk-button uk-button-primary uk-modal-close" autofocus>'+i.labels.ok+"</button> </div> ",i).$el,"hide",t)})},a.modal.confirm=function(r,o){return o=Y({bgClose:!1,escClose:!0,labels:a.modal.labels},o),new Ut(function(e,t){var i=a.modal.dialog(' <form> <div class="uk-modal-body">'+(_(r)?r:se(r))+'</div> <div class="uk-modal-footer uk-text-right"> <button class="uk-button uk-button-default uk-modal-close" type="button">'+o.labels.cancel+'</button> <button class="uk-button uk-button-primary" autofocus>'+o.labels.ok+"</button> </div> </form> ",o),n=!1;Pt(i.$el,"submit","form",function(t){t.preventDefault(),e(),n=!0,i.hide()}),Pt(i.$el,"hide",function(){n||t()})})},a.modal.prompt=function(t,o,s){return s=Y({bgClose:!1,escClose:!0,labels:a.modal.labels},s),new Ut(function(e){var i=a.modal.dialog(' <form class="uk-form-stacked"> <div class="uk-modal-body"> <label>'+(_(t)?t:se(t))+'</label> <input class="uk-input" autofocus> </div> <div class="uk-modal-footer uk-text-right"> <button class="uk-button uk-button-default uk-modal-close" type="button">'+s.labels.cancel+'</button> <button class="uk-button uk-button-primary">'+s.labels.ok+"</button> </div> </form> ",s),n=be("input",i.$el);n.value=o;var r=!1;Pt(i.$el,"submit","form",function(t){t.preventDefault(),e(n.value),r=!0,i.hide()}),Pt(i.$el,"hide",function(){r||e(null)})})},a.modal.labels={ok:"Ok",cancel:"Cancel"}},mixins:[jn],data:{clsPage:"uk-modal-page",selPanel:".uk-modal-dialog",selClose:".uk-modal-close, .uk-modal-close-default, .uk-modal-close-outside, .uk-modal-close-full"},events:[{name:"show",self:!0,handler:function(){Te(this.panel,"uk-margin-auto-vertical")?ke(this.$el,"uk-flex"):De(this.$el,"display","block"),ti(this.$el)}},{name:"hidden",self:!0,handler:function(){De(this.$el,"display",""),$e(this.$el,"uk-flex")}}]};var Yn={extends:ji,data:{targets:"> .uk-parent",toggle:"> a",content:"> ul"}},Rn={mixins:[Fi,rn],props:{dropdown:String,mode:"list",align:String,offset:Number,boundary:Boolean,boundaryAlign:Boolean,clsDrop:String,delayShow:Number,delayHide:Number,dropbar:Boolean,dropbarMode:String,dropbarAnchor:Boolean,duration:Number},data:{dropdown:".uk-navbar-nav > li",align:Et?"right":"left",clsDrop:"uk-navbar-dropdown",mode:void 0,offset:void 0,delayShow:void 0,delayHide:void 0,boundaryAlign:void 0,flip:"x",boundary:!0,dropbar:!1,dropbarMode:"slide",dropbarAnchor:!1,duration:200,forceHeight:!0,selMinHeight:".uk-navbar-nav > li > a, .uk-navbar-item, .uk-navbar-toggle"},computed:{boundary:function(t,e){var i=t.boundary,n=t.boundaryAlign;return!0===i||n?e:i},dropbarAnchor:function(t,e){return it(t.dropbarAnchor,e)},pos:function(t){return"bottom-"+t.align},dropdowns:function(t,e){return ye(t.dropdown+" ."+t.clsDrop,e)}},beforeConnect:function(){var t=this.$props.dropbar;this.dropbar=t&&(it(t,this.$el)||be("+ .uk-navbar-dropbar",this.$el)||be("<div></div>")),this.dropbar&&(ke(this.dropbar,"uk-navbar-dropbar"),"slide"===this.dropbarMode&&ke(this.dropbar,"uk-navbar-dropbar-slide"))},disconnected:function(){this.dropbar&&ue(this.dropbar)},update:function(){var e=this;this.$create("drop",this.dropdowns.filter(function(t){return!e.getDropdown(t)}),Y({},this.$props,{boundary:this.boundary,pos:this.pos,offset:this.dropbar||this.offset}))},events:[{name:"mouseover",delegate:function(){return this.dropdown},handler:function(t){var e=t.current,i=this.getActive();i&&i.toggle&&!St(i.toggle.$el,e)&&!i.tracker.movesTo(i.$el)&&i.hide(!1)}},{name:"mouseleave",el:function(){return this.dropbar},handler:function(){var t=this.getActive();t&&!ft(this.dropbar,":hover")&&t.hide()}},{name:"beforeshow",capture:!0,filter:function(){return this.dropbar},handler:function(){this.dropbar.parentNode||le(this.dropbarAnchor||this.$el,this.dropbar)}},{name:"show",capture:!0,filter:function(){return this.dropbar},handler:function(t,e){var i=e.$el,n=e.dir;this.clsDrop&&ke(i,this.clsDrop+"-dropbar"),"bottom"===n&&this.transitionTo(i.offsetHeight+P(De(i,"marginTop"))+P(De(i,"marginBottom")),i)}},{name:"beforehide",filter:function(){return this.dropbar},handler:function(t,e){var i=e.$el,n=this.getActive();ft(this.dropbar,":hover")&&n&&n.$el===i&&t.preventDefault()}},{name:"hide",filter:function(){return this.dropbar},handler:function(t,e){var i=e.$el,n=this.getActive();(!n||n&&n.$el===i)&&this.transitionTo(0)}}],methods:{getActive:function(){var t=this.dropdowns.map(this.getDropdown).filter(function(t){return t&&t.isActive()})[0];return t&&b(t.mode,"hover")&&St(t.toggle.$el,this.$el)&&t},transitionTo:function(t,e){var i=this,n=this.dropbar,r=xt(n)?ti(n):0;return De(e=r<t&&e,"clip","rect(0,"+e.offsetWidth+"px,"+r+"px,0)"),ti(n,r),Ve.cancel([e,n]),Ut.all([Ve.start(n,{height:t},this.duration),Ve.start(e,{clip:"rect(0,"+e.offsetWidth+"px,"+t+"px,0)"},this.duration)]).catch(X).then(function(){De(e,{clip:""}),i.$update(n)})},getDropdown:function(t){return this.$getComponent(t,"drop")||this.$getComponent(t,"dropdown")}}},qn={mixins:[jn],args:"mode",props:{mode:String,flip:Boolean,overlay:Boolean},data:{mode:"slide",flip:!1,overlay:!1,clsPage:"uk-offcanvas-page",clsContainer:"uk-offcanvas-container",selPanel:".uk-offcanvas-bar",clsFlip:"uk-offcanvas-flip",clsContainerAnimation:"uk-offcanvas-container-animation",clsSidebarAnimation:"uk-offcanvas-bar-animation",clsMode:"uk-offcanvas",clsOverlay:"uk-offcanvas-overlay",selClose:".uk-offcanvas-close"},computed:{clsFlip:function(t){var e=t.flip,i=t.clsFlip;return e?i:""},clsOverlay:function(t){var e=t.overlay,i=t.clsOverlay;return e?i:""},clsMode:function(t){var e=t.mode;return t.clsMode+"-"+e},clsSidebarAnimation:function(t){var e=t.mode,i=t.clsSidebarAnimation;return"none"===e||"reveal"===e?"":i},clsContainerAnimation:function(t){var e=t.mode,i=t.clsContainerAnimation;return"push"!==e&&"reveal"!==e?"":i},transitionElement:function(t){return"reveal"===t.mode?this.panel.parentNode:this.panel}},events:[{name:"click",delegate:function(){return'a[href^="#"]'},handler:function(t){var e=t.current;e.hash&&be(e.hash,document.body)&&this.hide()}},{name:"touchstart",el:function(){return this.panel},handler:function(t){var e=t.targetTouches;1===e.length&&(this.clientY=e[0].clientY)}},{name:"touchmove",self:!0,passive:!1,filter:function(){return this.overlay},handler:function(t){t.preventDefault()}},{name:"touchmove",passive:!1,el:function(){return this.panel},handler:function(t){if(1===t.targetTouches.length){var e=event.targetTouches[0].clientY-this.clientY,i=this.panel,n=i.scrollTop,r=i.scrollHeight,o=i.clientHeight;(r<=o||0===n&&0<e||r-n<=o&&e<0)&&t.preventDefault()}}},{name:"show",self:!0,handler:function(){"reveal"!==this.mode||Te(this.panel.parentNode,this.clsMode)||(de(this.panel,"<div>"),ke(this.panel.parentNode,this.clsMode)),De(document.documentElement,"overflowY",this.overlay?"hidden":""),ke(document.body,this.clsContainer,this.clsFlip),De(this.$el,"display","block"),ke(this.$el,this.clsOverlay),ke(this.panel,this.clsSidebarAnimation,"reveal"!==this.mode?this.clsMode:""),ti(document.body),ke(document.body,this.clsContainerAnimation),this.clsContainerAnimation&&(Un().content+=",user-scalable=0")}},{name:"hide",self:!0,handler:function(){$e(document.body,this.clsContainerAnimation);var t=this.getActive();("none"===this.mode||t&&t!==this&&t!==this.prev)&&Lt(this.panel,"transitionend")}},{name:"hidden",self:!0,handler:function(){var t;this.clsContainerAnimation&&((t=Un()).content=t.content.replace(/,user-scalable=0$/,"")),"reveal"===this.mode&&pe(this.panel),$e(this.panel,this.clsSidebarAnimation,this.clsMode),$e(this.$el,this.clsOverlay),De(this.$el,"display",""),$e(document.body,this.clsContainer,this.clsFlip),De(document.documentElement,"overflowY","")}},{name:"swipeLeft swipeRight",handler:function(t){this.isToggled()&&_i(t)&&"swipeLeft"===t.type^this.flip&&this.hide()}}]};function Un(){return be('meta[name="viewport"]',document.head)||ae(document.head,'<meta name="viewport">')}var Xn={mixins:[Fi],props:{selContainer:String,selContent:String},data:{selContainer:".uk-modal",selContent:".uk-modal-dialog"},computed:{container:function(t,e){return mt(e,t.selContainer)},content:function(t,e){return mt(e,t.selContent)}},connected:function(){De(this.$el,"minHeight",150)},update:{read:function(){return!(!this.content||!this.container)&&{current:P(De(this.$el,"maxHeight")),max:Math.max(150,ti(this.container)-(Je(this.content).height-ti(this.$el)))}},write:function(t){var e=t.current,i=t.max;De(this.$el,"maxHeight",i),Math.round(e)!==Math.round(i)&&Lt(this.$el,"resize")},events:["load","resize"]}},Kn={props:["width","height"],connected:function(){ke(this.$el,"uk-responsive-width")},update:{read:function(){return!!(xt(this.$el)&&this.width&&this.height)&&{width:ei(this.$el.parentNode),height:this.height}},write:function(t){ti(this.$el,J.contain({height:this.height,width:this.width},t).height)},events:["load","resize"]}},Gn={props:{duration:Number,offset:Number},data:{duration:1e3,offset:0},methods:{scrollTo:function(i){var n=this;i=i&&be(i)||document.body;var t=ti(document),e=ti(window),r=Je(i).top-this.offset;if(t<r+e&&(r=t-e),Lt(this.$el,"beforescroll",[this,i])){var o=Date.now(),s=window.pageYOffset,a=function(){var t,e=s+(r-s)*(t=U((Date.now()-o)/n.duration),.5*(1-Math.cos(Math.PI*t)));ci(window,e),e!==r?requestAnimationFrame(a):Lt(n.$el,"scrolled",[n,i])};a()}}},events:{click:function(t){t.defaultPrevented||(t.preventDefault(),this.scrollTo(wt(decodeURIComponent(this.$el.hash)).substr(1)))}}};var Jn={args:"cls",props:{cls:"list",target:String,hidden:Boolean,offsetTop:Number,offsetLeft:Number,repeat:Boolean,delay:Number},data:function(){return{cls:[],target:!1,hidden:!0,offsetTop:0,offsetLeft:0,repeat:!1,delay:0,inViewClass:"uk-scrollspy-inview"}},computed:{elements:function(t,e){var i=t.target;return i?ye(i,e):[e]}},update:[{write:function(){this.hidden&&De(It(this.elements,":not(."+this.inViewClass+")"),"visibility","hidden")}},{read:function(r){var o=this;r.update&&this.elements.forEach(function(t,e){var i=r[e];if(!i||i.el!==t){var n=et(t,"uk-scrollspy-class");i={el:t,toggles:n&&n.split(",")||o.cls}}i.show=hi(t,o.offsetTop,o.offsetLeft),r[e]=i})},write:function(o){var s=this;if(!o.update)return this.$emit(),o.update=!0;this.elements.forEach(function(t,e){var i=o[e],n=i.toggles[e]||i.toggles[0];if(!i.show||i.inview||i.queued){if(!i.show&&(i.inview||i.queued)&&s.repeat){if(i.abort&&i.abort(),!i.inview)return;De(t,"visibility",s.hidden?"hidden":""),$e(t,s.inViewClass),Ee(t,n),Lt(t,"outview"),s.$update(t),i.inview=!1}}else{var r=function(){De(t,"visibility",""),ke(t,s.inViewClass),Ee(t,n),Lt(t,"inview"),s.$update(t),i.inview=!0,i.abort&&i.abort()};s.delay?(i.queued=!0,o.promise=(o.promise||Ut.resolve()).then(function(){return!i.inview&&new Ut(function(t){var e=setTimeout(function(){r(),t()},o.promise||1===s.elements.length?s.delay:0);i.abort=function(){clearTimeout(e),t(),i.queued=!1}})})):r()}})},events:["scroll","load","resize"]}]},Zn={props:{cls:String,closest:String,scroll:Boolean,overflow:Boolean,offset:Number},data:{cls:"uk-active",closest:!1,scroll:!1,overflow:!0,offset:0},computed:{links:function(t,e){return ye('a[href^="#"]',e).filter(function(t){return t.hash})},elements:function(){return this.closest?mt(this.links,this.closest):this.links},targets:function(){return ye(this.links.map(function(t){return t.hash}).join(","))}},update:[{read:function(){this.scroll&&this.$create("scroll",this.links,{offset:this.offset||0})}},{read:function(o){var s=this,a=window.pageYOffset+this.offset+1,h=ti(document)-ti(window)+this.offset;o.active=!1,this.targets.every(function(t,e){var i=Je(t).top,n=e+1===s.targets.length;if(!s.overflow&&(0===e&&a<i||n&&i+t.offsetTop<a))return!1;if(!n&&Je(s.targets[e+1]).top<=a)return!0;if(h<=a)for(var r=s.targets.length-1;e<r;r--)if(hi(s.targets[r])){t=s.targets[r];break}return!(o.active=be(It(s.links,'[href="#'+t.id+'"]')))})},write:function(t){var e=t.active;this.links.forEach(function(t){return t.blur()}),$e(this.elements,this.cls),e&&Lt(this.$el,"active",[e,ke(this.closest?mt(e,this.closest):e,this.cls)])},events:["scroll","load","resize"]}]},Qn={mixins:[Fi,zn],props:{top:null,bottom:Boolean,offset:Number,animation:String,clsActive:String,clsInactive:String,clsFixed:String,clsBelow:String,selTarget:String,widthElement:Boolean,showOnUp:Boolean,targetOffset:Number},data:{top:0,bottom:!1,offset:0,animation:"",clsActive:"uk-active",clsInactive:"",clsFixed:"uk-sticky-fixed",clsBelow:"uk-sticky-below",selTarget:"",widthElement:!1,showOnUp:!1,targetOffset:!1},computed:{selTarget:function(t,e){var i=t.selTarget;return i&&be(i,e)||e},widthElement:function(t,e){return it(t.widthElement,e)||this.placeholder},isActive:{get:function(){return Te(this.selTarget,this.clsActive)},set:function(t){t&&!this.isActive?(Se(this.selTarget,this.clsInactive,this.clsActive),Lt(this.$el,"active")):t||Te(this.selTarget,this.clsInactive)||(Se(this.selTarget,this.clsActive,this.clsInactive),Lt(this.$el,"inactive"))}}},connected:function(){this.placeholder=be("+ .uk-sticky-placeholder",this.$el)||be('<div class="uk-sticky-placeholder"></div>'),this.isFixed=!1,this.isActive=!1},disconnected:function(){this.isFixed&&(this.hide(),$e(this.selTarget,this.clsInactive)),ue(this.placeholder),this.placeholder=null,this.widthElement=null},events:[{name:"load hashchange popstate",el:window,handler:function(){var n=this;if(!1!==this.targetOffset&&location.hash&&0<window.pageYOffset){var r=be(location.hash);r&&pi.read(function(){var t=Je(r).top,e=Je(n.$el).top,i=n.$el.offsetHeight;n.isFixed&&t<=e+i&&e<=t+r.offsetHeight&&ci(window,t-i-(D(n.targetOffset)?n.targetOffset:0)-n.offset)})}}}],update:[{read:function(t,e){var i=t.height,n=e.type;this.isActive&&"update"!==n&&(this.hide(),i=this.$el.offsetHeight,this.show()),i=this.isActive?i:this.$el.offsetHeight,this.topOffset=Je(this.isFixed?this.placeholder:this.$el).top,this.bottomOffset=this.topOffset+i;var r=tr("bottom",this);return this.top=Math.max(P(tr("top",this)),this.topOffset)-this.offset,this.bottom=r&&r-i,this.inactive=!this.matchMedia,{lastScroll:!1,height:i,margins:De(this.$el,["marginTop","marginBottom","marginLeft","marginRight"])}},write:function(t){var e=t.height,i=t.margins,n=this.placeholder;De(n,Y({height:e},i)),St(n,document)||(le(this.$el,n),Z(n,"hidden","")),this.isActive=this.isActive},events:["load","resize"]},{read:function(t,e){var i=e.scrollY;return void 0===i&&(i=window.pageYOffset),this.width=(xt(this.widthElement)?this.widthElement:this.$el).offsetWidth,{scroll:this.scroll=i,visible:xt(this.$el),top:ui(this.placeholder)[0]}},write:function(t,e){var i=this;void 0===e&&(e={});var n=e.dir,r=t.initTimestamp;void 0===r&&(r=0);var o=t.lastDir,s=t.lastScroll,a=t.scroll,h=t.top,l=t.visible,c=performance.now();if(!((t.lastScroll=a)<0||a===s||!l||this.disabled||this.showOnUp&&!n||((300<c-r||n!==o)&&(t.initScroll=a,t.initTimestamp=c),t.lastDir=n,this.showOnUp&&Math.abs(t.initScroll-a)<=30&&Math.abs(s-a)<=10)))if(this.inactive||a<this.top||this.showOnUp&&(a<=this.top||"down"===n||"up"===n&&!this.isFixed&&a<=this.bottomOffset)){if(!this.isFixed)return void(Xe.inProgress(this.$el)&&a<h&&(Xe.cancel(this.$el),this.hide()));this.isFixed=!1,this.animation&&a>this.topOffset?(Xe.cancel(this.$el),Xe.out(this.$el,this.animation).then(function(){return i.hide()},X)):this.hide()}else this.isFixed?this.update():this.animation?(Xe.cancel(this.$el),this.show(),Xe.in(this.$el,this.animation).catch(X)):this.show()},events:["load","resize","scroll"]}],methods:{show:function(){this.isFixed=!0,this.update(),Z(this.placeholder,"hidden",null)},hide:function(){this.isActive=!1,$e(this.$el,this.clsFixed,this.clsBelow),De(this.$el,{position:"",top:"",width:""}),Z(this.placeholder,"hidden","")},update:function(){var t=0!==this.top||this.scroll>this.top,e=Math.max(0,this.offset);this.bottom&&this.scroll>this.bottom-this.offset&&(e=this.bottom-this.scroll),De(this.$el,{position:"fixed",top:e+"px",width:this.width}),this.isActive=t,Ee(this.$el,this.clsBelow,this.scroll>this.bottomOffset),ke(this.$el,this.clsFixed)}}};function tr(t,e){var i=e.$props,n=e.$el,r=e[t+"Offset"],o=i[t];if(o){if(D(o))return r+P(o);if(_(o)&&o.match(/^-?\d+vh$/))return ti(window)*P(o)/100;var s=!0===o?n.parentNode:it(o,n);return s?Je(s).top+s.offsetHeight:void 0}}var er,ir={mixins:[Li],args:"connect",props:{connect:String,toggle:String,active:Number,swiping:Boolean},data:{connect:"~.uk-switcher",toggle:"> * > :first-child",active:0,swiping:!0,cls:"uk-active",clsContainer:"uk-switcher",attrItem:"uk-switcher-item",queued:!0},computed:{connects:function(t,e){return nt(t.connect,e)},toggles:function(t,e){return ye(t.toggle,e)}},events:[{name:"click",delegate:function(){return this.toggle+":not(.uk-disabled)"},handler:function(e){e.preventDefault(),this.show(L(this.$el.children).filter(function(t){return St(e.current,t)})[0])}},{name:"click",el:function(){return this.connects},delegate:function(){return"["+this.attrItem+"],[data-"+this.attrItem+"]"},handler:function(t){t.preventDefault(),this.show(et(t.current,this.attrItem))}},{name:"swipeRight swipeLeft",filter:function(){return this.swiping},el:function(){return this.connects},handler:function(t){_i(t)&&(t.preventDefault(),window.getSelection().toString()||this.show("swipeLeft"===t.type?"next":"previous"))}}],update:function(){var e=this;this.connects.forEach(function(t){return e.updateAria(t.children)});var t=this.$el.children;this.show(It(t,"."+this.cls)[0]||t[this.active]||t[0])},methods:{index:function(){return!!this.connects.length&&ne(It(this.connects[0].children,"."+this.cls)[0])},show:function(t){for(var e,i,n=this,r=this.$el.children,o=r.length,s=this.index(),a=0<=s,h="previous"===t?-1:1,l=re(t,r,s),c=0;c<o;c++,l=(l+h+o)%o)if(!ft(this.toggles[l],".uk-disabled *, .uk-disabled, [disabled]")){e=this.toggles[l],i=r[l];break}!i||0<=s&&Te(i,this.cls)||s===l||($e(r,this.cls),ke(i,this.cls),Z(this.toggles,"aria-expanded",!1),Z(e,"aria-expanded",!0),this.connects.forEach(function(t){a?n.toggleElement([t.children[s],t.children[l]]):n.toggleNow(t.children[l])}))}}},nr={mixins:[Fi],extends:ir,props:{media:Boolean},data:{media:960,attrItem:"uk-tab-item"},connected:function(){var t=Te(this.$el,"uk-tab-left")?"uk-tab-left":!!Te(this.$el,"uk-tab-right")&&"uk-tab-right";t&&this.$create("toggle",this.$el,{cls:t,mode:"media",media:this.media})}},rr={mixins:[zn,Li],args:"target",props:{href:String,target:null,mode:"list"},data:{href:!1,target:!1,mode:"click",queued:!0},computed:{target:function(t,e){var i=t.href,n=t.target;return(n=nt(n||i,e)).length&&n||[e]}},connected:function(){Lt(this.target,"updatearia",[this])},events:[{name:Ot+" "+Bt,filter:function(){return b(this.mode,"hover")},handler:function(t){_i(t)||this.toggle("toggle"+(t.type===Ot?"show":"hide"))}},{name:"click",filter:function(){return b(this.mode,"click")||Nt&&b(this.mode,"hover")},handler:function(t){var e;(_i(t)||b(this.mode,"click"))&&((mt(t.target,'a[href="#"], a[href=""], button')||(e=mt(t.target,"a[href]"))&&(this.cls||!xt(this.target)||e.hash&&ft(this.target,e.hash)))&&t.preventDefault(),this.toggle())}}],update:{write:function(){if(b(this.mode,"media")&&this.media){var t=this.isToggled(this.target);(this.matchMedia?!t:t)&&this.toggle()}},events:["load","resize"]},methods:{toggle:function(t){Lt(this.target,t||"toggle",[this])&&this.toggleElement(this.target)}}};Hi.version="3.0.2",(er=Hi).component("accordion",ji),er.component("alert",Wi),er.component("cover",Ui),er.component("drop",Ki),er.component("dropdown",Gi),er.component("formCustom",Ji),er.component("gif",Zi),er.component("grid",nn),er.component("heightMatch",on),er.component("heightViewport",hn),er.component("icon",gn),er.component("img",kn),er.component("leader",Fn),er.component("margin",Qi),er.component("modal",Vn),er.component("nav",Yn),er.component("navbar",Rn),er.component("offcanvas",qn),er.component("overflowAuto",Xn),er.component("responsive",Kn),er.component("scroll",Gn),er.component("scrollspy",Jn),er.component("scrollspyNav",Zn),er.component("sticky",Qn),er.component("svg",un),er.component("switcher",ir),er.component("tab",nr),er.component("toggle",rr),er.component("video",qi),er.component("close",yn),er.component("marker",vn),er.component("navbarToggleIcon",vn),er.component("overlayIcon",vn),er.component("paginationNext",vn),er.component("paginationPrevious",vn),er.component("searchIcon",bn),er.component("slidenavNext",wn),er.component("slidenavPrevious",wn),er.component("spinner",xn),er.component("totop",vn),er.use(Vi);var or={mixins:[Fi],props:{date:String,clsWrapper:String},data:{date:"",clsWrapper:".uk-countdown-%unit%"},computed:{date:function(t){var e=t.date;return Date.parse(e)},days:function(t,e){return be(t.clsWrapper.replace("%unit%","days"),e)},hours:function(t,e){return be(t.clsWrapper.replace("%unit%","hours"),e)},minutes:function(t,e){return be(t.clsWrapper.replace("%unit%","minutes"),e)},seconds:function(t,e){return be(t.clsWrapper.replace("%unit%","seconds"),e)},units:function(){var e=this;return["days","hours","minutes","seconds"].filter(function(t){return e[t]})}},connected:function(){this.start()},disconnected:function(){var e=this;this.stop(),this.units.forEach(function(t){return oe(e[t])})},events:[{name:"visibilitychange",el:document,handler:function(){document.hidden?this.stop():this.start()}}],update:{write:function(){var t,e,n=this,r=(t=this.date,{total:e=t-Date.now(),seconds:e/1e3%60,minutes:e/1e3/60%60,hours:e/1e3/60/60%24,days:e/1e3/60/60/24});r.total<=0&&(this.stop(),r.days=r.hours=r.minutes=r.seconds=0),this.units.forEach(function(t){var e=String(Math.floor(r[t]));e=e.length<2?"0"+e:e;var i=n[t];i.textContent!==e&&((e=e.split("")).length!==i.children.length&&se(i,e.map(function(){return"<span></span>"}).join("")),e.forEach(function(t,e){return i.children[e].textContent=t}))})}},methods:{start:function(){var t=this;this.stop(),this.date&&this.units.length&&(this.$emit(),this.timer=setInterval(function(){return t.$emit()},1e3))},stop:function(){this.timer&&(clearInterval(this.timer),this.timer=null)}}};var sr,ar="uk-animation-target",hr={props:{animation:Number},data:{animation:150},computed:{target:function(){return this.$el}},methods:{animate:function(t){var n=this;sr||(sr=ae(document.head,"<style>").sheet).insertRule("."+ar+" > * {\n                    margin-top: 0 !important;\n                    transform: none !important;\n                }",0);var r=L(this.target.children),o=r.map(function(t){return lr(t,!0)}),e=ti(this.target),i=window.pageYOffset;t(),Ve.cancel(this.target),r.forEach(Ve.cancel),cr(this.target),this.$update(this.target),pi.flush();var s=ti(this.target),a=(r=r.concat(L(this.target.children).filter(function(t){return!b(r,t)}))).map(function(t,e){return!!(t.parentNode&&e in o)&&(o[e]?xt(t)?ur(t):{opacity:0}:{opacity:xt(t)?1:0})});return o=a.map(function(t,e){var i=r[e].parentNode===n.target&&(o[e]||lr(r[e]));if(i)if(t){if(!("opacity"in t)){i.opacity%1?t.opacity=1:delete i.opacity}}else delete i.opacity;return i}),ke(this.target,ar),r.forEach(function(t,e){return o[e]&&De(t,o[e])}),De(this.target,"height",e),ci(window,i),Ut.all(r.map(function(t,e){return o[e]&&a[e]?Ve.start(t,a[e],n.animation,"ease"):Ut.resolve()}).concat(Ve.start(this.target,{height:s},this.animation,"ease"))).then(function(){r.forEach(function(t,e){return De(t,{display:0===a[e].opacity?"none":"",zIndex:""})}),cr(n.target),n.$update(n.target),pi.flush()},X)}}};function lr(t,e){var i=De(t,"zIndex");return!!xt(t)&&Y({display:"",opacity:e?De(t,"opacity"):"0",pointerEvents:"none",position:"absolute",zIndex:"auto"===i?ne(t):i},ur(t))}function cr(t){De(t.children,{height:"",left:"",opacity:"",pointerEvents:"",position:"",top:"",width:""}),$e(t,ar),De(t,"height","")}function ur(t){var e=t.getBoundingClientRect(),i=e.height,n=e.width,r=Qe(t),o=r.top,s=r.left;return{top:o+=P(De(t,"marginTop")),left:s,height:i,width:n}}var dr={mixins:[hr],args:"target",props:{target:Boolean,selActive:Boolean},data:{target:null,selActive:!1,attrItem:"uk-filter-control",cls:"uk-active",animation:250},computed:{toggles:function(t,e){t.attrItem;return ye("["+this.attrItem+"],[data-"+this.attrItem+"]",e)},target:function(t,e){return be(t.target,e)}},events:[{name:"click",delegate:function(){return"["+this.attrItem+"],[data-"+this.attrItem+"]"},handler:function(t){t.preventDefault(),this.apply(t.current)}}],connected:function(){var e=this;if(!1!==this.selActive){var i=ye(this.selActive,this.$el);this.toggles.forEach(function(t){return Ee(t,e.cls,b(i,t))})}},update:function(t){var e=t.toggles,i=t.children;mr(e,this.toggles,!1)&&mr(i,this.target.children,!1)||(t.toggles=this.toggles,t.children=this.target.children,this.setState(this.getState(),!1))},methods:{apply:function(t){this.setState(pr(t,this.attrItem,this.getState()))},getState:function(){var i=this;return this.toggles.filter(function(t){return Te(t,i.cls)}).reduce(function(t,e){return pr(e,i.attrItem,t)},{filter:{"":""},sort:[]})},setState:function(l,t){var c=this;void 0===t&&(t=!0),l=Y({filter:{"":""},sort:[]},l),Lt(this.$el,"beforeFilter",[this,l]);var u=L(this.target.children);this.toggles.forEach(function(t){return Ee(t,c.cls,function(t,e,i){var n=i.filter;void 0===n&&(n={"":""});var r=i.sort,o=r[0],s=r[1],a=fr(t,e),h=a.filter,l=a.group;void 0===l&&(l="");var c=a.sort,u=a.order;void 0===u&&(u="asc");return h=O(c)?h||"":h,c=O(h)?c||"":c,(O(h)||l in n&&h===n[l])&&(O(c)||o===c&&s===u)}(t,c.attrItem,l))});var e=function(){var t,e,i=(t=l.filter,e="",R(t,function(t){return e+=t||""}),e);u.forEach(function(t){return De(t,"display",i&&!ft(t,i)?"none":"")});var n,r,o=l.sort,s=o[0],a=o[1];if(s){var h=(n=s,r=a,L(u).sort(function(t,e){return et(t,n).localeCompare(et(e,n),void 0,{numeric:!0})*("asc"===r||-1)}));mr(h,u)||h.forEach(function(t){return ae(c.target,t)})}};t?this.animate(e).then(function(){return Lt(c.$el,"afterFilter",[c])}):(e(),Lt(this.$el,"afterFilter",[this]))}}};function fr(t,e){return Ii(et(t,e),["filter"])}function pr(t,s,a){return L(t).forEach(function(t){var e=fr(t,s),i=e.filter,n=e.group,r=e.sort,o=e.order;void 0===o&&(o="asc"),(i||O(r))&&(n?(delete a.filter[""],a.filter[n]=i):a.filter={"":i||""}),O(r)||(a.sort=[r,o])}),a}function mr(t,i,n){return void 0===n&&(n=!0),t=L(t),i=L(i),t.length===i.length&&t.every(function(t,e){return n?t===i[e]:~i.indexOf(t)})}var gr={slide:{show:function(t){return[{transform:wr(-100*t)},{transform:wr()}]},percent:function(t){return vr(t)},translate:function(t,e){return[{transform:wr(-100*e*t)},{transform:wr(100*e*(1-t))}]}}};function vr(t){return Math.abs(De(t,"transform").split(",")[4]/t.offsetWidth)||0}function wr(t,e){return void 0===t&&(t=0),void 0===e&&(e="%"),"translateX("+t+(t?e:"")+")"}function br(t){return"scale3d("+t+", "+t+", 1)"}var yr=Y({},gr,{fade:{show:function(){return[{opacity:0},{opacity:1}]},percent:function(t){return 1-De(t,"opacity")},translate:function(t){return[{opacity:1-t},{opacity:t}]}},scale:{show:function(){return[{opacity:0,transform:br(.8)},{opacity:1,transform:br(1)}]},percent:function(t){return 1-De(t,"opacity")},translate:function(t){return[{opacity:1-t,transform:br(1-.2*t)},{opacity:t,transform:br(.8+.2*t)}]}}});function xr(t,e,i){Lt(t,jt(e,!1,!1,i))}var kr={mixins:[{props:{autoplay:Boolean,autoplayInterval:Number,pauseOnHover:Boolean},data:{autoplay:!1,autoplayInterval:7e3,pauseOnHover:!0},connected:function(){this.startAutoplay(),this.userInteracted=!1},disconnected:function(){this.stopAutoplay()},events:[{name:"visibilitychange",el:document,handler:function(){document.hidden?this.stopAutoplay():!this.userInteracted&&this.startAutoplay()}},{name:_t,handler:function(){this.userInteracted=!0,this.stopAutoplay()}},{name:"mouseenter",filter:function(){return this.autoplay},handler:function(){this.isHovering=!0}},{name:"mouseleave",filter:function(){return this.autoplay},handler:function(){this.isHovering=!1}}],methods:{startAutoplay:function(){var t=this;this.stopAutoplay(),this.autoplay&&(this.interval=setInterval(function(){return!(t.isHovering&&t.pauseOnHover)&&!t.stack.length&&t.show("next")},this.autoplayInterval))},stopAutoplay:function(){this.interval&&clearInterval(this.interval)}}},{props:{draggable:Boolean},data:{draggable:!0,threshold:10},created:function(){var n=this;["start","move","end"].forEach(function(t){var i=n[t];n[t]=function(t){var e=Mi(t).x*(Et?-1:1);n.prevPos=e!==n.pos?n.pos:n.prevPos,n.pos=e,i(t)}})},events:[{name:_t,delegate:function(){return this.selSlides},handler:function(t){var e;!this.draggable||!_i(t)&&(!(e=t.target).children.length&&e.childNodes.length)||0<t.button||this.length<2||this.start(t)}},{name:"touchmove",passive:!1,handler:"move",delegate:function(){return this.selSlides}},{name:"dragstart",handler:function(t){t.preventDefault()}}],methods:{start:function(){var t=this;this.drag=this.pos,this._transitioner?(this.percent=this._transitioner.percent(),this.drag+=this._transitioner.getDistance()*this.percent*this.dir,this._transitioner.cancel(),this._transitioner.translate(this.percent),this.dragging=!0,this.stack=[]):this.prevIndex=this.index;var e="touchmove"!==Mt?Pt(document,Mt,this.move,{passive:!1}):X;this.unbindMove=function(){e(),t.unbindMove=null},Pt(window,"scroll",this.unbindMove),Pt(document,Dt,this.end,!0)},move:function(t){var e=this;if(this.unbindMove){var i=this.pos-this.drag;if(!(0===i||this.prevPos===this.pos||!this.dragging&&Math.abs(i)<this.threshold)){t.cancelable&&t.preventDefault(),this.dragging=!0,this.dir=i<0?1:-1;for(var n=this.slides,r=this.prevIndex,o=Math.abs(i),s=this.getIndex(r+this.dir,r),a=this._getDistance(r,s)||n[r].offsetWidth;s!==r&&a<o;)this.drag-=a*this.dir,r=s,o-=a,s=this.getIndex(r+this.dir,r),a=this._getDistance(r,s)||n[r].offsetWidth;this.percent=o/a;var h,l=n[r],c=n[s],u=this.index!==s,d=r===s;[this.index,this.prevIndex].filter(function(t){return!b([s,r],t)}).forEach(function(t){Lt(n[t],"itemhidden",[e]),d&&(h=!0,e.prevIndex=r)}),(this.index===r&&this.prevIndex!==r||h)&&Lt(n[this.index],"itemshown",[this]),u&&(this.prevIndex=r,this.index=s,!d&&Lt(l,"beforeitemhide",[this]),Lt(c,"beforeitemshow",[this])),this._transitioner=this._translate(Math.abs(this.percent),l,!d&&c),u&&(!d&&Lt(l,"itemhide",[this]),Lt(c,"itemshow",[this]))}}},end:function(){if(Ht(window,"scroll",this.unbindMove),this.unbindMove&&this.unbindMove(),Ht(document,Dt,this.end,!0),this.dragging){if(this.dragging=null,this.index===this.prevIndex)this.percent=1-this.percent,this.dir*=-1,this._show(!1,this.index,!0),this._transitioner=null;else{var t=(Et?this.dir*(Et?1:-1):this.dir)<0==this.prevPos>this.pos;this.index=t?this.index:this.prevIndex,t&&(this.percent=1-this.percent),this.show(0<this.dir&&!t||this.dir<0&&t?"next":"previous",!0)}qt()}this.drag=this.percent=null}}},{data:{selNav:!1},computed:{nav:function(t,e){return be(t.selNav,e)},selNavItem:function(t){var e=t.attrItem;return"["+e+"],[data-"+e+"]"},navItems:function(t,e){return ye(this.selNavItem,e)}},update:{write:function(){var i=this;this.nav&&this.length!==this.nav.children.length&&se(this.nav,this.slides.map(function(t,e){return"<li "+i.attrItem+'="'+e+'"><a href="#"></a></li>'}).join("")),Ee(ye(this.selNavItem,this.$el).concat(this.nav),"uk-hidden",!this.maxIndex),this.updateNav()},events:["load","resize"]},events:[{name:"click",delegate:function(){return this.selNavItem},handler:function(t){t.preventDefault(),this.show(et(t.current,this.attrItem))}},{name:"itemshow",handler:"updateNav"}],methods:{updateNav:function(){var i=this,n=this.getValidIndex();this.navItems.forEach(function(t){var e=et(t,i.attrItem);Ee(t,i.clsActive,z(e)===n),Ee(t,"uk-invisible",i.finite&&("previous"===e&&0===n||"next"===e&&n>=i.maxIndex))})}}}],props:{clsActivated:Boolean,easing:String,index:Number,finite:Boolean,velocity:Number},data:function(){return{easing:"ease",finite:!1,velocity:1,index:0,stack:[],percent:0,clsActive:"uk-active",clsActivated:!1,Transitioner:!1,transitionOptions:{}}},computed:{duration:function(t,e){var i=t.velocity;return $r(e.offsetWidth/i)},length:function(){return this.slides.length},list:function(t,e){return be(t.selList,e)},maxIndex:function(){return this.length-1},selSlides:function(t){return t.selList+" > *"},slides:function(){return L(this.list.children)}},events:{itemshown:function(){this.$update(this.list)}},methods:{show:function(t,e){var i=this;if(void 0===e&&(e=!1),!this.dragging&&this.length){var n=this.stack,r=e?0:n.length,o=function(){n.splice(r,1),n.length&&i.show(n.shift(),!0)};if(n[e?"unshift":"push"](t),!e&&1<n.length)2===n.length&&this._transitioner.forward(Math.min(this.duration,200));else{var s=this.index,a=Te(this.slides,this.clsActive)&&this.slides[s],h=this.getIndex(t,this.index),l=this.slides[h];if(a!==l){var c,u;if(this.dir=(u=s,"next"===(c=t)?1:"previous"===c?-1:c<u?-1:1),this.prevIndex=s,this.index=h,a&&Lt(a,"beforeitemhide",[this]),!Lt(l,"beforeitemshow",[this,a]))return this.index=this.prevIndex,void o();var d=this._show(a,l,e).then(function(){return a&&Lt(a,"itemhidden",[i]),Lt(l,"itemshown",[i]),new Ut(function(t){pi.write(function(){n.shift(),n.length?i.show(n.shift(),!0):i._transitioner=null,t()})})});return a&&Lt(a,"itemhide",[this]),Lt(l,"itemshow",[this]),d}o()}}},getIndex:function(t,e){return void 0===t&&(t=this.index),void 0===e&&(e=this.index),U(re(t,this.slides,e,this.finite),0,this.maxIndex)},getValidIndex:function(t,e){return void 0===t&&(t=this.index),void 0===e&&(e=this.prevIndex),this.getIndex(t,e)},_show:function(t,e,i){if(this._transitioner=this._getTransitioner(t,e,this.dir,Y({easing:i?e.offsetWidth<600?"cubic-bezier(0.25, 0.46, 0.45, 0.94)":"cubic-bezier(0.165, 0.84, 0.44, 1)":this.easing},this.transitionOptions)),!i&&!t)return this._transitioner.translate(1),Ut.resolve();var n=this.stack.length;return this._transitioner[1<n?"forward":"show"](1<n?Math.min(this.duration,75+75/(n-1)):this.duration,this.percent)},_getDistance:function(t,e){return new this._getTransitioner(t,t!==e&&e).getDistance()},_translate:function(t,e,i){void 0===e&&(e=this.prevIndex),void 0===i&&(i=this.index);var n=this._getTransitioner(e!==i&&e,i);return n.translate(t),n},_getTransitioner:function(t,e,i,n){return void 0===t&&(t=this.prevIndex),void 0===e&&(e=this.index),void 0===i&&(i=this.dir||1),void 0===n&&(n=this.transitionOptions),new this.Transitioner(M(t)?this.slides[t]:t,M(e)?this.slides[e]:e,i*(Et?-1:1),n)}}};function $r(t){return.5*t+300}var Ir={mixins:[kr],props:{animation:String},data:{animation:"slide",clsActivated:"uk-transition-active",Animations:gr,Transitioner:function(o,s,a,t){var e=t.animation,h=t.easing,i=e.percent,n=e.translate,r=e.show;void 0===r&&(r=X);var l=r(a),c=new Xt;return{dir:a,show:function(t,e,i){var n=this;void 0===e&&(e=0);var r=i?"linear":h;return t-=Math.round(t*U(e,-1,1)),this.translate(e),xr(s,"itemin",{percent:e,duration:t,timing:r,dir:a}),xr(o,"itemout",{percent:1-e,duration:t,timing:r,dir:a}),Ut.all([Ve.start(s,l[1],t,r),Ve.start(o,l[0],t,r)]).then(function(){n.reset(),c.resolve()},X),c.promise},stop:function(){return Ve.stop([s,o])},cancel:function(){Ve.cancel([s,o])},reset:function(){for(var t in l[0])De([s,o],t,"")},forward:function(t,e){return void 0===e&&(e=this.percent()),Ve.cancel([s,o]),this.show(t,e,!0)},translate:function(t){this.reset();var e=n(t,a);De(s,e[1]),De(o,e[0]),xr(s,"itemtranslatein",{percent:t,dir:a}),xr(o,"itemtranslateout",{percent:1-t,dir:a})},percent:function(){return i(o||s,s,a)},getDistance:function(){return o&&o.offsetWidth}}}},computed:{animation:function(t){var e=t.animation,i=t.Animations;return Y(e in i?i[e]:i.slide,{name:e})},transitionOptions:function(){return{animation:this.animation}}},events:{"itemshow itemhide itemshown itemhidden":function(t){var e=t.target;this.$update(e)},itemshow:function(){M(this.prevIndex)&&pi.flush()},beforeitemshow:function(t){ke(t.target,this.clsActive)},itemshown:function(t){ke(t.target,this.clsActivated)},itemhidden:function(t){$e(t.target,this.clsActive,this.clsActivated)}}},Sr={mixins:[Ln,jn,Li,Ir],functional:!0,props:{delayControls:Number,preload:Number,videoAutoplay:Boolean,template:String},data:function(){return{preload:1,videoAutoplay:!1,delayControls:3e3,items:[],cls:"uk-open",clsPage:"uk-lightbox-page",selList:".uk-lightbox-items",attrItem:"uk-lightbox-item",selClose:".uk-close-large",pauseOnHover:!1,velocity:2,Animations:yr,template:'<div class="uk-lightbox uk-overflow-hidden"> <ul class="uk-lightbox-items"></ul> <div class="uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque"> <button class="uk-lightbox-toolbar-icon uk-close-large" type="button" uk-close></button> </div> <a class="uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade" href="#" uk-slidenav-previous uk-lightbox-item="previous"></a> <a class="uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade" href="#" uk-slidenav-next uk-lightbox-item="next"></a> <div class="uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque"></div> </div>'}},created:function(){var t=this;this.$mount(ae(this.container,this.template)),this.caption=be(".uk-lightbox-caption",this.$el),this.items.forEach(function(){return ae(t.list,"<li></li>")})},events:[{name:Mt+" "+_t+" keydown",handler:"showControls"},{name:Dt,self:!0,delegate:function(){return this.selSlides},handler:function(t){t.preventDefault(),this.hide()}},{name:"shown",self:!0,handler:function(){this.startAutoplay(),this.showControls()}},{name:"hide",self:!0,handler:function(){this.stopAutoplay(),this.hideControls(),$e(this.slides,this.clsActive),Ve.stop(this.slides)}},{name:"hidden",self:!0,handler:function(){this.$destroy(!0)}},{name:"keyup",el:document,handler:function(t){if(this.isToggled(this.$el))switch(t.keyCode){case 37:this.show("previous");break;case 39:this.show("next")}}},{name:"beforeitemshow",handler:function(t){this.isToggled()||(this.draggable=!1,t.preventDefault(),this.toggleNow(this.$el,!0),this.animation=yr.scale,$e(t.target,this.clsActive),this.stack.splice(1,0,this.index))}},{name:"itemshow",handler:function(t){var e=ne(t.target),i=this.getItem(e).caption;De(this.caption,"display",i?"":"none"),se(this.caption,i);for(var n=0;n<=this.preload;n++)this.loadItem(this.getIndex(e+n)),this.loadItem(this.getIndex(e-n))}},{name:"itemshown",handler:function(){this.draggable=this.$props.draggable}},{name:"itemload",handler:function(t,r){var o,s=this,e=r.source,i=r.type,n=r.alt;if(this.setItem(r,"<span uk-spinner></span>"),e)if("image"===i||e.match(/\.(jp(e)?g|png|gif|svg)($|\?)/i))te(e).then(function(t){return s.setItem(r,'<img width="'+t.width+'" height="'+t.height+'" src="'+e+'" alt="'+(n||"")+'">')},function(){return s.setError(r)});else if("video"===i||e.match(/\.(mp4|webm|ogv)($|\?)/i)){var a=be("<video controls playsinline"+(r.poster?' poster="'+r.poster+'"':"")+' uk-video="'+this.videoAutoplay+'"></video>');Z(a,"src",e),Ft(a,"error loadedmetadata",function(t){"error"===t?s.setError(r):(Z(a,{width:a.videoWidth,height:a.videoHeight}),s.setItem(r,a))})}else if("iframe"===i||e.match(/\.(html|php)($|\?)/i))this.setItem(r,'<iframe class="uk-lightbox-iframe" src="'+e+'" frameborder="0" allowfullscreen></iframe>');else if(o=e.match(/\/\/.*?youtube(-nocookie)?\.[a-z]+\/watch\?v=([^&\s]+)/)||e.match(/()youtu\.be\/(.*)/)){var h=o[2],l=function(t,e){return void 0===t&&(t=640),void 0===e&&(e=450),s.setItem(r,Tr("https://www.youtube"+(o[1]||"")+".com/embed/"+h,t,e,s.videoAutoplay))};te("https://img.youtube.com/vi/"+h+"/maxresdefault.jpg").then(function(t){var e=t.width,i=t.height;120===e&&90===i?te("https://img.youtube.com/vi/"+h+"/0.jpg").then(function(t){var e=t.width,i=t.height;return l(e,i)},l):l(e,i)},l)}else(o=e.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/))&&Qt("https://vimeo.com/api/oembed.json?maxwidth=1920&url="+encodeURI(e),{responseType:"json",withCredentials:!1}).then(function(t){var e=t.response,i=e.height,n=e.width;return s.setItem(r,Tr("https://player.vimeo.com/video/"+o[2],n,i,s.videoAutoplay))},function(){return s.setError(r)})}}],methods:{loadItem:function(t){void 0===t&&(t=this.index);var e=this.getItem(t);e.content||Lt(this.$el,"itemload",[e])},getItem:function(t){return void 0===t&&(t=this.index),this.items[t]||{}},setItem:function(t,e){Y(t,{content:e});var i=se(this.slides[this.items.indexOf(t)],e);Lt(this.$el,"itemloaded",[this,i]),this.$update(i)},setError:function(t){this.setItem(t,'<span uk-icon="icon: bolt; ratio: 2"></span>')},showControls:function(){clearTimeout(this.controlsTimer),this.controlsTimer=setTimeout(this.hideControls,this.delayControls),ke(this.$el,"uk-active","uk-transition-active")},hideControls:function(){$e(this.$el,"uk-active","uk-transition-active")}}};function Tr(t,e,i,n){return'<iframe src="'+t+'" width="'+e+'" height="'+i+'" style="max-width: 100%; box-sizing: border-box;" frameborder="0" allowfullscreen uk-video="autoplay: '+n+'" uk-responsive></iframe>'}var Er,Cr={install:function(t,e){t.lightboxPanel||t.component("lightboxPanel",Sr);Y(e.props,t.component("lightboxPanel").options.props)},props:{toggle:String},data:{toggle:"a"},computed:{toggles:function(t,e){return ye(t.toggle,e)}},disconnected:function(){this.hide()},events:[{name:"click",delegate:function(){return this.toggle+":not(.uk-disabled)"},handler:function(t){t.preventDefault(),this.show(ne(this.toggles,t.current))}}],update:function(t){var e,i;(t.toggles=this.panel&&t.toggles||this.toggles,this.panel&&(e=t.toggles,i=this.toggles,e.length!==i.length||!e.every(function(t,e){return t===i[e]})))&&(t.toggles=this.toggles,this.panel.hide())},methods:{show:function(t){var e=this;return this.panel=this.panel||this.$create("lightboxPanel",Y({},this.$props,{items:this.toggles.reduce(function(t,i){return t.push(["href","caption","type","poster","alt"].reduce(function(t,e){return t["href"===e?"source":e]=et(i,e),t},{})),t},[])})),Pt(this.panel.$el,"hidden",function(){return e.panel=!1}),this.panel.show(t)},hide:function(){return this.panel&&this.panel.hide()}}};var Ar={},Nr={functional:!0,args:["message","status"],data:{message:"",status:"",timeout:5e3,group:null,pos:"top-center",clsClose:"uk-notification-close",clsMsg:"uk-notification-message"},install:function(r){r.notification.closeAll=function(i,n){we(document.body,function(t){var e=r.getComponent(t,"notification");!e||i&&i!==e.group||e.close(n)})}},computed:{marginProp:function(t){return"margin"+(v(t.pos,"top")?"Top":"Bottom")},startProps:function(){var t;return(t={opacity:0})[this.marginProp]=-this.$el.offsetHeight,t}},created:function(){Ar[this.pos]||(Ar[this.pos]=ae(this.$container,'<div class="uk-notification uk-notification-'+this.pos+'"></div>'));var t=De(Ar[this.pos],"display","block");this.$mount(ae(t,'<div class="'+this.clsMsg+(this.status?" "+this.clsMsg+"-"+this.status:"")+'"> <a href="#" class="'+this.clsClose+'" data-uk-close></a> <div>'+this.message+"</div> </div>"))},connected:function(){var t,e=this,i=P(De(this.$el,this.marginProp));Ve.start(De(this.$el,this.startProps),(t={opacity:1},t[this.marginProp]=i,t)).then(function(){e.timeout&&(e.timer=setTimeout(e.close,e.timeout))})},events:(Er={click:function(t){mt(t.target,'a[href="#"],a[href=""]')&&t.preventDefault(),this.close()}},Er[Ot]=function(){this.timer&&clearTimeout(this.timer)},Er[Bt]=function(){this.timeout&&(this.timer=setTimeout(this.close,this.timeout))},Er),methods:{close:function(t){var e=this,i=function(){Lt(e.$el,"close",[e]),ue(e.$el),Ar[e.pos].children.length||De(Ar[e.pos],"display","none")};this.timer&&clearTimeout(this.timer),t?i():Ve.start(this.$el,this.startProps).then(i)}}};var _r=["x","y","bgx","bgy","rotate","scale","color","backgroundColor","borderColor","opacity","blur","hue","grayscale","invert","saturate","sepia","fopacity"],Mr={mixins:[zn],props:_r.reduce(function(t,e){return t[e]="list",t},{}),data:_r.reduce(function(t,e){return t[e]=void 0,t},{}),computed:{props:function(f,p){var m=this;return _r.reduce(function(t,e){if(O(f[e]))return t;var i,n,r,o=e.match(/color/i),s=o||"opacity"===e,a=f[e].slice(0);s&&De(p,e,""),a.length<2&&a.unshift(("scale"===e?1:s?De(p,e):0)||0);var h=b(a.join(""),"%")?"%":"px";if(o){var l=p.style.color;a=a.map(function(t){return De(De(p,"color",t),"color").split(/[(),]/g).slice(1,-1).concat(1).slice(0,4).map(function(t){return P(t)})}),p.style.color=l}else a=a.map(P);if(e.match(/^bg/))if(De(p,"background-position-"+e[2],""),n=De(p,"backgroundPosition").split(" ")["x"===e[2]?0:1],m.covers){var c=Math.min.apply(Math,a),u=Math.max.apply(Math,a),d=a.indexOf(c)<a.indexOf(u);r=u-c,a=a.map(function(t){return t-(d?c:u)}),i=(d?-r:0)+"px"}else i=n;return t[e]={steps:a,unit:h,pos:i,bgPos:n,diff:r},t},{})},bgProps:function(){var e=this;return["bgx","bgy"].filter(function(t){return t in e.props})},covers:function(t,e){return n=(i=e).style.backgroundSize,r="cover"===De(De(i,"backgroundSize",""),"backgroundSize"),i.style.backgroundSize=n,r;var i,n,r}},disconnected:function(){delete this._image},update:{read:function(t){var h=this;if(t.active=this.matchMedia,t.active){if(!t.image&&this.covers&&this.bgProps.length){var e=De(this.$el,"backgroundImage").replace(/^none|url\(["']?(.+?)["']?\)$/,"$1");if(e){var i=new Image;i.src=e,(t.image=i).naturalWidth||(i.onload=function(){return h.$emit()})}}var n=t.image;if(n&&n.naturalWidth){var l={width:this.$el.offsetWidth,height:this.$el.offsetHeight},c={width:n.naturalWidth,height:n.naturalHeight},u=J.cover(c,l);this.bgProps.forEach(function(t){var e=h.props[t],i=e.diff,n=e.bgPos,r=e.steps,o="bgy"===t?"height":"width",s=u[o]-l[o];if(n.match(/%$|0px/)){if(s<i)l[o]=u[o]+i-s;else if(i<s){var a=parseFloat(n);a&&(h.props[t].steps=r.map(function(t){return t-(s-i)/(100/a)}))}u=J.cover(c,l)}}),t.dim=u}}},write:function(t){var e=t.dim;t.active?e&&De(this.$el,{backgroundSize:e.width+"px "+e.height+"px",backgroundRepeat:"no-repeat"}):De(this.$el,{backgroundSize:"",backgroundRepeat:""})},events:["load","resize"]},methods:{reset:function(){var i=this;R(this.getCss(0),function(t,e){return De(i.$el,e,"")})},getCss:function(p){var m=this.props,g=!1;return Object.keys(m).reduce(function(t,e){var i=m[e],n=i.steps,r=i.unit,o=i.pos,s=Or(n,p);switch(e){case"x":case"y":if(g)break;var a=["x","y"].map(function(t){return e===t?P(s).toFixed(0)+r:m[t]?Or(m[t].steps,p,1)+m[t].unit:0}),h=a[0],l=a[1];g=t.transform+=" translate3d("+h+", "+l+", 0)";break;case"rotate":t.transform+=" rotate("+s+"deg)";break;case"scale":t.transform+=" scale("+s+")";break;case"bgy":case"bgx":t["background-position-"+e[2]]="calc("+o+" + "+(s+r)+")";break;case"color":case"backgroundColor":case"borderColor":var c=Dr(n,p),u=c[0],d=c[1],f=c[2];t[e]="rgba("+u.map(function(t,e){return t+=f*(d[e]-t),3===e?P(t):parseInt(t,10)}).join(",")+")";break;case"blur":t.filter+=" blur("+s+"px)";break;case"hue":t.filter+=" hue-rotate("+s+"deg)";break;case"fopacity":t.filter+=" opacity("+s+"%)";break;case"grayscale":case"invert":case"saturate":case"sepia":t.filter+=" "+e+"("+s+"%)";break;default:t[e]=s}return t},{transform:"",filter:""})}}};function Dr(t,e){var i=t.length-1,n=Math.min(Math.floor(i*e),i-1),r=t.slice(n,n+2);return r.push(1===e?1:e%(1/i)*i),r}function Or(t,e,i){void 0===i&&(i=2);var n=Dr(t,e),r=n[0],o=n[1],s=n[2];return(M(r)?r+Math.abs(r-o)*s*(r<o?1:-1):+o).toFixed(i)}var Br={mixins:[Mr],props:{target:String,viewport:Number,easing:Number},data:{target:!1,viewport:1,easing:1},computed:{target:function(t,e){var i=t.target;return i&&it(i,e)||e}},update:{read:function(t,e){var i=t.percent,n=t.active;if("scroll"!==e.type&&(i=!1),n){var r,o,s=i;return r=li(this.target)/(this.viewport||1),o=this.easing,{percent:i=U(r*(1-(o-o*r))),style:s!==i&&this.getCss(i)}}},write:function(t){var e=t.style;t.active?e&&De(this.$el,e):this.reset()},events:["scroll","load","resize"]}};var zr={update:{write:function(){if(!this.stack.length&&!this.dragging){var t=this.getValidIndex();delete this.index,$e(this.slides,this.clsActive,this.clsActivated),this.show(t)}},events:["load","resize"]}};function Pr(t,e,i){var n,r=Lr(t,e);return i?r-(n=t,jr(e).width/2-jr(n).width/2):Math.min(r,Hr(e))}function Hr(t){return Math.max(0,Fr(t)-jr(t).width)}function Fr(t){return Vr(t).reduce(function(t,e){return jr(e).width+t},0)}function Lr(t,e){return(Qe(t).left+(Et?jr(t).width-jr(e).width:0))*(Et?-1:1)}function jr(t){return t.getBoundingClientRect()}function Wr(t,e,i){Lt(t,jt(e,!1,!1,i))}function Vr(t){return L(t.children)}var Yr={mixins:[Fi,kr,zr],props:{center:Boolean,sets:Boolean},data:{center:!1,sets:!1,attrItem:"uk-slider-item",selList:".uk-slider-items",selNav:".uk-slider-nav",clsContainer:"uk-slider-container",Transitioner:function(r,n,o,t){var e=t.center,s=t.easing,a=t.list,h=new Xt,i=r?Pr(r,a,e):Pr(n,a,e)+jr(n).width*o,l=n?Pr(n,a,e):i+jr(r).width*o*(Et?-1:1);return{dir:o,show:function(t,e,i){void 0===e&&(e=0);var n=i?"linear":s;return t-=Math.round(t*U(e,-1,1)),this.translate(e),r&&this.updateTranslates(),e=r?e:U(e,0,1),Wr(this.getItemIn(),"itemin",{percent:e,duration:t,timing:n,dir:o}),r&&Wr(this.getItemIn(!0),"itemout",{percent:1-e,duration:t,timing:n,dir:o}),Ve.start(a,{transform:wr(-l*(Et?-1:1),"px")},t,n).then(h.resolve,X),h.promise},stop:function(){return Ve.stop(a)},cancel:function(){Ve.cancel(a)},reset:function(){De(a,"transform","")},forward:function(t,e){return void 0===e&&(e=this.percent()),Ve.cancel(a),this.show(t,e,!0)},translate:function(t){var e=this.getDistance()*o*(Et?-1:1);De(a,"transform",wr(U(e-e*t-l,-Fr(a),jr(a).width)*(Et?-1:1),"px")),this.updateTranslates(),r&&(t=U(t,-1,1),Wr(this.getItemIn(),"itemtranslatein",{percent:t,dir:o}),Wr(this.getItemIn(!0),"itemtranslateout",{percent:1-t,dir:o}))},percent:function(){return Math.abs((De(a,"transform").split(",")[4]*(Et?-1:1)+i)/(l-i))},getDistance:function(){return Math.abs(l-i)},getItemIn:function(t){void 0===t&&(t=!1);var e=this.getActives(),i=q(Vr(a),"offsetLeft"),n=ne(i,e[0<o*(t?-1:1)?e.length-1:0]);return~n&&i[n+(r&&!t?o:0)]},getActives:function(){var i=Pr(r||n,a,e);return q(Vr(a).filter(function(t){var e=Lr(t,a);return i<=e&&e+jr(t).width<=jr(a).width+i}),"offsetLeft")},updateTranslates:function(){var i=this.getActives();Vr(a).forEach(function(t){var e=b(i,t);Wr(t,"itemtranslate"+(e?"in":"out"),{percent:e?1:0,dir:t.offsetLeft<=n.offsetLeft?1:-1})})}}}},computed:{avgWidth:function(){return Fr(this.list)/this.length},finite:function(t){return t.finite||Fr(this.list)<jr(this.list).width+Vr(this.list).reduce(function(t,e){return Math.max(t,jr(e).width)},0)+this.center},maxIndex:function(){if(!this.finite||this.center&&!this.sets)return this.length-1;if(this.center)return this.sets[this.sets.length-1];De(this.slides,"order","");for(var t=Hr(this.list),e=this.length;e--;)if(Lr(this.list.children[e],this.list)<t)return Math.min(e+1,this.length-1);return 0},sets:function(t){var o=this,e=t.sets,s=jr(this.list).width/(this.center?2:1),a=0,h=s,l=0;return(e=e&&this.slides.reduce(function(t,e,i){var n=jr(e).width;if(a<l+n&&(!o.center&&i>o.maxIndex&&(i=o.maxIndex),!b(t,i))){var r=o.slides[i+1];o.center&&r&&n<h-jr(r).width/2?h-=n:(h=s,t.push(i),a=l+s+(o.center?n/2:0))}return l+=n,t},[]))&&e.length&&e},transitionOptions:function(){return{center:this.center,list:this.list}}},connected:function(){Ee(this.$el,this.clsContainer,!be("."+this.clsContainer,this.$el))},update:{write:function(){var i=this;ye("["+this.attrItem+"],[data-"+this.attrItem+"]",this.$el).forEach(function(t){var e=et(t,i.attrItem);i.maxIndex&&Ee(t,"uk-hidden",D(e)&&(i.sets&&!b(i.sets,P(e))||e>i.maxIndex))})},events:["load","resize"]},events:{beforeitemshow:function(t){!this.dragging&&this.sets&&this.stack.length<2&&!b(this.sets,this.index)&&(this.index=this.getValidIndex());var e=Math.abs(this.index-this.prevIndex+(0<this.dir&&this.index<this.prevIndex||this.dir<0&&this.index>this.prevIndex?(this.maxIndex+1)*this.dir:0));if(!this.dragging&&1<e){for(var i=0;i<e;i++)this.stack.splice(1,0,0<this.dir?"next":"previous");t.preventDefault()}else this.duration=$r(this.avgWidth/this.velocity)*(jr(this.dir<0||!this.slides[this.prevIndex]?this.slides[this.index]:this.slides[this.prevIndex]).width/this.avgWidth),this.reorder()},itemshow:function(){!O(this.prevIndex)&&ke(this._getTransitioner().getItemIn(),this.clsActive)},itemshown:function(){var e=this,i=this._getTransitioner(this.index).getActives();this.slides.forEach(function(t){return Ee(t,e.clsActive,b(i,t))}),(!this.sets||b(this.sets,P(this.index)))&&this.slides.forEach(function(t){return Ee(t,e.clsActivated,b(i,t))})}},methods:{reorder:function(){var i=this;if(De(this.slides,"order",""),!this.finite){var n=0<this.dir&&this.slides[this.prevIndex]?this.prevIndex:this.index;if(this.slides.forEach(function(t,e){return De(t,"order",0<i.dir&&e<n?1:i.dir<0&&e>=i.index?-1:"")}),this.center)for(var t=this.slides[n],e=jr(this.list).width/2-jr(t).width/2,r=0;0<e;){var o=this.getIndex(--r+n,n),s=this.slides[o];De(s,"order",n<o?-2:-1),e-=jr(s).width}}},getValidIndex:function(t,e){if(void 0===t&&(t=this.index),void 0===e&&(e=this.prevIndex),t=this.getIndex(t,e),!this.sets)return t;var i;do{if(b(this.sets,t))return t;i=t,t=this.getIndex(t+this.dir,e)}while(t!==i);return t}}},Rr={mixins:[Mr],data:{selItem:"!li"},computed:{item:function(t,e){return it(t.selItem,e)}},events:[{name:"itemshown",self:!0,el:function(){return this.item},handler:function(){De(this.$el,this.getCss(.5))}},{name:"itemin itemout",self:!0,el:function(){return this.item},handler:function(t){var e=t.type,i=t.detail,n=i.percent,r=i.duration,o=i.timing,s=i.dir;Ve.cancel(this.$el),De(this.$el,this.getCss(Ur(e,s,n))),Ve.start(this.$el,this.getCss(qr(e)?.5:0<s?1:0),r,o).catch(X)}},{name:"transitioncanceled transitionend",self:!0,el:function(){return this.item},handler:function(){Ve.cancel(this.$el)}},{name:"itemtranslatein itemtranslateout",self:!0,el:function(){return this.item},handler:function(t){var e=t.type,i=t.detail,n=i.percent,r=i.dir;Ve.cancel(this.$el),De(this.$el,this.getCss(Ur(e,r,n)))}}]};function qr(t){return u(t,"in")}function Ur(t,e,i){return i/=2,qr(t)?e<0?1-i:i:e<0?i:1-i}var Xr,Kr=Y({},gr,{fade:{show:function(){return[{opacity:0,zIndex:0},{zIndex:-1}]},percent:function(t){return 1-De(t,"opacity")},translate:function(t){return[{opacity:1-t,zIndex:0},{zIndex:-1}]}},scale:{show:function(){return[{opacity:0,transform:br(1.5),zIndex:0},{zIndex:-1}]},percent:function(t){return 1-De(t,"opacity")},translate:function(t){return[{opacity:1-t,transform:br(1+.5*t),zIndex:0},{zIndex:-1}]}},pull:{show:function(t){return t<0?[{transform:wr(30),zIndex:-1},{transform:wr(),zIndex:0}]:[{transform:wr(-100),zIndex:0},{transform:wr(),zIndex:-1}]},percent:function(t,e,i){return i<0?1-vr(e):vr(t)},translate:function(t,e){return e<0?[{transform:wr(30*t),zIndex:-1},{transform:wr(-100*(1-t)),zIndex:0}]:[{transform:wr(100*-t),zIndex:0},{transform:wr(30*(1-t)),zIndex:-1}]}},push:{show:function(t){return t<0?[{transform:wr(100),zIndex:0},{transform:wr(),zIndex:-1}]:[{transform:wr(-30),zIndex:-1},{transform:wr(),zIndex:0}]},percent:function(t,e,i){return 0<i?1-vr(e):vr(t)},translate:function(t,e){return e<0?[{transform:wr(100*t),zIndex:0},{transform:wr(-30*(1-t)),zIndex:-1}]:[{transform:wr(-30*t),zIndex:-1},{transform:wr(100*(1-t)),zIndex:0}]}}}),Gr={mixins:[Fi,Ir,zr],props:{ratio:String,minHeight:Boolean,maxHeight:Boolean},data:{ratio:"16:9",minHeight:!1,maxHeight:!1,selList:".uk-slideshow-items",attrItem:"uk-slideshow-item",selNav:".uk-slideshow-nav",Animations:Kr},update:{read:function(){var t=this.ratio.split(":").map(Number),e=t[0],i=t[1];return i=i*this.list.offsetWidth/e,this.minHeight&&(i=Math.max(this.minHeight,i)),this.maxHeight&&(i=Math.min(this.maxHeight,i)),{height:i-ni(this.list,"content-box")}},write:function(t){var e=t.height;De(this.list,"minHeight",e)},events:["load","resize"]}},Jr={mixins:[Fi,hr],props:{group:String,threshold:Number,clsItem:String,clsPlaceholder:String,clsDrag:String,clsDragState:String,clsBase:String,clsNoDrag:String,clsEmpty:String,clsCustom:String,handle:String},data:{group:!1,threshold:5,clsItem:"uk-sortable-item",clsPlaceholder:"uk-sortable-placeholder",clsDrag:"uk-sortable-drag",clsDragState:"uk-drag",clsBase:"uk-sortable",clsNoDrag:"uk-sortable-nodrag",clsEmpty:"uk-sortable-empty",clsCustom:"",handle:!1},created:function(){var o=this;["init","start","move","end"].forEach(function(t){var r=o[t];o[t]=function(t){o.scrollY=window.pageYOffset;var e=Mi(t,"page"),i=e.x,n=e.y;o.pos={x:i,y:n},r(t)}})},events:{name:_t,passive:!1,handler:"init"},update:{write:function(){if(this.clsEmpty&&Ee(this.$el,this.clsEmpty,!this.$el.children.length),De(this.handle?ye(this.handle,this.$el):this.$el.children,"touchAction","none"),this.drag){Je(this.drag,{top:this.pos.y+this.origin.top,left:this.pos.x+this.origin.left});var t,e=Je(this.drag),i=e.top,n=i+e.height;0<i&&i<this.scrollY?t=this.scrollY-5:n<ti(document)&&n>ti(window)+this.scrollY&&(t=this.scrollY+5),t&&setTimeout(function(){return ci(window,t)},5)}}},methods:{init:function(t){var e=t.target,i=t.button,n=t.defaultPrevented,r=L(this.$el.children).filter(function(t){return St(e,t)})[0];!r||$t(e)||this.handle&&!St(e,this.handle)||0<i||St(e,"."+this.clsNoDrag)||n||(t.preventDefault(),this.touched=[this],this.placeholder=r,this.origin=Y({target:e,index:ne(r)},this.pos),Pt(document,Mt,this.move),Pt(document,Dt,this.end),Pt(window,"scroll",this.scroll),this.threshold||this.start(t))},start:function(t){this.drag=ae(this.$container,this.placeholder.outerHTML.replace(/^<li/i,"<div").replace(/li>$/i,"div>")),De(this.drag,Y({boxSizing:"border-box",width:this.placeholder.offsetWidth,height:this.placeholder.offsetHeight},De(this.placeholder,["paddingLeft","paddingRight","paddingTop","paddingBottom"]))),Z(this.drag,"uk-no-boot",""),ke(this.drag,this.clsDrag,this.clsCustom),ti(this.drag.firstElementChild,ti(this.placeholder.firstElementChild));var e=Je(this.placeholder),i=e.left,n=e.top;Y(this.origin,{left:i-this.pos.x,top:n-this.pos.y}),ke(this.placeholder,this.clsPlaceholder),ke(this.$el.children,this.clsItem),ke(document.documentElement,this.clsDragState),Lt(this.$el,"start",[this,this.placeholder]),this.move(t)},move:function(t){if(this.drag){this.$emit();var e="mousemove"===t.type?t.target:document.elementFromPoint(this.pos.x-window.pageXOffset,this.pos.y-window.pageYOffset),i=this.getSortable(e),n=this.getSortable(this.placeholder),r=i!==n;if(i&&!St(e,this.placeholder)&&(!r||i.group&&i.group===n.group)){if(e=i.$el===e.parentNode&&e||L(i.$el.children).filter(function(t){return St(e,t)})[0],r)n.remove(this.placeholder);else if(!e)return;i.insert(this.placeholder,e),b(this.touched,i)||this.touched.push(i)}}else(Math.abs(this.pos.x-this.origin.x)>this.threshold||Math.abs(this.pos.y-this.origin.y)>this.threshold)&&this.start(t)},end:function(t){if(Ht(document,Mt,this.move),Ht(document,Dt,this.end),Ht(window,"scroll",this.scroll),this.drag){qt();var e=this.getSortable(this.placeholder);this===e?this.origin.index!==ne(this.placeholder)&&Lt(this.$el,"moved",[this,this.placeholder]):(Lt(e.$el,"added",[e,this.placeholder]),Lt(this.$el,"removed",[this,this.placeholder])),Lt(this.$el,"stop",[this,this.placeholder]),ue(this.drag),this.drag=null;var i=this.touched.map(function(t){return t.clsPlaceholder+" "+t.clsItem}).join(" ");this.touched.forEach(function(t){return $e(t.$el.children,i)}),$e(document.documentElement,this.clsDragState)}else"touchend"===t.type&&t.target.click()},scroll:function(){var t=window.pageYOffset;t!==this.scrollY&&(this.pos.y+=t-this.scrollY,this.scrollY=t,this.$emit())},insert:function(i,n){var r=this;ke(this.$el.children,this.clsItem);var t=function(){var t,e;n?!St(i,r.$el)||(e=n,(t=i).parentNode===e.parentNode&&ne(t)>ne(e))?he(n,i):le(n,i):ae(r.$el,i)};this.animation?this.animate(t):t()},remove:function(t){St(t,this.$el)&&(this.animation?this.animate(function(){return ue(t)}):ue(t))},getSortable:function(t){return t&&(this.$getComponent(t,"sortable")||this.getSortable(t.parentNode))}}};var Zr=[],Qr={mixins:[Ln,Li,Xi],args:"title",props:{delay:Number,title:String},data:{pos:"top",title:"",delay:0,animation:["uk-animation-scale-up"],duration:100,cls:"uk-active",clsPos:"uk-tooltip"},beforeConnect:function(){this._hasTitle=Q(this.$el,"title"),Z(this.$el,{title:"","aria-expanded":!1})},disconnected:function(){this.hide(),Z(this.$el,{title:this._hasTitle?this.title:null,"aria-expanded":null})},methods:{show:function(){var e=this;b(Zr,this)||(Zr.forEach(function(t){return t.hide()}),Zr.push(this),this._unbind=Pt(document,Dt,function(t){return!St(t.target,e.$el)&&e.hide()}),clearTimeout(this.showTimer),this.showTimer=setTimeout(function(){e._show(),e.hideTimer=setInterval(function(){xt(e.$el)||e.hide()},150)},this.delay))},hide:function(){var t=Zr.indexOf(this);!~t||ft(this.$el,"input")&&this.$el===document.activeElement||(Zr.splice(t,1),clearTimeout(this.showTimer),clearInterval(this.hideTimer),Z(this.$el,"aria-expanded",!1),this.toggleElement(this.tooltip,!1),this.tooltip&&ue(this.tooltip),this.tooltip=!1,this._unbind())},_show:function(){this.tooltip=ae(this.container,'<div class="'+this.clsPos+'" aria-expanded="true" aria-hidden> <div class="'+this.clsPos+'-inner">'+this.title+"</div> </div>"),this.positionAt(this.tooltip,this.$el),this.origin="y"===this.getAxis()?ai(this.dir)+"-"+this.align:this.align+"-"+ai(this.dir),this.toggleElement(this.tooltip,!0)}},events:(Xr={},Xr["focus "+Ot+" "+_t]=function(t){t.type===_t&&_i(t)||this.show()},Xr.blur="hide",Xr[Bt]=function(t){_i(t)||this.hide()},Xr)},to={props:{allow:String,clsDragover:String,concurrent:Number,maxSize:Number,method:String,mime:String,msgInvalidMime:String,msgInvalidName:String,msgInvalidSize:String,multiple:Boolean,name:String,params:Object,type:String,url:String},data:{allow:!1,clsDragover:"uk-dragover",concurrent:1,maxSize:0,method:"POST",mime:!1,msgInvalidMime:"Invalid File Type: %s",msgInvalidName:"Invalid File Name: %s",msgInvalidSize:"Invalid File Size: %s Kilobytes Max",multiple:!1,name:"files[]",params:{},type:"",url:"",abort:X,beforeAll:X,beforeSend:X,complete:X,completeAll:X,error:X,fail:X,load:X,loadEnd:X,loadStart:X,progress:X},events:{change:function(t){ft(t.target,'input[type="file"]')&&(t.preventDefault(),t.target.files&&this.upload(t.target.files),t.target.value="")},drop:function(t){io(t);var e=t.dataTransfer;e&&e.files&&($e(this.$el,this.clsDragover),this.upload(e.files))},dragenter:function(t){io(t)},dragover:function(t){io(t),ke(this.$el,this.clsDragover)},dragleave:function(t){io(t),$e(this.$el,this.clsDragover)}},methods:{upload:function(t){var n=this;if(t.length){Lt(this.$el,"upload",[t]);for(var e=0;e<t.length;e++){if(this.maxSize&&1e3*this.maxSize<t[e].size)return void this.fail(this.msgInvalidSize.replace("%s",this.maxSize));if(this.allow&&!eo(this.allow,t[e].name))return void this.fail(this.msgInvalidName.replace("%s",this.allow));if(this.mime&&!eo(this.mime,t[e].type))return void this.fail(this.msgInvalidMime.replace("%s",this.mime))}this.multiple||(t=[t[0]]),this.beforeAll(this,t);var r=function(t,e){for(var i=[],n=0;n<t.length;n+=e){for(var r=[],o=0;o<e;o++)r.push(t[n+o]);i.push(r)}return i}(t,this.concurrent),o=function(t){var e=new FormData;for(var i in t.forEach(function(t){return e.append(n.name,t)}),n.params)e.append(i,n.params[i]);Qt(n.url,{data:e,method:n.method,responseType:n.type,beforeSend:function(t){var e=t.xhr;e.upload&&Pt(e.upload,"progress",n.progress),["loadStart","load","loadEnd","abort"].forEach(function(t){return Pt(e,t.toLowerCase(),n[t])}),n.beforeSend(t)}}).then(function(t){n.complete(t),r.length?o(r.shift()):n.completeAll(t)},function(t){return n.error(t)})};o(r.shift())}}}};function eo(t,e){return e.match(new RegExp("^"+t.replace(/\//g,"\\/").replace(/\*\*/g,"(\\/[^\\/]+)*").replace(/\*/g,"[^\\/]+").replace(/((?!\\))\?/g,"$1.")+"$","i"))}function io(t){t.preventDefault(),t.stopPropagation()}return Hi.component("countdown",or),Hi.component("filter",dr),Hi.component("lightbox",Cr),Hi.component("lightboxPanel",Sr),Hi.component("notification",Nr),Hi.component("parallax",Br),Hi.component("slider",Yr),Hi.component("sliderParallax",Rr),Hi.component("slideshow",Gr),Hi.component("slideshowParallax",Rr),Hi.component("sortable",Jr),Hi.component("tooltip",Qr),Hi.component("upload",to),function(o){var s=o.connect,a=o.disconnect;function t(){h(document.body,s),pi.flush(),new MutationObserver(function(t){return t.forEach(e)}).observe(document,{childList:!0,subtree:!0,characterData:!0,attributes:!0}),o._initialized=!0}function e(t){var e=t.target;("attributes"!==t.type?function(t){for(var e=t.addedNodes,i=t.removedNodes,n=0;n<e.length;n++)h(e[n],s);for(var r=0;r<i.length;r++)h(i[r],a);return!0}(t):function(t){var e=t.target,i=t.attributeName;if("href"===i)return!0;var n=Di(i);if(n&&n in o){if(Q(e,i))return o[n](e),!0;var r=o.getComponent(e,n);return r?(r.$destroy(),!0):void 0}}(t))&&o.update(e)}function h(t,e){if(1===t.nodeType&&!Q(t,"uk-no-boot"))for(e(t),t=t.firstElementChild;t;){var i=t.nextElementSibling;h(t,e),t=i}}"MutationObserver"in window&&(document.body?t():new MutationObserver(function(){document.body&&(this.disconnect(),t())}).observe(document,{childList:!0,subtree:!0}))}(Hi),Hi});
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//




;
