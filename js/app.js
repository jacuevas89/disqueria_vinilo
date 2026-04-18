

const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const titulo = ref("🎵 La Ruta del Vinilo 🎵");
    const discos = ref([]);
    const cargando = ref(false);
    const error = ref(null);
    const categoria = ref("todos");
    const busqueda = ref("");

async function cargarDiscos() {
  try {
    cargando.value = true;
    error.value = null;

    const inicio = Date.now();

    const respuesta = await fetch("data/discos.json");

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    discos.value = datos;

    const tiempoTranscurrido = Date.now() - inicio;
    const tiempoMinimo = 2000; // Esperar al menos 2 segundos para mostrar el mensaje de carga

    if (tiempoTranscurrido < tiempoMinimo) {
      await new Promise((resolve) =>
        setTimeout(resolve, tiempoMinimo - tiempoTranscurrido)
      );
    }
  } catch (err) {
    console.error(err);
    error.value = "No se pudo cargar el catálogo. Intenta de nuevo.";
  } finally {
    cargando.value = false;
  }
}

    const discosFiltrados = computed(() => {
      const termino = busqueda.value.toLowerCase().trim();

      return discos.value.filter((disco) => {
        const coincideCategoria =
          categoria.value === "todos" || disco.genero === categoria.value;

        const coincideBusqueda =
          disco.album.toLowerCase().includes(termino) ||
          disco.artista.toLowerCase().includes(termino);

        return coincideCategoria && coincideBusqueda;
      });
    });

    onMounted(() => {
      cargarDiscos();
    });

    return {
      titulo,
      discos,
      cargando,
      error,
      categoria,
      busqueda,
      discosFiltrados,
      cargarDiscos,
    };
  },
}).mount("#app");





// Respaldo

/*const { createApp, ref, onMounted } = Vue;
createApp({
    setup() {
 const titulo = ref('🎵Disquería de Vinilo');
 const discos = ref([]);
 const categoriaActiva = ref('todos');
 // AJAX: carga el catálogo desde el JSON
 async function cargarDiscos() {
 const respuesta = await fetch('data/discos.json');
 const datos = await respuesta.json();
 discos.value = datos;
 }

 onMounted(() => {
 cargarDiscos(); // Se ejecuta cuando Vue termina de montar
 });
 return { titulo, discos, categoriaActiva, cargarDiscos };
 }
}).mount('#app');*/