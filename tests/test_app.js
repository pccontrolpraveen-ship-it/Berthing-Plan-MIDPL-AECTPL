/* PORTVISION 3D — end-to-end regression suite (34 blocks incl. Ennore + persistence).
 * Run from the repository root:  node tests/test_app.js   →  final line: ERRORS: none */
const { chromium } = require('playwright');
const path = require('path');
const APP_URL = 'file://' + path.resolve(__dirname, '..', 'www', 'index.html');
(async () => {
  const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }));
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const errors = [];
  require('fs').mkdirSync(path.resolve(__dirname, '..', 'shots'), { recursive: true });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  /* The app probes http://localhost:4000 for a PortVision server. This suite
     covers standalone behaviour, so block that origin outright — otherwise the
     result depends on whether a developer happens to have the server running. */
  await page.route('http://localhost:4000/**', r => r.abort());
  await page.goto(APP_URL);
  await page.waitForTimeout(2200);
  await page.click('.roleCard[data-role="Vessel Planner"]');
  await page.fill('#mobile', '9840012345');
  await page.click('#sendOtp');
  const otp = await page.$$('#otpRow input');
  for (let i = 0; i < 6; i++) await otp[i].fill('123456'[i]);
  await page.click('#verifyOtp');
  await page.waitForTimeout(400);
  // 1. Empty dashboard
  console.log('T1 topchip:', await page.textContent('#tbDone'));
  const tv = await page.$$eval('.tile .tv', els => els.slice(0,3).map(e => e.textContent));
  console.log('T1 tiles:', JSON.stringify(tv));
  const green = await page.$$eval('.berthBox.gFree', els => els.length);
  console.log('T1 green berths:', green, '(expect 3)');
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v3_dash_empty.png' });
  // 2. Plan a vessel end to end
  await page.click('button[data-v="planning"]');
  await page.fill('#vesselSearch', 'SM');
  await page.waitForTimeout(200);
  await page.click('#comboList [data-vid]');
  await page.waitForTimeout(200);
  await page.selectOption('#pVoyage', 'new');
  await page.waitForTimeout(300);
  // progressive lock check: ETB/ETO/ETC locked
  const locked = await page.$$eval('.msRow.locked', els => els.length);
  console.log('T2 locked rows:', locked, '(expect 3)');
  // set ETA
  await page.fill('#etaMain', '2026-08-06T14:00');
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  // T12: draft not on dashboard until Vessel Selected
  console.log('T12 selected btn present:', !!(await page.$('#vesselSelectedBtn')));
  await page.click('#vesselSelectedBtn');
  await page.waitForTimeout(300);
  // slide ATA
  await page.evaluate(() => { const sl = document.querySelector('[data-sl="ata"]'); sl.value = 100; sl.dispatchEvent(new Event('input')); });
  await page.waitForTimeout(300);
  console.log('T2 status after ATA:', await page.textContent('.badge:last-of-type'));
  // ETB row should now be unlocked (visible slider)
  const etbSl = await page.$('[data-sl="atb"]');
  console.log('T2 ETB unlocked:', !!etbSl);
  // assign berth CB1 -> crane modal should open
  await page.click('[data-berth="CB1"]');
  await page.waitForTimeout(400);
  const modalVisible = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  console.log('T3 crane modal after berth:', modalVisible);
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v3_crane_modal.png' });
  // deploy QC01+QC02
  const cbs = await page.$$('.qcPick input');
  await cbs[0].check(); await cbs[1].check();
  await page.click('#mDeploy');
  await page.waitForTimeout(300);
  // slide ATB, ATO, ATC
  for (const k of ['atb','ato','atc']) {
    await page.evaluate((key) => { const sl = document.querySelector(`[data-sl="${key}"]`); sl.value = 100; sl.dispatchEvent(new Event('input')); }, k);
    await page.waitForTimeout(300);
  }
  // T14: hatch cover / bin box popup after ATC
  await page.waitForTimeout(400);
  const hatchShown = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  console.log('T14 hatch/bin popup after ATC:', hatchShown, !!(await page.$('#hcHat')));
  if (hatchShown) { await page.fill('#hcHat', '18'); await page.fill('#hcBin', '6'); await page.click('#hcSave'); }
  await page.waitForTimeout(300);
  console.log('T17 planner can edit actuals (pre-sailout):', (await page.$$('[data-act]')).length, 'inputs');
  await page.fill('[data-act="ata"]', '2026-08-06T15:30');
  await page.evaluate(() => document.querySelector('[data-act="ata"]').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  const ataTxt = await page.$$eval('.actualCell b', els => els[0].textContent);
  console.log('T17 ATA after planner edit:', ataTxt);
  console.log('T4 ETD row unlocked:', !!(await page.$('[data-sl="atd"]')));
  console.log('T4 sailout enabled:', await page.$eval('#sailOut', b => !b.disabled));
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v3_planning_done.png' });
  // timeline bars present
  console.log('T4 timeline bars:', await page.$$eval('.tlBar', e => e.length));
  // T10: unsaved-plan guard on navigation
  await page.click('button[data-v="dashboard"]');
  await page.waitForTimeout(300);
  const guardShown = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  console.log('T10 save-plan guard popup:', guardShown);
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v8_guard.png' });
  if (guardShown) await page.click('#mSaveGo');
  await page.waitForTimeout(300);
  console.log('T10 after save, view:', await page.textContent('#viewTitle'));
  // back to check dashboard properly
  await page.click('button[data-v="dashboard"]');
  await page.waitForTimeout(300);
  console.log('T5 topchip:', await page.textContent('#tbDone'));
  const red = await page.$$eval('.berthBox.rBusy', els => els.length);
  console.log('T5 red berths:', red, '(expect 1)');
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v3_dash_live.png' });
  // click vessel name -> twin
  await page.click('.vlink[data-fv]');
  await page.waitForTimeout(1500);
  console.log('T6 view is twin:', await page.textContent('#viewTitle'));
  const cardShown = await page.$eval('#shipCard', el => el.style.display);
  console.log('T6 ship card:', cardShown);
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v3_twin.png' });
  // 3b. Next Vessel + Condition 1 (ETA clash) + month timeline
  await page.click('button[data-v="planning"]');
  await page.waitForTimeout(200);
  await page.click('#nextVessel');
  await page.waitForTimeout(300);
  await page.fill('#vesselSearch', 'HYUNDAI');
  await page.waitForTimeout(200);
  const hHits = await page.$$eval('#comboList [data-vid]', b => b.length);
  console.log('T9 HYUNDAI vessels in master:', hHits);
  await page.click('#comboList [data-vid]');
  await page.waitForTimeout(200);
  await page.selectOption('#pVoyage', 'new');
  await page.waitForTimeout(300);
  await page.fill('#etaMain', '2026-08-06T14:00');   // same as vessel 1 -> clash
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  const clashShown = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  const clashText = clashShown ? await page.textContent('#modalBox h3') : 'none';
  console.log('T9 cond1 clash popup:', clashShown, '-', clashText);
  await page.click('#mOk');
  await page.waitForTimeout(200);
  await page.fill('#etaMain', '2026-08-10T10:00');
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  await page.click('#vesselSelectedBtn');
  await page.waitForTimeout(300);
  // T18: tentative berth selection on OCCUPIED CB1 (SM MANALI still alongside)
  await page.click('[data-berth="CB1"]');
  await page.waitForTimeout(400);
  const tentShown = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  const tentTitle = tentShown ? await page.textContent('#modalBox h3') : 'none';
  console.log('T18 tentative popup:', tentShown, '-', tentTitle);
  if (tentShown) await page.click('#mOk');
  await page.waitForTimeout(300);
  console.log('T18 berth assigned anyway:', !!(await page.$('.bCard.mine')));
  // record ATA then try ATB -> hard gate popup
  await page.evaluate(() => { const sl = document.querySelector('[data-sl="ata"]'); sl.value = 100; sl.dispatchEvent(new Event('input')); });
  await page.waitForTimeout(300);
  await page.evaluate(() => { const sl = document.querySelector('[data-sl="atb"]'); sl.value = 100; sl.dispatchEvent(new Event('input')); });
  await page.waitForTimeout(400);
  const gateShown = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  const gateTitle = gateShown ? await page.textContent('#modalBox h3') : 'none';
  console.log('T19 ATB gate popup:', gateShown, '-', gateTitle);
  if (gateShown) await page.click('#mOk');
  await page.waitForTimeout(200);
  console.log('T19 ATB still not recorded:', !(await page.evaluate(() => voyages.find(v => vOf(v).name.includes('HYUNDAI')).atb)));
  const dayCells = await page.$$eval('.tlDayCell', e => e.length);
  const tlBars2 = await page.$$eval('.tlBar', e => e.length);
  console.log('T9 month day cells:', dayCells, 'timeline bars:', tlBars2);
  // T13: + add dates extends timeline
  await page.click('#tlAddDates');
  await page.waitForTimeout(300);
  console.log('T13 day cells after +:', await page.$$eval('.tlDayCell', e => e.length), '(expect', dayCells + 7, ')');
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v7_month_timeline.png' });
  const cargoL = await page.$$eval('.cargoGrid label', l => l.map(x => x.textContent));
  console.log('T9 cargo fields:', JSON.stringify(cargoL));
  await page.click('#savePlan');
  await page.waitForTimeout(200);
  // dblclick a draggable bar -> vessel info modal
  const dbar = await page.$('.tlBar.draggable');
  if (dbar) { await dbar.dblclick(); await page.waitForTimeout(300);
    console.log('T9 dblclick info modal:', await page.$eval('#modalWrap', el => el.classList.contains('show')), 'abort btn:', !!(await page.$('#miAbort')));
    await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v7_vessel_info.png' });
    // T11: abort berthing plan
    await page.click('#miAbort'); await page.waitForTimeout(200);
    await page.click('#mAbortYes'); await page.waitForTimeout(300);
    console.log('T11 abort done — voyage removed, selection cleared:', !(await page.$('#savePlan')));
  }
  // 4. reports
  await page.click('button[data-v="reports"]');
  await page.waitForTimeout(300);
  const monthly = await page.$$eval('#repCard td', tds => tds.map(t => t.textContent));
  console.log('T7 monthly report row:', JSON.stringify(monthly));
  await page.click('[data-rt="cranewise"]');
  await page.waitForTimeout(300);
  const craneRows = await page.$$eval('#repCard tbody tr', trs => trs.length);
  console.log('T7 crane report rows:', craneRows, '(expect 2: QC01, QC02)');
  console.log('T7 pdf btn:', !!(await page.$('#pdfBtn')), 'csv btn:', !!(await page.$('#csvBtn')));
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v3_reports.png' });
  // T7b: exports actually produce something. CSV falls back to a download link
  // where the share sheet is unavailable; the PDF path prints from a hidden
  // same-page iframe, because window.open is blocked in an installed PWA and
  // in every packaged web view.
  const dl = page.waitForEvent('download', { timeout: 8000 }).catch(() => null);
  await page.click('#csvBtn');
  const got = await dl;
  console.log('T7b CSV export:', got ? got.suggestedFilename() : 'NO DOWNLOAD');
  await page.click('#pdfBtn');
  await page.waitForTimeout(900);
  const printed = await page.evaluate(() => {
    const f = document.querySelector('#printFrame');
    if (!f) return 'no iframe';
    return { rows: f.contentDocument.querySelectorAll('tr').length,
             offscreen: getComputedStyle(f).visibility === 'hidden' };
  });
  console.log('T7b PDF print frame:', JSON.stringify(printed));
  // 5. Admin can edit report data
  await page.click('#logout');
  await page.waitForTimeout(300);
  await page.click('.roleCard[data-role="Admin"]');
  await page.fill('#mobile', '9840099999');
  await page.click('#sendOtp');
  const otp2 = await page.$$('#otpRow input');
  for (let i = 0; i < 6; i++) await otp2[i].fill('123456'[i]);
  await page.click('#verifyOtp');
  await page.waitForTimeout(300);
  await page.click('button[data-v="reports"]');
  await page.waitForTimeout(200);
  await page.click('[data-rt="history"]');
  await page.waitForTimeout(200);
  const editBtns = await page.$$('[data-editvoy]');
  console.log('T8 admin edit buttons:', editBtns.length);
  await editBtns[0].click();
  await page.waitForTimeout(200);
  await page.fill('#ev_dis', '500');
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v4_admin_edit.png' });
  await page.click('#mEvSave');
  await page.waitForTimeout(300);
  await page.click('[data-rt="monthly"]');
  await page.waitForTimeout(200);
  const mrow = await page.$$eval('#repCard td', tds => tds.map(t => t.textContent));
  console.log('T8 monthly after edit:', JSON.stringify(mrow));
  // T15: inject a sailed vessel, GCR cycle in planning, dashboard analytics
  await page.evaluate(() => {
    const T = Date.now();
    voyages.push({id:777,vesselId:4,via:'2600777',status:'Sailed Out',confirmed:true,
      eta:T-40*3600e3,firstEta:T-42*3600e3,etb:T-39*3600e3,eto:null,etc:null,etd:T-3*3600e3,
      ata:T-39.5*3600e3,atb:T-30*3600e3,ato:T-29*3600e3,atc:T-4*3600e3,atd:T-2*3600e3,
      berth:null,_berthHist:'CB1',cranes:[],_craneHist:['QC01'],_craneCount:1,
      hatch:20,binbox:6,cargo:{dis:400,lod:300,rfr:0,odc:0,odo:0,haz:0}});
    render();
  });
  await page.click('button[data-v="planning"]');
  await page.waitForTimeout(300);
  const gcrRows = await page.$$('[data-gcrdone]');
  console.log('T15 GCR pending rows:', gcrRows.length);
  await page.fill('[data-gcrin="777"]', '25.5');
  await page.click('[data-gcrdone="777"]');
  await page.waitForTimeout(300);
  console.log('T15 rows after cycle complete:', (await page.$$('[data-gcrdone]')).length, '(expect 0)');
  await page.click('button[data-v="dashboard"]');
  await page.waitForTimeout(400);
  const chips = await page.$$eval('[data-mchip]', b => b.map(x => x.textContent));
  console.log('T16 month chips:', JSON.stringify(chips));
  const bars = await page.$$eval('.colVal', b => b.map(x => x.textContent));
  console.log('T16 chart columns (GCR + BMPH values):', JSON.stringify(bars));
  const gcrCols = await page.$$eval('.colBar', b => b.map(x => x.style.background || x.style.backgroundColor));
  console.log('T16 column colors (25.5 GCR should be red rgb(220,38,38)):', JSON.stringify(gcrCols));
  const bmphTile = await page.$$eval('.tile', ts => { const t2 = ts.find(x => x.textContent.includes('Avg BMPH')); return t2 ? t2.textContent : 'missing'; });
  console.log('T16 BMPH tile:', bmphTile);
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v11_analytics.png' });
  // month filter click
  const mchipBtns = await page.$$('[data-mchip]');
  if (mchipBtns.length > 1) { await mchipBtns[1].click(); await page.waitForTimeout(300);
    console.log('T16 after month select bars:', (await page.$$('.colVal')).length); }
  // T31: dashboard berth-plan timeline + big screen
  const dashTLbars = await page.$$('#dashTL .tlBar');
  const dashTblHead = await page.$$eval('#dashTL ~ div th, .card th', h => h.map(x => x.textContent).filter(t => ['ATO','Berth Occupancy'].includes(t)));
  console.log('T31 dashboard timeline bars:', dashTLbars.length, '· plan-table cols found:', JSON.stringify(dashTblHead));
  await page.click('#dashTLBig');
  await page.waitForTimeout(400);
  const bigShown = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  const bigWide = await page.$eval('#modalBox', el => el.classList.contains('wide'));
  const bigBars = await page.$$('#dashTLBigWrap .tlBar');
  console.log('T31 big screen modal:', bigShown, '· wide:', bigWide, '· bars:', bigBars.length);
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v21_bigscreen.png' });
  await page.click('#mOk2');
  await page.waitForTimeout(200);
  // T20: Vessel Report with GCR column
  await page.click('button[data-v="reports"]');
  await page.waitForTimeout(300);
  await page.click('[data-rt="bmphrep"]');
  await page.waitForTimeout(300);
  const vrHead = await page.$$eval('#repCard th', h => h.map(x => x.textContent));
  console.log('T20 vessel report last cols:', JSON.stringify(vrHead.slice(-2)));
  const vrRow = await page.$$eval('#repCard tbody tr', trs => [...trs[0].children].map(td => td.textContent));
  console.log('T20 first row BMPH/GCR:', vrRow[vrRow.length-2], '/', vrRow[vrRow.length-1]);
  // T21: twin dblclick status modal (invoked directly; dblclick wired on canvas)
  await page.click('button[data-v="twin"]');
  await page.waitForTimeout(1200);
  await page.evaluate(() => twinStatusModal(voyages.find(v => v.via === '2600001')));
  await page.waitForTimeout(300);
  const twShown = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  const twBtn = (await page.$('#twRec')) ? await page.textContent('#twRec') : 'no-btn';
  console.log('T21 twin status modal:', twShown, '- next:', twBtn);
  await page.click('#mCancel');
  await page.waitForTimeout(200);
  // T32: double-click Vessel Information panel (same function the canvas dblclick calls)
  await page.evaluate(() => vesselInfo3D(voyages.find(v => v.via === '2600001')));
  await page.waitForTimeout(300);
  const viTitle = await page.textContent('#modalBox h3');
  const viCells = await page.$$eval('#modalBox td', tds => tds.map(t => t.textContent));
  const viFields = ['Vessel Name','VIA','Service','LOA','Status','Berth','Bollard No','Crane','ETA','ATA','ATB','ATO','ATC','ATD','Port Stay'];
  console.log('T32 info panel:', viTitle, '· all 15 fields present:', viFields.every(f => viCells.includes(f)));
  console.log('T32 Port Stay value:', viCells[viCells.indexOf('Port Stay') + 1]);
  console.log('T32 milestone button available:', !!(await page.$('#viMs')));
  await page.click('#mCancel');
  // T22: vessel type dropdown, liquid cargo, berth eligibility
  await page.click('button[data-v="planning"]');
  await page.waitForTimeout(300);
  if (await page.$('#nextVessel')) { await page.click('#nextVessel'); await page.waitForTimeout(300); }
  await page.fill('#vesselSearch', 'MOGRAL');
  await page.waitForTimeout(200);
  await page.click('#comboList [data-vid]');
  await page.waitForTimeout(200);
  await page.selectOption('#pVoyage', 'new');
  await page.waitForTimeout(300);
  await page.fill('#etaMain', '2026-08-25T10:00');
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  await page.selectOption('#vtypeSel', 'Liquid');
  await page.waitForTimeout(400);
  const cnames = await page.$$eval('[data-clname]', i => i.map(x => x.value));
  console.log('T22 liquid cargo options:', JSON.stringify(cnames));
  await page.click('#addCargoLine');
  await page.waitForTimeout(200);
  console.log('T22 after +Add Cargo rows:', (await page.$$('[data-clname]')).length);
  await page.fill('[data-clvol="0"]', '5000');
  await page.evaluate(() => document.querySelector('[data-clvol="0"]').dispatchEvent(new Event('change')));
  await page.waitForTimeout(200);
  await page.selectOption('[data-cldir="1"]', 'Export');
  await page.fill('[data-clvol="1"]', '2000');
  await page.evaluate(() => document.querySelector('[data-clvol="1"]').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  console.log('T22 CB1 not-permitted card:', (await page.$$('.bCard.noType')).length, '(expect 1)');
  await page.click('[data-berth="CB1"]');
  await page.waitForTimeout(300);
  console.log('T22 eligibility popup:', await page.textContent('#modalBox h3'));
  await page.click('#mOk');
  await page.waitForTimeout(200);
  // T25: Liquid on B3 (permitted) -> berth assigned, NO crane deployment modal
  await page.click('[data-berth="B3"]');
  await page.waitForTimeout(400);
  console.log('T25 liquid B3: crane modal suppressed:', !(await page.$eval('#modalWrap', el => el.classList.contains('show'))), '· berth mine:', !!(await page.$('.bCard.mine')));
  await page.click('#vesselSelectedBtn');
  await page.waitForTimeout(200);
  await page.click('#savePlan');
  await page.waitForTimeout(200);
  // T23: double-banking on CB2 (BLPL FAITH 140 + MSC JUANITA F 146.45, cap 148)
  await page.click('#nextVessel');
  await page.waitForTimeout(300);
  await page.fill('#vesselSearch', 'BLPL');
  await page.waitForTimeout(200);
  await page.click('#comboList [data-vid]');
  await page.waitForTimeout(200);
  await page.selectOption('#pVoyage', 'new');
  await page.waitForTimeout(300);
  await page.fill('#etaMain', '2026-08-20T10:00');
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  await page.click('#vesselSelectedBtn');
  await page.waitForTimeout(300);
  await page.click('[data-berth="CB2"]');
  await page.waitForTimeout(400);
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) {
    const cbs2 = await page.$$('.qcPick input');
    await cbs2[1].check();  // QC05 (order: QC08, QC05, ...)
    await page.click('#mDeploy');
  }
  await page.waitForTimeout(300);
  console.log('T26 inline crane chips for container:', (await page.$$('[data-bqc]')).length, '(expect 4)');
  const selChip = await page.$$eval('.chip', c => c.map(x => x.textContent).find(t2 => t2.includes('Selected cranes')));
  console.log('T26 selection saved with assignment:', selChip || 'none');
  await page.evaluate(() => { const v = voyages.find(x => vOf(x).name === 'BLPL FAITH'); v.etd = v.eta + 30 * 3600e3; });
  await page.click('#savePlan');
  await page.waitForTimeout(200);
  await page.click('#nextVessel');
  await page.waitForTimeout(300);
  await page.fill('#vesselSearch', 'MSC JUAN');
  await page.waitForTimeout(200);
  await page.click('#comboList [data-vid]');
  await page.waitForTimeout(200);
  await page.selectOption('#pVoyage', 'new');
  await page.waitForTimeout(300);
  await page.fill('#etaMain', '2026-08-20T18:00');
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  await page.click('#vesselSelectedBtn');
  await page.waitForTimeout(300);
  await page.click('[data-berth="CB2"]');
  await page.waitForTimeout(400);
  console.log('T23 dual popup:', await page.textContent('#modalBox h3'));
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v15_dual.png' });
  await page.click('#mOk');
  await page.waitForTimeout(200);
  const qpos = await page.evaluate(() => { const v = voyages.find(x => vOf(x).name.includes('JUANITA')); return v ? [v.berth, v.qFrom, v.qTo] : null; });
  console.log('T23 JUANITA berth+quay position:', JSON.stringify(qpos), '(expect CB2, 170, ~316)');
  // T28: double-banked pair renders as TWO THIN bars in the SAME CB2 row, independently interactive
  const thins = await page.$$eval('.tlBar.thin', bars => bars.map(b => ({ id: b.dataset.tlv, cls: b.className.includes('s1') ? 's1' : 's0', txt: b.textContent, drag: b.className.includes('draggable') })));
  console.log('T28 thin bars:', JSON.stringify(thins));
  const laneCount = await page.$$eval('.tlLaneM', l => l.length);
  console.log('T28 berth rows still 3:', laneCount === 3);
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v18_dualbars.png' });
  // click each thin bar -> selects the correct vessel (dblclick opens its info modal)
  const thinEls = await page.$$('.tlBar.thin');
  if (thinEls.length >= 2) {
    await thinEls[0].dblclick();
    await page.waitForTimeout(300);
    const n1 = await page.textContent('#modalBox h3');
    await page.click('#mCancel'); await page.waitForTimeout(200);
    await thinEls[1].dblclick();
    await page.waitForTimeout(300);
    const n2 = await page.textContent('#modalBox h3');
    await page.click('#mCancel'); await page.waitForTimeout(200);
    console.log('T28 dblclick bar1 →', n1.slice(0, 30), '| bar2 →', n2.slice(0, 30));
  }
  // T24: LOA cap fail on CB1 (145 m cap vs 146.45)
  const dmsg = await page.evaluate(() => {
    const a = voyages.find(v => vOf(v).name === 'BLPL FAITH');
    const keep = a.berth; a.berth = 'CB1';
    const zeb = vessels.find(v => v.name === 'ZEBRA'); // LOA 210 -> 140+210=350 > 290
    const fake = {id:-9, vesselId:zeb.id, confirmed:true, status:'Incoming', berth:null, cranes:[],
      cargo:{dis:0,lod:0,rfr:0,odc:0,odo:0,haz:0}, eta:a.eta+3600e3, etb:(a.etb||a.eta)+3600e3,
      etc:null, etd:a.etd, atb:null, atd:null, bowB:null, sternB:null};
    const r = dualCheck('CB1', fake);
    a.berth = keep;
    return r.ok ? 'OK' : r.msg;
  });
  console.log('T24 CB1 combined-290 message:', dmsg.slice(0, 130));
  // T30: Port/Starboard + bollard selection with auto range, conflict & span validation
  console.log('T30 side buttons:', (await page.$$('[data-side]')).length, '· bollard chips:', (await page.$$('[data-bol]')).length, '(expect 34 shared pool)');
  await page.click('[data-side="STARBOARD"]');
  await page.waitForTimeout(300);
  console.log('T30 side set:', await page.evaluate(() => voyages.find(v => vOf(v).name.includes('JUANITA')).side));
  await page.click('[data-bol="5"]');
  await page.waitForTimeout(250);
  await page.click('[data-bol="14"]');
  await page.waitForTimeout(400);
  const bstate = await page.evaluate(() => { const v = voyages.find(x => vOf(x).name.includes('JUANITA')); return [v.bowB, v.sternB]; });
  const midCount = await page.$$eval('.bol.mid', b => b.length);
  console.log('T30 bow/stern:', JSON.stringify(bstate), '· auto intermediates:', midCount, '(expect 8)');
  // v2.2: CB2/B3 = NO restriction. BLPL requests 12-20 while JUANITA holds 5-14 → ACCEPTED
  const cmsg = await page.evaluate(() => {
    const b = voyages.find(v => vOf(v).name === 'BLPL FAITH');
    const ok = applyBollards(b, 12, 20);
    return ok ? 'ALLOWED' : document.querySelector('#modalBox h3').textContent;
  });
  console.log('T30 CB2 overlap 12-20 vs 5-14 (expect ALLOWED — user choice final):', cmsg);
  if (await page.$('#mOk')) await page.click('#mOk');
  await page.waitForTimeout(200);
  // tiny span on CB2 also accepted (no LOA validation on CB2/B3)
  const smsg = await page.evaluate(() => {
    const v = voyages.find(x => vOf(x).name.includes('JUANITA'));
    const keep = [v.bowB, v.sternB];
    const ok = applyBollards(v, 1, 3);
    const res = ok ? 'ALLOWED' : document.querySelector('#modalBox h3').textContent;
    applyBollards(v, keep[0], keep[1]); // restore 5-14
    return res;
  });
  console.log('T30 CB2 span 1-3 for 146 m LOA (expect ALLOWED):', smsg);
  // wide cross-boundary CB2 selection 5-25 accepted and displayed
  const wideSel = await page.evaluate(() => {
    const b = voyages.find(v => vOf(v).name === 'BLPL FAITH');
    const ok = applyBollards(b, 5, 25);
    const r = bolRange(b);
    applyBollards(b, 20, 27); // restore
    return ok ? ('range ' + r[0] + '-' + r[1]) : 'REJECTED';
  });
  console.log('T30 CB2 bow 5 / stern 25 (expect range 5-25):', wideSel);
  // CB1 STILL validates: fake occupant on CB1 bollards 5-10, second vessel asks 8-14 → conflict
  const cb1c = await page.evaluate(() => {
    const T = Date.now();
    const zeb = vessels.find(v => v.name === 'ZEBRA');
    voyages.push({id:-77, vesselId:zeb.id, via:'2609901', confirmed:true, status:'At Berth', berth:'CB1',
      cranes:[], cargo:{dis:0,lod:0,rfr:0,odc:0,odo:0,haz:0}, eta:T-3600e3, etb:T-1800e3, etd:T+40*3600e3,
      atb:T-1200e3, bowB:5, sternB:10, side:'PORT'});
    return 'pushed';
  }).catch(e => 'ERR ' + e.message.slice(0, 80));
  console.log('T30 CB1 occupant inject:', cb1c);
  const cb1msg = await page.evaluate(() => {
    const T = Date.now();
    const zeb = vessels.find(v => v.name === 'ZEBRA');
    const fake = {id:-78, vesselId:zeb.id, via:'2609902', confirmed:true, status:'Incoming', berth:'CB1',
      cranes:[], cargo:{dis:0,lod:0,rfr:0,odc:0,odo:0,haz:0}, eta:T, etb:T+3600e3, etd:T+30*3600e3, bowB:null, sternB:null};
    voyages.push(fake);
    const ok = applyBollards(fake, 8, 14);
    const conflictTitle = ok ? 'ALLOWED' : document.querySelector('#modalBox h3').textContent;
    const ok2 = applyBollards(fake, 11, 13); // clear range but span 45 m < 210*0.9
    const spanTitle = ok2 ? 'ALLOWED' : document.querySelector('#modalBox h3').textContent;
    voyages.splice(voyages.findIndex(v => v.id === -77), 1);
    voyages.splice(voyages.findIndex(v => v.id === -78), 1);
    return conflictTitle + ' | ' + spanTitle;
  });
  console.log('T30 CB1 conflict 8-14 vs 5-10 | CB1 span 11-13 (expect ⚠️ titles):', cb1msg);
  if (await page.$('#mOk')) await page.click('#mOk');
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v20_bollards.png' });
  // T27: Break-Bulk — crane required popup, then "Port Crane not required" waiver
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) {
    console.log('T27 pre-existing modal:', await page.textContent('#modalBox h3'));
    if (await page.$('#mSaveGo')) await page.click('#mSaveGo');
    else if (await page.$('#mOk')) await page.click('#mOk');
    else if (await page.$('#mCancel')) await page.click('#mCancel');
    await page.waitForTimeout(300);
  }
  await page.click('#nextVessel');
  await page.waitForTimeout(200);
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) { await page.click('#mSaveGo'); await page.waitForTimeout(300); }
  await page.waitForTimeout(300);
  await page.fill('#vesselSearch', 'GRAVITY');
  await page.waitForTimeout(200);
  await page.click('#comboList [data-vid]');
  await page.waitForTimeout(200);
  await page.selectOption('#pVoyage', 'new');
  await page.waitForTimeout(300);
  await page.fill('#etaMain', '2026-08-27T09:00');
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  await page.selectOption('#vtypeSel', 'Break-Bulk');
  await page.waitForTimeout(300);
  await page.click('[data-berth="CB1"]');
  await page.waitForTimeout(400);
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) await page.click('#mOk');
  await page.waitForTimeout(200);
  console.log('T27 pcnr button present (Break-Bulk):', !!(await page.$('#pcnr')));
  await page.click('#vesselSelectedBtn');
  await page.waitForTimeout(300);
  console.log('T27 crane-required popup:', await page.textContent('#modalBox h3'));
  await page.click('#mOk');
  await page.waitForTimeout(200);
  await page.click('#pcnr');
  await page.waitForTimeout(300);
  await page.click('#vesselSelectedBtn');
  await page.waitForTimeout(300);
  console.log('T27 confirmed after waiver:', await page.evaluate(() => voyages.find(v => vOf(v).name.includes('GRAVITY')).confirmed));
  await page.click('#savePlan');
  await page.waitForTimeout(200);
  // T29: dashboard cargo tiles + separated Liquid report
  await page.click('button[data-v="dashboard"]');
  await page.waitForTimeout(400);
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) { await page.click('#mSaveGo'); await page.waitForTimeout(300); }
  const liqTile = await page.$$eval('.tile', ts => { const t2 = ts.find(x => x.textContent.includes('Liquid Cargo')); return t2 ? t2.textContent : 'missing'; });
  console.log('T29 liquid tile:', liqTile);
  await page.click('button[data-v="reports"]');
  await page.waitForTimeout(300);
  await page.click('[data-rt="liquidrep"]');
  await page.waitForTimeout(300);
  const lrows = await page.$$eval('#repCard tbody tr', trs => trs.map(r => [...r.children].map(td => td.textContent).slice(0, 6)));
  console.log('T29 liquid report rows:', JSON.stringify(lrows));
  await page.click('[data-rt="bulkrep"]');
  await page.waitForTimeout(300);
  console.log('T29 bulk report tab title:', await page.textContent('#repCard h4'));
  await page.click('[data-rt="bmphrep"]');
  await page.waitForTimeout(300);
  const vrHead2 = await page.$$eval('#repCard th', h => h.map(x => x.textContent));
  console.log('T29 vessel report has Cargo Vol col:', vrHead2.includes('Cargo Vol (MT)'));
  // ================== T33: ENNORE — second port, full isolation ==================
  await page.click('[data-port="ENN"]');
  await page.waitForTimeout(400);
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) { // save-guard if a plan was dirty
    if (await page.$('#mSaveGo')) await page.click('#mSaveGo'); await page.waitForTimeout(300);
    await page.click('[data-port="ENN"]'); await page.waitForTimeout(400);
  }
  await page.click('button[data-v="dashboard"]');
  await page.waitForTimeout(400);
  const ennBerthBoxes = await page.$$eval('.berthBox', b => b.map(x => x.textContent.slice(0, 20)));
  const ennTiles = await page.$$eval('.tile .tl', t => t.map(x => x.textContent).slice(0, 1));
  const ennTLLabels = await page.$$eval('.tlLabelB', l => l.map(x => x.textContent));
  console.log('T33.1 ENN dashboard berths (expect only Ennore B1):', JSON.stringify(ennBerthBoxes));
  console.log('T33.2 ENN hero tile:', JSON.stringify(ennTiles), '· timeline rows:', JSON.stringify(ennTLLabels));
  const ennHandled = await page.evaluate(() => totalHandled());
  console.log('T33.3 ENN vessels handled (expect 0 — Kattupalli data not counted):', ennHandled);
  const ennGcrCols = await page.$$('.colVal');
  console.log('T33.4 ENN GCR/BMPH columns (expect 0 — no Ennore vessels yet):', ennGcrCols.length);
  // plan an Ennore vessel end to end
  await page.click('button[data-v="planning"]');
  await page.waitForTimeout(300);
  await page.fill('#vesselSearch', 'HYUNDAI');
  await page.waitForTimeout(250);
  await page.click('#comboList [data-vid]');
  await page.waitForTimeout(250);
  await page.selectOption('#pVoyage', 'new');
  await page.waitForTimeout(300);
  await page.fill('#etaMain', '2026-09-05T06:00');
  await page.evaluate(() => document.querySelector('#etaMain').dispatchEvent(new Event('change')));
  await page.waitForTimeout(300);
  const ennBerthCards = await page.$$eval('[data-berth]', b => b.map(x => x.dataset.berth + '|' + x.textContent.slice(0, 40)));
  console.log('T33.5 ENN berth cards (expect only EB1 · 400 m):', JSON.stringify(ennBerthCards));
  await page.click('[data-berth="EB1"]');
  await page.waitForTimeout(400);
  if (await page.$('#mCancel')) { await page.click('#mCancel'); await page.waitForTimeout(200); } // skip deploy modal
  const ennCraneChips = await page.$$eval('[data-bqc]', b => b.map(x => x.dataset.bqc));
  const ennBolChips = await page.$$('[data-bol]');
  console.log('T33.6 ENN cranes (expect QC-01..QC-04):', JSON.stringify(ennCraneChips), '· bollard chips (expect 27):', ennBolChips.length);
  await page.click('[data-side="STARBOARD"]');
  await page.waitForTimeout(300);
  await page.click('[data-bol="3"]');
  await page.waitForTimeout(250);
  await page.click('[data-bol="12"]');
  await page.waitForTimeout(400);
  const ennState = await page.evaluate(() => { const v = voyages.find(x => x.port === 'ENN'); return [v.side, v.bowB, v.sternB, v.qFrom, v.qTo]; });
  const ennMids = await page.$$eval('.bol.mid', b => b.length);
  console.log('T33.7 ENN side/bow/stern/quay (expect STARBOARD,3,12, 30–165 m @15 m):', JSON.stringify(ennState), '· intermediates (expect 8):', ennMids);
  await page.click('[data-bqc="QC-01"]');
  await page.waitForTimeout(250);
  await page.click('#vesselSelectedBtn');
  await page.waitForTimeout(300);
  await page.click('#savePlan');
  await page.waitForTimeout(250);
  // simultaneous second Ennore vessel: overlapping bollards must be REJECTED
  const ennConf = await page.evaluate(() => {
    const T = Date.now();
    const zeb = vessels.find(v => v.name === 'ZEBRA');
    const fake = {id:-88, vesselId:zeb.id, via:'2609950', port:'ENN', confirmed:true, status:'Incoming', berth:'EB1',
      cranes:[], cargo:{dis:0,lod:0,rfr:0,odc:0,odo:0,haz:0}, eta:new Date('2026-09-05T09:00').getTime(),
      etb:new Date('2026-09-05T10:00').getTime(), etd:new Date('2026-09-07T10:00').getTime(), bowB:null, sternB:null};
    const hy = voyages.find(v => v.port === 'ENN');
    if (!hy.etd) hy.etd = new Date('2026-09-08T06:00').getTime();  // ensure the two windows overlap
    voyages.push(fake);
    const bad = applyBollards(fake, 8, 14);
    const badTitle = bad ? 'ALLOWED' : document.querySelector('#modalBox h3').textContent;
    const good = applyBollards(fake, 15, 24);
    voyages.splice(voyages.findIndex(v => v.id === -88), 1);
    return badTitle + ' | clear 15-24: ' + good;
  });
  console.log('T33.8 ENN overlap 8-14 vs 3-12 (expect ⚠️ Bollard Conflict) | non-overlap:', ennConf);
  if (await page.$('#mOk')) await page.click('#mOk');
  await page.waitForTimeout(200);
  // vessel information panel shows Port = Ennore
  const ennInfo = await page.evaluate(() => {
    vesselInfo3D(voyages.find(x => x.port === 'ENN'));
    const tds = [...document.querySelectorAll('#modalBox td')].map(t => t.textContent);
    return tds[tds.indexOf('Port') + 1] + ' / ' + tds[tds.indexOf('Berth') + 1];
  });
  console.log('T33.9 info panel Port/Berth (expect Ennore / Ennore B1):', ennInfo);
  await page.click('#mCancel');
  await page.waitForTimeout(200);
  // reports isolated + titled
  await page.evaluate(() => { planDirty = false; }); // fake-voyage probe above marked the plan dirty
  await page.click('button[data-v="reports"]');
  await page.waitForTimeout(300);
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) { await page.click('#mSaveGo'); await page.waitForTimeout(300); }
  await page.click('[data-rt="history"]');
  await page.waitForTimeout(300);
  const ennRepTitle = await page.textContent('#repCard h4');
  const ennHistRows = await page.$$eval('#repCard tbody tr', trs => trs.map(r => r.children[0].textContent));
  console.log('T33.10 ENN report title:', ennRepTitle);
  console.log('T33.11 ENN history vessels (expect only HYUNDAI — no Kattupalli rows):', JSON.stringify(ennHistRows));
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v23_ennore_reports.png' });
  // dashboard shows the Ennore plan; then switch back to Kattupalli
  await page.click('button[data-v="dashboard"]');
  await page.waitForTimeout(400);
  const ennTLbars = await page.$$eval('#dashTL .tlBar', b => b.map(x => x.textContent.slice(0, 18)));
  console.log('T33.12 ENN dashboard timeline bars (expect HYUNDAI only):', JSON.stringify(ennTLbars));
  await page.screenshot({ path: path.resolve(__dirname,'..','shots')+'/v23_ennore_dash.png' });
  await page.click('[data-port="KTP"]');
  await page.waitForTimeout(500);
  const ktpBerthBoxes = await page.$$eval('.berthBox', b => b.map(x => x.textContent.slice(0, 8)));
  const ktpTLLabels = await page.$$eval('.tlLabelB', l => l.map(x => x.textContent));
  const ktpHasEnn = await page.evaluate(() => {
    const ev = voyages.find(v => v.port === 'ENN');   // the Ennore VOYAGE (vessel may also call at KTP)
    const inTL = [...document.querySelectorAll('#dashTL [data-tlv]')].some(b => +b.dataset.tlv === ev.id);
    const inTables = [...document.querySelectorAll('#content td')].some(td => td.textContent.includes(ev.via)); // #content = visible screen (closed modals keep stale DOM)
    return inTL || inTables;
  });
  console.log('T33.13 back to KTP berths (expect CB1/CB2/B3):', JSON.stringify(ktpBerthBoxes), '· rows:', JSON.stringify(ktpTLLabels));
  console.log('T33.14 KTP dashboard free of the Ennore VOYAGE (expect true):', !ktpHasEnn);
  // ================== T34: PERSISTENCE + VALIDATION (standalone mode in CI; PostgreSQL when server/ runs) ==================
  console.log('T34.1 storage badge:', await page.textContent('#dbBadge'));
  await page.click('button[data-v="planning"]');
  await page.waitForTimeout(300);
  if (await page.$eval('#modalWrap', el => el.classList.contains('show'))) { if (await page.$('#mSaveGo')) await page.click('#mSaveGo'); await page.waitForTimeout(300); }
  await page.click('#addVessel');
  await page.waitForTimeout(300);
  // negative LOA must be rejected with a clear message and NOT saved
  await page.fill('#mvName', 'PERSIST TEST');
  await page.fill('#mvLoa', '-5');
  await page.click('#mSave');
  await page.waitForTimeout(300);
  const negToast = await page.textContent('#toast');
  const stillOpen = await page.$eval('#modalWrap', el => el.classList.contains('show'));
  console.log('T34.2 negative LOA rejected:', negToast.slice(0, 50), '· modal still open:', stillOpen);
  // valid vessel with beam/draft saves with an honest confirmation
  await page.fill('#mvLoa', '199.9');
  await page.fill('#mvBeam', '32.2');
  await page.fill('#mvDraft', '12.5');
  await page.selectOption('#mvType', 'Container');
  await page.click('#mSave');
  await page.waitForTimeout(500);
  console.log('T34.3 save toast:', (await page.textContent('#toast')).slice(0, 90));
  const inMaster = await page.evaluate(() => { const v = vessels.find(x => x.name === 'PERSIST TEST'); return v ? [v.loa, v.beam, v.draft, v.vtype] : null; });
  console.log('T34.4 vessel in master with beam/draft/type:', JSON.stringify(inMaster));
  // RELOAD the page — data must survive; the vessel must be selectable again
  await page.reload();
  await page.waitForTimeout(2400);
  await page.click('.roleCard[data-role="Vessel Planner"]');
  await page.fill('#mobile', '9840012345');
  await page.click('#sendOtp');
  const otpR = await page.$$('#otpRow input');
  for (let i = 0; i < 6; i++) await otpR[i].fill('123456'[i]);
  await page.click('#verifyOtp');
  await page.waitForTimeout(600);
  const survived = await page.evaluate(() => ({
    vessel: (v => v ? v.loa + '/' + v.beam + '/' + v.draft + '/' + v.vtype : null)(vessels.find(x => x.name === 'PERSIST TEST')),
    voyages: voyages.length, handled: totalHandled(),
  }));
  console.log('T34.5 after reload — vessel:', survived.vessel, '· voyages persisted:', survived.voyages, '· KTP handled:', survived.handled);
  await page.click('button[data-v="planning"]');
  await page.waitForTimeout(300);
  await page.fill('#vesselSearch', 'PERSIST');
  await page.waitForTimeout(250);
  const hit = await page.$$eval('#comboList [data-vid]', b => b.map(x => x.textContent.slice(0, 30)));
  console.log('T34.6 vessel selectable after reload:', JSON.stringify(hit));
  console.log('ERRORS:', errors.length ? errors.join(' | ') : 'none');
  await browser.close();
})();
// Appended: admin report edit test runs as separate flow
