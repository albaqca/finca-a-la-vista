/* Ficha y fotos aportadas para la casa campestre de Tocancipá. */
(()=>{
  const seed={
    id:'tocancipa-casa-campestre',
    name:'Casa campestre · Tocancipá',
    location:'Tocancipá, Cundinamarca · confirmar predio con el pin y la matrícula',
    url:'',
    mapUrl:'https://maps.app.goo.gl/cMegpT2eWJFmQUsb9',
    contact:'Sabana Norte Propiedades · 324 290 0901',
    asking:480000000,
    land:1575,
    built:146,
    visitDate:'2026-11-01',
    offer:'',targetLow:'',targetHigh:'',maxPrice:'',contingency:15,
    age:'Aproximadamente 10 años, según la visita; verificar con documentos',
    travel:'',
    firstNotes:'Visita realizada el 1 de noviembre de 2026. Según la visita: buena ubicación, lote de buen tamaño y casa espaciosa. La cocina requiere remodelación; la alcoba del segundo piso requiere remodelación y se evaluó habilitarle un baño para adecuarla como habitación principal. Antigüedad aproximada: 10 años; confirmar con soportes.',
    sellerAnswers:'Visita realizada el 1 de noviembre de 2026: buena ubicación, lote amplio y casa espaciosa. Cocina por remodelar. La alcoba del segundo piso requiere remodelación y se quiere evaluar un baño privado para convertirla en habitación principal. Pendiente: confirmar dimensiones y distribución con planos, alcance de licencia, redes hidráulicas/sanitarias, ventilación y cotizaciones.',
    negotiationNotes:'Precio anunciado: $480.000.000 (≈ $304.762/m² de terreno, división del precio por el área anunciada; no es avalúo). La visita identificó remodelación de cocina y adecuación de la alcoba del segundo piso con posible baño. No se fijan oferta ni máximo sin cotizaciones, documentos y comparables. Cotizar por separado cocina, acabados de la alcoba, baño nuevo y conexión de redes; sumar contingencia solo sobre costos estimados.',
    summary:'Visitada el 1 de noviembre: buena ubicación, lote amplio y casa espaciosa. Cocina y alcoba del segundo piso requieren remodelación.',
    factsTitle:'Aviso y visita',
    factStatus:'Aviso y observaciones; soportes pendientes',
    factCards:[
      {value:'1.575 m²',label:'terreno anunciado; contrastar con escritura y catastro'},
      {value:'146 m²',label:'construidos según el aviso; verificar planos y documentos'},
      {value:'$480 millones',label:'precio publicado; confirmar vigencia y condiciones'},
      {value:'≈ $304.762/m²',label:'precio dividido por área de terreno; no es avalúo'},
      {value:'3 hab. + auxiliar',label:'distribución anunciada; confirmar en planos'},
      {value:'3 baños',label:'dato del aviso; confirmar estado y distribución'},
      {value:'Agua, gas y alcantarillado',label:'servicios anunciados; comprobar conexión y facturas'},
      {value:'≈ 10 años',label:'antigüedad informada en visita; documentar'}
    ],
    heroWarning:'En la visita reportaron buena ubicación, lote amplio y casa espaciosa. La cocina requiere remodelación y la alcoba del segundo piso necesita adecuación; el baño adicional es una posibilidad por estudiar. Cotizar las obras y comprobar documentos y redes antes de definir una oferta.',
    visitGuide:'Visita realizada el 1 de noviembre de 2026. Observaciones recibidas: buena ubicación, buen tamaño del lote y casa espaciosa. Cocina por remodelar; evaluar remodelación de la alcoba del segundo piso y viabilidad de instalar baño para convertirla en habitación principal. Quedan por revisar documentos, estado técnico y costos.',
    documentReviews:[{
      title:'Aviso y observaciones de la visita · información aportada por ustedes',
      status:'Soportes documentales pendientes',
      summary:'El aviso anuncia 1.575 m² de terreno, 146 m² construidos, 3 habitaciones más cuarto auxiliar, 3 baños, altillo con balcón, parqueo para 2–3 vehículos y agua veredal, gas natural y alcantarillado. La visita del 1 de noviembre reportó buena ubicación, lote amplio, casa espaciosa, cocina por remodelar y alcoba del segundo piso por adecuar. No se han agregado escritura, certificado, planos, licencia ni facturas de servicios.'
    }],
    buildabilityNote:'Antes de proyectar un baño en la alcoba del segundo piso, revisar planos y licencia vigentes, estructura, bajantes, ventilación y capacidad de las redes. Pedir concepto de un profesional y cotización que incluya instalaciones, acabados y permisos aplicables. Verificar además que los 146 m² construidos y la distribución coincidan con los documentos.',
    checks:{},ratings:{},ratingsByPerson:{a:{},b:{}},opinionChecks:{a:{},b:{}},ratingScaleVersion:2,repairs:{},photos:{},decision:''
  };
  const model=window.appModel;
  if(!model)return;
  const copy=()=>JSON.parse(JSON.stringify(seed));
  const oldSeeds=model.getSeedProfiles.bind(model);
  model.getSeedProfiles=()=>[...oldSeeds(),copy()];
  const db=model.getDb();
  if(!Array.isArray(db.properties))db.properties=[];
  if(!db.properties.some(p=>p.id===seed.id))db.properties.push(copy());
  model.setDb(db);

  const photos=[
    {group:'Exterior, lote y acceso',items:[
      ['tocancipa-fachada-amplia.jpg','Fachada y jardín frontal'],
      ['tocancipa-jardin.jpg','Jardín y entorno'],
      ['tocancipa-acceso.jpg','Acceso y vía en placa huella'],
      ['tocancipa-jardin-casa.jpg','Jardín y costado de la casa'],
      ['tocancipa-fachada.jpg','Vista frontal de la vivienda']
    ]},
    {group:'Sala, comedor y porche',items:[
      ['tocancipa-comedor-cocina.jpg','Sala/comedor con cocina al fondo; revisar remodelación mencionada'],
      ['tocancipa-ventanal.jpg','Ventanal y corredor exterior'],
      ['tocancipa-sala.jpg','Sala-comedor y vista al jardín'],
      ['tocancipa-porche.jpg','Corredor cubierto y baranda']
    ]},
    {group:'Circulación y alcoba',items:[
      ['tocancipa-pasillo.jpg','Pasillo interior'],
      ['tocancipa-alcoba.jpg','Alcoba fotografiada; confirmar si corresponde al segundo piso']
    ]}
  ];
  const photoInput=document.getElementById('photos');
  if(photoInput&&!document.getElementById('listingGalleryTocancipa')){
    const gallery=document.createElement('div');
    gallery.id='listingGalleryTocancipa';
    gallery.className='listing-gallery hide';
    gallery.setAttribute('aria-label','Fotos aportadas para la casa campestre de Tocancipá');
    gallery.innerHTML='<div class="checklist-title">Fotos aportadas · casa campestre de Tocancipá</div><p class="sub">Las agrupé según lo que se ve en cada imagen. La foto del pasillo y la alcoba no identifica por sí sola el piso; confirmen los espacios durante el siguiente recorrido. Son fotos que ustedes compartieron, no imágenes ilustrativas.</p>';
    for(const section of photos){
      const heading=document.createElement('div');heading.className='checklist-title';heading.textContent=section.group;gallery.appendChild(heading);
      const grid=document.createElement('div');grid.className='listing-photo-grid';
      for(const [src,caption] of section.items){
        const figure=document.createElement('figure');figure.className='listing-photo';
        const img=document.createElement('img');img.src=src;img.alt=caption+' · foto aportada';img.loading='lazy';img.decoding='async';
        const cap=document.createElement('figcaption');cap.textContent=caption;
        figure.append(img,cap);grid.appendChild(figure);
      }
      gallery.appendChild(grid);
    }
    photoInput.parentElement.insertBefore(gallery,photoInput);
    const updateGallery=()=>{
      const selected=document.getElementById('propertySelect').value;
      gallery.classList.toggle('hide',selected!==seed.id);
      const active=model.getDb().properties.find(p=>p.id===selected);
      if(active)document.title=(active.name||'Ficha de visita')+' · Finca a la vista';
    };
    document.getElementById('propertySelect').addEventListener('change',updateGallery);
    updateGallery();
  }
  model.save();
})();
