(this["webpackJsonpfilters-plus-for-ynab"]=this["webpackJsonpfilters-plus-for-ynab"]||[]).push([[0],{170:function(e,t,n){},171:function(e,t,n){},172:function(e,t,n){},173:function(e,t,n){},174:function(e,t,n){},175:function(e,t,n){},176:function(e,t,n){},177:function(e,t,n){},178:function(e,t,n){},180:function(e,t,n){},181:function(e,t,n){"use strict";n.r(t);var a=n(1),c=n.n(a),r=n(57),s=n.n(r),i=(n(66),n(2)),o=n(3),l=n(5),u=(n(67),n(0));var d=function(e){var t=e.children,n=e.href,a=Object(l.a)(e,["children","href"]);return n?Object(u.jsx)("a",{href:n,className:"a-button",children:t}):Object(u.jsx)("button",Object(o.a)(Object(o.a)({className:"a-button"},a),{},{children:t}))};n(69);var f=function(e){var t=e.className,n=e.children,a=Object(l.a)(e,["className","children"]);return Object(u.jsx)("div",Object(o.a)(Object(o.a)({className:"a-container ".concat(t||"")},a),{},{children:n}))};n(70);var b=function(e){var t=Object(a.useState)([]),n=Object(i.a)(t,2),c=n[0],r=n[1];return Object(a.useEffect)((function(){var t=localStorage.getItem("budgets"),n=localStorage.getItem("budgetsFetchedAt");t&&n&&!function(e){var t=new Date,n=new Date(parseInt(e));return t.getTime()-n.getTime()>12e4}(n)?t&&0===c.length&&r(JSON.parse(t)):e.client.getBudgets().then((function(e){r(e.budgets),localStorage.setItem("budgets",JSON.stringify(e.budgets)),localStorage.setItem("budgetsFetchedAt",(new Date).getTime().toString())}))}),[c,e.client]),Object(u.jsxs)("div",{className:"m-budgetSelect",children:[Object(u.jsx)("span",{children:"Select your budget:"}),Object(u.jsx)("ul",{className:"m-budgetSelecti-list",children:c.map((function(t){return Object(u.jsx)("li",{className:"m-budgetSelect-item",children:Object(u.jsx)("button",{className:"m-budgetSelect-button",onClick:function(){return e.onSelect(t.id)},children:t.name})},t.id)}))})]})},m=n(58),j=n.n(m),h=n(34),g=n.n(h);function O(e){if(!e)return"";var t=g()((e.getUTCMonth()+1).toString(),2,"0"),n=g()(e.getUTCDate().toString(),2,"0");return"".concat(e.getUTCFullYear(),"-").concat(t,"-").concat(n)}n(170);var v=function(e){return Object(u.jsxs)("button",{type:"button",className:"a-toggle",role:"switch","aria-checked":e.value,onClick:function(){return e.onChange(!e.value)},children:[Object(u.jsx)("span",{className:"sr-only",children:e.label}),Object(u.jsx)("span",{"aria-hidden":"true",className:"a-toggle-head","data-checked":e.value})]})};n(171);var p=function(e){var t=e.className,n=Object(l.a)(e,["className"]);return Object(u.jsx)("div",Object(o.a)({className:"a-panel ".concat(t||"")},n))};n(172);var x=function(e){var t=e.className,n=Object(l.a)(e,["className"]);return Object(u.jsx)("div",Object(o.a)({className:"a-card-section ".concat(t||"")},n))};n(173);var S=function(e){var t=e.className,n=e.children,a=Object(l.a)(e,["className","children"]);return Object(u.jsx)("h2",Object(o.a)(Object(o.a)({className:"a-sectionTitle ".concat(t||"")},a),{},{children:n}))},y=n(35),N=n.n(y);n(174);var w=function(e){var t=Object(a.useRef)(null),n=Object(a.useState)(null),c=Object(i.a)(n,2),r=c[0],s=c[1],o=e.description?Object(u.jsx)("p",{className:"text-gray-500",children:e.description}):null;function l(){}return Object(u.jsxs)("div",{className:e.className,children:[Object(u.jsxs)("div",{className:"m-checkboxList-label ".concat(e.labelClassName||""),children:[e.label,"(",e.value.size,"/",e.items.length,")"]}),Object(u.jsx)("div",{ref:t,className:"mt-4 space-y-4 ".concat(e.listClassName||""),onClick:function(n){var a=n.target;if(t.current&&a instanceof HTMLInputElement){if(n.shiftKey&&r){var c=Array.from(t.current.querySelectorAll(".m-checkboxList-input")),i=c.indexOf(a),o=c.indexOf(r),l=Math.min(i,o),u=Math.max(i,o),d=N()(c.slice(l,u+1).map((function(e){return e.getAttribute("value")})));if(a.checked){var f=new Set(Array.from(e.value).concat(d));e.onChange({selectedIds:f})}else{var b=new Set(d),m=new Set(Array.from(e.value).filter((function(e){return!b.has(e)})));e.onChange({selectedIds:m})}}else{var j=t.current.querySelectorAll(".m-checkboxList-input:checked"),h=N()(Array.from(j).map((function(e){return e.getAttribute("value")})));e.onChange({selectedIds:new Set(h)})}s(a)}},children:e.items.map((function(t){return Object(u.jsxs)("div",{className:"relative flex items-start",children:[Object(u.jsx)("div",{className:"flex items-center h-5",children:Object(u.jsx)("input",{name:e.name,id:"".concat(e.id,"-").concat(t.id),value:t.id,type:"checkbox",className:"m-checkboxList-input",checked:e.value.has(t.id),onChange:l})}),Object(u.jsxs)("div",{className:"ml-3 text-sm",children:[Object(u.jsx)("label",{htmlFor:"".concat(e.id,"-").concat(t.id),className:"font-medium text-gray-700",children:t.name}),o]})]},t.id)}))})]})};n(175);function k(){return(k=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e}).apply(this,arguments)}function I(e,t){if(null==e)return{};var n,a,c=function(e,t){if(null==e)return{};var n,a,c={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(c[n]=e[n]);return c}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(c[n]=e[n])}return c}var C=a.createElement("path",{d:"M335 175L224 286.1L176.1 239c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l64 64C211.7 341.7 217.8 344 224 344s12.28-2.344 16.97-7.031l128-128c9.375-9.375 9.375-24.56 0-33.94S344.4 165.7 335 175zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464z"});function T(e,t){var n=e.title,c=e.titleId,r=I(e,["title","titleId"]);return a.createElement("svg",k({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 512 512",ref:t,"aria-labelledby":c},r),n?a.createElement("title",{id:c},n):null,C)}var A,L=a.forwardRef(T);n.p;!function(e){e.circleCheck="circle-check"}(A||(A={}));var E=function(e){return Object(u.jsx)(L,{className:"a-icon ".concat(e.className||"")})},D=(n(176),new Intl.DateTimeFormat("en-CA",{dateStyle:"full"})),F=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});var M=function(e){var t=e.transaction,n=e.getCategoryName,a=e.isSelected,c=Object(l.a)(e,["transaction","getCategoryName","isSelected"]),r=t.flag_color?"mod-".concat(t.flag_color):"",s=a?"mod-selected":"",i=t.subtransactions.length>0?Object(u.jsx)("div",{children:JSON.stringify(t.subtransactions)}):null,d=t.memo?Object(u.jsxs)("span",{className:"inline-block ml-3 text-sm text-gray-600",children:["\u2013 ",t.memo]}):null,f=a?Object(u.jsx)("div",{className:"m-transactionsList-item-selectedIcon",children:Object(u.jsx)(E,{name:"circleCheck"})}):null;return Object(u.jsx)("li",Object(o.a)(Object(o.a)({className:"m-transactionsList-item ".concat(s)},c),{},{children:Object(u.jsxs)("div",{className:"m-transactionsList-item-wrapper ".concat(r),children:[Object(u.jsxs)("div",{children:[Object(u.jsxs)("div",{children:[Object(u.jsx)("span",{className:"font-medium",children:t.payee_name}),d]}),Object(u.jsx)("div",{children:F.format(t.amount/1e3)}),Object(u.jsx)("div",{className:"text-sm",children:t.account_name}),i]}),Object(u.jsxs)("div",{className:"text-right flex-col justify-between",children:[Object(u.jsxs)("div",{children:[D.format(new Date(t.date)),Object(u.jsx)("br",{}),n(t.category_id)]}),f]})]})}))},_=(n(177),".m-transactionsList-item");var J=function(e){var t=Object(a.useRef)(null),n=Object(a.useState)(null),c=Object(i.a)(n,2),r=c[0],s=c[1];return Object(u.jsx)("div",{className:"m-transactionsList ".concat(e.className||""),children:Object(u.jsx)("ul",{ref:t,className:"m-transactionsList-container",children:e.transactions.map((function(n){var a;return Object(u.jsx)(M,{transaction:n,getCategoryName:e.getCategoryName,onClick:function(a){return function(n,a){var c=n.target;if(e.onSelect&&c instanceof HTMLElement){var i=[a.id],o=c.closest(_);if(t.current&&o instanceof HTMLElement){if(n.shiftKey&&r){n.preventDefault();var l=Array.from(t.current.querySelectorAll(_)),u=l.indexOf(o),d=l.indexOf(r),f=Math.min(u,d),b=Math.max(u,d);i=e.transactions.slice(f,b+1).map((function(e){return e.id}))}s(o)}e.onSelect(i,a.id)}}(a,n)},isSelected:null===(a=e.selectedTransactionIds)||void 0===a?void 0:a.has(n.id)},n.id)}))})})},R=(n(178),"fromDateFilter"),U="toDateFilter",q="selectedAccountIds",P="selectedCategoryIds",z="selectedPayeeIds",B="selectedTransactions",H="showTransfersFilter";var G=function(e){var t=e.budgetId,n=Object(a.useState)(null),c=Object(i.a)(n,2),r=c[0],s=c[1],o=Object(a.useMemo)((function(){var e=new Map;return null===r||void 0===r||r.forEach((function(t){t.categories.forEach((function(n){e.set(n.id,{name:"".concat(n.name," (").concat(t.name,")")})}))})),e}),[r]),l=Object(a.useState)(null),d=Object(i.a)(l,2),f=d[0],b=d[1],m=Object(a.useState)(null),h=Object(i.a)(m,2),g=h[0],y=h[1],N=Object(a.useState)(null),k=Object(i.a)(N,2),I=k[0],C=k[1],T=Object(a.useState)((function(){var e=localStorage.getItem(R);return e?new Date(e):null})),A=Object(i.a)(T,2),L=A[0],E=A[1],D=Object(a.useState)((function(){var e=localStorage.getItem(U);return e?new Date(e):null})),F=Object(i.a)(D,2),M=F[0],_=F[1],G=Object(a.useState)((function(){var e=localStorage.getItem(H);return!e||"false"!==e})),K=Object(i.a)(G,2),Y=K[0],Q=K[1],V=Object(a.useState)((function(){var e=localStorage.getItem(q);return e?new Set(JSON.parse(e)):new Set([])})),W=Object(i.a)(V,2),X=W[0],Z=W[1],$=Object(a.useState)((function(){var e=localStorage.getItem(P);return e?new Set(JSON.parse(e)):new Set([])})),ee=Object(i.a)($,2),te=ee[0],ne=ee[1],ae=Object(a.useState)((function(){var e=localStorage.getItem(z);return e?new Set(JSON.parse(e)):new Set([])})),ce=Object(i.a)(ae,2),re=ce[0],se=ce[1],ie=Object(a.useState)((function(){var e=localStorage.getItem(B);return e?new Set(JSON.parse(e)):new Set([])})),oe=Object(i.a)(ie,2),le=oe[0],ue=oe[1];Object(a.useEffect)((function(){r||e.client.getCategoryGroups(t).then((function(e){return s(e.category_groups)})),f||e.client.getAccounts(t).then((function(e){b(e.accounts),Z(new Set(e.accounts.map((function(e){return e.id}))))})),I||e.client.getPayees(t).then((function(e){var t=e.payees.sort((function(e,t){return e.name<t.name?-1:e.name===t.name?0:1}));C(t),se(new Set(e.payees.map((function(e){return e.id}))))})),g||e.client.getTransactions(t).then((function(e){return y(e.transactions)}))}),[e.client,t,r,f,I,g]),Object(a.useEffect)((function(){L?localStorage.setItem(R,L.toISOString()):localStorage.removeItem(R),M?localStorage.setItem(U,M.toISOString()):localStorage.removeItem(U),localStorage.setItem(H,JSON.stringify(Y)),localStorage.setItem(q,JSON.stringify(Array.from(X))),localStorage.setItem(P,JSON.stringify(Array.from(te))),localStorage.setItem(z,JSON.stringify(Array.from(re))),localStorage.setItem(B,JSON.stringify(Array.from(le)))}),[L,M,Y,X,te,re,le]);var de=Object(a.useMemo)((function(){return g?g.filter((function(e){if(L&&M){var t=new Date(e.date).getTime(),n=L.getTime(),a=M.getTime();if(!(n<=t&&t<=a))return!1}return!(!Y&&e.transfer_account_id)&&(!!X.has(e.account_id)&&(!!te.has(e.category_id)&&!!re.has(e.payee_id)))})):[]}),[g,L,M,Y,X,te,re]),fe=function(e){var t;return(null===(t=o.get(e))||void 0===t?void 0:t.name)||e};if(!r||!f||!I||!g)return Object(u.jsx)("span",{children:"Loading..."});var be=g.filter((function(e){return le.has(e.id)}));return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsx)(S,{children:"Filters"}),Object(u.jsxs)(p,{children:[Object(u.jsxs)(x,{children:[Object(u.jsx)("h3",{className:"p-transactions-filterHeading",children:"Date Range"}),Object(u.jsx)("input",{className:"p-transactions-dateInput",type:"date",value:O(L),onChange:function(e){return E(e.target.valueAsDate)}}),Object(u.jsx)("span",{className:"inline-block mx-5",children:" \u2013 "}),Object(u.jsx)("input",{className:"p-transactions-dateInput",type:"date",value:O(M),onChange:function(e){return _(e.target.valueAsDate)}})]}),Object(u.jsx)(x,{children:Object(u.jsxs)("div",{className:"flex items-center mt-4",children:[Object(u.jsx)(v,{label:"Show Transfer",value:Y,onChange:function(e){return Q(e)}}),Object(u.jsx)("h3",{className:"p-transactions-filterHeading mod-toggleLabel",onClick:function(){return Q(!Y)},children:"Show Transfers"})]})}),Object(u.jsx)(x,{children:Object(u.jsx)(w,{id:"accounts",name:"accounts",label:"Accounts",items:f.map((function(e){return{id:e.id,name:e.name}})),className:"p-transactions-checkboxList",labelClassName:"p-transactions-filterHeading",listClassName:"p-transactions-checkboxList-list",value:X,onChange:function(e){return Z(e.selectedIds)}})}),Object(u.jsx)(x,{children:Object(u.jsx)(w,{id:"categories",name:"categories",label:"Categories",items:j()(r.map((function(e){return e.categories.map((function(t){var n=t.id,a=t.name;return{id:n,name:"".concat(a," (").concat(e.name,")")}}))}))),className:"p-transactions-checkboxList",labelClassName:"p-transactions-filterHeading",listClassName:"p-transactions-checkboxList-list",value:te,onChange:function(e){return ne(e.selectedIds)}})}),Object(u.jsx)(x,{children:Object(u.jsx)(w,{id:"payees",name:"payees",label:"Payees",items:I.map((function(e){return{id:e.id,name:e.name}})),className:"p-transactions-checkboxList",labelClassName:"p-transactions-filterHeading",listClassName:"p-transactions-checkboxList-list",value:re,onChange:function(e){return se(e.selectedIds)}})})]}),Object(u.jsxs)(S,{children:["Transactions (",le.size,"/",de.length,")"]}),Object(u.jsx)("div",{className:"p-transactions-window",children:Object(u.jsx)(J,{transactions:de,getCategoryName:fe,onSelect:function(e,t){var n=le.has(t);e.forEach((function(e){n?le.delete(e):le.add(e)})),ue(new Set(le))},selectedTransactionIds:le})}),Object(u.jsxs)(S,{children:["Selected Transactions (",be.length,")"]}),Object(u.jsx)("div",{className:"p-transactions-window",children:Object(u.jsx)(J,{transactions:be,getCategoryName:fe})})]})},K=n(4),Y=n.n(K),Q=n(8),V=n(10),W=n(23),X=n(59),Z=n(60),$=n(61),ee=function(e){Object(X.a)(n,e);var t=Object(Z.a)(n);function n(e,a){var c;return Object(V.a)(this,n),(c=t.call(this,e)).responseError=void 0,c.responseError=a,c}return n}(Object($.a)(Error));function te(e){return void 0!==e.error}var ne=function(){function e(t){Object(V.a)(this,e),this.body=void 0,this.body=t}return Object(W.a)(e,[{key:"data",get:function(){return te(this.body)?null:this.body.data}},{key:"error",get:function(){return te(this.body)?this.body.error:null}}]),e}(),ae=function(){function e(t){Object(V.a)(this,e),this.accessToken="",this.baseUrl="https://api.youneedabudget.com/v1",t&&(this.accessToken=t)}return Object(W.a)(e,[{key:"updateAccessToken",value:function(e){this.accessToken=e}},{key:"getUserInfo",value:function(){var e=Object(Q.a)(Y.a.mark((function e(){return Y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getRequest("/user");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getBudgets",value:function(){var e=Object(Q.a)(Y.a.mark((function e(){return Y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getRequest("/budgets");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getTransactions",value:function(){var e=Object(Q.a)(Y.a.mark((function e(t){return Y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getRequest("/budgets/".concat(t,"/transactions"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getCategoryGroups",value:function(){var e=Object(Q.a)(Y.a.mark((function e(t){return Y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getRequest("/budgets/".concat(t,"/categories"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getAccounts",value:function(){var e=Object(Q.a)(Y.a.mark((function e(t){return Y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getRequest("/budgets/".concat(t,"/accounts"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getPayees",value:function(){var e=Object(Q.a)(Y.a.mark((function e(t){return Y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.getRequest("/budgets/".concat(t,"/payees"));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"getRequest",value:function(){var e=Object(Q.a)(Y.a.mark((function e(t){var n,a,c;return Y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch(this.baseUrl+t,{headers:{Authorization:"Bearer ".concat(this.accessToken)}});case 2:return n=e.sent,e.next=5,n.json();case 5:if(a=e.sent,!(c=new ne(a)).data){e.next=11;break}return e.abrupt("return",c.data);case 11:if(!c.error){e.next=15;break}throw new ee(c.error.name,c.error);case 15:throw new Error("Unhandled server response");case 16:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),ce=(n(180),window.location.origin+window.location.pathname),re="https://app.youneedabudget.com/oauth/authorize?client_id=".concat("71591f4ec6dae7f1ff9a3b58f5a33064478f1b56f3e5a1642352292580bc88a3","&redirect_uri=").concat(ce,"&response_type=token"),se=new ae;var ie=function(){var e=Object(a.useState)(!0),t=Object(i.a)(e,2),n=t[0],c=t[1],r=Object(a.useState)(null),s=Object(i.a)(r,2),o=s[0],l=s[1];Object(a.useEffect)((function(){var e=localStorage.getItem("accessToken");if(e)se.updateAccessToken(e),se.getUserInfo().then((function(){l(e)})).catch((function(e){localStorage.removeItem("accessToken"),l(null)})).finally((function(){c(!1)}));else{var t=window.location.hash.replace("#",""),n=new URLSearchParams(t).get("access_token");n&&(localStorage.setItem("accessToken",n),window.location.href=ce),c(!1)}}),[o]);var m=Object(a.useState)(null),j=Object(i.a)(m,2),h=j[0],g=j[1];return Object(a.useEffect)((function(){var e=localStorage.getItem("activeBudgetId");e?g(e):h&&localStorage.setItem("activeBudgetId",h)}),[h]),n?Object(u.jsx)("div",{children:"Initializing..."}):o?h?Object(u.jsx)(f,{className:"app-transactions",children:Object(u.jsx)(G,{budgetId:h,client:se})}):Object(u.jsx)("div",{className:"app-budgets",children:Object(u.jsx)(b,{client:se,onSelect:function(e){return g(e)}})}):Object(u.jsx)("div",{className:"app-authorize",children:Object(u.jsx)(d,{href:re,children:"Connect with YNAB"})})},oe=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,182)).then((function(t){var n=t.getCLS,a=t.getFID,c=t.getFCP,r=t.getLCP,s=t.getTTFB;n(e),a(e),c(e),r(e),s(e)}))};s.a.render(Object(u.jsx)(c.a.StrictMode,{children:Object(u.jsx)(ie,{})}),document.getElementById("root")),oe(console.log)},66:function(e,t,n){},67:function(e,t,n){},69:function(e,t,n){},70:function(e,t,n){}},[[181,1,2]]]);
//# sourceMappingURL=main.4d1c936a.chunk.js.map