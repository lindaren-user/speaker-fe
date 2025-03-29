import{bt as l,J as i,bu as z,bv as V,M as D,bw as _,bx as F,by as G,bz as K,N as E,bA as m,bB as y,aX as R,K as W,bC as u}from"./index-CC-TFbUu.js";var T=l(i,"WeakMap");function N(t){return t!=null&&z(t.length)&&!V(t)}var q=Object.prototype;function H(t){var r=t&&t.constructor,e=typeof r=="function"&&r.prototype||q;return t===e}function J(t,r){for(var e=-1,n=Array(t);++e<t;)n[e]=r(e);return n}function X(){return!1}var k=typeof exports=="object"&&exports&&!exports.nodeType&&exports,w=k&&typeof module=="object"&&module&&!module.nodeType&&module,Y=w&&w.exports===k,x=Y?i.Buffer:void 0,Z=x?x.isBuffer:void 0,Q=Z||X,tt="[object Arguments]",et="[object Array]",rt="[object Boolean]",at="[object Date]",nt="[object Error]",ot="[object Function]",st="[object Map]",it="[object Number]",ut="[object Object]",ct="[object RegExp]",pt="[object Set]",ft="[object String]",bt="[object WeakMap]",gt="[object ArrayBuffer]",yt="[object DataView]",lt="[object Float32Array]",dt="[object Float64Array]",vt="[object Int8Array]",Tt="[object Int16Array]",ht="[object Int32Array]",jt="[object Uint8Array]",At="[object Uint8ClampedArray]",_t="[object Uint16Array]",mt="[object Uint32Array]",a={};a[lt]=a[dt]=a[vt]=a[Tt]=a[ht]=a[jt]=a[At]=a[_t]=a[mt]=!0;a[tt]=a[et]=a[gt]=a[rt]=a[yt]=a[at]=a[nt]=a[ot]=a[st]=a[it]=a[ut]=a[ct]=a[pt]=a[ft]=a[bt]=!1;function wt(t){return D(t)&&z(t.length)&&!!a[_(t)]}function xt(t){return function(r){return t(r)}}var U=typeof exports=="object"&&exports&&!exports.nodeType&&exports,b=U&&typeof module=="object"&&module&&!module.nodeType&&module,St=b&&b.exports===U,v=St&&F.process,S=function(){try{var t=b&&b.require&&b.require("util").types;return t||v&&v.binding&&v.binding("util")}catch{}}(),O=S&&S.isTypedArray,Ot=O?xt(O):wt,Pt=Object.prototype,Mt=Pt.hasOwnProperty;function Ct(t,r){var e=E(t),n=!e&&G(t),c=!e&&!n&&Q(t),p=!e&&!n&&!c&&Ot(t),f=e||n||c||p,d=f?J(t.length,String):[],L=d.length;for(var o in t)(r||Mt.call(t,o))&&!(f&&(o=="length"||c&&(o=="offset"||o=="parent")||p&&(o=="buffer"||o=="byteLength"||o=="byteOffset")||K(o,L)))&&d.push(o);return d}function $t(t,r){return function(e){return t(r(e))}}var It=$t(Object.keys,Object),Bt=Object.prototype,zt=Bt.hasOwnProperty;function Et(t){if(!H(t))return It(t);var r=[];for(var e in Object(t))zt.call(t,e)&&e!="constructor"&&r.push(e);return r}function kt(t){return N(t)?Ct(t):Et(t)}function Ut(){this.__data__=new m,this.size=0}function Lt(t){var r=this.__data__,e=r.delete(t);return this.size=r.size,e}function Vt(t){return this.__data__.get(t)}function Dt(t){return this.__data__.has(t)}var Ft=200;function Gt(t,r){var e=this.__data__;if(e instanceof m){var n=e.__data__;if(!y||n.length<Ft-1)return n.push([t,r]),this.size=++e.size,this;e=this.__data__=new R(n)}return e.set(t,r),this.size=e.size,this}function g(t){var r=this.__data__=new m(t);this.size=r.size}g.prototype.clear=Ut;g.prototype.delete=Lt;g.prototype.get=Vt;g.prototype.has=Dt;g.prototype.set=Gt;function Kt(t,r){for(var e=-1,n=t==null?0:t.length,c=0,p=[];++e<n;){var f=t[e];r(f,e,t)&&(p[c++]=f)}return p}function Rt(){return[]}var Wt=Object.prototype,Nt=Wt.propertyIsEnumerable,P=Object.getOwnPropertySymbols,qt=P?function(t){return t==null?[]:(t=Object(t),Kt(P(t),function(r){return Nt.call(t,r)}))}:Rt;function Ht(t,r,e){var n=r(t);return E(t)?n:W(n,e(t))}function re(t){return Ht(t,kt,qt)}var h=l(i,"DataView"),j=l(i,"Promise"),A=l(i,"Set"),M="[object Map]",Jt="[object Object]",C="[object Promise]",$="[object Set]",I="[object WeakMap]",B="[object DataView]",Xt=u(h),Yt=u(y),Zt=u(j),Qt=u(A),te=u(T),s=_;(h&&s(new h(new ArrayBuffer(1)))!=B||y&&s(new y)!=M||j&&s(j.resolve())!=C||A&&s(new A)!=$||T&&s(new T)!=I)&&(s=function(t){var r=_(t),e=r==Jt?t.constructor:void 0,n=e?u(e):"";if(n)switch(n){case Xt:return B;case Yt:return M;case Zt:return C;case Qt:return $;case te:return I}return r});var ae=i.Uint8Array;export{g as S,ae as U,Ct as a,N as b,s as c,xt as d,Q as e,re as f,qt as g,Ot as h,H as i,kt as k,S as n,$t as o,Rt as s};
