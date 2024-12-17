import React, { useState, useEffect } from "react";

import * as Dialog from "@radix-ui/react-dialog";
import { Calendar, X, Settings, Save } from "lucide-react";

import "@radix-ui/themes/styles.css";
import "./index.css";

const DEFAULT_HOLIDAYS = [
  "2024-01-01", // Año Nuevo
  "2024-04-18", // Jueves Santo
  "2024-04-19", // Viernes Santo
  "2024-05-01", // Día del Trabajo
  "2024-06-29", // San Pedro y San Pablo
  "2024-07-28", // Fiestas Patrias
  "2024-07-29", // Fiestas Patrias
  "2024-08-30", // Santa Rosa de Lima
  "2024-10-08", // Combate de Angamos
  "2024-11-01", // Todos los Santos
  "2024-12-08", // Inmaculada Concepción
  "2024-12-25", // Navidad
];

type Calculation = {
  id: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  workingDays: Date[];
  includeStartDay: boolean;
};

const DayCalculator = () => {
  // Estados principales
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [holidays, setHolidays] = useState<string[]>(DEFAULT_HOLIDAYS);
  const [calculations, setCalculations] = useState<Array<Calculation>>([]);
  const [newHoliday, setNewHoliday] = useState<string>("");
  const [selectedCalculation, setSelectedCalculation] =
    useState<Calculation | null>(null);

  // Estados de diálogos
  const [showDetailDialog, setShowDetailDialog] = useState<boolean>(false);
  const [showConfigDialog, setShowConfigDialog] = useState<boolean>(false);

  // Preferencias de usuario
  const [includeStartDay, setIncludeStartDay] = useState<boolean>(false);
  const [useLocalStorage, setUseLocalStorage] = useState<boolean>(false);
  // Cargar datos desde localStorage solo si está activado
  useEffect(() => {
    if (useLocalStorage) {
      try {
        const loadedHolidays = JSON.parse(localStorage.getItem("holidays")!);
        const loadedCalculations = JSON.parse(
          localStorage.getItem("calculations")!,
        );
        const loadedPreferences = JSON.parse(
          localStorage.getItem("preferences")!,
        );

        if (loadedHolidays) setHolidays(loadedHolidays);
        if (loadedCalculations) setCalculations(loadedCalculations);
        if (loadedPreferences) {
          setIncludeStartDay(loadedPreferences.includeStartDay);
          setUseLocalStorage(true);
        }
      } catch (error) {
        console.warn("Error loading from localStorage:", error);
      }
    }
  }, [useLocalStorage]);

  // Guardar datos en localStorage solo si está activado
  useEffect(() => {
    if (useLocalStorage) {
      try {
        localStorage.setItem("holidays", JSON.stringify(holidays));
        localStorage.setItem("calculations", JSON.stringify(calculations));
        localStorage.setItem(
          "preferences",
          JSON.stringify({
            includeStartDay,
            useLocalStorage,
          }),
        );
      } catch (error) {
        console.warn("Error saving to localStorage:", error);
      }
    }
  }, [holidays, calculations, includeStartDay, useLocalStorage]);

  const handleStorageToggle = (checked: boolean) => {
    setUseLocalStorage(checked);
    if (!checked) {
      setHolidays(DEFAULT_HOLIDAYS);
      setCalculations([]);
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isHoliday = (date: Date) => {
    const dateString = date.toISOString().split("T")[0];
    return holidays.includes(dateString);
  };

  // const addDays = (date: Date, days: number) => {
  //   const result = new Date(date);
  //   result.setDate(result.getDate() + days);
  //   return result;
  // };

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
    const current = new Date(start);

    // Si no se incluye el día inicial, comenzar desde el siguiente día
    if (!includeStartDay) {
      current.setDate(current.getDate() + 1);
    }

    while (current <= end) {
      if (!isWeekend(current) && !isHoliday(current)) {
        workingDaysArray.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }

    const newCalculation = {
      id: Date.now(),
      startDate,
      endDate,
      totalDays: workingDaysArray.length,
      workingDays: workingDaysArray,
      includeStartDay,
    };

    setCalculations([newCalculation, ...calculations]);
    setStartDate("");
    setEndDate("");
  };

  const addHoliday = () => {
    if (newHoliday && !holidays.includes(newHoliday)) {
      setHolidays([...holidays, newHoliday]);
      setNewHoliday("");
    }
  };

  const removeHoliday = (holiday: string) => {
    setHolidays(holidays.filter((h) => h !== holiday));
  };

  const removeCalculation = (id: number) => {
    setCalculations(calculations.filter((calc) => calc.id !== id));
  };

  const showDetail = (calculation: Calculation) => {
    setSelectedCalculation(calculation);
    setShowDetailDialog(true);
  };

  return (
    <div className="w-full max-w-4xl space-y-8">
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
                  <div className="space-x-2">
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
                      <X className="icon" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dialog.Root open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 grid place-items-center overflow-y-auto bg-black bg-opacity-50">
            <Dialog.Content className="min-w-[300px] rounded-md bg-white p-8">
              <Dialog.Title>Detalle de Días Hábiles</Dialog.Title>
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
                    <p className="text-sm text-gray-500">
                      Incluyendo día inicial
                    </p>
                  )}
                  <div className="space-y-2">
                    {selectedCalculation.workingDays.map((date, index) => (
                      <div key={index} className="Card">
                        {date.toLocaleDateString("es-PE", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Dialog.Close asChild>
                <button className="button-outline button-sm">Cerrar</button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 grid place-items-center overflow-y-auto bg-black bg-opacity-50">
            <Dialog.Content className="max-h-[80vh] min-w-[300px] overflow-auto rounded-md bg-white px-8 pb-8">
              <div className="sticky top-0 flex items-center justify-between bg-white pb-2 pt-8">
                <h2 className="fond-medium text-lg">Configuración</h2>
                <Dialog.Close className="button-outline button-sm">
                  <X className="icon" />
                  Cerrar
                </Dialog.Close>
              </div>
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
              </div>
              <div>
                <h3 className="mt-2 font-medium">Feriados</h3>
                <div className="">
                  <div className="bg-white py-2">
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={newHoliday}
                        onChange={(e) => setNewHoliday(e.target.value)}
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
                        key={holiday}
                        className="flex items-center justify-between rounded bg-gray-50 p-2"
                      >
                        <span>
                          {new Date(holiday + "T00:00:00").toLocaleDateString(
                            "es-PE",
                          )}
                        </span>
                        <button
                          className="button-destructive button-sm"
                          onClick={() => removeHoliday(holiday)}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default DayCalculator;
