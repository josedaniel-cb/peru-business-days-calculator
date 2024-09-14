const app = Vue.createApp({
  data() {
    return {
      dateRange: [],
      businessDays: "",
      loading: false,
      pyodideInstance: null,
    };
  },
  async mounted() {
    // Cargar Pyodide al montar el componente
    this.loading = true;
    this.pyodideInstance = await this.loadPyodideAndPackages();
    this.loading = false; // Desactivar el spinner una vez Pyodide esté listo
  },
  methods: {
    async loadPyodideAndPackages() {
      // Asegurarnos de que Pyodide está disponible antes de usarlo
      if (typeof loadPyodide === "undefined") {
        throw new Error("Pyodide no está disponible.");
      }

      // Cargar Pyodide y los paquetes necesarios
      let pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
      });
      await pyodide.loadPackage("micropip");
      await pyodide.runPythonAsync(`
              from datetime import datetime, timedelta
  
              # Definir los feriados
              feriados = [
                  "01/01/2024","02/01/2024","28/03/2024","29/03/2024","01/05/2024","29/06/2024","07/06/2024","23/07/2024","26/07/2024","28/07/2024",
                  "29/07/2024","06/08/2024","30/08/2024","07/10/2024","07/10/2024","08/10/2024","01/11/2024","06/12/2024","08/12/2024","09/12/2024",
                  "23/12/2024","24/12/2024","25/12/2024","30/12/2024","31/12/2024","01/01/2023","02/01/2023","06/04/2023","07/04/2023","01/05/2023",
                  "29/06/2023","30/06/2023","06/08/2023","23/07/2023","27/07/2023","28/07/2023","29/07/2023","30/08/2023","08/10/2023","09/10/2023",
                  "01/11/2023","07/12/2023","08/12/2023","09/12/2023","25/12/2023","26/12/2023"
              ]
  
              # Convertir los feriados al formato datetime
              feriados = [datetime.strptime(date, "%d/%m/%Y") for date in feriados]
  
              # Función para calcular días hábiles
              def calcular_dias_habiles(fecha_inicio, fecha_fin, feriados):
                  dias_habiles = 0
                  fecha_actual = fecha_inicio
  
                  while fecha_actual <= fecha_fin:
                      # Verificar si no es fin de semana y no es feriado
                      if fecha_actual.weekday() < 5 and fecha_actual not in feriados:
                          dias_habiles += 1
                      fecha_actual += timedelta(days=1)
  
                  return dias_habiles
            `);
      return pyodide;
    },
    async calcularDiasHabiles(startDate, endDate) {
      if (!this.pyodideInstance) return null;

      if (startDate && endDate) {
        // Remove the time component from the date strings
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        let result = await this.pyodideInstance.runPythonAsync(`
                from datetime import datetime, timedelta

                fecha_inicio = datetime.strptime("${formattedStartDate}", "%Y-%m-%d") + timedelta(days=1)
                fecha_fin = datetime.strptime("${formattedEndDate}", "%Y-%m-%d")
                dias_habiles = calcular_dias_habiles(fecha_inicio, fecha_fin, feriados)
                dias_habiles
              `);
        return result;
      }
      return null;
    },
    async handleInput() {
      console.log("Date range changed:", this.dateRange);
      // if (this.dateRange && this.dateRange.length === 2) {
      if (this.dateRange.length > 0) {
        const startDate = this.dateRange[0];
        const endDate = this.dateRange[this.dateRange.length - 1];

        this.loading = true; // Mostrar spinner durante el cálculo
        const result = await this.calcularDiasHabiles(startDate, endDate);
        this.businessDays = result;
        this.loading = false; // Ocultar spinner al terminar
      }
    },
  },
});

app.use(
  Vuetify.createVuetify({
    theme: {
      themes: {
        light: {
          primary: "#4CAF50", // Verde SERFOR
          secondary: "#388E3C", // Un verde oscuro complementario
        },
      },
    },
    // Añadir configuración de internacionalización
    locale: {
      defaultLocale: "es",
      messages: {
        es: {
          dataIterator: {
            rowsPerPageText: "Filas por página:",
            pageText: "{0}-{1} de {2}",
            noResultsText: "No se encontraron registros que coincidan",
            nextPage: "Página siguiente",
            prevPage: "Página anterior",
          },
          datePicker: {
            itemsSelected: "{0} seleccionados",
          },
        },
      },
    },
  })
);

app.mount("#app");
