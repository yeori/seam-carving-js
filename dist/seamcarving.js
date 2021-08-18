!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.seamcarving=t():e.seamcarving=t()}(self,(function(){return(()=>{"use strict";var e={d:(t,i)=>{for(var n in i)e.o(i,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:i[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function n(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function r(e,t,i){return t&&n(e.prototype,t),i&&n(e,i),e}e.r(t),e.d(t,{SeamCarving:()=>x,default:()=>j,init:()=>A});var a=function(){function e(t){i(this,e),this.expression=t}return r(e,[{key:"isClass",get:function(){return"."===this.expression.charAt(0)}},{key:"isId",get:function(){return"#"===this.expression.charAt(0)}},{key:"value",get:function(){return this.expression.substring(1)}},{key:"setAttribute",value:function(e){if(this.isId)e.setAttribute("id",this.value);else{if(!this.isClass)throw new Error("neither id nor class : [".concat(this.expression,"]"));e.classList.add(this.value)}}}]),e}(),o=new Set,s=function(){function e(){i(this,e),this.el=document.createComment("dummy el for event bus"),this.callbacks=new Map}return r(e,[{key:"on",value:function(e,t){var i=this.callbacks.get(e);i||(i=new Set,this.callbacks.set(e,i)),i.add(t)}},{key:"emit",value:function(e,t){(this.callbacks.get(e)||o).forEach((function(e){try{e(t)}catch(e){console.log(e)}}))}},{key:"hasListeners",value:function(e){return!!this.callbacks.get(e)}}]),e}(),h=function(e){return(e||"").split(" ").map((function(e){return e.trim()})).filter((function(e){return e.length>0}))},u=function(e,t,i){var n=document.createElement(e);return t.forEach((function(e){new a(e).setAttribute(n)})),i&&i.appendChild(n),n};const c=function(e,t){return u("CANVAS",h(e),t)},f=function(){return new s};function l(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function v(e){return function(e){if(Array.isArray(e))return g(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return g(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?g(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,n=new Array(t);i<t;i++)n[i]=e[i];return n}var d=1e3,m=function(e,t,i){var n=4*e,r=4*t,a=i[n+0]-i[r+0],o=i[n+1]-i[r+1],s=i[n+2]-i[r+2];return a*a+o*o+s*s},p=function(e,t,i,n,r){var a=i<0?n:e[i]<e[n]?i:n;return r===t||e[a]<=e[r]?a:r},w=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var i=c(null,t);i.width=0,i.height=0,this.$canvas=i,this.$$={}}var t,i;return t=e,(i=[{key:"setImageSource",value:function(e){this.$$.imgSource=e;var t=this.$canvas,i=e.width,n=e.height;t.width=i,t.height=n,t.style.width="".concat(i,"px"),t.style.height="".concat(n,"px");var r=t.getContext("2d");this.$$.ctx=r,this.$$.viewport={width:i,height:n},this.repaint()}},{key:"cutVSeam",value:function(){this.$$.vseam||this.resolveVerticalSeam();for(var e=this.$$,t=e.vseam,i=e.viewport,n=e.imageData.data,r=0;r<i.height;r++){var a=4*(this.width*r+t[r]),o=a+4,s=4*(this.width*r+i.width-1);if(n.copyWithin(a,o,s+4),n[s+0]=255,n[s+1]=0,n[s+2]=0,n[s+3]=255,this.energies[r].copyWithin(t[r],t[r]+1,i.width),r>0&&r+1<i.height){var h=t[r];if(0===h||h+1===i.width-1)this.energies[r][h]=d;else{var u=(a=h+r*this.width)-this.width,c=a+1,f=a+this.width,l=m(a-1,c,n),v=m(u,f,n);this.energies[r][h]=parseInt(Math.sqrt(l+v))}if((h=t[r]-1)<0);else if(0===h)this.energies[r][h]=d;else{var g=(a=h+r*this.width)-this.width,p=a+1,w=a+this.width,y=m(a-1,p,n),$=m(g,w,n);this.energies[r][h]=parseInt(Math.sqrt(y+$))}}}i.width-=1,this.$$.vseam=null,this.repaint()}},{key:"renderVerticalSeam",value:function(e){var t=this.$$,i=t.ctx,n=t.viewport;i.strokeStyle="#ff0000",i.beginPath(),i.moveTo(e[0],0);for(var r=1;r<n.height;r++)i.lineTo(e[r],r);i.stroke()}},{key:"repaint",value:function(){var e=this.$$,t=e.ctx,i=e.imgSource,n=e.imageData;t.clearRect(0,0,this.width,this.height),n||(t.drawImage(i.image,0,0),this.$$.imageData=t.getImageData(0,0,this.width,this.height)),t.putImageData(this.$$.imageData,0,0)}},{key:"resolveVerticalSeam",value:function(e){this.energies||(this.energies=function(e,t,i,n){for(var r,a,o,s=e.data,h=[],u=0;u<t.height;u++){var c=new Array(t.width);if(h.push(c),0!==u&&u+1!==t.height)for(var f=0;f<t.width;f++)if(0===f||f+1===t.width)c[f]=d;else{r=(o=f+u*i)-i,a=o+i;var l=m(o-1,o+1,s),v=m(r,a,s);h[u][f]=parseInt(Math.sqrt(l+v))}else c.fill(d)}return h}(this.$$.imageData,this.$$.viewport,this.width,this.height));var t=this.$$.viewport,i=t.width,n=t.height,r=function(e,t,i){for(var n=[],r=v(e[0]),a=[],o=1;o<i;o++){a=v(e[o]);for(var s=new Array(t),h=0;h<t;h++){var u=p(r,t,h-1,h,h+1);s[h]=u,a[h]+=r[u]}n.push(s),r=a}var c=0;a.forEach((function(e,i){i<t&&e<a[c]&&(c=i)}));for(var f=[c],l=n.length-1;l>=0;l--)c=n[l][c],f.push(c);return f.reverse()}(this.energies,i,n);this.$$.vseam=r,e&&this.renderVerticalSeam(r)}},{key:"width",get:function(){return this.$$.imgSource.width}},{key:"height",get:function(){return this.$$.imgSource.height}},{key:"viewportWidth",get:function(){return this.$$.viewport.width}},{key:"viewportHeight",get:function(){return this.$$.viewport.height}}])&&l(t.prototype,i),e}();function y(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function $(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function b(e,t,i){return t&&$(e.prototype,t),i&&$(e,i),e}var k={progress:"progress",done:"done"},S=function(){function e(t,i){y(this,e),this.$$={listener:null,seamCarving:t,limit:i,current:0,stats:[],dim:{imageWidth:t.imageWidth,imageHeight:t.imageHeight}};var n=t.eventBus.hasListeners(k.progress),r=t.eventBus.hasListeners(k.done);(n||r)&&(this.$$.listener={progress:n,done:r})}return b(e,[{key:"start",value:function(){var e=this,t=this.$$,i=t.listener,n=t.limit,r=t.current,a=t.seamCarving,o=t.stats,s=t.dim;if(r===n){if(i&&i.done){var h=o.reduce((function(e,t){return e+t.elapsed}),0),u=h/o.length;a.eventBus.emit(k.done,{index:r,limit:n,totalTime:h,avgTime:u,stats:o,dim:s})}}else setTimeout((function(){var t=performance.now();a.canvas.cutVSeam();var h=performance.now()-t,u=null;i&&(u={index:r,limit:n,elapsed:h,dim:Object.assign({viewportWidth:a.viewportWidth,viewportHeight:a.viewportHeight},s)}),i&&i.done&&o.push(u),i&&i.progress&&a.eventBus.emit(k.progress,u),e.$$.current++,e.start()}))}}]),e}(),x=function(){function e(t){y(this,e),this.$$={},this.$$.$wrapper=t,this.canvas=new w(t),this.$$.ebus=f()}return b(e,[{key:"render",value:function(e){var t=this;!function(e,t){var i=new Image;i.onload=function(){t(i)},i.src=window.URL.createObjectURL(e)}(e,(function(i){t.$$.imageSource={image:i,width:i.width,height:i.height,size:e.size},t.canvas.setImageSource(t.$$.imageSource)}))}},{key:"renderVSeam",value:function(){this.canvas.resolveVerticalSeam(!0)}},{key:"cutVSeam",value:function(e){return new S(this,e||1).start(),this}},{key:"on",value:function(e,t){var i=function(e){var t=k[e];if(!t)throw new Error("invalid event [".concat(e,"]. 'progress' and 'done' are supported."));return t}(e);return this.eventBus.on(i,t),this}},{key:"eventBus",get:function(){return this.$$.ebus}},{key:"imageWidth",get:function(){return this.$$.imageSource.width}},{key:"imageHeight",get:function(){return this.$$.imageSource.height}},{key:"viewportWidth",get:function(){return this.canvas.viewportWidth}},{key:"viewportHeight",get:function(){return this.canvas.viewportHeight}}]),e}(),A=function(e){return new x(e)};const j={SeamCarving:x};return t})()}));
//# sourceMappingURL=seamcarving.js.map