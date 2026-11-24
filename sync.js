/* Sincronización privada de Finca a la vista: requiere Firebase Auth + Firestore. */
(()=>{
  const config={
    apiKey:"AIzaSyDjEWMB5uhxHDiefDn41_QmaNSTMrcw0p4",
    authDomain:"vivienda-65b10.firebaseapp.com",
    projectId:"vivienda-65b10",
    appId:"1:629460265188:web:c95d95e8eb480ebae624f1"
  };
  const model=window.appModel;
  const button=document.getElementById('syncButton');
  const KEY='finca-a-la-vista-v1';
  const photoCache=new Map();
  const propertyCache=new Map();
  let auth=null,store=null,activeUid=null,unsubscribe=null,timer=null,busy=false,lastError='';
  const status=(s)=>model.setSyncStatus(s);
  const serialized=(x)=>JSON.stringify(x);
  const storageKey=(p,k)=>p+'::'+k;
  const configReady=()=>!Object.values(config).some(v=>String(v).includes('REEMPLAZAR'));
  function setLocal(data){try{localStorage.setItem(KEY,JSON.stringify(data));return true}catch(e){return false}}
  function propertyWithoutPhotos(p){const x={...p};delete x.photos;return x}
  function applyDb(data){window.__syncApplying=true;try{model.setDb(data);setLocal(data)}finally{window.__syncApplying=false}}
  async function readCloud(uid){
    const root=store.collection('users').doc(uid);
    const meta=await root.collection('state').doc('main').get();
    if(!meta.exists)return null;
    const md=meta.data()||{};
    const propsSnap=await root.collection('properties').get();
    const props=[];
    photoCache.clear();propertyCache.clear();
    for(const doc of propsSnap.docs){
      const p=doc.data()||{};p.id=doc.id;p.photos={};
      const pics=await root.collection('properties').doc(doc.id).collection('photos').get();
      for(const pic of pics.docs){const d=pic.data()||{};if(d.data){p.photos[pic.id]=d.data;photoCache.set(storageKey(doc.id,pic.id),d.data)}}
      propertyCache.set(doc.id,serialized(propertyWithoutPhotos(p)));
      props.push(p);
    }
    return {active:props.some(p=>p.id===md.active)?md.active:(props[0]?.id||''),properties:props,updatedAt:Number(md.updatedAt)||0};
  }
  async function writeCloud(){
    if(!activeUid||busy)return false;
    busy=true;
    try{
      const local=model.getDb(),root=store.collection('users').doc(activeUid);
      const batch=store.batch();
      const keepProps=new Set();let writes=0;
      for(const p of local.properties||[]){
        const pid=String(p.id);keepProps.add(pid);
        const plain=propertyWithoutPhotos(p),encoded=serialized(plain),ref=root.collection('properties').doc(pid);
        if(propertyCache.get(pid)!==encoded){batch.set(ref,plain);propertyCache.set(pid,encoded);writes++}
        const photos=p.photos||{};const keys=new Set(Object.keys(photos));
        for(const [cacheKey] of [...photoCache.entries()]){
          const prefix=pid+'::';
          if(cacheKey.startsWith(prefix)&&!keys.has(cacheKey.slice(prefix.length))){batch.delete(ref.collection('photos').doc(cacheKey.slice(prefix.length)));photoCache.delete(cacheKey);writes++}
        }
        for(const [key,data] of Object.entries(photos)){
          if(typeof data==='string'&&data.length>900000)throw new Error('Una foto supera el tamaño admitido por Firebase. Toma otra con menor resolución.');
          const k=storageKey(pid,key);
          if(photoCache.get(k)!==data){batch.set(ref.collection('photos').doc(String(key)),{data});photoCache.set(k,data);writes++}
        }
      }
      const metaRef=root.collection('state').doc('main');
      batch.set(metaRef,{active:local.active||'',updatedAt:Number(local.updatedAt)||Date.now(),propertyIds:[...keepProps]});writes++;
      if(writes>450)throw new Error('Hay demasiadas fotos o fichas en una sola sincronización. Exporta una copia y reduce las fotos.');
      await batch.commit();
      status('Sincronizado con Google · '+(auth.currentUser?.email||''));
      document.getElementById('saveStatus').textContent='Guardado en este dispositivo y en Google';
      lastError='';
      return true;
    }catch(e){
      photoCache.clear();propertyCache.clear();
      lastError=e.message||String(e);status('No se pudo sincronizar: '+lastError);console.error('Firebase sync error',e);
      if(['unavailable','deadline-exceeded','network-request-failed'].includes(e.code))setTimeout(()=>{if(activeUid===auth.currentUser?.uid)writeCloud()},8000);
      return false;
    }
    finally{busy=false}
  }
  function schedule(){if(!activeUid)return;clearTimeout(timer);timer=setTimeout(writeCloud,900)}
  window.scheduleCloudSync=schedule;
  async function receiveSnapshot(snap){
    if(!snap.exists)return;
    const remoteTime=Number(snap.data()?.updatedAt)||0;
    const localTime=Number(model.getDb().updatedAt)||0;
    if(remoteTime>localTime){
      try{const remote=await readCloud(activeUid);if(remote&&remote.updatedAt>Number(model.getDb().updatedAt||0)){applyDb(remote);status('Cambios recibidos de Google · '+(auth.currentUser?.email||''))}}
      catch(e){status('No pude cargar los cambios de Google: '+(e.message||e))}
    }
  }
  async function connectUser(user){
    if(unsubscribe){unsubscribe();unsubscribe=null}
    activeUid=user.uid;
    status('Conectando con '+(user.email||'tu cuenta de Google')+'…');
    try{
      const local=model.getDb(),remote=await readCloud(user.uid);
      let synced=true;
      if(remote&&remote.properties.length){
        if(Number(remote.updatedAt)>=Number(local.updatedAt||0)){applyDb(remote)}
        else synced=await writeCloud();
      }else synced=await writeCloud();
      const meta=store.collection('users').doc(user.uid).collection('state').doc('main');
      unsubscribe=meta.onSnapshot(receiveSnapshot,e=>status('Sincronización interrumpida: '+(e.message||e)));
      if(synced)status('Sincronizado con Google · '+(user.email||''));
    }catch(e){activeUid=user.uid;status('No se pudo conectar: '+(e.message||e));console.error('Firebase setup error',e)}
  }
  function niceError(e){
    const code=e?.code||'';
    if(code.includes('unauthorized-domain'))return 'Google bloqueó este sitio. Añade albaqca.github.io en dominios autorizados.';
    if(code.includes('operation-not-allowed'))return 'Activa el acceso con Google en Firebase Authentication.';
    if(code.includes('permission-denied'))return 'Revisa las reglas privadas de Firestore.';
    if(code.includes('popup-blocked'))return 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes y prueba de nuevo.';
    return e?.message||'Error de conexión.';
  }
  button.onclick=async()=>{
    if(!auth){status('Firebase todavía no está configurado.');return}
    if(auth.currentUser){if(confirm('¿Cerrar sesión? La copia guardada en este dispositivo se conserva.')){await auth.signOut();status('Sesión cerrada · la copia local sigue disponible')}return}
    const provider=new firebase.auth.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});
    const mobile=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if(mobile){try{await auth.signInWithRedirect(provider)}catch(e){status(niceError(e))}return}
    try{await auth.signInWithPopup(provider)}catch(e){
      if(e.code==='auth/popup-blocked'||e.code==='auth/popup-closed-by-user'){
        try{await auth.signInWithRedirect(provider)}catch(err){status(niceError(err))}
      }else status(niceError(e));
    }
  };
  if(!configReady()){
    status('Respaldo local activo · Firebase espera la configuración del proyecto.');
    return;
  }
  try{
    if(!firebase.apps.length)firebase.initializeApp(config);
    auth=firebase.auth();store=firebase.firestore();
    auth.getRedirectResult().catch(e=>status(niceError(e)));
    auth.onAuthStateChanged(user=>{
      if(user){button.textContent='Cerrar sesión Google';connectUser(user)}
      else{if(unsubscribe){unsubscribe();unsubscribe=null}activeUid=null;button.textContent='Conectar Google';status('Sin sesión · cambios guardados en este navegador. Conecta la misma cuenta en cada dispositivo.')}
    });
  }catch(e){status('Error al iniciar Firebase: '+niceError(e));console.error(e)}
})();

