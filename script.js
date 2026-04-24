const STAGES=[
  {id:1275,label:"Kontaktovat",sub:"Nové leady",dot:"#94a3b8",accent:"#475569"},
  {id:1276,label:"Kontaktováno",sub:"V dialogu",dot:"#3b82f6",accent:"#1d4ed8"},
  {id:1277,label:"Má zájem",sub:"Zájem potvrzen",dot:"#f59e0b",accent:"#b45309"},
  {id:1278,label:"Nabídka zaslána",sub:"Čeká na rozhodnutí",dot:"#8b5cf6",accent:"#6d28d9"},
  {id:1279,label:"✦ Vyhráli jsme",sub:"Uzavřeno",dot:"#a07820",accent:"#7a5c10"},
  {id:1280,label:"Prohráli jsme",sub:"Archived",dot:"#cbd5e1",accent:"#94a3b8",muted:true},
];

const DATA=[
  {id:80696,stageId:1275,name:"Pension Krakonoš",company:"Pension Krakonoš Špindlerův Mlýn",contact:"Eva Mrázková",title:"Majitelka",email:"krakonos@spindl.cz",phone:"+420 499 433 200",stars:3,rooms:22,value:58000,series:"HOTTELO Classic",note:"Warm lead z veletrhu Regiontour 2025. Dosud nekontaktováno.",tags:["Horský resort","Penzion"],priority:"medium",added:"15.1.2025"},
  {id:80695,stageId:1276,name:"Hotel Savoy Brno",company:"Boutique Hotel Savoy Brno",contact:"Martin Horáček",title:"Owner",email:"info@hotelsavoy-brno.cz",phone:"+420 542 213 456",stars:4,rooms:45,value:112000,series:"HOTTELO Classic",note:"Telefonní hovor 5.4.2025. Zájem o základní řadu.",tags:["Boutique","City"],priority:"medium",added:"5.4.2025"},
  {id:80693,stageId:1277,name:"Hotel Zlatá Hvězda",company:"Hotel Zlatá Hvězda Třeboň",contact:"Pavel Beneš",title:"Manažer",email:"recepce@zlatahvezda-trebon.cz",phone:"+420 384 721 111",stars:4,rooms:68,value:175000,series:"HOTTELO Green",note:"Poptávka přes web 8.4.2025. Zájem o ekologickou řadu.",tags:["Wellness","Eco"],priority:"high",added:"8.4.2025"},
  {id:80694,stageId:1278,name:"Grand Spa K. Vary",company:"Grand Spa Karlovy Vary a.s.",contact:"Ing. Jana Novotná",title:"Vedoucí nákupu",email:"purchasing@grandspa-kv.cz",phone:"+420 353 224 100",stars:5,rooms:120,value:380000,series:"HOTTELO Prestige",note:"Schůzka 28.4.2025. Žádá vzorky produktů.",tags:["Lázeňský","5★"],priority:"high",added:"10.4.2025"},
  {id:80692,stageId:1278,name:"Hotel Paříž Praha",company:"Hotel Paříž Praha s.r.o.",contact:"Mgr. Tereza Kovářová",title:"Ředitelka hotelu",email:"obchod@hotelpariz.cz",phone:"+420 222 195 195",stars:5,rooms:93,value:480000,series:"HOTTELO Prestige + Spa",note:"Schůzka 12.4. · Nabídka zaslána 15.4. · Čeká na schválení investičního výboru.",tags:["Historický","Praha","VIP"],priority:"vip",added:"12.4.2025",vip:true},
  {id:80697,stageId:1279,name:"Wellness Resort Luhačovice",company:"Wellness Resort Luhačovice",contact:"MUDr. Radek Šimánek",title:"Ředitel",email:"vedeni@wellness-luhacovice.cz",phone:"+420 577 133 000",stars:4,rooms:85,value:290000,series:"HOTTELO Spa Edition",note:"Smlouva finalizována. Čeká na podpis. Dodávky čtvrtletně.",tags:["Lázeňský","Spa"],priority:"won",added:"2.3.2025",won:true},
];

let contacts=[...DATA];
let filter="all";
let expanded={};

const czk=v=>new Intl.NumberFormat("cs-CZ",{style:"currency",currency:"CZK",maximumFractionDigits:0}).format(v);
const stars=n=>"★".repeat(n)+"☆".repeat(5-n);
const BADGE={vip:["#fef3d0","#7a5c10","VIP"],high:["#fee2e2","#991b1b","HIGH"],medium:["#f1f0eb","#6b6958","—"],won:["#dcfce7","#166534","WON"]};

function setFilter(f,btn){filter=f;document.querySelectorAll(".filter-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");render();}

function move(id,toStageId){
  const c=contacts.find(x=>x.id===id);
  const s=STAGES.find(x=>x.id===toStageId);
  contacts=contacts.map(x=>x.id===id?{...x,stageId:toStageId}:x);
  notify(`${c.name} přesunut → ${s.label.replace("✦ ","")}`);
  render();
}

function notify(msg){
  const n=document.getElementById("notif");
  n.textContent="✓ "+msg;
  n.style.display="block";
  setTimeout(()=>n.style.display="none",3000);
}

function render(){
  const q=document.getElementById("search").value.toLowerCase();
  const visible=contacts.filter(c=>{
    const ms=!q||c.name.toLowerCase().includes(q)||c.company.toLowerCase().includes(q)||c.contact.toLowerCase().includes(q);
    const mf=filter==="all"||(filter==="vip"&&c.vip)||(filter==="high"&&(c.priority==="high"||c.priority==="vip"));
    return ms&&mf;
  });
  const pipeline=contacts.filter(c=>c.stageId!==1279&&c.stageId!==1280).reduce((s,c)=>s+c.value,0);
  const won=contacts.filter(c=>c.stageId===1279).reduce((s,c)=>s+c.value,0);
  const wonCount=contacts.filter(c=>c.stageId===1279).length;
  document.getElementById("stat-pipeline").textContent=czk(pipeline);
  document.getElementById("stat-won").textContent=czk(won);
  document.getElementById("stat-won-count").textContent=wonCount+" kontrakt"+(wonCount===1?"":"y");
  document.getElementById("stat-total").textContent=contacts.length;

  const board=document.getElementById("board");
  board.innerHTML="";
  STAGES.forEach(stage=>{
    const sc=visible.filter(c=>c.stageId===stage.id);
    const sv=sc.reduce((s,c)=>s+c.value,0);
    const col=document.createElement("div");
    col.className="column";
    if(stage.muted)col.style.opacity=".5";
    col.innerHTML=`
      <div class="col-header" style="--col-dot:${stage.dot}">
        <div class="col-title" style="color:${stage.accent}">
          ${stage.label}
          <div class="col-count" style="background:${stage.dot}22;border:1px solid ${stage.dot}55;color:${stage.accent}">${sc.length}</div>
        </div>
        <div class="col-sub">${stage.sub}</div>
        ${sc.length>0?`<div class="col-value" style="color:${stage.dot}">${czk(sv)}</div>`:""}
      </div>
      <div class="col-body">
        ${sc.length===0?'<div class="empty">— prázdná fáze —</div>':""}
        ${sc.map(c=>{
          const [bg,fg,label]=BADGE[c.priority]||BADGE.medium;
          const isOpen=expanded[c.id];
          const dot=STAGES.find(s=>s.id===c.stageId)?.dot||"#ccc";
          return`<div class="card${c.vip?" vip":""}" style="--card-accent:${dot}" onclick="toggle(${c.id})">
            <div class="card-top">
              <div>
                <div class="card-name">${c.name}</div>
                <div class="card-stars">${stars(c.stars)}</div>
              </div>
              <div class="badge" style="background:${bg};color:${fg}">${label}</div>
            </div>
            <div class="card-value">${czk(c.value)}<small>/rok</small></div>
            <div class="card-meta"><span>🏨 ${c.rooms} pokojů</span><span>📦 ${c.series}</span></div>
            <div class="tags">${c.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>
            <div class="detail${isOpen?" open":""}">
              <div class="detail-grid">
                <div><div class="detail-label">Kontakt</div><div class="detail-val">${c.contact}</div><div class="detail-sub">${c.title}</div></div>
                <div><div class="detail-label">Přidáno</div><div class="detail-val">${c.added}</div></div>
              </div>
              <div class="detail-note">${c.note}</div>
              <div class="detail-contact">✉ ${c.email}</div>
              <div class="detail-contact" style="margin-bottom:10px">☎ ${c.phone}</div>
              <div class="move-btns">
                ${STAGES.filter(s=>s.id!==c.stageId&&!s.muted).map(s=>`<button class="move-btn" style="border:1px solid ${s.dot};color:${s.accent}" onmouseenter="this.style.background='${s.dot}18'" onmouseleave="this.style.background='#fff'" onclick="event.stopPropagation();move(${c.id},${s.id})">→ ${s.label.replace("✦ ","")}</button>`).join("")}
              </div>
            </div>
          </div>`;
        }).join("")}
      </div>`;
    board.appendChild(col);
  });
}

function toggle(id){expanded[id]=!expanded[id];render();}
render();