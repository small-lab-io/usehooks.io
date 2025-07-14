"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// Extend Navigator interface for Web Bluetooth API
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: BluetoothRequestDeviceOptions): Promise<{
        id: string;
        name: string | undefined;
        gatt?: {
          connect(): Promise<any>;
          connected: boolean;
        };
        addEventListener(
          type: string,
          listener: EventListener,
          options?: boolean | AddEventListenerOptions
        ): void;
      }>;
      getAvailability(): Promise<boolean>;
    };
  }
}

interface BluetoothRequestDeviceOptions {
  filters?: BluetoothLEScanFilter[];
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

interface BluetoothLEScanFilter {
  services?: BluetoothServiceUUID[];
  name?: string;
  namePrefix?: string;
  manufacturerData?: BluetoothManufacturerDataFilter[];
}

interface BluetoothManufacturerDataFilter {
  companyIdentifier: number;
  dataPrefix?: BufferSource;
  mask?: BufferSource;
}

type BluetoothServiceUUID = number | string;

interface BluetoothDeviceInfo {
  id: string;
  name: string | undefined;
  connected: boolean;
}

interface UseBluetoothOptions {
  filters?: BluetoothLEScanFilter[];
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

interface UseBluetoothReturn {
  device: BluetoothDeviceInfo | null;
  isSupported: boolean;
  isAvailable: boolean | null;
  isConnecting: boolean;
  error: string | null;
  requestDevice: (
    options?: BluetoothRequestDeviceOptions
  ) => Promise<BluetoothDeviceInfo | null>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  readCharacteristic: (
    serviceUuid: BluetoothServiceUUID,
    characteristicUuid: BluetoothServiceUUID
  ) => Promise<DataView | null>;
  writeCharacteristic: (
    serviceUuid: BluetoothServiceUUID,
    characteristicUuid: BluetoothServiceUUID,
    value: BufferSource
  ) => Promise<boolean>;
  startNotifications: (
    serviceUuid: BluetoothServiceUUID,
    characteristicUuid: BluetoothServiceUUID,
    callback: (value: DataView) => void
  ) => Promise<boolean>;
  stopNotifications: (
    serviceUuid: BluetoothServiceUUID,
    characteristicUuid: BluetoothServiceUUID
  ) => Promise<boolean>;
}

export const useBluetooth = (
  options: UseBluetoothOptions = {}
): UseBluetoothReturn => {
  const [device, setDevice] = useState<BluetoothDeviceInfo | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deviceRef = useRef<{
    id: string;
    name: string | undefined;
    gatt?: {
      connect(): Promise<any>;
      connected: boolean;
    };
    addEventListener(
      type: string,
      listener: EventListener,
      options?: boolean | AddEventListenerOptions
    ): void;
  } | null>(null);
  const serverRef = useRef<any | null>(null);
  const characteristicsRef = useRef<Map<string, any>>(new Map());

  // Check if Web Bluetooth API is supported
  const isSupported =
    typeof navigator !== "undefined" && "bluetooth" in navigator;

  // Check Bluetooth availability
  useEffect(() => {
    if (isSupported && navigator.bluetooth?.getAvailability) {
      navigator.bluetooth
        .getAvailability()
        .then(setIsAvailable)
        .catch(() => setIsAvailable(false));
    } else {
      setIsAvailable(false);
    }
  }, [isSupported]);

  // Request Bluetooth device
  const requestDevice = useCallback(
    async (
      requestOptions?: BluetoothRequestDeviceOptions
    ): Promise<BluetoothDeviceInfo | null> => {
      if (!isSupported || !navigator.bluetooth) {
        setError("Web Bluetooth API is not supported");
        return null;
      }

      try {
        setError(null);
        const deviceOptions = requestOptions || {
          filters: options.filters,
          optionalServices: options.optionalServices,
          acceptAllDevices: options.acceptAllDevices,
        };

        // Ensure we have either filters or acceptAllDevices
        if (!deviceOptions.filters && !deviceOptions.acceptAllDevices) {
          deviceOptions.acceptAllDevices = true;
        }

        const bluetoothDevice =
          await navigator.bluetooth.requestDevice(deviceOptions);

        deviceRef.current = bluetoothDevice;
        const deviceInfo: BluetoothDeviceInfo = {
          id: bluetoothDevice.id,
          name: bluetoothDevice.name,
          connected: bluetoothDevice.gatt?.connected || false,
        };

        setDevice(deviceInfo);

        // Listen for disconnection
        bluetoothDevice.addEventListener("gattserverdisconnected", () => {
          setDevice((prev) => (prev ? { ...prev, connected: false } : null));
          serverRef.current = null;
          characteristicsRef.current.clear();
        });

        return deviceInfo;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to request device";
        setError(errorMessage);
        return null;
      }
    },
    [isSupported, options]
  );

  // Connect to device
  const connect = useCallback(async (): Promise<boolean> => {
    if (!deviceRef.current) {
      setError("No device selected");
      return false;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const server = await deviceRef.current.gatt?.connect();
      if (server) {
        serverRef.current = server;
        setDevice((prev) => (prev ? { ...prev, connected: true } : null));
        return true;
      }

      setError("Failed to connect to GATT server");
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect";
      setError(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect from device
  const disconnect = useCallback(async (): Promise<void> => {
    if (serverRef.current && serverRef.current.connected) {
      serverRef.current.disconnect();
    }
    serverRef.current = null;
    characteristicsRef.current.clear();
    setDevice((prev) => (prev ? { ...prev, connected: false } : null));
  }, []);

  // Get characteristic helper
  const getCharacteristic = useCallback(
    async (
      serviceUuid: BluetoothServiceUUID,
      characteristicUuid: BluetoothServiceUUID
    ): Promise<any | null> => {
      if (!serverRef.current) {
        setError("Not connected to device");
        return null;
      }

      const key = `${serviceUuid}-${characteristicUuid}`;

      if (characteristicsRef.current.has(key)) {
        return characteristicsRef.current.get(key)!;
      }

      try {
        const service = await serverRef.current.getPrimaryService(serviceUuid);
        const characteristic =
          await service.getCharacteristic(characteristicUuid);
        characteristicsRef.current.set(key, characteristic);
        return characteristic;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to get characteristic";
        setError(errorMessage);
        return null;
      }
    },
    []
  );

  // Read characteristic value
  const readCharacteristic = useCallback(
    async (
      serviceUuid: BluetoothServiceUUID,
      characteristicUuid: BluetoothServiceUUID
    ): Promise<DataView | null> => {
      const characteristic = await getCharacteristic(
        serviceUuid,
        characteristicUuid
      );
      if (!characteristic) return null;

      try {
        setError(null);
        const value = await characteristic.readValue();
        return value;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to read characteristic";
        setError(errorMessage);
        return null;
      }
    },
    [getCharacteristic]
  );

  // Write characteristic value
  const writeCharacteristic = useCallback(
    async (
      serviceUuid: BluetoothServiceUUID,
      characteristicUuid: BluetoothServiceUUID,
      value: BufferSource
    ): Promise<boolean> => {
      const characteristic = await getCharacteristic(
        serviceUuid,
        characteristicUuid
      );
      if (!characteristic) return false;

      try {
        setError(null);
        await characteristic.writeValue(value);
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to write characteristic";
        setError(errorMessage);
        return false;
      }
    },
    [getCharacteristic]
  );

  // Start notifications
  const startNotifications = useCallback(
    async (
      serviceUuid: BluetoothServiceUUID,
      characteristicUuid: BluetoothServiceUUID,
      callback: (value: DataView) => void
    ): Promise<boolean> => {
      const characteristic = await getCharacteristic(
        serviceUuid,
        characteristicUuid
      );
      if (!characteristic) return false;

      try {
        setError(null);
        await characteristic.startNotifications();

        const handleNotification = (event: Event) => {
          const target = event.target as { value?: DataView };
          if (target.value) {
            callback(target.value);
          }
        };

        characteristic.addEventListener(
          "characteristicvaluechanged",
          handleNotification
        );
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to start notifications";
        setError(errorMessage);
        return false;
      }
    },
    [getCharacteristic]
  );

  // Stop notifications
  const stopNotifications = useCallback(
    async (
      serviceUuid: BluetoothServiceUUID,
      characteristicUuid: BluetoothServiceUUID
    ): Promise<boolean> => {
      const characteristic = await getCharacteristic(
        serviceUuid,
        characteristicUuid
      );
      if (!characteristic) return false;

      try {
        setError(null);
        await characteristic.stopNotifications();
        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to stop notifications";
        setError(errorMessage);
        return false;
      }
    },
    [getCharacteristic]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (serverRef.current && serverRef.current.connected) {
        serverRef.current.disconnect();
      }
    };
  }, []);

  return {
    device,
    isSupported,
    isAvailable,
    isConnecting,
    error,
    requestDevice,
    connect,
    disconnect,
    readCharacteristic,
    writeCharacteristic,
    startNotifications,
    stopNotifications,
  };
};
