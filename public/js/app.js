const { createApp, nextTick } = Vue;

const app = createApp({
  data() {
    return {
      form: {
        travelStyle: "",
        travelFrequency: "",
        dreamContinent: "",
        budgetRange: ""
      },
      loading: false,
      message: "",
      messageClass: "text-success",

      responses: [],
      searchQuery: "",
      searchTimer: null,

      page: 1,
      perPage: 8,
      total: 0,

      pieChart: null,
      barChart: null,
      budgetChart: null,
      mapRoot: null
    };
  },

  computed: {
    totalPages() {
      return Math.max(Math.ceil(this.total / this.perPage), 1);
    }
  },

  methods: {
    async submitSurvey() {
      try {
        this.loading = true;
        this.message = "";

        const { data } = await axios.post("/api/submit", this.form);

        if (!data.success) {
          throw new Error(data.message || "Submission failed.");
        }

        this.message = data.message || "Survey submitted successfully.";
        this.messageClass = "text-success";

        this.form = {
          travelStyle: "",
          travelFrequency: "",
          dreamContinent: "",
          budgetRange: ""
        };

        this.page = 1;

        await this.loadResponses();
        await nextTick();
        await this.loadResults();
      } catch (error) {
        console.error("Submit failed:", error);
        this.message = "Submission failed.";
        this.messageClass = "text-danger";
      } finally {
        this.loading = false;
      }
    },

    async loadResults() {
      try {
        const { data } = await axios.get("/api/results");

        if (!data.success) {
          throw new Error(data.message || "Failed to load results.");
        }

        await nextTick();

        this.renderPie(data.pie || []);
        this.renderBar(data.bar || []);
        this.renderBudget(data.budget || []);
        this.renderMap(data.map || []);
      } catch (error) {
        console.error("Load results failed:", error);
      }
    },

    async loadResponses() {
      try {
        const { data } = await axios.get("/api/responses", {
          params: {
            q: this.searchQuery,
            page: this.page,
            perPage: this.perPage
          }
        });

        if (!data.success) {
          throw new Error(data.message || "Failed to load responses.");
        }

        this.responses = Array.isArray(data.rows) ? data.rows : [];
        this.total = data.total || 0;
        this.page = data.page || 1;
      } catch (error) {
        console.error("Load responses failed:", error);
        this.responses = [];
        this.total = 0;
      }
    },

    handleSearchInput() {
      this.page = 1;
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.loadResponses();
      }, 300);
    },

    destroyChart(instance) {
      if (instance && typeof instance.destroy === "function") {
        instance.destroy();
      }
    },

    renderPie(rows) {
      const el = document.querySelector("#pieChart");
      if (!el) return;

      this.destroyChart(this.pieChart);

      const series = rows.map((r) => r.value);
      const labels = rows.map((r) => r.category);

      this.pieChart = new ApexCharts(el, {
        chart: {
          type: "pie",
          height: 320
        },
        series,
        labels,
        legend: {
          position: "bottom"
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} responses`
          }
        },
        noData: {
          text: "No data yet"
        }
      });

      this.pieChart.render();
    },

    renderBar(rows) {
      const el = document.querySelector("#barChart");
      if (!el) return;

      this.destroyChart(this.barChart);

      const shortLabel = (full) => {
        if (full === "Rarely") return "Rarely";
        if (full === "Once a year") return "Once";
        if (full === "2–3 times per year" || full === "2-3 times per year") return "2-3";
        if (full === "More than 3 times per year") return "3+";
        return full;
      };

      const categories = rows.map((r) => shortLabel(r.category));
      const values = rows.map((r) => r.value);
      const fullLabels = rows.map((r) => r.category);

      this.barChart = new ApexCharts(el, {
        chart: {
          type: "bar",
          height: 320,
          toolbar: {
            show: false
          }
        },
        series: [
          {
            name: "Responses",
            data: values
          }
        ],
        xaxis: {
          categories
        },
        plotOptions: {
          bar: {
            borderRadius: 8
          }
        },
        dataLabels: {
          enabled: false
        },
        tooltip: {
          custom: ({ dataPointIndex }) => {
            return `
              <div style="padding:8px 10px;">
                <strong>${fullLabels[dataPointIndex]}</strong><br/>
                ${values[dataPointIndex]} responses
              </div>
            `;
          }
        },
        noData: {
          text: "No data yet"
        }
      });

      this.barChart.render();
    },

    renderBudget(rows) {
      const el = document.querySelector("#budgetChart");
      if (!el) return;

      this.destroyChart(this.budgetChart);

      const categories = rows.map((r) => r.category);
      const values = rows.map((r) => r.value);

      this.budgetChart = new ApexCharts(el, {
        chart: {
          type: "line",
          height: 320,
          toolbar: {
            show: false
          }
        },
        series: [
          {
            name: "Responses",
            data: values
          }
        ],
        stroke: {
          curve: "smooth",
          width: 3
        },
        markers: {
          size: 5
        },
        xaxis: {
          categories
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} responses`
          }
        },
        noData: {
          text: "No data yet"
        }
      });

      this.budgetChart.render();
    },

    renderMap(rows) {
      const container = document.getElementById("mapChart");
      if (!container) return;

      const continentCount = {};
      rows.forEach((r) => {
        continentCount[r.category] = r.value;
      });

      const baseHex = {
        Europe: 0x2e86de,
        Asia: 0xe67e22,
        "North America": 0x27ae60,
        "South America": 0x16a085,
        Africa: 0xf1c40f,
        Oceania: 0x8e44ad
      };

      if (am5.registry && Array.isArray(am5.registry.rootElements)) {
        am5.registry.rootElements.forEach((root) => {
          if (root && root.dom && root.dom.id === "mapChart") {
            root.dispose();
          }
        });
      }

      this.mapRoot = null;
      container.innerHTML = "";

      const root = am5.Root.new("mapChart");
      this.mapRoot = root;

      root.setThemes([am5themes_Animated.new(root)]);
      if (root._logo) root._logo.dispose();

      const chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoMercator(),
          panX: "translateX",
          panY: "translateY",
          wheelX: "zoomX",
          wheelY: "zoomY"
        })
      );

      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"]
        })
      );

      polygonSeries.mapPolygons.template.setAll({
        interactive: true,
        fill: am5.color(0xeceff3),
        stroke: am5.color(0xffffff),
        strokeWidth: 0.8,
        tooltipText: "{name}"
      });

      function continentOf(id) {
        const code = (id || "").toUpperCase().trim();
        if (!code) return "";
        return window.ISO2_TO_CONTINENT?.[code] || "";
      }

      polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
        if (!target.dataItem) return fill;

        const id = target.dataItem.get("id") || "";
        const continent = continentOf(id);

        if (!continent) return fill;
        return am5.color(baseHex[continent] || 0xcccccc);
      });

      polygonSeries.mapPolygons.template.adapters.add("tooltipText", (txt, target) => {
        if (!target.dataItem) return "{name}";

        const id = target.dataItem.get("id") || "";
        const continent = continentOf(id);

        if (!continent) return "{name}";

        const value = continentCount[continent] || 0;
        return `{name}\n${continent}: ${value} responses`;
      });

      chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
    }
  },

  async mounted() {
    await nextTick();
    await this.loadResults();
    await this.loadResponses();
  },

  beforeUnmount() {
    this.destroyChart(this.pieChart);
    this.destroyChart(this.barChart);
    this.destroyChart(this.budgetChart);

    if (this.mapRoot) {
      this.mapRoot.dispose();
      this.mapRoot = null;
    }

    clearTimeout(this.searchTimer);
  }
});

app.mount("#app");