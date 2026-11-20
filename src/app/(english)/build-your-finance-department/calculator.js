const etqaan = 'https://etqaan.ae/uae-salary-guide-2026/';

const charterhouse = 'https://www.charterhouseme.ae/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMGdPTXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--7a91f08d6f61672fb8578801b0dab6d5aa0441a8/All%20Sectors%20Salary%20Survey%202026.pdf';

export const roles = [
  {name:'Fractional CFO', rate:160, market:500, grossAnnual:810000, color:'var(--amber-400)', marketNote:'On-demand CFO, Dubai, AED 500–750/hr with a 24-hour minimum', source:'My Taxman',url:'https://mytaxman.ae/cfo-services-dubai/',salarySource:'Etqaan',salaryUrl:etqaan},
  {name:'Fractional controller', rate:100, market:40*3.6725, grossAnnual:420000, color:'var(--amber-500)',marketNote:'Offshore controller serving US firms, USD 40–75/hr',source:'Madras Accountancy',url:'https://madrasaccountancy.com/blog-posts/outsourced-controller-services-pricing-2026',salarySource:'Charterhouse',salaryUrl:charterhouse},
  {name:'Senior accountant', rate:50, market:150, grossAnnual:138000, color:'var(--stone-250)',marketNote:'Dubai accounting services, AED 150–400/hr',source:'EBS',url:'https://www.ebs.ae/how-much-do-accounting-services-cost-in-dubai-2026-pricing-models/',salarySource:'Etqaan',salaryUrl:etqaan},
  {name:'Junior accountant',rate:30,market:40,grossAnnual:66000,color:'var(--stone-400)',marketNote:'UAE bookkeeping, from AED 40/hr',source:'Prosper Craft',url:'https://prospercraftaccounting.com/ae/',salarySource:'Etqaan',salaryUrl:etqaan},
  {name:'Junior admin support',rate:20,market:40,grossAnnual:120000,color:'var(--ivory-100)',marketNote:'General administrative virtual assistant in Dubai, AED 40–70/hr',source:'TaxAdvisors',url:'https://taxadvisors.ae/guides/cost-of-freelance-virtual-assistant-dubai-2026/',salarySource:'Charterhouse (administration support)',salaryUrl:charterhouse}
];

export const industries = [
  ['Professional services',1],['Retail & e-commerce',1.30],['Technology & SaaS',1.15],
  ['Construction & real estate',1.40],['Hospitality & restaurants',1.25],
  ['Manufacturing & distribution',1.45],['Healthcare',1.20],['Other industry',1.10]
];

export const minimumHours=[0,0,4,8,3];
export const includedWork = 'Bookkeeping with VAT filing';

const number = value => value.toLocaleString('en-US');
const money = value => value.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});

const sessionKey = 'ledgerbyte-finance-builder-v1';
const pendingWorkLabel = 'Requested work needing a quote';

function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem(sessionKey)) || {};
  } catch {
    return {};
  }
}

function inRange(value, min, max) {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function createEnquiryHref({name, industry, volume, work, pending = [], hours, subtotals, monthly, hourly, channel, cadence}) {
  const summary = [
    'Hello LedgerByte, I would like to discuss my '+name.toLowerCase()+' estimate.',
    industry+' | '+volume+' transactions/month',
    'Work covered by these hours: '+(work.join(', ') || 'Custom role hours only'),
    ...(pending.length ? [pendingWorkLabel+': '+pending.join(', ')+'. The estimate covers the hours shown.'] : []),
    ...roles.flatMap((role,i)=>hours[i]?[role.name+' · '+hours[i]+' h/month at AED '+role.rate+'/hr = AED '+number(subtotals[i])+'/month']:[]),
    'Minimum package: AED 500/month for 15 hours of bookkeeping, senior review and VAT filing.',
    'Estimated department cost: AED '+number(monthly)+'/month before tax.',
    'Blended hourly rate: AED '+money(hourly)+'/hr before tax.',
    'Preferred contact: '+channel+'; '+cadence.toLowerCase()+' check-in. Please confirm scope and availability.',
    ...(channel === 'Phone' ? ['Please call me back. My phone number (including country code): [enter your number]'] : [])
  ].join('\n');
  if (channel === 'WhatsApp') return 'https://wa.me/971561371569?text='+encodeURIComponent(summary);
  return 'mailto:info@ledgerbyte.io?subject='+encodeURIComponent('Finance department estimate — '+name)+'&body='+encodeURIComponent(summary);
}

/** Initialise the owner-approved calculator on one mounted builder. */
export function initializeBuilder(root) {
  const byId = id => root.querySelector('#' + id);
  const saved = readSession();
  const assumptions = [
    ['visa','Visa, permits, ID & fitness test per cycle (AED)',2874,0,50000],
    ['cycle','Visa cycle (years)',2,1,10],
    ['insurance','Annual medical insurance (AED)',1500,0,100000],
    ['other','Other annual employer costs (AED)',0,0,1000000],
    ['basic','Basic salary share of gross pay (%)',60,1,100],
    ['gratuity','Gratuity days per service year',21,0,30],
    ['leave','Annual leave taken (working days)',22,0,60],
    ['sick','Fully paid sick days taken',5,0,15],
    ['holidays','Weekday public holidays outside leave',10,0,25],
    ['ramadan','Ramadan working hours lost outside leave',40,0,60]
  ];
  const scheduledHours=52*40;
  const params=Object.fromEntries(assumptions.map(([key,,value])=>[key,value]));
  const salaryRates=roles.map(role=>role.grossAnnual/scheduledHours);
  for (const [key, , , min, max] of assumptions) {
    const value = saved.params?.[key];
    if (Number.isInteger(value) && inRange(value, min, max)) params[key] = value;
  }
  if (Array.isArray(saved.salaryRates)) {
    salaryRates.forEach((_, i) => {
      if (inRange(saved.salaryRates[i], 0, 10000)) salaryRates[i] = saved.salaryRates[i];
    });
  }
  function capacity(){return scheduledHours-8*(params.leave+params.sick+params.holidays)-params.ramadan;}
  function inHouseRate(index){
    const annualPay=salaryRates[index]*scheduledHours;
    const basicDaily=annualPay/12/30*params.basic/100;
    const employmentExtras=params.visa/params.cycle+params.insurance+params.other+basicDaily*params.gratuity;
    return (annualPay+employmentExtras)/capacity();
  }
  function difference(rate,reference){
    if(reference===0) return 'No benchmark';
    const pct=Math.round(Math.abs(1-rate/reference)*100);
    if(pct===0) return 'About equal';
    return pct+'% '+(rate<reference?'lower':'higher');
  }
  // Each service specifies a monthly role mix at 150 transactions.
  const services = [
    {name:includedWork,hours:minimumHours},
    {name:'Month-end reporting',hours:[0,2,4,1,0]},
    {name:'Bills & collections',hours:[0,0,1,3,3]},
    {name:'Payroll support',hours:[0,1,2,2,1]},
    {name:'Cash flow & planning',hours:[2,2,1,0,0]},
    {name:'CFO advisory',hours:[4,1,0,0,0]}
  ];
  const selected = new Set([0]);
  if (Array.isArray(saved.work)) {
    for (const value of saved.work) {
      if (Number.isInteger(value) && inRange(value, 1, services.length - 1)) selected.add(value);
    }
  }
  for (const id of ['industry', 'channel', 'cadence']) {
    const select = byId(id);
    if (Array.from(select.options).some(option => option.value === saved[id])) select.value = saved[id];
  }
  if (Number.isInteger(saved.volume) && inRange(saved.volume, 25, 2500) && saved.volume % 25 === 0) {
    byId('volume').value = saved.volume;
  }
  const adjustments = roles.map((_, i) => {
    const delta = Array.isArray(saved.adjustments) ? saved.adjustments[i] : 0;
    return Number.isInteger(delta) && inRange(delta, -1000, 1000) ? delta : 0;
  });
  function saveSession() {
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify({
        industry: byId('industry').value, volume: Number(byId('volume').value),
        work: [...selected], adjustments, params, salaryRates,
        channel: byId('channel').value, cadence: byId('cadence').value,
      }));
    } catch {
      // The calculator also works when the browser blocks storage.
    }
  }
  let hours = [];
  let suggested = [];
  const paths = {
    business:'<path d="M4 20h16M6 20V7l9-3v16M15 10h3v10M9 9h1m-1 4h1m-1 4h1"/>',
    work:'<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M9 7V5h6v2M4 12q8 5 16 0M10 13h4"/>',
    team:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 4 5"/>',
    chat:'<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 12h6"/>'
  };
  root.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+paths[el.dataset.icon]+'</svg>';
  });
  services.forEach((service,index) => {
    const button = document.createElement('button');
    button.className='chip'; button.type='button'; button.textContent=service.name;
    button.setAttribute('aria-pressed',selected.has(index));
    if(index===0){
      button.disabled=true;
      button.textContent='Included in your hours · '+includedWork;
    }
    button.addEventListener('click',() => {
      if(selected.has(index)) selected.delete(index); else selected.add(index);
      button.setAttribute('aria-pressed',selected.has(index));
      recommend();
    });
    byId('work').append(button);
  });
  roles.forEach((role,index) => {
    const row=document.createElement('div');
    row.className='quote-row';
    row.innerHTML='<div class="role-top"><strong>'+role.name+'</strong><span class="rate">AED '+role.rate+'/hr</span><label><span>Hours/mo</span><input type="number" min="0" max="1000" step="1" id="role-'+index+'" aria-label="'+role.name+' monthly hours"></label></div><div class="role-savings"><span>'+role.source+(index===1?' (US offshore)':'')+' · <b>'+difference(role.rate,role.market)+'</b> vs AED '+money(role.market)+'/hr</span><span id="hiring-'+index+'"></span></div>';
    byId('roles').append(row);
    const input=byId('role-'+index);
    input.min=minimumHours[index];
    if(minimumHours[index]) input.parentElement.firstElementChild.textContent='Min '+minimumHours[index]+' h/mo';
    input.addEventListener('input',() => {
      const value = Math.min(1000,Math.max(minimumHours[index],Math.round(Number(input.value)||0)));
      if(Number(input.value)>1000) input.value=value;
      hours[index]=value;
      adjustments[index]=value-suggested[index];
      render();
    });
    input.addEventListener('blur',() => {input.value=hours[index]});
  });
  function addAssumption(parent,id,label,value,min,max,onChange,step=1){
    const field=document.createElement('label');
    field.textContent=label;
    const input=document.createElement('input');
    Object.assign(input,{id,type:'number',min,max,step,value});
    field.append(input);parent.append(field);
    input.addEventListener('input',()=>{
      if(input.value!=='' && input.validity.valid){onChange(input.valueAsNumber);render();}
    });
    input.addEventListener('blur',()=>{
      if(input.value==='' || !input.validity.valid){
        input.value=value;onChange(value);render();
      }
    });
  }
  const fields=byId('assumption-inputs');
  assumptions.forEach(([key,label,value,min,max])=>{
    addAssumption(fields,key,label,value,min,max,v=>{params[key]=v;});
    byId(key).value=params[key];
  });
  const salaries=document.createElement('details');
  salaries.className='sources';salaries.innerHTML='<summary>Adjust gross pay by role</summary><p class="helper">AED per scheduled hour, before employer expenses and paid time off.</p><div class="assumption-grid"></div>';
  fields.after(salaries);
  roles.forEach((role,i)=>addAssumption(salaries.lastElementChild,'salary-'+i,role.name,Number(salaryRates[i].toFixed(2)),0,10000,v=>{salaryRates[i]=v;},0.01));
  byId('reset-assumptions').addEventListener('click',()=>{
    assumptions.forEach(([key,,value])=>{params[key]=value;byId(key).value=value;});
    roles.forEach((role,i)=>{salaryRates[i]=role.grossAnnual/scheduledHours;byId('salary-'+i).value=salaryRates[i].toFixed(2);});
    render();
  });
  function workloadHours(scope){
    const volume=Number(byId('volume').value);
    const complexity=industries[Number(byId('industry').value)][1];
    // Leadership and review retain a fixed component as transaction volume changes.
    const fixedShare=[0.80,0.55,0.32,0.08,0.15];
    return roles.map((_,i)=>{
      let base=0;
      scope.forEach(s => {base+=services[s].hours[i]});
      const scale=fixedShare[i]+(1-fixedShare[i])*volume/150;
      return Math.max(minimumHours[i],Math.ceil(base*complexity*scale));
    });
  }
  function recommend(){
    const volume=Number(byId('volume').value);
    suggested=workloadHours(selected);
    hours=suggested.map((h,i)=>Math.min(1000,Math.max(minimumHours[i],h+adjustments[i])));
    hours.forEach((h,i)=>{byId('role-'+i).value=h});
    byId('count').value=number(volume);
    const slider=byId('volume');
    slider.style.setProperty('--pos',100*(volume-Number(slider.min))/(Number(slider.max)-Number(slider.min))+'%');
    render();
  }
  function render(){
    const baseHours = workloadHours([0]);
    // Assign the chosen hours to the included scope first. Only its shortfall needs a quote.
    const extraBaseHours = baseHours.reduce((sum, needed, i) => sum + Math.max(0, needed - hours[i]), 0);
    const work = [includedWork], pending = [];
    if (extraBaseHours) pending.push('Additional bookkeeping and VAT filing time for this workload (' + extraBaseHours + ' h/month)');
    for (const serviceIndex of selected) {
      if (serviceIndex === 0) continue;
      const service = services[serviceIndex];
      const short = service.hours.some((h, i) => h > 0 && hours[i] < suggested[i]);
      (short ? pending : work).push(service.name);
    }
    const totalHours=hours.reduce((sum,h)=>sum+h,0);
    const houseRates=roles.map((_,i)=>inHouseRate(i));
    const blend=rates=>totalHours ? rates.reduce((sum,rate,i)=>sum+rate*hours[i],0)/totalHours : 0;
    const subtotals=hours.map((h,i)=>h*roles[i].rate);
    const monthly=subtotals.reduce((sum,amount)=>sum+amount,0);
    const hourly=totalHours ? monthly/totalHours : 0;
    byId('monthly-total').textContent=number(monthly);
    byId('workload-price').textContent='AED '+number(monthly)+' / month';
    const comparisons=[['Market benchmark',blend(roles.map(role=>role.market))],['In-house hire',blend(houseRates)]];
    byId('capacity').textContent=number(capacity())+' available working hours per hire per year, from '+number(scheduledHours)+' scheduled hours.';
    const savings=byId('savings');
    savings.innerHTML=totalHours ? comparisons.map(([label,ref])=>'<div class="comparison"><span>Compared with '+(label==='Market benchmark'?'selected provider rates':'a modeled in-house hire')+'<small>AED '+money(ref)+'/hr</small></span><strong>'+difference(hourly,ref)+'</strong></div>').join('')+'<a href="#method" id="basis-link">See comparison basis</a>' : '';
    const basis=byId('basis-link');
    if(basis) basis.onclick=()=>{byId('method').open=true;};
    const custom=hours.some((h,i)=>h!==suggested[i]);
    const name=totalHours===0?'Choose your coverage':custom?'Custom finance team':hours[0]>0?'Finance leadership':hours[1]>0?'Managed finance':'Finance essentials';
    byId('plan').textContent=name;
    byId('covered-work').textContent=work.filter(item=>item!==includedWork).join(' · ');
    const scopeNote = byId('scope-note');
    scopeNote.hidden = pending.length === 0;
    byId('workload-scope').hidden = pending.length === 0;
    scopeNote.textContent = pending.length ? pendingWorkLabel+': '+pending.join(', ')+'. The estimate covers the hours shown. Restore recommended hours to cover this workload.' : '';
    const roleGap = byId('role-gap');
    roleGap.hidden = pending.length === 0;
    roleGap.textContent = pending.length ? 'Hours below the recommended mix: '+roles.flatMap((role,i)=>hours[i]<suggested[i]?[role.name+' ('+hours[i]+' of '+suggested[i]+' h)']:[]).join(', ')+'.' : '';
    byId('total').textContent=totalHours?money(hourly):'—';
    byId('hours').textContent=number(totalHours)+' hrs / mo';
    byId('mobile-price').textContent=totalHours?'AED '+number(monthly)+' / month':'Choose your roles';
    byId('mix').replaceChildren();byId('segments').replaceChildren();
    roles.forEach((role,i)=>{
      byId('hiring-'+i).innerHTML='In-house · <b>'+difference(role.rate,houseRates[i])+'</b> vs AED '+money(houseRates[i])+'/hr';
      if(!hours[i]) return;
      const segment=document.createElement('span');
      segment.style.background=role.color;segment.style.flex=String(hours[i]);
      byId('segments').append(segment);
      const line=document.createElement('div');
      line.className='roleline';
      line.innerHTML='<span><i class="dot" style="background:'+role.color+'"></i>'+role.name+'<small class="allocation">'+number(hours[i])+' h × AED '+role.rate+'/hr</small></span><strong class="subtotal">AED '+number(subtotals[i])+'</strong>';
      byId('mix').append(line);
    });
    if(!totalHours) byId('mix').textContent='Select work or add role hours to build your estimate.';
    const channel=byId('channel').value, cadence=byId('cadence').value;
    byId('comm').textContent='Preferred contact · '+channel+' · '+cadence.toLowerCase()+' check-in';
    byId('discuss').href = createEnquiryHref({
      name, industry: industries[Number(byId('industry').value)][0], volume: byId('volume').value,
      work, pending, hours, subtotals, monthly, hourly, channel, cadence
    });
    byId('discuss').setAttribute('aria-disabled',String(!totalHours));
    byId('status').textContent=name+'. '+totalHours+' hours. Estimated department cost is AED '+number(monthly)+' per month. Your blended rate is AED '+money(hourly)+' per hour.'+(pending.length?' '+pendingWorkLabel+': '+pending.join(', ')+'.':'');
    saveSession();
  }
  byId('industry').addEventListener('change',recommend);
  byId('volume').addEventListener('input',recommend);
  byId('restore').addEventListener('click',()=>{
    adjustments.fill(0);
    recommend();
  });
  byId('channel').addEventListener('change',render);
  byId('cadence').addEventListener('change',render);
  recommend();
  byId('builder-controls').disabled = false;
  byId('adjust-hours').hidden = false;
}
