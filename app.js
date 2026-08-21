/* ==========================================================
   Granite Design Advisor — client-side application logic
   All data is stored locally in the browser (localStorage).
   ========================================================== */

/* ---------- 1. GRANITE CATALOG DATA ---------- */
const AREA_LABELS = {
  kitchen:"ห้องครัว", bathroom:"ห้องน้ำ", livingroom:"Living Room",
  counter:"Counter", table:"โต๊ะ", wall:"ผนัง", floor:"พื้น", outdoor:"Outdoor"
};
const COLOR_LABELS = { black:"⚫ ดำ", white:"⚪ ขาว", brown:"🟤 น้ำตาล", green:"🟢 เขียว", blue:"🔵 น้ำเงิน", red:"🔴 แดง", grey:"🔘 เทา" };

const GRANITE_CATALOG = [
  { id:'g_diamond-white', name:'DIAMOND WHITE', material:'marble', color:'white', styles:["Classic", "Minimal"], price:3590,
    areas:["counter", "wall", "floor"], indoor:'indoor',
    desc:'หินแกรนิตไดมอนด์ไวท์ (ชนิดโดโลไมต์) DIAMOND WHITE',
    rating:{price:1,durability:4,maintenance:3,modern:4,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/WDM.jpg?width=600&quality=80&format=webp' },
  { id:'g_jasper-red', name:'JASPER RED', material:'marble', color:'red', styles:["Luxury"], price:2290,
    areas:["livingroom", "counter", "table"], indoor:'indoor',
    desc:'หินอ่อนแจสเปอร์ เรด (Jasper Red Marble) หินอ่อนนำเข้าสีแดงเข้ม โดดเด่นด้วยลวดลายเส้นแร่สีขาวที่แทรกตัวอยู่ทั่วแผ่นหิน ให้ความรู้สึกแข็งแกร่งและหรูหราในเวลาเดียวกัน เป็นหินที่นิยมใช้ในการตกแต่งเพื่อสร้างจุดเด่นให้กับพื้นที่ห้องรับแขก, ท็อปเคาน์เตอร์บาร์สุดหรู, หรือโต๊ะรับประทานอาหารที่ต้องการความโดดเด่นไม่ซ้ำใคร',
    rating:{price:3,durability:4,maintenance:3,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/JPR-RE.jpg?width=600&quality=80&format=webp' },
  { id:'g_silver-orobico', name:'SILVER OROBICO', material:'marble', color:'grey', styles:["Luxury"], price:4390,
    areas:["counter", "wall", "table"], indoor:'indoor',
    desc:'หินอ่อนซิลเวอร์โอโลบิโก้ (Silver Orobico Marble) ความงามที่เกิดจากชั้นหินนับพันปี ถ่ายทอดออกมาเป็นลวดลายเส้นแร่ที่ซ้อนทับและไหลราวกับศิลปะธรรมชาติบนผืนผ้าใบ สีเทาน้ำตาลผสานกับเส้นแร่สีขาวและประกายแร่แฝง สร้างเอกลักษณ์ที่ไม่ซ้ำแบบใคร มอบบรรยากาศที่ทรงพลังและเปี่ยมด้วยรสนิยม',
    rating:{price:1,durability:4,maintenance:3,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/SOB-Cover.jpg?width=600&quality=80&format=webp' },
  { id:'g_breccia-damascata', name:'BRECCIA DAMASCATA', material:'marble', color:'red', styles:["Luxury", "Classic"], price:2590,
    areas:["wall", "table"], indoor:'indoor',
    desc:'หินอ่อนเบรคเซีย ดามาสกาต้า (Breccia Damascata Marble) เนื้อหินโทนสีแดงอิฐสลับกับลวดลายเส้นแร่สีขาวและสีน้ำตาลเข้มอันเป็นเอกลักษณ์ ช่วยเติมเต็มความโดดเด่นและเพิ่มความอบอุ่นที่ดูหรูหราให้กับพื้นที่ของคุณ อย่างเช่นการติดตั้งเป็นผนังตกแต่ง หรือท็อปโต๊ะอาหาร สามารถตกแต่งได้หลากหลายสไตล์',
    rating:{price:2,durability:4,maintenance:3,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/DMT-LOW.jpg?width=600&quality=80&format=webp' },
  { id:'g_rosso-orobico', name:'ROSSO OROBICO', material:'marble', color:'grey', styles:["Luxury"], price:3690,
    areas:["wall", "counter"], indoor:'indoor',
    desc:'หินอ่อนรอสโซ่โอโรบิโก (Rosso Orobico Marble) หนึ่งในหินอ่อนที่มีเอกลักษณ์เฉพาะตัวจากประเทศอิตาลี โดดเด่นด้วยลวดลายที่งดงามเสมือนงานศิลป์ตามธรรมชาติ พื้นหินมีโทนสีเทาอ่อนผสมผสานกับเส้นสายลวดลายสีขาว ขับเน้นด้วยแถบเส้นสีน้ำตาล ทอง และแดงที่พาดผ่านอย่างพลิ้วไหว คล้ายภาพวาดแนว Abstract ที่ธรรมชาติรังสรรค์ขึ้น ทำให้ทุกแผ่นหินแตกต่างไม่ซ้ำกัน',
    rating:{price:1,durability:4,maintenance:3,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/66a0c1e2611080d7d046d9ea_ATC-670305-2-cover.jpg?width=600&quality=80&format=webp' },
  { id:'g_classical-white', name:'CLASSICAL WHITE', material:'granite', color:'white', styles:["Classic", "Modern"], price:1790,
    areas:["kitchen", "counter", "wall"], indoor:'indoor',
    desc:'หินแกรนิต คลาสสิกคอลไวท์ (Classical White Granite) เติมเต็มพื้นที่ของคุณด้วยความบริสุทธิ์และเรียบง่ายของหินแกรนิต Classical White ลวดลายเส้นสายสีเทาอ่อนพาดผ่านพื้นผิวสีขาวนวลอย่างเป็นธรรมชาติ มอบความรู้สึกสะอาดตาและทันสมัย สามารถเข้าได้กับทุกสไตล์การออกแบบ ไม่ว่าจะเป็นเคาน์เตอร์ครัวหรือผนังตกแต่ง',
    rating:{price:3,durability:5,maintenance:4,modern:5,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/654b3e125d72664d765babd0_CS1.jpg?width=600&quality=80&format=webp' },
  { id:'g_blue-pearl-2', name:'BLUE PEARL #2', material:'granite', color:'blue', styles:["Luxury", "Minimal"], price:2490,
    areas:["counter", "table", "floor", "livingroom"], indoor:'indoor',
    desc:'หินแกรนิต บลูเพิร์ล #2 (Blue Pearl #2) ด้วยเฉดฟ้าเข้มที่ลุ่มลึกและลวดลายละเอียด หินแกรนิตบลูเพิร์ล #2 ให้ความรู้สึกสงบหรูหรา เหมาะอย่างยิ่งสำหรับพื้นที่ที่เน้นดีไซน์เรียบง่ายแต่พรีเมียม เช่น เคาน์เตอร์บาร์ โต๊ะกลาง หรือพื้นห้องรับแขก ช่วยเพิ่มมิติที่ดูมีระดับโดยไม่ฉูดฉาดเกินไป',
    rating:{price:3,durability:5,maintenance:4,modern:4,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/65447e1a785455814ce909df_BP02.jpg?width=600&quality=80&format=webp' },
  { id:'g_african-black', name:'AFRICAN BLACK', material:'granite', color:'black', styles:["Modern"], price:2190,
    areas:["kitchen", "counter", "table"], indoor:'indoor',
    desc:'หินแกรนิตดำแอฟริกา (African Black Granite) หินแกรนิตสีดำที่มีคุณภาพสูงที่สุดและดำสนิทที่สุด เหมาะสำหรับนำไปทำเป็นท็อปครัว ท็อปโต๊ะ หรือจุดต่าง ๆ ที่ต้องการความแข็งแรง',
    rating:{price:3,durability:5,maintenance:4,modern:5,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/6544835929006ff12c703584_AB.jpeg?width=600&quality=80&format=webp' },
  { id:'g_river-gold', name:'RIVER GOLD', material:'granite', color:'brown', styles:["Luxury", "Classic"], price:1990,
    areas:["kitchen", "counter", "floor", "wall"], indoor:'indoor',
    desc:'หินแกรนิตริเวอร์โกล์ด (River Gold Granite) นิยามของความหรูหราที่มาพร้อมความงามตามธรรมชาติ ด้วยพื้นผิวสีครีมและทองอร่ามที่สอดแทรกด้วยลวดลายเส้นสายสีน้ำตาลเข้มและสีดำ ทำให้ดูมีมิติและเคลื่อนไหวคล้ายผืนน้ำในแม่น้ำที่ระยิบระยับ หินแกรนิตชนิดนี้ไม่เพียงแต่ให้ความรู้สึกอบอุ่นและโอ่อ่า แต่ยังมีคุณสมบัติที่แข็งแกร่งทนทานต่อการใช้งานหนัก เหมาะอย่างยิ่งสำหรับการทำเคาน์เตอร์ในครัว พื้น หรือผนังที่ต้องการวัสดุที่สวยงามและใช้งานได้จริงในระยะยาว',
    rating:{price:3,durability:5,maintenance:4,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/67ca77148702b909d767fc33_RVG-Low.jpg?width=600&quality=80&format=webp' },
  { id:'g_bianco-black', name:'BIANCO BLACK', material:'granite', color:'black', styles:["Luxury"], price:1790,
    areas:["floor", "kitchen", "counter", "wall"], indoor:'indoor',
    desc:'หินแกรนิตเบียงโก้แบล็ค (Bianco Black Granite) ประกายเกล็ดแร่สีทองสุดสวยงามเมื่อมีแสงมากระทบที่หน้าหิน หินแกรนิตดำเกล็ดทองที่ขึ้นชื่อเรื่องความงามเหนือกาลเวลา พื้นหินสีดำสนิทแทรกด้วยประกายเกล็ดแร่ทองที่ระยิบระยับเมื่อสะท้อนกับแสง ช่วยเพิ่มมิติและความหรูหราให้ทุกพื้นที่ เหมาะสำหรับงานตกแต่งหลากหลาย ไม่ว่าจะเป็นพื้น เคาน์เตอร์ครัว หรือผนังตกแต่งที่ต้องการความพิเศษ',
    rating:{price:3,durability:5,maintenance:4,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/67ca9788fa6814c0fe9c7394_BB-cover.jpg?width=600&quality=80&format=webp' },
  { id:'g_river-white', name:'RIVER WHITE', material:'granite', color:'white', styles:["Modern", "Minimal"], price:1790,
    areas:["kitchen", "counter", "wall"], indoor:'indoor',
    desc:'หินแกรนิตริเวอร์ไวท์ (River White Granite) โดดเด่นด้วยพื้นผิวสีขาวนวลสะอาดตาที่มีลายเส้นสีเทาเข้มพาดผ่านราวกับสายน้ำที่ไหลอย่างสงบงาม เส้นสายที่พลิ้วไหวนี้สร้างความรู้สึกที่อ่อนโยนและเป็นธรรมชาติ ทำให้เป็นหินที่เหมาะกับการตกแต่งในทุกสไตล์ ไม่ว่าจะเป็นเคาน์เตอร์ในครัวที่ต้องการความสว่าง หรือผนังที่ต้องการความเรียบง่ายแต่มีเอกลักษณ์',
    rating:{price:3,durability:5,maintenance:4,modern:5,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/654b4644080dce0d6c1e06e5_RVW.jpg?width=600&quality=80&format=webp' },
  { id:'g_viscon-white', name:'VISCON WHITE', material:'granite', color:'white', styles:["Modern", "Classic"], price:1590,
    areas:["floor", "counter", "wall"], indoor:'indoor',
    desc:'หินแกรนิต วิสคอนไวท์ (Viscon White Granite) เผยความสง่างามในทุกมุมมอง ด้วยพื้นสีขาวสะอาดสอดแทรกลวดลายเทาอ่อนแบบธรรมชาติ ให้ความรู้สึกกว้าง โปร่ง และเรียบหรู เหมาะสำหรับพื้นที่ที่ต้องการแสงสะท้อนและบรรยากาศสบายตา ไม่ว่าจะเป็นพื้น เคาน์เตอร์ หรือผนังตกแต่ง ทำให้ทุกพื้นที่ดูมีชีวิตชีวาและคลาสสิกในเวลาเดียวกัน',
    rating:{price:3,durability:5,maintenance:4,modern:5,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/67eba81fcce31211c8c9c460_VGW.jpg?width=600&quality=80&format=webp' },
  { id:'g_black-forest', name:'BLACK FOREST', material:'granite', color:'black', styles:["Luxury"], price:1890,
    areas:["counter", "wall", "floor"], indoor:'indoor',
    desc:'หินแกรนิต แบล็คฟอเรสท์ (Black Forest) นำความสง่างามจากธรรมชาติมาสู่การตกแต่งของคุณอย่างแท้จริง ด้วยพื้นผิวสีดำเข้มที่ดูทรงพลัง ตัดกับลายเส้นสีขาวที่พลิ้วไหวราวกับภาพวาดพู่กันจีน ทำให้แต่ละแผ่นมีเอกลักษณ์เฉพาะตัวไม่ซ้ำกัน หินชนิดนี้ให้ความรู้สึกแข็งแกร่งและน่าค้นหา เหมาะสำหรับพื้นที่ที่ต้องการความโดดเด่นและมีสไตล์ที่แตกต่างอย่างมีระดับ',
    rating:{price:3,durability:5,maintenance:4,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/65448225524e34d59f4a4a1e_BFS.jpeg?width=600&quality=80&format=webp' },
  { id:'g_lemurian-blue', name:'LEMURIAN BLUE', material:'granite', color:'blue', styles:["Luxury"], price:4990,
    areas:["kitchen", "counter", "wall", "table"], indoor:'indoor',
    desc:'หินแกรนิตลีมูเรียนบลู (Lemurian Blue Granite) หินแกรนิตระดับพรีเมียมที่โดดเด่นด้วยเฉดสีน้ำเงินเข้มสลับประกายฟ้าและเขียวราวกับแสงเหนือ ทำให้พื้นผิวดูมีชีวิตชีวาและหรูหราไม่เหมือนใคร ลายธรรมชาติที่ซับซ้อนและประกายระยิบระยับของ Lemurian Blue สะท้อนถึงความงดงามอันล้ำค่าจากใต้พิภพ เหมาะอย่างยิ่งสำหรับงานตกแต่งที่ต้องการความโดดเด่น เช่น เคาน์เตอร์ครัว ไอส์แลนด์ แผงผนัง และโต๊ะกลาง หินชนิดนี้ไม่เพียงเพิ่มความงามให้พื้นที่ แต่ยังมีความแข็งแรง ทำให้ใช้งานได้จริงควบคู่กับความงดงามเหนือกาลเวลา Lemurian Blue จึงเป็นตัวเลือกที่ตอบโจทย์ทั้งฟังก์ชันและดีไซน์ระดับหรู',
    rating:{price:1,durability:5,maintenance:4,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/67ca822843c254bc2cfbd64c_LRB-cover.jpg?width=600&quality=80&format=webp' },
  { id:'g_monalisa', name:'MONALISA', material:'marble', color:'grey', styles:["Luxury", "Classic"], price:2190,
    areas:["counter", "wall", "floor", "livingroom"], indoor:'indoor',
    desc:'หินแกรนิตโมนาริซา (Monalisa Marble) เป็นตัวแทนของความสง่างามเหนือกาลเวลา โทนสีเทาอ่อนผสานลายเส้นแร่ที่ละเอียดอ่อน เหมือนผลงานศิลปะบนพื้นผิวหิน สร้างบรรยากาศหรูหราแต่ไม่โอ้อวด เหมาะสำหรับงานตกแต่งภายในที่ต้องการความละเอียดอ่อนและความประณีต เช่น เคาน์เตอร์บาร์, ผนังโชว์ หรือพื้นห้องรับแขก',
    rating:{price:3,durability:4,maintenance:3,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/6735954d26620adac55d0d0f_MNL.jpg?width=600&quality=80&format=webp' },
  { id:'g_emerald-pearl', name:'EMERALD PEARL', material:'granite', color:'green', styles:["Luxury"], price:3479,
    areas:["kitchen", "counter", "bathroom", "wall"], indoor:'indoor',
    desc:'หินแกรนิต เอ็มเมอรัลเพิร์ล (Emerald Pearl Granite) มีความพิเศษอยู่ที่สีเขียวอมดำที่ดูหรูหราลุ่มลึก พร้อมประกายมุกสีทองและเงินที่แวววาวเมื่อต้องแสงไฟ ทำให้ดูงดงามและลึกลับราวกับอัญมณีล้ำค่า เป็นตัวเลือกที่ยอดเยี่ยมสำหรับงานที่ต้องการความหรูหราและดึงดูดสายตา เช่น เคาน์เตอร์ครัวหรือผนังตกแต่งในห้องน้ำ',
    rating:{price:2,durability:5,maintenance:4,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/65447c9d93ead1c038ae5736_EP.jpeg?width=600&quality=80&format=webp' },
  { id:'g_black-galaxy', name:'BLACK GALAXY', material:'granite', color:'black', styles:["Luxury", "Modern"], price:1990,
    areas:["floor", "kitchen", "counter", "wall"], indoor:'indoor',
    desc:'หินแกรนิตดำเกล็ดทอง (Black Galaxy Granite) หินแกรนิตสีดำที่มีประกายเกล็ดแร่สีทองสุดสวยงามเมื่อมีแสงมากระทบที่หน้าหินทำให้มีประกายเกล็ดแร่สีทองสุดสวยงามเมื่อมีแสงมากระทบที่หน้าหิน หินแกรนิตดำเกล็ดทองที่ขึ้นชื่อเรื่องความงามเหนือกาลเวลา พื้นหินสีดำสนิทแทรกด้วยประกายเกล็ดแร่ทองที่ระยิบระยับเมื่อสะท้อนกับแสง ช่วยเพิ่มมิติและความหรูหราให้ทุกพื้นที่ เหมาะสำหรับงานตกแต่งหลากหลาย ไม่ว่าจะเป็นพื้น เคาน์เตอร์ครัว หรือผนังตกแต่งที่ต้องการความพิเศษ',
    rating:{price:3,durability:5,maintenance:4,modern:5,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/6555c70232fd5d4c898f0c82_GDP.jpg?width=600&quality=80&format=webp' },
  { id:'g_titanium-gold', name:'TITANIUM GOLD', material:'granite', color:'black', styles:["Luxury", "Modern"], price:3590,
    areas:["kitchen", "counter", "wall"], indoor:'indoor',
    desc:'หินแกรนิตไทเทเนียมโกลด์ (Titanium Gold Granite) โดดเด่นด้วยโทนสีดำเข้มตัดกับลายแร่ทองและขาวที่สวยสะดุดตา ให้ความรู้สึกหรูหราและทันสมัย เหมาะสำหรับงานตกแต่งที่ต้องการความพิเศษ เช่น เคาน์เตอร์ครัว เคาน์เตอร์บาร์ หรือผนังตกแต่ง ที่ต้องการสไตล์โดดเด่นและความทนทานสูง',
    rating:{price:1,durability:5,maintenance:4,modern:5,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/67ca9b0643631894fede769d_TTG.jpg?width=600&quality=80&format=webp' },
  { id:'g_indian-black', name:'INDIAN BLACK', material:'granite', color:'black', styles:["Modern"], price:1350,
    areas:["kitchen", "counter", "bathroom"], indoor:'indoor',
    desc:'หินแกรนิต ดำอินเดีย (Indian Black Granite) เหมาะสำหรับการนำไปทำเป็นท็อปเคาน์เตอร์ครัว ท็อปอ่างล้างมือ หรือส่วนอื่นๆ ที่ต้องการความแข็งแรง',
    rating:{price:4,durability:5,maintenance:4,modern:5,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/6555b34a18caf759173e834a_IDB.jpg?width=600&quality=80&format=webp' },
  { id:'g_azul-white', name:'AZUL WHITE', material:'granite', color:'white', styles:["Luxury", "Modern"], price:2490,
    areas:["floor", "counter", "wall", "outdoor"], indoor:'both',
    desc:'หินแกรนิตอะซูลไวท์ (Azul White Granite) ความงดงามที่ผสมผสานระหว่างความบริสุทธิ์ของสีขาวและเส้นแร่สีฟ้าอ่อนอย่างลงตัวลวดลายที่ดูอ่อนโยนและมีมิติ สร้างบรรยากาศโปร่ง โล่ง และหรูหราในทุกพื้นที่ เหมาะกับการตกแต่งทั้งภายในและภายนอก ให้สัมผัสของความสว่างและความพิเศษเหนือใครลงตัวกับงานดีไซน์ที่ต้องการความเรียบหรู ไม่ว่าจะเป็นพื้น เคาน์เตอร์ หรือผนัง',
    rating:{price:3,durability:5,maintenance:4,modern:5,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/67ca76a5fa98d6c769fa6b54_AZW.jpg?width=600&quality=80&format=webp' },
  { id:'g_china-white-602', name:'CHINA WHITE 602', material:'granite', color:'white', styles:["Modern", "Minimal"], price:459,
    areas:["kitchen", "counter"], indoor:'indoor',
    desc:'หินแกรนิต ขาวจีน 602#2 (China White Granite 602#2) หินธรรมชาติที่สะท้อนความเรียบง่ายและสะอาดตาได้อย่างไร้ที่ติ ด้วยพื้นผิวสีขาวสว่างหรือเทาอ่อนที่สม่ำเสมอทั่วทั้งแผ่น โดดเด่นด้วยการกระจายตัวของเม็ดแร่สีดำและสีเทาขนาดเล็กอย่างสม่ำเสมอ ทำให้เกิดลวดลายที่ดูละมุนตาและเป็นระเบียบ หินชนิดนี้เป็นที่นิยมอย่างมากในงานออกแบบที่เน้นความโมเดิร์นและมินิมอล เพราะให้ความรู้สึกโปร่งโล่งสบายตา และยังเป็นวัสดุที่แข็งแกร่งทนทานต่อการขีดข่วนและความร้อนสูง จึงเหมาะอย่างยิ่งสำหรับเคาน์เตอร์ครัวและพื้นที่ที่ต้องการความสวยงามควบคู่ไปกับฟังก์ชันการใช้งาน',
    rating:{price:5,durability:5,maintenance:4,modern:5,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/67ebb2308461601163452488_602-low.jpg?width=600&quality=80&format=webp' },
  { id:'g_khao-tone', name:'KHAO TONE', material:'granite', color:'white', styles:["Classic", "Minimal"], price:1790,
    areas:["counter", "floor", "wall"], indoor:'indoor',
    desc:'หินแกรนิตเขาโทน (Khao Tone Granite) หินธรรมชาติที่ถ่ายทอดความสงบและเรียบง่ายแบบไทยได้อย่างงดงามสมชื่อ ด้วยพื้นผิวสีขาวสะอาดตาเป็นหลัก ประดับด้วยเม็ดแร่สีดำและสีเทาขนาดเล็กที่กระจายตัวอยู่ทั่วทั้งแผ่นอย่างมีศิลปะ ทำให้เกิดลวดลายที่ดูละมุนและมีมิติ ไม่จัดจ้านเกินไป หินชนิดนี้เป็นสัญลักษณ์ของความแข็งแกร่งและทนทานที่มาจากธรรมชาติอย่างแท้จริง เหมาะอย่างยิ่งสำหรับผู้ที่ต้องการสร้างบรรยากาศที่ดูโปร่งโล่ง สะอาด และคลาสสิกให้กับพื้นที่ ไม่ว่าจะเป็นเคาน์เตอร์, พื้น, หรือผนัง หินเขาโทนจะมอบความงามที่เหนือกาลเวลาได้อย่างลงตัว',
    rating:{price:3,durability:5,maintenance:4,modern:4,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/6555b1b6a8b87ce0b60c40f5_KT.jpg?width=600&quality=80&format=webp' },
  { id:'g_eclipse', name:'ECLIPSE', material:'granite', color:'grey', styles:["Luxury"], price:2990,
    areas:["counter", "wall", "floor"], indoor:'indoor',
    desc:'หินแกรนิตอีคลิปส์ (Eclipse Granite) นำเสนอความลึกลับและความงามที่น่าค้นหา ด้วยพื้นผิวสีเทาเข้มเกือบดำที่ดูแข็งแกร่งและน่าเกรงขาม ลวดลายเส้นสีขาวและสีเทาที่กระจัดกระจายอยู่ทั่วแผ่นให้ความรู้สึกเหมือนแสงจันทร์ที่ส่องผ่านเมฆในยามค่ำคืน หินชนิดนี้เป็นตัวเลือกที่สมบูรณ์แบบสำหรับงานที่ต้องการความโดดเด่นและมีดีไซน์ที่แตกต่างอย่างมีระดับ',
    rating:{price:2,durability:5,maintenance:4,modern:3,luxury:5},
    image:'https://siamtak.b-cdn.net/hero-product/65447bf303300e91cc80cff4_ECL.jpeg?width=600&quality=80&format=webp' },
  { id:'g_antique-white', name:'ANTIQUE WHITE', material:'granite', color:'white', styles:["Classic"], price:2490,
    areas:["counter", "wall", "floor"], indoor:'indoor',
    desc:'หินแกรนิตแอนติกไวท์ (Antique White granite) หินธรรมชาติที่ถ่ายทอดความงามแบบคลาสสิกและอบอุ่นได้อย่างลงตัว ด้วยพื้นผิวสีขาวครีมหรือขาวนวลที่ดูอ่อนโยนเป็นหลัก แต่ถูกเติมเต็มด้วยเม็ดแร่สีดำและสีเทาที่กระจายตัวอยู่ทั่วทั้งแผ่นอย่างมีเสน่ห์ จุดเด่นที่ทำให้หินชนิดนี้มีเอกลักษณ์เฉพาะตัวคือเม็ดแร่สีแดงเข้มหรือสีสนิมที่แทรกอยู่ สร้างความรู้สึกวินเทจและน่าสนใจไม่เหมือนใคร หินแอนติกไวท์จึงเหมาะสำหรับผู้ที่ต้องการสร้างบรรยากาศที่ดูหรูหราแบบย้อนยุคแต่ยังคงความแข็งแกร่งทนทานต่อการใช้งานหนักได้เป็นอย่างดี',
    rating:{price:3,durability:5,maintenance:4,modern:3,luxury:3},
    image:'https://siamtak.b-cdn.net/hero-product/659f63fa00f874b78b9d2d52_AT1.jpg?width=600&quality=80&format=webp' },
];

const INSPIRATION_CATEGORIES = [
  { key:"kitchen", icon:"🍳", name:"ห้องครัว", desc:"เคาน์เตอร์และท็อปครัวที่ต้องทนความร้อนและใช้งานหนัก" },
  { key:"bathroom", icon:"🛁", name:"ห้องน้ำ", desc:"พื้นผิวที่กันลื่นและทนความชื้นได้ดี" },
  { key:"livingroom", icon:"🛋️", name:"Living Room", desc:"ผนังหรือจุดโชว์ที่เน้นความสวยงามหรูหรา" },
  { key:"counter", icon:"🍽️", name:"Counter", desc:"เคาน์เตอร์บาร์หรือครัวที่ต้องการความทนทานสูง" },
  { key:"table", icon:"🪑", name:"โต๊ะ", desc:"หน้าโต๊ะที่ต้องการลวดลายโดดเด่นเป็นจุดเด่นของห้อง" },
  { key:"wall", icon:"🧱", name:"ผนัง", desc:"ผนังตกแต่งที่เน้นลวดลายและสีสันเป็นพิเศษ" },
  { key:"floor", icon:"⬜", name:"พื้น", desc:"พื้นที่ต้องทนทานต่อการเดินและรอยขีดข่วน" },
  { key:"outdoor", icon:"🌳", name:"Outdoor", desc:"พื้นที่ภายนอกที่ต้องทนแดดทนฝนได้ดี" },
];

let compareSelection = []; // array of stone ids, max 3
let currentPriceResult = null;

/* ---------- API CONFIG ---------- */
// ค่าว่าง = เรียก API แบบ relative path (ใช้ตอน main.py serve frontend+backend จาก server เดียวกัน)
// ถ้าแยก deploy frontend/backend คนละที่ ให้เปลี่ยนเป็น URL เต็มของ backend เช่น
// const API_BASE = "https://your-backend.onrender.com";
const API_BASE = "";

async function checkBackendStatus(){
  const dot = document.getElementById("backend-status-dot");
  const text = document.getElementById("backend-status-text");
  try{
    const res = await fetch(API_BASE + "/health", { signal: AbortSignal.timeout(4000) });
    if(res.ok){
      dot.className = "dot online";
      text.textContent = "backend เชื่อมต่อแล้ว";
    } else {
      throw new Error("not ok");
    }
  }catch(e){
    dot.className = "dot offline";
    text.textContent = "เชื่อมต่อ backend ไม่ได้ (รัน uvicorn main:app --reload ในโฟลเดอร์ backend)";
  }
}
checkBackendStatus();

/* ---------- 2. NAVIGATION ---------- */
const tabs = document.querySelectorAll(".tab");
const views = document.querySelectorAll(".view");

function goto(viewName){
  tabs.forEach(t=>t.classList.toggle("active", t.dataset.view === viewName));
  views.forEach(v=>v.classList.toggle("active", v.id === "view-" + viewName));
  window.scrollTo({top:0, behavior:"smooth"});
  if(viewName === "compare") renderCompare();
  if(viewName === "projects") renderProjects();
}
tabs.forEach(t=>t.addEventListener("click", ()=>goto(t.dataset.view)));
document.querySelectorAll(".feature-card").forEach(c=>{
  c.addEventListener("click", ()=>goto(c.dataset.goto));
});

function toast(message){
  const el = document.getElementById("footer-status");
  el.textContent = message;
  el.style.color = "var(--vein-gold-bright)";
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>{ el.textContent = "พร้อมใช้งาน"; el.style.color = ""; }, 2600);
}

/* ==========================================================
   3. INSPIRATION (home)
   ========================================================== */
const inspGrid = document.getElementById("insp-grid");
const inspDetail = document.getElementById("insp-detail");

inspGrid.innerHTML = INSPIRATION_CATEGORIES.map(c=>`
  <button class="insp-card" data-key="${c.key}">
    <div class="swatch" style="background:linear-gradient(135deg,var(--vein-gold),transparent)"></div>
    <span class="icon">${c.icon}</span>
    <div class="name">${c.name}</div>
  </button>
`).join("");

function showInspiration(key){
  document.querySelectorAll(".insp-card").forEach(c=>c.classList.toggle("active", c.dataset.key === key));
  const cat = INSPIRATION_CATEGORIES.find(c=>c.key===key);
  const stones = GRANITE_CATALOG.filter(s=>s.areas.includes(key));
  inspDetail.innerHTML = `
    <div class="insp-detail-inner">
      <h3>${cat.icon} ${cat.name}</h3>
      <p>${cat.desc}</p>
      <div class="insp-stones">
        ${stones.map(s=>`
          <div class="insp-stone-chip" onclick="goCatalogWithArea('${key}')">
            <span class="dot" style="background-image:url('${s.image}')"></span>
            <div>
              <div style="font-size:0.85rem;">${s.name}</div>
              <div style="font-size:0.72rem; color:var(--stone-gray);">฿${s.price.toLocaleString()}/ตร.ม.</div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
inspGrid.addEventListener("click", (e)=>{
  const card = e.target.closest(".insp-card");
  if(card) showInspiration(card.dataset.key);
});
showInspiration("kitchen");

function goCatalogWithArea(areaKey){
  goto("catalog");
  document.getElementById("f-area").value = areaKey;
  renderCatalog();
}
window.goCatalogWithArea = goCatalogWithArea;

/* ==========================================================
   4. CATALOG
   ========================================================== */
function renderCatalog(){
  const color = document.getElementById("f-color").value;
  const style = document.getElementById("f-style").value;
  const area = document.getElementById("f-area").value;
  const material = document.getElementById("f-material").value;
  const grid = document.getElementById("catalog-grid");

  const filtered = GRANITE_CATALOG.filter(s=>{
    if(color && s.color !== color) return false;
    if(style && !s.styles.includes(style)) return false;
    if(area && !s.areas.includes(area)) return false;
    if(material && s.material !== material) return false;
    return true;
  });

  grid.innerHTML = filtered.map(s=>`
    <div class="stone-card ${compareSelection.includes(s.id) ? 'selected' : ''}">
      <div class="stone-swatch" style="background-image:url('${s.image}')"></div>
      <div class="stone-body">
        <div>
          <span class="stone-tag">${COLOR_LABELS[s.color]}</span>
          <span class="stone-tag">${s.material === "marble" ? "หินอ่อน" : "หินแกรนิต"}</span>
          ${s.styles.map(st=>`<span class="stone-tag">${st}</span>`).join("")}
        </div>
        <h3 style="margin-top:0.5rem;">${s.name}</h3>
        <p class="stone-desc">${s.desc}</p>
        <div class="stone-meta"><b>ความแข็ง:</b> ${renderStars(s.rating.durability)} &nbsp; <b>ดูแลรักษาง่าย:</b> ${renderStars(s.rating.maintenance)}</div>
        <div class="stone-meta"><b>เหมาะกับ:</b> ${s.areas.map(a=>AREA_LABELS[a]).join(", ")}</div>
        <div class="stone-meta"><b>การใช้งาน:</b> ${s.indoor === "indoor" ? "ภายในอาคาร" : "ภายใน/ภายนอกอาคาร"}</div>
        <div class="stone-price">฿${s.price.toLocaleString()} / ตร.ม.</div>
        <div class="stone-actions">
          <label class="compare-check">
            <input type="checkbox" ${compareSelection.includes(s.id) ? "checked" : ""} onchange="toggleCompare('${s.id}', this.checked)">
            เลือกเปรียบเทียบ
          </label>
        </div>
        <div class="stone-actions" style="margin-top:0.6rem;">
          <button class="btn-small" onclick="goPriceWithStone('${s.id}')">คำนวณราคา</button>
          <button class="btn-small" onclick="addToActiveProject('granite','${s.name.replace(/'/g,"\\'")}', {stoneId:'${s.id}', price:${s.price}})">+ โปรเจกต์</button>
        </div>
      </div>
    </div>
  `).join("") || `<p class="history-empty">ไม่พบหินที่ตรงกับเงื่อนไขที่เลือก</p>`;
}
["f-color","f-style","f-area","f-material"].forEach(id=>{
  document.getElementById(id).addEventListener("change", renderCatalog);
});

function renderStars(n){
  let out = "<span class='stars'>";
  for(let i=0;i<5;i++) out += i < n ? "★" : "<span class='dim'>★</span>";
  out += "</span>";
  return out;
}

function toggleCompare(id, checked){
  if(checked){
    if(compareSelection.length >= 3){
      alert("เลือกเปรียบเทียบได้สูงสุด 3 ชนิด กรุณายกเลิกตัวเลือกอื่นก่อน");
      renderCatalog();
      return;
    }
    compareSelection.push(id);
  } else {
    compareSelection = compareSelection.filter(x=>x!==id);
  }
  renderCatalog();
}
window.toggleCompare = toggleCompare;

function goPriceWithStone(stoneId){
  goto("price");
  document.getElementById("price-stone-select").value = stoneId;
}
window.goPriceWithStone = goPriceWithStone;

/* ==========================================================
   5. COMPARE
   ========================================================== */
function renderCompare(){
  const empty = document.getElementById("compare-empty");
  const wrap = document.getElementById("compare-wrap");
  const stones = compareSelection.map(id=>GRANITE_CATALOG.find(s=>s.id===id)).filter(Boolean);

  if(stones.length < 2){
    empty.style.display = "block";
    wrap.style.display = "none";
    return;
  }
  empty.style.display = "none";
  wrap.style.display = "block";

  document.getElementById("compare-chips").innerHTML = stones.map(s=>`<span class="compare-chip">${s.name}</span>`).join("");

  const rows = [
    { label:"ประเภทหิน", render:s=>s.material === "marble" ? "หินอ่อน" : "หินแกรนิต" },
    { label:"ราคา/ตร.ม.", render:s=>`฿${s.price.toLocaleString()}` },
    { label:"ความคุ้มราคา", render:s=>renderStars(s.rating.price) },
    { label:"ความทนทาน", render:s=>renderStars(s.rating.durability) },
    { label:"ดูแลรักษาง่าย", render:s=>renderStars(s.rating.maintenance) },
    { label:"Modern", render:s=>renderStars(s.rating.modern) },
    { label:"Luxury", render:s=>renderStars(s.rating.luxury) },
  ];

  let html = "<thead><tr><th>Steps</th>" + stones.map(s=>`<th>${s.name}</th>`).join("") + "</tr></thead><tbody>";
  rows.forEach(r=>{
    html += `<tr><td>${r.label}</td>${stones.map(s=>`<td>${r.render(s)}</td>`).join("")}</tr>`;
  });
  html += "</tbody>";
  document.getElementById("compare-table").innerHTML = html;
}
document.getElementById("clear-compare").addEventListener("click", ()=>{
  compareSelection = [];
  renderCompare();
  renderCatalog();
});

/* ==========================================================
   6. AI DESIGN ADVISOR
   ========================================================== */
document.getElementById("advisor-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const area = fd.get("area");
  const budget = Number(fd.get("budget"));
  const style = fd.get("style");
  const color = fd.get("color");

  const scored = GRANITE_CATALOG.map(s=>{
    let score = 0;
    const reasons = [];
    if(s.areas.includes(area)){ score += 35; reasons.push(`เหมาะกับ${AREA_LABELS[area]}`); }
    if(s.styles.includes(style)){ score += 25; reasons.push(`ตรงสไตล์ ${style}`); }
    if(s.color === color){ score += 25; reasons.push(`สีตรงกับที่เลือก (${COLOR_LABELS[color]})`); }
    if(s.price <= budget){ score += 15; reasons.push("อยู่ในงบประมาณที่ตั้งไว้"); }
    else { score -= Math.min(15, Math.round((s.price-budget)/100)); reasons.push("ราคาสูงกว่างบที่ตั้งไว้เล็กน้อย"); }
    return {...s, score, reasons};
  }).sort((a,b)=>b.score - a.score).slice(0,3);

  const medals = ["🥇","🥈","🥉"];
  const resultEl = document.getElementById("advisor-result");
  resultEl.innerHTML = scored.map((s,i)=>`
    <div class="rec-card">
      <div class="rec-card-top">
        <div style="display:flex; align-items:center;">
          <span class="rec-rank">${medals[i]}</span>
          <div class="rec-info">
            <h4>${s.name}</h4>
            <span>${COLOR_LABELS[s.color]} · ${s.styles.join(" / ")} · ฿${s.price.toLocaleString()}/ตร.ม.</span>
          </div>
        </div>
        <span class="rec-score">คะแนนความเหมาะสม ${Math.max(0,s.score)}</span>
      </div>
      <p class="rec-reason">${s.reasons.join(" · ")}</p>
      <div class="rec-actions">
        <button class="btn-small" onclick="goPriceWithStone('${s.id}')">คำนวณราคา</button>
        <button class="btn-small" onclick="addToActiveProject('advisor','คำแนะนำ: ${s.name}', {stoneId:'${s.id}', area:'${area}', style:'${style}', color:'${color}', score:${s.score}})">+ โปรเจกต์</button>
      </div>
    </div>
  `).join("");
});

/* ==========================================================
   6b. AI CHAT (real backend — Gemini via /chat/completions/stream)
   ========================================================== */
const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
let chatHistory = []; // {role:"user"|"assistant", content:"..."}

function addMsg(text, who){
  const div = document.createElement("div");
  div.className = "msg " + who;
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

addMsg("สวัสดีครับ ผมเป็นผู้ช่วย AI ของ Granite Design Advisor (ขับเคลื่อนด้วย Gemini) ถามเรื่องหินแกรนิต/หินอ่อนในระบบได้เลยครับ", "bot");

async function sendChatMessage(userText){
  addMsg(userText, "user");
  chatHistory.push({ role:"user", content:userText });

  const botEl = addMsg("...", "bot");
  const submitBtn = chatForm.querySelector("button[type=submit]");
  submitBtn.disabled = true;

  try{
    const res = await fetch(API_BASE + "/chat/completions/stream", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ messages: chatHistory }),
    });

    if(!res.ok || !res.body){
      let detail = `เกิดข้อผิดพลาด (${res.status})`;
      try{ const body = await res.json(); detail = body.detail || detail; }catch(e){}
      throw new Error(detail);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let full = "";
    botEl.textContent = "";

    while(true){
      const { done, value } = await reader.read();
      if(done) break;
      buffer += decoder.decode(value, { stream:true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop(); // เก็บ chunk ที่ยังไม่ครบไว้รอบหน้า
      for(const part of parts){
        const line = part.trim();
        if(!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if(data === "[DONE]") continue;
        try{
          const parsed = JSON.parse(data);
          if(parsed.content){
            full += parsed.content;
            botEl.textContent = full;
            chatLog.scrollTop = chatLog.scrollHeight;
          }
        }catch(e){ /* ข้าม chunk ที่ parse ไม่ได้ */ }
      }
    }

    chatHistory.push({ role:"assistant", content: full || "(ไม่มีคำตอบ)" });
  }catch(err){
    botEl.textContent = "เชื่อมต่อ AI ไม่สำเร็จ: " + err.message +
      "\nตรวจสอบว่า backend รันอยู่ และตั้งค่า GEMINI_API_KEY ใน .env แล้ว";
    botEl.classList.add("bot-error");
    chatHistory.pop(); // ไม่นับข้อความที่ตอบไม่สำเร็จเป็นบทสนทนา
  }finally{
    submitBtn.disabled = false;
  }
}

chatForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const text = chatInput.value.trim();
  if(!text) return;
  chatInput.value = "";
  sendChatMessage(text);
});

/* ==========================================================
   7. PRICE ESTIMATOR
   ========================================================== */
const priceStoneSelect = document.getElementById("price-stone-select");
priceStoneSelect.innerHTML = GRANITE_CATALOG.map(s=>`<option value="${s.id}">${s.name} (฿${s.price.toLocaleString()}/ตร.ม.)</option>`).join("");

document.getElementById("price-form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const fd = new FormData(e.target);
  const stone = GRANITE_CATALOG.find(s=>s.id === fd.get("stoneId"));
  const width = Number(fd.get("width"));
  const length = Number(fd.get("length"));
  const finishMultiplier = Number(fd.get("finish"));
  const installRate = Number(fd.get("install"));

  const resultEl = document.getElementById("price-result");
  resultEl.innerHTML = `<p class="history-empty">กำลังตรวจสอบราคาล่าสุดจาก backend...</p>`;

  let area, basePricePerSqm;
  try{
    const res = await fetch(API_BASE + "/estimate/calculate", {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ width_m: width, length_m: length, stone_type: stone.name }),
    });
    if(!res.ok){
      let detail = `เกิดข้อผิดพลาด (${res.status})`;
      try{ const body = await res.json(); detail = body.detail || detail; }catch(e){}
      throw new Error(detail);
    }
    const data = await res.json();
    area = data.area_sqm;
    basePricePerSqm = data.price_per_sqm; // ราคาจริงจาก backend (อ่านจาก CSV ล่าสุด) ไม่ใช่ค่าที่ hardcode ไว้ใน frontend
  }catch(err){
    resultEl.innerHTML = `
      <div class="price-breakdown" style="border-color:var(--warn);">
        <p style="color:var(--warn);">เชื่อมต่อระบบคำนวณราคาไม่สำเร็จ: ${err.message}</p>
        <p style="color:var(--stone-gray); font-size:0.85rem; margin-top:0.6rem;">
          ตรวจสอบว่า backend รันอยู่ (uvicorn main:app --reload ในโฟลเดอร์ backend) และมีข้อมูล CSV แล้ว
        </p>
      </div>`;
    return;
  }

  const materialCost = basePricePerSqm * finishMultiplier * area;
  const installCost = installRate * area;
  const subtotal = materialCost + installCost;
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  currentPriceResult = { stone, width, length, area, basePricePerSqm, finishMultiplier, installRate, materialCost, installCost, subtotal, vat, total };

  resultEl.innerHTML = `
    <div class="price-breakdown">
      <div class="row"><span>หิน</span><span>${stone.name}</span></div>
      <div class="row"><span>ราคา/ตร.ม. (จาก backend real-time)</span><span>฿${basePricePerSqm.toLocaleString()}</span></div>
      <div class="row"><span>พื้นที่</span><span>${width} × ${length} ม. = ${area.toFixed(2)} ตร.ม.</span></div>
      <div class="row"><span>ค่าวัสดุ (รวมผิวสัมผัส)</span><span>฿${materialCost.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
      <div class="row"><span>ค่าติดตั้ง</span><span>฿${installCost.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
      <div class="row"><span>รวมก่อน VAT</span><span>฿${subtotal.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
      <div class="row"><span>VAT 7%</span><span>฿${vat.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
      <div class="row total"><span>ราคารวมโดยประมาณ</span><span>฿${total.toLocaleString(undefined,{maximumFractionDigits:0})}</span></div>
    </div>
    <div class="price-actions">
      <button class="btn-primary" onclick="addToActiveProject('price','${stone.name} ${area.toFixed(1)} ตร.ม. รวม ฿${Math.round(total).toLocaleString()}', currentPriceResult)">+ เพิ่มในโปรเจกต์</button>
      <button class="btn-ghost" onclick="exportPricePDF()">Export PDF</button>
    </div>
  `;
});

function exportPricePDF(){
  if(!currentPriceResult) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const q = currentPriceResult;
  doc.setFontSize(16);
  doc.text("Granite Design Advisor", 14, 18);
  doc.setFontSize(11);
  doc.text("ใบประมาณราคา — " + new Date().toLocaleString("th-TH"), 14, 28);
  doc.line(14, 32, 196, 32);
  let y = 42;
  const rows = [
    ["หิน", q.stone.name],
    ["พื้นที่", q.width + " x " + q.length + " ม. = " + q.area.toFixed(2) + " ตร.ม."],
    ["ค่าวัสดุ", "฿" + Math.round(q.materialCost).toLocaleString()],
    ["ค่าติดตั้ง", "฿" + Math.round(q.installCost).toLocaleString()],
    ["VAT 7%", "฿" + Math.round(q.vat).toLocaleString()],
    ["รวมทั้งสิ้น", "฿" + Math.round(q.total).toLocaleString()],
  ];
  doc.setFontSize(10);
  rows.forEach(r=>{ doc.text(r[0], 14, y); doc.text(r[1], 100, y); y += 8; });
  doc.save("price-estimate.pdf");
}
window.exportPricePDF = exportPricePDF;

/* ==========================================================
   8. PROJECTS / FAVORITES (localStorage)
   ========================================================== */
const PROJECTS_KEY = "gda_projects";
const ACTIVE_PROJECT_KEY = "gda_active_project";

function loadProjects(){
  try{ return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || []; }catch(e){ return []; }
}
function saveProjects(list){ localStorage.setItem(PROJECTS_KEY, JSON.stringify(list)); }
function getActiveProjectId(){ return localStorage.getItem(ACTIVE_PROJECT_KEY); }
function setActiveProjectId(id){ localStorage.setItem(ACTIVE_PROJECT_KEY, id); renderProjects(); }

function addToActiveProject(kind, title, detail){
  let activeId = getActiveProjectId();
  let projects = loadProjects();
  if(!activeId || !projects.find(p=>p.id===activeId)){
    alert('ยังไม่ได้เลือกโปรเจกต์ครับ — ไปที่เมนู "โปรเจกต์ของฉัน" เพื่อสร้างหรือเลือกโปรเจกต์ก่อน');
    goto("projects");
    return;
  }
  const project = projects.find(p=>p.id===activeId);
  project.items.unshift({
    id:"i"+Date.now(), kind, title, detail,
    date:new Date().toLocaleString("th-TH")
  });
  saveProjects(projects);
  toast(`บันทึกลงโปรเจกต์ "${project.name}" แล้ว`);
  renderProjects();
}
window.addToActiveProject = addToActiveProject;

document.getElementById("new-project-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const input = document.getElementById("new-project-name");
  const name = input.value.trim();
  if(!name) return;
  const projects = loadProjects();
  const project = { id:"p"+Date.now(), name, createdAt:new Date().toLocaleDateString("th-TH"), items:[] };
  projects.unshift(project);
  saveProjects(projects);
  setActiveProjectId(project.id);
  input.value = "";
});

function deleteProject(id){
  if(!confirm("ต้องการลบโปรเจกต์นี้หรือไม่? รายการทั้งหมดในโปรเจกต์จะถูกลบไปด้วย")) return;
  let projects = loadProjects().filter(p=>p.id!==id);
  saveProjects(projects);
  if(getActiveProjectId() === id){
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
  }
  renderProjects();
}
window.deleteProject = deleteProject;

function deleteProjectItem(projectId, itemId){
  let projects = loadProjects();
  const project = projects.find(p=>p.id===projectId);
  if(!project) return;
  project.items = project.items.filter(i=>i.id!==itemId);
  saveProjects(projects);
  renderProjects();
}
window.deleteProjectItem = deleteProjectItem;

function exportProjectPDF(projectId){
  const project = loadProjects().find(p=>p.id===projectId);
  if(!project) return;
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Granite Design Advisor", 14, 18);
  doc.setFontSize(12);
  doc.text("โปรเจกต์: " + project.name, 14, 28);
  doc.setFontSize(9);
  doc.text("สร้างเมื่อ " + project.createdAt, 14, 34);
  doc.line(14, 38, 196, 38);
  let y = 48;
  if(project.items.length === 0){
    doc.setFontSize(10);
    doc.text("ยังไม่มีรายการในโปรเจกต์นี้", 14, y);
  }
  project.items.forEach(item=>{
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text("[" + item.kind + "] " + item.date, 14, y);
    y += 5;
    doc.setFontSize(11);
    doc.setTextColor(20);
    const lines = doc.splitTextToSize(item.title, 180);
    doc.text(lines, 14, y);
    y += lines.length * 6 + 4;
    if(y > 275){ doc.addPage(); y = 20; }
  });
  doc.save(project.name.replace(/\s+/g,"_") + ".pdf");
}
window.exportProjectPDF = exportProjectPDF;

const KIND_LABEL = { granite:"หิน", price:"ราคา", advisor:"AI แนะนำ", inspiration:"Inspiration" };

function renderProjects(){
  const projects = loadProjects();
  const activeId = getActiveProjectId();
  const note = document.getElementById("active-project-note");

  if(projects.length === 0){
    note.innerHTML = "ยังไม่มีโปรเจกต์ — สร้างโปรเจกต์แรกของคุณด้านบนได้เลยครับ";
  } else {
    const active = projects.find(p=>p.id===activeId);
    note.innerHTML = active
      ? `โปรเจกต์ปัจจุบัน: <b>${active.name}</b> — ปุ่ม "+ โปรเจกต์" ทั่วเว็บจะบันทึกเข้าที่นี่`
      : `ยังไม่ได้เลือกโปรเจกต์ปัจจุบัน — กด "ตั้งเป็นโปรเจกต์ปัจจุบัน" ที่การ์ดด้านล่างก่อนเริ่มบันทึกรายการ`;
  }

  document.getElementById("project-list").innerHTML = projects.map(p=>`
    <div class="project-card ${p.id===activeId ? 'active' : ''}">
      <div class="project-head">
        <div>
          <h3>${p.name} ${p.id===activeId ? '⭐' : ''}</h3>
          <div class="meta">สร้างเมื่อ ${p.createdAt} · ${p.items.length} รายการ</div>
        </div>
        <div class="project-actions">
          ${p.id!==activeId ? `<button class="btn-small" onclick="setActiveProjectId('${p.id}')">ตั้งเป็นโปรเจกต์ปัจจุบัน</button>` : ""}
          <button class="btn-small" onclick="exportProjectPDF('${p.id}')">Export PDF</button>
          <button class="btn-small" onclick="deleteProject('${p.id}')">ลบโปรเจกต์</button>
        </div>
      </div>
      <div class="project-items">
        ${p.items.length === 0 ? '<p class="project-empty">ยังไม่มีรายการ — ลองกด "+ โปรเจกต์" จากแคตตาล็อกหรือ AI Advisor</p>' : p.items.map(item=>`
          <div class="project-item">
            <div><span class="kind">${KIND_LABEL[item.kind] || item.kind}</span>${item.title} <span style="color:var(--stone-gray); font-size:0.75rem;"> · ${item.date}</span></div>
            <button class="btn-small" onclick="deleteProjectItem('${p.id}','${item.id}')">ลบ</button>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");
}
window.setActiveProjectId = setActiveProjectId;

/* ==========================================================
   9. BACKGROUND MUSIC
   ========================================================== */
const bgMusic = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
bgMusic.volume = 0.35;

function setMusicUI(playing){
  musicToggle.classList.toggle("playing", playing);
  musicIcon.textContent = playing ? "🔊" : "🔇";
  musicToggle.title = playing ? "ปิดเพลงพื้นหลัง" : "เปิดเพลงพื้นหลัง";
}
function tryAutoplay(){
  bgMusic.play().then(()=>setMusicUI(true)).catch(()=>{
    setMusicUI(false);
    const startOnFirstClick = ()=>{
      bgMusic.play().then(()=>setMusicUI(true)).catch(()=>{});
      document.removeEventListener("click", startOnFirstClick);
    };
    document.addEventListener("click", startOnFirstClick, { once:true });
  });
}
tryAutoplay();
musicToggle.addEventListener("click", ()=>{
  if(bgMusic.paused){ bgMusic.play().then(()=>setMusicUI(true)).catch(()=>{}); }
  else { bgMusic.pause(); setMusicUI(false); }
});

/* ---------- INIT ---------- */
renderCatalog();
renderProjects();
