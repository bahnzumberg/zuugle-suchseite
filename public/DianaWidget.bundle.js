!(function (A, e) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
      ? define([], e)
      : "object" == typeof exports
        ? (exports.DianaWidget = e())
        : (A.DianaWidget = e());
})(self, () =>
  (() => {
    var A = {
        11: (A, e, t) => {
          "use strict";
          (t.r(e), t.d(e, { default: () => d }));
          var i = t(601),
            n = t.n(i),
            o = t(314),
            g = t.n(o),
            r = t(417),
            a = t.n(r),
            B = new URL(t(747), t.b),
            s = new URL(t(825), t.b),
            c = new URL(t(627), t.b),
            Q = g()(n()),
            C = a()(B),
            l = a()(s),
            E = a()(c);
          Q.push([
            A.id,
            `*,:after,:before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent;--tw-shadow:0 0 transparent;--tw-shadow-colored:0 0 transparent;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 transparent;--tw-ring-shadow:0 0 transparent;--tw-shadow:0 0 transparent;--tw-shadow-colored:0 0 transparent;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }/*! tailwindcss v3.4.18 | MIT License | https://tailwindcss.com*/*,:after,:before{border:0 solid #e5e7eb;box-sizing:border-box}:after,:before{--tw-content:""}:host,html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}hr{border-top-width:1px;color:inherit;height:0}abbr:where([title]){text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-size:1em;font-variation-settings:normal}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{border-collapse:collapse;border-color:inherit;text-indent:0}button,input,optgroup,select,textarea{color:inherit;font-family:inherit;font-feature-settings:inherit;font-size:100%;font-variation-settings:inherit;font-weight:inherit;letter-spacing:inherit;line-height:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0}fieldset,legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{color:#9ca3af;opacity:1}input::placeholder,textarea::placeholder{color:#9ca3af;opacity:1}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{height:auto;max-width:100%}[hidden]:where(:not([hidden=until-found])){display:none}.\\!container{width:100%!important}.container{width:100%}@media (min-width:640px){.\\!container{max-width:640px!important}.container{max-width:640px}}@media (min-width:768px){.\\!container{max-width:768px!important}.container{max-width:768px}}@media (min-width:1024px){.\\!container{max-width:1024px!important}.container{max-width:1024px}}@media (min-width:1280px){.\\!container{max-width:1280px!important}.container{max-width:1280px}}@media (min-width:1536px){.\\!container{max-width:1536px!important}.container{max-width:1536px}}.visible{visibility:visible}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.block{display:block}.inline{display:inline}.flex{display:flex}.hidden{display:none}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.resize{resize:both}.border{border-width:1px}.uppercase{text-transform:uppercase}.shadow{--tw-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);--tw-shadow-colored:0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);box-shadow:0 0 transparent,0 0 transparent,0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px -1px rgba(0,0,0,.1);box-shadow:var(--tw-ring-offset-shadow,0 0 transparent),var(--tw-ring-shadow,0 0 transparent),var(--tw-shadow)}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition{transition-duration:.15s;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(.4,0,.2,1)}@font-face{font-display:swap;font-family:DM Sans;font-style:normal;font-weight:400;src:url(${C}) format("ttf");unicode-range:u+0100-02ba,u+02bd-02c5,u+02c7-02cc,u+02ce-02d7,u+02dd-02ff,u+0304,u+0308,u+0329,u+1d00-1dbf,u+1e00-1e9f,u+1ef2-1eff,u+2020,u+20a0-20ab,u+20ad-20c0,u+2113,u+2c60-2c7f,u+a720-a7ff}@font-face{font-display:swap;font-family:DM Sans;font-style:normal;font-weight:400;src:url(${C}) format("ttf");unicode-range:u+00??,u+0131,u+0152-0153,u+02bb-02bc,u+02c6,u+02da,u+02dc,u+0304,u+0308,u+0329,u+2000-206f,u+20ac,u+2122,u+2191,u+2193,u+2212,u+2215,u+feff,u+fffd}.diana-container{--primary-color:#4285f4;--secondary-color:#ccc;--success-color:#28a745;--warning-color:#e5a83a;--error-color:#dc3545;--wait-color:#ff9500;--bg-apply-hover:color-mix(in srgb,var(--primary-color),#000 10%);--text-primary:#000;--text-secondary:#333;--text-tertiary:#666;--text-muted:#838383;--text-disabled:#999;--text-error:var(--error-color);--text-info:color-mix(in srgb,var(--primary-color),#000 30%);--text-warning:color-mix(in srgb,var(--warning-color),#000 40%);--icon-input-color:#656c6e;--bg-primary:#fff;--bg-secondary:#fafafa;--bg-tertiary:#f5f5f5;--bg-hover:#f0f0f0;--bg-error:color-mix(in srgb,var(--error-color) 10%,transparent);--bg-info:color-mix(in srgb,var(--primary-color),#fff 80%);--bg-transparent:hsla(0,0%,50%,.05);--bg-waiting-block:color-mix(in srgb,var(--wait-color) 8%,transparent);--border-primary:#e0e0e0;--border-secondary:#d3d3d3;--border-tertiary:#eaeaea;--border-error:color-mix(in srgb,var(--error-color) 20%,transparent);--border-info:color-mix(in srgb,var(--primary-color),#fff 60%);--shadow-verylight:rgba(0,0,0,.08);--shadow-light:rgba(0,0,0,.1);--shadow-medium:rgba(0,0,0,.15);--shadow-dark:rgba(0,0,0,.2);--shadow-gray:hsla(0,0%,100%,.3);font-family:DM Sans,sans-serif!important;height:100%;isolation:isolate;max-height:inherit;position:relative}.fatal-error-box,.fatal-info-box{border-radius:8px;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;height:100%;justify-content:center;padding:30px;text-align:center;width:100%}.fatal-error-box{background-color:var(--bg-error);border:1px solid var(--border-error)}.fatal-info-box{background-color:var(--bg-info);border:1px solid var(--border-info)}.fatal-error-box h3,.fatal-info-box h3{font-size:18px;font-weight:500;margin:0}.fatal-error-box p,.fatal-info-box p{font-size:14px;line-height:1.5;margin:0}.fatal-error-box h3.title-error{color:var(--text-error)}.fatal-error-box p{color:#58151c}.fatal-info-box h3.title-info{color:var(--text-info)}.fatal-info-box p{color:#1a4a8d}.share-error-reload-link{background-color:var(--primary-color);border-radius:5px;color:var(--bg-primary)!important;display:inline-block;font-weight:500;margin-top:15px;padding:8px 16px;-webkit-text-decoration:none!important;text-decoration:none!important;transition:background-color .2s ease}.share-error-reload-link:hover{background-color:var(--bg-apply-hover)}.fatal-info-box .share-error-reload-link{background-color:var(--text-info);color:var(--bg-primary)!important}.fatal-info-box .share-error-reload-link:hover{filter:brightness(90%)}.full-screen-loader{align-items:center;background-color:hsla(0,0%,100%,.8);color:var(--text-primary);display:flex;flex-direction:column;gap:15px;height:100%;justify-content:center;left:0;position:absolute;top:0;width:100%;z-index:9999}.full-screen-loader .loading-spinner{border:4px solid var(--shadow-light);border-top-color:var(--primary-color);height:40px;width:40px}.form-group{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}.form-label{color:var(--text-secondary);font-size:14px;font-weight:500;padding-left:2px}.input-wrapper{align-items:center;background-color:var(--bg-primary);border:1px solid var(--border-secondary);border-radius:8px;display:flex;position:relative;transition:border-color .2s ease,box-shadow .2s ease}.input-wrapper:focus-within{border-color:var(--primary-color);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary-color) 20%,transparent)}.input-wrapper .input-icon{color:var(--icon-input-color);height:20px;left:12px;pointer-events:none;position:absolute;width:20px}.input-wrapper input{background-color:transparent;border:none;border-radius:8px;color:var(--text-primary);font-family:DM Sans,sans-serif;font-size:16px;outline:none;padding:12px 12px 12px 40px;width:100%}.input-wrapper input::-moz-placeholder{color:var(--text-muted)}.input-wrapper input::placeholder{color:var(--text-muted)}.widget-header{align-items:center;background:var(--bg-primary);border-bottom:1px solid var(--border-primary);box-sizing:border-box;display:flex;flex-direction:row;justify-content:space-between;min-height:56px;padding:0 8px;width:100%}.widget-header-heading{border-left:none;border-right:none;color:var(--text-primary);flex-grow:1;font-family:DM Sans,sans-serif;font-size:16px;font-style:normal;font-weight:400;letter-spacing:.02em;line-height:120%;overflow:hidden;padding:18px 9px;text-align:center;text-overflow:ellipsis;white-space:nowrap}.widget-header-button{align-items:center;box-sizing:border-box;display:flex;flex:0 0 48px;gap:10px;height:100%;justify-content:center;padding:0;position:relative}.widget-header-button:first-child{justify-content:flex-start}.widget-header-button:last-child{justify-content:flex-end}.back-btn-arrow,.menu-btn-dots{align-items:center;background:none;border:none;border-radius:50%;color:var(--text-tertiary);cursor:pointer;display:flex;justify-content:center;padding:8px;transition:background-color .2s ease}.back-btn-arrow:hover,.menu-btn-dots:hover{background-color:var(--bg-hover)}.modal{align-items:center;background-color:transparent;display:none;font-family:DM Sans,sans-serif!important;height:100%;justify-content:center;margin:0;max-height:inherit;position:relative;width:100%}.modal.visible{display:flex!important}.modal-content{background-color:var(--bg-primary);border:0;border-radius:10px;box-shadow:0 4px 8px var(--shadow-dark);box-sizing:border-box;display:flex;flex-direction:column;height:100%;margin:0;max-height:inherit;max-width:470px;overflow-x:hidden;overflow-y:auto;position:relative;transition:all .3s ease-in-out;width:100%}.modal-content::-webkit-scrollbar{width:6px}.modal-content::-webkit-scrollbar-thumb{background-color:var(--border-secondary);border-radius:3px}.modal-content{scrollbar-color:var(--border-secondary) var(--bg-primary);scrollbar-width:none}.modal-page{box-sizing:border-box;display:none;flex-direction:column;flex-grow:1;flex-shrink:0;font-family:DM Sans,sans-serif!important;max-height:inherit;min-height:0;width:100%}.modal-page.active{display:flex!important}.content-page-body,.modal-body{display:flex;flex-direction:column;flex-grow:1;font-family:DM Sans,sans-serif!important;overflow-y:auto;padding:20px}.widget-footer{align-items:center;background-color:var(--bg-primary);border-top:1px solid var(--border-primary);bottom:0;box-sizing:border-box;display:flex;font-size:11px;gap:10px;height:24px;justify-content:center;max-height:inherit;padding:4px 0;position:sticky;width:100%;z-index:9}.widget-footer a{color:var(--primary-color)!important;-webkit-text-decoration:underline!important;text-decoration:underline!important}.widget-footer a:hover{color:var(--bg-apply-hover)!important;-webkit-text-decoration:none!important;text-decoration:none!important}.menu-dropdown{background-color:var(--bg-primary);border:1px solid var(--border-tertiary);border-radius:8px;box-shadow:0 4px 12px var(--shadow-medium);display:none;min-width:180px;position:absolute;right:0;top:calc(100% + 5px);z-index:2100}.menu-dropdown-item{align-items:center;color:var(--text-secondary);cursor:pointer;display:flex;font-size:14px;gap:12px;padding:10px 15px;-webkit-text-decoration:none;text-decoration:none;transition:background-color .2s ease}.menu-dropdown-item:hover{background-color:var(--bg-hover)}.menu-dropdown-item svg{color:var(--text-tertiary);flex-shrink:0;height:20px;width:20px}.menu-dropdown-item:first-child{border-top-left-radius:8px;border-top-right-radius:8px}.menu-dropdown-item:last-child{border-bottom-left-radius:8px;border-bottom-right-radius:8px}.menu-dropdown-item.disabled{color:var(--text-disabled);cursor:not-allowed;pointer-events:none}.menu-dropdown-item.disabled svg{color:var(--text-disabled)}.content-page-body{color:var(--text-secondary);font-size:14px;line-height:1.6}.content-page-body h2{color:var(--text-primary);font-size:18px;margin-bottom:10px;margin-top:0}.content-page-body p{margin-bottom:10px}.date-select-container{display:flex;flex-direction:column;gap:8px;width:100%}.date-select-container .form-label{color:var(--text-secondary);font-size:14px;font-weight:500;padding-left:2px}.date-select-container select{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:var(--bg-primary);background-image:url(${l}),url(${E});background-position:right 12px center,left 12px center;background-repeat:no-repeat;background-size:1em,20px;border:1px solid var(--border-secondary);border-radius:8px;color:var(--text-primary);cursor:pointer;font-family:DM Sans,sans-serif;font-size:16px;outline:none;padding:12px 40px;transition:border-color .2s ease,box-shadow .2s ease;width:100%}.date-select-container select:focus{border-color:var(--primary-color);box-shadow:0 0 0 2px color-mix(in srgb,var(--primary-color) 20%,transparent)}.debug-container{font-size:12px;margin:10px 20px 0}.debug-toggle{color:var(--primary-color);cursor:pointer;display:inline-block;font-weight:500;margin-bottom:5px;-webkit-text-decoration:underline;text-decoration:underline}.debug-toggle:hover{color:var(--bg-apply-hover)}.debug-content{background-color:var(--bg-tertiary);border:1px solid var(--border-primary);border-radius:4px;max-height:200px;overflow-y:auto;padding:10px}.debug-content pre{margin:0;white-space:pre-wrap;word-wrap:break-word;color:var(--text-secondary);font-family:monospace;font-size:11px}.disabled-by-session-expiry{opacity:.6}.session-expired-message{align-items:center;display:flex;flex-direction:column;gap:12px;padding:10px;text-align:center}.reload-button{background-color:var(--primary-color);border:none;border-radius:5px;color:var(--bg-primary);cursor:pointer;font-size:14px;font-weight:500;padding:8px 16px;transition:background-color .2s ease}.reload-button:hover{background-color:var(--bg-apply-hover)}.form-section{color:var(--text-muted);margin-bottom:15px;position:relative}.form-section p{font-size:14px;margin-bottom:5px}.input-container{position:relative}.suggestions-container{background-color:var(--bg-primary);border:1px solid var(--secondary-color);border-radius:5px;display:none;left:0;max-height:150px;overflow-y:auto;position:absolute;right:0;top:100%;z-index:1000}.suggestion-item{cursor:pointer;padding:10px}.suggestion-item:hover{background-color:var(--bg-hover)}#clearInputBtn:hover,#currentLocationBtn:hover{background-color:var(--bg-hover);border-radius:8px;transition:background-color .2s ease}.input-field{border:1px solid var(--border-primary);border-radius:5px;box-sizing:border-box;font-family:DM Sans,sans-serif!important;font-size:14px;padding:12px 40px!important;width:100%}.input-field.disabled{background-color:var(--bg-tertiary);color:var(--text-tertiary);cursor:not-allowed;pointer-events:none;--moz-user-select:none;--ms-user-select:none;--webkit-user-select:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}.input-icon,.input-icon-right{color:var(--icon-input-color);pointer-events:none;position:absolute;top:50%;transform:translateY(-50%)}.input-icon{left:12px}.input-icon-right{right:12px}.date-section-wrapper{align-items:flex-start;display:flex;gap:10px}.date-input-column{flex:1;min-width:0}.date-input-column.single{flex-basis:100%}.date-input-container{cursor:pointer;position:relative}.date-input-container.disabled{cursor:not-allowed;opacity:.7}.date-input-container.disabled .date-input{background-color:var(--bg-tertiary);pointer-events:none}.date-input-container.disabled .date-input-display{color:var(--text-disabled)}.date-input{align-items:center;background-color:var(--bg-primary);border:1px solid var(--border-primary);border-radius:5px;box-sizing:border-box;cursor:pointer;display:flex;padding:12px 40px!important;position:relative;width:100%}.date-input,.date-input-display{font-family:DM Sans,sans-serif!important}.date-input-display{color:var(--text-secondary);flex-grow:1;font-size:14px;pointer-events:none}.date-input-display.placeholder{color:var(--text-disabled)}.date-input-icon{left:12px}.date-input-arrow,.date-input-icon{color:var(--icon-input-color);pointer-events:none;position:absolute;top:50%;transform:translateY(-50%)}.date-input-arrow{right:12px}input[type=date].native-date-picker-single{cursor:pointer;display:none!important;font-family:DM Sans,sans-serif!important;height:100%;left:0;opacity:0;pointer-events:none;position:absolute;top:0;width:100%}.date-selector-buttons{display:flex;gap:8px;margin-bottom:5px}.date-selector-btn{align-items:center;background-color:transparent;border:1px solid var(--border-primary);border-radius:5px;color:var(--text-secondary);cursor:pointer;display:flex;font-family:DM Sans,sans-serif!important;font-size:14px;justify-content:center;line-height:1.2;min-width:0;padding:10px 12px;text-align:center;transition:background-color .2s ease,border-color .2s ease,color .2s ease}.date-selector-btn#dateBtnToday,.date-selector-btn#dateBtnTomorrow{flex:2}.date-selector-btn#dateBtnOther{flex:3;justify-content:space-between;position:relative}.date-selector-btn:hover{background-color:var(--bg-hover);border-color:var(--secondary-color)}.date-selector-btn.active{background-color:var(--primary-color);border-color:var(--primary-color);color:var(--bg-primary);font-weight:500}.date-selector-btn.active:hover{background-color:var(--bg-apply-hover);border-color:var(--bg-apply-hover)}#dateBtnOther #otherDateText{flex-grow:1;margin-right:5px;overflow:hidden;text-align:left;text-overflow:ellipsis;white-space:nowrap}#dateBtnOther .date-input-arrow{color:var(--text-secondary);flex-shrink:0;height:16px;position:static;stroke-width:2px;transform:none;width:16px}.date-selector-btn.active #dateBtnOther .date-input-arrow{color:var(--bg-primary);stroke:var(--bg-primary)}.form-footer{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}.form-footer button{width:100%}.btn{border:0;border-radius:4px;cursor:pointer;font-family:DM Sans,sans-serif!important;padding:10px 20px;transition:background-color .2s ease}.btn:disabled{cursor:not-allowed;opacity:.7}.apply-btn,button.calendar-footer-btn.calendar-apply-btn{background-color:var(--primary-color);color:var(--bg-primary)}.apply-btn:hover:not(:disabled){background-color:var(--bg-apply-hover)}.loading-spinner{animation:spin 1s ease-in-out infinite;border:2px solid var(--shadow-gray);border-radius:50%;border-top-color:var(--bg-primary);display:inline-block;height:1em;margin-right:.5em;vertical-align:middle;width:1em}@media(max-width:768px){.date-input-column:not(.single) input[type=date].native-date-picker-multiday{background-color:var(--bg-primary);border:1px solid var(--border-primary);border-radius:5px;box-sizing:border-box;color:var(--text-secondary);display:block!important;font-size:14px;height:auto;opacity:1;padding:12px 15px!important;pointer-events:all;position:relative;width:100%}.date-input-column:not(.single) .date-input{display:none!important}input[type=date]::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.6;padding:4px}}@media(min-width:769px){.date-input-column:not(.single) input[type=date].native-date-picker-multiday{display:none!important}.date-input-column:not(.single) .date-input{display:flex!important}input[type=date].native-date-picker-single{display:none!important;pointer-events:none!important}}.modal-body-result{background-color:var(--bg-secondary);display:flex;flex-direction:column;flex-grow:1;overflow:hidden;padding:0;position:relative}.results-content-area{flex-grow:1;height:100000px;overflow-y:auto}.collapsible-container{background-color:var(--bg-primary);border:1px solid var(--border-primary);border-radius:8px;box-shadow:0 1px 2px var(--shadow-light);height:100%;margin:12px 20px;max-height:100px;position:relative;transition:background-color .2s ease}.collapsible-container.expanded{height:-moz-fit-content;height:fit-content;max-height:-moz-fit-content;max-height:fit-content}.collapsible-container.has-summary{cursor:pointer}.collapsible-container.has-summary:hover{background-color:color-mix(in srgb,var(--bg-hover),#fff 50%)}.collapsible-header{align-items:center;display:flex;gap:10px;height:100%;padding:15px}.collapsible-content{display:none;overflow:hidden;padding:12px 15px}.middle-box-content{background-color:transparent;border:none;margin:0;padding:0}.accordion-icon{color:var(--text-tertiary);pointer-events:none;position:absolute;right:15px;top:75%;transform:translateY(-50%);transition:transform .3s ease,top .3s ease}.collapsible-container.expanded .collapsible-header{display:none}.collapsible-container.expanded .collapsible-content{display:block}.collapsible-container.expanded .accordion-icon{bottom:20px;top:auto;transform:rotate(180deg)}.summary-content-wrapper{align-items:flex-start;display:flex;flex-direction:column;font-size:13px;gap:4px;justify-content:center;line-height:1.4;min-height:24px;width:100%}.summary-placeholder{color:var(--text-muted);font-style:italic;text-align:left;width:100%}.summary-line-1{align-items:center;display:flex;gap:10px;justify-content:space-between;width:100%}.summary-line-1 strong{color:var(--text-primary)}.summary-line-1 strong,.summary-line-2{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.summary-line-2{color:var(--text-secondary);width:92%}.summary-line-3{color:var(--text-tertiary)}.summary-icons{align-items:center;display:flex;flex-shrink:0;gap:5px;justify-content:flex-end}.summary-icons svg{height:18px;width:18px}.bottom-bar-left{align-items:center;display:flex;gap:10px}.share-btn{background:none;border:none;color:var(--text-tertiary);cursor:pointer;display:block;padding:4px}.share-btn:hover{color:var(--text-primary)}.activity-date-display{background-color:var(--bg-info);border-radius:4px;box-shadow:0 1px 2px var(--shadow-light);color:var(--text-info);font-size:14px;font-weight:500;line-height:1.2;padding:3px 7px}#responseBox .connection-elements>div:first-child{scroll-margin-top:0}#responseBox-bottom .connection-elements>div:first-child{scroll-margin-top:-80px}.slider-wrapper{align-items:center;background-color:var(--bg-primary);position:sticky;top:0;z-index:9}.slider-wrapper,.slider-wrapper.top-slider-wrapper{border-bottom:1px solid var(--border-primary);padding:5px 0}.slider-wrapper.etc{border-bottom:none;padding-bottom:0;padding-top:0;top:0}.slider-wrapper.slider-wrap-fixed{border-bottom:none;border-top:1px solid var(--border-primary);bottom:24px;z-index:8}.slider{font-family:DM Sans,sans-serif!important;-webkit-overflow-scrolling:touch;align-items:center;display:flex;overflow-x:auto;padding:0 10px;scroll-behavior:smooth;scroll-snap-type:x mandatory;scrollbar-width:thin;white-space:nowrap}.slider::-webkit-scrollbar{display:none}.slider-date-separator{align-items:center;border-left:1px solid var(--border-secondary);color:var(--text-tertiary);display:flex;font-size:11px;font-weight:500;height:48px;margin:0 4px 0 2px;padding:5px 4px;transform:rotate(180deg);white-space:nowrap;writing-mode:vertical-rl}.slider button,.slider-date-separator{flex-shrink:0;scroll-snap-align:start;text-align:center}.slider button{background:var(--bg-primary);border:1px solid var(--secondary-color);border-radius:8px;box-shadow:none;color:var(--text-primary);cursor:pointer;display:inline-block;font-family:DM Sans,sans-serif!important;line-height:1.3;margin:5px 2px;min-width:95px;padding:5px;transition:border-color .1s ease,background-color .1s ease,opacity .2s ease}.slider button.disabled{cursor:not-allowed;opacity:.5;pointer-events:none}.slider button:hover{border-color:var(--text-tertiary)}.slider button.active-time{background:color-mix(in srgb,var(--primary-color),#fff 88%);border-color:var(--primary-color);border-width:2px;box-shadow:none;color:var(--text-primary)}.slider button.active-time:hover{border-color:var(--primary-color)}.slider button .slider-button-details{align-items:center;color:var(--text-tertiary);display:flex;font-size:12px;justify-content:space-between;padding:0 4px;width:100%}.slider button .duration-dot{border-radius:50%;flex-shrink:0;height:8px;width:8px}.slider button .dot-too-short{background-color:var(--error-color)}.slider button .dot-too-long{background-color:var(--primary-color)}.slider button .transfers-group{align-items:center;display:flex;gap:2px}.middle-box{background:var(--bg-info);border:1px solid var(--border-primary);border-radius:8px;box-shadow:0 1px 2px var(--shadow-light);color:var(--text-secondary);font-size:14px;line-height:1.4;margin:12px 20px;min-height:-moz-max-content;min-height:max-content;padding:12px 15px}.middle-box:first-of-type{margin-top:12px}.middle-box:last-of-type{margin-bottom:12px}#activity-time{background:var(--bg-info);margin:12px 20px;padding:12px 15px;scroll-margin:270px}.activity-time-card{display:flex;gap:15px;min-height:70px}.activity-timeline{flex-shrink:0;position:relative;width:10px}.timeline-line{background-color:var(--border-secondary);bottom:10px;left:7px;position:absolute;top:10px;width:3px}.timeline-dot{background-color:var(--primary-color);border-radius:50%;box-sizing:border-box;height:5px;left:6px;position:absolute;width:5px}.timeline-dot.top{top:10px;transform:translateY(-50%)}.timeline-dot.bottom{bottom:10px;transform:translateY(50%)}.activity-time-content{display:flex;flex-direction:column;flex-grow:1;justify-content:space-between;min-height:70px;padding:0}.activity-main-info{display:flex;flex-direction:column;gap:4px;padding:10px 0}.activity-title{color:var(--text-primary);font-size:16px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.activity-duration-line{align-items:center;color:var(--text-secondary);display:flex;flex-wrap:wrap;font-size:14px;gap:8px}.activity-duration-warning-wrapper{align-items:center;display:flex;font-size:13px;font-weight:500;gap:5px}.warning-icon-wrapper{align-items:center;display:inline-flex;gap:5px;position:relative}.warning-icon-wrapper .warning-tooltip{background-color:var(--text-primary);border-radius:6px;bottom:150%;box-shadow:0 2px 4px var(--shadow-medium);color:var(--bg-primary);cursor:help;font-size:12px;font-weight:400;left:50%;line-height:1.4;max-width:200px;opacity:0;padding:8px 12px;position:absolute;text-align:center;transform:translateX(-50%);transition:opacity .3s;visibility:hidden;width:-moz-max-content;width:max-content;z-index:10}.warning-icon-wrapper .warning-tooltip:after{border-color:var(--text-primary) transparent transparent transparent;border-style:solid;border-width:5px;content:"";left:50%;margin-left:-5px;position:absolute;top:100%}.warning-icon-wrapper:hover .warning-tooltip{opacity:1;visibility:visible}.middle-box-content .connection-elements{border-left:3px solid var(--border-tertiary);margin-left:7px;padding-left:15px;position:relative}.middle-box-content .connection-element{margin-bottom:15px}.middle-box-content .connection-element:last-child{margin-bottom:0}.middle-box-content .connection-element-content{position:relative}.connection-leg-date-display{background-color:var(--bg-info);border-radius:4px;box-shadow:0 1px 2px var(--shadow-light);color:var(--text-info);font-size:11px;font-weight:500;line-height:1.3;padding:3px 7px;position:absolute;right:8px;text-align:right;top:50%;transform:translateY(-50%);white-space:nowrap;z-index:1}.element-time-location-group{align-items:baseline;display:flex;flex-wrap:wrap;gap:8px;margin-bottom:3px}.element-time-location-group .element-time{color:var(--text-muted);flex-shrink:0;font-size:14px}.element-time-location-group .element-location{color:var(--text-primary);font-size:14px;font-weight:500}.element-time-location-group .element-platform{background-color:var(--bg-tertiary);border:1px solid var(--border-primary);border-radius:4px;color:var(--text-secondary);font-size:11px;font-weight:500;padding:1px 5px}.element-icon{align-items:center;display:flex;height:16px;justify-content:center;width:16px}.middle-box-content .element-icon svg{height:100%;min-height:16px;min-width:16px;width:100%}.middle-box-content .element-duration{color:var(--text-primary);font-family:DM Sans,sans-serif;font-size:12px;letter-spacing:.02em;line-height:120%;padding:4px}.middle-box-content .element-vehicle{color:var(--primary-color);font-size:13px}.middle-box-content .element-circle{background-color:var(--primary-color);border-radius:50%;height:5px;left:-19px;position:absolute;top:5px;width:5px;z-index:0}.middle-box-content .element-circle-wrapper{min-height:10px}.middle-box-content .waiting-block .element-circle{display:none}div#eleCont{align-items:center;background-color:var(--bg-tertiary);border-radius:8px;display:flex;flex-direction:row;gap:4px;min-height:30px;padding:4px 8px;position:relative;width:-moz-fit-content;width:fit-content}.waiting-block{background:var(--bg-waiting-block);border-radius:6px;margin:10px 0;padding:8px 10px 8px 25px;position:relative}.waiting-block .element-time{color:var(--text-primary);font-size:13px;font-weight:500;margin-bottom:4px}.waiting-block #eleCont{background:transparent}.waiting-block .element-icon{top:8px}.error-message{background-color:var(--bg-error);border:1px solid var(--border-error);border-radius:6px;color:var(--text-error)}.error-message,.info-message{font-size:14px;margin:10px 20px;padding:10px 15px;text-align:center}.info-message{background-color:var(--bg-info);border:1px solid var(--border-info);border-radius:6px;color:var(--text-info);line-height:1.4}.connection-details-header{align-items:center;display:flex;gap:10px;justify-content:space-between;margin-bottom:15px}.ticket-button{align-items:center;background-color:var(--primary-color);border:none;border-radius:6px;color:var(--bg-primary);cursor:pointer;display:flex;font-size:13px;font-weight:500;gap:6px;justify-content:center;min-height:34px;min-width:90px;padding:8px 12px;transition:background-color .2s ease;white-space:nowrap}.ticket-button:hover{background-color:var(--bg-apply-hover)}.ticket-button svg{height:16px;width:16px}.ticket-button .loading-spinner-small{animation:spin 1s ease-in-out infinite;border:2px solid hsla(0,0%,100%,.3);border-radius:50%;border-top-color:#fff;display:inline-block;height:16px;vertical-align:middle;width:16px}@keyframes spin{to{transform:rotate(1turn)}}.summary-line-3{align-items:center;display:flex;justify-content:space-between;width:100%}.live-indicator{align-items:center;color:var(--success-color);display:flex;font-size:12px;font-weight:500;gap:5px;margin-right:40px}.live-indicator:before{animation:pulse 2s infinite;background-color:var(--success-color);border-radius:50%;content:"";display:inline-block;height:8px;width:8px}.live-indicator-details{align-items:center;background-color:color-mix(in srgb,var(--success-color) 10%,transparent);border:1px solid color-mix(in srgb,var(--success-color) 20%,transparent);border-radius:6px;color:var(--success-color);display:flex;flex-grow:1;font-size:13px;font-weight:500;gap:8px;padding:8px 12px}.live-indicator-details .live-dot{animation:pulse 2s infinite;background-color:var(--success-color);border-radius:50%;flex-shrink:0;height:10px;width:10px}@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--success-color) 70%,transparent)}70%{box-shadow:0 0 0 10px color-mix(in srgb,var(--success-color) 0%,transparent)}to{box-shadow:0 0 0 0 color-mix(in srgb,var(--success-color) 0%,transparent)}}.connection-element-alert{background-color:color-mix(in srgb,var(--warning-color) 10%,var(--bg-primary));border:1px solid color-mix(in srgb,var(--warning-color) 30%,transparent);border-radius:6px;cursor:pointer;display:flex;flex-direction:column;font-size:13px;gap:4px;line-height:1.4;margin-top:8px;padding:8px 12px}.connection-element-alert:hover{background-color:color-mix(in srgb,var(--warning-color) 15%,var(--bg-primary));border-color:color-mix(in srgb,var(--warning-color) 60%,transparent)}.alert-header{color:var(--warning-color);font-size:12px;font-weight:500;gap:6px}.alert-header,.alert-icon{align-items:center;display:flex}.alert-icon{flex-shrink:0;height:14px;justify-content:center;width:14px}.alert-icon svg{height:100%;width:100%}.alert-header-text{color:var(--text-primary);font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.alert-header-text.expanded{overflow:visible;white-space:normal}.alert-description{color:var(--text-secondary);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.alert-description.expanded{overflow:visible;white-space:normal}.alert-description a{color:var(--primary-color);-webkit-text-decoration:none;text-decoration:none}.alert-description a:hover{-webkit-text-decoration:underline;text-decoration:underline}.range-calendar-overlay{align-items:center;background-color:rgba(0,0,0,.5);box-sizing:border-box;display:none;height:100%;justify-content:center;left:0;padding:20px;position:absolute;top:0;width:100%;z-index:2000}.range-calendar-modal{background-color:var(--bg-primary);border-radius:10px;box-shadow:0 5px 15px rgba(0,0,0,.3);display:flex;flex-direction:column;font-family:DM Sans,sans-serif!important;max-width:350px;min-width:280px;position:relative;width:auto}.range-calendar-modal.single-month-range{max-width:380px}.range-calendar-header{align-items:center;border-bottom:1px solid var(--border-tertiary);display:flex;justify-content:space-between;padding:10px 15px}.range-calendar-header h3{color:var(--text-primary);font-size:16px;font-weight:500;margin:0}.range-calendar-close-btn{background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:24px;line-height:1;padding:0 5px}.range-calendar-close-btn:hover{color:var(--text-primary)}.range-calendar-body{display:flex;justify-content:center;padding:10px}.range-calendar-instance{border:1px solid var(--border-tertiary);border-radius:8px;box-sizing:border-box;flex:1;max-width:320px;min-width:280px;padding:10px}.range-calendar-instance .calendar-nav{align-items:center;display:flex;justify-content:space-between;margin-bottom:5px;padding:5px 0}.range-calendar-instance .calendar-nav-btn{background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:16px;padding:5px}.range-calendar-instance .calendar-nav-btn:hover{color:var(--text-primary)}.range-calendar-instance .calendar-month-year{flex-grow:1;font-size:14px;font-weight:500;text-align:center}.range-calendar-instance .calendar-grid{display:grid;grid-gap:0;gap:0;grid-template-columns:repeat(7,1fr);padding:2px 0}.range-calendar-instance .calendar-day-header{color:var(--text-disabled);font-size:11px;font-weight:500;padding:3px 0;text-align:center}.range-calendar-instance .calendar-day{align-items:center;border-radius:0;box-sizing:border-box;color:var(--text-primary);cursor:pointer!important;display:flex;font-size:12px;height:32px;justify-content:center;margin:0;position:relative;text-align:center;transition:background-color .2s ease,color .2s ease;width:100%}.range-calendar-instance .calendar-day.empty{background:none!important;border-radius:0!important;cursor:default}.range-calendar-instance .calendar-day:not(.empty):not(.disabled):hover{background-color:var(--bg-hover);border-radius:50%}.range-calendar-instance .calendar-day.today{font-weight:700}.range-calendar-instance .calendar-day.today:after{background-color:var(--primary-color);border-radius:50%;bottom:4px;content:"";display:block;height:4px;left:50%;position:absolute;transform:translateX(-50%);width:4px;z-index:1}.range-calendar-instance .calendar-day.today.end-date:after,.range-calendar-instance .calendar-day.today.start-date:after{background-color:var(--bg-primary)}.range-calendar-instance .calendar-day.today.in-range:after{background-color:var(--text-info)}.range-calendar-instance .calendar-day.disabled{background:none!important;border-radius:0!important;color:var(--secondary-color);cursor:not-allowed;-webkit-text-decoration:line-through;text-decoration:line-through}.range-calendar-instance .calendar-day.disabled:hover{background:none!important}.range-calendar-instance .calendar-day.in-range{background-color:var(--bg-info)!important;border-radius:0!important;color:var(--text-info)!important}.range-calendar-instance .calendar-day.start-date{background-color:var(--primary-color)!important;border-radius:16px 0 0 16px!important;color:var(--bg-primary)!important;font-weight:700}.range-calendar-instance .calendar-day.end-date{background-color:var(--primary-color)!important;border-radius:0 16px 16px 0!important;color:var(--bg-primary)!important;font-weight:700}.range-calendar-instance .calendar-day.start-date.end-date{border-radius:16px!important}.range-calendar-instance .calendar-day.end-date:hover,.range-calendar-instance .calendar-day.start-date:hover{filter:brightness(90%)}.range-calendar-instance .calendar-day.in-range:hover{filter:brightness(95%)}.range-calendar-footer{border-top:1px solid var(--border-tertiary);display:flex;gap:10px;justify-content:flex-end;padding:10px 15px}.range-calendar-footer .calendar-footer-btn{background-color:var(--bg-primary);border:1px solid var(--border-secondary);border-radius:4px;color:var(--text-secondary);cursor:pointer;font-size:12px;padding:8px 15px}.range-calendar-footer .calendar-footer-btn:hover{background-color:var(--bg-hover)}.range-calendar-footer .calendar-footer-btn.calendar-apply-btn{background-color:var(--primary-color);border-color:var(--primary-color);color:var(--bg-primary)}.range-calendar-footer .calendar-footer-btn.calendar-apply-btn:hover{background-color:var(--bg-apply-hover)}@media(max-width:768px){.range-calendar-modal{max-width:95%;width:95%}.range-calendar-instance{min-width:0;min-width:auto;width:100%}}.diana-container.calendar-container{background:var(--bg-primary);border-radius:8px;box-shadow:0 4px 12px var(--shadow-medium);display:block;font-family:DM Sans,sans-serif!important;height:-moz-fit-content;height:fit-content;min-width:280px;position:absolute;z-index:1050}.calendar-header{align-items:center;display:flex;justify-content:center;padding:5px}.calendar-title{color:var(--text-primary);font-size:16px;font-weight:500}.calendar-body{border:1px solid var(--border-tertiary);border-radius:8px;margin:10px;padding:10px}.calendar-nav{align-items:center;display:flex;justify-content:space-between;margin-bottom:5px;padding:5px 10px}.calendar-month-year{font-size:14px;font-weight:500}.calendar-nav-btn{background:0 0;border:0;color:var(--text-tertiary);cursor:pointer;font-size:16px;padding:5px}.calendar-grid{display:grid;grid-gap:3px;gap:3px;grid-template-columns:repeat(7,1fr);padding:5px 0}.calendar-day-header{color:var(--text-disabled);font-size:12px;font-weight:500;padding:3px 0;text-align:center}.calendar-day{align-items:center;border-radius:50%;color:var(--text-primary);cursor:pointer!important;display:flex;font-size:12px;height:30px;justify-content:center;margin:0 auto;text-align:center;transition:background-color .2s ease,color .2s ease;width:30px}.calendar-day.empty{background:none;cursor:default}.calendar-day:not(.empty):hover{background-color:var(--bg-hover)}.calendar-day.today{border:1px solid var(--primary-color);font-weight:700}.calendar-day.selected{background-color:var(--primary-color);color:var(--bg-primary);font-weight:700}.calendar-day.selected:hover{background-color:var(--bg-apply-hover)}.calendar-day.disabled{background:none;color:var(--secondary-color);cursor:not-allowed}.calendar-footer{border-top:1px solid var(--border-tertiary);display:flex;gap:10px;justify-content:flex-end;padding:10px}.calendar-footer-btn{background-color:var(--bg-primary);border:1px solid var(--border-secondary);border-radius:4px;color:var(--text-secondary);cursor:pointer;font-size:12px;padding:8px 15px}.calendar-footer-btn.calendar-apply-btn{background-color:var(--primary-color);border-color:var(--primary-color);color:var(--bg-primary)}.calendar-footer-btn:hover{background-color:var(--bg-hover)}.calendar-footer-btn.calendar-apply-btn:hover{background-color:var(--bg-apply-hover)}.calendar-day.fixed-date{background-color:#e9ecef!important;border:1px solid #ced4da;color:#6c757d!important;cursor:not-allowed!important;font-weight:700}.calendar-day.fixed-date.end-date,.calendar-day.fixed-date.selected,.calendar-day.fixed-date.start-date{background-color:#adb5bd!important;color:#fff!important}.calendar-day.fixed-date:hover{background-color:#e9ecef!important}`,
            "",
          ]);
          const d = Q;
        },
        16: (A, e, t) => {
          "use strict";
          function i(A) {
            const { t: e, dropdownId: t, isShareDisabled: i = !1 } = A;
            return `\n        <div class="menu-dropdown" id="${t}" style="display: none;">\n            <a href="#" class="menu-dropdown-item ${i ? "disabled" : ""}" id="shareMenuItem">\n                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6904 16.3431 22 18 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M8.59003 13.51L15.42 17.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M15.41 6.51001L8.59003 10.49" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>\n                <span>${e("share")}</span>\n            </a>\n            <a href="#" class="menu-dropdown-item" data-content-key="help">\n                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor"/>\n                </svg>\n                <span>${e("menu.helpAndSupport")}</span>\n            </a>\n            <a href="https://zuugle-services.com/en/imprint/" target="_blank" rel="noopener noreferrer" class="menu-dropdown-item" id="imprintMenuItem">\n                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM11 17.93c-3.14-.9-5-4.04-5-7.93v-3.69l5-2.25v13.87zM18 10c0 3.89-1.86 7.03-5 7.93V8.1l5-2.25v4.15z" fill="currentColor"/>\n                </svg>\n                <span>${e("menu.imprint")}</span>\n            </a>\n        </div>\n    `;
          }
          (t.r(e), t.d(e, { getMenuDropdownHTML: () => i }));
        },
        79: (A, e, t) => {
          "use strict";
          (t.r(e), t.d(e, { getResultsPageTemplateHTML: () => o }));
          var i = t(771),
            n = t(16);
          function o(A) {
            const { config: e, t } = A,
              o = (0, n.getMenuDropdownHTML)({
                t,
                dropdownId: "resultsMenuDropdown",
                isShareDisabled: !1,
              });
            return `\n      <div id="resultsPage" class="modal-page">\n        <div class="modal-body-result">\n            <div id="resultsErrorContainer" class="error-message" style="display: none" role="alert"></div>\n            <div id="resultsDebugContainer" class="debug-container" style="display: none;"></div>\n\n            \x3c!-- Persistent Header --\x3e\n            <div class="slider-wrapper etc">\n                ${(0, i.getWidgetHeaderHTML)({ t, title: e.activityName, showBackButton: !0, backButtonId: "backBtn", menuDropdownHTML: o })}\n                <div class="top-slider-wrapper">\n                    <div class="slider" id="topSlider" role="group" aria-label="${t("ariaLabels.topSlider")}"></div>\n                </div>\n            </div>\n\n            \x3c!-- Container for Toggled Content --\x3e\n            <div class="results-content-area">\n                <div class="collapsible-container" id="collapsibleToActivity">\n                    <div class="collapsible-header">\n                        <div class="summary-content-wrapper">\n                            \x3c!-- Populated by JS --\x3e\n                        </div>\n                    </div>\n                    <div class="collapsible-content">\n                        <div class="middle-box-content" id="responseBox" aria-live="polite"></div>\n                    </div>\n                    <svg class="accordion-icon" width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path d="m16.354 5.075-7.855 7.854L.646 5.075l.707-.707 7.145 7.146 7.148-7.147z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                    </svg>\n                </div>\n\n                <div id="activity-time" class="middle-box">${e.activityName}</div>\n\n                <div class="collapsible-container" id="collapsibleFromActivity">\n                    <div class="collapsible-header">\n                        <div class="summary-content-wrapper">\n                            \x3c!-- Populated by JS --\x3e\n                        </div>\n                    </div>\n                    <div class="collapsible-content">\n                        <div class="middle-box-content" id="responseBox-bottom" aria-live="polite"></div>\n                    </div>\n                    <svg class="accordion-icon" width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path d="m16.354 5.075-7.855 7.854L.646 5.075l.707-.707 7.145 7.146 7.148-7.147z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                    </svg>\n                </div>\n            </div>\n\n            \x3c!-- Persistent Footer --\x3e\n            <div class="slider-wrapper slider-wrap-fixed">\n                <div class="slider" id="bottomSlider" role="group" aria-label="${t("ariaLabels.bottomSlider")}"></div>\n            </div>\n            <div class="widget-footer"><a href="https://zuugle-services.com" target="_new">powered by Zuugle Services</a></div>\n        </div>\n      </div>\n    `;
          }
        },
        97: (A, e, t) => {
          "use strict";
          t.d(e, { c9: () => Ei });
          class i extends Error {}
          class n extends i {
            constructor(A) {
              super(`Invalid DateTime: ${A.toMessage()}`);
            }
          }
          class o extends i {
            constructor(A) {
              super(`Invalid Interval: ${A.toMessage()}`);
            }
          }
          class g extends i {
            constructor(A) {
              super(`Invalid Duration: ${A.toMessage()}`);
            }
          }
          class r extends i {}
          class a extends i {
            constructor(A) {
              super(`Invalid unit ${A}`);
            }
          }
          class B extends i {}
          class s extends i {
            constructor() {
              super("Zone is an abstract class");
            }
          }
          const c = "numeric",
            Q = "short",
            C = "long",
            l = { year: c, month: c, day: c },
            E = { year: c, month: Q, day: c },
            d = { year: c, month: Q, day: c, weekday: Q },
            w = { year: c, month: C, day: c },
            D = { year: c, month: C, day: c, weekday: C },
            h = { hour: c, minute: c },
            I = { hour: c, minute: c, second: c },
            u = { hour: c, minute: c, second: c, timeZoneName: Q },
            v = { hour: c, minute: c, second: c, timeZoneName: C },
            f = { hour: c, minute: c, hourCycle: "h23" },
            M = { hour: c, minute: c, second: c, hourCycle: "h23" },
            m = {
              hour: c,
              minute: c,
              second: c,
              hourCycle: "h23",
              timeZoneName: Q,
            },
            Y = {
              hour: c,
              minute: c,
              second: c,
              hourCycle: "h23",
              timeZoneName: C,
            },
            p = { year: c, month: c, day: c, hour: c, minute: c },
            y = { year: c, month: c, day: c, hour: c, minute: c, second: c },
            P = { year: c, month: Q, day: c, hour: c, minute: c },
            F = { year: c, month: Q, day: c, hour: c, minute: c, second: c },
            G = { year: c, month: Q, day: c, weekday: Q, hour: c, minute: c },
            H = {
              year: c,
              month: C,
              day: c,
              hour: c,
              minute: c,
              timeZoneName: Q,
            },
            L = {
              year: c,
              month: C,
              day: c,
              hour: c,
              minute: c,
              second: c,
              timeZoneName: Q,
            },
            b = {
              year: c,
              month: C,
              day: c,
              weekday: C,
              hour: c,
              minute: c,
              timeZoneName: C,
            },
            U = {
              year: c,
              month: C,
              day: c,
              weekday: C,
              hour: c,
              minute: c,
              second: c,
              timeZoneName: C,
            };
          class S {
            get type() {
              throw new s();
            }
            get name() {
              throw new s();
            }
            get ianaName() {
              return this.name;
            }
            get isUniversal() {
              throw new s();
            }
            offsetName(A, e) {
              throw new s();
            }
            formatOffset(A, e) {
              throw new s();
            }
            offset(A) {
              throw new s();
            }
            equals(A) {
              throw new s();
            }
            get isValid() {
              throw new s();
            }
          }
          let z = null;
          class x extends S {
            static get instance() {
              return (null === z && (z = new x()), z);
            }
            get type() {
              return "system";
            }
            get name() {
              return new Intl.DateTimeFormat().resolvedOptions().timeZone;
            }
            get isUniversal() {
              return !1;
            }
            offsetName(A, { format: e, locale: t }) {
              return ne(A, e, t);
            }
            formatOffset(A, e) {
              return ae(this.offset(A), e);
            }
            offset(A) {
              return -new Date(A).getTimezoneOffset();
            }
            equals(A) {
              return "system" === A.type;
            }
            get isValid() {
              return !0;
            }
          }
          const k = new Map(),
            T = {
              year: 0,
              month: 1,
              day: 2,
              era: 3,
              hour: 4,
              minute: 5,
              second: 6,
            },
            O = new Map();
          class N extends S {
            static create(A) {
              let e = O.get(A);
              return (void 0 === e && O.set(A, (e = new N(A))), e);
            }
            static resetCache() {
              (O.clear(), k.clear());
            }
            static isValidSpecifier(A) {
              return this.isValidZone(A);
            }
            static isValidZone(A) {
              if (!A) return !1;
              try {
                return (
                  new Intl.DateTimeFormat("en-US", { timeZone: A }).format(),
                  !0
                );
              } catch (A) {
                return !1;
              }
            }
            constructor(A) {
              (super(), (this.zoneName = A), (this.valid = N.isValidZone(A)));
            }
            get type() {
              return "iana";
            }
            get name() {
              return this.zoneName;
            }
            get isUniversal() {
              return !1;
            }
            offsetName(A, { format: e, locale: t }) {
              return ne(A, e, t, this.name);
            }
            formatOffset(A, e) {
              return ae(this.offset(A), e);
            }
            offset(A) {
              if (!this.valid) return NaN;
              const e = new Date(A);
              if (isNaN(e)) return NaN;
              const t = (function (A) {
                let e = k.get(A);
                return (
                  void 0 === e &&
                    ((e = new Intl.DateTimeFormat("en-US", {
                      hour12: !1,
                      timeZone: A,
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      era: "short",
                    })),
                    k.set(A, e)),
                  e
                );
              })(this.name);
              let [i, n, o, g, r, a, B] = t.formatToParts
                ? (function (A, e) {
                    const t = A.formatToParts(e),
                      i = [];
                    for (let A = 0; A < t.length; A++) {
                      const { type: e, value: n } = t[A],
                        o = T[e];
                      "era" === e
                        ? (i[o] = n)
                        : zA(o) || (i[o] = parseInt(n, 10));
                    }
                    return i;
                  })(t, e)
                : (function (A, e) {
                    const t = A.format(e).replace(/\u200E/g, ""),
                      i =
                        /(\d+)\/(\d+)\/(\d+) (AD|BC),? (\d+):(\d+):(\d+)/.exec(
                          t,
                        ),
                      [, n, o, g, r, a, B, s] = i;
                    return [g, n, o, r, a, B, s];
                  })(t, e);
              "BC" === g && (i = 1 - Math.abs(i));
              let s = +e;
              const c = s % 1e3;
              return (
                (s -= c >= 0 ? c : 1e3 + c),
                (Ae({
                  year: i,
                  month: n,
                  day: o,
                  hour: 24 === r ? 0 : r,
                  minute: a,
                  second: B,
                  millisecond: 0,
                }) -
                  s) /
                  6e4
              );
            }
            equals(A) {
              return "iana" === A.type && A.name === this.name;
            }
            get isValid() {
              return this.valid;
            }
          }
          let J = {};
          const R = new Map();
          function j(A, e = {}) {
            const t = JSON.stringify([A, e]);
            let i = R.get(t);
            return (
              void 0 === i &&
                ((i = new Intl.DateTimeFormat(A, e)), R.set(t, i)),
              i
            );
          }
          const W = new Map(),
            K = new Map();
          let V = null;
          const X = new Map();
          function Z(A) {
            let e = X.get(A);
            return (
              void 0 === e &&
                ((e = new Intl.DateTimeFormat(A).resolvedOptions()),
                X.set(A, e)),
              e
            );
          }
          const q = new Map();
          function _(A, e, t, i) {
            const n = A.listingMode();
            return "error" === n ? null : "en" === n ? t(e) : i(e);
          }
          class $ {
            constructor(A, e, t) {
              ((this.padTo = t.padTo || 0), (this.floor = t.floor || !1));
              const { padTo: i, floor: n, ...o } = t;
              if (!e || Object.keys(o).length > 0) {
                const e = { useGrouping: !1, ...t };
                (t.padTo > 0 && (e.minimumIntegerDigits = t.padTo),
                  (this.inf = (function (A, e = {}) {
                    const t = JSON.stringify([A, e]);
                    let i = W.get(t);
                    return (
                      void 0 === i &&
                        ((i = new Intl.NumberFormat(A, e)), W.set(t, i)),
                      i
                    );
                  })(A, e)));
              }
            }
            format(A) {
              if (this.inf) {
                const e = this.floor ? Math.floor(A) : A;
                return this.inf.format(e);
              }
              return WA(this.floor ? Math.floor(A) : ZA(A, 3), this.padTo);
            }
          }
          class AA {
            constructor(A, e, t) {
              let i;
              if (
                ((this.opts = t),
                (this.originalZone = void 0),
                this.opts.timeZone)
              )
                this.dt = A;
              else if ("fixed" === A.zone.type) {
                const e = (A.offset / 60) * -1,
                  t = e >= 0 ? `Etc/GMT+${e}` : `Etc/GMT${e}`;
                0 !== A.offset && N.create(t).valid
                  ? ((i = t), (this.dt = A))
                  : ((i = "UTC"),
                    (this.dt =
                      0 === A.offset
                        ? A
                        : A.setZone("UTC").plus({ minutes: A.offset })),
                    (this.originalZone = A.zone));
              } else
                "system" === A.zone.type
                  ? (this.dt = A)
                  : "iana" === A.zone.type
                    ? ((this.dt = A), (i = A.zone.name))
                    : ((i = "UTC"),
                      (this.dt = A.setZone("UTC").plus({ minutes: A.offset })),
                      (this.originalZone = A.zone));
              const n = { ...this.opts };
              ((n.timeZone = n.timeZone || i), (this.dtf = j(e, n)));
            }
            format() {
              return this.originalZone
                ? this.formatToParts()
                    .map(({ value: A }) => A)
                    .join("")
                : this.dtf.format(this.dt.toJSDate());
            }
            formatToParts() {
              const A = this.dtf.formatToParts(this.dt.toJSDate());
              return this.originalZone
                ? A.map((A) => {
                    if ("timeZoneName" === A.type) {
                      const e = this.originalZone.offsetName(this.dt.ts, {
                        locale: this.dt.locale,
                        format: this.opts.timeZoneName,
                      });
                      return { ...A, value: e };
                    }
                    return A;
                  })
                : A;
            }
            resolvedOptions() {
              return this.dtf.resolvedOptions();
            }
          }
          class eA {
            constructor(A, e, t) {
              ((this.opts = { style: "long", ...t }),
                !e &&
                  TA() &&
                  (this.rtf = (function (A, e = {}) {
                    const { base: t, ...i } = e,
                      n = JSON.stringify([A, i]);
                    let o = K.get(n);
                    return (
                      void 0 === o &&
                        ((o = new Intl.RelativeTimeFormat(A, e)), K.set(n, o)),
                      o
                    );
                  })(A, t)));
            }
            format(A, e) {
              return this.rtf
                ? this.rtf.format(A, e)
                : (function (A, e, t = "always", i = !1) {
                    const n = {
                        years: ["year", "yr."],
                        quarters: ["quarter", "qtr."],
                        months: ["month", "mo."],
                        weeks: ["week", "wk."],
                        days: ["day", "day", "days"],
                        hours: ["hour", "hr."],
                        minutes: ["minute", "min."],
                        seconds: ["second", "sec."],
                      },
                      o = -1 === ["hours", "minutes", "seconds"].indexOf(A);
                    if ("auto" === t && o) {
                      const t = "days" === A;
                      switch (e) {
                        case 1:
                          return t ? "tomorrow" : `next ${n[A][0]}`;
                        case -1:
                          return t ? "yesterday" : `last ${n[A][0]}`;
                        case 0:
                          return t ? "today" : `this ${n[A][0]}`;
                      }
                    }
                    const g = Object.is(e, -0) || e < 0,
                      r = Math.abs(e),
                      a = 1 === r,
                      B = n[A],
                      s = i ? (a ? B[1] : B[2] || B[1]) : a ? n[A][0] : A;
                    return g ? `${r} ${s} ago` : `in ${r} ${s}`;
                  })(e, A, this.opts.numeric, "long" !== this.opts.style);
            }
            formatToParts(A, e) {
              return this.rtf ? this.rtf.formatToParts(A, e) : [];
            }
          }
          const tA = { firstDay: 1, minimalDays: 4, weekend: [6, 7] };
          class iA {
            static fromOpts(A) {
              return iA.create(
                A.locale,
                A.numberingSystem,
                A.outputCalendar,
                A.weekSettings,
                A.defaultToEN,
              );
            }
            static create(A, e, t, i, n = !1) {
              const o = A || uA.defaultLocale,
                g =
                  o ||
                  (n
                    ? "en-US"
                    : V ||
                      ((V = new Intl.DateTimeFormat().resolvedOptions().locale),
                      V)),
                r = e || uA.defaultNumberingSystem,
                a = t || uA.defaultOutputCalendar,
                B = RA(i) || uA.defaultWeekSettings;
              return new iA(g, r, a, B, o);
            }
            static resetCache() {
              ((V = null),
                R.clear(),
                W.clear(),
                K.clear(),
                X.clear(),
                q.clear());
            }
            static fromObject({
              locale: A,
              numberingSystem: e,
              outputCalendar: t,
              weekSettings: i,
            } = {}) {
              return iA.create(A, e, t, i);
            }
            constructor(A, e, t, i, n) {
              const [o, g, r] = (function (A) {
                const e = A.indexOf("-x-");
                -1 !== e && (A = A.substring(0, e));
                const t = A.indexOf("-u-");
                if (-1 === t) return [A];
                {
                  let e, i;
                  try {
                    ((e = j(A).resolvedOptions()), (i = A));
                  } catch (n) {
                    const o = A.substring(0, t);
                    ((e = j(o).resolvedOptions()), (i = o));
                  }
                  const { numberingSystem: n, calendar: o } = e;
                  return [i, n, o];
                }
              })(A);
              ((this.locale = o),
                (this.numberingSystem = e || g || null),
                (this.outputCalendar = t || r || null),
                (this.weekSettings = i),
                (this.intl = (function (A, e, t) {
                  return t || e
                    ? (A.includes("-u-") || (A += "-u"),
                      t && (A += `-ca-${t}`),
                      e && (A += `-nu-${e}`),
                      A)
                    : A;
                })(this.locale, this.numberingSystem, this.outputCalendar)),
                (this.weekdaysCache = { format: {}, standalone: {} }),
                (this.monthsCache = { format: {}, standalone: {} }),
                (this.meridiemCache = null),
                (this.eraCache = {}),
                (this.specifiedLocale = n),
                (this.fastNumbersCached = null));
            }
            get fastNumbers() {
              var A;
              return (
                null == this.fastNumbersCached &&
                  (this.fastNumbersCached =
                    (!(A = this).numberingSystem ||
                      "latn" === A.numberingSystem) &&
                    ("latn" === A.numberingSystem ||
                      !A.locale ||
                      A.locale.startsWith("en") ||
                      "latn" === Z(A.locale).numberingSystem)),
                this.fastNumbersCached
              );
            }
            listingMode() {
              const A = this.isEnglish(),
                e = !(
                  (null !== this.numberingSystem &&
                    "latn" !== this.numberingSystem) ||
                  (null !== this.outputCalendar &&
                    "gregory" !== this.outputCalendar)
                );
              return A && e ? "en" : "intl";
            }
            clone(A) {
              return A && 0 !== Object.getOwnPropertyNames(A).length
                ? iA.create(
                    A.locale || this.specifiedLocale,
                    A.numberingSystem || this.numberingSystem,
                    A.outputCalendar || this.outputCalendar,
                    RA(A.weekSettings) || this.weekSettings,
                    A.defaultToEN || !1,
                  )
                : this;
            }
            redefaultToEN(A = {}) {
              return this.clone({ ...A, defaultToEN: !0 });
            }
            redefaultToSystem(A = {}) {
              return this.clone({ ...A, defaultToEN: !1 });
            }
            months(A, e = !1) {
              return _(this, A, Ce, () => {
                const t = "ja" === this.intl || this.intl.startsWith("ja-"),
                  i = (e &= !t) ? { month: A, day: "numeric" } : { month: A },
                  n = e ? "format" : "standalone";
                if (!this.monthsCache[n][A]) {
                  const e = t
                    ? (A) => this.dtFormatter(A, i).format()
                    : (A) => this.extract(A, i, "month");
                  this.monthsCache[n][A] = (function (A) {
                    const e = [];
                    for (let t = 1; t <= 12; t++) {
                      const i = Ei.utc(2009, t, 1);
                      e.push(A(i));
                    }
                    return e;
                  })(e);
                }
                return this.monthsCache[n][A];
              });
            }
            weekdays(A, e = !1) {
              return _(this, A, we, () => {
                const t = e
                    ? {
                        weekday: A,
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    : { weekday: A },
                  i = e ? "format" : "standalone";
                return (
                  this.weekdaysCache[i][A] ||
                    (this.weekdaysCache[i][A] = (function (A) {
                      const e = [];
                      for (let t = 1; t <= 7; t++) {
                        const i = Ei.utc(2016, 11, 13 + t);
                        e.push(A(i));
                      }
                      return e;
                    })((A) => this.extract(A, t, "weekday"))),
                  this.weekdaysCache[i][A]
                );
              });
            }
            meridiems() {
              return _(
                this,
                void 0,
                () => De,
                () => {
                  if (!this.meridiemCache) {
                    const A = { hour: "numeric", hourCycle: "h12" };
                    this.meridiemCache = [
                      Ei.utc(2016, 11, 13, 9),
                      Ei.utc(2016, 11, 13, 19),
                    ].map((e) => this.extract(e, A, "dayperiod"));
                  }
                  return this.meridiemCache;
                },
              );
            }
            eras(A) {
              return _(this, A, ve, () => {
                const e = { era: A };
                return (
                  this.eraCache[A] ||
                    (this.eraCache[A] = [
                      Ei.utc(-40, 1, 1),
                      Ei.utc(2017, 1, 1),
                    ].map((A) => this.extract(A, e, "era"))),
                  this.eraCache[A]
                );
              });
            }
            extract(A, e, t) {
              const i = this.dtFormatter(A, e)
                .formatToParts()
                .find((A) => A.type.toLowerCase() === t);
              return i ? i.value : null;
            }
            numberFormatter(A = {}) {
              return new $(this.intl, A.forceSimple || this.fastNumbers, A);
            }
            dtFormatter(A, e = {}) {
              return new AA(A, this.intl, e);
            }
            relFormatter(A = {}) {
              return new eA(this.intl, this.isEnglish(), A);
            }
            listFormatter(A = {}) {
              return (function (A, e = {}) {
                const t = JSON.stringify([A, e]);
                let i = J[t];
                return (i || ((i = new Intl.ListFormat(A, e)), (J[t] = i)), i);
              })(this.intl, A);
            }
            isEnglish() {
              return (
                "en" === this.locale ||
                "en-us" === this.locale.toLowerCase() ||
                Z(this.intl).locale.startsWith("en-us")
              );
            }
            getWeekSettings() {
              return this.weekSettings
                ? this.weekSettings
                : OA()
                  ? (function (A) {
                      let e = q.get(A);
                      if (!e) {
                        const t = new Intl.Locale(A);
                        ((e =
                          "getWeekInfo" in t ? t.getWeekInfo() : t.weekInfo),
                          "minimalDays" in e || (e = { ...tA, ...e }),
                          q.set(A, e));
                      }
                      return e;
                    })(this.locale)
                  : tA;
            }
            getStartOfWeek() {
              return this.getWeekSettings().firstDay;
            }
            getMinDaysInFirstWeek() {
              return this.getWeekSettings().minimalDays;
            }
            getWeekendDays() {
              return this.getWeekSettings().weekend;
            }
            equals(A) {
              return (
                this.locale === A.locale &&
                this.numberingSystem === A.numberingSystem &&
                this.outputCalendar === A.outputCalendar
              );
            }
            toString() {
              return `Locale(${this.locale}, ${this.numberingSystem}, ${this.outputCalendar})`;
            }
          }
          let nA = null;
          class oA extends S {
            static get utcInstance() {
              return (null === nA && (nA = new oA(0)), nA);
            }
            static instance(A) {
              return 0 === A ? oA.utcInstance : new oA(A);
            }
            static parseSpecifier(A) {
              if (A) {
                const e = A.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);
                if (e) return new oA(oe(e[1], e[2]));
              }
              return null;
            }
            constructor(A) {
              (super(), (this.fixed = A));
            }
            get type() {
              return "fixed";
            }
            get name() {
              return 0 === this.fixed
                ? "UTC"
                : `UTC${ae(this.fixed, "narrow")}`;
            }
            get ianaName() {
              return 0 === this.fixed
                ? "Etc/UTC"
                : `Etc/GMT${ae(-this.fixed, "narrow")}`;
            }
            offsetName() {
              return this.name;
            }
            formatOffset(A, e) {
              return ae(this.fixed, e);
            }
            get isUniversal() {
              return !0;
            }
            offset() {
              return this.fixed;
            }
            equals(A) {
              return "fixed" === A.type && A.fixed === this.fixed;
            }
            get isValid() {
              return !0;
            }
          }
          class gA extends S {
            constructor(A) {
              (super(), (this.zoneName = A));
            }
            get type() {
              return "invalid";
            }
            get name() {
              return this.zoneName;
            }
            get isUniversal() {
              return !1;
            }
            offsetName() {
              return null;
            }
            formatOffset() {
              return "";
            }
            offset() {
              return NaN;
            }
            equals() {
              return !1;
            }
            get isValid() {
              return !1;
            }
          }
          function rA(A, e) {
            if (zA(A) || null === A) return e;
            if (A instanceof S) return A;
            if ("string" == typeof A) {
              const t = A.toLowerCase();
              return "default" === t
                ? e
                : "local" === t || "system" === t
                  ? x.instance
                  : "utc" === t || "gmt" === t
                    ? oA.utcInstance
                    : oA.parseSpecifier(t) || N.create(A);
            }
            return xA(A)
              ? oA.instance(A)
              : "object" == typeof A &&
                  "offset" in A &&
                  "function" == typeof A.offset
                ? A
                : new gA(A);
          }
          const aA = {
              arab: "[٠-٩]",
              arabext: "[۰-۹]",
              bali: "[᭐-᭙]",
              beng: "[০-৯]",
              deva: "[०-९]",
              fullwide: "[０-９]",
              gujr: "[૦-૯]",
              hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
              khmr: "[០-៩]",
              knda: "[೦-೯]",
              laoo: "[໐-໙]",
              limb: "[᥆-᥏]",
              mlym: "[൦-൯]",
              mong: "[᠐-᠙]",
              mymr: "[၀-၉]",
              orya: "[୦-୯]",
              tamldec: "[௦-௯]",
              telu: "[౦-౯]",
              thai: "[๐-๙]",
              tibt: "[༠-༩]",
              latn: "\\d",
            },
            BA = {
              arab: [1632, 1641],
              arabext: [1776, 1785],
              bali: [6992, 7001],
              beng: [2534, 2543],
              deva: [2406, 2415],
              fullwide: [65296, 65303],
              gujr: [2790, 2799],
              khmr: [6112, 6121],
              knda: [3302, 3311],
              laoo: [3792, 3801],
              limb: [6470, 6479],
              mlym: [3430, 3439],
              mong: [6160, 6169],
              mymr: [4160, 4169],
              orya: [2918, 2927],
              tamldec: [3046, 3055],
              telu: [3174, 3183],
              thai: [3664, 3673],
              tibt: [3872, 3881],
            },
            sA = aA.hanidec.replace(/[\[|\]]/g, "").split(""),
            cA = new Map();
          function QA({ numberingSystem: A }, e = "") {
            const t = A || "latn";
            let i = cA.get(t);
            void 0 === i && ((i = new Map()), cA.set(t, i));
            let n = i.get(e);
            return (
              void 0 === n && ((n = new RegExp(`${aA[t]}${e}`)), i.set(e, n)),
              n
            );
          }
          let CA,
            lA = () => Date.now(),
            EA = "system",
            dA = null,
            wA = null,
            DA = null,
            hA = 60,
            IA = null;
          class uA {
            static get now() {
              return lA;
            }
            static set now(A) {
              lA = A;
            }
            static set defaultZone(A) {
              EA = A;
            }
            static get defaultZone() {
              return rA(EA, x.instance);
            }
            static get defaultLocale() {
              return dA;
            }
            static set defaultLocale(A) {
              dA = A;
            }
            static get defaultNumberingSystem() {
              return wA;
            }
            static set defaultNumberingSystem(A) {
              wA = A;
            }
            static get defaultOutputCalendar() {
              return DA;
            }
            static set defaultOutputCalendar(A) {
              DA = A;
            }
            static get defaultWeekSettings() {
              return IA;
            }
            static set defaultWeekSettings(A) {
              IA = RA(A);
            }
            static get twoDigitCutoffYear() {
              return hA;
            }
            static set twoDigitCutoffYear(A) {
              hA = A % 100;
            }
            static get throwOnInvalid() {
              return CA;
            }
            static set throwOnInvalid(A) {
              CA = A;
            }
            static resetCaches() {
              (iA.resetCache(), N.resetCache(), Ei.resetCache(), cA.clear());
            }
          }
          class vA {
            constructor(A, e) {
              ((this.reason = A), (this.explanation = e));
            }
            toMessage() {
              return this.explanation
                ? `${this.reason}: ${this.explanation}`
                : this.reason;
            }
          }
          const fA = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
            MA = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];
          function mA(A, e) {
            return new vA(
              "unit out of range",
              `you specified ${e} (of type ${typeof e}) as a ${A}, which is invalid`,
            );
          }
          function YA(A, e, t) {
            const i = new Date(Date.UTC(A, e - 1, t));
            A < 100 && A >= 0 && i.setUTCFullYear(i.getUTCFullYear() - 1900);
            const n = i.getUTCDay();
            return 0 === n ? 7 : n;
          }
          function pA(A, e, t) {
            return t + (qA(A) ? MA : fA)[e - 1];
          }
          function yA(A, e) {
            const t = qA(A) ? MA : fA,
              i = t.findIndex((A) => A < e);
            return { month: i + 1, day: e - t[i] };
          }
          function PA(A, e) {
            return ((A - e + 7) % 7) + 1;
          }
          function FA(A, e = 4, t = 1) {
            const { year: i, month: n, day: o } = A,
              g = pA(i, n, o),
              r = PA(YA(i, n, o), t);
            let a,
              B = Math.floor((g - r + 14 - e) / 7);
            return (
              B < 1
                ? ((a = i - 1), (B = te(a, e, t)))
                : B > te(i, e, t)
                  ? ((a = i + 1), (B = 1))
                  : (a = i),
              { weekYear: a, weekNumber: B, weekday: r, ...Be(A) }
            );
          }
          function GA(A, e = 4, t = 1) {
            const { weekYear: i, weekNumber: n, weekday: o } = A,
              g = PA(YA(i, 1, e), t),
              r = _A(i);
            let a,
              B = 7 * n + o - g - 7 + e;
            B < 1
              ? ((a = i - 1), (B += _A(a)))
              : B > r
                ? ((a = i + 1), (B -= _A(i)))
                : (a = i);
            const { month: s, day: c } = yA(a, B);
            return { year: a, month: s, day: c, ...Be(A) };
          }
          function HA(A) {
            const { year: e, month: t, day: i } = A;
            return { year: e, ordinal: pA(e, t, i), ...Be(A) };
          }
          function LA(A) {
            const { year: e, ordinal: t } = A,
              { month: i, day: n } = yA(e, t);
            return { year: e, month: i, day: n, ...Be(A) };
          }
          function bA(A, e) {
            if (
              !zA(A.localWeekday) ||
              !zA(A.localWeekNumber) ||
              !zA(A.localWeekYear)
            ) {
              if (!zA(A.weekday) || !zA(A.weekNumber) || !zA(A.weekYear))
                throw new r(
                  "Cannot mix locale-based week fields with ISO-based week fields",
                );
              return (
                zA(A.localWeekday) || (A.weekday = A.localWeekday),
                zA(A.localWeekNumber) || (A.weekNumber = A.localWeekNumber),
                zA(A.localWeekYear) || (A.weekYear = A.localWeekYear),
                delete A.localWeekday,
                delete A.localWeekNumber,
                delete A.localWeekYear,
                {
                  minDaysInFirstWeek: e.getMinDaysInFirstWeek(),
                  startOfWeek: e.getStartOfWeek(),
                }
              );
            }
            return { minDaysInFirstWeek: 4, startOfWeek: 1 };
          }
          function UA(A) {
            const e = kA(A.year),
              t = jA(A.month, 1, 12),
              i = jA(A.day, 1, $A(A.year, A.month));
            return e
              ? t
                ? !i && mA("day", A.day)
                : mA("month", A.month)
              : mA("year", A.year);
          }
          function SA(A) {
            const { hour: e, minute: t, second: i, millisecond: n } = A,
              o = jA(e, 0, 23) || (24 === e && 0 === t && 0 === i && 0 === n),
              g = jA(t, 0, 59),
              r = jA(i, 0, 59),
              a = jA(n, 0, 999);
            return o
              ? g
                ? r
                  ? !a && mA("millisecond", n)
                  : mA("second", i)
                : mA("minute", t)
              : mA("hour", e);
          }
          function zA(A) {
            return void 0 === A;
          }
          function xA(A) {
            return "number" == typeof A;
          }
          function kA(A) {
            return "number" == typeof A && A % 1 == 0;
          }
          function TA() {
            try {
              return "undefined" != typeof Intl && !!Intl.RelativeTimeFormat;
            } catch (A) {
              return !1;
            }
          }
          function OA() {
            try {
              return (
                "undefined" != typeof Intl &&
                !!Intl.Locale &&
                ("weekInfo" in Intl.Locale.prototype ||
                  "getWeekInfo" in Intl.Locale.prototype)
              );
            } catch (A) {
              return !1;
            }
          }
          function NA(A, e, t) {
            if (0 !== A.length)
              return A.reduce((A, i) => {
                const n = [e(i), i];
                return A && t(A[0], n[0]) === A[0] ? A : n;
              }, null)[1];
          }
          function JA(A, e) {
            return Object.prototype.hasOwnProperty.call(A, e);
          }
          function RA(A) {
            if (null == A) return null;
            if ("object" != typeof A)
              throw new B("Week settings must be an object");
            if (
              !jA(A.firstDay, 1, 7) ||
              !jA(A.minimalDays, 1, 7) ||
              !Array.isArray(A.weekend) ||
              A.weekend.some((A) => !jA(A, 1, 7))
            )
              throw new B("Invalid week settings");
            return {
              firstDay: A.firstDay,
              minimalDays: A.minimalDays,
              weekend: Array.from(A.weekend),
            };
          }
          function jA(A, e, t) {
            return kA(A) && A >= e && A <= t;
          }
          function WA(A, e = 2) {
            let t;
            return (
              (t =
                A < 0
                  ? "-" + ("" + -A).padStart(e, "0")
                  : ("" + A).padStart(e, "0")),
              t
            );
          }
          function KA(A) {
            return zA(A) || null === A || "" === A ? void 0 : parseInt(A, 10);
          }
          function VA(A) {
            return zA(A) || null === A || "" === A ? void 0 : parseFloat(A);
          }
          function XA(A) {
            if (!zA(A) && null !== A && "" !== A) {
              const e = 1e3 * parseFloat("0." + A);
              return Math.floor(e);
            }
          }
          function ZA(A, e, t = "round") {
            const i = 10 ** e;
            switch (t) {
              case "expand":
                return A > 0 ? Math.ceil(A * i) / i : Math.floor(A * i) / i;
              case "trunc":
                return Math.trunc(A * i) / i;
              case "round":
                return Math.round(A * i) / i;
              case "floor":
                return Math.floor(A * i) / i;
              case "ceil":
                return Math.ceil(A * i) / i;
              default:
                throw new RangeError(`Value rounding ${t} is out of range`);
            }
          }
          function qA(A) {
            return A % 4 == 0 && (A % 100 != 0 || A % 400 == 0);
          }
          function _A(A) {
            return qA(A) ? 366 : 365;
          }
          function $A(A, e) {
            const t = (i = e - 1) - 12 * Math.floor(i / 12) + 1;
            var i;
            return 2 === t
              ? qA(A + (e - t) / 12)
                ? 29
                : 28
              : [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t - 1];
          }
          function Ae(A) {
            let e = Date.UTC(
              A.year,
              A.month - 1,
              A.day,
              A.hour,
              A.minute,
              A.second,
              A.millisecond,
            );
            return (
              A.year < 100 &&
                A.year >= 0 &&
                ((e = new Date(e)),
                e.setUTCFullYear(A.year, A.month - 1, A.day)),
              +e
            );
          }
          function ee(A, e, t) {
            return -PA(YA(A, 1, e), t) + e - 1;
          }
          function te(A, e = 4, t = 1) {
            const i = ee(A, e, t),
              n = ee(A + 1, e, t);
            return (_A(A) - i + n) / 7;
          }
          function ie(A) {
            return A > 99 ? A : A > uA.twoDigitCutoffYear ? 1900 + A : 2e3 + A;
          }
          function ne(A, e, t, i = null) {
            const n = new Date(A),
              o = {
                hourCycle: "h23",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              };
            i && (o.timeZone = i);
            const g = { timeZoneName: e, ...o },
              r = new Intl.DateTimeFormat(t, g)
                .formatToParts(n)
                .find((A) => "timezonename" === A.type.toLowerCase());
            return r ? r.value : null;
          }
          function oe(A, e) {
            let t = parseInt(A, 10);
            Number.isNaN(t) && (t = 0);
            const i = parseInt(e, 10) || 0;
            return 60 * t + (t < 0 || Object.is(t, -0) ? -i : i);
          }
          function ge(A) {
            const e = Number(A);
            if ("boolean" == typeof A || "" === A || !Number.isFinite(e))
              throw new B(`Invalid unit value ${A}`);
            return e;
          }
          function re(A, e) {
            const t = {};
            for (const i in A)
              if (JA(A, i)) {
                const n = A[i];
                if (null == n) continue;
                t[e(i)] = ge(n);
              }
            return t;
          }
          function ae(A, e) {
            const t = Math.trunc(Math.abs(A / 60)),
              i = Math.trunc(Math.abs(A % 60)),
              n = A >= 0 ? "+" : "-";
            switch (e) {
              case "short":
                return `${n}${WA(t, 2)}:${WA(i, 2)}`;
              case "narrow":
                return `${n}${t}${i > 0 ? `:${i}` : ""}`;
              case "techie":
                return `${n}${WA(t, 2)}${WA(i, 2)}`;
              default:
                throw new RangeError(
                  `Value format ${e} is out of range for property format`,
                );
            }
          }
          function Be(A) {
            return (function (A) {
              return ["hour", "minute", "second", "millisecond"].reduce(
                (e, t) => ((e[t] = A[t]), e),
                {},
              );
            })(A);
          }
          const se = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            ce = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            Qe = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
          function Ce(A) {
            switch (A) {
              case "narrow":
                return [...Qe];
              case "short":
                return [...ce];
              case "long":
                return [...se];
              case "numeric":
                return [
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ];
              case "2-digit":
                return [
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
                ];
              default:
                return null;
            }
          }
          const le = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            Ee = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            de = ["M", "T", "W", "T", "F", "S", "S"];
          function we(A) {
            switch (A) {
              case "narrow":
                return [...de];
              case "short":
                return [...Ee];
              case "long":
                return [...le];
              case "numeric":
                return ["1", "2", "3", "4", "5", "6", "7"];
              default:
                return null;
            }
          }
          const De = ["AM", "PM"],
            he = ["Before Christ", "Anno Domini"],
            Ie = ["BC", "AD"],
            ue = ["B", "A"];
          function ve(A) {
            switch (A) {
              case "narrow":
                return [...ue];
              case "short":
                return [...Ie];
              case "long":
                return [...he];
              default:
                return null;
            }
          }
          function fe(A, e) {
            let t = "";
            for (const i of A) i.literal ? (t += i.val) : (t += e(i.val));
            return t;
          }
          const Me = {
            D: l,
            DD: E,
            DDD: w,
            DDDD: D,
            t: h,
            tt: I,
            ttt: u,
            tttt: v,
            T: f,
            TT: M,
            TTT: m,
            TTTT: Y,
            f: p,
            ff: P,
            fff: H,
            ffff: b,
            F: y,
            FF: F,
            FFF: L,
            FFFF: U,
          };
          class me {
            static create(A, e = {}) {
              return new me(A, e);
            }
            static parseFormat(A) {
              let e = null,
                t = "",
                i = !1;
              const n = [];
              for (let o = 0; o < A.length; o++) {
                const g = A.charAt(o);
                "'" === g
                  ? ((t.length > 0 || i) &&
                      n.push({
                        literal: i || /^\s+$/.test(t),
                        val: "" === t ? "'" : t,
                      }),
                    (e = null),
                    (t = ""),
                    (i = !i))
                  : i || g === e
                    ? (t += g)
                    : (t.length > 0 &&
                        n.push({ literal: /^\s+$/.test(t), val: t }),
                      (t = g),
                      (e = g));
              }
              return (
                t.length > 0 &&
                  n.push({ literal: i || /^\s+$/.test(t), val: t }),
                n
              );
            }
            static macroTokenToFormatOpts(A) {
              return Me[A];
            }
            constructor(A, e) {
              ((this.opts = e), (this.loc = A), (this.systemLoc = null));
            }
            formatWithSystemDefault(A, e) {
              return (
                null === this.systemLoc &&
                  (this.systemLoc = this.loc.redefaultToSystem()),
                this.systemLoc.dtFormatter(A, { ...this.opts, ...e }).format()
              );
            }
            dtFormatter(A, e = {}) {
              return this.loc.dtFormatter(A, { ...this.opts, ...e });
            }
            formatDateTime(A, e) {
              return this.dtFormatter(A, e).format();
            }
            formatDateTimeParts(A, e) {
              return this.dtFormatter(A, e).formatToParts();
            }
            formatInterval(A, e) {
              return this.dtFormatter(A.start, e).dtf.formatRange(
                A.start.toJSDate(),
                A.end.toJSDate(),
              );
            }
            resolvedOptions(A, e) {
              return this.dtFormatter(A, e).resolvedOptions();
            }
            num(A, e = 0, t = void 0) {
              if (this.opts.forceSimple) return WA(A, e);
              const i = { ...this.opts };
              return (
                e > 0 && (i.padTo = e),
                t && (i.signDisplay = t),
                this.loc.numberFormatter(i).format(A)
              );
            }
            formatDateTimeFromString(A, e) {
              const t = "en" === this.loc.listingMode(),
                i =
                  this.loc.outputCalendar &&
                  "gregory" !== this.loc.outputCalendar,
                n = (e, t) => this.loc.extract(A, e, t),
                o = (e) =>
                  A.isOffsetFixed && 0 === A.offset && e.allowZ
                    ? "Z"
                    : A.isValid
                      ? A.zone.formatOffset(A.ts, e.format)
                      : "",
                g = (e, i) =>
                  t
                    ? (function (A, e) {
                        return Ce(e)[A.month - 1];
                      })(A, e)
                    : n(
                        i ? { month: e } : { month: e, day: "numeric" },
                        "month",
                      ),
                r = (e, i) =>
                  t
                    ? (function (A, e) {
                        return we(e)[A.weekday - 1];
                      })(A, e)
                    : n(
                        i
                          ? { weekday: e }
                          : { weekday: e, month: "long", day: "numeric" },
                        "weekday",
                      ),
                a = (e) => {
                  const t = me.macroTokenToFormatOpts(e);
                  return t ? this.formatWithSystemDefault(A, t) : e;
                },
                B = (e) =>
                  t
                    ? (function (A, e) {
                        return ve(e)[A.year < 0 ? 0 : 1];
                      })(A, e)
                    : n({ era: e }, "era");
              return fe(me.parseFormat(e), (e) => {
                switch (e) {
                  case "S":
                    return this.num(A.millisecond);
                  case "u":
                  case "SSS":
                    return this.num(A.millisecond, 3);
                  case "s":
                    return this.num(A.second);
                  case "ss":
                    return this.num(A.second, 2);
                  case "uu":
                    return this.num(Math.floor(A.millisecond / 10), 2);
                  case "uuu":
                    return this.num(Math.floor(A.millisecond / 100));
                  case "m":
                    return this.num(A.minute);
                  case "mm":
                    return this.num(A.minute, 2);
                  case "h":
                    return this.num(A.hour % 12 == 0 ? 12 : A.hour % 12);
                  case "hh":
                    return this.num(A.hour % 12 == 0 ? 12 : A.hour % 12, 2);
                  case "H":
                    return this.num(A.hour);
                  case "HH":
                    return this.num(A.hour, 2);
                  case "Z":
                    return o({ format: "narrow", allowZ: this.opts.allowZ });
                  case "ZZ":
                    return o({ format: "short", allowZ: this.opts.allowZ });
                  case "ZZZ":
                    return o({ format: "techie", allowZ: this.opts.allowZ });
                  case "ZZZZ":
                    return A.zone.offsetName(A.ts, {
                      format: "short",
                      locale: this.loc.locale,
                    });
                  case "ZZZZZ":
                    return A.zone.offsetName(A.ts, {
                      format: "long",
                      locale: this.loc.locale,
                    });
                  case "z":
                    return A.zoneName;
                  case "a":
                    return t
                      ? (function (A) {
                          return De[A.hour < 12 ? 0 : 1];
                        })(A)
                      : n({ hour: "numeric", hourCycle: "h12" }, "dayperiod");
                  case "d":
                    return i ? n({ day: "numeric" }, "day") : this.num(A.day);
                  case "dd":
                    return i
                      ? n({ day: "2-digit" }, "day")
                      : this.num(A.day, 2);
                  case "c":
                  case "E":
                    return this.num(A.weekday);
                  case "ccc":
                    return r("short", !0);
                  case "cccc":
                    return r("long", !0);
                  case "ccccc":
                    return r("narrow", !0);
                  case "EEE":
                    return r("short", !1);
                  case "EEEE":
                    return r("long", !1);
                  case "EEEEE":
                    return r("narrow", !1);
                  case "L":
                    return i
                      ? n({ month: "numeric", day: "numeric" }, "month")
                      : this.num(A.month);
                  case "LL":
                    return i
                      ? n({ month: "2-digit", day: "numeric" }, "month")
                      : this.num(A.month, 2);
                  case "LLL":
                    return g("short", !0);
                  case "LLLL":
                    return g("long", !0);
                  case "LLLLL":
                    return g("narrow", !0);
                  case "M":
                    return i
                      ? n({ month: "numeric" }, "month")
                      : this.num(A.month);
                  case "MM":
                    return i
                      ? n({ month: "2-digit" }, "month")
                      : this.num(A.month, 2);
                  case "MMM":
                    return g("short", !1);
                  case "MMMM":
                    return g("long", !1);
                  case "MMMMM":
                    return g("narrow", !1);
                  case "y":
                    return i
                      ? n({ year: "numeric" }, "year")
                      : this.num(A.year);
                  case "yy":
                    return i
                      ? n({ year: "2-digit" }, "year")
                      : this.num(A.year.toString().slice(-2), 2);
                  case "yyyy":
                    return i
                      ? n({ year: "numeric" }, "year")
                      : this.num(A.year, 4);
                  case "yyyyyy":
                    return i
                      ? n({ year: "numeric" }, "year")
                      : this.num(A.year, 6);
                  case "G":
                    return B("short");
                  case "GG":
                    return B("long");
                  case "GGGGG":
                    return B("narrow");
                  case "kk":
                    return this.num(A.weekYear.toString().slice(-2), 2);
                  case "kkkk":
                    return this.num(A.weekYear, 4);
                  case "W":
                    return this.num(A.weekNumber);
                  case "WW":
                    return this.num(A.weekNumber, 2);
                  case "n":
                    return this.num(A.localWeekNumber);
                  case "nn":
                    return this.num(A.localWeekNumber, 2);
                  case "ii":
                    return this.num(A.localWeekYear.toString().slice(-2), 2);
                  case "iiii":
                    return this.num(A.localWeekYear, 4);
                  case "o":
                    return this.num(A.ordinal);
                  case "ooo":
                    return this.num(A.ordinal, 3);
                  case "q":
                    return this.num(A.quarter);
                  case "qq":
                    return this.num(A.quarter, 2);
                  case "X":
                    return this.num(Math.floor(A.ts / 1e3));
                  case "x":
                    return this.num(A.ts);
                  default:
                    return a(e);
                }
              });
            }
            formatDurationFromString(A, e) {
              const t = "negativeLargestOnly" === this.opts.signMode ? -1 : 1,
                i = (A) => {
                  switch (A[0]) {
                    case "S":
                      return "milliseconds";
                    case "s":
                      return "seconds";
                    case "m":
                      return "minutes";
                    case "h":
                      return "hours";
                    case "d":
                      return "days";
                    case "w":
                      return "weeks";
                    case "M":
                      return "months";
                    case "y":
                      return "years";
                    default:
                      return null;
                  }
                },
                n = me.parseFormat(e),
                o = n.reduce(
                  (A, { literal: e, val: t }) => (e ? A : A.concat(t)),
                  [],
                ),
                g = A.shiftTo(...o.map(i).filter((A) => A));
              return fe(
                n,
                ((A, e) => (n) => {
                  const o = i(n);
                  if (o) {
                    const i =
                      e.isNegativeDuration && o !== e.largestUnit ? t : 1;
                    let g;
                    return (
                      (g =
                        "negativeLargestOnly" === this.opts.signMode &&
                        o !== e.largestUnit
                          ? "never"
                          : "all" === this.opts.signMode
                            ? "always"
                            : "auto"),
                      this.num(A.get(o) * i, n.length, g)
                    );
                  }
                  return n;
                })(g, {
                  isNegativeDuration: g < 0,
                  largestUnit: Object.keys(g.values)[0],
                }),
              );
            }
          }
          const Ye =
            /[A-Za-z_+-]{1,256}(?::?\/[A-Za-z0-9_+-]{1,256}(?:\/[A-Za-z0-9_+-]{1,256})?)?/;
          function pe(...A) {
            const e = A.reduce((A, e) => A + e.source, "");
            return RegExp(`^${e}$`);
          }
          function ye(...A) {
            return (e) =>
              A.reduce(
                ([A, t, i], n) => {
                  const [o, g, r] = n(e, i);
                  return [{ ...A, ...o }, g || t, r];
                },
                [{}, null, 1],
              ).slice(0, 2);
          }
          function Pe(A, ...e) {
            if (null == A) return [null, null];
            for (const [t, i] of e) {
              const e = t.exec(A);
              if (e) return i(e);
            }
            return [null, null];
          }
          function Fe(...A) {
            return (e, t) => {
              const i = {};
              let n;
              for (n = 0; n < A.length; n++) i[A[n]] = KA(e[t + n]);
              return [i, null, t + n];
            };
          }
          const Ge = /(?:([Zz])|([+-]\d\d)(?::?(\d\d))?)/,
            He = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,
            Le = RegExp(
              `${He.source}(?:${Ge.source}?(?:\\[(${Ye.source})\\])?)?`,
            ),
            be = RegExp(`(?:[Tt]${Le.source})?`),
            Ue = Fe("weekYear", "weekNumber", "weekDay"),
            Se = Fe("year", "ordinal"),
            ze = RegExp(`${He.source} ?(?:${Ge.source}|(${Ye.source}))?`),
            xe = RegExp(`(?: ${ze.source})?`);
          function ke(A, e, t) {
            const i = A[e];
            return zA(i) ? t : KA(i);
          }
          function Te(A, e) {
            return [
              {
                hours: ke(A, e, 0),
                minutes: ke(A, e + 1, 0),
                seconds: ke(A, e + 2, 0),
                milliseconds: XA(A[e + 3]),
              },
              null,
              e + 4,
            ];
          }
          function Oe(A, e) {
            const t = !A[e] && !A[e + 1],
              i = oe(A[e + 1], A[e + 2]);
            return [{}, t ? null : oA.instance(i), e + 3];
          }
          function Ne(A, e) {
            return [{}, A[e] ? N.create(A[e]) : null, e + 1];
          }
          const Je = RegExp(`^T?${He.source}$`),
            Re =
              /^-?P(?:(?:(-?\d{1,20}(?:\.\d{1,20})?)Y)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20}(?:\.\d{1,20})?)W)?(?:(-?\d{1,20}(?:\.\d{1,20})?)D)?(?:T(?:(-?\d{1,20}(?:\.\d{1,20})?)H)?(?:(-?\d{1,20}(?:\.\d{1,20})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,20}))?S)?)?)$/;
          function je(A) {
            const [e, t, i, n, o, g, r, a, B] = A,
              s = "-" === e[0],
              c = a && "-" === a[0],
              Q = (A, e = !1) => (void 0 !== A && (e || (A && s)) ? -A : A);
            return [
              {
                years: Q(VA(t)),
                months: Q(VA(i)),
                weeks: Q(VA(n)),
                days: Q(VA(o)),
                hours: Q(VA(g)),
                minutes: Q(VA(r)),
                seconds: Q(VA(a), "-0" === a),
                milliseconds: Q(XA(B), c),
              },
            ];
          }
          const We = {
            GMT: 0,
            EDT: -240,
            EST: -300,
            CDT: -300,
            CST: -360,
            MDT: -360,
            MST: -420,
            PDT: -420,
            PST: -480,
          };
          function Ke(A, e, t, i, n, o, g) {
            const r = {
              year: 2 === e.length ? ie(KA(e)) : KA(e),
              month: ce.indexOf(t) + 1,
              day: KA(i),
              hour: KA(n),
              minute: KA(o),
            };
            return (
              g && (r.second = KA(g)),
              A &&
                (r.weekday =
                  A.length > 3 ? le.indexOf(A) + 1 : Ee.indexOf(A) + 1),
              r
            );
          }
          const Ve =
            /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;
          function Xe(A) {
            const [, e, t, i, n, o, g, r, a, B, s, c] = A,
              Q = Ke(e, n, i, t, o, g, r);
            let C;
            return ((C = a ? We[a] : B ? 0 : oe(s, c)), [Q, new oA(C)]);
          }
          const Ze =
              /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,
            qe =
              /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,
            _e =
              /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;
          function $e(A) {
            const [, e, t, i, n, o, g, r] = A;
            return [Ke(e, n, i, t, o, g, r), oA.utcInstance];
          }
          function At(A) {
            const [, e, t, i, n, o, g, r] = A;
            return [Ke(e, r, t, i, n, o, g), oA.utcInstance];
          }
          const et = pe(/([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/, be),
            tt = pe(/(\d{4})-?W(\d\d)(?:-?(\d))?/, be),
            it = pe(/(\d{4})-?(\d{3})/, be),
            nt = pe(Le),
            ot = ye(
              function (A, e) {
                return [
                  {
                    year: ke(A, e),
                    month: ke(A, e + 1, 1),
                    day: ke(A, e + 2, 1),
                  },
                  null,
                  e + 3,
                ];
              },
              Te,
              Oe,
              Ne,
            ),
            gt = ye(Ue, Te, Oe, Ne),
            rt = ye(Se, Te, Oe, Ne),
            at = ye(Te, Oe, Ne),
            Bt = ye(Te),
            st = pe(/(\d{4})-(\d\d)-(\d\d)/, xe),
            ct = pe(ze),
            Qt = ye(Te, Oe, Ne),
            Ct = "Invalid Duration",
            lt = {
              weeks: {
                days: 7,
                hours: 168,
                minutes: 10080,
                seconds: 604800,
                milliseconds: 6048e5,
              },
              days: {
                hours: 24,
                minutes: 1440,
                seconds: 86400,
                milliseconds: 864e5,
              },
              hours: { minutes: 60, seconds: 3600, milliseconds: 36e5 },
              minutes: { seconds: 60, milliseconds: 6e4 },
              seconds: { milliseconds: 1e3 },
            },
            Et = {
              years: {
                quarters: 4,
                months: 12,
                weeks: 52,
                days: 365,
                hours: 8760,
                minutes: 525600,
                seconds: 31536e3,
                milliseconds: 31536e6,
              },
              quarters: {
                months: 3,
                weeks: 13,
                days: 91,
                hours: 2184,
                minutes: 131040,
                seconds: 7862400,
                milliseconds: 78624e5,
              },
              months: {
                weeks: 4,
                days: 30,
                hours: 720,
                minutes: 43200,
                seconds: 2592e3,
                milliseconds: 2592e6,
              },
              ...lt,
            },
            dt = {
              years: {
                quarters: 4,
                months: 12,
                weeks: 52.1775,
                days: 365.2425,
                hours: 8765.82,
                minutes: 525949.2,
                seconds: 525949.2 * 60,
                milliseconds: 525949.2 * 60 * 1e3,
              },
              quarters: {
                months: 3,
                weeks: 13.044375,
                days: 91.310625,
                hours: 2191.455,
                minutes: 131487.3,
                seconds: (525949.2 * 60) / 4,
                milliseconds: 7889237999.999999,
              },
              months: {
                weeks: 4.3481250000000005,
                days: 30.436875,
                hours: 730.485,
                minutes: 43829.1,
                seconds: 2629746,
                milliseconds: 2629746e3,
              },
              ...lt,
            },
            wt = [
              "years",
              "quarters",
              "months",
              "weeks",
              "days",
              "hours",
              "minutes",
              "seconds",
              "milliseconds",
            ],
            Dt = wt.slice(0).reverse();
          function ht(A, e, t = !1) {
            const i = {
              values: t ? e.values : { ...A.values, ...(e.values || {}) },
              loc: A.loc.clone(e.loc),
              conversionAccuracy: e.conversionAccuracy || A.conversionAccuracy,
              matrix: e.matrix || A.matrix,
            };
            return new ft(i);
          }
          function It(A, e) {
            let t = e.milliseconds ?? 0;
            for (const i of Dt.slice(1))
              e[i] && (t += e[i] * A[i].milliseconds);
            return t;
          }
          function ut(A, e) {
            const t = It(A, e) < 0 ? -1 : 1;
            (wt.reduceRight((i, n) => {
              if (zA(e[n])) return i;
              if (i) {
                const o = e[i] * t,
                  g = A[n][i],
                  r = Math.floor(o / g);
                ((e[n] += r * t), (e[i] -= r * g * t));
              }
              return n;
            }, null),
              wt.reduce((t, i) => {
                if (zA(e[i])) return t;
                if (t) {
                  const n = e[t] % 1;
                  ((e[t] -= n), (e[i] += n * A[t][i]));
                }
                return i;
              }, null));
          }
          function vt(A) {
            const e = {};
            for (const [t, i] of Object.entries(A)) 0 !== i && (e[t] = i);
            return e;
          }
          class ft {
            constructor(A) {
              const e = "longterm" === A.conversionAccuracy || !1;
              let t = e ? dt : Et;
              (A.matrix && (t = A.matrix),
                (this.values = A.values),
                (this.loc = A.loc || iA.create()),
                (this.conversionAccuracy = e ? "longterm" : "casual"),
                (this.invalid = A.invalid || null),
                (this.matrix = t),
                (this.isLuxonDuration = !0));
            }
            static fromMillis(A, e) {
              return ft.fromObject({ milliseconds: A }, e);
            }
            static fromObject(A, e = {}) {
              if (null == A || "object" != typeof A)
                throw new B(
                  "Duration.fromObject: argument expected to be an object, got " +
                    (null === A ? "null" : typeof A),
                );
              return new ft({
                values: re(A, ft.normalizeUnit),
                loc: iA.fromObject(e),
                conversionAccuracy: e.conversionAccuracy,
                matrix: e.matrix,
              });
            }
            static fromDurationLike(A) {
              if (xA(A)) return ft.fromMillis(A);
              if (ft.isDuration(A)) return A;
              if ("object" == typeof A) return ft.fromObject(A);
              throw new B(`Unknown duration argument ${A} of type ${typeof A}`);
            }
            static fromISO(A, e) {
              const [t] = (function (A) {
                return Pe(A, [Re, je]);
              })(A);
              return t
                ? ft.fromObject(t, e)
                : ft.invalid(
                    "unparsable",
                    `the input "${A}" can't be parsed as ISO 8601`,
                  );
            }
            static fromISOTime(A, e) {
              const [t] = (function (A) {
                return Pe(A, [Je, Bt]);
              })(A);
              return t
                ? ft.fromObject(t, e)
                : ft.invalid(
                    "unparsable",
                    `the input "${A}" can't be parsed as ISO 8601`,
                  );
            }
            static invalid(A, e = null) {
              if (!A)
                throw new B("need to specify a reason the Duration is invalid");
              const t = A instanceof vA ? A : new vA(A, e);
              if (uA.throwOnInvalid) throw new g(t);
              return new ft({ invalid: t });
            }
            static normalizeUnit(A) {
              const e = {
                year: "years",
                years: "years",
                quarter: "quarters",
                quarters: "quarters",
                month: "months",
                months: "months",
                week: "weeks",
                weeks: "weeks",
                day: "days",
                days: "days",
                hour: "hours",
                hours: "hours",
                minute: "minutes",
                minutes: "minutes",
                second: "seconds",
                seconds: "seconds",
                millisecond: "milliseconds",
                milliseconds: "milliseconds",
              }[A ? A.toLowerCase() : A];
              if (!e) throw new a(A);
              return e;
            }
            static isDuration(A) {
              return (A && A.isLuxonDuration) || !1;
            }
            get locale() {
              return this.isValid ? this.loc.locale : null;
            }
            get numberingSystem() {
              return this.isValid ? this.loc.numberingSystem : null;
            }
            toFormat(A, e = {}) {
              const t = { ...e, floor: !1 !== e.round && !1 !== e.floor };
              return this.isValid
                ? me.create(this.loc, t).formatDurationFromString(this, A)
                : Ct;
            }
            toHuman(A = {}) {
              if (!this.isValid) return Ct;
              const e = !1 !== A.showZeros,
                t = wt
                  .map((t) => {
                    const i = this.values[t];
                    return zA(i) || (0 === i && !e)
                      ? null
                      : this.loc
                          .numberFormatter({
                            style: "unit",
                            unitDisplay: "long",
                            ...A,
                            unit: t.slice(0, -1),
                          })
                          .format(i);
                  })
                  .filter((A) => A);
              return this.loc
                .listFormatter({
                  type: "conjunction",
                  style: A.listStyle || "narrow",
                  ...A,
                })
                .format(t);
            }
            toObject() {
              return this.isValid ? { ...this.values } : {};
            }
            toISO() {
              if (!this.isValid) return null;
              let A = "P";
              return (
                0 !== this.years && (A += this.years + "Y"),
                (0 === this.months && 0 === this.quarters) ||
                  (A += this.months + 3 * this.quarters + "M"),
                0 !== this.weeks && (A += this.weeks + "W"),
                0 !== this.days && (A += this.days + "D"),
                (0 === this.hours &&
                  0 === this.minutes &&
                  0 === this.seconds &&
                  0 === this.milliseconds) ||
                  (A += "T"),
                0 !== this.hours && (A += this.hours + "H"),
                0 !== this.minutes && (A += this.minutes + "M"),
                (0 === this.seconds && 0 === this.milliseconds) ||
                  (A += ZA(this.seconds + this.milliseconds / 1e3, 3) + "S"),
                "P" === A && (A += "T0S"),
                A
              );
            }
            toISOTime(A = {}) {
              if (!this.isValid) return null;
              const e = this.toMillis();
              return e < 0 || e >= 864e5
                ? null
                : ((A = {
                    suppressMilliseconds: !1,
                    suppressSeconds: !1,
                    includePrefix: !1,
                    format: "extended",
                    ...A,
                    includeOffset: !1,
                  }),
                  Ei.fromMillis(e, { zone: "UTC" }).toISOTime(A));
            }
            toJSON() {
              return this.toISO();
            }
            toString() {
              return this.toISO();
            }
            [Symbol.for("nodejs.util.inspect.custom")]() {
              return this.isValid
                ? `Duration { values: ${JSON.stringify(this.values)} }`
                : `Duration { Invalid, reason: ${this.invalidReason} }`;
            }
            toMillis() {
              return this.isValid ? It(this.matrix, this.values) : NaN;
            }
            valueOf() {
              return this.toMillis();
            }
            plus(A) {
              if (!this.isValid) return this;
              const e = ft.fromDurationLike(A),
                t = {};
              for (const A of wt)
                (JA(e.values, A) || JA(this.values, A)) &&
                  (t[A] = e.get(A) + this.get(A));
              return ht(this, { values: t }, !0);
            }
            minus(A) {
              if (!this.isValid) return this;
              const e = ft.fromDurationLike(A);
              return this.plus(e.negate());
            }
            mapUnits(A) {
              if (!this.isValid) return this;
              const e = {};
              for (const t of Object.keys(this.values))
                e[t] = ge(A(this.values[t], t));
              return ht(this, { values: e }, !0);
            }
            get(A) {
              return this[ft.normalizeUnit(A)];
            }
            set(A) {
              return this.isValid
                ? ht(this, {
                    values: { ...this.values, ...re(A, ft.normalizeUnit) },
                  })
                : this;
            }
            reconfigure({
              locale: A,
              numberingSystem: e,
              conversionAccuracy: t,
              matrix: i,
            } = {}) {
              return ht(this, {
                loc: this.loc.clone({ locale: A, numberingSystem: e }),
                matrix: i,
                conversionAccuracy: t,
              });
            }
            as(A) {
              return this.isValid ? this.shiftTo(A).get(A) : NaN;
            }
            normalize() {
              if (!this.isValid) return this;
              const A = this.toObject();
              return (ut(this.matrix, A), ht(this, { values: A }, !0));
            }
            rescale() {
              return this.isValid
                ? ht(
                    this,
                    { values: vt(this.normalize().shiftToAll().toObject()) },
                    !0,
                  )
                : this;
            }
            shiftTo(...A) {
              if (!this.isValid) return this;
              if (0 === A.length) return this;
              A = A.map((A) => ft.normalizeUnit(A));
              const e = {},
                t = {},
                i = this.toObject();
              let n;
              for (const o of wt)
                if (A.indexOf(o) >= 0) {
                  n = o;
                  let A = 0;
                  for (const e in t)
                    ((A += this.matrix[e][o] * t[e]), (t[e] = 0));
                  xA(i[o]) && (A += i[o]);
                  const g = Math.trunc(A);
                  ((e[o] = g), (t[o] = (1e3 * A - 1e3 * g) / 1e3));
                } else xA(i[o]) && (t[o] = i[o]);
              for (const A in t)
                0 !== t[A] &&
                  (e[n] += A === n ? t[A] : t[A] / this.matrix[n][A]);
              return (ut(this.matrix, e), ht(this, { values: e }, !0));
            }
            shiftToAll() {
              return this.isValid
                ? this.shiftTo(
                    "years",
                    "months",
                    "weeks",
                    "days",
                    "hours",
                    "minutes",
                    "seconds",
                    "milliseconds",
                  )
                : this;
            }
            negate() {
              if (!this.isValid) return this;
              const A = {};
              for (const e of Object.keys(this.values))
                A[e] = 0 === this.values[e] ? 0 : -this.values[e];
              return ht(this, { values: A }, !0);
            }
            removeZeros() {
              return this.isValid
                ? ht(this, { values: vt(this.values) }, !0)
                : this;
            }
            get years() {
              return this.isValid ? this.values.years || 0 : NaN;
            }
            get quarters() {
              return this.isValid ? this.values.quarters || 0 : NaN;
            }
            get months() {
              return this.isValid ? this.values.months || 0 : NaN;
            }
            get weeks() {
              return this.isValid ? this.values.weeks || 0 : NaN;
            }
            get days() {
              return this.isValid ? this.values.days || 0 : NaN;
            }
            get hours() {
              return this.isValid ? this.values.hours || 0 : NaN;
            }
            get minutes() {
              return this.isValid ? this.values.minutes || 0 : NaN;
            }
            get seconds() {
              return this.isValid ? this.values.seconds || 0 : NaN;
            }
            get milliseconds() {
              return this.isValid ? this.values.milliseconds || 0 : NaN;
            }
            get isValid() {
              return null === this.invalid;
            }
            get invalidReason() {
              return this.invalid ? this.invalid.reason : null;
            }
            get invalidExplanation() {
              return this.invalid ? this.invalid.explanation : null;
            }
            equals(A) {
              if (!this.isValid || !A.isValid) return !1;
              if (!this.loc.equals(A.loc)) return !1;
              function e(A, e) {
                return void 0 === A || 0 === A
                  ? void 0 === e || 0 === e
                  : A === e;
              }
              for (const t of wt)
                if (!e(this.values[t], A.values[t])) return !1;
              return !0;
            }
          }
          const Mt = "Invalid Interval";
          class mt {
            constructor(A) {
              ((this.s = A.start),
                (this.e = A.end),
                (this.invalid = A.invalid || null),
                (this.isLuxonInterval = !0));
            }
            static invalid(A, e = null) {
              if (!A)
                throw new B("need to specify a reason the Interval is invalid");
              const t = A instanceof vA ? A : new vA(A, e);
              if (uA.throwOnInvalid) throw new o(t);
              return new mt({ invalid: t });
            }
            static fromDateTimes(A, e) {
              const t = di(A),
                i = di(e),
                n = (function (A, e) {
                  return A && A.isValid
                    ? e && e.isValid
                      ? e < A
                        ? mt.invalid(
                            "end before start",
                            `The end of an interval must be after its start, but you had start=${A.toISO()} and end=${e.toISO()}`,
                          )
                        : null
                      : mt.invalid("missing or invalid end")
                    : mt.invalid("missing or invalid start");
                })(t, i);
              return null == n ? new mt({ start: t, end: i }) : n;
            }
            static after(A, e) {
              const t = ft.fromDurationLike(e),
                i = di(A);
              return mt.fromDateTimes(i, i.plus(t));
            }
            static before(A, e) {
              const t = ft.fromDurationLike(e),
                i = di(A);
              return mt.fromDateTimes(i.minus(t), i);
            }
            static fromISO(A, e) {
              const [t, i] = (A || "").split("/", 2);
              if (t && i) {
                let A, n, o, g;
                try {
                  ((A = Ei.fromISO(t, e)), (n = A.isValid));
                } catch (i) {
                  n = !1;
                }
                try {
                  ((o = Ei.fromISO(i, e)), (g = o.isValid));
                } catch (i) {
                  g = !1;
                }
                if (n && g) return mt.fromDateTimes(A, o);
                if (n) {
                  const t = ft.fromISO(i, e);
                  if (t.isValid) return mt.after(A, t);
                } else if (g) {
                  const A = ft.fromISO(t, e);
                  if (A.isValid) return mt.before(o, A);
                }
              }
              return mt.invalid(
                "unparsable",
                `the input "${A}" can't be parsed as ISO 8601`,
              );
            }
            static isInterval(A) {
              return (A && A.isLuxonInterval) || !1;
            }
            get start() {
              return this.isValid ? this.s : null;
            }
            get end() {
              return this.isValid ? this.e : null;
            }
            get lastDateTime() {
              return this.isValid && this.e ? this.e.minus(1) : null;
            }
            get isValid() {
              return null === this.invalidReason;
            }
            get invalidReason() {
              return this.invalid ? this.invalid.reason : null;
            }
            get invalidExplanation() {
              return this.invalid ? this.invalid.explanation : null;
            }
            length(A = "milliseconds") {
              return this.isValid ? this.toDuration(A).get(A) : NaN;
            }
            count(A = "milliseconds", e) {
              if (!this.isValid) return NaN;
              const t = this.start.startOf(A, e);
              let i;
              return (
                (i = e?.useLocaleWeeks
                  ? this.end.reconfigure({ locale: t.locale })
                  : this.end),
                (i = i.startOf(A, e)),
                Math.floor(i.diff(t, A).get(A)) +
                  (i.valueOf() !== this.end.valueOf())
              );
            }
            hasSame(A) {
              return (
                !!this.isValid &&
                (this.isEmpty() || this.e.minus(1).hasSame(this.s, A))
              );
            }
            isEmpty() {
              return this.s.valueOf() === this.e.valueOf();
            }
            isAfter(A) {
              return !!this.isValid && this.s > A;
            }
            isBefore(A) {
              return !!this.isValid && this.e <= A;
            }
            contains(A) {
              return !!this.isValid && this.s <= A && this.e > A;
            }
            set({ start: A, end: e } = {}) {
              return this.isValid
                ? mt.fromDateTimes(A || this.s, e || this.e)
                : this;
            }
            splitAt(...A) {
              if (!this.isValid) return [];
              const e = A.map(di)
                  .filter((A) => this.contains(A))
                  .sort((A, e) => A.toMillis() - e.toMillis()),
                t = [];
              let { s: i } = this,
                n = 0;
              for (; i < this.e; ) {
                const A = e[n] || this.e,
                  o = +A > +this.e ? this.e : A;
                (t.push(mt.fromDateTimes(i, o)), (i = o), (n += 1));
              }
              return t;
            }
            splitBy(A) {
              const e = ft.fromDurationLike(A);
              if (!this.isValid || !e.isValid || 0 === e.as("milliseconds"))
                return [];
              let t,
                { s: i } = this,
                n = 1;
              const o = [];
              for (; i < this.e; ) {
                const A = this.start.plus(e.mapUnits((A) => A * n));
                ((t = +A > +this.e ? this.e : A),
                  o.push(mt.fromDateTimes(i, t)),
                  (i = t),
                  (n += 1));
              }
              return o;
            }
            divideEqually(A) {
              return this.isValid
                ? this.splitBy(this.length() / A).slice(0, A)
                : [];
            }
            overlaps(A) {
              return this.e > A.s && this.s < A.e;
            }
            abutsStart(A) {
              return !!this.isValid && +this.e === +A.s;
            }
            abutsEnd(A) {
              return !!this.isValid && +A.e === +this.s;
            }
            engulfs(A) {
              return !!this.isValid && this.s <= A.s && this.e >= A.e;
            }
            equals(A) {
              return (
                !(!this.isValid || !A.isValid) &&
                this.s.equals(A.s) &&
                this.e.equals(A.e)
              );
            }
            intersection(A) {
              if (!this.isValid) return this;
              const e = this.s > A.s ? this.s : A.s,
                t = this.e < A.e ? this.e : A.e;
              return e >= t ? null : mt.fromDateTimes(e, t);
            }
            union(A) {
              if (!this.isValid) return this;
              const e = this.s < A.s ? this.s : A.s,
                t = this.e > A.e ? this.e : A.e;
              return mt.fromDateTimes(e, t);
            }
            static merge(A) {
              const [e, t] = A.sort((A, e) => A.s - e.s).reduce(
                ([A, e], t) =>
                  e
                    ? e.overlaps(t) || e.abutsStart(t)
                      ? [A, e.union(t)]
                      : [A.concat([e]), t]
                    : [A, t],
                [[], null],
              );
              return (t && e.push(t), e);
            }
            static xor(A) {
              let e = null,
                t = 0;
              const i = [],
                n = A.map((A) => [
                  { time: A.s, type: "s" },
                  { time: A.e, type: "e" },
                ]),
                o = Array.prototype
                  .concat(...n)
                  .sort((A, e) => A.time - e.time);
              for (const A of o)
                ((t += "s" === A.type ? 1 : -1),
                  1 === t
                    ? (e = A.time)
                    : (e &&
                        +e !== +A.time &&
                        i.push(mt.fromDateTimes(e, A.time)),
                      (e = null)));
              return mt.merge(i);
            }
            difference(...A) {
              return mt
                .xor([this].concat(A))
                .map((A) => this.intersection(A))
                .filter((A) => A && !A.isEmpty());
            }
            toString() {
              return this.isValid
                ? `[${this.s.toISO()} – ${this.e.toISO()})`
                : Mt;
            }
            [Symbol.for("nodejs.util.inspect.custom")]() {
              return this.isValid
                ? `Interval { start: ${this.s.toISO()}, end: ${this.e.toISO()} }`
                : `Interval { Invalid, reason: ${this.invalidReason} }`;
            }
            toLocaleString(A = l, e = {}) {
              return this.isValid
                ? me.create(this.s.loc.clone(e), A).formatInterval(this)
                : Mt;
            }
            toISO(A) {
              return this.isValid
                ? `${this.s.toISO(A)}/${this.e.toISO(A)}`
                : Mt;
            }
            toISODate() {
              return this.isValid
                ? `${this.s.toISODate()}/${this.e.toISODate()}`
                : Mt;
            }
            toISOTime(A) {
              return this.isValid
                ? `${this.s.toISOTime(A)}/${this.e.toISOTime(A)}`
                : Mt;
            }
            toFormat(A, { separator: e = " – " } = {}) {
              return this.isValid
                ? `${this.s.toFormat(A)}${e}${this.e.toFormat(A)}`
                : Mt;
            }
            toDuration(A, e) {
              return this.isValid
                ? this.e.diff(this.s, A, e)
                : ft.invalid(this.invalidReason);
            }
            mapEndpoints(A) {
              return mt.fromDateTimes(A(this.s), A(this.e));
            }
          }
          class Yt {
            static hasDST(A = uA.defaultZone) {
              const e = Ei.now().setZone(A).set({ month: 12 });
              return !A.isUniversal && e.offset !== e.set({ month: 6 }).offset;
            }
            static isValidIANAZone(A) {
              return N.isValidZone(A);
            }
            static normalizeZone(A) {
              return rA(A, uA.defaultZone);
            }
            static getStartOfWeek({ locale: A = null, locObj: e = null } = {}) {
              return (e || iA.create(A)).getStartOfWeek();
            }
            static getMinimumDaysInFirstWeek({
              locale: A = null,
              locObj: e = null,
            } = {}) {
              return (e || iA.create(A)).getMinDaysInFirstWeek();
            }
            static getWeekendWeekdays({
              locale: A = null,
              locObj: e = null,
            } = {}) {
              return (e || iA.create(A)).getWeekendDays().slice();
            }
            static months(
              A = "long",
              {
                locale: e = null,
                numberingSystem: t = null,
                locObj: i = null,
                outputCalendar: n = "gregory",
              } = {},
            ) {
              return (i || iA.create(e, t, n)).months(A);
            }
            static monthsFormat(
              A = "long",
              {
                locale: e = null,
                numberingSystem: t = null,
                locObj: i = null,
                outputCalendar: n = "gregory",
              } = {},
            ) {
              return (i || iA.create(e, t, n)).months(A, !0);
            }
            static weekdays(
              A = "long",
              {
                locale: e = null,
                numberingSystem: t = null,
                locObj: i = null,
              } = {},
            ) {
              return (i || iA.create(e, t, null)).weekdays(A);
            }
            static weekdaysFormat(
              A = "long",
              {
                locale: e = null,
                numberingSystem: t = null,
                locObj: i = null,
              } = {},
            ) {
              return (i || iA.create(e, t, null)).weekdays(A, !0);
            }
            static meridiems({ locale: A = null } = {}) {
              return iA.create(A).meridiems();
            }
            static eras(A = "short", { locale: e = null } = {}) {
              return iA.create(e, null, "gregory").eras(A);
            }
            static features() {
              return { relative: TA(), localeWeek: OA() };
            }
          }
          function pt(A, e) {
            const t = (A) =>
                A.toUTC(0, { keepLocalTime: !0 }).startOf("day").valueOf(),
              i = t(e) - t(A);
            return Math.floor(ft.fromMillis(i).as("days"));
          }
          function yt(A, e = (A) => A) {
            return {
              regex: A,
              deser: ([A]) =>
                e(
                  (function (A) {
                    let e = parseInt(A, 10);
                    if (isNaN(e)) {
                      e = "";
                      for (let t = 0; t < A.length; t++) {
                        const i = A.charCodeAt(t);
                        if (-1 !== A[t].search(aA.hanidec))
                          e += sA.indexOf(A[t]);
                        else
                          for (const A in BA) {
                            const [t, n] = BA[A];
                            i >= t && i <= n && (e += i - t);
                          }
                      }
                      return parseInt(e, 10);
                    }
                    return e;
                  })(A),
                ),
            };
          }
          const Pt = `[ ${String.fromCharCode(160)}]`,
            Ft = new RegExp(Pt, "g");
          function Gt(A) {
            return A.replace(/\./g, "\\.?").replace(Ft, Pt);
          }
          function Ht(A) {
            return A.replace(/\./g, "").replace(Ft, " ").toLowerCase();
          }
          function Lt(A, e) {
            return null === A
              ? null
              : {
                  regex: RegExp(A.map(Gt).join("|")),
                  deser: ([t]) => A.findIndex((A) => Ht(t) === Ht(A)) + e,
                };
          }
          function bt(A, e) {
            return { regex: A, deser: ([, A, e]) => oe(A, e), groups: e };
          }
          function Ut(A) {
            return { regex: A, deser: ([A]) => A };
          }
          const St = {
            year: { "2-digit": "yy", numeric: "yyyyy" },
            month: {
              numeric: "M",
              "2-digit": "MM",
              short: "MMM",
              long: "MMMM",
            },
            day: { numeric: "d", "2-digit": "dd" },
            weekday: { short: "EEE", long: "EEEE" },
            dayperiod: "a",
            dayPeriod: "a",
            hour12: { numeric: "h", "2-digit": "hh" },
            hour24: { numeric: "H", "2-digit": "HH" },
            minute: { numeric: "m", "2-digit": "mm" },
            second: { numeric: "s", "2-digit": "ss" },
            timeZoneName: { long: "ZZZZZ", short: "ZZZ" },
          };
          let zt = null;
          function xt(A, e) {
            return Array.prototype.concat(
              ...A.map((A) =>
                (function (A, e) {
                  if (A.literal) return A;
                  const t = Ot(me.macroTokenToFormatOpts(A.val), e);
                  return null == t || t.includes(void 0) ? A : t;
                })(A, e),
              ),
            );
          }
          class kt {
            constructor(A, e) {
              if (
                ((this.locale = A),
                (this.format = e),
                (this.tokens = xt(me.parseFormat(e), A)),
                (this.units = this.tokens.map((e) =>
                  (function (A, e) {
                    const t = QA(e),
                      i = QA(e, "{2}"),
                      n = QA(e, "{3}"),
                      o = QA(e, "{4}"),
                      g = QA(e, "{6}"),
                      r = QA(e, "{1,2}"),
                      a = QA(e, "{1,3}"),
                      B = QA(e, "{1,6}"),
                      s = QA(e, "{1,9}"),
                      c = QA(e, "{2,4}"),
                      Q = QA(e, "{4,6}"),
                      C = (A) => {
                        return {
                          regex: RegExp(
                            ((e = A.val),
                            e.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")),
                          ),
                          deser: ([A]) => A,
                          literal: !0,
                        };
                        var e;
                      },
                      l = ((l) => {
                        if (A.literal) return C(l);
                        switch (l.val) {
                          case "G":
                            return Lt(e.eras("short"), 0);
                          case "GG":
                            return Lt(e.eras("long"), 0);
                          case "y":
                            return yt(B);
                          case "yy":
                          case "kk":
                            return yt(c, ie);
                          case "yyyy":
                          case "kkkk":
                            return yt(o);
                          case "yyyyy":
                            return yt(Q);
                          case "yyyyyy":
                            return yt(g);
                          case "M":
                          case "L":
                          case "d":
                          case "H":
                          case "h":
                          case "m":
                          case "q":
                          case "s":
                          case "W":
                            return yt(r);
                          case "MM":
                          case "LL":
                          case "dd":
                          case "HH":
                          case "hh":
                          case "mm":
                          case "qq":
                          case "ss":
                          case "WW":
                            return yt(i);
                          case "MMM":
                            return Lt(e.months("short", !0), 1);
                          case "MMMM":
                            return Lt(e.months("long", !0), 1);
                          case "LLL":
                            return Lt(e.months("short", !1), 1);
                          case "LLLL":
                            return Lt(e.months("long", !1), 1);
                          case "o":
                          case "S":
                            return yt(a);
                          case "ooo":
                          case "SSS":
                            return yt(n);
                          case "u":
                            return Ut(s);
                          case "uu":
                            return Ut(r);
                          case "uuu":
                          case "E":
                          case "c":
                            return yt(t);
                          case "a":
                            return Lt(e.meridiems(), 0);
                          case "EEE":
                            return Lt(e.weekdays("short", !1), 1);
                          case "EEEE":
                            return Lt(e.weekdays("long", !1), 1);
                          case "ccc":
                            return Lt(e.weekdays("short", !0), 1);
                          case "cccc":
                            return Lt(e.weekdays("long", !0), 1);
                          case "Z":
                          case "ZZ":
                            return bt(
                              new RegExp(
                                `([+-]${r.source})(?::(${i.source}))?`,
                              ),
                              2,
                            );
                          case "ZZZ":
                            return bt(
                              new RegExp(`([+-]${r.source})(${i.source})?`),
                              2,
                            );
                          case "z":
                            return Ut(/[a-z_+-/]{1,256}?/i);
                          case " ":
                            return Ut(/[^\S\n\r]/);
                          default:
                            return C(l);
                        }
                      })(A) || {
                        invalidReason:
                          "missing Intl.DateTimeFormat.formatToParts support",
                      };
                    return ((l.token = A), l);
                  })(e, A),
                )),
                (this.disqualifyingUnit = this.units.find(
                  (A) => A.invalidReason,
                )),
                !this.disqualifyingUnit)
              ) {
                const [A, e] = [
                  `^${(t = this.units).map((A) => A.regex).reduce((A, e) => `${A}(${e.source})`, "")}$`,
                  t,
                ];
                ((this.regex = RegExp(A, "i")), (this.handlers = e));
              }
              var t;
            }
            explainFromTokens(A) {
              if (this.isValid) {
                const [e, t] = (function (A, e, t) {
                    const i = A.match(e);
                    if (i) {
                      const A = {};
                      let e = 1;
                      for (const n in t)
                        if (JA(t, n)) {
                          const o = t[n],
                            g = o.groups ? o.groups + 1 : 1;
                          (!o.literal &&
                            o.token &&
                            (A[o.token.val[0]] = o.deser(i.slice(e, e + g))),
                            (e += g));
                        }
                      return [i, A];
                    }
                    return [i, {}];
                  })(A, this.regex, this.handlers),
                  [i, n, o] = t
                    ? (function (A) {
                        let e,
                          t = null;
                        return (
                          zA(A.z) || (t = N.create(A.z)),
                          zA(A.Z) || (t || (t = new oA(A.Z)), (e = A.Z)),
                          zA(A.q) || (A.M = 3 * (A.q - 1) + 1),
                          zA(A.h) ||
                            (A.h < 12 && 1 === A.a
                              ? (A.h += 12)
                              : 12 === A.h && 0 === A.a && (A.h = 0)),
                          0 === A.G && A.y && (A.y = -A.y),
                          zA(A.u) || (A.S = XA(A.u)),
                          [
                            Object.keys(A).reduce((e, t) => {
                              const i = ((A) => {
                                switch (A) {
                                  case "S":
                                    return "millisecond";
                                  case "s":
                                    return "second";
                                  case "m":
                                    return "minute";
                                  case "h":
                                  case "H":
                                    return "hour";
                                  case "d":
                                    return "day";
                                  case "o":
                                    return "ordinal";
                                  case "L":
                                  case "M":
                                    return "month";
                                  case "y":
                                    return "year";
                                  case "E":
                                  case "c":
                                    return "weekday";
                                  case "W":
                                    return "weekNumber";
                                  case "k":
                                    return "weekYear";
                                  case "q":
                                    return "quarter";
                                  default:
                                    return null;
                                }
                              })(t);
                              return (i && (e[i] = A[t]), e);
                            }, {}),
                            t,
                            e,
                          ]
                        );
                      })(t)
                    : [null, null, void 0];
                if (JA(t, "a") && JA(t, "H"))
                  throw new r(
                    "Can't include meridiem when specifying 24-hour format",
                  );
                return {
                  input: A,
                  tokens: this.tokens,
                  regex: this.regex,
                  rawMatches: e,
                  matches: t,
                  result: i,
                  zone: n,
                  specificOffset: o,
                };
              }
              return {
                input: A,
                tokens: this.tokens,
                invalidReason: this.invalidReason,
              };
            }
            get isValid() {
              return !this.disqualifyingUnit;
            }
            get invalidReason() {
              return this.disqualifyingUnit
                ? this.disqualifyingUnit.invalidReason
                : null;
            }
          }
          function Tt(A, e, t) {
            return new kt(A, t).explainFromTokens(e);
          }
          function Ot(A, e) {
            if (!A) return null;
            const t = me
                .create(e, A)
                .dtFormatter((zt || (zt = Ei.fromMillis(1555555555555)), zt)),
              i = t.formatToParts(),
              n = t.resolvedOptions();
            return i.map((e) =>
              (function (A, e, t) {
                const { type: i, value: n } = A;
                if ("literal" === i) {
                  const A = /^\s+$/.test(n);
                  return { literal: !A, val: A ? " " : n };
                }
                const o = e[i];
                let g = i;
                "hour" === i &&
                  (g =
                    null != e.hour12
                      ? e.hour12
                        ? "hour12"
                        : "hour24"
                      : null != e.hourCycle
                        ? "h11" === e.hourCycle || "h12" === e.hourCycle
                          ? "hour12"
                          : "hour24"
                        : t.hour12
                          ? "hour12"
                          : "hour24");
                let r = St[g];
                if (("object" == typeof r && (r = r[o]), r))
                  return { literal: !1, val: r };
              })(e, A, n),
            );
          }
          const Nt = "Invalid DateTime",
            Jt = 864e13;
          function Rt(A) {
            return new vA(
              "unsupported zone",
              `the zone "${A.name}" is not supported`,
            );
          }
          function jt(A) {
            return (null === A.weekData && (A.weekData = FA(A.c)), A.weekData);
          }
          function Wt(A) {
            return (
              null === A.localWeekData &&
                (A.localWeekData = FA(
                  A.c,
                  A.loc.getMinDaysInFirstWeek(),
                  A.loc.getStartOfWeek(),
                )),
              A.localWeekData
            );
          }
          function Kt(A, e) {
            const t = {
              ts: A.ts,
              zone: A.zone,
              c: A.c,
              o: A.o,
              loc: A.loc,
              invalid: A.invalid,
            };
            return new Ei({ ...t, ...e, old: t });
          }
          function Vt(A, e, t) {
            let i = A - 60 * e * 1e3;
            const n = t.offset(i);
            if (e === n) return [i, e];
            i -= 60 * (n - e) * 1e3;
            const o = t.offset(i);
            return n === o
              ? [i, n]
              : [A - 60 * Math.min(n, o) * 1e3, Math.max(n, o)];
          }
          function Xt(A, e) {
            const t = new Date((A += 60 * e * 1e3));
            return {
              year: t.getUTCFullYear(),
              month: t.getUTCMonth() + 1,
              day: t.getUTCDate(),
              hour: t.getUTCHours(),
              minute: t.getUTCMinutes(),
              second: t.getUTCSeconds(),
              millisecond: t.getUTCMilliseconds(),
            };
          }
          function Zt(A, e, t) {
            return Vt(Ae(A), e, t);
          }
          function qt(A, e) {
            const t = A.o,
              i = A.c.year + Math.trunc(e.years),
              n = A.c.month + Math.trunc(e.months) + 3 * Math.trunc(e.quarters),
              o = {
                ...A.c,
                year: i,
                month: n,
                day:
                  Math.min(A.c.day, $A(i, n)) +
                  Math.trunc(e.days) +
                  7 * Math.trunc(e.weeks),
              },
              g = ft
                .fromObject({
                  years: e.years - Math.trunc(e.years),
                  quarters: e.quarters - Math.trunc(e.quarters),
                  months: e.months - Math.trunc(e.months),
                  weeks: e.weeks - Math.trunc(e.weeks),
                  days: e.days - Math.trunc(e.days),
                  hours: e.hours,
                  minutes: e.minutes,
                  seconds: e.seconds,
                  milliseconds: e.milliseconds,
                })
                .as("milliseconds"),
              r = Ae(o);
            let [a, B] = Vt(r, t, A.zone);
            return (
              0 !== g && ((a += g), (B = A.zone.offset(a))),
              { ts: a, o: B }
            );
          }
          function _t(A, e, t, i, n, o) {
            const { setZone: g, zone: r } = t;
            if ((A && 0 !== Object.keys(A).length) || e) {
              const i = e || r,
                n = Ei.fromObject(A, { ...t, zone: i, specificOffset: o });
              return g ? n : n.setZone(r);
            }
            return Ei.invalid(
              new vA("unparsable", `the input "${n}" can't be parsed as ${i}`),
            );
          }
          function $t(A, e, t = !0) {
            return A.isValid
              ? me
                  .create(iA.create("en-US"), { allowZ: t, forceSimple: !0 })
                  .formatDateTimeFromString(A, e)
              : null;
          }
          function Ai(A, e, t) {
            const i = A.c.year > 9999 || A.c.year < 0;
            let n = "";
            if (
              (i && A.c.year >= 0 && (n += "+"),
              (n += WA(A.c.year, i ? 6 : 4)),
              "year" === t)
            )
              return n;
            if (e) {
              if (((n += "-"), (n += WA(A.c.month)), "month" === t)) return n;
              n += "-";
            } else if (((n += WA(A.c.month)), "month" === t)) return n;
            return ((n += WA(A.c.day)), n);
          }
          function ei(A, e, t, i, n, o, g) {
            let r = !t || 0 !== A.c.millisecond || 0 !== A.c.second,
              a = "";
            switch (g) {
              case "day":
              case "month":
              case "year":
                break;
              default:
                if (((a += WA(A.c.hour)), "hour" === g)) break;
                if (e) {
                  if (((a += ":"), (a += WA(A.c.minute)), "minute" === g))
                    break;
                  r && ((a += ":"), (a += WA(A.c.second)));
                } else {
                  if (((a += WA(A.c.minute)), "minute" === g)) break;
                  r && (a += WA(A.c.second));
                }
                if ("second" === g) break;
                !r ||
                  (i && 0 === A.c.millisecond) ||
                  ((a += "."), (a += WA(A.c.millisecond, 3)));
            }
            return (
              n &&
                (A.isOffsetFixed && 0 === A.offset && !o
                  ? (a += "Z")
                  : A.o < 0
                    ? ((a += "-"),
                      (a += WA(Math.trunc(-A.o / 60))),
                      (a += ":"),
                      (a += WA(Math.trunc(-A.o % 60))))
                    : ((a += "+"),
                      (a += WA(Math.trunc(A.o / 60))),
                      (a += ":"),
                      (a += WA(Math.trunc(A.o % 60))))),
              o && (a += "[" + A.zone.ianaName + "]"),
              a
            );
          }
          const ti = {
              month: 1,
              day: 1,
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            },
            ii = {
              weekNumber: 1,
              weekday: 1,
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            },
            ni = { ordinal: 1, hour: 0, minute: 0, second: 0, millisecond: 0 },
            oi = [
              "year",
              "month",
              "day",
              "hour",
              "minute",
              "second",
              "millisecond",
            ],
            gi = [
              "weekYear",
              "weekNumber",
              "weekday",
              "hour",
              "minute",
              "second",
              "millisecond",
            ],
            ri = ["year", "ordinal", "hour", "minute", "second", "millisecond"];
          function ai(A) {
            const e = {
              year: "year",
              years: "year",
              month: "month",
              months: "month",
              day: "day",
              days: "day",
              hour: "hour",
              hours: "hour",
              minute: "minute",
              minutes: "minute",
              quarter: "quarter",
              quarters: "quarter",
              second: "second",
              seconds: "second",
              millisecond: "millisecond",
              milliseconds: "millisecond",
              weekday: "weekday",
              weekdays: "weekday",
              weeknumber: "weekNumber",
              weeksnumber: "weekNumber",
              weeknumbers: "weekNumber",
              weekyear: "weekYear",
              weekyears: "weekYear",
              ordinal: "ordinal",
            }[A.toLowerCase()];
            if (!e) throw new a(A);
            return e;
          }
          function Bi(A) {
            switch (A.toLowerCase()) {
              case "localweekday":
              case "localweekdays":
                return "localWeekday";
              case "localweeknumber":
              case "localweeknumbers":
                return "localWeekNumber";
              case "localweekyear":
              case "localweekyears":
                return "localWeekYear";
              default:
                return ai(A);
            }
          }
          function si(A, e) {
            const t = rA(e.zone, uA.defaultZone);
            if (!t.isValid) return Ei.invalid(Rt(t));
            const i = iA.fromObject(e);
            let n, o;
            if (zA(A.year)) n = uA.now();
            else {
              for (const e of oi) zA(A[e]) && (A[e] = ti[e]);
              const e = UA(A) || SA(A);
              if (e) return Ei.invalid(e);
              const i = (function (A) {
                if ((void 0 === Ci && (Ci = uA.now()), "iana" !== A.type))
                  return A.offset(Ci);
                const e = A.name;
                let t = li.get(e);
                return (void 0 === t && ((t = A.offset(Ci)), li.set(e, t)), t);
              })(t);
              [n, o] = Zt(A, i, t);
            }
            return new Ei({ ts: n, zone: t, loc: i, o });
          }
          function ci(A, e, t) {
            const i = !!zA(t.round) || t.round,
              n = zA(t.rounding) ? "trunc" : t.rounding,
              o = (A, o) => (
                (A = ZA(
                  A,
                  i || t.calendary ? 0 : 2,
                  t.calendary ? "round" : n,
                )),
                e.loc.clone(t).relFormatter(t).format(A, o)
              ),
              g = (i) =>
                t.calendary
                  ? e.hasSame(A, i)
                    ? 0
                    : e.startOf(i).diff(A.startOf(i), i).get(i)
                  : e.diff(A, i).get(i);
            if (t.unit) return o(g(t.unit), t.unit);
            for (const A of t.units) {
              const e = g(A);
              if (Math.abs(e) >= 1) return o(e, A);
            }
            return o(A > e ? -0 : 0, t.units[t.units.length - 1]);
          }
          function Qi(A) {
            let e,
              t = {};
            return (
              A.length > 0 && "object" == typeof A[A.length - 1]
                ? ((t = A[A.length - 1]),
                  (e = Array.from(A).slice(0, A.length - 1)))
                : (e = Array.from(A)),
              [t, e]
            );
          }
          let Ci;
          const li = new Map();
          class Ei {
            constructor(A) {
              const e = A.zone || uA.defaultZone;
              let t =
                A.invalid ||
                (Number.isNaN(A.ts) ? new vA("invalid input") : null) ||
                (e.isValid ? null : Rt(e));
              this.ts = zA(A.ts) ? uA.now() : A.ts;
              let i = null,
                n = null;
              if (!t)
                if (A.old && A.old.ts === this.ts && A.old.zone.equals(e))
                  [i, n] = [A.old.c, A.old.o];
                else {
                  const o = xA(A.o) && !A.old ? A.o : e.offset(this.ts);
                  ((i = Xt(this.ts, o)),
                    (t = Number.isNaN(i.year) ? new vA("invalid input") : null),
                    (i = t ? null : i),
                    (n = t ? null : o));
                }
              ((this._zone = e),
                (this.loc = A.loc || iA.create()),
                (this.invalid = t),
                (this.weekData = null),
                (this.localWeekData = null),
                (this.c = i),
                (this.o = n),
                (this.isLuxonDateTime = !0));
            }
            static now() {
              return new Ei({});
            }
            static local() {
              const [A, e] = Qi(arguments),
                [t, i, n, o, g, r, a] = e;
              return si(
                {
                  year: t,
                  month: i,
                  day: n,
                  hour: o,
                  minute: g,
                  second: r,
                  millisecond: a,
                },
                A,
              );
            }
            static utc() {
              const [A, e] = Qi(arguments),
                [t, i, n, o, g, r, a] = e;
              return (
                (A.zone = oA.utcInstance),
                si(
                  {
                    year: t,
                    month: i,
                    day: n,
                    hour: o,
                    minute: g,
                    second: r,
                    millisecond: a,
                  },
                  A,
                )
              );
            }
            static fromJSDate(A, e = {}) {
              const t =
                ((i = A),
                "[object Date]" === Object.prototype.toString.call(i)
                  ? A.valueOf()
                  : NaN);
              var i;
              if (Number.isNaN(t)) return Ei.invalid("invalid input");
              const n = rA(e.zone, uA.defaultZone);
              return n.isValid
                ? new Ei({ ts: t, zone: n, loc: iA.fromObject(e) })
                : Ei.invalid(Rt(n));
            }
            static fromMillis(A, e = {}) {
              if (xA(A))
                return A < -Jt || A > Jt
                  ? Ei.invalid("Timestamp out of range")
                  : new Ei({
                      ts: A,
                      zone: rA(e.zone, uA.defaultZone),
                      loc: iA.fromObject(e),
                    });
              throw new B(
                `fromMillis requires a numerical input, but received a ${typeof A} with value ${A}`,
              );
            }
            static fromSeconds(A, e = {}) {
              if (xA(A))
                return new Ei({
                  ts: 1e3 * A,
                  zone: rA(e.zone, uA.defaultZone),
                  loc: iA.fromObject(e),
                });
              throw new B("fromSeconds requires a numerical input");
            }
            static fromObject(A, e = {}) {
              A = A || {};
              const t = rA(e.zone, uA.defaultZone);
              if (!t.isValid) return Ei.invalid(Rt(t));
              const i = iA.fromObject(e),
                n = re(A, Bi),
                { minDaysInFirstWeek: o, startOfWeek: g } = bA(n, i),
                a = uA.now(),
                B = zA(e.specificOffset) ? t.offset(a) : e.specificOffset,
                s = !zA(n.ordinal),
                c = !zA(n.year),
                Q = !zA(n.month) || !zA(n.day),
                C = c || Q,
                l = n.weekYear || n.weekNumber;
              if ((C || s) && l)
                throw new r(
                  "Can't mix weekYear/weekNumber units with year/month/day or ordinals",
                );
              if (Q && s) throw new r("Can't mix ordinal dates with month/day");
              const E = l || (n.weekday && !C);
              let d,
                w,
                D = Xt(a, B);
              E
                ? ((d = gi), (w = ii), (D = FA(D, o, g)))
                : s
                  ? ((d = ri), (w = ni), (D = HA(D)))
                  : ((d = oi), (w = ti));
              let h = !1;
              for (const A of d) zA(n[A]) ? (n[A] = h ? w[A] : D[A]) : (h = !0);
              const I = E
                  ? (function (A, e = 4, t = 1) {
                      const i = kA(A.weekYear),
                        n = jA(A.weekNumber, 1, te(A.weekYear, e, t)),
                        o = jA(A.weekday, 1, 7);
                      return i
                        ? n
                          ? !o && mA("weekday", A.weekday)
                          : mA("week", A.weekNumber)
                        : mA("weekYear", A.weekYear);
                    })(n, o, g)
                  : s
                    ? (function (A) {
                        const e = kA(A.year),
                          t = jA(A.ordinal, 1, _A(A.year));
                        return e
                          ? !t && mA("ordinal", A.ordinal)
                          : mA("year", A.year);
                      })(n)
                    : UA(n),
                u = I || SA(n);
              if (u) return Ei.invalid(u);
              const v = E ? GA(n, o, g) : s ? LA(n) : n,
                [f, M] = Zt(v, B, t),
                m = new Ei({ ts: f, zone: t, o: M, loc: i });
              return n.weekday && C && A.weekday !== m.weekday
                ? Ei.invalid(
                    "mismatched weekday",
                    `you can't specify both a weekday of ${n.weekday} and a date of ${m.toISO()}`,
                  )
                : m.isValid
                  ? m
                  : Ei.invalid(m.invalid);
            }
            static fromISO(A, e = {}) {
              const [t, i] = (function (A) {
                return Pe(A, [et, ot], [tt, gt], [it, rt], [nt, at]);
              })(A);
              return _t(t, i, e, "ISO 8601", A);
            }
            static fromRFC2822(A, e = {}) {
              const [t, i] = (function (A) {
                return Pe(
                  (function (A) {
                    return A.replace(/\([^()]*\)|[\n\t]/g, " ")
                      .replace(/(\s\s+)/g, " ")
                      .trim();
                  })(A),
                  [Ve, Xe],
                );
              })(A);
              return _t(t, i, e, "RFC 2822", A);
            }
            static fromHTTP(A, e = {}) {
              const [t, i] = (function (A) {
                return Pe(A, [Ze, $e], [qe, $e], [_e, At]);
              })(A);
              return _t(t, i, e, "HTTP", e);
            }
            static fromFormat(A, e, t = {}) {
              if (zA(A) || zA(e))
                throw new B("fromFormat requires an input string and a format");
              const { locale: i = null, numberingSystem: n = null } = t,
                o = iA.fromOpts({
                  locale: i,
                  numberingSystem: n,
                  defaultToEN: !0,
                }),
                [g, r, a, s] = (function (A, e, t) {
                  const {
                    result: i,
                    zone: n,
                    specificOffset: o,
                    invalidReason: g,
                  } = Tt(A, e, t);
                  return [i, n, o, g];
                })(o, A, e);
              return s ? Ei.invalid(s) : _t(g, r, t, `format ${e}`, A, a);
            }
            static fromString(A, e, t = {}) {
              return Ei.fromFormat(A, e, t);
            }
            static fromSQL(A, e = {}) {
              const [t, i] = (function (A) {
                return Pe(A, [st, ot], [ct, Qt]);
              })(A);
              return _t(t, i, e, "SQL", A);
            }
            static invalid(A, e = null) {
              if (!A)
                throw new B("need to specify a reason the DateTime is invalid");
              const t = A instanceof vA ? A : new vA(A, e);
              if (uA.throwOnInvalid) throw new n(t);
              return new Ei({ invalid: t });
            }
            static isDateTime(A) {
              return (A && A.isLuxonDateTime) || !1;
            }
            static parseFormatForOpts(A, e = {}) {
              const t = Ot(A, iA.fromObject(e));
              return t ? t.map((A) => (A ? A.val : null)).join("") : null;
            }
            static expandFormat(A, e = {}) {
              return xt(me.parseFormat(A), iA.fromObject(e))
                .map((A) => A.val)
                .join("");
            }
            static resetCache() {
              ((Ci = void 0), li.clear());
            }
            get(A) {
              return this[A];
            }
            get isValid() {
              return null === this.invalid;
            }
            get invalidReason() {
              return this.invalid ? this.invalid.reason : null;
            }
            get invalidExplanation() {
              return this.invalid ? this.invalid.explanation : null;
            }
            get locale() {
              return this.isValid ? this.loc.locale : null;
            }
            get numberingSystem() {
              return this.isValid ? this.loc.numberingSystem : null;
            }
            get outputCalendar() {
              return this.isValid ? this.loc.outputCalendar : null;
            }
            get zone() {
              return this._zone;
            }
            get zoneName() {
              return this.isValid ? this.zone.name : null;
            }
            get year() {
              return this.isValid ? this.c.year : NaN;
            }
            get quarter() {
              return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
            }
            get month() {
              return this.isValid ? this.c.month : NaN;
            }
            get day() {
              return this.isValid ? this.c.day : NaN;
            }
            get hour() {
              return this.isValid ? this.c.hour : NaN;
            }
            get minute() {
              return this.isValid ? this.c.minute : NaN;
            }
            get second() {
              return this.isValid ? this.c.second : NaN;
            }
            get millisecond() {
              return this.isValid ? this.c.millisecond : NaN;
            }
            get weekYear() {
              return this.isValid ? jt(this).weekYear : NaN;
            }
            get weekNumber() {
              return this.isValid ? jt(this).weekNumber : NaN;
            }
            get weekday() {
              return this.isValid ? jt(this).weekday : NaN;
            }
            get isWeekend() {
              return (
                this.isValid && this.loc.getWeekendDays().includes(this.weekday)
              );
            }
            get localWeekday() {
              return this.isValid ? Wt(this).weekday : NaN;
            }
            get localWeekNumber() {
              return this.isValid ? Wt(this).weekNumber : NaN;
            }
            get localWeekYear() {
              return this.isValid ? Wt(this).weekYear : NaN;
            }
            get ordinal() {
              return this.isValid ? HA(this.c).ordinal : NaN;
            }
            get monthShort() {
              return this.isValid
                ? Yt.months("short", { locObj: this.loc })[this.month - 1]
                : null;
            }
            get monthLong() {
              return this.isValid
                ? Yt.months("long", { locObj: this.loc })[this.month - 1]
                : null;
            }
            get weekdayShort() {
              return this.isValid
                ? Yt.weekdays("short", { locObj: this.loc })[this.weekday - 1]
                : null;
            }
            get weekdayLong() {
              return this.isValid
                ? Yt.weekdays("long", { locObj: this.loc })[this.weekday - 1]
                : null;
            }
            get offset() {
              return this.isValid ? +this.o : NaN;
            }
            get offsetNameShort() {
              return this.isValid
                ? this.zone.offsetName(this.ts, {
                    format: "short",
                    locale: this.locale,
                  })
                : null;
            }
            get offsetNameLong() {
              return this.isValid
                ? this.zone.offsetName(this.ts, {
                    format: "long",
                    locale: this.locale,
                  })
                : null;
            }
            get isOffsetFixed() {
              return this.isValid ? this.zone.isUniversal : null;
            }
            get isInDST() {
              return (
                !this.isOffsetFixed &&
                (this.offset > this.set({ month: 1, day: 1 }).offset ||
                  this.offset > this.set({ month: 5 }).offset)
              );
            }
            getPossibleOffsets() {
              if (!this.isValid || this.isOffsetFixed) return [this];
              const A = 864e5,
                e = 6e4,
                t = Ae(this.c),
                i = this.zone.offset(t - A),
                n = this.zone.offset(t + A),
                o = this.zone.offset(t - i * e),
                g = this.zone.offset(t - n * e);
              if (o === g) return [this];
              const r = t - o * e,
                a = t - g * e,
                B = Xt(r, o),
                s = Xt(a, g);
              return B.hour === s.hour &&
                B.minute === s.minute &&
                B.second === s.second &&
                B.millisecond === s.millisecond
                ? [Kt(this, { ts: r }), Kt(this, { ts: a })]
                : [this];
            }
            get isInLeapYear() {
              return qA(this.year);
            }
            get daysInMonth() {
              return $A(this.year, this.month);
            }
            get daysInYear() {
              return this.isValid ? _A(this.year) : NaN;
            }
            get weeksInWeekYear() {
              return this.isValid ? te(this.weekYear) : NaN;
            }
            get weeksInLocalWeekYear() {
              return this.isValid
                ? te(
                    this.localWeekYear,
                    this.loc.getMinDaysInFirstWeek(),
                    this.loc.getStartOfWeek(),
                  )
                : NaN;
            }
            resolvedLocaleOptions(A = {}) {
              const {
                locale: e,
                numberingSystem: t,
                calendar: i,
              } = me.create(this.loc.clone(A), A).resolvedOptions(this);
              return { locale: e, numberingSystem: t, outputCalendar: i };
            }
            toUTC(A = 0, e = {}) {
              return this.setZone(oA.instance(A), e);
            }
            toLocal() {
              return this.setZone(uA.defaultZone);
            }
            setZone(
              A,
              { keepLocalTime: e = !1, keepCalendarTime: t = !1 } = {},
            ) {
              if ((A = rA(A, uA.defaultZone)).equals(this.zone)) return this;
              if (A.isValid) {
                let i = this.ts;
                if (e || t) {
                  const e = A.offset(this.ts),
                    t = this.toObject();
                  [i] = Zt(t, e, A);
                }
                return Kt(this, { ts: i, zone: A });
              }
              return Ei.invalid(Rt(A));
            }
            reconfigure({
              locale: A,
              numberingSystem: e,
              outputCalendar: t,
            } = {}) {
              return Kt(this, {
                loc: this.loc.clone({
                  locale: A,
                  numberingSystem: e,
                  outputCalendar: t,
                }),
              });
            }
            setLocale(A) {
              return this.reconfigure({ locale: A });
            }
            set(A) {
              if (!this.isValid) return this;
              const e = re(A, Bi),
                { minDaysInFirstWeek: t, startOfWeek: i } = bA(e, this.loc),
                n = !zA(e.weekYear) || !zA(e.weekNumber) || !zA(e.weekday),
                o = !zA(e.ordinal),
                g = !zA(e.year),
                a = !zA(e.month) || !zA(e.day),
                B = g || a,
                s = e.weekYear || e.weekNumber;
              if ((B || o) && s)
                throw new r(
                  "Can't mix weekYear/weekNumber units with year/month/day or ordinals",
                );
              if (a && o) throw new r("Can't mix ordinal dates with month/day");
              let c;
              n
                ? (c = GA({ ...FA(this.c, t, i), ...e }, t, i))
                : zA(e.ordinal)
                  ? ((c = { ...this.toObject(), ...e }),
                    zA(e.day) && (c.day = Math.min($A(c.year, c.month), c.day)))
                  : (c = LA({ ...HA(this.c), ...e }));
              const [Q, C] = Zt(c, this.o, this.zone);
              return Kt(this, { ts: Q, o: C });
            }
            plus(A) {
              return this.isValid
                ? Kt(this, qt(this, ft.fromDurationLike(A)))
                : this;
            }
            minus(A) {
              return this.isValid
                ? Kt(this, qt(this, ft.fromDurationLike(A).negate()))
                : this;
            }
            startOf(A, { useLocaleWeeks: e = !1 } = {}) {
              if (!this.isValid) return this;
              const t = {},
                i = ft.normalizeUnit(A);
              switch (i) {
                case "years":
                  t.month = 1;
                case "quarters":
                case "months":
                  t.day = 1;
                case "weeks":
                case "days":
                  t.hour = 0;
                case "hours":
                  t.minute = 0;
                case "minutes":
                  t.second = 0;
                case "seconds":
                  t.millisecond = 0;
              }
              if ("weeks" === i)
                if (e) {
                  const A = this.loc.getStartOfWeek(),
                    { weekday: e } = this;
                  (e < A && (t.weekNumber = this.weekNumber - 1),
                    (t.weekday = A));
                } else t.weekday = 1;
              if ("quarters" === i) {
                const A = Math.ceil(this.month / 3);
                t.month = 3 * (A - 1) + 1;
              }
              return this.set(t);
            }
            endOf(A, e) {
              return this.isValid
                ? this.plus({ [A]: 1 })
                    .startOf(A, e)
                    .minus(1)
                : this;
            }
            toFormat(A, e = {}) {
              return this.isValid
                ? me
                    .create(this.loc.redefaultToEN(e))
                    .formatDateTimeFromString(this, A)
                : Nt;
            }
            toLocaleString(A = l, e = {}) {
              return this.isValid
                ? me.create(this.loc.clone(e), A).formatDateTime(this)
                : Nt;
            }
            toLocaleParts(A = {}) {
              return this.isValid
                ? me.create(this.loc.clone(A), A).formatDateTimeParts(this)
                : [];
            }
            toISO({
              format: A = "extended",
              suppressSeconds: e = !1,
              suppressMilliseconds: t = !1,
              includeOffset: i = !0,
              extendedZone: n = !1,
              precision: o = "milliseconds",
            } = {}) {
              if (!this.isValid) return null;
              const g = "extended" === A;
              let r = Ai(this, g, (o = ai(o)));
              return (
                oi.indexOf(o) >= 3 && (r += "T"),
                (r += ei(this, g, e, t, i, n, o)),
                r
              );
            }
            toISODate({ format: A = "extended", precision: e = "day" } = {}) {
              return this.isValid ? Ai(this, "extended" === A, ai(e)) : null;
            }
            toISOWeekDate() {
              return $t(this, "kkkk-'W'WW-c");
            }
            toISOTime({
              suppressMilliseconds: A = !1,
              suppressSeconds: e = !1,
              includeOffset: t = !0,
              includePrefix: i = !1,
              extendedZone: n = !1,
              format: o = "extended",
              precision: g = "milliseconds",
            } = {}) {
              return this.isValid
                ? ((g = ai(g)),
                  (i && oi.indexOf(g) >= 3 ? "T" : "") +
                    ei(this, "extended" === o, e, A, t, n, g))
                : null;
            }
            toRFC2822() {
              return $t(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", !1);
            }
            toHTTP() {
              return $t(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
            }
            toSQLDate() {
              return this.isValid ? Ai(this, !0) : null;
            }
            toSQLTime({
              includeOffset: A = !0,
              includeZone: e = !1,
              includeOffsetSpace: t = !0,
            } = {}) {
              let i = "HH:mm:ss.SSS";
              return (
                (e || A) &&
                  (t && (i += " "), e ? (i += "z") : A && (i += "ZZ")),
                $t(this, i, !0)
              );
            }
            toSQL(A = {}) {
              return this.isValid
                ? `${this.toSQLDate()} ${this.toSQLTime(A)}`
                : null;
            }
            toString() {
              return this.isValid ? this.toISO() : Nt;
            }
            [Symbol.for("nodejs.util.inspect.custom")]() {
              return this.isValid
                ? `DateTime { ts: ${this.toISO()}, zone: ${this.zone.name}, locale: ${this.locale} }`
                : `DateTime { Invalid, reason: ${this.invalidReason} }`;
            }
            valueOf() {
              return this.toMillis();
            }
            toMillis() {
              return this.isValid ? this.ts : NaN;
            }
            toSeconds() {
              return this.isValid ? this.ts / 1e3 : NaN;
            }
            toUnixInteger() {
              return this.isValid ? Math.floor(this.ts / 1e3) : NaN;
            }
            toJSON() {
              return this.toISO();
            }
            toBSON() {
              return this.toJSDate();
            }
            toObject(A = {}) {
              if (!this.isValid) return {};
              const e = { ...this.c };
              return (
                A.includeConfig &&
                  ((e.outputCalendar = this.outputCalendar),
                  (e.numberingSystem = this.loc.numberingSystem),
                  (e.locale = this.loc.locale)),
                e
              );
            }
            toJSDate() {
              return new Date(this.isValid ? this.ts : NaN);
            }
            diff(A, e = "milliseconds", t = {}) {
              if (!this.isValid || !A.isValid)
                return ft.invalid("created by diffing an invalid DateTime");
              const i = {
                  locale: this.locale,
                  numberingSystem: this.numberingSystem,
                  ...t,
                },
                n = ((r = e), Array.isArray(r) ? r : [r]).map(ft.normalizeUnit),
                o = A.valueOf() > this.valueOf(),
                g = (function (A, e, t, i) {
                  let [n, o, g, r] = (function (A, e, t) {
                    const i = [
                        ["years", (A, e) => e.year - A.year],
                        [
                          "quarters",
                          (A, e) =>
                            e.quarter - A.quarter + 4 * (e.year - A.year),
                        ],
                        [
                          "months",
                          (A, e) => e.month - A.month + 12 * (e.year - A.year),
                        ],
                        [
                          "weeks",
                          (A, e) => {
                            const t = pt(A, e);
                            return (t - (t % 7)) / 7;
                          },
                        ],
                        ["days", pt],
                      ],
                      n = {},
                      o = A;
                    let g, r;
                    for (const [a, B] of i)
                      t.indexOf(a) >= 0 &&
                        ((g = a),
                        (n[a] = B(A, e)),
                        (r = o.plus(n)),
                        r > e
                          ? (n[a]--,
                            (A = o.plus(n)) > e &&
                              ((r = A), n[a]--, (A = o.plus(n))))
                          : (A = r));
                    return [A, n, r, g];
                  })(A, e, t);
                  const a = e - n,
                    B = t.filter(
                      (A) =>
                        ["hours", "minutes", "seconds", "milliseconds"].indexOf(
                          A,
                        ) >= 0,
                    );
                  0 === B.length &&
                    (g < e && (g = n.plus({ [r]: 1 })),
                    g !== n && (o[r] = (o[r] || 0) + a / (g - n)));
                  const s = ft.fromObject(o, i);
                  return B.length > 0
                    ? ft
                        .fromMillis(a, i)
                        .shiftTo(...B)
                        .plus(s)
                    : s;
                })(o ? this : A, o ? A : this, n, i);
              var r;
              return o ? g.negate() : g;
            }
            diffNow(A = "milliseconds", e = {}) {
              return this.diff(Ei.now(), A, e);
            }
            until(A) {
              return this.isValid ? mt.fromDateTimes(this, A) : this;
            }
            hasSame(A, e, t) {
              if (!this.isValid) return !1;
              const i = A.valueOf(),
                n = this.setZone(A.zone, { keepLocalTime: !0 });
              return n.startOf(e, t) <= i && i <= n.endOf(e, t);
            }
            equals(A) {
              return (
                this.isValid &&
                A.isValid &&
                this.valueOf() === A.valueOf() &&
                this.zone.equals(A.zone) &&
                this.loc.equals(A.loc)
              );
            }
            toRelative(A = {}) {
              if (!this.isValid) return null;
              const e = A.base || Ei.fromObject({}, { zone: this.zone }),
                t = A.padding ? (this < e ? -A.padding : A.padding) : 0;
              let i = [
                  "years",
                  "months",
                  "days",
                  "hours",
                  "minutes",
                  "seconds",
                ],
                n = A.unit;
              return (
                Array.isArray(A.unit) && ((i = A.unit), (n = void 0)),
                ci(e, this.plus(t), {
                  ...A,
                  numeric: "always",
                  units: i,
                  unit: n,
                })
              );
            }
            toRelativeCalendar(A = {}) {
              return this.isValid
                ? ci(A.base || Ei.fromObject({}, { zone: this.zone }), this, {
                    ...A,
                    numeric: "auto",
                    units: ["years", "months", "days"],
                    calendary: !0,
                  })
                : null;
            }
            static min(...A) {
              if (!A.every(Ei.isDateTime))
                throw new B("min requires all arguments be DateTimes");
              return NA(A, (A) => A.valueOf(), Math.min);
            }
            static max(...A) {
              if (!A.every(Ei.isDateTime))
                throw new B("max requires all arguments be DateTimes");
              return NA(A, (A) => A.valueOf(), Math.max);
            }
            static fromFormatExplain(A, e, t = {}) {
              const { locale: i = null, numberingSystem: n = null } = t;
              return Tt(
                iA.fromOpts({ locale: i, numberingSystem: n, defaultToEN: !0 }),
                A,
                e,
              );
            }
            static fromStringExplain(A, e, t = {}) {
              return Ei.fromFormatExplain(A, e, t);
            }
            static buildFormatParser(A, e = {}) {
              const { locale: t = null, numberingSystem: i = null } = e,
                n = iA.fromOpts({
                  locale: t,
                  numberingSystem: i,
                  defaultToEN: !0,
                });
              return new kt(n, A);
            }
            static fromFormatParser(A, e, t = {}) {
              if (zA(A) || zA(e))
                throw new B(
                  "fromFormatParser requires an input string and a format parser",
                );
              const { locale: i = null, numberingSystem: n = null } = t,
                o = iA.fromOpts({
                  locale: i,
                  numberingSystem: n,
                  defaultToEN: !0,
                });
              if (!o.equals(e.locale))
                throw new B(
                  `fromFormatParser called with a locale of ${o}, but the format parser was created for ${e.locale}`,
                );
              const {
                result: g,
                zone: r,
                specificOffset: a,
                invalidReason: s,
              } = e.explainFromTokens(A);
              return s
                ? Ei.invalid(s)
                : _t(g, r, t, `format ${e.format}`, A, a);
            }
            static get DATE_SHORT() {
              return l;
            }
            static get DATE_MED() {
              return E;
            }
            static get DATE_MED_WITH_WEEKDAY() {
              return d;
            }
            static get DATE_FULL() {
              return w;
            }
            static get DATE_HUGE() {
              return D;
            }
            static get TIME_SIMPLE() {
              return h;
            }
            static get TIME_WITH_SECONDS() {
              return I;
            }
            static get TIME_WITH_SHORT_OFFSET() {
              return u;
            }
            static get TIME_WITH_LONG_OFFSET() {
              return v;
            }
            static get TIME_24_SIMPLE() {
              return f;
            }
            static get TIME_24_WITH_SECONDS() {
              return M;
            }
            static get TIME_24_WITH_SHORT_OFFSET() {
              return m;
            }
            static get TIME_24_WITH_LONG_OFFSET() {
              return Y;
            }
            static get DATETIME_SHORT() {
              return p;
            }
            static get DATETIME_SHORT_WITH_SECONDS() {
              return y;
            }
            static get DATETIME_MED() {
              return P;
            }
            static get DATETIME_MED_WITH_SECONDS() {
              return F;
            }
            static get DATETIME_MED_WITH_WEEKDAY() {
              return G;
            }
            static get DATETIME_FULL() {
              return H;
            }
            static get DATETIME_FULL_WITH_SECONDS() {
              return L;
            }
            static get DATETIME_HUGE() {
              return b;
            }
            static get DATETIME_HUGE_WITH_SECONDS() {
              return U;
            }
          }
          function di(A) {
            if (Ei.isDateTime(A)) return A;
            if (A && A.valueOf && xA(A.valueOf())) return Ei.fromJSDate(A);
            if (A && "object" == typeof A) return Ei.fromObject(A);
            throw new B(`Unknown datetime argument: ${A}, of type ${typeof A}`);
          }
        },
        185: (A, e, t) => {
          "use strict";
          t.d(e, {
            D0: () => B,
            Ge: () => n,
            hi: () => g,
            nF: () => r,
            sg: () => a,
            uA: () => o,
          });
          var i = t(97);
          function n(A, e) {
            const t = e("months");
            return Array.isArray(t) && A >= 0 && A < t.length
              ? t[A]
              : `months.${A}`;
          }
          function o(A, e) {
            const t = e("shortDays");
            return Array.isArray(t) && A >= 0 && A < t.length
              ? t[A]
              : `shortDays.${A}`;
          }
          function g(A, e, t = "UTC") {
            if (!A || isNaN(A.getTime())) return "";
            try {
              return i.c9
                .fromJSDate(A, { zone: "utc" })
                .setZone(t)
                .setLocale(e)
                .toFormat("dd. MMM yyyy");
            } catch (i) {
              console.error("Error formatting date for display:", i);
              const n = {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: t,
              };
              try {
                return A.toLocaleDateString(e, n);
              } catch (A) {
                return (
                  console.error("Native toLocaleDateString also failed:", A),
                  ""
                );
              }
            }
          }
          function r(A, e) {
            let t = !1,
              i = null,
              n = null;
            return function (...e) {
              ((i = e),
                (n = this),
                t ||
                  ((t = !0),
                  requestAnimationFrame(() => {
                    (A.apply(n, i), (t = !1));
                  })));
            };
          }
          function a(A, e) {
            let t = null;
            return function (...i) {
              const n = this;
              (null !== t && clearTimeout(t),
                (t = setTimeout(function () {
                  ((t = null), A.apply(n, i));
                }, e)));
            };
          }
          function B(A) {
            return (
              {
                1001: "errors.api.queryParamMissing",
                1002: "errors.api.invalidLimitParam",
                1003: "errors.api.internalError",
                2001: "errors.api.invalidUserStartCoordinates",
                2002: "errors.api.geocodeUserStartFailed",
                2003: "errors.api.internalError",
                2004: "errors.api.unsupportedUserStartType",
                2005: "errors.api.invalidActivityStartCoordinates",
                2006: "errors.api.geocodeActivityStartFailed",
                2007: "errors.api.internalError",
                2008: "errors.api.unsupportedActivityStartType",
                2009: "errors.api.invalidActivityEndCoordinates",
                2010: "errors.api.geocodeActivityEndFailed",
                2011: "errors.api.internalError",
                2012: "errors.api.unsupportedActivityEndType",
                "2017-1": "errors.api.noToConnectionsFound",
                "2017-2": "errors.api.noFromConnectionsFound",
                "2017-2F": "errors.api.noFromConnectionsFoundFallback",
                "2017-2F-1":
                  "errors.api.noFromConnectionsFoundFallbackNotToday",
                "2018-1": "errors.api.toConnectionsNoScore",
                "2018-2": "errors.api.fromConnectionsNoScore",
                "2019-1": "errors.api.noToConnectionsMergingMightFail",
                "2019-2": "errors.api.noFromConnectionsMergingMightFail",
                "2020-1": "errors.api.noToConnectionsMergingFailed",
                "2020-2": "errors.api.noFromConnectionsMergingFailed",
                "2021-1": "errors.api.noToConnectionsTimeWindow",
                "2021-2": "errors.api.noFromConnectionsTimeWindow",
                "2022-1": "errors.api.noToConnectionsAfterCurrentTime",
                "2023-1": "errors.api.noToConnectionsFilteredByDuration",
                "2023-2": "errors.api.noFromConnectionsFilteredByDuration",
                2024: "errors.api.noReturnConnectionMatchingIncoming",
                "2025-1": "errors.api.internalError",
                "2025-2": "errors.api.internalError",
                "2026-1": "errors.api.internalError",
                3001: "errors.api.internalError",
                3002: "errors.api.internalError",
                3003: "errors.api.internalError",
                3004: "errors.api.internalError",
                4001: "errors.api.reverseGeocodeParameterMissing",
                4002: "errors.api.internalError",
                5001: "errors.api.sharedLinkInvalid",
                5002: "errors.api.internalError",
                6001: "errors.api.monthlyQuotaExceeded",
                APP_INVALID_DATA: "errors.api.invalidDataReceived",
              }[A] || "errors.api.unknown"
            );
          }
        },
        200: (A, e, t) => {
          "use strict";
          function i(A) {
            const { t: e } = A;
            return `\n        <div class="range-calendar-header">\n            <h3>${e("selectDateRange")}</h3>\n            <button type="button" class="range-calendar-close-btn" aria-label="${e("cancel")}">&times;</button>\n        </div>\n        <div class="range-calendar-body">\n            <div class="range-calendar-instance" id="rangeCalendarInstance_${Date.now()}"></div>\n        </div>\n        <div class="range-calendar-footer">\n            <button type="button" class="calendar-footer-btn range-calendar-cancel-btn">${e("cancel")}</button>\n            <button type="button" class="calendar-footer-btn calendar-apply-btn range-calendar-apply-btn">${e("apply")}</button>\n        </div>\n    `;
          }
          (t.r(e), t.d(e, { getRangeCalendarModalHTML: () => i }));
        },
        314: (A) => {
          "use strict";
          A.exports = function (A) {
            var e = [];
            return (
              (e.toString = function () {
                return this.map(function (e) {
                  var t = "",
                    i = void 0 !== e[5];
                  return (
                    e[4] && (t += "@supports (".concat(e[4], ") {")),
                    e[2] && (t += "@media ".concat(e[2], " {")),
                    i &&
                      (t += "@layer".concat(
                        e[5].length > 0 ? " ".concat(e[5]) : "",
                        " {",
                      )),
                    (t += A(e)),
                    i && (t += "}"),
                    e[2] && (t += "}"),
                    e[4] && (t += "}"),
                    t
                  );
                }).join("");
              }),
              (e.i = function (A, t, i, n, o) {
                "string" == typeof A && (A = [[null, A, void 0]]);
                var g = {};
                if (i)
                  for (var r = 0; r < this.length; r++) {
                    var a = this[r][0];
                    null != a && (g[a] = !0);
                  }
                for (var B = 0; B < A.length; B++) {
                  var s = [].concat(A[B]);
                  (i && g[s[0]]) ||
                    (void 0 !== o &&
                      (void 0 === s[5] ||
                        (s[1] = "@layer"
                          .concat(s[5].length > 0 ? " ".concat(s[5]) : "", " {")
                          .concat(s[1], "}")),
                      (s[5] = o)),
                    t &&
                      (s[2]
                        ? ((s[1] = "@media "
                            .concat(s[2], " {")
                            .concat(s[1], "}")),
                          (s[2] = t))
                        : (s[2] = t)),
                    n &&
                      (s[4]
                        ? ((s[1] = "@supports ("
                            .concat(s[4], ") {")
                            .concat(s[1], "}")),
                          (s[4] = n))
                        : (s[4] = "".concat(n))),
                    e.push(s));
                }
              }),
              e
            );
          };
        },
        320: (A, e, t) => {
          "use strict";
          (t.r(e), t.d(e, { helpContent: () => i }));
          const i = {
            EN: '\n    <style>\n      .help-section h2, .help-section h3, .help-section h4 { margin-bottom: 0.5em; }\n      .help-section h3 { margin-top: 1.5em; }\n      .help-section h4 { margin-top: 1em; font-size: 1.1em; }\n      .help-section ol, .help-section ul { margin-left: 1.5em; margin-bottom: 1em; }\n      .help-section li { margin-bottom: 0.75em; }\n      .help-section strong { color: #333; }\n      .help-section .icon-inline { vertical-align: middle; display: inline-block; margin: 0 0.2em; }\n      .help-section hr { border: 0; height: 1px; background-color: #eee; margin: 2em 0; }\n    </style>\n    <div class="help-section">\n      <h2>Help & Support <span class="icon-inline">👋</span></h2>\n      <p>Welcome to the Diana GreenConnect Widget help section! We\'re here to assist you in planning your journey to and from your desired activity using public transport.</p>\n\n      <hr>\n\n      <h3>How to Use the Diana GreenConnect:</h3>\n      <ol>\n        <li>\n          <h4>1. Enter Your Starting Point <span class="icon-inline">📍</span></h4>\n          <p>In the "Your Location" field (or similar, depending on the integration), type your starting address or a known public transport stop. As you type, relevant suggestions will appear. Please select the one that best matches your starting point.</p>\n          <p>Alternatively, if available, click the <strong>location icon</strong> (target icon: \n          <svg class="icon-inline" style="pointer-events: auto; cursor: pointer;" width="18.75" height="18.75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n            <circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="0" x2="12" y2="5"></line><line x1="0" y1="12" x2="5" y2="12"></line><line x1="12" y1="19" x2="12" y2="24"></line><line x1="19" y1="12" x2="24" y2="12"></line>\n          </svg>\n          ) to use your current geographical location. You may need to grant location permissions to your browser for this feature to work.</p>\n        </li>\n        <li>\n          <h4>2. Select the Date(s) for Your Activity <span class="icon-inline">📅</span></h4>\n          <ul>\n            <li><strong>For a Single-Day Activity:</strong> You\'ll typically find options like "Today," "Tomorrow," or an "Other Date" button. Clicking "Other Date" will open a calendar allowing you to pick a specific date.</li>\n            <li><strong>For a Multi-Day Activity:</strong> The widget will provide options to select both a start date and an end date for your activity, using a calendar interface.</li>\n          </ul>\n        </li>\n        <li>\n          <h4>3. Initiate the Search <span class="icon-inline">🔍</span></h4>\n          <p>Once your location and date(s) are set, click the "Search" button (or similar) to find transport connections.</p>\n        </li>\n        <li>\n          <h4>4. Review Your Connections <span class="icon-inline">📊</span></h4>\n          <p>The results page will display:</p>\n          <ul>\n            <li>Suggested public transport connections <strong>to your activity</strong> (usually in the top section).</li>\n            <li>Information about your planned activity (often in the middle section).</li>\n            <li>Suggested public transport connections <strong>from your activity</strong> back to your starting point (usually in the bottom section).</li>\n          </ul>\n          <p>You can often swipe or click through different time slots or connection options. Clicking on a specific time slot will reveal more detailed journey information, including transfers, modes of transport, and estimated durations.</p>\n        </li>\n      </ol>\n\n      <hr>\n\n      <h3>Troubleshooting Tips <span class="icon-inline">💡</span></h3>\n      <p>Encountering an issue? Here are a few common solutions:</p>\n\n      <h4><strong>If you encounter "No connections found":</strong></h4>\n      <ul>\n        <li>Try refining your starting location. Sometimes, a major nearby transport hub or a slightly different address format can yield better results.</li>\n        <li>Double-check that the selected date(s) and times are realistic for public transport operating hours in that region.</li>\n        <li>For multi-day activities, ensure your selected start date is not after your end date.</li>\n        <li>The service covers many regions, but coverage might be limited in some very remote areas or for specific cross-border connections if not explicitly supported.</li>\n      </ul>\n\n      <h4><strong>If you see error messages:</strong></h4>\n      <ul>\n        <li>First, please check your internet connection.</li>\n        <li>If your internet is working, the issue might be temporary on the service side. We recommend trying again after a short while.</li>\n        <li>Ensure that the API token used for the widget is current and valid, especially if you are integrating the widget yourself.</li>\n      </ul>\n\n      <hr>\n\n      <h3>Need More Help? <span class="icon-inline">💬</span></h3>\n      <p>If these tips don\'t resolve your issue, or if you have other questions, please don\'t hesitate to get in touch. You can find our contact details on the "Contact" page within this widget, or visit our main company website for more information about Zuugle Services:</p>\n      <p><a href="https://www.zuugle-services.com" target="_blank" rel="noopener noreferrer">www.zuugle-services.com</a></p>\n      <p>For specific inquiries regarding the Diana GreenConnect, including licensing or integration support, you can also email us directly at <a href="mailto:office@zuugle-services.com">office@zuugle-services.com</a>.</p>\n    </div>\n  ',
            DE: '\n    <style>\n      .help-section h2, .help-section h3, .help-section h4 { margin-bottom: 0.5em; }\n      .help-section h3 { margin-top: 1.5em; }\n      .help-section h4 { margin-top: 1em; font-size: 1.1em; }\n      .help-section ol, .help-section ul { margin-left: 1.5em; margin-bottom: 1em; }\n      .help-section li { margin-bottom: 0.75em; }\n      .help-section strong { color: #333; }\n      .help-section .icon-inline { vertical-align: middle; display: inline-block; margin: 0 0.2em; }\n      .help-section hr { border: 0; height: 1px; background-color: #eee; margin: 2em 0; }\n    </style>\n    <div class="help-section">\n      <h2>Hilfe & Support <span class="icon-inline">👋</span></h2>\n      <p>Willkommen im Hilfebereich des Diana GreenConnect Widgets! Wir unterstützen Sie gerne bei der Planung Ihrer An- und Abreise zu Ihrer gewünschten Aktivität mit öffentlichen Verkehrsmitteln.</p>\n\n      <hr>\n\n      <h3>So verwenden Sie Diana GreenConnect:</h3>\n      <ol>\n        <li>\n          <h4>1. Geben Sie Ihren Startpunkt ein <span class="icon-inline">📍</span></h4>\n          <p>Tippen Sie in das Feld "Ihr Standort" (oder ähnlich, je nach Integration) Ihre Startadresse oder eine bekannte Haltestelle des öffentlichen Nahverkehrs ein. Während Sie tippen, erscheinen relevante Vorschläge. Bitte wählen Sie den Vorschlag aus, der Ihrem Startpunkt am besten entspricht.</p>\n          <p>Alternativ können Sie, falls verfügbar, auf das <strong>Standort-Symbol</strong> klicken (Zielscheibensymbol: \n          <svg class="icon-inline" style="pointer-events: auto; cursor: pointer;" width="18.75" height="18.75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n            <circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="0" x2="12" y2="5"></line><line x1="0" y1="12" x2="5" y2="12"></line><line x1="12" y1="19" x2="12" y2="24"></line><line x1="19" y1="12" x2="24" y2="12"></line>\n          </svg>\n          ), um Ihren aktuellen geografischen Standort zu verwenden. Möglicherweise müssen Sie Ihrem Browser erlauben, auf Ihren Standort zuzugreifen.</p>\n        </li>\n        <li>\n          <h4>2. Wählen Sie das Datum für Ihre Aktivität aus <span class="icon-inline">📅</span></h4>\n          <ul>\n            <li><strong>Für eine eintägige Aktivität</strong>: Sie finden in der Regel Optionen wie "Heute", "Morgen" oder eine Schaltfläche "Anderes Datum". Ein Klick auf "Anderes Datum" öffnet einen Kalender, in dem Sie ein bestimmtes Datum auswählen können.</li>\n            <li><strong>Für eine mehrtägige Aktivität</strong>: Das Widget bietet Ihnen Optionen zur Auswahl eines Start- und Enddatums für Ihre Aktivität über eine Kalenderoberfläche.</li>\n          </ul>\n        </li>\n        <li>\n          <h4>3. Starten Sie die Suche <span class="icon-inline">🔍</span></h4>\n          <p>Sobald Ihr Standort und das/die Datum(e) festgelegt sind, klicken Sie auf die Schaltfläche "Suchen" (oder ähnlich), um nach Verkehrsverbindungen zu suchen.</p>\n        </li>\n        <li>\n          <h4>4. Überprüfen Sie Ihre Verbindungen <span class="icon-inline">📊</span></h4>\n          <p>Die Ergebnisseite zeigt Ihnen:</p>\n          <ul>\n            <li>Vorgeschlagene Verbindungen des öffentlichen Nahverkehrs <strong>zu Ihrer Aktivität</strong> (normalerweise im oberen Bereich).</li>\n            <li>Informationen zu Ihrer geplanten Aktivität (oft im mittleren Bereich).</li>\n            <li>Vorgeschlagene Verbindungen des öffentlichen Nahverkehrs <strong>von Ihrer Aktivität</strong> zurück zu Ihrem Startpunkt (normalerweise im unteren Bereich).</li>\n          </ul>\n          <p>Sie können oft durch verschiedene Zeitfenster oder Verbindungsoptionen wischen oder klicken. Ein Klick auf ein bestimmtes Zeitfenster zeigt detailliertere Reiseinformationen an, einschließlich Umstiege, Verkehrsmittel und geschätzte Fahrzeiten.</p>\n        </li>\n      </ol>\n\n      <hr>\n\n      <h3>Tipps zur Fehlerbehebung <span class="icon-inline">💡</span></h3>\n      <p>Stoßen Sie auf ein Problem? Hier sind einige häufige Lösungen:</p>\n\n      <h4><strong>Falls "Keine Verbindungen gefunden" angezeigt wird:</strong></h4>\n      <ul>\n        <li>Versuchen Sie, Ihren Startort zu präzisieren. Manchmal kann ein größerer Verkehrsknotenpunkt in der Nähe oder ein leicht anderes Adressformat bessere Ergebnisse liefern.</li>\n        <li>Überprüfen Sie nochmals, ob das/die gewählte(n) Datum(e) und Zeiten realistisch für die Betriebszeiten der öffentlichen Verkehrsmittel in dieser Region sind.</li>\n        <li>Stellen Sie bei mehrtägigen Aktivitäten sicher, dass Ihr gewähltes Startdatum nicht nach Ihrem Enddatum liegt.</li>\n        <li>Der Dienst deckt viele Regionen ab, die Abdeckung kann jedoch in einigen sehr abgelegenen Gebieten oder bei bestimmten grenzüberschreitenden Verbindungen, sofern nicht ausdrücklich unterstützt, eingeschränkt sein.</li>\n      </ul>\n\n      <h4><strong>Falls Fehlermeldungen angezeigt werden:</strong></h4>\n      <ul>\n        <li>Bitte überprüfen Sie zuerst Ihre Internetverbindung.</li>\n        <li>Wenn Ihre Internetverbindung funktioniert, könnte das Problem vorübergehend auf der Serviceseite liegen. Wir empfehlen, es nach kurzer Zeit erneut zu versuchen.</li>\n        <li>Stellen Sie sicher, dass der für das Widget verwendete API-Token aktuell und gültig ist, insbesondere wenn Sie das Widget selbst integrieren.</li>\n      </ul>\n\n      <hr>\n\n      <h3>Benötigen Sie weitere Hilfe? <span class="icon-inline">💬</span></h3>\n      <p>Wenn diese Tipps Ihr Problem nicht lösen oder wenn Sie andere Fragen haben, zögern Sie bitte nicht, uns zu kontaktieren. Unsere Kontaktdaten finden Sie auf der Seite "Kontakt" in diesem Widget, oder besuchen Sie unsere Firmenwebseite für weitere Informationen über Zuugle Services:</p>\n      <p><a href="https://www.zuugle-services.com" target="_blank" rel="noopener noreferrer">www.zuugle-services.com</a></p>\n      <p>Für spezifische Anfragen zum Diana GreenConnect Widget, einschließlich Lizenzierung oder Integrationsunterstützung, können Sie uns auch direkt eine E-Mail an <a href="mailto:office@zuugle-service.com">office@zuugle-service.com</a> senden.</p>\n    </div>\n  ',
          };
        },
        417: (A) => {
          "use strict";
          A.exports = function (A, e) {
            return (
              e || (e = {}),
              A
                ? ((A = String(A.__esModule ? A.default : A)),
                  /^['"].*['"]$/.test(A) && (A = A.slice(1, -1)),
                  e.hash && (A += e.hash),
                  /["'() \t\n]|(%20)/.test(A) || e.needQuotes
                    ? '"'.concat(
                        A.replace(/"/g, '\\"').replace(/\n/g, "\\n"),
                        '"',
                      )
                    : A)
                : A
            );
          };
        },
        447: (A, e, t) => {
          var i = t(11);
          (i && i.__esModule && (i = i.default),
            (A.exports = "string" == typeof i ? i : i.toString()));
        },
        601: (A) => {
          "use strict";
          A.exports = function (A) {
            return A[1];
          };
        },
        627: (A) => {
          "use strict";
          A.exports =
            "data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27 fill=%27none%27 stroke=%27%23656c6e%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 viewBox=%270 0 24 24%27%3E%3Crect width=%2718%27 height=%2718%27 x=%273%27 y=%274%27 rx=%272%27 ry=%272%27/%3E%3Cpath d=%27M16 2v4M8 2v4M3 10h18%27/%3E%3C/svg%3E";
        },
        704: (A, e, t) => {
          var i = {
            "./contentPageTemplate": [920, 792],
            "./contentPageTemplate.ts": [920, 792],
            "./formPageTemplate": [857, 792],
            "./formPageTemplate.ts": [857, 792],
            "./helpContent": [320],
            "./helpContent.ts": [320],
            "./partials/_menuDropdown": [16, 792],
            "./partials/_menuDropdown.ts": [16, 792],
            "./partials/_widgetHeader": [771, 792],
            "./partials/_widgetHeader.ts": [771, 792],
            "./rangeCalendarModalTemplate": [200],
            "./rangeCalendarModalTemplate.ts": [200],
            "./resultsPageTemplate": [79, 792],
            "./resultsPageTemplate.ts": [79, 792],
            "./singleCalendarTemplate": [933],
            "./singleCalendarTemplate.ts": [933],
          };
          function n(A) {
            if (!t.o(i, A))
              return Promise.resolve().then(() => {
                var e = new Error("Cannot find module '" + A + "'");
                throw ((e.code = "MODULE_NOT_FOUND"), e);
              });
            var e = i[A],
              n = e[0];
            return Promise.all(e.slice(1).map(t.e)).then(() => t(n));
          }
          ((n.keys = () => Object.keys(i)), (n.id = 704), (A.exports = n));
        },
        747: (A) => {
          "use strict";
          A.exports =
            "data:font/ttf;base64,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AsUAMQLFADECxQAxAsUAMQLFADECmABNApgATQKtAAgCrQAIAjkATQI5AE0COQBNAjkATQI5AE0COQBNAjkATQI5AE0COQBNAjkATQI5AE0CwAAxAhsATQL6ADEC+gAxAvoAMQL6ADECrQBNAu0AKADuAE0CwQBNAO4ABwDu/+sA7v/uAO7/9gDuAEUA7gAHAO7/yQDu/+MA7v/qAfsAIAJOAE0CTgBNAhMATQITAAkCEwBNAhMATQITAE0CLQAUAzkATQK3AE0CtwBNArcATQK3AE0CtwBNArcATQLqADEC6gAxAuoAMQLqADEC6gAxAuoAMQLqADEC6gAxAusAFALqADEETwAxAkgATQJIAE0C6gAxAlYATQJWAE0CVgBNAlYATQJKADACSgAwAkoAMAJKADACSgAwAqsATQI0AB8CNAAfAjQAHwI0AB8CjgBDAo4AQwKOAEMCjgBDAo4AQwKOAEMCjgBDAo4AQwKOAEMCjgBDAo4AQwKeABcDygAcA8oAHAPKABwDygAcA8oAHAJcACcCRQAVAkUAFQJFABUCRQAVAkUAFQJFABUCLgAvAi4ALwIuAC8CLgAvAuoAMQInADcCJwA3AicANwInADcCJwA3AicANwInADcCJwA3AicANwInADcDlQA3A5UANwJuAEcCQQAyAkEAMgJBADICQQAyAkEAMgJtADICvgAyAqMAMgJVADICNgAyAjYAMgI2ADICNgAyAjYAMgI2ADICNgAyAjYAMgI2ADICNgAyAjYAMgI2AC0BaQAWAj8AKAI/ACgCPwAoAj8AKAJGAEcCfAAoAPEAPwDiAEcA4gABAOL/5QDi/+gA4v/wAOIAPwDiAAEA4v/DAOL/3QDi/9oBwgA/APT/5gDk/+YB+QBHAfkARwDiAEcA4gABATMARwDiAEEBZwBHAPsACQNvAEcCQgBHAkIARwJCAEcCQgBHAkIARwI7AEcCVQAyAlUAMgJVADICVQAyAlUAMgJVADICVQAyAlUAMgJWACACVQAyA9QAMgJuAEcCbgBHAm0AMgGGAEcBhgBHAYYARwGGAEIB/QAsAf0ALAH9ACwB/QAsAf0ALAKGAEgBlgAlAZYAJQGWACUBlgAlAkEARAJBAEQCQQBEAkEARAJBAEQCQQBEAkEARAJBAEQCQQBEAkEARAJBAEQCIAAYAxQAGQMUABkDFAAZAxQAGQMUABkB6wAYAi0AFwItABcCLQAXAi0AFwItABcCLQAXAd0AJQHdACUB3QAlAd0AJQJtADICbQAyAm0AMgJtADICbQAyAm0AMgJtADICbQAyAm0AMgJtADID2AAyA9gAMgJ5ADICeQAyAnkAMgJ5ADICQQBGAkEARgJBAEYCQQBGAkEARgJBAEYCQQBGAkEARgJBAEYCQQBGAkEARgJAAEICQABCAkAAQgJAAEICQABCAkAAQgIpABYCSwAWAekANwHAADIChgAuApAAMQFWACQCTQBBAlYANwJmACkCXgBFAnAAOgIaAB0CXABDAnAAQgFhAB4CVQA0AmwAMQJUADICVAAyAMwAHAFKACEBSgAaAUEAFQDMABwBSgAhAUoAGgFBABUBr//oAukAHALCABwDLAAaAMwAHAFKACEBSgAaAUEAFQENAAABDQAAAlgAAADQAC8AwgALANIALwDsAB4CQAAvAQgASwEIAEsCIgAnAiIAMADQAC8BbgA/AeUAQQMIAC8BiQAdAYkAHQCuACMAywAoAhoARwKaAEcDZgBHAncARwF2ADEBdgAmAbEATQGxADQBTQBNAU0APQDIAAsBbAALAW8AHgFvAB4A0gAeANIAHgHEACwBxAAyARoALwEaADcBOQAoAKMAKACuACMBLAAjASEAIAEhACAAowAgAKMAIAL8ABQC/AAUAU3/1APXAE8C4gAyAk8AJgJQADADGgAzAfgANAMEABsBVwAnAO4ATQDuAE0A7gBNAhMAKQIUACoC+gAwAkEAMgIWAEECSgAwAvsAFwMvACACcAAoBCQATQJ/ADUCXQAvAlsAIAGHAB0CJgAuAiYATQImAFoCJgBMAiYASwImAEwCJgBjAiYAYwImAGECJgBhAiYAJQImADoCJgA6Aib/9gJ1ACoCogAlAQL/2gMVACsCuAAfAtUAJQHCACkCyAASAksARwI3ACcDOAAtBJUALQNZACgCdQAoAwwAKAJ1ACgDWQAoAnUAKAMMACgCdQAoA+cAKANGACgC/AAUAvwAFAL8ABQC/AAUAvwAFAL8ABQC/AAUAvwAFAL8ABQC/AAUAikAJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQMAAABkAAAA3wAAAN8AAAEjAAABEgAAARIAAAEZAAAA0gAAAS4AAAFbAAAA5AAAAMEAAAAAACwCFgADAAEECQAAAKgFGgADAAEECQABABYFBAADAAEECQACAA4E9gADAAEECQADADgEvgADAAEECQAEACYEmAADAAEECQAFADoEXgADAAEECQAGACIEPAADAAEECQAIACAEHAADAAEECQAJAD4D3gADAAEECQALAEADngADAAEECQAMAEIDXAADAAEECQANASICOgADAAEECQAOADYCBAADAAEECQAQAA4B9gADAAEECQARABYB4AADAAEECQAZAAwB1AADAAEECQEAAC4BpgADAAEECQEBABoBjAADAAEECQECABoBcgADAAEECQEDABoBWAADAAEECQEEABoBPgADAAEECQEFABoBJAADAAEECQEGACYA/gADAAEECQEHABwA4gADAAEECQEIABgAygADAAEECQEJAAwAvgADAAEECQEKAAgAtgADAAEECQELABQAogADAAEECQEMAAoAmAADAAEECQENAA4E9gADAAEECQEOAAwAjAADAAEECQEPABAAfAADAAEECQEQAAgAdAADAAEECQERABIAYgADAAEECQESAAoAWAADAAEECQETAAYAUgADAAEECQEUAAgASgADAAEECQEVAAgAQgADAAEECQEWAAgAOgADAAEECQEXAAgAMgADAAEECQEYAAgAKgADAAEECQEZABQAFgADAAEECQEaAAwACgADAAEECQEbAAoAAABSAG8AbQBhAG4ASQB0AGEAbABpAGMARQB4AHQAcgBhAEIAbABhAGMAawA0ADAAcAB0ADMANgBwAHQAMgA0AHAAdAAxADgAcAB0ADEANABwAHQAOQBwAHQAQgBsAGEAYwBrAEUAeAB0AHIAYQBCAG8AbABkAEIAbwBsAGQAUwBlAG0AaQBCAG8AbABkAE0AZQBkAGkAdQBtAEwAaQBnAGgAdABFAHgAdAByAGEATABpAGcAaAB0AFQAaABpAG4AVwBlAGkAZwBoAHQATwBwAHQAaQBjAGEAbAAgAHMAaQB6AGUAUgBvAHUAbgBkAGUAbAAgAEcAbAB5AHAAaABzAEEAbAB0AGUAcgBuAGEAdABpAHYAZQAgAE4AdQBtAGIAZQByAHMAQQBsAHQAZQByAG4AYQB0AGkAdgBlACAAUQBBAGwAdABlAHIAbgBhAHQAaQB2AGUAIAB5AEEAbAB0AGUAcgBuAGEAdABpAHYAZQAgAHUAQQBsAHQAZQByAG4AYQB0AGkAdgBlACAAZwBBAGwAdABlAHIAbgBhAHQAaQB2AGUAIABhAEEAbAB0AGUAcgBuAGEAdABpAHYAZQAgAFAAdQBuAGMAdAB1AGEAdABpAG8AbgBEAE0AUwBhAG4AcwA5AHAAdAAgAFIAZQBnAHUAbABhAHIARABNACAAUwBhAG4AcwBoAHQAdABwAHMAOgAvAC8AcwBjAHIAaQBwAHQAcwAuAHMAaQBsAC4AbwByAGcALwBPAEYATABUAGgAaQBzACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAGkAcwAgAGwAaQBjAGUAbgBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUALAAgAFYAZQByAHMAaQBvAG4AIAAxAC4AMQAuACAAVABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABpAHMAIABhAHYAYQBpAGwAYQBiAGwAZQAgAHcAaQB0AGgAIABhACAARgBBAFEAIABhAHQAOgAgAGgAdAB0AHAAcwA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAGgAdAB0AHAAcwA6AC8ALwB3AHcAdwAuAGkAbgBkAGkAYQBuAHQAeQBwAGUAZgBvAHUAbgBkAHIAeQAuAGMAbwBtAGgAdAB0AHAAcwA6AC8ALwB3AHcAdwAuAGMAbwBsAG8AcABoAG8AbgAtAGYAbwB1AG4AZAByAHkALgBvAHIAZwBDAG8AbABvAHAAaABvAG4AIABGAG8AdQBuAGQAcgB5ACwAIABKAG8AbgBuAHkAIABQAGkAbgBoAG8AcgBuAEMAbwBsAG8AcABoAG8AbgAgAEYAbwB1AG4AZAByAHkARABNAFMAYQBuAHMALQA5AHAAdABSAGUAZwB1AGwAYQByAFYAZQByAHMAaQBvAG4AIAA0AC4AMAAwADQAOwBnAGYAdABvAG8AbABzAFsAMAAuADkALgAzADAAXQBE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ANIAxADgAL4AkACUALcBswATANIA0gDEAOwBWADSAKcAoQClANwBWADSAMQA4AC+AJAAlAC3AboAFQDSANIAxADsAVgA4ADPAVgAkADEAOwAvgFYANIAxADgAL4AkACUALcBtgAYANIA0gDEAOwBWADWAMQA4ADcAKUBWADsAJQA1gDcAVgA0gDEAOAAvgCQAJQAtwG0ABgA0gDSAMQA7AFYANYAxADgANwApQFYAJQAfgDWANwBWADSAMQA4AC+AJAAlAC3AbgAGADSANIAxADsAVgAvgDEANIA3AClAVgA7ACUANYA3AFYANIAxADgAL4AkACUALcBsgAYANIA0gDEAOwBWAC+AMQA0gDcAKUBWACUAH4A1gDcAVgA0gDEAOAAvgCQAJQAtwG5ABgA0gDSAMQA7AFYALcAlACgANwBWADSAKcAoQClANwBWADSAMQA4AC+AJAAlAC3AAEAAgB+ANEABAAIAAEACAABABoAAQAIAAIADAAGAR4AAgC3AR0AAgCnAAEAAQCgAAEAAAABAAgAAgAOAAQBHwEgAR8BIAABAAQAAQBFAH4AxAAGAAAAAgAkAAoAAwABADQAAQASAAAAAQAAABAAAQACAEUAxAADAAEAGgABABIAAAABAAAAEAABAAIAAQB+AAIAAQEiASsAAAAEAAAAAQAIAAEALAACABYACgABAAQBPAADAVEBJgACAA4ABgE6AAMBUQEkATsAAwFRASYAAQACASMBJQABAAAAAQAIAAEAIgAOAAEAAAABAAgAAQAUABIAAQAAAAEACAABAAYAGgACAAEBIwEmAAAABAAAAAEACAABABIAAQAIAAEABAA8AAIBTQABAAEAOAAEAAAAAQAIAAEAEgABAAgAAQAEALsAAgFNAAEAAQC3AAYAAAABAAgAAQAKAAIAJgASAAEAAgA4ALcAAQAEAAAAAgFNAAEAtwABAAAACQABAAQAAAACAU0AAQA4AAEAAAAKAAEAAAABAAgAAQAGAAEAAQAEAFoAXwDZAN4AAQAAAAEACAABAAYABgABAAEApwACAAAAAQAIAAEACgACABgAEgABAAIBHQEeAAIAoAC3AAIAoACnAAIAAAABAAgAAQAIAAEADgABAAEAsAACAKgBywABAAAAAQAIAAEABgABAAEAAgCnALMABgAAAAEACAACAHgAdABeAEgAAwAAACQAEgABAAQAAAABAAEAAQABAAAABAACABYABgAAAAEAAgACAAEAAQAAAAMAAAABAAEAAQABAAAAAwACAAMBvAHAAAEBwgHIAAEBygHLAAIAAgADAKcApwABALAAsAACALMAswABAAIAAAABAAMApwCwALMAAwAAAAEACAABABQABwBYAE4ARgA8ADIALAAmAAEABwB+ASMBJAElASYBYQFiAAIBbgFyAAIBbQFxAAQBLgE0ATgBQAAEAS0BMwE3AT8AAwEyATYBPgAEASwBMQE1AT0AAgD8AR8AAQAAAAEACAACAJYASAEfASAAfQBbAGAA/QD+AP8BAAEBAQIBAwEEAQUBBgEHAQgBCQEKAQsArQEgANoA3wEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBLwEwAVMBVAFrAWwBbwFwAbEBsgGzAbQBtQG2AbcBuAG5AboBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdcB2AACABcAAQABAAAARQBFAAEAUgBSAAIAWgBaAAMAXwBfAAQAfwCJAAUAoQCkABAApwCnABQAxADEABUA2QDZABYA3gDeABcA4ADqABgA8gD3ACMBKAEoACkBKwErACoBRQFFACsBRwFHACwBXwFgAC0BYwFkAC8BpwGwADEBvAHAADsBwgHHAEABygHLAEYAAAACAAAAAAAA/5wAMgAAAAAAAAAAAAAAAAAAAAAAAAAAAeYAAAAkAMkBAgDHAGIArQEDAQQAYwCuAJABBQAlACYA/QD/AGQBBgAnAQcBCADpACgAZQEJAQoAyADKAQsAywEMAQ0BDgEPACkAKgD4ARABEQArARIALAETAMwBFADNAM4A+gDPARUBFgEXAC0ALgEYAC8BGQEaARsBHADiADAAMQEdAR4BHwBmASAAMgDQASEA0QBnANMBIgEjAJEArwCwADMA7QA0ADUBJAElASYANgEnAOQA+wEoASkANwEqASsBLAA4ANQBLQDVAGgA1gEuAS8BMAExATIAOQA6ATMBNAE1ATYAOwA8AOsBNwC7ATgBOQA9AToA5gE7ATwARABpAT0AawBsAGoBPgE/AG4AbQCgAUAARQBGAP4BAABvAUEARwFCAQEA6gBIAHABQwFEAHIAcwFFAHEBRgFHAUgBSQBJAEoA+QFKAUsASwFMAEwA1wB0AU0AdgB3AU4AdQFPAVABUQFSAE0BUwBOAVQATwFVAVYBVwFYAOMAUABRAVkBWgFbAHgBXABSAHkBXQB7AHwAegFeAV8AoQB9ALEAUwDuAFQAVQFgAWEBYgBWAWMA5QD8AWQAiQBXAWUBZgFnAFgAfgFoAIAAgQB/AWkBagFrAWwBbQBZAFoBbgFvAXABcQBbAFwA7AFyALoBcwF0AF0BdQDnAXYBdwF4AXkBegF7AXwBfQF+AX8BgAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEBkgGTAZQBlQGWAZcAwADBAJ0AngCbABMAFAAVABYAFwAYABkAGgAbABwBmAGZAZoBmwGcAZ0BngGfAaABoQGiAaMBpAC8APQA9QD2AaUBpgGnAagAAwGpAaoAEQAPAB0AHgCrAAQAowAiAKIAwwCHAA0ABgASAD8BqwGsABAAsgCzAEIACwAMAF4AYAA+AEAAxADFALQAtQC2ALcAqQCqAL4AvwAFAAoBrQGuAa8BsAGxAbIBswG0AKYAIwAJAIgAhgCLAIoAjACDAF8A6AG1AIIAwgG2AIQAvQAHAbcBuAG5AboBuwCFAJYBvAAOAO8A8AC4ACAAjwAhAB8AlQCUAJMApwBhAKQAQQCSAJwBvQG+AJoAmQClAb8AmAAIAMYBwAHBAcIBwwHEAcUBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTALkB1AHVAdYB1wHYAdkB2gHbAdwB3QHeAd8B4AHhAeIB4wHkAeUB5gHnAegB6QHqAesB7AHtAe4B7wHwAI4A3ABDAI0A3wDYAOEA2wDdANkA2gDeAOAGQWJyZXZlB0FtYWNyb24HQW9nb25lawdBRWFjdXRlCkNkb3RhY2NlbnQGRGNhcm9uBkRjcm9hdAZFYnJldmUGRWNhcm9uCkVkb3RhY2NlbnQHRW1hY3JvbgdFb2dvbmVrB3VuaTFFQkMHdW5pMDE4Rgd1bmkwMTIyCkdkb3RhY2NlbnQESGJhcgJJSgZJYnJldmUHSW1hY3JvbgdJb2dvbmVrBkl0aWxkZQd1bmkwMTM2BkxhY3V0ZQZMY2Fyb24HdW5pMDEzQgRMZG90Bk5hY3V0ZQZOY2Fyb24HdW5pMDE0NQNFbmcGT2JyZXZlDU9odW5nYXJ1bWxhdXQHT21hY3JvbgZSYWN1dGUGUmNhcm9uB3VuaTAxNTYGU2FjdXRlB3VuaTAyMTgHdW5pMUU5RQZUY2Fyb24HdW5pMDE2Mgd1bmkwMjFBBlVicmV2ZQ1VaHVuZ2FydW1sYXV0B1VtYWNyb24HVW9nb25lawVVcmluZwZVdGlsZGUGV2FjdXRlC1djaXJjdW1mbGV4CVdkaWVyZXNpcwZXZ3JhdmULWWNpcmN1bWZsZXgGWWdyYXZlB3VuaTFFRjgGWmFjdXRlClpkb3RhY2NlbnQGUS5zczA2BmFicmV2ZQdhbWFjcm9uB2FvZ29uZWsHYWVhY3V0ZQpjZG90YWNjZW50BmRjYXJvbgZlYnJldmUGZWNhcm9uCmVkb3RhY2NlbnQHZW1hY3Jvbgdlb2dvbmVrB3VuaTFFQkQHdW5pMDI1OQd1bmkwMTIzCmdkb3RhY2NlbnQEaGJhcgZpYnJldmUJaS5sb2NsVFJLB2ltYWNyb24HaW9nb25lawZpdGlsZGUCaWoHdW5pMDIzNwd1bmkwMTM3BmxhY3V0ZQZsY2Fyb24HdW5pMDEzQwRsZG90Bm5hY3V0ZQZuY2Fyb24HdW5pMDE0NgNlbmcGb2JyZXZlDW9odW5nYXJ1bWxhdXQHb21hY3JvbgZyYWN1dGUGcmNhcm9uB3VuaTAxNTcGc2FjdXRlB3VuaTAyMTkGdGNhcm9uB3VuaTAxNjMHdW5pMDIxQgZ1YnJldmUNdWh1bmdhcnVtbGF1dAd1bWFjcm9uB3VvZ29uZWsFdXJpbmcGdXRpbGRlBndhY3V0ZQt3Y2lyY3VtZmxleAl3ZGllcmVzaXMGd2dyYXZlC3ljaXJjdW1mbGV4BnlncmF2ZQd1bmkxRUY5BnphY3V0ZQp6ZG90YWNjZW50BmEuc3MwMgthYWN1dGUuc3MwMgthYnJldmUuc3MwMhBhY2lyY3VtZmxleC5zczAyDmFkaWVyZXNpcy5zczAyC2FncmF2ZS5zczAyDGFtYWNyb24uc3MwMgxhb2dvbmVrLnNzMDIKYXJpbmcuc3MwMgthdGlsZGUuc3MwMgdhZS5zczAyDGFlYWN1dGUuc3MwMgZnLnNzMDMLZ2JyZXZlLnNzMDMMdW5pMDEyMy5zczAzD2dkb3RhY2NlbnQuc3MwMwZ1LnNzMDQLdWFjdXRlLnNzMDQLdWJyZXZlLnNzMDQQdWNpcmN1bWZsZXguc3MwNA51ZGllcmVzaXMuc3MwNAt1Z3JhdmUuc3MwNBJ1aHVuZ2FydW1sYXV0LnNzMDQMdW1hY3Jvbi5zczA0DHVvZ29uZWsuc3MwNAp1cmluZy5zczA0C3V0aWxkZS5zczA0Bnkuc3MwNQt5YWN1dGUuc3MwNRB5Y2lyY3VtZmxleC5zczA1DnlkaWVyZXNpcy5zczA1C3lncmF2ZS5zczA1DHVuaTFFRjkuc3MwNQhvbmUuc3MwNwp0aHJlZS5zczA3CWZvdXIuc3MwNwhzaXguc3MwNwluaW5lLnNzMDcIb25lLmRub20IdHdvLmRub20KdGhyZWUuZG5vbQlmb3VyLmRub20Ib25lLm51bXIIdHdvLm51bXIKdGhyZWUubnVtcglmb3VyLm51bXIHdW5pMDBCOQd1bmkwMEIyB3VuaTAwQjMHdW5pMjA3NAd1bmkwMEEwAkNSCmNvbW1hLnNzMDEOc2VtaWNvbG9uLnNzMDETcXVvdGVzaW5nbGJhc2Uuc3MwMRFxdW90ZWRibGJhc2Uuc3MwMRFxdW90ZWRibGxlZnQuc3MwMRJxdW90ZWRibHJpZ2h0LnNzMDEOcXVvdGVsZWZ0LnNzMDEPcXVvdGVyaWdodC5zczAxEXF1b3RlZGJsbGVmdC5zczA4EnF1b3RlZGJscmlnaHQuc3MwOAd1bmkyMTEzCWVzdGltYXRlZARFdXJvB3VuaTIwQkEHdW5pMjBCRAd1bmkyMEE4B3VuaTIwQjkHdW5pMjIxNQd1bmkyMTI2B3VuaTIyMDYHdW5pMDBCNQdhcnJvd3VwB3VuaTIxOTcKYXJyb3dyaWdodAd1bmkyMTk4CWFycm93ZG93bgd1bmkyMTk5CWFycm93bGVmdAd1bmkyMTk2CWFycm93Ym90aAlhcnJvd3VwZG4MYXJyb3d1cC5zczA4DHVuaTIxOTcuc3MwOA9hcnJvd3JpZ2h0LnNzMDgMdW5pMjE5OC5zczA4DmFycm93ZG93bi5zczA4DHVuaTIxOTkuc3MwOA5hcnJvd2xlZnQuc3MwOAx1bmkyMTk2LnNzMDgOYXJyb3dib3RoLnNzMDgOYXJyb3d1cGRuLnNzMDgHdW5pMDMwOAd1bmkwMzA3CWdyYXZlY29tYglhY3V0ZWNvbWIHdW5pMDMwQgt1bmkwMzBDLmFsdAd1bmkwMzAyB3VuaTAzMEMHdW5pMDMwNgd1bmkwMzBBCXRpbGRlY29tYgd1bmkwMzA0B3VuaTAzMTIHdW5pMDMyNgd1bmkwMzI3B3VuaTAzMjgMdW5pMDMwOC5jYXNlDHVuaTAzMDcuY2FzZQ5ncmF2ZWNvbWIuY2FzZQ5hY3V0ZWNvbWIuY2FzZQx1bmkwMzBCLmNhc2UMdW5pMDMwMi5jYXNlDHVuaTAzMEMuY2FzZQx1bmkwMzA2LmNhc2UMdW5pMDMwQS5jYXNlDnRpbGRlY29tYi5jYXNlDHVuaTAzMDQuY2FzZQx1bmkwMzI3LmNhc2UMdW5pMDMyOC5jYXNlAAAAAAEAAAAAA+QAAAAUAAAAAAAAAAAAFgHmCB8IQQhBCEEIQQhBCEEIQQhBCEEIQQYBBgEGAAhUCFQIVAhUCFQIXwhfCGAIYAglCCUIJQglCCUIJQglCCUIJQglCCUIZQUBCCoIKggqCCoIHgsGBwQKAAcEBwQHBAcEBwQHBAcEBwQHBAcDCBcIFwggCCAIIAggCCAIIQhcBwQHBAcEBwQHBAcECGIIYghiCGIIYghiCGIIYgaCCGIIWQcGBwUIYggkCCQIJAgkBwIHAgcCBwIHAggbCC0ILQgtCC0IRQhFCEUIRQhFCEUIRQhFCEUIRQhFCDEILwgvCC8ILwgvCDAIOAg4CDgIOAg4CDgIBggGCAYIBghiCBQIFAgUCBQIFAgUCBQIFAgUCBQILgguCFAIHAgcCBwIHAgcCFIFgwOACF0IRghGCEYIRghGCEYIRghGCEYIRghGCEYIAggHCAcIBwgHCBEICAg0BQIFAgUCBQIFAgUCBQIFAgUCBQIJAgg2CDcIQwhDBQQFBAUFBQQJgQCFCFoIIggiCCIIIggiCEcIKAgoCCgIKAgoCCgIKAgoBYIIKAhCCFAITwhSCAMIAwgDCAMIEwgTCBMIEwgTCFsICQgJCAkICQgmCCYIJggmCCYIJggmCCYIJggmCCYFgAgBCAEIAQgBCAEJBAhECEQIRAhECEQIRAgFCAUIBQgFCFEIUQhRCFEIUQhRCFEIUQhRCFEIWAhYCFMIUwhTCFMEgASABIAEgASABIAEgASABIAEgASACDIIMggyCDIIMggyCFYJAAgNCFcCAghhCAAICggSCBYISwhNCCsITAhOAAADgQsACCcIJwCGCwcAiQCHAIYLBwCJAIcBgQsEAoACgQCG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Arz9RP//AE3/9AJ0ArwAJgAqAAAABwA1AMYAAP//AAcAAADmA50CJgAqAAAABgHPBwD////rAAABBAOFAiYAKgAAAAYB0+sA////7gAAAQADhgImACoAAAAGAdHuAP////YAAAD5A2sCJgAqAAAABgHM9gD//wBFAAAAqQNiAiYAKgAAAAYBzUUA//8ABwAAAOYDnQImACoAAAAGAc4HAP///8kAAAEkA1sCJgAqAAAABgHWyQD////j/zYApAK8AiYAKgAAAAYB2OMB////6gAAARgDWwImACoAAAAGAdXqAAABACD/9AGuArwAEgAAFyImJjUzFBYWMzI2NjURMxEUBus/WzFVFzMrKjEVVGcMMFo+IzkhIDcjAgP9/V5nAAEATQAAAjMCvAALAAAzETMRATMBASMDBxFNVAEkav78AQhm3k4CvP7DAT3+6f5bAWRT/u8A//8ATf8SAjMCvAImADYAAAAHAckA+AAAAAEATQAAAecCvAAFAAAzETMRIRVNVAFGArz9h0MA//8ACQAAAecDnQImADgAAAAGAc8JAP//AE0AAAHnAs0CJgA4AAAABwHBARH/+P//AE3/EgHnArwCJgA4AAAABwHJAPsAAP//AE0AAAHnArwCJgA4AAAABwFNAQMACAACABQAAAIBArwAAwAJAAATNSUVAxEzESEVFAEey1QBRgEcQ2xD/ngCvP2HQwAAAQBNAAAC7AK8AA8AADMRMxMxEzMRIxExAyMDMRFNYu7sY1TcP9wCvP4TAe39RAIl/jcBxf3fAAABAE0AAAJqArwACwAAMxEzATERMxEjATERTVQBdVRU/osCvP3OAjL9RAIy/c7//wBNAAACagOdAiYAPwAAAAcBzwDsAAD//wBNAAACagOFAiYAPwAAAAcB0gDTAAD//wBN/xICagK8AiYAPwAAAAcByQEsAAD//wBNAAACagNbAiYAPwAAAAcB1QDPAAAAAQBN/yQCagK8ABUAADMRMwExETMRFAYGIyM1MzI2NTUBMRFNVAF1VCA/LjQnJiD+iwK8/c4CMvzyMD0dSB8lUAIy/c4AAAIAMf/0ArkCyAAPAB8AAAUiJiY1NDY2MzIWFhUUBgYnMjY2NTQmJiMiBgYVFBYWAXVgklJSkmBiklBQkmJIazs7a0hHazw8awxbo2xro1xco2tso1tKRYFaWoFERIFa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AAALYAtwAAALYAtwAAALYAtwAAALYAtQAAALYAtwAAALYAtwAAALYAtwAAALYAtwAAALYAtACzYAAAssCzYAAAscCxIAAAsICxIAAAscCxIAAAscCxIAAAscCxIAAAryCugAAAryCugAAAryCugAAArYCsIKrAqiCsIKrArYCsIKrArYCsIKrArYCsIKrArYCsIKrArYCsIKrAqiCsIKrArYCsIKrArYCsIKrArYCsIKrAqSCnwKZgpWAAAAAApWAAAAAApAAAAAAApWAAAAAAoqChoAAAoKCfoAAAAAAAAJ6gnaAAAJygnAAAAJygnaAAAJygnaAAAJygnaAAAJygnaAAAJygnAAAAJygnaAAAJygnaAAAJygnaAAAJygAAAAAJ6gmwCaYAAAmwCZYAAAmGCXwAAAlsCXwAAAmGCXwAAAmGCVwAAAmGCXwAAAlMCUIAAAkyCSIAAAkYCSIAAAkyCSIAAAkyCQgAAAkyCSIAAAj4COgI0gjICOgI0gj4COgI0gj4COgI0gj4COgI0gjICOgI0gj4COgI0gj4COgI0gi4CKgImAj4COgI0giICH4AAAhuCF4AAAhUCF4AAAhuCF4AAAhuCEQAAAg0CCQAAAgaCCQAAAg0CCQAAAg0CCQAAAg0CAoAAAAAB/oAAAAAB/oAAAAAB/oAAAAAB+oAAAfaB8oHugewB8oHugfaB8oHugfaB8oHugfaB8oHugewB8oHugfaB8oHugfaB8oHugfaB8oHugfaB8oHugfaB8oHugegB5AAAAeGB5AAAAegB5AAAAegB5AAAAeGB5AAAAd2B2wAAAdiB2wAAAd2B2wAAAd2B2wAAAdiB2wAAAd2B2wAAAdSAAAAAAdIAAAAAAdSAAAAAAdSAAAAAAcyByIHEgcCByIHEgcyByIHEgcyByIHEgcyByIHEgcCByIHEgcyByIHEgcyByIHEgcyByIHEgcyByIHEgbyBuIAAAbYBuIAAAbIBr4AAAbIBr4AAAauBr4AAAbIBr4AAAaeBpQGhAZ6BpQGhAaeBpQGhAaeBpQGhAaeBpQGhAZ6BpQGhAaeBpQGhAaeBpQGhAaeBpQGhAaeBpQGhAaeBpQGhAZqBmAAAAZWBmAAAAZqBmAAAAZqBmAAAAZWBmAAAAZqBmAAAAscCxIAAAxiDFIAAAZGBjwAAAYsAAAAAAADAS4CvAAK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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+IAAAAAAAD/xV6GAAAAAAAAAAD/2V6GAAAAAAAAAAD/zhRUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADFQAAAAAAAAAAAAAAAA/9lehgAAAAAAAAAAAAAAAAAAAAAAAAAA/+wUTgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+1VfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/0AAAAAAAAAAAAAAAAAAAAAAAA/9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT74AAAAAAAAAAAAAAAAAAAAA//JUEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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/7oAAAB4/7oAAAB9/9U30gCzAAgBiAEi/8QAAAEj/805WAEm/805WAEn/9U0RAEo/7E5dgEp/945UgEq/9U0RAEr/7oAAAEt/88mBAEv/9cBggEw/4sBfAFL/885dgFP/6A5cAFS/1o5cAF1/9gAAAAeAASAAAAbAAaAAAAZAAOAAAADASn/xTfoAVH/zzfoAVL/zzfoAAYA6//YLIoBI//YAAABKf/VNjABMP/HMqgBS//iAAABUv+5N7YAYAAO/+83hAAP/+83hAAQ/+83hAAR/+83hAAS/+83hAAk/+83hAAl/+83hAAn/+83hABF/+83hABG/+83hABH/+83hABI/+83hABJ/+83hABK/+83hABL/+83hABM/+83hABO/+83hABP/+83hABS/+83hABd//kCQgBe//kCQgBf//kCQgBg//kCQgBs/8QAAABt/8c3hABu/8c3hABv/8c3hABw/8c3hABx/8c3hABz/7oAAAB0/7oAAAB1/7oAAAB2/7oAAAB3/7oAAAB4/7oAAAB9/+83hACL//IppACM//IppACN//IppACO//IppACP//IppACQ//IppACR//IppACS//IppACT//IppACU//IppACV//IppACW//IppACX//IppACY//IppACZ//IppACa//IppACb//IppACc//IppACd//IppACe//IppACf//IppADE//IppADF//IppADG//IppADH//IppADI//IppADJ//IppADK//IppADL//IppADN//IppADO//IppADR//IppAD8//IppAEG//IppAEi/+M3rgEo/+E3kAEp/+Y3qAEq/9k3rgEr/+IAAAEv//0o2gEw/70t3AFFADkyfAFL/+IAAAFS/3c3hAFV/+IAAAFW/+IAAAFX/+IAAAFYACk3rgFfAC8yfAFgAC8yfAFh/7M3hAFi/7oAAAFj/7M3hAFk/7oAAAFp/6U3kAFq/6U3kAFt/7oAAAFv/7oAAAFw/7oAAAGO/+IAAAAEABeAAACxAA0AOTA0AA7/4gAAAA//4gAAABD/4gAAABH/4gAAABL/4gAAABMAOTA0ABQAOTA0ABcAOTA0ABgAOTA0ABkAOTA0ABoAOTA0ABsAOTA0ABwAOTA0AB0AOTA0AB4AOTA0AB8AOTA0ACAAOTA0ACEAOTA0ACMAOTA0ACT/4gAAACX/4gAAACf/4gAAACgAOTA0ACoAOTA0ACwAOTA0AC0AOTA0AC4APARGAC8AKwRAADAAOTA0ADEAOTA0ADIAPwQ6ADQAOTA0ADX/2AAAADYAOTA0ADcAOTA0ADgAOTA0ADkAOTA0ADoAOTA0ADsAOTA0ADwAOTA0AD4AOTA0AD8AOTA0AEAAOTA0AEEAOTA0AEMAOTA0AEX/4gAAAEb/4gAAAEf/4gAAAEj/4gAAAEn/4gAAAEr/4gAAAEv/4gAAAEz/4gAAAE3/4jBSAE7/4gAAAE//4gAAAFAAOTA0AFEAOTA0AFL/4gAAAFMAOTA0AFQAOTA0AFUAOTA0AF0AFAAAAF4AFAAAAF8AFAAAAGAAFAAAAGwAHgAAAG0AAzU8AG4AAzU8AG8AAzU8AHAAAzU8AHEAAzU8AHMAFTVmAHQAFTVmAHUAFTVmAHYAFTVmAHcAFTVmAHgAFTVmAH3/4gAAAH7/zTVIAH//zTVIAID/zTVIAIH/zTVIAIL/zTVIAIP/zTVIAIT/zTVIAIX/zTVIAIb/zTVIAIf/zTVIAIj/zTVIAIn/zTVIAIv/0TBGAIz/0TBGAI3/0TBGAI7/0TBGAI//0TBGAJD/0TBGAJH/0TBGAJL/0TBGAJP/0TBGAJT/0TBGAJX/0TBGAJb/0TBGAJf/0TBGAJj/0TBGAJn/0TBGAJr/0TBGAJv/0TBGAJz/0TBGAJ3/0TBGAJ7/0TBGAJ//0TBGAKH/3wQ0AKL/3wQ0AKP/3wQ0AKT/3wQ0AKj/7jSqAL3/7jSqAL7/7jSqAL//7jSqAMD/7jSqAMH/7jSqAML/7jSqAMT/0TBGAMX/0TBGAMb/0TBGAMf/0TBGAMj/0TBGAMn/0TBGAMr/0TBGAMv/0TBGAM3/0TBGAM7/0TBGANH/0TBGANL/7jSqANP/7jSqANT/7jSqANX/7jSqANb/4gAAANf/4gAAANj/4gAAANn/4gAAANr/4gAAAPz/0TBGAQb/0TBGASL/7AAAASX/2TVmASb/uzVmASf/4gAAASj/4zVmASr/3jVCASv/2TVmAS3/5jL4AS//zAQuATD/4zVUAUT/ijSqAUX/xAAAAUj/ijSqAUz/wzVIAU//+idKAVH/iAAAAVP/nzU8AVX/wAQoAVb/wAQoAVf/wAQoAVj/azVmAV//pzVmAWD/pzVmAWv/nzU8AWz/nzU8AXT/oDVgAXX/zgAAAXwAOTA0AX0AOTA0AY3/xzU8AY7/wAQoAAQAD4AAACkAC4AAAA0AAYAAABkABYAAABkADIAAABEABoAAAEwAAf+lMPwAAv+lMPwAA/+lMPwABP+lMPwABf+lMPwABv+lMPwAB/+lMPwACP+lMPwACf+lMPwACv+lMPwAC/+PK+gADP+PK+gANf+7MRoAfv/yIxAAf//yIxAAgP/yIxAAgf/yIxAAgv/yIxAAg//yIxAAhP/yIxAAhf/yIxAAhv/yIxAAh//yIxAAiP/yIxAAif/yIxAAi//pK+gAjP/pK+gAjf/pK+gAjv/pK+gAj//pK+gAkP/pK+gAkf/pK+gAkv/pK+gAk//pK+gAlP/pK+gAlf/pK+gAlv/pK+gAl//pK+gAmP/pK+gAmf/pK+gAmv/pK+gAm//pK+gAnP/pK+gAnf/pK+gAnv/pK+gAn//pK+gAxP/pK+gAxf/pK+gAxv/pK+gAx//pK+gAyP/pK+gAyf/pK+gAyv/pK+gAy//pK+gAzf/pK+gAzv/pK+gA0f/pK+gA1v/jMRoA1//jMRoA2P/jMRoA2f/jMRoA2v/jMRoA/P/pK+gBBv/pK+gBJv+cAAABJ//fK+gBKP/hMPwBKv/iAAABLf+7CtoBL//SAcoBSf/6Iv4BTP+mAAABUf+YIxABWP+gMRQBdP/NMPwBdf/XMPwAGwAJgAAAOwBd/8UvSgBe/8UvSgBf/8UvSgBg/8UvSgBz/8UvSgB0/8UvSgB1/8UvSgB2/8UvSgB3/8UvSgB4/8UvSgCL/+wAAACM/+wAAACN/+wAAACO/+wAAACP/+wAAACQ/+wAAACR/+wAAACS/+wAAACT/+wAAACU/+wAAACV/+wAAACW/+wAAACX/+wAAACY/+wAAACZ/+wAAACa/+wAAACb/+wAAACc/+wAAACd/+wAAACe/+wAAACf/+wAAADE/+wAAADF/+wAAADG/+wAAADH/+wAAADI/+wAAADJ/+wAAADK/+wAAADL/+wAAADN/+wAAADO/+wAAADR/+wAAADr/+Yj7gD4ABQAAAD5ABQAAAD6ABQAAAD7ABQAAAD8/+wAAAEG/+wAAAEo/9kvSgEp/+YvRAEr/+YvRAEw/8UJEAFL/9kvSgFS/+EvLAFfACcvLAFgACcvLAGl/+gujgGm/+gujgAdAAH/ugAAAAL/ugAAAAP/ugAAAAT/ugAAAAX/ugAAAAb/ugAAAAf/ugAAAAj/ugAAAAn/ugAAAAr/ugAAAAv/nS3mAAz/nS3mADX/zy3mAHL/7CxiAUT/pS3IAUX/ugAAAUj/pS3IAUz/kgAAAVH/uS3IAVP/1y3IAVj/pgAAAVr/yh/cAV//2AAAAWD/2AAAAWYAAACwAWgAAACwAWv/1y3IAWz/1y3IAXT/xy28ABEAAIAAABAAXf/RLQYAXv/RLQYAX//RLQYAYP/RLQYAbP/hLRIAbf/iAAAAbv/iAAAAb//iAAAAcP/iAAAAcf/iAAAAc//hLRIAdP/hLRIAdf/hLRIAdv/hLRIAd//hLRIAeP/hLRIAAQFP//oesgAKAF3/zyzGAF7/zyzGAF//zyzGAGD/zyzGAHP//SeUAHT//SeUAHX//SeUAHb//SeUAHf//SeUAHj//SeUAAcAbP/iAAAAc//hLGoAdP/hLGoAdf/hLGoAdv/hLGoAd//hLGoAeP/hLGoAOAAO/+wAAAAP/+wAAAAQ/+wAAAAR/+wAAAAS/+wAAAAk/+wAAAAl/+wAAAAn/+wAAABF/+wAAABG/+wAAABH/+wAAABI/+wAAABJ/+wAAABK/+wAAABL/+wAAABM/+wAAABO/+wAAABP/+wAAABS/+wAAABd/7AAAABe/7AAAABf/7AAAABg/7AAAABs/7ksPgBt/80sPgBu/80sPgBv/80sPgBw/80sPgBx/80sPgBz/7YeUgB0/7YeUgB1/7YeUgB2/7YeUgB3/7YeUgB4/7YeUgB9/+wAAADc/+IAAADd/+IAAADe/+IAAADf/+IAAADr/88Y8ADs/+IAAADt/+IAAADu/+IAAADv/+IAAADw/+IAAADy/80sPgDz/80sPgD0/80sPgD1/80sPgD2/80sPgD3/80sPgEw/8QGCgFS/8snKgGl/9QeUgGm/9QeUgALAOv/2B/AASL/2B/AASP/6R/YASj/4iZeASn/4iZeASv/4iZeATD/wQBKAUv/2QBEAVL/xAAAAVv/zgAAAZT/xAAAAB0AAYAAAB4ABYAAAAEBNwAAAAAAAwEy/4gAIAEzAAAAGgE0/2oAFAABAAGAAAADAACAAAABAACAAAABATn/iAAIABIABIAAAAEBOf+cAAAAagAB/7cCwAAC/7cCwAAD/7cCwAAE/7cCwAAF/7cCwAAG/7cCwAAH/7cCwAAI/7cCwAAJ/7cCwAAK/7cCwAAL/60CugAM/60CugA1/88XBABs/+8gqgBt/+wf+gBu/+wf+gBv/+wf+gBw/+wf+gBx/+wf+gBy/+IlYgBz/94SmAB0/94SmAB1/94SmAB2/94SmAB3/94SmAB4/94SmAB5/+sa7gB6/+sa7gB7/+sa7gB8/+sa7gB+/+sa7gB//+sa7gCA/+sa7gCB/+sa7gCC/+sa7gCD/+sa7gCE/+sa7gCF/+sa7gCG/+sa7gCH/+sa7gCI/+sa7gCJ/+sa7gCL/+EFQACM/+EFQACN/+EFQACO/+EFQACP/+EFQACQ/+EFQACR/+EFQACS/+EFQACT/+EFQACU/+EFQACV/+EFQACW/+EFQACX/+EFQACY/+EFQACZ/+EFQACa/+EFQACb/+EFQACc/+EFQACd/+EFQACe/+EFQACf/+EFQACh/+klsgCi/+klsgCj/+klsgCk/+klsgDE/+EFQADF/+EFQADG/+EFQADH/+EFQADI/+EFQADJ/+EFQADK/+EFQADL/+EFQADN/+EFQADO/+EFQADR/+EFQADW//cCtADX//cCtADY//cCtADZ//cCtADa//cCtAD8/+EFQAEG/+EFQAEk//ICrgEl/+wf+gEm/+gCqAEn/+wf+gEq/+wf+gEt/9gluAEv/+ECogFE/8cCnAFF/8sClgFI/8cCnAFM/7MCkAFR/7kCigFS/+sa7gFT/8QEJAFY/6MChAFa/9UCfgFf/9gluAFg/9gluAFr/8QEJAFs/8QEJAF0/8QEJAAYAAeAAAAeAAiAAAAjAAKAAAAeAAOAAAAYAAiAAAAYAAmAAAAYAAWAAAAPAAKAAAATAAWAAAAXAASAAAAeAAeAAAApAA6AAAA6AAH/5iVCAAL/5iVCAAP/5iVCAAT/5iVCAAX/5iVCAAb/5iVCAAf/5iVCAAj/5iVCAAn/5iVCAAr/5iVCAD0AHQF8AF3/2yHwAF7/2yHwAF//2yHwAGD/2yHwAGz/xyKEAG3/xQF2AG7/xQF2AG//xQF2AHD/xQF2AHH/xQF2AHL/zx/AAHP/uwFwAHT/uwFwAHX/uwFwAHb/uwFwAHf/uwFwAHj/uwFwAOv/2R+iAOz/7x3kAO3/7x3kAO7/7x3kAO//7x3kAPD/7x3kAPL/2CLyAPP/2CLyAPT/2CLyAPX/2CLyAPb/2CLyAPf/2CLyAST/3g/SASn//AJuASv/7x3kATD/2wFqAUv/4iU8AU//yAFkAVH/3g/SAVL/zh6WAVj/4QJ6AVr//AJuAWH/7B00AWL/2QKAAWP/7B00AWT/2QKAAWn/xAFeAWr/xAFeAaX/2CLyAab/2CLyACkAD4AAABsACoAAABgAA4AAACMAAYAAACMAAIAAAB0AA4AAACcAAf/ZAP4AAv/ZAP4AA//ZAP4ABP/ZAP4ABf/ZAP4ABv/ZAP4AB//ZAP4ACP/ZAP4ACf/ZAP4ACv/ZAP4AC//hAPgADP/hAPgAbP/vHGIAbf/vHGIAbv/vHGIAb//vHGIAcP/vHGIAcf/vHGIAcv/YIJQA6//jAPIA7P/jJhwA7f/jJhwA7v/jJhwA7//jJhwA8P/jJhwA8v/eDlAA8//eDlAA9P/eDlAA9f/eDlAA9v/eDlAA9//eDlABJP/tB/YBMP/iI7oBT//hAPgBUf/eDlABWP/iI7oBdP/ZAP4Bk//9F1oBlP/8AOwAFQABgAAAHQAPgAAAGwAFgAAAGwABgAAAKQAB/9AatAAC/9AatAAD/9AatAAE/9AatAAF/9AatAAG/9AatAAH/9AatAAI/9AatAAJ/9AatAAK/9AatAAL/88lKgAM/88lKgA9ABcMCgBd/94lBgBe/94lBgBf/94lBgBg/94lBgBs/+IAAABt/9kgBABu/9kgBABv/9kgBABw/9kgBABx/9kgBABy/80BBABz/84AAAB0/84AAAB1/84AAAB2/84AAAB3/84AAAB4/84AAAEj/+8lPAEk/+8lAAEl/+8lPAEp/+YA/gEq/+8A+AFE/+IgfgFI/+IgfgFR/84AAAFS/+IAAAFY/84AAAFa/98f+AAZABCAAAAZAB2AAAAdABqAAAAvAAH/4iQUAAL/4iQUAAP/4iQUAAT/4iQUAAX/4iQUAAb/4iQUAAf/4iQUAAj/4iQUAAn/4iQUAAr/4iQUAAv/4yQgAAz/4yQgAF3/3iP8AF7/3iP8AF//3iP8AGD/3iP8AGz/3R76AG3/2AAAAG7/2AAAAG//2AAAAHD/2AAAAHH/2AAAAHL/2BjWAHP/zyQgAHT/zyQgAHX/zyQgAHb/zyQgAHf/zyQgAHj/zyQgAOz/7yP2AO3/7yP2AO7/7yP2AO//7yP2APD/7yP2ASP/7CKcAST/7yQyASn/5hjEASv/4wEiATD/5AEcAU//4gAAAVH/3iP8AVL/2SQgAVj/1R7uAVr/1yQCAWL/7AAAAWT/7AAAAXT/5iQaACkAEIAAAB0ADoAAAJAAAf+pIs4AAv+pIs4AA/+pIs4ABP+pIs4ABf+pIs4ABv+pIs4AB/+pIs4ACP+pIs4ACf+pIs4ACv+pIs4ADv/mIvIAD//mIvIAEP/mIvIAEf/mIvIAEv/mIvIAJP/mIvIAJf/mIvIAJ//mIvIANf/YAAAARf/mIvIARv/mIvIAR//mIvIASP/mIvIASf/mIvIASv/mIvIAS//mIvIATP/mIvIATf/lA4wATv/mIvIAT//mIvIAUv/mIvIAbAAUAAAAbQADIs4AbgADIs4AbwADIs4AcAADIs4AcQADIs4Aff/mIvIAfv/eItQAf//eItQAgP/eItQAgf/eItQAgv/eItQAg//eItQAhP/eItQAhf/eItQAhv/eItQAh//eItQAiP/eItQAif/eItQAi//FGfAAjP/FGfAAjf/FGfAAjv/FGfAAj//FGfAAkP/FGfAAkf/FGfAAkv/FGfAAk//FGfAAlP/FGfAAlf/FGfAAlv/FGfAAl//FGfAAmP/FGfAAmf/FGfAAmv/FGfAAm//FGfAAnP/FGfAAnf/FGfAAnv/FGfAAn//FGfAAoAADDjIAof/UA4YAov/UA4YAo//UA4YApP/UA4YAqP/mIvIAvf/mIvIAvv/mIvIAv//mIvIAwP/mIvIAwf/mIvIAwv/mIvIAxP/FGfAAxf/FGfAAxv/FGfAAx//FGfAAyP/FGfAAyf/FGfAAyv/FGfAAy//FGfAAzf/FGfAAzv/FGfAAz//eA4AA0f/FGfAA0v/mIvIA0//mIvIA1P/mIvIA1f/mIvIA1v/BIVQA1//BIVQA2P/BIVQA2f/BIVQA2v/BIVQA/P/FGfABBv/FGfABIv/yA3oBIwAEIvIBJP/mF5wBJf/mIvIBJv/FA3QBJ//jB8YBKP/mIvIBKv/vA24BK//mF5wBLf/rA2gBL//YA2IBRP/EGfwBRf/OF7oBR//bEzIBSP/EGfwBTP++IvIBUf+pIs4BU/+0IvIBVf/eItQBVv/eItQBV//eItQBWP/HIs4BX//EAAABYP/EAAABZf/PIvgBZ//PIvgBaQAeAAABagAeAAABa/+0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QAAAAAAFQAQAAMAAQADyAAA1YAggAMAAQAAAAAAFQAcgAMAAQADyAAAFQAkAAAAAQABAAAAFQAogAAAAQABAAAMCABYPAv7++4IC5+fNghUUAAEBAQEBAwMBAgEDAQEBAQUCAgMDFAsPDQ0EAAH//f/9/Pz9+v4K/vP1/IAFBgkGAQEBggr/AgIEAPYGDAf4AAAlKjoxMQn5+fr6+vrw6u/w6uTk5Obr3e//FiMjIwbv17y8vMjfAN6BgAodJxoFBQUFBAQA/4IU/gAECAwTANPT4PYEHTk5OR8D9d/TgwAlzu3z8PLz+gIEBAQKEBETGR4eHhwWJxH+4dHR0fURLVBQUEAkACGBgAoi/wIDAwP++vwAAYMT//r47eUAPT0sEP7hvr6+4f0QLD2DABL99PX2/wIB/////wABAP//////gwT//v7+/ogA/4GABfT3+f///5AJ/////v////7//4UCBgYMggAS/fT19v8CAf////8AAQD//////4ME//7+/v6IAP+BgAX09/n///+QCf////7////+//+FAgYGDIIC/v79ggL8/PmCgAsAgAACQAYAAAAAQAAAAAACQAUgAAAAQAAAAAAFQAIAAMAAAAAAAAAFQAEAAMAAAADyAAAFAAAAAkADAADAAEAAAAAABUAEAADAAEAA8gAAAkAIIADAAEAAAAAAAkAHIADAAEAA8gAAAkAJAAAAAEAAQAAAAkAKIAAAAEAAQAAAhISEhIEA94GEgQDWgYSBADmBhISEgQD5gYSEhISEhISEhACACwCAAAJABgAAAABAAAAAAAJABSAAAABAAAAAAAVAAgAAwAAAAAAAAAVAAQAAwAAAAPIAAAUAAAAFQAMAAMAAQAAAAAAFQAQAAMAAQADyAAACQAggAMAAQAAAAAACQAcgAMAAQADyAAACQAkAAAAAQABAAAACQAogAAAAQABAAACEhISEgQD3gYSBANmBhIEANYGEgQABgYSBAP6BhISEhISEhISEgAsAgAACQAYAAAAAQAAAAAACQAUgAAAAQAAAAAAFQAIAAMAAAAAAAAAFQAEAAMAAAADyAAAFAAAAAkADAADAAEAAAAAABUAEAADAAEAA8gAAAkAIIADAAEAAAAAAAkAHIADAAEAA8gAAAkAJAAAAAEAAQAAAAkAKIAAAAEAAQAAAhISEhIEA+YGEgQDggYSB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HAAcgQn08ejnAPzz8wDogQAHgQEHB4EAB4MJy7uUkADvx8QAlIEAIYEBISGBACGDAUhdQQCTAJiAAxZNUQBAAJOBANOBAdPTgQDTgwYBAQEBAAEBgQABgYsGAgMCAQACAoEAAoEA/4EB//+BAP+DBgEBAQEAAQGBAAGBiwYCAwIBAAICgQACgQD/gQH//4EA/4OACQBoAApABgAAAABAAAAAABNgBSAAAABAAAAAABVAAgAAwAAAAAAAABVAAQAAwAAAAPIAABoAAAAKQAMAAMAAQAAAAAAVQAQAAMAAQADyAAAKQAggAMAAQAAAAAAVQAcgAMAAQADyAACLgAEcHIEBHByEBQQAAgICAwT7+/v79oADHAAcAAn09wAB6Oz19QDogYABBweBAQcHhAnJ2QAElKXN0ACUgYABISGBASEhhANLNgD7QACTA31GQgBAAJOBgAHT04EB09OEgwABgQIBAAGBi4AD/wABAoECAgACgYAB//+BAf//hIMAAYECAQABgYuAA/8AAQKBAgIAAoGAAf//gQH//4SACQBoAAdABgAAAABAAAAAAAxgBSAAAABAAAAAAA5AAgAAwAAAAAAAAA5AAQAAwAAAAPIAAA4AAAAJQAMAAMAAQAAAAAAOQAQAAMAAQADyAAAJQAggAMAAQAAAAAAOQAcgAMAAQADyAACHAByBAByDAwIAAgMC+/v2AByBgAT88/MA84EAB4EAB4OABO/HxADHgQAhgQAhg4AEFk1RAE2BANOBANODgAEBAYEAAYGHgAECAoEAAoEA/4EA/4OAAQEBgQABgYeAAQICgQACgQD/gQD/g4AJAGgABkAGAAAAAEAAAAAADWAFIAAAAEAAAAAADEACAADAAAAAAAAADUABAADAAAAA8gAADQAAAAlAAwAAwABAAAAAAA1ABAAAwABAAPIAAAlACCAAwABAAAAAAA1AByAAwABAAPIAAIeAARwchAMCAAIDAvv79oABHAAB8/eCAPOBgAEHB4QFx9gAAwDHgYABISGEBU03APwATYGAAdPThAABgQIBAAGBhwACgQICAAKBgAH//4QAAYECAQABgYcAAoECAgACgYAB//+EgAQALAARQAIAAMAAAAAAAAARQAEAAMAAAADyAAARAAAACmAEAADAAEAA8gAADfv5++/t7wMBA/f19wDvgY8N6d/psamxDQMN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";
        },
        771: (A, e, t) => {
          "use strict";
          function i(A) {
            const {
              t: e,
              title: t,
              titleId: i,
              showBackButton: n = !1,
              backButtonId: o,
              menuDropdownHTML: g = "",
            } = A;
            return `\n        <div class="widget-header">\n            <div class="widget-header-button">\n                ${n ? `\n        <button id="${o}" class="back-btn-arrow" aria-label="${e("ariaLabels.backButton")}">\n            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>\n        </button>\n    ` : "\x3c!-- Empty Spacer --\x3e"}\n            </div>\n            <div ${i ? `id="${i}"` : ""} class="widget-header-heading">${t}</div>\n            <div class="widget-header-button">\n                <button class="menu-btn-dots" aria-label="${e("ariaLabels.menuButton")}">\n                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                        <path d="M12 5.25C12.6904 5.25 13.25 4.69036 13.25 4C13.25 3.30964 12.6904 2.75 12 2.75C11.3096 2.75 10.75 3.30964 10.75 4C10.75 4.69036 11.3096 5.25 12 5.25Z" fill="currentColor"/>\n                        <path d="M12 12.25C12.6904 12.25 13.25 11.6904 13.25 11C13.25 10.3096 12.6904 9.75 12 9.75C11.3096 9.75 10.75 10.3096 10.75 11C10.75 11.6904 11.3096 12.25 12 12.25Z" fill="currentColor"/>\n                        <path d="M12 19.25C12.6904 19.25 13.25 18.6904 13.25 18C13.25 17.3096 12.6904 16.75 12 16.75C11.3096 16.75 10.75 17.3096 10.75 18C10.75 18.6904 11.3096 19.25 12 19.25Z" fill="currentColor"/>\n                    </svg>\n                </button>\n                ${g}\n            </div>\n        </div>\n    `;
          }
          (t.r(e), t.d(e, { getWidgetHeaderHTML: () => i }));
        },
        825: (A) => {
          "use strict";
          A.exports =
            "data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2716%27 height=%2716%27 fill=%27%23656c6e%27 viewBox=%270 0 16 16%27%3E%3Cpath d=%27M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z%27/%3E%3C/svg%3E";
        },
        857: (A, e, t) => {
          "use strict";
          (t.r(e), t.d(e, { getFormPageTemplateHTML: () => o }));
          var i = t(771),
            n = t(16);
          function o(A) {
            const {
                config: e,
                t,
                state: o,
                formatDateForDisplay: g,
                formatDatetime: r,
              } = A,
              a =
                e.multiday &&
                e.activityDurationDaysFixed &&
                (e.overrideActivityStartDate || e.overrideActivityEndDate),
              B = !e.overrideActivityStartDate && !a,
              s = e.multiday && !e.overrideActivityEndDate && !a;
            let c = "";
            (!e.multiday &&
              e.overrideActivityStartDate &&
              !a &&
              e.hideOverriddenActivityStartDate) ||
              ((c += '<div class="form-section date-section-wrapper">'),
              e.multiday
                ? (B
                    ? (c += `\n                  <div class="date-input-column">\n                    <p id="dateLabelStart">${t("activityStartDateLabel")}</p>\n                    <div class="date-input-container" role="button" aria-labelledby="dateLabelStart" tabindex="0">\n                      <div class="date-input">\n                        <svg class="date-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>\n                        </svg>\n                        <span id="dateDisplayStart" class="date-input-display placeholder">${t("selectDate")}</span>\n                        <svg class="date-input-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>\n                      </div>\n                      <input type="date" id="activityDateStart" class="native-date-picker-multiday" aria-hidden="true">\n                    </div>\n                  </div>`)
                    : (!e.overrideActivityStartDate && !a) ||
                      e.hideOverriddenActivityStartDate ||
                      (c += `\n                 <div class="date-input-column">\n                   <p id="dateLabelStart">${t("activityStartDateLabel")}</p>\n                   <div class="date-input-container disabled" role="button" tabindex="-1">\n                     <div class="date-input">\n                       <svg class="date-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n                         <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>\n                       </svg>\n                       <span id="dateDisplayStart" class="date-input-display">${o.selectedDate ? g(o.selectedDate, { EN: "en-GB", DE: "de-DE", FR: "fr-FR", IT: "it-IT", TH: "th-TH", ES: "es-ES" }[e.language] || (e.language ? `${e.language.toLowerCase()}-${e.language.toUpperCase()}` : "en-GB"), e.timezone) : t("selectDate")}</span>\n                     </div>\n                     <input type="date" id="activityDateStart" class="native-date-picker-multiday" style="display:none !important;" aria-hidden="true" value="${o.selectedDate ? r(o.selectedDate) : ""}">\n                   </div>\n                 </div>`),
                  s
                    ? (c += `\n                  <div class="date-input-column">\n                    <p id="dateLabelEnd">${t("activityEndDateLabel")}</p>\n                    <div class="date-input-container" role="button" aria-labelledby="dateLabelEnd" tabindex="0">\n                      <div class="date-input">\n                        <svg class="date-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n                           <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>\n                        </svg>\n                        <span id="dateDisplayEnd" class="date-input-display placeholder">${t("selectDate")}</span>\n                        <svg class="date-input-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>\n                      </div>\n                      <input type="date" id="activityDateEnd" class="native-date-picker-multiday" aria-hidden="true">\n                    </div>\n                  </div>`)
                    : e.multiday &&
                      (e.overrideActivityEndDate || a) &&
                      !e.hideOverriddenActivityStartDate &&
                      (c += `\n                <div class="date-input-column">\n                  <p id="dateLabelEnd">${t("activityEndDateLabel")}</p>\n                  <div class="date-input-container disabled" role="button" tabindex="-1">\n                    <div class="date-input">\n                      <svg class="date-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>\n                      </svg>\n                      <span id="dateDisplayEnd" class="date-input-display">${o.selectedEndDate ? g(o.selectedEndDate, { EN: "en-GB", DE: "de-DE", FR: "fr-FR", IT: "it-IT", TH: "th-TH", ES: "es-ES" }[e.language] || (e.language ? `${e.language.toLowerCase()}-${e.language.toUpperCase()}` : "en-GB"), e.timezone) : t("selectDate")}</span>\n                    </div>\n                    <input type="date" id="activityDateEnd" class="native-date-picker-multiday" style="display:none !important;" aria-hidden="true" value="${o.selectedEndDate ? r(o.selectedEndDate) : ""}">\n                  </div>\n                </div>`))
                : B
                  ? (c += `\n                  <div class="date-input-column single">\n                    <p id="dateLabel">${t("activityDate")}</p>\n                    <div class="date-selector-buttons" role="group" aria-labelledby="dateLabel">\n                        <button type="button" id="dateBtnToday" class="date-selector-btn">${t("today")}</button>\n                        <button type="button" id="dateBtnTomorrow" class="date-selector-btn">${t("tomorrow")}</button>\n                        <button type="button" id="dateBtnOther" class="date-selector-btn">\n                            <span id="otherDateText">${t("otherDate")}</span>\n                            <svg class="date-input-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\n                        </button>\n                    </div>\n                    <input type="date" id="activityDate" class="native-date-picker-single" aria-hidden="true" style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;">\n                  </div>`)
                  : e.overrideActivityStartDate &&
                    (c += `\n                  <div class="date-input-column single">\n                    <p id="dateLabel">${t("activityDate")}</p>\n                    <div class="date-input-container disabled" role="button" aria-labelledby="dateLabel" tabindex="-1">\n                      <div class="date-input">\n                         <svg class="date-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n                           <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>\n                         </svg>\n                        <span id="dateDisplay" class="date-input-display">${o.selectedDate ? g(o.selectedDate, { EN: "en-GB", DE: "de-DE", FR: "fr-FR", IT: "it-IT", TH: "th-TH", ES: "es-ES" }[e.language] || (e.language ? `${e.language.toLowerCase()}-${e.language.toUpperCase()}` : "en-GB"), e.timezone) : t("selectDate")}</span>\n                      </div>\n                      <input type="date" id="activityDate" class="native-date-picker-single" aria-hidden="true" style="display:none !important;" value="${o.selectedDate ? r(o.selectedDate, e.timezone) : ""}">\n                    </div>\n                  </div>`),
              (c += "</div>"));
            const Q = (0, n.getMenuDropdownHTML)({
              t,
              dropdownId: "formMenuDropdown",
              isShareDisabled: !0,
            });
            return `\n      <div id="formPage" class="modal-page active">\n        ${(0, i.getWidgetHeaderHTML)({ t, title: e.activityName, menuDropdownHTML: Q })}\n        <div id="infoContainer" class="info-message" style="display: none;" role="status"></div>\n        <div id="formErrorContainer" class="error-message" style="display: none;" role="alert"></div>\n        <div id="formDebugContainer" class="debug-container" style="display: none;"></div>\n        <form class="modal-body" aria-labelledby="formHeading">\n          <div style="position:relative" class="form-section">\n            <p id="originLabel">${t("origin")}</p>\n            <div class="input-container">\n              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle></svg>\n              <input type="text" class="input-field" id="originInput" placeholder="${t("enterOrigin")}" value="${e.userStartLocationDefault || ""}" aria-labelledby="originLabel">\n              <svg id="clearInputBtn" class="input-icon-right" style="pointer-events: auto; cursor: pointer; display: none;" width="18.75" height="18.75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="${t("clearInput")}" role="button">\n                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>\n              </svg>\n              <svg id="currentLocationBtn" class="input-icon-right" style="pointer-events: auto; cursor: pointer;" width="18.75" height="18.75" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-label="${t("useCurrentLocation")}" role="button">\n                <circle cx="12" cy="12" r="7"></circle><circle cx="12" cy="12" r="3"></circle><line x1="12" y1="0" x2="12" y2="5"></line><line x1="0" y1="12" x2="5" y2="12"></line><line x1="12" y1="19" x2="12" y2="24"></line><line x1="19" y1="12" x2="24" y2="12"></line>\n              </svg>\n            </div>\n            <div id="suggestions" class="suggestions-container" role="listbox"></div>\n          </div>\n          <div class="form-section">\n            <p id="destinationLabel">${t("destination")}</p>\n            <div class="input-container">\n              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>\n              <input type="text" class="input-field disabled" id="destinationInput" placeholder="${t("destination")}" value="${e.destinationInputName || e.activityName}" readonly aria-labelledby="destinationLabel">\n            </div>\n          </div>\n          ${c}\n          <div class="form-footer">\n            <button type="submit" class="btn apply-btn" id="searchBtn">${t("search")}</button>\n          </div>\n        </form>\n        <div class="widget-footer"><a href="https://zuugle-services.com" target="_new">powered by Zuugle Services</a></div>\n      </div>\n    `;
          }
        },
        920: (A, e, t) => {
          "use strict";
          (t.r(e), t.d(e, { getContentPageTemplateHTML: () => o }));
          var i = t(771),
            n = t(16);
          function o(A) {
            const { t: e } = A,
              t = (0, n.getMenuDropdownHTML)({
                t: e,
                dropdownId: "contentMenuDropdown",
                isShareDisabled: !0,
              });
            return `\n      <div id="contentPage" class="modal-page">\n        ${(0, i.getWidgetHeaderHTML)({ t: e, title: "", titleId: "contentPageTitle", showBackButton: !0, backButtonId: "contentPageBackBtn", menuDropdownHTML: t })}\n        <div id="contentPageBody" class="modal-body content-page-body">\n        </div>\n        <div class="widget-footer"><a href="https://zuugle-services.com" target="_new">powered by Zuugle Services</a></div>\n      </div>\n    `;
          }
        },
        933: (A, e, t) => {
          "use strict";
          (t.r(e), t.d(e, { getSingleCalendarHTML: () => n }));
          var i = t(185);
          function n(A) {
            const {
              t: e,
              currentViewMonth: t,
              currentViewYear: n,
              daysHTML: o,
            } = A;
            return `\n        <div class="calendar-header"><p class="calendar-title">${e("datePickerTitle")}</p></div>\n        <div class="calendar-body">\n            <div class="calendar-nav">\n                <button type="button" class="calendar-nav-btn prev-month" aria-label="${e("ariaLabels.previousMonthButton")}">&#9664;</button>\n                <div class="calendar-month-year">${(0, i.Ge)(t, e)} ${n}</div>\n                <button type="button" class="calendar-nav-btn next-month" aria-label="${e("ariaLabels.nextMonthButton")}">&#9654;</button>\n            </div>\n            <div class="calendar-grid">\n                ${[0, 1, 2, 3, 4, 5, 6].map((A) => `<div class="calendar-day-header">${(0, i.uA)(A, e)}</div>`).join("")}\n                ${o}\n            </div>\n        </div>\n        <div class="calendar-footer">\n            <button type="button" class="calendar-footer-btn calendar-cancel-btn">${e("cancel")}</button>\n            <button type="button" class="calendar-footer-btn calendar-apply-btn">${e("apply")}</button>\n        </div>\n    `;
          }
        },
      },
      e = {};
    function t(i) {
      var n = e[i];
      if (void 0 !== n) return n.exports;
      var o = (e[i] = { id: i, exports: {} });
      return (A[i](o, o.exports, t), o.exports);
    }
    ((t.m = A),
      (t.n = (A) => {
        var e = A && A.__esModule ? () => A.default : () => A;
        return (t.d(e, { a: e }), e);
      }),
      (t.d = (A, e) => {
        for (var i in e)
          t.o(e, i) &&
            !t.o(A, i) &&
            Object.defineProperty(A, i, { enumerable: !0, get: e[i] });
      }),
      (t.e = () => Promise.resolve()),
      (t.o = (A, e) => Object.prototype.hasOwnProperty.call(A, e)),
      (t.r = (A) => {
        ("undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(A, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(A, "__esModule", { value: !0 }));
      }),
      (t.b =
        ("undefined" != typeof document && document.baseURI) ||
        self.location.href));
    var i = {};
    return (
      (() => {
        "use strict";
        t.d(i, { default: () => U });
        var A = t(447),
          e = t.n(A),
          n = t(97);
        const o = {
          EN: {
            origin: "Origin",
            enterOrigin: "Enter origin",
            destination: "Destination",
            activityDate: "Activity date",
            activityStartDateLabel: "Start date",
            activityEndDateLabel: "End date",
            search: "Search",
            selectDate: "Select",
            datePickerTitle: "Select Activity Date",
            apply: "Apply",
            cancel: "Cancel",
            back: "Back",
            reloadPage: "Reload page",
            journeyToActivity: "To Activity",
            journeyFromActivity: "From Activity",
            selectTimeSlotForSummary:
              "Select a time slot to see journey summary.",
            loadingConnectionsI: "Incoming connections are loading...",
            loadingConnectionsO: "Outgoing connections are loading...",
            loadingStateSearching: "Searching...",
            loadingStateToActivity: "Loading to activity connections...",
            loadingStateFromActivity: "Loading from activity connections...",
            noConnections: "No connection details available.",
            anytime: "Anytime",
            anytimeLeaveBy: "Leave by {time} at the latest",
            anytimeWalkTo: "Walk to {destination}",
            transfers: "transfers",
            stopSg: "stop",
            stopPl: "stops",
            daySg: "day",
            dayPl: "days",
            nightSg: "night",
            nightPl: "nights",
            durationHoursShort: "h",
            durationHoursLong: "hours",
            durationMinutesShort: "min",
            durationMinutesLong: "minutes",
            durationTransferTime: "Transfer time",
            activityStart: "Start",
            activityEnd: "End",
            activityDuration: "Duration",
            dateRangeLabel: "Date range",
            noConnectionDetails: "No connection details available.",
            noConnectionElements: "No connection elements available.",
            selectTimeSlot: "Please select a time slot above.",
            useCurrentLocation: "Use current location",
            clearInput: "Clear input",
            selectDateRange: "Select date range",
            today: "Today",
            tomorrow: "Tomorrow",
            otherDate: "Other date",
            share: "Share",
            shareUrlCopied: "Share URL copied to clipboard!",
            shareUrlCopyFailed: "Could not copy URL.",
            live: "Realtime",
            liveConnection: "Realtime Connection",
            platform: "Platform",
            direction: "Direction",
            buyTicket: "Buy Ticket",
            menu: {
              helpAndSupport: "Help",
              helpAndSupportSubtitle: "Find answers & guides.",
              imprint: "Imprint",
            },
            warnings: {
              earlyStart:
                "Warning: Earlier Arrival than recommended starting time of activity!",
              lateEnd:
                "Warning: Later Departure than recommended ending time of activity!",
              duration: "Warning: Activity duration below recommended",
              durationShort: "Duration too short",
              durationShorter: "shorter than recommended",
              durationLonger: "longer than recommended",
            },
            infos: {
              originRequired: "Please enter an origin location.",
              dateRequired: "Please select a date.",
              endDateRequired: "Please select an end date.",
              fetchingLocation: "Fetching your location...",
              fetchingAddress: "Looking up address...",
              endDateAfterStartDate:
                "End date must be on or after the start date.",
              sharedDateInPast:
                "This shared journey is for a date in the past. Please select a new date to find current connections.",
              sharedDateDurationMismatch:
                "The dates of this shared journey do not match. Please select new dates to find current connections.",
              shareLinkInvalid: "This shared link is invalid or has expired.",
            },
            errors: {
              sessionExpired:
                "Your session has expired. Please reload the page to continue.",
              connectionError: "Failed to load connections. Please try again.",
              suggestionError: "Failed to load suggestions. Please try again.",
              activityTimeError:
                "Failed to calculate activity times. Please try again.",
              geolocationError: "Geolocation failed.",
              geolocationNotSupported:
                "Geolocation is not supported by your browser.",
              geolocationPermissionDenied:
                "Permission to access location was denied.",
              geolocationPositionUnavailable:
                "Location information is unavailable.",
              geolocationTimeout: "The request to get user location timed out.",
              reverseGeocodeNoResults:
                "Could not find an address for your location.",
              shareLinkInvalidExpired: "Share link is invalid or expired.",
              shareLinkCreateFailed: "Failed to create share link.",
              shareLinkErrorTitle: "Couldn't Load This Shared Journey.",
              widgetLoadErrorTitle: "Widget could not be loaded.",
              api: {
                internalError:
                  "Oops! Something went wrong on our end. Our team has been notified and is working on a solution. Please try again in a few moments.",
                queryParamMissing: "Query parameter 'q' is missing.",
                invalidLimitParam: "Invalid limit parameter.",
                networkError:
                  "No internet connection. Please check your network and try again.",
                apiUnreachable:
                  "A technical error has occurred. Our system is already working on a solution. Please try again shortly.",
                invalidUserStartCoordinates:
                  "Invalid coordinates format for user's start location. Please use 'lat,lon'.",
                geocodeUserStartFailed:
                  "Could not identify the user's start location.",
                unsupportedUserStartType:
                  "Unsupported location type for user's start location.",
                invalidActivityStartCoordinates:
                  "Invalid coordinates format for the activity's start location. Please use 'lat,lon'.",
                geocodeActivityStartFailed:
                  "Could not identify the activity's start location.",
                unsupportedActivityStartType:
                  "Unsupported location type for activity's start.",
                invalidActivityEndCoordinates:
                  "Invalid coordinates format for the activity's end location. Please use 'lat,lon'.",
                geocodeActivityEndFailed:
                  "Could not identify the activity's end location.",
                unsupportedActivityEndType:
                  "Unsupported location type for activity's end.",
                noToConnectionsFound:
                  "No suitable connections found to the activity.",
                noFromConnectionsFound:
                  "No suitable connections found from the activity.",
                noFromConnectionsFoundFallback:
                  "No suitable return connections were found for today, even after trying later options.",
                noFromConnectionsFoundFallbackNotToday:
                  "No suitable return connections were found for the selected date, even after trying later options.",
                toConnectionsNoScore:
                  "Connections to the activity were found, but none met the quality criteria.",
                fromConnectionsNoScore:
                  "Connections from the activity were found, but none met the quality criteria.",
                noToConnectionsMergingMightFail:
                  "No suitable connections found for the journey to the activity.",
                noFromConnectionsMergingMightFail:
                  "No suitable connections found for the journey from the activity.",
                noToConnectionsMergingFailed:
                  "Could not find any connections for the journey to the activity.",
                noFromConnectionsMergingFailed:
                  "Could not find any connections for the journey from the activity.",
                noToConnectionsTimeWindow:
                  "No connections were found to the activity within the specified time window.",
                noFromConnectionsTimeWindow:
                  "No connections were found from the activity within the specified time window.",
                noToConnectionsAfterCurrentTime:
                  "No more connections to the activity are available today. Please choose another date.",
                noToConnectionsFilteredByDuration:
                  "All connections to the activity were filtered out due to their duration.",
                noFromConnectionsFilteredByDuration:
                  "All connections from the activity were filtered out due to their duration.",
                noReturnConnectionMatchingIncoming:
                  "Found return connections, but no incoming journey arrives early enough for the latest return. Try adjusting activity times or duration.",
                reverseGeocodeParameterMissing:
                  "Latitude and longitude parameters are required.",
                sharedLinkInvalid:
                  "This shared link is invalid or has expired.",
                monthlyQuotaExceeded:
                  "The monthly usage limit for this feature has been reached.",
                noConnectionsFound:
                  "Unfortunately, no connections could be found for your request. Please try different locations, dates, or times.",
                invalidDataReceived:
                  "Received invalid data from the server. Please try again.",
                unknown: "An unexpected error occurred. Please try again.",
              },
            },
            debug: {
              showDetails: "Show debug details",
              hideDetails: "Hide debug details",
            },
            months: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            shortDays: ["M", "T", "W", "T", "F", "S", "S"],
            ariaLabels: {
              topSlider: "Available time slots to activity",
              bottomSlider: "Available return time slots from activity",
              searchButton: "Search for connections",
              backButton: "Go back to search form",
              previousMonthButton: "Previous month",
              nextMonthButton: "Next month",
              menuButton: "Open menu",
              menuHeading: "Page menu",
              closeButton: "Close",
              shareButton: "Share Journey",
            },
            waiting: {
              beforeActivity: "Waiting for activity to start",
              afterActivity: "Waiting after activity ends",
              title: "Waiting Time",
            },
            vehicles: {
              1: "Train",
              2: "Bus",
              3: "Tram",
              4: "Subway",
              5: "Monorail",
              6: "Cog Train",
              7: "Funicular",
              8: "Aerial Lift",
              9: "Ferry",
              10: "Taxi",
              20: "Miscellaneous",
              30: "House",
              31: "Street",
              32: "Square",
              33: "Park",
              WALK: "Walk",
              TRSF: "Transfer",
            },
            alert: { label: "Alert" },
          },
          DE: {
            origin: "Startort",
            enterOrigin: "Startort eingeben",
            destination: "Zielort",
            activityDate: "Aktivitätsdatum",
            activityStartDateLabel: "Startdatum",
            activityEndDateLabel: "Enddatum",
            search: "Suchen",
            selectDate: "Auswählen",
            datePickerTitle: "Aktivitätsdatum wählen",
            apply: "Übernehmen",
            cancel: "Abbrechen",
            back: "Zurück",
            reloadPage: "Seite neu laden",
            journeyToActivity: "Hinfahrt",
            journeyFromActivity: "Rückfahrt",
            selectTimeSlotForSummary:
              "Wählen Sie ein Zeitfenster, um die Zusammenfassung der Reise anzuzeigen.",
            loadingConnectionsI: "Hinfahrten werden geladen...",
            loadingConnectionsO: "Rückfahrten werden geladen...",
            loadingStateSearching: "Suche...",
            loadingStateToActivity: "Lade Verbindungen zur Aktivität...",
            loadingStateFromActivity: "Lade Verbindungen von der Aktivität...",
            noConnections: "Keine Verbindungsdetails verfügbar.",
            anytime: "Jederzeit",
            anytimeLeaveBy: "Spätestens um {time} Uhr losgehen",
            anytimeWalkTo: "Fußweg nach {destination}",
            transfers: "Umstiege",
            stopSg: "Halt",
            stopPl: "Halte",
            daySg: "Tag",
            dayPl: "Tage",
            nightSg: "Nacht",
            nightPl: "Nächte",
            durationHoursShort: "h",
            durationHoursLong: "Stunden",
            durationMinutesShort: "min",
            durationMinutesLong: "Minuten",
            durationTransferTime: "Umsteigezeit",
            activityStart: "Beginn",
            activityEnd: "Ende",
            activityDuration: "Dauer",
            dateRangeLabel: "Zeitraum",
            noConnectionDetails: "Keine Verbindungsdetails verfügbar.",
            noConnectionElements: "Keine Verbindungselemente verfügbar.",
            selectTimeSlot: "Bitte wählen Sie ein Zeitfenster aus.",
            useCurrentLocation: "Aktuellen Standort verwenden",
            clearInput: "Eingabe löschen",
            selectDateRange: "Datumsbereich auswählen",
            today: "Heute",
            tomorrow: "Morgen",
            otherDate: "Anderes Datum",
            share: "Teilen",
            shareUrlCopied: "Share-URL wurde in die Zwischenablage kopiert!",
            shareUrlCopyFailed: "URL konnte nicht kopiert werden.",
            live: "Realtime",
            liveConnection: "Realtime Fahrplan",
            platform: "Bahnsteig",
            direction: "Richtung",
            buyTicket: "Ticket kaufen",
            menu: {
              helpAndSupport: "Hilfe",
              helpAndSupportSubtitle: "Häufig gestellte Fragen und Guides.",
              imprint: "Impressum",
            },
            warnings: {
              earlyStart: "Warnung: Frühere Ankunft als empfohlene Startzeit!",
              lateEnd: "Warnung: Spätere Abfahrt als empfohlene Endzeit!",
              duration: "Warnung: Aktivitätsdauer unter Empfehlung.",
              durationShort: "Dauer zu kurz",
              durationShorter: "kürzer als empfohlen",
              durationLonger: "länger als empfohlen",
            },
            infos: {
              originRequired: "Bitte geben Sie einen Startort ein.",
              dateRequired: "Bitte wählen Sie ein Datum.",
              endDateRequired: "Bitte wählen Sie ein Enddatum.",
              fetchingLocation: "Standort wird abgerufen...",
              fetchingAddress: "Adresse wird gesucht...",
              endDateAfterStartDate:
                "Das Enddatum muss am oder nach dem Startdatum liegen.",
              sharedDateInPast:
                "Diese geteilte Reise bezieht sich auf ein vergangenes Datum. Bitte wählen Sie ein neues Datum, um aktuelle Verbindungen zu finden.",
              sharedDateDurationMismatch:
                "Die Daten dieser geteilten Reise passen nicht zusammen. Bitte wählen Sie ein neues Start- und Enddatum aus, um aktuelle Verbindungen zu finden.",
              shareLinkInvalid:
                "Dieser geteilte Link ist ungültig oder abgelaufen.",
            },
            errors: {
              sessionExpired:
                "Ihre Sitzung ist abgelaufen. Bitte laden Sie die Seite neu, um fortzufahren.",
              connectionError:
                "Verbindungsdaten konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
              suggestionError:
                "Vorschläge konnten nicht geladen werden. Bitte versuchen Sie es erneut.",
              activityTimeError:
                "Aktivitätszeiten konnten nicht berechnet werden. Bitte versuchen Sie es erneut.",
              reverseGeocodeNoResults:
                "Keine Adresse für Ihren Standort gefunden.",
              geolocationError: "Standortbestimmung fehlgeschlagen.",
              geolocationNotSupported:
                "Geolokalisierung wird von Ihrem Browser nicht unterstützt.",
              geolocationPermissionDenied:
                "Zugriff auf den Standort wurde verweigert.",
              geolocationPositionUnavailable:
                "Standortinformationen sind nicht verfügbar.",
              geolocationTimeout:
                "Die Anfrage zur Standortbestimmung ist abgelaufen.",
              shareLinkInvalidExpired:
                "Der geteilte Link ist ungültig oder abgelaufen.",
              shareLinkCreateFailed:
                "Der Teilen-Link konnte nicht erstellt werden.",
              shareLinkErrorTitle: "Laden der geteilten Daten fehlgeschlagen",
              widgetLoadErrorTitle: "Das Widget konnte nicht geladen werden.",
              api: {
                internalError:
                  "Hoppla! Auf unserer Seite ist ein Fehler aufgetreten. Unser Team wurde benachrichtigt und arbeitet an einer Lösung. Bitte versuchen Sie es in ein paar Augenblicken erneut.",
                queryParamMissing: "Der Suchparameter 'q' fehlt.",
                invalidLimitParam: "Ungültiger Limit-Parameter.",
                networkError:
                  "Keine Internetverbindung. Bitte überprüfen Sie Ihr Netzwerk und versuchen Sie es erneut.",
                apiUnreachable:
                  "Ein technischer Fehler ist aufgetreten. Unser System arbeitet bereits an der Lösung. Bitte versuchen Sie es in Kürze erneut.",
                invalidUserStartCoordinates:
                  "Ungültiges Koordinatenformat für den Startort des Benutzers. Bitte 'lat,lon' verwenden.",
                geocodeUserStartFailed:
                  "Der Startort des Benutzers konnte nicht identifiziert werden.",
                unsupportedUserStartType:
                  "Ungültiger Ortstyp für den Startort des Benutzers.",
                invalidActivityStartCoordinates:
                  "Ungültiges Koordinatenformat für den Startort der Aktivität. Bitte 'lat,lon' verwenden.",
                geocodeActivityStartFailed:
                  "Der Startort der Aktivität konnte nicht identifiziert werden.",
                unsupportedActivityStartType:
                  "Ungültiger Ortstyp für den Start der Aktivität.",
                invalidActivityEndCoordinates:
                  "Ungültiges Koordinatenformat für den Endort der Aktivität. Bitte 'lat,lon' verwenden.",
                geocodeActivityEndFailed:
                  "Der Endort der Aktivität konnte nicht identifiziert werden.",
                unsupportedActivityEndType:
                  "Ungültiger Ortstyp für das Ende der Aktivität.",
                noToConnectionsFound:
                  "Keine passenden Verbindungen zur Aktivität gefunden.",
                noFromConnectionsFound:
                  "Keine passenden Verbindungen von der Aktivität gefunden.",
                noFromConnectionsFoundFallback:
                  "Heute wurden keine passenden Rückverbindungen gefunden, auch nicht bei späterer Suche.",
                noFromConnectionsFoundFallbackNotToday:
                  "Für das gewählte Datum wurden keine passenden Rückverbindungen gefunden, auch nicht bei späterer Suche.",
                toConnectionsNoScore:
                  "Verbindungen zur Aktivität gefunden, aber keine entsprach den Qualitätskriterien.",
                fromConnectionsNoScore:
                  "Verbindungen von der Aktivität gefunden, aber keine entsprach den Qualitätskriterien.",
                noToConnectionsMergingMightFail:
                  "Keine passenden Verbindungen für die Hinfahrt zur Aktivität gefunden.",
                noFromConnectionsMergingMightFail:
                  "Keine passenden Verbindungen für die Rückfahrt von der Aktivität gefunden.",
                noToConnectionsMergingFailed:
                  "Es konnten keine Verbindungen für die Hinfahrt zur Aktivität gefunden werden.",
                noFromConnectionsMergingFailed:
                  "Es konnten keine Verbindungen für die Rückfahrt von der Aktivität gefunden werden.",
                noToConnectionsTimeWindow:
                  "Im angegebenen Zeitfenster wurden keine Verbindungen zur Aktivität gefunden.",
                noFromConnectionsTimeWindow:
                  "Im angegebenen Zeitfenster wurden keine Verbindungen von der Aktivität gefunden.",
                noToConnectionsAfterCurrentTime:
                  "Heute sind keine Verbindungen zur Aktivität mehr verfügbar. Bitte wählen Sie ein anderes Datum.",
                noToConnectionsFilteredByDuration:
                  "Alle Verbindungen zur Aktivität wurden aufgrund ihrer Dauer herausgefiltert.",
                noFromConnectionsFilteredByDuration:
                  "Alle Verbindungen von der Aktivität wurden aufgrund ihrer Dauer herausgefiltert.",
                noReturnConnectionMatchingIncoming:
                  "Rückverbindungen gefunden, aber keine Hinfahrt kommt früh genug für die späteste Rückfahrt an. Passen Sie die Aktivitätsdauer oder -zeiten an.",
                reverseGeocodeParameterMissing:
                  "Breiten- und Längengrad-Parameter sind erforderlich.",
                sharedLinkInvalid:
                  "Dieser geteilte Link ist ungültig oder abgelaufen.",
                monthlyQuotaExceeded:
                  "Das monatliche Nutzungslimit für diese Funktion wurde erreicht.",
                noConnectionsFound:
                  "Leider konnten für Ihre Anfrage keine Verbindungen gefunden werden. Bitte versuchen Sie andere Orte, Daten oder Zeiten.",
                invalidDataReceived:
                  "Ungültige Daten vom Server empfangen. Bitte versuchen Sie es erneut.",
                unknown:
                  "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
              },
            },
            debug: {
              showDetails: "Debug-Details anzeigen",
              hideDetails: "Debug-Details ausblenden",
            },
            months: [
              "Jan",
              "Feb",
              "Mär",
              "Apr",
              "Mai",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Okt",
              "Nov",
              "Dez",
            ],
            shortDays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
            ariaLabels: {
              topSlider: "Verfügbare Zeitfenster zur Aktivität",
              bottomSlider: "Verfügbare Rückreisezeitfenster von der Aktivität",
              searchButton: "Verbindungen suchen",
              backButton: "Zurück zum Suchformular",
              previousMonthButton: "Vorheriger Monat",
              nextMonthButton: "Nächster Monat",
              menuButton: "Menü öffnen",
              menuHeading: "Seitenmenü",
              closeButton: "Schließen",
              shareButton: "Reise teilen",
            },
            waiting: {
              beforeActivity: "Warten auf den Beginn der Aktivität",
              afterActivity: "Warten nach dem Ende der Aktivität",
              title: "Wartezeit",
            },
            vehicles: {
              1: "Zug",
              2: "Bus",
              3: "Straßenbahn",
              4: "U-Bahn",
              5: "Einschienenbahn",
              6: "Zahnradbahn",
              7: "Standseilbahn",
              8: "Seilbahn",
              9: "Fähre",
              10: "Taxi",
              20: "Verschiedenes",
              30: "Haus",
              31: "Straße",
              32: "Platz",
              33: "Park",
              WALK: "Fußweg",
              TRSF: "Umstieg",
            },
            alert: { label: "Hinweis" },
          },
          ES: {
            origin: "Origen",
            enterOrigin: "Introducir origen",
            destination: "Destino",
            activityDate: "Fecha de la actividad",
            activityStartDateLabel: "Fecha de inicio",
            activityEndDateLabel: "Fecha de fin",
            search: "Buscar",
            selectDate: "Seleccionar",
            datePickerTitle: "Seleccionar fecha de la actividad",
            apply: "Aplicar",
            cancel: "Cancelar",
            back: "Atrás",
            reloadPage: "Recargar página",
            journeyToActivity: "Viaje de ida",
            journeyFromActivity: "Viaje de vuelta",
            selectTimeSlotForSummary:
              "Seleccione una franja horaria para ver el resumen del viaje.",
            loadingConnectionsI: "Cargando conexiones de ida...",
            loadingConnectionsO: "Cargando conexiones de vuelta...",
            loadingStateSearching: "Buscando...",
            loadingStateToActivity: "Cargando conexiones a la actividad...",
            loadingStateFromActivity:
              "Cargando conexiones desde la actividad...",
            noConnections: "No hay detalles de conexión disponibles.",
            anytime: "Cualquier momento",
            anytimeLeaveBy: "Salir a más tardar a las {time}",
            anytimeWalkTo: "Caminar hasta {destination}",
            transfers: "Transbordos",
            stopSg: "Parada",
            stopPl: "Paradas",
            daySg: "Día",
            dayPl: "Días",
            nightSg: "noche",
            nightPl: "noches",
            durationHoursShort: "h",
            durationHoursLong: "horas",
            durationMinutesShort: "min",
            durationMinutesLong: "minutos",
            durationTransferTime: "Tiempo de transbordo",
            activityStart: "Inicio",
            activityEnd: "Fin",
            activityDuration: "Duración",
            dateRangeLabel: "Rango de fechas",
            noConnectionDetails: "No hay detalles de conexión disponibles.",
            noConnectionElements: "No hay elementos de conexión disponibles.",
            selectTimeSlot: "Por favor, seleccione una franja horaria.",
            useCurrentLocation: "Usar ubicación actual",
            clearInput: "Borrar entrada",
            selectDateRange: "Seleccionar rango de fechas",
            today: "Hoy",
            tomorrow: "Mañana",
            otherDate: "Otra fecha",
            share: "Compartir",
            shareUrlCopied: "¡URL para compartir copiada al portapapeles!",
            shareUrlCopyFailed: "No se pudo copiar la URL.",
            live: "En vivo",
            liveConnection: "Conexión en vivo",
            platform: "Andén",
            direction: "Dirección",
            buyTicket: "Comprar billete",
            menu: {
              helpAndSupport: "Ayuda",
              helpAndSupportSubtitle: "Preguntas frecuentes y guías.",
              imprint: "Aviso legal",
            },
            warnings: {
              earlyStart:
                "Advertencia: ¡Llegada anterior a la hora de inicio recomendada!",
              lateEnd:
                "Advertencia: ¡Salida posterior a la hora de finalización recomendada!",
              duration:
                "Advertencia: Duración de la actividad por debajo de la recomendada.",
              durationShort: "Duración demasiado corta",
              durationShorter: "más corto de lo recomendado",
              durationLonger: "más largo de lo recomendado",
            },
            infos: {
              originRequired: "Por favor, introduzca un lugar de origen.",
              dateRequired: "Por favor, seleccione una fecha.",
              endDateRequired: "Por favor, seleccione una fecha de fin.",
              fetchingLocation: "Obteniendo su ubicación...",
              fetchingAddress: "Buscando dirección...",
              endDateAfterStartDate:
                "La fecha de fin debe ser igual o posterior a la fecha de inicio.",
              sharedDateInPast:
                "Este viaje compartido es para una fecha en el pasado. Por favor, seleccione una nueva fecha para encontrar conexiones actuales.",
              sharedDateDurationMismatch:
                "Las fechas de este viaje compartido no coinciden. Por favor, seleccione nuevas fechas de inicio y fin para encontrar conexiones actuales.",
              shareLinkInvalid:
                "Este enlace compartido no es válido o ha caducado.",
            },
            errors: {
              sessionExpired:
                "Su sesión ha caducado. Por favor, recargue la página para continuar.",
              connectionError:
                "No se pudieron cargar los datos de conexión. Por favor, inténtelo de nuevo.",
              suggestionError:
                "No se pudieron cargar las sugerencias. Por favor, inténtelo de nuevo.",
              activityTimeError:
                "No se pudieron calcular los horarios de la actividad. Por favor, inténtelo de nuevo.",
              reverseGeocodeNoResults:
                "No se encontró ninguna dirección para su ubicación.",
              geolocationError: "Falló la geolocalización.",
              geolocationNotSupported:
                "La geolocalización no es compatible con su navegador.",
              geolocationPermissionDenied:
                "Se denegó el permiso para acceder a la ubicación.",
              geolocationPositionUnavailable:
                "La información de ubicación no está disponible.",
              geolocationTimeout:
                "La solicitud para obtener la ubicación del usuario ha caducado.",
              shareLinkInvalidExpired:
                "El enlace compartido no es válido o ha caducado.",
              shareLinkCreateFailed:
                "No se pudo crear el enlace para compartir.",
              shareLinkErrorTitle: "No se pudo cargar este viaje compartido.",
              widgetLoadErrorTitle: "No se pudo cargar el widget.",
              api: {
                internalError:
                  "¡Uy! Algo salió mal de nuestro lado. Nuestro equipo ha sido notificado y está trabajando en una solución. Por favor, inténtelo de nuevo en unos momentos.",
                queryParamMissing: "Falta el parámetro de consulta 'q'.",
                invalidLimitParam: "Parámetro de límite no válido.",
                networkError:
                  "Sin conexión a Internet. Por favor, compruebe su red e inténtelo de nuevo.",
                apiUnreachable:
                  "Ha ocurrido un error técnico. Nuestro sistema ya está trabajando en la solución. Por favor, inténtelo de nuevo en breve.",
                invalidUserStartCoordinates:
                  "Formato de coordenadas no válido para la ubicación de inicio del usuario. Use 'lat,lon'.",
                geocodeUserStartFailed:
                  "No se pudo identificar la ubicación de inicio del usuario.",
                unsupportedUserStartType:
                  "Tipo de ubicación no compatible para el inicio del usuario.",
                invalidActivityStartCoordinates:
                  "Formato de coordenadas no válido para la ubicación de inicio de la actividad. Use 'lat,lon'.",
                geocodeActivityStartFailed:
                  "No se pudo identificar la ubicación de inicio de la actividad.",
                unsupportedActivityStartType:
                  "Tipo de ubicación no compatible para el inicio de la actividad.",
                invalidActivityEndCoordinates:
                  "Formato de coordenadas no válido para la ubicación final de la actividad. Use 'lat,lon'.",
                geocodeActivityEndFailed:
                  "No se pudo identificar la ubicación final de la actividad.",
                unsupportedActivityEndType:
                  "Tipo de ubicación no compatible para el final de la actividad.",
                noToConnectionsFound:
                  "No se encontraron conexiones adecuadas a la actividad.",
                noFromConnectionsFound:
                  "No se encontraron conexiones adecuadas desde la actividad.",
                noFromConnectionsFoundFallback:
                  "No se encontraron conexiones de vuelta adecuadas para hoy, incluso después de intentar opciones más tardías.",
                noFromConnectionsFoundFallbackNotToday:
                  "No se encontraron conexiones de vuelta adecuadas para la fecha seleccionada, incluso después de intentar opciones más tardías.",
                toConnectionsNoScore:
                  "Se encontraron conexiones a la actividad, pero ninguna cumplió con los criterios de calidad.",
                fromConnectionsNoScore:
                  "Se encontraron conexiones desde la actividad, pero ninguna cumplió con los criterios de calidad.",
                noToConnectionsMergingMightFail:
                  "No se encontraron conexiones adecuadas para el viaje a la actividad.",
                noFromConnectionsMergingMightFail:
                  "No se encontraron conexiones adecuadas para el viaje desde la actividad.",
                noToConnectionsMergingFailed:
                  "No se pudieron encontrar conexiones para el viaje a la actividad.",
                noFromConnectionsMergingFailed:
                  "No se pudieron encontrar conexiones para el viaje desde la actividad.",
                noToConnectionsTimeWindow:
                  "No se encontraron conexiones a la actividad dentro del intervalo de tiempo especificado.",
                noFromConnectionsTimeWindow:
                  "No se encontraron conexiones desde la actividad dentro del intervalo de tiempo especificado.",
                noToConnectionsAfterCurrentTime:
                  "No hay más conexiones a la actividad disponibles hoy. Por favor, elija otra fecha.",
                noToConnectionsFilteredByDuration:
                  "Todas las conexiones a la actividad se filtraron debido a su duración.",
                noFromConnectionsFilteredByDuration:
                  "Todas las conexiones desde la actividad se filtraron debido a su duración.",
                noReturnConnectionMatchingIncoming:
                  "Se encontraron conexiones de vuelta, pero ningún viaje de ida llega lo suficientemente temprano para la última vuelta. Intente ajustar los horarios o la duración de la actividad.",
                reverseGeocodeParameterMissing:
                  "Se requieren los parámetros de latitud y longitud.",
                sharedLinkInvalid:
                  "Este enlace compartido no es válido o ha caducado.",
                monthlyQuotaExceeded:
                  "Se ha alcanzado el límite de uso mensual para esta función.",
                noConnectionsFound:
                  "Lamentablemente, no se pudieron encontrar conexiones para su solicitud. Por favor, intente con diferentes ubicaciones, fechas u horas.",
                invalidDataReceived:
                  "Se recibieron datos no válidos del servidor. Por favor, inténtelo de nuevo.",
                unknown:
                  "Ocurrió un error inesperado. Por favor, inténtelo de nuevo.",
              },
            },
            debug: {
              showDetails: "Mostrar detalles de depuración",
              hideDetails: "Ocultar detalles de depuración",
            },
            months: [
              "Ene",
              "Feb",
              "Mar",
              "Abr",
              "May",
              "Jun",
              "Jul",
              "Ago",
              "Sep",
              "Oct",
              "Nov",
              "Dic",
            ],
            shortDays: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
            ariaLabels: {
              topSlider: "Franjas horarias disponibles para la actividad",
              bottomSlider:
                "Franjas horarias de regreso disponibles desde la actividad",
              searchButton: "Buscar conexiones",
              backButton: "Volver al formulario de búsqueda",
              previousMonthButton: "Mes anterior",
              nextMonthButton: "Mes siguiente",
              menuButton: "Abrir menú",
              menuHeading: "Menú de la página",
              closeButton: "Cerrar",
              shareButton: "Compartir viaje",
            },
            waiting: {
              beforeActivity: "Esperando el inicio de la actividad",
              afterActivity: "Esperando después del fin de la actividad",
              title: "Tiempo de espera",
            },
            vehicles: {
              1: "Tren",
              2: "Autobús",
              3: "Tranvía",
              4: "Metro",
              5: "Monorraíl",
              6: "Tren cremallera",
              7: "Funicular",
              8: "Teleférico",
              9: "Ferry",
              10: "Taxi",
              20: "Misceláneo",
              30: "Casa",
              31: "Calle",
              32: "Plaza",
              33: "Parque",
              WALK: "A pie",
              TRSF: "Transbordo",
            },
            alert: { label: "Alerta" },
          },
          FR: {
            origin: "Lieu de départ",
            enterOrigin: "Entrez le lieu de départ",
            destination: "Destination",
            activityDate: "Date de l'activité",
            activityStartDateLabel: "Date de début",
            activityEndDateLabel: "Date de fin",
            search: "Rechercher",
            selectDate: "Sélectionner",
            datePickerTitle: "Sélectionner la date de l'activité",
            apply: "Appliquer",
            cancel: "Annuler",
            back: "Retour",
            reloadPage: "Recharger la page",
            journeyToActivity: "Aller à l'activité",
            journeyFromActivity: "Retour de l'activité",
            selectTimeSlotForSummary:
              "Sélectionnez un créneau horaire pour voir le résumé du trajet.",
            loadingConnectionsI:
              "Connexions entrantes en cours de chargement...",
            loadingConnectionsO:
              "Connexions sortantes en cours de chargement...",
            loadingStateSearching: "Recherche en cours...",
            loadingStateToActivity:
              "Chargement des connexions vers l'activité...",
            loadingStateFromActivity:
              "Chargement des connexionsDepuis l'activité...",
            noConnections: "Aucun détail de connexion disponible.",
            anytime: "À tout moment",
            anytimeLeaveBy: "Partir au plus tard à {time}",
            anytimeWalkTo: "Marche vers {destination}",
            transfers: "Correspondances",
            stopSg: "Arrêt",
            stopPl: "Arrêts",
            daySg: "Jour",
            dayPl: "Jours",
            nightSg: "nuit",
            nightPl: "nuits",
            durationHoursShort: "h",
            durationHoursLong: "heures",
            durationMinutesShort: "min",
            durationMinutesLong: "minutes",
            durationTransferTime: "Temps de correspondance",
            activityStart: "Début",
            activityEnd: "Fin",
            activityDuration: "Durée",
            dateRangeLabel: "Période",
            noConnectionDetails: "Aucun détail de connexion disponible.",
            noConnectionElements: "Aucun élément de connexion disponible.",
            selectTimeSlot: "Veuillez sélectionner un créneau horaire.",
            useCurrentLocation: "Utiliser la position actuelle",
            clearInput: "Effacer l'entrée",
            selectDateRange: "Sélectionner la plage de dates",
            today: "Aujourd'hui",
            tomorrow: "Demain",
            otherDate: "Autre date",
            share: "Partager",
            shareUrlCopied: "URL de partage copiée dans le presse-papiers !",
            shareUrlCopyFailed: "Impossible de copier l'URL.",
            live: "En direct",
            liveConnection: "Connexion en direct",
            platform: "Quai",
            direction: "Direction",
            buyTicket: "Acheter un billet",
            menu: {
              helpAndSupport: "Aide",
              helpAndSupportSubtitle: "Trouver des réponses et des guides.",
              imprint: "Mentions légales",
            },
            warnings: {
              earlyStart:
                "Avertissement : Arrivée plus tôt que l'heure de début d'activité recommandée !",
              lateEnd:
                "Avertissement : Départ plus tard que l'heure de fin d'activité recommandée !",
              duration:
                "Avertissement : Durée de l'activité inférieure à la recommandation.",
              durationShort: "Durée trop courte",
              durationShorter: "plus court que recommandé",
              durationLonger: "plus long que recommandé",
            },
            infos: {
              originRequired: "Veuillez entrer un lieu de départ.",
              dateRequired: "Veuillez sélectionner une date.",
              endDateRequired: "Veuillez sélectionner une date de fin.",
              fetchingLocation: "Récupération de votre position...",
              fetchingAddress: "Recherche de l'adresse...",
              endDateAfterStartDate:
                "La date de fin doit être égale ou postérieure à la date de début.",
              sharedDateInPast:
                "Ce trajet partagé concerne une date passée. Veuillez sélectionner une nouvelle date pour trouver les connexions actuelles.",
              sharedDateDurationMismatch:
                "Les dates de ce trajet partagé ne correspondent pas. Veuillez sélectionner de nouvelles dates de début et de fin pour trouver les connexions actuelles.",
              shareLinkInvalid: "Ce lien partagé est invalide ou a expiré.",
            },
            errors: {
              sessionExpired:
                "Votre session a expiré. Veuillez recharger la page pour continuer.",
              connectionError:
                "Échec du chargement des données de connexion. Veuillez réessayer.",
              suggestionError:
                "Échec du chargement des suggestions. Veuillez réessayer.",
              activityTimeError:
                "Échec du calcul des heures d'activité. Veuillez réessayer.",
              geolocationError: "Échec de la géolocalisation.",
              geolocationNotSupported:
                "La géolocalisation n'est pas prise en charge par votre navigateur.",
              geolocationPermissionDenied:
                "L'accès à la position a été refusé.",
              geolocationPositionUnavailable:
                "Les informations de position ne sont pas disponibles.",
              geolocationTimeout: "La demande de géolocalisation a expiré.",
              reverseGeocodeNoResults:
                "Aucune adresse trouvée pour votre position.",
              shareLinkInvalidExpired:
                "Le lien partagé est invalide ou a expiré.",
              shareLinkCreateFailed: "Échec de la création du lien de partage.",
              shareLinkErrorTitle: "Échec du chargement de ce trajet partagé",
              widgetLoadErrorTitle: "Le widget n'a pas pu être chargé.",
              api: {
                internalError:
                  "Oups ! Un problème est survenu de notre côté. Notre équipe a été notifiée et travaille sur une solution. Veuillez réessayer dans quelques instants.",
                queryParamMissing: "Le paramètre de requête 'q' est manquant.",
                invalidLimitParam: "Paramètre de limite invalide.",
                networkError:
                  "Pas de connexion internet. Veuillez vérifier votre réseau et réessayer.",
                apiUnreachable:
                  "Une erreur technique est survenue. Notre système travaille déjà à sa résolution. Veuillez réessayer sous peu.",
                invalidUserStartCoordinates:
                  "Format de coordonnées invalide pour l'emplacement de départ de l'utilisateur. Veuillez utiliser 'lat,lon'.",
                geocodeUserStartFailed:
                  "Impossible d'identifier l'emplacement de départ de l'utilisateur.",
                unsupportedUserStartType:
                  "Type d'emplacement non pris en charge pour le départ de l'utilisateur.",
                invalidActivityStartCoordinates:
                  "Format de coordonnées invalide pour l'emplacement de début de l'activité. Veuillez utiliser 'lat,lon'.",
                geocodeActivityStartFailed:
                  "Impossible d'identifier l'emplacement de début de l'activité.",
                unsupportedActivityStartType:
                  "Type d'emplacement non pris en charge pour le début de l'activité.",
                invalidActivityEndCoordinates:
                  "Format de coordonnées invalide pour l'emplacement de fin de l'activité. Veuillez utiliser 'lat,lon'.",
                geocodeActivityEndFailed:
                  "Impossible d'identifier l'emplacement de fin de l'activité.",
                unsupportedActivityEndType:
                  "Type d'emplacement non pris en charge pour la fin de l'activité.",
                noToConnectionsFound:
                  "Aucune connexion appropriée vers l'activité n'a été trouvée.",
                noFromConnectionsFound:
                  "Aucune connexion appropriéeDepuis l'activité n'a été trouvée.",
                noFromConnectionsFoundFallback:
                  "Aucune connexion de retour appropriée n'a été trouvée pour aujourd'hui, même en essayant des options plus tardives.",
                noFromConnectionsFoundFallbackNotToday:
                  "Aucune connexion de retour appropriée n'a été trouvée pour la date sélectionnée, même en essayant des options plus tardives.",
                toConnectionsNoScore:
                  "Des connexions vers l'activité ont été trouvées, mais aucune ne répondait aux critères de qualité.",
                fromConnectionsNoScore:
                  "Des connexionsDepuis l'activité ont été trouvées, mais aucune ne répondait aux critères de qualité.",
                noToConnectionsMergingMightFail:
                  "Aucune connexion appropriée n'a été trouvée pour le trajet vers l'activité.",
                noFromConnectionsMergingMightFail:
                  "Aucune connexion appropriée n'a été trouvée pour le trajetDepuis l'activité.",
                noToConnectionsMergingFailed:
                  "Impossible de trouver des connexions pour le trajet vers l'activité.",
                noFromConnectionsMergingFailed:
                  "Impossible de trouver des connexions pour le trajetDepuis l'activité.",
                noToConnectionsTimeWindow:
                  "Aucune connexion vers l'activité n'a été trouvée dans le créneau horaire spécifié.",
                noFromConnectionsTimeWindow:
                  "Aucune connexionDepuis l'activité n'a été trouvée dans le créneau horaire spécifié.",
                noToConnectionsAfterCurrentTime:
                  "Plus aucune connexion vers l'activité n'est disponible aujourd'hui. Veuillez choisir une autre date.",
                noToConnectionsFilteredByDuration:
                  "Toutes les connexions vers l'activité ont été filtrées en raison de leur durée.",
                noFromConnectionsFilteredByDuration:
                  "Toutes les connexionsDepuis l'activité ont été filtrées en raison de leur durée.",
                noReturnConnectionMatchingIncoming:
                  "Des connexions de retour ont été trouvées, mais aucun trajet aller n'arrive assez tôt pour le dernier retour. Essayez d'ajuster les heures ou la durée de l'activité.",
                reverseGeocodeParameterMissing:
                  "Les paramètres de latitude et de longitude sont requis.",
                sharedLinkInvalid: "Ce lien partagé est invalide ou a expiré.",
                monthlyQuotaExceeded:
                  "La limite d'utilisation mensuelle de cette fonctionnalité a été atteinte.",
                noConnectionsFound:
                  "Malheureusement, aucune connexion n'a pu être trouvée pour votre demande. Veuillez essayer d'autres lieux, dates ou heures.",
                invalidDataReceived:
                  "Données invalides reçues du serveur. Veuillez réessayer.",
                unknown:
                  "Une erreur inattendue est survenue. Veuillez réessayer.",
              },
            },
            debug: {
              showDetails: "Afficher les détails de débogage",
              hideDetails: "Masquer les détails de débogage",
            },
            months: [
              "Jan",
              "Fév",
              "Mar",
              "Avr",
              "Mai",
              "Juin",
              "Juil",
              "Août",
              "Sep",
              "Oct",
              "Nov",
              "Déc",
            ],
            shortDays: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
            ariaLabels: {
              topSlider: "Créneaux horaires disponibles pour l'activité",
              bottomSlider:
                "Créneaux horaires de retour disponiblesDepuis l'activité",
              searchButton: "Rechercher des connexions",
              backButton: "Retour au formulaire de recherche",
              previousMonthButton: "Mois précédent",
              nextMonthButton: "Mois suivant",
              menuButton: "Ouvrir le menu",
              menuHeading: "Menu de la page",
              closeButton: "Fermer",
              shareButton: "Partager le trajet",
            },
            waiting: {
              beforeActivity: "En attente du début de l'activité",
              afterActivity: "En attente après la fin de l'activité",
              title: "Temps d'attente",
            },
            vehicles: {
              1: "Train",
              2: "Bus",
              3: "Tramway",
              4: "Métro",
              5: "Monorail",
              6: "Crémaillère",
              7: "Funiculaire",
              8: "Téléporté",
              9: "Ferry",
              10: "Taxi",
              20: "Différents",
              30: "Maison",
              31: "Rue",
              32: "Place",
              33: "Parc",
              WALK: "À pied",
              TRSF: "Correspondance",
            },
            alert: { label: "Alerte" },
          },
          IT: {
            origin: "Luogo di partenza",
            enterOrigin: "Inserisci luogo di partenza",
            destination: "Destinazione",
            activityDate: "Data attività",
            activityStartDateLabel: "Data di inizio",
            activityEndDateLabel: "Data di fine",
            search: "Cerca",
            selectDate: "Seleziona",
            datePickerTitle: "Seleziona data attività",
            apply: "Applica",
            cancel: "Annulla",
            back: "Indietro",
            reloadPage: "Ricarica pagina",
            journeyToActivity: "Andata all'attività",
            journeyFromActivity: "Ritorno dall'attività",
            selectTimeSlotForSummary:
              "Seleziona una fascia oraria per visualizzare il riepilogo del viaggio.",
            loadingConnectionsI: "Connessioni in arrivo in caricamento...",
            loadingConnectionsO: "Connessioni in uscita in caricamento...",
            loadingStateSearching: "Ricerca in corso...",
            loadingStateToActivity: "Caricamento connessioni per l'attività...",
            loadingStateFromActivity:
              "Caricamento connessioni dall'attività...",
            noConnections: "Nessun dettaglio di connessione disponibile.",
            anytime: "In qualsiasi momento",
            anytimeLeaveBy: "Partire entro le {time}",
            anytimeWalkTo: "Camminare fino a {destination}",
            transfers: "Cambi",
            stopSg: "Fermata",
            stopPl: "Fermate",
            daySg: "Giorno",
            dayPl: "Giorni",
            nightSg: "notte",
            nightPl: "notti",
            durationHoursShort: "h",
            durationHoursLong: "ore",
            durationMinutesShort: "min",
            durationMinutesLong: "minuti",
            durationTransferTime: "Tempo di cambio",
            activityStart: "Inizio",
            activityEnd: "Fine",
            activityDuration: "Durata",
            dateRangeLabel: "Intervallo di date",
            noConnectionDetails: "Nessun dettaglio di connessione disponibile.",
            noConnectionElements: "Nessun elemento di connessione disponibile.",
            selectTimeSlot: "Seleziona una fascia oraria.",
            useCurrentLocation: "Usa posizione attuale",
            clearInput: "Cancella input",
            selectDateRange: "Seleziona intervallo di date",
            today: "Oggi",
            tomorrow: "Domani",
            otherDate: "Altra data",
            share: "Condividi",
            shareUrlCopied: "URL di condivisione copiato negli appunti!",
            shareUrlCopyFailed: "Impossibile copiare l'URL.",
            live: "Dal vivo",
            liveConnection: "Connessione dal vivo",
            platform: "Binario",
            direction: "Direzione",
            buyTicket: "Compra biglietto",
            menu: {
              helpAndSupport: "Aiuto",
              helpAndSupportSubtitle: "Trova risposte e guide.",
              imprint: "Avviso legale",
            },
            warnings: {
              earlyStart:
                "Attenzione: Arrivo in anticipo rispetto all'orario di inizio attività consigliato!",
              lateEnd:
                "Attenzione: Partenza in ritardo rispetto all'orario di fine attività consigliato!",
              duration: "Attenzione: Durata attività inferiore al consigliato.",
              durationShort: "Durata troppo breve",
              durationShorter: "più breve del consigliato",
              durationLonger: "più lungo del consigliato",
            },
            infos: {
              originRequired: "Si prega di inserire un luogo di partenza.",
              dateRequired: "Si prega di selezionare una data.",
              endDateRequired: "Si prega di selezionare una data di fine.",
              fetchingLocation: "Recupero della posizione in corso...",
              fetchingAddress: "Ricerca indirizzo in corso...",
              endDateAfterStartDate:
                "La data di fine deve essere uguale o successiva alla data di inizio.",
              sharedDateInPast:
                "Questo viaggio condiviso si riferisce a una data passata. Si prega di selezionare una nuova data per trovare le connessioni attuali.",
              sharedDateDurationMismatch:
                "Le date di questo viaggio condiviso non corrispondono. Si prega di selezionare nuove date di inizio e fine per trovare le connessioni attuali.",
              shareLinkInvalid:
                "Questo link condiviso non è valido o è scaduto.",
            },
            errors: {
              sessionExpired:
                "La sessione è scaduta. Si prega di ricaricare la pagina per continuare.",
              connectionError:
                "Impossibile caricare i dati di connessione. Riprova.",
              suggestionError: "Impossibile caricare i suggerimenti. Riprova.",
              activityTimeError:
                "Impossibile calcolare gli orari dell'attività. Riprova.",
              geolocationError: "Geolocalizzazione fallita.",
              geolocationNotSupported:
                "La geolocalizzazione non è supportata dal tuo browser.",
              geolocationPermissionDenied: "Accesso alla posizione negato.",
              geolocationPositionUnavailable:
                "Informazioni sulla posizione non disponibili.",
              geolocationTimeout:
                "La richiesta di geolocalizzazione è scaduta.",
              reverseGeocodeNoResults:
                "Nessun indirizzo trovato per la tua posizione.",
              shareLinkInvalidExpired:
                "Il link condiviso non è valido o è scaduto.",
              shareLinkCreateFailed:
                "Impossibile creare il link di condivisione.",
              shareLinkErrorTitle: "Caricamento dei dati condivisi fallito",
              widgetLoadErrorTitle: "Impossibile caricare il widget.",
              api: {
                internalError:
                  "Ops! Qualcosa è andato storto da parte nostra. Il nostro team è stato avvisato e sta lavorando a una soluzione. Riprova tra qualche istante.",
                queryParamMissing: "Parametro di query 'q' mancante.",
                invalidLimitParam: "Parametro limite non valido.",
                networkError:
                  "Nessuna connessione internet. Controlla la tua rete e riprova.",
                apiUnreachable:
                  "Si è verificato un errore tecnico. Il nostro sistema sta già lavorando alla soluzione. La preghiamo di riprovare a breve.",
                invalidUserStartCoordinates:
                  "Formato coordinate non valido per la posizione di partenza dell'utente. Utilizzare 'lat,lon'.",
                geocodeUserStartFailed:
                  "Impossibile identificare la posizione di partenza dell'utente.",
                unsupportedUserStartType:
                  "Tipo di posizione non supportato per la partenza dell'utente.",
                invalidActivityStartCoordinates:
                  "Formato coordinate non valido per la posizione di inizio attività. Utilizzare 'lat,lon'.",
                geocodeActivityStartFailed:
                  "Impossibile identificare la posizione di inizio attività.",
                unsupportedActivityStartType:
                  "Tipo di posizione non supportato per l'inizio attività.",
                invalidActivityEndCoordinates:
                  "Formato coordinate non valido per la posizione di fine attività. Utilizzare 'lat,lon'.",
                geocodeActivityEndFailed:
                  "Impossibile identificare la posizione di fine attività.",
                unsupportedActivityEndType:
                  "Tipo di posizione non supportato per la fine attività.",
                noToConnectionsFound:
                  "Nessuna connessione idonea trovata per l'attività.",
                noFromConnectionsFound:
                  "Nessuna connessione idonea trovata dall'attività.",
                noFromConnectionsFoundFallback:
                  "Nessuna connessione di ritorno idonea trovata per oggi, anche provando opzioni successive.",
                noFromConnectionsFoundFallbackNotToday:
                  "Nessuna connessione di ritorno idonea trovata per la data selezionata, anche provando opzioni successive.",
                toConnectionsNoScore:
                  "Connessioni all'attività trovate, ma nessuna ha soddisfatto i criteri di qualità.",
                fromConnectionsNoScore:
                  "Connessioni dall'attività trovate, ma nessuna ha soddisfatto i criteri di qualità.",
                noToConnectionsMergingMightFail:
                  "Nessuna connessione idonea trovata per il viaggio verso l'attività.",
                noFromConnectionsMergingMightFail:
                  "Nessuna connessione idonea trovata per il viaggio dall'attività.",
                noToConnectionsMergingFailed:
                  "Impossibile trovare connessioni per il viaggio verso l'attività.",
                noFromConnectionsMergingFailed:
                  "Impossibile trovare connessioni per il viaggio dall'attività.",
                noToConnectionsTimeWindow:
                  "Nessuna connessione all'attività trovata nell'intervallo di tempo specificato.",
                noFromConnectionsTimeWindow:
                  "Nessuna connessione dall'attività trovata nell'intervallo di tempo specificato.",
                noToConnectionsAfterCurrentTime:
                  "Nessuna altra connessione all'attività disponibile per oggi. Seleziona un'altra data.",
                noToConnectionsFilteredByDuration:
                  "Tutte le connessioni all'attività sono state filtrate a causa della loro durata.",
                noFromConnectionsFilteredByDuration:
                  "Tutte le connessioni dall'attività sono state filtrate a causa della loro durata.",
                noReturnConnectionMatchingIncoming:
                  "Connessioni di ritorno trovate, ma nessun viaggio di andata arriva abbastanza presto per l'ultimo ritorno. Prova a modificare gli orari o la durata dell'attività.",
                reverseGeocodeParameterMissing:
                  "I parametri di latitudine e longitudine sono obbligatori.",
                sharedLinkInvalid:
                  "Questo link condiviso non è valido o è scaduto.",
                monthlyQuotaExceeded:
                  "È stato raggiunto il limite di utilizzo mensile per questa funzione.",
                noConnectionsFound:
                  "Purtroppo, nessuna connessione è stata trovata per la tua richiesta. Prova luoghi, date o orari diversi.",
                invalidDataReceived:
                  "Dati non validi ricevuti dal server. Riprova.",
                unknown: "Si è verificato un errore imprevisto. Riprova.",
              },
            },
            debug: {
              showDetails: "Mostra dettagli di debug",
              hideDetails: "Nascondi dettagli di debug",
            },
            months: [
              "Gen",
              "Feb",
              "Mar",
              "Apr",
              "Mag",
              "Giu",
              "Lug",
              "Ago",
              "Set",
              "Ott",
              "Nov",
              "Dic",
            ],
            shortDays: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
            ariaLabels: {
              topSlider: "Fasce orarie disponibili per l'attività",
              bottomSlider: "Fasce orarie di ritorno disponibili dall'attività",
              searchButton: "Cerca connessioni",
              backButton: "Torna al modulo di ricerca",
              previousMonthButton: "Mese precedente",
              nextMonthButton: "Mese successivo",
              menuButton: "Apri menu",
              menuHeading: "Menu pagina",
              closeButton: "Chiudi",
              shareButton: "Condividi viaggio",
            },
            waiting: {
              beforeActivity: "In attesa dell'inizio dell'attività",
              afterActivity: "In attesa dopo la fine dell'attività",
              title: "Tempo di attesa",
            },
            vehicles: {
              1: "Treno",
              2: "Bus",
              3: "Tram",
              4: "Metro",
              5: "Monorotaia",
              6: "Cremagliera",
              7: "Funicolare",
              8: "Funivia",
              9: "Traghetto",
              10: "Taxi",
              20: "Misto",
              30: "Casa",
              31: "Strada",
              32: "Piazza",
              33: "Parco",
              WALK: "A piedi",
              TRSF: "Cambio",
            },
            alert: { label: "Avviso" },
          },
          TH: {
            origin: "จุดเริ่มต้น",
            enterOrigin: "ป้อนจุดเริ่มต้น",
            destination: "ปลายทาง",
            activityDate: "วันที่ของกิจกรรม",
            activityStartDateLabel: "วันที่เริ่มต้น",
            activityEndDateLabel: "วันที่สิ้นสุด",
            search: "ค้นหา",
            selectDate: "เลือก",
            datePickerTitle: "เลือกวันที่ของกิจกรรม",
            apply: "ใช้",
            cancel: "ยกเลิก",
            back: "ย้อนกลับ",
            reloadPage: "โหลดหน้าใหม่",
            journeyToActivity: "การเดินทางไปกิจกรรม",
            journeyFromActivity: "การเดินทางกลับจากกิจกรรม",
            selectTimeSlotForSummary: "เลือกช่วงเวลาเพื่อดูสรุปการเดินทาง",
            loadingConnectionsI: "กำลังโหลดการเชื่อมต่อขาเข้า...",
            loadingConnectionsO: "กำลังโหลดการเชื่อมต่อขาออก...",
            loadingStateSearching: "กำลังค้นหา...",
            loadingStateToActivity: "กำลังโหลดการเชื่อมต่อไปยังกิจกรรม...",
            loadingStateFromActivity: "กำลังโหลดการเชื่อมต่อจากกิจกรรม...",
            noConnections: "ไม่มีรายละเอียดการเชื่อมต่อ",
            anytime: "ทุกเวลา",
            anytimeLeaveBy: "ออกเดินทางภายใน {time}",
            anytimeWalkTo: "เดินไปที่ {destination}",
            transfers: "การเปลี่ยนสาย",
            stopSg: "ป้าย",
            stopPl: "ป้าย",
            daySg: "วัน",
            dayPl: "วัน",
            nightSg: "คืน",
            nightPl: "คืน",
            durationHoursShort: "ชม.",
            durationHoursLong: "ชั่วโมง",
            durationMinutesShort: "นาที",
            durationMinutesLong: "นาที",
            durationTransferTime: "เวลาเปลี่ยนสาย",
            activityStart: "เริ่มต้น",
            activityEnd: "สิ้นสุด",
            activityDuration: "ระยะเวลา",
            dateRangeLabel: "ช่วงวันที่",
            noConnectionDetails: "ไม่มีรายละเอียดการเชื่อมต่อ",
            noConnectionElements: "ไม่มีองค์ประกอบการเชื่อมต่อ",
            selectTimeSlot: "กรุณาเลือกช่วงเวลา",
            useCurrentLocation: "ใช้ตำแหน่งปัจจุบัน",
            clearInput: "ล้างข้อมูล",
            selectDateRange: "เลือกช่วงวันที่",
            today: "วันนี้",
            tomorrow: "พรุ่งนี้",
            otherDate: "วันที่อื่น",
            share: "แชร์",
            shareUrlCopied: "คัดลอก URL สำหรับแชร์ไปยังคลิปบอร์ดแล้ว!",
            shareUrlCopyFailed: "ไม่สามารถคัดลอก URL ได้",
            live: "สด",
            liveConnection: "การเชื่อมต่อสด",
            platform: "ชานชาลา",
            direction: "ทิศทาง",
            buyTicket: "ซื้อตั๋ว",
            menu: {
              helpAndSupport: "ความช่วยเหลือ",
              helpAndSupportSubtitle: "ค้นหาคำตอบและคู่มือ",
              imprint: "ข้อมูลทางกฎหมาย",
            },
            warnings: {
              earlyStart: "คำเตือน: มาถึงเร็วกว่าเวลาเริ่มต้นกิจกรรมที่แนะนำ!",
              lateEnd: "คำเตือน: ออกเดินทางช้ากว่าเวลาสิ้นสุดกิจกรรมที่แนะนำ!",
              duration: "คำเตือน: ระยะเวลากิจกรรมต่ำกว่าที่แนะนำ",
              durationShort: "ระยะเวลาสั้นเกินไป",
              durationShorter: "สั้นกว่าที่แนะนำ",
              durationLonger: "ยาวนานกว่าที่แนะนำ",
            },
            infos: {
              originRequired: "กรุณาป้อนจุดเริ่มต้น",
              dateRequired: "กรุณาเลือกวันที่",
              endDateRequired: "กรุณาเลือกวันที่สิ้นสุด",
              fetchingLocation: "กำลังดึงข้อมูลตำแหน่งของคุณ...",
              fetchingAddress: "กำลังค้นหาที่อยู่...",
              endDateAfterStartDate:
                "วันที่สิ้นสุดต้องเป็นวันเดียวกับหรือหลังวันที่เริ่มต้น",
              sharedDateInPast:
                "การเดินทางที่แชร์นี้เป็นวันที่ในอดีต กรุณาเลือกวันที่ใหม่เพื่อค้นหาการเชื่อมต่อปัจจุบัน",
              sharedDateDurationMismatch:
                "วันที่ของการเดินทางที่แชร์นี้ไม่ตรงกัน กรุณาเลือกวันที่เริ่มต้นและสิ้นสุดใหม่เพื่อค้นหาการเชื่อมต่อปัจจุบัน",
              shareLinkInvalid: "ลิงก์ที่แชร์นี้ไม่ถูกต้องหรือหมดอายุแล้ว",
            },
            errors: {
              sessionExpired:
                "เซสชันของคุณหมดอายุแล้ว กรุณาโหลดหน้าใหม่เพื่อดำเนินการต่อ",
              connectionError:
                "ไม่สามารถโหลดข้อมูลการเชื่อมต่อได้ กรุณาลองอีกครั้ง",
              suggestionError: "ไม่สามารถโหลดคำแนะนำได้ กรุณาลองอีกครั้ง",
              activityTimeError:
                "ไม่สามารถคำนวณเวลาของกิจกรรมได้ กรุณาลองอีกครั้ง",
              geolocationError: "การระบุตำแหน่งล้มเหลว",
              geolocationNotSupported:
                "เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง",
              geolocationPermissionDenied: "ถูกปฏิเสธการเข้าถึงตำแหน่ง",
              geolocationPositionUnavailable: "ข้อมูลตำแหน่งไม่พร้อมใช้งาน",
              geolocationTimeout: "คำขอระบุตำแหน่งหมดเวลา",
              reverseGeocodeNoResults: "ไม่พบที่อยู่สำหรับตำแหน่งของคุณ",
              shareLinkInvalidExpired: "ลิงก์ที่แชร์ไม่ถูกต้องหรือหมดอายุแล้ว",
              shareLinkCreateFailed: "ไม่สามารถสร้างลิงก์สำหรับแชร์ได้",
              shareLinkErrorTitle: "โหลดการเดินทางที่แชร์นี้ไม่สำเร็จ",
              widgetLoadErrorTitle: "ไม่สามารถโหลดวิดเจ็ตได้",
              api: {
                internalError:
                  "อุ๊ย! เกิดข้อผิดพลาดบางอย่างขึ้นจากฝั่งของเรา ทีมงานของเราได้รับแจ้งและกำลังดำเนินการแก้ไข กรุณาลองอีกครั้งในอีกสักครู่",
                queryParamMissing: "พารามิเตอร์การค้นหา 'q' หายไป",
                invalidLimitParam: "พารามิเตอร์จำกัดไม่ถูกต้อง",
                networkError:
                  "ไม่มีการเชื่อมต่ออินเทอร์เน็ต กรุณาตรวจสอบเครือข่ายของคุณแล้วลองอีกครั้ง",
                apiUnreachable:
                  "เกิดข้อผิดพลาดทางเทคนิค ระบบของเรากำลังดำเนินการแก้ไขอยู่ กรุณาลองใหม่อีกครั้งในอีกสักครู่",
                invalidUserStartCoordinates:
                  "รูปแบบพิกัดไม่ถูกต้องสำหรับตำแหน่งเริ่มต้นของผู้ใช้ กรุณาใช้ 'lat,lon'",
                geocodeUserStartFailed:
                  "ไม่สามารถระบุตำแหน่งเริ่มต้นของผู้ใช้ได้",
                unsupportedUserStartType:
                  "ประเภทตำแหน่งที่ไม่รองรับสำหรับตำแหน่งเริ่มต้นของผู้ใช้",
                invalidActivityStartCoordinates:
                  "รูปแบบพิกัดไม่ถูกต้องสำหรับตำแหน่งเริ่มต้นของกิจกรรม กรุณาใช้ 'lat,lon'",
                geocodeActivityStartFailed:
                  "ไม่สามารถระบุตำแหน่งเริ่มต้นของกิจกรรมได้",
                unsupportedActivityStartType:
                  "ประเภทตำแหน่งที่ไม่รองรับสำหรับตำแหน่งเริ่มต้นของกิจกรรม",
                invalidActivityEndCoordinates:
                  "รูปแบบพิกัดไม่ถูกต้องสำหรับตำแหน่งสิ้นสุดของกิจกรรม กรุณาใช้ 'lat,lon'",
                geocodeActivityEndFailed:
                  "ไม่สามารถระบุตำแหน่งสิ้นสุดของกิจกรรมได้",
                unsupportedActivityEndType:
                  "ประเภทตำแหน่งที่ไม่รองรับสำหรับตำแหน่งสิ้นสุดของกิจกรรม",
                noToConnectionsFound: "ไม่พบการเชื่อมต่อที่เหมาะสมไปยังกิจกรรม",
                noFromConnectionsFound: "ไม่พบการเชื่อมต่อที่เหมาะสมจากกิจกรรม",
                noFromConnectionsFoundFallback:
                  "ไม่พบการเชื่อมต่อขากลับที่เหมาะสมสำหรับวันนี้ แม้จะลองตัวเลือกที่ช้ากว่าแล้วก็ตาม",
                noFromConnectionsFoundFallbackNotToday:
                  "ไม่พบการเชื่อมต่อขากลับที่เหมาะสมสำหรับวันที่เลือก แม้จะลองตัวเลือกที่ช้ากว่าแล้วก็ตาม",
                toConnectionsNoScore:
                  "พบการเชื่อมต่อไปยังกิจกรรม แต่ไม่มีรายการใดตรงตามเกณฑ์คุณภาพ",
                fromConnectionsNoScore:
                  "พบการเชื่อมต่อจากกิจกรรม แต่ไม่มีรายการใดตรงตามเกณฑ์คุณภาพ",
                noToConnectionsMergingMightFail:
                  "ไม่พบการเชื่อมต่อที่เหมาะสมสำหรับการเดินทางไปยังกิจกรรม",
                noFromConnectionsMergingMightFail:
                  "ไม่พบการเชื่อมต่อที่เหมาะสมสำหรับการเดินทางจากกิจกรรม",
                noToConnectionsMergingFailed:
                  "ไม่พบการเชื่อมต่อสำหรับการเดินทางไปยังกิจกรรม",
                noFromConnectionsMergingFailed:
                  "ไม่พบการเชื่อมต่อสำหรับการเดินทางจากกิจกรรม",
                noToConnectionsTimeWindow:
                  "ไม่พบการเชื่อมต่อไปยังกิจกรรมภายในช่วงเวลาที่ระบุ",
                noFromConnectionsTimeWindow:
                  "ไม่พบการเชื่อมต่อจากกิจกรรมภายในช่วงเวลาที่ระบุ",
                noToConnectionsAfterCurrentTime:
                  "ไม่มีการเชื่อมต่อไปยังกิจกรรมในวันนี้อีกแล้ว กรุณาเลือกวันอื่น",
                noToConnectionsFilteredByDuration:
                  "การเชื่อมต่อไปยังกิจกรรมทั้งหมดถูกกรองออกเนื่องจากระยะเวลา",
                noFromConnectionsFilteredByDuration:
                  "การเชื่อมต่อจากกิจกรรมทั้งหมดถูกกรองออกเนื่องจากระยะเวลา",
                noReturnConnectionMatchingIncoming:
                  "พบการเชื่อมต่อขากลับ แต่ไม่มีการเดินทางขาเข้าไปถึงเร็วพอสำหรับการกลับครั้งล่าสุด ลองปรับเวลาหรือระยะเวลาของกิจกรรม",
                reverseGeocodeParameterMissing:
                  "ต้องระบุพารามิเตอร์ละติจูดและลองจิจูด",
                sharedLinkInvalid: "ลิงก์ที่แชร์นี้ไม่ถูกต้องหรือหมดอายุแล้ว",
                monthlyQuotaExceeded:
                  "ถึงขีดจำกัดการใช้งานรายเดือนสำหรับคุณสมบัตินี้แล้ว",
                noConnectionsFound:
                  "ขออภัย ไม่พบการเชื่อมต่อสำหรับคำขอของคุณ กรุณาลองสถานที่ วันที่ หรือเวลาอื่น",
                invalidDataReceived:
                  "ได้รับข้อมูลไม่ถูกต้องจากเซิร์ฟเวอร์ กรุณาลองอีกครั้ง",
                unknown: "เกิดข้อผิดพลาดที่ไม่คาดคิด กรุณาลองอีกครั้ง",
              },
            },
            debug: {
              showDetails: "แสดงรายละเอียดการดีบัก",
              hideDetails: "ซ่อนรายละเอียดการดีบัก",
            },
            months: [
              "ม.ค.",
              "ก.พ.",
              "มี.ค.",
              "เม.ย.",
              "พ.ค.",
              "มิ.ย.",
              "ก.ค.",
              "ส.ค.",
              "ก.ย.",
              "ต.ค.",
              "พ.ย.",
              "ธ.ค.",
            ],
            shortDays: ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."],
            ariaLabels: {
              topSlider: "ช่วงเวลาว่างสำหรับการเดินทางไปกิจกรรม",
              bottomSlider: "ช่วงเวลาว่างสำหรับการเดินทางกลับจากกิจกรรม",
              searchButton: "ค้นหาการเชื่อมต่อ",
              backButton: "กลับไปยังแบบฟอร์มค้นหา",
              previousMonthButton: "เดือนก่อนหน้า",
              nextMonthButton: "เดือนถัดไป",
              menuButton: "เปิดเมนู",
              menuHeading: "เมนูหน้า",
              closeButton: "ปิด",
              shareButton: "แชร์การเดินทาง",
            },
            waiting: {
              beforeActivity: "กำลังรอให้กิจกรรมเริ่มต้น",
              afterActivity: "กำลังรอหลังจากกิจกรรมสิ้นสุด",
              title: "เวลารอ",
            },
            vehicles: {
              1: "รถไฟ",
              2: "รถบัส",
              3: "รถราง",
              4: "รถไฟใต้ดิน",
              5: "รถไฟฟ้ารางเดี่ยว",
              6: "รถไฟขึ้นเขา",
              7: "รถกระเช้าไฟฟ้า",
              8: "กระเช้าลอยฟ้า",
              9: "เรือข้ามฟาก",
              10: "แท็กซี่",
              20: "เบ็ดเตล็ด",
              30: "บ้าน",
              31: "ถนน",
              32: "จัตุรัส",
              33: "สวนสาธารณะ",
              WALK: "เดิน",
              TRSF: "เปลี่ยนรถ",
            },
            alert: { label: "แจ้งเตือน" },
          },
        };
        var g = t(185);
        function r(A, e, t) {
          let i;
          try {
            const o = n.c9.now().setZone(A),
              [g, r, a] = [...e.split(":"), "0", "0"].slice(0, 3).map(Number),
              B = o.set({ hour: g, minute: r, second: a || 0, millisecond: 0 }),
              s = parseInt(String(t), 10);
            let c;
            ((c =
              o > B.minus({ minutes: s, hours: 1 })
                ? o.plus({ days: 1 }).startOf("day").toObject()
                : o.startOf("day").toObject()),
              (i = new Date(Date.UTC(c.year, c.month - 1, c.day))));
          } catch (e) {
            console.error(
              "Error calculating initial start date, defaulting to today:",
              e,
            );
            const t = n.c9.now().setZone(A).startOf("day").toObject();
            i = new Date(Date.UTC(t.year, t.month - 1, t.day));
          }
          return i;
        }
        function a(A, e, t) {
          try {
            const [i, o, g] = [...A.split(":"), "0", "0"]
                .slice(0, 3)
                .map(Number),
              r = new Date(e),
              a = n.c9.fromObject(
                {
                  year: r.getFullYear(),
                  month: r.getMonth() + 1,
                  day: r.getDate(),
                  hour: i,
                  minute: o,
                  second: g || 0,
                },
                { zone: t },
              );
            if (!a.isValid)
              throw new Error(
                `Invalid local time, date, or timezone: ${A}, ${e}, ${t}. Reason: ${a.invalidReason}`,
              );
            return a.toUTC().toFormat("HH:mm:ss");
          } catch (A) {
            return (
              console.error("Error converting local time to UTC:", A),
              "00:00:00"
            );
          }
        }
        function B(A, e, t) {
          try {
            const [i, o, g] = [...A.split(":"), "0", "0"]
                .slice(0, 3)
                .map(Number),
              r = new Date(e),
              a = n.c9.fromObject(
                {
                  year: r.getFullYear(),
                  month: r.getMonth() + 1,
                  day: r.getDate(),
                  hour: i,
                  minute: o,
                  second: g || 0,
                },
                { zone: t },
              );
            if (!a.isValid)
              throw new Error(
                `Invalid local time, date, or timezone for UTC datetime conversion: ${A}, ${e}, ${t}. Reason: ${a.invalidReason}`,
              );
            return a.toUTC().toISO() || "0000-00-00T00:00:00Z";
          } catch (A) {
            return (
              console.error("Error converting local time to UTC datetime:", A),
              "0000-00-00T00:00:00Z"
            );
          }
        }
        function s(A, e, t) {
          try {
            const [i, o, g] = [...A.split(":"), "0", "0"]
                .slice(0, 3)
                .map(Number),
              r = new Date(e),
              a = n.c9.fromObject(
                {
                  year: r.getFullYear(),
                  month: r.getMonth() + 1,
                  day: r.getDate(),
                  hour: i,
                  minute: o,
                  second: g || 0,
                },
                { zone: t },
              );
            if (!a.isValid)
              throw new Error(
                `Invalid config time or timezone for local time conversion: ${A}, ${t}. Reason: ${a.invalidReason}`,
              );
            return a.toFormat("HH:mm");
          } catch (A) {
            return (
              console.error("Error converting config time to local time:", A),
              "--:--"
            );
          }
        }
        function c(A, e) {
          try {
            const t = n.c9.fromISO(A, { zone: "utc" });
            if (!t.isValid)
              throw new Error(
                `Invalid UTC timestamp for local time conversion: ${A}. Reason: ${t.invalidReason}`,
              );
            return t.setZone(e).toFormat("HH:mm");
          } catch (A) {
            return (
              console.error("Error converting UTC to local time:", A),
              "--:--"
            );
          }
        }
        function Q(A, e, t) {
          try {
            const i = n.c9.fromISO(A, { zone: "utc" }),
              o = n.c9.fromISO(e, { zone: "utc" });
            if (!i.isValid || !o.isValid)
              throw new Error(
                `Invalid date format for time difference: ${A} or ${e}`,
              );
            const g = o.diff(i, ["hours", "minutes"]),
              r = Math.floor(g.as("hours")),
              a = Math.round(g.as("minutes")) % 60;
            return 0 === r
              ? `${a} ${t("durationMinutesShort")}`
              : `${r}:${String(a).padStart(2, "0")}${t("durationHoursShort")}`;
          } catch (A) {
            return (
              console.error("Error calculating time difference:", A),
              "--"
            );
          }
        }
        function C(A, e) {
          const t = n.c9.fromISO(A, { zone: "utc" });
          if (!t.isValid)
            throw new Error(`Invalid date format for adding minutes: ${A}`);
          return t.plus({ minutes: e }).toISO() || "";
        }
        function l(A, e, t) {
          try {
            if (!A.isValid || !e.isValid)
              return { text: "--", hours: 0, minutes: 0, totalMinutes: 0 };
            if (e < A) {
              const A = t("errors.endDateBeforeStart");
              return {
                text: ("string" == typeof A ? A : null) || "End before start",
                hours: 0,
                minutes: 0,
                totalMinutes: 0,
              };
            }
            const i = e.diff(A, ["hours", "minutes"]),
              n = Math.round(i.as("minutes")),
              o = Math.floor(n / 60),
              g = n % 60;
            return {
              text:
                o > 0
                  ? `${o}:${String(g).padStart(2, "0")}${t("durationHoursShort")}`
                  : `${g} ${t("durationMinutesShort")}`,
              hours: o,
              minutes: g,
              totalMinutes: n,
            };
          } catch (A) {
            return (
              console.error("Error calculating duration with local dates:", A),
              { text: "--", hours: 0, minutes: 0, totalMinutes: 0 }
            );
          }
        }
        function E(A, e) {
          const t = parseInt(String(A), 10);
          if (isNaN(t) || t < 0) return "--";
          const i = Math.floor(t / 60),
            n = t % 60;
          return i > 0
            ? `${i}:${String(n).padStart(2, "0")}${e("durationHoursShort")}`
            : `${n} ${e("durationMinutesShort")}`;
        }
        function d(A, e = "utc") {
          if (!A || isNaN(A.getTime())) return "";
          try {
            return n.c9.fromJSDate(A).setZone(e).toFormat("yyyy-MM-dd");
          } catch (e) {
            console.error("Error formatting datetime to yyyy-MM-dd:", e);
            const t = A.getUTCFullYear(),
              i = A.getUTCMonth() + 1,
              n = A.getUTCDate();
            return `${t}-${String(i).padStart(2, "0")}-${String(n).padStart(2, "0")}`;
          }
        }
        function w(A, e, t, i = "dd.MM.") {
          try {
            const o = n.c9.fromISO(A, { zone: "utc" }).setZone(e);
            if (!o.isValid)
              return (
                console.warn(`Invalid ISO string for leg date display: ${A}`),
                ""
              );
            const g =
              {
                EN: "en-GB",
                DE: "de-DE",
                FR: "fr-FR",
                IT: "it-IT",
                TH: "th-TH",
                ES: "es-ES",
              }[t.toUpperCase()] || `${t.toLowerCase()}-${t.toUpperCase()}`;
            return o.setLocale(g).toFormat(i);
          } catch (A) {
            return (
              console.error("Error formatting leg date for display:", A),
              ""
            );
          }
        }
        function D(A, e, t) {
          if (A && !isNaN(new Date(A.valueOf()).getTime())) {
            const e = n.c9.fromJSDate(A, { zone: t }).toISODate();
            return n.c9.fromISO(e, { zone: "utc" }).toJSDate();
          }
          return e.startOf("day").toUTC().toJSDate();
        }
        class h {
          constructor(A, e, t, i) {
            ((this.formPage = A),
              (this.resultsPage = e),
              (this.innerContainer = t),
              (this.contentPage = i),
              (this.activePage = null),
              (this.formPage &&
                this.resultsPage &&
                this.innerContainer &&
                this.contentPage) ||
                console.error(
                  "PageManager: One or more page elements are missing. Navigation might not work correctly.",
                ));
          }
          _hideAllPages() {
            (this.formPage && this.formPage.classList.remove("active"),
              this.resultsPage && this.resultsPage.classList.remove("active"),
              this.contentPage && this.contentPage.classList.remove("active"));
          }
          navigateToForm() {
            (this._hideAllPages(),
              this.formPage && this.formPage.classList.add("active"),
              (this.activePage = this.formPage),
              this.innerContainer &&
                (this.innerContainer.style.backgroundColor =
                  "var(--bg-primary)"));
          }
          navigateToResults() {
            (this._hideAllPages(),
              this.resultsPage && this.resultsPage.classList.add("active"),
              (this.activePage = this.resultsPage),
              this.innerContainer &&
                ((this.innerContainer.style.transform = "unset"),
                (this.innerContainer.style.backgroundColor =
                  "var(--bg-secondary)")));
          }
          navigateToContentPage() {
            (this._hideAllPages(),
              this.contentPage && this.contentPage.classList.add("active"),
              this.innerContainer &&
                (this.innerContainer.style.backgroundColor =
                  "var(--bg-primary)"));
          }
          returnToActivePage() {
            (this._hideAllPages(),
              this.activePage === this.resultsPage
                ? this.navigateToResults()
                : this.navigateToForm());
          }
        }
        class I {
          constructor() {}
          async loadTemplate(A, e) {
            try {
              const i = `get${A.charAt(0).toUpperCase() + A.slice(1)}HTML`,
                n = await t(704)(`./${A}`);
              if (n && "function" == typeof n[i]) return n[i](e);
              throw new Error(`Template function '${i}' not found in ${A}`);
            } catch (e) {
              return (
                console.error(`Error loading template module ${A}:`, e),
                `<p style="color: red; padding: 10px;">Error loading template: ${A}. Please check the console for more details.</p>`
              );
            }
          }
        }
        var u = t(933),
          v = t(200);
        class f {
          constructor(A, e, t, i, n, o, g, r) {
            if (
              ((this.inputElement = A),
              (this.displayElement = e),
              (this.widget = i),
              (this.config = i.config),
              (this.t = i.t.bind(i)),
              (this.onDateSelectCallback = n),
              (this.styles = r),
              (this.triggerElement = o),
              (this.anchorElement = g || o),
              (this.selectedDate = t ? new Date(t.valueOf()) : new Date()),
              this.selectedDate && !isNaN(this.selectedDate.getTime()))
            )
              ((this.currentViewMonth = this.selectedDate.getUTCMonth()),
                (this.currentViewYear = this.selectedDate.getUTCFullYear()));
            else {
              const A = new Date();
              ((this.currentViewMonth = A.getUTCMonth()),
                (this.currentViewYear = A.getUTCFullYear()));
            }
            ((this.calendarContainer = null),
              (this.shadowRoot = null),
              (this.calendarContentWrapper = null),
              this._init());
          }
          _init() {
            (this._createCalendarContainer(),
              this._attachEventListeners(),
              this._updateInputElement(),
              this._updateDisplayElement(),
              this._applyTheming());
          }
          _applyTheming() {
            if (!this.widget.container || !this.calendarContentWrapper) return;
            const A = getComputedStyle(this.widget.container);
            [
              "--primary-color",
              "--secondary-color",
              "--success-color",
              "--warning-color",
              "--error-color",
              "--wait-color",
              "--text-primary",
              "--text-secondary",
              "--text-tertiary",
              "--text-muted",
              "--text-disabled",
              "--text-error",
              "--text-info",
              "--text-warning",
              "--icon-input-color",
              "--bg-primary",
              "--bg-secondary",
              "--bg-tertiary",
              "--bg-hover",
              "--bg-error",
              "--bg-info",
              "--bg-transparent",
              "--bg-waiting-block",
              "--border-primary",
              "--border-secondary",
              "--border-tertiary",
              "--border-error",
              "--border-info",
              "--shadow-verylight",
              "--shadow-light",
              "--shadow-medium",
              "--shadow-dark",
              "--shadow-gray",
            ].forEach((e) => {
              const t = A.getPropertyValue(e).trim();
              t &&
                this.calendarContentWrapper &&
                this.calendarContentWrapper.style.setProperty(e, t);
            });
          }
          _createCalendarContainer() {
            const A = `dianaSingleCalendarFor_${this.widget.container?.id ?? "default"}`,
              e = document.getElementById(A);
            (e && e.remove(),
              (this.calendarContainer = document.createElement("div")),
              (this.calendarContainer.id = A),
              (this.calendarContainer.style.position = "absolute"),
              (this.calendarContainer.style.zIndex = "1050"),
              (this.calendarContainer.style.display = "none"),
              document.body.appendChild(this.calendarContainer),
              (this.shadowRoot = this.calendarContainer.attachShadow({
                mode: "open",
              })));
            const t = document.createElement("style");
            ((t.textContent = this.styles),
              this.shadowRoot.appendChild(t),
              (this.calendarContentWrapper = document.createElement("div")),
              (this.calendarContentWrapper.className =
                "diana-container calendar-container"),
              this.shadowRoot.appendChild(this.calendarContentWrapper));
          }
          _render() {
            if (!this.calendarContentWrapper) return;
            const A = new Date(
              this.currentViewYear,
              this.currentViewMonth + 1,
              0,
            ).getDate();
            let e = new Date(
              this.currentViewYear,
              this.currentViewMonth,
              1,
            ).getDay();
            e = 0 === e ? 6 : e - 1;
            const t = this._generateDaysHTML(A, e);
            ((this.calendarContentWrapper.innerHTML = (0,
            u.getSingleCalendarHTML)({
              t: this.t,
              currentViewMonth: this.currentViewMonth,
              currentViewYear: this.currentViewYear,
              daysHTML: t,
            })),
              this._addCalendarInternalEventListeners());
          }
          _generateDaysHTML(A, e) {
            let t = "";
            const i = new Date();
            i.setUTCHours(0, 0, 0, 0);
            for (let A = 0; A < e; A++)
              t += "<div class='calendar-day empty'></div>";
            for (let e = 1; e <= A; e++) {
              const A = new Date(
                  Date.UTC(this.currentViewYear, this.currentViewMonth, e),
                ),
                n =
                  A.getTime() ===
                  new Date(
                    Date.UTC(
                      i.getUTCFullYear(),
                      i.getUTCMonth(),
                      i.getUTCDate(),
                    ),
                  ).getTime(),
                o =
                  this.selectedDate && !isNaN(this.selectedDate.getTime())
                    ? new Date(
                        Date.UTC(
                          this.selectedDate.getUTCFullYear(),
                          this.selectedDate.getUTCMonth(),
                          this.selectedDate.getUTCDate(),
                        ),
                      )
                    : null;
              t += `<div class="calendar-day${n ? " today" : ""}${o && A.getTime() === o.getTime() ? " selected" : ""}${A < i ? " disabled" : ""}" data-day="${e}">${e}</div>`;
            }
            return t;
          }
          _addCalendarInternalEventListeners() {
            this.shadowRoot &&
              (this.shadowRoot
                .querySelector(".prev-month")
                ?.addEventListener("click", (A) => {
                  (A.stopPropagation(),
                    this.currentViewMonth--,
                    this.currentViewMonth < 0 &&
                      ((this.currentViewMonth = 11), this.currentViewYear--),
                    this._render());
                }),
              this.shadowRoot
                .querySelector(".next-month")
                ?.addEventListener("click", (A) => {
                  (A.stopPropagation(),
                    this.currentViewMonth++,
                    this.currentViewMonth > 11 &&
                      ((this.currentViewMonth = 0), this.currentViewYear++),
                    this._render());
                }),
              this.shadowRoot
                .querySelector(".calendar-cancel-btn")
                ?.addEventListener("click", (A) => {
                  (A.preventDefault(), A.stopPropagation(), this.hide());
                }),
              this.shadowRoot
                .querySelector(".calendar-apply-btn")
                ?.addEventListener("click", (A) => {
                  (A.preventDefault(),
                    A.stopPropagation(),
                    this._updateInputElement(),
                    this.onDateSelectCallback &&
                      this.onDateSelectCallback(
                        new Date(this.selectedDate.valueOf()),
                      ),
                    this.hide(),
                    this.widget.clearMessages());
                }),
              this.shadowRoot
                .querySelectorAll(".calendar-day:not(.empty):not(.disabled)")
                .forEach((A) => {
                  A.addEventListener("click", (e) => {
                    (e.stopPropagation(),
                      (this.selectedDate = new Date(
                        Date.UTC(
                          this.currentViewYear,
                          this.currentViewMonth,
                          parseInt(A.dataset.day || "1"),
                        ),
                      )),
                      this._render());
                  });
                }));
          }
          _attachEventListeners() {
            if (!this.triggerElement) return;
            (this.triggerElement.addEventListener("click", (A) => {
              if (!window.matchMedia("(max-width: 768px)").matches)
                if (
                  (A.stopPropagation(),
                  this.calendarContainer &&
                    "none" !== this.calendarContainer.style.display)
                )
                  this.hide();
                else {
                  const A = this.widget.state.selectedDate || new Date();
                  (this.setSelectedDate(A, !1), this.show());
                }
            }),
              document.addEventListener("click", (A) => {
                if (
                  this.calendarContainer &&
                  "none" !== this.calendarContainer.style.display
                ) {
                  const e = A.composedPath(),
                    t = e.includes(this.calendarContainer),
                    i = this.triggerElement && e.includes(this.triggerElement);
                  t || i || this.hide();
                }
              }));
            const A = (0, g.nF)(this._reposition.bind(this), 50);
            (window.addEventListener("scroll", A, !0),
              window.addEventListener("resize", A));
          }
          _updateDisplayElement() {
            if (
              this.displayElement &&
              this.displayElement === this.widget.elements?.otherDateText
            ) {
              const A =
                {
                  EN: "en-GB",
                  DE: "de-DE",
                  FR: "fr-FR",
                  IT: "it-IT",
                  TH: "th-TH",
                  ES: "es-ES",
                }[this.config.language] ||
                (this.config.language
                  ? `${this.config.language.toLowerCase()}-${this.config.language.toUpperCase()}`
                  : "en-GB");
              if (this.selectedDate && !isNaN(this.selectedDate.getTime())) {
                const e = n.c9
                    .now()
                    .setZone(this.config.timezone)
                    .startOf("day"),
                  t = e.plus({ days: 1 }),
                  i = n.c9
                    .fromJSDate(this.selectedDate, { zone: "utc" })
                    .setZone(this.config.timezone)
                    .startOf("day");
                i.equals(e) ||
                  i.equals(t) ||
                  ((this.displayElement.textContent = (0, g.hi)(
                    this.selectedDate,
                    A,
                    this.config.timezone,
                  )),
                  this.displayElement.classList.remove("placeholder"));
              } else
                ((this.displayElement.textContent = String(
                  this.t("otherDate"),
                )),
                  this.displayElement.classList.add("placeholder"));
            }
          }
          _updateInputElement() {
            this.inputElement &&
              (this.selectedDate && !isNaN(this.selectedDate.getTime())
                ? (this.inputElement.value = d(this.selectedDate, "utc"))
                : (this.inputElement.value = ""));
          }
          _reposition() {
            if (
              !this.calendarContainer ||
              !this.anchorElement ||
              "none" === this.calendarContainer.style.display
            )
              return;
            const A = this.anchorElement.getBoundingClientRect(),
              e = Math.max(280, A.width);
            this.calendarContentWrapper &&
              (this.calendarContentWrapper.style.width = `${e}px`);
            const t = window.pageYOffset || document.documentElement.scrollTop,
              i = window.pageXOffset || document.documentElement.scrollLeft;
            let n = A.bottom + t + 5,
              o = A.left + i;
            const g = this.calendarContainer.offsetHeight,
              r = this.calendarContainer.offsetWidth;
            (n + g > window.innerHeight + t && (n = A.top + t - g - 5),
              o + r > window.innerWidth + i &&
                (o = window.innerWidth + i - r - 5),
              o < i + 5 && (o = i + 5),
              (this.calendarContainer.style.top = `${n}px`),
              (this.calendarContainer.style.left = `${o}px`));
          }
          show() {
            if (this.calendarContainer) {
              if (this.selectedDate && !isNaN(this.selectedDate.getTime()))
                ((this.currentViewMonth = this.selectedDate.getUTCMonth()),
                  (this.currentViewYear = this.selectedDate.getUTCFullYear()));
              else {
                const A = new Date();
                ((this.currentViewMonth = A.getUTCMonth()),
                  (this.currentViewYear = A.getUTCFullYear()));
              }
              (this._render(),
                (this.calendarContainer.style.display = "block"),
                this._reposition());
            }
          }
          hide() {
            this.calendarContainer &&
              (this.calendarContainer.style.display = "none");
          }
          setSelectedDate(A, e = !0) {
            ((this.selectedDate = new Date(
              Date.UTC(A.getFullYear(), A.getMonth(), A.getDate()),
            )),
              isNaN(this.selectedDate.getTime()) ||
                ((this.currentViewMonth = this.selectedDate.getUTCMonth()),
                (this.currentViewYear = this.selectedDate.getUTCFullYear())),
              this._updateInputElement(),
              this.calendarContainer &&
                "none" !== this.calendarContainer.style.display &&
                this._render(),
              e &&
                this.onDateSelectCallback &&
                this.onDateSelectCallback(
                  new Date(this.selectedDate.valueOf()),
                ));
          }
        }
        class M {
          constructor(A, e, t, i, o, g, r) {
            ((this.widget = t),
              (this.config = t.config),
              (this.t = t.t.bind(t)),
              (this.onRangeSelectCallback = i),
              (this.activityDurationDaysFixed = r
                ? parseInt(String(r), 10)
                : null),
              (this.fixedStartDate = o
                ? n.c9.fromISO(o, { zone: "utc" }).startOf("day").toJSDate()
                : null),
              this.fixedStartDate &&
                isNaN(this.fixedStartDate.getTime()) &&
                (this.fixedStartDate = null),
              (this.fixedEndDate = g
                ? n.c9.fromISO(g, { zone: "utc" }).startOf("day").toJSDate()
                : null),
              this.fixedEndDate &&
                isNaN(this.fixedEndDate.getTime()) &&
                (this.fixedEndDate = null));
            const a = n.c9.now().setZone(this.config.timezone);
            if (
              (this.fixedStartDate
                ? (this.tempStartDate = new Date(this.fixedStartDate.valueOf()))
                : (this.tempStartDate = D(A, a, this.config.timezone)),
              this.fixedEndDate)
            )
              this.tempEndDate = new Date(this.fixedEndDate.valueOf());
            else if (this.activityDurationDaysFixed && this.tempStartDate)
              this.tempEndDate = n.c9
                .fromJSDate(this.tempStartDate, { zone: "utc" })
                .plus({ days: this.activityDurationDaysFixed - 1 })
                .startOf("day")
                .toJSDate();
            else {
              const A = this.tempStartDate
                ? n.c9.fromJSDate(this.tempStartDate, { zone: "utc" })
                : a;
              this.tempEndDate = D(e, A, this.config.timezone);
            }
            (this.tempEndDate < this.tempStartDate &&
              (this.tempEndDate = new Date(this.tempStartDate.valueOf())),
              this.fixedStartDate &&
                this.fixedEndDate &&
                this.fixedStartDate > this.fixedEndDate &&
                ((this.fixedEndDate = null),
                (this.tempEndDate = new Date(this.tempStartDate.valueOf()))),
              (this.currentViewMonth = this.tempStartDate.getUTCMonth()),
              (this.currentViewYear = this.tempStartDate.getUTCFullYear()),
              !this.fixedStartDate ||
              this.fixedEndDate ||
              this.activityDurationDaysFixed
                ? this.fixedStartDate ||
                  !this.fixedEndDate ||
                  this.activityDurationDaysFixed
                  ? this.fixedStartDate && this.fixedEndDate
                    ? (this.selectingStartDate = !1)
                    : (this.activityDurationDaysFixed,
                      (this.selectingStartDate = !0))
                  : (this.selectingStartDate = !0)
                : (this.selectingStartDate = !1),
              (this.modalOverlay = null),
              (this.modalElement = null),
              (this.calendarInstance = null),
              this._initDOM(),
              this._attachEventListeners());
          }
          _initDOM() {
            ((this.modalOverlay = document.createElement("div")),
              (this.modalOverlay.className =
                "range-calendar-overlay diana-container"),
              (this.modalElement = document.createElement("div")),
              (this.modalElement.className = "range-calendar-modal"),
              (this.modalElement.innerHTML = (0, v.getRangeCalendarModalHTML)({
                t: this.t,
              })),
              this.modalOverlay.appendChild(this.modalElement),
              this.widget.dianaWidgetRootContainer?.appendChild(
                this.modalOverlay,
              ),
              (this.calendarInstance = this.modalElement.querySelector(
                ".range-calendar-instance",
              )),
              this._renderCalendar());
          }
          _renderCalendar() {
            this._renderMonth(
              this.currentViewYear,
              this.currentViewMonth,
              this.calendarInstance,
            );
          }
          _renderMonth(A, e, t) {
            const i = new Date(Date.UTC(A, e + 1, 0)).getUTCDate();
            let n = new Date(Date.UTC(A, e, 1)).getUTCDay();
            ((n = 0 === n ? 6 : n - 1),
              (t.innerHTML = `\n            <div class="calendar-nav">\n                <button type="button" class="calendar-nav-btn prev-month-range" aria-label="${this.t("ariaLabels.previousMonthButton")}">&#9664;</button>\n                <div class="calendar-month-year">${(0, g.Ge)(e, this.t)} ${A}</div>\n                <button type="button" class="calendar-nav-btn next-month-range" aria-label="${this.t("ariaLabels.nextMonthButton")}">&#9654;</button>\n            </div>\n            <div class="calendar-grid">\n                ${[0, 1, 2, 3, 4, 5, 6].map((A) => `<div class="calendar-day-header">${(0, g.uA)(A, this.t)}</div>`).join("")}\n                ${this._generateRangeDaysHTML(i, n, A, e)}\n            </div>`),
              this._addRangeCalendarInternalEventListeners(t));
          }
          _generateRangeDaysHTML(A, e, t, i) {
            let o = "";
            const g = n.c9.now().setZone("utc").startOf("day").toJSDate();
            for (let A = 0; A < e; A++)
              o += "<div class='calendar-day empty'></div>";
            const r = this.tempStartDate,
              a = this.tempEndDate,
              B = this.fixedStartDate,
              s = this.fixedEndDate;
            for (let e = 1; e <= A; e++) {
              const A = new Date(Date.UTC(t, i, e));
              let n = "calendar-day";
              A.getTime() === g.getTime() && (n += " today");
              let c = A < g;
              (B && A.getTime() === B.getTime()
                ? ((n += " fixed-date start-date selected"), (c = !0))
                : s && A.getTime() === s.getTime()
                  ? ((n += " fixed-date end-date selected"), (c = !0))
                  : (r &&
                      A.getTime() === r.getTime() &&
                      (n += " start-date selected"),
                    a &&
                      A.getTime() === a.getTime() &&
                      (n += " end-date selected"),
                    r && a && A > r && A < a && (n += " in-range")),
                !B || this.fixedEndDate || this.activityDurationDaysFixed
                  ? !s ||
                    this.fixedStartDate ||
                    this.activityDurationDaysFixed ||
                    (A > s && (c = !0))
                  : A < B && (c = !0),
                c && (n += " disabled"),
                (o += `<div class="${n}" data-date="${t}-${String(i + 1).padStart(2, "0")}-${String(e).padStart(2, "0")}">${e}</div>`));
            }
            return o;
          }
          _addRangeCalendarInternalEventListeners(A) {
            const e = A.querySelector(".prev-month-range");
            e &&
              e.addEventListener("click", (A) => {
                (A.stopPropagation(),
                  this.currentViewMonth--,
                  this.currentViewMonth < 0 &&
                    ((this.currentViewMonth = 11), this.currentViewYear--),
                  this._renderCalendar());
              });
            const t = A.querySelector(".next-month-range");
            (t &&
              t.addEventListener("click", (A) => {
                (A.stopPropagation(),
                  this.currentViewMonth++,
                  this.currentViewMonth > 11 &&
                    ((this.currentViewMonth = 0), this.currentViewYear++),
                  this._renderCalendar());
              }),
              A.querySelectorAll(
                ".calendar-day:not(.empty):not(.disabled)",
              ).forEach((A) => {
                A.addEventListener("click", (e) => {
                  e.stopPropagation();
                  const [t, i, o] = A.dataset.date.split("-").map(Number),
                    g = new Date(Date.UTC(t, i - 1, o));
                  if (!this.fixedStartDate || !this.fixedEndDate) {
                    if (this.activityDurationDaysFixed) {
                      if (this.fixedStartDate || this.fixedEndDate) return;
                      ((this.tempStartDate = g),
                        (this.tempEndDate = n.c9
                          .fromJSDate(g, { zone: "utc" })
                          .plus({ days: this.activityDurationDaysFixed - 1 })
                          .toJSDate()));
                    } else if (this.fixedStartDate) {
                      if (!(g >= this.fixedStartDate)) return;
                      this.tempEndDate = g;
                    } else if (this.fixedEndDate) {
                      if (!(g <= this.fixedEndDate)) return;
                      this.tempStartDate = g;
                    } else
                      this.selectingStartDate || g < this.tempStartDate
                        ? ((this.tempStartDate = g),
                          (this.tempEndDate = new Date(g.valueOf())),
                          (this.selectingStartDate = !1))
                        : ((this.tempEndDate = g),
                          this.tempEndDate < this.tempStartDate &&
                            (this.tempStartDate = new Date(
                              this.tempEndDate.valueOf(),
                            )),
                          (this.selectingStartDate = !0));
                    this._renderCalendar();
                  }
                });
              }));
          }
          _attachEventListeners() {
            this.modalElement &&
              this.modalOverlay &&
              (this.modalElement
                .querySelector(".range-calendar-close-btn")
                ?.addEventListener("click", () => this.hide()),
              this.modalElement
                .querySelector(".range-calendar-cancel-btn")
                ?.addEventListener("click", () => this.hide()),
              this.modalElement
                .querySelector(".range-calendar-apply-btn")
                ?.addEventListener("click", () => this._handleApply()),
              this.modalOverlay.addEventListener("click", (A) => {
                A.target === this.modalOverlay && this.hide();
              }));
          }
          _handleApply() {
            if (
              (this.fixedStartDate &&
                this.tempEndDate < this.fixedStartDate &&
                (this.tempEndDate = new Date(this.fixedStartDate.valueOf())),
              this.fixedEndDate &&
                this.tempStartDate > this.fixedEndDate &&
                (this.tempStartDate = new Date(this.fixedEndDate.valueOf())),
              this.tempStartDate &&
                this.tempEndDate &&
                this.tempEndDate < this.tempStartDate &&
                (this.tempEndDate = new Date(this.tempStartDate.valueOf())),
              this.onRangeSelectCallback)
            ) {
              const A = this.tempStartDate
                  ? new Date(this.tempStartDate.valueOf())
                  : new Date(
                      Date.UTC(
                        new Date().getUTCFullYear(),
                        new Date().getUTCMonth(),
                        new Date().getUTCDate(),
                      ),
                    ),
                e = this.tempEndDate
                  ? new Date(this.tempEndDate.valueOf())
                  : new Date(A.valueOf());
              this.onRangeSelectCallback(A, e);
            }
            (this.hide(), this.widget.clearMessages());
          }
          show(A, e) {
            const t = n.c9.now().setZone(this.config.timezone);
            if (
              (this.fixedStartDate
                ? (this.tempStartDate = new Date(this.fixedStartDate.valueOf()))
                : (this.tempStartDate = D(A, t, this.config.timezone)),
              this.fixedEndDate)
            )
              this.tempEndDate = new Date(this.fixedEndDate.valueOf());
            else if (this.activityDurationDaysFixed && this.tempStartDate)
              this.tempEndDate = n.c9
                .fromJSDate(this.tempStartDate, { zone: "utc" })
                .plus({ days: this.activityDurationDaysFixed - 1 })
                .startOf("day")
                .toJSDate();
            else {
              const A = this.tempStartDate
                ? n.c9.fromJSDate(this.tempStartDate, { zone: "utc" })
                : t;
              this.tempEndDate = D(e, A, this.config.timezone);
            }
            (this.tempEndDate < this.tempStartDate &&
              (this.tempEndDate = new Date(this.tempStartDate.valueOf())),
              !this.fixedStartDate ||
              this.fixedEndDate ||
              this.activityDurationDaysFixed
                ? this.fixedStartDate ||
                  !this.fixedEndDate ||
                  this.activityDurationDaysFixed
                  ? this.fixedStartDate && this.fixedEndDate
                    ? ((this.selectingStartDate = !1),
                      (this.currentViewMonth =
                        this.fixedStartDate.getUTCMonth()),
                      (this.currentViewYear =
                        this.fixedStartDate.getUTCFullYear()))
                    : this.activityDurationDaysFixed
                      ? ((this.selectingStartDate = !this.fixedStartDate),
                        (this.currentViewMonth =
                          this.tempStartDate.getUTCMonth()),
                        (this.currentViewYear =
                          this.tempStartDate.getUTCFullYear()))
                      : ((this.selectingStartDate = !0),
                        (this.currentViewMonth =
                          this.tempStartDate.getUTCMonth()),
                        (this.currentViewYear =
                          this.tempStartDate.getUTCFullYear()))
                  : ((this.selectingStartDate = !0),
                    (this.currentViewMonth = this.tempStartDate.getUTCMonth()),
                    (this.currentViewYear =
                      this.tempStartDate.getUTCFullYear()))
                : ((this.selectingStartDate = !1),
                  (this.currentViewMonth = this.tempEndDate.getUTCMonth()),
                  (this.currentViewYear = this.tempEndDate.getUTCFullYear())),
              this._renderCalendar(),
              this.modalOverlay && (this.modalOverlay.style.display = "flex"));
          }
          hide() {
            this.modalOverlay && (this.modalOverlay.style.display = "none");
          }
        }
        var m = t(320);
        const Y = ["coordinates", "coord", "coords", "address", "station"],
          p = ["coordinates", "coord", "coords"];
        function y(A) {
          return "string" == typeof A && Y.includes(A);
        }
        function P(A) {
          return "string" == typeof A && p.includes(A);
        }
        const F = [
            "activityEarliestStartTime",
            "activityLatestStartTime",
            "activityEarliestEndTime",
            "activityLatestEndTime",
          ],
          G = {
            activityName: "[Activity Name]",
            requiredFields: [
              "activityStartLocation",
              "activityStartLocationType",
              "activityEndLocation",
              "activityEndLocationType",
              "activityEarliestStartTime",
              "activityLatestStartTime",
              "activityEarliestEndTime",
              "activityLatestEndTime",
              "activityDurationMinutes",
              "apiToken",
            ],
            activityStartLocationDisplayName: null,
            activityEndLocationDisplayName: null,
            timezone: "Europe/Vienna",
            activityStartTimeLabel: null,
            activityEndTimeLabel: null,
            apiBaseUrl: "https://api.zuugle-services.net",
            language: "EN",
            dev: !1,
            cacheUserStartLocation: !0,
            userStartLocationCacheTTLMinutes: 15,
            overrideUserStartLocation: null,
            overrideUserStartLocationType: null,
            disableUserStartLocationField: !1,
            displayStartDate: null,
            displayEndDate: null,
            destinationInputName: null,
            multiday: !1,
            overrideActivityStartDate: null,
            overrideActivityEndDate: null,
            activityDurationDaysFixed: null,
            share: !0,
            allowShareView: !0,
            shareURLPrefix: null,
            hideOverriddenActivityStartDate: !0,
            dateList: null,
            onDateChange: null,
            onApiTokenExpired: null,
          },
          H = {
            fromConnections: [],
            toConnections: [],
            selectedToConnection: null,
            selectedFromConnection: null,
            selectedDate: null,
            selectedEndDate: null,
            loading: !1,
            error: null,
            info: null,
            suggestions: [],
            recommendedToIndex: 0,
            recommendedFromIndex: 0,
            activityTimes: {
              start: "",
              end: "",
              duration: "",
              warningDuration: !1,
            },
            currentContentKey: null,
            preselectTimes: null,
          };
        class L {
          constructor(A) {
            ((this.config = A.config),
              (this.t = A.t),
              (this.getTransportIcon = A.getTransportIcon),
              (this.getTransportName = A.getTransportName));
          }
          updateConfig(A) {
            this.config = A;
          }
          renderConnectionSummary(A, e, t) {
            if (
              !A ||
              !A.connection_elements ||
              0 === A.connection_elements.length
            )
              return "";
            const i = c(A.connection_start_timestamp, this.config.timezone),
              n = c(A.connection_end_timestamp, this.config.timezone),
              o = Q(
                A.connection_start_timestamp,
                A.connection_end_timestamp,
                (A) => this.t(A),
              ),
              g = A.connection_transfers;
            let r, a;
            "to" === e
              ? ((r = t.originInput?.value ?? ""),
                (a =
                  A.connection_elements[A.connection_elements.length - 1]
                    .to_location ?? ""))
              : ((r = A.connection_elements[0].from_location ?? ""),
                (a = t.originInput?.value ?? ""));
            const B = [
              ...A.connection_elements
                .filter((A) => "JNY" === A.type)
                .map((A) => A.vehicle_type),
            ].filter((A) => void 0 !== A);
            (A.connection_anytime ||
              (A.connection_elements.length > 0 &&
                A.connection_elements.every((A) => "WALK" === A.type))) &&
              (B.includes("WALK") || B.unshift("WALK"));
            const s = B.slice(0, 4)
                .map(
                  (A) =>
                    `<span title="${this.getTransportName(A)}" alt="${this.getTransportName(A)}">${this.getTransportIcon(A)}</span>`,
                )
                .join(""),
              C =
                A.connection_elements &&
                A.connection_elements.length > 0 &&
                A.connection_elements.every((A) => "live" === A.provider)
                  ? `<span class="live-indicator">${this.t("live")}</span>`
                  : "";
            return `\n            <div class="summary-line-1">\n                <strong>${"to" === e ? this.t("journeyToActivity") + "  " : this.t("journeyFromActivity") + "  "}${i} - ${n}</strong>\n                <div class="summary-icons">${s}</div>\n            </div>\n            <div class="summary-line-2">\n                ${r} - ${a}\n            </div>\n            <div class="summary-line-3">\n                <span>${o} &bull; ${g} ${this.t("transfers")}</span>\n                ${C}\n            </div>\n        `;
          }
          renderConnectionDetails(A, e, t, i) {
            return A && 0 !== A.length
              ? A.map((A) => {
                  if (
                    !A.connection_elements ||
                    0 === A.connection_elements.length
                  )
                    return `<div>${this.t("noConnectionElements")}</div>`;
                  const n = A.connection_elements;
                  if (0 === n.length)
                    return `<div>${this.t("noConnectionElements")}</div>`;
                  const o =
                      A.connection_elements &&
                      A.connection_elements.length > 0 &&
                      A.connection_elements.every((A) => "live" === A.provider)
                        ? `<div class="live-indicator-details"><span class="live-dot"></span>${this.t("liveConnection")}</div>`
                        : "",
                    g = A.connection_ticketshop_provider
                      ? `\n            <button class="ticket-button" data-conn-type="${e}">\n                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12.5C20 11.12 20.83 10 22 10V8C22 6.9 21.1 6 20 6H4C2.9 6 2 6.9 2 8V10C3.17 10 4 11.12 4 12.5C4 13.88 3.17 15 2 15V17C2 18.1 2.9 19 4 19H20C21.1 19 22 18.1 22 17V15C20.83 15 20 13.88 20 12.5ZM11.5 16H9.5V15H11.5V16ZM11.5 14H9.5V13H11.5V14ZM11.5 12H9.5V11H11.5V12ZM11.5 10H9.5V9H11.5V10ZM14.5 16H12.5V15H14.5V16ZM14.5 14H12.5V13H14.5V14ZM14.5 12H12.5V11H14.5V12ZM14.5 10H12.5V9H14.5V10Z"></path></svg>\n                ${this.t("buyTicket")} (${A.connection_ticketshop_provider})\n            </button>\n            `
                      : "";
                  let r = `<div class="connection-details-wrapper">${o || g ? `\n            <div class="connection-details-header">\n                ${o}\n                ${g}\n            </div>\n            ` : ""}<div class="connection-elements">`;
                  return (
                    "from" === e &&
                      t.activityTimes.end &&
                      n.length > 0 &&
                      (r += this._renderWaitingBlockAfterActivity(n, t)),
                    n.forEach((o, g) => {
                      r += this._renderConnectionElement(
                        o,
                        g,
                        n,
                        e,
                        A,
                        i,
                        t.activityTimes.start,
                      );
                    }),
                    "to" === e &&
                      t.activityTimes.start &&
                      n.length > 0 &&
                      (r += this._renderWaitingBlockBeforeActivity(n, t)),
                    (r += "</div></div>"),
                    r
                  );
                }).join("")
              : `<div>${this.t("noConnectionDetails")}</div>`;
          }
          _renderConnectionElement(A, e, t, i, o, g, r) {
            const a = c(A.departure_time, this.config.timezone),
              B = c(A.arrival_time, this.config.timezone),
              s = Q(A.departure_time, A.arrival_time, (A) => this.t(A)),
              C =
                "JNY" !== A.type
                  ? A.type || "DEFAULT"
                  : A.vehicle_type || "DEFAULT",
              l = this.getTransportIcon(C),
              E = this.getTransportName(C);
            let d = "";
            const D = n.c9
                .fromISO(A.departure_time, { zone: this.config.timezone })
                .startOf("day"),
              h = n.c9
                .fromISO(A.arrival_time, { zone: this.config.timezone })
                .startOf("day"),
              I = [];
            if (
              (0 === e &&
                I.push(
                  w(
                    A.departure_time,
                    this.config.timezone,
                    this.config.language,
                  ),
                ),
              h > D)
            ) {
              const e = w(
                A.arrival_time,
                this.config.timezone,
                this.config.language,
              );
              I.includes(e) || I.push(e);
            }
            I.length > 0 &&
              (d = `<span class="connection-leg-date-display">${I.join("<br>")}</span>`);
            let u = A.from_location;
            A.isOriginalFirst &&
              (u =
                "to" === i
                  ? (g.originInput?.value ?? "")
                  : this.config.activityEndLocationDisplayName ||
                    this.config.activityEndLocation);
            let v = `\n          <div class="connection-element">\n            <div class="connection-element-content">\n              <div class="element-time-location-group">\n                  <span class="element-time">${a}</span>\n                  <span class="element-location">${u}</span>\n                  ${A.platform_orig ? `<span class="element-platform">${this.t("platform")} ${A.platform_orig}</span>` : ""}\n              </div>\n              <div id="eleCont" ${"" !== d ? 'style="margin-right: 70px;"' : ""}>\n                <div class="element-circle"></div>\n                <span class="element-icon" title="${E}" alt="${E}">${l}</span>\n                <span class="element-duration">${this.getDurationString(e, i, A, s, o, g, r)}</span>\n              </div>\n              ${d}\n            </div>\n            ${this.renderAlert(A)}\n          </div>\n        `;
            if (e === t.length - 1) {
              let e = A.to_location;
              (A.isOriginalLast &&
                (e =
                  "to" === i
                    ? this.config.activityStartLocationDisplayName ||
                      this.config.activityStartLocation
                    : (g.originInput?.value ?? "")),
                (v += `\n            <div class="connection-element">\n              <div class="connection-element-content">\n                <div class="element-time-location-group">\n                  <span class="element-time">${B}</span>\n                  <span class="element-location">${e}</span>\n                  ${A.platform_dest ? `<span class="element-platform">${this.t("platform")} ${A.platform_dest}</span>` : ""}\n                </div>\n                <div class="element-circle-wrapper">\n                  <div class="element-circle"></div>\n                </div>\n              </div>\n            </div>\n          `));
            }
            return v;
          }
          _renderWaitingBlockAfterActivity(A, e) {
            const t = A[0].departure_time,
              i = n.c9
                .fromISO(t, { zone: "utc" })
                .setZone(this.config.timezone);
            let o = n.c9
              .fromFormat(e.activityTimes.end, "HH:mm", {
                zone: this.config.timezone,
              })
              .set({ year: i.year, month: i.month, day: i.day });
            if (
              (o > i && (o = o.minus({ days: 1 })),
              o.isValid && i.isValid && i > o)
            ) {
              const A = l(o, i, (A) => this.t(A));
              if (A.totalMinutes > 0)
                return `\n                  <div class="connection-element waiting-block">\n                      <div class="element-time">\n                      <span>${e.activityTimes.end}</span>\n                      ${this.t("waiting.afterActivity")}\n                      </div>\n                      <div id="eleCont">\n                      <span class="element-icon" title="${this.t("waiting.title")}" alt="${this.t("waiting.title")}">${this.getTransportIcon("WAIT")}</span>\n                      <span class="element-duration">\n                          ${A.text}\n                      </span>\n                      </div>\n                  </div>`;
            }
            return "";
          }
          _renderWaitingBlockBeforeActivity(A, e) {
            const t = A[A.length - 1].arrival_time;
            if (t) {
              const A = n.c9
                .fromISO(t, { zone: "utc" })
                .setZone(this.config.timezone);
              let i = n.c9
                .fromFormat(e.activityTimes.start, "HH:mm", {
                  zone: this.config.timezone,
                })
                .set({ year: A.year, month: A.month, day: A.day });
              if (
                (i < A && (i = i.plus({ days: 1 })),
                A.isValid && i.isValid && i > A)
              ) {
                const e = l(A, i, (A) => this.t(A));
                if (e.totalMinutes > 0)
                  return `\n                      <div class="connection-element waiting-block">\n                          <div class="element-time">\n                          <span>${c(t, this.config.timezone)}</span>\n                          ${this.t("waiting.beforeActivity")}\n                          </div>\n                          <div id="eleCont">\n                          <span class="element-icon" title="${this.t("waiting.title")}" alt="${this.t("waiting.title")}">${this.getTransportIcon("WAIT")}</span>\n                          <span class="element-duration">\n                              ${e.text}\n                          </span>\n                          </div>\n                      </div>`;
              }
            }
            return "";
          }
          renderAlert(A) {
            if (!A.alerts || 0 === A.alerts.length) return "";
            const e = A.alerts[0],
              t = (A) => {
                if (!A) return "";
                const e = document.createElement("div");
                return ((e.textContent = A), e.innerHTML);
              },
              i = (A) =>
                A
                  ? A.replace(/&/g, "&amp;")
                      .replace(/"/g, "&quot;")
                      .replace(/'/g, "&#39;")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                  : "",
              n = (A) =>
                A
                  ? t(A).replace(
                      /(https?:\/\/[^\s]+)/g,
                      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
                    )
                  : "",
              o = e,
              g = o.header_text ? t(o.header_text) : o.title ? t(o.title) : "",
              r = o.description_text
                ? n(o.description_text)
                : o.description
                  ? n(o.description)
                  : "";
            let a = `\n            <div class="connection-element-alert">\n                <div class="alert-header">\n                    <span class="alert-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></span>\n                    <span>${this.t("alert.label")}</span>\n                </div>`;
            return (
              g &&
                (a += `\n                <div class="alert-header-text expandable expanded" title="${i(o.header_text || o.title || "")}">${g}</div>`),
              r &&
                (a += `\n                <div class="alert-description expandable expanded" title="${i(o.description_text || o.description || "")}">${r}</div>`),
              (a += "\n            </div>"),
              a
            );
          }
          getDurationString(A, e, t, i, o, g, r) {
            if (
              o &&
              o.connection_anytime &&
              "WALK" === t.type &&
              o.connection_elements
            ) {
              const A = o.connection_elements[0].duration ?? 0,
                t = E(A, (A) => this.t(A));
              if ("to" === e) {
                if (r) {
                  const e = n.c9
                    .fromFormat(r, "HH:mm", { zone: this.config.timezone })
                    .minus({ minutes: A })
                    .toFormat("HH:mm");
                  return `${t} - ${this.t("anytimeLeaveBy", { time: e })}`;
                }
                return `${t}`;
              }
              {
                const A = g.originInput?.value ?? "";
                return `${t} - ${this.t("anytimeWalkTo", { destination: A })}`;
              }
            }
            let a = "";
            if (t.vehicle_name && "JNY" === t.type) {
              const A = (t.n_intermediate_stops ?? -1) + 1,
                e =
                  1 !== A
                    ? `, ${A} ${this.t("stopPl")})`
                    : `, ${A} ${this.t("stopSg")})`;
              return (
                (a = `${t.vehicle_name} -> ${t.direction} (${i}`),
                (a += A > 0 ? `${e}` : ")"),
                a
              );
            }
            return (
              (a = `${i}`),
              "TRSF" === t.type && (a += ` ${this.t("durationTransferTime")}`),
              a
            );
          }
        }
        class b {
          constructor(A, e, t) {
            ((this.config = A),
              (this.onSessionExpired = e),
              (this.getErrorMessage = t));
          }
          setApiToken(A) {
            this.config.apiToken = A;
          }
          get baseUrl() {
            return this.config.apiBaseUrl;
          }
          async fetch(A, e = {}, t = !1) {
            const i = {
                ...e,
                headers: {
                  ...e.headers,
                  Authorization: `Bearer ${this.config.apiToken}`,
                },
              },
              n = await fetch(A, i);
            if (n.ok) return n;
            if (401 === n.status && !t) return this.handleUnauthorized(A, e);
            const o = new Error(`API Error: ${n.status} ${n.statusText}`);
            o.response = n;
            try {
              o.body = await n.clone().json();
            } catch (A) {
              o.body = await n.clone().text();
            }
            throw o;
          }
          async handleUnauthorized(A, e) {
            if ("function" != typeof this.config.onApiTokenExpired) {
              this.onSessionExpired();
              const A = new Error(
                this.getErrorMessage("errors.sessionExpired"),
              );
              throw ((A.isSessionExpired = !0), A);
            }
            try {
              const t = await this.config.onApiTokenExpired();
              if ("string" == typeof t && t)
                return ((this.config.apiToken = t), this.fetch(A, e, !0));
              throw new Error(
                "onApiTokenExpired callback did not return a valid string token.",
              );
            } catch (A) {
              (console.error("Token refresh via onApiTokenExpired failed:", A),
                this.onSessionExpired());
              const e = new Error(
                this.getErrorMessage("errors.sessionExpired"),
              );
              throw ((e.isSessionExpired = !0), e);
            }
          }
          async fetchAddressSuggestions(A) {
            const e = navigator.language.split("-")[0],
              t = await this.fetch(
                `${this.config.apiBaseUrl}/address-autocomplete?q=${encodeURIComponent(A)}&lang=${e}`,
              );
            return await t.json();
          }
          async fetchReverseGeocode(A, e) {
            const t = await this.fetch(
              `${this.config.apiBaseUrl}/reverse-geocode?lat=${A}&lon=${e}`,
            );
            return await t.json();
          }
          async fetchConnections(A) {
            const e = {};
            for (const [t, i] of Object.entries(A))
              void 0 !== i && (e[t] = String(i));
            const t = new URLSearchParams(e),
              i = await this.fetch(
                `${this.config.apiBaseUrl}/connections?${t}`,
              );
            return await i.json();
          }
          async generateTicketshopLink(A) {
            const e = await this.fetch(
              `${this.config.apiBaseUrl}/generate-ticketshop-link`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(A),
              },
            );
            return await e.json();
          }
          async createShare(A) {
            const e = await this.fetch(`${this.config.apiBaseUrl}/share/`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(A),
            });
            return await e.json();
          }
          async fetchShare(A) {
            const e = await this.fetch(`${this.config.apiBaseUrl}/share/${A}/`);
            return await e.json();
          }
        }
        const U = class {
          constructor(A = {}, e = "dianaWidgetContainer") {
            ((this.defaultConfig = { ...G }),
              (this.config = { ...this.defaultConfig, ...A }),
              (this.shadowRoot = null),
              (this.dianaWidgetRootContainer = null),
              (this.CACHE_KEY_USER_START_LOCATION = ""),
              (this.loadingTextTimeout1 = null),
              (this.loadingTextTimeout2 = null),
              (this.singleCalendarInstance = null),
              (this.rangeCalendarModal = null),
              (this.pageManager = null),
              (this.uiManager = null),
              (this.elements = {}),
              (this.lastQuery = ""),
              (this.state = { ...H }),
              (this.apiService = null),
              (this.connectionRenderer = null),
              (this.debouncedHandleAddressInput = (0, g.sg)(
                (A) => this.handleAddressInput(A),
                700,
              )));
            const t = (function (A) {
              const e = [];
              (A.language &&
                "string" == typeof A.language &&
                (A.language = A.language.trim().toUpperCase()),
                o[A.language] ||
                  (console.warn(
                    `Unsupported language '${A.language}', falling back to EN`,
                  ),
                  (A.language = "EN")));
              const t = A.requiredFields.filter((e) => !A[e]);
              if (A.multiday && !A.activityDurationMinutes) {
                const A = t.indexOf("activityDurationMinutes");
                A > -1 && t.splice(A, 1);
              }
              if (
                (t.length > 0 &&
                  e.push(`Missing required configuration: ${t.join(", ")}`),
                "/" === A.apiBaseUrl[A.apiBaseUrl.length - 1] &&
                  (A.apiBaseUrl = A.apiBaseUrl.slice(0, -1)),
                n.c9.local().setZone(A.timezone).isValid ||
                  (e.push(
                    `Invalid timezone '${A.timezone}'. Error: ${n.c9.local().setZone(A.timezone).invalidReason}`,
                  ),
                  (A.timezone = "Europe/Vienna")),
                A.activityStartLocationType &&
                  !y(A.activityStartLocationType) &&
                  e.push(
                    `Invalid activityStartLocationType '${A.activityStartLocationType}'.`,
                  ),
                A.activityEndLocationType &&
                  !y(A.activityEndLocationType) &&
                  e.push(
                    `Invalid activityEndLocationType '${A.activityEndLocationType}'.`,
                  ),
                void 0 !== A.activityDurationMinutes &&
                  null !== A.activityDurationMinutes)
              ) {
                const t =
                  "number" == typeof A.activityDurationMinutes
                    ? A.activityDurationMinutes
                    : parseInt(A.activityDurationMinutes, 10);
                (isNaN(t) || t <= 0) &&
                  e.push(
                    `Invalid activityDurationMinutes '${A.activityDurationMinutes}'. Must be a positive integer.`,
                  );
              }
              const i = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9])(:([0-5]?[0-9]))?$/;
              return (
                F.forEach((t) => {
                  A[t] &&
                    !i.test(A[t]) &&
                    e.push(
                      `Invalid time format for '${t}': '${A[t]}'. Expected HH:MM or HH:MM:SS`,
                    );
                }),
                e.some((A) => A.includes("Invalid time format")) ||
                  (function (A, e) {
                    if (
                      A.activityEarliestStartTime &&
                      A.activityLatestStartTime &&
                      A.activityEarliestEndTime &&
                      A.activityLatestEndTime
                    )
                      try {
                        const t = a(
                          A.activityEarliestStartTime,
                          new Date("2000-10-10"),
                          A.timezone,
                        );
                        a(
                          A.activityLatestStartTime,
                          new Date("2000-10-10"),
                          A.timezone,
                        ) < t &&
                          e.push(
                            `activityLatestStartTime (${A.activityLatestStartTime}) cannot be before activityEarliestStartTime (${A.activityEarliestStartTime}).`,
                          );
                        const i = a(
                          A.activityEarliestEndTime,
                          new Date("2000-10-10"),
                          A.timezone,
                        );
                        a(
                          A.activityLatestEndTime,
                          new Date("2000-10-10"),
                          A.timezone,
                        ) < i &&
                          e.push(
                            `activityLatestEndTime (${A.activityLatestEndTime}) cannot be before activityEarliestEndTime (${A.activityEarliestEndTime}).`,
                          );
                      } catch (A) {
                        e.push(
                          "There was an issue parsing activity time configurations for logical validation.",
                        );
                      }
                  })(A, e),
                (function (A, e) {
                  (A.overrideUserStartLocation &&
                    "string" != typeof A.overrideUserStartLocation &&
                    e.push(
                      `Invalid overrideUserStartLocation '${A.overrideUserStartLocation}'. Must be a string or null.`,
                    ),
                    A.overrideUserStartLocation &&
                    !y(A.overrideUserStartLocationType)
                      ? e.push(
                          `Invalid or missing overrideUserStartLocationType '${A.overrideUserStartLocationType}'.`,
                        )
                      : A.overrideUserStartLocation &&
                        P(A.overrideUserStartLocationType) &&
                        (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(
                          A.overrideUserStartLocation,
                        ) ||
                          e.push(
                            `Invalid coordinate format for overrideUserStartLocation: '${A.overrideUserStartLocation}'. Expected "lat,lon".`,
                          )),
                    A.disableUserStartLocationField &&
                      !A.overrideUserStartLocation &&
                      (console.warn(
                        "Warning: 'disableUserStartLocationField' is set to true but 'overrideUserStartLocation' is not provided. The parameter will be ignored.",
                      ),
                      (A.disableUserStartLocationField = !1)));
                })(A, e),
                (function (A, e) {
                  const t = /^\d{4}-\d{2}-\d{2}$/;
                  if (
                    (!A.displayStartDate ||
                      (t.test(A.displayStartDate) &&
                        n.c9.fromISO(A.displayStartDate).isValid) ||
                      e.push(
                        `Invalid displayStartDate: ${A.displayStartDate}.`,
                      ),
                    !A.displayEndDate ||
                      (t.test(A.displayEndDate) &&
                        n.c9.fromISO(A.displayEndDate).isValid) ||
                      e.push(`Invalid displayEndDate: ${A.displayEndDate}.`),
                    A.displayStartDate &&
                      A.displayEndDate &&
                      n.c9.fromISO(A.displayStartDate) >
                        n.c9.fromISO(A.displayEndDate) &&
                      e.push(
                        "displayStartDate cannot be after displayEndDate.",
                      ),
                    !A.overrideActivityStartDate ||
                      (t.test(A.overrideActivityStartDate) &&
                        n.c9.fromISO(A.overrideActivityStartDate).isValid) ||
                      e.push(
                        `Invalid overrideActivityStartDate: ${A.overrideActivityStartDate}.`,
                      ),
                    A.overrideActivityEndDate &&
                      (t.test(A.overrideActivityEndDate) &&
                      n.c9.fromISO(A.overrideActivityEndDate).isValid
                        ? A.multiday
                          ? A.overrideActivityStartDate &&
                            n.c9.fromISO(A.overrideActivityEndDate) <
                              n.c9.fromISO(A.overrideActivityStartDate) &&
                            e.push(
                              "overrideActivityEndDate cannot be before overrideActivityStartDate.",
                            )
                          : (console.warn(
                              "Warning: 'overrideActivityEndDate' is provided but 'multiday' is false. It will be ignored.",
                            ),
                            (A.overrideActivityEndDate = null))
                        : e.push(
                            `Invalid overrideActivityEndDate: ${A.overrideActivityEndDate}.`,
                          )),
                    A.multiday &&
                      A.activityDurationDaysFixed &&
                      A.overrideActivityStartDate &&
                      A.overrideActivityEndDate)
                  ) {
                    const t = n.c9.fromISO(A.overrideActivityStartDate),
                      i = n.c9.fromISO(A.overrideActivityEndDate);
                    if (t.isValid && i.isValid) {
                      const n = i.diff(t, "days").as("days") + 1,
                        o =
                          "number" == typeof A.activityDurationDaysFixed
                            ? A.activityDurationDaysFixed
                            : parseInt(A.activityDurationDaysFixed, 10);
                      n !== o &&
                        e.push(
                          `The duration between overrideActivityStartDate (${A.overrideActivityStartDate}) and overrideActivityEndDate (${A.overrideActivityEndDate}) is ${n} days, which contradicts the fixed duration of ${o} days.`,
                        );
                    }
                  }
                })(A, e),
                { errors: e, config: A }
              );
            })(this.config);
            this.config = t.config;
            const i = t.errors;
            if (
              ((this.apiService = new b(
                this.config,
                () => this._handleSessionExpired(),
                (A) => this.t(A),
              )),
              (this.connectionRenderer = new L({
                config: this.config,
                t: (A, e) => this.t(A, e),
                getTransportIcon: (A) => this.getTransportIcon(A),
                getTransportName: (A) => this.getTransportName(A),
              })),
              (this.container = document.getElementById(e)),
              this.container?.shadowRoot
                ? (this.shadowRoot = this.container.shadowRoot)
                : this.container &&
                  (this.shadowRoot = this.container.attachShadow({
                    mode: "open",
                  })),
              i.length > 0)
            )
              this._handleConfigErrors(i, e);
            else
              try {
                const A = new URLSearchParams(window.location.search).get(
                    "diana-share",
                  ),
                  t = !1 !== this.config.allowShareView && !!A;
                if (
                  (t && (this.config.shareId = A),
                  (this.config.readOnly = t),
                  null === this.config.shareURLPrefix &&
                    (this.config.shareURLPrefix = window.location.href),
                  !this.container)
                )
                  return void console.error(
                    `Container with ID "${e}" not found.`,
                  );
                if (
                  this.config.displayStartDate ||
                  this.config.displayEndDate
                ) {
                  const A = n.c9.now().startOf("day"),
                    e = this.config.displayStartDate
                      ? n.c9
                          .fromISO(this.config.displayStartDate)
                          .startOf("day")
                      : null,
                    t = this.config.displayEndDate
                      ? n.c9.fromISO(this.config.displayEndDate).startOf("day")
                      : null;
                  let i = !0;
                  if ((e && A < e && (i = !1), t && A > t && (i = !1), !i))
                    return (
                      this.container && (this.container.innerHTML = ""),
                      void console.info(
                        "DianaWidget: Current date is outside the display range. Widget will not be displayed.",
                      )
                    );
                }
                this.CACHE_KEY_USER_START_LOCATION = e + "_userStartLocation";
                const i = document.createElement("style");
                ((i.innerHTML = `\n              #${e} {\n                max-height: 790px;\n              }\n            `),
                  document.body.appendChild(i));
                let o = null,
                  g = null;
                if (
                  this.config.multiday &&
                  this.config.activityDurationDaysFixed
                )
                  if (this.config.overrideActivityEndDate) {
                    const A = n.c9.fromISO(
                      this.config.overrideActivityEndDate,
                      { zone: "utc" },
                    );
                    ((g = A.toJSDate()),
                      (o = A.minus({
                        days: this.config.activityDurationDaysFixed - 1,
                      }).toJSDate()));
                  } else if (this.config.overrideActivityStartDate) {
                    const A = n.c9.fromISO(
                      this.config.overrideActivityStartDate,
                      { zone: "utc" },
                    );
                    ((o = A.toJSDate()),
                      (g = A.plus({
                        days: this.config.activityDurationDaysFixed - 1,
                      }).toJSDate()));
                  } else if (
                    this.config.activityLatestEndTime &&
                    void 0 !== this.config.activityDurationMinutes
                  )
                    ((o = r(
                      this.config.timezone,
                      this.config.activityLatestEndTime,
                      this.config.activityDurationMinutes,
                    )),
                      (g = n.c9
                        .fromJSDate(o, { zone: "utc" })
                        .plus({
                          days: this.config.activityDurationDaysFixed - 1,
                        })
                        .toJSDate()));
                  else {
                    const A = n.c9
                      .now()
                      .setZone(this.config.timezone)
                      .startOf("day");
                    ((o = new Date(Date.UTC(A.year, A.month - 1, A.day))),
                      (g = n.c9
                        .fromJSDate(o, { zone: "utc" })
                        .plus({
                          days: this.config.activityDurationDaysFixed - 1,
                        })
                        .toJSDate()));
                  }
                if (!o)
                  if (this.config.overrideActivityStartDate)
                    o = n.c9
                      .fromISO(this.config.overrideActivityStartDate, {
                        zone: "utc",
                      })
                      .toJSDate();
                  else if (
                    this.config.activityLatestEndTime &&
                    void 0 !== this.config.activityDurationMinutes
                  )
                    o = r(
                      this.config.timezone,
                      this.config.activityLatestEndTime,
                      this.config.activityDurationMinutes,
                    );
                  else if (this.config.multiday) {
                    const A = n.c9
                      .now()
                      .setZone(this.config.timezone)
                      .startOf("day");
                    o = new Date(Date.UTC(A.year, A.month - 1, A.day));
                  }
                (this.config.multiday &&
                  !g &&
                  o &&
                  (g = this.config.overrideActivityEndDate
                    ? n.c9
                        .fromISO(this.config.overrideActivityEndDate, {
                          zone: "utc",
                        })
                        .toJSDate()
                    : n.c9
                        .fromJSDate(o, { zone: "utc" })
                        .plus({
                          days: this.config.activityDurationDaysFixed || 1,
                        })
                        .toJSDate()),
                  this.config.multiday &&
                    o &&
                    g &&
                    n.c9.fromJSDate(g, { zone: "utc" }) <
                      n.c9.fromJSDate(o, { zone: "utc" }) &&
                    (g = new Date(o.valueOf())),
                  (this.state.selectedDate = o),
                  (this.state.selectedEndDate = g),
                  A && this.config.allowShareView
                    ? this._loadFromShareID(A)
                    : this.initDOM().catch((A) => {
                        (console.error(
                          "Error during async DOM initialization:",
                          A,
                        ),
                          this._showFatalError(
                            this.t("errors.widgetLoadErrorTitle"),
                            A.message,
                          ));
                      }));
              } catch (A) {
                (console.error(
                  "Failed to initialize Diana GreenConnect Widget:",
                  A,
                ),
                  document.getElementById(e) && this._showFallbackUI());
              }
          }
          _applyExternalStyles() {
            if (!this.container || !this.dianaWidgetRootContainer) return;
            const A = getComputedStyle(this.container);
            [
              "--primary-color",
              "--secondary-color",
              "--success-color",
              "--warning-color",
              "--error-color",
              "--wait-color",
              "--text-primary",
              "--text-secondary",
              "--text-tertiary",
              "--text-muted",
              "--text-disabled",
              "--text-error",
              "--text-info",
              "--text-warning",
              "--icon-input-color",
              "--bg-primary",
              "--bg-secondary",
              "--bg-tertiary",
              "--bg-hover",
              "--bg-error",
              "--bg-info",
              "--bg-transparent",
              "--bg-waiting-block",
              "--border-primary",
              "--border-secondary",
              "--border-tertiary",
              "--border-error",
              "--border-info",
              "--shadow-verylight",
              "--shadow-light",
              "--shadow-medium",
              "--shadow-dark",
              "--shadow-gray",
            ].forEach((e) => {
              const t = A.getPropertyValue(e).trim();
              t &&
                this.dianaWidgetRootContainer &&
                this.dianaWidgetRootContainer.style.setProperty(e, t);
            });
          }
          _handleConfigErrors(A, e) {
            if (document.getElementById(e))
              if (this.config.dev) {
                const e = `Configuration Errors:\n- ${A.join("\n- ")}`;
                (console.error("Diana GreenConnect Widget: " + e),
                  this._showFatalError(
                    "Widget Configuration Error",
                    `<pre style="text-align: left; white-space: pre-wrap;">${e}</pre>`,
                  ));
              } else
                (console.error(
                  `Diana GreenConnect Widget: Configuration errors found. Showing fallback. Details: ${A.join(", ")}`,
                ),
                  this._showFallbackUI());
            else console.error(`Container with ID "${e}" not found.`);
          }
          _showFallbackUI() {
            this._showFatalError(
              this.t("errors.widgetLoadErrorTitle"),
              this.t("errors.api.internalError"),
            );
          }
          t(A, e = {}) {
            const t = A.split(".");
            let i = o[this.config.language];
            for (const A of t) if (((i = i?.[A]), !i)) break;
            if (!i && "EN" !== this.config.language) {
              let A = o.EN;
              for (const e of t) if (((A = A?.[e]), !A)) break;
              i = A;
            }
            let n = i || `[${A}]`;
            for (const A in e)
              if (Object.hasOwnProperty.call(e, A)) {
                const t = new RegExp(`{${A}}`, "g");
                n = n.replace(t, e[A]);
              }
            return n;
          }
          async initDOM() {
            this.uiManager = new I();
            const A = document.createElement("div");
            if (((A.className = "diana-container"), !this.shadowRoot)) return;
            this.shadowRoot.innerHTML = "";
            const t = document.createElement("style");
            ((t.textContent = e()),
              this.shadowRoot.appendChild(t),
              this.shadowRoot.appendChild(A),
              (this.dianaWidgetRootContainer = A),
              this._applyExternalStyles());
            const i = {
                config: this.config,
                t: (A) => this.t(A),
                state: this.state,
                formatDateForDisplay: g.hi,
                formatDatetime: d,
                getTransportIcon: (A) => this.getTransportIcon(A),
              },
              n = await this.uiManager.loadTemplate("formPageTemplate", i),
              o = await this.uiManager.loadTemplate("resultsPageTemplate", i),
              r = await this.uiManager.loadTemplate("contentPageTemplate", i);
            ((this.dianaWidgetRootContainer.innerHTML = `\n          <div id="activityModal" class="modal visible">\n            <div id="innerContainer" class="modal-content">\n              ${n}\n              ${o}\n              ${r}\n            </div>\n          </div>\n        `),
              this.cacheDOMElements(),
              (this.pageManager = new h(
                this.elements.formPage,
                this.elements.resultsPage,
                this.elements.innerContainer,
                this.elements.contentPage,
              )),
              this.setupAccessibility(),
              this.config.multiday
                ? (this.elements.activityDateStart &&
                    this.state.selectedDate &&
                    (this.elements.activityDateStart.value = d(
                      this.state.selectedDate,
                      this.config.timezone,
                    )),
                  this.elements.activityDateEnd &&
                    this.state.selectedEndDate &&
                    (this.elements.activityDateEnd.value = d(
                      this.state.selectedEndDate,
                      this.config.timezone,
                    )),
                  this.updateDateDisplay(
                    this.state.selectedDate,
                    "dateDisplayStart",
                  ),
                  this.updateDateDisplay(
                    this.state.selectedEndDate,
                    "dateDisplayEnd",
                  ))
                : this.elements.activityDate &&
                  this.state.selectedDate &&
                  (this.elements.activityDate.value = d(
                    this.state.selectedDate,
                    this.config.timezone,
                  )),
              this.setupEventListeners(),
              this._setupDateInput(),
              this._initCustomCalendar(),
              this._initializeOriginInputWithOverridesAndCache());
          }
          _setupDateInput() {
            if (
              !this.config.multiday &&
              !this.config.overrideActivityStartDate &&
              this.config.dateList
            ) {
              const A = n.c9.now().setZone(this.config.timezone).startOf("day"),
                e = this.config.dateList
                  .map((A) => n.c9.fromISO(A, { zone: "utc" }).startOf("day"))
                  .filter((e) => e >= A)
                  .sort((A, e) => A.toMillis() - e.toMillis());
              if (((this.state.availableDates = e), e.length > 0)) {
                const A = this.elements.dateSelectorButtonsGroup?.parentElement;
                if (A) {
                  ((A.innerHTML = ""), (A.className = "date-select-container"));
                  const t = document.createElement("label");
                  ((t.htmlFor = "diana-date-select"),
                    (t.textContent = this.t("activityDate")),
                    (t.className = "form-label"),
                    A.appendChild(t));
                  const i = document.createElement("select");
                  ((i.id = "diana-date-select"),
                    e.forEach((A) => {
                      const e = document.createElement("option"),
                        t = A.toISODate();
                      ((e.value = t || ""),
                        (e.textContent = this.formatDateForSelect(A)),
                        i.appendChild(e));
                    }),
                    A.appendChild(i),
                    (this.elements.dateSelect = i));
                  const o = e[0].toJSDate();
                  (this.onDateSelectedByButton(o),
                    i.addEventListener("change", (A) => {
                      const e = A.target.value,
                        t = n.c9.fromISO(e, { zone: "utc" }).toJSDate();
                      this.onDateSelectedByButton(t);
                    }));
                }
              }
            }
          }
          formatDateForSelect(A) {
            const e =
              {
                EN: "en-GB",
                DE: "de-DE",
                FR: "fr-FR",
                IT: "it-IT",
                TH: "th-TH",
                ES: "es-ES",
              }[this.config.language] ||
              (this.config.language
                ? `${this.config.language.toLowerCase()}-${this.config.language.toUpperCase()}`
                : "en-GB");
            return A.setLocale(e).toFormat("ccc, dd. MMM yyyy");
          }
          setSelectedDate(A) {
            try {
              const e = n.c9.fromISO(A, { zone: "utc" }).startOf("day");
              if (!e.isValid)
                return void console.error(
                  `DianaWidget.setSelectedDate: Invalid date string provided: "${A}"`,
                );
              if (e < n.c9.now().setZone(this.config.timezone).startOf("day"))
                return void console.warn(
                  `DianaWidget.setSelectedDate: Past date provided: "${A}". Date not set.`,
                );
              const t = e.toJSDate();
              if (this.elements.dateSelect) {
                const i = e.toISODate();
                Array.from(this.elements.dateSelect.options).some(
                  (A) => A.value === i,
                )
                  ? ((this.elements.dateSelect.value = i),
                    this.onDateSelectedByButton(t))
                  : console.warn(
                      `DianaWidget.setSelectedDate: Date "${A}" is not in the provided dateList.`,
                    );
              } else this.onDateSelectedByButton(t);
            } catch (A) {
              console.error(
                "DianaWidget.setSelectedDate: Error setting date.",
                A,
              );
            }
          }
          _initializeOriginInputWithOverridesAndCache() {
            if (!this.elements || !this.elements.originInput) return;
            const A = this.elements.originInput;
            if (this.config.overrideUserStartLocation) {
              if (
                ((A.value = this.config.overrideUserStartLocation),
                P(this.config.overrideUserStartLocationType))
              ) {
                const e = this.config.overrideUserStartLocation.split(",");
                2 === e.length &&
                  (A.setAttribute("data-lat", e[0].trim()),
                  A.setAttribute("data-lon", e[1].trim()));
              }
              return void (this.config.disableUserStartLocationField
                ? ((A.disabled = !0),
                  A.classList.add("disabled"),
                  this.elements.currentLocationBtn &&
                    (this.elements.currentLocationBtn.style.display = "none"),
                  this.elements.clearInputBtn &&
                    (this.elements.clearInputBtn.style.display = "none"))
                : this.elements.clearInputBtn &&
                  this.elements.currentLocationBtn &&
                  ((this.elements.clearInputBtn.style.display = "block"),
                  (this.elements.currentLocationBtn.style.display = "none")));
            }
            const e = this._getCachedStartLocation();
            (e &&
              ((A.value = e.value),
              e.lat &&
                e.lon &&
                (A.setAttribute("data-lat", e.lat),
                A.setAttribute("data-lon", e.lon))),
              this.elements.clearInputBtn &&
                this.elements.currentLocationBtn &&
                (A.value.trim()
                  ? ((this.elements.clearInputBtn.style.display = "block"),
                    (this.elements.currentLocationBtn.style.display = "none"))
                  : ((this.elements.clearInputBtn.style.display = "none"),
                    (this.elements.currentLocationBtn.style.display =
                      "block"))));
          }
          _shouldCacheUserStartLocation() {
            const A = this.config.cacheUserStartLocation;
            if ("function" == typeof A)
              try {
                return !!A();
              } catch (A) {
                return (
                  console.error(
                    "Error executing cacheUserStartLocation callback:",
                    A,
                  ),
                  !1
                );
              }
            return !!A;
          }
          _getCachedStartLocation() {
            if (!this._shouldCacheUserStartLocation()) return null;
            try {
              const A = localStorage.getItem(
                this.CACHE_KEY_USER_START_LOCATION,
              );
              if (!A) return null;
              const e = JSON.parse(A),
                t = Date.now(),
                i = 60 * this.config.userStartLocationCacheTTLMinutes * 1e3;
              return t < e.timestamp + i
                ? e
                : (localStorage.removeItem(this.CACHE_KEY_USER_START_LOCATION),
                  null);
            } catch (A) {
              return (
                console.error("Error retrieving cached start location:", A),
                null
              );
            }
          }
          _setCachedStartLocation(A, e, t) {
            if (this._shouldCacheUserStartLocation())
              try {
                const i = {
                  value: A,
                  lat: e ? e.toString() : null,
                  lon: t ? t.toString() : null,
                  timestamp: Date.now(),
                };
                localStorage.setItem(
                  this.CACHE_KEY_USER_START_LOCATION,
                  JSON.stringify(i),
                );
              } catch (A) {
                console.error("Error saving start location to cache:", A);
              }
          }
          cacheDOMElements() {
            this.shadowRoot
              ? (this.elements = {
                  modal: this.shadowRoot.querySelector("#activityModal"),
                  innerContainer:
                    this.shadowRoot.querySelector("#innerContainer"),
                  formPage: this.shadowRoot.querySelector("#formPage"),
                  resultsPage: this.shadowRoot.querySelector("#resultsPage"),
                  contentPage: this.shadowRoot.querySelector("#contentPage"),
                  originInput: this.shadowRoot.querySelector("#originInput"),
                  suggestionsContainer:
                    this.shadowRoot.querySelector("#suggestions"),
                  searchBtn: this.shadowRoot.querySelector("#searchBtn"),
                  backBtn: this.shadowRoot.querySelector("#backBtn"),
                  formErrorContainer: this.shadowRoot.querySelector(
                    "#formErrorContainer",
                  ),
                  formDebugContainer: this.shadowRoot.querySelector(
                    "#formDebugContainer",
                  ),
                  resultsErrorContainer: this.shadowRoot.querySelector(
                    "#resultsErrorContainer",
                  ),
                  resultsDebugContainer: this.shadowRoot.querySelector(
                    "#resultsDebugContainer",
                  ),
                  infoContainer:
                    this.shadowRoot.querySelector("#infoContainer"),
                  collapsibleToActivity: this.shadowRoot.querySelector(
                    "#collapsibleToActivity",
                  ),
                  collapsibleFromActivity: this.shadowRoot.querySelector(
                    "#collapsibleFromActivity",
                  ),
                  responseBox: this.shadowRoot.querySelector("#responseBox"),
                  responseBoxBottom: this.shadowRoot.querySelector(
                    "#responseBox-bottom",
                  ),
                  topSlider: this.shadowRoot.querySelector("#topSlider"),
                  bottomSlider: this.shadowRoot.querySelector("#bottomSlider"),
                  activityTimeBox:
                    this.shadowRoot.querySelector("#activity-time"),
                  currentLocationBtn: this.shadowRoot.querySelector(
                    "#currentLocationBtn",
                  ),
                  clearInputBtn:
                    this.shadowRoot.querySelector("#clearInputBtn"),
                  activityDateStart:
                    this.shadowRoot.querySelector("#activityDateStart"),
                  dateDisplayStart:
                    this.shadowRoot.querySelector("#dateDisplayStart"),
                  activityDateEnd:
                    this.shadowRoot.querySelector("#activityDateEnd"),
                  dateDisplayEnd:
                    this.shadowRoot.querySelector("#dateDisplayEnd"),
                  activityDate: this.shadowRoot.querySelector("#activityDate"),
                  dateDisplay: this.shadowRoot.querySelector("#dateDisplay"),
                  dateBtnToday: this.shadowRoot.querySelector("#dateBtnToday"),
                  dateBtnTomorrow:
                    this.shadowRoot.querySelector("#dateBtnTomorrow"),
                  dateBtnOther: this.shadowRoot.querySelector("#dateBtnOther"),
                  otherDateText:
                    this.shadowRoot.querySelector("#otherDateText"),
                  dateSelectorButtonsGroup: this.shadowRoot.querySelector(
                    ".date-selector-buttons",
                  ),
                  toActivityDateDisplay: this.shadowRoot.querySelector(
                    "#toActivityDateDisplay",
                  ),
                  fromActivityDateDisplay: this.shadowRoot.querySelector(
                    "#fromActivityDateDisplay",
                  ),
                  formPageMenuButton: this.shadowRoot.querySelector(
                    "#formPage .menu-btn-dots",
                  ),
                  resultsPageMenuButton: this.shadowRoot.querySelector(
                    "#resultsPage .menu-btn-dots",
                  ),
                  contentPageMenuButton: this.shadowRoot.querySelector(
                    "#contentPage .menu-btn-dots",
                  ),
                  formMenuDropdown:
                    this.shadowRoot.querySelector("#formMenuDropdown"),
                  resultsMenuDropdown: this.shadowRoot.querySelector(
                    "#resultsMenuDropdown",
                  ),
                  contentMenuDropdown: this.shadowRoot.querySelector(
                    "#contentMenuDropdown",
                  ),
                  contentPageBackBtn: this.shadowRoot.querySelector(
                    "#contentPageBackBtn",
                  ),
                  contentPageTitle:
                    this.shadowRoot.querySelector("#contentPageTitle"),
                  contentPageBody:
                    this.shadowRoot.querySelector("#contentPageBody"),
                })
              : (this.elements = {});
          }
          setupAccessibility() {
            this.elements &&
              (this.elements.originInput &&
                (this.elements.originInput.setAttribute(
                  "aria-autocomplete",
                  "list",
                ),
                this.elements.originInput.setAttribute(
                  "aria-controls",
                  "suggestions",
                ),
                this.elements.originInput.setAttribute(
                  "aria-expanded",
                  "false",
                )),
              this.config.multiday
                ? (this.elements.activityDateStart &&
                    this.elements.activityDateStart.setAttribute(
                      "aria-hidden",
                      "true",
                    ),
                  this.elements.activityDateEnd &&
                    this.elements.activityDateEnd.setAttribute(
                      "aria-hidden",
                      "true",
                    ))
                : this.elements.activityDate &&
                  this.elements.activityDate.setAttribute(
                    "aria-hidden",
                    "true",
                  ),
              this.elements.searchBtn &&
                this.elements.searchBtn.setAttribute(
                  "aria-label",
                  this.t("ariaLabels.searchButton"),
                ),
              this.elements.backBtn &&
                this.elements.backBtn.setAttribute(
                  "aria-label",
                  this.t("ariaLabels.backButton"),
                ),
              this.elements.contentPageBackBtn &&
                this.elements.contentPageBackBtn.setAttribute(
                  "aria-label",
                  this.t("ariaLabels.backButton"),
                ),
              this.elements.currentLocationBtn &&
                this.elements.currentLocationBtn.setAttribute(
                  "aria-label",
                  this.t("useCurrentLocation"),
                ),
              this.elements.clearInputBtn &&
                this.elements.clearInputBtn.setAttribute(
                  "aria-label",
                  this.t("clearInput"),
                ),
              this.elements.responseBox &&
                this.elements.responseBox.setAttribute("aria-busy", "false"),
              this.elements.responseBoxBottom &&
                this.elements.responseBoxBottom.setAttribute(
                  "aria-busy",
                  "false",
                ),
              this.elements.formPageMenuButton &&
                this.elements.formPageMenuButton.setAttribute(
                  "aria-label",
                  this.t("ariaLabels.menuButton"),
                ),
              this.elements.resultsPageMenuButton &&
                this.elements.resultsPageMenuButton.setAttribute(
                  "aria-label",
                  this.t("ariaLabels.menuButton"),
                ),
              this.elements.contentPageMenuButton &&
                this.elements.contentPageMenuButton.setAttribute(
                  "aria-label",
                  this.t("ariaLabels.menuButton"),
                ));
          }
          setupEventListeners() {
            if (!this.elements) return;
            ((!this.config.overrideUserStartLocation ||
              (this.config.overrideUserStartLocation &&
                !this.config.disableUserStartLocationField)) &&
              this.elements.originInput &&
              (this.elements.originInput.addEventListener("input", (A) => {
                (this.elements.originInput.removeAttribute("data-lat"),
                  this.elements.originInput.removeAttribute("data-lon"),
                  this.clearMessages());
                const e = A.target;
                (this.debouncedHandleAddressInput(e.value.trim()),
                  this.elements.clearInputBtn &&
                    this.elements.currentLocationBtn &&
                    (e.value.trim()
                      ? ((this.elements.clearInputBtn.style.display = "block"),
                        (this.elements.currentLocationBtn.style.display =
                          "none"))
                      : ((this.elements.clearInputBtn.style.display = "none"),
                        (this.elements.currentLocationBtn.style.display =
                          "block"))));
              }),
              this.elements.suggestionsContainer &&
                this.elements.suggestionsContainer.addEventListener(
                  "click",
                  (A) => {
                    const e = A.target;
                    e.classList.contains("suggestion-item") &&
                      this.handleSuggestionSelect(
                        e.dataset.value,
                        e.dataset.lat,
                        e.dataset.lon,
                      );
                  },
                ),
              this.elements.originInput.addEventListener("keydown", (A) => {
                "ArrowDown" === A.key || "ArrowUp" === A.key
                  ? this.handleSuggestionNavigation(A)
                  : "Enter" === A.key && this.handleSuggestionEnter(A);
              }),
              this.elements.currentLocationBtn &&
                this.elements.currentLocationBtn.addEventListener("click", () =>
                  this.handleCurrentLocation(),
                ),
              this.elements.clearInputBtn &&
                this.elements.clearInputBtn.addEventListener("click", () => {
                  this.elements.originInput &&
                    ((this.elements.originInput.value = ""),
                    this.elements.originInput.removeAttribute("data-lat"),
                    this.elements.originInput.removeAttribute("data-lon"),
                    this.elements.clearInputBtn &&
                      (this.elements.clearInputBtn.style.display = "none"),
                    this.elements.currentLocationBtn &&
                      (this.elements.currentLocationBtn.style.display =
                        "block"),
                    this.elements.originInput.focus(),
                    (this.state.suggestions = []),
                    this.renderSuggestions());
                })),
              this.elements.searchBtn &&
                this.elements.searchBtn.addEventListener("click", (A) => {
                  (A.preventDefault(), this.handleSearch());
                }),
              this.elements.backBtn &&
                this.elements.backBtn.addEventListener("click", () =>
                  this.navigateToForm(),
                ),
              this.elements.contentPageBackBtn &&
                this.elements.contentPageBackBtn.addEventListener("click", () =>
                  this.closeMenuOrContentPage(),
                ),
              this.elements.collapsibleToActivity?.addEventListener(
                "click",
                () => this.toggleCollapsible("to"),
              ),
              this.elements.collapsibleFromActivity?.addEventListener(
                "click",
                () => this.toggleCollapsible("from"),
              ),
              this.elements.responseBox &&
                this.elements.responseBox.addEventListener("click", (A) => {
                  (this.handleBuyTicketClick(A),
                    this.handleAlertExpandClick(A));
                }),
              this.elements.responseBoxBottom &&
                this.elements.responseBoxBottom.addEventListener(
                  "click",
                  (A) => {
                    (this.handleBuyTicketClick(A),
                      this.handleAlertExpandClick(A));
                  },
                ));
            const A = [
                this.elements.formPageMenuButton,
                this.elements.resultsPageMenuButton,
                this.elements.contentPageMenuButton,
              ],
              e = [
                this.elements.formMenuDropdown,
                this.elements.resultsMenuDropdown,
                this.elements.contentMenuDropdown,
              ];
            (A.forEach((A, t) => {
              A &&
                A.addEventListener("click", (A) => {
                  A.stopPropagation();
                  const i = e[t];
                  if (!i) return;
                  const n = "block" === i.style.display;
                  (e.forEach((A) => {
                    A && (A.style.display = "none");
                  }),
                    n || (i.style.display = "block"));
                });
            }),
              e.forEach((A) => {
                A &&
                  A.addEventListener("click", (A) => {
                    const t = A.target.closest(".menu-dropdown-item");
                    if (t) {
                      if (t.classList.contains("disabled"))
                        return void A.preventDefault();
                      ("shareMenuItem" === t.id
                        ? (A.preventDefault(), this.handleShare())
                        : t.dataset.contentKey &&
                          (A.preventDefault(),
                          this.navigateToContentPage(t.dataset.contentKey)),
                        e.forEach((A) => {
                          A && (A.style.display = "none");
                        }));
                    }
                  });
              }),
              document.addEventListener("click", (t) => {
                const i = t.target;
                ("block" !==
                  this.elements.suggestionsContainer?.style.display ||
                  this.elements.suggestionsContainer.contains(i) ||
                  !this.elements.originInput ||
                  this.elements.originInput.contains(i) ||
                  ((this.state.suggestions = []), this.renderSuggestions()),
                  A.some((A) => A && A.contains(i)) ||
                    e.some(
                      (A) => A && "block" === A.style.display && A.contains(i),
                    ) ||
                    e.forEach((A) => {
                      A && (A.style.display = "none");
                    }));
              }));
          }
          toggleCollapsible(A) {
            const e =
              "to" === A
                ? this.elements.collapsibleToActivity
                : this.elements.collapsibleFromActivity;
            e &&
              e.classList.contains("has-summary") &&
              e.classList.toggle("expanded");
          }
          _handleSessionExpired() {
            const A = [
              this.elements.originInput,
              this.elements.searchBtn,
              this.elements.currentLocationBtn,
              this.elements.clearInputBtn,
              this.elements.dateBtnToday,
              this.elements.dateBtnTomorrow,
              this.elements.dateBtnOther,
              this.elements.dateSelect,
              this.elements.activityDateStart,
              this.elements.activityDateEnd,
              this.elements.activityDate,
            ];
            if (
              (this.shadowRoot
                ?.querySelectorAll(".date-input-container")
                .forEach((A) => {
                  const e = A;
                  e &&
                    ((e.style.pointerEvents = "none"),
                    e.classList.add("disabled-by-session-expiry"));
                }),
              A.forEach((A) => {
                A &&
                  ((A.disabled = !0),
                  (A.style.pointerEvents = "none"),
                  A.classList.add("disabled-by-session-expiry"));
              }),
              this.elements.formErrorContainer)
            ) {
              const A = document.createElement("div");
              A.className = "session-expired-message";
              const e = document.createElement("span");
              ((e.textContent = this.t("errors.sessionExpired")),
                A.appendChild(e));
              const t = document.createElement("button");
              ((t.textContent = this.t("reloadPage")),
                (t.className = "reload-button"),
                (t.onclick = () => window.location.reload()),
                A.appendChild(t),
                (this.elements.formErrorContainer.innerHTML = ""),
                this.elements.formErrorContainer.appendChild(A),
                (this.elements.formErrorContainer.style.display = "block"),
                this.elements.formErrorContainer.setAttribute("role", "alert"));
            }
          }
          async _fetchApi(A, e = {}, t = !1) {
            if (!this.apiService) throw new Error("ApiService not initialized");
            return this.apiService.fetch(A, e, t);
          }
          async handleCurrentLocation() {
            if ((this.clearMessages(), navigator.geolocation)) {
              (this.elements.currentLocationBtn &&
                ((this.elements.currentLocationBtn.style.pointerEvents =
                  "none"),
                (this.elements.currentLocationBtn.style.opacity = "0.5")),
                this.elements.originInput &&
                  (this.elements.originInput.disabled = !0),
                this.showInfo(this.t("infos.fetchingLocation")));
              try {
                const A = await new Promise((A, e) => {
                    navigator.geolocation.getCurrentPosition(A, e, {
                      enableHighAccuracy: !0,
                      timeout: 1e4,
                      maximumAge: 0,
                    });
                  }),
                  { latitude: e, longitude: t } = A.coords;
                await this.fetchReverseGeocode(e, t);
              } catch (A) {
                let e = this.t("errors.geolocationError");
                const t = A;
                if (t.code)
                  switch (t.code) {
                    case t.PERMISSION_DENIED:
                      e = this.t("errors.geolocationPermissionDenied");
                      break;
                    case t.POSITION_UNAVAILABLE:
                      e = this.t("errors.geolocationPositionUnavailable");
                      break;
                    case t.TIMEOUT:
                      e = this.t("errors.geolocationTimeout");
                  }
                this.showError(e, "form");
              } finally {
                (this.elements.currentLocationBtn &&
                  ((this.elements.currentLocationBtn.style.pointerEvents =
                    "auto"),
                  (this.elements.currentLocationBtn.style.opacity = "1")),
                  this.elements.originInput &&
                    (this.elements.originInput.disabled = !1),
                  this.state.info === this.t("infos.fetchingLocation") &&
                    this.showInfo(null));
              }
            } else
              this.showError(this.t("errors.geolocationNotSupported"), "form");
          }
          async fetchReverseGeocode(A, e) {
            this.showInfo(this.t("infos.fetchingAddress"));
            try {
              const t = await this._fetchApi(
                  `${this.config.apiBaseUrl}/reverse-geocode?lat=${A}&lon=${e}`,
                  {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  },
                ),
                i = await t.json();
              if (
                !(
                  i.features &&
                  i.features.length > 0 &&
                  i.features[0].diana_properties &&
                  i.features[0].diana_properties.display_name
                )
              )
                throw new Error(this.t("errors.reverseGeocodeNoResults"));
              {
                const t = i.features[0].diana_properties.display_name;
                (this.elements.originInput &&
                  ((this.elements.originInput.value = t),
                  this.elements.originInput.setAttribute(
                    "data-lat",
                    A.toString(),
                  ),
                  this.elements.originInput.setAttribute(
                    "data-lon",
                    e.toString(),
                  )),
                  (this.state.suggestions = []),
                  this.renderSuggestions(),
                  this.clearMessages(),
                  this._setCachedStartLocation(t, A, e),
                  this.elements.clearInputBtn &&
                    (this.elements.clearInputBtn.style.display = "block"),
                  this.elements.currentLocationBtn &&
                    (this.elements.currentLocationBtn.style.display = "none"));
              }
            } catch (A) {
              if (A.isSessionExpired) return;
              let e;
              (console.error("Reverse geocode error:", A),
                (e =
                  A.body && "object" == typeof A.body && A.body.code
                    ? this.t((0, g.D0)(A.body.code))
                    : A.message &&
                        A.message.toLowerCase().includes("failed to fetch")
                      ? window.navigator.onLine
                        ? this.t("errors.api.apiUnreachable")
                        : this.t("errors.api.networkError")
                      : A.message || this.t("errors.reverseGeocodeFailed")),
                this.showError(e, "form"));
            } finally {
              this.state.info === this.t("infos.fetchingAddress") &&
                this.showInfo(null);
            }
          }
          async handleAddressInput(A) {
            if (A.length < 2)
              return (
                (this.state.suggestions = []),
                void this.renderSuggestions()
              );
            this.lastQuery = A;
            try {
              const e = await this.fetchSuggestions(A);
              A === this.lastQuery &&
                ((this.state.suggestions =
                  e && e.features && 0 !== e.features.length ? e.features : []),
                this.renderSuggestions());
            } catch (e) {
              if (A === this.lastQuery) {
                let A = this.t("errors.suggestionError");
                (e.message &&
                  e.message.toLowerCase().includes("failed to fetch") &&
                  (A = window.navigator.onLine
                    ? this.t("errors.api.apiUnreachable")
                    : this.t("errors.api.networkError")),
                  this.showError(A, "form"));
              }
            }
          }
          handleSuggestionSelect(A, e, t) {
            this.elements.originInput &&
              ((this.elements.originInput.value = A),
              this.elements.originInput.setAttribute("data-lat", e),
              this.elements.originInput.setAttribute("data-lon", t),
              (this.state.suggestions = []),
              this.renderSuggestions(),
              this.elements.originInput.focus(),
              this.clearMessages(),
              this._setCachedStartLocation(A, e, t),
              this.elements.clearInputBtn &&
                (this.elements.clearInputBtn.style.display = "block"),
              this.elements.currentLocationBtn &&
                (this.elements.currentLocationBtn.style.display = "none"));
          }
          handleSuggestionNavigation(A) {
            if (
              !this.elements.suggestionsContainer ||
              0 === this.state.suggestions.length
            )
              return;
            A.preventDefault();
            const e = Array.from(
              this.elements.suggestionsContainer.querySelectorAll(
                ".suggestion-item",
              ),
            );
            if (0 === e.length) return;
            let t = e.findIndex((A) =>
              A.classList.contains("active-suggestion"),
            );
            if (
              (e.forEach((A) => A.classList.remove("active-suggestion")),
              "ArrowDown" === A.key
                ? (t = (t + 1) % e.length)
                : "ArrowUp" === A.key && (t = (t - 1 + e.length) % e.length),
              t >= 0 && t < e.length)
            ) {
              const A = e[t];
              (A.classList.add("active-suggestion"),
                A.focus(),
                A.scrollIntoView({ block: "nearest", inline: "nearest" }),
                this.elements.originInput?.setAttribute(
                  "aria-activedescendant",
                  A.id || `suggestion-item-${t}`,
                ));
            }
          }
          handleSuggestionEnter(A) {
            if (
              !this.elements.suggestionsContainer ||
              0 === this.state.suggestions.length
            )
              return;
            const e = this.elements.suggestionsContainer.querySelector(
              ".suggestion-item.active-suggestion",
            );
            e
              ? (A.preventDefault(),
                this.handleSuggestionSelect(
                  e.dataset.value ?? "",
                  e.dataset.lat ?? "",
                  e.dataset.lon ?? "",
                ))
              : this.state.suggestions.length > 0 &&
                this.elements.originInput?.value.trim().length;
          }
          async handleSearch() {
            if (
              (this.loadingTextTimeout1 &&
                clearTimeout(this.loadingTextTimeout1),
              this.loadingTextTimeout2 &&
                clearTimeout(this.loadingTextTimeout2),
              (this.loadingTextTimeout1 = null),
              (this.loadingTextTimeout2 = null),
              this.clearMessages(),
              this.elements.collapsibleToActivity?.classList.remove("expanded"),
              this.elements.collapsibleFromActivity?.classList.remove(
                "expanded",
              ),
              !this.config.overrideUserStartLocation &&
                this.elements.originInput &&
                !this.elements.originInput.value)
            )
              return void this.showInfo(this.t("infos.originRequired"));
            const A =
              this.config.multiday &&
              this.config.activityDurationDaysFixed &&
              (this.config.overrideActivityStartDate ||
                this.config.overrideActivityEndDate);
            if (!A) {
              const A = this.config.multiday
                  ? this.elements.activityDateStart
                  : this.elements.activityDate,
                e = this.config.multiday ? this.elements.activityDateEnd : null;
              if (!(this.config.overrideActivityStartDate || (A && A.value)))
                return void this.showInfo(this.t("infos.dateRequired"));
              if (
                this.config.multiday &&
                !this.config.overrideActivityEndDate &&
                (!e || !e.value) &&
                !this.config.activityDurationDaysFixed
              )
                return void this.showInfo(this.t("infos.endDateRequired"));
            }
            if (
              (this.config.multiday || this.config.overrideActivityStartDate) &&
              this.config.multiday
            ) {
              if (!this.config.overrideActivityStartDate && !A) {
                const A = this.elements.activityDateStart?.value;
                A &&
                  (this.state.selectedDate = n.c9
                    .fromISO(A, { zone: "utc" })
                    .toJSDate());
              }
              this.config.overrideActivityEndDate ||
                A ||
                (this.elements.activityDateEnd?.value
                  ? (this.state.selectedEndDate = n.c9
                      .fromISO(this.elements.activityDateEnd.value, {
                        zone: "utc",
                      })
                      .toJSDate())
                  : this.config.activityDurationDaysFixed &&
                    this.state.selectedDate &&
                    (this.state.selectedEndDate = n.c9
                      .fromJSDate(this.state.selectedDate)
                      .plus({ days: this.config.activityDurationDaysFixed - 1 })
                      .toJSDate()));
            }
            if (
              this.config.multiday &&
              this.state.selectedDate &&
              this.state.selectedEndDate &&
              n.c9.fromJSDate(this.state.selectedDate).startOf("day") >
                n.c9.fromJSDate(this.state.selectedEndDate).startOf("day")
            )
              this.showInfo(this.t("infos.endDateAfterStartDate"));
            else {
              this.setLoadingState(!0);
              try {
                (await this.fetchActivityData(),
                  this.navigateToResults(),
                  this.slideToRecommendedConnections());
              } catch (A) {
                if (A.isSessionExpired) return void this.setLoadingState(!1);
                console.error("Search error:", A);
                let e = this.t("errors.connectionError"),
                  t = null;
                if (
                  A.message &&
                  A.message.toLowerCase().includes("failed to fetch")
                )
                  e = window.navigator.onLine
                    ? this.t("errors.api.apiUnreachable")
                    : this.t("errors.api.networkError");
                else if (A.response) {
                  ((t = A.response), (t = A.response.clone()));
                  try {
                    const t = await A.response.json();
                    t && t.code
                      ? (e = this.t((0, g.D0)(t.code)))
                      : t && t.error && (e = this.t("errors.api.unknown"));
                  } catch (A) {
                    e = this.t("errors.api.unknown");
                  }
                } else
                  A.message && (e = A.message || this.t("errors.api.unknown"));
                this.showError(e, "form", !1, t);
              } finally {
                this.setLoadingState(!1);
              }
            }
          }
          async fetchSuggestions(A) {
            try {
              const e = navigator.language.split("-")[0],
                t = await this._fetchApi(
                  `${this.config.apiBaseUrl}/address-autocomplete?q=${encodeURIComponent(A)}&lang=${e}`,
                );
              return await t.json();
            } catch (A) {
              if (A.isSessionExpired) return { features: [] };
              console.error("Suggestions error:", A);
              let e = this.t("errors.suggestionError");
              return (
                A.body && "object" == typeof A.body && A.body.code
                  ? (e = this.t((0, g.D0)(A.body.code)))
                  : A.message &&
                    A.message.toLowerCase().includes("failed to fetch") &&
                    (e = window.navigator.onLine
                      ? this.t("errors.api.apiUnreachable")
                      : this.t("errors.api.networkError")),
                this.showError(e, "form"),
                { features: [] }
              );
            }
          }
          async fetchActivityData() {
            const A = this.state.selectedDate;
            if (!A) throw new Error("Activity start date is not available.");
            const e =
                this.config.multiday && this.state.selectedEndDate
                  ? this.state.selectedEndDate
                  : A,
              t = a(
                this.config.activityEarliestStartTime ?? "00:00",
                A,
                this.config.timezone,
              ),
              i = a(
                this.config.activityLatestStartTime ?? "23:59",
                A,
                this.config.timezone,
              ),
              o = a(
                this.config.activityEarliestEndTime ?? "00:00",
                e,
                this.config.timezone,
              ),
              g = a(
                this.config.activityLatestEndTime ?? "23:59",
                e,
                this.config.timezone,
              ),
              r = {
                date: d(A, this.config.timezone),
                activity_name: this.config.activityName,
                activity_start_location: this.config.activityStartLocation,
                activity_start_location_type:
                  this.config.activityStartLocationType,
                activity_end_location: this.config.activityEndLocation,
                activity_end_location_type: this.config.activityEndLocationType,
                activity_earliest_start_time: t,
                activity_latest_start_time: i,
                activity_earliest_end_time: o,
                activity_latest_end_time: g,
                activity_duration_minutes: this.config.activityDurationMinutes,
              };
            if (this.config.multiday && this.state.selectedEndDate) {
              const e = n.c9.fromJSDate(A).startOf("day"),
                t = n.c9
                  .fromJSDate(this.state.selectedEndDate)
                  .startOf("day")
                  .diff(e, "days").days;
              ((r.activity_duration_days = Math.max(1, t + 1)),
                this.config.activityDurationMinutes ||
                  (r.activity_duration_minutes = 0));
            }
            (this.elements.originInput?.attributes["data-lat"] &&
            this.elements.originInput?.attributes["data-lon"]
              ? ((r.user_start_location = `${this.elements.originInput.attributes.getNamedItem("data-lat")?.value},${this.elements.originInput.attributes.getNamedItem("data-lon")?.value}`),
                (r.user_start_location_type = "coordinates"))
              : this.elements.originInput &&
                ((r.user_start_location = this.elements.originInput.value),
                (r.user_start_location_type = "address")),
              this.config.activityStartLocationDisplayName &&
                (r.activity_start_location_display_name =
                  this.config.activityStartLocationDisplayName),
              this.config.activityEndLocationDisplayName &&
                (r.activity_end_location_display_name =
                  this.config.activityEndLocationDisplayName),
              this.config.activityStartTimeLabel &&
                (r.activity_start_time_label =
                  this.config.activityStartTimeLabel),
              this.config.activityEndTimeLabel &&
                (r.activity_end_time_label = this.config.activityEndTimeLabel));
            const B = new URLSearchParams(r),
              s = await this._fetchApi(
                `${this.config.apiBaseUrl}/connections?${B}`,
              ),
              c = await s.json();
            if (
              !c?.connections?.from_activity ||
              !c?.connections?.to_activity
            ) {
              console.error(
                "API response missing expected connection data:",
                c,
              );
              const A = new Error(this.t("errors.api.invalidDataReceived"));
              throw (
                (A.response = {
                  json: async () => ({
                    error: "Invalid connection data",
                    code: "APP_INVALID_DATA",
                  }),
                  status: 500,
                }),
                A
              );
            }
            ((this.state.toConnections = c.connections.to_activity),
              (this.state.fromConnections = c.connections.from_activity),
              this.state.toConnections.forEach((A) => {
                A.connection_elements &&
                  A.connection_elements.length > 0 &&
                  ((A.connection_elements[0].isOriginalFirst = !0),
                  (A.connection_elements[
                    A.connection_elements.length - 1
                  ].isOriginalLast = !0));
              }),
              this.state.fromConnections.forEach((A) => {
                A.connection_elements &&
                  A.connection_elements.length > 0 &&
                  ((A.connection_elements[0].isOriginalFirst = !0),
                  (A.connection_elements[
                    A.connection_elements.length - 1
                  ].isOriginalLast = !0));
              }),
              this._processAndFilterConnections(this.state.toConnections, "to"),
              this._processAndFilterConnections(
                this.state.fromConnections,
                "from",
              ));
            const Q = c.connections.recommended_to_activity_connection,
              C = c.connections.recommended_from_activity_connection;
            ((this.state.recommendedToIndex =
              "number" == typeof Q &&
              Q >= 0 &&
              Q < this.state.toConnections.length
                ? Q
                : 0),
              (this.state.recommendedFromIndex =
                "number" == typeof C &&
                C >= 0 &&
                C < this.state.fromConnections.length
                  ? C
                  : 0),
              0 === this.state.toConnections.length &&
              0 === this.state.fromConnections.length
                ? console.warn("No connections received.")
                : 0 === this.state.toConnections.length
                  ? console.warn("No 'to_activity' connections received.")
                  : 0 === this.state.fromConnections.length &&
                    console.warn("No 'from_activity' connections received."),
              this.renderConnectionResults());
          }
          _getElementDurationMinutes(A) {
            return "number" == typeof A.duration
              ? A.duration
              : (function (A, e) {
                  if (!A || "string" != typeof A) return 0;
                  try {
                    const t = String(e("durationHoursShort")),
                      i = String(e("durationMinutesShort"));
                    if (A.includes(t)) {
                      const e = A.replace(t, "").split(":"),
                        i = parseInt(e[0], 10),
                        n = parseInt(e[1], 10);
                      return isNaN(i) || isNaN(n) ? 0 : 60 * i + n;
                    }
                    if (A.includes(i)) {
                      const e = parseInt(A.replace(i, "").trim(), 10);
                      return isNaN(e) ? 0 : e;
                    }
                  } catch (e) {
                    console.error(
                      "Error parsing duration string to minutes:",
                      A,
                      e,
                    );
                  }
                  return 0;
                })(
                  Q(A.departure_time, A.arrival_time, (A) => this.t(A)),
                  (A) => this.t(A),
                );
          }
          _processAndFilterConnections(A, e) {
            A.forEach((A) => {
              if (A.connection_elements && !(A.connection_elements.length <= 1))
                if ("to" === e) {
                  const e =
                    A.connection_elements[A.connection_elements.length - 1];
                  if (
                    this._getElementDurationMinutes(e) <= 5 &&
                    "WALK" === e.type
                  ) {
                    const e = A.connection_elements.pop();
                    A.connection_end_timestamp = e.departure_time;
                  }
                } else if ("from" === e) {
                  const e = A.connection_elements[0];
                  if (
                    this._getElementDurationMinutes(e) <= 5 &&
                    "WALK" === e.type
                  ) {
                    const e = A.connection_elements.shift();
                    A.connection_start_timestamp = e.arrival_time;
                  }
                }
            });
          }
          renderSuggestions() {
            this.elements.suggestionsContainer &&
              this.elements.originInput &&
              ((this.elements.suggestionsContainer.innerHTML =
                this.state.suggestions
                  .map(
                    (A) =>
                      `\n        <div class="suggestion-item" role="option" tabindex="0"\n             data-value="${A.diana_properties.display_name.replace(/"/g, '"')}"\n             data-location_type="${A.diana_properties.location_type}"\n             data-lat="${A.geometry.coordinates[1]}" data-lon="${A.geometry.coordinates[0]}">\n          ${A.diana_properties.display_name}\n        </div>`,
                  )
                  .join("")),
              (this.elements.suggestionsContainer.style.display =
                this.state.suggestions.length > 0 ? "block" : "none"),
              this.elements.originInput.setAttribute(
                "aria-expanded",
                this.state.suggestions.length > 0 ? "true" : "false",
              ));
          }
          _resetCollapsibleSummary(A) {
            if (!A) return;
            const e = A.querySelector(".summary-content-wrapper");
            (e &&
              (e.innerHTML = `<span class="summary-placeholder">${this.t("selectTimeSlotForSummary")}</span>`),
              A.classList.remove("has-summary", "expanded"));
          }
          renderConnectionResults() {
            if (
              (this.showError(null, "results"),
              this.elements.topSlider &&
                (this.elements.topSlider.innerHTML = ""),
              this.elements.bottomSlider &&
                (this.elements.bottomSlider.innerHTML = ""),
              this._resetCollapsibleSummary(
                this.elements.collapsibleToActivity,
              ),
              this._resetCollapsibleSummary(
                this.elements.collapsibleFromActivity,
              ),
              this.elements.activityTimeBox &&
                (this.elements.activityTimeBox.innerHTML =
                  this.config.activityName),
              0 === this.state.toConnections.length &&
                0 === this.state.fromConnections.length)
            )
              return (
                this.showError(
                  this.t("errors.api.noConnectionsFound"),
                  "results",
                ),
                this.navigateToForm(),
                void this.showError(
                  this.t("errors.api.noConnectionsFound"),
                  "form",
                )
              );
            if (0 === this.state.toConnections.length) {
              this.elements.responseBox &&
                (this.elements.responseBox.innerHTML = this.t(
                  "errors.api.noToConnectionsFound",
                ));
              const A = this.elements.collapsibleToActivity?.querySelector(
                ".summary-content-wrapper",
              );
              A &&
                (A.innerHTML = `<span class="summary-placeholder">${this.t("errors.api.noToConnectionsFound")}</span>`);
            } else
              (this.calculateAnytimeConnections(this.state.toConnections, "to"),
                this.renderTimeSlots(
                  "topSlider",
                  this.state.toConnections,
                  "to",
                ));
            if (0 === this.state.fromConnections.length) {
              this.elements.responseBoxBottom &&
                (this.elements.responseBoxBottom.innerHTML = this.t(
                  "errors.api.noFromConnectionsFound",
                ));
              const A = this.elements.collapsibleFromActivity?.querySelector(
                ".summary-content-wrapper",
              );
              A &&
                (A.innerHTML = `<span class="summary-placeholder">${this.t("errors.api.noFromConnectionsFound")}</span>`);
            } else
              (this.calculateAnytimeConnections(
                this.state.fromConnections,
                "from",
              ),
                this.renderTimeSlots(
                  "bottomSlider",
                  this.state.fromConnections,
                  "from",
                ));
            if (this.state.toConnections.length > 0) {
              let A = !1;
              for (let e = 0; e < this.state.toConnections.length; e++)
                if (
                  this.state.toConnections[e].connection_id ===
                  this.state.recommendedToIndex
                ) {
                  ((this.state.recommendedToIndex = e), (A = !0));
                  break;
                }
              A || (this.state.recommendedToIndex = 0);
            } else this.state.recommendedToIndex = 0;
            if (this.state.fromConnections.length > 0) {
              let A = !1;
              for (let e = 0; e < this.state.fromConnections.length; e++)
                if (
                  this.state.fromConnections[e].connection_id ===
                  this.state.recommendedFromIndex
                ) {
                  ((this.state.recommendedFromIndex = e), (A = !0));
                  break;
                }
              A || (this.state.recommendedFromIndex = 0);
            } else this.state.recommendedFromIndex = 0;
            if (
              this.state.toConnections.length > 0 &&
              this.state.recommendedToIndex < this.state.toConnections.length
            ) {
              const A = this.state.toConnections[this.state.recommendedToIndex];
              this.filterConnectionsByTime(
                "to",
                c(A.connection_start_timestamp, this.config.timezone),
                c(A.connection_end_timestamp, this.config.timezone),
              );
            }
            if (
              this.state.fromConnections.length > 0 &&
              this.state.recommendedFromIndex <
                this.state.fromConnections.length
            ) {
              const A =
                this.state.fromConnections[this.state.recommendedFromIndex];
              this.filterConnectionsByTime(
                "from",
                c(A.connection_start_timestamp, this.config.timezone),
                c(A.connection_end_timestamp, this.config.timezone),
              );
            }
            if (
              (1 === this.state.toConnections.length &&
                this.state.toConnections[0].connection_anytime &&
                this.elements.collapsibleToActivity &&
                this.elements.collapsibleToActivity.classList.add("expanded"),
              1 === this.state.fromConnections.length &&
                this.state.fromConnections[0].connection_anytime &&
                this.elements.collapsibleFromActivity &&
                this.elements.collapsibleFromActivity.classList.add("expanded"),
              this.addSwipeBehavior("topSlider"),
              this.addSwipeBehavior("bottomSlider"),
              this.state.preselectTimes)
            ) {
              const {
                toStart: A,
                toEnd: e,
                fromStart: t,
                fromEnd: i,
              } = this.state.preselectTimes;
              if (A && e && this.state.toConnections.length > 0) {
                const t = this.state.toConnections.find(
                  (t) =>
                    t.connection_start_timestamp === A &&
                    t.connection_end_timestamp === e,
                );
                if (t) {
                  const A = c(
                      t.connection_start_timestamp,
                      this.config.timezone,
                    ),
                    e = c(t.connection_end_timestamp, this.config.timezone);
                  this.filterConnectionsByTime("to", A, e);
                }
              }
              if (t && i && this.state.fromConnections.length > 0) {
                const A = this.state.fromConnections.find(
                  (A) =>
                    A.connection_start_timestamp === t &&
                    A.connection_end_timestamp === i,
                );
                if (A) {
                  const e = c(
                      A.connection_start_timestamp,
                      this.config.timezone,
                    ),
                    t = c(A.connection_end_timestamp, this.config.timezone);
                  this.filterConnectionsByTime("from", e, t);
                }
              }
              delete this.state.preselectTimes;
            }
            this.slideToRecommendedConnections();
          }
          renderTimeSlots(A, e, t) {
            const i = this.elements[A];
            if (!i) return;
            i.innerHTML = "";
            let o = null;
            e.forEach((A, e) => {
              const g = n.c9
                .fromISO(A.connection_start_timestamp, { zone: "utc" })
                .setZone(this.config.timezone)
                .toISODate();
              if (o !== g) {
                const e = document.createElement("div");
                (e.classList.add("slider-date-separator"),
                  (e.textContent = w(
                    A.connection_start_timestamp,
                    this.config.timezone,
                    this.config.language,
                    "dd. MMM",
                  )),
                  i.appendChild(e),
                  (o = g));
              }
              const r = c(A.connection_start_timestamp, this.config.timezone),
                a = c(A.connection_end_timestamp, this.config.timezone),
                B = Q(
                  A.connection_start_timestamp,
                  A.connection_end_timestamp,
                  (A) => this.t(A),
                ),
                s = A.connection_anytime,
                C = document.createElement("button");
              C.dataset.index = e;
              const l = s
                  ? this.getTransportIcon("WALK_BLACK")
                  : `\n                <div class="transfers-group">\n                  <span>${A.connection_transfers}</span>\n                  <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M14.8537 8.85354L12.8537 10.8535C12.7598 10.9474 12.6326 11.0001 12.4999 11.0001C12.3672 11.0001 12.24 10.9474 12.1462 10.8535C12.0523 10.7597 11.9996 10.6325 11.9996 10.4998C11.9996 10.3671 12.0523 10.2399 12.1462 10.146L13.293 8.99979H2.70678L3.85366 10.146C3.94748 10.2399 4.00018 10.3671 4.00018 10.4998C4.00018 10.6325 3.94748 10.7597 3.85366 10.8535C3.75983 10.9474 3.63259 11.0001 3.49991 11.0001C3.36722 11.0001 3.23998 10.9474 3.14616 10.8535L1.14616 8.85354C1.09967 8.8071 1.06279 8.75196 1.03763 8.69126C1.01246 8.63056 0.999512 8.5655 0.999512 8.49979C0.999512 8.43408 1.01246 8.36902 1.03763 8.30832C1.06279 8.24762 1.09967 8.19248 1.14616 8.14604L3.14616 6.14604C3.23998 6.05222 3.36722 5.99951 3.49991 5.99951C3.63259 5.99951 3.75983 6.05222 3.85366 6.14604C3.94748 6.23986 4.00018 6.36711 4.00018 6.49979C4.00018 6.63247 3.94748 6.75972 3.85366 6.85354L2.70678 7.99979H13.293L12.1462 6.85354C12.0523 6.75972 11.9996 6.63247 11.9996 6.49979C11.9996 6.36711 12.0523 6.23986 12.1462 6.14604C12.24 6.05222 12.3672 5.99951 12.4999 5.99951C12.6326 5.99951 12.7598 6.05222 12.8537 6.14604L14.8537 8.14604C14.9001 8.19248 14.937 8.24762 14.9622 8.30832C14.9873 8.36902 15.0003 8.43408 15.0003 8.49979C15.0003 8.5655 14.9873 8.63056 14.9622 8.69126C14.937 8.75196 14.9001 8.8071 14.8537 8.85354Z" fill="black"/>\n                  </svg>\n                </div>\n            `,
                E = "from" === t ? '<div class="duration-dot"></div>' : "";
              ((C.innerHTML = `\n                <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">\n                  <div style="font-size: 14px; margin-bottom: 4px; font-weight: bold;">${r} - ${a}</div>\n                  <div class="slider-button-details">\n                    <span>${B}</span>\n                    ${E}\n                    ${l}\n                  </div>\n                </div>`),
                C.addEventListener("click", () =>
                  this.filterConnectionsByTime(t, r, a),
                ),
                (("to" === t && e === this.state.recommendedToIndex) ||
                  ("from" === t && e === this.state.recommendedFromIndex)) &&
                  C.classList.add("active-time"),
                i.appendChild(C));
            });
          }
          calculateAnytimeConnections(A, e) {
            const t =
              this.config.multiday && "from" === e && this.state.selectedEndDate
                ? this.state.selectedEndDate
                : this.state.selectedDate;
            t &&
              A.forEach((A) => {
                if (
                  A.connection_anytime &&
                  A.connection_elements &&
                  A.connection_elements.length > 0
                ) {
                  const i = A.connection_elements[0].duration;
                  ("to" === e
                    ? ((A.connection_end_timestamp = B(
                        this.config.activityLatestStartTime ?? "23:59",
                        t,
                        this.config.timezone,
                      )),
                      (A.connection_start_timestamp = C(
                        A.connection_end_timestamp,
                        -i,
                      )))
                    : ((A.connection_start_timestamp = B(
                        this.config.activityEarliestEndTime ?? "00:00",
                        t,
                        this.config.timezone,
                      )),
                      (A.connection_end_timestamp = C(
                        A.connection_start_timestamp,
                        i,
                      ))),
                    (A.connection_elements[0].departure_time =
                      A.connection_start_timestamp),
                    (A.connection_elements[0].arrival_time =
                      A.connection_end_timestamp));
                }
              });
          }
          _renderConnectionSummary(A, e) {
            return this.connectionRenderer
              ? this.connectionRenderer.renderConnectionSummary(A, e, {
                  originInput: this.elements.originInput,
                })
              : "";
          }
          _updateOppositeSlider(A) {
            const {
                selectedToConnection: e,
                selectedFromConnection: t,
                toConnections: i,
                fromConnections: o,
              } = this.state,
              {
                topSlider: g,
                bottomSlider: r,
                collapsibleToActivity: a,
                collapsibleFromActivity: B,
              } = this.elements;
            if ("to" === A) {
              const A = r?.querySelectorAll("button") ?? [];
              if (!e)
                return (
                  A.forEach((A) => A.classList.remove("disabled")),
                  void this._updateFromConnectionDots()
                );
              const i = n.c9.fromISO(e.connection_end_timestamp, {
                zone: "utc",
              });
              if (
                (o.forEach((A, e) => {
                  const t = n.c9.fromISO(A.connection_start_timestamp, {
                      zone: "utc",
                    }),
                    o = r?.querySelector(`button[data-index="${e}"]`);
                  o &&
                    (t < i
                      ? o.classList.add("disabled")
                      : o.classList.remove("disabled"));
                }),
                t &&
                  n.c9.fromISO(t.connection_start_timestamp, { zone: "utc" }) <
                    i)
              ) {
                ((this.state.selectedFromConnection = null),
                  (this.state.activityTimes.end = ""),
                  (this.state.activityTimes.duration = ""));
                const A = B?.querySelector(".summary-content-wrapper");
                (A &&
                  ((A.innerHTML = `<span class="summary-placeholder">${this.t("selectTimeSlotForSummary")}</span>`),
                  B?.classList.remove("has-summary", "expanded")),
                  this.elements.responseBoxBottom &&
                    (this.elements.responseBoxBottom.innerHTML = ""),
                  r
                    ?.querySelectorAll("button.active-time")
                    .forEach((A) => A.classList.remove("active-time")),
                  this.elements.activityTimeBox &&
                    (this.elements.activityTimeBox.innerHTML =
                      this.getActivityTimeBoxHTML()));
              }
              this._updateFromConnectionDots();
            } else if ("from" === A) {
              const A = g?.querySelectorAll("button") ?? [];
              if (!t)
                return void A.forEach((A) => A.classList.remove("disabled"));
              const o = n.c9.fromISO(t.connection_start_timestamp, {
                zone: "utc",
              });
              if (
                (i.forEach((A, e) => {
                  const t = n.c9.fromISO(A.connection_end_timestamp, {
                      zone: "utc",
                    }),
                    i = g?.querySelector(`button[data-index="${e}"]`);
                  i &&
                    (t > o
                      ? i.classList.add("disabled")
                      : i.classList.remove("disabled"));
                }),
                e &&
                  n.c9.fromISO(e.connection_end_timestamp, { zone: "utc" }) > o)
              ) {
                ((this.state.selectedToConnection = null),
                  (this.state.activityTimes.start = ""),
                  (this.state.activityTimes.duration = ""));
                const A = a?.querySelector(".summary-content-wrapper");
                (A &&
                  ((A.innerHTML = `<span class="summary-placeholder">${this.t("selectTimeSlotForSummary")}</span>`),
                  a?.classList.remove("has-summary", "expanded")),
                  this.elements.responseBox &&
                    (this.elements.responseBox.innerHTML = ""),
                  g
                    ?.querySelectorAll("button.active-time")
                    .forEach((A) => A.classList.remove("active-time")),
                  this.elements.activityTimeBox &&
                    (this.elements.activityTimeBox.innerHTML =
                      this.getActivityTimeBoxHTML()),
                  this._updateFromConnectionDots());
              }
            }
          }
          filterConnectionsByTime(A, e, t) {
            const i =
                "from" === A
                  ? this.state.fromConnections
                  : this.state.toConnections,
              n = "from" === A ? "bottomSlider" : "topSlider",
              o =
                "from" === A
                  ? this.elements.responseBoxBottom
                  : this.elements.responseBox,
              g =
                "to" === A
                  ? this.elements.collapsibleToActivity
                  : this.elements.collapsibleFromActivity,
              r = g?.querySelector(".summary-content-wrapper"),
              a = this.elements[n];
            if (!a) return;
            a.querySelectorAll("button").forEach((A) => {
              A.classList.remove("active-time");
              const i = A.querySelector("div > div:first-child");
              i &&
                i.textContent?.includes(`${e} - ${t}`) &&
                A.classList.add("active-time");
            });
            const B = i.filter(
              (A) =>
                c(A.connection_start_timestamp, this.config.timezone) === e &&
                c(A.connection_end_timestamp, this.config.timezone) === t,
            );
            if (B.length > 0) {
              const e = B[0];
              (this.updateActivityTimeBox(e, A),
                o && (o.innerHTML = this.renderConnectionDetails(B, A)),
                r &&
                  g &&
                  ((r.innerHTML = this._renderConnectionSummary(e, A)),
                  g.classList.add("has-summary")),
                !this.elements.collapsibleToActivity ||
                  (1 === this.state.toConnections.length &&
                    this.state.toConnections[0].connection_anytime) ||
                  this.elements.collapsibleToActivity.classList.remove(
                    "expanded",
                  ),
                !this.elements.collapsibleFromActivity ||
                  (1 === this.state.fromConnections.length &&
                    this.state.fromConnections[0].connection_anytime) ||
                  this.elements.collapsibleFromActivity.classList.remove(
                    "expanded",
                  ),
                "to" === A
                  ? (this.state.selectedToConnection = e)
                  : (this.state.selectedFromConnection = e),
                this._updateOppositeSlider(A));
            } else
              (o &&
                (o.innerHTML = `<div>${this.t("noConnectionDetails")}</div>`),
                r &&
                  g &&
                  ((r.innerHTML = `<span class="summary-placeholder">${this.t("noConnectionDetails")}</span>`),
                  g.classList.remove("has-summary", "expanded")));
          }
          _updateFromConnectionDots() {
            if (this.config.multiday || !this.elements.bottomSlider) return;
            const A = parseInt(String(this.config.activityDurationMinutes), 10);
            if (!this.state.selectedToConnection)
              return void this.elements.bottomSlider
                .querySelectorAll(".duration-dot")
                .forEach((A) => {
                  A.className = "duration-dot";
                });
            const e = n.c9
              .fromISO(
                this.state.selectedToConnection.connection_end_timestamp,
                { zone: "utc" },
              )
              .setZone(this.config.timezone);
            this.state.fromConnections.forEach((t, i) => {
              const o = this.elements.bottomSlider?.querySelector(
                `button[data-index="${i}"]`,
              );
              if (!o) return;
              const g = o.querySelector(".duration-dot");
              if (!g) return;
              g.className = "duration-dot";
              const r = n.c9
                .fromISO(t.connection_start_timestamp, { zone: "utc" })
                .setZone(this.config.timezone);
              if (r < e) return;
              const a = l(e, r, (A) => this.t(A)).totalMinutes;
              a < A
                ? g.classList.add("dot-too-short")
                : a / A > 1.1 && g.classList.add("dot-too-long");
            });
          }
          updateActivityTimeBox(A, e) {
            if (A)
              try {
                const t = this.state.selectedDate,
                  i =
                    this.config.multiday && this.state.selectedEndDate
                      ? this.state.selectedEndDate
                      : t;
                if (!t || !i) return;
                const o = c(A.connection_start_timestamp, this.config.timezone),
                  g = c(A.connection_end_timestamp, this.config.timezone);
                if ("to" === e) {
                  const A = s(
                    this.config.activityEarliestStartTime ?? "00:00",
                    t,
                    this.config.timezone,
                  );
                  this.state.activityTimes.start = (function (A, e, t) {
                    try {
                      const i = n.c9.fromFormat(A, "HH:mm", { zone: t }),
                        o = n.c9.fromFormat(e, "HH:mm", { zone: t });
                      if (!i.isValid || !o.isValid)
                        throw new Error(
                          `Invalid time format for 'getLaterTime' comparison: ${A} or ${e}`,
                        );
                      return i > o ? i.toFormat("HH:mm") : o.toFormat("HH:mm");
                    } catch (t) {
                      return (
                        console.error(
                          "Error comparing times (getLaterTime):",
                          t,
                        ),
                        A || e || "--:--"
                      );
                    }
                  })(g, A, this.config.timezone);
                } else {
                  const A = s(
                    this.config.activityLatestEndTime ?? "23:59",
                    i,
                    this.config.timezone,
                  );
                  this.state.activityTimes.end = (function (A, e, t) {
                    try {
                      const i = n.c9.fromFormat(A, "HH:mm", { zone: t }),
                        o = n.c9.fromFormat(e, "HH:mm", { zone: t });
                      if (!i.isValid || !o.isValid)
                        throw new Error(
                          `Invalid time format for 'getEarlierTime' comparison: ${A} or ${e}`,
                        );
                      return i < o ? i.toFormat("HH:mm") : o.toFormat("HH:mm");
                    } catch (t) {
                      return (
                        console.error(
                          "Error comparing times (getEarlierTime):",
                          t,
                        ),
                        A || e || "--:--"
                      );
                    }
                  })(o, A, this.config.timezone);
                }
                if (
                  !this.config.multiday &&
                  this.state.activityTimes.start &&
                  this.state.activityTimes.end &&
                  t
                ) {
                  const A = l(
                    n.c9
                      .fromFormat(this.state.activityTimes.start, "HH:mm", {
                        zone: this.config.timezone,
                      })
                      .set({
                        year: t.getFullYear(),
                        month: t.getMonth() + 1,
                        day: t.getDate(),
                      }),
                    n.c9
                      .fromFormat(this.state.activityTimes.end, "HH:mm", {
                        zone: this.config.timezone,
                      })
                      .set({
                        year: t.getFullYear(),
                        month: t.getMonth() + 1,
                        day: t.getDate(),
                      }),
                    (A) => this.t(A),
                  );
                  this.state.activityTimes.warningDuration =
                    A.totalMinutes <
                    parseInt(String(this.config.activityDurationMinutes), 10);
                } else this.state.activityTimes.warningDuration = !1;
                this.elements.activityTimeBox &&
                  (this.elements.activityTimeBox.innerHTML =
                    this.getActivityTimeBoxHTML());
              } catch (A) {
                (console.error("Error updating activity time box:", A),
                  this.elements.activityTimeBox &&
                    (this.elements.activityTimeBox.innerHTML = `<div class="error-message">${this.t("errors.activityTimeError")}</div>`));
              }
          }
          getActivityTimeBoxHTML() {
            try {
              const A = this.state.selectedDate,
                e =
                  this.config.multiday && this.state.selectedEndDate
                    ? this.state.selectedEndDate
                    : A;
              if (!A)
                return `<div class="activity-time-placeholder">${this.config.activityName}</div>`;
              const t = parseInt(
                String(this.config.activityDurationMinutes),
                10,
              );
              let i,
                o = "";
              if (
                this.config.multiday &&
                A &&
                e &&
                n.c9.fromJSDate(e).startOf("day") >
                  n.c9.fromJSDate(A).startOf("day") &&
                e
              ) {
                const t =
                    Math.round(
                      n.c9.fromJSDate(e).diff(n.c9.fromJSDate(A), "days").days,
                    ) + 1,
                  o = t - 1,
                  g = 1 === t ? this.t("daySg") : this.t("dayPl");
                i =
                  o > 0
                    ? `<span>${t} ${g} / ${o} ${1 === o ? this.t("nightSg") : this.t("nightPl")}</span>`
                    : `<span>${t} ${g}</span>`;
              } else if (
                this.state.activityTimes.start &&
                this.state.activityTimes.end
              ) {
                const e = n.c9
                    .fromFormat(this.state.activityTimes.start, "HH:mm", {
                      zone: this.config.timezone,
                    })
                    .set({
                      year: A.getFullYear(),
                      month: A.getMonth() + 1,
                      day: A.getDate(),
                    }),
                  g = n.c9
                    .fromFormat(this.state.activityTimes.end, "HH:mm", {
                      zone: this.config.timezone,
                    })
                    .set({
                      year: A.getFullYear(),
                      month: A.getMonth() + 1,
                      day: A.getDate(),
                    });
                if (g < e) i = "<span>--</span>";
                else {
                  const A = l(e, g, (A) => this.t(A));
                  ((this.state.activityTimes.duration = A.text),
                    (i = `<span>${A.text}</span>`));
                  const n = A.totalMinutes,
                    r = n - t;
                  if (r < 0) {
                    const A = `${E(Math.abs(r), (A) => this.t(A))} ${this.t("warnings.durationShorter")}`;
                    o = `\n                                <div class="activity-duration-warning-wrapper">\n                                    <span class="warning-icon-wrapper">\n                                        <svg style="fill: var(--error-color); color: var(--error-color);" width="18" height="18" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 29.3459 49.1765 C 30.6543 49.1765 31.7945 48.5597 34.2618 48.5597 C 36.7292 48.5597 37.4018 49.1765 39.2335 49.1765 C 42.0001 49.1765 43.4582 48.0176 43.4582 46.0924 C 43.4582 42.8027 39.8694 40.5971 34.2431 40.5971 C 31.4767 40.5971 30.2244 40.8587 28.6730 41.2513 L 26.6542 36.6531 C 24.6542 32.2419 21.4767 29.3634 16.9533 29.3634 L 14.7477 29.3634 C 14.0187 29.3634 13.5327 29.0456 13.5327 28.3353 C 13.5327 27.1765 15.0841 26.8961 16.7851 26.8961 C 22.2430 26.8961 26.2991 29.9054 28.7664 35.9615 L 30.0374 39.0830 C 31.3085 38.8213 32.6730 38.6905 34.0562 38.6905 C 35.1590 38.6905 36.1684 38.7653 37.2338 38.9148 C 38.3554 38.0737 39.6638 37.1952 41.5514 36.3727 C 43.6450 37.7933 46.0188 38.7092 48.5234 38.7092 C 53.6825 38.7092 56.0000 37.5877 56.0000 32.7092 C 56.0000 26.8213 51.7382 22.4101 46.0750 22.4288 L 41.0469 15.7559 C 38.2245 12.0923 34.8786 10.3353 31.5701 10.3353 C 28.8412 10.3353 24.7851 11.9054 24.7851 14.1110 C 24.7851 15.6064 27.8131 17.6998 30.1496 19.1391 L 40.9160 25.7185 C 40.0749 26.5223 39.3086 26.9522 38.3925 26.9522 C 36.9348 26.9522 35.4392 26.0737 33.1777 24.7653 C 27.4019 21.4382 22.9720 18.3167 16.9907 18.3167 C 10.7664 18.3167 6.0374 21.8867 3.5140 28.8400 C 1.5140 28.8400 0 30.1485 0 32.0737 C 0 34.2419 1.7196 35.6064 4.0748 35.6064 C 6.8038 39.4195 11.2711 40.9522 16.5608 40.9522 C 16.8412 40.9522 17.1215 40.9335 17.4019 40.9335 L 24.9720 47.2139 C 26.8412 48.9148 27.9253 49.1765 29.3459 49.1765 Z M 48.0936 31.8120 C 47.2525 31.8120 46.5796 31.1017 46.5796 30.2793 C 46.5796 29.4382 47.2713 28.6905 48.1123 28.6905 C 48.9721 28.6905 49.6263 29.3634 49.6263 30.2045 C 49.6263 31.0456 48.9346 31.8120 48.0936 31.8120 Z M 15.8318 50.6531 C 19.4393 50.6531 21.6262 49.9616 23.4206 48.7279 L 17.6449 43.9055 C 17.3832 43.9242 17.0655 43.9616 16.6729 43.9616 C 15.7383 43.9616 14.3552 43.6812 12.7103 43.6812 C 10.6168 43.6812 9.3271 44.8027 9.3271 46.4849 C 9.3271 48.9896 11.8692 50.6531 15.8318 50.6531 Z"></path></g></svg>\n                                        <span class="warning-tooltip">${`${this.t("warnings.duration")} (${E(t, (A) => this.t(A))})`}</span>\n                                        <span>${A}</span>\n                                    </span>\n                                </div>`;
                  } else if (r > 0 && n / t > 1.1) {
                    const A = `${E(r, (A) => this.t(A))} ${this.t("warnings.durationLonger")}`;
                    o = `\n                                <div class="activity-duration-warning-wrapper">\n                                    <span class="warning-icon-wrapper">\n                                        <svg style="fill: var(--primary-color); color: var(--primary-color);" width="18" height="18" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 4.8942 42.0850 C 8.1403 42.0850 11.4863 40.6700 14.1332 37.9400 C 15.9810 38.9388 17.7789 39.8544 20.4590 39.8544 C 23.3888 39.8544 25.2200 39.0886 26.8680 38.1730 C 29.4317 40.7200 32.7443 42.1183 35.9238 42.1183 C 38.5708 42.1183 40.5850 41.0196 40.5850 38.9887 C 40.5850 37.0577 39.1534 36.2586 37.2057 35.7259 C 36.7062 35.5928 36.2068 35.4762 35.7077 35.3431 C 43.0986 35.1932 43.1818 31.4477 48.1426 31.4477 C 52.6541 31.4477 56.0000 29.8829 56.0000 26.7866 C 56.0000 20.1611 52.2045 16.6320 47.7932 16.6320 C 43.2653 16.6320 40.8512 19.4952 39.8857 23.2574 C 39.3365 25.3050 38.3710 26.5868 36.9060 27.3193 L 35.8573 25.3882 C 31.4958 17.2479 27.3674 13.9851 20.6920 13.9685 C 13.4673 13.9851 9.7717 17.1314 4.3948 27.3193 C 2.7634 30.4322 0 31.1148 0 33.0624 C 0 34.4275 1.0488 35.3431 3.1629 35.3431 L 4.8775 35.3431 C 4.1617 35.5428 3.4459 35.7259 2.7967 35.9590 C 1.2319 36.5083 .2331 37.3407 .2331 38.9388 C .2331 40.9697 2.2473 42.0850 4.8942 42.0850 Z M 20.6920 16.6154 C 25.1867 16.6154 28.0499 18.6296 30.3805 21.6094 C 27.6338 23.9233 24.3044 25.2218 20.4923 25.2218 C 16.7301 25.2218 13.4507 23.9899 10.7539 21.7259 C 13.6005 17.9471 16.3971 16.6154 20.6920 16.6154 Z M 40.5018 31.9305 C 39.7361 31.3478 38.8537 30.2491 38.3212 29.3169 C 40.1356 28.6344 41.3507 27.4191 42.0666 24.5725 C 42.8658 21.1433 44.6969 19.1457 47.7932 19.1457 C 50.9727 19.1457 53.6196 22.0755 53.6196 26.3871 C 53.6196 27.9852 51.1725 29.0172 48.6421 29.0172 C 44.7634 29.0172 42.6326 30.5654 40.5018 31.9305 Z M 48.2759 25.1219 C 49.0083 25.1219 49.5909 24.5226 49.5909 23.7901 C 49.5909 23.0577 49.0083 22.4750 48.2759 22.4750 C 47.5433 22.4750 46.9606 23.0577 46.9606 23.7901 C 46.9606 24.5226 47.5433 25.1219 48.2759 25.1219 Z M 33.7098 26.8199 C 34.8584 28.8674 36.3234 31.1980 37.8050 32.6629 C 37.1225 32.6796 36.3401 32.6629 35.5409 32.6629 C 33.0607 32.6629 31.2129 33.1124 29.6647 33.7283 C 28.0499 31.5809 26.8847 28.5345 26.6183 26.2705 C 28.5660 25.5381 30.2307 24.5060 31.6291 23.3573 C 32.3447 24.4394 33.0273 25.6047 33.7098 26.8199 Z M 5.8264 32.6629 C 4.9774 32.6629 4.1118 32.6796 3.3460 32.7295 L 3.2129 32.4964 C 4.3448 31.5476 5.7598 30.3490 6.7586 28.3514 C 7.7408 26.4703 8.6397 24.8722 9.5220 23.4905 C 10.9203 24.6391 12.6350 25.6879 14.6825 26.4037 C 14.3496 28.5844 13.1510 31.6475 11.6195 33.7283 C 10.1046 33.1124 8.2735 32.6629 5.8264 32.6629 Z M 20.4590 37.2075 C 17.5458 37.2075 15.7646 35.8425 13.4673 34.6106 C 15.0155 32.4132 16.1641 29.3835 16.4970 26.9198 C 17.7289 27.2028 19.0606 27.3692 20.4923 27.3692 C 22.0238 27.3692 23.4388 27.1694 24.7539 26.8532 C 25.0036 29.4168 26.1855 32.4465 27.8002 34.6272 C 25.4863 35.8591 23.6219 37.2075 20.4590 37.2075 Z M 2.7134 38.5892 C 2.7134 37.9899 3.1463 37.5904 4.4281 37.2741 C 5.2105 37.0743 7.2913 36.4251 8.8062 35.7093 C 9.9382 35.9590 10.9203 36.3252 11.8026 36.7414 C 9.2557 38.8888 6.9750 39.8544 4.9108 39.8544 C 3.4459 39.8544 2.7134 39.3882 2.7134 38.5892 Z M 36.3902 37.3240 C 37.6717 37.6403 38.1047 38.0398 38.1047 38.6391 C 38.1047 39.4215 37.3721 39.8876 35.9071 39.8876 C 33.8762 39.8876 31.6291 38.9554 29.1320 36.8912 C 29.9810 36.4251 30.8965 36.0256 31.9786 35.7426 C 33.4770 36.4584 35.6078 37.1076 36.3902 37.3240 Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g></svg>\n                                        <span class="warning-tooltip">${`${this.t("warnings.duration")} (${E(t, (A) => this.t(A))})`}</span>\n                                        <span>${A}</span>\n                                    </span>\n                                </div>`;
                  }
                }
              } else i = "<span>--</span>";
              const g = this.config.language.split("-")[0],
                r =
                  this.config.activityStartLocationDisplayName ||
                  this.config.activityStartLocation,
                a =
                  this.config.activityEndLocationDisplayName ||
                  this.config.activityEndLocation,
                B = e ?? A,
                s = this.state.activityTimes.start
                  ? `${w(A.toISOString(), this.config.timezone, g)} ${this.state.activityTimes.start}`
                  : "--",
                c = this.state.activityTimes.end
                  ? `${w(B.toISOString(), this.config.timezone, g)} ${this.state.activityTimes.end}`
                  : "--",
                Q = r ? `${r}` : "--",
                C = a ? `${a}` : "--";
              return `\n            <div class="activity-time-card">\n                <div class="activity-timeline">\n                    <div class="timeline-line"></div>\n                    <div class="timeline-dot top"></div>\n                    <div class="timeline-dot bottom"></div>\n                </div>\n                <div class="activity-time-content">\n                    <div class="element-time-location-group">\n                        <div class="element-time">${s}</div>\n                        <div class="element-location">${Q}</div>\n                    </div>\n                    <div class="activity-main-info">\n                        <div class="activity-title">${this.config.activityName}</div>\n                        <div class="activity-duration-line">\n                           ${i}\n                           ${o}\n                        </div>\n                    </div>\n                    <div class="element-time-location-group">\n                        <div class="element-time">${c}</div>\n                        <div class="element-location">${C}</div>\n                    </div>\n                </div>\n            </div>`;
            } catch (A) {
              return (
                console.error("Error getting activity time box HTML:", A),
                `<div class="error-message">${this.t("errors.activityTimeError")}</div>`
              );
            }
          }
          async handleBuyTicketClick(A) {
            const e = A.target.closest(".ticket-button");
            if (!e) return;
            (A.stopPropagation(), this.clearMessages());
            const t =
              "to" === e.dataset.connType
                ? this.state.selectedToConnection
                : this.state.selectedFromConnection;
            if (!t)
              return void console.error(
                "No selected connection found to generate ticket link.",
              );
            const i = e.innerHTML;
            ((e.innerHTML = '<span class="loading-spinner-small"></span>'),
              (e.disabled = !0));
            try {
              const A = await this._fetchApi(
                  `${this.config.apiBaseUrl}/generate-ticketshop-link`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      connection_elements: t.connection_elements,
                    }),
                  },
                ),
                e = await A.json();
              if (!e.ticketshop_url)
                throw new Error("No ticketshop URL returned from the server.");
              window.open(e.ticketshop_url, "_blank");
            } catch (A) {
              const e = A;
              if (e.isSessionExpired) return;
              (console.error("Error fetching ticketshop link:", A),
                this.showError(
                  e.message || this.t("errors.api.internalError"),
                  "results",
                  !0,
                ));
            } finally {
              ((e.innerHTML = i), (e.disabled = !1));
            }
          }
          handleAlertExpandClick(A) {
            const e = A.target.closest(".connection-element-alert");
            e &&
              ("A" !== A.target.tagName
                ? (A.stopPropagation(),
                  e
                    .querySelectorAll(".expandable")
                    .forEach((A) => A.classList.toggle("expanded")))
                : A.stopPropagation());
          }
          renderConnectionDetails(A, e) {
            return this.connectionRenderer
              ? this.connectionRenderer.renderConnectionDetails(
                  A,
                  e,
                  this.state,
                  { originInput: this.elements.originInput },
                )
              : `<div>${this.t("noConnectionDetails")}</div>`;
          }
          getTransportName(A) {
            const e = this.t(`vehicles.${A}`);
            return e && !e.startsWith("[vehicles.") ? e : this.t("vehicles.20");
          }
          getTransportIcon(A) {
            const e = {
              1: '<svg width="16" height="16" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 0.5H2.5C1.96957 0.5 1.46086 0.710714 1.08579 1.08579C0.710714 1.46086 0.5 1.96957 0.5 2.5V10.5C0.5 11.0304 0.710714 11.5391 1.08579 11.9142C1.46086 12.2893 1.96957 12.5 2.5 12.5H3L2.1 13.7C2.0606 13.7525 2.03194 13.8123 2.01564 13.8759C1.99935 13.9395 1.99574 14.0057 2.00503 14.0707C2.01431 14.1357 2.03631 14.1982 2.06976 14.2547C2.10322 14.3112 2.14747 14.3606 2.2 14.4C2.25253 14.4394 2.3123 14.4681 2.37591 14.4844C2.43952 14.5007 2.50571 14.5043 2.57071 14.495C2.63571 14.4857 2.69825 14.4637 2.75475 14.4302C2.81125 14.3968 2.8606 14.3525 2.9 14.3L4.25 12.5H7.75L9.1 14.3C9.17957 14.4061 9.29801 14.4762 9.42929 14.495C9.56056 14.5137 9.69391 14.4796 9.8 14.4C9.90609 14.3204 9.97622 14.202 9.99498 14.0707C10.0137 13.9394 9.97956 13.8061 9.9 13.7L9 12.5H9.5C10.0304 12.5 10.5391 12.2893 10.9142 11.9142C11.2893 11.5391 11.5 11.0304 11.5 10.5V2.5C11.5 1.96957 11.2893 1.46086 10.9142 1.08579C10.5391 0.710714 10.0304 0.5 9.5 0.5ZM2.5 1.5H9.5C9.76522 1.5 10.0196 1.60536 10.2071 1.79289C10.3946 1.98043 10.5 2.23478 10.5 2.5V6.5H1.5V2.5C1.5 2.23478 1.60536 1.98043 1.79289 1.79289C1.98043 1.60536 2.23478 1.5 2.5 1.5ZM9.5 11.5H2.5C2.23478 11.5 1.98043 11.3946 1.79289 11.2071C1.60536 11.0196 1.5 10.7652 1.5 10.5V7.5H10.5V10.5C10.5 10.7652 10.3946 11.0196 10.2071 11.2071C10.0196 11.3946 9.76522 11.5 9.5 11.5ZM4 9.75C4 9.89834 3.95601 10.0433 3.8736 10.1667C3.79119 10.29 3.67406 10.3861 3.53701 10.4429C3.39997 10.4997 3.24917 10.5145 3.10368 10.4856C2.9582 10.4567 2.82456 10.3852 2.71967 10.2803C2.61478 10.1754 2.54335 10.0418 2.51441 9.89632C2.48547 9.75083 2.50032 9.60003 2.55709 9.46299C2.61386 9.32594 2.70999 9.20881 2.83332 9.1264C2.95666 9.04399 3.10166 9 3.25 9C3.44891 9 3.63968 9.07902 3.78033 9.21967C3.92098 9.36032 4 9.55109 4 9.75ZM9.5 9.75C9.5 9.89834 9.45601 10.0433 9.3736 10.1667C9.29119 10.29 9.17406 10.3861 9.03701 10.4429C8.89997 10.4997 8.74917 10.5145 8.60368 10.4856C8.4582 10.4567 8.32456 10.3852 8.21967 10.2803C8.11478 10.1754 8.04335 10.0418 8.01441 9.89632C7.98547 9.75083 8.00033 9.60003 8.05709 9.46299C8.11386 9.32594 8.20999 9.20881 8.33332 9.1264C8.45666 9.04399 8.60166 9 8.75 9C8.94891 9 9.13968 9.07902 9.28033 9.21967C9.42098 9.36032 9.5 9.55109 9.5 9.75Z" fill="#34C759"/></svg>',
              2: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg>',
              3: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.5 3L17.5135 2.50675C17.1355 2.31776 16.9465 2.22326 16.7485 2.15662C16.5725 2.09744 16.3915 2.05471 16.2077 2.02897C16.0008 2 15.7895 2 15.3669 2H8.63313C8.21053 2 7.99923 2 7.79227 2.02897C7.60847 2.05471 7.42745 2.09744 7.25155 2.15662C7.05348 2.22326 6.86449 2.31776 6.4865 2.50675L5.5 3M11 6L9 2M13 6L15 2M4 13H20M17 20L18 22M7 20L6.00016 22M8.5 16.5H8.51M15.5 16.5H15.51M8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V10.8C20 9.11984 20 8.27976 19.673 7.63803C19.3854 7.07354 18.9265 6.6146 18.362 6.32698C17.7202 6 16.8802 6 15.2 6H8.8C7.11984 6 6.27976 6 5.63803 6.32698C5.07354 6.6146 4.6146 7.07354 4.32698 7.63803C4 8.27976 4 9.11984 4 10.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20ZM9 16.5C9 16.7761 8.77614 17 8.5 17C8.22386 17 8 16.7761 8 16.5C8 16.2239 8.22386 16 8.5 16C8.77614 16 9 16.2239 9 16.5ZM16 16.5C16 16.7761 15.7761 17 15.5 17C15.2239 17 15 16.7761 15 16.5C15 16.2239 15.2239 16 15.5 16C15.7761 16 16 16.2239 16 16.5Z" stroke="#34C759" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
              4: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.5 22H14.5M8 2H16M12 5V2M4 12H20M17 19L18.5 22M7 19L5.5 22M8.5 15.5H8.51M15.5 15.5H15.51M8.8 19H15.2C16.8802 19 17.7202 19 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C20 16.7202 20 15.8802 20 14.2V9.8C20 8.11984 20 7.27976 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C17.7202 5 16.8802 5 15.2 5H8.8C7.11984 5 6.27976 5 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4 7.27976 4 8.11984 4 9.8V14.2C4 15.8802 4 16.7202 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C6.27976 19 7.11984 19 8.8 19ZM9 15.5C9 15.7761 8.77614 16 8.5 16C8.22386 16 8 15.7761 8 15.5C8 15.2239 8.22386 15 8.5 15C8.77614 15 9 15.2239 9 15.5ZM16 15.5C16 15.7761 15.7761 16 15.5 16C15.2239 16 15 15.7761 15 15.5C15 15.2239 15.2239 15 15.5 15C15.7761 15 16 15.2239 16 15.5Z" stroke="#34C759" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
              5: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" id="svg1" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg"><defs id="defs1"/><sodipodi:namedview id="namedview1" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:zoom="0.52325902" inkscape:cx="386.04208" inkscape:cy="397.50868" inkscape:window-width="1440" inkscape:window-height="830" inkscape:window-x="-6" inkscape:window-y="-6" inkscape:window-maximized="1" inkscape:current-layer="SVGRepo_iconCarrier"/><g id="SVGRepo_bgCarrier" stroke-width="0"/><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/><g id="SVGRepo_iconCarrier"><path d="m 13.760301,18.985667 v 2.2 c 0,0.28 0,0.42 -0.0545,0.527 -0.04793,0.0941 -0.12442,0.1706 -0.2185,0.2185 -0.10696,0.0545 -0.24697,0.0545 -0.527,0.0545 h -1.9 c -0.28003,0 -0.42004,0 -0.527,-0.0545 -0.09408,-0.0479 -0.17057,-0.1244 -0.2185,-0.2185 -0.0545,-0.107 -0.0545,-0.247 -0.0545,-0.527 v -2.2 M 3,12 H 21 M 3,5.5 H 21 M 6.5,15.5 H 8 m 8,0 h 1.5 M 7.8,19 h 8.4 c 1.6802,0 2.5202,0 3.162,-0.327 0.5645,-0.2876 1.0234,-0.7465 1.311,-1.311 C 21,16.7202 21,15.8802 21,14.2 V 6.8 C 21,5.11984 21,4.27976 20.673,3.63803 20.3854,3.07354 19.9265,2.6146 19.362,2.32698 18.7202,2 17.8802,2 16.2,2 H 7.8 C 6.11984,2 5.27976,2 4.63803,2.32698 4.07354,2.6146 3.6146,3.07354 3.32698,3.63803 3,4.27976 3,5.11984 3,6.8 v 7.4 c 0,1.6802 0,2.5202 0.32698,3.162 0.28762,0.5645 0.74656,1.0234 1.31105,1.311 C 5.27976,19 6.11984,19 7.8,19 Z" stroke="#34C759" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" id="path1"/></g></svg>',
              6: '<svg width="16" height="16" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 0.5H2.5C1.96957 0.5 1.46086 0.710714 1.08579 1.08579C0.710714 1.46086 0.5 1.96957 0.5 2.5V10.5C0.5 11.0304 0.710714 11.5391 1.08579 11.9142C1.46086 12.2893 1.96957 12.5 2.5 12.5H3L2.1 13.7C2.0606 13.7525 2.03194 13.8123 2.01564 13.8759C1.99935 13.9395 1.99574 14.0057 2.00503 14.0707C2.01431 14.1357 2.03631 14.1982 2.06976 14.2547C2.10322 14.3112 2.14747 14.3606 2.2 14.4C2.25253 14.4394 2.3123 14.4681 2.37591 14.4844C2.43952 14.5007 2.50571 14.5043 2.57071 14.495C2.63571 14.4857 2.69825 14.4637 2.75475 14.4302C2.81125 14.3968 2.8606 14.3525 2.9 14.3L4.25 12.5H7.75L9.1 14.3C9.17957 14.4061 9.29801 14.4762 9.42929 14.495C9.56056 14.5137 9.69391 14.4796 9.8 14.4C9.90609 14.3204 9.97622 14.202 9.99498 14.0707C10.0137 13.9394 9.97956 13.8061 9.9 13.7L9 12.5H9.5C10.0304 12.5 10.5391 12.2893 10.9142 11.9142C11.2893 11.5391 11.5 11.0304 11.5 10.5V2.5C11.5 1.96957 11.2893 1.46086 10.9142 1.08579C10.5391 0.710714 10.0304 0.5 9.5 0.5ZM2.5 1.5H9.5C9.76522 1.5 10.0196 1.60536 10.2071 1.79289C10.3946 1.98043 10.5 2.23478 10.5 2.5V6.5H1.5V2.5C1.5 2.23478 1.60536 1.98043 1.79289 1.79289C1.98043 1.60536 2.23478 1.5 2.5 1.5ZM9.5 11.5H2.5C2.23478 11.5 1.98043 11.3946 1.79289 11.2071C1.60536 11.0196 1.5 10.7652 1.5 10.5V7.5H10.5V10.5C10.5 10.7652 10.3946 11.0196 10.2071 11.2071C10.0196 11.3946 9.76522 11.5 9.5 11.5ZM4 9.75C4 9.89834 3.95601 10.0433 3.8736 10.1667C3.79119 10.29 3.67406 10.3861 3.53701 10.4429C3.39997 10.4997 3.24917 10.5145 3.10368 10.4856C2.9582 10.4567 2.82456 10.3852 2.71967 10.2803C2.61478 10.1754 2.54335 10.0418 2.51441 9.89632C2.48547 9.75083 2.50032 9.60003 2.55709 9.46299C2.61386 9.32594 2.70999 9.20881 2.83332 9.1264C2.95666 9.04399 3.10166 9 3.25 9C3.44891 9 3.63968 9.07902 3.78033 9.21967C3.92098 9.36032 4 9.55109 4 9.75ZM9.5 9.75C9.5 9.89834 9.45601 10.0433 9.3736 10.1667C9.29119 10.29 9.17406 10.3861 9.03701 10.4429C8.89997 10.4997 8.74917 10.5145 8.60368 10.4856C8.4582 10.4567 8.32456 10.3852 8.21967 10.2803C8.11478 10.1754 8.04335 10.0418 8.01441 9.89632C7.98547 9.75083 8.00033 9.60003 8.05709 9.46299C8.11386 9.32594 8.20999 9.20881 8.33332 9.1264C8.45666 9.04399 8.60166 9 8.75 9C8.94891 9 9.13968 9.07902 9.28033 9.21967C9.42098 9.36032 9.5 9.55109 9.5 9.75Z" fill="#34C759"/></svg>',
              7: '<svg width="16" height="16" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet" id="svg3" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg"><defs id="defs3"/><sodipodi:namedview id="namedview3" pagecolor="#ffffff" bordercolor="#34C759" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:document-units="pt" inkscape:zoom="0.61319416" inkscape:cx="528.38076" inkscape:cy="500.65708" inkscape:window-width="1440" inkscape:window-height="830" inkscape:window-x="-6" inkscape:window-y="-6" inkscape:window-maximized="1" inkscape:current-layer="g3"/><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#34C759" stroke="#34C759" id="g3"><path d="M 2715,3925 C 1989,3785 1319,3657 1227,3639 l -168,-31 -60,-72 C 731,3221 531,2711 491,2245 c -16,-183 -15,-245 6,-245 13,0 357,66 1348,258 l 232.7027,43.9459 3,242 c 1,133 -7.4413,238.2229 -10.4413,238.2229 -4,0 -261.2614,-44.1688 -406.2614,-72.1688 -144,-27 -268,-50 -273,-50 -8,0 -10,120 -9,402 l 3,401 330,64 c 182,34 336,63 343,63 9,0 12,-135 12,-641 v -642 l 48,7 c 42,6 201,36 799,153 l 193,37 2,645 3,645 145,27 c 392,75 519,99 529,99 8,0 11,-117 11,-402 v -403 l -233,-43 c -127,-24 -253,-48 -279,-54 l -182.0541,-33.7838 v -240 -240 L 3268,2534 c 28.1639,5.1762 604,118 1067,207 143,28 268,53 278,55 15,5 17,18 17,99 0,107 -14,183 -71,378 -101,351 -250,677 -372,817 -49,56 -97,90 -126,89 -14,-1 -620,-115 -1346,-254 z m 1349,0 c 69,-92 170,-312 255,-559 23,-65 41,-124 41,-131 0,-8 -55,-23 -167,-44 -93,-18 -178,-35 -190,-38 l -23,-5 v 405 c 0,433 -2,409 42,416 4,0 23,-19 42,-44 z M 2940,3355 c 0,-223 -3,-405 -6,-405 -10,0 -648,-121 -666,-126 -17,-5 -18,19 -18,400 v 405 l 38,7 c 20,4 170,33 332,64 162,32 301,58 308,59 9,1 12,-86 12,-404 z M 1210,3027 v -403 l -222,-42 c -123,-24 -228,-42 -235,-42 -16,0 35,188 88,324 95,246 294,566 353,566 14,0 16,-39 16,-403 z" id="path1"/><path d="M2537 2260 c-1127 -219 -2050 -400 -2052 -402 -9 -9 18 -118 40 -164 31 -63 79 -108 155 -143 101 -47 71 -51 1725 268 831 161 1582 306 1670 323 218 41 288 70 388 157 81 72 167 239 167 326 0 30 -3 35 -22 34 -13 0 -945 -180 -2071 -399z" id="path2"/><path d="M4480 2046 c0 -68 -2 -74 -22 -79 -46 -11 -450 -87 -464 -87 -10 0 -14 14 -14 56 0 48 -2 55 -17 50 -10 -3 -48 -10 -85 -17 l-68 -11 0 -58 0 -57 -212 -41 c-117 -22 -230 -44 -250 -48 l-38 -6 0 57 c0 54 -1 57 -22 52 -13 -3 -51 -11 -85 -18 l-63 -12 0 -56 0 -57 -227 -43 c-126 -23 -236 -45 -245 -47 -16 -5 -18 2 -18 50 0 31 -4 56 -8 56 -12 0 -124 -20 -144 -26 -14 -4 -18 -17 -18 -59 0 -48 -3 -55 -22 -60 -13 -3 -125 -25 -250 -49 l-228 -43 0 54 c0 64 7 63 -147 28 -20 -5 -23 -12 -23 -59 l0 -55 -52 -10 c-124 -25 -424 -81 -435 -81 -9 0 -13 16 -13 50 0 58 -2 58 -105 37 l-60 -13 -3 -57 c-2 -31 -6 -57 -10 -57 -4 0 -113 -20 -242 -45 -129 -25 -236 -45 -237 -45 -2 0 -3 25 -3 55 l0 55 -85 0 -85 0 0 -205 c0 -133 4 -205 10 -205 6 0 554 104 1218 231 664 126 1477 282 1807 345 330 63 695 132 810 154 116 23 234 45 263 51 l52 10 0 195 0 194 -80 0 -80 0 0 -74z" id="path3"/></g></svg>',
              8: '<svg width="16" height="16" viewBox="0 0 330 330" fill="#34C759" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_28_" d="M315,10H15C6.716,10,0,16.716,0,25s6.716,15,15,15h116.557L85.403,140H55 c-7.643,0-14.064,5.747-14.908,13.344l-10,90c-0.016,0.145-0.013,0.289-0.025,0.434c-0.021,0.262-0.038,0.523-0.045,0.786 c-0.008,0.278-0.006,0.556,0.001,0.833c0.007,0.254,0.017,0.507,0.037,0.761c0.022,0.288,0.056,0.571,0.095,0.857 c0.021,0.15,0.025,0.302,0.05,0.452l10,60C41.41,314.699,47.667,320,55,320h220c7.332,0,13.59-5.301,14.796-12.534l10-60 c0.025-0.15,0.03-0.302,0.05-0.452c0.039-0.285,0.073-0.568,0.095-0.857c0.02-0.254,0.03-0.507,0.037-0.761 c0.007-0.277,0.009-0.555,0.001-0.833c-0.008-0.263-0.024-0.524-0.045-0.786c-0.012-0.145-0.009-0.289-0.025-0.434l-10-90 C289.064,145.747,282.643,140,275,140h-30.409L198.442,40H315c8.284,0,15-6.716,15-15S323.284,10,315,10z M140,230v-60h50v60H140z M68.426,170h26.492c0.024,0,0.049,0.004,0.073,0.004c0.037,0,0.073-0.004,0.11-0.004H110v60H61.759L68.426,170z M262.293,290 H67.707l-5-30h204.586L262.293,290z M268.241,230H220v-60h14.515c0.165,0.006,0.329,0.018,0.495,0.018c0.11,0,0.22-0.016,0.33-0.018 h26.235L268.241,230z M211.551,140h-93.108l46.154-100h0.805L211.551,140z"></path> </g></svg>',
              9: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 17.5L3 12L12 9L21 12L20 17.5M5 11.3333V7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V11.3333M10 5V3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5M2 21C3 22 6 22 8 20C10 22 14 22 16 20C18 22 21 22 22 21" stroke="#34C759" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>',
              10: '<svg width="16" height="16" viewBox="0 0 512 512" fill="#34C759" id="_x32_" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" stroke="#34C759"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css">  .st0{fill:#34C759;}  </style> <g> <path class="st0" d="M492.797,262.25h-22.109c-10.563,0-23.313-7.594-28.375-16.875l-36.406-67.094 c-5.031-9.281-17.813-16.891-28.375-16.891H206.625c-10.563,0-24.5,6.828-30.953,15.203l-54.328,70.438 c-6.469,8.375-20.391,15.219-30.938,15.219H60.531c-33.313,0-53.813,15.875-58.609,47.906L0,343.891 c0,10.578,8.656,19.234,19.219,19.234H66.5c2.344,26.969,25.031,48.188,52.625,48.188c27.563,0,50.266-21.219,52.609-48.188 h186.172c2.313,23.813,22.406,42.438,46.844,42.438s44.531-18.625,46.844-42.438h41.203c10.547,0,19.203-8.656,19.203-19.234 v-62.422C512,270.891,503.344,262.25,492.797,262.25z M119.125,382.031c-13,0-23.547-10.531-23.547-23.531 s10.547-23.531,23.547-23.531s23.531,10.531,23.531,23.531S132.125,382.031,119.125,382.031z M291.063,261.375H152.125l7.219-9.375 l44.375-57.531c3.031-3.906,11.453-8.063,16.406-8.063h70.938V261.375z M314.125,261.375v-74.969h53.844 c4.031,0,10.578,3.906,12.516,7.469l34.594,67.5H314.125z M404.75,382.031c-13,0-23.531-10.531-23.531-23.531 s10.531-23.531,23.531-23.531s23.531,10.531,23.531,23.531S417.75,382.031,404.75,382.031z"></path> <path class="st0" d="M225.859,122.844c0.016-6.219,5.063-11.281,11.281-11.281h105.25c6.234,0,11.297,5.063,11.297,11.281v30.5 h10.875v-30.5c0-12.234-9.922-22.156-22.172-22.156h-105.25c-12.234,0-22.156,9.922-22.172,22.156v30.5h10.891V122.844z"></path> <path class="st0" d="M249.188,149.938h5.531c0.266,0,0.438-0.156,0.438-0.406v-22.297c0-0.172,0.078-0.234,0.25-0.234h7.484 c0.266,0,0.422-0.188,0.422-0.438v-4.625c0-0.25-0.156-0.438-0.422-0.438h-21.859c-0.281,0-0.438,0.188-0.438,0.438v4.625 c0,0.25,0.156,0.438,0.438,0.438h7.469c0.172,0,0.266,0.063,0.266,0.234v22.297C248.766,149.781,248.938,149.938,249.188,149.938z"></path> <path class="st0" d="M275.422,121.5c-0.313,0-0.484,0.188-0.563,0.438l-10.172,27.594c-0.094,0.25,0,0.406,0.297,0.406h5.703 c0.281,0,0.469-0.125,0.563-0.406l1.656-5h10.344l1.688,5c0.094,0.281,0.266,0.406,0.578,0.406h5.641 c0.313,0,0.391-0.156,0.313-0.406l-10-27.594c-0.094-0.25-0.266-0.438-0.563-0.438H275.422z M281.516,139.313h-6.828l3.344-9.938 h0.125L281.516,139.313z"></path> <path class="st0" d="M295.516,149.938h6.016c0.375,0,0.563-0.125,0.734-0.406l5.297-8.656h0.125l5.266,8.656 c0.172,0.281,0.359,0.406,0.734,0.406h6.063c0.281,0,0.375-0.25,0.25-0.5l-8.875-14.172L319.391,122 c0.125-0.25,0.031-0.5-0.266-0.5h-6.031c-0.359,0-0.531,0.125-0.719,0.438l-4.688,7.688h-0.125l-4.688-7.688 c-0.188-0.313-0.359-0.438-0.719-0.438h-6.031c-0.313,0-0.391,0.25-0.25,0.5l8.219,13.266l-8.828,14.172 C295.094,149.688,295.219,149.938,295.516,149.938z"></path> <path class="st0" d="M326.875,121.938v27.594c0,0.25,0.188,0.406,0.438,0.406h5.531c0.25,0,0.438-0.156,0.438-0.406v-27.594 c0-0.25-0.188-0.438-0.438-0.438h-5.531C327.063,121.5,326.875,121.688,326.875,121.938z"></path> </g> </g></svg>',
              20: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
              30: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
              31: '<svg width="16" height="16" viewBox="0 0 24 24" fill="#000000"  xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M7.97,2.242l-5,20A1,1,0,0,1,2,23a1.025,1.025,0,0,1-.244-.03,1,1,0,0,1-.727-1.212l5-20a1,1,0,1,1,1.94.484Zm10-.484a1,1,0,1,0-1.94.484l5,20A1,1,0,0,0,22,23a1.017,1.017,0,0,0,.243-.03,1,1,0,0,0,.728-1.212ZM12,1a1,1,0,0,0-1,1V6a1,1,0,0,0,2,0V2A1,1,0,0,0,12,1Zm0,7.912a1,1,0,0,0-1,1v4.176a1,1,0,1,0,2,0V9.912A1,1,0,0,0,12,8.912ZM12,17a1,1,0,0,0-1,1v4a1,1,0,0,0,2,0V18A1,1,0,0,0,12,17Z"></path></g></svg>',
              32: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
              33: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9 5.25C7.03323 5.25 5.25 7.15209 5.25 9.75C5.25 12.0121 6.60204 13.7467 8.25001 14.1573V10.9014L6.33398 9.62405L7.16603 8.37597L8.792 9.45995L9.87597 7.83398L11.124 8.66603L9.75001 10.7271V14.1573C11.398 13.7467 12.75 12.0121 12.75 9.75C12.75 7.15209 10.9668 5.25 9 5.25ZM3.75 9.75C3.75 12.6785 5.62993 15.2704 8.25001 15.6906V19.5H3V21H21V19.5H18.75V18L18 17.25H12L11.25 18V19.5H9.75001V15.6906C12.3701 15.2704 14.25 12.6785 14.25 9.75C14.25 6.54892 12.0038 3.75 9 3.75C5.99621 3.75 3.75 6.54892 3.75 9.75ZM12.75 19.5H17.25V18.75H12.75V19.5Z" fill="#000"></path> </g></svg>',
              ACTIVITY:
                '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4.00195H8C5.79086 4.00195 4 5.79281 4 8.00195V16.002C4 18.2111 5.79086 20.002 8 20.002H16C18.2091 20.002 20 18.2111 20 16.002V8.00195C20 5.79281 18.2091 4.00195 16 4.00195Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12.002L14.4 10.802M12 12.002V15.002M12 12.002L9.6 10.802M12 12.002L14.4 13.202M12 12.002L9.6 13.202" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
              WALK: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.50003 5C9.8956 5 10.2823 4.8827 10.6112 4.66294C10.9401 4.44318 11.1964 4.13082 11.3478 3.76537C11.4992 3.39992 11.5388 2.99778 11.4616 2.60982C11.3844 2.22186 11.194 1.86549 10.9142 1.58579C10.6345 1.30608 10.2782 1.1156 9.89021 1.03843C9.50225 0.96126 9.10012 1.00087 8.73467 1.15224C8.36921 1.30362 8.05686 1.55996 7.83709 1.88886C7.61733 2.21776 7.50003 2.60444 7.50003 3C7.50003 3.53043 7.71075 4.03914 8.08582 4.41422C8.46089 4.78929 8.9696 5 9.50003 5ZM9.50003 2C9.69781 2 9.89115 2.05865 10.0556 2.16853C10.2201 2.27841 10.3482 2.43459 10.4239 2.61732C10.4996 2.80004 10.5194 3.00111 10.4808 3.19509C10.4422 3.38907 10.347 3.56726 10.2071 3.70711C10.0673 3.84696 9.8891 3.9422 9.69512 3.98079C9.50114 4.01937 9.30007 3.99957 9.11735 3.92388C8.93462 3.84819 8.77844 3.72002 8.66856 3.55557C8.55868 3.39112 8.50003 3.19778 8.50003 3C8.50003 2.73478 8.60539 2.48043 8.79293 2.29289C8.98046 2.10536 9.23482 2 9.50003 2ZM13.5 9C13.5 9.13261 13.4474 9.25979 13.3536 9.35356C13.2598 9.44732 13.1326 9.5 13 9.5C10.7932 9.5 9.69066 8.38688 8.80503 7.4925C8.63378 7.31938 8.47003 7.155 8.30503 7.0025L7.46566 8.9325L9.79066 10.5931C9.85542 10.6394 9.9082 10.7004 9.94462 10.7712C9.98104 10.842 10 10.9204 10 11V14.5C10 14.6326 9.94735 14.7598 9.85359 14.8536C9.75982 14.9473 9.63264 15 9.50003 15C9.36742 15 9.24025 14.9473 9.14648 14.8536C9.05271 14.7598 9.00003 14.6326 9.00003 14.5V11.2575L7.05816 9.87L4.95878 14.6994C4.91993 14.7887 4.85581 14.8648 4.77431 14.9182C4.69281 14.9716 4.59747 15 4.50003 15C4.43137 15.0002 4.36345 14.9859 4.30066 14.9581C4.17911 14.9053 4.08351 14.8064 4.03488 14.6831C3.98624 14.5598 3.98855 14.4222 4.04128 14.3006L7.42128 6.5275C6.83941 6.42438 6.11378 6.6025 5.25253 7.06375C4.56566 7.44263 3.92458 7.89917 3.34191 8.42438C3.24465 8.51149 3.11717 8.55711 2.98673 8.55148C2.85628 8.54584 2.73321 8.48941 2.64383 8.39423C2.55444 8.29905 2.50584 8.17268 2.5084 8.04213C2.51096 7.91159 2.56448 7.78723 2.65753 7.69563C2.81378 7.54875 6.51316 4.11875 8.82753 6.12813C9.06691 6.33563 9.29503 6.56563 9.51503 6.78875C10.3869 7.66875 11.21 8.5 13 8.5C13.1326 8.5 13.2598 8.55268 13.3536 8.64645C13.4474 8.74022 13.5 8.86739 13.5 9Z" fill="#FF9500"/></svg>',
              WALK_BLACK:
                '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.50003 5C9.8956 5 10.2823 4.8827 10.6112 4.66294C10.9401 4.44318 11.1964 4.13082 11.3478 3.76537C11.4992 3.39992 11.5388 2.99778 11.4616 2.60982C11.3844 2.22186 11.194 1.86549 10.9142 1.58579C10.6345 1.30608 10.2782 1.1156 9.89021 1.03843C9.50225 0.96126 9.10012 1.00087 8.73467 1.15224C8.36921 1.30362 8.05686 1.55996 7.83709 1.88886C7.61733 2.21776 7.50003 2.60444 7.50003 3C7.50003 3.53043 7.71075 4.03914 8.08582 4.41422C8.46089 4.78929 8.9696 5 9.50003 5ZM9.50003 2C9.69781 2 9.89115 2.05865 10.0556 2.16853C10.2201 2.27841 10.3482 2.43459 10.4239 2.61732C10.4996 2.80004 10.5194 3.00111 10.4808 3.19509C10.4422 3.38907 10.347 3.56726 10.2071 3.70711C10.0673 3.84696 9.8891 3.9422 9.69512 3.98079C9.50114 4.01937 9.30007 3.99957 9.11735 3.92388C8.93462 3.84819 8.77844 3.72002 8.66856 3.55557C8.55868 3.39112 8.50003 3.19778 8.50003 3C8.50003 2.73478 8.60539 2.48043 8.79293 2.29289C8.98046 2.10536 9.23482 2 9.50003 2ZM13.5 9C13.5 9.13261 13.4474 9.25979 13.3536 9.35356C13.2598 9.44732 13.1326 9.5 13 9.5C10.7932 9.5 9.69066 8.38688 8.80503 7.4925C8.63378 7.31938 8.47003 7.155 8.30503 7.0025L7.46566 8.9325L9.79066 10.5931C9.85542 10.6394 9.9082 10.7004 9.94462 10.7712C9.98104 10.842 10 10.9204 10 11V14.5C10 14.6326 9.94735 14.7598 9.85359 14.8536C9.75982 14.9473 9.63264 15 9.50003 15C9.36742 15 9.24025 14.9473 9.14648 14.8536C9.05271 14.7598 9.00003 14.6326 9.00003 14.5V11.2575L7.05816 9.87L4.95878 14.6994C4.91993 14.7887 4.85581 14.8648 4.77431 14.9182C4.69281 14.9716 4.59747 15 4.50003 15C4.43137 15.0002 4.36345 14.9859 4.30066 14.9581C4.17911 14.9053 4.08351 14.8064 4.03488 14.6831C3.98624 14.5598 3.98855 14.4222 4.04128 14.3006L7.42128 6.5275C6.83941 6.42438 6.11378 6.6025 5.25253 7.06375C4.56566 7.44263 3.92458 7.89917 3.34191 8.42438C3.24465 8.51149 3.11717 8.55711 2.98673 8.55148C2.85628 8.54584 2.73321 8.48941 2.64383 8.39423C2.55444 8.29905 2.50584 8.17268 2.5084 8.04213C2.51096 7.91159 2.56448 7.78723 2.65753 7.69563C2.81378 7.54875 6.51316 4.11875 8.82753 6.12813C9.06691 6.33563 9.29503 6.56563 9.51503 6.78875C10.3869 7.66875 11.21 8.5 13 8.5C13.1326 8.5 13.2598 8.55268 13.3536 8.64645C13.4474 8.74022 13.5 8.86739 13.5 9Z" fill="#000"/></svg>',
              TRSF: '<svg width="16" height="16" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8537 8.85354L12.8537 10.8535C12.7598 10.9474 12.6326 11.0001 12.4999 11.0001C12.3672 11.0001 12.24 10.9474 12.1462 10.8535C12.0523 10.7597 11.9996 10.6325 11.9996 10.4998C11.9996 10.3671 12.0523 10.2399 12.1462 10.146L13.293 8.99979H2.70678L3.85366 10.146C3.94748 10.2399 4.00018 10.3671 4.00018 10.4998C4.00018 10.6325 3.94748 10.7597 3.85366 10.8535C3.75983 10.9474 3.63259 11.0001 3.49991 11.0001C3.36722 11.0001 3.23998 10.9474 3.14616 10.8535L1.14616 8.85354C1.09967 8.8071 1.06279 8.75196 1.03763 8.69126C1.01246 8.63056 0.999512 8.5655 0.999512 8.49979C0.999512 8.43408 1.01246 8.36902 1.03763 8.30832C1.06279 8.24762 1.09967 8.19248 1.14616 8.14604L3.14616 6.14604C3.23998 6.05222 3.36722 5.99951 3.49991 5.99951C3.63259 5.99951 3.75983 6.05222 3.85366 6.14604C3.94748 6.23986 4.00018 6.36711 4.00018 6.49979C4.00018 6.63247 3.94748 6.75972 3.85366 6.85354L2.70678 7.99979H13.293L12.1462 6.85354C12.0523 6.75972 11.9996 6.63247 11.9996 6.49979C11.9996 6.36711 12.0523 6.23986 12.1462 6.14604C12.24 6.05222 12.3672 5.99951 12.4999 5.99951C12.6326 5.99951 12.7598 6.05222 12.8537 6.14604L14.8537 8.14604C14.9001 8.19248 14.937 8.24762 14.9622 8.30832C14.9873 8.36902 15.0003 8.43408 15.0003 8.49979C15.0003 8.5655 14.9873 8.63056 14.9622 8.69126C14.937 8.75196 14.9001 8.8071 14.8537 8.85354Z" fill="black"/></svg>',
              WAIT: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9500"><circle cx="12" cy="12" r="9" stroke-width="2"/><path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/></svg>',
              DEFAULT:
                '<svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 0.5C7.5 0.632608 7.44732 0.759785 7.35355 0.853553C7.25979 0.947321 7.13261 1 7 1H5C4.86739 1 4.74021 0.947321 4.64645 0.853553C4.55268 0.759785 4.5 0.632608 4.5 0.5C4.5 0.367392 4.55268 0.240215 4.64645 0.146447C4.74021 0.0526785 4.86739 0 5 0H7C7.13261 0 7.25979 0.0526785 7.35355 0.146447C7.44732 0.240215 7.5 0.367392 7.5 0.5ZM7 11H5C4.86739 11 4.74021 11.0527 4.64645 11.1464C4.55268 11.2402 4.5 11.3674 4.5 11.5C4.5 11.6326 4.55268 11.7598 4.64645 11.8536C4.74021 11.9473 4.86739 12 5 12H7C7.13261 12 7.25979 11.9473 7.35355 11.8536C7.44732 11.7598 7.5 11.6326 7.5 11.5C7.5 11.3674 7.44732 11.2402 7.35355 11.1464C7.25979 11.0527 7.13261 11 7 11ZM11 0H9.5C9.36739 0 9.24021 0.0526785 9.14645 0.146447C9.05268 0.240215 9 0.367392 9 0.5C9 0.632608 9.05268 0.759785 9.14645 0.853553C9.24021 0.947321 9.36739 1 9.5 1H11V2.5C11 2.63261 11.0527 2.75979 11.1464 2.85355C11.2402 2.94732 11.3674 3 11.5 3C11.6326 3 11.7598 2.94732 11.8536 2.85355C11.9473 2.75979 12 2.63261 12 2.5V1C12 0.734784 11.8946 0.48043 11.7071 0.292893C11.5196 0.105357 11.2652 0 11 0ZM11.5 4.5C11.3674 4.5 11.2402 4.55268 11.1464 4.64645C11.0527 4.74021 11 4.86739 11 5V7C11 7.13261 11.0527 7.25979 11.1464 7.35355C11.2402 7.44732 11.3674 7.5 11.5 7.5C11.6326 7.5 11.7598 7.44732 11.8536 7.35355C11.9473 7.25979 12 7.13261 12 7V5C12 4.86739 11.9473 4.74021 11.8536 4.64645C11.7598 4.55268 11.6326 4.5 11.5 4.5ZM11.5 9C11.3674 9 11.2402 9.05268 11.1464 9.14645C11.0527 9.24021 11 9.36739 11 9.5V11H9.5C9.36739 11 9.24021 11.0527 9.14645 11.1464C9.05268 11.2402 9 11.3674 9 11.5C9 11.6326 9.05268 11.7598 9.14645 11.8536C9.24021 11.9473 9.36739 12 9.5 12H11C11.2652 12 11.5196 11.8946 11.7071 11.7071C11.8946 11.5196 12 11.2652 12 11V9.5C12 9.36739 11.9473 9.24021 11.8536 9.14645C11.7598 9.05268 11.6326 9 11.5 9ZM0.5 7.5C0.632608 7.5 0.759785 7.44732 0.853553 7.35355C0.947321 7.25979 1 7.13261 1 7V5C1 4.86739 0.947321 4.74021 0.853553 4.64645C0.759785 4.55268 0.632608 4.5 0.5 4.5C0.367392 4.5 0.240215 4.55268 0.146447 4.64645C0.0526785 4.74021 0 4.86739 0 5V7C0 7.13261 0.0526785 7.25979 0.146447 7.35355C0.240215 7.44732 0.367392 7.5 0.5 7.5ZM2.5 11H1V9.5C1 9.36739 0.947321 9.24021 0.853553 9.14645C0.759785 9.05268 0.632608 9 0.5 9C0.367392 9 0.240215 9.05268 0.146447 9.14645C0.0526785 9.24021 0 9.36739 0 9.5V11C0 11.2652 0.105357 11.5196 0.292893 11.7071C0.48043 11.8946 0.734784 12 1 12H2.5C2.63261 12 2.75979 11.9473 2.85355 11.8536C2.94732 11.7598 3 11.6326 3 11.5C3 11.3674 2.94732 11.2402 2.85355 11.1464C2.75979 11.0527 2.63261 11 2.5 11ZM2.5 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V2.5C0 2.63261 0.0526785 2.75979 0.146447 2.85355C0.240215 2.94732 0.367392 3 0.5 3C0.632608 3 0.759785 2.94732 0.853553 2.85355C0.947321 2.75979 1 2.63261 1 2.5V1H2.5C2.63261 1 2.75979 0.947321 2.85355 0.853553C2.94732 0.759785 3 0.632608 3 0.5C3 0.367392 2.94732 0.240215 2.85355 0.146447C2.75979 0.0526785 2.63261 0 2.5 0Z" fill="#AEAEB2"/></svg>',
            };
            return e[A] || e.DEFAULT;
          }
          addSwipeBehavior(A) {
            const e = this.elements[A];
            if (!e) return;
            let t,
              i,
              n = !1;
            const o = (A) => {
                ((n = !0),
                  (t = A - e.offsetLeft),
                  (i = e.scrollLeft),
                  e.classList.add("active-swipe"));
              },
              g = () => {
                ((n = !1), e.classList.remove("active-swipe"));
              },
              r = (A) => {
                if (!n) return;
                const o = 1.5 * (A - e.offsetLeft - t);
                e.scrollLeft = i - o;
              };
            (e.addEventListener("mousedown", (A) => o(A.pageX)),
              e.addEventListener("mouseleave", g),
              e.addEventListener("mouseup", g),
              e.addEventListener("mousemove", (A) => {
                (A.preventDefault(), r(A.pageX));
              }),
              e.addEventListener("touchstart", (A) => o(A.touches[0].pageX), {
                passive: !0,
              }),
              e.addEventListener("touchend", g),
              e.addEventListener("touchcancel", g),
              e.addEventListener(
                "touchmove",
                (A) => {
                  r(A.touches[0].pageX);
                },
                { passive: !1 },
              ));
          }
          navigateToResults() {
            (this.clearMessages(),
              this.pageManager && this.pageManager.navigateToResults());
          }
          slideToRecommendedConnections() {
            requestAnimationFrame(() => {
              this.elements.activityTimeBox &&
                this.elements.activityTimeBox.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              const A = this.elements.topSlider;
              if (A && A.querySelector(".active-time")) {
                const e = A.querySelector(".active-time"),
                  t = e.offsetLeft - A.offsetWidth / 2 + e.offsetWidth / 2;
                A.scrollTo({ left: t, behavior: "smooth" });
              }
              const e = this.elements.bottomSlider;
              if (e && e.querySelector(".active-time")) {
                const A = e.querySelector(".active-time"),
                  t = A.offsetLeft - e.offsetWidth / 2 + A.offsetWidth / 2;
                e.scrollTo({ left: t, behavior: "smooth" });
              }
            });
          }
          navigateToForm() {
            (this.clearMessages(),
              this.pageManager && this.pageManager.navigateToForm(),
              (this.state.toConnections = []),
              (this.state.fromConnections = []),
              (this.state.activityTimes = {
                start: "",
                end: "",
                duration: "",
                warningDuration: !1,
              }),
              this.elements.collapsibleToActivity &&
                this.elements.collapsibleToActivity.classList.remove(
                  "expanded",
                ),
              this.elements.collapsibleFromActivity &&
                this.elements.collapsibleFromActivity.classList.remove(
                  "expanded",
                ));
          }
          async handleShare() {
            this.clearMessages();
            try {
              if (!this.elements.originInput)
                throw new Error("Origin input not available");
              if (!this.state.selectedDate)
                throw new Error("Selected date not available");
              const A = {
                  origin: this.elements.originInput.value,
                  origin_lat: this.elements.originInput.dataset.lat || null,
                  origin_lon: this.elements.originInput.dataset.lon || null,
                  date: d(this.state.selectedDate, this.config.timezone),
                  dateEnd:
                    this.config.multiday && this.state.selectedEndDate
                      ? d(this.state.selectedEndDate, this.config.timezone)
                      : null,
                  to_connection_start_time: this.state.selectedToConnection
                    ? this.state.selectedToConnection.connection_start_timestamp
                    : null,
                  to_connection_end_time: this.state.selectedToConnection
                    ? this.state.selectedToConnection.connection_end_timestamp
                    : null,
                  from_connection_start_time: this.state.selectedFromConnection
                    ? this.state.selectedFromConnection
                        .connection_start_timestamp
                    : null,
                  from_connection_end_time: this.state.selectedFromConnection
                    ? this.state.selectedFromConnection.connection_end_timestamp
                    : null,
                  shareURLPrefix: this.config.shareURLPrefix,
                },
                e = await this._fetchApi(`${this.config.apiBaseUrl}/share/`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(A),
                }),
                t = (await e.json()).shareId;
              if (!t) throw new Error(this.t("errors.shareLinkCreateFailed"));
              if (!this.config.shareURLPrefix)
                throw new Error("Share URL prefix not configured");
              const i = new URL(this.config.shareURLPrefix);
              if ((i.searchParams.set("diana-share", t), navigator.share))
                await navigator.share({
                  title: this.config.activityName,
                  url: i.toString(),
                });
              else if (navigator.clipboard && navigator.clipboard.writeText)
                (await navigator.clipboard.writeText(i.toString()),
                  this.showInfo(this.t("shareUrlCopied")));
              else {
                const A = document.createElement("textarea");
                ((A.value = i.toString()),
                  (A.style.position = "fixed"),
                  (A.style.top = "-9999px"),
                  document.body.appendChild(A),
                  A.focus(),
                  A.select());
                try {
                  if (!document.execCommand("copy"))
                    throw new Error("execCommand failed");
                  this.showInfo(this.t("shareUrlCopied"));
                } finally {
                  document.body.removeChild(A);
                }
              }
            } catch (A) {
              if (A.isSessionExpired) return;
              (console.error("Share failed:", A),
                "AbortError" !== A.name &&
                  this.showError(this.t("shareUrlCopyFailed"), "results", !0));
            }
          }
          async _loadFromShareID(A) {
            (await this.initDOM(), this.setLoadingState(!0, !0));
            const e = new URL(window.location.href);
            try {
              const t = await this._fetchApi(
                `${this.config.apiBaseUrl}/share/${A}/`,
              );
              if (!t.ok)
                return (
                  this.setLoadingState(!1, !0),
                  this.showInfo(this.t("errors.shareLinkInvalidExpired")),
                  e.searchParams.delete("diana-share"),
                  void window.history.replaceState(null, "", e.toString())
                );
              const i = await t.json();
              this.elements.originInput &&
                ((this.elements.originInput.value = i.origin),
                i.origin_lat &&
                  i.origin_lon &&
                  (this.elements.originInput.setAttribute(
                    "data-lat",
                    i.origin_lat.toString(),
                  ),
                  this.elements.originInput.setAttribute(
                    "data-lon",
                    i.origin_lon.toString(),
                  )),
                this.elements.clearInputBtn &&
                  this.elements.currentLocationBtn &&
                  i.origin &&
                  ((this.elements.clearInputBtn.style.display = "block"),
                  (this.elements.currentLocationBtn.style.display = "none")));
              const o = n.c9.fromISO(i.date).startOf("day"),
                g = i.dateEnd ? n.c9.fromISO(i.dateEnd).startOf("day") : null,
                r = n.c9.now().setZone(this.config.timezone).startOf("day");
              if (!o.isValid || o < r)
                return (
                  this.setLoadingState(!1, !0),
                  this.showInfo(this.t("infos.sharedDateInPast")),
                  e.searchParams.delete("diana-share"),
                  void window.history.replaceState(null, "", e.toString())
                );
              if (this.config.multiday) {
                if (g && (!g.isValid || g < r))
                  return (
                    this.setLoadingState(!1, !0),
                    this.showInfo(this.t("infos.sharedDateInPast")),
                    e.searchParams.delete("diana-share"),
                    void window.history.replaceState(null, "", e.toString())
                  );
                if (
                  this.config.activityDurationDaysFixed &&
                  g &&
                  g.diff(o, "days").days !==
                    this.config.activityDurationDaysFixed - 1
                )
                  return (
                    this.setLoadingState(!1, !0),
                    this.showInfo(this.t("infos.sharedDateDurationMismatch")),
                    e.searchParams.delete("diana-share"),
                    void window.history.replaceState(null, "", e.toString())
                  );
                ((this.state.selectedDate = o.toJSDate()),
                  (this.state.selectedEndDate = g ? g.toJSDate() : null),
                  this.elements.activityDateStart &&
                    this.state.selectedDate &&
                    (this.elements.activityDateStart.value = d(
                      this.state.selectedDate,
                      this.config.timezone,
                    )),
                  this.elements.activityDateEnd &&
                    this.state.selectedEndDate &&
                    (this.elements.activityDateEnd.value = d(
                      this.state.selectedEndDate,
                      this.config.timezone,
                    )),
                  this.updateDateDisplay(
                    this.state.selectedDate,
                    "dateDisplayStart",
                  ),
                  this.updateDateDisplay(
                    this.state.selectedEndDate,
                    "dateDisplayEnd",
                  ));
              } else
                ((this.state.selectedDate = o.toJSDate()),
                  this._updateSingleDayDateButtonStates());
              ((this.state.preselectTimes = {
                toStart: i.to_connection_start_time,
                toEnd: i.to_connection_end_time,
                fromStart: i.from_connection_start_time,
                fromEnd: i.from_connection_end_time,
              }),
                this.setLoadingState(!1, !0),
                await this.handleSearch());
            } catch (A) {
              if (A.isSessionExpired) return;
              (console.error("Failed to load data from shareID:", A),
                this.setLoadingState(!1, !0),
                this._showFatalError(
                  this.t("errors.shareLinkErrorTitle"),
                  A.message,
                  "info",
                  !0,
                ));
            }
          }
          showMenuModal() {
            this.elements.menuModalOverlay &&
              ((this.elements.menuModalOverlay.style.display = "flex"),
              requestAnimationFrame(() => {
                this.elements.menuModalOverlay?.classList.add("visible");
              }));
          }
          hideMenuModal() {
            const A = this.elements.menuModalOverlay;
            if (A) {
              A.classList.remove("visible");
              const e = () => {
                ((A.style.display = "none"),
                  A.removeEventListener("transitionend", e));
              };
              A.addEventListener("transitionend", e);
            }
          }
          handleMenuSelection(A) {
            A &&
              A.dataset.contentKey &&
              (this.hideMenuModal(),
              setTimeout(() => {
                this.navigateToContentPage(A.dataset.contentKey);
              }, 50));
          }
          navigateToContentPage(A) {
            (this.clearMessages(),
              (this.state.currentContentKey = A),
              [
                this.elements.formMenuDropdown,
                this.elements.resultsMenuDropdown,
                this.elements.contentMenuDropdown,
              ].forEach((A) => {
                A && (A.style.display = "none");
              }),
              this.pageManager && this.pageManager.navigateToContentPage(),
              this.renderContentPage());
          }
          renderContentPage() {
            if (
              !this.elements.contentPageTitle ||
              !this.elements.contentPageBody
            )
              return;
            let A, e;
            const t =
              this.config.language && m.helpContent[this.config.language]
                ? this.config.language
                : "EN";
            ("help" === this.state.currentContentKey
              ? ((A = this.t("menu.helpAndSupport")), (e = m.helpContent[t]))
              : ((A = this.t("content.defaultTitle")),
                (e = `<p>${this.t("content.defaultText")}</p>`)),
              (this.elements.contentPageTitle.textContent = A),
              (this.elements.contentPageBody.innerHTML = e));
          }
          closeMenuOrContentPage() {
            (this.clearMessages(),
              this.pageManager && this.pageManager.returnToActivePage(),
              (this.state.currentContentKey = null));
          }
          setLoadingState(A, e = !1) {
            if (e) {
              let e = this.dianaWidgetRootContainer?.querySelector(
                ".full-screen-loader",
              );
              return void (A
                ? (e ||
                    ((e = document.createElement("div")),
                    (e.className = "full-screen-loader"),
                    (e.innerHTML = `\n                        <div class="loading-spinner"></div>\n                        <span>${this.t("loadingStateSearching")}</span>\n                    `),
                    this.dianaWidgetRootContainer?.appendChild(e)),
                  (e.style.display = "flex"))
                : e && (e.style.display = "none"));
            }
            ((this.state.loading = A),
              this.elements.searchBtn &&
                ((this.elements.searchBtn.disabled = A),
                this.elements.searchBtn.setAttribute(
                  "aria-busy",
                  A ? "true" : "false",
                )),
              this.elements.originInput &&
                (this.elements.originInput.disabled = A),
              this.loadingTextTimeout1 &&
                (clearTimeout(this.loadingTextTimeout1),
                (this.loadingTextTimeout1 = null)),
              this.loadingTextTimeout2 &&
                (clearTimeout(this.loadingTextTimeout2),
                (this.loadingTextTimeout2 = null)),
              A
                ? (this.elements.searchBtn &&
                    (this.elements.searchBtn.innerHTML = `<span class="loading-spinner"></span> ${this.t("loadingStateToActivity")}`),
                  (this.loadingTextTimeout1 = setTimeout(() => {
                    this.state.loading &&
                      this.elements.searchBtn &&
                      ((this.elements.searchBtn.innerHTML = `<span class="loading-spinner"></span> ${this.t("loadingStateFromActivity")}`),
                      (this.loadingTextTimeout2 = setTimeout(() => {
                        this.state.loading &&
                          this.elements.searchBtn &&
                          (this.elements.searchBtn.innerHTML = `<span class="loading-spinner"></span> ${this.t("loadingStateSearching")}`);
                      }, 1800)));
                  }, 1300)))
                : this.elements.searchBtn &&
                  (this.elements.searchBtn.innerHTML = this.t("search")));
          }
          _showFatalError(A, t, i = "error", n = !1) {
            if (!this.shadowRoot)
              return (
                console.error(
                  "Cannot show fatal error because shadowRoot is not available.",
                ),
                void (
                  this.container &&
                  (this.container.innerHTML = `<div><h3>${A}</h3><div>${t}</div></div>`)
                )
              );
            this.shadowRoot.innerHTML = "";
            const o = document.createElement("style");
            ((o.textContent = e()),
              this.shadowRoot.appendChild(o),
              (this.dianaWidgetRootContainer = document.createElement("div")),
              (this.dianaWidgetRootContainer.className = "diana-container"),
              this.shadowRoot.appendChild(this.dianaWidgetRootContainer),
              this._applyExternalStyles());
            const g = "info" === i ? "fatal-info-box" : "fatal-error-box",
              r = "info" === i ? "title-info" : "title-error";
            let a = "";
            n &&
              (a = `\n              <p style="margin-top: 20px;">\n                <a href="#" id="reload-share-error-link" class="share-error-reload-link">${this.t("reloadPage")}</a>\n              </p>\n            `);
            const B = `\n          <div class="${g}">\n            <h3 class="${r}">${A}</h3>\n            ${t.trim().startsWith("<") ? t : `<p>${t}</p>`}\n            ${a}\n          </div>\n        `;
            if (((this.dianaWidgetRootContainer.innerHTML = B), n)) {
              const A = this.dianaWidgetRootContainer.querySelector(
                "#reload-share-error-link",
              );
              A &&
                A.addEventListener("click", (A) => {
                  A.preventDefault();
                  const e = new URL(window.location.href);
                  (e.searchParams.delete("diana-share"),
                    (window.location.href = e.toString()));
                });
            }
          }
          showError(A, e = "form", t = !1, i = null) {
            this.state.error = A;
            const n =
                "form" === e
                  ? this.elements.formErrorContainer
                  : this.elements.resultsErrorContainer,
              o =
                "form" === e
                  ? this.elements.formDebugContainer
                  : this.elements.resultsDebugContainer;
            (n &&
              ((n.textContent = A ?? ""),
              (n.style.display = A ? "block" : "none"),
              A ? n.setAttribute("role", "alert") : n.removeAttribute("role")),
              o &&
                (this.config.dev && i && "function" == typeof i.clone
                  ? ((o.style.display = "block"),
                    (async () => {
                      const A = i.clone();
                      let e;
                      try {
                        const t = await A.json();
                        e = JSON.stringify(t, null, 2);
                      } catch {
                        e = await A.text();
                      }
                      this.renderDebugContent(o, e);
                    })())
                  : ((o.innerHTML = ""), (o.style.display = "none"))),
              A &&
                (console.error(`Widget Error: ${A}`),
                "results" === e &&
                  !t &&
                  this.elements.resultsPage?.classList.contains("active") &&
                  (this.elements.responseBox &&
                    (this.elements.responseBox.innerHTML = ""),
                  this.elements.responseBoxBottom &&
                    (this.elements.responseBoxBottom.innerHTML = ""),
                  this.elements.activityTimeBox &&
                    (this.elements.activityTimeBox.innerHTML = ""),
                  this.elements.topSlider &&
                    (this.elements.topSlider.innerHTML = ""),
                  this.elements.bottomSlider &&
                    (this.elements.bottomSlider.innerHTML = ""))));
          }
          renderDebugContent(A, e) {
            ((A.innerHTML = `\n            <div class="debug-toggle">${this.t("debug.showDetails")}</div>\n            <div class="debug-content" style="display:none;">\n                <pre>${e}</pre>\n            </div>`),
              A.querySelector(".debug-toggle")?.addEventListener(
                "click",
                (A) => {
                  const e = A.target,
                    t = e.nextElementSibling,
                    i = "block" === t.style.display;
                  ((t.style.display = i ? "none" : "block"),
                    (e.textContent = i
                      ? this.t("debug.showDetails")
                      : this.t("debug.hideDetails")));
                },
              ));
          }
          showInfo(A) {
            ((this.state.info = A),
              this.elements.infoContainer &&
                ((this.elements.infoContainer.textContent = A ?? ""),
                (this.elements.infoContainer.style.display = A
                  ? "block"
                  : "none"),
                A
                  ? this.elements.infoContainer.setAttribute("role", "status")
                  : this.elements.infoContainer.removeAttribute("role")),
              A && console.info(`Widget Info: ${A}`));
          }
          clearMessages() {
            (this.showError(null, "form"),
              this.showError(null, "results"),
              this.showInfo(null));
          }
          _initCustomCalendar() {
            if (this.elements.dateSelect) return;
            const A =
              this.config.multiday &&
              this.config.activityDurationDaysFixed &&
              (this.config.overrideActivityStartDate ||
                this.config.overrideActivityEndDate);
            if (this.config.multiday) {
              this.rangeCalendarModal ||
                (this.rangeCalendarModal = new M(
                  this.state.selectedDate,
                  this.state.selectedEndDate,
                  this,
                  (A, e) => {
                    ((this.state.selectedDate = A),
                      (this.state.selectedEndDate = e),
                      this.elements.activityDateStart &&
                        (this.elements.activityDateStart.value = d(A)),
                      this.elements.dateDisplayStart &&
                        this.updateDateDisplay(A, "dateDisplayStart"),
                      this.elements.activityDateEnd &&
                        (this.elements.activityDateEnd.value = d(e)),
                      this.elements.dateDisplayEnd &&
                        this.updateDateDisplay(e, "dateDisplayEnd"),
                      this.clearMessages(),
                      this.state.selectedEndDate &&
                        this.state.selectedDate &&
                        n.c9
                          .fromJSDate(this.state.selectedEndDate)
                          .startOf("day") <
                          n.c9
                            .fromJSDate(this.state.selectedDate)
                            .startOf("day") &&
                        this.showInfo(this.t("infos.endDateAfterStartDate")));
                  },
                  this.config.overrideActivityStartDate ?? null,
                  this.config.overrideActivityEndDate ?? null,
                  this.config.activityDurationDaysFixed ?? null,
                ));
              const e = (A) => {
                (window.matchMedia("(max-width: 768px)").matches &&
                  A.target.closest(".date-input-container") &&
                  A.target
                    .closest(".date-input-container")
                    .querySelector('input[type="date"]')) ||
                  (A.target.closest(".date-input-container") &&
                    "INPUT" !== A.target.tagName &&
                    A.preventDefault(),
                  this.rangeCalendarModal?.show(
                    this.state.selectedDate,
                    this.state.selectedEndDate,
                  ));
              };
              if (!A) {
                if (
                  !this.config.overrideActivityStartDate &&
                  this.elements.activityDateStart
                ) {
                  const A = this.elements.activityDateStart.closest(
                    ".date-input-container",
                  );
                  A &&
                    A.addEventListener("click", (A) => {
                      (A.stopPropagation(), e(A));
                    });
                }
                if (
                  !this.config.overrideActivityEndDate &&
                  this.elements.activityDateEnd
                ) {
                  const A = this.elements.activityDateEnd.closest(
                    ".date-input-container",
                  );
                  A &&
                    A.addEventListener("click", (A) => {
                      (A.stopPropagation(), e(A));
                    });
                }
              }
              (this.elements.activityDateStart &&
                this.elements.activityDateStart.addEventListener(
                  "change",
                  (A) => {
                    const e = A.target,
                      [t, i, o] = e.value.split("-").map(Number),
                      g = new Date(Date.UTC(t, i - 1, o));
                    ((this.state.selectedDate = g),
                      this.updateDateDisplay(g, "dateDisplayStart"),
                      this.config.activityDurationDaysFixed
                        ? ((this.state.selectedEndDate = n.c9
                            .fromJSDate(g)
                            .plus({
                              days: this.config.activityDurationDaysFixed - 1,
                            })
                            .toJSDate()),
                          this.elements.activityDateEnd &&
                            this.state.selectedEndDate &&
                            (this.elements.activityDateEnd.value = d(
                              this.state.selectedEndDate,
                            )),
                          this.state.selectedEndDate &&
                            this.updateDateDisplay(
                              this.state.selectedEndDate,
                              "dateDisplayEnd",
                            ))
                        : this.state.selectedEndDate &&
                          g > this.state.selectedEndDate &&
                          ((this.state.selectedEndDate = new Date(g.valueOf())),
                          this.elements.activityDateEnd &&
                            (this.elements.activityDateEnd.value = d(
                              this.state.selectedEndDate,
                            )),
                          this.updateDateDisplay(
                            this.state.selectedEndDate,
                            "dateDisplayEnd",
                          )),
                      this.clearMessages());
                  },
                ),
                this.elements.activityDateEnd &&
                  this.elements.activityDateEnd.addEventListener(
                    "change",
                    (A) => {
                      if (this.config.activityDurationDaysFixed) return;
                      const e = A.target,
                        [t, i, o] = e.value.split("-").map(Number),
                        g = new Date(Date.UTC(t, i - 1, o));
                      ((this.state.selectedEndDate = g),
                        this.updateDateDisplay(g, "dateDisplayEnd"),
                        this.state.selectedDate &&
                          g < this.state.selectedDate &&
                          ((this.state.selectedDate = new Date(g.valueOf())),
                          this.elements.activityDateStart &&
                            (this.elements.activityDateStart.value = d(
                              this.state.selectedDate,
                            )),
                          this.updateDateDisplay(
                            this.state.selectedDate,
                            "dateDisplayStart",
                          )),
                        this.clearMessages(),
                        this.state.selectedEndDate &&
                          this.state.selectedDate &&
                          n.c9
                            .fromJSDate(this.state.selectedEndDate)
                            .startOf("day") <
                            n.c9
                              .fromJSDate(this.state.selectedDate)
                              .startOf("day") &&
                          this.showInfo(this.t("infos.endDateAfterStartDate")));
                    },
                  ),
                this.config.overrideActivityStartDate &&
                  this.elements.dateDisplayStart &&
                  this.state.selectedDate &&
                  this.updateDateDisplay(
                    this.state.selectedDate,
                    "dateDisplayStart",
                  ),
                this.config.overrideActivityEndDate &&
                  this.elements.dateDisplayEnd &&
                  this.state.selectedEndDate &&
                  this.updateDateDisplay(
                    this.state.selectedEndDate,
                    "dateDisplayEnd",
                  ),
                A &&
                  (this.elements.dateDisplayStart &&
                    this.state.selectedDate &&
                    this.updateDateDisplay(
                      this.state.selectedDate,
                      "dateDisplayStart",
                    ),
                  this.elements.dateDisplayEnd &&
                    this.state.selectedEndDate &&
                    this.updateDateDisplay(
                      this.state.selectedEndDate,
                      "dateDisplayEnd",
                    )));
            } else if (
              !this.config.overrideActivityStartDate &&
              this.elements.activityDate &&
              this.elements.otherDateText &&
              this.elements.dateBtnOther &&
              this.elements.dateSelectorButtonsGroup
            ) {
              const A = this.elements.activityDate,
                t = this.elements.otherDateText,
                i = this.elements.dateBtnOther,
                o = this.elements.dateSelectorButtonsGroup;
              (this.singleCalendarInstance ||
                (this.singleCalendarInstance = new f(
                  A,
                  t,
                  this.state.selectedDate,
                  this,
                  (A) => {
                    this.onDateSelectedByButton(A);
                  },
                  i,
                  o,
                  e(),
                )),
                this.elements.dateBtnToday?.addEventListener("click", () => {
                  const A = n.c9
                      .now()
                      .setZone(this.config.timezone)
                      .startOf("day")
                      .toObject(),
                    e = new Date(
                      A.year ?? new Date().getFullYear(),
                      (A.month ?? 1) - 1,
                      A.day ?? 1,
                    );
                  this.onDateSelectedByButton(e);
                }),
                this.elements.dateBtnTomorrow?.addEventListener("click", () => {
                  const A = n.c9
                      .now()
                      .setZone(this.config.timezone)
                      .plus({ days: 1 })
                      .startOf("day")
                      .toObject(),
                    e = new Date(
                      A.year ?? new Date().getFullYear(),
                      (A.month ?? 1) - 1,
                      A.day ?? 1,
                    );
                  this.onDateSelectedByButton(e);
                }),
                i.addEventListener("click", (A) => {
                  if (
                    window.matchMedia("(max-width: 768px)").matches &&
                    (A.stopPropagation(), this.elements.activityDate)
                  )
                    try {
                      "function" == typeof this.elements.activityDate.showPicker
                        ? this.elements.activityDate.showPicker()
                        : this.elements.activityDate.focus();
                    } catch (A) {
                      (console.warn(
                        "Error trying to show native date picker:",
                        A,
                      ),
                        this.elements.activityDate.focus());
                    }
                }),
                this.elements.activityDate &&
                  this.elements.activityDate.addEventListener("change", (A) => {
                    const e = A.target;
                    if (e.value) {
                      const [A, t, i] = e.value.split("-").map(Number),
                        n = new Date(Date.UTC(A, t - 1, i));
                      (this.onDateSelectedByButton(n),
                        this.singleCalendarInstance &&
                          this.singleCalendarInstance.setSelectedDate(n, !1));
                    }
                  }),
                this._updateSingleDayDateButtonStates());
            } else
              this.config.overrideActivityStartDate &&
                this.elements.dateDisplay &&
                this.updateDateDisplay(this.state.selectedDate, "dateDisplay");
          }
          updateDateDisplay(A, e) {
            const t = this.elements[e];
            if (!t) return;
            const i =
              {
                EN: "en-GB",
                DE: "de-DE",
                FR: "fr-FR",
                IT: "it-IT",
                TH: "th-TH",
                ES: "es-ES",
              }[this.config.language] ||
              (this.config.language
                ? `${this.config.language.toLowerCase()}-${this.config.language.toUpperCase()}`
                : "en-GB");
            A && !isNaN(A.getTime())
              ? ((t.textContent = (0, g.hi)(A, i, this.config.timezone)),
                t.classList.remove("placeholder"))
              : ((t.textContent = this.t("selectDate")),
                t.classList.add("placeholder"));
          }
          onDateSelectedByButton(A) {
            if (
              ((this.state.selectedDate = A),
              this.elements.activityDate &&
                (this.elements.activityDate.value = d(A, this.config.timezone)),
              this._updateSingleDayDateButtonStates(),
              this.singleCalendarInstance &&
                (this.singleCalendarInstance.setSelectedDate(A, !1),
                this.singleCalendarInstance.hide()),
              this.clearMessages(),
              "function" == typeof this.config.onDateChange)
            )
              try {
                const e = n.c9.fromJSDate(A).toISODate();
                e && this.config.onDateChange(e);
              } catch (A) {
                console.error("Error executing onDateChange callback:", A);
              }
          }
          _updateSingleDayDateButtonStates() {
            if (
              this.config.multiday ||
              !this.elements.dateBtnToday ||
              !this.elements.dateBtnTomorrow ||
              !this.elements.dateBtnOther ||
              !this.elements.otherDateText
            )
              return;
            const A = new Date().getFullYear(),
              e = n.c9
                .now()
                .setZone(this.config.timezone)
                .startOf("day")
                .toObject(),
              t = new Date(e.year ?? A, (e.month ?? 1) - 1, e.day ?? 1),
              i = n.c9
                .now()
                .setZone(this.config.timezone)
                .plus({ days: 1 })
                .startOf("day")
                .toObject(),
              o = new Date(i.year ?? A, (i.month ?? 1) - 1, i.day ?? 1),
              r = this.state.selectedDate
                ? n.c9
                    .fromJSDate(this.state.selectedDate)
                    .setZone(this.config.timezone)
                    .startOf("day")
                    .toObject()
                : null,
              a = r
                ? new Date(r.year ?? A, (r.month ?? 1) - 1, r.day ?? 1)
                : null;
            if (
              (this.elements.dateBtnToday.classList.remove("active"),
              this.elements.dateBtnTomorrow.classList.remove("active"),
              this.elements.dateBtnOther.classList.remove("active"),
              (this.elements.otherDateText.textContent = this.t("otherDate")),
              this.elements.dateBtnOther.children[1] &&
                this.elements.dateBtnOther.children[1].setAttribute(
                  "stroke",
                  "#000",
                ),
              a)
            ) {
              const A =
                {
                  EN: "en-GB",
                  DE: "de-DE",
                  FR: "fr-FR",
                  IT: "it-IT",
                  TH: "th-TH",
                  ES: "es-ES",
                }[this.config.language] ||
                (this.config.language
                  ? `${this.config.language.toLowerCase()}-${this.config.language.toUpperCase()}`
                  : "en-GB");
              (a.getTime() === t.getTime()
                ? this.elements.dateBtnToday.classList.add("active")
                : a.getTime() === o.getTime()
                  ? this.elements.dateBtnTomorrow.classList.add("active")
                  : (this.elements.dateBtnOther.classList.add("active"),
                    (this.elements.otherDateText.textContent = (0, g.hi)(
                      a,
                      A,
                      this.config.timezone,
                    )),
                    this.elements.dateBtnOther.children[1] &&
                      this.elements.dateBtnOther.children[1].setAttribute(
                        "stroke",
                        "#fff",
                      )),
                this.elements.activityDate &&
                  (this.elements.activityDate.value = d(
                    a,
                    this.config.timezone,
                  )));
            } else
              ((this.elements.otherDateText.textContent = this.t("otherDate")),
                this.elements.activityDate &&
                  (this.elements.activityDate.value = ""));
          }
        };
      })(),
      i.default
    );
  })(),
);
