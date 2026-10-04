// ---------- Starfield (small, subtle twinkling stars with gentle parallax) ----------
const cv = document.getElementById('space'), ctx = cv.getContext('2d');
let W, H, stars = [], shooters = [], mx = 0, my = 0, tmx = 0, tmy = 0;
const TINTS = ['255,255,255', '255,255,255', '200,228,255', '150,205,255'];
function resize() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  stars = Array.from({ length: Math.min(200, Math.floor(W * H / 7000)) }, () => ({
    x: Math.random() * W, y: Math.random() * H, z: Math.random() * .8 + .2,
    r: Math.random() < .12 ? 1.4 : Math.random() * .7 + .5,
    c: TINTS[Math.floor(Math.random() * TINTS.length)], t: Math.random() * 6.28, sp: .006 + Math.random() * .014
  }));
}
addEventListener('resize', resize); resize();
addEventListener('mousemove', e => { tmx = e.clientX / W - .5; tmy = e.clientY / H - .5; });
(function draw() {
  mx += (tmx - mx) * .05; my += (tmy - my) * .05;
  ctx.clearRect(0, 0, W, H);
  for (const s of stars) {
    s.y += s.z * .03; if (s.y > H + 5) { s.y = -5; s.x = Math.random() * W; }
    s.t += s.sp;
    const a = .3 + .5 * Math.abs(Math.sin(s.t));
    const x = s.x - mx * 20 * s.z, y = s.y - my * 20 * s.z;
    ctx.globalAlpha = a; ctx.fillStyle = `rgb(${s.c})`;
    ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.2832); ctx.fill();
    if (s.r > 1.3) {                       // tiny soft halo on the few brighter stars
      ctx.globalAlpha = a * .18; ctx.beginPath(); ctx.arc(x, y, s.r * 2.6, 0, 6.2832); ctx.fill();
    }
  }
  // shooting stars: long glowing tail + bright head
  if (Math.random() < .018 && shooters.length < 3) {
    const sp = 10 + Math.random() * 8, ang = 2.45 + Math.random() * .35;
    shooters.push({ x: Math.random() * W * 1.0 + W * .1, y: -20 + Math.random() * H * .3, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
      len: 14 + Math.random() * 12, life: 1, fade: .008 + Math.random() * .008 });
  }
  shooters = shooters.filter(q => q.life > 0 && q.x > -300 && q.y < H + 300);
  ctx.globalCompositeOperation = 'lighter';
  for (const q of shooters) {
    q.x += q.vx; q.y += q.vy; q.life -= q.fade;
    const tx = q.x - q.vx * q.len, ty = q.y - q.vy * q.len, al = Math.min(1, q.life * 2);
    const g = ctx.createLinearGradient(q.x, q.y, tx, ty);
    g.addColorStop(0, `rgba(255,255,255,${al})`); g.addColorStop(.15, `rgba(150,215,255,${al * .7})`);
    g.addColorStop(.6, `rgba(70,150,255,${al * .22})`); g.addColorStop(1, 'rgba(47,123,255,0)');
    ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineCap = 'round';
    ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(tx, ty); ctx.stroke();
    const h = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, 10);
    h.addColorStop(0, `rgba(255,255,255,${al})`); h.addColorStop(.4, `rgba(150,215,255,${al * .5})`); h.addColorStop(1, 'rgba(94,200,255,0)');
    ctx.fillStyle = h; ctx.beginPath(); ctx.arc(q.x, q.y, 10, 0, 6.2832); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  requestAnimationFrame(draw);
})();

// ---------- i18n ----------
const T = {
  th: { nav_about: 'เกี่ยวกับ', nav_projects: 'ผลงาน', nav_contact: 'ติดต่อ',
    hero_eyebrow: 'สวัสดีครับผม', n1: 'นายเหมรัศมิ์', n2: 'พันธุ์ธนวิบูลย์',
    lvl_uni: 'ระดับมหาวิทยาลัย', lvl_uni_sub: 'มหาวิทยาลัยเชียงใหม่ · ชั้นปีที่ 1', lvl_hs: 'ระดับมัธยมศึกษา', lvl_hs_sub: 'โรงเรียนพิษณุโลกพิทยาคม · ปี 2568',
    lvl_empty: 'กำลังสร้างผลงานใหม่ในระดับมหาวิทยาลัย เร็วๆ นี้', lvl_empty_c: 'ยังไม่มีเกียรติบัตรในระดับมหาวิทยาลัย เร็วๆ นี้',
    hero_lead: 'นักศึกษาสาขาบูรณาการอุตสาหกรรมดิจิทัล วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่',
    f1: 'มหาวิทยาลัย', f1v: 'มหาวิทยาลัยเชียงใหม่', f2: 'วิทยาลัย', f2v: 'วิทยาลัยศิลปะ สื่อ และเทคโนโลยี', f3: 'สาขา', f3v: 'บูรณาการอุตสาหกรรมดิจิทัล', f4: 'ชั้นปี', f4v: 'ปี 1',
    hero_cta1: 'ดูผลงาน', hero_cta2: 'ติดต่อผม', about_title: 'เกี่ยวกับผม',
    about_text: 'ผมชื่อนายเหมรัศมิ์ พันธุ์ธนวิบูลย์ ชื่อเล่น “มัช” ปัจจุบันเป็นนักศึกษาชั้นปีที่ 1 สาขาบูรณาการอุตสาหกรรมดิจิทัล วิทยาลัยศิลปะ สื่อ และเทคโนโลยี มหาวิทยาลัยเชียงใหม่ ตั้งเป้าหมายเป็น Front-end Developer, AI Engineer และ Project Manager',
    st1: 'ปีประสบการณ์', st2: 'โปรเจกต์', st3: 'ลูกค้า', skills_title: 'ทักษะ', projects_title: 'ผลงาน', nav_certs: 'เกียรติบัตร', certs_title: 'เกียรติบัตร',
    w_badge: 'ระดับประเทศ · 2025', w_venue: 'สถาบันเทคโนโลยีไทย-ญี่ปุ่น',
    c1v: '2 วัน', c1l: 'ระยะเวลาแข่งขัน', c2v: '128 ทีม', c2l: 'จากทั่วประเทศ', c3v: '32 ทีม', c3l: 'รอบสุดท้าย',
    w_intro: 'ผมได้เข้าร่วมการแข่งขันหุ่นยนต์ระดับประเทศ ณ สถาบันเทคโนโลยีไทย-ญี่ปุ่น ภายใต้โจทย์ที่เน้นการเก็บวัตถุตามสีที่กำหนด และควบคุมหุ่นยนต์ให้ปฏิบัติภารกิจอย่างแม่นยำและรวดเร็ว จัดการแข่งขัน 2 วัน มีทีมเข้าร่วมกว่า 128 ทีมจากทั่วประเทศ',
    w_rolel: 'หน้าที่ของผม', w_role: 'รับผิดชอบเขียนโค้ดควบคุมการเคลื่อนไหวของหุ่นยนต์ ตั้งแต่คำสั่งพื้นฐานไปจนถึงการกำหนดพฤติกรรมอัตโนมัติ เพื่อให้หุ่นยนต์ทำภารกิจได้อย่างแม่นยำ',
    d1_t: 'วันที่ 1', d1_h: 'ได้รับเหรียญทอง', d1: 'ทีมเราทำผลงานได้ยอดเยี่ยมตามกติกาที่ได้รับล่วงหน้า และสามารถตั้งองศาตามสนามได้ หุ่นยนต์เก็บโดนัทและวางลงแท่นได้ครบถ้วน ได้รับเหรียญทอง',
    d2_t: 'วันที่ 2', d2_h: 'กติกาเซอร์ไพรส์', d2: 'มีกติกาเซอร์ไพรส์ เช่น เพิ่มโดนัทหลอก และให้อีกฝั่งเปลี่ยนรูปแบบพื้นที่วาง ทำให้ต้องปรับกลยุทธ์และแก้โค้ดภายในเวลาจำกัด แม้สุดท้ายจะจบใน 32 ทีมสุดท้ายจาก 128 ทีม แต่ถือเป็นประสบการณ์ที่ท้าทายและมีค่ามาก',
    ct_award: 'ระดับเหรียญทอง', ct_by: 'การแข่งขันหุ่นยนต์เยาวชน โครงการ Innovedex Robotics Competition ประจำปี พ.ศ. 2568',
    ct_dl: 'วันที่ได้รับ', ct_date: '10 สิงหาคม พ.ศ. 2568', ct_sl: 'คะแนน', ct_nl: 'ผู้ได้รับ', ct_name: 'เหมรัศมิ์ พันธุ์ธนวิบูลย์', zoom: 'คลิกเพื่อขยาย',
    shot_asean_robot: 'กลไกหุ่นยนต์', shot_asean_team: 'ทีมงานผู้แข่งขัน',
    shot_inno_robot: 'หุ่นยนต์และสนาม', shot_inno_team: 'ทีมงานผู้แข่งขัน',
    shot_cpe_stage: 'บรรยากาศเวที', shot_cpe_selfie: 'ทีมงานและสนามแข่ง',
        cpe_badge: 'ระดับประเทศ · 2568', cpe_venue: 'ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่',
    cpe1v: '50+ ทีม', cpe1l: 'จากทั่วประเทศ', cpe2v: '3 คน/ทีม', cpe2l: 'สมาชิกในทีม', cpe3v: 'Top 45', cpe3l: 'รอบบุคคล (รอบบ่าย)',
    cpe_intro: 'ผมได้เข้าร่วมการแข่งขัน CPE Coding Box High-School Edition 2025 จัดโดยภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่ ร่วมกับสมาคมสถาบันวิศวกรไฟฟ้าและอิเล็กทรอนิกส์แห่งประเทศไทย (IEEE Thailand Section) มีทีมเข้าร่วมจากหลายโรงเรียนทั่วประเทศรวมกว่า 50 ทีม',
    cpe_rolel: 'ความสำเร็จสำคัญ', cpe_role: 'ผ่านการคัดเลือกเข้าสู่รอบบ่าย (รอบบุคคล) ที่เปิดรับเพียง 45 คนจากผู้เข้าแข่งขันทั้งหมด ถือเป็นรอบที่คัดเลือกเฉพาะผู้ที่มีผลคะแนนยอดเยี่ยมเพียงไม่กี่โรงเรียนเท่านั้น (รอบ 15 โรงเรียนสุดท้าย)',
    cpe_award: 'ระดับประเทศ', cpe_by: 'ผ่านเข้ารอบแข่งขันประเภทบุคคล รอบ 15 โรงเรียนสุดท้าย ในกิจกรรมแข่งขันทักษะทางวิชาการ ด้านการเขียนโปรแกรมคอมพิวเตอร์ Coding Box - High School Edition',
    cpe_il: 'ผู้จัดงาน', cpe_i: 'ภาควิชาวิศวกรรมคอมพิวเตอร์ คณะวิศวกรรมศาสตร์ มช. ร่วมกับ IEEE Thailand Section', cpe_vl: 'สถานที่', cpe_v: 'คณะวิศวกรรมศาสตร์ มหาวิทยาลัยเชียงใหม่', cpe_date: '4 ตุลาคม พ.ศ. 2568', cpe_rl: 'ผลการแข่งขัน', cpe_res: 'ผ่านเข้ารอบบุคคล (คัดเพียง 45 คน)',
    asean_badge: 'ระดับอาเซียน · 2568', asean_venue: 'มหาวิทยาลัยเจ้าพระยา',
    asean1v: 'เหรียญทอง', asean1l: 'เกียรติบัตร', asean2v: 'ชมเชย (ทองแดง)', asean2l: 'รางวัลที่ได้รับ', asean3v: 'อาเซียน', asean3l: 'ระดับการแข่งขัน',
    asean_intro: 'ผมได้เข้าร่วมการแข่งขัน CPU 3rd ASEAN GRAND PRIX ซึ่งเป็นการแข่งขันหุ่นยนต์ระดับอาเซียน ชิงถ้วยพระราชทาน จัดขึ้นที่ มหาวิทยาลัยเจ้าพระยา โดยแข่งขันกันเป็นทีมรุ่นมัธยมศึกษาตอนปลาย',
    asean_rolel: 'หน้าที่ของผม & ประสบการณ์', asean_role: 'รับผิดชอบการประกอบหุ่นยนต์ควบคุมจากจอยบังคับ ตั้งแต่ติดตั้งโครงสร้าง มอเตอร์ ไปจนถึงเดินสายไฟให้รองรับระบบควบคุมด้วยจอย ทำให้หุ่นยนต์เคลื่อนที่และปฏิบัติภารกิจในสนามได้อย่างแม่นยำและต่อเนื่อง เก็บลูกภารกิจได้ครบจนได้รับรางวัลชมเชย (เหรียญทองแดง) พร้อมเกียรติบัตรเหรียญทอง',
    asean_award: 'เหรียญทอง · ระดับอาเซียน', asean_by: 'การแข่งขันหุ่นยนต์และกีฬาอีสปอร์ตระดับอาเซียน ชิงถ้วยพระราชทาน สมเด็จพระกนิษฐาธิราชเจ้า กรมสมเด็จพระเทพรัตนราชสุดาฯ สยามบรมราชกุมารี และ ทูลกระหม่อมหญิงอุบลรัตนราชกัญญา สิริวัฒนาพรรณวดี ครั้งที่ 3',
    asean_il: 'ผู้มอบ', asean_i: 'มหาวิทยาลัยเจ้าพระยา', asean_date: '13 กรกฎาคม พ.ศ. 2568', asean_res: 'รางวัลชมเชยเหรียญทองแดง (หุ่นยนต์บังคับมือ KTIS)',
    fe_badge: 'ตัวแทนภูมิภาค · 2568', fe_sub: 'ความถนัดทางวิศวกรรมคอมพิวเตอร์',
    fe1v: '75/100', fe1l: 'คะแนนที่ได้รับ', fe2v: 'ระดับประเทศ', fe2l: 'ผ่านเข้าสู่รอบ', fe3v: 'เหรียญทองแดง', fe3l: 'ระดับภูมิภาค',
    fe_intro: 'ผมได้เข้าร่วมการแข่งขันโครงการ Fundamentals of Engineering Testing (FE) ประจำปี 2568 และผ่านเข้าสู่รอบระดับประเทศในฐานะตัวแทนภูมิภาค ถือเป็นหนึ่งในประสบการณ์สำคัญที่สุดในชีวิตของผม',
    fe_topicl: 'หัวข้อที่แข่งขัน', fe_topic: '“ความถนัดทางวิศวกรรมคอมพิวเตอร์” เนื้อหาเจาะลึกตั้งแต่พื้นฐานฮาร์ดแวร์ การออกแบบระบบดิจิทัล ไปจนถึงการเขียนโปรแกรมและการคิดเชิงตรรกะ ได้คะแนน 75/100 และคว้ารางวัลเหรียญทองแดงระดับภูมิภาค',
    fe_award: 'เหรียญทองแดง · ระดับภูมิภาค', fe_by: 'ผ่านเข้าสู่รอบระดับประเทศ โดยได้รับการคัดเลือกเป็นตัวแทนภูมิภาค รายวิชา ความถนัดทางวิศวกรรมคอมพิวเตอร์ รหัสวิชา FE-CE-25S ระดับชั้นมัธยมศึกษาตอนปลาย',
    fe_il: 'ผู้มอบ', fe_i: 'สำนักงานพัฒนาและประเมินศักยภาพด้านวิชาชีพ บริษัท แมทธิฟิค เอ็ดดูเคชั่น จำกัด', fe_sch: 'โรงเรียน', fe_s: 'โรงเรียนพิษณุโลกพิทยาคม', fe_date: '23 สิงหาคม พ.ศ. 2568', fe_score: 'ร้อยละ 75',
    p1: 'แดชบอร์ดวิเคราะห์ข้อมูลแบบเรียลไทม์ พร้อมกราฟสวยงาม', p2: 'เว็บอีคอมเมิร์ซความเร็วสูง รองรับหลายภาษาและการชำระเงิน', p3: 'แพลตฟอร์มเรียนออนไลน์ ติดตามความก้าวหน้าของผู้เรียน',
    contact_title: 'ติดต่อ', c_channels: 'ช่องทางติดต่อ', c_email: 'อีเมล', c_loc: 'ที่อยู่', c_loc_v: 'เชียงใหม่ ประเทศไทย',
    f_name: 'ชื่อ', f_email: 'อีเมล', f_subject: 'หัวข้อ', f_msg: 'ข้อความ', f_send: 'ส่งข้อความ',
    f_name_ph: 'ชื่อ', f_email_ph: 'อีเมล', sent: 'ส่งแล้ว ✓', foot: 'สร้างด้วยความรักจากอวกาศ',
    roles: ['Front-end Developer', 'AI Engineer', 'Project Manager'] },
  en: { nav_about: 'About', nav_projects: 'Projects', nav_contact: 'Contact',
    hero_eyebrow: "Hi, I'm", n1: 'Hemmarat', n2: 'Phanthanawibun',
    lvl_uni: 'University', lvl_uni_sub: 'Chiang Mai University · Year 1', lvl_hs: 'High School', lvl_hs_sub: 'Phitsanulok Pittayakom School · 2025',
    lvl_empty: 'New university-level projects coming soon', lvl_empty_c: 'University-level certificates coming soon',
    asean_badge: 'ASEAN level · 2025', asean_venue: 'Chaopraya University',
    asean1v: 'Gold Medal', asean1l: 'Certificate', asean2v: 'Honorable Mention (Bronze)', asean2l: 'Award received', asean3v: 'ASEAN', asean3l: 'Competition level',
    asean_intro: 'I took part in the CPU 3rd ASEAN GRAND PRIX, an ASEAN-level robotics competition for the Royal Cup, held at Chaopraya University. Teams competed in the upper secondary category.',
    asean_rolel: 'My role & experience', asean_role: 'I was responsible for assembling the joystick-controlled robot, from mounting the structure and motors to wiring the electronics for joystick control, so the robot could move and complete missions on the field accurately and consistently. We collected all the mission objects and received an Honorable Mention (Bronze Medal) along with a Gold Medal certificate.',
    asean_award: 'Gold Medal · ASEAN Level', asean_by: 'ASEAN-level robotics and esports competition for the Royal Cup of Her Royal Highness Princess Maha Chakri Sirindhorn and Her Royal Highness Princess Ubolratana Rajakanya Sirivadhana Barnavadi, 3rd edition',
    asean_il: 'Issued by', asean_i: 'Chaopraya University', asean_date: '13 July 2025', asean_res: 'Honorable Mention, Bronze Medal (KTIS manual-control robot)',
    hero_lead: 'Digital Industry Integration student, College of Arts, Media and Technology, Chiang Mai University.',
    f1: 'University', f1v: 'Chiang Mai University', f2: 'College', f2v: 'College of Arts, Media and Technology', f3: 'Major', f3v: 'Digital Industry Integration', f4: 'Year', f4v: 'Year 1',
    hero_cta1: 'View Work', hero_cta2: 'Contact Me', about_title: 'About Me',
    about_text: 'I am Hemmarat Phanthanawibun, nickname “Much”, a first-year student in Digital Industry Integration at the College of Arts, Media and Technology, Chiang Mai University. My goal is to become a Front-end Developer, AI Engineer and Project Manager.',
    st1: 'Years Experience', st2: 'Projects', st3: 'Clients', skills_title: 'Skills', projects_title: 'Projects', nav_certs: 'Certificates', certs_title: 'Certificates',
    w_badge: 'National level · 2025', w_venue: 'Thai-Nichi Institute of Technology',
    c1v: '2 days', c1l: 'Competition', c2v: '128 teams', c2l: 'Nationwide', c3v: 'Top 32', c3l: 'Final round',
    w_intro: 'I took part in a national robotics competition at Thai-Nichi Institute of Technology. The challenge focused on collecting objects by their assigned colors and controlling the robot to complete the mission accurately and quickly. The event ran for 2 days with over 128 teams from across the country.',
    w_rolel: 'My role', w_role: 'I was responsible for writing the robot motion-control code, from basic commands to defining autonomous behaviors so the robot could perform its tasks precisely.',
    d1_t: 'Day 1', d1_h: 'Gold medal', d1: 'Our team performed excellently under the rules announced in advance and was able to set the angles to match the field. The robot picked up the donuts and placed them on the stand completely, earning a gold medal.',
    d2_t: 'Day 2', d2_h: 'Surprise rules', d2: 'Surprise rules were introduced, such as decoy donuts and the opposing side changing the placement layout, so we had to adapt our strategy and fix the code within a limited time. Although we finished in the final 32 of 128 teams, it was a challenging and very valuable experience.',
    ct_award: 'Gold Medal', ct_by: 'Youth robotics competition, Innovedex Robotics Competition project, year 2025 (B.E. 2568)',
    ct_dl: 'Date awarded', ct_date: '10 August 2025', ct_sl: 'Score', ct_nl: 'Awarded to', ct_name: 'Hemmarat Phanthanawibun', zoom: 'Click to enlarge',
    shot_asean_robot: 'Robot Mechanism', shot_asean_team: 'Contestant Team',
    shot_inno_robot: 'Robot & Arena', shot_inno_team: 'Contestant Team',
    shot_cpe_stage: 'Stage Atmosphere', shot_cpe_selfie: 'Team & Competition',
        cpe_badge: 'National level · 2025', cpe_venue: 'Department of Computer Engineering, Chiang Mai University',
    cpe1v: '50+ teams', cpe1l: 'Nationwide', cpe2v: '3 / team', cpe2l: 'Team size', cpe3v: 'Top 45', cpe3l: 'Individual round',
    cpe_intro: 'I participated in the CPE Coding Box High-School Edition 2025 competition organized by the Department of Computer Engineering, Faculty of Engineering, Chiang Mai University in collaboration with IEEE Thailand Section, with 50+ teams participating nationwide.',
    cpe_rolel: 'Key achievement', cpe_role: 'Qualified for the afternoon individual round (top 45 participants overall), representing the top performers from only 15 selected schools nationwide.',
    cpe_award: 'National Level', cpe_by: 'Qualified for the individual round (Top 15 Final Schools) in the Computer Programming Competition, Coding Box - High School Edition 2025.',
    cpe_il: 'Organizer', cpe_i: 'Dept. of Computer Engineering, CMU & IEEE Thailand Section', cpe_vl: 'Venue', cpe_v: 'Faculty of Engineering, Chiang Mai University', cpe_date: '4 October 2025', cpe_rl: 'Result', cpe_res: 'Qualified for Individual Round (Top 45)',
    fe_badge: 'Regional representative · 2025', fe_sub: 'Computer Engineering Aptitude',
    fe1v: '75/100', fe1l: 'Score', fe2v: 'National round', fe2l: 'Advanced to', fe3v: 'Bronze medal', fe3l: 'Regional level',
    fe_intro: 'I took part in the Fundamentals of Engineering Testing (FE) 2025 program and advanced to the national round as a regional representative, one of the most important experiences of my life.',
    fe_topicl: 'Competition topic', fe_topic: '"Computer Engineering Aptitude" covering hardware fundamentals, digital system design, programming and logical thinking. I scored 75/100 and won the regional bronze medal.',
    fe_award: 'Bronze medal · Regional', fe_by: 'Advanced to the national round as a selected regional representative. Subject: Computer Engineering Aptitude, code FE-CE-25S, upper secondary level.',
    fe_il: 'Issued by', fe_i: 'Professional Development and Assessment Office, Mathiphic Education Co., Ltd.', fe_sch: 'School', fe_s: 'Phitsanulok Pittayakom School', fe_date: '23 August 2025', fe_score: '75%',
    p1: 'Real-time analytics dashboard with beautiful charts.', p2: 'High-speed e-commerce, multi-language and payment ready.', p3: 'Online learning platform that tracks learner progress.',
    contact_title: 'Contact', c_channels: 'Contact Info', c_email: 'Email', c_loc: 'Location', c_loc_v: 'Chiang Mai, Thailand',
    f_name: 'Name', f_email: 'Email', f_subject: 'Subject', f_msg: 'Message', f_send: 'Send message',
    f_name_ph: 'Name', f_email_ph: 'Email', sent: 'Sent ✓', foot: 'Crafted with love from space',
    roles: ['Front-end Developer', 'AI Engineer', 'Project Manager'] }
};
let lang = localStorage.getItem('lang') || 'th';
function applyLang(l) {
  lang = l; localStorage.setItem('lang', l); document.documentElement.lang = l;
  document.querySelectorAll('[data-i18n]').forEach(e => { const v = T[l][e.dataset.i18n]; if (v) e.textContent = v; });
  document.querySelectorAll('[data-ph]').forEach(e => { const v = T[l][e.dataset.ph]; if (v) e.placeholder = v; });
  document.getElementById('langLabel').textContent = l.toUpperCase();
  document.querySelectorAll('#langMenu li').forEach(li => li.classList.toggle('active', li.dataset.lang === l));
  ri = 0; ci = 0; del = false;
}
const lg = document.getElementById('lang');
document.getElementById('langBtn').onclick = e => { e.stopPropagation(); lg.classList.toggle('open'); };
document.querySelectorAll('#langMenu li').forEach(li => li.onclick = () => { applyLang(li.dataset.lang); lg.classList.remove('open'); });
addEventListener('click', () => lg.classList.remove('open'));

// ---------- Typewriter ----------
let ri = 0, ci = 0, del = false; const typed = document.getElementById('typed');
(function type() {
  const w = T[lang].roles[ri % 3];
  typed.textContent = w.slice(0, ci);
  if (!del && ci === w.length) { del = true; return setTimeout(type, 1500); }
  if (del && ci === 0) { del = false; ri++; }
  ci += del ? -1 : 1;
  setTimeout(type, del ? 40 : 90);
})();
applyLang(lang);

// ---------- Reveal + counters ----------
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('visible');
  e.target.querySelectorAll('[data-count]').forEach(n => {
    const end = +n.dataset.count; let v = 0;
    const id = setInterval(() => { v += Math.ceil(end / 40); if (v >= end) { v = end; clearInterval(id); } n.textContent = v + '+'; }, 35);
  });
  io.unobserve(e.target);
}), { threshold: .2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- 3D tilt on project cards ----------
document.querySelectorAll('.tilt').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
  });
  c.addEventListener('mouseleave', () => c.style.transform = '');
});

// ---------- Form ----------
const MAIL_TO = 'muchhemmarat@gmail.com';
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target, txt = document.getElementById('sendTxt');
  const name = form.elements.name.value.trim(), email = form.elements.email.value.trim();
  const subject = form.elements._subject.value.trim(), message = form.elements.message.value.trim();
  const body = `${message}\n\n— ${name}\n${email}`;
  // Opens Gmail with the message already filled in (To: muchhemmarat@gmail.com); falls back to the default mail app.
  const gmail = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(MAIL_TO) +
    '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  const w = window.open(gmail, '_blank');
  if (!w) location.href = 'mailto:' + MAIL_TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  txt.textContent = T[lang].sent; form.reset();
  setTimeout(() => txt.textContent = T[lang].f_send, 2500);
});

// ---------- Realistic orbiting planets (procedural textures mapped on a lit, rotating sphere) ----------
(function () {
  const TW = 320, TH = 160;
  const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const sm = t => t * t * (3 - 2 * t), mix = (a, b, t) => a + (b - a) * t, cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  function noiser(seed) {                       // horizontally tileable fractal noise
    const R = rng(seed), grids = [];
    for (let o = 0; o < 7; o++) { const w = 4 << o, h = 2 << o, g = new Float32Array(w * h); for (let i = 0; i < g.length; i++) g[i] = R(); grids.push({ w, h, g }); }
    return (u, v, oct = 5, base = 0) => {
      let sum = 0, amp = .5, norm = 0;
      for (let o = 0; o < oct; o++) {
        const { w, h, g } = grids[o + base], x = ((u % 1) + 1) % 1 * w, y = cl(v, 0, .9999) * h, x0 = Math.floor(x), y0 = Math.floor(y);
        const fx = sm(x - x0), fy = sm(y - y0), x1 = (x0 + 1) % w, y1 = Math.min(y0 + 1, h - 1);
        sum += amp * mix(mix(g[y0 * w + x0], g[y0 * w + x1], fx), mix(g[y1 * w + x0], g[y1 * w + x1], fx), fy);
        norm += amp; amp *= .5;
      }
      return sum / norm;
    };
  }
  const ramp = (stops, t) => {                  // [[pos,[r,g,b]],...]
    t = cl(t); for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) {
      const [p0, c0] = stops[i - 1], [p1, c1] = stops[i], k = (t - p0) / (p1 - p0 || 1); return [mix(c0[0], c1[0], k), mix(c0[1], c1[1], k), mix(c0[2], c1[2], k)];
    } return stops[stops.length - 1][1];
  };
  function tex(fn) {
    const d = new Uint8ClampedArray(TW * TH * 4), water = new Uint8Array(TW * TH);
    for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) {
      const [r, g, b, w] = fn(x / TW, y / TH, x, y), i = (y * TW + x) * 4;
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255; water[y * TW + x] = w ? 1 : 0;
    }
    return { d, water };
  }
  function craters(t, seed, n) {
    const R = rng(seed);
    for (let c = 0; c < n; c++) {
      const cx = R() * TW, cy = (.1 + R() * .8) * TH, rad = 2 + Math.pow(R(), 2.2) * 14;
      for (let y = Math.max(0, cy - rad - 2 | 0); y < Math.min(TH, cy + rad + 2); y++) for (let x = (cx - rad - 2) | 0; x < cx + rad + 2; x++) {
        const dx = x - cx, dy = y - cy, dd = Math.hypot(dx, dy) / rad; if (dd > 1.15) continue;
        const i = (y * TW + ((x % TW) + TW) % TW) * 4;
        let k = 1;
        if (dd < .92) k = .78 + (dx + dy > 0 ? .0 : .06);                // darker floor
        else if (dd < 1.08) k = 1.18 + (dx + dy < 0 ? .12 : -.12);       // lit rim
        t.d[i] *= k; t.d[i + 1] *= k; t.d[i + 2] *= k;
      }
    }
  }
  const N = noiser(7), N2 = noiser(31), N3 = noiser(99);
  const T = {
    mercury: () => { const t = tex((u, v) => { const n = N(u, v, 6, 1), c = ramp([[0, [70, 66, 62]], [.5, [140, 133, 124]], [1, [196, 188, 176]]], n * 1.25 - .1); return [c[0], c[1], c[2], 0]; }); craters(t, 5, 95); return t; },
    venus: () => tex((u, v) => { const w = N(u * .5, v, 3, 1), n = N2(u + w * .35, v * 1.1 + w * .1, 5, 1), c = ramp([[0, [168, 120, 62]], [.45, [226, 182, 112]], [.75, [244, 218, 160]], [1, [255, 240, 205]]], n * 1.2 - .05); return [c[0], c[1], c[2], 0]; }),
    earth: () => tex((u, v) => {
      const h = N(u, v, 6, 1) * .75 + N2(u, v, 3, 3) * .25, lat = Math.abs(v - .5) * 2;
      const polar = lat + (N3(u, v, 4, 2) - .5) * .25 > .86;
      let c, water = false;
      if (polar) c = [236, 244, 250];
      else if (h < .5) { water = true; c = ramp([[0, [6, 26, 84]], [.8, [18, 76, 164]], [1, [60, 150, 205]]], (h - .25) / .25); }
      else c = ramp([[0, [210, 190, 130]], [.15, [64, 130, 62]], [.5, [36, 94, 48]], [.75, [120, 98, 64]], [1, [200, 190, 175]]], (h - .5) / .3 * (1 - lat * .5) + lat * .1);
      const cloud = cl((N3(u * 1.3 + .2, v * 1.8, 6, 1) - .5) * 4.2 + .1, 0, .88);
      return [mix(c[0], 255, cloud), mix(c[1], 255, cloud), mix(c[2], 255, cloud), water && cloud < .35];
    }),
    mars: () => tex((u, v) => {
      const n = N(u, v, 6, 1), dark = cl((N2(u, v, 4, 2) - .52) * 6), lat = Math.abs(v - .5) * 2;
      let c = ramp([[0, [128, 58, 32]], [.5, [196, 98, 56]], [1, [232, 150, 96]]], n * 1.3 - .1);
      c = [mix(c[0], 74, dark * .55), mix(c[1], 40, dark * .55), mix(c[2], 28, dark * .55)];
      const cap = cl((lat - .9) * 18); return [mix(c[0], 245, cap), mix(c[1], 245, cap), mix(c[2], 250, cap), 0];
    }),
    jupiter: () => tex((u, v) => {
      const turb = (N(u * 2, v * 3, 5, 1) - .5), band = v * 15 + turb * 2.4 + Math.sin(v * 40) * .12;
      const k = (Math.sin(band * Math.PI) + 1) / 2 + N2(u * 3, v * 22, 3, 3) * .25;
      let c = ramp([[0, [150, 98, 64]], [.3, [196, 146, 104]], [.55, [236, 214, 178]], [.8, [246, 232, 205]], [1, [214, 168, 124]]], k * .85);
      const dx = (((u - .32 + 1.5) % 1) - .5) * 2.6, dy = (v - .63) * 5.2, e = Math.hypot(dx, dy);
      if (e < 1) { const m = (1 - e); c = [mix(c[0], 196, m), mix(c[1], 86, m), mix(c[2], 62, m)]; }
      return [c[0], c[1], c[2], 0];
    })
  };
  const CFG = {   // rotation period (s, negative = retrograde), axial tilt (deg), atmosphere rgb, atmosphere strength, ocean specular
    mercury: { per: 42, tilt: 0, atm: [0, 0, 0], a: 0, spec: 0 },
    venus: { per: -55, tilt: 3, atm: [255, 205, 130], a: .9, spec: 0 },
    earth: { per: 16, tilt: 23, atm: [90, 170, 255], a: 1.1, spec: .55 },
    mars: { per: 18, tilt: 25, atm: [255, 150, 110], a: .35, spec: 0 },
    jupiter: { per: 9, tilt: 3, atm: [240, 205, 160], a: .5, spec: 0 }
  };
  const L = (() => { const v = [-.55, -.5, .67], m = Math.hypot(...v); return v.map(x => x / m); })();
  const planets = [];
  document.querySelectorAll('canvas.pl').forEach(cv => {
    const name = cv.dataset.p, d = cv.parentElement.getBoundingClientRect().width || 24, res = Math.ceil(d * 2.5);
    cv.width = cv.height = res;
    const ctx2 = cv.getContext('2d'), img = ctx2.createImageData(res, res), t = T[name]();
    planets.push({ cv, ctx2, img, t, res, c: CFG[name] });
  });
  const clock = performance.now();
  function render(P, now) {
    const { img, res, c, t } = P, o = img.data, tilt = c.tilt * Math.PI / 180, ct = Math.cos(tilt), st = Math.sin(tilt);
    const rot = (now - clock) / 1000 / c.per * 6.2832;
    for (let py = 0; py < res; py++) for (let px = 0; px < res; px++) {
      const nx = (px + .5) / res * 2 - 1, ny = (py + .5) / res * 2 - 1, r2 = nx * nx + ny * ny, i = (py * res + px) * 4;
      if (r2 >= 1) { const e = Math.sqrt(r2) - 1; o[i + 3] = 0; continue; }
      const nz = Math.sqrt(1 - r2);
      const x = nx * ct + ny * st, y = -nx * st + ny * ct;
      const lon = Math.atan2(x, nz) + rot, lat = Math.asin(-y);
      let u = (lon / 6.2832 + .5) % 1; if (u < 0) u += 1;
      const v = cl(.5 - lat / Math.PI, 0, .999), fx = u * TW, fy = v * TH, x0 = fx | 0, y0 = fy | 0, x1 = (x0 + 1) % TW, y1 = Math.min(y0 + 1, TH - 1), ax = fx - x0, ay = fy - y0;
      let r = 0, g = 0, b = 0;
      for (let k = 0; k < 3; k++) {
        const a00 = t.d[(y0 * TW + x0) * 4 + k], a10 = t.d[(y0 * TW + x1) * 4 + k], a01 = t.d[(y1 * TW + x0) * 4 + k], a11 = t.d[(y1 * TW + x1) * 4 + k];
        const val = mix(mix(a00, a10, ax), mix(a01, a11, ax), ay); if (k === 0) r = val; else if (k === 1) g = val; else b = val;
      }
      const dif = nx * L[0] + ny * L[1] + nz * L[2], lit = cl((dif + .08) / .5) ; // soft terminator
      const diffuse = Math.pow(cl(dif), .85) * .95 * lit + .05;
      const limb = .55 + .45 * Math.pow(nz, .45);                                  // limb darkening
      let kk = diffuse * limb;
      let rr = r * kk, gg = g * kk, bb = b * kk;
      if (c.spec && t.water[(y0 * TW + x0)]) {                                      // ocean sun glint
        const hx = L[0], hy = L[1], hz = L[2] + 1, hm = Math.hypot(hx, hy, hz), s = Math.pow(cl((nx * hx + ny * hy + nz * hz) / hm), 40) * c.spec * 255 * lit;
        rr += s; gg += s; bb += s;
      }
      if (c.a) {                                                                     // atmosphere rim, strongest on lit side
        const rim = Math.pow(1 - nz, 2.6) * c.a * (.25 + .75 * cl(dif + .35));
        rr += c.atm[0] * rim; gg += c.atm[1] * rim; bb += c.atm[2] * rim;
      }
      const edge = cl((1 - Math.sqrt(r2)) * res * .5);                               // anti-aliased edge
      o[i] = rr; o[i + 1] = gg; o[i + 2] = bb; o[i + 3] = 255 * edge;
    }
    P.ctx2.putImageData(img, 0, 0);
  }
  (function loop(now) { for (const P of planets) render(P, now); requestAnimationFrame(loop); })(clock);
})();


// ---------- Lightbox (click photos / certificate to enlarge) ----------
(function () {
  const lb = document.getElementById('lightbox'), img = lb.querySelector('img');
  const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-full]');
    if (b) { img.src = b.dataset.full; img.alt = b.querySelector('img') ? b.querySelector('img').alt : ''; lb.hidden = false; document.body.style.overflow = 'hidden'; }
    else if (e.target.closest('#lightbox') && e.target !== img) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
