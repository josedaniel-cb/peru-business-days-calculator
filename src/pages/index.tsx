import React, { useState, useEffect } from "react";

import { X, Settings, Save } from "lucide-react";
import DialogWrapper from "../components/DialogWrapper";

type Holiday = { date: string; name: string };

const DEFAULT_HOLIDAYS: Holiday[] = [
  // 2020
  { date: "2020-01-01", name: "Año Nuevo" },
  { date: "2020-04-09", name: "Jueves Santo" },
  { date: "2020-04-10", name: "Viernes Santo" },
  { date: "2020-05-01", name: "Día del Trabajador" },
  { date: "2020-06-24", name: "Día no laborable decretado por el Gobierno" },
  { date: "2020-06-29", name: "Día de San Pedro y San Pablo" },
  { date: "2020-07-28", name: "Fiestas Patrias" },
  { date: "2020-10-08", name: "Día del Combate de Angamos" },
  { date: "2020-10-09", name: "Día no laborable decretado por el Gobierno" },
  { date: "2020-12-08", name: "Día de la Inmaculada Concepción" },
  { date: "2020-12-25", name: "Navidad" },
  { date: "2020-12-31", name: "Día no laborable decretado por el Gobierno" },

  // 2021
  { date: "2021-01-01", name: "Año Nuevo" },
  { date: "2021-04-01", name: "Jueves Santo" },
  { date: "2021-04-02", name: "Viernes Santo" },
  { date: "2021-05-01", name: "Día del Trabajo" },
  { date: "2021-06-29", name: "Día de San Pedro y San Pablo" },
  { date: "2021-07-28", name: "Fiestas Patrias" },
  { date: "2021-07-29", name: "Fiestas Patrias" },
  { date: "2021-08-30", name: "Santa Rosa de Lima" },
  { date: "2021-10-08", name: "Combate de Angamos" },
  { date: "2021-10-11", name: "Día no laborable (sector público)" },
  { date: "2021-11-01", name: "Día de Todos los Santos" },
  { date: "2021-11-02", name: "Día no laborable (sector público)" },
  { date: "2021-12-08", name: "Día de la Inmaculada Concepción" },
  { date: "2021-12-24", name: "Día no laborable (sector público)" },
  { date: "2021-12-25", name: "Navidad" },
  { date: "2021-12-27", name: "Día no laborable (sector público)" },
  { date: "2021-12-31", name: "Vísperas de Año Nuevo" },

  // 2022
  { date: "2022-01-01", name: "Año Nuevo" },
  { date: "2022-01-03", name: "Día no laborable (sector público)" },
  { date: "2022-04-14", name: "Jueves Santo" },
  { date: "2022-04-15", name: "Viernes Santo" },
  { date: "2022-05-01", name: "Día del Trabajo" },
  { date: "2022-05-02", name: "Día no laborable (sector público)" },
  { date: "2022-06-13", name: "Día no laborable (sector público)" },
  { date: "2022-06-24", name: "Día no laborable (sector público)" },
  { date: "2022-06-29", name: "Día de San Pedro y San Pablo" },
  { date: "2022-07-28", name: "Fiestas Patrias" },
  { date: "2022-07-29", name: "Fiestas Patrias" },
  { date: "2022-08-06", name: "Batalla de Junín" },
  { date: "2022-08-30", name: "Santa Rosa de Lima" },
  { date: "2022-08-29", name: "Día no laborable (sector público)" },
  { date: "2022-10-07", name: "Día no laborable (sector público)" },
  { date: "2022-10-08", name: "Combate de Angamos" },
  { date: "2022-10-31", name: "Día no laborable (sector público)" },
  { date: "2022-11-01", name: "Día de Todos los Santos" },
  { date: "2022-12-08", name: "Día de la Inmaculada Concepción" },
  { date: "2022-12-09", name: "Batalla de Ayacucho" },
  { date: "2022-12-26", name: "Día no laborable (sector público)" },
  { date: "2022-12-30", name: "Día no laborable (sector público)" },
  { date: "2022-12-25", name: "Navidad" },

  //  2023
  { date: "2023-01-01", name: "Año Nuevo" },
  { date: "2023-01-02", name: "Día no laborable (sector público)" },
  { date: "2023-04-06", name: "Jueves Santo" },
  { date: "2023-04-07", name: "Viernes Santo" },
  { date: "2023-04-28", name: "Día no laborable (sector público)" },
  { date: "2023-05-01", name: "Día del Trabajo" },
  { date: "2023-06-29", name: "Día de San Pedro y San Pablo" },
  { date: "2023-06-30", name: "Día no laborable (sector público)" },
  { date: "2023-07-23", name: "Día de la Fuerza Aérea del Perú" },
  { date: "2023-07-27", name: "Día no laborable (sector público)" },
  { date: "2023-07-28", name: "Fiestas Patrias" },
  { date: "2023-07-29", name: "Fiestas Patrias" },
  { date: "2023-08-06", name: "Batalla de Junín" },
  { date: "2023-08-30", name: "Santa Rosa de Lima" },
  { date: "2023-10-08", name: "Combate de Angamos" },
  { date: "2023-10-09", name: "Día no laborable (sector público)" },
  { date: "2023-11-01", name: "Día de Todos los Santos" },
  { date: "2023-12-07", name: "Día no laborable (sector público)" },
  { date: "2023-12-08", name: "Día de la Inmaculada Concepción" },
  { date: "2023-12-09", name: "Batalla de Ayacucho" },
  { date: "2023-12-25", name: "Navidad" },
  { date: "2023-12-26", name: "Día no laborable (sector público)" },

  //  2024
  { date: "2024-01-01", name: "Año Nuevo" },
  { date: "2024-01-02", name: "Día no laborable para el sector público" },
  { date: "2024-03-28", name: "Jueves Santo" },
  { date: "2024-03-29", name: "Viernes Santo" },
  { date: "2024-05-01", name: "Día del Trabajo" },
  { date: "2024-06-07", name: "Batalla de Arica y Día de la Bandera" },
  { date: "2024-06-29", name: "Día de San Pedro y San Pablo" },
  { date: "2024-07-23", name: "Día de la Fuerza Aérea del Perú" },
  { date: "2024-07-26", name: "Día no laborable para el sector público" },
  { date: "2024-07-28", name: "Día de la Independencia" },
  { date: "2024-07-29", name: "Fiestas Patrias" },
  { date: "2024-08-06", name: "Batalla de Junín" },
  { date: "2024-08-30", name: "Santa Rosa de Lima" },
  { date: "2024-10-07", name: "Día no laborable para el sector público" },
  { date: "2024-10-08", name: "Combate de Angamos" },
  {
    date: "2024-11-14",
    name: "Día no laborable para el sector público y privado en Lima Metropolitana y Callao",
  },
  {
    date: "2024-11-15",
    name: "Día no laborable para el sector público y privado en Lima Metropolitana y Callao",
  },
  {
    date: "2024-11-16",
    name: "Día no laborable para el sector público y privado en Lima Metropolitana y Callao",
  },
  { date: "2024-12-06", name: "Día no laborable para el sector público" },
  { date: "2024-12-08", name: "Inmaculada Concepción" },
  { date: "2024-12-09", name: "Batalla de Ayacucho" },
  { date: "2024-12-23", name: "Día no laborable para el sector público" },
  { date: "2024-12-24", name: "Día no laborable para el sector público" },
  { date: "2024-12-25", name: "Navidad" },
  { date: "2024-12-30", name: "Día no laborable para el sector público" },
  { date: "2024-12-31", name: "Día no laborable para el sector público" },
];

type Calculation = {
  id: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  workingDays: Date[];
  holidays: Holiday[];
  includeStartDay: boolean;
};

const DayCalculator = () => {
  // Estados principales
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [holidays, setHolidays] = useState<Holiday[]>(DEFAULT_HOLIDAYS);
  const [calculations, setCalculations] = useState<Array<Calculation>>([]);
  const [newHoliday, setNewHoliday] = useState<Holiday>({
    date: "",
    name: "",
  });
  const [selectedCalculation, setSelectedCalculation] =
    useState<Calculation | null>(null);

  // Estados de diálogos
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
  const [showConfigDialog, setShowConfigDialog] = useState<boolean>(false);

  // Preferencias de usuario
  const [includeStartDay, setIncludeStartDay] = useState<boolean>(false);
  const [useLocalStorage, setUseLocalStorage] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedPreferences = localStorage.getItem("preferences");
      return savedPreferences
        ? JSON.parse(savedPreferences).useLocalStorage
        : false;
    }
    return false;
  });

  // Cargar datos desde localStorage solo si está activado
  useEffect(() => {
    if (typeof window !== "undefined" && useLocalStorage) {
      try {
        const loadedHolidays = JSON.parse(
          localStorage.getItem("holidays") || "[]",
        );
        const loadedCalculations = JSON.parse(
          localStorage.getItem("calculations") || "[]",
        );
        const loadedPreferences = JSON.parse(
          localStorage.getItem("preferences") || "{}",
        );

        setHolidays(
          Array.isArray(loadedHolidays) ? loadedHolidays : DEFAULT_HOLIDAYS,
        );
        setCalculations(
          Array.isArray(loadedCalculations) ? loadedCalculations : [],
        );
        if (loadedPreferences) {
          setIncludeStartDay(loadedPreferences.includeStartDay || false);
        }
      } catch (error) {
        console.warn("Error loading from localStorage:", error);
      }
    }
  }, [useLocalStorage]);

  // Guardar datos en localStorage solo si está activado
  useEffect(() => {
    if (typeof window !== "undefined" && useLocalStorage) {
      try {
        localStorage.setItem("holidays", JSON.stringify(holidays));
        localStorage.setItem("calculations", JSON.stringify(calculations));
        localStorage.setItem(
          "preferences",
          JSON.stringify({ includeStartDay, useLocalStorage }),
        );
      } catch (error) {
        console.warn("Error saving to localStorage:", error);
      }
    }
  }, [useLocalStorage, holidays, calculations, includeStartDay]);

  const handleStorageToggle = (checked: boolean) => {
    setUseLocalStorage(checked);
    if (!checked) {
      localStorage.removeItem("holidays");
      localStorage.removeItem("calculations");
      localStorage.removeItem("preferences");
      setHolidays(DEFAULT_HOLIDAYS);
      setCalculations([]);
      setIncludeStartDay(false);
    }
  };

  const resetSettingsAndStorage = () => {
    localStorage.removeItem("holidays");
    localStorage.removeItem("calculations");
    localStorage.removeItem("preferences");
    setHolidays(DEFAULT_HOLIDAYS);
    setCalculations([]);
    setIncludeStartDay(false);
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isHoliday = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return holidays.map((v) => v.date).includes(dateString);
  };

  const calculateWorkingDays = () => {
    if (!startDate || !endDate) {
      alert("Por favor seleccione ambas fechas");
      return;
    }

    // Crear fechas usando la zona horaria local
    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (start > end) {
      alert("La fecha inicial debe ser anterior a la fecha final");
      return;
    }

    const workingDaysArray = [];
    const holidaysArray: Holiday[] = [];
    const current = new Date(start);

    // Si no se incluye el día inicial, comenzar desde el siguiente día
    if (!includeStartDay) {
      current.setDate(current.getDate() + 1);
    }

    while (current <= end) {
      if (!isWeekend(current)) {
        if (isHoliday(current)) {
          holidaysArray.push(
            holidays.find(
              (v) => v.date === current.toISOString().split("T")[0],
            )!,
          );
        } else {
          workingDaysArray.push(new Date(current));
        }
      }
      current.setDate(current.getDate() + 1);
    }

    const newCalculation = {
      id: Date.now(),
      startDate,
      endDate,
      totalDays: workingDaysArray.length,
      workingDays: workingDaysArray,
      holidays: holidaysArray,
      includeStartDay,
    };

    setCalculations([newCalculation, ...calculations]);
    setStartDate("");
    setEndDate("");
  };

  const addHoliday = () => {
    if (
      newHoliday &&
      holidays.findIndex((v) => v.date === newHoliday.date) === -1
    ) {
      setHolidays([...holidays, newHoliday]);
      setNewHoliday({
        date: "",
        name: "",
      });
    }
  };

  const removeHoliday = (holiday: string) => {
    setHolidays(holidays.filter((h) => h.date !== holiday));
  };

  const removeCalculation = (id: number) => {
    setCalculations(calculations.filter((calc) => calc.id !== id));
  };

  const showDetail = (calculation: Calculation) => {
    setSelectedCalculation(calculation);
    setShowDetailDialog(true);
  };

  return (
    <div className="container mx-auto space-y-8 px-16 py-8">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Calculadora de Días Hábiles en Perú</h2>
          <button
            className="button-outline"
            onClick={() => setShowConfigDialog(true)}
          >
            <Settings className="icon" />
            Configurar
          </button>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="label">Fecha Inicial:</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input"
                  />
                  {/* <Calendar className="icon" /> */}
                </div>
              </div>
              <div className="space-y-2">
                <label className="label">Fecha Final:</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input"
                  />
                  {/* <Calendar className="icon" /> */}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeStartDay"
                checked={includeStartDay}
                onChange={(e) => setIncludeStartDay(e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="includeStartDay" className="label">
                Incluir el día inicial en el cálculo
              </label>
            </div>
            <button onClick={calculateWorkingDays} className="button-primary">
              Calcular Días Hábiles
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Cálculos Realizados</h2>
        </div>
        <div className="card-content">
          <div className="max-h-[400px] space-y-4 overflow-y-auto">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      Del:{" "}
                      {new Date(
                        calc.startDate + "T00:00:00",
                      ).toLocaleDateString("es-PE")}
                    </p>
                    <p className="font-medium">
                      Al:{" "}
                      {new Date(calc.endDate + "T00:00:00").toLocaleDateString(
                        "es-PE",
                      )}
                    </p>
                    <p className="mt-1 text-lg font-bold">
                      Días hábiles: {calc.totalDays}
                    </p>
                    {calc.includeStartDay && (
                      <p className="text-sm text-gray-500">
                        Incluyendo día inicial
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="button-outline button-sm"
                      onClick={() => showDetail(calc)}
                    >
                      Ver Detalle
                    </button>
                    <button
                      className="button-destructive button-sm"
                      onClick={() => removeCalculation(calc.id)}
                    >
                      <X className="icon mr-0" />
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <DialogWrapper
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
        title="Detalle de feriados"
      >
        {selectedCalculation && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500">
              <span>
                Del:{" "}
                {new Date(
                  selectedCalculation.startDate + "T00:00:00",
                ).toLocaleDateString("es-PE")}
              </span>
              <span>
                Al:{" "}
                {new Date(
                  selectedCalculation.endDate + "T00:00:00",
                ).toLocaleDateString("es-PE")}
              </span>
            </div>
            {selectedCalculation.includeStartDay && (
              <p className="text-sm text-gray-500">Incluyendo día inicial</p>
            )}
            <div className="space-y-2">
              {selectedCalculation.holidays.map((holiday, index) => (
                <div key={index} className="Card">
                  <div className="font-bold">
                    {new Date(holiday.date + "T00:00:00").toLocaleDateString(
                      "es-PE",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </div>
                  <div>{holiday.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogWrapper>
      <DialogWrapper
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        title="Configuración"
      >
        <div className="mt-4 border-b pb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useLocalStorage"
              checked={useLocalStorage}
              onChange={(e) => handleStorageToggle(e.target.checked)}
              className="form-checkbox"
            />
            <label
              htmlFor="useLocalStorage"
              className="flex items-center gap-1 text-sm font-medium leading-none"
            >
              <Save className="h-4 w-4" />
              Guardar preferencias
            </label>
          </div>
          {/* reset settings button */}
          <button
            className="button-destructive button-sm mt-2"
            onClick={() => resetSettingsAndStorage()}
          >
            Restablecer preferencias
          </button>
        </div>
        <div>
          <h3 className="mt-2 font-medium">Feriados</h3>
          <div className="">
            <div className="bg-white py-2">
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newHoliday?.date}
                  onChange={(e) =>
                    setNewHoliday({
                      date: new Date(e.target.value)
                        .toISOString()
                        .split("T")[0],
                      name: "",
                    })
                  }
                  className="flex-1 rounded-md border px-3 py-2"
                />
                <button className="button-primary" onClick={addHoliday}>
                  Agregar
                </button>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {holidays.sort().map((holiday) => (
                <div
                  key={holiday.date}
                  className="flex items-center justify-between rounded bg-gray-50 p-2"
                >
                  <div>
                    <div className="font-bold">
                      {new Date(holiday.date + "T00:00:00").toLocaleDateString(
                        "es-PE",
                      )}
                    </div>
                    <div>{holiday.name}</div>
                  </div>
                  <button
                    className="button-destructive button-sm"
                    onClick={() => removeHoliday(holiday.date)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogWrapper>
    </div>
  );
};

export default DayCalculator;
