!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.seamcarving=t():e.seamcarving=t()}(self,(function(){return(()=>{"use strict";var e={d:(t,i)=>{for(var r in i)e.o(i,r)&&!e.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:i[r]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function r(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,t,i){return t&&r(e.prototype,t),i&&r(e,i),e}e.r(t),e.d(t,{SeamCarving:()=>x,default:()=>j,init:()=>A});var a=function(){function e(t){i(this,e),this.expression=t}return n(e,[{key:"isClass",get:function(){return"."===this.expression.charAt(0)}},{key:"isId",get:function(){return"#"===this.expression.charAt(0)}},{key:"value",get:function(){return this.expression.substring(1)}},{key:"setAttribute",value:function(e){if(this.isId)e.setAttribute("id",this.value);else{if(!this.isClass)throw new Error("neither id nor class : [".concat(this.expression,"]"));e.classList.add(this.value)}}}]),e}(),o=new Set,s=function(){function e(){i(this,e),this.el=document.createComment("dummy el for event bus"),this.callbacks=new Map}return n(e,[{key:"on",value:function(e,t){var i=this.callbacks.get(e);i||(i=new Set,this.callbacks.set(e,i)),i.add(t)}},{key:"emit",value:function(e,t){(this.callbacks.get(e)||o).forEach((function(e){try{e(t)}catch(e){console.log(e)}}))}},{key:"hasListeners",value:function(e){return!!this.callbacks.get(e)}}]),e}(),u=function(e){return(e||"").split(" ").map((function(e){return e.trim()})).filter((function(e){return e.length>0}))},h=function(e,t,i){var r=document.createElement(e);return t.forEach((function(e){new a(e).setAttribute(r)})),i&&i.appendChild(r),r};const c=function(e,t){return h("CANVAS",u(e),t)},f=function(){return new s};function l(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function v(e){return function(e){if(Array.isArray(e))return g(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return g(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?g(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,r=new Array(t);i<t;i++)r[i]=e[i];return r}var d=1e3,m=function(e,t,i){var r=4*e,n=4*t,a=i[r+0]-i[n+0],o=i[r+1]-i[n+1],s=i[r+2]-i[n+2];return a*a+o*o+s*s},p=function(e,t,i,r,n){var a=i<0?r:e[i]<e[r]?i:r;return n===t||e[a]<=e[n]?a:n},y=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e);var i=c(null,t);i.width=0,i.height=0,this.$canvas=i,this.$$={}}var t,i;return t=e,(i=[{key:"setImageSource",value:function(e){this.$$.imgSource=e;var t=this.$canvas,i=e.width,r=e.height;t.width=i,t.height=r,t.style.width="".concat(i,"px"),t.style.height="".concat(r,"px");var n=t.getContext("2d");this.$$.ctx=n,this.$$.dirty=!0,this.$$.viewport={width:i,height:r},this.energies=new Array(r);for(var a=0;a<r;a++)this.energies[a]=new Array(i);this.repaint()}},{key:"cutVSeam",value:function(){this.$$.vseam||this.resolveVerticalSeam();for(var e=this.$$,t=e.vseam,i=e.viewport,r=e.imageData.data,n=0;n<i.height;n++){var a=4*(this.width*n+t[n]),o=a+4,s=4*(this.width*n+i.width-1);r.copyWithin(a,o,s+4)}i.width-=1,this.$$.vseam=null,this.$$.dirty=!0,this.repaint()}},{key:"renderVerticalSeam",value:function(e){var t=this.$$,i=t.ctx,r=t.viewport;i.strokeStyle="#ff0000",i.beginPath(),i.moveTo(e[0],0);for(var n=1;n<r.height;n++)i.lineTo(e[n],n);i.stroke()}},{key:"repaint",value:function(){var e=this.$$,t=e.ctx,i=e.imgSource,r=e.imageData;t.clearRect(0,0,this.width,this.height),r||(t.drawImage(i.image,0,0),this.$$.imageData=t.getImageData(0,0,this.width,this.height)),t.putImageData(this.$$.imageData,0,0,0,0,this.viewportWidth,this.viewportHeight)}},{key:"resolveVerticalSeam",value:function(e){this.$$.dirty&&(function(e,t,i,r,n){var a,o,s,u=t.data;e[0].fill(d),e[i.height-1].fill(d);for(var h=1;h<i.height-1;h++){e[h][0]=d,e[h][i.width-1]=d;for(var c=1;c<i.width-1;c++){a=(s=c+h*r)-r,o=s+r;var f=m(s-1,s+1,u),l=m(a,o,u);e[h][c]=f+l}}}(this.energies,this.$$.imageData,this.$$.viewport,this.width,this.height),this.dirty=!1);var t=this.$$.viewport,i=t.width,r=t.height,n=function(e,t,i){for(var r=[],n=v(e[0]),a=[],o=1;o<i;o++){a=v(e[o]);for(var s=new Array(t),u=0;u<t;u++){var h=p(n,t,u-1,u,u+1);s[u]=h,a[u]+=n[h]}r.push(s),n=a}var c=0;a.forEach((function(e,i){i<t&&e<a[c]&&(c=i)}));for(var f=[c],l=r.length-1;l>=0;l--)c=r[l][c],f.push(c);return f.reverse()}(this.energies,i,r);this.$$.vseam=n,e&&this.renderVerticalSeam(n)}},{key:"width",get:function(){return this.$$.imgSource.width}},{key:"height",get:function(){return this.$$.imgSource.height}},{key:"viewportWidth",get:function(){return this.$$.viewport.width}},{key:"viewportHeight",get:function(){return this.$$.viewport.height}}])&&l(t.prototype,i),e}();function w(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function $(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function b(e,t,i){return t&&$(e.prototype,t),i&&$(e,i),e}var k={progress:"progress",done:"done"},S=function(){function e(t,i){w(this,e),this.$$={listener:null,seamCarving:t,limit:i,current:0,stats:[],dim:{imageWidth:t.imageWidth,imageHeight:t.imageHeight}};var r=t.eventBus.hasListeners(k.progress),n=t.eventBus.hasListeners(k.done);(r||n)&&(this.$$.listener={progress:r,done:n})}return b(e,[{key:"start",value:function(){var e=this,t=this.$$,i=t.listener,r=t.limit,n=t.current,a=t.seamCarving,o=t.stats,s=t.dim;if(n===r){if(i&&i.done){var u=o.reduce((function(e,t){return e+t.elapsed}),0),h=u/o.length;a.eventBus.emit(k.done,{index:n,limit:r,totalTime:u,avgTime:h,stats:o,dim:s})}}else setTimeout((function(){var t=performance.now();a.canvas.cutVSeam();var u=performance.now()-t,h=null;i&&(h={index:n,limit:r,elapsed:u,dim:Object.assign({viewportWidth:a.viewportWidth,viewportHeight:a.viewportHeight},s)}),i&&i.done&&o.push(h),i&&i.progress&&a.eventBus.emit(k.progress,h),e.$$.current++,e.start()}))}}]),e}(),x=function(){function e(t){w(this,e),this.$$={},this.$$.$wrapper=t,this.canvas=new y(t),this.$$.ebus=f()}return b(e,[{key:"render",value:function(e){var t=this;!function(e,t){var i=new Image;i.onload=function(){t(i)},i.src=window.URL.createObjectURL(e)}(e,(function(i){t.$$.imageSource={image:i,width:i.width,height:i.height,size:e.size},t.canvas.setImageSource(t.$$.imageSource)}))}},{key:"renderVSeam",value:function(){this.canvas.resolveVerticalSeam(!0)}},{key:"cutVSeam",value:function(e){return new S(this,e||1).start(),this}},{key:"on",value:function(e,t){var i=function(e){var t=k[e];if(!t)throw new Error("invalid event [".concat(e,"]. 'progress' and 'done' are supported."));return t}(e);return this.eventBus.on(i,t),this}},{key:"eventBus",get:function(){return this.$$.ebus}},{key:"imageWidth",get:function(){return this.$$.imageSource.width}},{key:"imageHeight",get:function(){return this.$$.imageSource.height}},{key:"viewportWidth",get:function(){return this.canvas.viewportWidth}},{key:"viewportHeight",get:function(){return this.canvas.viewportHeight}}]),e}(),A=function(e){return new x(e)};const j={SeamCarving:x};return t})()}));
//# sourceMappingURL=seamcarving.js.map