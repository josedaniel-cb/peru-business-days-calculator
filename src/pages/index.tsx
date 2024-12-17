import React, { useState, useEffect } from "react";

import * as Checkbox from "@radix-ui/react-checkbox";
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
          localStorage.getItem("calculations")!
        );
        const loadedPreferences = JSON.parse(
          localStorage.getItem("preferences")!
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
          })
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
    <div className="space-y-8 w-full max-w-4xl">
      {/* <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              Calculadora de Días Hábiles en Perú
            </CardTitle>
            <Button variant="outline" onClick={() => setShowConfigDialog(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Fecha Inicial:
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Fecha Final:
                </label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeStartDay"
                checked={includeStartDay}
                onCheckedChange={setIncludeStartDay}
              />
              <label
                htmlFor="includeStartDay"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Incluir el día inicial en el cálculo
              </label>
            </div>

            <Button onClick={calculateWorkingDays} className="w-full">
              Calcular Días Hábiles
            </Button>
          </div>
        </CardContent>
      </Card> */}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label">Fecha Inicial:</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input"
                  />
                  <Calendar className="icon" />
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
                  <Calendar className="icon" />
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

      {/* <Card>
        <CardHeader>
          <CardTitle>Cálculos Realizados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">
                      Del:{" "}
                      {new Date(
                        calc.startDate + "T00:00:00"
                      ).toLocaleDateString("es-PE")}
                    </p>
                    <p className="font-medium">
                      Al:{" "}
                      {new Date(calc.endDate + "T00:00:00").toLocaleDateString(
                        "es-PE"
                      )}
                    </p>
                    <p className="text-lg font-bold mt-1">
                      Días hábiles: {calc.totalDays}
                    </p>
                    {calc.includeStartDay && (
                      <p className="text-sm text-gray-500">
                        Incluyendo día inicial
                      </p>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => showDetail(calc)}
                    >
                      Ver Detalle
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeCalculation(calc.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Cálculos Realizados</h2>
        </div>
        <div className="card-content">
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">
                      Del:{" "}
                      {new Date(
                        calc.startDate + "T00:00:00"
                      ).toLocaleDateString("es-PE")}
                    </p>
                    <p className="font-medium">
                      Al:{" "}
                      {new Date(calc.endDate + "T00:00:00").toLocaleDateString(
                        "es-PE"
                      )}
                    </p>
                    <p className="text-lg font-bold mt-1">
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

      {/* <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalle de Días Hábiles</DialogTitle>
          </DialogHeader>
          {selectedCalculation && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>
                  Del:{" "}
                  {new Date(
                    selectedCalculation.startDate + "T00:00:00"
                  ).toLocaleDateString("es-PE")}
                </span>
                <span>
                  Al:{" "}
                  {new Date(
                    selectedCalculation.endDate + "T00:00:00"
                  ).toLocaleDateString("es-PE")}
                </span>
              </div>
              {selectedCalculation.includeStartDay && (
                <p className="text-sm text-gray-500">Incluyendo día inicial</p>
              )}
              <div className="space-y-2">
                {selectedCalculation.workingDays.map((date, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
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
        </DialogContent>
      </Dialog> */}
      <Dialog.Root open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 grid place-items-center overflow-y-auto">
            <Dialog.Content className="min-w-[300px] bg-white p-8 rounded-md">
              <Dialog.Title>Detalle de Días Hábiles</Dialog.Title>
              {selectedCalculation && (
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>
                      Del:{" "}
                      {new Date(
                        selectedCalculation.startDate + "T00:00:00"
                      ).toLocaleDateString("es-PE")}
                    </span>
                    <span>
                      Al:{" "}
                      {new Date(
                        selectedCalculation.endDate + "T00:00:00"
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

      {/* <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
            <DialogTitle>Configuración</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useLocalStorage"
                  checked={useLocalStorage}
                  onCheckedChange={handleStorageToggle}
                />
                <label
                  htmlFor="useLocalStorage"
                  className="text-sm font-medium leading-none flex items-center gap-1"
                >
                  <Save className="w-4 h-4" />
                  Guardar preferencias
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Gestionar Feriados</h3>
              <div className="space-y-4">
                <div className="sticky top-16 bg-white py-2 z-10">
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={newHoliday}
                      onChange={(e) => setNewHoliday(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button onClick={addHoliday}>Agregar</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {holidays.sort().map((holiday) => (
                    <div
                      key={holiday}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span>
                        {new Date(holiday + "T00:00:00").toLocaleDateString(
                          "es-PE"
                        )}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeHoliday(holiday)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
      <Dialog.Root open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 grid place-items-center overflow-y-auto">
            <Dialog.Content className="min-w-[300px] bg-white p-8 rounded-md">
              <Dialog.Title>Configuración</Dialog.Title>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center space-x-2">
                    {/* <Checkbox
                      id="useLocalStorage"
                      checked={useLocalStorage}
                      onCheckedChange={handleStorageToggle}
                    /> */}
                    <input
                      type="checkbox"
                      id="useLocalStorage"
                      checked={useLocalStorage}
                      onChange={(e) => handleStorageToggle(e.target.checked)}
                      className="form-checkbox"
                    />
                    <label
                      htmlFor="useLocalStorage"
                      className="text-sm font-medium leading-none flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" />
                      Guardar preferencias
                    </label>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Gestionar Feriados</h3>
                  <div className="space-y-4">
                    <div className="sticky top-16 bg-white py-2 z-10">
                      <div className="flex gap-2">
                        <input
                          type="date"
                          value={newHoliday}
                          onChange={(e) => setNewHoliday(e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-md"
                        />
                        <button className="button-primary" onClick={addHoliday}>
                          Agregar
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {holidays.sort().map((holiday) => (
                        <div
                          key={holiday}
                          className="flex justify-between items-center p-2 bg-gray-50 rounded"
                        >
                          <span>
                            {new Date(holiday + "T00:00:00").toLocaleDateString(
                              "es-PE"
                            )}
                          </span>
                          <button
                            className="button-destructive button-sm"
                            onClick={() => removeHoliday(holiday)}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
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
