import{I as M,c as o,s as u,A as C,_ as L,r as f,o as c,a as h,b as a,t as _,F as D,d as T,w as v,v as w}from"./index-325a8a57.js";import{i as j}from"./iconNumber-3e077b24.js";import{d as y}from"./dayjs.min-d0acd830.js";const x=M("save",!0,function(e){return o("svg",{width:e.size,height:e.size,viewBox:"0 0 48 48",fill:"none"},[o("path",{d:"M6 9C6 7.34315 7.34315 6 9 6H34.2814L42 13.2065V39C42 40.6569 40.6569 42 39 42H9C7.34315 42 6 40.6569 6 39V9Z",fill:e.colors[1],stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linejoin":e.strokeLinejoin},null),o("path",{"fill-rule":"evenodd","clip-rule":"evenodd",d:"M24.0083 6L24 13.3846C24 13.7245 23.5523 14 23 14H15C14.4477 14 14 13.7245 14 13.3846L14 6",fill:e.colors[3]},null),o("path",{d:"M24.0083 6L24 13.3846C24 13.7245 23.5523 14 23 14H15C14.4477 14 14 13.7245 14 13.3846L14 6H24.0083Z",stroke:e.colors[2],"stroke-width":e.strokeWidth,"stroke-linejoin":e.strokeLinejoin},null),o("path",{d:"M9 6H34.2814",stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap,"stroke-linejoin":e.strokeLinejoin},null),o("path",{d:"M14 26H34",stroke:e.colors[2],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap,"stroke-linejoin":e.strokeLinejoin},null),o("path",{d:"M14 34H24.0083",stroke:e.colors[2],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap,"stroke-linejoin":e.strokeLinejoin},null)])}),H=M("weight",!0,function(e){return o("svg",{width:e.size,height:e.size,viewBox:"0 0 48 48",fill:"none"},[o("path",{d:"M41 4H7C5.34315 4 4 5.34315 4 7V41C4 42.6569 5.34315 44 7 44H41C42.6569 44 44 42.6569 44 41V7C44 5.34315 42.6569 4 41 4Z",fill:e.colors[1],stroke:e.colors[0],"stroke-width":e.strokeWidth,"stroke-linejoin":e.strokeLinejoin},null),o("path",{d:"M12 19.0537C15.3249 15.0537 19.3249 13.0537 24 13.0537C28.6751 13.0537 32.6751 15.0537 36 19.0537",stroke:e.colors[2],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap},null),o("path",{d:"M24 31C25.6569 31 27 29.6569 27 28C27 26.3431 25.6569 25 24 25C22.3431 25 21 26.3431 21 28C21 29.6569 22.3431 31 24 31Z",fill:e.colors[2]},null),o("path",{d:"M19 21L24.0083 28",stroke:e.colors[2],"stroke-width":e.strokeWidth,"stroke-linecap":e.strokeLinecap},null)])}),V={name:"home",components:{Save:x,Weight:H,iconNumber:j},data(){return{recordingTable:[],recorder:{},saving:!1}},async mounted(){this.recordingTable=await u().getRecordingTable,this.reset()},methods:{reset(){this.recordingTable.map(e=>{switch(e.colType){case"text":this.recorder[e.id]="";break;case"number":this.recorder[e.id]=0;break;case"datetime-local":this.recorder[e.id]=y().format("YYYY-MM-DDTHH:mm");break}})},randomValue(){let e="";const n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";for(let l=0;l<length;l++)e+=n.charAt(Math.floor(Math.random()*n.length));const b=new Date,d=new Date;d.setDate(d.getDate()-7);const s=new Date(d.getTime()+Math.random()*(b.getTime()-d.getTime())),i=s.getFullYear(),k=s.getMonth()+1,m=s.getDate(),g=s.getHours(),t=s.getMinutes(),r=`${i}-${k.toString().padStart(2,"0")}-${m.toString().padStart(2,"0")}T${g.toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`;this.recordingTable.map(l=>{switch(l.colType){case"text":this.recorder[l.id]=e;break;case"number":this.recorder[l.id]=Math.round(Math.random()*200);break;case"datetime-local":this.recorder[l.id]=y(r).format("YYYY-MM-DDTHH:mm");break}})},save(){this.saving=!0;let e="";if(this.recorder[0]||(e=this.$t("_col_date_errorMsg1")),e.length>0){C().error(e,{position:"top"});return}u().nowLoading=this.$t("_home_save"),u().insertBodyFatDatalist(this.recorder),setTimeout(()=>{u().nowLoading="",this.saving=!1,this.reset()},1e3)},inputFocus(e){e.target.select()}}},S={class:""},F={class:"flex justify-center items-center"},W={class:"text-2xl font-bold text-center mt-2"},Y=["for"],B={class:""},N={class:"label-xl w-1/3"},p=["type","id","onUpdate:modelValue","disabled"],z=["type","id","onUpdate:modelValue","disabled"],A={class:"flex justify-center mt-2"},I=["disabled"];function U(e,n,b,d,s,i){const k=f("weight"),m=f("icon-number"),g=f("save");return c(),h("div",S,[a("div",F,[a("p",W,_(e.$t("_bodyFatRecorder")),1),o(k,{theme:"filled",size:"24",fill:"#000000",onClick:i.randomValue},null,8,["onClick"])]),(c(!0),h(D,null,T(s.recordingTable,t=>(c(),h("label",{key:t.id,for:t.colName,class:"text-gray-700 flex mt-1 items-center px-2"},[a("span",B,[o(m,{fromId:t.id},null,8,["fromId"])]),a("span",N,_(t.colName),1),t.colType==="datetime-local"?v((c(),h("input",{key:0,type:t.colType,id:t.colName,class:"input py-2 text-lg w-1/2","onUpdate:modelValue":r=>s.recorder[t.id]=r,onFocus:n[0]||(n[0]=r=>i.inputFocus(r)),disabled:s.saving},null,40,p)),[[w,s.recorder[t.id]]]):v((c(),h("input",{key:1,type:t.colType,id:t.colName,class:"input py-2 w-1/2","onUpdate:modelValue":r=>s.recorder[t.id]=r,onFocus:n[1]||(n[1]=r=>i.inputFocus(r)),disabled:s.saving},null,40,z)),[[w,s.recorder[t.id]]])],8,Y))),128)),a("div",A,[a("button",{class:"inAppBtn",onClick:n[2]||(n[2]=(...t)=>i.save&&i.save(...t)),disabled:s.saving},[o(g,{theme:"filled",size:"24",fill:"#000000"}),a("span",null,_(e.$t("_save")),1)],8,I)])])}const q=L(V,[["render",U]]);export{q as default};
