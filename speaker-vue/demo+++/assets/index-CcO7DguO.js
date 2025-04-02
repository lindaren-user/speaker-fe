import{cw as ye,cx as Ie,cf as Se,cy as xe,cz as Ce,M as ke,bd as Ve,al as we,R as Ee,l as R,bh as Me,b as x,bg as U,an as Te,P as Le,a0 as Ae,a4 as M,c2 as Pe,e as d,cd as C,cA as Re,cc as Be,ap as B,bf as _,ba as T,b_ as _e,ak as z,bc as Ne,ao as ze,cB as Y,i as De,au as J,cC as Oe,Q as We,cD as Fe,aq as qe}from"./index-D4QMGDdD.js";import{C as je,c as $e}from"./index-Qmdp2F1t.js";import{u as He}from"./use-id-BVojlOEE.js";function X(t){return Array.isArray(t)?!t.length:t===0?!1:!t}function Ke(t,n){if(X(t)){if(n.required)return!1;if(n.validateEmpty===!1)return!0}return!(n.pattern&&!n.pattern.test(String(t)))}function Ue(t,n){return new Promise(r=>{const f=n.validator(t,n);if(Ce(f)){f.then(r);return}r(f)})}function Q(t,n){const{message:r}=n;return xe(r)?r(t,n):r||""}function Ye({target:t}){t.composing=!0}function G({target:t}){t.composing&&(t.composing=!1,t.dispatchEvent(new Event("input")))}function Je(t,n){const r=ye();t.style.height="auto";let f=t.scrollHeight;if(Ie(n)){const{maxHeight:l,minHeight:s}=n;l!==void 0&&(f=Math.min(f,l)),s!==void 0&&(f=Math.max(f,s))}f&&(t.style.height=`${f}px`,Se(r))}function Qe(t,n){return t==="number"&&(t="text",n??(n="decimal")),t==="digit"&&(t="tel",n??(n="numeric")),{type:t,inputmode:n}}function v(t){return[...t].length}function N(t,n){return[...t].slice(0,n).join("")}const[Ge,g]=we("field"),Xe={id:String,name:String,leftIcon:String,rightIcon:String,autofocus:Boolean,clearable:Boolean,maxlength:z,max:Number,min:Number,formatter:Function,clearIcon:T("clear"),modelValue:_e(""),inputAlign:String,placeholder:String,autocomplete:String,autocapitalize:String,autocorrect:String,errorMessage:String,enterkeyhint:String,clearTrigger:T("focus"),formatTrigger:T("onChange"),spellcheck:{type:Boolean,default:null},error:{type:Boolean,default:null},disabled:{type:Boolean,default:null},readonly:{type:Boolean,default:null},inputmode:String},Ze=Ve({},$e,Xe,{rows:z,type:T("text"),rules:Array,autosize:[Boolean,Object],labelWidth:z,labelClass:Ne,labelAlign:String,showWordLimit:Boolean,errorMessageAlign:String,colon:{type:Boolean,default:null}});var pe=ke({name:Ge,props:Ze,emits:["blur","focus","clear","keypress","clickInput","endValidate","startValidate","clickLeftIcon","clickRightIcon","update:modelValue"],setup(t,{emit:n,slots:r}){const f=He(),l=Ee({status:"unvalidated",focused:!1,validateMessage:""}),s=R(),D=R(),L=R(),{parent:m}=Me(ze),S=()=>{var e;return String((e=t.modelValue)!=null?e:"")},u=e=>{if(C(t[e]))return t[e];if(m&&C(m.props[e]))return m.props[e]},Z=x(()=>{const e=u("readonly");if(t.clearable&&!e){const a=S()!=="",i=t.clearTrigger==="always"||t.clearTrigger==="focus"&&l.focused;return a&&i}return!1}),O=x(()=>L.value&&r.input?L.value():t.modelValue),p=x(()=>{var e;const a=u("required");return a==="auto"?(e=t.rules)==null?void 0:e.some(i=>i.required):a}),ee=e=>e.reduce((a,i)=>a.then(()=>{if(l.status==="failed")return;let{value:o}=O;if(i.formatter&&(o=i.formatter(o,i)),!Ke(o,i)){l.status="failed",l.validateMessage=Q(o,i);return}if(i.validator)return X(o)&&i.validateEmpty===!1?void 0:Ue(o,i).then(c=>{c&&typeof c=="string"?(l.status="failed",l.validateMessage=c):c===!1&&(l.status="failed",l.validateMessage=Q(o,i))})}),Promise.resolve()),k=()=>{l.status="unvalidated",l.validateMessage=""},W=()=>n("endValidate",{status:l.status,message:l.validateMessage}),F=(e=t.rules)=>new Promise(a=>{k(),e?(n("startValidate"),ee(e).then(()=>{l.status==="failed"?(a({name:t.name,message:l.validateMessage}),W()):(l.status="passed",a(),W())})):a()}),A=e=>{if(m&&t.rules){const{validateTrigger:a}=m.props,i=Y(a).includes(e),o=t.rules.filter(c=>c.trigger?Y(c.trigger).includes(e):i);o.length&&F(o)}},te=e=>{var a;const{maxlength:i}=t;if(C(i)&&v(e)>+i){const o=S();if(o&&v(o)===+i)return o;const c=(a=s.value)==null?void 0:a.selectionEnd;if(l.focused&&c){const y=[...e],I=y.length-+i;return y.splice(c-I,I),y.join("")}return N(e,+i)}return e},V=(e,a="onChange")=>{var i,o;const c=e;e=te(e);const y=v(c)-v(e);if(t.type==="number"||t.type==="digit"){const b=t.type==="number";if(e=Re(e,b,b),a==="onBlur"&&e!==""&&(t.min!==void 0||t.max!==void 0)){const h=Be(+e,(i=t.min)!=null?i:-1/0,(o=t.max)!=null?o:1/0);+e!==h&&(e=h.toString())}}let I=0;if(t.formatter&&a===t.formatTrigger){const{formatter:b,maxlength:h}=t;if(e=b(e),C(h)&&v(e)>+h&&(e=N(e,+h)),s.value&&l.focused){const{selectionEnd:E}=s.value,K=N(c,E);I=v(b(K))-v(K)}}if(s.value&&s.value.value!==e)if(l.focused){let{selectionStart:b,selectionEnd:h}=s.value;if(s.value.value=e,C(b)&&C(h)){const E=v(e);y?(b-=y,h-=y):I&&(b+=I,h+=I),s.value.setSelectionRange(Math.min(b,E),Math.min(h,E))}}else s.value.value=e;e!==t.modelValue&&n("update:modelValue",e)},ne=e=>{e.target.composing||V(e.target.value)},P=()=>{var e;return(e=s.value)==null?void 0:e.blur()},q=()=>{var e;return(e=s.value)==null?void 0:e.focus()},w=()=>{const e=s.value;t.type==="textarea"&&t.autosize&&e&&Je(e,t.autosize)},ae=e=>{l.focused=!0,n("focus",e),M(w),u("readonly")&&P()},ie=e=>{l.focused=!1,V(S(),"onBlur"),n("blur",e),!u("readonly")&&(A("onBlur"),M(w),Oe())},j=e=>n("clickInput",e),le=e=>n("clickLeftIcon",e),re=e=>n("clickRightIcon",e),oe=e=>{B(e),n("update:modelValue",""),n("clear",e)},$=x(()=>{if(typeof t.error=="boolean")return t.error;if(m&&m.props.showError&&l.status==="failed")return!0}),se=x(()=>{const e=u("labelWidth"),a=u("labelAlign");if(e&&a!=="top")return{width:U(e)}}),ce=e=>{e.keyCode===13&&(!(m&&m.props.submitOnEnter)&&t.type!=="textarea"&&B(e),t.type==="search"&&P()),n("keypress",e)},H=()=>t.id||`${f}-input`,ue=()=>l.status,de=()=>{const e=g("control",[u("inputAlign"),{error:$.value,custom:!!r.input,"min-height":t.type==="textarea"&&!t.autosize}]);if(r.input)return d("div",{class:e,onClick:j},[r.input()]);const a={id:H(),ref:s,name:t.name,rows:t.rows!==void 0?+t.rows:void 0,class:e,disabled:u("disabled"),readonly:u("readonly"),autofocus:t.autofocus,placeholder:t.placeholder,autocomplete:t.autocomplete,autocapitalize:t.autocapitalize,autocorrect:t.autocorrect,enterkeyhint:t.enterkeyhint,spellcheck:t.spellcheck,"aria-labelledby":t.label?`${f}-label`:void 0,"data-allow-mismatch":"attribute",onBlur:ie,onFocus:ae,onInput:ne,onClick:j,onChange:G,onKeypress:ce,onCompositionend:G,onCompositionstart:Ye};return t.type==="textarea"?d("textarea",J(a,{inputmode:t.inputmode}),null):d("input",J(Qe(t.type,t.inputmode),a),null)},fe=()=>{const e=r["left-icon"];if(t.leftIcon||e)return d("div",{class:g("left-icon"),onClick:le},[e?e():d(_,{name:t.leftIcon,classPrefix:t.iconPrefix},null)])},ge=()=>{const e=r["right-icon"];if(t.rightIcon||e)return d("div",{class:g("right-icon"),onClick:re},[e?e():d(_,{name:t.rightIcon,classPrefix:t.iconPrefix},null)])},me=()=>{if(t.showWordLimit&&t.maxlength){const e=v(S());return d("div",{class:g("word-limit")},[d("span",{class:g("word-num")},[e]),De("/"),t.maxlength])}},he=()=>{if(m&&m.props.showErrorMessage===!1)return;const e=t.errorMessage||l.validateMessage;if(e){const a=r["error-message"],i=u("errorMessageAlign");return d("div",{class:g("error-message",i)},[a?a({message:e}):e])}},be=()=>{const e=u("labelWidth"),a=u("labelAlign"),i=u("colon")?":":"";if(r.label)return[r.label(),i];if(t.label)return d("label",{id:`${f}-label`,for:r.input?void 0:H(),"data-allow-mismatch":"attribute",onClick:o=>{B(o),q()},style:a==="top"&&e?{width:U(e)}:void 0},[t.label+i])},ve=()=>[d("div",{class:g("body")},[de(),Z.value&&d(_,{ref:D,name:t.clearIcon,class:g("clear")},null),ge(),r.button&&d("div",{class:g("button")},[r.button()])]),me(),he()];return Te({blur:P,focus:q,validate:F,formValue:O,resetValidation:k,getValidationStatus:ue}),We(Fe,{customValue:L,resetValidation:k,validateWithTrigger:A}),Le(()=>t.modelValue,()=>{V(S()),k(),A("onChange"),M(w)}),Ae(()=>{V(S(),t.formatTrigger),M(w)}),Pe("touchstart",oe,{target:x(()=>{var e;return(e=D.value)==null?void 0:e.$el})}),()=>{const e=u("disabled"),a=u("labelAlign"),i=fe(),o=()=>{const c=be();return a==="top"?[i,c].filter(Boolean):c||[]};return d(je,{size:t.size,class:g({error:$.value,disabled:e,[`label-${a}`]:a}),center:t.center,border:t.border,isLink:t.isLink,clickable:t.clickable,titleStyle:se.value,valueClass:g("value"),titleClass:[g("label",[a,{required:p.value}]),t.labelClass],arrowDirection:t.arrowDirection},{icon:i&&a!=="top"?()=>i:null,title:o,value:ve,extra:r.extra})}}});const at=qe(pe);export{at as F};
